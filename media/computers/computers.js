//computers by galo canizares (b.1989)

let can, ppg, w, h;
let sh, tex;
let t = 0;
let bg;
let totalFrames = 120;
let pause = false;

//randoms
function rand(rmin,rmax){
  return (rmax - rmin) * fxrand() + rmin;
}

function rand_choice(arr, weight){
  let sum = 0;
  for (let i = 0; i < weight.length; i++) sum += weight[i];
  let p = fxrand()*sum;
  for(let i = 0; i < weight.length; i++){
      p -= weight[i];
      if (p <= 0) return arr[i];
  }
}

const paletteSelector = parseInt(fxrand()*7);
const spread = rand_choice([1, 5, 10, 15],[1, 1, 1, 1]);
const computation = rand_choice(["babbage", "turing", "lovelace", "archimedes", "al-jazari", "wozniak", "hopper", "backus"], [1, 1, 1, 1, 1, 1, 1, 1]);
const panels = rand_choice([0, 1, 2, 3], [4, 1, 1, 1]);
const seed = fxrand()*99999;
const offset = rand_choice([0.2, 0.2, 0.3], [1, 1, 1]);

function fbm(iterations, x, y, persistence, scale, low, high, ct) {
  let maxAmp = 0;
  let amp = 1;
  let freq = scale;
  let bnoise = 0;
  
  //loop through frequencies
  for (let i = 0; i < iterations; i++) {
    bnoise += noise(x * freq, y * freq, ct) * amp;
    maxAmp += amp;
    amp *= persistence;
    freq *= 2;
  }
  
  bnoise /= maxAmp;
  bnoise = bnoise * (high-low) / 2 + (high+low) / 2;
  return bnoise;
}

const colorPalettes = {
  poster: [[0, 48, 73],
  [214, 40, 40],
  [247, 127, 0],
  [252, 191, 73],
  [234, 226, 183],
  [244, 241, 222],
  [224, 122, 95],
  [61, 64, 91],
  [129, 178, 154],
  [242, 204, 143]],
  riso: [[145, 78, 114],
  [0, 120, 191],
  [0, 169, 92],
  [241, 80, 96],
  [118, 91, 167],
  [255, 102, 94],
  [255, 232, 0],
  [210, 81, 94],
  [255, 108, 47],
  [210, 81, 94]],
  sumeria: [[0, 18, 25],
  [0, 95, 115],
  [10, 147, 150],
  [148, 210, 189],
  [233, 216, 166],
  [238, 155, 0],
  [202, 103, 2],
  [187, 62, 3],
  [174, 32, 18],
  [155, 34, 38]],
  inca: [[214, 64, 69],
  [233, 255, 249],
  [158, 216, 219],
  [70, 117, 153],
  [29, 51, 84],
  [21, 96, 100],
  [0, 196, 154],
  [248, 225, 108],
  [255, 194, 180],
  [251, 143, 103]],
  artifact: [[61, 49, 91],
  [68, 75, 110],
  [112, 139, 117],
  [154, 184, 122],
  [248, 249, 145],
  [58, 46, 57],
  [30, 85, 92],
  [244, 216, 205],
  [237, 177, 131],
  [241, 81, 82]],
  loom: [[255, 205, 178],
  [255, 180, 162],
  [229, 152, 155],
  [181, 131, 141],
  [109, 104, 117],
  [188, 212, 222],
  [165, 204, 209],
  [160, 185, 191],
  [157, 172, 178],
  [148, 155, 160]],
  game: [[95, 99, 79],
  [155, 196, 203],
  [207, 235, 223],
  [226, 250, 219],
  [219, 239, 188],
  [245, 253, 198],
  [245, 195, 150],
  [208, 177, 122],
  [168, 159, 104],
  [65, 82, 31]]
};

const palettes = Object.keys(colorPalettes);
const palette = colorPalettes[palettes[paletteSelector]];

window.$fxhashFeatures = {
  "palette": palettes[paletteSelector],
  "computation": computation,
  "panels": ["full", "vertical half", "horizontal half", "thirds"][panels]
};

function col() {
  let p = rand_choice(["#ff5500","#00ff55","#5500ff","#ffff55","#55ffff","#ff55ff"], [1, 1, 1, 1, 1, 1]);
  let c = color(p);
  return c;
}

function preload() {
  sh = loadShader("vert.vert", "bayer.frag");
}

function setup() {
  frameRate(30);
  window.innerHeight <= window.innerWidth ? (w = max(window.innerHeight, 1) * 0.75, h = max(window.innerHeight, 1)) : (w = max(window.innerWidth, 1), h = max(window.innerWidth, 1) / 0.75);
  can = createCanvas(w, h, WEBGL);
  pixelDensity(1);
  ppg = createGraphics(75, 100);
  ppg.pixelDensity(1);  
  
  ppg.clear();
  //ppg.background(255);
  ppg.noStroke();
  background(255);
  fill(0);
  tex = can.getTexture(ppg);
  tex.setInterpolation(NEAREST, NEAREST);
  
  randomSeed(seed);
  noiseSeed(seed);

  bg = col();

  license();
  console.log(window.$fxhashFeatures);
}

