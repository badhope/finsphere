---
id: prompt-debugging-quickfix-001
name: Quick Fix - 程序崩溃急救
summary: 快速修复 - 程序崩溃急救
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: debugging
sub_category: quick-fix
tags:
  - quick-fix
  - crash
  - emergency
  - beginner-friendly
intent: |
  帮助用户快速修复程序崩溃问题，提供即时的错误诊断和解决方案。
applicable_models:
  - "*"
input_requirements:
  - error_message: string (required) 完整的错误信息
  - code_snippet: string (optional) 导致崩溃的代码片段
  - context: string (optional) 崩溃前正在做什么
output_requirements:
  - root_cause: string 根本原因分析
  - fix_steps: list 修复步骤（按顺序）
  - fixed_code: string 修复后的代码
  - verification: string 如何验证修复成功
anti_patterns: |
  - 不要忽略错误信息
  - 不要只改表面症状不解决根本原因
---

# 快速修复：程序崩溃急救

## 🚨 程序崩溃了？别慌！

把错误信息粘贴给我，我来帮你修复。

## 🔴 崩溃类型快速诊断

| 崩溃特征 | 可能原因 | 快速检查 |
|---------|---------|---------|
| `FileNotFoundError` | 文件路径错误 | 检查文件名和路径 |
| `PermissionError` | 权限不足 | 尝试管理员运行 |
| `MemoryError` | 内存不足 | 减少数据量 |
| `RecursionError` | 无限循环 | 检查递归终止条件 |
| `ImportError` | 模块未安装 | pip install xxx |

## 🛠️ 修复流程

### 第一步：复制错误信息
完整复制红色错误文字，看起来像：
```
Traceback (most recent call last):
  File "main.py", line 10, in <module>
    result = 10 / 0
ZeroDivisionError: division by zero
```

### 第二步：定位问题行
看最后一行：
- `ZeroDivisionError` = 数学运算错误（除以零）
- `IndexError` = 列表访问越界
- `KeyError` = 字典键不存在

### 第三步：修复代码
常见修复方法：

```python
# 原来（崩溃）
result = numbers[i]  # i可能超出范围

# 修复后（安全）
if i < len(numbers):
    result = numbers[i]
else:
    result = 0  # 默认值
```

## 🎯 常见崩溃场景修复

### 场景1：除法崩溃
```python
# 崩溃
result = x / y

# 修复
result = x / y if y != 0 else 0
```

### 场景2：列表崩溃
```python
# 崩溃
item = my_list[100]

# 修复
item = my_list[100] if len(my_list) > 100 else None
```

### 场景3：文件崩溃
```python
# 崩溃
with open("data.txt") as f:
    content = f.read()

# 修复
import os
if os.path.exists("data.txt"):
    with open("data.txt") as f:
        content = f.read()
else:
    content = ""
```

---

**粘贴你的错误信息，我来帮你修复！**
