import os

class DependencyResolver:
    SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java']

    def __init__(self, all_relative_paths: list[str]):
        self.all_paths = set(all_relative_paths)

    def resolve_import(self, current_file: str, import_specifier: str) -> str | None:
        """Resolve import specifier relative to current_file."""
        if not import_specifier.startswith('.'):
            # Check for direct top-level module resolution (e.g. Python packages)
            py_as_file = import_specifier.replace('.', '/') + '.py'
            if py_as_file in self.all_paths:
                return py_as_file
            return None

        current_dir = os.path.dirname(current_file)
        normalized_target = os.path.normpath(os.path.join(current_dir, import_specifier)).replace('\\', '/')

        # Direct file hit
        if normalized_target in self.all_paths:
            return normalized_target

        # Suffix matching
        for ext in self.SUPPORTED_EXTENSIONS:
            candidate = normalized_target + ext
            if candidate in self.all_paths:
                return candidate

        # Index resolution
        for ext in self.SUPPORTED_EXTENSIONS:
            candidate = f"{normalized_target}/index{ext}"
            if candidate in self.all_paths:
                return candidate

        return None

    def build_graph(self, parsed_files: list[dict]) -> tuple[list[dict], list[dict]]:
        edges = []
        external_deps = {}

        for pf in parsed_files:
            source_file = pf["path"]
            for imp in pf.get("imports", []):
                specifier = imp["name"]
                resolved = self.resolve_import(source_file, specifier)
                if resolved:
                    edges.append({
                        "from": source_file,
                        "to": resolved,
                        "type": "local-import",
                        "line": imp.get("line")
                    })
                else:
                    if imp.get("type") == "external" or not specifier.startswith('.'):
                        root_pkg = specifier.split('/')[0].split('.')[0]
                        if root_pkg:
                            external_deps[root_pkg] = external_deps.get(root_pkg, 0) + 1

        formatted_externals = [{"name": k, "occurrences": v, "type": "external"} for k, v in external_deps.items()]
        return edges, formatted_externals
