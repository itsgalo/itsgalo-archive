// Pointer and keyboard handling for the graph.
//
//   drag background / middle-drag   pan
//   drag node header or body        move node (snaps to grid)
//   drag from output                new link (snaps to the nearest valid socket)
//   drag from linked input          pick the link up and re-route it, or drop to cut
//   click wire, then Delete         cut link
//   select node, then Delete        remove node (outputs can't be removed)
//   double-click background         add node menu
//   F fit · H hide graph · Esc deselect · Ctrl/Cmd+S export graph.json

const SNAP_PX = 22;

export class Interact {
  constructor({ graph, canvas, editor, menu, actions }) {
    Object.assign(this, { graph, canvas, editor, menu, actions });
    this.root = canvas.root;
    this.drag = null;
    this.last = null;
    this.raf = 0;

    const r = this.root;
    r.addEventListener('pointerdown', e => this.down(e));
    r.addEventListener('pointermove', e => this.move(e));
    r.addEventListener('pointerup', e => this.up(e));
    r.addEventListener('pointercancel', e => this.up(e, true));
    r.addEventListener('dblclick', e => {
      if (e.target.closest('.node, .wire')) return;
      menu.open(e.clientX, e.clientY, canvas.toWorld(e.clientX, e.clientY));
    });
    r.addEventListener('contextmenu', e => { if (this.drag) e.preventDefault(); });
    addEventListener('keydown', e => this.key(e));
  }

  down(e) {
    if (this.drag) return;
    const t = e.target;
    if (t.closest('.widget, input, select, button, [data-scroll]')) return;

    const sock = t.closest('.socket');
    const grip = t.closest('.node-resize');
    const wire = t.closest('.wire');
    const nodeEl = t.closest('.node');

    if (e.button === 1 || (e.button === 0 && !sock && !wire && !nodeEl)) {
      if (e.button === 0) this.editor.select(null), this.editor.selectLink(null);
      this.drag = { kind: 'pan', x: e.clientX, y: e.clientY };
      this.root.classList.add('is-panning');
    } else if (e.button !== 0) {
      return;
    } else if (sock) {
      this.startLink(sock.dataset);
    } else if (wire) {
      this.editor.selectLink(wire.dataset.link);
      return;
    } else if (grip) {
      const node = this.graph.nodes.get(nodeEl.dataset.id);
      this.editor.select(node.id);
      this.drag = { kind: 'resize', id: node.id, x: e.clientX, y: e.clientY, w: node.params.w, h: node.params.h };
    } else {
      const node = this.graph.nodes.get(nodeEl.dataset.id);
      const p = this.canvas.toWorld(e.clientX, e.clientY);
      this.editor.select(node.id);
      this.drag = { kind: 'node', id: node.id, dx: p.x - node.x, dy: p.y - node.y, el: nodeEl };
      nodeEl.classList.add('is-dragging');
    }
    this.last = e;
    this.root.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  startLink({ node, socket, dir }) {
    let anchor = { node, socket, dir };
    if (dir === 'in') {
      const link = this.graph.linkInto(node, socket);
      if (link) {
        this.graph.disconnect(link.id);
        anchor = { node: link.from, socket: link.fromSocket, dir: 'out' };
      }
    }
    const type = anchor.dir === 'out'
      ? this.graph.outType(anchor.node, anchor.socket)
      : [].concat(this.graph.input(anchor.node, anchor.socket).type)[0];

    // Valid targets, computed once per drag.
    const targets = [];
    for (const view of this.editor.views.values()) {
      for (const dot of Object.values(view.sockets)) {
        const d = dot.dataset;
        let ok = false;
        if (d.dir !== anchor.dir) {
          ok = anchor.dir === 'out'
            ? this.graph.canConnect(anchor.node, anchor.socket, d.node, d.socket)
            : this.graph.canConnect(d.node, d.socket, anchor.node, anchor.socket);
        }
        dot.classList.toggle('is-valid', ok);
        dot.classList.toggle('is-anchor', d.node === anchor.node && d.socket === anchor.socket && d.dir === anchor.dir);
        if (ok) targets.push({ node: d.node, socket: d.socket, dir: d.dir, dot });
      }
    }
    this.root.classList.add('is-linking');
    this.drag = { kind: 'link', anchor, type, targets, target: null };
  }

  move(e) {
    if (!this.drag) return;
    this.last = e;
    if (!this.raf) this.raf = requestAnimationFrame(() => { this.raf = 0; this.flush(); });
  }

  flush() {
    const d = this.drag, e = this.last;
    if (!d || !e) return;
    if (d.kind === 'pan') {
      this.canvas.pan(e.clientX - d.x, e.clientY - d.y);
      d.x = e.clientX;
      d.y = e.clientY;
    } else if (d.kind === 'node') {
      const p = this.canvas.toWorld(e.clientX, e.clientY);
      this.editor.moveNode(d.id, this.editor.snap(p.x - d.dx), this.editor.snap(p.y - d.dy));
    } else if (d.kind === 'resize') {
      const z = this.canvas.view.z;
      this.editor.resizeNode(d.id, d.w + (e.clientX - d.x) / z, d.h + (e.clientY - d.y) / z);
    } else if (d.kind === 'link') {
      const p = this.canvas.toWorld(e.clientX, e.clientY);
      const radius = SNAP_PX / this.canvas.view.z;
      let best = null, bestDist = radius;
      for (const t of d.targets) {
        const q = this.editor.socketPos(t.node, t.dir, t.socket);
        const dist = Math.hypot(q.x - p.x, q.y - p.y);
        if (dist < bestDist) { best = t; bestDist = dist; }
      }
      if (best !== d.target) {
        d.target?.dot.classList.remove('is-snap');
        best?.dot.classList.add('is-snap');
        d.target = best;
      }
      const a = this.editor.socketPos(d.anchor.node, d.anchor.dir, d.anchor.socket);
      const b = best ? this.editor.socketPos(best.node, best.dir, best.socket) : p;
      if (d.anchor.dir === 'out') this.editor.wires.showTemp(a, b, d.type);
      else this.editor.wires.showTemp(b, a, d.type);
    }
  }

  up(e, cancelled = false) {
    const d = this.drag;
    if (!d) return;
    if (!cancelled) { this.last = e; this.flush(); }
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.drag = null;
    this.root.releasePointerCapture?.(e.pointerId);

    if (d.kind === 'pan') this.root.classList.remove('is-panning');
    if (d.kind === 'node') d.el.classList.remove('is-dragging');
    if (d.kind === 'link') {
      if (d.target && !cancelled) {
        const { anchor: a, target: t } = d;
        if (a.dir === 'out') this.graph.connect(a.node, a.socket, t.node, t.socket);
        else this.graph.connect(t.node, t.socket, a.node, a.socket);
      }
      this.editor.wires.hideTemp();
      this.root.classList.remove('is-linking');
      for (const v of this.editor.views.values()) {
        for (const dot of Object.values(v.sockets)) dot.classList.remove('is-valid', 'is-anchor', 'is-snap');
      }
    }
  }

  key(e) {
    if (e.target.closest?.('input, select, textarea')) return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 's') {
      e.preventDefault();
      this.actions.export();
      return;
    }
    if (mod || e.altKey) return;
    switch (e.key) {
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        this.editor.deleteSelection();
        break;
      case 'Escape':
        this.menu.close();
        this.editor.select(null);
        this.editor.selectLink(null);
        break;
      case 'f':
      case 'F':
        this.actions.fit();
        break;
      case 'h':
      case 'H':
        this.actions.graph();
        break;
    }
  }
}
