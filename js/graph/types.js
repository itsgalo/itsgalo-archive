// Socket types and implicit conversions.
//
//   collection  ordered array of projects
//   project     one project record
//   media       { project, index, count, item }  — one resolved media item
//   number      number
//   text        string
//
// An input's `type` may be a string or an array of accepted types.

export const TYPES = ['collection', 'project', 'media', 'number', 'text'];

export function wrap(i, n) {
  return n ? ((Math.round(i) % n) + n) % n : 0;
}

export function toMedia(project, index = 0) {
  const list = project?.media || [];
  if (!list.length) return null;
  const i = wrap(index, list.length);
  return { project, index: i, count: list.length, item: list[i] };
}

const CONVERT = {
  'project>media': p => toMedia(p, 0),
  'media>project': m => m?.project ?? null,
  'collection>project': c => c?.[0] ?? null,
  'project>text': p => p?.title ?? '',
  'number>text': n => (n == null ? '' : String(n)),
};

const listOf = socket => [].concat(socket.type);

export function accepts(input, fromType) {
  return listOf(input).some(t => t === fromType || CONVERT[`${fromType}>${t}`]);
}

export function coerce(value, fromType, input) {
  const types = listOf(input);
  if (types.includes(fromType)) return value;
  for (const t of types) {
    const fn = CONVERT[`${fromType}>${t}`];
    if (fn) return fn(value);
  }
  return null;
}
