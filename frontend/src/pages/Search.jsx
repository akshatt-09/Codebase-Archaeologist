import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { CodeViewer } from '../components/common/CodeViewer';

export function Search({ data }) {
  const [query, setQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLine, setSelectedLine] = useState(1);

  const symbols = data?.symbols || [];
  const files = data?.files || [];

  const matchedSymbols = query.trim()
    ? symbols.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const matchedFiles = query.trim()
    ? files.filter((f) => f.path.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelectResult = (path, line) => {
    setSelectedFile(path);
    setSelectedLine(line || 1);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="text"
          placeholder="Search symbols, functions, classes, or paths..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            background: '#181c24',
            border: '1px solid #262c38',
            color: '#f0f4fc',
            padding: '10px 14px',
            borderRadius: '6px'
          }}
        />

        <Card title={`Matching Symbols (${matchedSymbols.length})`}>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {matchedSymbols.map((sym, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectResult(sym.file, sym.line)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #262c38'
                }}
              >
                <div style={{ fontWeight: 600, color: '#0ea5e9' }}>{sym.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {sym.kind} | {sym.file}:{sym.line}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title={`Matching Files (${matchedFiles.length})`}>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {matchedFiles.map((file) => (
              <div
                key={file.path}
                onClick={() => handleSelectResult(file.path, 1)}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #262c38'
                }}
              >
                <div style={{ color: '#f0f4fc' }}>{file.path}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {file.language} | {file.lines} lines
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <Card title="Source Preview">
          <CodeViewer filePath={selectedFile} initialLine={selectedLine} />
        </Card>
      </div>
    </div>
  );
}