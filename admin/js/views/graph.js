// Graph: the default graph is best arranged on the site itself (Ctrl/Cmd+S there
// downloads graph.json). Here it can be imported, checked, and edited as text.

import { h } from '../../../js/core/dom.js';
import { registry } from '../../../js/nodes/registry.js';
import { btn, group } from '../forms.js';

export function checkGraph(g) {
  const errors = [], warnings = [];
  if (!g || !Array.isArray(g.nodes)) return { errors: ['"nodes" must be an array'], warnings };
  if (g.links && !Array.isArray(g.links)) errors.push('"links" must be an array');
  const byId = new Map();
  for (const n of g.nodes) {
    if (!n.id) errors.push('a node has no id');
    else if (byId.has(n.id)) errors.push(`duplicate node id ${n.id}`);
    else byId.set(n.id, n);
    if (!registry[n.type]) errors.push(`${n.id}: unknown type "${n.type}"`);
  }
  for (const l of g.links || []) {
    const [a, as, b, bs] = l;
    const A = byId.get(a), B = byId.get(b);
    if (!A || !B) { errors.push(`link ${l.join(' ')}: node not found`); continue; }
    if (registry[A.type] && !registry[A.type].outputs?.some(s => s.name === as)) errors.push(`link ${l.join(' ')}: ${a} has no output "${as}"`);
    if (registry[B.type] && !registry[B.type].inputs?.some(s => s.name === bs)) errors.push(`link ${l.join(' ')}: ${b} has no input "${bs}"`);
  }
  for (const t of ['projector', 'console']) if (!g.nodes.some(n => n.type === t)) warnings.push(`no ${registry[t].label} node`);
  return { errors, warnings };
}

export default function graphView(store) {
  const el = h('div', 'pane is-solo');
  const head = h('div', 'pane-head');
  head.append(h('h1', 'pane-title', 'Graph'), h('span', 'pane-path', store.path('graph')));

  const table = h('div', 'g-table');
  const drawTable = () => {
    const g = store.data.graph;
    const nodes = g.nodes || [];
    table.replaceChildren(...nodes.map(n => {
      const r = h('div', 'g-row');
      const into = (g.links || []).filter(l => l[2] === n.id).map(l => `${l[0]}.${l[1]}→${l[3]}`).join('  ');
      r.append(h('span', 'g-id', n.id), h('span', null, registry[n.type]?.label || `? ${n.type}`),
        h('span', 'g-params', Object.entries(n.params || {}).map(([k, v]) => `${k}=${v}`).join(' ')),
        h('span', 'g-links', into));
      return r;
    }));
    if (!nodes.length) table.append(h('div', 'f-empty', 'Empty graph.'));
  };

  const area = h('textarea', 'f-input f-area f-code');
  area.rows = 18;
  area.spellcheck = false;
  const report = h('div', 'g-report');
  const showReport = ({ errors, warnings }, ok) => {
    report.replaceChildren(
      ...errors.map(e => h('div', 'is-error', e)),
      ...warnings.map(w => h('div', 'is-warn', w)),
      ...(!errors.length && !warnings.length ? [h('div', null, ok)] : []),
    );
  };
  const fill = () => { area.value = JSON.stringify(store.data.graph, null, 2); drawTable(); };

  const apply = (json, label) => {
    let g;
    try { g = JSON.parse(json); } catch (e) { showReport({ errors: [`not valid JSON: ${e.message}`], warnings: [] }); return; }
    const result = checkGraph(g);
    if (result.errors.length) { showReport(result); return; }
    store.data.graph = g;
    store.touch('graph');
    fill();
    showReport(result, `${label}: ${g.nodes.length} nodes, ${(g.links || []).length} links`);
  };

  const fileInput = Object.assign(h('input'), { type: 'file', accept: '.json,application/json', hidden: true });
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files[0];
    if (f) apply(await f.text(), `imported ${f.name}`);
    fileInput.value = '';
  });

  const actions = h('div', 'pane-actions');
  actions.append(
    btn('Import graph.json…', () => fileInput.click(), 'btn'),
    btn('Apply text', () => apply(area.value, 'applied'), 'btn'),
    btn('Revert text', () => { fill(); showReport(checkGraph(store.data.graph), 'reverted'); }, 'btn'),
    fileInput,
  );

  fill();
  showReport(checkGraph(store.data.graph), 'no problems found');
  el.append(
    head,
    group('How to edit',
      h('p', 'f-note', 'Arrange the graph on the site, press Ctrl/Cmd+S there to download graph.json, then import it here and Save. Or edit the JSON below and Apply.'),
      actions, report),
    group('Nodes', table),
    group('JSON', area),
  );
  return el;
}
