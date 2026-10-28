// Counts up on an interval. Wire into an Index to make a slideshow.
export default {
  type: 'clock',
  label: 'Clock',
  group: 'Number',
  outputs: [{ name: 'count', label: 'Count', type: 'number' }],
  params: [
    { key: 'interval', label: 'Seconds', widget: 'stepper', default: 5, min: 1, max: 120 },
    { key: 'run', label: 'Run', widget: 'toggle', default: true },
  ],
  init(node, graph) {
    node.state.count = 0;
    const loop = () => {
      node.state.timer = setTimeout(() => {
        if (node.params.run) {
          node.state.count++;
          graph.changed();
        }
        loop();
      }, Math.max(1, node.params.interval) * 1000);
    };
    loop();
  },
  dispose(node) {
    clearTimeout(node.state.timer);
  },
  evaluate: ({ state }) => ({ count: state.count }),
  readout: n => `count ${n.state.count}`,
};
