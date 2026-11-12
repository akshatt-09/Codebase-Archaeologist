export async function getHealth() {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Backend healthcheck unreachable');
  return res.json();
}

export async function getSummary() {
  const res = await fetch('/api/summary');
  if (!res.ok) throw new Error('Failed to retrieve summary state');
  return res.json();
}

export async function getFileContent(filePath, line = 1, windowSize = 400) {
  const params = new URLSearchParams({ path: filePath, line: String(line), window: String(windowSize) });
  const res = await fetch(`/api/file-content?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to fetch source content');
  }
  return res.json();
}

export async function analyzeRepository(formData) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Repository analysis failed');
  }
  return res.json();
}
export async function searchRepository(query) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Repository search failed');
  }
  return res.json();
}

export async function getHealthHistory(repositoryKey) {
  const params = new URLSearchParams();
  if (repositoryKey) params.set('repository', repositoryKey);
  const res = await fetch(`/api/health-history?${params.toString()}`);
  if (!res.ok) throw new Error('Unable to load health history');
  return res.json();
}
