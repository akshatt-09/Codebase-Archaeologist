import re

class JavaScriptSourceParser:
    IMPORT_REGEX = re.compile(r'''import\s+(?:(?:\*\s+as\s+[\w$]+|[\w$]+|\{[^}]*\})\s+from\s+)?['"]([^'"]+)['"]''', re.MULTILINE)
    REQUIRE_REGEX = re.compile(r'''require\s*\(\s*['"]([^'"]+)['"]\s*\)''', re.MULTILINE)
    FUNC_DECL_REGEX = re.compile(r'''(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)''')
    ARROW_FUNC_REGEX = re.compile(r'''(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>''')
    CLASS_DECL_REGEX = re.compile(r'''(?:export\s+)?class\s+([A-Za-z0-9_$]+)''')
    CALL_REGEX = re.compile(r'''([A-Za-z0-9_$]+)\s*\(''')

    @classmethod
    def parse(cls, code: str, file_path: str) -> dict:
        lines = code.splitlines()
        result = {
            "imports": [],
            "classes": [],
            "functions": [],
            "symbols": [],
            "calls": [],
            "complexity": 1,
            "lines": len(lines),
            "errors": []
        }

        # Imports
        for match in cls.IMPORT_REGEX.finditer(code):
            target = match.group(1)
            result["imports"].append({
                "name": target,
                "type": "local" if target.startswith(".") else "external",
                "line": code[:match.start()].count('\n') + 1
            })

        for match in cls.REQUIRE_REGEX.finditer(code):
            target = match.group(1)
            result["imports"].append({
                "name": target,
                "type": "local" if target.startswith(".") else "external",
                "line": code[:match.start()].count('\n') + 1
            })

        # Functions
        for idx, line in enumerate(lines, 1):
            f_match = cls.FUNC_DECL_REGEX.search(line)
            if f_match:
                name = f_match.group(1)
                is_comp = bool(name[0].isupper() and file_path.endswith(('jsx', 'tsx', 'js')))
                result["functions"].append({"name": name, "line": idx, "is_component": is_comp})
                result["symbols"].append({"name": name, "kind": "component" if is_comp else "function", "line": idx})
                continue
            
            a_match = cls.ARROW_FUNC_REGEX.search(line)
            if a_match:
                name = a_match.group(1)
                is_comp = bool(name[0].isupper() and file_path.endswith(('jsx', 'tsx', 'js')))
                result["functions"].append({"name": name, "line": idx, "is_component": is_comp})
                result["symbols"].append({"name": name, "kind": "component" if is_comp else "function", "line": idx})
                continue

            c_match = cls.CLASS_DECL_REGEX.search(line)
            if c_match:
                name = c_match.group(1)
                result["classes"].append({"name": name, "line": idx})
                result["symbols"].append({"name": name, "kind": "class", "line": idx})

            # Cyclomatic complexity approximation for JS/TS
            branch_keywords = ['if ', 'else if ', 'for ', 'while ', 'catch ', 'case ']
            for kw in branch_keywords:
                if kw in line:
                    result["complexity"] += 1
            result["complexity"] += line.count('&&') + line.count('||') + line.count('??')

        return result
