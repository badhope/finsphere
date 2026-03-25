# Linting Configuration

## Description
Expert in configuring and customizing linting tools across multiple languages including ESLint, Pylint, Ruff, golangci-lint, and Clippy. Ensures code quality and consistency.

## Usage Scenario
Use this skill when:
- Setting up linting for new projects
- Configuring custom lint rules
- Integrating linting with CI/CD
- Fixing linting errors
- Creating shared lint configurations
- Multi-language project linting

## Instructions

### ESLint (JavaScript/TypeScript)

1. **Basic Configuration**
   ```javascript
   // .eslintrc.js
   module.exports = {
     root: true,
     env: {
       browser: true,
       es2022: true,
       node: true,
     },
     extends: [
       'eslint:recommended',
       'plugin:@typescript-eslint/recommended',
       'plugin:import/recommended',
       'plugin:import/typescript',
       'prettier',
     ],
     parser: '@typescript-eslint/parser',
     parserOptions: {
       ecmaVersion: 'latest',
       sourceType: 'module',
       project: './tsconfig.json',
     },
     plugins: ['@typescript-eslint', 'import'],
     rules: {
       // Error prevention
       'no-console': ['warn', { allow: ['warn', 'error'] }],
       'no-debugger': 'error',
       'no-unused-vars': 'off',
       '@typescript-eslint/no-unused-vars': ['error', { 
         argsIgnorePattern: '^_',
         varsIgnorePattern: '^_' 
       }],
       
       // Code quality
       '@typescript-eslint/explicit-function-return-type': 'off',
       '@typescript-eslint/no-explicit-any': 'warn',
       '@typescript-eslint/no-non-null-assertion': 'warn',
       
       // Import organization
       'import/order': ['error', {
         groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
         'newlines-between': 'always',
         alphabetize: { order: 'asc' },
       }],
       'import/no-unresolved': 'error',
       'import/no-duplicates': 'error',
     },
     settings: {
       'import/resolver': {
         typescript: {},
       },
     },
     ignorePatterns: ['dist', 'node_modules', '*.config.js'],
   };
   ```

2. **Shared Configuration Package**
   ```javascript
   // packages/eslint-config/index.js
   module.exports = {
     extends: [
       require.resolve('./base'),
       require.resolve('./typescript'),
       require.resolve('./react'),
     ],
   };
   
   // Usage in project
   // .eslintrc.js
   module.exports = {
     extends: ['@myorg/eslint-config'],
   };
   ```

3. **Flat Config (ESLint 9+)**
   ```javascript
   // eslint.config.js
   import js from '@eslint/js';
   import ts from '@typescript-eslint/eslint-plugin';
   import tsParser from '@typescript-eslint/parser';
   
   export default [
     js.configs.recommended,
     {
       files: ['**/*.ts'],
       languageOptions: {
         parser: tsParser,
         parserOptions: {
           ecmaVersion: 'latest',
           sourceType: 'module',
         },
       },
       plugins: {
         '@typescript-eslint': ts,
       },
       rules: {
         '@typescript-eslint/no-unused-vars': 'error',
       },
     },
   ];
   ```

### Python (Ruff/Pylint)

1. **Ruff Configuration**
   ```toml
   # pyproject.toml
   [tool.ruff]
   line-length = 100
   target-version = "py310"
   
   select = [
     "E",   # pycodestyle errors
     "W",   # pycodestyle warnings
     "F",   # pyflakes
     "I",   # isort
     "B",   # flake8-bugbear
     "C4",  # flake8-comprehensions
     "UP",  # pyupgrade
     "ARG", # flake8-unused-arguments
     "SIM", # flake8-simplify
   ]
   
   ignore = [
     "E501",  # line too long (handled by formatter)
     "B008",  # do not perform function calls in argument defaults
   ]
   
   [tool.ruff.per-file-ignores]
   "__init__.py" = ["F401"]
   "tests/*" = ["ARG"]
   
   [tool.ruff.isort]
   known-first-party = ["myapp"]
   ```

