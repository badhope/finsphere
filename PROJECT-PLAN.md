# Project Plan

## 1. Project Overview

### Project Name
**AI Skill & Prompt Repository** (badhope/skill)

### Core Mission
Build a modular, extensible repository of AI Prompts, Skills, and Workflows that serves both:
- **Human users**: Quick search, copy, and use of prompts
- **AI systems**: Autonomous understanding, routing, selection, and composition of assets

### Design Principles

| Principle | Description |
|-----------|-------------|
| **Modularity** | Each prompt/skill/workflow is self-contained and composable |
| **Discoverability** | Registry system enables AI to find and select assets |
| **Clarity** | Clear boundaries between asset types prevent confusion |
| **Extensibility** | New assets can be added without breaking existing structure |
| **Dual Audience** | Content is optimized for both human and AI consumption |

---

## 2. Repository Architecture

### Directory Structure

```
skill/
├── prompts/              ← Core Prompt assets (CC BY 4.0)
│   ├── _routing/         ← AI routing prompts
│   ├── _core/            ← Standards and specifications
│   ├── system/           ← System-level prompts
│   ├── task/             ← Task-specific prompts
│   ├── workflow/          ← Multi-step workflows
│   ├── tool-use/          ← Tool usage guides
│   ├── output/            ← Output format prompts
│   └── meta/              ← Prompt engineering tools
│
├── skills/                ← Skill definitions (CC BY 4.0)
│   ├── ai-routing/
│   ├── coding/
│   ├── debugging/
│   ├── planning/
│   ├── repo-analysis/
│   ├── research/
│   ├── tool-use/
│   ├── prompt-composition/
│   ├── system-prompts/
│   ├── workflows/
│   └── writing/
│
├── docs/                  ← Documentation (CC BY 4.0)
│   └── guides/
│       ├── SPEC.md
│       └── templates/
│
├── registry/              ← AI-readable registries
│   ├── prompts-registry.yaml
│   ├── skills-registry.yaml
│   ├── workflows-registry.yaml
│   ├── tags-registry.yaml
│   ├── relations-registry.yaml
│   └── routes-registry.yaml
│
├── .trae/skills/          ← Legacy Trae-specific skills (Apache-2.0)
│   └── [migrated to skills/]
│
├── AI-BOOTSTRAP.md
├── AI-USAGE.md
├── AI-ROUTING.md
├── README.md
├── README.zh-CN.md
├── INDEX.md
├── CHANGELOG.md
├── LICENSE
├── LICENSE-CODE
└── LICENSE-CONTENT
```

### Asset Type Boundaries

| Type | Responsibility | Example |
|------|----------------|---------|
| **Prompt** | Direct executable instruction | "Generate code from requirement" |
| **Skill** | Capability description with use cases | "Debugging: systematic investigation process" |
| **Workflow** | Multi-step execution flow | "Bug Investigation: identify→plan→fix→verify" |
| **Tool-Use** | Systematic tool operation | "Read multiple files before answering" |
| **Output** | Response format specification | "Output as JSON structure" |
| **Meta** | Prompt self-optimization | "Debug a failing prompt" |

---

## 3. Registry System

### Purpose
Enable AI to autonomously discover, select, and compose assets based on user requests.

### Registry Files

| File | Purpose |
|------|---------|
| `prompts-registry.yaml` | All prompts with metadata (id, path, tags, when_to_use, etc.) |
| `routes-registry.yaml` | Task-to-asset routing with trigger patterns |
| `relations-registry.yaml` | Relationships between assets |
| `tags-registry.yaml` | Unified tag dictionary |
| `skills-registry.yaml` | Skill metadata and relationships |

### AI Routing Flow

```
User Request
    ↓
Parse trigger patterns in routes-registry.yaml
    ↓
Match task_type and sub_type
    ↓
Select primary_prompt + supporting_prompts
    ↓
Check relations-registry.yaml for additional assets
    ↓
Execute with selected prompts in sequence
    ↓
Apply output prompt if needed
```

---

## 4. Version Boundaries

