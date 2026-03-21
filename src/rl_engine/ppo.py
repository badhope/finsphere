import numpy as np
from typing import Any, Dict, List, Optional, Tuple
import asyncio


class PolicyNetwork:
    def __init__(
        self,
        state_dim: int,
        action_dim: int,
        hidden_dims: List[int] = [256, 128, 64],
        learning_rate: float = 0.001,
    ):
        self._state_dim = state_dim
        self._action_dim = action_dim
        self._hidden_dims = hidden_dims

        self._weights = self._initialize_weights()
        self._biases = self._initialize_biases()
        self._learning_rate = learning_rate

    def _initialize_weights(self) -> List[np.ndarray]:
        weights = []
        dims = [self._state_dim] + self._hidden_dims + [self._action_dim]

        for i in range(len(dims) - 1):
            w = np.random.randn(dims[i], dims[i + 1]) * np.sqrt(2.0 / dims[i])
            weights.append(w)

        return weights

    def _initialize_biases(self) -> List[np.ndarray]:
        biases = []
        dims = [self._state_dim] + self._hidden_dims + [self._action_dim]

        for i in range(len(dims) - 1):
            b = np.zeros((1, dims[i + 1]))
            biases.append(b)

        return biases

    def forward(self, state: np.ndarray) -> np.ndarray:
        x = state

        for i, (w, b) in enumerate(zip(self._weights[:-1], self._biases[:-1])):
            x = np.dot(x, w) + b
            x = np.tanh(x)

        output = np.dot(x, self._weights[-1]) + self._biases[-1]

        return output

    def get_action(self, state: np.ndarray, temperature: float = 1.0) -> Tuple[int, float]:
        logits = self.forward(state)

        if temperature > 0.01:
            exp_logits = np.exp(logits / temperature)
            probs = exp_logits / exp_logits.sum()
            action = np.random.choice(len(probs[0]), p=probs[0])
            log_prob = np.log(probs[0][action] + 1e-10)
        else:
            action = np.argmax(logits)
            log_prob = np.log(float(np.max(logits)) + 1e-10)

        return action, log_prob

    def update(self, states: np.ndarray, actions: np.ndarray, advantages: np.ndarray) -> float:
        logits = self.forward(states)

        action_log_probs = []
        for i, action in enumerate(actions):
            log_prob = np.log(softmax(logits[i])[action] + 1e-10)
            action_log_probs.append(log_prob)

        action_log_probs = np.array(action_log_probs)

        loss = -(action_log_probs * advantages).mean()

        gradients = self._compute_gradients(states, actions, advantages)

        for i in range(len(self._weights)):
            self._weights[i] -= self._learning_rate * gradients["weights"][i]
            self._biases[i] -= self._learning_rate * gradients["biases"][i]

        return loss

    def _compute_gradients(
        self,
        states: np.ndarray,
        actions: np.ndarray,
        advantages: np.ndarray
    ) -> Dict[str, List[np.ndarray]]:
        batch_size = states.shape[0]
        gradients_w = [np.zeros_like(w) for w in self._weights]
        gradients_b = [np.zeros_like(b) for b in self._biases]

        for i in range(batch_size):
            x = states[i : i + 1]
            activations = [x]

            for w, b in zip(self._weights[:-1], self._biases[:-1]):
                x = np.tanh(np.dot(x, w) + b)
                activations.append(x)

            output = np.dot(x, self._weights[-1]) + self._biases[-1]
            probs = softmax(output)

            action = actions[i]
            d_log_prob = probs.copy()
            d_log_prob[0, action] -= 1

            delta = d_log_prob * advantages[i]

            grad_w_last = np.dot(activations[-1].T, delta)
            grad_b_last = delta

            gradients_w[-1] += grad_w_last
            gradients_b[-1] += grad_b_last

            delta_hidden = np.dot(delta, self._weights[-1].T) * (1 - activations[-1] ** 2)

            for j in range(len(self._weights) - 2, -1, -1):
                gradients_w[j] += np.dot(activations[j].T, delta_hidden)
                gradients_b[j] += delta_hidden

                if j > 0:
                    delta_hidden = np.dot(delta_hidden, self._weights[j].T) * (1 - activations[j] ** 2)

        for i in range(len(gradients_w)):
            gradients_w[i] /= batch_size
            gradients_b[i] /= batch_size

        return {"weights": gradients_w, "biases": gradients_b}


