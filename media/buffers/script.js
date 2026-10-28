// js/fps.js
var FPS = class {
  constructor(targetFPS2, totalFrames) {
    this.targetFPS = targetFPS2;
    this.now;
    this.then = Date.now();
    this.interval = 1e3 / this.targetFPS;
    this.delta;
    this.totalFrames = totalFrames;
    this.frameStep = 0;
    this.loopTime = 0;
    this.totalTime = 0;
    this.cycle = 0;
    this.frames = 0;
    this.ptime = 0;
    this.fps = 0;
  }
  calcFPS(time) {
    this.frames++;
    if (time >= this.ptime + 1e3) {
      this.fps = this.frames * 1e3 / (time - this.ptime);
      this.ptime = time;
      this.frames = 0;
    }
    return this.fps;
  }
  updateFPS(newFPS) {
    this.interval = 1e3 / newFPS;
  }
  stepTime(time) {
    this.now = Date.now();
    this.delta = this.now - this.then;
    this.totalTime++;
  }
  updateTime(time) {
    this.then = this.now - this.delta % this.interval;
    if (this.frameStep > this.totalFrames - 1) {
      this.frameStep = 0;
      this.cycle += 1;
    }
    this.loopTime = this.frameStep / this.totalFrames * (Math.PI * 2);
  }
};

// js/pointer.js
var hasTouch = "ontouchstart" in document.documentElement;
function init(element) {
  const pointer = {
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    pressed: false,
    lastClick: 0,
    doubleClick: function() {
      console.log("double clicked!");
    },
    hasTouch
  };
  function press(x, y, c) {
    let rect = c.getBoundingClientRect();
    pointer.pressed = true;
    pointer.x = x - rect.left;
    pointer.y = y - rect.top;
    let dd = /* @__PURE__ */ new Date();
    let tt2 = dd.getTime();
    const tapLag = 500;
    if (tt2 - pointer.lastClick < tapLag) {
      pointer.doubleClick();
    }
    pointer.lastClick = tt2;
  }
  function move(x, y, c) {
    let rect = c.getBoundingClientRect();
    pointer.x = x - rect.left;
    pointer.y = y - rect.top;
  }
  function release(x, y) {
    pointer.pressed = false;
  }
  if (hasTouch) {
    element.addEventListener("touchstart", function(e) {
      e.preventDefault();
      press(e.touches[0].clientX, e.touches[0].clientY, element);
    });
    element.addEventListener("touchmove", function(e) {
      e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY, element);
    });
    element.addEventListener("touchend", function(e) {
      e.preventDefault();
      pointer.pressed = false;
    });
  } else {
    element.addEventListener("mousedown", function(e) {
      press(e.clientX, e.clientY, element);
    });
    element.addEventListener("mousemove", function(e) {
      move(e.clientX, e.clientY, element);
    });
    element.addEventListener("mouseup", function(e) {
      release(e.clientX, e.clientY);
    });
  }
  return pointer;
}
var pointer_default = { init };

// js/randomAlba.js
var Random = class {
  constructor(hash) {
    this.prng = window.alba.prng(hash);
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    return this.prng();
  }
  // random number between a (inclusive) and b (exclusive)
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  // random integer between a (inclusive) and b (inclusive)
  // requires a < b for proper probability distribution
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  // random boolean with p as percent liklihood of true
  random_bool(p) {
    return this.random_dec() < p;
  }
  // random value in an array of items
  random_choice(list) {
    return list[this.random_int(0, list.length - 1)];
  }
};
var randomAlba_default = Random;

