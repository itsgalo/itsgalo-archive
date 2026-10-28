export default function mountIframe(item) {
  const el = document.createElement('iframe');
  el.title = item.caption || 'Embedded work';
  el.allow = item.allow || 'fullscreen; autoplay';
  const ready = new Promise(res => el.addEventListener('load', res, { once: true }));
  el.src = item.src;
  return { el, ready, dispose() { el.src = 'about:blank'; } };
}
