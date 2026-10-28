// Sink: prints a record, a media item (record + caption), or plain text in the Console panel.
export default {
  type: 'console',
  label: 'Console',
  group: 'Output',
  sink: true,
  unique: true,
  inputs: [{ name: 'data', label: 'Input', type: ['media', 'project', 'text'] }],
  evaluate({ in: i, sinks }) {
    sinks.console = i.data ?? null;
  },
};