class ValueNetwork:
    def __init__(
        self,
        state_dim: int,
        hidden_dims: List[int] = [256, 128, 64],
        learning_rate: float = 0.001,
    ):
        self._state_dim = state_dim
        self._hidden_dims = hidden_dims

        self._weights = self._initialize_weights()
        self._biases = self._initialize_biases()
        self._learning_rate = learning_rate

    def _initialize_weights(self) -> List[np.ndarray]:
        weights = []
        dims = [self._state_dim] + self._hidden_dims + [1]

        for i in range(len(dims) - 1):
            w = np.random.randn(dims[i], dims[i + 1]) * np.sqrt(2.0 / dims[i])
            weights.append(w)

        return weights

    def _initialize_biases(self) -> List[np.ndarray]:
        biases = []
        dims = [self._state_dim] + self._hidden_dims + [1]

        for i in range(len(dims) - 1):
            b = np.zeros((1, dims[i + 1]))
            biases.append(b)

        return biases

    def forward(self, state: np.ndarray) -> float:
        x = state

        for w, b in zip(self._weights[:-1], self._biases[:-1]):
            x = np.tanh(np.dot(x, w) + b)

        value = np.dot(x, self._weights[-1]) + self._biases[-1]
        return float(value[0, 0])

    def update(self, states: np.ndarray, targets: np.ndarray) -> float:
        predictions = np.array([self.forward(s) for s in states])
        loss = np.mean((predictions - targets) ** 2)

        gradients = self._compute_gradients(states, targets)

        for i in range(len(self._weights)):
            self._weights[i] -= self._learning_rate * gradients["weights"][i]
            self._biases[i] -= self._learning_rate * gradients["biases"][i]

        return loss

    def _compute_gradients(
        self,
        states: np.ndarray,
        targets: np.ndarray
    ) -> Dict[str, List[np.ndarray]]:
        gradients_w = [np.zeros_like(w) for w in self._weights]
        gradients_b = [np.zeros_like(b) for b in self._biases]

        for i, state in enumerate(states):
            state = state.reshape(1, -1)
            x = state

            activations = [x]
            for w, b in zip(self._weights[:-1], self._biases[:-1]):
                x = np.tanh(np.dot(x, w) + b)
                activations.append(x)

            output = np.dot(x, self._weights[-1]) + self._biases[-1]
            value = float(output[0, 0])

            error = 2 * (value - targets[i])

            grad_w_last = np.dot(activations[-1].T, [[error]])
            grad_b_last = [[error]]
            gradients_w[-1] += grad_w_last
            gradients_b[-1] += np.array(grad_b_last)

            delta = error * self._weights[-1].T
            for j in range(len(self._weights) - 2, -1, -1):
                gradients_w[j] += np.dot(activations[j].T, delta * (1 - activations[j + 1] ** 2))
                gradients_b[j] += delta * (1 - activations[j + 1] ** 2)
                if j > 0:
                    delta = np.dot(delta * (1 - activations[j + 1] ** 2), self._weights[j].T)

        for i in range(len(gradients_w)):
            gradients_w[i] /= len(states)
            gradients_b[i] /= len(states)

        return {"weights": gradients_w, "biases": gradients_b}


def softmax(x: np.ndarray) -> np.ndarray:
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)


class PPOTrainer:
    def __init__(
        self,
        policy: PolicyNetwork,
        value: ValueNetwork,
        clip_epsilon: float = 0.2,
        value_coef: float = 0.5,
        entropy_coef: float = 0.01,
        update_interval: int = 10,
        minibatch_size: int = 64,
    ):
        self._policy = policy
        self._value = value
        self._clip_epsilon = clip_epsilon
        self._value_coef = value_coef
        self._entropy_coef = entropy_coef
        self._update_interval = update_interval
        self._minibatch_size = minibatch_size

        self._trajectory: List[Tuple[np.ndarray, int, float, float]] = []
        self._iteration = 0

    def add_experience(self, state: np.ndarray, action: int, old_log_prob: float, reward: float):
        self._trajectory.append((state, action, old_log_prob, reward))

    async def update(self) -> Dict[str, float]:
        if len(self._trajectory) < self._update_interval:
            return {"policy_loss": 0.0, "value_loss": 0.0, "entropy": 0.0}

        states = np.array([t[0] for t in self._trajectory])
        actions = np.array([t[1] for t in self._trajectory])
        old_log_probs = np.array([t[2] for t in self._trajectory])
        rewards = np.array([t[3] for t in self._trajectory])

        values = np.array([self._value.forward(s) for s in states])

        returns = self._compute_returns(rewards)
        advantages = returns - values

        advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)

        policy_losses = []
        value_losses = []
        entropies = []

        num_updates = len(states) // self._minibatch_size

        for _ in range(num_updates):
            indices = np.random.choice(len(states), self._minibatch_size, replace=False)

            batch_states = states[indices]
            batch_actions = actions[indices]
            batch_advantages = advantages[indices]

            _, new_log_probs = self._policy.get_action(batch_states)
            new_log_probs = new_log_probs.reshape(-1, 1) if new_log_probs.ndim == 1 else new_log_probs

            ratio = np.exp(new_log_probs - old_log_probs[indices].reshape(-1, 1))
            surr1 = ratio * batch_advantages.reshape(-1, 1)
            surr2 = np.clip(ratio, 1 - self._clip_epsilon, 1 + self._clip_epsilon) * batch_advantages.reshape(-1, 1)

            policy_loss = -np.min(surr1, surr2).mean()

            target_values = returns[indices]
            value_loss = np.mean((new_log_probs - target_values.reshape(-1, 1)) ** 2)

            logits = self._policy.forward(batch_states)
            probs = softmax(logits)
            entropy = -np.mean(np.sum(probs * np.log(probs + 1e-10), axis=-1))

            total_loss = policy_loss + self._value_coef * value_loss - self._entropy_coef * entropy

            self._policy.update(batch_states, batch_actions, batch_advantages)
            self._value.update(batch_states, target_values)

            policy_losses.append(float(policy_loss))
            value_losses.append(float(value_loss))
            entropies.append(float(entropy))

        self._trajectory.clear()
        self._iteration += 1

        return {
            "policy_loss": np.mean(policy_losses),
            "value_loss": np.mean(value_losses),
            "entropy": np.mean(entropies),
            "iteration": self._iteration,
        }

    def _compute_returns(self, rewards: np.ndarray, gamma: float = 0.99) -> np.ndarray:
        returns = np.zeros_like(rewards)
        running_return = 0

        for t in reversed(range(len(rewards))):
            running_return = rewards[t] + gamma * running_return
            returns[t] = running_return

        return returns

    def get_statistics(self) -> Dict[str, Any]:
        return {
            "iteration": self._iteration,
            "trajectory_size": len(self._trajectory),
            "clip_epsilon": self._clip_epsilon,
        }
