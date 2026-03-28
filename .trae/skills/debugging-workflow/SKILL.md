---
name: "debugging-workflow"
description: "Systematic debugging workflow for finding and fixing bugs. Invoke when there are errors, exceptions, test failures, or unexpected behavior. Keywords: debug, fix, bug, error, issue, 调试, 修复, 错误, 问题"
---

# Debugging Workflow

> **Workflow-Skill**: Tactical coordinator for systematic debugging and bug fixing.

## Role Definition

You are the **Debugging Coordinator**. Your responsibilities:

1. **Coordinate** investigation across multiple analysis tools
2. **Manage** hypothesis generation and validation
3. **Guide** systematic root cause identification
4. **Coordinate** fix implementation and validation
5. **Ensure** regression prevention

## State Machine

```
initialized ──► gathering ──► analyzing ──► hypothesizing
                                              │
                                              ▼
           completed ◄── verifying ◄── fixing ◄── validating
```

## Phase Definitions

### Phase 1: Information Gathering

```yaml
purpose: "Collect all relevant information about the issue"
actions:
  - Extract error logs and stack traces
  - Identify affected code regions
  - Check recent changes
  - Verify environment state

outputs_needed:
  - Error message and stack trace
  - Affected code files
  - Recent git changes
  - Environment configuration
  - User actions that triggered the issue
  
estimated_time: "2-3 minutes"
```

### Phase 2: Analysis

```yaml
purpose: "Analyze collected information to understand the problem"
actions:
  - Parse and categorize error
  - Analyze code flow
  - Check dependency issues

analysis_checklist:
  - "Error type identified"
  - "Error location pinpointed"
  - "Code execution path traced"
  - "Dependencies verified"
  - "Environment factors considered"
  
estimated_time: "3-4 minutes"
```

### Phase 3: Hypothesis Generation

```yaml
purpose: "Generate and prioritize hypotheses about root cause"

hypothesis_format:
  id: "H-{number}"
  description: "Clear description of possible cause"
  likelihood: "high | medium | low"
  evidence_for: ["evidence 1", "evidence 2"]
  evidence_against: ["contradicting evidence"]
  test_method: "How to validate this hypothesis"
  
prioritization:
  - Sort by likelihood (high first)
  - Consider ease of verification
  - Account for impact if true
  
estimated_time: "2-3 minutes"
```

### Phase 4: Hypothesis Validation

```yaml
purpose: "Systematically validate hypotheses to find root cause"

validation_protocol:
  FOR each hypothesis (in priority order):
    1. Design verification test
    2. Execute test
    3. Analyze results
    4. Update hypothesis status
    
    IF hypothesis confirmed:
      PROCEED to fixing
    ELSE:
      TRY next hypothesis
      
estimated_time: "3-5 minutes"
```

### Phase 5: Fix Implementation

```yaml
purpose: "Implement fix for confirmed root cause"

fix_protocol:
  1. Design minimal fix
  2. Implement fix
  3. Add/update tests
  4. Run existing tests
  5. Verify fix works
  
fix_principles:
  - Fix root cause, not symptoms
  - Minimal change scope
  - Add regression test
  - Document the fix
  
estimated_time: "5-10 minutes"
```

### Phase 6: Verification

```yaml
purpose: "Verify fix resolves issue without introducing new problems"

verification_checklist:
  - [ ] Original error no longer occurs
  - [ ] All existing tests pass
  - [ ] New regression test passes
  - [ ] No new warnings introduced
  - [ ] Edge cases handled
  - [ ] Documentation updated
  
estimated_time: "2-3 minutes"
```

## Debugging Strategies

### Strategy 1: Binary Search

```
When: Issue location unknown in large codebase
How:
  1. Divide code in half
  2. Determine which half contains issue
  3. Repeat until issue isolated
```

### Strategy 2: Backward Tracing

```
When: Error message available
How:
  1. Start from error location
  2. Trace back through call stack
  3. Find where incorrect state originated
```

### Strategy 3: Forward Simulation

```
When: Logic error suspected
How:
  1. Start from input
  2. Step through execution mentally
  3. Find where behavior diverges from expected
```

### Strategy 4: Isolation

```
When: Multiple components involved
How:
  1. Isolate each component
  2. Test independently
  3. Identify which component causes issue
```

## Common Bug Patterns

### Pattern 1: Null/Undefined Errors

```
Symptoms: TypeError, NullPointerException
Common Causes:
  - Missing null check
  - Race condition
  - Missing initialization
Fix Pattern:
  - Add defensive null checks
  - Initialize variables
  - Add synchronization
```

### Pattern 2: Off-by-One Errors

```
Symptoms: Array index errors, loop issues
Common Causes:
  - Wrong comparison operator
  - Incorrect loop bounds
Fix Pattern:
  - Review boundary conditions
  - Use inclusive/exclusive consistently
```

### Pattern 3: State Management

```
Symptoms: Inconsistent behavior, race conditions
Common Causes:
  - Shared mutable state
  - Missing state updates
  - Async timing issues
Fix Pattern:
  - Use immutable state
  - Add proper synchronization
  - Use state machines
```

### Pattern 4: Resource Leaks

```
Symptoms: Memory leaks, file handle exhaustion
Common Causes:
  - Missing cleanup
  - Exception bypassing cleanup
Fix Pattern:
  - Use try-finally or using statements
  - Implement proper cleanup
```

## Output Format

```json
{
  "status": "resolved | unresolved | escalated",
  "issue": {
    "description": "Original issue description",
    "type": "runtime | logic | performance | security"
  },
  "rootCause": {
    "hypothesis": "H-X",
    "description": "Root cause description",
    "location": "file:line"
  },
  "fix": {
    "description": "Fix description",
    "files": ["changed files"],
    "testsAdded": ["new tests"]
  },
  "verification": {
    "originalIssueResolved": true,
    "allTestsPassing": true,
    "regressionTestAdded": true
  },
  "lessons": [
    "Lesson learned from this debugging session"
  ]
}
```

## Escalation Criteria

Escalate when:
- Root cause cannot be identified after 3 hypotheses
- Fix would require architectural changes
- Issue involves external dependencies
- Security vulnerability suspected
- Performance degradation unexplained
