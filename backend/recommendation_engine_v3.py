import re
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum
from google import genai

class ErrorSeverity(Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

class ErrorClassification(Enum):
    SYNTAX = "syntax"
    RUNTIME = "runtime"
    LOGICAL = "logical"
    SEMANTIC = "semantic"
    UNKNOWN = "unknown"

@dataclass
class ErrorInfo:
    error_type: str
    line_number: Optional[int]
    variables: List[str]
    full_message: str
    classification: ErrorClassification

@dataclass
class CodeInfo:
    language: str
    error_block: str
    error_lines: List[str]
    intent: str

@dataclass
class RecommendationResult:
    explanation: str
    severity: ErrorSeverity
    impact: str
    proposed_fixes: List[Dict[str, str]]
    best_practices: List[str]
    priority_reasoning: str

class ErrorLogAnalyzer:
    """Extracts structured information from error logs"""
    
    def __init__(self):
        self.error_patterns = {
            # Python patterns
            r'(\w+Error): (.+) at line (\d+)': ('python', 'runtime'),
            r'(\w+Error): (.+)': ('python', 'runtime'),
            r'(\w+Exception): (.+)': ('python', 'runtime'),
            r'SyntaxError: (.+) at line (\d+)': ('python', 'syntax'),
            r'File "(.+)", line (\d+), in (.+)\n\s*(.+)\n(\w+Error): (.+)': ('python', 'runtime'),
            r'json\.decoder\.JSONDecodeError: (.+)': ('python', 'runtime'),
            
            # Java patterns  
            r'Exception in thread "(.+)" (\w+Exception): (.+) at (.+):(\d+)': ('java', 'runtime'),
            r'(\w+Exception): (.+)': ('java', 'runtime'),
            
            # JavaScript patterns
            r'(\w+Error): (.+) at line (\d+)': ('javascript', 'runtime'),
            r'ReferenceError: (.+) is not defined': ('javascript', 'runtime'),
            r'TypeError: (.+)': ('javascript', 'runtime'),
            
            # C/C++ patterns
            r'error: (.+) at line (\d+)': ('c', 'syntax'),
            r'segmentation fault': ('c', 'runtime'),
        }
    
    def analyze(self, error_log: str) -> ErrorInfo:
        """Extract structured information from error log"""
        error_log = error_log.strip()
        
        # Try to match known patterns
        for pattern, (lang, classification) in self.error_patterns.items():
            match = re.search(pattern, error_log, re.IGNORECASE | re.MULTILINE)
            if match:
                groups = match.groups()
                
                # Extract error type
                error_type = groups[0] if groups else "UnknownError"
                
                # Extract line number
                line_number = None
                for group in groups:
                    if group and group.isdigit():
                        line_number = int(group)
                        break
                
                # Extract variables mentioned
                variables = self._extract_variables(error_log)
                
                return ErrorInfo(
                    error_type=error_type,
                    line_number=line_number,
                    variables=variables,
                    full_message=error_log,
                    classification=ErrorClassification(classification)
                )
        
        # Fallback for unmatched patterns
        return ErrorInfo(
            error_type="UnknownError",
            line_number=self._extract_line_number(error_log),
            variables=self._extract_variables(error_log),
            full_message=error_log,
            classification=ErrorClassification.UNKNOWN
        )
    
    def _extract_variables(self, error_log: str) -> List[str]:
        """Extract variable names from error message"""
        # Common patterns for variable names
        var_patterns = [
            r"'(\w+)' is not defined",
            r"'(\w+)' has no attribute",
            r"cannot access '(\w+)'",
            r"variable '(\w+)'",
            r"undefined variable '(\w+)'",
        ]
        
        variables = []
        for pattern in var_patterns:
            matches = re.findall(pattern, error_log)
            variables.extend(matches)
        
        return list(set(variables))  # Remove duplicates
    
    def _extract_line_number(self, error_log: str) -> Optional[int]:
        """Extract line number from error message"""
        line_patterns = [
            r'line (\d+)',
            r':(\d+):',
            r'at (\d+)',
        ]
        
        for pattern in line_patterns:
            match = re.search(pattern, error_log)
            if match:
                return int(match.group(1))
        
        return None

class StaticCodeAnalysis:
    """Analyzes code snippet using error context"""
    
    def __init__(self):
        self.language_patterns = {
            'python': [r'def\s+\w+', r'import\s+\w+', r'print\s*\(', r':\s*$'],
            'java': [r'public\s+class', r'System\.out\.print', r'public\s+static\s+void\s+main'],
            'javascript': [r'function\s+\w+', r'console\.log', r'var\s+\w+', r'let\s+\w+'],
            'c': [r'#include', r'int\s+main', r'printf'],
            'cpp': [r'#include', r'std::', r'cout\s*<<'],
        }
    
    def analyze(self, code: str, error_info: ErrorInfo) -> CodeInfo:
        """Analyze code snippet with error context"""
        language = self._detect_language(code)
        error_lines = self._extract_error_lines(code, error_info.line_number)
        error_block = self._identify_error_block(code, error_info.line_number)
        intent = self._determine_code_intent(error_block, language)
        
        return CodeInfo(
            language=language,
            error_block=error_block,
            error_lines=error_lines,
            intent=intent
        )
    
    def _detect_language(self, code: str) -> str:
        """Detect programming language from code"""
        for lang, patterns in self.language_patterns.items():
            matches = sum(1 for pattern in patterns if re.search(pattern, code, re.MULTILINE))
            if matches >= 1:  # At least one pattern match
                return lang
        return "unknown"
    
    def _extract_error_lines(self, code: str, line_number: Optional[int]) -> List[str]:
        """Extract lines around the error location"""
        if not line_number:
            return [code.split('\n')[0]]  # Return first line if no line number
        
        lines = code.split('\n')
        if line_number <= len(lines):
            # Return the error line and surrounding context
            start = max(0, line_number - 2)
            end = min(len(lines), line_number + 1)
            return lines[start:end]
        
        return []
    
    def _identify_error_block(self, code: str, line_number: Optional[int]) -> str:
        """Identify the code block containing the error"""
        if not line_number:
            return code[:200]  # Return first 200 chars if no line number
        
        lines = code.split('\n')
        if line_number <= len(lines):
            # Find the logical block (function, loop, etc.)
            start_line = max(0, line_number - 1)
            
            # Look backwards for block start
            for i in range(start_line, -1, -1):
                line = lines[i].strip()
                if any(keyword in line for keyword in ['def ', 'class ', 'for ', 'while ', 'if ']):
                    start_line = i
                    break
            
            # Look forwards for block end
            end_line = min(len(lines), line_number + 5)
            
            return '\n'.join(lines[start_line:end_line])
        
        return code
    
    def _determine_code_intent(self, code_block: str, language: str) -> str:
        """Determine the intent of the code block"""
        code_lower = code_block.lower().strip()
        
        if 'def ' in code_lower or 'function ' in code_lower:
            return "function definition"
        elif any(keyword in code_lower for keyword in ['for ', 'while ']):
            return "loop"
        elif 'class ' in code_lower:
            return "class definition"
        elif any(keyword in code_lower for keyword in ['if ', 'elif ', 'else']):
            return "conditional statement"
        elif '=' in code_lower and not '==' in code_lower:
            return "variable assignment"
        elif any(keyword in code_lower for keyword in ['import ', '#include']):
            return "import/include statement"
        else:
            return "code execution"

class RuleBasedSystem:
    """Rule-based system for common error patterns"""
    
    def __init__(self):
        self.rules = {
            # Python rules
            ('IndexError', 'python'): {
                'explanation': "An IndexError occurs when trying to access a list, tuple, or string index that doesn't exist.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This will halt program execution immediately and may cause data loss if not handled.",
                'fixes': [
                    {
                        'title': 'Bounds Checking',
                        'code': 'if index < len(my_list):\n    value = my_list[index]',
                        'explanation': 'Always check if the index is within valid range before accessing.'
                    },
                    {
                        'title': 'Use Enumerate',
                        'code': 'for i, item in enumerate(my_list):\n    # Process item',
                        'explanation': 'Use enumerate() to safely iterate with indices.'
                    }
                ],
                'best_practices': [
                    "Always validate array/list bounds before accessing elements",
                    "Use len() function to check collection size",
                    "Consider using try/except blocks for error handling"
                ]
            },
            
            ('NameError', 'python'): {
                'explanation': "A NameError occurs when trying to use a variable or function name that hasn't been defined.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This prevents the code from running and indicates a missing variable definition.",
                'fixes': [
                    {
                        'title': 'Define Variable',
                        'code': 'variable_name = initial_value',
                        'explanation': 'Ensure the variable is defined before using it.'
                    },
                    {
                        'title': 'Check Imports',
                        'code': 'from module import function_name',
                        'explanation': 'Make sure required functions are properly imported.'
                    }
                ],
                'best_practices': [
                    "Define all variables before using them",
                    "Check spelling of variable and function names",
                    "Ensure proper import statements"
                ]
            },
            
            ('SyntaxError', 'python'): {
                'explanation': "A SyntaxError occurs when Python cannot parse the code due to incorrect syntax.",
                'severity': ErrorSeverity.CRITICAL,
                'impact': "The code cannot run at all until the syntax is fixed.",
                'fixes': [
                    {
                        'title': 'Check Indentation',
                        'code': 'if condition:\n    statement  # Proper indentation',
                        'explanation': 'Ensure consistent indentation (4 spaces recommended).'
                    },
                    {
                        'title': 'Check Parentheses',
                        'code': 'result = function(arg1, arg2)',
                        'explanation': 'Make sure all parentheses, brackets, and braces are properly closed.'
                    }
                ],
                'best_practices': [
                    "Use consistent indentation (4 spaces)",
                    "Match all opening and closing brackets/parentheses",
                    "Use a code editor with syntax highlighting"
                ]
            },
            
            ('ZeroDivisionError', 'python'): {
                'explanation': "A ZeroDivisionError occurs when attempting to divide by zero.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This will halt program execution and indicates improper input validation.",
                'fixes': [
                    {
                        'title': 'Check Divisor',
                        'code': 'if divisor != 0:\n    result = numerator / divisor\nelse:\n    result = float(\'inf\')',
                        'explanation': 'Always check if the divisor is zero before performing division.'
                    },
                    {
                        'title': 'Use Try-Except',
                        'code': 'try:\n    result = numerator / divisor\nexcept ZeroDivisionError:\n    result = None  # or handle appropriately',
                        'explanation': 'Handle division by zero with exception handling.'
                    }
                ],
                'best_practices': [
                    "Validate inputs before mathematical operations",
                    "Consider what should happen when division by zero occurs",
                    "Use appropriate default values or error handling"
                ]
            },
            
            ('AttributeError', 'python'): {
                'explanation': "An AttributeError occurs when trying to access an attribute or method that doesn't exist on an object.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This will crash the program and often indicates None values or incorrect object types.",
                'fixes': [
                    {
                        'title': 'None Check',
                        'code': 'if obj is not None:\n    result = obj.attribute\nelse:\n    result = default_value',
                        'explanation': 'Check if the object is None before accessing its attributes.'
                    },
                    {
                        'title': 'Hasattr Check',
                        'code': 'if hasattr(obj, \'attribute\'):\n    result = obj.attribute\nelse:\n    result = default_value',
                        'explanation': 'Use hasattr() to check if an attribute exists before accessing it.'
                    }
                ],
                'best_practices': [
                    "Always validate object state before accessing attributes",
                    "Initialize objects properly in constructors",
                    "Use getattr() with default values for optional attributes"
                ]
            },
            
            ('KeyError', 'python'): {
                'explanation': "A KeyError occurs when trying to access a dictionary key that doesn't exist.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This will halt execution and indicates missing data validation or incorrect key usage.",
                'fixes': [
                    {
                        'title': 'Key Check',
                        'code': 'if key in dictionary:\n    value = dictionary[key]\nelse:\n    value = default_value',
                        'explanation': 'Check if the key exists in the dictionary before accessing it.'
                    },
                    {
                        'title': 'Use Get Method',
                        'code': 'value = dictionary.get(key, default_value)',
                        'explanation': 'Use the get() method with a default value to safely access dictionary keys.'
                    }
                ],
                'best_practices': [
                    "Validate dictionary keys before access",
                    "Use dict.get() method for safe key access",
                    "Handle missing keys gracefully with appropriate defaults"
                ]
            },
            
            ('RecursionError', 'python'): {
                'explanation': "A RecursionError occurs when the maximum recursion depth is exceeded, usually due to infinite recursion.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This will crash the program and may consume excessive memory before failing.",
                'fixes': [
                    {
                        'title': 'Add Base Case',
                        'code': 'def recursive_func(n):\n    if n <= 0:  # Base case\n        return 0\n    return n + recursive_func(n-1)',
                        'explanation': 'Ensure your recursive function has a proper base case to terminate recursion.'
                    },
                    {
                        'title': 'Convert to Iterative',
                        'code': 'def iterative_func(n):\n    result = 0\n    for i in range(1, n+1):\n        result += i\n    return result',
                        'explanation': 'Consider converting recursive algorithms to iterative ones for large inputs.'
                    }
                ],
                'best_practices': [
                    "Always define clear base cases for recursive functions",
                    "Consider iterative solutions for large datasets",
                    "Use sys.setrecursionlimit() carefully if needed"
                ]
            },
            
            ('RuntimeError', 'python'): {
                'explanation': "A RuntimeError occurred, often related to async operations or system-level issues.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This indicates improper usage of runtime features like async/await or system resources.",
                'fixes': [
                    {
                        'title': 'Proper Async Usage',
                        'code': 'import asyncio\n\nasync def main():\n    result = await async_function()\n    return result\n\nasyncio.run(main())',
                        'explanation': 'Use asyncio.run() or await keyword properly for coroutines.'
                    },
                    {
                        'title': 'Exception Handling',
                        'code': 'try:\n    # Problematic operation\n    pass\nexcept RuntimeError as e:\n    print(f"Runtime error: {e}")',
                        'explanation': 'Handle runtime errors with specific exception catching.'
                    }
                ],
                'best_practices': [
                    "Use proper async/await patterns for coroutines",
                    "Handle system-level errors appropriately",
                    "Validate runtime conditions before operations"
                ]
            },
            
            ('JSONDecodeError', 'python'): {
                'explanation': "A JSONDecodeError occurs when trying to parse invalid JSON data.",
                'severity': ErrorSeverity.HIGH,
                'impact': "This will halt execution and indicates malformed or invalid JSON input.",
                'fixes': [
                    {
                        'title': 'Validate JSON',
                        'code': 'import json\n\ntry:\n    data = json.loads(json_string)\nexcept json.JSONDecodeError as e:\n    print(f"Invalid JSON: {e}")\n    data = {}',
                        'explanation': 'Always wrap JSON parsing in try-except blocks to handle invalid data.'
                    },
                    {
                        'title': 'Pre-validate Format',
                        'code': 'if json_string.strip().startswith((\'{\', \'[\')):\n    data = json.loads(json_string)\nelse:\n    raise ValueError("Not valid JSON format")',
                        'explanation': 'Perform basic format validation before attempting to parse JSON.'
                    }
                ],
                'best_practices': [
                    "Always validate JSON input before parsing",
                    "Use proper exception handling for JSON operations",
                    "Provide meaningful error messages for invalid JSON"
                ]
            },
            
            # Java rules
            ('NullPointerException', 'java'): {
                'explanation': "A NullPointerException occurs when trying to use a reference that points to no location in memory (null).",
                'severity': ErrorSeverity.HIGH,
                'impact': "This will crash the program and may indicate improper object initialization.",
                'fixes': [
                    {
                        'title': 'Null Check',
                        'code': 'if (object != null) {\n    object.method();\n}',
                        'explanation': 'Always check for null before using an object reference.'
                    },
                    {
                        'title': 'Initialize Object',
                        'code': 'MyObject obj = new MyObject();',
                        'explanation': 'Ensure objects are properly initialized before use.'
                    }
                ],
                'best_practices': [
                    "Always initialize objects before using them",
                    "Use null checks when objects might be null",
                    "Consider using Optional<T> in Java 8+"
                ]
            }
        }
    
    def get_recommendation(self, error_info: ErrorInfo, code_info: CodeInfo) -> Optional[Dict]:
        """Get recommendation based on error type and language"""
        key = (error_info.error_type, code_info.language)
        return self.rules.get(key)

class LanguageModelAnalyzer:
    """LM-powered analyzer for complex cases"""
    
    def analyze_complex_error(self, error_info: ErrorInfo, code_info: CodeInfo) -> Dict:
        """Generate explanation and fixes for complex/unknown errors"""
        
        # Determine severity based on error classification
        severity_map = {
            ErrorClassification.SYNTAX: ErrorSeverity.CRITICAL,
            ErrorClassification.RUNTIME: ErrorSeverity.HIGH,
            ErrorClassification.LOGICAL: ErrorSeverity.MEDIUM,
            ErrorClassification.SEMANTIC: ErrorSeverity.MEDIUM,
            ErrorClassification.UNKNOWN: ErrorSeverity.MEDIUM
        }
        
        severity = severity_map.get(error_info.classification, ErrorSeverity.MEDIUM)
        
        # Generate contextual explanation
        explanation = self._generate_explanation(error_info, code_info)
        impact = self._assess_impact(error_info, severity)
        fixes = self._generate_fixes(error_info, code_info)
        best_practices = self._generate_best_practices(error_info, code_info)
        
        return {
            'explanation': explanation,
            'severity': severity,
            'impact': impact,
            'fixes': fixes,
            'best_practices': best_practices
        }
    
    def _generate_explanation(self, error_info: ErrorInfo, code_info: CodeInfo) -> str:
        """Generate contextual explanation for the error"""
        base_explanation = f"A {error_info.error_type} occurred"
        
        if error_info.line_number:
            base_explanation += f" at line {error_info.line_number}"
        
        # Add context based on code intent
        if code_info.intent == "loop":
            base_explanation += " within a loop structure"
        elif code_info.intent == "function definition":
            base_explanation += " in a function definition"
        elif code_info.intent == "variable assignment":
            base_explanation += " during variable assignment"
        
        # Add classification context
        if error_info.classification == ErrorClassification.RUNTIME:
            base_explanation += ". This is a runtime error that occurs during program execution"
        elif error_info.classification == ErrorClassification.SYNTAX:
            base_explanation += ". This is a syntax error that prevents the code from running"
        
        base_explanation += f" in {code_info.language} code."
        
        return base_explanation
    
    def _assess_impact(self, error_info: ErrorInfo, severity: ErrorSeverity) -> str:
        """Assess the impact of the error"""
        impact_map = {
            ErrorSeverity.CRITICAL: "This will prevent the program from running entirely and must be fixed immediately.",
            ErrorSeverity.HIGH: "This will cause the program to crash and may result in data loss or unexpected behavior.",
            ErrorSeverity.MEDIUM: "This may cause incorrect results or unexpected behavior in certain conditions.",
            ErrorSeverity.LOW: "This is a minor issue that may affect code quality or performance."
        }
        
        return impact_map.get(severity, "Impact assessment unavailable.")
    
    def _generate_fixes(self, error_info: ErrorInfo, code_info: CodeInfo) -> List[Dict[str, str]]:
        """Generate potential fixes based on error context"""
        fixes = []
        
        # Generic fixes based on error classification
        if error_info.classification == ErrorClassification.SYNTAX:
            fixes.append({
                'title': 'Fix Syntax',
                'code': '# Check for missing colons, parentheses, or indentation issues',
                'explanation': 'Review the syntax around the error line for common issues.'
            })
        
        elif error_info.classification == ErrorClassification.RUNTIME:
            fixes.append({
                'title': 'Add Error Handling',
                'code': 'try:\n    # Problematic code here\nexcept Exception as e:\n    print(f"Error: {e}")',
                'explanation': 'Wrap the problematic code in a try-except block to handle errors gracefully.'
            })
        
        # Add variable-specific fixes
        if error_info.variables:
            for var in error_info.variables:
                fixes.append({
                    'title': f'Initialize {var}',
                    'code': f'{var} = appropriate_initial_value',
                    'explanation': f'Ensure the variable "{var}" is properly defined and initialized.'
                })
        
        return fixes
    
    def _generate_best_practices(self, error_info: ErrorInfo, code_info: CodeInfo) -> List[str]:
        """Generate best practices based on error and code context"""
        practices = []
        
        # Language-specific practices
        if code_info.language == 'python':
            practices.extend([
                "Follow PEP 8 style guidelines for Python code",
                "Use meaningful variable names",
                "Add docstrings to functions and classes"
            ])
        elif code_info.language == 'java':
            practices.extend([
                "Follow Java naming conventions",
                "Use proper exception handling",
                "Initialize objects before use"
            ])
        
        # Error-specific practices
        if error_info.classification == ErrorClassification.RUNTIME:
            practices.append("Implement proper error handling and validation")
        elif error_info.classification == ErrorClassification.SYNTAX:
            practices.append("Use an IDE with syntax highlighting and error detection")
        
        return practices

class CodeErrorRecommendationEngine:
    """Main recommendation engine that combines rule-based and LM approaches"""
    
    def __init__(self):
        self.error_analyzer = ErrorLogAnalyzer()
        self.code_analyzer = StaticCodeAnalysis()
        self.rule_system = RuleBasedSystem()
        self.lm_analyzer = LanguageModelAnalyzer()
    
    def analyze_error(self, code: str, error_log: str) -> RecommendationResult:
        """Main analysis function that processes code and error log"""
        
        # Step 1: Analyze error log
        error_info = self.error_analyzer.analyze(error_log)
        print("error info : ", error_info)
        
        # Step 2: Analyze code
        code_info = self.code_analyzer.analyze(code, error_info)
        print("code info: ", code_info)

        # Step 3: Try rule-based system first
        rule_recommendation = self.rule_system.get_recommendation(error_info, code_info)
        
        if rule_recommendation:
            # Use rule-based recommendation
            return RecommendationResult(
                explanation=rule_recommendation['explanation'],
                severity=rule_recommendation['severity'],
                impact=rule_recommendation['impact'],
                proposed_fixes=rule_recommendation['fixes'],
                best_practices=rule_recommendation['best_practices'],
                priority_reasoning=self._generate_priority_reasoning(rule_recommendation['severity'])
            )
        else:
            # Fall back to LM analysis
            lm_recommendation = self.lm_analyzer.analyze_complex_error(error_info, code_info)
            
            return RecommendationResult(
                explanation=lm_recommendation['explanation'],
                severity=lm_recommendation['severity'],
                impact=lm_recommendation['impact'],
                proposed_fixes=lm_recommendation['fixes'],
                best_practices=lm_recommendation['best_practices'],
                priority_reasoning=self._generate_priority_reasoning(lm_recommendation['severity'])
            )
    
    def _generate_priority_reasoning(self, severity: ErrorSeverity) -> str:
        """Generate reasoning for error prioritization"""
        reasoning_map = {
            ErrorSeverity.CRITICAL: "This error prevents code execution entirely and should be addressed immediately to restore functionality.",
            ErrorSeverity.HIGH: "This error causes program crashes and may lead to data loss, making it a high priority for resolution.",
            ErrorSeverity.MEDIUM: "This error may cause incorrect behavior under certain conditions and should be addressed in the next development cycle.",
            ErrorSeverity.LOW: "This is a code quality issue that can be addressed during routine maintenance or refactoring."
        }
        
        return reasoning_map.get(severity, "Priority assessment unavailable.")
    
    def format_output(self, result: RecommendationResult) -> str:
        """Format the recommendation result for display"""
        output = []
        output.append("=" * 60)
        output.append("CODE ERROR ANALYSIS REPORT")
        output.append("=" * 60)
        
        output.append(f"\n🔍 EXPLANATION:")
        output.append(f"{result.explanation}")
        
        output.append(f"\n⚠️  SEVERITY: {result.severity.value}")
        output.append(f"📊 IMPACT: {result.impact}")
        
        output.append(f"\n🎯 PRIORITY REASONING:")
        output.append(f"{result.priority_reasoning}")
        
        output.append(f"\n🔧 PROPOSED FIXES:")
        for i, fix in enumerate(result.proposed_fixes, 1):
            output.append(f"\n{i}. {fix['title']}")
            output.append(f"   Code: {fix['code']}")
            output.append(f"   Explanation: {fix['explanation']}")
        
        output.append(f"\n💡 BEST PRACTICES:")
        for practice in result.best_practices:
            output.append(f"• {practice}")
        
        output.append("\n" + "=" * 60)
        
        return "\n".join(output)

    def debugg(self, code:str=None, log:str=None) -> dict[str]:

        result = self.analyze_error(code, log)
        report = self.format_output(result)
                
        custom_prompt = f"""Based on the error analysis report, generate only the corrected code without any comments or explanations. Provide the complete working code and nothing else.

        Code: 
        {code}
        Code Error log:
        {log}

        Report:
        {report}
        """

        client = genai.Client(api_key="YOUR_API_KEY")
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=custom_prompt
        )

        return {"report": report, "corrected_code": response.text}



