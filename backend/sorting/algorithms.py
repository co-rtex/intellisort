# backend/sorting/algorithms.py
from __future__ import annotations
from typing import List, Tuple, Dict
import random
import time
import math

Distribution = str

SUPPORTED_ALGORITHMS: Dict[str, Dict] = {
    "bubble_sort": {
        "label": "Bubble Sort",
        "best": "O(n)",
        "average": "O(n^2)",
        "worst": "O(n^2)",
        "space": "O(1)",
        "description": "Repeatedly swaps adjacent out-of-order elements."
    },
    "insertion_sort": {
        "label": "Insertion Sort",
        "best": "O(n)",
        "average": "O(n^2)",
        "worst": "O(n^2)",
        "space": "O(1)",
        "description": "Builds sorted portion one element at a time."
    },
    "selection_sort": {
        "label": "Selection Sort",
        "best": "O(n^2)",
        "average": "O(n^2)",
        "worst": "O(n^2)",
        "space": "O(1)",
        "description": "Repeatedly selects minimum from unsorted part."
    },
    "merge_sort": {
        "label": "Merge Sort",
        "best": "O(n log n)",
        "average": "O(n log n)",
        "worst": "O(n log n)",
        "space": "O(n)",
        "description": "Divide-and-conquer using merging of sorted halves."
    },
    "quick_sort": {
        "label": "Quick Sort",
        "best": "O(n log n)",
        "average": "O(n log n)",
        "worst": "O(n^2)",
        "space": "O(log n)",
        "description": "Partition-based divide-and-conquer; fast in practice."
    },
    "heap_sort": {
        "label": "Heap Sort",
        "best": "O(n log n)",
        "average": "O(n log n)",
        "worst": "O(n log n)",
        "space": "O(1)",
        "description": "Builds a heap to repeatedly select max element."
    },
}

DISTRIBUTIONS = ["random", "sorted", "reverse",
                 "nearly_sorted", "many_duplicates"]


