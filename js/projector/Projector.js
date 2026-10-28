// Full-screen media display with two layers. New media loads into the hidden
// layer and fades in on top once ready; the old layer is cleared after the fade.

import image from './media/image.js';
import video from './media/video.js';
import iframe from './media/iframe.js';

const HANDLERS = { image, video, iframe };

export class Projector {
  constructor(root, { fade = 450, timeout = 5000, handlers = {} } = {}) {
    this.root = root;
    this.fade = fade;
    this.timeout = timeout;
    this.handlers = { ...HANDLERS, ...handlers };
    this.front = 0;
    this.key = null;
    this.token = 0;
    root.classList.add('projector');
    root.style.setProperty('--fade', `${fade}ms`);
    this.layers = [0, 1].map(() => {
      const el = document.createElement('div');
      el.className = 'projector-layer';
      root.append(el);
      return { el, dispose: null };
    });
  }

  static keyOf(media) {
    return media ? `${media.project?.id}:${media.index}` : '';
  }

  show(media) {
    const key = Projector.keyOf(media);
    if (key === this.key) return;
    this.key = key;
    const token = ++this.token;
    const back = this.layers[1 - this.front];
    this.clear(back);
    if (!media?.item) return this.swap(token);

    const mount = this.handlers[media.item.type] || this.handlers.image;
    const { el, ready, dispose } = mount(media.item);
    back.el.dataset.fit = media.item.fit || 'cover';
    back.el.dataset.type = media.item.type;
    back.el.append(el);
    back.dispose = dispose;

    const timeout = new Promise(res => setTimeout(res, this.timeout));
    Promise.race([ready, timeout]).then(() => this.swap(token));
  }

  swap(token) {
    if (token !== this.token) return;
    const prev = this.layers[this.front];
    this.front = 1 - this.front;
    const next = this.layers[this.front];
    prev.el.classList.replace('is-active', 'is-leaving');
    next.el.classList.add('is-active');
    setTimeout(() => { if (token === this.token) this.clear(prev); }, this.fade);
  }

  destroy() {
    this.token++;
    this.layers.forEach(l => this.clear(l));
  }

  clear(layer) {
    layer.dispose?.();
    layer.dispose = null;
    layer.el.replaceChildren();
    layer.el.classList.remove('is-active', 'is-leaving');
  }
}
