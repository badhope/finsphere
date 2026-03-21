from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set
from enum import Enum
import re


class Language(Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    JAVA = "java"
    CPP = "cpp"
    C = "c"
    CSHARP = "csharp"
    GO = "go"
    RUST = "rust"
    RUBY = "ruby"
    PHP = "php"
    SWIFT = "swift"
    KOTLIN = "kotlin"


@dataclass
class CodeSnippet:
    code: str
    language: Language
    filepath: Optional[str] = None
    start_line: int = 1
    end_line: int = 1


@dataclass
class SyntaxError:
    line: int
    column: int
    message: str
    severity: str = "error"


@dataclass
class CodeAnalysis:
    language: Language
    is_valid_syntax: bool
    errors: List[SyntaxError] = field(default_factory=list)
    warnings: List[SyntaxError] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)
    suggestions: List[str] = field(default_factory=list)


class SyntaxAnalyzer:
    def __init__(self):
        self._language_patterns: Dict[Language, Dict[str, str]] = {
            Language.PYTHON: {
                "comment": r"#.*$|'''[\s\S]*?'''|\"\"\"[\s\S]*?\"\"\"",
                "function": r"def\s+(\w+)\s*\(",
                "class": r"class\s+(\w+)",
                "import": r"^import\s+|^from\s+",
                "decorator": r"@\w+",
            },
            Language.JAVASCRIPT: {
                "comment": r"//.*$|/\*[\s\S]*?\*/",
                "function": r"function\s+(\w+)\s*\(|(\w+)\s*:\s*function\s*\(",
                "class": r"class\s+(\w+)",
                "import": r"^import\s+.*from\s+",
            },
            Language.TYPESCRIPT: {
                "comment": r"//.*$|/\*[\s\S]*?\*/",
                "function": r"function\s+(\w+)\s*\(|(\w+)\s*:\s*\([^)]*\)\s*=>",
                "class": r"class\s+(\w+)",
                "interface": r"interface\s+(\w+)",
                "import": r"^import\s+.*from\s+",
                "type": r"type\s+(\w+)\s*=",
            },
            Language.JAVA: {
                "comment": r"//.*$|/\*[\s\S]*?\*/",
                "function": r"(public|private|protected)?\s*(static)?\s*\w+\s+(\w+)\s*\(",
                "class": r"class\s+(\w+)",
                "import": r"^import\s+",
            },
        }

    def analyze(self, code: str, language: Language) -> CodeAnalysis:
        if language == Language.PYTHON:
            return self._analyze_python(code)
        elif language in (Language.JAVASCRIPT, Language.TYPESCRIPT):
            return self._analyze_js_ts(code, language)
        elif language == Language.JAVA:
            return self._analyze_java(code)
        else:
            return CodeAnalysis(
                language=language,
                is_valid_syntax=True,
                errors=[],
                warnings=[],
                metrics=self._compute_basic_metrics(code),
            )

    def _analyze_python(self, code: str) -> CodeAnalysis:
        errors: List[SyntaxError] = []
        warnings: List[SyntaxError] = []

        lines = code.split("\n")
        indent_stack = [0]
        prev_indent = 0

        for i, line in enumerate(lines, 1):
            stripped = line.lstrip()

            if not stripped or stripped.startswith("#"):
                continue

            current_indent = len(line) - len(stripped)

            if stripped.startswith(("def ", "class ", "if ", "elif ", "else:", "for ", "while ", "try:", "except", "finally:", "with ")):
                if current_indent != prev_indent and i > 1:
                    pass
                prev_indent = current_indent

            if self._has_syntax_issues(line, i):
                errors.append(SyntaxError(
                    line=i,
                    column=1,
                    message="Potential syntax issue detected"
                ))

        metrics = self._compute_basic_metrics(code)
        metrics.update({
            "function_count": len(re.findall(r"\bdef\s+\w+", code)),
            "class_count": len(re.findall(r"\bclass\s+\w+", code)),
            "import_count": len(re.findall(r"\b(?:import|from)\s+", code)),
            "decorator_count": len(re.findall(r"@\w+", code)),
        })

        return CodeAnalysis(
            language=Language.PYTHON,
            is_valid_syntax=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            metrics=metrics,
        )

    def _analyze_js_ts(self, code: str, language: Language) -> CodeAnalysis:
        errors: List[SyntaxError] = []
        warnings: List[SyntaxError] = []

        lines = code.split("\n")
        brace_stack: List[int] = []
        paren_stack: List[int] = []

        for i, line in enumerate(lines, 1):
            for j, char in enumerate(line):
                if char == "{":
                    brace_stack.append(i)
                elif char == "}":
                    if not brace_stack:
                        errors.append(SyntaxError(i, j, "Unexpected closing brace"))
                    else:
                        brace_stack.pop()
                elif char == "(":
                    paren_stack.append(i)
                elif char == ")":
                    if not paren_stack:
                        errors.append(SyntaxError(i, j, "Unexpected closing parenthesis"))
                    else:
                        paren_stack.pop()

        if brace_stack:
            for line in brace_stack:
                errors.append(SyntaxError(line, 1, "Unclosed brace"))
        if paren_stack:
            for line in paren_stack:
                errors.append(SyntaxError(line, 1, "Unclosed parenthesis"))

        metrics = self._compute_basic_metrics(code)
        patterns = self._language_patterns.get(language, {})
        metrics.update({
            "function_count": len(re.findall(r"function\s+\w+|\w+\s*:\s*function", code)),
            "class_count": len(re.findall(r"class\s+\w+", code)),
            "import_count": len(re.findall(r"import\s+.*from\s+", code)),
        })

        if language == Language.TYPESCRIPT:
            metrics["interface_count"] = len(re.findall(r"interface\s+\w+", code))
            metrics["type_count"] = len(re.findall(r"type\s+\w+\s*=", code))

        return CodeAnalysis(
            language=language,
            is_valid_syntax=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            metrics=metrics,
        )

    def _analyze_java(self, code: str) -> CodeAnalysis:
        errors: List[SyntaxError] = []
        warnings: List[SyntaxError] = []

        metrics = self._compute_basic_metrics(code)
        metrics.update({
            "function_count": len(re.findall(r"(public|private|protected)?\s*(static)?\s*\w+\s+\w+\s*\(", code)),
            "class_count": len(re.findall(r"class\s+\w+", code)),
            "import_count": len(re.findall(r"import\s+", code)),
        })

        return CodeAnalysis(
            language=Language.JAVA,
            is_valid_syntax=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            metrics=metrics,
        )

    def _has_syntax_issues(self, line: str, line_num: int) -> bool:
        issues = [
            (r"def\s+\w+\s*\(\s*\):", "Function definition missing parameter parentheses"),
            (r"class\s+\w+\s*\(\s*\):", "Class inheritance missing base class"),
            (r"if\s+[^:]+:", "Conditional statement missing colon"),
            (r"for\s+[^:]+:", "For loop missing colon"),
            (r"while\s+[^:]+:", "While loop missing colon"),
        ]

        for pattern, msg in issues:
            if re.search(pattern, line):
                return True
        return False

    def _compute_basic_metrics(self, code: str) -> Dict[str, Any]:
        lines = code.split("\n")
        non_empty_lines = [l for l in lines if l.strip()]
        total_lines = len(lines)
        code_lines = len(non_empty_lines)
        comment_lines = len([l for l in lines if l.strip().startswith(("#", "//", "/*", "*", "*/"))])

        char_count = sum(len(l) for l in lines)
        avg_line_length = char_count / total_lines if total_lines > 0 else 0

        return {
            "total_lines": total_lines,
            "code_lines": code_lines,
            "comment_lines": comment_lines,
            "blank_lines": total_lines - code_lines,
            "avg_line_length": round(avg_line_length, 2),
            "total_characters": char_count,
        }


