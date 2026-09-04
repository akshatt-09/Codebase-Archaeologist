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

export async function getFileContent(filePath) {
  const res = await fetch(`/api/file-content?path=${encodeURIComponent(filePath)}`);
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