if __name__ == "__main__":
    engine = CodeErrorRecommendationEngine()
    
    # Example 1: Python IndexError
    print("EXAMPLE 1: Python IndexError")
    print("-" * 40)
    
    code = """
def divide(a, b):
    return a / b

result = divide(10, 0)
"""
    
    log = "ZeroDivisionError: division by zero"

    print(
        f"{'-'*30}"
        f"\n=> Code : \n "
        f"{code}"
        f"\n=> Log : \n"
        f"{log}\n"
        )


    result = engine.debugg(code, log)
    print(
        f"\n=> report : \n"
        f"{result['report']}"
        f"\n=> Corrected code: \n"
        f"{result['corrected_code']}"
        )
    
    print("\n" + "=" * 80 + "\n")

    # Example 2: Python NameError
    print("EXAMPLE 2: Python NameError")
    print("-" * 40)
    
    code = """
def calculate_total():
    result = price * quantity
    return result

total = calculate_total()
print(total)
"""
    
    log = "NameError: name 'price' is not defined"
    
    print(
        f"{'-'*30}"
        f"\n=> Code : \n "
        f"{code}"
        f"\n=> Log : \n"
        f"{log}\n"
        )


    result = engine.debugg(code, log)
    print(
        f"\n=> report : \n"
        f"{result['report']}"
        f"\n=> Corrected code: \n"
        f"{result['corrected_code']}"
        )
