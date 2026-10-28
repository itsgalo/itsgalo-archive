// Site: settings in data/site.json.

import { h } from '../../../js/core/dom.js';
import { group, row, text, number, select, paragraphs, links } from '../forms.js';

export default function siteView(store) {
  const site = store.data.site;
  site.mobile ??= {};
  const touch = () => store.touch('site');
  const el = h('div', 'pane is-solo');
  const head = h('div', 'pane-head');
  head.append(h('h1', 'pane-title', 'Site'), h('span', 'pane-path', 'data/site.json'));

  const themes = h('datalist');
  themes.id = 'theme-list';
  for (const t of ['default', 'dark']) themes.append(Object.assign(h('option'), { value: t }));
  const theme = text(site, 'theme', touch, { placeholder: 'default' });
  theme.setAttribute('list', 'theme-list');

  el.append(
    head,
    group('General',
      row('Title', text(site, 'title', touch), 'Browser tab and top-left of the toolbar.'),
      row('About', paragraphs(site, 'about', touch), 'Shown in the Console when the title is clicked.'),
    ),
    group('Contact', links(site, 'contact', touch)),
    group('Display',
      row('Theme', theme, 'File name in css/themes/, without .css.'),
      row('Wires', select(site, 'wires', [['orthogonal', 'Orthogonal'], ['curve', 'Curve']], touch, { fallback: 'orthogonal' })),
      row('Grid', number(site, 'grid', touch, { placeholder: '8' }), 'Node snapping in px. 0 turns it off.'),
      row('Fade', number(site, 'fade', touch, { placeholder: '450' }), 'Projector crossfade in ms.'),
    ),
    group('Mobile',
      row('Interval', number(site.mobile, 'interval', touch, { placeholder: '7' }), 'Seconds per project.'),
      row('Breakpoint', text(site.mobile, 'query', touch, { placeholder: '(max-width: 720px)' })),
    ),
    group('Files',
      h('p', 'f-note', 'Paths are relative to the site root. Change only if you move the files.'),
      row('Projects', text(site, 'projects', touch, { placeholder: 'data/projects.json' })),
      row('Info', text(site, 'info', touch, { placeholder: 'data/info.json' })),
      row('Graph', text(site, 'graph', touch, { placeholder: 'data/graph.json' })),
    ),
    themes,
  );
  return el;
}
