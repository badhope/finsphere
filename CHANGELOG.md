# Changelog

All notable changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [v1.0.0] - 2026-03-19

### Added

#### Core Assets
- **47+ Prompts** across 10 categories:
  - `_routing/` (4): scan-repository, identify-task-type, select-relevant, compose-multiple
  - `system/` (3): general-ai-workbench, debugging-agent, coding-agent
  - `task/coding/` (3): generate-code, implement-feature, review-code
  - `task/debugging/` (4): identify-root-cause, generate-plan, fix-bug, verify-fix
  - `task/repo-analysis/` (3): analyze-structure, summarize-architecture, locate-files
  - `task/planning/` (2): break-down-task, create-execution-plan
  - `task/research/` (1): prepare-research-brief
  - `workflow/` (10): bug-investigation, feature-implementation, new-repo-onboarding, research-to-summary, vague-request-to-action, etc.
  - `tool-use/` (8): read-files, use-command, search-before-concluding, etc.
  - `output/` (6): as-json, as-yaml, as-markdown-report, as-comparison-table, as-checklist, as-step-by-step-plan
  - `meta/` (8): debug-failing, shorten, evaluate-quality, adapt-general, split-modules, etc.

- **14 Skills** covering:
  - ai-routing, coding, debugging, planning, repo-analysis, research
  - tool-use, prompt-composition, system-prompts, workflows, writing

#### Registry System
- `prompts-registry.yaml`: 46 prompt entries with full metadata
- `tags-registry.yaml`: 30+ tags across 7 groups
- `relations-registry.yaml`: 80+ relationships between assets
- `routes-registry.yaml`: 8 routing paths for core task types
- `skills-registry.yaml`: 14 skill entries

#### Documentation
- `README.md` (English): Modern, professional entry with badges and navigation
- `README.zh-CN.md` (Chinese): Complete Chinese translation
- `INDEX.md`: Global asset index with statistics
- `AI-BOOTSTRAP.md`: AI startup guide
- `AI-USAGE.md`: AI usage guidelines
- `AI-ROUTING.md`: AI routing logic guide
- `CHANGELOG.md`: Version history
- `PROJECT-PLAN.md`: Project roadmap and principles
- `CONTRIBUTING.md`: Contribution guidelines
- `CODE_OF_CONDUCT.md`: Community code of conduct
- `SECURITY.md`: Security policy

#### Licensing
- Dual license model implemented:
  - Apache-2.0 for code/scripts/configs
  - CC BY 4.0 for content assets

### Fixed

#### Registry Quality
- Corrected invalid prompt reference (`prompt-task-coding-fix-bug` → `prompt-task-debugging-fix-bug`)
- Removed obsolete `pending_items` sections with outdated references
- Ensured all registry paths match actual file locations
- Verified all relation `source_id` and `target_id` exist

#### Skills Structure
- Consolidated `skills/` as canonical directory
- Migrated skills from `.trae/skills/` to `skills/`
- Removed duplicate SKILL.md files
- Standardized skill file naming

### Changed

- `INDEX.md`: Updated statistics to reflect actual counts
- `README.md`: Complete rewrite with modern layout and badges
- `README.zh-CN.md`: Created as complete Chinese version
- License files: Clarified dual license boundaries

### Removed

- Redundant prompt duplicates (e.g., `prompt-task-coding-code-review.md` in wrong location)
- Obsolete `pending_items` documentation that referenced non-existent assets

### Security

- Implemented SECURITY.md with responsible disclosure policy
- No security vulnerabilities reported

---

## [v0.1.0] - 2026-03-18

### Added (Historical)
- Initial prompt repository structure
- Basic prompt categories (coding, debugging, planning)
- Early workflow definitions
- Initial README and INDEX

---

## Versioning Policy

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version: Incompatible changes
- MINOR version: New assets or significant additions
- PATCH version: Bug fixes and documentation updates

### Version Boundaries

| Version | Status | Description |
|---------|--------|-------------|
| v1.0.0 | Current | Minimum viable product with complete asset coverage |
| v0.1.0 | Legacy | Initial structure and early prompts |

---

## Release Criteria for v1.0.0

- [x] All core task types supported (coding, debugging, repo-analysis, planning, research)
- [x] Registry system operational for AI routing
- [x] Skills directory unified and consistent
- [x] Dual licensing implemented and documented
- [x] README bilingual and professional
- [x] AI documentation complete
- [x] No critical registry errors
- [x] No duplicate or dangling references

---

## Future Considerations

See [PROJECT-PLAN.md](PROJECT-PLAN.md) for roadmap and planned enhancements.

---

*This changelog tracks changes that affect users and AI systems reading this repository.*
