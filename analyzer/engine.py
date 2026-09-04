import os
from backend.services.ingestion import discover_repository_files
from analyzer.parsers.python import PythonSourceParser
from analyzer.parsers.javascript import JavaScriptSourceParser
from analyzer.parsers.typescript import TypeScriptSourceParser
from analyzer.parsers.java import JavaSourceParser
from analyzer.graph.dependency_graph import DependencyResolver
from analyzer.graph.architecture import ArchitectureInference
from analyzer.tracing.call_graph import CallGraphBuilder
from analyzer.tracing.feature_trace import FeatureFlowEngine
from analyzer.metrics.complexity import ComplexityAnalyzer
from analyzer.metrics.duplication import DuplicationDetector
from analyzer.metrics.health import CodeHealthEngine

EXTENSION_MAP = {
    '.py': ('Python', PythonSourceParser),
    '.js': ('JavaScript', JavaScriptSourceParser),
    '.jsx': ('JSX', JavaScriptSourceParser),
    '.ts': ('TypeScript', TypeScriptSourceParser),
    '.tsx': ('TSX', TypeScriptSourceParser),
    '.java': ('Java', JavaSourceParser),
    '.json': ('JSON', None),
    '.html': ('HTML', None),
    '.css': ('CSS', None),
    '.scss': ('SCSS', None),
    '.md': ('Markdown', None),
    '.sql': ('SQL', None)
}

class StaticAnalysisEngine:
    def __init__(self, root_dir: str):
        self.root_dir = os.path.abspath(root_dir)

    def run(self) -> dict:
        raw_files = discover_repository_files(self.root_dir)
        parsed_files = []
        all_symbols = []
        language_stats = {}
        total_lines = 0
        all_errors = []

        all_rel_paths = [f["path"] for f in raw_files]
        resolver = DependencyResolver(all_rel_paths)

        for rf in raw_files:
            ext = os.path.splitext(rf["path"])[1].lower()
            lang_info = EXTENSION_MAP.get(ext, ('Other', None))
            lang = lang_info[0]
            parser = lang_info[1]

            language_stats[lang] = language_stats.get(lang, 0) + 1

            file_entry = {
                "path": rf["path"],
                "absolute_path": rf["absolute_path"],
                "language": lang,
                "size": rf["size"],
                "lines": 0,
                "complexity": 1,
                "imports": [],
                "symbols": []
            }

            if parser:
                try:
                    with open(rf["absolute_path"], 'r', encoding='utf-8', errors='replace') as code_file:
                        content = code_file.read()
                    parsed = parser.parse(content, rf["path"])
                    file_entry["lines"] = parsed.get("lines", 0)
                    file_entry["complexity"] = parsed.get("complexity", 1)
                    file_entry["imports"] = parsed.get("imports", [])
                    file_entry["symbols"] = parsed.get("symbols", [])
                    file_entry["calls"] = parsed.get("calls", [])
                    
                    for sym in file_entry["symbols"]:
                        sym["file"] = rf["path"]
                        all_symbols.append(sym)

                    if parsed.get("errors"):
                        all_errors.extend(parsed["errors"])
                except Exception as e:
                    all_errors.append({"file": rf["path"], "error": "ParserException", "message": str(e)})
            else:
                try:
                    with open(rf["absolute_path"], 'r', encoding='utf-8', errors='replace') as code_file:
                        lines_c = sum(1 for _ in code_file)
                    file_entry["lines"] = lines_c
                except Exception:
                    file_entry["lines"] = 0

            total_lines += file_entry["lines"]
            parsed_files.append(file_entry)

        # Graph resolution
        edges, external_deps = resolver.build_graph(parsed_files)
        arch_data = ArchitectureInference.infer_modules(parsed_files, edges)
        call_graph = CallGraphBuilder.build(parsed_files)
        flows = FeatureFlowEngine.infer_flows(parsed_files, edges)

        # Metrics & Health
        complexity_data = ComplexityAnalyzer.evaluate(parsed_files)
        duplication_data = DuplicationDetector.analyze(parsed_files)
        health_data = CodeHealthEngine.audit(parsed_files, complexity_data, duplication_data)

        return {
            "stats": {
                "fileCount": len(parsed_files),
                "lineCount": total_lines,
                "symbolCount": len(all_symbols),
                "dependencyCount": len(edges) + len(external_deps)
            },
            "languages": language_stats,
            "files": parsed_files,
            "symbols": all_symbols,
            "dependencies": {
                "edges": edges,
                "external": external_deps
            },
            "architecture": arch_data,
            "callGraph": call_graph,
            "flows": flows,
            "complexity": complexity_data,
            "health": health_data,
            "errors": all_errors
        }
