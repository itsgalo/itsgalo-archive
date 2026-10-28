//jugglers by galo canizares (b. 1989)
//minted on fxhash.xyz
//2021

let seed;
let items;
let shapes = [];
let can;

// Clamp number between two values with the following line:
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function preload(){
  // load the shader
  shaderB = loadShader('shader.vert', 'shader.frag');
}

function setup() {

  colorMode(HSB);
  can = createCanvas(windowWidth, windowHeight);
  bufferB = createGraphics(windowWidth, windowHeight, WEBGL);
  bufferB.pixelDensity(1);

  seed = getHash(fxhash);
  items = genItems();
  //sets the same noise for the sketch
  noiseSeed(items);
  sm = items/width;

  background(items, items, items);
  for (let i = 0; i < items; i++) {
    shapes.push(new shape((width/5)+(width/i), (width/5)+(height/i), 50*sin(i), color(i, items, items, 1)));
  }
}

function draw() {
  // console.log(items);

  bufferB.shader(shaderB);
  shaderB.setUniform("tex0", can);
  shaderB.setUniform("tex1", bufferB);
  shaderB.setUniform("time", frameCount * 0.01);
  shaderB.setUniform("u_resolution", [windowWidth, windowHeight]);

  bufferB.rect(-width/2, -height/2, width, height);

  image(bufferB, 0, 0, width, height);
  for (let i = 0; i < items; i++) {
    shapes[i].update();
    shapes[i].show();
  }
}

function shape(x, y, dia, c) {

  let xoff = x;
  let yoff = 0;

  this.posX = x;
  this.posY = y;
  this.diameter = dia;
  this.col = c;

  this.update = function() {
    xoff += 0.01;
    yoff += 0.01;
    this.posX = x + (noise(xoff * 0.15) * width/2);
    this.posY = y + (noise(xoff * 0.24) * height/2);
  }

  this.show = function() {
    noStroke();
    fill(this.col);
    ellipse(this.posX, this.posY, this.diameter, this.diameter);
  }
}

function genItems() {
  let num = seed;
  let digits = num.toString().split('');
  let n = digits[0] + digits[1] + digits[0];
  let g = int(map(n, 0, width, 0, width/2));
  return g;
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
  bufferB.resizeCanvas(windowWidth, windowHeight);

  shaderB.setUniform("u_resolution", [
    bufferB.width,
    bufferB.height
  ]);
}
