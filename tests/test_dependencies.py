from analyzer.graph.dependency_graph import DependencyResolver

def test_dependency_resolution():
    all_paths = ["src/App.jsx", "src/components/Header.jsx", "src/utils.js"]
    resolver = DependencyResolver(all_paths)

    resolved = resolver.resolve_import("src/App.jsx", "./components/Header")
    assert resolved == "src/components/Header.jsx"

    resolved_ext = resolver.resolve_import("src/App.jsx", "react")
    assert resolved_ext is None


def test_relative_python_import_resolution():
    resolver = DependencyResolver(["package/__init__.py", "package/models.py", "package/views.py"])
    assert resolver.resolve_import("package/views.py", ".models") == "package/models.py"


def test_source_root_java_import_resolution():
    resolver = DependencyResolver(["src/main/java/com/example/User.java"])
    assert resolver.resolve_import("src/main/java/com/example/Service.java", "com.example.User") == "src/main/java/com/example/User.java"


def test_dynamic_javascript_import_is_detected_and_resolved():
    from analyzer.parsers.javascript import JavaScriptSourceParser

    parsed = JavaScriptSourceParser.parse("const page = import('./pages/Home');", "src/main.js")
    assert parsed["imports"][0]["dynamic"] is True
    resolver = DependencyResolver(["src/main.js", "src/pages/Home.jsx"])
    edges, _ = resolver.build_graph([{"path": "src/main.js", "imports": parsed["imports"]}])
    assert edges[0]["to"] == "src/pages/Home.jsx"
    assert edges[0]["dynamic"] is True


def test_typescript_resolves_javascript_extension_to_typescript_file():
    resolver = DependencyResolver(["frontend/index.ts", "frontend/utils.ts"])
    assert resolver.resolve_import("frontend/index.ts", "./utils.js") == "frontend/utils.ts"
