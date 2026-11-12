import React, { useState, useEffect } from 'react';
import { getFileContent } from '../../services/api';
import { Code, Copy, Check } from 'lucide-react';

export function CodeViewer({ filePath, initialLine }) {
  const [content, setContent] = useState('');
  const [startLine, setStartLine] = useState(1);
  const [totalLines, setTotalLines] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!filePath) { setContent(''); return undefined; }
    let active = true;
    setLoading(true);
    setErr(null);
    getFileContent(filePath, initialLine || 1)
      .then((res) => { if (active) { setContent(res.content); setStartLine(res.startLine || 1); setTotalLines(res.totalLines || 0); } })
      .catch((e) => { if (active) setErr(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [filePath, initialLine]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!filePath) {
    return <div style={{ color: '#64748b' }}>Select a file to inspect its source code.</div>;
  }

  if (loading) return <div>Loading source content...</div>;
  if (err) return <div style={{ color: '#ef4444' }}>Error: {err}</div>;

  const lines = content.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#0ea5e9' }}>
          {filePath}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: '#181c24',
            border: '1px solid #262c38',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy preview'}
        </button>
      </div>
      {totalLines > lines.length && <div className="code-window-note">Showing lines {startLine}–{startLine + lines.length - 1} of {totalLines} to keep large-file previews responsive.</div>}
      <div className="code-viewer">
        {lines.map((line, idx) => {
          const lineNum = startLine + idx;
          const isTarget = lineNum === initialLine;
          return (
            <div
              key={lineNum}
              className="code-line"
              style={{ backgroundColor: isTarget ? 'rgba(14, 165, 233, 0.15)' : 'transparent' }}
            >
              <div className="line-num">{lineNum}</div>
              <div className="line-text">{line || ' '}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}