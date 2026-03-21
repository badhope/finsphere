import math
from typing import List, Optional, Callable, Any
import numpy as np


class VectorOperations:
    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        if len(vec1) != len(vec2):
            raise ValueError("Vectors must have the same dimension")

        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot_product / (norm1 * norm2)

    @staticmethod
    def euclidean_distance(vec1: List[float], vec2: List[float]) -> float:
        if len(vec1) != len(vec2):
            raise ValueError("Vectors must have the same dimension")

        return math.sqrt(sum((a - b) ** 2 for a, b in zip(vec1, vec2)))

    @staticmethod
    def manhattan_distance(vec1: List[float], vec2: List[float]) -> float:
        if len(vec1) != len(vec2):
            raise ValueError("Vectors must have the same dimension")

        return sum(abs(a - b) for a, b in zip(vec1, vec2))

    @staticmethod
    def dot_product(vec1: List[float], vec2: List[float]) -> float:
        if len(vec1) != len(vec2):
            raise ValueError("Vectors must have the same dimension")

        return sum(a * b for a, b in zip(vec1, vec2))


class SemanticSearchEngine:
    def __init__(
        self,
        embedding_dim: int = 1536,
        similarity_threshold: float = 0.7,
        max_results: int = 10
    ):
        self._embedding_dim = embedding_dim
        self._similarity_threshold = similarity_threshold
        self._max_results = max_results
        self._vector_ops = VectorOperations()

    def compute_similarity(
        self,
        query_embedding: List[float],
        candidate_embeddings: List[List[float]],
        method: str = "cosine"
    ) -> List[float]:
        if method == "cosine":
            return [
                self._vector_ops.cosine_similarity(query_embedding, emb)
                for emb in candidate_embeddings
            ]
        elif method == "euclidean":
            distances = [
                self._vector_ops.euclidean_distance(query_embedding, emb)
                for emb in candidate_embeddings
            ]
            max_dist = max(distances) if distances else 1.0
            return [1.0 - (d / max_dist) for d in distances]
        elif method == "dot":
            return [
                self._vector_ops.dot_product(query_embedding, emb)
                for emb in candidate_embeddings
            ]
        else:
            raise ValueError(f"Unknown similarity method: {method}")

    def rank_results(
        self,
        similarities: List[float],
        top_k: Optional[int] = None
    ) -> List[tuple[int, float]]:
        indexed_sims = list(enumerate(similarities))
        sorted_sims = sorted(indexed_sims, key=lambda x: x[1], reverse=True)

        k = top_k if top_k is not None else self._max_results
        return sorted_sims[:k]

    def filter_by_threshold(
        self,
        similarities: List[float]
    ) -> List[tuple[int, float]]:
        return [
            (i, sim) for i, sim in enumerate(similarities)
            if sim >= self._similarity_threshold
        ]


class ImportanceScorer:
    def __init__(
        self,
        recency_weight: float = 0.3,
        access_weight: float = 0.3,
        explicit_weight: float = 0.4
    ):
        self._recency_weight = recency_weight
        self._access_weight = access_weight
        self._explicit_weight = explicit_weight

    def calculate(
        self,
        timestamp: Any,
        access_count: int,
        explicit_score: float,
        decay_factor: float = 0.95,
        decay_period_hours: int = 24
    ) -> float:
        recency_score = self._calculate_recency_score(timestamp, decay_factor, decay_period_hours)
        access_score = self._normalize_access_score(access_count)

        return (
            recency_score * self._recency_weight +
            access_score * self._access_weight +
            explicit_score * self._explicit_weight
        )

    def _calculate_recency_score(
        self,
        timestamp: Any,
        decay_factor: float,
        decay_period_hours: int
    ) -> float:
        from datetime import datetime, timedelta

        if isinstance(timestamp, str):
            timestamp = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        elif not isinstance(timestamp, datetime):
            return 0.5

        now = datetime.now()
        age_hours = (now - timestamp).total_seconds() / 3600

        periods = age_hours / decay_period_hours
        return pow(decay_factor, periods)

    def _normalize_access_score(self, access_count: int) -> float:
        import math
        return 1.0 - (1.0 / (1.0 + math.log1p(access_count)))


class DecayEngine:
    def __init__(
        self,
        base_decay_rate: float = 0.95,
        min_importance: float = 0.1
    ):
        self._base_decay_rate = base_decay_rate
        self._min_importance = min_importance

    def apply_decay(
        self,
        current_importance: float,
        time_delta_hours: float,
        priority: str = "medium"
    ) -> float:
        priority_multipliers = {
            "low": 1.2,
            "medium": 1.0,
            "high": 0.8,
            "critical": 0.5
        }

        multiplier = priority_multipliers.get(priority, 1.0)
        adjusted_decay = pow(self._base_decay_rate, time_delta_hours * multiplier)

        new_importance = current_importance * adjusted_decay
        return max(new_importance, self._min_importance)

    def should_evict(
        self,
        importance: float,
        access_count: int,
        min_access_threshold: int = 5
    ) -> bool:
        return importance < self._min_importance and access_count < min_access_threshold


class ConflictResolver:
    def __init__(self):
        pass

    def resolve(
        self,
        existing_entry: Any,
        new_entry: Any,
        strategy: str = "timestamp"
    ) -> Any:
        if strategy == "timestamp":
            return self._resolve_by_timestamp(existing_entry, new_entry)
        elif strategy == "importance":
            return self._resolve_by_importance(existing_entry, new_entry)
        elif strategy == "merge":
            return self._merge_entries(existing_entry, new_entry)
        elif strategy == "newer":
            return new_entry if new_entry.version > existing_entry.version else existing_entry
        else:
            raise ValueError(f"Unknown resolution strategy: {strategy}")

    def _resolve_by_timestamp(self, existing: Any, new: Any) -> Any:
        return new if new.timestamp > existing.timestamp else existing

    def _resolve_by_importance(self, existing: Any, new: Any) -> Any:
        return new if new.importance_score > existing.importance_score else existing

    def _merge_entries(self, existing: Any, new: Any) -> Any:
        existing.content = existing.content + "\n" + new.content
        existing.version = max(existing.version, new.version) + 1
        existing.metadata.update(new.metadata)
        existing.tags.update(new.tags)
        return existing
