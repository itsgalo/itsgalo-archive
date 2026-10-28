// h('div', 'class names', 'text') -> element. Text is always set via textContent.
export function h(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text != null) el.textContent = text;
  return el;
}

// Offset of `el` relative to `root` (an offsetParent ancestor), ignoring transforms.
export function offsetWithin(el, root) {
  let x = root.clientLeft, y = root.clientTop;
  while (el && el !== root) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent;
  }
  return { x, y };
}
