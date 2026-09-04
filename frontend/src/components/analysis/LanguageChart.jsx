import React from 'react';

export function LanguageChart({ languages = {} }) {
  const entries = Object.entries(languages);
  const total = entries.reduce((acc, [, count]) => acc + count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
        {entries.map(([lang, count], i) => {
          const colors = ['#0ea5e9', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
          const widthPct = total ? (count / total) * 100 : 0;
          return (
            <div key={lang} style={{ width: `${widthPct}%`, background: colors[i % colors.length] }} />
          );
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
        {entries.map(([lang, count]) => (
          <div key={lang} style={{ fontSize: '12px', color: '#94a3b8' }}>
            <span style={{ color: '#f0f4fc', fontWeight: 500 }}>{lang}</span>: {count}
          </div>
        ))}
      </div>
    </div>
  );
}