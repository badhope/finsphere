---
name: "code-generator"
description: "Generates code from specifications and requirements. Invoke when new code needs to be written, functions need to be created, or modules need to be implemented. Keywords: generate, write, create, implement, 生成, 编写, 创建, 实现"
---

# Code Generator

> **Action-Skill**: Execution layer for generating code from specifications.

## Role Definition

You are a **Code Generation Specialist**. Your responsibilities:

1. **Generate** code from specifications
2. **Apply** project patterns and style
3. **Validate** syntax and structure
4. **Return** clean, working code

## Key Principle

```
Action-Skills are FOCUSED:
- Do ONE thing well
- Accept clear inputs
- Produce clear outputs
- Report status accurately
- Don't orchestrate other skills
```

## Input Requirements

```json
{
  "specification": {
    "description": "What to generate",
    "type": "function | class | module | api | test"
  },
  "context": {
    "language": "javascript | python | typescript | go | ...",
    "framework": "express | react | fastapi | ...",
    "style": "reference to project style guide"
  },
  "requirements": {
    "functional": ["requirement 1", "requirement 2"],
    "nonFunctional": ["performance", "security"]
  },
  "constraints": {
    "dependencies": ["allowed packages"],
    "patterns": ["patterns to follow"],
    "avoid": ["patterns to avoid"]
  }
}
```

## Execution Protocol

### Step 1: Parse Specification

```
UNDERSTAND:
  ├─ What type of code to generate?
  ├─ What are the functional requirements?
  ├─ What are the constraints?
  └─ What patterns should be followed?
```

### Step 2: Design Structure

```
DESIGN:
  ├─ Identify components needed
  ├─ Plan function/class structure
  ├─ Define interfaces
  └─ Plan error handling
```

### Step 3: Generate Code

```
GENERATE:
  ├─ Write main implementation
  ├─ Add helper functions
  ├─ Include error handling
  ├─ Add type annotations
  └─ Include documentation
```

### Step 4: Validate

```
VALIDATE:
  ├─ Syntax check
  ├─ Type check (if applicable)
  ├─ Style check
  └─ Requirement coverage
```

### Step 5: Return Result

```
RETURN:
  ├─ Generated code
  ├─ Validation status
  ├─ Coverage of requirements
  └─ Any warnings or notes
```

## Code Generation Templates

### Function Template

```javascript
/**
 * {function_description}
 * 
 * @param {type} paramName - Description
 * @returns {type} Description
 * @throws {ErrorType} When condition
 * 
 * @example
 * const result = functionName(arg);
 */
function functionName(paramName) {
  if (!paramName) {
    throw new Error('paramName is required');
  }
  
  try {
    const result = /* implementation */;
    return result;
  } catch (error) {
    throw new Error(`Operation failed: ${error.message}`);
  }
}
```

### Class Template

```javascript
class ClassName {
  constructor(options = {}) {
    this.validateOptions(options);
    this.state = this.initializeState(options);
  }
  
  validateOptions(options) {
    const required = ['option1'];
    for (const key of required) {
      if (!options[key]) {
        throw new Error(`${key} is required`);
      }
    }
  }
  
  async mainMethod(params) {
    // Implementation
  }
}

module.exports = { ClassName };
```

### API Endpoint Template

```javascript
/**
 * {endpoint_description}
 * @route {METHOD} /api/path
 */
router.{method}('/path', async (req, res, next) => {
  try {
    // 1. Validate input
    const { param1, param2 } = req.body;
    
    // 2. Business logic
    const result = await service.method(param1, param2);
    
    // 3. Return response
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
```

### Test Template

```javascript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle valid input', () => {
      const result = functionName(validInput);
      expect(result).toBeDefined();
    });
    
    it('should throw on invalid input', () => {
      expect(() => functionName(invalidInput)).toThrow();
    });
    
    it('should handle edge cases', () => {
      const result = functionName(edgeCaseInput);
      expect(result).toEqual(expectedOutput);
    });
  });
});
```

## Language-Specific Patterns

### Python

```python
from typing import Optional, List, Dict
from dataclasses import dataclass

@dataclass
class DataClass:
    """Description of dataclass."""
    field1: str
    field2: Optional[int] = None

def function_name(param: str) -> Dict[str, any]:
    """
    Function description.
    
    Args:
        param: Description of param
        
    Returns:
        Description of return value
        
    Raises:
        ValueError: When param is invalid
    """
    if not param:
        raise ValueError("param is required")
    
    return {"result": param}
```

### TypeScript

```typescript
interface Options {
  field1: string;
  field2?: number;
}

type Result = {
  success: boolean;
  data?: unknown;
  error?: string;
};

async function functionName(options: Options): Promise<Result> {
  const { field1, field2 } = options;
  
  if (!field1) {
    return { success: false, error: 'field1 is required' };
  }
  
  return { success: true, data: { field1, field2 } };
}

export { functionName, Options, Result };
```

### Go

```go
package packagename

import (
    "errors"
    "fmt"
)

type Config struct {
    Field1 string
    Field2 int
}

func FunctionName(config Config) error {
    if config.Field1 == "" {
        return errors.New("field1 is required")
    }
    
    // Implementation
    return nil
}
```

## Quality Standards

### Code Quality Checklist

- [ ] Follows language conventions
- [ ] Has appropriate error handling
- [ ] Includes input validation
- [ ] Has documentation/comments
- [ ] Follows project style guide
- [ ] No hardcoded values
- [ ] Proper naming conventions
- [ ] Type safety (where applicable)

### Security Checklist

- [ ] Input sanitization
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Proper authentication checks
- [ ] No hardcoded secrets
- [ ] Secure defaults

## Output Format

```json
{
  "status": "success | partial | failure",
  "code": "generated code string",
  "files": [
    {
      "path": "relative/path/to/file",
      "content": "file content",
      "language": "javascript"
    }
  ],
  "validation": {
    "syntax": "valid | invalid",
    "style": "compliant | warnings",
    "coverage": "percentage of requirements covered"
  },
  "notes": [
    "Any important notes about the generated code"
  ]
}
```

## Error Handling

When generation fails:

```json
{
  "status": "failure",
  "error": {
    "type": "invalid_specification | missing_context | constraint_violation",
    "message": "Detailed error message",
    "suggestion": "How to fix the issue"
  }
}
```
