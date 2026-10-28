export default function mountVideo(item) {
  const el = document.createElement('video');
  el.muted = true;
  el.loop = item.loop ?? true;
  el.autoplay = true;
  el.playsInline = true;
  el.preload = 'auto';
  el.setAttribute('muted', '');
  el.setAttribute('playsinline', '');
  if (item.poster) el.poster = item.poster;
  const ready = new Promise(res => {
    el.addEventListener('loadeddata', res, { once: true });
    el.addEventListener('error', res, { once: true });
  });
  el.src = item.src;
  el.play?.().catch(() => {});
  return {
    el,
    ready,
    dispose() { el.pause(); el.removeAttribute('src'); el.load(); },
  };
}
