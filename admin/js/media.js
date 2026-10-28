// Media list editor, shared by Projects and Info.

import { h } from '../../js/core/dom.js';
import { btn, text, select, repeater, row } from './forms.js';

export function guessType(src = '') {
  if (/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(src)) return 'video';
  if (/\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i.test(src)) return 'image';
  if (/\.html?(\?|#|$)/i.test(src) || /^https?:/i.test(src)) return 'iframe';
  return 'image';
}

// Site-relative paths are resolved from /admin/.
export const siteURL = src => (!src ? '' : /^(https?:|data:|blob:|\/)/.test(src) ? src : `../${src}`);

const local = new WeakMap(); // item -> blob URL of a just-picked file (thumbnail before it exists on the server)

function thumb(item) {
  const box = h('div', 'm-thumb');
  const src = local.get(item)?.[item.src] || siteURL(item.type === 'video' && item.poster ? item.poster : item.src);
  if (!item.src) {
    box.append(h('span', null, 'No file'));
  } else if (item.type === 'iframe') {
    box.append(h('span', null, 'Frame'));
  } else if (item.type === 'video' && !item.poster) {
    const v = h('video');
    v.muted = true;
    v.preload = 'metadata';
    v.src = src;
    box.append(v);
  } else {
    const img = h('img');
    img.src = src;
    img.alt = '';
    img.onerror = () => box.replaceChildren(h('span', 'is-missing', 'Missing'));
    box.append(img);
  }
  return box;
}

function filePicker(accept, onFile) {
  const input = h('input');
  input.type = 'file';
  input.accept = accept;
  input.hidden = true;
  input.addEventListener('change', () => { if (input.files[0]) onFile(input.files[0]); input.value = ''; });
  const b = btn('File…', () => input.click(), 'btn');
  b.append(input);
  return b;
}
// Pick many files at once; each is copied (if connected) and appended to `list`.
// Files are added in natural name order (img-2 before img-10); paths already in the list are skipped.
export function batchButton({ list, folder, store, onDone, label = 'Batch upload…' }) {
  const input = h('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*,video/*';
  input.hidden = true;
  input.addEventListener('change', async () => {
    const files = [...input.files].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    input.value = '';
    if (!files.length) return;
    let added = 0;
    for (const [i, file] of files.entries()) {
      store.log(`adding ${i + 1}/${files.length}: ${file.name}`);
      const src = await store.importMedia(file, folder());
      if (list.some(m => m.src === src)) continue;
      const item = { type: guessType(file.name), src };
      local.set(item, { [src]: URL.createObjectURL(file) });
      list.push(item);
      added++;
    }
    store.log(`added ${added} of ${files.length} file(s) to ${folder()}/` +
      (store.dir ? '' : ' (not connected: copy the files there yourself)'));
    if (added) onDone();
  });
  const b = btn(label, () => input.click(), 'btn btn-add');
  b.append(input);
  return b;
}

// folder(): where picked files are copied, e.g. "media/slow-life"
export function mediaEditor({ list, folder, store, onChange }) {
  return repeater({
    list,
    addLabel: 'Add media',
    empty: 'No media. The projector shows nothing for this record.',
    create: () => ({ type: 'image', src: '' }),
    onChange,
    render(item, i, redraw) {
      item.fit ??= 'contain'; // always write fit explicitly
      const box = h('div', 'm-item');
      const fields = h('div', 'm-fields');
      let preview = thumb(item);

      const refresh = () => { const t = thumb(item); preview.replaceWith(t); preview = t; posterRow.hidden = item.type !== 'video'; };
      const changed = () => { refresh(); onChange(); };

      const pick = key => filePicker(key === 'poster' ? 'image/*' : 'image/*,video/*,.html', async file => {
        const path = await store.importMedia(file, folder());
        item[key] = path;
        local.set(item, { ...local.get(item), [path]: URL.createObjectURL(file) });
        if (key === 'src') item.type = guessType(file.name);
        onChange();
        redraw();
      });

      const src = text(item, 'src', changed, { placeholder: 'media/project/file.jpg or https://…' });
      src.addEventListener('change', () => {
        const t = guessType(item.src);
        if (t !== item.type) { item.type = t; type.value = t; changed(); }
      });
      const type = select(item, 'type', [['image', 'Image'], ['video', 'Video'], ['iframe', 'Frame']], changed);
      const srcCell = h('div', 'f-inline');
      srcCell.append(src, pick('src'));
      const posterCell = h('div', 'f-inline');
      posterCell.append(text(item, 'poster', changed, { placeholder: 'Still shown while the video loads' }), pick('poster'));
      const posterRow = row('Poster', posterCell);
      posterRow.hidden = item.type !== 'video';

      fields.append(
        row('Type', type),
        row('Source', srcCell),
        posterRow,
        row('Caption', text(item, 'caption', onChange)),
        row('Fit', select(item, 'fit', [['cover', 'Cover (fill screen)'], ['contain', 'Contain (whole image)']], onChange)),
      );
      box.append(preview, fields);
      return box;
    },
  });
}
