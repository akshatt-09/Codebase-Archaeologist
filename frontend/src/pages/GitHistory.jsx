import React from 'react';
import { Card } from '../components/common/Card';

export function GitHistory({ data }) {
  const git = data?.git;

  if (!git || !git.available) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#f0f4fc', marginBottom: '8px' }}>Git metadata unavailable</h3>
        <p style={{ color: '#64748b' }}>
          The uploaded repository does not contain Git history (.git directory was not found).
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Active Branch</div>
          <div className="metric-val">{git.branch}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">HEAD Commit</div>
          <div className="metric-val">{git.head}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Contributors</div>
          <div className="metric-val">{git.contributors?.length || 0}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <Card title="Commit History">
          <table className="data-table">
            <thead>
              <tr>
                <th>SHA</th>
                <th>Message</th>
                <th>Author</th>
                <th>Changes</th>
              </tr>
            </thead>
            <tbody>
              {git.commits?.map((c) => (
                <tr key={c.sha}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#0ea5e9' }}>{c.sha}</td>
                  <td>{c.message}</td>
                  <td style={{ color: '#94a3b8' }}>{c.author}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#10b981' }}>+{c.insertions}</span>{' '}
                    <span style={{ color: '#ef4444' }}>-{c.deletions}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Churn Hotspots">
          <table className="data-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Lines Changed</th>
              </tr>
            </thead>
            <tbody>
              {git.hotspots?.map((h) => (
                <tr key={h.file}>
                  <td style={{ fontSize: '13px' }}>{h.file}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{h.churn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}