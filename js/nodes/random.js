// A random whole number between Min and Max (inclusive). Holds its value until
// Roll is pressed or the range changes, so other graph edits don't reshuffle it.
// A new number is drawn on every page load.
export default {
  type: 'random',
  label: 'Random',
  group: 'Number',
  outputs: [{ name: 'value', label: 'Value', type: 'number' }],
  params: [
    { key: 'min', label: 'Min', widget: 'stepper', default: 0 },
    { key: 'max', label: 'Max', widget: 'stepper', default: 99 },
    { key: 'roll', label: 'Roll', widget: 'button', text: 'Roll', default: 0 },
  ],
  evaluate({ params, state }) {
    const lo = Math.min(params.min, params.max), hi = Math.max(params.min, params.max);
    const key = `${lo}:${hi}:${params.roll}`;
    if (state.key !== key) {
      state.key = key;
      state.value = lo + Math.floor(Math.random() * (hi - lo + 1));
    }
    return { value: state.value };
  },
  readout: n => `value ${n.state.value ?? ''}`,
};