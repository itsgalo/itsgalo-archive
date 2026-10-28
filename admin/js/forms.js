// Small form kit. Every control binds directly to a key on an object and calls
// onChange() after writing, so views never have to collect values on save.
// Empty values delete the key rather than storing "".

import { h } from '../../js/core/dom.js';

export function btn(label, onClick, cls = 'btn') {
  const b = h('button', cls, label);
  b.type = 'button';
  b.addEventListener('click', onClick);
  return b;
}

export function group(title, ...children) {
  const g = h('section', 'f-group');
  g.append(h('h2', 'f-legend', title), ...children.filter(Boolean));
  return g;
}

export function row(label, control, hint) {
  const r = h('div', 'f-row');
  r.append(h('span', 'f-label', label), control);
  if (hint) r.append(typeof hint === 'string' ? h('div', 'f-hint', hint) : hint);
  return r;
}

function setOrDelete(obj, key, v) {
  if (v === '' || v == null || (Array.isArray(v) && !v.length)) delete obj[key];
  else obj[key] = v;
}

function bind(el, read, write, onChange, event = 'input') {
  el.value = read();
  el.addEventListener(event, () => { write(el.value); onChange?.(el.value); });
  return el;
}

export function text(obj, key, onChange, { placeholder = '' } = {}) {
  const el = h('input', 'f-input');
  el.type = 'text';
  el.placeholder = placeholder;
  el.spellcheck = false;
  return bind(el, () => obj[key] ?? '', v => setOrDelete(obj, key, v.trim() ? v : ''), onChange);
}

export function number(obj, key, onChange, { placeholder = '' } = {}) {
  const el = h('input', 'f-input is-num');
  el.type = 'number';
  el.placeholder = placeholder;
  return bind(el, () => obj[key] ?? '', v => {
    const n = v.trim() === '' ? '' : Number(v);
    if (n === '' || Number.isFinite(n)) setOrDelete(obj, key, n);
  }, onChange);
}

// "a, b, c" <-> ["a", "b", "c"]
export function csv(obj, key, onChange, opts = {}) {
  const el = h('input', 'f-input');
  el.type = 'text';
  el.placeholder = opts.placeholder || 'comma, separated';
  return bind(el, () => (obj[key] || []).join(', '),
    v => setOrDelete(obj, key, v.split(',').map(s => s.trim()).filter(Boolean)), onChange);
}

// Paragraphs separated by a blank line <-> ["para", "para"]
export function paragraphs(obj, key, onChange, { rows = 6, placeholder = 'Separate paragraphs with a blank line.' } = {}) {
  const el = h('textarea', 'f-input f-area');
  el.rows = rows;
  el.placeholder = placeholder;
  return bind(el, () => [].concat(obj[key] || []).join('\n\n'),
    v => setOrDelete(obj, key, v.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean)), onChange);
}

// options: [[value, label], …]. A value equal to `fallback` is stored as "missing".
export function select(obj, key, options, onChange, { fallback } = {}) {
  const el = h('select', 'f-input f-select');
  for (const [v, label] of options) {
    const o = h('option', null, label);
    o.value = v;
    el.append(o);
  }
  return bind(el, () => obj[key] ?? fallback ?? options[0][0],
    v => (v === fallback ? delete obj[key] : (obj[key] = v)), onChange, 'change');
}

// { "Medium": "Video", … } edited as rows; key order is kept.
export function keyValue(obj, key, onChange, { addLabel = 'Add field' } = {}) {
  const box = h('div', 'kv');
  const rows = Object.entries(obj[key] || {});
  const commit = () => {
    const out = {};
    for (const [k, v] of rows) if (k.trim()) out[k.trim()] = v;
    setOrDelete(obj, key, Object.keys(out).length ? out : '');
    onChange?.();
  };
  const draw = () => {
    box.replaceChildren(...rows.map((pair, i) => {
      const r = h('div', 'kv-row');
      const k = h('input', 'f-input kv-key');
      const v = h('input', 'f-input');
      k.value = pair[0];
      v.value = pair[1];
      k.placeholder = 'Label';
      v.placeholder = 'Value';
      k.addEventListener('input', () => { pair[0] = k.value; commit(); });
      v.addEventListener('input', () => { pair[1] = v.value; commit(); });
      r.append(k, v, btn('×', () => { rows.splice(i, 1); commit(); draw(); }, 'btn btn-icon'));
      return r;
    }), btn(addLabel, () => { rows.push(['', '']); draw(); box.querySelector('.kv-row:last-of-type .kv-key')?.focus(); }, 'btn btn-add'));
  };
  draw();
  return box;
}

// Ordered list of objects with move / remove. render(item, index, redraw) -> element.
export function repeater({ list, render, create, onChange, addLabel = 'Add', empty = 'None.' }) {
  const box = h('div', 'rep');
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    onChange();
    draw();
  };
  const draw = () => {
    const rows = list.map((item, i) => {
      const r = h('div', 'rep-row');
      const ctl = h('div', 'rep-ctl');
      ctl.append(
        h('span', 'rep-no', String(i + 1).padStart(2, '0')),
        btn('↑', () => move(i, -1), 'btn btn-icon'),
        btn('↓', () => move(i, 1), 'btn btn-icon'),
        btn('×', () => { list.splice(i, 1); onChange(); draw(); }, 'btn btn-icon'),
      );
      r.append(ctl, render(item, i, draw));
      return r;
    });
    box.replaceChildren(...(rows.length ? rows : [h('div', 'f-empty', empty)]),
      btn(addLabel, () => { list.push(create()); onChange(); draw(); }, 'btn btn-add'));
  };
  draw();
  return box;
}

// [{ label, href }]
export function links(owner, key, onChange, { addLabel = 'Add link' } = {}) {
  owner[key] ??= [];
  return repeater({
    list: owner[key],
    create: () => ({ label: '', href: '' }),
    onChange,
    addLabel,
    render(item) {
      const r = h('div', 'link-row');
      r.append(text(item, 'label', onChange, { placeholder: 'Label' }),
        text(item, 'href', onChange, { placeholder: 'https://… or mailto:…' }));
      return r;
    },
  });
}
