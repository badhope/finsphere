# Code Formatting

## Description
Expert in code formatting configuration and style enforcement using tools like Prettier, ESLint, Black, rustfmt, and other formatters. Ensures consistent code style across projects.

## Usage Scenario
Use this skill when:
- Setting up code formatters
- Configuring linting rules
- Creating style guides
- Enforcing code conventions
- Integrating formatters with CI/CD
- Multi-language project formatting

## Instructions

### JavaScript/TypeScript

1. **Prettier Configuration**
   ```json
   // .prettierrc
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100,
     "bracketSpacing": true,
     "arrowParens": "always",
     "endOfLine": "lf"
   }
   ```

2. **ESLint Configuration**
   ```javascript
   // .eslintrc.js
   module.exports = {
     root: true,
     env: {
       node: true,
       es2022: true,
     },
     extends: [
       'eslint:recommended',
       '@typescript-eslint/recommended',
       'prettier', // Must be last
     ],
     parser: '@typescript-eslint/parser',
     parserOptions: {
       ecmaVersion: 'latest',
       sourceType: 'module',
     },
     rules: {
       'no-console': ['warn', { allow: ['warn', 'error'] }],
       'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
       '@typescript-eslint/no-explicit-any': 'warn',
     },
   };
   ```

3. **Package.json Scripts**
   ```json
   {
     "scripts": {
       "format": "prettier --write \"src/**/*.{js,ts,json,css,md}\"",
       "format:check": "prettier --check \"src/**/*.{js,ts,json,css,md}\"",
       "lint": "eslint src --ext .js,.ts",
       "lint:fix": "eslint src --ext .js,.ts --fix"
     }
   }
   ```

### Python

1. **Black Configuration**
   ```toml
   # pyproject.toml
   [tool.black]
   line-length = 100
   target-version = ['py39', 'py310', 'py311']
   include = '\.pyi?$'
   exclude = '''
   /(
       \.git
     | \.venv
     | build
     | dist
   )/
   '''
   ```

2. **isort Configuration**
   ```toml
   [tool.isort]
   profile = "black"
   line_length = 100
   known_first_party = ["myapp"]
   sections = ["FUTURE", "STDLIB", "THIRDPARTY", "FIRSTPARTY", "LOCALFOLDER"]
   ```

3. **Ruff Configuration**
   ```toml
   [tool.ruff]
   line-length = 100
   select = ["E", "F", "I", "N", "W", "UP"]
   ignore = ["E501"]
   
   [tool.ruff.per-file-ignores]
   "__init__.py" = ["F401"]
   ```

### Go

1. **gofmt & goimports**
   ```bash
   # Format code
   gofmt -w .
   
   # Format with import organization
   goimports -w .
   ```

2. **golangci-lint**
   ```yaml
   # .golangci.yml
   linters:
     enable:
       - gofmt
       - goimports
       - govet
       - errcheck
       - staticcheck
       - ineffassign
   
   linters-settings:
     gofmt:
       simplify: true
     goimports:
       local-prefixes: github.com/myorg/myproject
   ```

### Rust

1. **rustfmt Configuration**
   ```toml
   # rustfmt.toml
   max_width = 100
   tab_spaces = 4
   edition = "2021"
   use_small_heuristics = "Default"
   imports_granularity = "Crate"
   reorder_imports = true
   ```

2. **Clippy Configuration**
   ```toml
   # .clippy.toml
   msrv = "1.70"
   ```

### Java

1. **Google Java Format**
   ```xml
   <!-- pom.xml -->
   <plugin>
     <groupId>com.coveo</groupId>
     <artifactId>fmt-maven-plugin</artifactId>
     <version>2.19</version>
     <configuration>
       <style>google</style>
     </configuration>
   </plugin>
   ```

2. **Checkstyle**
   ```xml
   <!-- checkstyle.xml -->
   <module name="Checker">
     <property name="charset" value="UTF-8"/>
     <module name="TreeWalker">
       <module name="Indentation">
         <property name="basicOffset" value="2"/>
       </module>
       <module name="LineLength">
         <property name="max" value="100"/>
       </module>
     </module>
   </module>
   ```

### EditorConfig

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,ts,json,yml,yaml}]
indent_style = space
indent_size = 2

[*.py]
indent_style = space
indent_size = 4

[*.go]
indent_style = tab

[Makefile]
indent_style = tab

[*.md]
trim_trailing_whitespace = false
```

### Pre-commit Hooks

1. **Husky + lint-staged**
   ```json
   // package.json
   {
     "lint-staged": {
       "*.{js,ts}": ["eslint --fix", "prettier --write"],
       "*.{json,md,css}": ["prettier --write"]
     }
   }
   ```

2. **pre-commit (Python)**
   ```yaml
   # .pre-commit-config.yaml
   repos:
     - repo: https://github.com/psf/black
       rev: 23.3.0
       hooks:
         - id: black
     - repo: https://github.com/pycqa/isort
       rev: 5.12.0
       hooks:
         - id: isort
     - repo: https://github.com/astral-sh/ruff-pre-commit
       rev: v0.0.270
       hooks:
         - id: ruff
   ```

### CI/CD Integration

```yaml
# GitHub Actions
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint
```

## Output Contract
- Formatter configurations
- Linter configurations
- EditorConfig files
- Pre-commit hook setups
- CI/CD integration

## Constraints
- Use project-appropriate tools
- Consider team conventions
- Document configuration choices
- Ensure CI/CD enforcement
- Handle edge cases gracefully

## Examples

### Example 1: Full TypeScript Project Setup
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
  },
};
```

```json
// package.json
{
  "scripts": {
    "format": "prettier --write .",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.45.0",
    "eslint-config-prettier": "^8.8.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Example 2: Python Project Setup
```toml
# pyproject.toml
[tool.black]
line-length = 100
target-version = ["py310"]

[tool.isort]
profile = "black"
line_length = 100

[tool.ruff]
line-length = 100
select = ["E", "F", "I", "N", "W", "UP", "B", "C4"]
ignore = ["E501"]

[tool.mypy]
python_version = "3.10"
strict = true
warn_return_any = true
```

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/psf/black
    rev: 23.3.0
    hooks:
      - id: black
  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.0.270
    hooks:
      - id: ruff
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.3.0
    hooks:
      - id: mypy
```
