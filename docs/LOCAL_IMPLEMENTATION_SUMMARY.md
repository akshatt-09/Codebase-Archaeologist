# Local implementation summary

This working copy extends the existing React/Vite + Flask application. It does not replace the architecture or modify the remote GitHub repository.

## Repository switching

- Adds a persistent GitHub URL switcher in the application header.
- Accepts only HTTPS `github.com/owner/repository` URLs and normalizes `.git` suffixes.
- Analyzes a candidate repository in a separate temporary workspace.
- Replaces the active analysis and cleans up the previous workspace only after the candidate scan succeeds.
- Keeps the previous dashboard data available after a failed switch.
- Applies file-count and analyzable-source-size limits during ingestion.

## Search

- Searches parser-derived symbols, file paths, and actual source lines in the active repository.
- Indexes Python module-level variables and JavaScript/TypeScript interfaces, types, variables, and constants where the parser can identify them.
- Debounces frontend searches and caches recent backend query results for the active repository.
- Opens the real source file at the selected symbol/content line.
- Uses bounded source windows (100–800 lines) so very large files do not render in full.

## Code Health

- Removes total LOC from the score formula.
- Calculates complexity averages from supported parsed languages rather than allowing documentation/assets to dilute the average.
- Treats TODO and large-file observations as informational; FIXME and complexity findings remain actionable.
- Distinguishes unavailable duplication data from a measured zero.
- Excludes common generated/vendor/lock/minified files from duplication analysis and preserves source line ranges for duplicate blocks.
- Adds a transparent score breakdown, severity counts, source-linked findings, improvement suggestions, a hypothetical score simulator, and per-repository session history.
- Health history is kept in backend memory and resets when the backend process restarts.

## Architecture and dependencies

- Adds module-level and file-level SVG dependency diagrams derived from resolved imports.
- Supports selection, incoming/outgoing highlighting, filtering, zoom, scroll-based panning, and simplified/detailed module views.
- Distinguishes dynamic imports visually and lists unresolved relative/aliased imports separately from third-party packages.
- Detects file dependency cycles where the static graph supports it.
- Displays parser-derived symbols, imports, and a bounded source preview in the file inspector.
- The diagrams show static import relationships; they do not claim to prove runtime execution order.

## Verification notes

- Python unit tests and analyzer self-analysis are run locally; see the handoff message for exact results.
- Frontend JavaScript/JSX syntax is checked, but a Vite production build requires installing the npm dependencies locally.
- Flask/GitPython API tests require the backend dependencies in `backend/requirements.txt`.
- No GitHub commits, branches, pull requests, issues, pushes, or deployments are performed.
