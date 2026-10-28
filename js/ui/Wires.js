// One SVG layer inside the world. Each link is a <g> with a wide invisible hit path
// and a thin visible path. Style: 'orthogonal' (default) or 'curve'.

const NS = 'http://www.w3.org/2000/svg';
const svg = tag => document.createElementNS(NS, tag);

export function route(a, b, style = 'orthogonal') {
  if (style === 'curve') {
    const dx = Math.max(40, Math.abs(b.x - a.x) * 0.5);
    return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
  }
  const s = 16; // stub length out of / into a socket
  const r = v => Math.round(v) + 0.5;
  const [x1, y1, x2, y2] = [r(a.x), r(a.y), r(b.x), r(b.y)];
  if (x2 - x1 >= 2 * s) {
    const mx = r((x1 + x2) / 2);
    return `M${x1},${y1} H${mx} V${y2} H${x2}`;
  }
  const my = r((y1 + y2) / 2);
  return `M${x1},${y1} H${x1 + s} V${my} H${x2 - s} V${y2} H${x2}`;
}

export class Wires {
  constructor(world, { style = 'orthogonal' } = {}) {
    this.style = style;
    this.paths = new Map();
    this.el = svg('svg');
    this.el.classList.add('graph-wires');
    this.el.dataset.style = style;
    world.prepend(this.el);
    this.temp = this.make();
    this.temp.g.classList.add('is-temp');
    this.temp.g.style.display = 'none';
  }

  make() {
    const g = svg('g'), hit = svg('path'), line = svg('path');
    g.classList.add('wire');
    hit.classList.add('wire-hit');
    line.classList.add('wire-line');
    g.append(hit, line);
    this.el.append(g);
    return { g, hit, line };
  }

  add(link) {
    const p = this.make();
    p.g.dataset.link = link.id;
    p.g.dataset.type = link.type;
    this.paths.set(link.id, p);
  }

  remove(id) {
    this.paths.get(id)?.g.remove();
    this.paths.delete(id);
  }

  set(id, a, b) {
    const p = this.paths.get(id);
    if (!p) return;
    const d = route(a, b, this.style);
    p.hit.setAttribute('d', d);
    p.line.setAttribute('d', d);
  }

  showTemp(a, b, type) {
    const d = route(a, b, this.style);
    this.temp.g.dataset.type = type;
    this.temp.line.setAttribute('d', d);
    this.temp.g.style.display = '';
    this.el.append(this.temp.g); // keep on top
  }

  hideTemp() {
    this.temp.g.style.display = 'none';
  }

  select(id) {
    for (const [key, p] of this.paths) p.g.classList.toggle('is-selected', key === id);
  }
}
