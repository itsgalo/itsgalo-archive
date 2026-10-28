//surfers by galo canizares (b.1989)

let queryString = new URLSearchParams(window.location.search);

let can, pg, bg, sh, w, h;
let seed = 3333;
let t = 0;
let FRAMES = parseInt(queryString.get("seconds")) || 10;

const R = Math.floor(fxrand()*999);
const CH = Math.floor(fxrand()*360);
const CB = Math.floor(fxrand()*90);
const BG = Math.floor(fxrand()*360);
const RES = Math.floor(fxrand()*4);
const PXSEL = Math.floor(fxrand()*4);
const DISEL = Math.floor(fxrand()*6);
const XRES = [18, 48, 96, 192][RES];
const YRES = [24, 64, 128, 256][RES];
const SOFT = fxrand() > 0.8;
const POLY = fxrand() > 0.5;
const PIXRES = YRES * 3;
const MARGIN = [4, 8, 10, 20][RES];
const S = [1.0, 0.5, 0.1, 4.0, 0.0, 0.125][DISEL];//1.0 - punch card, 0.5 - woven, 0.1 - noise, 0.0 - wave

const palette = new Array(
  [169, 51, 0],
  [255, 170, 0],
  [0, 207, 145],
  [32, 45, 133],
  [169, 51, 0],
  [255, 170, 0],
  [0, 207, 145],
  [32, 45, 133],
  [245, 245, 184],
  [255, 183, 82]
);

window.$fxhashFeatures = {
  "x-resolution": XRES,
  "y-resolution": YRES,
  "dither size": PIXRES,
  "dither mode": ["punch card", "wave", "noise", "hatch", "scan", "silicon"][DISEL],
  "smooth": SOFT
};

function preload() {
  sh = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  frameRate(15);
  window.innerHeight <= window.innerWidth ? (w = max(window.innerHeight, 1) * 0.75, h = max(window.innerHeight, 1)) : (w = max(window.innerWidth, 1), h = max(window.innerWidth, 1) / 0.75);
  can = createCanvas(floor(w), floor(h), WEBGL);
  pg = createGraphics(XRES, YRES);
  pixelDensity(1);
  pg.pixelDensity(1);
  SOFT ? noSmooth() : smooth();
  tex = can.getTexture(pg);
  tex.setInterpolation(NEAREST, NEAREST);
  
  colorMode(HSB);
  bg = color(BG, 100, 100);
  pg.background(bg);
  console.log("surfers by itsgalo", "\nhash: "+fxhash+"\n", window.$fxhashFeatures)
}

function draw() {
  t = frameCount * 0.1 % 15;
  shader(sh);
  sh.setUniform("u_resolution", [width, height]);
  sh.setUniform("tex0", pg);
  sh.setUniform("res", PIXRES);
  sh.setUniform("seed", S);
  sh.setUniform("time", frameCount*0.01);
  sh.setUniform("palette0", palette[0]);
  sh.setUniform("palette1", palette[1]);
  sh.setUniform("palette2", palette[2]);
  sh.setUniform("palette3", palette[3]);
  sh.setUniform("palette4", palette[4]);
  sh.setUniform("palette5", palette[5]);
  sh.setUniform("palette6", palette[6]);
  sh.setUniform("palette7", palette[7]);
  sh.setUniform("palette8", palette[8]);
  sh.setUniform("palette9", palette[9]);
  rect(-width/2, -height/2, width, height);
  
  drawPixel();
  pg.stroke(bg);
  pg.noFill();
  pg.strokeWeight(MARGIN);
  pg.rect(0, 0, pg.width, pg.height);
  noStroke();
}

function drawPixel() {
  pg.loadPixels();
  for(let x = 0; x < pg.width; x+=1) {
    for(let y = 0; y < pg.height; y+=1) {
      let co;
      if (round(rand(R+round(sin(t)), 19)) == 1) {
        if (POLY) {
          co = color(CH, 100, fxrand()*100);
        } else {
          co = color(CH, 100, CB);
        }
      } else {
        co = bg;
      }
      pg.set(floor(x), floor(y*t), co);
    }
  }
  pg.updatePixels();
}

function rand(m, a) {
  seed = (a * seed + 1) % m;
  return seed / m;
}

function keyPressed() {
  if (key == 's') {
    saveGif("surfers-"+fxhash, FRAMES);
  }
}