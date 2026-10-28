// Boot: load data, pick the desktop or mobile app.

import { loadJSON } from './core/load.js';
import { buildContext } from './core/content.js';

const html = document.documentElement;

try {
  const site = await loadJSON('data/site.json');
  const info = site.info ? await loadJSON(site.info).catch(err => (console.warn(err), null)) : null;
  const ctx = buildContext(await loadJSON(site.projects || 'data/projects.json'), info);

  if (site.theme) document.getElementById('theme').href = `css/themes/${site.theme}.css`;
  if (site.title) document.title = site.title;
  for (const el of document.querySelectorAll('[data-site-title]')) el.textContent = site.title || '';

  const mq = matchMedia(site.mobile?.query || '(max-width: 720px)');
  mq.addEventListener('change', () => location.reload());

  if (mq.matches) {
    html.classList.add('mode-mobile');
    (await import('./app/mobile.js')).startMobile({ site, ctx });
  } else {
    html.classList.add('mode-desktop');
    await (await import('./app/desktop.js')).startDesktop({ site, ctx });
  }
} catch (err) {
  console.error(err);
  html.classList.add('mode-error');
  const box = document.getElementById('boot-error');
  box.hidden = false;
  box.textContent = `Could not start: ${err.message}. ` +
    (location.protocol === 'file:' ? 'Serve the folder over HTTP (e.g. `npx serve` or `python3 -m http.server`).' : '');
}
