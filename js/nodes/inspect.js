// Pass-through that lists whatever flows through it. The output takes on the
// type of whatever is plugged into the input (see Graph.outType).
import { h } from '../core/dom.js';
import { TYPES } from '../graph/types.js';

function kindOf(v) {
  if (v == null) return 'empty';
  if (Array.isArray(v)) return 'collection';
  if (typeof v === 'number') return 'number';
  if (typeof v === 'string') return 'text';
  return v.item ? 'media' : 'project';
}

// Keys listed first, in this order; the rest follow as they appear.
const FIRST = ['no', 'title', 'year', 'tags', 'summary', 'id'];

// Nested object -> [["media[0].src", "…"], …]
function flatten(obj, prefix = '', out = []) {
  const keys = Object.keys(obj).sort((a, b) => rank(a) - rank(b));
  for (const k of keys) {
    const v = obj[k];
    const key = prefix ? `${prefix}.${k}` : k;
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    if (Array.isArray(v)) {
      if (v.every(x => typeof x !== 'object')) out.push([key, v.join(' / ')]);
      else v.forEach((x, i) => flatten(x, `${key}[${i}]`, out));
    } else if (typeof v === 'object') flatten(v, key, out);
    else out.push([key, String(v)]);
  }
  return out;
}

function rank(k) {
  const i = FIRST.indexOf(k);
  return i < 0 ? FIRST.length : i;
}

function rows(v) {
  switch (kindOf(v)) {
    case 'collection': return v.map(p => [p.no, `${p.title} · ${p.year ?? ''}`]);
    case 'media': return [
      ['record', v.project.title],
      ['media', `${v.index + 1} of ${v.count}`],
      ...flatten(v.item),
    ];
    case 'project': return flatten(v);
    case 'empty': return [];
    default: return [['value', String(v)]];
  }
}

// Cheap signature so the list only re-renders when the data actually changes.
function sig(v) {
  switch (kindOf(v)) {
    case 'collection': return 'c:' + v.map(p => p.id).join();
    case 'media': return `m:${v.project.id}:${v.index}`;
    case 'project': return 'p:' + v.id;
    default: return 'v:' + String(v);
  }
}

export default {
  type: 'inspect',
  label: 'Inspect',
  group: 'Utility',
  inputs: [{ name: 'data', label: 'Input', type: TYPES }],
  outputs: [{ name: 'data', label: 'Output', type: 'any', from: 'data' }],
  size: { w: 256, h: 160, minW: 176, minH: 44 },
  evaluate({ in: i, state }) {
    state.value = i.data ?? null;
    return { data: i.data ?? null };
  },
  view(node) {
    const list = h('div', 'inspect-list');
    list.dataset.scroll = '';
    let last = null;
    return {
      el: list,
      update() {
        const s = sig(node.state.value);
        if (s === last) return;
        last = s;
        const r = rows(node.state.value);
        if (!r.length) { list.replaceChildren(h('div', 'inspect-empty', 'No input.')); return; }
        list.replaceChildren(...r.map(([k, val]) => {
          const row = h('div', 'inspect-row');
          const v = h('span', 'inspect-v', val);
          v.title = val;
          row.append(h('span', 'inspect-k', k), v);
          return row;
        }));
      },
    };
  },
  readout: n => {
    const v = n.state.value, k = kindOf(v);
    return k === 'collection' ? `collection · ${v.length} items` : k;
  },
};