2. **Pylint Configuration**
   ```ini
   # .pylintrc
   [MASTER]
   ignore=tests,venv
   extension-pkg-whitelist=pydantic
   
   [MESSAGES CONTROL]
   disable=
       C0114,  # missing-module-docstring
       C0115,  # missing-class-docstring
       C0116,  # missing-function-docstring
       R0903,  # too-few-public-methods
   
   [FORMAT]
   max-line-length=100
   indent-string='    '
   
   [BASIC]
   good-names=i,j,k,ex,_,id,db
   
   [DESIGN]
   max-args=7
   max-attributes=10
   ```

### Go (golangci-lint)

1. **Configuration**
   ```yaml
   # .golangci.yml
   run:
     timeout: 5m
     skip-dirs:
       - vendor
       - testdata
   
   linters:
     enable:
       - gofmt
       - goimports
       - govet
       - errcheck
       - staticcheck
       - ineffassign
       - typecheck
       - gosimple
       - goconst
       - gocyclo
       - dupl
       - misspell
       - revive
   
   linters-settings:
     govet:
       check-shadowing: true
     gocyclo:
       min-complexity: 15
     goconst:
       min-len: 3
       min-occurrences: 3
     revive:
       rules:
         - name: var-naming
           severity: warning
     goimports:
       local-prefixes: github.com/myorg/myproject
   
   issues:
     exclude-rules:
       - path: _test\.go
         linters:
           - dupl
           - gosec
   ```

### Rust (Clippy)

1. **Configuration**
   ```toml
   # .clippy.toml
   msrv = "1.70"
   
   # Cargo.toml
   [lints.clippy]
   pedantic = "warn"
   nursery = "warn"
   unwrap_used = "warn"
   expect_used = "warn"
   
   [lints.rust]
   unsafe_code = "forbid"
   ```

2. **Clippy.toml**
   ```toml
   # .clippy.toml
   avoid-breaking-exported-api = false
   cognitive-complexity-threshold = 25
   ```

### Java (Checkstyle/SpotBugs)

1. **Checkstyle Configuration**
   ```xml
   <!-- checkstyle.xml -->
   <?xml version="1.0"?>
   <!DOCTYPE module PUBLIC
     "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
     "https://checkstyle.org/dtds/configuration_1_3.dtd">
   
   <module name="Checker">
     <property name="charset" value="UTF-8"/>
     
     <module name="TreeWalker">
       <module name="Indentation">
         <property name="basicOffset" value="2"/>
       </module>
       
       <module name="LineLength">
         <property name="max" value="100"/>
       </module>
       
       <module name="MethodName">
         <property name="format" value="^[a-z][a-zA-Z0-9]*$"/>
       </module>
       
       <module name="ParameterName">
         <property name="format" value="^[a-z][a-zA-Z0-9]*$"/>
       </module>
     </module>
   </module>
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
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - run: pip install ruff
      - run: ruff check .
```

### IDE Integration

1. **VS Code settings.json**
   ```json
   {
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": "explicit",
       "source.organizeImports": "explicit"
     },
     "eslint.validate": [
       "javascript",
       "javascriptreact",
       "typescript",
       "typescriptreact"
     ],
     "python.linting.enabled": true,
     "python.linting.ruffEnabled": true
   }
   ```

## Output Contract
- Linter configuration files
- Custom rule definitions
- CI/CD integration
- IDE settings
- Shared configuration packages

## Constraints
- Balance strictness with productivity
- Consider team conventions
- Document rule decisions
- Allow exceptions when needed
- Keep configurations maintainable

## Examples

### Example 1: React Project ESLint
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
```

### Example 2: Monorepo Shared Config
```javascript
// packages/eslint-config/base.js
module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
  },
};

// packages/eslint-config/typescript.js
module.exports = {
  extends: [
    './base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
};

// packages/eslint-config/react.js
module.exports = {
  extends: [
    './typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
};
```
