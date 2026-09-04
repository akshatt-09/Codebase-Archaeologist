import React from 'react';

export function HealthScore({ score }) {
  const color = score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div style={{
        width: '120px', height: '120px', borderRadius: '50%', border: `4px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '28px', fontWeight: 700, color, fontFamily: 'var(--font-mono)'
      }}>
        {score ? `${score}` : 'N/A'}
      </div>
      <span style={{ marginTop: '12px', color: '#94a3b8', fontSize: '13px' }}>Overall Health Grade</span>
    </div>
  );
}