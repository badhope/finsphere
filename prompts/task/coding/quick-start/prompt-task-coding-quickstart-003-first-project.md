---
id: prompt-coding-quickstart-003
name: Quick Start - Build Your First Project
summary: 快速上手 - 构建你的第一个项目
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: coding
sub_category: quick-start
tags:
  - quick-start
  - beginner
  - project
  - first-project
intent: |
  引导初学者构建一个完整的最小可运行项目。
applicable_models:
  - "*"
input_requirements:
  - project_type: string (required) 项目类型（计算器、待办清单、记事本等）
  - language: string (optional) 偏好的编程语言
  - features: string (optional) 想要的功能列表
output_requirements:
  - project_structure: string 项目文件结构
  - code_files: object 各文件的代码内容
  - setup_instructions: string 如何运行项目
  - next_steps: string 后续扩展建议
---

# 快速开始：构建你的第一个项目

## 🚀 选择你的项目类型

| 项目类型 | 难度 | 说明 |
|---------|------|------|
| 计算器 | ⭐ | 四则运算入门 |
| 待办清单 | ⭐⭐ | 列表操作+持久化 |
| 猜数字游戏 | ⭐ | 随机数+循环 |
| 记事本 | ⭐⭐⭐ | 文件读写+界面 |
| 天气查询 | ⭐⭐ | API调用 |

## 📦 项目结构模板

无论选择什么项目，结构都类似：

```
my-project/
├── main.py          # 入口文件
├── utils.py         # 工具函数
├── data/            # 数据文件
├── README.md        # 说明文档
└── requirements.txt # 依赖列表
```

## 🎯 推荐的第一个项目：待办清单

### 最小可用版本

```python
# main.py
todos = []

while True:
    print("\n=== 我的待办清单 ===")
    print("1. 查看任务")
    print("2. 添加任务")
    print("3. 删除任务")
    print("4. 退出")
    
    choice = input("选择操作: ")
    
    if choice == "1":
        for i, todo in enumerate(todos, 1):
            print(f"{i}. {todo}")
    elif choice == "2":
        task = input("新任务: ")
        todos.append(task)
        print("已添加!")
    elif choice == "3":
        num = int(input("任务编号: "))
        if 0 < num <= len(todos):
            todos.pop(num - 1)
            print("已删除!")
    elif choice == "4":
        print("再见!")
        break
```

### 如何运行
```bash
python main.py
```

---

## 📚 学习路径建议

```
Week 1: 变量、输入输出、基础运算
Week 2: 条件判断、循环
Week 3: 列表、字典
Week 4: 函数、模块
Week 5: 文件操作
Week 6: 构建小项目
```

---

告诉我你想做什么项目，我来帮你生成完整代码！
