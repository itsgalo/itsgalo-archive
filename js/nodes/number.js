// A constant. One value can drive several indices.
export default {
  type: 'number',
  label: 'Number',
  group: 'Number',
  outputs: [{ name: 'value', label: 'Value', type: 'number' }],
  params: [{ key: 'value', label: 'Value', widget: 'stepper', default: 0 }],
  evaluate: ({ params }) => ({ value: params.value }),
};
