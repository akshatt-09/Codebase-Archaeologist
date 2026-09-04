import React, { useState } from 'react';
import { Badge } from '../common/Badge';

export function IssueList({ issues = [] }) {
  const [filter, setFilter] = useState('all');
  const filtered = issues.filter(i => filter === 'all' || i.severity === filter);

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        {['all', 'critical', 'warning', 'healthy'].map(lvl => (
          <button
            key={lvl}
            onClick={() => setFilter(lvl)}
            style={{
              background: filter === lvl ? '#202530' : 'transparent',
              border: '1px solid #262c38', color: '#f0f4fc',
              padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer'
            }}
          >
            {lvl.toUpperCase()}
          </button>
        ))}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Severity</th>
            <th>Message</th>
            <th>File</th>
            <th>Line</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item, idx) => (
            <tr key={idx}>
              <td><Badge type={item.severity}>{item.severity}</Badge></td>
              <td>{item.message}</td>
              <td style={{ color: '#94a3b8', fontSize: '13px' }}>{item.file}</td>
              <td style={{ fontFamily: 'var(--font-mono)' }}>{item.line}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}