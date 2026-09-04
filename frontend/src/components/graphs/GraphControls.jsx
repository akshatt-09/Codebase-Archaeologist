import React from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export function GraphControls({ onZoomIn, onZoomOut, onReset }) {
  return (
    <div style={{
      position: 'absolute', bottom: '16px', right: '16px', display: 'flex',
      gap: '6px', background: '#12151b', border: '1px solid #262c38',
      borderRadius: '6px', padding: '4px'
    }}>
      <button onClick={onZoomIn} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
        <ZoomIn size={16} />
      </button>
      <button onClick={onZoomOut} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
        <ZoomOut size={16} />
      </button>
      <button onClick={onReset} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
        <Maximize2 size={16} />
      </button>
    </div>
  );
}