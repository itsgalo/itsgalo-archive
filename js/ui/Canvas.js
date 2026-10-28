// Pan/zoom surface. One transformed "world" element holds nodes and wires.
// Wheel pans; Ctrl/Cmd + wheel (or trackpad pinch) zooms toward the pointer.

import { createEmitter } from '../core/emitter.js';

export class Canvas {
  constructor(root, { minZoom = 0.35, maxZoom = 2 } = {}) {
    this.root = root;
    this.min = minZoom;
    this.max = maxZoom;
    this.view = { x: 0, y: 0, z: 1 };
    this.events = createEmitter();
    this.world = document.createElement('div');
    this.world.className = 'graph-world';
    root.append(this.world);
    this.measure();
    addEventListener('resize', () => this.measure());
    root.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    this.apply();
  }

  measure() {
    this.rect = this.root.getBoundingClientRect();
  }

  clamp(z) {
    return Math.min(this.max, Math.max(this.min, z));
  }

  apply() {
    const { x, y, z } = this.view;
    this.world.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
    this.root.style.setProperty('--zoom', z);
    this.events.emit('view', this.view);
  }

  setView({ x = 0, y = 0, z = 1 } = {}) {
    Object.assign(this.view, { x, y, z: this.clamp(z) });
    this.apply();
  }

  pan(dx, dy) {
    this.view.x += dx;
    this.view.y += dy;
    this.apply();
  }

  zoomAt(cx, cy, factor) {
    const px = cx - this.rect.left, py = cy - this.rect.top;
    const z0 = this.view.z, z1 = this.clamp(z0 * factor);
    this.view.x = px - (px - this.view.x) * (z1 / z0);
    this.view.y = py - (py - this.view.y) * (z1 / z0);
    this.view.z = z1;
    this.apply();
  }

  toWorld(cx, cy) {
    const { x, y, z } = this.view;
    return { x: (cx - this.rect.left - x) / z, y: (cy - this.rect.top - y) / z };
  }

  // Fit a world-space box { x, y, w, h } into the viewport.
  frame(b, pad = 64) {
    if (!b) return;
    const { width, height } = this.rect;
    const z = this.clamp(Math.min((width - 2 * pad) / b.w, (height - 2 * pad) / b.h, 1));
    this.setView({
      x: Math.round(width / 2 - (b.x + b.w / 2) * z),
      y: Math.round(height / 2 - (b.y + b.h / 2) * z),
      z,
    });
  }

  onWheel(e) {
    // Let scrollable node content (e.g. Inspect's list) scroll natively.
    const box = e.target.closest?.('[data-scroll]');
    if (box && !e.ctrlKey && !e.metaKey && box.scrollHeight > box.clientHeight) return;
    e.preventDefault();
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? this.rect.height : 1;
    if (e.ctrlKey || e.metaKey) {
      const d = Math.max(-40, Math.min(40, e.deltaY * k)); // tame mouse-wheel notches
      this.zoomAt(e.clientX, e.clientY, Math.exp(-d * 0.01));
    }
    else this.pan(-e.deltaX * k, -e.deltaY * k);
  }
}
