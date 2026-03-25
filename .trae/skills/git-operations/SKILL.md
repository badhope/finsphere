# Git Operations

## Description
Expert in Git version control operations including branch management, merge conflict resolution, commit conventions, cherry-pick, rebase strategies, and repository maintenance.

## Usage Scenario
Use this skill when:
- Managing Git branches and merge strategies
- Resolving complex merge conflicts
- Implementing commit conventions (Conventional Commits)
- Performing cherry-pick, rebase, or reset operations
- Setting up Git hooks and workflows
- Repository cleanup and maintenance

## Instructions

### Branch Management
1. **Branch Naming Convention**
   - Feature: `feature/<ticket-id>-<short-description>`
   - Bugfix: `fix/<ticket-id>-<short-description>`
   - Hotfix: `hotfix/<ticket-id>-<short-description>`
   - Release: `release/<version>`

2. **Branch Strategy**
   - Main/Master: Production-ready code only
   - Develop: Integration branch
   - Feature branches: Short-lived, merge via PR

### Commit Standards
1. **Conventional Commits Format**
   ```
   <type>(<scope>): <subject>
   
   [optional body]
   
   [optional footer(s)]
   ```

2. **Commit Types**
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style (formatting, semicolons)
   - `refactor`: Code refactoring
   - `test`: Adding/updating tests
   - `chore`: Maintenance tasks
   - `perf`: Performance improvements
   - `ci`: CI/CD changes
   - `build`: Build system changes

### Merge Conflict Resolution
1. Identify conflicting files: `git status`
2. Open each conflict file and locate markers
3. Resolve by choosing/combining changes
4. Stage resolved files: `git add <file>`
5. Complete merge: `git commit`

### Rebase Strategy
1. **Interactive Rebase**
   ```bash
   git rebase -i HEAD~n
   ```
   - `pick`: Use commit as-is
   - `reword`: Edit commit message
   - `squash`: Combine with previous
   - `drop`: Remove commit

2. **Rebase onto**
   ```bash
   git rebase --onto <new-base> <old-base> <branch>
   ```

### Cherry-Pick Operations
1. Select specific commits: `git cherry-pick <commit-hash>`
2. Cherry-pick range: `git cherry-pick <start>..<end>`
3. Cherry-pick without commit: `git cherry-pick -n <commit-hash>`

### Git Hooks
1. **Pre-commit**: Validate staged changes
2. **Commit-msg**: Validate commit message format
3. **Pre-push**: Run tests before push
4. **Husky setup for Node projects**

### Repository Maintenance
1. **Clean untracked files**: `git clean -fd`
2. **Remove merged branches**: `git branch -d <branch>`
3. **Prune remote references**: `git fetch --prune`
4. **Garbage collection**: `git gc --aggressive`

## Output Contract
- Clear Git command sequences
- Conflict resolution strategies
- Commit message templates
- Branch management recommendations
- Error recovery procedures

## Constraints
- Never force push to main/master
- Always backup before destructive operations
- Use `--dry-run` when available for preview
- Document complex operations
- Warn about potential data loss

## Examples

### Example 1: Interactive Rebase
```bash
# Squash last 3 commits
git rebase -i HEAD~3
# In editor: change 'pick' to 'squash' for commits to combine
# Edit the combined commit message
git push --force-with-lease origin feature-branch
```

### Example 2: Resolve Merge Conflict
```bash
# Check status
git status
# Edit conflicting file, then:
git add resolved-file.js
git commit -m "merge: resolve conflicts in resolved-file.js"
```

### Example 3: Cherry-Pick from Another Branch
```bash
# Get commit hash from feature branch
git log feature-branch --oneline
# Cherry-pick to current branch
git cherry-pick abc1234
# Resolve conflicts if any
git add .
git cherry-pick --continue
```
