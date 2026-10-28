// Desktop: projector + node graph + console.

import { loadJSON } from '../core/load.js';
import { readHash, writeHash } from '../core/hash.js';
import { Graph } from '../graph/Graph.js';
import { evaluate } from '../graph/evaluate.js';
import { Projector } from '../projector/Projector.js';
import { Canvas } from '../ui/Canvas.js';
import { Editor } from '../ui/Editor.js';
import { Interact } from '../ui/Interact.js';
import { AddMenu } from '../ui/Menu.js';
import { ConsolePanel } from '../ui/Console.js';

export async function startDesktop({ site, ctx }) {
  const $ = s => document.querySelector(s);
  const html = document.documentElement;
  const initialHash = readHash(); // read before the first run overwrites it
  const source = await loadJSON(site.graph || 'data/graph.json');

  const projector = new Projector($('#projector'), { fade: site.fade });
  const consolePanel = new ConsolePanel($('#console'), { site });
  const graph = new Graph();
  const canvas = new Canvas($('#graph'));
  const editor = new Editor({ graph, canvas, ctx, grid: site.grid ?? 8, wireStyle: site.wires });
  const menu = new AddMenu({
    onPick(type, at) {
      const node = graph.addNode(type, { x: editor.snap(at.x), y: editor.snap(at.y) });
      if (node) editor.select(node.id);
    },
  });

  // --- evaluation -------------------------------------------------------
  let signal = null;
  const run = () => {
    const sinks = evaluate(graph, ctx);
    editor.refresh();
    signal = sinks.projector ?? null;
    projector.show(signal);
    consolePanel.show(sinks.console ?? null);
    renderStatus();
    writeHash(signal ? { p: signal.project.id, m: signal.index + 1 } : {});
  };
  let queued = false;
  graph.events.on('change', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; run(); });
  });

  // --- status bar -------------------------------------------------------
  const statusGraph = $('[data-status="graph"]');
  const statusSignal = $('[data-status="signal"]');
  function renderStatus() {
    statusGraph.textContent =
      `${graph.nodes.size} nodes · ${graph.links.size} links · ${Math.round(canvas.view.z * 100)}%`;
    statusSignal.textContent = signal
      ? `No. ${signal.project.no} · ${signal.project.title} · ${signal.index + 1}/${signal.count} ${signal.item.type}`
      : 'No signal';
  }
  canvas.events.on('view', renderStatus);

  // --- console log ------------------------------------------------------
  let quiet = false;
  const log = msg => { if (!quiet) consolePanel.log(msg); };
  graph.events.on('link:add', l => log(`link ${l.from}.${l.fromSocket} → ${l.to}.${l.toSocket}`));
  graph.events.on('link:remove', l => log(`cut ${l.from}.${l.fromSocket} → ${l.to}.${l.toSocket}`));
  graph.events.on('node:add', n => log(`add ${n.def.label} ${n.id}`));
  graph.events.on('node:remove', n => log(`remove ${n.def.label} ${n.id}`));

  // --- actions (toolbar + keys) ----------------------------------------
  const load = () => {
    quiet = true;
    graph.load(source);
    quiet = false;
    editor.select(null);
    editor.fit();
    // if (source.view) canvas.setView(source.view);
    // else editor.fit();
  };
  const actions = {
    add() {
      const cx = canvas.rect.width / 2, cy = canvas.rect.height / 2;
      menu.open(cx, cy, canvas.toWorld(cx, cy));
    },
    reset() { load(); log('graph reset'); },
    fit() { editor.fit(); },
    graph() {
      const hidden = html.classList.toggle('graph-hidden');
      $('[data-action="graph"]').textContent = hidden ? 'Show graph' : 'Hide graph';
    },
    console() {
      const shown = consolePanel.toggle();
      $('[data-action="console"]').setAttribute('aria-pressed', shown);
    },
    about() { consolePanel.about(); },
    export() {
      const data = { view: { ...canvas.view }, ...graph.toJSON() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'graph.json' });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      log('exported graph.json');
    },
  };
  for (const el of document.querySelectorAll('[data-action]')) {
    el.addEventListener('click', () => actions[el.dataset.action]?.());
  }
  new Interact({ graph, canvas, editor, menu, actions });

  // --- boot ---------------------------------------------------------------
  load();
  run();
  applyHash(graph, initialHash);
  run();
  document.fonts?.ready.then(() => editor.remeasure());
  consolePanel.log(`${ctx.projects.length} records loaded`);
}

// #p=<project id>&m=<media number> sets the first free Pick and Media nodes.
function applyHash(graph, { p, m }) {
  const free = type => [...graph.nodes.values()].find(n => n.type === type && !graph.linkInto(n.id, 'index'));
  const pick = free('pick');
  if (pick && p) {
    const link = graph.linkInto(pick.id, 'collection');
    const list = link && graph.nodes.get(link.from).out[link.fromSocket];
    const i = list ? list.findIndex(x => x.id === p) : -1;
    if (i >= 0) graph.setParam(pick.id, 'index', i);
  }
  const media = free('media');
  if (media && m) graph.setParam(media.id, 'index', Math.max(0, (Number(m) || 1) - 1));
}
