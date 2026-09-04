import React, { useState } from 'react';
import { GraphControls } from './GraphControls';

export function DependencyGraph({ edges = [] }) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="graph-container">
      <div style={{
        transform: `scale(${zoom})`, transformOrigin: 'top left',
        padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px'
      }}>
        <div style={{ fontSize: '12px', color: '#64748b' }}>CANVAS: DEPENDENCY TOPOLOGY</div>
        {edges.slice(0, 30).map((edge, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{edge.from}</span>
            <span style={{ color: '#0ea5e9' }}>──&gt;</span>
            <span style={{ color: '#f0f4fc', fontFamily: 'var(--font-mono)' }}>{edge.to}</span>
          </div>
        ))}
      </div>
      <GraphControls
        onZoomIn={() => setZoom(z => Math.min(z + 0.2, 2))}
        onZoomOut={() => setZoom(z => Math.max(z - 0.2, 0.5))}
        onReset={() => setZoom(1)}
      />
    </div>
  );
}