from analyzer.graph.dependency_graph import DependencyResolver

def test_dependency_resolution():
    all_paths = ["src/App.jsx", "src/components/Header.jsx", "src/utils.js"]
    resolver = DependencyResolver(all_paths)

    resolved = resolver.resolve_import("src/App.jsx", "./components/Header")
    assert resolved == "src/components/Header.jsx"

    resolved_ext = resolver.resolve_import("src/App.jsx", "react")
    assert resolved_ext is None
