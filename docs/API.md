# API Documentation

## `GET /api/health`
Returns backend operational status.

## `GET /api/summary`
Returns cached results of the latest analyzed repository.

## `POST /api/analyze`
Accepts `multipart/form-data` with either:
* `file`: Single `.zip` archive.
* `files[]`: Multi-file folder upload.

Returns:
```json
{
  "repository": { "name": "string", "hasGit": true },
  "stats": { "fileCount": 0, "lineCount": 0 },
  "languages": { "Python": 10 },
  "files": [],
  "symbols": [],
  "dependencies": { "edges": [], "external": [] },
  "architecture": { "modules": [] },
  "health": { "score": 95.0, "issues": [] },
  "git": { "available": true }
}