from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Set
import uuid
import asyncio


class ToolStatus(Enum):
    IDLE = "idle"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"


@dataclass
class ToolDefinition:
    name: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    tags: Set[str] = field(default_factory=set)
    category: str = "general"
    version: str = "1.0.0"
    deprecated: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.input_schema,
            "output_schema": self.output_schema,
            "tags": list(self.tags),
            "category": self.category,
            "version": self.version,
            "deprecated": self.deprecated,
        }


@dataclass
class ToolResult:
    tool_name: str
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    execution_time_ms: float = 0.0
    timestamp: datetime = field(default_factory=datetime.now)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "tool_name": self.tool_name,
            "success": self.success,
            "data": self.data,
            "error": self.error,
            "execution_time_ms": self.execution_time_ms,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata,
        }


@dataclass
class ToolExecution:
    id: str
    tool_name: str
    parameters: Dict[str, Any]
    status: ToolStatus = ToolStatus.IDLE
    result: Optional[ToolResult] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "tool_name": self.tool_name,
            "parameters": self.parameters,
            "status": self.status.value,
            "result": self.result.to_dict() if self.result else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }


class MCPTool(ABC):
    def __init__(self):
        self._execution_history: List[ToolExecution] = []

    @abstractmethod
    def get_definition(self) -> ToolDefinition:
        pass

    @abstractmethod
    async def execute(self, params: Dict[str, Any]) -> ToolResult:
        pass

    async def validate(self, params: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        definition = self.get_definition()
        return self._validate_params(params, definition.input_schema)

    def _validate_params(self, params: Dict[str, Any], schema: Dict[str, Any]) -> tuple[bool, Optional[str]]:
        required = schema.get("required", [])
        properties = schema.get("properties", {})

        for req in required:
            if req not in params:
                return False, f"Missing required parameter: {req}"

        for param_name, param_value in params.items():
            if param_name in properties:
                expected_type = properties[param_name].get("type")
                if not self._check_type(param_value, expected_type):
                    return False, f"Invalid type for {param_name}: expected {expected_type}"

        return True, None

    def _check_type(self, value: Any, expected_type: str) -> bool:
        type_map = {
            "string": str,
            "number": (int, float),
            "integer": int,
            "boolean": bool,
            "array": list,
            "object": dict,
            "null": type(None),
        }

        if expected_type not in type_map:
            return True

        expected = type_map[expected_type]
        return isinstance(value, expected)

    def get_execution_history(self, limit: int = 50) -> List[ToolExecution]:
        return self._execution_history[-limit:]


class MCPFramework:
    def __init__(self):
        self._tools: Dict[str, MCPTool] = {}
        self._execution_history: List[ToolExecution] = []
        self._lock = asyncio.Lock()

    def register_tool(self, tool: MCPTool) -> bool:
        definition = tool.get_definition()
        if definition.deprecated:
            return False

        self._tools[definition.name] = tool
        return True

    def unregister_tool(self, tool_name: str) -> bool:
        if tool_name in self._tools:
            del self._tools[tool_name]
            return True
        return False

    def get_tool(self, tool_name: str) -> Optional[MCPTool]:
        return self._tools.get(tool_name)

    def list_tools(self, category: Optional[str] = None, tags: Optional[Set[str]] = None) -> List[ToolDefinition]:
        definitions = []

        for tool in self._tools.values():
            definition = tool.get_definition()

            if category and definition.category != category:
                continue

            if tags and not definition.tags.intersection(tags):
                continue

            definitions.append(definition)

        return definitions

    async def execute_tool(
        self,
        tool_name: str,
        parameters: Dict[str, Any],
        timeout: Optional[float] = None
    ) -> ToolResult:
        if tool_name not in self._tools:
            return ToolResult(
                tool_name=tool_name,
                success=False,
                error=f"Tool {tool_name} not found"
            )

        tool = self._tools[tool_name]
        definition = tool.get_definition()

        valid, error_msg = await tool.validate(parameters)
        if not valid:
            return ToolResult(
                tool_name=tool_name,
                success=False,
                error=error_msg
            )

        execution = ToolExecution(
            id=str(uuid.uuid4()),
            tool_name=tool_name,
            parameters=parameters,
            status=ToolStatus.RUNNING,
            started_at=datetime.now()
        )

        async with self._lock:
            self._execution_history.append(execution)

        start_time = datetime.now()

        try:
            if timeout:
                result = await asyncio.wait_for(tool.execute(parameters), timeout=timeout)
            else:
                result = await tool.execute(parameters)

            execution.status = ToolStatus.SUCCESS
            execution.result = result
            execution.completed_at = datetime.now()

            return result

        except asyncio.TimeoutError:
            execution.status = ToolStatus.FAILED
            execution.result = ToolResult(
                tool_name=tool_name,
                success=False,
                error="Execution timeout"
            )
            execution.completed_at = datetime.now()

            return execution.result

        except Exception as e:
            execution.status = ToolStatus.FAILED
            execution.result = ToolResult(
                tool_name=tool_name,
                success=False,
                error=str(e)
            )
            execution.completed_at = datetime.now()

            return execution.result

    async def execute_chain(
        self,
        tool_chain: List[tuple[str, Dict[str, Any]]],
        timeout: Optional[float] = None
    ) -> List[ToolResult]:
        results = []
        context: Dict[str, Any] = {}

        for tool_name, params in tool_chain:
            merged_params = {**params, "_context": context}

            result = await self.execute_tool(tool_name, merged_params, timeout)

            results.append(result)

            if result.success and result.data:
                context[f"{tool_name}_result"] = result.data

            if not result.success:
                break

        return results

    def get_statistics(self) -> Dict[str, Any]:
        total_executions = len(self._execution_history)
        successful = sum(1 for e in self._execution_history if e.status == ToolStatus.SUCCESS)
        failed = sum(1 for e in self._execution_history if e.status == ToolStatus.FAILED)

        tool_stats = {}
        for tool_name, tool in self._tools.items():
            tool_executions = [e for e in self._execution_history if e.tool_name == tool_name]
            tool_stats[tool_name] = {
                "total_executions": len(tool_executions),
                "successful": sum(1 for e in tool_executions if e.status == ToolStatus.SUCCESS),
                "failed": sum(1 for e in tool_executions if e.status == ToolStatus.FAILED),
            }

        return {
            "total_tools": len(self._tools),
            "total_executions": total_executions,
            "success_rate": successful / total_executions if total_executions > 0 else 0,
            "failure_rate": failed / total_executions if total_executions > 0 else 0,
            "tool_statistics": tool_stats,
        }

    async def health_check(self) -> Dict[str, Any]:
        health = {}
        for tool_name, tool in self._tools.items():
            try:
                await tool.validate({})
                health[tool_name] = "healthy"
            except Exception:
                health[tool_name] = "unhealthy"

        return {
            "status": "healthy" if all(v == "healthy" for v in health.values()) else "degraded",
            "tools": health,
        }


__all__ = [
    "ToolDefinition",
    "ToolResult",
    "ToolExecution",
    "ToolStatus",
    "MCPTool",
    "MCPFramework",
]
