# Global Index (INDEX)

This document is the central index for the entire repository. Both AI systems and human users can quickly locate any content through it.

---

## Statistics Overview

| Category | Count |
|----------|-------|
| **Prompts** | 47+ |
| **Skills** | 14 |
| **Workflows** | 10 |
| **Tool-Use Guides** | 8 |
| **Output Formats** | 6 |
| **Meta Prompts** | 8 |
| **Last Updated** | 2026-03-19 |

---

## Quick Navigation

| I want AI to... | Where to Go |
|-----------------|-------------|
| Generate or modify code | [prompts/task/coding/](prompts/task/coding/) |
| Debug and fix bugs | [prompts/task/debugging/](prompts/task/debugging/) |
| Understand a repository | [prompts/task/repo-analysis/](prompts/task/repo-analysis/) |
| Create execution plans | [prompts/task/planning/](prompts/task/planning/) |
| Conduct research | [prompts/task/research/](prompts/task/research/) |
| Execute multi-step workflows | [prompts/workflow/](prompts/workflow/) |
| Output specific formats | [prompts/output/](prompts/output/) |
| Optimize prompts | [prompts/meta/](prompts/meta/) |
| Use tools systematically | [prompts/tool-use/](prompts/tool-use/) |
| AI autonomous routing | [prompts/_routing/](prompts/_routing/) |

---

## Prompts Directory

### By Category

| Type | Count | Path |
|------|-------|------|
| Routing | 4 | `prompts/_routing/` |
| System | 3 | `prompts/system/` |
| Task/Coding | 3 | `prompts/task/coding/` |
| Task/Debugging | 4 | `prompts/task/debugging/` |
| Task/Repo-Analysis | 3 | `prompts/task/repo-analysis/` |
| Task/Planning | 2 | `prompts/task/planning/` |
| Task/Research | 1 | `prompts/task/research/` |
| Workflow | 10 | `prompts/workflow/` |
| Tool-Use | 8 | `prompts/tool-use/` |
| Output | 6 | `prompts/output/` |
| Meta | 8 | `prompts/meta/` |

### Coding Prompts
- [generate-code-from-requirement.md](prompts/task/coding/prompt-task-coding-generate-code-from-requirement.md)
- [implement-feature-from-spec.md](prompts/task/coding/prompt-task-coding-implement-feature-from-spec.md)
- [review-code-for-quality.md](prompts/task/coding/prompt-task-coding-review-code-for-quality.md)

### Debugging Prompts
- [identify-root-cause.md](prompts/task/debugging/prompt-task-debugging-identify-root-cause.md)
- [generate-debug-plan.md](prompts/task/debugging/prompt-task-debugging-generate-debug-plan.md)
- [fix-bug-safely.md](prompts/task/debugging/prompt-task-debugging-fix-bug-safely.md)
- [verify-fix-after-change.md](prompts/task/debugging/prompt-task-debugging-verify-fix-after-change.md)

### Repo-Analysis Prompts
- [analyze-repository-structure.md](prompts/task/repo-analysis/prompt-task-repo-analysis-analyze-repository-structure.md)
- [summarize-project-architecture.md](prompts/task/repo-analysis/prompt-task-repo-analysis-summarize-project-architecture.md)
- [locate-bug-related-files.md](prompts/task/repo-analysis/prompt-task-repo-analysis-locate-bug-related-files.md)

### Planning Prompts
- [break-down-task-into-subtasks.md](prompts/task/planning/prompt-task-planning-break-down-task-into-subtasks.md)
- [create-execution-plan.md](prompts/task/planning/prompt-task-planning-create-execution-plan.md)

### Research Prompts
- [prepare-research-brief.md](prompts/task/research/prompt-task-research-prepare-research-brief.md)

---

## Skills Directory

The `skills/` directory is the canonical directory for all skill definitions.

