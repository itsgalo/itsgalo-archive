// One record out of a collection, by index (wraps around).
import { wrap } from '../graph/types.js';

export default {
  type: 'pick',
  label: 'Pick',
  group: 'Select',
  inputs: [
    { name: 'collection', label: 'Records', type: 'collection' },
    { name: 'index', label: 'Index', type: 'number', param: 'index' },
  ],
  outputs: [{ name: 'project', label: 'Record', type: 'project' }],
  params: [{ key: 'index', label: 'Index', widget: 'stepper', default: 0 }],
  evaluate({ in: i, connected, params, state }) {
    const c = i.collection || [];
    state.count = c.length;
    if (!c.length) return { project: null };
    const pos = wrap(connected.index ? i.index ?? 0 : params.index, c.length);
    if (!connected.index) params.index = pos; // keep the widget in range
    state.pos = pos;
    return { project: c[pos] };
  },
  readout: n => (n.out.project ? `${n.state.pos + 1}/${n.state.count} ${n.out.project.title}` : 'empty'),
};
