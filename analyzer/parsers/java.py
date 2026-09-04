import re

class JavaSourceParser:
    PACKAGE_REGEX = re.compile(r'''^\s*package\s+([\w\.]+);''', re.MULTILINE)
    IMPORT_REGEX = re.compile(r'''^\s*import\s+(?:static\s+)?([\w\.\*]+);''', re.MULTILINE)
    CLASS_REGEX = re.compile(r'''(?:public|protected|private)?\s*(?:static\s+)?(?:final\s+)?(?:class|interface|enum)\s+([A-Za-z0-9_$]+)''')
    METHOD_REGEX = re.compile(r'''(?:public|protected|private)\s+[\w<>\[\],\s]+\s+([A-Za-z0-9_$]+)\s*\([^)]*\)\s*(?:throws\s+[\w,\s]+)?\s*\{''')

    @classmethod
    def parse(cls, code: str, file_path: str) -> dict:
        lines = code.splitlines()
        result = {
            "package": None,
            "imports": [],
            "classes": [],
            "functions": [],
            "symbols": [],
            "complexity": 1,
            "lines": len(lines),
            "errors": []
        }

        pkg_match = cls.PACKAGE_REGEX.search(code)
        if pkg_match:
            result["package"] = pkg_match.group(1)

        for match in cls.IMPORT_REGEX.finditer(code):
            target = match.group(1)
            result["imports"].append({
                "name": target,
                "type": "external",
                "line": code[:match.start()].count('\n') + 1
            })

        for idx, line in enumerate(lines, 1):
            c_match = cls.CLASS_REGEX.search(line)
            if c_match:
                name = c_match.group(1)
                result["classes"].append({"name": name, "line": idx})
                result["symbols"].append({"name": name, "kind": "class", "line": idx})
                continue

            m_match = cls.METHOD_REGEX.search(line)
            if m_match:
                name = m_match.group(1)
                result["functions"].append({"name": name, "line": idx})
                result["symbols"].append({"name": name, "kind": "method", "line": idx})

            branch_tokens = ['if (', 'else if (', 'for (', 'while (', 'catch (', 'case ']
            for bt in branch_tokens:
                if bt in line:
                    result["complexity"] += 1
            result["complexity"] += line.count('&&') + line.count('||')

        return result
