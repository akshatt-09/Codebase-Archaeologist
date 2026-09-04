import React from 'react';
import { Card } from '../components/common/Card';
import { formatNumber } from '../utils/formatters';

export function Overview({ data }) {
  const stats = data?.stats;
  const repo = data?.repository;
  const health = data?.health;
  const languages = data?.languages || {};

  return (
    <div>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Files</div>
          <div className="metric-val">{formatNumber(stats?.fileCount)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Lines of Code</div>
          <div className="metric-val">{formatNumber(stats?.lineCount)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Dependencies</div>
          <div className="metric-val">{formatNumber(stats?.dependencyCount)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Health Score</div>
          <div className="metric-val" style={{ color: '#10b981' }}>
            {health?.score ? `${health.score}/100` : 'Not available'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <Card title="Languages Detected">
          <table className="data-table">
            <thead>
              <tr>
                <th>Language</th>
                <th>File Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(languages).map(([lang, count]) => (
                <tr key={lang}>
                  <td>{lang}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Repository Overview">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Active Target: </span>
              <span style={{ fontWeight: 600 }}>{repo?.name}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Git History: </span>
              <span>{repo?.hasGit ? 'Active (.git parsed)' : 'Not available'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Identified Symbols: </span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{stats?.symbolCount}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}