import React, { useState } from 'react';
import { Card } from '../components/common/Card';

export function Dependencies({ data }) {
  const edges = data?.dependencies?.edges || [];
  const externals = data?.dependencies?.external || [];
  const [filter, setFilter] = useState('');

  const filteredEdges = edges.filter(
    e => e.from.toLowerCase().includes(filter.toLowerCase()) || 
         e.to.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <input
        type="text"
        placeholder="Filter local dependencies by source or target..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          background: '#181c24',
          border: '1px solid #262c38',
          color: '#f0f4fc',
          padding: '8px 12px',
          borderRadius: '6px'
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <Card title={`Local Dependencies (${edges.length})`}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Target</th>
                <th>Line</th>
              </tr>
            </thead>
            <tbody>
              {filteredEdges.slice(0, 50).map((edge, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '13px', color: '#94a3b8' }}>{edge.from}</td>
                  <td style={{ fontSize: '13px', color: '#0ea5e9' }}>{edge.to}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{edge.line || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title={`External Packages (${externals.length})`}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Usages</th>
              </tr>
            </thead>
            <tbody>
              {externals.map((ext) => (
                <tr key={ext.name}>
                  <td style={{ fontWeight: 500 }}>{ext.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{ext.occurrences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}