| Skill | Path |
|-------|------|
| ai-routing | [skills/ai-routing/](skills/ai-routing/) |
| coding | [skills/coding/](skills/coding/) |
| debugging | [skills/debugging/](skills/debugging/) |
| planning | [skills/planning/](skills/planning/) |
| repo-analysis | [skills/repo-analysis/](skills/repo-analysis/) |
| research | [skills/research/](skills/research/) |
| tool-use | [skills/tool-use/](skills/tool-use/) |
| prompt-composition | [skills/prompt-composition/](skills/prompt-composition/) |
| system-prompts | [skills/system-prompts/](skills/system-prompts/) |
| workflows | [skills/workflows/](skills/workflows/) |
| writing | [skills/writing/](skills/writing/) |

---

## Workflows

| Workflow | Description |
|----------|-------------|
| bug-investigation | Systematic bug investigation workflow |
| bug-fix | Safe bug fixing workflow |
| feature-implementation | Feature implementation from spec |
| new-repo-onboarding | New repository onboarding |
| research-to-summary | Research to structured summary |
| vague-request-to-action | Convert vague requests to actionable plans |
| repo-reading-to-change-plan | Repository analysis to change plan |
| prompt-selection-composition | Prompt selection and composition |
| documentation-generation | Documentation generation |
| tool-assisted-debug | Tool-assisted debugging |

---

## Registry System

AI systems should use the registry for autonomous asset discovery:

| Registry | Purpose |
|----------|---------|
| [prompts-registry.yaml](registry/prompts-registry.yaml) | All prompts with metadata |
| [routes-registry.yaml](registry/routes-registry.yaml) | Task-to-asset routing |
| [relations-registry.yaml](registry/relations-registry.yaml) | Asset relationships |
| [tags-registry.yaml](registry/tags-registry.yaml) | Unified tag dictionary |
| [skills-registry.yaml](registry/skills-registry.yaml) | Skill metadata |

---

## AI Documentation

| Document | Purpose |
|----------|---------|
| [AI-BOOTSTRAP.md](AI-BOOTSTRAP.md) | AI startup guide |
| [AI-USAGE.md](AI-USAGE.md) | AI usage guidelines |
| [AI-ROUTING.md](AI-ROUTING.md) | AI routing guide |

---

## Core Documentation

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | English entry point |
| [README.zh-CN.md](README.zh-CN.md) | Chinese entry point |
| [INDEX.md](INDEX.md) | This file |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [PROJECT-PLAN.md](PROJECT-PLAN.md) | Project roadmap |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community code of conduct |
| [SECURITY.md](SECURITY.md) | Security policy |
| [LICENSE](LICENSE) | License overview |

---

## Prompts for AI Use

### Routing Prompts (for AI only)
- `prompts/_routing/scan-repository-and-build-task-map.md`
- `prompts/_routing/identify-task-type-and-route.md`
- `prompts/_routing/select-relevant-prompts-from-index.md`
- `prompts/_routing/compose-multiple-prompts-for-one-task.md`

### Tool-Use Prompts
- `prompts/tool-use/read-files-before-answering.md`
- `prompts/tool-use/use-command-output-safely.md`
- `prompts/tool-use/search-before-concluding.md`
- `prompts/tool-use/use-tools-step-by-step.md`
- `prompts/tool-use/combine-multiple-tool-results.md`

### Output Prompts
- `prompts/output/output-as-json-structure.md`
- `prompts/output/output-as-yaml-config.md`
- `prompts/output/output-as-markdown-report.md`
- `prompts/output/output-as-comparison-table.md`
- `prompts/output/output-as-checklist.md`
- `prompts/output/output-as-step-by-step-plan.md`

### Meta Prompts
- `prompts/meta/debug-a-failing-prompt.md`
- `prompts/meta/shorten-prompt-without-losing-quality.md`
- `prompts/meta/evaluate-prompt-quality.md`
- `prompts/meta/adapt-prompt-for-general-model-use.md`
- `prompts/meta/split-large-prompt-into-modules.md`
- `prompts/meta/refine-ambiguous-request.md`
- `prompts/meta/expand-rough-idea-into-high-quality-prompt.md`
- `prompts/meta/convert-natural-language-to-structured-prompt.md`

---

## Version

**Current Version: v1.0.0**

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

*This index is designed for both human navigation and AI autonomous asset discovery.*
