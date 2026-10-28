// Pull values through the graph in topological order.
// Sink nodes (Projector, Console) write into `sinks`; that object is the only output.

import { coerce } from './types.js';

export function topoOrder(graph) {
  const indeg = new Map([...graph.nodes.keys()].map(id => [id, 0]));
  for (const l of graph.links.values()) indeg.set(l.to, indeg.get(l.to) + 1);
  const queue = [...indeg].filter(([, d]) => d === 0).map(([id]) => id);
  const order = [];
  while (queue.length) {
    const id = queue.shift();
    order.push(graph.nodes.get(id));
    for (const l of graph.links.values()) {
      if (l.from !== id) continue;
      const d = indeg.get(l.to) - 1;
      indeg.set(l.to, d);
      if (d === 0) queue.push(l.to);
    }
  }
  return order;
}

export function evaluate(graph, ctx) {
  const sinks = {};
  for (const node of topoOrder(graph)) {
    const inputs = {}, connected = {};
    for (const input of node.def.inputs || []) {
      const link = graph.linkInto(node.id, input.name);
      if (!link) continue;
      const src = graph.nodes.get(link.from);
      inputs[input.name] = coerce(src.out[link.fromSocket], link.type, input);
      connected[input.name] = true;
    }
    node.connected = connected;
    try {
      node.out = node.def.evaluate?.({
        in: inputs, connected, params: node.params, state: node.state, node, ctx, sinks,
      }) || {};
    } catch (err) {
      console.error(`[graph] ${node.id} (${node.type})`, err);
      node.out = {};
    }
  }
  return sinks;
}
