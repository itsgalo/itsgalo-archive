// Admin boot: tabs, toolbar, status line.

import { Store } from './store.js';
import projectsView from './views/projects.js';
import infoView from './views/info.js';
import siteView from './views/site.js';
import graphView from './views/graph.js';

const VIEWS = { projects: projectsView, info: infoView, site: siteView, graph: graphView };
const store = new Store();
const $ = s => document.querySelector(s);
const main = $('#main');
let current = VIEWS[location.hash.slice(1)] ? location.hash.slice(1) : 'projects';

function show(name) {
  current = name;
  history.replaceState(null, '', `#${name}`);
  for (const t of document.querySelectorAll('[data-tab]')) t.setAttribute('aria-selected', t.dataset.tab === name);
  main.replaceChildren(VIEWS[name](store));
  main.scrollTop = 0;
}

for (const t of document.querySelectorAll('[data-tab]')) t.addEventListener('click', () => show(t.dataset.tab));

const saveBtn = $('[data-action="save"]');
store.events.on('dirty', dirty => {
  saveBtn.textContent = dirty.size ? `Save (${dirty.size})` : 'Saved';
  saveBtn.classList.toggle('is-dirty', dirty.size > 0);
  for (const t of document.querySelectorAll('[data-tab]')) t.classList.toggle('is-dirty', dirty.has(t.dataset.tab));
});
store.events.on('load', () => show(current));

const where = $('[data-status="where"]');
const setWhere = () => {
  where.textContent = store.dir ? `Folder: ${store.dir.name} · saves to disk` : 'Not connected · Save downloads files';
};
store.events.on('dir', setWhere);

const msg = $('[data-status="msg"]');
store.events.on('log', m => {
  msg.textContent = `${new Date().toTimeString().slice(0, 8)}  ${m}`;
  msg.title = m;
});

const run = fn => () => fn().catch(err => { if (err?.name !== 'AbortError') { console.error(err); store.log(`error: ${err.message}`); } });
saveBtn.addEventListener('click', run(() => store.save()));
$('[data-action="connect"]').addEventListener('click', run(() => store.connect()));
$('[data-action="reload"]').addEventListener('click', run(async () => {
  if (store.dirty.size && !confirm('Discard unsaved changes and reload from files?')) return;
  await store.load();
}));
$('[data-action="connect"]').hidden = !store.canConnect;

addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    run(() => store.save())();
  }
});
addEventListener('beforeunload', e => { if (store.dirty.size) e.preventDefault(); });

setWhere();
store.load().catch(err => {
  console.error(err);
  main.replaceChildren(Object.assign(document.createElement('p'), {
    className: 'f-empty',
    textContent: `Could not load data/site.json (${err.message}). Serve the site folder over HTTP and open /admin/.`,
  }));
});
