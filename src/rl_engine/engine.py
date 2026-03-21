import numpy as np
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
import asyncio
from datetime import datetime

from rl_engine.reward import (
    CodeAction,
    CodeActionType,
    ExecutionResult,
    RewardCalculator,
    Experience,
    ExperienceBuffer,
    PrioritizedReplayBuffer,
)
from rl_engine.ppo import PolicyNetwork, ValueNetwork, PPOTrainer


@dataclass
class RLConfig:
    state_dim: int = 128
    action_dim: int = 10
    hidden_dims: List[int] = field(default_factory=lambda: [256, 128, 64])
    learning_rate: float = 0.001
    gamma: float = 0.99
    epsilon: float = 1.0
    epsilon_decay: float = 0.995
    epsilon_min: float = 0.01
    batch_size: int = 64
    update_interval: int = 10
    memory_capacity: int = 10000
    use_prioritized_replay: bool = True


class ExplorationStrategy:
    def __init__(
        self,
        initial_epsilon: float = 1.0,
        min_epsilon: float = 0.01,
        decay_rate: float = 0.995,
        exploration_mode: str = "epsilon_greedy"
    ):
        self._epsilon = initial_epsilon
        self._min_epsilon = min_epsilon
        self._decay_rate = decay_rate
        self._mode = exploration_mode

    def select_action(
        self,
        policy: PolicyNetwork,
        state: np.ndarray,
        action_dim: int,
        training: bool = True
    ) -> Tuple[int, float]:
        if training and np.random.random() < self._epsilon:
            action = np.random.randint(action_dim)
            return action, 0.0

        action, log_prob = policy.get_action(state)
        return int(action), float(log_prob)

    def decay(self):
        self._epsilon = max(self._epsilon * self._decay_rate, self._min_epsilon)

    def get_epsilon(self) -> float:
        return self._epsilon


class CodeSimulator:
    def __init__(self):
        self._supported_languages = {
            "python", "javascript", "typescript", "java",
            "cpp", "c", "csharp", "go", "rust", "ruby"
        }

    async def execute(
        self,
        code: str,
        language: str,
        timeout: float = 5.0
    ) -> ExecutionResult:
        if language.lower() not in self._supported_languages:
            return ExecutionResult(
                success=False,
                output="",
                error=f"Unsupported language: {language}"
            )

        if language.lower() == "python":
            return await self._execute_python(code, timeout)
        elif language.lower() == "javascript":
            return await self._execute_javascript(code, timeout)
        else:
            return ExecutionResult(
                success=True,
                output="Simulated execution (full sandbox not available)",
                execution_time=0.1
            )

    async def _execute_python(self, code: str, timeout: float) -> ExecutionResult:
        import io
        import sys
        import traceback

        start_time = datetime.now()
        old_stdout = sys.stdout
        old_stderr = sys.stderr
        sys.stdout = io.StringIO()
        sys.stderr = io.StringIO()

        try:
            compiled = compile(code, "<string>", "exec")
            exec(compiled, {"__name__": "__main__"})

            output = sys.stdout.getvalue()
            execution_time = (datetime.now() - start_time).total_seconds()

            return ExecutionResult(
                success=True,
                output=output,
                execution_time=execution_time
            )
        except Exception as e:
            error = traceback.format_exc()
            execution_time = (datetime.now() - start_time).total_seconds()

            return ExecutionResult(
                success=False,
                output=sys.stdout.getvalue(),
                error=error,
                execution_time=execution_time
            )
        finally:
            sys.stdout = old_stdout
            sys.stderr = old_stderr

    async def _execute_javascript(self, code: str, timeout: float) -> ExecutionResult:
        return ExecutionResult(
            success=True,
            output="JavaScript simulation mode - actual execution requires Node.js runtime",
            execution_time=0.05
        )

    def get_supported_languages(self) -> List[str]:
        return list(self._supported_languages)


