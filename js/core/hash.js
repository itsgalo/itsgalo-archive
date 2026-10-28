// URL hash <-> flat object. Uses replaceState so graph changes don't flood history.
export function readHash() {
  return Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
}

let last = null;
export function writeHash(obj) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) if (v != null && v !== '') params.set(k, v);
  const str = params.toString();
  if (str === last) return;
  last = str;
  history.replaceState(null, '', str ? `#${str}` : location.pathname + location.search);
}
