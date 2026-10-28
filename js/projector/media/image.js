export default function mountImage(item) {
  const el = new Image();
  el.decoding = 'async';
  el.draggable = false;
  el.alt = item.caption || '';
  const ready = new Promise(res => { el.onload = el.onerror = () => res(); });
  el.src = item.src;
  return { el, ready, dispose() { el.removeAttribute('src'); } };
}
