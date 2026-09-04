# Git Engine

Git repository parser utilizing GitPython.

## Capabilities
* Discovers active branch, HEAD commit SHA, authors, and commit count.
* Analyzes lines changed across history to highlight churn hotspots.
* Returns an explicit `available: false` payload with a clear explanatory message when `.git` is omitted.