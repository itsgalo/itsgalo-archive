//stalkers by galo canizares (b.1989)
//2021

//generative traits
const colorPalettes = {
  beachy: ["f4f1de","e07a5f","3d405b","81b29a","f2cc8f"],
  minty: ["006d77","83c5be","edf6f9","ffddd2","e29578"],
  firey: ["003049","d62828","f77f00","fcbf49","eae2b7"],
  midcentury: ["3d5a80","98c1d9","e0fbfc","ee6c4d","293241"],
  candy: ["ef476f","ffd166","06d6a0","118ab2","073b4c"],
  breezy: ["05668d","028090","00a896","02c39a","f0f3bd"],
  party: ["9b5de5","f15bb5","fee440","00bbf9","00f5d4"],
};

const palettes = Object.keys(colorPalettes);
const st = parseInt(fxrand() * 3);
const ns = parseInt(fxrand() * 3);
const brushes = parseInt(fxrand()*400) + 5;

window.$fxhashFeatures = {
  "palette": palettes[parseInt(palettes.length * fxrand())],
  "weight": ["light", "medium", "heavy"][st],
  "gesture": ["slow", "moderate", "fast"][ns],
  "brushes": brushes,
}

//sketch core vars
let shaderA;
let can, bufferA;
let seed;
let items;
let shapes = [];

function preload(){
  // load the shader
  shaderA = loadShader('shader.vert', 'bayer.frag');
}

function setup() {
  can = createCanvas(windowWidth, windowHeight, WEBGL);
  bufferA = createGraphics(windowWidth, windowHeight);
  //dont forget pixel density!
  pixelDensity(1);
  bufferA.pixelDensity(1);

  seed = getHash(fxhash);
  items = brushes;
  //sets the same noise for the sketch
  noiseSeed(items);

  background(items, items, items);

  // Distribute shapes evenly across the canvas
  const cols = Math.ceil(Math.sqrt(items * width / height));
  const rows = Math.ceil(items / cols);

  // Create all available grid cells
  let cells = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({ col, row });
    }
  }

  // Shuffle cells so any unused cells are spread randomly
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(fxrand() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  for (let i = 0; i < items; i++) {
    const cell = cells[i];

    const x = (cell.col + fxrand()) * width / cols;
    const y = (cell.row + fxrand()) * height / rows;

    shapes.push(
      new shape(x, y, (st + 1) * 20 * sin(i), palette())
    );
  }
  
  console.log(window.$fxhashFeatures.palette);
  console.log(window.$fxhashFeatures.weight);
  console.log(window.$fxhashFeatures.gesture);
  console.log(window.$fxhashFeatures.brushes);
}

function draw() {

  background(255, 0, 0);

  shader(shaderA);
  shaderA.setUniform("tex0", bufferA);
  //shaderA.setUniform("palette", palette);
  shaderA.setUniform("u_resolution", [width, height]);
  rect(0, 0, 10, 10);


  for (let i = 0; i < shapes.length; i++) {
    shapes[i].update();
    shapes[i].show();
  }
}

function palette() {
  let p = colorPalettes[window.$fxhashFeatures.palette];
  let colorFromArray = p[parseInt(fxrand() * 5)];
  let c = color('#' + colorFromArray);
  c.setAlpha(10.0);
  return c;
}

function shape(x, y, dia, c) {

  let xoff = x;
  let yoff = y;

  this.posX = x;
  this.posY = y;
  this.diameter = dia;
  this.col = c;

  this.update = function() {
    xoff += (ns + 1) / 20;
    yoff += ((ns + 1) * 4) / 10;

    this.posX = x +
      (noise(xoff * 0.15) - 0.5) * width / (ns + 4);

    this.posY = y +
      (noise(yoff * ((ns + 1) * 2) / 10) - 0.5) * height / (ns + 4);
  }

  this.show = function() {
    bufferA.noStroke();
    bufferA.fill(this.col);
    bufferA.ellipse(this.posX, this.posY, this.diameter, this.diameter);
  }
}

function getHash(string) {
  if (string) {
    let nameHash = string.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(nameHash);
  } else {
    return null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  save(frameCount + ".png");
}
