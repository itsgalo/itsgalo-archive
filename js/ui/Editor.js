// Keeps node views and wires in sync with the graph model, plus selection.

import { NodeView } from './NodeView.js';
import { Wires } from './Wires.js';

export class Editor {
  constructor({ graph, canvas, ctx, grid = 8, wireStyle = 'orthogonal' }) {
    Object.assign(this, { graph, canvas, ctx, grid });
    this.views = new Map();
    this.wires = new Wires(canvas.world, { style: wireStyle });
    this.selected = null;
    this.selectedLink = null;
    this.zTop = 1;

    const ev = graph.events;
    ev.on('node:add', n => this.addView(n));
    ev.on('node:remove', n => this.removeView(n));
    ev.on('link:add', l => { this.wires.add(l); this.updateLink(l); });
    ev.on('link:retype', l => {
      const p = this.wires.paths.get(l.id);
      if (p) p.g.dataset.type = l.type;
    });
    ev.on('link:remove', l => {
      this.wires.remove(l.id);
      if (this.selectedLink === l.id) this.selectedLink = null;
    });
  }

  addView(node) {
    const view = new NodeView(node, {
      ctx: this.ctx,
      onParam: (key, value) => this.graph.setParam(node.id, key, value),
    });
    this.views.set(node.id, view);
    this.canvas.world.append(view.el);
    view.setPos();
    view.measure();
  }

  removeView(node) {
    this.views.get(node.id)?.dispose();
    this.views.get(node.id)?.el.remove();
    this.views.delete(node.id);
    if (this.selected === node.id) this.selected = null;
  }

  socketPos(nodeId, dir, name) {
    const v = this.views.get(nodeId);
    const o = v?.offsets[`${dir}:${name}`];
    return o ? { x: v.node.x + o.x, y: v.node.y + o.y } : null;
  }

  updateLink(l) {
    const a = this.socketPos(l.from, 'out', l.fromSocket);
    const b = this.socketPos(l.to, 'in', l.toSocket);
    if (a && b) this.wires.set(l.id, a, b);
  }

  updateLinksOf(nodeId) {
    for (const l of this.graph.links.values()) {
      if (l.from === nodeId || l.to === nodeId) this.updateLink(l);
    }
  }

  moveNode(id, x, y) {
    const v = this.views.get(id);
    if (!v || (v.node.x === x && v.node.y === y)) return;
    v.node.x = x;
    v.node.y = y;
    v.setPos();
    this.updateLinksOf(id);
  }

  resizeNode(id, w, h) {
    const v = this.views.get(id);
    const s = v?.node.def.size;
    if (!s) return;
    v.node.params.w = Math.max(s.minW ?? 120, this.snap(w));
    v.node.params.h = Math.max(s.minH ?? 40, this.snap(h));
    v.applySize();
    v.measure(); // right-edge (output) sockets move when the width changes
    this.updateLinksOf(id);
  }

  snap(v) {
    return this.grid ? Math.round(v / this.grid) * this.grid : Math.round(v);
  }

  select(id) {
    if (this.selected) this.views.get(this.selected)?.setSelected(false);
    this.selected = id ?? null;
    const v = id && this.views.get(id);
    if (v) {
      v.setSelected(true);
      v.el.style.zIndex = ++this.zTop;
      this.selectLink(null, true);
    }
  }

  selectLink(id, keepNode = false) {
    this.selectedLink = id ?? null;
    this.wires.select(this.selectedLink);
    if (id && !keepNode) this.select(null);
  }

  deleteSelection() {
    if (this.selectedLink) this.graph.disconnect(this.selectedLink);
    else if (this.selected) this.graph.removeNode(this.selected);
  }

  // After each evaluation: readouts, connected sockets, widget values.
  refresh() {
    const connected = new Set();
    for (const l of this.graph.links.values()) {
      connected.add(`${l.from}:out:${l.fromSocket}`);
      connected.add(`${l.to}:in:${l.toSocket}`);
    }
    for (const v of this.views.values()) {
      // Pass-through outputs show the type they currently carry.
      for (const s of v.node.def.outputs || []) {
        if (s.type === 'any') v.sockets[`out:${s.name}`].dataset.type = this.graph.outType(v.node.id, s.name);
      }
      // Multi-type inputs show the type actually linked in.
      for (const s of v.node.def.inputs || []) {
        if (Array.isArray(s.type)) {
          v.sockets[`in:${s.name}`].dataset.type = this.graph.linkInto(v.node.id, s.name)?.type ?? s.type[0];
        }
      }
      v.update(connected);
    }
  }

  remeasure() {
    for (const v of this.views.values()) v.measure();
    for (const l of this.graph.links.values()) this.updateLink(l);
  }

  bounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const v of this.views.values()) {
      x0 = Math.min(x0, v.node.x);
      y0 = Math.min(y0, v.node.y);
      x1 = Math.max(x1, v.node.x + v.el.offsetWidth);
      y1 = Math.max(y1, v.node.y + v.el.offsetHeight);
    }
    return Number.isFinite(x0) ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
  }

  fit() {
    this.canvas.frame(this.bounds());
  }
}
