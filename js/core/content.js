// Normalizes projects.json into the read-only context every node receives.
export function buildContext(content, info = null) {
  const projects = (content.projects || []).map((p, i) => ({
    ...p,
    no: String(i + 1).padStart(3, '0'),
    tags: p.tags || [],
    media: p.media || [],
  }));
  const tags = [...new Set(projects.flatMap(p => p.tags))].sort();
  const years = [...new Set(projects.map(p => p.year).filter(y => y != null))].sort((a, b) => a - b);
  // info.json uses the same keys as a project, so every renderer can show it.
  const bio = info && { id: 'info', no: '000', tags: [], media: [], ...info };
  return { projects, tags, years, info: bio, byId: new Map(projects.map(p => [p.id, p])) };
}
