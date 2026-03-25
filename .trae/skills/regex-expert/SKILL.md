# Regex Expert

## Description
Expert in regular expression generation, debugging, and optimization. Supports multiple regex flavors (PCRE, JavaScript, Python, Go, Java) and provides clear explanations of patterns.

## Usage Scenario
Use this skill when:
- Generating regex patterns from requirements
- Debugging and fixing regex issues
- Optimizing regex performance
- Converting between regex flavors
- Validating input patterns
- Explaining complex regex patterns

## Instructions

### Pattern Generation Process

1. **Understand Requirements**
   - What should match?
   - What should NOT match?
   - Which regex flavor?
   - Performance requirements?

2. **Build Incrementally**
   - Start with simple patterns
   - Add complexity step by step
   - Test each iteration

3. **Validate and Optimize**
   - Test against edge cases
   - Check for catastrophic backtracking
   - Optimize for readability

### Common Patterns

1. **Email Validation**
   ```regex
   # Basic
   ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
   
   # RFC 5322 Compliant (simplified)
   ^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$
   ```

2. **Phone Numbers**
   ```regex
   # International format
   ^\+?[1-9]\d{1,14}$
   
   # US format
   ^(\+1|1)?[-.\s]?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}$
   
   # Chinese mobile
   ^1[3-9]\d{9}$
   ```

3. **URL Validation**
   ```regex
   # HTTP/HTTPS URLs
   ^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$
   
   # With protocol extraction
   ^(https?):\/\/([^\/:]+)(?::(\d+))?(\/.*)?$
   ```

4. **Date Patterns**
   ```regex
   # ISO 8601
   ^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$
   
   # Common formats
   ^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$  # YYYY-MM-DD or YYYY/MM/DD
   ^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$  # MM-DD-YYYY or DD/MM/YYYY
   ```

5. **IP Addresses**
   ```regex
   # IPv4
   ^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
   
   # IPv6 (simplified)
   ^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$
   ```

6. **Password Strength**
   ```regex
   # At least 8 chars, 1 uppercase, 1 lowercase, 1 number
   ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$
   
   # With special character requirement
   ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
   ```

### Flavor Differences

1. **JavaScript**
   ```javascript
   // No lookbehind support (until ES2018)
   // Use groups instead
   const regex = /(\d{4})-(\d{2})-(\d{2})/;
   
   // Named groups (ES2018+)
   const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
   ```

2. **Python**
   ```python
   import re
   
   # Verbose mode for readability
   pattern = r'''
       ^                   # Start
       (?P<username>\w+)   # Username
       @                   # @ symbol
       (?P<domain>\w+\.\w+) # Domain
       $                   # End
   '''
   re.match(pattern, email, re.VERBOSE)
   ```

3. **Go**
   ```go
   // RE2 syntax (no lookaround)
   // Must use alternative approaches
   re := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)
   ```

### Performance Optimization

1. **Avoid Catastrophic Backtracking**
   ```regex
   # Bad: Nested quantifiers
   (a+)+$
   
   # Good: Atomic groups or possessive quantifiers
   (a++)$
   ```

2. **Use Non-Capturing Groups**
   ```regex
   # Capturing (slower)
   (https?|ftp)://([^/]+)
   
   # Non-capturing (faster)
   (?:https?|ftp)://([^/]+)
   ```

3. **Anchor Patterns**
   ```regex
   # Without anchors: scans entire string
   \d{4}-\d{2}-\d{2}
   
   # With anchors: fails fast
   ^\d{4}-\d{2}-\d{2}$
   ```

### Debugging Techniques

1. **Break Down Pattern**
   ```
   Original: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
   
   Break down:
   ^                 # Start
   (?=.*[a-z])       # Lookahead: contains lowercase
   (?=.*[A-Z])       # Lookahead: contains uppercase
   (?=.*\d)          # Lookahead: contains digit
   .{8,}             # At least 8 characters
   $                 # End
   ```

2. **Test Incrementally**
   ```regex
   Step 1: \d+           # Match numbers
   Step 2: \d{4}         # Match 4 digits
   Step 3: \d{4}-        # Match 4 digits and dash
   Step 4: \d{4}-\d{2}   # Match date part
   Step 5: ^\d{4}-\d{2}-\d{2}$  # Complete date
   ```

## Output Contract
- Working regex pattern
- Explanation of each component
- Test cases (positive and negative)
- Flavor-specific notes
- Performance recommendations

## Constraints
- Always provide explanations
- Include test cases
- Note flavor compatibility
- Warn about performance issues
- Suggest alternatives when appropriate

## Examples

### Example 1: Extract JSON Strings
```regex
# Match double-quoted strings with escape support
"(?:[^"\\]|\\.)*"

Explanation:
"           # Opening quote
(?:         # Non-capturing group
  [^"\\]    # Any char except quote or backslash
  |         # OR
  \\.       # Escape sequence
)*          # Zero or more times
"           # Closing quote

Test cases:
✅ "hello world"
✅ "line1\nline2"
✅ "quote: \"hello\""
❌ unmatched "quote
```

### Example 2: Parse Log Lines
```regex
# Apache/Nginx log format
^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) ([^"]+) HTTP\/[\d.]+" (\d+) (\d+|-)

Explanation:
^(\S+)                    # IP address (group 1)
\S+ \S+                   # Identity and user
\[([^\]]+)\]              # Timestamp (group 2)
"(\S+)                    # Method (group 3)
([^"]+)                   # Path (group 4)
HTTP\/[\d.]+"             # Protocol
(\d+)                     # Status code (group 5)
(\d+|-)                   # Response size (group 6)

Test:
192.168.1.1 - - [25/Mar/2024:10:00:00 +0000] "GET /api/users HTTP/1.1" 200 1234
```

### Example 3: Validate Credit Card
```regex
# Major credit cards
^(?:
  4[0-9]{12}(?:[0-9]{3})?|       # Visa
  5[1-5][0-9]{14}|               # MasterCard
  3[47][0-9]{13}|                # Amex
  6(?:011|5[0-9]{2})[0-9]{12}|   # Discover
  3(?:0[0-5]|[68][0-9])[0-9]{11} # Diners Club
)$

# With spaces/dashes
^(?:\d{4}[-\s]?){3}\d{4}$
```

### Example 4: Code Comment Extraction
```regex
# Single-line comments
//.*$

# Multi-line comments (C-style)
/\*[\s\S]*?\*/

# Python docstrings
"""[\s\S]*?"""

# Combined pattern
(?://.*$|/\*[\s\S]*?\*/|"""[\s\S]*?""")
```