function draw() {
  t = (1.0 * frameCount / totalFrames) * (TWO_PI);
  clear();
  shader(sh);
  sh.setUniform("u_resolution", [width, height]);
  sh.setUniform("tex0", ppg);
  sh.setUniform("spread", spread);
  sh.setUniform("offset", offset);
  sh.setUniform("palette0", window.$fxhashFeatures.palette[0]);
  sh.setUniform("palette1", palette[1]);
  sh.setUniform("palette2", palette[2]);
  sh.setUniform("palette3", palette[3]);
  sh.setUniform("palette4", palette[4]);
  sh.setUniform("palette5", palette[5]);
  sh.setUniform("palette6", palette[6]);
  sh.setUniform("palette7", palette[7]);
  sh.setUniform("palette8", palette[8]);
  sh.setUniform("palette9", palette[9]);
  rect(-width, -height, width, height);
  
//(["babbage", "turing", "lovelace", "archimedes", "al-jazari", "wozniak", "hopper", "backus"]);

  ppg.loadPixels();
  for (let y = 0; y < ppg.height; y++) {
    for (let x = 0; x < ppg.width; x++) {
      let c;
      // formula to get each pixels rgba
      let index = (x + y * ppg.width) * 4;
      if (computation == "babbage") {
        c = fbm(4, ((x+seed)/0.01), (y)/1.9, 0.75, 0.05, -100, 100, t*0.1);
      } else if (computation == "turing") {
        c = fbm(16, tan((x+seed)/0.01), (y)/1.9, 0.75, 0.05, -100, 100, t*0.1);
      } else if (computation == "lovelace") {
        c = fbm(8, sin((x+seed)/0.01), (y)/.05, 0.75, 0.05, -100, 100, t*0.1);
      } else if (computation == "archimedes") {
        c = fbm(8, cos((x+seed)/2.0), (y)/4.0, 0.95, 0.02, -100, 100, t*0.1);
      } else if (computation == "al-jazari") {
        c = fbm(16, tan((x+10)/10.0), (y)/0.5, 0.75, 0.05, -100, 100, t*0.1);
      } else if (computation == "wozniak") {
        c = fbm(6, sin((x+11)/5.0), (y)/5.0, 0.75, 0.05, -100, 100, t*0.1);
      } else if (computation == "hopper") {
        c = fbm(16, ((x+seed)/10.5), (y)/0.09, 0.75, 0.05, -100, 100, t*0.1);
      } else {
        c = fbm(4, tan(tan(x+11)/0.01), (y)/2.0, 0.75, 0.05, -100, 100, t*0.1);
      }
      
      
      ppg.pixels[index + 3] = 255;
      
      if (c > 0 && c <= 10) {
        ppg.pixels[index + 0] = 200;
        ppg.pixels[index + 1] = 0;
        ppg.pixels[index + 2] = 0;
      } else if (c > 10 && c <= 20) {
        ppg.pixels[index + 0] = 0;
        ppg.pixels[index + 1] = 200;
        ppg.pixels[index + 2] = 0;
      } else if (c > 20 && c <= 30) {
        ppg.pixels[index + 0] = 0;
        ppg.pixels[index + 1] = 0;
        ppg.pixels[index + 2] = 200;
      } else if (c > 30 && c <= 40) {
        ppg.pixels[index + 0] = 200;
        ppg.pixels[index + 1] = 200;
        ppg.pixels[index + 2] = 0;
      } else if (c > 40 && c <= 50) {
        ppg.pixels[index + 0] = 0;
        ppg.pixels[index + 1] = 200;
        ppg.pixels[index + 2] = 200;
      } else if (c > 50 && c <= 60) {
        ppg.pixels[index + 0] = 200;
        ppg.pixels[index + 1] = 0;
        ppg.pixels[index + 2] = 200;
      } else if (c > 60 && c <= 70) {
        ppg.pixels[index + 0] = 200;
        ppg.pixels[index + 1] = 0;
        ppg.pixels[index + 2] = 0;
      } else if (c > 70 && c <= 80) {
        ppg.pixels[index + 0] = 0;
        ppg.pixels[index + 1] = 200;
        ppg.pixels[index + 2] = 0;
      } else if (c > 80 && c <= 90) {
        ppg.pixels[index + 0] = 200;
        ppg.pixels[index + 1] = 0;
        ppg.pixels[index + 2] = 200;
      } else if (c > 90 && c <= 100) {
        ppg.pixels[index + 0] = 200;
        ppg.pixels[index + 1] = 0;
        ppg.pixels[index + 2] = 0;
      }
    }
  }
  ppg.updatePixels();
  ppg.noFill();
  ppg.stroke(bg);
  ppg.strokeWeight(10);
  ppg.rect(0, 0, ppg.width, ppg.height);
  ppg.strokeWeight(6);
  if (panels == 1) {
    ppg.rect(1, 0, floor(ppg.width/2), ppg.height);
  } else if (panels == 2) {
    ppg.rect(0, floor(ppg.height/2), ppg.width, floor(ppg.height));
  } else if (panels == 3) {
    ppg.rect(0, floor(ppg.height/3), ppg.width, floor(ppg.height/3));
  }
  //image(ppg, -width/2, -height/2, width, height);
  if (frameCount == 10) {
    fxpreview();
  }
}

function setPause() {
  pause = !pause;
  pause ? noLoop() : loop();
}

function mousePressed() {
  setPause();
}

function keyPressed() {
  if (key === 's') {
    save("computers_"+fxhash+".png");
  }
  if (key === 'p') {
    setPause();
  }
}

const license = () => {
  console.log("computers by galo canizares (b.1989)");
  console.log("(c) all copyrights reserved");
}
