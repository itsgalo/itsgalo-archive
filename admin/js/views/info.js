// Info: the bio record read by the Info node (same keys as a project).

import { h } from '../../../js/core/dom.js';
import { group, row, text, paragraphs, keyValue, links } from '../forms.js';
import { mediaEditor } from '../media.js';

export default function infoView(store) {
  const info = store.data.info;
  const touch = () => store.touch('info');
  const el = h('div', 'pane is-solo');
  const head = h('div', 'pane-head');
  head.append(h('h1', 'pane-title', 'Info'), h('span', 'pane-path', store.path('info')));

  el.append(
    head,
    group('Record',
      row('Name', text(info, 'title', touch)),
      row('Summary', text(info, 'summary', touch, { placeholder: 'One line' })),
      row('Bio', paragraphs(info, 'body', touch, { rows: 10 })),
    ),
    group('Fields', h('p', 'f-note', 'Rows for the record table (Role, Based in, Email…).'), keyValue(info, 'fields', touch)),
    group('Links', links(info, 'links', touch)),
    group('Media', h('p', 'f-note', 'Portrait or other images, shown when Info is wired to a Projector or Preview.'),
      mediaEditor({ list: (info.media ??= []), folder: () => 'media/info', store, onChange: touch })),
  );
  return el;
}