// js/utils.js
function shuffle(array, s) {
  let m = array.length, t, i;
  let seedFunc = function() {
    let x = Math.sin(s++) * 1e4;
    return x - Math.floor(x);
  };
  while (m) {
    i = Math.floor(seedFunc() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// js/riso.js
var colors = {
  BURGUNDY: [145, 78, 114],
  BLUE: [0, 120, 191],
  GREEN: [0, 169, 92],
  MED_BLUE: [50, 85, 164],
  BRIGHT_RED: [241, 80, 96],
  FED_BLUE: [61, 85, 136],
  TEAL: [0, 131, 138],
  ORANGE: [255, 108, 47],
  LIGHT_GRAY: [136, 137, 138],
  YELLOW: [255, 232, 0],
  CRIMSON: [228, 93, 80],
  CORNFLOWER: [98, 168, 229],
  SKYBLUE: [73, 130, 207],
  SEABLUE: [0, 116, 162],
  INDIGO: [72, 77, 122],
  MIDNIGHT: [67, 80, 96],
  MIST: [184, 199, 196],
  STEEL: [55, 95, 119],
  SEAFOAM: [98, 194, 177],
  LAGOON: [47, 97, 101],
  PLUM: [132, 89, 145],
  GRAPE: [108, 93, 128],
  TOMATO: [210, 81, 94],
  SUNFLOWER: [255, 181, 17],
  MELON: [255, 174, 59],
  APRICOT: [246, 160, 77],
  PAPRIKA: [238, 127, 75],
  MAHOGANY: [142, 89, 90],
  BISQUE: [242, 205, 207],
  WINE: [145, 78, 114]
};
function RisoColors(Rand, len) {
  let k = Object.values(colors);
  let p = [];
  let c = shuffle(k, Rand.random_dec(0, 9999));
  for (let i = 0; i < len; i++) {
    p.push(c[i][0], c[i][1], c[i][2]);
  }
  p = p.map((i) => i / 255);
  return p;
}
var riso_default = RisoColors;

// js/shaderHelpers.js
var ShaderBlock = class {
  constructor(g, vs, fs) {
    this.gl = g;
    this.pgm = this.createPGM(g, vs, fs);
    this.fbo;
    this.texture;
    this.bb = new Billboard(this.gl);
  }
  start() {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.useProgram(this.pgm);
  }
  allocate(w, h) {
    const gl = this.gl;
    this.fbo = gl.createFramebuffer();
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
  }
  allocate2(w, h) {
    const gl = this.gl;
    this.fbo = gl.createFramebuffer();
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
  }
  //the different draw functions are there to accomodate different numbers of textures
  draw(pgm) {
    this.bb.draw(pgm, this.texture);
  }
  draw2(pgm, texture2) {
    this.bb.draw2(pgm, this.texture, texture2);
  }
  draw3(pgm, texture2, texture3) {
    this.bb.draw3(pgm, this.texture, texture2, texture3);
  }
  draw4(pgm, texture2, texture3, texture4) {
    this.bb.draw2(pgm, this.texture, texture2, texture3, texture4);
  }
  createPGM(gl, v, f) {
    let program = gl.createProgram();
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.linkProgram(program);
    return program;
  }
};
var ShaderFBO = class {
  constructor(g) {
    this.gl = g;
    this.fbo;
    this.texture;
    this.bb = new Billboard(g);
  }
  start(pgm) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  }
  allocate(w, h) {
    const gl = this.gl;
    this.fbo = gl.createFramebuffer();
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
  }
  allocate2(w, h) {
    const gl = this.gl;
    this.fbo = gl.createFramebuffer();
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
  }
  draw(pgm) {
    this.bb.draw(pgm, this.texture);
  }
  draw2(pgm, texture2) {
    this.bb.draw2(pgm, this.texture, texture2);
  }
  draw3(pgm, texture2, texture3) {
    this.bb.draw3(pgm, this.texture, texture2, texture3);
  }
  draw4(pgm, texture2, texture3, texture4) {
    this.bb.draw2(pgm, this.texture, texture2, texture3, texture4);
  }
};
function blockShader(gl, source, type) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}
function blockProgram(gl, vid, fid) {
  let program = gl.createProgram();
  gl.attachShader(program, vid);
  gl.attachShader(program, fid);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  return program;
}
var Billboard = class {
  constructor(gl) {
    this.gl = gl;
    this.vert = this.gl.createBuffer();
    initBuffer(this.gl, this.vert, [
      -1,
      1,
      0,
      -1,
      -1,
      0,
      1,
      1,
      0,
      1,
      -1,
      0
    ]);
    this.tex = this.gl.createBuffer();
    initBuffer(this.gl, this.tex, [
      0,
      1,
      0,
      0,
      1,
      1,
      1,
      0
    ]);
    this.color = this.gl.createBuffer();
    initBuffer(this.gl, this.color, [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
    ]);
  }
  predraw(pgm) {
    const gl = this.gl;
    gl.useProgram(pgm);
    pgm.vertexPosAttrib = gl.getAttribLocation(pgm, "pos");
    gl.enableVertexAttribArray(pgm.vertexPosAttrib);
    pgm.vertexColorAttrib = gl.getAttribLocation(pgm, "color");
    gl.enableVertexAttribArray(pgm.vertexColorAttrib);
    pgm.vertexTexAttrib = gl.getAttribLocation(pgm, "texcoord");
    gl.enableVertexAttribArray(pgm.vertexTexAttrib);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
    gl.vertexAttribPointer(pgm.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
    gl.vertexAttribPointer(pgm.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
    gl.vertexAttribPointer(pgm.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
  }
  draw(pgm, texture) {
    const gl = this.gl;
    this.predraw(pgm);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex0"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  draw2(pgm, texture1, texture2) {
    const gl = this.gl;
    this.predraw(pgm);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex0"), 0);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex1"), 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  draw3(pgm, texture1, texture2, texture3) {
    const gl = this.gl;
    this.predraw(pgm);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex0"), 0);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex1"), 1);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex2"), 2);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  draw4(pgm, texture1, texture2, texture3, texture4) {
    const gl = this.gl;
    this.predraw(pgm);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex0"), 0);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex1"), 1);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex2"), 2);
    gl.uniform1i(gl.getUniformLocation(pgm, "tex3"), 3);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
};
function initBuffer(gl, buf, dataset) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataset), gl.STATIC_DRAW);
}

