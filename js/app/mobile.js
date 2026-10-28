// Mobile: no graph. Cycles through projects in random order with an info panel.
// Tap the image for the next record; tap the panel to expand or collapse it.

import { h } from '../core/dom.js';
import { toMedia } from '../graph/types.js';
import { Projector } from '../projector/Projector.js';
import { recordTable, recordText, recordLinks } from '../ui/record.js';

function shuffle(list, avoidFirst) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length > 1 && out[0] === avoidFirst) out.push(out.shift());
  return out;
}

// Prefer an image or video; iframes would swallow taps.
function displayMedia(p) {
  const i = p.media.findIndex(m => m.type !== 'iframe');
  return toMedia(p, i < 0 ? 0 : i);
}

const pad = n => String(n).padStart(2, '0');

export function startMobile({ site, ctx }) {
  const projectorEl = document.querySelector('#projector');
  const info = document.querySelector('#info');
  const projector = new Projector(projectorEl, { fade: site.fade });
  const interval = (site.mobile?.interval ?? 7) * 1000;
  const pool = ctx.projects.filter(p => p.media.length);
  if (!pool.length) return;

  const progress = h('div', 'info-progress');
  const meta = h('div', 'info-meta');
  const title = h('h1', 'info-title');
  const summary = h('p', 'info-summary');
  const more = h('div', 'info-more');
  info.style.setProperty('--interval', `${interval}ms`);
  info.append(progress, meta, title, summary, more);
  info.hidden = false;

  let order = shuffle(pool), i = 0, timer = 0, open = false;

  function render() {
    const p = order[i];
    const media = displayMedia(p);
    projector.show(media);
    meta.replaceChildren(h('span', null, `${pad(i + 1)} / ${pad(order.length)} · No. ${p.no}`), h('span', null, p.year ?? ''));
    title.textContent = p.title;
    summary.textContent = p.summary || '';
    const body = recordText({ ...p, summary: '' });
    more.replaceChildren(...[recordTable(p, media), body, recordLinks(p.links)].filter(Boolean));
    more.scrollTop = 0;
  }

  function schedule() {
    clearTimeout(timer);
    progress.classList.remove('is-running');
    if (open || document.hidden) return;
    void progress.offsetWidth; // restart the CSS animation
    progress.classList.add('is-running');
    timer = setTimeout(next, interval);
  }

  function next() {
    i++;
    if (i >= order.length) { order = shuffle(pool, order[order.length - 1]); i = 0; }
    render();
    schedule();
  }

  projectorEl.addEventListener('click', () => { if (open) toggle(false); else next(); });
  info.addEventListener('click', e => { if (!e.target.closest('a')) toggle(); });
  document.addEventListener('visibilitychange', schedule);

  function toggle(force = !open) {
    open = force;
    info.classList.toggle('is-open', open);
    schedule();
  }

  render();
  schedule();
}
