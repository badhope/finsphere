import numpy as np
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Tuple
from enum import Enum
import asyncio


class CodeActionType(Enum):
    GENERATE = "generate"
    REFACTOR = "refactor"
    DEBUG = "debug"
    OPTIMIZE = "optimize"
    COMPLETE = "complete"
    REVIEW = "review"


@dataclass
class CodeAction:
    action_type: CodeActionType
    code: str
    language: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    step_number: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "action_type": self.action_type.value,
            "code": self.code,
            "language": self.language,
            "metadata": self.metadata,
            "step_number": self.step_number,
        }


@dataclass
class ExecutionResult:
    success: bool
    output: str
    error: Optional[str] = None
    execution_time: float = 0.0
    test_passed: bool = False
    user_rating: Optional[float] = None
    task_completion_rate: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "output": self.output,
            "error": self.error,
            "execution_time": self.execution_time,
            "test_passed": self.test_passed,
            "user_rating": self.user_rating,
            "task_completion_rate": self.task_completion_rate,
        }


class RewardCalculator:
    def __init__(
        self,
        code_quality_weight: float = 0.4,
        solving_weight: float = 0.35,
        satisfaction_weight: float = 0.25,
    ):
        self._code_quality_weight = code_quality_weight
        self._solving_weight = solving_weight
        self._satisfaction_weight = satisfaction_weight

    def calculate(self, action: CodeAction, result: ExecutionResult) -> float:
        code_quality = self._calculate_code_quality(action)
        solving = self._calculate_solving_efficiency(action, result)
        satisfaction = self._calculate_satisfaction(result)

        total_reward = (
            code_quality * self._code_quality_weight +
            solving * self._solving_weight +
            satisfaction * self._satisfaction_weight
        )

        return max(0.0, min(1.0, total_reward))

    def _calculate_code_quality(self, action: CodeAction) -> float:
        code = action.code
        if not code:
            return 0.0

        quality = 0.5

        if action.action_type == CodeActionType.GENERATE:
            has_docstrings = '"""' in code or "'''" in code
            has_error_handling = "try" in code or "except" in code
            has_type_hints = "->" in code or ":" in code.split()

            quality += (has_docstrings * 0.15 + has_error_handling * 0.15 + has_type_hints * 0.1)

        elif action.action_type == CodeActionType.OPTIMIZE:
            has_comments = "#" in code
            quality += has_comments * 0.1

        elif action.action_type == CodeActionType.DEBUG:
            if "fix" in code.lower() or "bug" in code.lower():
                quality += 0.2

        return min(1.0, quality)

    def _calculate_solving_efficiency(self, action: CodeAction, result: ExecutionResult) -> float:
        efficiency = 0.5

        if result.execution_time > 0:
            time_score = 1.0 / (1.0 + result.execution_time / 10.0)
            efficiency += time_score * 0.25

        step_score = 1.0 / (1.0 + action.step_number / 10.0)
        efficiency += step_score * 0.25

        if result.test_passed:
            efficiency += 0.25

        return min(1.0, efficiency)

    def _calculate_satisfaction(self, result: ExecutionResult) -> float:
        satisfaction = 0.5

        if result.user_rating is not None:
            satisfaction = result.user_rating

        satisfaction += result.task_completion_rate * 0.3

        if result.success:
            satisfaction += 0.2

        return min(1.0, satisfaction)


@dataclass
class Experience:
    state: np.ndarray
    action: CodeAction
    reward: float
    next_state: np.ndarray
    done: bool
    priority: float = 1.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "state": self.state.tolist(),
            "action": self.action.to_dict(),
            "reward": self.reward,
            "next_state": self.next_state.tolist(),
            "done": self.done,
            "priority": self.priority,
        }


class ExperienceBuffer:
    def __init__(self, capacity: int = 10000):
        self._buffer: List[Experience] = []
        self._capacity = capacity
        self._lock = asyncio.Lock()

    async def add(self, experience: Experience):
        async with self._lock:
            if len(self._buffer) >= self._capacity:
                self._buffer.pop(0)
            self._buffer.append(experience)

    async def sample(self, batch_size: int) -> List[Experience]:
        async with self._lock:
            if len(self._buffer) <= batch_size:
                return list(self._buffer)

            indices = np.random.choice(len(self._buffer), batch_size, replace=False)
            return [self._buffer[i] for i in indices]

    async def clear(self):
        async with self._lock:
            self._buffer.clear()

    def size(self) -> int:
        return len(self._buffer)


class PrioritizedReplayBuffer(ExperienceBuffer):
    def __init__(self, capacity: int = 10000, alpha: float = 0.6, beta: float = 0.4):
        super().__init__(capacity)
        self._alpha = alpha
        self._beta = beta
        self._priorities: List[float] = []

    async def add(self, experience: Experience):
        async with self._lock:
            priority = max(experience.priority, 1e-5) ** self._alpha

            if len(self._buffer) >= self._capacity:
                max_idx = np.argmax(self._priorities)
                self._buffer.pop(max_idx)
                self._priorities.pop(max_idx)
            else:
                self._priorities.append(priority)

            self._buffer.append(experience)

    async def sample(self, batch_size: int) -> Tuple[List[Experience], List[float], List[int]]:
        async with self._lock:
            if len(self._buffer) <= batch_size:
                return list(self._buffer), [1.0] * len(self._buffer), list(range(len(self._buffer)))

            priorities = np.array(self._priorities)
            probs = priorities / priorities.sum()

            indices = np.random.choice(len(self._buffer), batch_size, replace=False, p=probs)
            weights = (len(self._buffer) * probs[indices]) ** (-self._beta)
            weights = weights / weights.max()

            return [self._buffer[i] for i in indices], weights.tolist(), indices.tolist()