// js/gifenc.esm.js
var X = { signature: "GIF", version: "89a", trailer: 59, extensionIntroducer: 33, applicationExtensionLabel: 255, graphicControlExtensionLabel: 249, imageSeparator: 44, signatureSize: 3, versionSize: 3, globalColorTableFlagMask: 128, colorResolutionMask: 112, sortFlagMask: 8, globalColorTableSizeMask: 7, applicationIdentifierSize: 8, applicationAuthCodeSize: 3, disposalMethodMask: 28, userInputFlagMask: 2, transparentColorFlagMask: 1, localColorTableFlagMask: 128, interlaceFlagMask: 64, idSortFlagMask: 32, localColorTableSizeMask: 7 };
function F(t = 256) {
  let e = 0, s = new Uint8Array(t);
  return { get buffer() {
    return s.buffer;
  }, reset() {
    e = 0;
  }, bytesView() {
    return s.subarray(0, e);
  }, bytes() {
    return s.slice(0, e);
  }, writeByte(r) {
    n(e + 1), s[e] = r, e++;
  }, writeBytes(r, o = 0, i = r.length) {
    n(e + i);
    for (let c = 0; c < i; c++)
      s[e++] = r[c + o];
  }, writeBytesView(r, o = 0, i = r.byteLength) {
    n(e + i), s.set(r.subarray(o, o + i), e), e += i;
  } };
  function n(r) {
    var o = s.length;
    if (o >= r)
      return;
    var i = 1024 * 1024;
    r = Math.max(r, o * (o < i ? 2 : 1.125) >>> 0), o != 0 && (r = Math.max(r, 256));
    let c = s;
    s = new Uint8Array(r), e > 0 && s.set(c.subarray(0, e), 0);
  }
}
var O = 12;
var J = 5003;
var lt = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535];
function at(t, e, s, n, r = F(512), o = new Uint8Array(256), i = new Int32Array(J), c = new Int32Array(J)) {
  let x = i.length, a = Math.max(2, n);
  o.fill(0), c.fill(0), i.fill(-1);
  let l = 0, f = 0, g = a + 1, h = g, b = false, w = h, _ = (1 << w) - 1, u = 1 << g - 1, k = u + 1, B = u + 2, p = 0, A = s[0], z = 0;
  for (let y = x; y < 65536; y *= 2)
    ++z;
  z = 8 - z, r.writeByte(a), I(u);
  let d = s.length;
  for (let y = 1; y < d; y++) {
    t: {
      let m = s[y], v = (m << O) + A, M = m << z ^ A;
      if (i[M] === v) {
        A = c[M];
        break t;
      }
      let V = M === 0 ? 1 : x - M;
      for (; i[M] >= 0; )
        if (M -= V, M < 0 && (M += x), i[M] === v) {
          A = c[M];
          break t;
        }
      I(A), A = m, B < 1 << O ? (c[M] = B++, i[M] = v) : (i.fill(-1), B = u + 2, b = true, I(u));
    }
  }
  return I(A), I(k), r.writeByte(0), r.bytesView();
  function I(y) {
    for (l &= lt[f], f > 0 ? l |= y << f : l = y, f += w; f >= 8; )
      o[p++] = l & 255, p >= 254 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0), l >>= 8, f -= 8;
    if ((B > _ || b) && (b ? (w = h, _ = (1 << w) - 1, b = false) : (++w, _ = w === O ? 1 << w : (1 << w) - 1)), y == k) {
      for (; f > 0; )
        o[p++] = l & 255, p >= 254 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0), l >>= 8, f -= 8;
      p > 0 && (r.writeByte(p), r.writeBytesView(o, 0, p), p = 0);
    }
  }
}
var $ = at;
function D(t, e, s) {
  return t << 8 & 63488 | e << 2 & 992 | s >> 3;
}
function G(t, e, s, n) {
  return t >> 4 | e & 240 | (s & 240) << 4 | (n & 240) << 8;
}
function j(t, e, s) {
  return t >> 4 << 8 | e & 240 | s >> 4;
}
function R(t, e, s) {
  return t < e ? e : t > s ? s : t;
}
function T(t) {
  return t * t;
}
function tt(t, e, s) {
  var n = 0, r = 1e100;
  let o = t[e], i = o.cnt, c = o.ac, x = o.rc, a = o.gc, l = o.bc;
  for (var f = o.fw; f != 0; f = t[f].fw) {
    let h = t[f], b = h.cnt, w = i * b / (i + b);
    if (!(w >= r)) {
      var g = 0;
      s && (g += w * T(h.ac - c), g >= r) || (g += w * T(h.rc - x), !(g >= r) && (g += w * T(h.gc - a), !(g >= r) && (g += w * T(h.bc - l), !(g >= r) && (r = g, n = f))));
    }
  }
  o.err = r, o.nn = n;
}
function Q() {
  return { ac: 0, rc: 0, gc: 0, bc: 0, cnt: 0, nn: 0, fw: 0, bk: 0, tm: 0, mtm: 0, err: 0 };
}
function ut(t, e) {
  let s = e === "rgb444" ? 4096 : 65536, n = new Array(s), r = t.length;
  if (e === "rgba4444")
    for (let o = 0; o < r; ++o) {
      let i = t[o], c = i >> 24 & 255, x = i >> 16 & 255, a = i >> 8 & 255, l = i & 255, f = G(l, a, x, c), g = f in n ? n[f] : n[f] = Q();
      g.rc += l, g.gc += a, g.bc += x, g.ac += c, g.cnt++;
    }
  else if (e === "rgb444")
    for (let o = 0; o < r; ++o) {
      let i = t[o], c = i >> 16 & 255, x = i >> 8 & 255, a = i & 255, l = j(a, x, c), f = l in n ? n[l] : n[l] = Q();
      f.rc += a, f.gc += x, f.bc += c, f.cnt++;
    }
  else
    for (let o = 0; o < r; ++o) {
      let i = t[o], c = i >> 16 & 255, x = i >> 8 & 255, a = i & 255, l = D(a, x, c), f = l in n ? n[l] : n[l] = Q();
      f.rc += a, f.gc += x, f.bc += c, f.cnt++;
    }
  return n;
}
function H(t, e, s = {}) {
  let { format: n = "rgb565", clearAlpha: r = true, clearAlphaColor: o = 0, clearAlphaThreshold: i = 0, oneBitAlpha: c = false } = s;
  if (!t || !t.buffer)
    throw new Error("quantize() expected RGBA Uint8Array data");
  if (!(t instanceof Uint8Array) && !(t instanceof Uint8ClampedArray))
    throw new Error("quantize() expected RGBA Uint8Array data");
  let x = new Uint32Array(t.buffer), a = s.useSqrt !== false, l = n === "rgba4444", f = ut(x, n), g = f.length, h = g - 1, b = new Uint32Array(g + 1);
  for (var w = 0, u = 0; u < g; ++u) {
    let C = f[u];
    if (C != null) {
      var _ = 1 / C.cnt;
      l && (C.ac *= _), C.rc *= _, C.gc *= _, C.bc *= _, f[w++] = C;
    }
  }
  T(e) / w < 0.022 && (a = false);
  for (var u = 0; u < w - 1; ++u)
    f[u].fw = u + 1, f[u + 1].bk = u, a && (f[u].cnt = Math.sqrt(f[u].cnt));
  a && (f[u].cnt = Math.sqrt(f[u].cnt));
  var k, B, p;
  for (u = 0; u < w; ++u) {
    tt(f, u, false);
    var A = f[u].err;
    for (B = ++b[0]; B > 1 && (p = B >> 1, !(f[k = b[p]].err <= A)); B = p)
      b[B] = k;
    b[B] = u;
  }
  var z = w - e;
  for (u = 0; u < z; ) {
    for (var d; ; ) {
      var I = b[1];
      if (d = f[I], d.tm >= d.mtm && f[d.nn].mtm <= d.tm)
        break;
      d.mtm == h ? I = b[1] = b[b[0]--] : (tt(f, I, false), d.tm = u);
      var A = f[I].err;
      for (B = 1; (p = B + B) <= b[0] && (p < b[0] && f[b[p]].err > f[b[p + 1]].err && p++, !(A <= f[k = b[p]].err)); B = p)
        b[B] = k;
      b[B] = I;
    }
    var y = f[d.nn], m = d.cnt, v = y.cnt, _ = 1 / (m + v);
    l && (d.ac = _ * (m * d.ac + v * y.ac)), d.rc = _ * (m * d.rc + v * y.rc), d.gc = _ * (m * d.gc + v * y.gc), d.bc = _ * (m * d.bc + v * y.bc), d.cnt += y.cnt, d.mtm = ++u, f[y.bk].fw = y.fw, f[y.fw].bk = y.bk, y.mtm = h;
  }
  let M = [];
  var V = 0;
  for (u = 0; ; ++V) {
    let L = R(Math.round(f[u].rc), 0, 255), C = R(Math.round(f[u].gc), 0, 255), Y = R(Math.round(f[u].bc), 0, 255), E = 255;
    if (l) {
      if (E = R(Math.round(f[u].ac), 0, 255), c) {
        let st = typeof c == "number" ? c : 127;
        E = E <= st ? 0 : 255;
      }
      r && E <= i && (L = C = Y = o, E = 0);
    }
    let K = l ? [L, C, Y, E] : [L, C, Y];
    if (xt(M, K) || M.push(K), (u = f[u].fw) == 0)
      break;
  }
  return M;
}
function xt(t, e) {
  for (let s = 0; s < t.length; s++) {
    let n = t[s], r = n[0] === e[0] && n[1] === e[1] && n[2] === e[2], o = n.length >= 4 && e.length >= 4 ? n[3] === e[3] : true;
    if (r && o)
      return true;
  }
  return false;
}
function nt(t, e, s = "rgb565") {
  if (!t || !t.buffer)
    throw new Error("quantize() expected RGBA Uint8Array data");
  if (!(t instanceof Uint8Array) && !(t instanceof Uint8ClampedArray))
    throw new Error("quantize() expected RGBA Uint8Array data");
  if (e.length > 256)
    throw new Error("applyPalette() only works with 256 colors or less");
  let n = new Uint32Array(t.buffer), r = n.length, o = s === "rgb444" ? 4096 : 65536, i = new Uint8Array(r), c = new Array(o), x = s === "rgba4444";
  if (s === "rgba4444")
    for (let a = 0; a < r; a++) {
      let l = n[a], f = l >> 24 & 255, g = l >> 16 & 255, h = l >> 8 & 255, b = l & 255, w = G(b, h, g, f), _ = w in c ? c[w] : c[w] = gt(b, h, g, f, e);
      i[a] = _;
    }
  else {
    let a = s === "rgb444" ? j : D;
    for (let l = 0; l < r; l++) {
      let f = n[l], g = f >> 16 & 255, h = f >> 8 & 255, b = f & 255, w = a(b, h, g), _ = w in c ? c[w] : c[w] = bt(b, h, g, e);
      i[l] = _;
    }
  }
  return i;
}
function gt(t, e, s, n, r) {
  let o = 0, i = 1e100;
  for (let c = 0; c < r.length; c++) {
    let x = r[c], a = x[3], l = q(a - n);
    if (l > i)
      continue;
    let f = x[0];
    if (l += q(f - t), l > i)
      continue;
    let g = x[1];
    if (l += q(g - e), l > i)
      continue;
    let h = x[2];
    l += q(h - s), !(l > i) && (i = l, o = c);
  }
  return o;
}
function bt(t, e, s, n) {
  let r = 0, o = 1e100;
  for (let i = 0; i < n.length; i++) {
    let c = n[i], x = c[0], a = q(x - t);
    if (a > o)
      continue;
    let l = c[1];
    if (a += q(l - e), a > o)
      continue;
    let f = c[2];
    a += q(f - s), !(a > o) && (o = a, r = i);
  }
  return r;
}
function q(t) {
  return t * t;
}
function ct(t = {}) {
  let { initialCapacity: e = 4096, auto: s = true } = t, n = F(e), r = 5003, o = new Uint8Array(256), i = new Int32Array(r), c = new Int32Array(r), x = false;
  return { reset() {
    n.reset(), x = false;
  }, finish() {
    n.writeByte(X.trailer);
  }, bytes() {
    return n.bytes();
  }, bytesView() {
    return n.bytesView();
  }, get buffer() {
    return n.buffer;
  }, get stream() {
    return n;
  }, writeHeader: a, writeFrame(l, f, g, h = {}) {
    let { transparent: b = false, transparentIndex: w = 0, delay: _ = 0, palette: u = null, repeat: k = 0, colorDepth: B = 8, dispose: p = -1 } = h, A = false;
    if (s ? x || (A = true, a(), x = true) : A = Boolean(h.first), f = Math.max(0, Math.floor(f)), g = Math.max(0, Math.floor(g)), A) {
      if (!u)
        throw new Error("First frame must include a { palette } option");
      pt(n, f, g, u, B), it(n, u), k >= 0 && dt(n, k);
    }
    let z = Math.round(_ / 10);
    wt(n, p, z, b, w);
    let d = Boolean(u) && !A;
    ht(n, f, g, d ? u : null), d && it(n, u), yt(n, l, f, g, B, o, i, c);
  } };
  function a() {
    ft(n, "GIF89a");
  }
}
function wt(t, e, s, n, r) {
  t.writeByte(33), t.writeByte(249), t.writeByte(4), r < 0 && (r = 0, n = false);
  var o, i;
  n ? (o = 1, i = 2) : (o = 0, i = 0), e >= 0 && (i = e & 7), i <<= 2;
  let c = 0;
  t.writeByte(0 | i | c | o), S(t, s), t.writeByte(r || 0), t.writeByte(0);
}
function pt(t, e, s, n, r = 8) {
  let o = 1, i = 0, c = Z(n.length) - 1, x = o << 7 | r - 1 << 4 | i << 3 | c, a = 0, l = 0;
  S(t, e), S(t, s), t.writeBytes([x, a, l]);
}
function dt(t, e) {
  t.writeByte(33), t.writeByte(255), t.writeByte(11), ft(t, "NETSCAPE2.0"), t.writeByte(3), t.writeByte(1), S(t, e), t.writeByte(0);
}
function it(t, e) {
  let s = 1 << Z(e.length);
  for (let n = 0; n < s; n++) {
    let r = [0, 0, 0];
    n < e.length && (r = e[n]), t.writeByte(r[0]), t.writeByte(r[1]), t.writeByte(r[2]);
  }
}
function ht(t, e, s, n) {
  if (t.writeByte(44), S(t, 0), S(t, 0), S(t, e), S(t, s), n) {
    let r = 0, o = 0, i = Z(n.length) - 1;
    t.writeByte(128 | r | o | 0 | i);
  } else
    t.writeByte(0);
}
function yt(t, e, s, n, r = 8, o, i, c) {
  $(s, n, e, r, t, o, i, c);
}
function S(t, e) {
  t.writeByte(e & 255), t.writeByte(e >> 8 & 255);
}
function ft(t, e) {
  for (var s = 0; s < e.length; s++)
    t.writeByte(e.charCodeAt(s));
}
function Z(t) {
  return Math.max(Math.ceil(Math.log2(t)), 1);
}

