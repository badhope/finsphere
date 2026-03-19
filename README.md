# AI Skill & Prompt Repository

<!-- Language Switcher -->
[English](README.md) · [中文](README.zh-CN.md)

---

<!-- Badges -->
[![Version](https://img.shields.io/badge/version-v1.0.0-blue.svg)](https://github.com/badhope/skill)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-yellowgreen.svg)](LICENSE-CODE)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-orange.svg)](LICENSE-CONTENT)
[![GitHub stars](https://img.shields.io/github/stars/badhope/skill?style=social)](https://github.com/badhope/skill)

---

## 🎯 One-Line Description

A modular AI Skill/Prompt/Workflow repository designed for both **human users** who want to quickly find and copy prompts, and **AI systems** that need to understand, route, select, and compose assets autonomously.

---

## ✨ What This Repository Offers

| Category | Count | Description |
|----------|-------|-------------|
| **Prompts** | 47+ | Ready-to-use prompts for coding, debugging, planning, research, etc. |
| **Skills** | 14 | Capability definitions for AI task routing and execution |
| **Workflows** | 10 | Multi-step execution flows for complex tasks |
| **Tool-Use Guides** | 8 | Systematic approaches to file reading, command execution, etc. |
| **Output Formats** | 6 | JSON, YAML, Markdown, tables, checklists, reports |
| **Meta Prompts** | 8 | Prompt engineering tools for optimization and debugging |

---

## 🚀 Quick Start

### For Human Users

```
1. Browse by task type below
2. Find the prompt that fits your need
3. Copy and paste into your AI tool
```

**I want AI to...**

| Task | Where to Go |
|------|-------------|
| Generate or modify code | [prompts/task/coding/](prompts/task/coding/) |
| Debug and fix bugs | [prompts/task/debugging/](prompts/task/debugging/) |
| Understand a repository | [prompts/task/repo-analysis/](prompts/task/repo-analysis/) |
| Create execution plans | [prompts/task/planning/](prompts/task/planning/) |
| Conduct research | [prompts/task/research/](prompts/task/research/) |
| Execute multi-step workflows | [prompts/workflow/](prompts/workflow/) |
| Output specific formats | [prompts/output/](prompts/output/) |
| Optimize prompts | [prompts/meta/](prompts/meta/) |

---

### For AI Systems

AI should read files in this order:

```
1. README.md (this file)          → Understand repository purpose
2. INDEX.md                       → Understand structure
3. registry/prompts-registry.yaml → Discover available prompts
4. registry/routes-registry.yaml  → Learn task-to-asset routing
5. AI-USAGE.md                    → Understand usage patterns
6. AI-ROUTING.md                  → Understand routing logic
7. AI-BOOTSTRAP.md                → Bootstrap for first-time use
```

**AI Decision Flow:**

```
User Request
    ↓
[Identify Task Type] → coding / debugging / repo-analysis / planning / research / meta
    ↓
[Route via registry/routes-registry.yaml]
    ↓
[Select primary + supporting prompts]
    ↓
[If tool assistance needed] → Add from prompts/tool-use/
    ↓
[If specific output needed] → Add from prompts/output/
    ↓
[If complex task] → Use workflow from prompts/workflow/
    ↓
[If unclear request] → Ask user clarifying questions first
```

---

## 📁 Directory Structure

```
skill/
├── README.md              ← You are here (English entry)
├── README.zh-CN.md        ← Chinese entry
├── INDEX.md               ← Global index
│
├── prompts/               ← Core prompt assets
│   ├── _routing/          ← AI autonomous routing (required reading for AI)
│   ├── _core/             ← Core standards (field specs, writing standards)
│   ├── system/             ← System-level prompts
│   ├── task/              ← Task-specific prompts
│   │   ├── coding/        ← Code generation, review
│   │   ├── debugging/     ← Bug investigation, fixing
│   │   ├── repo-analysis/ ← Project understanding, file location
│   │   ├── planning/      ← Task breakdown, execution plans
│   │   └── research/      ← Research briefs, investigations
│   ├── workflow/           ← Multi-step workflows
│   ├── tool-use/           ← Tool usage guidelines
│   ├── output/             ← Output format control
│   ├── meta/               ← Prompt engineering tools
│   ├── INDEX.md            ← Prompts index
│   └── README.md           ← Prompts usage guide
│
├── skills/                ← Skill definitions (canonical directory)
│   ├── ai-routing/         ← Routing capability
│   ├── coding/             ← Code generation, review
│   ├── debugging/          ← Bug fixing
│   ├── planning/           ← Task planning
│   ├── repo-analysis/      ← Repository understanding
│   ├── research/           ← Research methodology
│   ├── tool-use/           ← Tool usage
│   ├── prompt-composition/ ← Prompt composition
│   ├── system-prompts/     ← System configurations
│   ├── workflows/          ← Workflow guidance
│   └── writing/            ← Article drafting
│
├── docs/                  ← Documentation
│   └── guides/            ←规范性指南
│       ├── SPEC.md         ← Complete specification
│       └── templates/      ← Asset templates
│
├── registry/              ← AI-readable registries
│   ├── prompts-registry.yaml
│   ├── skills-registry.yaml
│   ├── workflows-registry.yaml
│   ├── tags-registry.yaml
│   ├── relations-registry.yaml
│   └── routes-registry.yaml
│
├── AI-USAGE.md            ← AI usage guide
├── AI-ROUTING.md          ← AI routing guide
├── AI-BOOTSTRAP.md        ← AI bootstrap guide
├── CHANGELOG.md           ← Version history
├── PROJECT-PLAN.md         ← Project roadmap
├── CONTRIBUTING.md         ← Contribution guidelines
├── CODE_OF_CONDUCT.md     ← Community code of conduct
├── SECURITY.md            ← Security policy
├── LICENSE                ← License overview
├── LICENSE-CODE           ← Apache-2.0 (for code/scripts/configs)
└── LICENSE-CONTENT        ← CC BY 4.0 (for prompts/workflows/docs)
```

---

## 📖 Asset Types Explained

| Type | Definition | Example |
|------|------------|---------|
| **Prompt** | Direct executable instruction for AI | "Generate code from requirement description" |
| **Skill** | Capability description with use cases, inputs/outputs | "Debugging: systematic bug investigation process" |
| **Workflow** | Multi-step execution flow combining multiple prompts | "Bug Investigation: identify → plan → fix → verify" |
| **Tool-Use** | Systematic approach to file/command operations | "Read multiple files before answering" |
| **Output** | Format specification for AI responses | "Output as JSON structure" |
| **Meta** | Prompt self-optimization and debugging | "Debug a failing prompt" |

---

## 🔀 Routing & Selection

The `registry/` directory enables AI to autonomously select and compose assets:

| Registry | Purpose |
|----------|---------|
| `prompts-registry.yaml` | All prompts with metadata for AI discovery |
| `routes-registry.yaml` | Task-to-prompt routing rules |
| `relations-registry.yaml` | Relationships between assets |
| `tags-registry.yaml` | Unified tag dictionary |

**How routing works:**

1. AI reads user request
2. AI checks `routes-registry.yaml` for matching `trigger_patterns`
3. AI selects recommended `primary_prompt` + `supporting_prompts`
4. AI checks `relations-registry.yaml` for related assets
5. AI executes with selected prompts in sequence

---

## 📋 Core Task Coverage

| Task Type | Primary Prompt | Supporting Prompts |
|-----------|----------------|-------------------|
| **Coding** | generate-code-from-requirement | + read-files, output-markdown-report |
| **Debugging** | identify-root-cause | + generate-plan, fix-bug, verify-fix |
| **Repo Analysis** | analyze-repository-structure | + read-files, summarize-architecture |
| **Planning** | break-down-task | + create-execution-plan, output-checklist |
| **Research** | prepare-research-brief | + output-markdown-report |
| **Prompt Engineering** | debug-failing-prompt | + shorten, evaluate-quality, adapt-general |

---

## 🔒 Dual Licensing

This repository uses a **dual license** model:

| License | Applicable Content |
|---------|-------------------|
| **Apache-2.0** | Code, scripts, configs (`.trae/skills/`, `.github/`, config files) |
| **CC BY 4.0** | Content assets (all `prompts/`, `workflows/`, `skills/`, `docs/`) |

**Quick reference:**
- Use Apache-2.0 licensed content freely in any project
- Use CC BY 4.0 licensed content with attribution (see [LICENSE-CONTENT](LICENSE-CONTENT))

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

- [LICENSE](LICENSE) - License overview
- [LICENSE-CODE](LICENSE-CODE) - Apache-2.0 (code/scripts/configs)
- [LICENSE-CONTENT](LICENSE-CONTENT) - CC BY 4.0 (prompts/workflows/docs)

---

## 📌 Version

**Current Version: v1.0.0**

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

## 🔗 Quick Links

- [INDEX.md](INDEX.md) - Global asset index
- [prompts/INDEX.md](prompts/INDEX.md) - Prompts directory index
- [AI-USAGE.md](AI-USAGE.md) - AI usage guidelines
- [AI-ROUTING.md](AI-ROUTING.md) - AI routing guide
- [AI-BOOTSTRAP.md](AI-BOOTSTRAP.md) - AI bootstrap guide
- [PROJECT-PLAN.md](PROJECT-PLAN.md) - Project roadmap

---

*This repository is designed for both human usability and AI autonomous operation.*
