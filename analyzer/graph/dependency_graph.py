import os


class DependencyResolver:
    SUPPORTED_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".py", ".java"]

    def __init__(self, all_relative_paths: list[str]):
        self.all_paths = set(all_relative_paths)
        self.unresolved_imports = []

    def resolve_import(self, current_file: str, import_specifier: str) -> str | None:
        specifier = (import_specifier or "").strip()
        if not specifier:
            return None
        current_dir = os.path.dirname(current_file)
        candidates = []

        if specifier.startswith("."):
            # Python relative modules use leading dots (e.g. .models, ..shared).
            if specifier.startswith(".") and not specifier.startswith(("./", "../")):
                level = len(specifier) - len(specifier.lstrip("."))
                module_part = specifier[level:].replace(".", "/")
                base = current_dir
                for _ in range(max(level - 1, 0)):
                    base = os.path.dirname(base)
                normalized = os.path.normpath(os.path.join(base, module_part or ".")).replace("\\", "/")
            else:
                normalized = os.path.normpath(os.path.join(current_dir, specifier)).replace("\\", "/")
            candidates.append(normalized)
        else:
            if specifier.startswith(("@/", "~/")):
                alias_path = specifier[2:]
                candidates.extend([f"src/{alias_path}", alias_path])
            dotted = specifier.replace(".", "/")
            candidates.extend([dotted, f"{dotted}/__init__"])
            # Java imports can name a type, in which case the final segment is a class.
            candidates.append("/".join(dotted.split("/")[:-1]))

        for candidate in candidates:
            candidate_variants = [candidate]
            stem, supplied_extension = os.path.splitext(candidate)
            if supplied_extension.lower() in {".js", ".jsx", ".mjs", ".cjs"}:
                candidate_variants.extend(stem + extension for extension in (".ts", ".tsx", ".jsx", ".js"))
            for variant in candidate_variants:
                if variant in self.all_paths:
                    return variant
                for extension in self.SUPPORTED_EXTENSIONS:
                    path = variant + extension
                    if path in self.all_paths:
                        return path
                    index_path = f"{variant}/index{extension}"
                    if index_path in self.all_paths:
                        return index_path
                    # Java package imports often omit the source-root prefix.
                    suffix = "/" + path
                    matches = [known for known in self.all_paths if known.endswith(suffix)]
                    if len(matches) == 1:
                        return matches[0]

        return None

    def build_graph(self, parsed_files: list[dict]) -> tuple[list[dict], list[dict]]:
        edges = []
        external_deps = {}
        self.unresolved_imports = []
        for parsed_file in parsed_files:
            source_file = parsed_file["path"]
            for imported in parsed_file.get("imports", []):
                specifier = imported.get("name", "")
                resolved = self.resolve_import(source_file, specifier)
                if resolved:
                    edges.append({
                        "from": source_file,
                        "to": resolved,
                        "type": "local-import",
                        "line": imported.get("line"),
                        "specifier": specifier,
                        "dynamic": bool(imported.get("dynamic", False)),
                    })
                elif specifier.startswith((".", "@/", "~/")):
                    self.unresolved_imports.append({
                        "from": source_file,
                        "specifier": specifier,
                        "line": imported.get("line"),
                        "dynamic": bool(imported.get("dynamic", False)),
                        "reason": "Relative, aliased, or dynamic import could not be resolved statically",
                    })
                else:
                    root_package = specifier.split("/")[0].split(".")[0]
                    if root_package:
                        external_deps[root_package] = external_deps.get(root_package, 0) + 1

        formatted = [{"name": name, "occurrences": count, "type": "external"} for name, count in sorted(external_deps.items())]
        return edges, formatted