// js/app.js
function app(features) {
  let grid = [];
  let pts = [];
  let DOTSIZE = "1.0";
  let divider = 64;

  const { seed = features.hash || window.alba._testSeed(), isRenderer } = window.alba.params;
  const hash = seed;
  const R2 = new randomAlba_default(hash);
  
  const minRes = Math.min(window.innerHeight, window.innerWidth) / 5.5;
  const margin = 0;
  const flowAngle = R2.random_choice(["4.0", "6.0", "180.0", "180.0"]);
  const flowWidth = R2.random_choice(["50.0", "75.0"]);
  const flowRadius = R2.random_choice(["0.1", "0.01", "0.05"]);
  const maskMultiplier = R2.random_choice(["4.0", "4.0", "40.0", "100.0", "400.0", "900.0"]);
  const saturation = R2.random_choice(["1.0", "1.0", "1.0", "1.0", "1.0", "1.2"]);
  const res = features.res || R2.random_choice(['32.0', '64.0', '128.0', '128.0', '128.0', '128.0', minRes.toString()]);
  const vertFlow = R2.random_choice(["-0.5", "-0.6", "-0.8", "-0.4"]);
  const xFlow = R2.random_choice(["0.25", "0.75", "0.75", "0.75", "0.75", "0.75"]);
  const xWidth = R2.random_choice(["0.5", "1.0", "1.5", "2.0"]);
  const rseed = R2.random_dec() * 9999;
  const totalColors = R2.random_int(5, 10);
  const palette = riso_default(R2, totalColors);
  alba.setMetadata({
    flow_angle: flowAngle,
    flow_radius: flowRadius,
    flow_speed: vertFlow,
    brush_density: maskMultiplier,
    saturation,
    grid_Resolution: res,
    total_colors: totalColors
  });
  console.log(window.alba.params);
  const basevs = `
    attribute vec3 pos;
    attribute vec4 color;
    attribute vec2 texcoord;
    varying vec4 vColor;
    varying vec2 tc;
    varying vec2 vUv;
    void main() {
    gl_Position = vec4(pos, 1.0);
    tc = texcoord;
    vColor = color;
    vUv = 0.5 * (pos.xy + 1.0);
    }`;
  const basefs = `
    #ifdef GL_ES
    precision mediump float;
    precision mediump sampler2D;
    #endif
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform vec2 ur;
    varying vec2 vUv;
    void main() {
    vec2 uv = gl_FragCoord.xy/ur.xy;
    vec4 c = texture2D(tex0,vUv);
    gl_FragColor = c;
    }`;
  const postfs = `
    #ifdef GL_ES
    precision mediump float;
    precision mediump sampler2D;
    #endif
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform vec2 ur;
    uniform float seed;
    uniform int tot;
    uniform float px;
    varying vec4 vColor;
    varying vec2 tc;
    varying vec2 vUv;
    uniform vec3 palette[10];
    const float PI = 3.141592653;
    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0., -1./3.,2./3.,-1.);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    vec3 cc(vec3 color) {
        vec3 targetHSV = rgb2hsv(color);

        vec3 closest = palette[0];
        float minDist = 999.0;
    
        //float dmin = distance(idealColor, color0);
    
        for (int i = 0; i < ${totalColors}; i++) {
            vec3 col = palette[i];
            vec3 colHSV = rgb2hsv(col);
            
            float dr = abs(color.r - col.r);
            float dg = abs(color.g - col.g);
            float db = abs(color.b - col.b);
            
            float dist = sqrt(dr * dr + dg * dg + db * db);
            
            if (dist < minDist) {
                closest = col;
                minDist = dist;
            }
        }
        return closest;
    }
    float rcount = 2.0;
    float gcount = 2.0;
    float bcount = 2.0;
    float acount = 1.0;
    float b[4];
    const float bSize = 2.0; //2x2, 4x4
    float bDivider = bSize * bSize;
    vec4 nc(vec4 incolor) {
        vec4 rgbaCounts = vec4(rcount, gcount, bcount, acount);
        vec4 color = incolor;
        color.r = (floor((rgbaCounts.r - 1.0) * color.r + 0.5) / (rgbaCounts.r - 1.0));
        color.g = (floor((rgbaCounts.g - 1.0) * color.g + 0.5) / (rgbaCounts.g - 1.0));
        color.b = (floor((rgbaCounts.b - 1.0) * color.b + 0.5) / (rgbaCounts.b - 1.0));
        color.a = 1.0;
        float newcolor = length(color.rgb * vec3(0.2126,0.7152,0.0722));
        vec4 grey = vec4(newcolor, newcolor, newcolor, 1.0);
        return color;
    }
    float indexValue(int idx) {
        int x = int(mod(gl_FragCoord.x, 2.0));
        int y = int(mod(gl_FragCoord.y, 2.0));
        if(x < 4){
            if (idx == 0) return b[0] / 16.0;
            if (idx == 1) return b[1] / 16.0;
            if (idx == 2) return b[2] / 16.0;
            if (idx == 3) return b[3] / 16.0;
        }
    }
    float greyscale(vec3 c, float s) {
        float g = dot(c, vec3(.299,.587,.114));
        return g * s;
    }
    float rd(vec2 px) {
        const float a1 = 0.75487766624669276;
        const float a2 = 0.569840290998;
        return fract(a1 * px.x + a2 * px.y);
    }
    float dither(vec2 st, float c, float gr) {
        float nz = (2.0/gr) * (rd(st)) + c - (1.0/gr);
        float l = clamp(floor(gr * nz) / (gr-1.0), 0.0, 1.0);
        return l;
    }
    void main(void) {
    b[0] = 0.0;
    b[1] = 2.0;
    b[2] = 3.0;
    b[3] = 1.0;
    float dot=px;
    vec2 pxBin=gl_FragCoord.xy/dot;
    vec2 tiles=ur.xy/dot;
    vec2 uvBin=floor(pxBin)/tiles;    
    vec4 inColor=texture2D(tex0,uvBin);
    float gray=8.;
    vec2 xyPos=floor(pxBin);//floor(mod(pxBin.xy, bSize));
    vec3 dith=vec3(dither(xyPos, inColor.r, gray), dither(xyPos, inColor.g, gray), dither(xyPos, inColor.b, gray));
    vec2 entry=mod(pxBin.xy,vec2(bSize,bSize));
    int idx=int(entry.y)*int(bSize)+int(entry.x);
    vec3 rgb=(nc(vec4(inColor.rgb,1.)+6.5*(indexValue(idx)/bDivider)).rgb);
    gl_FragColor=vec4(cc(mix(inColor.rgb+rgb.rgb,inColor.rgb+dith.rgb,.5)), 1.);
    }
    `;
  const noisefs = `
    #ifdef GL_ES
    precision mediump float;
    precision mediump sampler2D;
    #endif

    uniform float ut;
    uniform vec2 ur;
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform float seed;
    uniform float px;
    uniform vec2 pts[512];

    const float PI = 3.141592653;

    //4D simplex noise functions.
    //Author : Ian McEwan, Ashima Arts.
    vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0; }
    float mod289(float x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0; }

    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+10.0)*x);
    }
    float permute(float x) {
        return mod289(((x*34.0)+10.0)*x);
    }
    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    float taylorInvSqrt(float r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    vec4 grad4(float j, vec4 ip) {
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p,s;

        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

        return p;
    }
    #define F4 0.309016994374947451
    float snoise(vec4 v)
    {
    const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                            0.276393202250021,  // 2 * G4
                            0.414589803375032,  // 3 * G4
                        -0.447213595499958); // -1 + 4 * G4

    vec4 i  = floor(v + dot(v, vec4(F4)) );
    vec4 x0 = v -   i + dot(i, C.xxxx);
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
                i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
            + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

    }
    const int octaves = 4;
    float fbm(vec2 vuv) {
    float amp = .5;
    float freq = 2.;
    float value = 0.;
    vec2 shift = vec2(10.);
    mat2 rot = mat2(cos(.5), sin(.5), -sin(.5), cos(.5));
    for(int i=0;i<octaves;i++) {
        value +=amp*snoise(vec4(freq*vuv.x+seed,freq*vuv.y+seed,.01*cos(ut),.01*sin(ut)));
        vuv =rot*vuv*2.+shift;
        amp *=.6;
        freq *=1.;
    }
    return pow(value*1.,1.);
    }
    vec3 sat(vec3 rgb, float i) {
        vec3 L=vec3(.2125,.7154,.0721);
        vec3 gr=(vec3(dot(rgb, L)));
        return mix(gr,rgb,i);
    }
    vec2 map(vec2 value,vec2 inMin,vec2 inMax,vec2 outMin,vec2 outMax) {
        return outMin+(outMax-outMin)*(value-inMin)/(inMax-inMin);
    }
    vec2 ca(vec2 coord,float a) {
        float an=PI/a;
        float ina=atan(coord.y,coord.x);
        float newa=floor(ina/an+.5)*an;
        float l=length(coord);
        vec2 t=vec2(cos(newa),sin(newa)) * l;
        return t;
    }
    vec2 field(vec2 coord,vec2 dims) {
    float x=coord.x;
    float y=coord.y;
    vec2 vel=vec2(0.);
    float q=3.;
    float inv = -1.;
    for(int idx=0; idx<16; idx++) {
        inv*=-1.;
        vec2 pos=pts[idx];
        float h=float(idx)/16.;
        vec2 pt=pos-coord+(vec2(cos(ut+h*5.)*${flowRadius}, sin(ut+h*5.)*${flowRadius}));
        pt*=q/(dot(pt, pt));
        vel+=pt*inv*h;
    }
    return map(vel, vec2(-1.0), vec2(${flowWidth}), vec2(0.0), vec2(12.0));
    }
    void main() {
    vec2 uv=gl_FragCoord.xy/ur.xy;
    float aspect=ur.y/ur.x;
    float dot=floor(ur.y/${res});
    vec2 pxBin=gl_FragCoord.xy/dot;
    vec2 tiles=ur.xy/dot;
    vec2 vuv=floor(pxBin)/tiles;
    vec4 incolor=texture2D(tex1,vuv);
    vec4 color=texture2D(tex1,vuv);
    float m=smoothstep(-.5,.5,fbm(vuv*${maskMultiplier}));
    vec2 flow;
    float x=0.;
    if (${xFlow}>.5) {
        x=field(vec2(vuv.x,vuv.y*aspect),ur).x*fbm(4.*vuv)*${xWidth};
    } else {
        x=field(vec2(vuv.x,vuv.y*aspect),ur).x*.25+fbm(4.*vuv);
    }
    float y=${vertFlow}+fbm(4.*vuv+vec2(999.,5.));
    flow=vec2(x*.01,y*.01);
    float offsetx=1./ur.x;
    incolor=texture2D(tex0,uv-ca(flow,${flowAngle})*m);
    vec3 cir=vec3(0.);
    float gx=floor(uv.x*ur.x);
    float gy=floor(uv.y*ur.y);
    float step=mod(gx+gx+gx,4.);
    if (mod(gx,4.)==step) cir=vec3(1.,1.,0.);
    if (mod(gy,4.) == step) cir = vec3(0.,1.,1.);
    color.rgb-=cir;
    vec4 final=mix(vec4(color.rgb,1.),vec4(sat(incolor.rgb,${saturation}),1.),.99);
    gl_FragColor=final;
    }`;

  const canvas = document.createElement("canvas");
  canvas.id = "canvas2D";
  document.body.appendChild(canvas);
  document.body.style.backgroundColor = 'rgb(0, 0, 0)'; //`rgb(${palette[6] * 255},${palette[7] * 255},${palette[8] * 255})`;
  let devicePixelRatio = window.devicePixelRatio || 1;
  let w, h;
  window.innerHeight <= window.innerWidth ? (w = Math.max(window.innerHeight, 1) * 0.75, h = Math.max(window.innerHeight, 1)) : (w = Math.max(window.innerWidth, 1), h = Math.max(window.innerWidth, 1) / 0.75);

  if (isRenderer) {
    canvas.width = Math.floor(w / 8) * 8;
    canvas.height = Math.floor(h / 8) * 8;
  } else {
    canvas.width = Math.floor(w / divider) * divider;
    canvas.height = Math.floor(h / divider) * divider;
  }


  const gl = canvas.getContext("webgl", { antialias: false, preserveDrawingBuffer: true, premultipliedAlpha: false, alpha: true });
  canvas.style.imageRendering = "pixelated";
  canvas.imageSmoothingEnabled = false;
  let floatTextures = gl.getExtension("OES_texture_float");
  let basev, basef, noisef, ditherf, postf, ppgm, post, lastf, baseBlock, feedback, program;
  const drawCan = document.createElement("canvas");
  const ctx = drawCan.getContext("2d", { alpha: true });
  drawCan.style.imageRendering = "pixelated";
  drawCan.imageSmoothingEnabled = false;
  drawCan.width = canvas.width / 4;
  drawCan.height = canvas.height / 4;
  let drawAspect = drawCan.width / drawCan.height;
  const gridImg = gl.createTexture();
  const pointer = pointer_default.init(canvas);
  pointer.doubleClick = function() {
    fs++;
    fullscreen();
    console.log(fs);
  };
  const fps = new FPS(30, 90);
  let saveframes = false;
  let fs = 1;
  let imgs = [];
  let hasBeenCaptured = false;
  window.addEventListener("resize", winResize);
  document.addEventListener("keydown", keyPress);
  function start() {
    genGrid(rseed, drawCan.width, drawCan.height);
    initGL();
    initBlocks();
    requestAnimationFrame(loop);
    console.log(`
        BUFFERS by Galo Canizares (b. 1989)
        all rights reserved
        `);
  }
  function initGL() {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(1, 1, 1, 1);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  function initBlocks() {
    basev = blockShader(gl, basevs, gl.VERTEX_SHADER);
    basef = blockShader(gl, basefs, gl.FRAGMENT_SHADER);
    noisef = blockShader(gl, noisefs, gl.FRAGMENT_SHADER);
    postf = blockShader(gl, postfs, gl.FRAGMENT_SHADER);
    ppgm = blockProgram(gl, basev, basef);
    baseBlock = new ShaderBlock(gl, basev, noisef);
    baseBlock.allocate(canvas.width, canvas.height);
    feedback = new ShaderFBO(gl);
    feedback.allocate(canvas.width, canvas.height);
    post = new ShaderBlock(gl, basev, postf);
    post.allocate(canvas.width, canvas.height);
    lastf = new ShaderFBO(gl);
    lastf.allocate(canvas.width, canvas.height);
    gl.useProgram(post.pgm);
    gl.uniform2fv(gl.getUniformLocation(post.pgm, "ur"), [canvas.width, canvas.height]);
    gl.useProgram(baseBlock.pgm);
    gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm, "ur"), [canvas.width, canvas.height]);
    initDrawCtx();
    loop();
  }
  function divideRect(x, y, w2, h2, n) {
    if (n == 0) {
      ctx.save();
      ctx.fillStyle = ["#000000", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ffffff", "#0000ff"][Math.floor(R2.random_num(0, 8))];
      ctx.fillRect(x, y, w2, h2);
      ctx.restore();
    }
    n--;
    if (n >= 0) {
      if (w2 >= h2) {
        let randomW = R2.random_num(w2 * 0.3, w2 * 0.7);
        divideRect(x, y, randomW, h2, n);
        divideRect(x + randomW, y, w2 - randomW, h2, n);
      }
      if (w2 < h2) {
        let randomH = R2.random_num(h2 * 0.3, h2 * 0.7);
        divideRect(x, y, w2, randomH, n);
        divideRect(x, y + randomH, w2, h2 - randomH, n);
      }
    }
  }
  function genGrid(seed2, width, height) {
    grid = [];
    pts = [];
    ctx.clearRect(0, 0, drawCan.width, drawCan.height);
    for (let i = 0; i < 36; i++) {
      grid.push([R2.random_num(-0.2, 1.2), R2.random_num(-0.2, 1.2)]);
    }
    grid = shuffle(grid, seed2).slice(0, 36);
    for (let i = 0; i < 16; i++) {
      if (grid[i] != void 0) {
        pts.push(-99, -99);
      } else {
        pts.push(-99, -99);
      }
    }
  }
  function initDrawCtx() {
    divideRect(margin - 0, margin - 0, drawCan.width - 2 * margin, drawCan.height - 2 * margin, 8);
    gridImg.image = drawCan;
    gl.bindTexture(gl.TEXTURE_2D, gridImg);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawCan);
  }
  function cloneCanvas(can) {
    let ncan = document.createElement("canvas");
    let nctx = ncan.getContext("2d");
    ncan.width = can.width;
    ncan.height = can.height;
    nctx.drawImage(can, 0, 0);
    return ncan;
  }
  function fullscreen() {
    if (fs % 2 == 0) {
      canvas.width = Math.floor(window.innerWidth / divider) * divider;
      canvas.height = Math.floor(window.innerHeight / divider) * divider;
      drawCan.width = canvas.width / 4;
      drawCan.height = canvas.height / 4;
    } else {
      window.innerHeight <= window.innerWidth ? (w = Math.max(window.innerHeight, 1) * 0.75, h = Math.max(window.innerHeight, 1)) : (w = Math.max(window.innerWidth, 1), h = Math.max(window.innerWidth, 1) / 0.75);
      canvas.width = Math.floor(w / divider) * divider;
      ;
      canvas.height = Math.floor(h / divider) * divider;
      drawCan.width = canvas.width / 4;
      drawCan.height = canvas.height / 4;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    post.allocate(canvas.width, canvas.height);
    feedback.allocate(canvas.width, canvas.height);
    lastf.allocate(canvas.width, canvas.height);
    baseBlock.allocate(canvas.width, canvas.height);
    gl.useProgram(post.pgm);
    gl.uniform2fv(gl.getUniformLocation(post.pgm, "ur"), [canvas.width, canvas.height]);
    gl.useProgram(baseBlock.pgm);
    gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm, "ur"), [canvas.width, canvas.height]);
  }
  function winResize() {
    fullscreen();
  }
  function setDotSize(d) {
    DOTSIZE = d;
  }
  function addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, "0");
  }
  function saveAsImage() {
    let imgData, imgNode;
    try {
      let str = "image/png";
      imgData = canvas.toDataURL(str, 1);
      saveFile(imgData.replace(str, "image/octet-stream"), "BUFFERS-" + hash + ".png");
    } catch (e) {
      console.log(e);
      return;
    }
  }
  function saveAsFrame(num) {
    let imgData, imgNode;
    try {
      let str = "image/png";
      imgData = canvas.toDataURL(str, 1);
      saveFile(imgData.replace(str, "image/octet-stream"), "BUFFERS-" + addLeadingZeros(num, 3) + ".png");
    } catch (e) {
      console.log(e);
      return;
    }
  }
  function saveFile(strData, filename) {
    let link = document.createElement("a");
    if (typeof link.download === "string") {
      document.body.appendChild(link);
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link);
    } else {
      location.replace(uri);
    }
  }
  function download(buf, filename, type) {
    const blob = buf instanceof Blob ? buf : new Blob([buf], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
  }
  function openWindow() {
    console.log('open')
    const link = document.createElement("a");
    link.href = '/';
    link.target = '_blank';
    link.click();
  }
  async function makeGIF() {
    const gif = ct();
    for (let i = 0; i < fps.totalFrames; i++) {
      const context = imgs[i].getContext("2d");
      const data = context.getImageData(0, 0, imgs[i].width, imgs[i].height).data;
      const format = "rgb444";
      const palette2 = H(data, 10, { format });
      const index = nt(data, palette2, format);
      gif.writeFrame(index, imgs[i].width, imgs[i].height, { palette: palette2, delay: 30 });
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    gif.finish();
    const buffer = gif.bytesView();
    download(buffer, "BUFFERS-" + hash + ".gif", { type: "image/gif" });
  }
  function keyPress(e) {
    if (e.key === "1") {
      DOTSIZE = "1.0";
    }
    if (e.key === "2") {
      DOTSIZE = "2.0";
    }
    if (e.key === "3") {
      DOTSIZE = "4.0";
    }
    if (e.key === "s") {
      saveAsImage();
    }
    if (e.key === "o") {
      openWindow();
    }
    if (e.key === "z") {
      fps.updateFPS(3);
      fps.frameStep = 0;
      saveframes = true;
    }
    if (e.key === "q") {
      fps.updateFPS(30);
      saveframes = false;
    }
    if (e.key === "g") {
      if (imgs.length == fps.totalFrames) {
        makeGIF();
      } else {
        alert("Not all frames recorded, yet. Please let the canvas run for a bit longer. For best results let the piece run for at least 10 seconds.");
      }
    }
    if (e.key === "f") {
      document.body.requestFullscreen();
    }
  }
  start();
  function loop(time) {
    fps.stepTime(time);
    if (fps.delta > fps.interval) {
      fps.updateTime(time);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < grid.length; i++) {
        let idx = i * 2;
        pts[idx] = grid[i][0];
        pts[idx + 1] = grid[i][1];
      }
      gl.useProgram(baseBlock.pgm);
      gl.uniform1f(gl.getUniformLocation(baseBlock.pgm, "px"), DOTSIZE);
      gl.uniform1f(gl.getUniformLocation(baseBlock.pgm, "ut"), fps.loopTime);
      gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm, "ur"), [canvas.width, canvas.height]);
      gl.uniform1f(gl.getUniformLocation(baseBlock.pgm, "seed"), rseed);
      gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm, "pts"), pts);
      gl.useProgram(post.pgm);
      gl.uniform2fv(gl.getUniformLocation(post.pgm, "ur"), [canvas.width, canvas.height]);
      gl.uniform3fv(gl.getUniformLocation(post.pgm, "palette"), palette);
      gl.uniform1f(gl.getUniformLocation(post.pgm, "px"), DOTSIZE);
      gl.uniform1f(gl.getUniformLocation(post.pgm, "seed"), rseed);
      gl.uniform1i(gl.getUniformLocation(post.pgm, "tot"), totalColors);
      gl.uniform2fv(gl.getUniformLocation(post.pgm, "pts"), pts);
      gl.clear(gl.COLOR_BUFFER_BIT);
      baseBlock.start();
      gl.clear(gl.COLOR_BUFFER_BIT);
      feedback.draw2(baseBlock.pgm, gridImg);
      post.start();
      gl.clear(gl.COLOR_BUFFER_BIT);
      baseBlock.draw(post.pgm);
      feedback.start();
      gl.clear(gl.COLOR_BUFFER_BIT);
      baseBlock.draw(ppgm);
      lastf.start();
      gl.clear(gl.COLOR_BUFFER_BIT);
      post.draw2(post.pgm, ppgm.texture);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      post.draw(ppgm);
      imgs[fps.frameStep] = cloneCanvas(canvas);
      if (fps.totalTime > 2e3 && hasBeenCaptured == false) {
        console.log("preview trigger!");
        alba.setComplete(true);
        hasBeenCaptured = true;
      }
      fps.frameStep++;
      if (saveframes) {
        saveAsFrame(fps.frameStep);
      }
      let out = "";
      out += "Frame Rate: " + Math.round(fps.calcFPS(time)) + "\n";
      out += "Total Time: " + Math.round(fps.totalTime) + "\n";
      out += "Frame: " + Math.round(fps.frameStep) + "\n";
      out += "Cycle: " + Math.round(fps.cycle) + "\n";
      //document.querySelector("#stats").innerHTML = out;
    }
    requestAnimationFrame(loop);
  }
}

//url params
let queryString = new URLSearchParams(window.location.search);
let features = {
    hash: queryString.get('hash') || window.alba.params.seed,
    res: queryString.get('res')
}

window.addEventListener('load', function(){
  app(features);
});
