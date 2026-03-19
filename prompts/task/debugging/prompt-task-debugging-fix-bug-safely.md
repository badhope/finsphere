---
id: prompt-task-debugging-fix-bug-safely-v1
name: Fix Bug Safely
summary: 谨慎地修复 bug，强调最小改动、可验证和可回滚
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: task
sub_category: debugging
tags: [debugging, fix, bug-fix, safe-modification, regression-prevention]
keywords: [安全修复, Bug 修复, 谨慎修复, 代码修改]
intent: 在理解根因和修复计划后，安全地实施代码修复，确保最小改动和完整验证
applicable_models:
  - gpt-4
  - gpt-4-turbo
  - claude-3-opus
  - claude-3-sonnet
  - qwen-max
  - qwen-plus
  - deepseek-v3
  - minimax-large
input_requirements:
  - bug_description: string (必填) Bug 描述
  - root_cause: string (必填) 根因分析
  - original_code: string (必填) 原始代码
  - fix_plan: string (可选) 修复计划
  - constraints: object (可选) 约束条件
output_requirements:
  - fix_report: object 包含：
    - modified_code: string 修改后的代码
    - changes_summary: string 改动总结
    - change_scope: array 改动范围
    - test_cases: array 新增/修改的测试用例
    - risk_notes: string 风险说明
tool_requirements:
  - 代码执行环境（用于验证）
preconditions:
  - 根因应该已经被确定
  - 应该理解原始代码
anti_patterns:
  - 不要做超出必要的改动
  - 不要忽略相关的测试用例
  - 不要假设改动没有副作用
  - 不要跳过验证步骤
failure_modes:
  - 改动范围超出预期时：重新评估并调整
  - 验证失败时：分析原因并调整修复方案
  - 引入新问题时：立即回滚并重新分析
self_check: |
  修复前检查：
  □ 是否理解了完整的根因
  □ 改动是否在最小范围内
  □ 是否准备了回滚方案
  □ 是否有验证标准
  □ 是否更新了测试用例
related_skills:
  - skill-debugging-fix
  - skill-coding-code-generation
  - skill-coding-test-generation
related_workflows:
  - workflow-sequential-bug-fix
  - workflow-multi-step-debugging
related_prompts:
  - prompt-task-debugging-identify-root-cause
  - prompt-task-debugging-generate-debug-plan
  - prompt-task-debugging-verify-fix-after-change
---

# Context

你是一个资深调试专家，负责安全地实施 bug 修复。这个 Prompt 强调：
1. 最小改动原则
2. 可验证性
3. 可回滚性
4. 完整的测试覆盖

# Prompt Body

## 阶段 1：理解上下文

### 1.1 问题理解

```markdown
## 问题理解

### Bug 描述
[完整描述这个 bug]

### 根因
[已确定的根本原因]

### 影响范围
| 影响点 | 说明 |
|--------|------|
| 功能 A | ... |
| 模块 B | ... |
```

### 1.2 原始代码

```markdown
## 原始代码

```[语言]
[完整的原始代码]
```

### 代码位置
- 文件：
- 函数/类：
- 行号范围：
```

### 1.3 约束条件

```markdown
## 约束条件

### 必须遵守
- [约束 1]
- [约束 2]

### 必须满足
- [质量要求 1]
- [质量要求 2]
```

## 阶段 2：修复设计

### 2.1 修复方案

```markdown
## 修复方案

### 方案描述
[详细的修复方案]

### 改动策略
| 策略 | 选择 | 理由 |
|------|------|------|
| 最小改动 | ✅ | 降低风险 |
| 完全重构 | ❌ | 风险过高 |

### 预期效果
[修复后的预期效果]
```

### 2.2 改动范围

```markdown
## 改动范围

### 必须改动
| 位置 | 改动内容 | 理由 |
|------|----------|------|
| 文件 A | 改动 1 | 修复根因 |
| 文件 B | 改动 2 | ... |

### 可能受影响
| 位置 | 潜在影响 | 需要验证 |
|--------|----------|----------|
| 文件 C | 影响 1 | ✅ |
| 文件 D | 影响 2 | ✅ |

### 不应改动
| 位置 | 理由 |
|------|------|
| 文件 E | 不相关 |
```

### 2.3 风险评估

```markdown
## 风险评估

| # | 风险描述 | 可能性 | 影响 | 等级 | 缓解 |
|---|----------|--------|------|------|------|
| R1 | 引入新 bug | 中 | 高 | 🔴 | 完整测试 |
| R2 | 回归问题 | 低 | 高 | 🟡 | 回归测试 |
| R3 | 性能影响 | 低 | 中 | 🟢 | 性能测试 |

### 回滚方案
[如果修复失败，如何回滚]
```