### v1.0.0 (Current)
- Minimum viable product
- Core task coverage: coding, debugging, repo-analysis, planning, research
- Registry system operational
- Skills directory unified
- Dual licensing implemented
- Bilingual README

### v1.1.0 (Planned)
- Enhanced workflow coverage
- Additional routing paths
- Improved selection hints
- Extended tag taxonomy

### v2.0.0 (Future)
- Skill versioning and dependencies
- Dynamic prompt composition
- Interactive workflow builder
- Community contributions integration

---

## 5. Completed Content

### Prompts (47+)
- **Routing**: 4 prompts for AI autonomous selection
- **System**: 3 prompts for AI behavior configuration
- **Coding**: 3 prompts for code generation and review
- **Debugging**: 4 prompts for bug investigation and fixing
- **Repo Analysis**: 3 prompts for project understanding
- **Planning**: 2 prompts for task breakdown
- **Research**: 1 prompt for research briefs
- **Workflow**: 10 multi-step execution flows
- **Tool-Use**: 8 prompts for systematic tool usage
- **Output**: 6 prompts for format control
- **Meta**: 8 prompts for prompt engineering

### Skills (14)
- ai-routing, coding, debugging, planning, repo-analysis, research
- tool-use, prompt-composition, system-prompts, workflows, writing
- Plus specialized: coding-bug-fixing, coding-code-review

### Registries
- 46 prompt entries
- 30+ tags
- 80+ relationships
- 8 routing paths
- 14 skill entries

---

## 6. Maintenance Principles

### Adding New Prompts
1. Create prompt file in appropriate category
2. Add entry to `prompts-registry.yaml`
3. Add relationships in `relations-registry.yaml` if applicable
4. Update tags in `tags-registry.yaml` if new tags needed
5. Update `INDEX.md` statistics

### Adding New Skills
1. Create skill file in `skills/` directory
2. Add entry to `skills-registry.yaml`
3. Update relevant prompt `related_skills` fields

### Version Updates
1. Document changes in `CHANGELOG.md`
2. Update version badge in `README.md`
3. Follow semantic versioning

---

## 7. AI Usage Principles

### Reading Order
1. `README.md` → Understand purpose
2. `INDEX.md` → Understand structure
3. `prompts-registry.yaml` → Discover assets
4. `routes-registry.yaml` → Learn routing
5. `AI-USAGE.md` → Understand patterns
6. `AI-ROUTING.md` → Deep routing logic
7. `AI-BOOTSTRAP.md` → First-time setup

### Selection Criteria
- Match `trigger_patterns` in user request
- Consider `when_to_use` and `when_not_to_use`
- Use `selection_hints` for disambiguation
- Check `related_prompts` for composition

### Fallback Strategy
1. If no route matches → Use fuzzy-request route
2. If still unclear → Ask user clarifying questions
3. Prefer workflow over multiple single prompts

---

## 8. Licensing Strategy

### Dual License Model

| License | Assets | Usage |
|---------|--------|-------|
| Apache-2.0 | Code, scripts, configs | `.trae/skills/`, `.github/`, configs |
| CC BY 4.0 | Content | `prompts/`, `workflows/`, `skills/`, `docs/` |

### Attribution Requirements
- Apache-2.0: Include license notice
- CC BY 4.0: Attribute source, indicate changes, link license

---

## 9. Contributing Guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Quick Rules
1. Follow existing naming conventions
2. Include all required metadata fields
3. Ensure registry entries match actual files
4. Test prompts before adding
5. Document changes in CHANGELOG

---

## 10. Extension Priorities

### High Priority
- [ ] Add more workflow coverage
- [ ] Enhance selection_hints for ambiguous cases
- [ ] Expand test coverage for routing

### Medium Priority
- [ ] Add language-specific tags (python, javascript, etc.)
- [ ] Create framework-specific skill packs
- [ ] Improve output format diversity

### Low Priority
- [ ] Interactive workflow builder
- [ ] Dynamic prompt composition
- [ ] Community contribution portal

---

## 11. Document Version

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | badhope | Initial v1.0.0 release plan |

---

*This document serves as the source of truth for repository architecture and future development.*
