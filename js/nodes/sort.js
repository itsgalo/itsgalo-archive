// Order records by a key.
const KEYS = {
  year: p => p.year ?? 0,
  title: p => (p.title || '').toLowerCase(),
  no: p => p.no,
};

export default {
  type: 'sort',
  label: 'Sort',
  group: 'Collection',
  inputs: [{ name: 'collection', label: 'Records', type: 'collection' }],
  outputs: [{ name: 'collection', label: 'Records', type: 'collection' }],
  params: [
    { key: 'by', label: 'By', widget: 'select', default: 'year', options: [['year', 'Year'], ['title', 'Title'], ['no', 'Number']] },
    { key: 'order', label: 'Order', widget: 'select', default: 'desc', options: [['desc', 'Descending'], ['asc', 'Ascending']] },
  ],
  evaluate({ in: i, params }) {
    const key = KEYS[params.by] || KEYS.year;
    const dir = params.order === 'asc' ? 1 : -1;
    const sorted = [...(i.collection || [])].sort((a, b) => {
      const x = key(a), y = key(b);
      return x < y ? -dir : x > y ? dir : 0;
    });
    return { collection: sorted };
  },
  readout: n => (n.out.collection?.length ? `first: ${n.out.collection[0].title}` : 'empty'),
};
