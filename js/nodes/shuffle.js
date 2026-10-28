// Seeded shuffle. Same seed, same order.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default {
  type: 'shuffle',
  label: 'Shuffle',
  group: 'Collection',
  inputs: [
    { name: 'collection', label: 'Records', type: 'collection' },
    { name: 'seed', label: 'Seed', type: 'number', param: 'seed' },
  ],
  outputs: [{ name: 'collection', label: 'Records', type: 'collection' }],
  params: [{ key: 'seed', label: 'Seed', widget: 'stepper', default: 1 }],
  evaluate({ in: i, connected, params }) {
    const out = [...(i.collection || [])];
    const rand = rng((connected.seed ? i.seed : params.seed) * 2654435761);
    for (let k = out.length - 1; k > 0; k--) {
      const j = Math.floor(rand() * (k + 1));
      [out[k], out[j]] = [out[j], out[k]];
    }
    return { collection: out };
  },
  readout: n => (n.out.collection?.length ? `first: ${n.out.collection[0].title}` : 'empty'),
};
