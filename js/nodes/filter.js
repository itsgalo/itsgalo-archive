// Keep records carrying a tag.
export default {
  type: 'filter',
  label: 'Filter',
  group: 'Collection',
  inputs: [{ name: 'collection', label: 'Records', type: 'collection' }],
  outputs: [{ name: 'collection', label: 'Records', type: 'collection' }],
  params: [
    {
      key: 'from', label: 'From', widget: 'select', default: '*',
      options: ctx => [['*', 'Any'], ...ctx.years.map(y => [String(y), String(y)])],
    },
    {
      key: 'to', label: 'To', widget: 'select', default: '*',
      options: ctx => [['*', 'Any'], ...ctx.years.map(y => [String(y), String(y)])],
    },
    {
      key: 'tag', label: 'Tag', widget: 'select', default: '*',
      options: ctx => [['*', 'All'], ...ctx.tags.map(t => [t, t])],
    },
  ],
  evaluate({ in: i, params, state }) {
    const c = i.collection || [];
    state.inCount = c.length;
    const from = params.from === '*' ? -Infinity : Number(params.from);
    const to = params.to === '*' ? Infinity : Number(params.to);
    const [lo, hi] = from <= to ? [from, to] : [to, from]; // tolerate a reversed range
    return {
      collection: c.filter(p =>
        (params.tag === '*' || p.tags.includes(params.tag)) &&
        (lo === -Infinity && hi === Infinity || (p.year != null && p.year >= lo && p.year <= hi))),
    };
  },
  readout: n => `${n.out.collection?.length ?? 0} of ${n.state.inCount ?? 0} records`,
};
