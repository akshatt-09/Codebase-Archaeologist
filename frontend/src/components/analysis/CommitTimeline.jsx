import React from 'react';

export function CommitTimeline({ commits = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {commits.map((c) => (
        <div key={c.sha} style={{
          borderLeft: '2px solid #262c38', paddingLeft: '14px', position: 'relative'
        }}>
          <div style={{
            position: 'absolute', left: '-5px', top: '4px',
            width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9'
          }} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#0ea5e9', fontSize: '12px' }}>{c.sha}</span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>{c.author}</span>
          </div>
          <div style={{ color: '#f0f4fc', fontSize: '13px', marginTop: '2px' }}>{c.message}</div>
        </div>
      ))}
    </div>
  );
}