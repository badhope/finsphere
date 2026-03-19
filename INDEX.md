# 全局索引 (INDEX)

本文档是仓库的中央索引，AI 和人类都可以通过它快速定位任何内容。

---

## 统计概览

- **Prompts**: 47+ 个
- **Skills (Trae)**: 11 个
- **Workflows**: 10 个
- **工具调用指南**: 8 个
- **最后更新**: 2026-03-19

---

## 快速导航

| 你要做什么 | 去哪里 |
|-----------|--------|
| 让 AI 写代码 | [prompts/task/coding/](prompts/task/coding/) |
| 让 AI 修 Bug | [prompts/task/debugging/](prompts/task/debugging/) |
| 让 AI 分析项目 | [prompts/task/repo-analysis/](prompts/task/repo-analysis/) |
| 让 AI 做计划 | [prompts/task/planning/](prompts/task/planning/) |
| 让 AI 做研究 | [prompts/task/research/](prompts/task/research/) |
| 让 AI 做多步骤任务 | [prompts/workflow/](prompts/workflow/) |
| 让 AI 输出特定格式 | [prompts/output/](prompts/output/) |
| 优化 Prompt | [prompts/meta/](prompts/meta/) |
| AI 自动路由选择 | [prompts/_routing/](prompts/_routing/) |

---

## Prompts 分类速查

| 类型 | 数量 | 路径 |
|------|------|------|
| routing | 4 | `prompts/_routing/` |
| system | 3 | `prompts/system/` |
| task/coding | 3 | `prompts/task/coding/` |
| task/debugging | 4 | `prompts/task/debugging/` |
| task/repo-analysis | 3 | `prompts/task/repo-analysis/` |
| task/planning | 2 | `prompts/task/planning/` |
| task/research | 1 | `prompts/task/research/` |
| workflow | 10 | `prompts/workflow/` |
| tool-use | 8 | `prompts/tool-use/` |
| output | 6 | `prompts/output/` |
| meta | 8 | `prompts/meta/` |

---

## Skills (Trae IDE)

`.trae/skills/` 目录包含可直接导入 Trae IDE 的 Skills：

| Skill | 用途 |
|-------|------|
| ai-routing | AI 自主路由 |
| coding | 编程辅助 |
| coding-bug-fixing | Bug 修复 |
| coding-code-review | 代码审查 |
| debugging | 调试辅助 |
| planning | 任务规划 |
| repo-analysis | 仓库分析 |
| research | 研究调查 |
| system-prompts | 系统提示 |
| workflows | 工作流 |
| writing-article-draft | 文章起草 |

---

## AI 使用文档

| 文档 | 说明 |
|------|------|
| [AI-BOOTSTRAP.md](AI-BOOTSTRAP.md) | AI 启动引导 |
| [AI-USAGE.md](AI-USAGE.md) | AI 使用指南 |
| [AI-ROUTING.md](AI-ROUTING.md) | AI 路由指南 |

---

## 规范文档

| 文档 | 说明 |
|------|------|
| [docs/guides/SPEC.md](docs/guides/SPEC.md) | 完整规范 |
| [docs/guides/prompt-template.md](docs/guides/prompt-template.md) | Prompt 模板 |
| [docs/guides/skill-template.md](docs/guides/skill-template.md) | Skill 模板 |
| [docs/guides/workflow-template.md](docs/guides/workflow-template.md) | Workflow 模板 |

---

## 许可说明

本仓库采用双许可模式：
- **Apache-2.0**: 代码、脚本、配置（`.trae/skills/`）
- **CC BY 4.0**: 内容资产（`prompts/`、`workflows/`、`docs/`）

详见 [LICENSE](LICENSE)

---

## 相关链接

- [README.md](README.md) - 仓库入口
- [prompts/INDEX.md](prompts/INDEX.md) - Prompts 仓库详细索引
