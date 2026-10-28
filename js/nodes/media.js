// One media item from a record, by index (wraps around).
import { toMedia } from '../graph/types.js';

export default {
  type: 'media',
  label: 'Media',
  group: 'Select',
  inputs: [
    { name: 'project', label: 'Record', type: 'project' },
    { name: 'index', label: 'Index', type: 'number', param: 'index' },
  ],
  outputs: [{ name: 'media', label: 'Media', type: 'media' }],
  params: [{ key: 'index', label: 'Index', widget: 'stepper', default: 0 }],
  evaluate({ in: i, connected, params }) {
    const media = toMedia(i.project, connected.index ? i.index ?? 0 : params.index);
    if (media && !connected.index) params.index = media.index;
    return { media };
  },
  readout: n => {
    const m = n.out.media;
    return m ? `${m.index + 1}/${m.count} ${m.item.type}` : 'empty';
  },
};
