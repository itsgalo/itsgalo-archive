// Projects: list on the left (file order = record number), form on the right.

import { h } from '../../../js/core/dom.js';
import { btn, group, row, text, number, csv, paragraphs, keyValue, links } from '../forms.js';
import { slug } from '../store.js';
import { mediaEditor, batchButton } from '../media.js';

let selected = 0;
const autoId = new WeakSet(); // projects whose id still follows the title

export default function projectsView(store) {
  const list = store.data.projects.projects;
  const el = h('div', 'split');
  const side = h('aside', 'side');
  const sideList = h('div', 'side-list');
  const form = h('div', 'pane');

  const touch = () => { store.touch('projects'); drawList(); drawHead(); };
  const uniqueId = (base, self) => {
    let id = base || 'untitled', n = 1;
    while (list.some(p => p !== self && p.id === id)) id = `${base || 'untitled'}-${++n}`;
    return id;
  };

  // --- list --------------------------------------------------------------
  function drawList() {
    sideList.replaceChildren(...list.map((p, i) => {
      const item = btn('', () => { selected = i; drawList(); drawForm(); }, 'side-item');
      item.classList.toggle('is-selected', i === selected);
      item.append(
        h('span', 'side-no', String(i + 1).padStart(3, '0')),
        h('span', 'side-title', p.title || '(untitled)'),
        h('span', 'side-meta', `${p.year ?? '—'} · ${(p.media || []).length}`),
      );
      return item;
    }));
    count.textContent = `${list.length}`;
  }

  const count = h('span', 'side-count');
  const sideHead = h('div', 'side-head');
  sideHead.append(h('span', null, 'Projects'), count, btn('New', () => {
    const p = { id: '', title: '', year: new Date().getFullYear(), tags: [], summary: '', media: [] };
    p.id = uniqueId('untitled', p);
    autoId.add(p);
    list.push(p);
    selected = list.length - 1;
    touch();
    drawForm();
    form.querySelector('[data-field="title"] input')?.focus();
  }, 'btn'));

  const sideFoot = h('div', 'side-foot');
  sideFoot.append(btn('Check media files', async () => {
    const missing = [];
    for (const p of list) {
      for (const m of p.media || []) {
        for (const src of [m.src, m.poster].filter(Boolean)) if (!(await store.exists(src))) missing.push(`${p.id}: ${src}`);
      }
    }
    store.log(missing.length ? `missing ${missing.length}: ${missing.join(' · ')}` : 'all media files found');
  }, 'btn'));
  side.append(sideHead, sideList, sideFoot);

  // --- form --------------------------------------------------------------
  const head = h('div', 'pane-head');
  function drawHead() {
    const p = list[selected];
    head.replaceChildren();
    if (!p) return;
    const title = h('h1', 'pane-title');
    title.append(h('span', 'pane-no', `No. ${String(selected + 1).padStart(3, '0')}`), document.createTextNode(p.title || '(untitled)'));
    const move = d => {
      const j = selected + d;
      if (j < 0 || j >= list.length) return;
      [list[selected], list[j]] = [list[j], list[selected]];
      selected = j;
      touch();
    };
    const actions = h('div', 'pane-actions');
    actions.append(
      btn('Move up', () => move(-1), 'btn'),
      btn('Move down', () => move(1), 'btn'),
      btn('Duplicate', () => {
        const copy = JSON.parse(JSON.stringify(p));
        copy.id = uniqueId(`${p.id}-copy`, copy);
        copy.title = `${p.title || ''} (copy)`;
        list.splice(selected + 1, 0, copy);
        selected++;
        touch();
        drawForm();
      }, 'btn'),
      btn('Delete', () => {
        if (!confirm(`Delete "${p.title || p.id}"? Media files on disk are not removed.`)) return;
        list.splice(selected, 1);
        selected = Math.max(0, Math.min(selected, list.length - 1));
        touch();
        drawForm();
      }, 'btn btn-danger'),
    );
    head.append(title, actions);
  }

  function drawForm() {
    const p = list[selected];
    drawHead();
    if (!p) {
      form.replaceChildren(head, h('p', 'f-empty', 'No projects yet. Use New to add one.'));
      return;
    }
    p.fields ??= {};

    const idHint = h('div', 'f-hint');
    const checkId = () => {
      const dup = list.some(q => q !== p && q.id === p.id);
      const bad = p.id && !/^[a-z0-9][a-z0-9_-]*$/.test(p.id);
      idHint.textContent = !p.id ? 'Required.' : dup ? 'Already used by another project.'
        : bad ? 'Use lowercase letters, digits, - or _.' : `Link: #p=${p.id}   ·   Media folder: media/${p.id}/`;
      idHint.classList.toggle('is-error', !p.id || dup || bad);
    };
    const id = text(p, 'id', () => { autoId.delete(p); checkId(); touch(); });
    const title = text(p, 'title', () => {
      if (autoId.has(p)) {
        p.id = uniqueId(slug(p.title), p);
        id.value = p.id;
        checkId();
      }
      touch();
    });
    checkId();

    const titleRow = row('Title', title);
    titleRow.dataset.field = 'title';

    form.replaceChildren(
      head,
      group('Record',
        titleRow,
        row('Id', id, idHint),
        row('Year', number(p, 'year', touch)),
        row('Tags', csv(p, 'tags', touch), 'Used by the Filter node.'),
        row('Summary', text(p, 'summary', touch, { placeholder: 'One line, shown first in the Console' })),
        row('Body', paragraphs(p, 'body', touch)),
      ),
      group('Fields', h('p', 'f-note', 'Extra rows for the record table (Medium, Location, Status…).'), keyValue(p, 'fields', touch)),
      group('Links', links(p, 'links', touch)),
      group('Media', h('p', 'f-note', 'In order. The Media node steps through these; the first is shown by default.'),
        batchButton({
          list: (p.media ??= []),
          folder: () => `media/${p.id || 'untitled'}`,
          store,
          onDone: () => { const y = form.scrollTop; touch(); drawForm(); form.scrollTop = y; },
        }),
        mediaEditor({ list: p.media, folder: () => `media/${p.id || 'untitled'}`, store, onChange: touch })),
    );
  }

  selected = Math.min(selected, Math.max(0, list.length - 1));
  drawList();
  drawForm();
  el.append(side, form);
  return el;
}
