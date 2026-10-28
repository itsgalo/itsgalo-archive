// Sink: whatever media reaches this input is shown full-screen.
export default {
  type: 'projector',
  label: 'Projector',
  group: 'Output',
  sink: true,
  unique: true,
  inputs: [{ name: 'media', label: 'Media', type: 'media' }],
  evaluate({ in: i, sinks, state }) {
    sinks.projector = state.signal = i.media ?? null;
  },
  readout: n => {
    const m = n.state.signal;
    return m ? `No. ${m.project.no} · ${m.index + 1}/${m.count}` : 'no signal';
  },
};
