import re

class JavaScriptSourceParser:
    IMPORT_REGEX = re.compile(r'''import\s+(?:(?:\*\s+as\s+[\w$]+|[\w$]+|\{[^}]*\})\s+from\s+)?['"]([^'"]+)['"]''', re.MULTILINE)
    REQUIRE_REGEX = re.compile(r'''require\s*\(\s*['"]([^'"]+)['"]\s*\)''', re.MULTILINE)
    DYNAMIC_IMPORT_REGEX = re.compile(r'''import\s*\(\s*['"]([^'"]+)['"]\s*\)''', re.MULTILINE)
    FUNC_DECL_REGEX = re.compile(r'''(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(([^)]*)\)''')
    ARROW_FUNC_REGEX = re.compile(r'''(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>''')
    CLASS_DECL_REGEX = re.compile(r'''(?:export\s+)?class\s+([A-Za-z0-9_$]+)''')
    INTERFACE_DECL_REGEX = re.compile(r'''(?:export\s+)?interface\s+([A-Za-z0-9_$]+)''')
    TYPE_ALIAS_REGEX = re.compile(r'''(?:export\s+)?type\s+([A-Za-z0-9_$]+)\s*=''')
    VARIABLE_DECL_REGEX = re.compile(r'''(?:export\s+)?(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*(?::[^=\n]+)?=''')
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

        for match in cls.DYNAMIC_IMPORT_REGEX.finditer(code):
            target = match.group(1)
            result["imports"].append({
                "name": target,
                "type": "local" if target.startswith(".") else "external",
                "line": code[:match.start()].count('\n') + 1,
                "dynamic": True,
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

        existing_names = {symbol["name"] for symbol in result["symbols"]}
        for pattern, kind in ((cls.INTERFACE_DECL_REGEX, "interface"), (cls.TYPE_ALIAS_REGEX, "type"), (cls.VARIABLE_DECL_REGEX, "constant")):
            for match in pattern.finditer(code):
                name = match.group(1)
                if name in existing_names:
                    continue
                line_number = code[:match.start()].count("\n") + 1
                symbol_kind = "constant" if kind == "constant" and name.isupper() else ("variable" if kind == "constant" else kind)
                result["symbols"].append({"name": name, "kind": symbol_kind, "line": line_number})
                existing_names.add(name)

        return result
