# Dependency Update

## Description
Expert in dependency management, version updates, compatibility checking, and security vulnerability remediation across multiple package managers and languages.

## Usage Scenario
Use this skill when:
- Updating project dependencies
- Checking for security vulnerabilities
- Resolving dependency conflicts
- Managing version constraints
- Automating dependency updates
- Package.json, requirements.txt, go.mod maintenance

## Instructions

### Node.js / npm / yarn

1. **Check Outdated Packages**
   ```bash
   # npm
   npm outdated
   
   # yarn
   yarn outdated
   
   # pnpm
   pnpm outdated
   ```

2. **Update Dependencies**
   ```bash
   # Update to latest within semver range
   npm update
   
   # Update to latest versions
   npx npm-check-updates -u
   npm install
   
   # Update specific package
   npm install package@latest
   ```

3. **Security Audit**
   ```bash
   npm audit
   npm audit fix
   npm audit fix --force  # Breaking changes possible
   ```

4. **Version Constraints**
   ```json
   {
     "dependencies": {
       "express": "^4.18.0",    // Minor and patch updates
       "lodash": "~4.17.0",     // Patch updates only
       "moment": "2.29.0",      // Exact version
       "axios": ">=1.0.0 <2.0.0" // Range
     }
   }
   ```

### Python / pip

1. **Check Outdated**
   ```bash
   pip list --outdated
   
   pip list --outdated --format=columns
   ```

2. **Update Dependencies**
   ```bash
   # Update single package
   pip install --upgrade package-name
   
   # Update all (use pip-review)
   pip install pip-review
   pip-review --auto
   
   # Update from requirements.txt
   pip install -r requirements.txt --upgrade
   ```

3. **Security Check**
   ```bash
   pip install safety
   safety check
   
   pip install pip-audit
   pip-audit
   ```

4. **Requirements Management**
   ```txt
   # requirements.txt
   package==1.2.3      # Exact version
   package>=1.2.3     # Minimum version
   package>=1.2.3,<2.0.0  # Range
   package~=1.2.3     # Compatible release
   ```

### Go

1. **Update Dependencies**
   ```bash
   # Update all dependencies
   go get -u ./...
   
   # Update specific package
   go get example.com/package@latest
   
   # Update to specific version
   go get example.com/package@v1.2.3
   
   # Tidy dependencies
   go mod tidy
   ```

2. **Check for Updates**
   ```bash
   go list -u -m all
   ```

3. **Security**
   ```bash
   go list -m -json all | nancy sleuth
   ```

### Rust / Cargo

1. **Update Dependencies**
   ```bash
   # Update within semver
   cargo update
   
   # Update specific crate
   cargo update -p crate-name
   
   # Update to latest (may break semver)
   cargo install cargo-edit
   cargo upgrade
   ```

2. **Check Outdated**
   ```bash
   cargo install cargo-outdated
   cargo outdated
   ```

3. **Security Audit**
   ```bash
   cargo install cargo-audit
   cargo audit
   ```

### Java / Maven

1. **Update Dependencies**
   ```bash
   # Check for updates
   mvn versions:display-dependency-updates
   
   # Update properties
   mvn versions:update-properties
   
   # Use versions plugin
   mvn versions:use-latest-releases
   ```

2. **Security Check**
   ```bash
   mvn org.owasp:dependency-check-maven:check
   ```

### Automated Updates

1. **Dependabot (GitHub)**
   ```yaml
   # .github/dependabot.yml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
       reviewers:
         - "my-team"
       labels:
         - "dependencies"
     
     - package-ecosystem: "pip"
       directory: "/"
       schedule:
         interval: "weekly"
   ```

2. **Renovate Bot**
   ```json
   // renovate.json
   {
     "extends": ["config:base"],
     "schedule": ["every weekend"],
     "labels": ["dependencies"],
     "prConcurrentLimit": 10,
     "packageRules": [
       {
         "matchPackagePatterns": ["eslint"],
         "groupName": "eslint packages"
       }
     ]
   }
   ```

### Breaking Change Detection

1. **Check Changelogs**
   - Review CHANGELOG.md
   - Check GitHub releases
   - Read migration guides

2. **Test Strategy**
   ```bash
   # Run tests after update
   npm test
   
   # Run type check
   npm run typecheck
   
   # Run lint
   npm run lint
   ```

### Conflict Resolution

1. **Peer Dependency Issues**
   ```bash
   # npm
   npm install --legacy-peer-deps
   
   # Or fix properly
   npm install package@version
   ```

2. **Version Conflicts**
   ```bash
   # Check dependency tree
   npm ls package-name
   
   # Dedupe
   npm dedupe
   ```

## Output Contract
- Update recommendations
- Security vulnerability reports
- Breaking change warnings
- Test verification steps
- Rollback procedures

## Constraints
- Always backup before major updates
- Test after updates
- Document breaking changes
- Consider semantic versioning
- Review security advisories

## Examples

### Example 1: npm Update Report
```
=== Dependency Update Report ===

Outdated Packages (12 total):
| Package        | Current | Latest | Type     |
|----------------|---------|--------|----------|
| express        | 4.18.1  | 4.18.2 | minor    |
| lodash         | 4.17.20 | 4.17.21| patch    |
| typescript     | 5.0.0   | 5.2.0  | minor    |
| react          | 18.1.0  | 18.2.0 | minor    |

Security Vulnerabilities (2):
| Package        | Severity | CVE        | Fix      |
|----------------|----------|------------|----------|
| lodash         | high     | CVE-2021   | 4.17.21+ |
| node-fetch     | critical | CVE-2022   | 3.2.0+   |

Recommended Actions:
1. npm update lodash  # Patch security fix
2. npm install node-fetch@latest  # Critical security fix
3. npm update  # Safe minor/patch updates
4. npx npm-check-updates -u && npm install  # Major updates (review first)
```

### Example 2: Python Update Script
```python
#!/usr/bin/env python3
"""Update Python dependencies with safety checks."""

import subprocess
import sys

def run(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True)

def main():
    # Check outdated
    result = run("pip list --outdated --format=freeze")
    outdated = [line.split("==")[0] for line in result.stdout.strip().split("\n") if line]
    
    print(f"Found {len(outdated)} outdated packages")
    
    # Security check
    result = run("safety check --json")
    if result.returncode != 0:
        print("Security vulnerabilities found!")
        print(result.stdout)
        return 1
    
    # Update each package
    for package in outdated:
        print(f"Updating {package}...")
        run(f"pip install --upgrade {package}")
    
    # Run tests
    print("Running tests...")
    result = run("pytest")
    if result.returncode != 0:
        print("Tests failed! Rolling back...")
        run("pip install -r requirements.txt")
        return 1
    
    print("Update complete!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```
