// Graph model: nodes, links, params. No DOM.
//
// Events:  node:add  node:remove  link:add  link:remove  param  change  load
// 'change' fires on anything that should trigger re-evaluation.

import { createEmitter } from '../core/emitter.js';
import { registry } from '../nodes/registry.js';
import { accepts } from './types.js';

const inKey = (node, socket) => `${node}:${socket}`;

export class Graph {
  constructor() {
    this.nodes = new Map();
    this.links = new Map();
    this.inbound = new Map(); // "node:socket" -> link (inputs take one link)
    this.events = createEmitter();
    this.seq = 0;
  }

  load(json) {
    this.clear();
    for (const n of json.nodes || []) this.addNode(n.type, n);
    // Retry until nothing more connects: a link out of a pass-through only
    // resolves once the link into it exists, whatever order the file lists them.
    let pending = [...(json.links || [])], before;
    do {
      before = pending.length;
      pending = pending.filter(l => !this.connect(...l));
    } while (pending.length && pending.length < before);
    for (const l of pending) console.warn('[graph] skipped invalid link', l);
    this.events.emit('load', json);
  }

  clear() {
    for (const id of [...this.nodes.keys()]) this.removeNode(id, { force: true });
    this.seq = 0;
  }

  nextId() {
    let id;
    do id = `N${String(++this.seq).padStart(2, '0')}`; while (this.nodes.has(id));
    return id;
  }

  addNode(type, { id, x = 0, y = 0, params = {} } = {}) {
    const def = registry[type];
    if (!def) { console.warn(`[graph] unknown node type "${type}"`); return null; }
    if (def.unique && [...this.nodes.values()].some(n => n.type === type)) return null;

    id = id || this.nextId();
    const num = /(\d+)$/.exec(id);
    if (num) this.seq = Math.max(this.seq, Number(num[1]));

    const defaults = Object.fromEntries((def.params || []).map(p => [p.key, p.default]));
    const node = { id, type, def, x, y, params: { ...defaults, ...params }, state: {}, out: {} };
    this.nodes.set(id, node);
    def.init?.(node, this);
    this.events.emit('node:add', node);
    this.changed();
    return node;
  }

  removeNode(id, { force = false } = {}) {
    const node = this.nodes.get(id);
    if (!node || (node.def.sink && !force)) return false;
    for (const link of [...this.links.values()]) {
      if (link.from === id || link.to === id) this.disconnect(link.id);
    }
    node.def.dispose?.(node, this);
    this.nodes.delete(id);
    this.events.emit('node:remove', node);
    this.changed();
    return true;
  }

  output(nodeId, name) {
    return this.nodes.get(nodeId)?.def.outputs?.find(s => s.name === name) || null;
  }

  input(nodeId, name) {
    return this.nodes.get(nodeId)?.def.inputs?.find(s => s.name === name) || null;
  }

  // Resolved type of an output. An output declared { type: 'any', from: '<input>' }
  // takes the type of whatever is linked into that input.
  outType(nodeId, name) {
    const out = this.output(nodeId, name);
    if (out?.type !== 'any') return out?.type;
    return this.linkInto(nodeId, out.from)?.type ?? 'any';
  }

  // After a pass-through's input changes: retype its outgoing links, cut any
  // that no longer fit. Links are kept (with their old type) while the input is empty.
  retype(nodeId, seen = new Set()) {
    if (seen.has(nodeId)) return;
    seen.add(nodeId);
    for (const l of [...this.links.values()]) {
      if (l.from !== nodeId || this.output(nodeId, l.fromSocket)?.type !== 'any') continue;
      const t = this.outType(nodeId, l.fromSocket);
      if (t === 'any' || t === l.type) continue;
      if (accepts(this.input(l.to, l.toSocket), t)) {
        l.type = t;
        this.events.emit('link:retype', l);
        this.retype(l.to, seen);
      } else {
        this.disconnect(l.id);
      }
    }
  }

  // True if `target` is reachable downstream from `start`.
  reaches(start, target) {
    const stack = [start], seen = new Set();
    while (stack.length) {
      const id = stack.pop();
      if (id === target) return true;
      if (seen.has(id)) continue;
      seen.add(id);
      for (const l of this.links.values()) if (l.from === id) stack.push(l.to);
    }
    return false;
  }

  canConnect(from, fromSocket, to, toSocket) {
    if (from === to) return false;
    const type = this.outType(from, fromSocket);
    const inp = this.input(to, toSocket);
    if (!type || type === 'any' || !inp || !accepts(inp, type)) return false;
    return !this.reaches(to, from); // no cycles
  }

  connect(from, fromSocket, to, toSocket) {
    if (!this.canConnect(from, fromSocket, to, toSocket)) return null;
    const prev = this.inbound.get(inKey(to, toSocket));
    if (prev) this.disconnect(prev.id);
    const link = {
      id: `${from}.${fromSocket}>${to}.${toSocket}`,
      from, fromSocket, to, toSocket,
      type: this.outType(from, fromSocket),
    };
    this.links.set(link.id, link);
    this.inbound.set(inKey(to, toSocket), link);
    this.events.emit('link:add', link);
    this.retype(to);
    this.changed();
    return link;
  }

  disconnect(id) {
    const link = this.links.get(id);
    if (!link) return;
    this.links.delete(id);
    this.inbound.delete(inKey(link.to, link.toSocket));
    this.events.emit('link:remove', link);
    this.changed();
  }

  linkInto(nodeId, socket) {
    return this.inbound.get(inKey(nodeId, socket)) || null;
  }

  setParam(id, key, value) {
    const node = this.nodes.get(id);
    if (!node || node.params[key] === value) return;
    node.params[key] = value;
    this.events.emit('param', { node, key, value });
    this.changed();
  }

  changed() {
    this.events.emit('change');
  }

  toJSON() {
    return {
      nodes: [...this.nodes.values()].map(({ id, type, x, y, params }) => ({
        id, type, x: Math.round(x), y: Math.round(y), params: { ...params },
      })),
      links: [...this.links.values()].map(l => [l.from, l.fromSocket, l.to, l.toSocket]),
    };
  }
}
