from typing import Any, Callable, Dict, List, Optional, Tuple, TypeVar
from dataclasses import dataclass
import random

T = TypeVar('T')
Comparable = TypeVar('Comparable', int, float, str)


@dataclass
class AlgorithmResult:
    name: str
    time_complexity: str
    space_complexity: str
    description: str
    implementation: str


class SortingAlgorithms:
    @staticmethod
    def quicksort(arr: List[Comparable]) -> List[Comparable]:
        if len(arr) <= 1:
            return arr

        pivot = arr[len(arr) // 2]
        left = [x for x in arr if x < pivot]
        middle = [x for x in arr if x == pivot]
        right = [x for x in arr if x > pivot]

        return SortingAlgorithms.quicksort(left) + middle + SortingAlgorithms.quicksort(right)

    @staticmethod
    def mergesort(arr: List[Comparable]) -> List[Comparable]:
        if len(arr) <= 1:
            return arr

        mid = len(arr) // 2
        left = SortingAlgorithms.mergesort(arr[:mid])
        right = SortingAlgorithms.mergesort(arr[mid:])

        return SortingAlgorithms._merge(left, right)

    @staticmethod
    def _merge(left: List[T], right: List[T]) -> List[T]:
        result = []
        i = j = 0

        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1

        result.extend(left[i:])
        result.extend(right[j:])
        return result

    @staticmethod
    def heapsort(arr: List[Comparable]) -> List[Comparable]:
        n = len(arr)

        def heapify(arr: List, n: int, i: int):
            largest = i
            left = 2 * i + 1
            right = 2 * i + 2

            if left < n and arr[left] > arr[largest]:
                largest = left
            if right < n and arr[right] > arr[largest]:
                largest = right
            if largest != i:
                arr[i], arr[largest] = arr[largest], arr[i]
                heapify(arr, n, largest)

        for i in range(n // 2 - 1, -1, -1):
            heapify(arr, n, i)
        for i in range(n - 1, 0, -1):
            arr[0], arr[i] = arr[i], arr[0]
            heapify(arr, i, 0)

        return arr

    @staticmethod
    def bubblesort(arr: List[Comparable]) -> List[Comparable]:
        n = len(arr)
        for i in range(n):
            swapped = False
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
            if not swapped:
                break
        return arr


class SearchAlgorithms:
    @staticmethod
    def binary_search(arr: List[Comparable], target: Comparable) -> int:
        left, right = 0, len(arr) - 1

        while left <= right:
            mid = (left + right) // 2
            if arr[mid] == target:
                return mid
            elif arr[mid] < target:
                left = mid + 1
            else:
                right = mid - 1

        return -1

    @staticmethod
    def bfs(graph: Dict[Any, List[Any]], start: Any) -> List[Any]:
        visited = set()
        queue = [start]
        result = []

        while queue:
            node = queue.pop(0)
            if node not in visited:
                visited.add(node)
                result.append(node)
                queue.extend(graph.get(node, []))

        return result

    @staticmethod
    def dfs(graph: Dict[Any, List[Any]], start: Any) -> List[Any]:
        visited = set()
        result = []

        def dfs_recursive(node: Any):
            visited.add(node)
            result.append(node)
            for neighbor in graph.get(node, []):
                if neighbor not in visited:
                    dfs_recursive(neighbor)

        dfs_recursive(start)
        return result

    @staticmethod
    def dijkstra(graph: Dict[Any, List[Tuple[Any, float]]], start: Any) -> Dict[Any, float]:
        distances = {node: float('inf') for node in graph}
        distances[start] = 0
        unvisited = set(graph.keys())
        visited = set()

        while unvisited:
            current = min(unvisited, key=lambda x: distances[x])
            if distances[current] == float('inf'):
                break

            unvisited.remove(current)
            visited.add(current)

            for neighbor, weight in graph.get(current, []):
                if neighbor not in visited:
                    new_dist = distances[current] + weight
                    if new_dist < distances[neighbor]:
                        distances[neighbor] = new_dist

        return distances


class DynamicProgramming:
    @staticmethod
    def fibonacci(n: int) -> int:
        if n <= 1:
            return n

        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b

    @staticmethod
    def fibonacci_memo(n: int, memo: Optional[Dict[int, int]] = None) -> int:
        if memo is None:
            memo = {}
        if n in memo:
            return memo[n]
        if n <= 1:
            return n

        memo[n] = DynamicProgramming.fibonacci_memo(n - 1, memo) + DynamicProgramming.fibonacci_memo(n - 2, memo)
        return memo[n]

    @staticmethod
    def knapsack(values: List[int], weights: List[int], capacity: int) -> int:
        n = len(values)
        dp = [[0] * (capacity + 1) for _ in range(n + 1)]

        for i in range(1, n + 1):
            for w in range(capacity + 1):
                if weights[i - 1] <= w:
                    dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1])
                else:
                    dp[i][w] = dp[i - 1][w]

        return dp[n][capacity]

    @staticmethod
    def longest_common_subsequence(s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

        return dp[m][n]

    @staticmethod
    def edit_distance(s1: str, s2: str) -> int:
        m, n = len(s1), len(s2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]

        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])

        return dp[m][n]


class DataStructures:
    @staticmethod
    def binary_search_tree() -> Dict[str, Any]:
        return {
            "type": "BST",
            "insert": "O(log n) average, O(n) worst",
            "search": "O(log n) average, O(n) worst",
            "delete": "O(log n) average, O(n) worst",
        }

    @staticmethod
    def avl_tree() -> Dict[str, str]:
        return {
            "type": "AVL",
            "insert": "O(log n)",
            "search": "O(log n)",
            "delete": "O(log n)",
            "balance": "Self-balancing",
        }

    @staticmethod
    def hashmap() -> Dict[str, str]:
        return {
            "type": "HashMap",
            "insert": "O(1) average, O(n) worst",
            "search": "O(1) average, O(n) worst",
            "delete": "O(1) average, O(n) worst",
        }


class AlgorithmLibrary:
    def __init__(self):
        self._sorting = SortingAlgorithms()
        self._search = SearchAlgorithms()
        self._dp = DynamicProgramming()
        self._ds = DataStructures()

    def get_algorithm(self, name: str) -> Optional[Callable]:
        algorithms = {
            "quicksort": self._sorting.quicksort,
            "mergesort": self._sorting.mergesort,
            "heapsort": self._sorting.heapsort,
            "bubblesort": self._sorting.bubblesort,
            "binary_search": self._search.binary_search,
            "bfs": self._search.bfs,
            "dfs": self._search.dfs,
            "dijkstra": self._search.dijkstra,
            "fibonacci": self._dp.fibonacci,
            "fibonacci_memo": self._dp.fibonacci_memo,
            "knapsack": self._dp.knapsack,
            "lcs": self._dp.longest_common_subsequence,
            "edit_distance": self._dp.edit_distance,
        }
        return algorithms.get(name.lower())

    def list_algorithms(self) -> List[str]:
        return [
            "Sorting: quicksort, mergesort, heapsort, bubblesort",
            "Search: binary_search, bfs, dfs, dijkstra",
            "Dynamic Programming: fibonacci, knapsack, lcs, edit_distance",
        ]


__all__ = [
    "AlgorithmResult",
    "SortingAlgorithms",
    "SearchAlgorithms",
    "DynamicProgramming",
    "DataStructures",
    "AlgorithmLibrary",
]
