import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { GitCommit, ArrowRight } from 'lucide-react';

export function FeatureFlows({ data }) {
  const flows = data?.flows || [];
  const [selectedFlow, setSelectedFlow] = useState(flows[0] || null);

  if (flows.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
        No reliable feature flows detected.
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
      <Card title="Inferred Feature Traces">
        {flows.map((flow) => (
          <div
            key={flow.id}
            onClick={() => setSelectedFlow(flow)}
            style={{
              padding: '10px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '8px',
              backgroundColor: selectedFlow?.id === flow.id ? '#202530' : 'transparent',
              border: selectedFlow?.id === flow.id ? '1px solid #0ea5e9' : '1px solid transparent'
            }}
          >
            <div style={{ fontWeight: 600, color: '#f0f4fc' }}>{flow.name}</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Entry: {flow.entryPoint}
            </div>
          </div>
        ))}
      </Card>

      <Card title="Execution Trace Steps">
        {selectedFlow ? (
          <div>
            <div style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '13px' }}>
              Inference Confidence: <strong>{selectedFlow.confidence * 100}%</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedFlow.steps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#12151b',
                    borderRadius: '6px'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#0ea5e9' }}>
                    {step.step}.
                  </span>
                  <span style={{ fontSize: '13px', color: '#f0f4fc' }}>{step.file}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ color: '#64748b' }}>Select a flow to inspect.</div>
        )}
      </Card>
    </div>
  );
}