import React, { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpLeft, Boxes, Network, X } from 'lucide-react';
import { CodeViewer } from '../common/CodeViewer';

export function ArchitectureGraph({ architecture, files = [], onSelectFile }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [moduleFilter, setModuleFilter] = useState('');
  const [fileFilter, setFileFilter] = useState('');
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState('detailed');
  const modules = architecture?.modules || [];
  const moduleEdges = architecture?.crossModuleEdges || [];
  const filteredModules = modules.filter((module) => `${module.name} ${module.languages.join(' ')}`.toLowerCase().includes(moduleFilter.toLowerCase()));
  const visibleModules = filteredModules.slice(0, 100);
  const visibleModuleNames = visibleModules.map((module) => module.name);
  const visibleModuleEdges = moduleEdges.filter((edge) => visibleModuleNames.includes(edge.from) && visibleModuleNames.includes(edge.to));
  const allEdges = architecture?.fileEdges || [];
  const cycles = architecture?.circularDependencies || [];

  const fileMap = useMemo(() => new Map(files.map((file) => [file.path, file])), [files]);
  const moduleFileEdges = useMemo(() => {
    if (!selectedModule) return [];
    return allEdges.filter((edge) => selectedModule.files.includes(edge.from) && selectedModule.files.includes(edge.to));
  }, [allEdges, selectedModule]);
  const filteredFiles = selectedModule?.files.filter((path) => path.toLowerCase().includes(fileFilter.toLowerCase())) || [];
  const visibleFiles = filteredFiles.slice(0, 250);
  const visibleFileEdges = moduleFileEdges.filter((edge) => visibleFiles.includes(edge.from) && visibleFiles.includes(edge.to));
  const selectedIncoming = selectedFile ? moduleFileEdges.filter((edge) => edge.to === selectedFile) : [];
  const selectedOutgoing = selectedFile ? moduleFileEdges.filter((edge) => edge.from === selectedFile) : [];
  const selectedFileRecord = selectedFile ? fileMap.get(selectedFile) : null;
  const moduleNodeWidth = 168;
  const moduleNodeHeight = 66;
  const modulePositions = visibleModules.map((module, index) => ({
    ...module,
    x: 24 + (index % 3) * 236,
    y: 24 + Math.floor(index / 3) * 118,
  }));
  const modulePositionMap = new Map(modulePositions.map((module) => [module.name, module]));
  const moduleGraphWidth = 24 + Math.max(1, Math.min(3, visibleModules.length)) * 236;
  const moduleGraphHeight = 24 + Math.ceil(Math.max(1, visibleModules.length) / 3) * 118;
  const fileNodeWidth = 260;
  const filePositions = visibleFiles.map((path, index) => ({
    path,
    x: 20 + (index % 2) * 320,
    y: 20 + Math.floor(index / 2) * 82,
  })) || [];
  const filePositionMap = new Map(filePositions.map((file) => [file.path, file]));
  const fileGraphWidth = 600;
  const fileGraphHeight = Math.max(100, 40 + Math.ceil(filePositions.length / 2) * 82);

  const openModule = (module) => {
    setSelectedModule(module);
    setSelectedFile(null);
  };
  const chooseFile = (path) => {
    setSelectedFile(path);
    if (onSelectFile) onSelectFile(path);
  };

  return (
    <div className="architecture-workspace">
      <section className="architecture-main">
        <div className="architecture-section-heading">
          <div><Network size={17} /><strong>Module-level architecture</strong></div>
          <span>{visibleModules.length} of {filteredModules.length} filtered modules · {moduleEdges.length} cross-module relationships</span>
        </div>
        <div className="architecture-controls">
          <input value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} placeholder="Filter modules or languages…" aria-label="Filter modules" />
          <label>Zoom {zoom}%<input type="range" min="70" max="150" step="10" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
          <select value={viewMode} onChange={(event) => setViewMode(event.target.value)} aria-label="Architecture detail level"><option value="simplified">Simplified</option><option value="detailed">Detailed</option></select>
        </div>
        <div className="architecture-legend"><span><i className="legend-solid" /> Static import</span><span><i className="legend-dashed" /> Dynamic import included</span></div>
        <div className="architecture-diagram-scroll">
          <svg className="architecture-diagram" style={{ width: `${zoom}%`, minWidth: `${520 * zoom / 100}px` }} viewBox={`0 0 ${moduleGraphWidth} ${moduleGraphHeight}`} role="group" aria-label="Module dependency diagram">
            <defs><marker id="module-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#38bdf8" /></marker></defs>
            {visibleModuleEdges.map((edge, index) => {
              const from = modulePositionMap.get(edge.from); const to = modulePositionMap.get(edge.to);
              if (!from || !to) return null;
              const x1 = from.x + moduleNodeWidth; const y1 = from.y + moduleNodeHeight / 2;
              const x2 = to.x; const y2 = to.y + moduleNodeHeight / 2;
              const midX = (x1 + x2) / 2;
              const active = selectedModule && (edge.from === selectedModule.name || edge.to === selectedModule.name);
              return <path key={`${edge.from}:${edge.to}:${index}`} d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`} fill="none" stroke="#38bdf8" strokeOpacity={selectedModule ? (active ? 1 : .12) : .65} strokeWidth={active ? 2.8 : 1.8} strokeDasharray={edge.dynamicCount ? '5 4' : undefined} markerEnd="url(#module-arrow)" />;
            })}
            {modulePositions.map((module) => <g key={module.name} role="button" tabIndex="0" aria-label={`Inspect module ${module.name}`} onClick={() => openModule(module)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') openModule(module); }} style={{ cursor: 'pointer' }}>
              <rect x={module.x} y={module.y} width={moduleNodeWidth} height={moduleNodeHeight} rx="8" fill={selectedModule?.name === module.name ? '#164e63' : '#17212c'} stroke={selectedModule?.name === module.name ? '#38bdf8' : '#334155'} strokeWidth="1.4" />
              <text x={module.x + 12} y={module.y + 25} fill="#f1f5f9" fontSize="12" fontWeight="600">{module.name.length > 21 ? `${module.name.slice(0, 19)}…` : module.name}</text>
              {viewMode === 'detailed' && <text x={module.x + 12} y={module.y + 46} fill="#94a3b8" fontSize="10">{module.files.length} files · In {module.incomingCount} / Out {module.outgoingCount}</text>}
            </g>)}
          </svg>
        </div>
        {viewMode === 'detailed' && <div className="module-grid">
          {visibleModules.map((module) => {
            const selected = selectedModule?.name === module.name;
            const connections = moduleEdges.filter((edge) => edge.from === module.name || edge.to === module.name);
            return (
              <button className={`module-node ${selected ? 'selected' : ''}`} key={module.name} onClick={() => openModule(module)}>
                <span className="module-node-top"><Boxes size={16} /> <small>{module.files.length} files</small></span>
                <strong>{module.name}</strong>
                <span className="module-languages">{module.languages.join(' · ') || 'Unknown language'}</span>
                <span className="module-counts">In {module.incomingCount} <i /> Out {module.outgoingCount}</span>
                <span className="module-connection-count">{connections.length} linked module(s)</span>
              </button>
            );
          })}
        </div>}
        <div className="architecture-edges">
          <strong>Detected module dependencies</strong>
          {visibleModuleEdges.length ? visibleModuleEdges.map((edge, index) => (
            <div className="architecture-edge-row" key={`${edge.from}:${edge.to}:${index}`}>
              <span>{edge.from}</span><ArrowDownRight size={15} /><span>{edge.to}</span><small>{edge.count || 1} import(s) · {edge.dynamicCount || 0} dynamic</small>
            </div>
          )) : <p className="search-empty">No cross-module imports were resolved in this repository.</p>}
          {cycles.length > 0 && <div className="cycle-warning"><strong>{cycles.length} circular dependency cycle(s) detected</strong>{cycles.slice(0, 5).map((cycle, index) => <small key={index}>{cycle.join(' ↔ ')}</small>)}</div>}
        </div>
      </section>

      <aside className="module-inspector card">
        <div className="module-inspector-heading">
          <div className="card-title">{selectedModule ? `Module: ${selectedModule.name}` : 'Module Inspector'}</div>
          {selectedModule && <button className="icon-button" aria-label="Close module inspector" onClick={() => { setSelectedModule(null); setSelectedFile(null); }}><X size={16} /></button>}
        </div>
        {!selectedModule ? (
          <p className="search-empty">Select a module to open its internal file dependency diagram.</p>
        ) : (
          <>
            <p className="module-description">{selectedModule.description || `Contains ${selectedModule.files.length} source and project file(s).`}</p>
            <div className="file-graph-summary">Showing {visibleFiles.length} of {filteredFiles.length} filtered files · {visibleFileEdges.length} resolved internal imports{filteredFiles.length > 250 ? ' · Narrow the filter to explore the remaining files' : ''}</div>
            <div className="architecture-controls file-architecture-controls">
              <input value={fileFilter} onChange={(event) => setFileFilter(event.target.value)} placeholder="Filter files in this module…" aria-label="Filter files" />
            </div>
            <div className="architecture-legend"><span><i className="legend-solid" /> Static import</span><span><i className="legend-dashed" /> Dynamic import</span></div>
            <div className="file-graph-diagram-scroll">
              <svg className="file-graph-diagram" style={{ width: `${zoom}%`, minWidth: `${600 * zoom / 100}px` }} viewBox={`0 0 ${fileGraphWidth} ${fileGraphHeight}`} role="group" aria-label={`File dependency diagram for ${selectedModule.name}`}>
                <defs><marker id="file-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#38bdf8" /></marker></defs>
                {visibleFileEdges.map((edge, index) => {
                  const from = filePositionMap.get(edge.from); const to = filePositionMap.get(edge.to);
                  if (!from || !to) return null;
                  const x1 = from.x + fileNodeWidth / 2; const y1 = from.y + 48;
                  const x2 = to.x + fileNodeWidth / 2; const y2 = to.y;
                  const midY = (y1 + y2) / 2;
                  const active = selectedFile && (edge.from === selectedFile || edge.to === selectedFile);
                  return <path key={`file-edge-${index}`} d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`} fill="none" stroke="#38bdf8" strokeOpacity={selectedFile ? (active ? 1 : .12) : .7} strokeWidth={active ? 2.8 : 1.6} strokeDasharray={edge.dynamic ? '5 4' : undefined} markerEnd="url(#file-arrow)" />;
                })}
                {filePositions.map((fileNode) => {
                  const file = fileMap.get(fileNode.path);
                  const incoming = moduleFileEdges.filter((edge) => edge.to === fileNode.path).length;
                  const outgoing = moduleFileEdges.filter((edge) => edge.from === fileNode.path).length;
                  const selected = selectedFile === fileNode.path;
                  const label = fileNode.path.split('/').pop();
                  return <g key={fileNode.path} role="button" tabIndex="0" aria-label={`Inspect ${fileNode.path}`} onClick={() => chooseFile(fileNode.path)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') chooseFile(fileNode.path); }} style={{ cursor: 'pointer' }}>
                    <rect x={fileNode.x} y={fileNode.y} width={fileNodeWidth} height="48" rx="7" fill={selected ? '#164e63' : '#111b25'} stroke={selected ? '#38bdf8' : '#334155'} />
                    <text x={fileNode.x + 10} y={fileNode.y + 19} fill="#f1f5f9" fontSize="10" fontWeight="600">{label.length > 34 ? `${label.slice(0, 32)}…` : label}</text>
                    <text x={fileNode.x + 10} y={fileNode.y + 35} fill="#94a3b8" fontSize="9">{file?.language || 'File'} · In {incoming} / Out {outgoing}</text>
                  </g>;
                })}
              </svg>
            </div>
            {selectedFile && (
              <div className="file-dependency-inspector">
                <strong className="selected-file-path">{selectedFile}</strong>
                <p>{selectedFileRecord?.language || 'Source'} file · {selectedFileRecord?.lines ?? '—'} lines</p>
                <div className="file-role-summary"><strong>Detected symbols</strong><span>{selectedFileRecord?.symbols?.length ? selectedFileRecord.symbols.map((symbol) => `${symbol.kind}: ${symbol.name}`).join(' · ') : 'No top-level symbols detected by the parser.'}</span></div>
                <div className="file-role-summary"><strong>Declared imports</strong><span>{selectedFileRecord?.imports?.length ? selectedFileRecord.imports.map((item) => item.name).join(' · ') : 'No imports detected.'}</span></div>
                <div className="dependency-direction"><ArrowUpLeft size={14} /> Depends on ({selectedOutgoing.length})</div>
                {selectedOutgoing.map((edge, index) => <button key={`out-${index}`} onClick={() => chooseFile(edge.to)}>{edge.to} <small>line {edge.line ?? '—'}</small></button>)}
                <div className="dependency-direction"><ArrowDownRight size={14} /> Used by ({selectedIncoming.length})</div>
                {selectedIncoming.map((edge, index) => <button key={`in-${index}`} onClick={() => chooseFile(edge.from)}>{edge.from} <small>line {edge.line ?? '—'}</small></button>)}
                <div className="architecture-source-preview"><strong>Source preview</strong><CodeViewer filePath={selectedFile} initialLine={1} /></div>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
