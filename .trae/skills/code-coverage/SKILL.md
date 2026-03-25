# Code Coverage

## Description
Expert in test coverage analysis, coverage tools configuration, coverage reporting, and testing strategy optimization for comprehensive test suites.

## Usage Scenario
Use this skill when:
- Setting up coverage tools
- Analyzing coverage reports
- Improving test coverage
- Configuring coverage thresholds
- CI/CD coverage integration
- Coverage for multiple languages

## Instructions

### Coverage Metrics

1. **Types of Coverage**
   ```
   Line Coverage: % of code lines executed
   Branch Coverage: % of branches executed
   Function Coverage: % of functions called
   Statement Coverage: % of statements executed
   MC/DC Coverage: Modified condition/decision coverage
   ```

2. **Coverage Targets**
   ```
   Critical Systems: 95%+ 
   Production Code: 80%+
   Utility Code: 70%+
   New Features: 90%+
   ```

### JavaScript/TypeScript

1. **Jest Configuration**
   ```javascript
   // jest.config.js
   module.exports = {
     coverageProvider: 'v8',
     collectCoverage: true,
     coverageDirectory: 'coverage',
     coverageReporters: ['text', 'lcov', 'html'],
     coverageThreshold: {
       global: {
         branches: 80,
         functions: 80,
         lines: 80,
         statements: 80,
       },
     },
     collectCoverageFrom: [
       'src/**/*.{js,ts}',
       '!src/**/*.d.ts',
       '!src/**/*.test.{js,ts}',
       '!src/**/index.{js,ts}',
     ],
   };
   ```

2. **Vitest Configuration**
   ```typescript
   // vitest.config.ts
   import { defineConfig } from 'vitest/config';
   
   export default defineConfig({
     test: {
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         exclude: [
           'node_modules/',
           'src/**/*.d.ts',
           'src/**/*.test.ts',
         ],
         thresholds: {
           lines: 80,
           functions: 80,
           branches: 80,
           statements: 80,
         },
       },
     },
   });
   ```

### Python

1. **Coverage.py Configuration**
   ```ini
   # .coveragerc
   [run]
   source = src
   branch = True
   omit =
       */tests/*
       */__pycache__/*
       */site-packages/*
   
   [report]
   exclude_lines =
       pragma: no cover
       def __repr__
       raise NotImplementedError
       if TYPE_CHECKING:
   fail_under = 80
   
   [html]
   directory = htmlcov
   ```

2. **pytest-cov**
   ```bash
   pytest --cov=src --cov-report=html --cov-report=xml --cov-fail-under=80
   ```

3. **pyproject.toml**
   ```toml
   [tool.pytest.ini_options]
   addopts = "--cov=src --cov-report=term-missing"
   
   [tool.coverage.run]
   source = ["src"]
   branch = true
   
   [tool.coverage.report]
   fail_under = 80
   ```

### Go

1. **Go Test Coverage**
   ```bash
   # Generate coverage
   go test -coverprofile=coverage.out ./...
   
   # View coverage
   go tool cover -func=coverage.out
   
   # HTML report
   go tool cover -html=coverage.out -o coverage.html
   ```

2. **gocov**
   ```bash
   go install github.com/axw/gocov/gocov@latest
   gocov test ./... | gocov report
   ```

### Java

1. **JaCoCo Configuration**
   ```xml
   <!-- pom.xml -->
   <plugin>
     <groupId>org.jacoco</groupId>
     <artifactId>jacoco-maven-plugin</artifactId>
     <version>0.8.10</version>
     <executions>
       <execution>
         <goals>
           <goal>prepare-agent</goal>
         </goals>
       </execution>
       <execution>
         <id>report</id>
         <phase>test</phase>
         <goals>
           <goal>report</goal>
         </goals>
       </execution>
       <execution>
         <id>check</id>
         <goals>
           <goal>check</goal>
         </goals>
         <configuration>
           <rules>
             <rule>
               <element>BUNDLE</element>
               <limits>
                 <limit>
                   <counter>LINE</counter>
                   <value>COVEREDRATIO</value>
                   <minimum>0.80</minimum>
                 </limit>
               </limits>
             </rule>
           </rules>
         </configuration>
       </execution>
     </executions>
   </plugin>
   ```

