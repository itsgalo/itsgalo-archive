// Endpoint: a small projector inside the node itself. Drag the corner to resize.
// Any number of Previews can exist; each can be removed.
import { h } from '../core/dom.js';
import { Projector } from '../projector/Projector.js';

export default {
  type: 'preview',
  label: 'Preview',
  group: 'Output',
  inputs: [{ name: 'media', label: 'Media', type: 'media' }],
  size: { w: 320, h: 180, minW: 160, minH: 90 },
  evaluate({ in: i, state }) {
    state.signal = i.media ?? null;
  },
  view(node) {
    const screen = h('div', 'node-screen');
    const projector = new Projector(screen, { fade: 250 });
    return {
      el: screen,
      update() {
        projector.show(node.state.signal);
        screen.dataset.signal = node.state.signal ? 'on' : 'off';
      },
      dispose() { projector.destroy(); },
    };
  },
  readout: n => {
    const m = n.state.signal;
    return m ? `No. ${m.project.no} · ${m.index + 1}/${m.count} ${m.item.type}` : 'no signal';
  },
};
