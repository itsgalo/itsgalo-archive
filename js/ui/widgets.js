// Parameter widgets. Each returns { el, set(value), disable(bool) }.
// Widget kinds are named by `param.widget` in a node definition.

import { h } from '../core/dom.js';

function button(cls, text) {
  const b = h('button', cls, text);
  b.type = 'button';
  return b;
}

const WIDGETS = {
  select(param, ctx, onChange) {
    const wrap = h('span', 'widget widget-select');
    const sel = h('select');
    const opts = typeof param.options === 'function' ? param.options(ctx) : param.options;
    for (const [value, label] of opts) {
      const o = h('option', null, label);
      o.value = value;
      sel.append(o);
    }
    sel.addEventListener('change', () => onChange(sel.value));
    wrap.append(sel);
    return {
      el: wrap,
      set(v) { if (sel.value !== String(v)) sel.value = v; },
      disable(b) { sel.disabled = b; wrap.classList.toggle('is-disabled', b); },
    };
  },

  stepper(param, ctx, onChange) {
    const wrap = h('span', 'widget widget-stepper');
    const dec = button('widget-btn', '−');
    const inc = button('widget-btn', '+');
    const inp = h('input', 'widget-num');
    inp.type = 'text';
    inp.inputMode = 'numeric';
    inp.spellcheck = false;
    const step = param.step ?? 1;
    const clamp = v => Math.min(param.max ?? Infinity, Math.max(param.min ?? -Infinity, v));
    let value = param.default ?? 0;

    const commit = raw => {
      const v = clamp(Number(raw));
      if (!Number.isFinite(v)) { inp.value = value; return; }
      value = v;
      inp.value = v;
      onChange(v);
    };
    dec.addEventListener('click', () => commit(value - step));
    inc.addEventListener('click', () => commit(value + step));
    inp.addEventListener('change', () => commit(inp.value));
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') { commit(value + step); e.preventDefault(); }
      if (e.key === 'ArrowDown') { commit(value - step); e.preventDefault(); }
      if (e.key === 'Enter') inp.blur();
    });
    wrap.append(dec, inp, inc);
    return {
      el: wrap,
      set(v) { value = v; if (document.activeElement !== inp) inp.value = v; },
      disable(b) {
        dec.disabled = inc.disabled = inp.disabled = b;
        wrap.classList.toggle('is-disabled', b);
      },
    };
  },

  toggle(param, ctx, onChange) {
    const b = button('widget widget-toggle');
    let value;
    const set = v => {
      value = !!v;
      b.textContent = value ? param.on || 'On' : param.off || 'Off';
      b.setAttribute('aria-pressed', value);
    };
    b.addEventListener('click', () => { set(!value); onChange(value); });
    set(param.default);
    return {
      el: b,
      set,
      disable(d) { b.disabled = d; b.classList.toggle('is-disabled', d); },
    };
  },

  // Momentary button: each click bumps the param's count, which triggers a re-evaluation.
  button(param, ctx, onChange) {
    const b = button('widget widget-toggle', param.text || param.label);
    let count = param.default ?? 0;
    b.addEventListener('click', () => onChange(++count));
    return {
      el: b,
      set(v) { count = v ?? 0; },
      disable(d) { b.disabled = d; b.classList.toggle('is-disabled', d); },
    };
  },
};

export function createWidget(param, ctx, onChange) {
  return (WIDGETS[param.widget] || WIDGETS.stepper)(param, ctx, onChange);
}
