// Source: the bio record from data/info.json (path set by "info" in site.json).
// Outputs a project-shaped record, so it works with Console, Media, Projector, Preview, Inspect.
export default {
  type: 'info',
  label: 'Info',
  group: 'Source',
  outputs: [{ name: 'record', label: 'Record', type: 'project' }],
  evaluate: ({ ctx }) => ({ record: ctx.info }),
  readout: n => n.out.record?.title ?? 'no info.json',
};
