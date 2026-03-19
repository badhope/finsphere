# AI Skill & Prompt Repository

一个面向人类和 AI 的可检索、可组合、可扩展的 Skill/Prompt/Workflow 仓库。

---

## 一句话定位

存储和组织 AI Prompts、Skills、Workflows、Tool-Use 指南的模块化仓库，支持人类快速查找和 AI 自动路由组合。

---

## 面向人类的快速入口

### 我是新手，想快速上手
1. 看 [快速导航](#快速导航)
2. 读 [prompts/INDEX.md](prompts/INDEX.md)
3. 按场景找对应的 Prompt 或 Workflow

### 我想...
| 目标 | 去哪里 | 说明 |
|------|--------|------|
| 让 AI 帮我写代码 | [prompts/task/coding/](prompts/task/coding/) | 生成代码、审查代码 |
| 让 AI 帮我修 Bug | [prompts/task/debugging/](prompts/task/debugging/) | 4 步调试流程 |
| 让 AI 帮我分析项目 | [prompts/task/repo-analysis/](prompts/task/repo-analysis/) | 结构分析、定位文件 |
| 让 AI 帮我做计划 | [prompts/task/planning/](prompts/task/planning/) | 任务分解、执行计划 |
| 让 AI 做多步骤任务 | [prompts/workflow/](prompts/workflow/) | 10 个标准工作流 |
| 让 AI 输出特定格式 | [prompts/output/](prompts/output/) | JSON/YAML/表格/报告 |
| 优化一个 Prompt | [prompts/meta/](prompts/meta/) | 8 个 Prompt 工程工具 |

---

## 面向 AI 的快速入口

### AI 读取顺序

```
1. README.md（本文件）        → 了解仓库定位
2. prompts/INDEX.md          → 了解 Prompts 结构
3. prompts/_routing/         → 学会自主路由
4. AI-USAGE.md               → 了解如何使用这个仓库
5. AI-BOOTSTRAP.md           → 启动引导
```

### AI 核心能力

| 能力 | 对应文件 |
|------|----------|
| 扫描仓库构建任务地图 | `prompts/_routing/scan-repository-and-build-task-map` |
| 识别任务类型并路由 | `prompts/_routing/identify-task-type-and-route` |
| 选择相关 Prompts | `prompts/_routing/select-relevant-prompts-from-index` |
| 组合多个 Prompts | `prompts/_routing/compose-multiple-prompts-for-one-task` |
| 工具调用指南 | `prompts/tool-use/*` |
| 输出格式控制 | `prompts/output/*` |
| Prompt 自我优化 | `prompts/meta/*` |

---

## 核心目录说明

```
skill/
├── README.md              ← 仓库入口（你在这里）
├── INDEX.md               ← 全局索引
│
├── prompts/               ← 核心 Prompts 仓库
│   ├── _routing/         ← AI 自主路由（AI 必读）
│   ├── _core/            ← 核心规范（字段规格、写作标准）
│   ├── system/           ← 系统级提示词
│   ├── task/             ← 任务型提示词
│   │   ├── coding/       ← 编程类
│   │   ├── debugging/    ← 调试类
│   │   ├── repo-analysis/← 仓库分析类
│   │   ├── planning/     ← 规划类
│   │   └── research/     ← 研究类
│   ├── workflow/         ← 工作流提示词
│   ├── tool-use/         ← 工具调用提示词
│   ├── output/           ← 输出格式提示词
│   ├── meta/             ← Prompt 工程提示词
│   ├── INDEX.md          ← Prompts 仓库索引
│   └── README.md         ← Prompts 仓库说明
│
├── .trae/skills/          ← Trae IDE 可直接导入的 Skills
│   ├── coding/           ← 编程 Skill
│   ├── debugging/        ← 调试 Skill
│   ├── repo-analysis/    ← 仓库分析 Skill
│   ├── planning/         ← 规划 Skill
│   ├── research/         ← 研究 Skill
│   ├── workflows/        ← 工作流 Skill
│   ├── system-prompts/   ← 系统提示 Skill
│   └── ai-routing/       ← AI 路由 Skill
│
├── docs/                  ← 文档和指南
│   └── guides/           ← 规范性文档
│       ├── SPEC.md       ← 完整规范
│       ├── prompt-template.md
│       ├── skill-template.md
│       └── workflow-template.md
│
├── registry/              ← 注册表（供 AI 检索）
│   ├── prompts-registry.md
│   ├── skills-registry.md
│   ├── workflows-registry.md
│   ├── tags-registry.md
│   └── relations-registry.md
│
├── skills/                ← 独立 Skills（可单独使用）
│   ├── coding/
│   └── writing/
│
├── AI-USAGE.md           ← AI 使用指南（新增）
├── AI-ROUTING.md         ← AI 路由指南（新增）
├── AI-BOOTSTRAP.md       ← AI 启动引导（新增）
├── CONTRIBUTING.md        ← 贡献指南
├── LICENSE                ← 双许可文件
└── LICENSE-CODE           ← 代码许可（Apache-2.0）
└── LICENSE-CONTENT        ← 内容许可（CC BY 4.0）
```

---

## 按任务分类的导航方式

### 编码任务
```
task/coding/
├── generate-code-from-requirement.md   ← 从需求生成代码
├── implement-feature-from-spec.md     ← 从规格实现功能
└── review-code-for-quality.md         ← 代码质量审查
```

### 调试任务
```
task/debugging/
├── identify-root-cause.md             ← 识别根因
├── generate-debug-plan.md            ← 生成调试计划
├── fix-bug-safely.md                  ← 安全修复
└── verify-fix-after-change.md         ← 验证修复
```

### 复杂工作流
```
workflow/
├── bug-investigation-workflow.md      ← Bug 调查流程
├── feature-implementation-workflow.md← 功能实现流程
├── new-repo-onboarding-workflow.md   ← 新项目接手
├── research-to-summary-workflow.md    ← 研究总结流程
└── vague-request-to-action-workflow.md← 模糊需求转具体
```

---

## 按类型分类的导航方式

| 类型 | 目录 | 说明 |
|------|------|------|
| 路由 | `prompts/_routing/` | AI 自动选择和组合 Prompts |
| 系统 | `prompts/system/` | 定义 AI 基础行为 |
| 任务 | `prompts/task/` | 具体任务执行 |
| 工作流 | `prompts/workflow/` | 多步骤流程 |
| 工具 | `prompts/tool-use/` | 工具调用指导 |
| 输出 | `prompts/output/` | 输出格式控制 |
| 元 | `prompts/meta/` | Prompt 工程工具 |

---

## 推荐起步顺序

### 人类用户
```
1. README.md（本文档）     → 了解仓库
2. prompts/INDEX.md        → 了解 Prompts 结构
3. 按场景选择目录          → 开始使用
```

### AI 助手
```
1. README.md               → 了解仓库定位
2. prompts/INDEX.md        → 理解 Prompts 结构
3. prompts/_routing/       → 学会路由选择
4. AI-BOOTSTRAP.md         → 启动流程
5. AI-USAGE.md             → 完整使用指南
```

---

## prompts/ 使用说明

### 字段结构

每个 Prompt 文件包含标准字段：

```yaml
---
id: prompt-xxx-v1
name: Prompt 名称
summary: 简短描述
type: routing|system|task|workflow|tool-use|output|meta
status: active|draft|deprecated
version: "1.0.0"
owner: skill-repository
category: 主分类
sub_category: 子分类
tags: [标签列表]
keywords: [关键词]
intent: 用途说明
applicable_models: ["*"]|["gpt-4", ...]
required_inputs: [必需输入]
outputs: [输出说明]
steps: [执行步骤]（可选）
structure: [输出结构]（可选）
output_format: [输出格式示例]（可选）
anti_patterns: [避免模式]
failure_modes: [失败模式]
self_check: [自检清单]
related_prompts: [相关 Prompts]
---
```

### 使用方式

**人类使用：**
1. 找到对应 Prompt 文件
2. 复制 `Prompt Body` 部分（或完整文件内容）
3. 粘贴给 AI 使用

**AI 使用：**
1. 读取完整 Prompt 文件
2. 按 `steps` 执行
3. 参考 `output_format` 输出

---

## skills/ 使用说明

`.trae/skills/` 目录包含可直接导入 Trae IDE 的 Skill 文件。

每个 Skill 是独立的工作单元，可单独部署使用。

---

## workflows/ 使用说明

工作流是 **多步骤的 Prompt 组合**，用于复杂任务。

每个工作流定义：
- 执行阶段
- 每个阶段的输入输出
- 阶段间的传递关系

---

## tool-use/ 使用说明

工具调用提示词用于指导 AI 正确使用工具。

包含：
- 何时使用工具
- 如何解读工具结果
- 如何组合多个工具结果

---

## output/ 使用说明

输出格式提示词用于控制 AI 的输出格式。

支持：
- Markdown 报告
- JSON 结构
- YAML 配置
- 检查清单
- 对比表格
- 分步骤计划

---

## meta/ 使用说明

Prompt 工程提示词用于优化和调试 Prompt。

包含：
- 从粗糙想法生成高质量 Prompt
- 消除歧义
- 压缩长度
- 评估质量
- 跨模型适配

---

## 贡献规范摘要

1. **命名规范**：使用 `kebab-case`
2. **字段完整**：使用标准 YAML frontmatter
3. **结构清晰**：遵循 prompt-field-spec
4. **自检**：提交前完成 self_check 清单
5. **测试**：实际使用验证效果

详细规范见 [docs/guides/SPEC.md](docs/guides/SPEC.md)

---

## 双许可说明

本仓库采用 **双许可模式**：

| 许可 | 适用内容 |
|------|----------|
| Apache-2.0 | `.trae/skills/`、`.github/`、配置文件、脚本、代码 |
| CC BY 4.0 | `prompts/`、`workflows/`、`skills/`、`docs/`、`templates/` |

详细许可内容见：
- [LICENSE](LICENSE) - 总览
- [LICENSE-CODE](LICENSE-CODE) - Apache-2.0（代码）
- [LICENSE-CONTENT](LICENSE-CONTENT) - CC BY 4.0（内容）

---

## 相关链接

- [prompts/INDEX.md](prompts/INDEX.md) - Prompts 仓库索引
- [docs/guides/SPEC.md](docs/guides/SPEC.md) - 完整规范
- [AI-USAGE.md](AI-USAGE.md) - AI 使用指南
- [AI-ROUTING.md](AI-ROUTING.md) - AI 路由指南
- [AI-BOOTSTRAP.md](AI-BOOTSTRAP.md) - AI 启动引导
