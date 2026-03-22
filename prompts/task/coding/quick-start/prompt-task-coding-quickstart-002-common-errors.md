---
id: prompt-coding-quickstart-002
name: Quick Start - Fix Common Errors
summary: 快速上手 - 修复常见错误
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: coding
sub_category: quick-start
tags:
  - quick-start
  - beginner
  - error-fix
  - common-errors
intent: |
  帮助初学者快速修复最常见的编程错误。
applicable_models:
  - "*"
input_requirements:
  - error_message: string (required) 错误提示信息
  - code: string (optional) 引起错误的代码
  - what_was_trying_to_do: string (optional) 尝试实现的功能
output_requirements:
  - diagnosis: string 错误原因诊断
  - solution: string 修复方案
  - fixed_code: string (optional) 修复后的代码
  - prevention_tip: string 如何避免类似错误
usage_example: |
  用户输入：
  - 错误信息："SyntaxError: invalid syntax"
  - 代码："print("Hello World)"

  AI输出：
  - 诊断：缺少右引号
  - 解决方案：在World后面加引号
  - 修复代码："print("Hello World")"
---

# 快速开始：修复常见错误

## 🎯 你遇到了什么错误？

把错误信息粘贴给我，或者描述你遇到的问题。

## 🔧 5个最常见的错误及修复方法

### 1️⃣ 缺少引号或括号
**错误**：`print("Hello World)`
**原因**：字符串的右引号不见了
**修复**：`print("Hello World")`

### 2️⃣ 变量名拼写错误
**错误**：`print(myVariable)` 但实际定义的是 `myvariable`
**原因**：Python区分大小写
**修复**：保持大小写一致

### 3️⃣ 除法与整除混淆
**错误**：`result = 10 / 3` 得到 `3.333...` 而不是 `3`
**原因**：`/` 是浮点除法，`//` 才是整数除法
**修复**：根据需求选择正确的运算符

### 4️⃣ 列表索引越界
**错误**：`list[3]` 但列表只有3个元素（索引0,1,2）
**原因**：索引从0开始
**修复**：检查列表长度或使用正确的索引

### 5️⃣ 缩进错误
**错误**：`if x > 0:\n    print(x)\nprint("done")` 第三行不应该缩进
**原因**：Python靠缩进确定代码块
**修复**：确保条件语句后的代码有正确缩进

---

## 💬 常见错误急救包

| 错误关键词 | 可能原因 | 快速修复 |
|-----------|---------|---------|
| `SyntaxError` | 语法错误 | 检查引号、括号、拼写 |
| `NameError` | 变量未定义 | 检查变量名拼写 |
| `TypeError` | 类型不匹配 | 检查数据类型 |
| `IndexError` | 索引越界 | 索引从0开始 |
| `IndentationError` | 缩进错误 | 用4个空格或Tab |

---

把的错误信息发给我，我来帮你诊断和修复！
