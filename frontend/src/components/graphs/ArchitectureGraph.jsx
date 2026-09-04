import React, { useState } from 'react';

export function ArchitectureGraph({ architecture, onSelectNode }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const modules = architecture?.modules || [];
  const edges = architecture?.crossModuleEdges || [];

  const handleNodeClick = (mod) => {
    setSelectedModule(mod);
    if (onSelectNode) onSelectNode(mod);
  };

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div className="graph-container" style={{ flex: 2, padding: '20px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
          INFERRED ARCHITECTURAL BOUNDARIES & CROSS-MODULE DEPENDENCIES
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {modules.map((m) => {
            const isSel = selectedModule?.name === m.name;
            return (
              <div
                key={m.name}
                onClick={() => handleNodeClick(m)}
                style={{
                  background: isSel ? '#202530' : '#12151b',
                  border: isSel ? '1px solid #0ea5e9' : '1px solid #262c38',
                  borderRadius: '8px',
                  padding: '16px',
                  width: '200px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 600, color: '#f0f4fc' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                  Files: {m.files.length}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  In: {m.incomingCount} | Out: {m.outgoingCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="card">
          <div className="card-title">Module Inspector</div>
          {selectedModule ? (
            <div>
              <div style={{ fontWeight: 600, color: '#0ea5e9', marginBottom: '8px' }}>
                {selectedModule.name}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                Languages: {selectedModule.languages.join(', ') || 'None'}
              </div>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {selectedModule.files.map((f) => (
                  <div key={f} style={{ fontSize: '12px', color: '#e2e8f0', padding: '3px 0' }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: '#64748b', fontSize: '13px' }}>
              Select a module box to inspect its contained files and metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}