### `analyzer/README.md`
```markdown
# Static Analysis Engine

Static code analyzer executing strictly offline without executing user source code.

## Modules
* `parsers/`: Language-specific AST and token extractors.
* `graph/`: Dependency resolver and module clusterer.
* `tracing/`: Function call graphs and feature trace reconstructors.
* `metrics/`: Cyclomatic complexity, maintainability, and code smell identification