// Floating text panel. Receives whatever reaches the Console node:
// a media item (record + media row), a record, plain text, or nothing.
// Draggable by its header; collapsible; keeps a short event log.

import { h } from '../core/dom.js';
import { recordTable, recordText, recordLinks } from './record.js';

const LOG_LINES = 4;

export class ConsolePanel {
  constructor(root, { site }) {
    this.root = root;
    this.site = site;
    this.key = null;
    root.classList.add('console');

    const head = this.head = h('div', 'console-head');
    this.meta = h('span', 'console-meta');
    const collapse = h('button', 'console-btn', '–');
    collapse.type = 'button';
    collapse.title = 'Collapse';
    collapse.addEventListener('click', () => {
      const c = root.classList.toggle('is-collapsed');
      collapse.textContent = c ? '+' : '–';
    });
    head.append(h('span', 'console-title', 'Console'), this.meta, collapse);

    this.view = h('div', 'console-view');
    this.logEl = h('div', 'console-log');
    const body = h('div', 'console-body');
    body.append(this.view, this.logEl);
    root.append(head, body);

    this.enableDrag();
  }

  static keyOf(d) {
    if (d == null) return 'null';
    if (typeof d === 'string') return `t:${d}`;
    if (d.item) return `m:${d.project.id}:${d.index}`;
    return `p:${d.id}`;
  }

  show(data) {
    const key = ConsolePanel.keyOf(data);
    if (key === this.key) return;
    this.key = key;
    this.view.scrollTop = 0;

    if (data == null) {
      this.meta.textContent = '';
      this.view.replaceChildren(h('p', 'console-empty', 'No input.'));
    } else if (typeof data === 'string') {
      this.meta.textContent = 'text';
      this.view.replaceChildren(h('pre', 'console-pre', data));
    } else {
      const project = data.item ? data.project : data;
      const media = data.item ? data : null;
      this.meta.textContent = `No. ${project.no}`;
      this.view.replaceChildren(
        ...[recordTable(project, media), recordText(project), recordLinks(project.links)].filter(Boolean),
      );
    }
  }

  about() {
    const { site } = this;
    this.key = 'about';
    this.meta.textContent = 'about';
    const dl = h('dl', 'record-table');
    dl.append(h('dt', null, 'Title'), h('dd', 'is-title', site.title || ''));
    const text = h('div', 'record-text');
    for (const p of [].concat(site.about || [])) text.append(h('p', null, p));
    // Stays until the console's input next changes.
    this.view.replaceChildren(...[dl, text, recordLinks(site.contact)].filter(Boolean));
  }

  log(msg) {
    const t = new Date().toTimeString().slice(0, 8);
    const line = h('div', null, `${t}  ${msg}`);
    this.logEl.append(line);
    while (this.logEl.children.length > LOG_LINES) this.logEl.firstChild.remove();
  }

  // Returns true if now visible.
  toggle() {
    return !this.root.classList.toggle('is-hidden');
  }

  enableDrag() {
    let start = null;
    this.head.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button')) return;
      const r = this.root.getBoundingClientRect();
      start = { x: e.clientX - r.left, y: e.clientY - r.top };
      this.head.setPointerCapture(e.pointerId);
      this.root.classList.add('is-dragging');
    });
    this.head.addEventListener('pointermove', e => {
      if (!start) return;
      const r = this.root.getBoundingClientRect();
      const x = Math.max(0, Math.min(innerWidth - r.width, e.clientX - start.x));
      const y = Math.max(0, Math.min(innerHeight - this.head.offsetHeight, e.clientY - start.y));
      Object.assign(this.root.style, { left: `${x}px`, top: `${y}px`, right: 'auto' });
    });
    const end = () => { start = null; this.root.classList.remove('is-dragging'); };
    this.head.addEventListener('pointerup', end);
    this.head.addEventListener('pointercancel', end);
  }
}
