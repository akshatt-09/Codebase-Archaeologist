import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, FileCode2, Braces, TextSearch } from 'lucide-react';
import { Card } from '../components/common/Card';
import { CodeViewer } from '../components/common/CodeViewer';
import { searchRepository } from '../services/api';

export function Search({ data, inspectionTarget }) {
  const [query, setQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLine, setSelectedLine] = useState(1);
  const [results, setResults] = useState({ symbols: [], files: [], contentMatches: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSelectedFile(null);
    setSelectedLine(1);
  }, [data?.repository?.path]);

  useEffect(() => {
    if (inspectionTarget?.file) {
      setSelectedFile(inspectionTarget.file);
      setSelectedLine(inspectionTarget.line || 1);
    }
  }, [inspectionTarget?.key]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ symbols: [], files: [], contentMatches: [] });
      setError('');
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    setError('');
    const timer = setTimeout(() => {
      searchRepository(query.trim())
        .then((response) => { if (active) setResults(response); })
        .catch((err) => { if (active) setError(err.message); })
        .finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => { active = false; clearTimeout(timer); };
  }, [query, data?.repository?.path]);

  const select = (path, line = 1) => {
    setSelectedFile(path);
    setSelectedLine(line || 1);
  };

  return (
    <div className="search-workspace">
      <section className="search-results-column">
        <label className="search-input-wrap">
          <SearchIcon size={17} />
          <input
            type="search"
            placeholder="Search symbols, functions, classes, files, or code…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search active repository"
          />
          {loading && <span className="search-loading">Searching…</span>}
        </label>
        {error && <div className="analysis-error">{error}</div>}

        <Card title={`Matching Symbols (${results.symbols.length})`}>
          <div className="search-result-list">
            {results.symbols.map((symbol, index) => (
              <button className="search-result" key={`${symbol.file}:${symbol.line}:${symbol.name}:${index}`} onClick={() => select(symbol.file, symbol.line)}>
                <span className="search-result-icon"><Braces size={15} /></span>
                <span className="search-result-copy"><strong>{symbol.name}</strong><small>{symbol.kind || 'symbol'} · {symbol.file}:{symbol.line}</small></span>
              </button>
            ))}
            {!query && <p className="search-empty">Enter a query to search the active repository.</p>}
            {query && !loading && results.symbols.length === 0 && <p className="search-empty">No matching symbols.</p>}
          </div>
        </Card>

        <Card title={`Matching Files (${results.files.length})`}>
          <div className="search-result-list">
            {results.files.map((file) => (
              <button className="search-result" key={file.path} onClick={() => select(file.path, 1)}>
                <span className="search-result-icon"><FileCode2 size={15} /></span>
                <span className="search-result-copy"><strong>{file.path}</strong><small>{file.language} · {file.lines} lines</small></span>
              </button>
            ))}
            {query && !loading && results.files.length === 0 && <p className="search-empty">No file paths match this query.</p>}
          </div>
        </Card>

        <Card title={`Matching Code (${results.contentMatches.length})`}>
          <div className="search-result-list">
            {results.contentMatches.map((match, index) => (
              <button className="search-result code-match" key={`${match.file}:${match.line}:${index}`} onClick={() => select(match.file, match.line)}>
                <span className="search-result-icon"><TextSearch size={15} /></span>
                <span className="search-result-copy"><strong>{match.file}:{match.line}</strong><small>{match.snippet}</small></span>
              </button>
            ))}
            {query && !loading && results.contentMatches.length === 0 && <p className="search-empty">No matching source lines.</p>}
          </div>
        </Card>
      </section>

      <section className="search-preview-column">
        <Card title="Source Preview">
          <CodeViewer key={data?.repository?.path || data?.repository?.name} filePath={selectedFile} initialLine={selectedLine} />
        </Card>
      </section>
    </div>
  );
}
