import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export function CodeHealth({ data }) {
  const health = data?.health;
  const issues = health?.issues || [];
  const [filter, setFilter] = useState('all');

  const filteredIssues = issues.filter(
    (iss) => filter === 'all' || iss.severity === filter
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Health Score</div>
          <div className="metric-val" style={{ color: '#10b981' }}>
            {health?.score ? `${health.score}/100` : 'Not available'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Duplication</div>
          <div className="metric-val">
            {typeof health?.metrics?.duplication === 'number'
              ? `${health.metrics.duplication}%`
              : 'Not available'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Test Coverage</div>
          <div className="metric-val" style={{ fontSize: '18px', color: '#94a3b8' }}>
            {health?.metrics?.testCoverage || 'Not available'}
          </div>
        </div>
      </div>

      <Card title={`Discovered Code Health Issues (${issues.length})`}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['all', 'critical', 'warning', 'healthy'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className="nav-item"
              style={{
                width: 'auto',
                background: filter === st ? '#202530' : '#181c24',
                border: '1px solid #262c38'
              }}
            >
              {st.toUpperCase()}
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
              <th>Metric</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue, idx) => (
              <tr key={idx}>
                <td><Badge type={issue.severity}>{issue.severity}</Badge></td>
                <td>{issue.message}</td>
                <td style={{ fontSize: '13px', color: '#94a3b8' }}>{issue.file}</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{issue.line}</td>
                <td style={{ color: '#64748b' }}>{issue.metric}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}