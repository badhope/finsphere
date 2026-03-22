---
id: prompt-coding-quickstart-001
name: Quick Start - Generate Your First Code
summary: 快速上手 - 从零生成第一个代码
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: coding
sub_category: quick-start
tags:
  - quick-start
  - beginner
  - first-code
  - getting-started
intent: |
  帮助零基础用户快速生成第一段代码，提供最简单的入门指引。
applicable_models:
  - "*"
input_requirements:
  - task: string (required) 你想实现什么功能？（用中文描述）
  - language: string (optional) 编程语言偏好，如不填写则由AI推荐
output_requirements:
  - code: string 生成的代码
  - explanation: string 逐行解释代码含义
  - tip: string 给初学者的实用建议
usage_example: |
  用户输入：
  - 任务："我想写一个计算器"
  - 语言：Python

  AI输出：
  - 代码：简单的四则运算计算器代码
  - 解释：每行代码的作用
  - 建议：如何运行和测试代码
---

# 快速开始：生成你的第一段代码

## 🎯 你想要做什么？

只需要告诉我：
1. **任务**：你想实现什么功能？
2. **语言**（可选）：你想用什么编程语言？

## 📝 示例对话

**用户**：我想写一个计算两个数相加的程序

**AI**：当然！我来帮你生成代码：

```python
# 这是一个简单的加法计算器
a = 10
b = 20
result = a + b
print(f"{a} + {b} = {result}")
```

### 代码解释
| 代码 | 含义 |
|------|------|
| `a = 10` | 把数字10存入变量a |
| `b = 20` | 把数字20存入变量b |
| `result = a + b` | 计算a和b的和，存入result |
| `print(...)` | 把结果打印出来 |

### 🚀 运行方法
```bash
python calculator.py
```

### 💡 初学者建议
- 变量就像一个盒子，给它起个名字就能存放数据
- `print()` 会在屏幕上显示内容
- 试试改成 `-`、`*`、`/` 来做减法、乘法、除法

---

现在轮到你告诉我你想做什么？