class RLEngine:
    def __init__(self, config: Optional[RLConfig] = None):
        self._config = config or RLConfig()
        self._state_dim = self._config.state_dim
        self._action_dim = self._config.action_dim

        self._policy = PolicyNetwork(
            state_dim=self._state_dim,
            action_dim=self._action_dim,
            hidden_dims=self._config.hidden_dims,
            learning_rate=self._config.learning_rate
        )

        self._value = ValueNetwork(
            state_dim=self._state_dim,
            hidden_dims=self._config.hidden_dims,
            learning_rate=self._config.learning_rate
        )

        self._trainer = PPOTrainer(
            policy=self._policy,
            value=self._value,
            update_interval=self._config.update_interval
        )

        if self._config.use_prioritized_replay:
            self._memory = PrioritizedReplayBuffer(capacity=self._config.memory_capacity)
        else:
            self._memory = ExperienceBuffer(capacity=self._config.memory_capacity)

        self._exploration = ExplorationStrategy(
            initial_epsilon=self._config.epsilon,
            min_epsilon=self._config.epsilon_min,
            decay_rate=self._config.epsilon_decay
        )

        self._reward_calculator = RewardCalculator()
        self._simulator = CodeSimulator()

        self._training_history: List[Dict[str, Any]] = []
        self._is_training = False
        self._lock = asyncio.Lock()

    def state_to_embedding(self, context: Dict[str, Any]) -> np.ndarray:
        state_parts = []

        context_text = context.get("current_query", "")
        state_parts.append(hash(context_text) % 1000 / 1000.0)

        memory_count = context.get("memory_context", {}).get("total_entries", 0)
        state_parts.append(min(memory_count / 100.0, 1.0))

        action_type_idx = self._get_action_type_index(context.get("action_type", "generate"))
        state_parts.extend([1.0 if i == action_type_idx else 0.0 for i in range(self._action_dim)])

        language_idx = self._get_language_index(context.get("language", "python"))
        state_parts.extend([1.0 if i == language_idx else 0.0 for i in range(10)])

        while len(state_parts) < self._state_dim:
            state_parts.append(0.0)

        return np.array(state_parts[:self._state_dim])

    def _get_action_type_index(self, action_type: str) -> int:
        mapping = {
            "generate": 0,
            "refactor": 1,
            "debug": 2,
            "optimize": 3,
            "complete": 4,
            "review": 5,
            "explain": 6,
            "test": 7,
            "document": 8,
            "deploy": 9,
        }
        return mapping.get(action_type.lower(), 0)

    def _get_language_index(self, language: str) -> int:
        languages = ["python", "javascript", "typescript", "java", "cpp", "c", "csharp", "go", "rust", "ruby"]
        try:
            return languages.index(language.lower())
        except ValueError:
            return 0

    async def select_action(
        self,
        state: np.ndarray,
        training: bool = True
    ) -> Tuple[int, float]:
        async with self._lock:
            action, log_prob = self._exploration.select_action(
                self._policy,
                state,
                self._action_dim,
                training=training
            )
            return action, log_prob

    async def execute_action(
        self,
        action: CodeAction,
        context: Dict[str, Any]
    ) -> ExecutionResult:
        result = await self._simulator.execute(
            code=action.code,
            language=action.language
        )

        reward = self._reward_calculator.calculate(action, result)

        experience = Experience(
            state=self.state_to_embedding(context),
            action=action,
            reward=reward,
            next_state=self.state_to_embedding(context),
            done=result.success
        )

        await self._memory.add(experience)

        self._training_history.append({
            "timestamp": datetime.now(),
            "action": action.action_type.value,
            "reward": reward,
            "success": result.success
        })

        return result

    async def train_step(self) -> Dict[str, Any]:
        async with self._lock:
            if not self._is_training:
                self._is_training = True

            stats = await self._trainer.update()

            self._exploration.decay()

            stats["epsilon"] = self._exploration.get_epsilon()
            stats["memory_size"] = self._memory.size()

            return stats

    def get_best_action(self, state: np.ndarray) -> int:
        action, _ = self._policy.get_action(state, temperature=0.01)
        return int(action)

    def get_statistics(self) -> Dict[str, Any]:
        recent_rewards = [h["reward"] for h in self._training_history[-100:]]
        recent_success = [h["success"] for h in self._training_history[-100:]]

        return {
            "total_experiences": len(self._training_history),
            "average_reward_100": np.mean(recent_rewards) if recent_rewards else 0.0,
            "success_rate_100": np.mean(recent_success) if recent_success else 0.0,
            "epsilon": self._exploration.get_epsilon(),
            "memory_size": self._memory.size(),
            "is_training": self._is_training,
            "trainer_stats": self._trainer.get_statistics(),
        }

    async def save_model(self, path: str) -> bool:
        try:
            import pickle
            model_state = {
                "policy_weights": self._policy._weights,
                "policy_biases": self._policy._biases,
                "value_weights": self._value._weights,
                "value_biases": self._value._biases,
                "epsilon": self._exploration.get_epsilon(),
                "training_history": self._training_history,
            }

            with open(path, "wb") as f:
                pickle.dump(model_state, f)

            return True
        except Exception:
            return False

    async def load_model(self, path: str) -> bool:
        try:
            import pickle
            with open(path, "rb") as f:
                model_state = pickle.load(f)

            self._policy._weights = model_state["policy_weights"]
            self._policy._biases = model_state["policy_biases"]
            self._value._weights = model_state["value_weights"]
            self._value._biases = model_state["value_biases"]
            self._exploration._epsilon = model_state["epsilon"]
            self._training_history = model_state.get("training_history", [])

            return True
        except Exception:
            return False


__all__ = [
    "RLEngine",
    "RLConfig",
    "PolicyNetwork",
    "ValueNetwork",
    "PPOTrainer",
    "CodeAction",
    "CodeActionType",
    "ExecutionResult",
    "RewardCalculator",
    "ExperienceBuffer",
    "PrioritizedReplayBuffer",
    "ExplorationStrategy",
    "CodeSimulator",
]
