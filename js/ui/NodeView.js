// DOM for one node. Layout: header, output rows, input rows (with inline widget
// when the input mirrors a param), remaining param rows, readout.

import { h, offsetWithin } from '../core/dom.js';
import { createWidget } from './widgets.js';

export class NodeView {
  constructor(node, { ctx, onParam }) {
    this.node = node;
    this.sockets = {};   // "in:name" | "out:name" -> element
    this.offsets = {};   // same keys -> { x, y } relative to node origin
    this.widgets = {};   // param key -> widget
    const def = node.def;

    const el = this.el = h('div', 'node');
    el.dataset.type = node.type;
    el.dataset.id = node.id;
    if (def.sink) el.classList.add('is-sink');

    const head = h('div', 'node-head');
    head.append(h('span', 'node-title', def.label), h('span', 'node-id', node.id));

    const body = h('div', 'node-body');
    const widget = p => {
      const w = createWidget(p, ctx, v => onParam(p.key, v));
      w.set(node.params[p.key]);
      this.widgets[p.key] = w;
      return w.el;
    };
    const inline = new Set();
    for (const s of def.outputs || []) body.append(this.row('out', s));
    for (const s of def.inputs || []) {
      const row = this.row('in', s);
      const p = s.param && def.params?.find(q => q.key === s.param);
      if (p) { inline.add(p.key); row.append(widget(p)); }
      body.append(row);
    }
    for (const p of def.params || []) {
      if (inline.has(p.key)) continue;
      const row = h('div', 'node-row is-param');
      row.append(h('span', 'node-label', p.label || p.key), widget(p));
      body.append(row);
    }

    el.append(head, body);

    // Optional custom body: def.view(node) -> { el, update(), dispose() }
    if (def.view) {
      this.custom = def.view(node, ctx);
      this.viewBox = h('div', 'node-view');
      this.viewBox.append(this.custom.el);
      el.append(this.viewBox);
    }
    // Optional resizing: def.size = { w, h, minW, minH }; stored in params.w / params.h
    if (def.size) {
      node.params.w ??= def.size.w;
      node.params.h ??= def.size.h;
      el.classList.add('is-resizable');
      el.append(h('div', 'node-resize'));
      this.applySize();
    }

    if (def.readout) {
      this.readout = h('div', 'node-readout');
      el.append(this.readout);
    }
  }

  row(dir, socket) {
    const row = h('div', `node-row is-${dir}`);
    const types = [].concat(socket.type);
    const dot = h('span', 'socket');
    Object.assign(dot.dataset, { dir, node: this.node.id, socket: socket.name, type: types[0] });
    dot.title = `${socket.label || socket.name}: ${types.join(' | ')}`;
    this.sockets[`${dir}:${socket.name}`] = dot;
    row.append(dot, h('span', 'node-label', socket.label || socket.name));
    return row;
  }

  // Socket centers relative to the node's top-left. Call after the element is in the DOM.
  measure() {
    for (const [key, dot] of Object.entries(this.sockets)) {
      const o = offsetWithin(dot, this.el);
      this.offsets[key] = { x: o.x + dot.offsetWidth / 2, y: o.y + dot.offsetHeight / 2 };
    }
  }

  applySize() {
    this.el.style.width = `${this.node.params.w}px`;
    if (this.viewBox) this.viewBox.style.height = `${this.node.params.h}px`;
  }

  dispose() {
    this.custom?.dispose?.();
  }

  setPos() {
    this.el.style.transform = `translate(${this.node.x}px, ${this.node.y}px)`;
  }

  setSelected(on) {
    this.el.classList.toggle('is-selected', on);
  }

  update(connected) {
    const { node } = this;
    for (const [key, dot] of Object.entries(this.sockets)) {
      dot.classList.toggle('is-connected', connected.has(`${node.id}:${key}`));
    }
    for (const s of node.def.inputs || []) {
      if (s.param) this.widgets[s.param]?.disable(connected.has(`${node.id}:in:${s.name}`));
    }
    for (const [key, w] of Object.entries(this.widgets)) w.set(node.params[key]);
    this.custom?.update?.(node);
    if (this.readout) {
      const text = node.def.readout(node) ?? '';
      if (this.readout.textContent !== text) {
        this.readout.textContent = text;
        this.readout.title = text;
      }
    }
  }
}
