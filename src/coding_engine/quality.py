import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple
from enum import Enum


class IssueSeverity(Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"
    HINT = "hint"


class IssueCategory(Enum):
    PERFORMANCE = "performance"
    SECURITY = "security"
    STYLE = "style"
    CORRECTNESS = "correctness"
    BEST_PRACTICE = "best_practice"


@dataclass
class CodeIssue:
    line: int
    column: int
    severity: IssueSeverity
    category: IssueCategory
    message: str
    code_pattern: Optional[str] = None
    suggestion: Optional[str] = None


@dataclass
class OptimizationResult:
    original_code: str
    optimized_code: str
    improvements: List[str] = field(default_factory=list)
    estimated_speedup: float = 1.0
    issues_fixed: List[CodeIssue] = field(default_factory=list)


class PatternDetector:
    def __init__(self):
        self._patterns: Dict[str, Dict[str, Any]] = {
            "list_comprehension": {
                "pattern": r"for\s+\w+\s+in\s+.*:\s*.*\.append\(",
                "suggestion": "Use list comprehension for better performance",
                "severity": IssueSeverity.INFO,
                "category": IssueCategory.PERFORMANCE,
            },
            "string_concatenation": {
                "pattern": r"\+=.*str\(",
                "suggestion": "Use join() or f-string for string concatenation",
                "severity": IssueSeverity.WARNING,
                "category": IssueCategory.PERFORMANCE,
            },
            "global_variable": {
                "pattern": r"^global\s+\w+",
                "suggestion": "Avoid global variables, use parameters or class attributes",
                "severity": IssueSeverity.WARNING,
                "category": IssueCategory.BEST_PRACTICE,
            },
            "bare_except": {
                "pattern": r"except\s*:",
                "suggestion": "Specify exception type to catch",
                "severity": IssueSeverity.WARNING,
                "category": IssueCategory.BEST_PRACTICE,
            },
            "hardcoded_password": {
                "pattern": r"(password|passwd|pwd)\s*=\s*['\"][^'\"']+['\"]",
                "suggestion": "Use environment variables for sensitive data",
                "severity": IssueSeverity.ERROR,
                "category": IssueCategory.SECURITY,
            },
            "sql_injection": {
                "pattern": r"(execute|cursor)\(['\"].*%s.*['\"]\s*%",
                "suggestion": "Use parameterized queries to prevent SQL injection",
                "severity": IssueSeverity.ERROR,
                "category": IssueCategory.SECURITY,
            },
            "eval_usage": {
                "pattern": r"\beval\(",
                "suggestion": "Avoid eval() for security reasons",
                "severity": IssueSeverity.ERROR,
                "category": IssueCategory.SECURITY,
            },
            "nested_loops": {
                "pattern": r"for\s+\w+\s+in\s+.*:\s*for\s+\w+\s+in\s+",
                "suggestion": "Consider optimizing nested loop logic",
                "severity": IssueSeverity.INFO,
                "category": IssueCategory.PERFORMANCE,
            },
            "mutable_default_arg": {
                "pattern": r"def\s+\w+\s*\([^)]*=\s*\[\s*\]",
                "suggestion": "Use None as default and initialize inside function",
                "severity": IssueSeverity.WARNING,
                "category": IssueCategory.CORRECTNESS,
            },
            "duplicate_code": {
                "pattern": r"(.+)\1{2,}",
                "suggestion": "Consider extracting duplicate code into a function",
                "severity": IssueSeverity.INFO,
                "category": IssueCategory.BEST_PRACTICE,
            },
        }

    def detect(self, code: str) -> List[CodeIssue]:
        issues = []
        lines = code.split("\n")

        for line_num, line in enumerate(lines, 1):
            for pattern_name, pattern_info in self._patterns.items():
                if re.search(pattern_info["pattern"], line, re.MULTILINE):
                    issues.append(CodeIssue(
                        line=line_num,
                        column=1,
                        severity=pattern_info["severity"],
                        category=pattern_info["category"],
                        message=pattern_info["suggestion"],
                        code_pattern=pattern_name,
                    ))

        return issues


class CodeOptimizer:
    def optimize(
        self,
        code: str,
        language: str = "python"
    ) -> OptimizationResult:
        improvements: List[str] = []
        issues_fixed: List[CodeIssue] = []
        optimized = code

        if language.lower() == "python":
            optimized, imp, iss = self._optimize_python(code)
            improvements.extend(imp)
            issues_fixed.extend(iss)

        estimated_speedup = self._estimate_speedup(improvements)

        return OptimizationResult(
            original_code=code,
            optimized_code=optimized,
            improvements=improvements,
            estimated_speedup=estimated_speedup,
            issues_fixed=issues_fixed,
        )

    def _optimize_python(self, code: str) -> Tuple[str, List[str], List[CodeIssue]]:
        improvements: List[str] = []
        issues_fixed: List[CodeIssue] = []
        optimized = code

        append_pattern = r"(\w+)\s*=\s*\[\]\s*\n\s*for\s+(\w+)\s+in\s+(.+?):\s*\n\s*\1\.append\((.+?)\)"
        match = re.search(append_pattern, code, re.DOTALL)
        if match:
            list_name = match.group(1)
            var_name = match.group(2)
            iterable = match.group(3)
            value = match.group(4)
            replacement = f"{list_name} = [{value} for {var_name} in {iterable}]"
            optimized = code.replace(match.group(0), replacement)
            improvements.append("Replaced append-in-loop with list comprehension")
            issues_fixed.append(CodeIssue(0, 0, IssueSeverity.INFO, IssueCategory.PERFORMANCE, "List comprehension optimization"))

        string_concat_pattern = r"(\w+)\s*\+=\s*str\((.+?)\)"
        if re.search(string_concat_pattern, code):
            optimized = re.sub(r"(\w+)\s*\+=\s*str\((.+?)\)", r'\1 += str(\2)', optimized)
            improvements.append("Improved string concatenation")

        if "for i in range(len(" in code:
            optimized = self._optimize_range_len(code)
            if optimized != code:
                improvements.append("Replaced for i in range(len(x)) with enumerate()")
                issues_fixed.append(CodeIssue(0, 0, IssueSeverity.INFO, IssueCategory.PERFORMANCE, "enumerate() optimization"))

        return optimized, improvements, issues_fixed

    def _optimize_range_len(self, code: str) -> str:
        pattern = r"for\s+(\w+)\s+in\s+range\s*\(\s*len\s*\(\s*(\w+)\s*\)\s*\):"
        replacement = r"for \1, \2_item in enumerate(\2):"
        return re.sub(pattern, replacement, code)

    def _estimate_speedup(self, improvements: List[str]) -> float:
        base_speedup = 1.0
        for imp in improvements:
            if "list comprehension" in imp.lower():
                base_speedup *= 1.2
            elif "enumerate" in imp.lower():
                base_speedup *= 1.15
            elif "join" in imp.lower():
                base_speedup *= 1.1
        return min(base_speedup, 3.0)


class DebugAssistant:
    def __init__(self):
        self._error_patterns: Dict[str, Dict[str, str]] = {
            "SyntaxError": {
                "pattern": r"SyntaxError:\s*(.+)",
                "analysis": "Check for missing colons, parentheses, or quotes",
            },
            "IndentationError": {
                "pattern": r"IndentationError:\s*(.+)",
                "analysis": "Ensure consistent indentation (use spaces, not tabs)",
            },
            "NameError": {
                "pattern": r"NameError:\s*name\s+'(\w+)' is not defined",
                "analysis": "Variable not defined or typo in variable name",
            },
            "TypeError": {
                "pattern": r"TypeError:\s*(.+)",
                "analysis": "Check for type mismatches in operations or function arguments",
            },
            "IndexError": {
                "pattern": r"IndexError:\s*list index out of range",
                "analysis": "Check list bounds and loop indices",
            },
            "KeyError": {
                "pattern": r"KeyError:\s*'([^']+)'",
                "analysis": "Key not found in dictionary, check if key exists",
            },
            "AttributeError": {
                "pattern": r"AttributeError:\s*'([^']+)'",
                "analysis": "Object doesn't have that attribute, check spelling or import",
            },
            "ImportError": {
                "pattern": r"ImportError:\s*(.+)",
                "analysis": "Module not installed or import path incorrect",
            },
            "ZeroDivisionError": {
                "pattern": r"ZeroDivisionError:\s*(.+)",
                "analysis": "Division by zero, add check for zero divisor",
            },
            "FileNotFoundError": {
                "pattern": r"FileNotFoundError:\s*\[Errno 2\]\s*No such file or directory:\s*'([^']+)'",
                "analysis": "File path incorrect or file doesn't exist",
            },
        }

    def analyze_error(self, error_message: str) -> Dict[str, Any]:
        for error_type, info in self._error_patterns.items():
            match = re.search(info["pattern"], error_message)
            if match:
                return {
                    "error_type": error_type,
                    "analysis": info["analysis"],
                    "match_details": match.groups() if match.groups() else None,
                    "suggestions": self._get_suggestions(error_type, match),
                }

        return {
            "error_type": "Unknown",
            "analysis": "Unable to identify error type",
            "suggestions": ["Review error message carefully", "Check recent code changes"],
        }

    def _get_suggestions(self, error_type: str, match: re.Match) -> List[str]:
        suggestions: Dict[str, List[str]] = {
            "NameError": [
                "Check if variable is defined before use",
                "Verify spelling matches declaration",
                "Ensure proper scope (local vs global)",
            ],
            "TypeError": [
                "Check types of variables in operation",
                "Verify function parameter types",
                "Use type conversion if needed",
            ],
            "IndexError": [
                "Check loop boundaries",
                "Verify list is not empty before indexing",
                "Use len() to check list length",
            ],
            "KeyError": [
                "Use dict.get() with default value",
                "Check if key exists with 'in' operator",
                "Initialize dictionary properly",
            ],
            "ImportError": [
                "Install required package",
                "Check package name spelling",
                "Verify module path",
            ],
        }
        return suggestions.get(error_type, ["Review the error and check relevant code"])


class CodeQualityChecker:
    def __init__(self):
        self._detector = PatternDetector()
        self._optimizer = CodeOptimizer()

    def check_quality(self, code: str, language: str = "python") -> Dict[str, Any]:
        issues = self._detector.detect(code)
        optimization = self._optimizer.optimize(code, language)

        error_count = len([i for i in issues if i.severity == IssueSeverity.ERROR])
        warning_count = len([i for i in issues if i.severity == IssueSeverity.WARNING])
        info_count = len([i for i in issues if i.severity == IssueSeverity.INFO])

        quality_score = self._calculate_quality_score(error_count, warning_count, info_count)

        return {
            "quality_score": quality_score,
            "error_count": error_count,
            "warning_count": warning_count,
            "info_count": info_count,
            "issues": [self._issue_to_dict(i) for i in issues],
            "optimization": {
                "possible": len(optimization.improvements) > 0,
                "improvements": optimization.improvements,
                "estimated_speedup": optimization.estimated_speedup,
            },
            "grade": self._get_grade(quality_score),
        }

    def _calculate_quality_score(self, errors: int, warnings: int, infos: int) -> float:
        base_score = 100.0
        base_score -= errors * 20
        base_score -= warnings * 5
        base_score -= infos * 1
        return max(0.0, min(100.0, base_score))

    def _get_grade(self, score: float) -> str:
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"

    def _issue_to_dict(self, issue: CodeIssue) -> Dict[str, Any]:
        return {
            "line": issue.line,
            "column": issue.column,
            "severity": issue.severity.value,
            "category": issue.category.value,
            "message": issue.message,
            "suggestion": issue.suggestion,
        }


__all__ = [
    "IssueSeverity",
    "IssueCategory",
    "CodeIssue",
    "OptimizationResult",
    "PatternDetector",
    "CodeOptimizer",
    "DebugAssistant",
    "CodeQualityChecker",
]