### CI/CD Integration

1. **GitHub Actions**
   ```yaml
   name: Coverage
   
   on: [push, pull_request]
   
   jobs:
     coverage:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
         - run: npm ci
         - run: npm test -- --coverage
         - uses: codecov/codecov-action@v3
           with:
             files: ./coverage/lcov.info
             fail_ci_if_error: true
   ```

2. **Codecov Configuration**
   ```yaml
   # codecov.yml
   coverage:
     precision: 2
     round: down
     range: "70...100"
   
   status:
     project:
       default:
         target: 80%
         threshold: 5%
     patch:
       default:
         target: 80%
   
   ignore:
     - "**/*.test.ts"
     - "**/*.spec.ts"
   ```

### Coverage Reports

1. **HTML Report Analysis**
   ```
   Coverage Report Summary:
   
   File                    | Lines | Functions | Branches
   ------------------------|-------|-----------|----------
   src/utils.ts           | 95%   | 100%      | 88%
   src/api.ts             | 78%   | 75%       | 70%
   src/database.ts        | 65%   | 60%       | 55%
   
   Uncovered Lines:
   - src/api.ts:45-50 (error handling)
   - src/database.ts:100-120 (connection retry)
   ```

2. **JSON Report Structure**
   ```json
   {
     "total": {
       "lines": { "total": 1000, "covered": 850, "percentage": 85 },
       "functions": { "total": 100, "covered": 90, "percentage": 90 },
       "branches": { "total": 200, "covered": 160, "percentage": 80 }
     }
   }
   ```

### Improving Coverage

1. **Identify Gaps**
   ```bash
   # Find files with low coverage
   coverage report | grep -E "^\S+\s+[0-6][0-9]%"
   ```

2. **Priority Order**
   ```
   1. Critical business logic
   2. Error handling paths
   3. Edge cases
   4. Utility functions
   ```

3. **Test Strategies**
   ```
   - Unit tests for isolated logic
   - Integration tests for API endpoints
   - E2E tests for critical flows
   - Mutation testing for quality
   ```

### Mutation Testing

1. **Stryker (JavaScript)**
   ```javascript
   // stryker.conf.js
   module.exports = {
     mutate: ['src/**/*.ts'],
     testRunner: 'jest',
     reporters: ['html', 'clear-text', 'progress'],
     thresholds: { high: 80, low: 60, break: 50 },
   };
   ```

2. **mutmut (Python)**
   ```bash
   pip install mutmut
   mutmut run
   mutmut results
   ```

## Output Contract
- Coverage configuration files
- Coverage reports
- Improvement recommendations
- CI/CD integration
- Threshold configurations

## Constraints
- Don't chase 100% coverage blindly
- Focus on meaningful tests
- Exclude generated code
- Consider test quality over quantity
- Document coverage exclusions

## Examples

### Example 1: Coverage Report
```
===================== test session starts =====================
Coverage Report:
Name                          Stmts   Miss  Cover
-------------------------------------------------
src/__init__.py                   1      0   100%
src/api.py                      150     30    80%
src/database.py                 200     50    75%
src/utils.py                     50      5    90%
-------------------------------------------------
TOTAL                           401     85    79%

Missing lines:
src/api.py:45-50, 78-82
src/database.py:100-120, 200-210

Coverage threshold not met: 79% < 80%
```

### Example 2: Jest Coverage Script
```json
{
  "scripts": {
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=lcov",
    "test:coverage:watch": "jest --coverage --watch",
    "test:coverage:ci": "jest --coverage --ci --reporters=default --reporters=jest-junit"
  }
}
```
