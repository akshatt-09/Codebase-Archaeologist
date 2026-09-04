import ast

class PythonSourceParser:
    @staticmethod
    def parse(code: str, file_path: str) -> dict:
        result = {
            "imports": [],
            "classes": [],
            "functions": [],
            "symbols": [],
            "calls": [],
            "complexity": 1,
            "lines": len(code.splitlines()),
            "errors": []
        }
        try:
            tree = ast.parse(code, filename=file_path)
        except SyntaxError as se:
            result["errors"].append({
                "file": file_path,
                "error": "SyntaxError",
                "message": f"Line {se.lineno}: {se.msg}"
            })
            return result

        for node in ast.walk(tree):
            # Imports
            if isinstance(node, ast.Import):
                for alias in node.names:
                    result["imports"].append({
                        "name": alias.name,
                        "type": "external" if not alias.name.startswith(".") else "local",
                        "line": node.lineno
                    })
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ""
                result["imports"].append({
                    "name": module,
                    "symbols": [a.name for a in node.names],
                    "type": "local" if node.level > 0 or module.startswith(".") else "external",
                    "line": node.lineno
                })

            # Classes
            elif isinstance(node, ast.ClassDef):
                result["classes"].append({
                    "name": node.name,
                    "line": node.lineno,
                    "end_line": getattr(node, 'end_lineno', node.lineno),
                    "methods": [n.name for n in node.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))]
                })
                result["symbols"].append({"name": node.name, "kind": "class", "line": node.lineno})

            # Functions / Methods
            elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                fn_info = {
                    "name": node.name,
                    "line": node.lineno,
                    "end_line": getattr(node, 'end_lineno', node.lineno),
                    "args": [a.arg for a in node.args.args],
                    "is_async": isinstance(node, ast.AsyncFunctionDef)
                }
                result["functions"].append(fn_info)
                result["symbols"].append({"name": node.name, "kind": "function", "line": node.lineno})

            # Calls
            elif isinstance(node, ast.Call):
                call_id = None
                if isinstance(node.func, ast.Name):
                    call_id = node.func.id
                elif isinstance(node.func, ast.Attribute):
                    call_id = node.func.attr
                if call_id:
                    result["calls"].append({"target": call_id, "line": node.lineno})

            # Cyclomatic Complexity count
            if isinstance(node, (ast.If, ast.For, ast.While, ast.ExceptHandler, ast.With, ast.Assert)):
                result["complexity"] += 1
            elif isinstance(node, ast.BoolOp):
                result["complexity"] += len(node.values) - 1

        return result
