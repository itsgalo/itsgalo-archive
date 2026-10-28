// Minimal event emitter. on() returns an unsubscribe function.
export function createEmitter() {
  const map = new Map();
  return {
    on(type, fn) {
      if (!map.has(type)) map.set(type, new Set());
      map.get(type).add(fn);
      return () => map.get(type).delete(fn);
    },
    emit(type, payload) {
      map.get(type)?.forEach(fn => fn(payload));
    },
  };
}