## 阶段 3：实施修复

### 3.1 修复步骤

```markdown
## 修复步骤

### 步骤 1: 备份当前代码
```bash
# 备份原始代码
cp [file] [file].backup
```

### 步骤 2: 实施修复
[具体的代码修改]

### 步骤 3: 验证语法
```bash
# 验证代码语法
[验证命令]
```

### 步骤 4: 运行测试
```bash
# 运行相关测试
[测试命令]
```
```

### 3.2 修改后的代码

```markdown
## 修改后的代码

```[语言]
/**
 * [文件/函数名] - [修改说明]
 *
 * 修改内容：
 * - [改动点 1]
 * - [改动点 2]
 *
 * @date 2026-03-19
 */
[修改后的完整代码]
```
```

### 3.3 改动对比

```markdown
## 改动对比

```diff
- [删除的行]
+ [新增的行]
```

### 改动统计
- 删除行数：X
- 新增行数：Y
- 净改动：Z 行
```

## 阶段 4：测试更新

### 4.1 新增测试用例

```markdown
## 新增测试用例

### 用例 1: [覆盖的场景]
```[测试框架]
[测试代码]
```
- **输入**：[测试输入]
- **预期输出**：[预期结果]
- **覆盖的 bug**：根因 X
```

### 4.2 修改的测试用例

```markdown
## 修改的测试用例

### 用例: [测试名称]
- **修改前**：...[原测试内容]
- **修改后**：...[新测试内容]
- **修改理由**：...
```

### 4.3 完整测试矩阵

```markdown
## 测试矩阵

| 测试用例 | 类型 | 覆盖点 | 状态 |
|----------|------|--------|------|
| test_normal | 正常 | 核心逻辑 | ✅ |
| test_boundary | 边界 | 边界条件 | ✅ |
| test_error | 错误 | 错误处理 | ✅ |
| test_regression | 回归 | 原功能 | ✅ |
```

## 阶段 5：验证执行

### 5.1 验证清单

```markdown
## 验证清单

- [ ] 代码语法正确
- [ ] 新增单元测试通过
- [ ] 修改的单元测试通过
- [ ] 相关集成测试通过
- [ ] 回归测试通过
- [ ] 手动功能验证通过
- [ ] 性能无明显退化
```

### 5.2 验证结果

```markdown
## 验证结果

### 单元测试
```
[测试输出]
```

### 集成测试
```
[测试输出]
```

### 回归测试
```
[测试输出]
```
```

## 阶段 6：输出报告

### 6.1 修复报告

```markdown
# Bug 修复报告

## Bug 信息
- **ID**：[Bug ID]
- **描述**：[一句话描述]
- **根因**：[根本原因]
- **严重程度**：[高/中/低]

## 修复信息
- **修复日期**：[日期]
- **修复人**：[姓名]
- **修复版本**：[版本号]

## 改动范围
| 类型 | 数量 |
|------|------|
| 修改文件 | X |
| 新增行数 | X |
| 删除行数 | X |
| 新增测试 | X |
| 修改测试 | X |

## 验证结果
| 测试类型 | 结果 | 覆盖率 |
|----------|------|--------|
| 单元测试 | ✅ 通过 | X% |
| 集成测试 | ✅ 通过 | X% |
| 回归测试 | ✅ 通过 | X% |
| 手动验证 | ✅ 通过 | - |

## 风险评估
- **风险等级**：🔴 高 / 🟡 中 / 🟢 低
- **缓解措施**：已执行完整测试

## 结论
[修复是否成功，是否可以发布]
```

### 6.2 经验总结

```markdown
## 经验总结

### 根因分析学到
[从这次 bug 学到的]

### 修复过程学到
[从修复过程学到的]

### 预防措施
[如何防止类似问题再次发生]
```

# Variables

| 变量名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| bug_description | string | 是 | Bug 描述 |
| root_cause | string | 是 | 根因分析 |
| original_code | string | 是 | 原始代码 |
| fix_plan | string | 否 | 修复计划 |
| constraints | object | 否 | 约束条件 |

# Usage Notes

1. **前置条件**：应在 identify-root-cause 和 generate-debug-plan 之后使用
2. **最小改动**：始终遵循最小改动原则
3. **完整测试**：确保测试覆盖所有场景
4. **可回滚**：始终准备回滚方案
