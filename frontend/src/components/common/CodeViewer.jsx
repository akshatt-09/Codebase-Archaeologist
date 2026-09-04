import React, { useState, useEffect } from 'react';
import { getFileContent } from '../../services/api';
import { Code, Copy, Check } from 'lucide-react';

export function CodeViewer({ filePath, initialLine }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!filePath) return;
    setLoading(true);
    setErr(null);
    getFileContent(filePath)
      .then((res) => setContent(res.content))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [filePath]);

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
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="code-viewer">
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
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