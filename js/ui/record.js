// Shared renderers for a project record. Used by the Console and the mobile info panel.

import { h } from '../core/dom.js';

export function recordTable(p, media) {
  const dl = h('dl', 'record-table');
  const row = (label, value, cls) => {
    if (value == null || value === '') return;
    const dd = h('dd', cls, String(value));
    dl.append(h('dt', null, label), dd);
  };
  //row('No.', p.no);
  row('Title', p.title, 'is-title');
  row('Year', p.year, 'is-title');
  row('Tags', p.tags.join(', '), 'is-title');
  for (const [k, v] of Object.entries(p.fields || {})) row(k, v, 'is-title');
  if (media) {
    const parts = [`${media.index + 1} of ${media.count}`, media.item.type, media.item.caption].filter(Boolean);
    row('Media', parts.join(' · '), 'is-title');
  }
  return dl;
}

export function recordText(p) {
  const box = h('div', 'record-text');
  if (p.summary) box.append(h('p', 'record-summary', p.summary));
  for (const para of [].concat(p.body || [])) box.append(h('p', null, para));
  return box;
}

export function recordLinks(links = []) {
  const ul = h('ul', 'record-links');
  for (const { label, href } of links) {
    const a = h('a', null, label || href);
    a.href = href;
    if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    const li = h('li');
    li.append(a);
    ul.append(li);
  }
  return links.length ? ul : null;
}
