import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { getHealthHistory } from '../services/api';

const calculateEstimate = (complexity, duplication, findings) => {
  const complexityPenalty = Math.min(Math.max(complexity - 5, 0) * 2, 30);
  const duplicationPenalty = typeof duplication === 'number' ? Math.min(Math.max(duplication - 3, 0) * 1.5, 30) : 0;
  const findingPenalty = Math.min(Math.max(findings, 0) * 2, 30);
  return Math.round(Math.max(0, Math.min(100, 100 - complexityPenalty - duplicationPenalty - findingPenalty)) * 10) / 10;
};

export function CodeHealth({ data, onInspect }) {
  const health = data?.health;
  const issues = health?.issues || [];
  const [filter, setFilter] = useState('all');
  const [complexityReduction, setComplexityReduction] = useState(0);
  const [duplicationReduction, setDuplicationReduction] = useState(0);
  const [findingsResolved, setFindingsResolved] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState('');
  const scoreModel = health?.scoreModel || {};
  const baseComplexity = Number(scoreModel.averageComplexity ?? health?.metrics?.averageComplexity ?? data?.complexity?.average ?? 1);
  const rawDuplication = health?.metrics?.duplication;
  const hasDuplication = typeof rawDuplication === 'number';
  const baseDuplication = hasDuplication ? rawDuplication : null;
  const actionableFindings = Number(scoreModel.actionableFindingCount ?? issues.filter((issue) => ['critical', 'warning'].includes(issue.severity)).length);

  useEffect(() => {
    setComplexityReduction(0);
    setDuplicationReduction(0);
    setFindingsResolved(0);
    setFilter('all');
  }, [data?.repository?.path]);

  useEffect(() => {
    let active = true;
    const repositoryKey = data?.repository?.key || data?.repository?.sourceUrl || data?.repository?.name;
    setHistory([]);
    setHistoryError('');
    getHealthHistory(repositoryKey)
      .then((result) => { if (active) { setHistory(result.history || []); setHistoryError(''); } })
      .catch((error) => { if (active) setHistoryError(error.message); });
    return () => { active = false; };
  }, [data?.repository?.key, data?.repository?.sourceUrl, data?.repository?.name, data?.repository?.path]);

  const filteredIssues = useMemo(() => issues.filter((issue) => filter === 'all' || issue.severity === filter), [issues, filter]);
  const reversedHistory = [...history].reverse();
  const estimatedScore = calculateEstimate(
    baseComplexity * (1 - complexityReduction / 100),
    hasDuplication ? baseDuplication * (1 - duplicationReduction / 100) : null,
    Math.max(0, actionableFindings - findingsResolved),
  );

  return (
    <div className="health-workspace">
      <div className="metrics-grid">
        <div className="metric-card"><div className="metric-label">Measured Health Score</div><div className="metric-val" style={{ color: '#10b981' }}>{typeof health?.score === 'number' ? `${health.score}/100` : 'Not available'}</div></div>
        <div className="metric-card"><div className="metric-label">Duplication</div><div className="metric-val">{typeof rawDuplication === 'number' ? `${rawDuplication}%` : 'Not available'}</div></div>
        <div className="metric-card"><div className="metric-label">Test Coverage</div><div className="metric-val" style={{ fontSize: '18px', color: '#94a3b8' }}>{health?.metrics?.testCoverage ?? 'Not available'}</div></div>
        <div className="metric-card"><div className="metric-label">Technical Debt Markers</div><div className="metric-val">{(health?.metrics?.todoCount || 0) + (health?.metrics?.fixmeCount || 0)}</div></div>
      </div>

      <div className="health-severity-summary">
        <span><i className="severity-dot critical" /> Critical: {health?.metrics?.severityCounts?.critical ?? issues.filter((issue) => issue.severity === 'critical').length}</span>
        <span><i className="severity-dot warning" /> Warning: {health?.metrics?.severityCounts?.warning ?? issues.filter((issue) => issue.severity === 'warning').length}</span>
        <span><i className="severity-dot info" /> Informational: {health?.metrics?.severityCounts?.info ?? issues.filter((issue) => issue.severity === 'info').length}</span>
      </div>

      <Card title="Health Score Breakdown">
        {scoreModel.isPartial && <div className="health-partial-note">Partial measurement: duplication data is unavailable and is excluded from the score.</div>}
        <p className="health-explainer">The measured score uses complexity, duplication when measurable, and actionable findings. Repository line count does not reduce the score. Missing measurements are omitted rather than silently treated as zero.</p>
        <div className="health-breakdown-grid">
          <div><span>Base score</span><strong>100</strong></div>
          <div><span>Complexity penalty</span><strong>−{scoreModel.complexityPenalty ?? '—'}</strong></div>
          <div><span>Duplication penalty</span><strong>{hasDuplication ? `−${scoreModel.duplicationPenalty ?? 0}` : 'N/A'}</strong></div>
          <div><span>Finding penalty</span><strong>−{scoreModel.findingPenalty ?? '—'}</strong></div>
        </div>
        <small className="health-formula">{scoreModel.formula || 'Score = 100 − complexity penalty − duplication penalty − actionable finding penalty (clamped to 0–100).'}</small>
      </Card>

      <Card title="Health Score Simulator">
        <div className="simulator-header">
          <div><span className="metric-label">Hypothetical estimated score</span><div className="simulator-score">{estimatedScore}/100</div></div>
          <div className="simulator-delta">{estimatedScore >= (health?.score ?? 0) ? '+' : ''}{(estimatedScore - (health?.score ?? estimatedScore)).toFixed(1)} vs measured</div>
        </div>
        <p className="health-explainer">Explore possible improvements using the same scoring formula. These are estimates only; no source code or measured repository data is changed.</p>
        <div className="simulator-controls">
          <label>Reduce average complexity <strong>{complexityReduction}%</strong><input type="range" min="0" max="100" step="5" value={complexityReduction} onChange={(event) => setComplexityReduction(Number(event.target.value))} /></label>
          <label>Reduce duplicated code <strong>{hasDuplication ? `${duplicationReduction}%` : 'Unavailable'}</strong><input type="range" min="0" max="100" step="5" value={duplicationReduction} disabled={!hasDuplication} onChange={(event) => setDuplicationReduction(Number(event.target.value))} /></label>
          <label>Resolve actionable findings <strong>{findingsResolved} / {actionableFindings}</strong><input type="range" min="0" max={actionableFindings} step="1" value={findingsResolved} onChange={(event) => setFindingsResolved(Number(event.target.value))} disabled={!actionableFindings} /></label>
        </div>
        <button className="simulator-reset" onClick={() => { setComplexityReduction(0); setDuplicationReduction(0); setFindingsResolved(0); }}>Reset simulation</button>
      </Card>

      <Card title="Health Score History">
        <p className="health-explainer">Snapshots are retained in this backend session for the same repository. History resets when the backend process restarts; no past scans are fabricated.</p>
        {historyError && <p className="search-empty">{historyError}</p>}
        {history.length ? <div className="health-table-wrap"><table className="data-table"><thead><tr><th>Scan time</th><th>Score</th><th>Δ Score</th><th>Duplication</th><th>Complexity</th><th>Model</th></tr></thead><tbody>
          {reversedHistory.map((snapshot, index) => {
            const previous = history[history.length - index - 2];
            const comparable = previous && previous.scoreModelVersion === snapshot.scoreModelVersion && typeof previous.score === 'number' && typeof snapshot.score === 'number';
            const delta = comparable ? snapshot.score - previous.score : null;
            return <tr key={`${snapshot.scannedAt}:${index}`}><td>{new Date(snapshot.scannedAt).toLocaleString()}</td><td>{snapshot.score ?? '—'}</td><td>{delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`}</td><td>{typeof snapshot.metrics?.duplication === 'number' ? `${snapshot.metrics.duplication}%` : 'Not available'}</td><td>{snapshot.metrics?.averageComplexity ?? '—'}</td><td>{snapshot.scoreModelVersion}</td></tr>;
          })}
        </tbody></table></div> : <p className="search-empty">No previous scans are available for this repository in the current backend session.</p>}
      </Card>

      <Card title="Highest Complexity Files">
        <p className="health-explainer">File-level complexity is a static approximation. It is not a per-function measurement.</p>
        {(data?.complexity?.highestComplexityFiles || []).length ? <div className="unresolved-import-list">{data.complexity.highestComplexityFiles.map((item) => <div key={item.file}><strong>{item.file}</strong><code>Complexity {item.complexity} · {item.risk}</code><small>Open the file to inspect the code contributing to this file-level estimate.</small><button className="health-inspect-link" onClick={() => onInspect?.(item.file, 1)}>Inspect source</button></div>)}</div> : <p className="search-empty">No complexity data is available.</p>}
      </Card>

      <Card title={`Duplicate Code Blocks (${data?.duplication?.duplicatedBlocks?.length || 0})`}>
        <p className="health-explainer">{health?.metrics?.duplicationMethod || 'Duplication is based on normalized source blocks. Generated/vendor files are excluded where detected.'}</p>
        {(data?.duplication?.duplicatedBlocks || []).length ? <div className="unresolved-import-list">{data.duplication.duplicatedBlocks.map((block, index) => <div key={index}><strong>Repeated block {index + 1}</strong>{block.occurrences.map((occurrence, occurrenceIndex) => <button key={occurrenceIndex} className="health-inspect-link" onClick={() => onInspect?.(occurrence.file, occurrence.line)}>{occurrence.file}:{occurrence.line}–{occurrence.endLine}</button>)}</div>)}</div> : <p className="search-empty">No meaningful duplicated blocks were detected.</p>}
      </Card>

      <Card title="Suggested Improvements">
        <p className="health-explainer">Suggestions are mapped from detected findings; they are not automatic code changes.</p>
        {issues.length ? <div className="unresolved-import-list">{issues.filter((issue) => issue.metric !== 'debt' || issue.severity !== 'info').slice(0, 20).map((issue, index) => {
          const suggestion = issue.metric === 'complexity'
            ? 'Consider extracting smaller functions and simplifying conditional branches.'
            : issue.metric === 'file_size'
              ? 'Review whether this file has multiple responsibilities; split only along cohesive boundaries.'
              : issue.metric === 'debt'
                ? 'Review this FIXME marker, resolve it, or replace it with a tracked and explained follow-up.'
                : 'Review this finding and verify whether a focused refactor is warranted.';
          return <div key={`${issue.file}:${issue.line}:${index}`}><strong>{issue.message}</strong><small>{suggestion}</small><button className="health-inspect-link" onClick={() => onInspect?.(issue.file, issue.line)}>Inspect {issue.file}:{issue.line}</button></div>;
        })}</div> : <p className="search-empty">No actionable findings currently need a suggested improvement.</p>}
      </Card>

      <Card title={`Discovered Code Health Issues (${issues.length})`}>
        <div className="health-filter-row">{['all', 'critical', 'warning', 'info'].map((severity) => <button key={severity} onClick={() => setFilter(severity)} className={`health-filter ${filter === severity ? 'active' : ''}`}>{severity.toUpperCase()}</button>)}</div>
        <div className="health-table-wrap"><table className="data-table"><thead><tr><th>Severity</th><th>Message</th><th>File</th><th>Line</th><th>Metric</th></tr></thead><tbody>
          {filteredIssues.map((issue, index) => <tr key={`${issue.file}:${issue.line}:${index}`}><td><Badge type={issue.severity === 'info' ? 'neutral' : issue.severity}>{issue.severity}</Badge></td><td>{issue.message}</td><td className="health-file-cell"><button className="health-inspect-link" onClick={() => onInspect?.(issue.file, issue.line)}>{issue.file}</button></td><td>{issue.line ?? '—'}</td><td>{issue.metric}</td></tr>)}
          {!filteredIssues.length && <tr><td colSpan="5" className="search-empty">No findings in this category.</td></tr>}
        </tbody></table></div>
      </Card>
    </div>
  );
}
