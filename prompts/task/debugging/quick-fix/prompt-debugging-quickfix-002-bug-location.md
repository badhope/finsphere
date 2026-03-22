---
id: prompt-debugging-quickfix-002
name: Quick Fix - Bug搜索与定位
summary: 快速修复 - Bug搜索与定位
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: debugging
sub_category: quick-fix
tags:
  - quick-fix
  - bug
  - search
  - locate
intent: |
  帮助用户系统性地搜索和定位Bug的根源。
applicable_models:
  - "*"
input_requirements:
  - problem_description: string (required) 问题描述（预期行为 vs 实际行为）
  - code: string (required) 相关代码
  - error_log: string (optional) 错误日志
output_requirements:
  - likely_causes: list 可能的Bug原因（按概率排序）
  - investigation_steps: list 调查步骤
  - root_cause: string 最终确定的根本原因
  - fix_suggestion: string 修复建议
---

# 快速修复：Bug搜索与定位

## 🔍 系统性Bug定位方法

## 第一步：明确问题

回答这两个问题：
1. **预期行为**：代码应该做什么？
2. **实际行为**：代码实际做了什么？

## 第二步：缩小范围

### 二分查找法
把代码分成两半，分别测试哪一半有问题：
```
代码 = A + B + C + D + E
     = (A + B) + (C + D + E)
     = 哪组有问题？
     = 继续二分...
```

### 打印调试法
在关键位置添加print语句：
```python
def calculate(items):
    print(f"输入: {items}")  # 检查输入
    result = 0
    for item in items:
        result += item
        print(f"累加中: {result}")  # 检查过程
    print(f"最终结果: {result}")  # 检查输出
    return result
```

## 第三步：常见Bug模式

| Bug类型 | 典型症状 | 检查方法 |
|---------|---------|---------|
| 逻辑错误 | 结果不对 | 逐行跟踪变量值 |
| 边界错误 | 大数据崩溃 | 测试极端情况 |
| 状态错误 | 第二次运行失败 | 检查变量初始化 |
| 时序错误 | 偶发崩溃 | 添加日志时间戳 |

## 🎯 快速检查清单

- [ ] 变量初始化了吗？
- [ ] 循环边界正确吗？（i < n 还是 i <= n？）
- [ ] 列表/字典访问前检查长度/键存在吗？
- [ ] 字符串拼接正确吗？
- [ ] 条件判断的逻辑运算符对吗？（and/or/not）

## 💡 黄金法则

> "如果程序行为不符合预期，**一定**是某处代码与你想的不一样。"

把代码发给我，我帮你逐行分析！
