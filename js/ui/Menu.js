// "Add node" list. Opens at a screen point; picks a type for a world point.

import { h } from '../core/dom.js';
import { registry } from '../nodes/registry.js';

export class AddMenu {
  constructor({ onPick }) {
    this.onPick = onPick;
    this.el = h('div', 'menu');
    this.el.hidden = true;
    document.body.append(this.el);
    document.addEventListener('pointerdown', e => {
      if (!this.el.hidden && !this.el.contains(e.target)) this.close();
    }, true);
    addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
  }

  open(cx, cy, world) {
    this.el.replaceChildren(h('div', 'menu-head', 'Add node'));
    for (const def of Object.values(registry)) {
      if (def.sink) continue;
      const item = h('button', 'menu-item');
      item.type = 'button';
      item.append(h('span', null, def.label), h('small', null, def.group || ''));
      item.addEventListener('click', () => { this.close(); this.onPick(def.type, world); });
      this.el.append(item);
    }
    this.el.hidden = false;
    const r = this.el.getBoundingClientRect();
    this.el.style.left = `${Math.max(8, Math.min(cx, innerWidth - r.width - 8))}px`;
    this.el.style.top = `${Math.max(8, Math.min(cy, innerHeight - r.height - 8))}px`;
    this.el.querySelector('.menu-item')?.focus();
  }

  close() {
    this.el.hidden = true;
  }
}
