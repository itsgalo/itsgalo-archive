// Source: every record in projects.json, in file order.
export default {
  type: 'archive',
  label: 'Archive',
  group: 'Source',
  outputs: [{ name: 'collection', label: 'Records', type: 'collection' }],
  evaluate: ({ ctx }) => ({ collection: ctx.projects }),
  readout: n => `${n.out.collection?.length ?? 0} records`,
};