class AutoCompletionEngine:
    def __init__(self):
        self._templates: Dict[Language, Dict[str, List[str]]] = {
            Language.PYTHON: {
                "class": [
                    "class {name}:\n    def __init__(self{params}):\n        {body}",
                    "class {name}(BaseClass):\n    def __init__(self{params}):\n        super().__init__()\n        {body}",
                ],
                "function": [
                    "def {name}({params}):\n    {body}",
                    "async def {name}({params}):\n    {body}",
                ],
                "try_except": [
                    "try:\n    {try_body}\nexcept {exception} as e:\n    {except_body}",
                ],
                "context_manager": [
                    "with open('{filename}', '{mode}') as f:\n    {body}",
                ],
            },
            Language.JAVASCRIPT: {
                "class": [
                    "class {name} {{\n    constructor({params}) {{\n        {body}\n    }}\n}}",
                    "class {name} extends {base} {{\n    constructor({params}) {{\n        super({params});\n        {body}\n    }}\n}}",
                ],
                "function": [
                    "function {name}({params}) {{\n    {body}\n}}",
                    "const {name} = ({params}) => {{\n    {body}\n}}",
                ],
                "async_function": [
                    "async function {name}({params}) {{\n    {body}\n}}",
                    "const {name} = async ({params}) => {{\n    {body}\n}}",
                ],
            },
            Language.TYPESCRIPT: {
                "class": [
                    "class {name} {{\n    constructor({params}) {{\n        {body}\n    }}\n}}",
                    "class {name} extends {base} implements I{name} {{\n    constructor({params}) {{\n        super();\n        {body}\n    }}\n}}",
                ],
                "interface": [
                    "interface I{name} {{\n    {properties}\n}}",
                ],
                "type": [
                    "type {name} = {{\n    {properties}\n}}",
                ],
            },
        }

    def get_completions(
        self,
        context: str,
        language: Language,
        cursor_position: int
    ) -> List[str]:
        suggestions = []

        trigger_word = self._get_trigger_word(context, cursor_position)
        if not trigger_word:
            return suggestions

        lang_templates = self._templates.get(language, {})
        for template_type, templates in lang_templates.items():
            if trigger_word in template_type:
                suggestions.extend(templates)

        return suggestions

    def _get_trigger_word(self, context: str, cursor: int) -> Optional[str]:
        start = max(0, cursor - 20)
        substring = context[start:cursor]

        match = re.search(r"\b(\w+)$", substring)
        return match.group(1) if match else None

    def generate_completion(
        self,
        template_type: str,
        language: Language,
        name: str,
        params: str = "",
        body: str = "pass",
        **kwargs
    ) -> str:
        templates = self._templates.get(language, {}).get(template_type, [])
        if not templates:
            return f"// Unsupported template type: {template_type}"

        template = templates[0]
        result = template.format(name=name, params=params, body=body, **kwargs)

        return result


__all__ = [
    "Language",
    "CodeSnippet",
    "SyntaxError",
    "CodeAnalysis",
    "SyntaxAnalyzer",
    "AutoCompletionEngine",
]
