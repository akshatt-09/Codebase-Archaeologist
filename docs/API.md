# API Documentation

## `GET /api/health`
Returns backend operational status.

## `GET /api/summary`
Returns cached results of the latest successfully analyzed repository. A failed repository switch does not replace this result.

## `POST /api/analyze`
Accepts `multipart/form-data` with either:
- `file`: Single `.zip` archive.
- `files[]`: Multi-file folder upload.

The uploaded repository is analyzed in a temporary workspace. The active analysis is replaced only after the scan succeeds.

## `POST /api/analyze-github`
Accepts JSON with a GitHub HTTPS repository URL:

```json
{ "url": "https://github.com/owner/repository" }
```

Only owner/repository URLs are accepted. Private repositories require Git credentials available to the backend process. Failed clones leave the previous successful analysis active.

## `GET /api/search?q=term`
Searches the active repository and returns up to 200 matching symbols, file paths, and source-line snippets. Example response shape:

```json
{
  "symbols": [],
  "files": [],
  "contentMatches": [
    { "file": "src/main.js", "line": 12, "snippet": "..." }
  ]
}
```

## `GET /api/file-content?path=relative/path&line=100&window=400`
Returns a bounded source window for a file included in the active analysis. `line` selects the center line and `window` is clamped to 100–800 lines. Paths are matched against the active repository's indexed file list.

## Analysis response additions

- `dependencies.edges` contains resolved internal file imports, including source line, specifier, and dynamic-import flag where available.
- `dependencies.external` contains unresolved third-party package names.
- `dependencies.unresolved` reports relative/aliased imports that could not be statically resolved.
- `architecture.fileEdges` contains actual file-to-file relationships; `crossModuleEdges` aggregates cross-module imports; `circularDependencies` lists detected file cycles.
- `health.scoreModel` describes the score formula and individual penalties. Repository LOC is not a score penalty. Missing duplication data is omitted rather than interpreted as zero.

## `GET /api/health-history?repository=key`
Returns up to 20 health-score snapshots retained for the selected repository during the current backend process. History is in-memory and resets when the backend restarts.