def generate_array(n: int, distribution: Distribution) -> List[int]:
    base = list(range(1, n + 1))
    if distribution == "random":
        random.shuffle(base)
        return base
    if distribution == "sorted":
        return base
    if distribution == "reverse":
        return list(reversed(base))
    if distribution == "nearly_sorted":
        base = base[:]  # already sorted
        swaps = max(1, n // 10)
        for _ in range(swaps):
            i = random.randint(0, n - 1)
            j = random.randint(0, n - 1)
            base[i], base[j] = base[j], base[i]
        return base
    if distribution == "many_duplicates":
        return [random.randint(1, max(2, n // 5)) for _ in range(n)]
    return base


def maybe_record_step(steps: List[List[int]], arr: List[int], step_interval: int, step_count: int):
    if step_interval <= 0:
        return
    if step_count % step_interval == 0:
        steps.append(list(arr))


def bubble_sort(arr: List[int], record_steps: bool) -> Tuple[List[int], int, int, List[List[int]]]:
    a = list(arr)
    n = len(a)
    comps = swaps = 0
    steps: List[List[int]] = []
    max_states = 300
    step_interval = max(1, (n * n) // max_states)
    step_counter = 0
    if record_steps:
        steps.append(list(a))
    for i in range(n):
        for j in range(0, n - i - 1):
            comps += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
            if record_steps:
                step_counter += 1
                maybe_record_step(steps, a, step_interval, step_counter)
    if record_steps:
        steps.append(list(a))
    return a, comps, swaps, steps


def insertion_sort(arr: List[int], record_steps: bool) -> Tuple[List[int], int, int, List[List[int]]]:
    a = list(arr)
    comps = swaps = 0
    steps: List[List[int]] = []
    max_states = 300
    n = len(a)
    step_interval = max(1, (n * n) // max_states)
    step_counter = 0
    if record_steps:
        steps.append(list(a))
    for i in range(1, n):
        key = a[i]
        j = i - 1
        while j >= 0:
            comps += 1
            if a[j] > key:
                a[j + 1] = a[j]
                swaps += 1
                j -= 1
            else:
                break
            if record_steps:
                step_counter += 1
                maybe_record_step(steps, a, step_interval, step_counter)
        a[j + 1] = key
        if record_steps:
            step_counter += 1
            maybe_record_step(steps, a, step_interval, step_counter)
    if record_steps:
        steps.append(list(a))
    return a, comps, swaps, steps


def selection_sort(arr: List[int], record_steps: bool) -> Tuple[List[int], int, int, List[List[int]]]:
    a = list(arr)
    n = len(a)
    comps = swaps = 0
    steps: List[List[int]] = []
    max_states = 300
    step_interval = max(1, (n * n) // max_states)
    step_counter = 0
    if record_steps:
        steps.append(list(a))
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comps += 1
            if a[j] < a[min_idx]:
                min_idx = j
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
            swaps += 1
        if record_steps:
            step_counter += 1
            maybe_record_step(steps, a, step_interval, step_counter)
    if record_steps:
        steps.append(list(a))
    return a, comps, swaps, steps


def merge_sort(arr: List[int], record_steps: bool) -> Tuple[List[int], int, int, List[List[int]]]:
    a = list(arr)
    comps = swaps = 0
    steps: List[List[int]] = []
    max_states = 300
    approx_ops = len(a) * max(1, int(math.log2(len(a) or 1))) * 2
    step_interval = max(1, approx_ops // max_states)
    step_counter = 0

    def merge_sort_rec(l: int, r: int):
        nonlocal comps, swaps, step_counter
        if l >= r:
            return
        m = (l + r) // 2
        merge_sort_rec(l, m)
        merge_sort_rec(m + 1, r)
        temp = []
        i, j = l, m + 1
        while i <= m and j <= r:
            comps += 1
            if a[i] <= a[j]:
                temp.append(a[i])
                i += 1
            else:
                temp.append(a[j])
                j += 1
            swaps += 1
            if record_steps:
                step_counter += 1
                maybe_record_step(steps, a, step_interval, step_counter)
        while i <= m:
            temp.append(a[i])
            i += 1
            swaps += 1
        while j <= r:
            temp.append(a[j])
            j += 1
            swaps += 1
        a[l:r+1] = temp
        if record_steps:
            step_counter += 1
            maybe_record_step(steps, a, step_interval, step_counter)

    if record_steps:
        steps.append(list(a))
    merge_sort_rec(0, len(a) - 1)
    if record_steps:
        steps.append(list(a))
    return a, comps, swaps, steps


def quick_sort(arr: List[int], record_steps: bool) -> Tuple[List[int], int, int, List[List[int]]]:
    a = list(arr)
    comps = swaps = 0
    steps: List[List[int]] = []
    approx_ops = len(a) * max(1, int(math.log2(len(a) or 1))) * 2
    max_states = 300
    step_interval = max(1, approx_ops // max_states)
    step_counter = 0

    def partition(low: int, high: int) -> int:
        nonlocal comps, swaps, step_counter
        pivot = a[high]
        i = low - 1
        for j in range(low, high):
            comps += 1
            if a[j] < pivot:
                i += 1
                a[i], a[j] = a[j], a[i]
                swaps += 1
            if record_steps:
                step_counter += 1
                maybe_record_step(steps, a, step_interval, step_counter)
        a[i + 1], a[high] = a[high], a[i + 1]
        swaps += 1
        if record_steps:
            step_counter += 1
            maybe_record_step(steps, a, step_interval, step_counter)
        return i + 1

    def qs(low: int, high: int):
        if low < high:
            pi = partition(low, high)
            qs(low, pi - 1)
            qs(pi + 1, high)

    if record_steps:
        steps.append(list(a))
    qs(0, len(a) - 1)
    if record_steps:
        steps.append(list(a))
    return a, comps, swaps, steps


def heap_sort(arr: List[int], record_steps: bool) -> Tuple[List[int], int, int, List[List[int]]]:
    a = list(arr)
    n = len(a)
    comps = swaps = 0
    steps: List[List[int]] = []
    max_states = 300
    approx_ops = n * max(1, int(math.log2(n or 1))) * 2
    step_interval = max(1, approx_ops // max_states)
    step_counter = 0

    def heapify(nh: int, i: int):
        nonlocal comps, swaps, step_counter
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2

        if l < nh:
            comps += 1
            if a[l] > a[largest]:
                largest = l
        if r < nh:
            comps += 1
            if a[r] > a[largest]:
                largest = r
        if largest != i:
            a[i], a[largest] = a[largest], a[i]
            swaps += 1
            if record_steps:
                step_counter += 1
                maybe_record_step(steps, a, step_interval, step_counter)
            heapify(nh, largest)

    if record_steps:
        steps.append(list(a))
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    # Extract elements
    for i in range(n - 1, 0, -1):
        a[i], a[0] = a[0], a[i]
        swaps += 1
        if record_steps:
            step_counter += 1
            maybe_record_step(steps, a, step_interval, step_counter)
        heapify(i, 0)
    if record_steps:
        steps.append(list(a))
    return a, comps, swaps, steps


def run_sort(algorithm: str, arr: List[int], record_steps: bool):
    func_map = {
        "bubble_sort": bubble_sort,
        "insertion_sort": insertion_sort,
        "selection_sort": selection_sort,
        "merge_sort": merge_sort,
        "quick_sort": quick_sort,
        "heap_sort": heap_sort,
    }
    if algorithm not in func_map:
        raise ValueError(f"Unsupported algorithm: {algorithm}")
    start = time.perf_counter()
    sorted_arr, comps, swaps, steps = func_map[algorithm](arr, record_steps)
    end = time.perf_counter()
    runtime_ms = (end - start) * 1000.0
    return sorted_arr, comps, swaps, runtime_ms, steps
