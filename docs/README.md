### `docs/ARCHITECTURE.md`
```markdown
# System Architecture

Codebase Archaeologist operates as a decoupled client-server architecture:

1. **Ingestion Sandbox**: Repositories are copied into a temporary directory; path traversal vulnerabilities are strictly guarded against.
2. **Analysis Core**: Single-pass parsing computes AST symbols, branches, and imports.
3. **Graph Builder**: Relative import declarations are resolved against the discovered repository index.
4. **Presentation**: React views render strictly dynamically from calculated metrics.