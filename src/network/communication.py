import asyncio
import json
import uuid
import hashlib
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set
import traceback


class MessageType(Enum):
    REQUEST = "request"
    RESPONSE = "response"
    EVENT = "event"
    ERROR = "error"
    HEARTBEAT = "heartbeat"


class ServiceStatus(Enum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


@dataclass
class Message:
    id: str
    type: MessageType
    source: str
    target: str
    payload: Dict[str, Any]
    timestamp: datetime = field(default_factory=datetime.now)
    correlation_id: Optional[str] = None
    headers: Dict[str, str] = field(default_factory=dict)
    retry_count: int = 0

    def to_json(self) -> str:
        return json.dumps({
            "id": self.id,
            "type": self.type.value,
            "source": self.source,
            "target": self.target,
            "payload": self.payload,
            "timestamp": self.timestamp.isoformat(),
            "correlation_id": self.correlation_id,
            "headers": self.headers,
            "retry_count": self.retry_count,
        })

    @classmethod
    def from_json(cls, data: str) -> "Message":
        parsed = json.loads(data)
        return cls(
            id=parsed["id"],
            type=MessageType(parsed["type"]),
            source=parsed["source"],
            target=parsed["target"],
            payload=parsed["payload"],
            timestamp=datetime.fromisoformat(parsed["timestamp"]),
            correlation_id=parsed.get("correlation_id"),
            headers=parsed.get("headers", {}),
            retry_count=parsed.get("retry_count", 0),
        )


@dataclass
class ServiceEndpoint:
    name: str
    host: str
    port: int
    protocol: str = "http"
    tags: Set[str] = field(default_factory=set)
    metadata: Dict[str, Any] = field(default_factory=dict)
    status: ServiceStatus = ServiceStatus.UNKNOWN
    last_heartbeat: Optional[datetime] = None
    failure_count: int = 0

    @property
    def url(self) -> str:
        return f"{self.protocol}://{self.host}:{self.port}"


class IMessageBroker(ABC):
    @abstractmethod
    async def publish(self, channel: str, message: Message) -> bool:
        pass

    @abstractmethod
    async def subscribe(self, channel: str, handler: Callable[[Message], None]) -> str:
        pass

    @abstractmethod
    async def unsubscribe(self, subscription_id: str) -> bool:
        pass

    @abstractmethod
    async def request(self, target: str, payload: Dict[str, Any], timeout: float = 5.0) -> Optional[Message]:
        pass


class InMemoryBroker(IMessageBroker):
    def __init__(self):
        self._channels: Dict[str, Set[Callable[[Message], None]]] = {}
        self._subscriptions: Dict[str, tuple[str, Callable[[Message], None]]] = {}
        self._pending_responses: Dict[str, asyncio.Future[Message]] = {}
        self._lock = asyncio.Lock()

    async def publish(self, channel: str, message: Message) -> bool:
        async with self._lock:
            handlers = self._channels.get(channel, set())
            for handler in handlers:
                asyncio.create_task(handler(message))
            return True

    async def subscribe(self, channel: str, handler: Callable[[Message], None]) -> str:
        async with self._lock:
            if channel not in self._channels:
                self._channels[channel] = set()
            self._channels[channel].add(handler)

            sub_id = str(uuid.uuid4())
            self._subscriptions[sub_id] = (channel, handler)
            return sub_id

    async def unsubscribe(self, subscription_id: str) -> bool:
        async with self._lock:
            if subscription_id in self._subscriptions:
                channel, handler = self._subscriptions[subscription_id]
                if channel in self._channels:
                    self._channels[channel].discard(handler)
                del self._subscriptions[subscription_id]
                return True
            return False

    async def request(self, target: str, payload: Dict[str, Any], timeout: float = 5.0) -> Optional[Message]:
        correlation_id = str(uuid.uuid4())
        future: asyncio.Future[Message] = asyncio.Future()

        async with self._lock:
            self._pending_responses[correlation_id] = future

        message = Message(
            id=str(uuid.uuid4()),
            type=MessageType.REQUEST,
            source="client",
            target=target,
            payload=payload,
            correlation_id=correlation_id,
        )

        await self.publish(target, message)

        try:
            return await asyncio.wait_for(future, timeout=timeout)
        except asyncio.TimeoutError:
            async with self._lock:
                self._pending_responses.pop(correlation_id, None)
            return None


class LoadBalancer:
    def __init__(self, strategy: str = "round_robin"):
        self._strategy = strategy
        self._current_index = 0
        self._lock = asyncio.Lock()

    async def select(
        self,
        endpoints: List[ServiceEndpoint]
    ) -> Optional[ServiceEndpoint]:
        if not endpoints:
            return None

        healthy = [ep for ep in endpoints if ep.status == ServiceStatus.HEALTHY]
        if not healthy:
            return None

        if self._strategy == "round_robin":
            async with self._lock:
                selected = healthy[self._current_index % len(healthy)]
                self._current_index += 1
                return selected
        elif self._strategy == "least_connections":
            return min(healthy, key=lambda ep: ep.metadata.get("active_connections", 0))
        elif self._strategy == "random":
            import random
            return random.choice(healthy)
        else:
            return healthy[0]


class CircuitBreaker:
    def __init__(
        self,
        failure_threshold: int = 5,
        recovery_timeout: float = 60.0,
        half_open_max_calls: int = 3
    ):
        self._failure_threshold = failure_threshold
        self._recovery_timeout = recovery_timeout
        self._half_open_max_calls = half_open_max_calls

        self._state = "closed"
        self._failure_count = 0
        self._last_failure_time: Optional[datetime] = None
        self._half_open_calls = 0
        self._lock = asyncio.Lock()

    @property
    def state(self) -> str:
        return self._state

    async def can_execute(self) -> bool:
        async with self._lock:
            if self._state == "closed":
                return True

            if self._state == "open":
                if self._last_failure_time:
                    elapsed = (datetime.now() - self._last_failure_time).total_seconds()
                    if elapsed >= self._recovery_timeout:
                        self._state = "half_open"
                        self._half_open_calls = 0
                        return True
                return False

            if self._state == "half_open":
                return self._half_open_calls < self._half_open_max_calls

            return False

    async def record_success(self):
        async with self._lock:
            if self._state == "half_open":
                self._half_open_calls += 1
                if self._half_open_calls >= self._half_open_max_calls:
                    self._state = "closed"
                    self._failure_count = 0
            elif self._state == "closed":
                self._failure_count = 0

    async def record_failure(self):
        async with self._lock:
            self._failure_count += 1
            self._last_failure_time = datetime.now()

            if self._state == "half_open":
                self._state = "open"
            elif self._failure_count >= self._failure_threshold:
                self._state = "open"


class ServiceRegistry:
    def __init__(self):
        self._services: Dict[str, List[ServiceEndpoint]] = {}
        self._lock = asyncio.Lock()

    async def register(self, endpoint: ServiceEndpoint) -> bool:
        async with self._lock:
            if endpoint.name not in self._services:
                self._services[endpoint.name] = []
            self._services[endpoint.name].append(endpoint)
            return True

    async def unregister(self, endpoint: ServiceEndpoint) -> bool:
        async with self._lock:
            if endpoint.name in self._services:
                self._services[endpoint.name] = [
                    ep for ep in self._services[endpoint.name]
                    if ep.url != endpoint.url
                ]
                return True
            return False

    async def get_endpoints(self, service_name: str) -> List[ServiceEndpoint]:
        async with self._lock:
            return list(self._services.get(service_name, []))

    async def update_status(self, endpoint: ServiceEndpoint, status: ServiceStatus):
        async with self._lock:
            if endpoint.name in self._services:
                for ep in self._services[endpoint.name]:
                    if ep.url == endpoint.url:
                        ep.status = status
                        ep.last_heartbeat = datetime.now()


class NetworkMonitor:
    def __init__(self):
        self._latencies: Dict[str, List[float]] = {}
        self._errors: Dict[str, int] = {}
        self._lock = asyncio.Lock()

    async def record_latency(self, service: str, latency_ms: float):
        async with self._lock:
            if service not in self._latencies:
                self._latencies[service] = []
            self._latencies[service].append(latency_ms)
            if len(self._latencies[service]) > 100:
                self._latencies[service].pop(0)

    async def record_error(self, service: str):
        async with self._lock:
            self._errors[service] = self._errors.get(service, 0) + 1

    async def get_stats(self, service: str) -> Dict[str, Any]:
        async with self._lock:
            latencies = self._latencies.get(service, [])
            return {
                "avg_latency_ms": sum(latencies) / len(latencies) if latencies else 0,
                "min_latency_ms": min(latencies) if latencies else 0,
                "max_latency_ms": max(latencies) if latencies else 0,
                "error_count": self._errors.get(service, 0),
                "sample_count": len(latencies),
            }


class NetworkModule:
    def __init__(
        self,
        broker: Optional[IMessageBroker] = None,
        registry: Optional[ServiceRegistry] = None
    ):
        self._broker = broker or InMemoryBroker()
        self._registry = registry or ServiceRegistry()
        self._load_balancer = LoadBalancer()
        self._monitor = NetworkMonitor()
        self._circuit_breakers: Dict[str, CircuitBreaker] = {}

    async def send_message(
        self,
        target: str,
        payload: Dict[str, Any],
        message_type: MessageType = MessageType.REQUEST
    ) -> Optional[Message]:
        message = Message(
            id=str(uuid.uuid4()),
            type=message_type,
            source="client",
            target=target,
            payload=payload,
        )

        return await self._broker.publish(target, message)

    async def call_service(
        self,
        service_name: str,
        operation: str,
        payload: Dict[str, Any],
        timeout: float = 5.0
    ) -> Optional[Dict[str, Any]]:
        endpoints = await self._registry.get_endpoints(service_name)
        if not endpoints:
            return {"error": f"Service {service_name} not found"}

        endpoint = await self._load_balancer.select(endpoints)
        if not endpoint:
            return {"error": f"No healthy endpoint for {service_name}"}

        breaker_id = f"{service_name}:{endpoint.url}"
        if breaker_id not in self._circuit_breakers:
            self._circuit_breakers[breaker_id] = CircuitBreaker()

        breaker = self._circuit_breakers[breaker_id]
        if not await breaker.can_execute():
            return {"error": "Service circuit breaker is open"}

        start_time = datetime.now()

        try:
            result = await self._broker.request(
                target=f"{service_name}:{operation}",
                payload=payload,
                timeout=timeout
            )

            latency = (datetime.now() - start_time).total_seconds() * 1000
            await self._monitor.record_latency(service_name, latency)
            await breaker.record_success()

            if result:
                return result.payload
            return {"error": "No response from service"}

        except Exception as e:
            await self._monitor.record_error(service_name)
            await breaker.record_failure()
            return {"error": str(e)}

    async def register_service(self, endpoint: ServiceEndpoint):
        await self._registry.register(endpoint)

    async def get_service_stats(self, service_name: str) -> Dict[str, Any]:
        return await self._monitor.get_stats(service_name)


__all__ = [
    "Message",
    "MessageType",
    "ServiceStatus",
    "ServiceEndpoint",
    "IMessageBroker",
    "InMemoryBroker",
    "LoadBalancer",
    "CircuitBreaker",
    "ServiceRegistry",
    "NetworkMonitor",
    "NetworkModule",
]
