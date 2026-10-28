//strokers by galo canizares (b.1989)

//generative traits
const colorPalettes = {
  "monochrome": ["f8f9fa","dee2e6","adb5bd","495057","212529"],
  "happy": ["086788","07a0c3","f0c808","fff1d0","dd1c1a"],
  "lazy": ["eb5e55","3a3335","d81e5b","fdf0d5","c6d8d3"],
  "dreamy": ["70d6ff","ff70a6","ff9770","ffd670","e9ff70"],
  "silly": ["ff595e","ffca3a","8ac926","1982c4","6a4c93"],
  "sleepy": ["00a6fb","0582ca","006494","003554","051923"],
  "sultry": ["ffc857","e9724c","c5283d","481d24","255f85"],
};

const palettes = Object.keys(colorPalettes);
const chaos = parseInt(fxrand() * 10);
const weight = parseInt(fxrand() * 3);
const brushes = parseInt(fxrand() * 200)+50;
const isRare = fxrand() < 0.05;

//checks to see if rare, then returns palette 0 if true
window.$fxhashFeatures = {
  "palette": isRare ? palettes[0] : palettes[parseInt(fxrand() * 6)+1],
  "weight": ["narrow","medium","wide"][weight],
  "smear" : ["level 0","level 1","level 2","level 3","level 4","level 5","level 6","level 7","level 8","level 9"][chaos],
  "rare": isRare ? "yes!" : "nope",
};
//sketch core vars
let shaderA;
let can, buffer;
let brush;

let noiseScale = 100*(chaos+1), noiseStrength = 1;
let particles = [];

function palette() {
  let p = colorPalettes[window.$fxhashFeatures.palette];
  let colorFromArray = p[parseInt(fxrand() * 5)];
  let c = color("#" + colorFromArray);
  //c.setAlpha(10.0);
  return c;
}

function preload() {
  // load the shader
  shaderA = loadShader("shader.vert", "bayer.frag");
}

function setup() {
  can = createCanvas(windowWidth, windowHeight, WEBGL);
  buffer = createGraphics(windowWidth, windowHeight);

  //dont forget pixel density!
  pixelDensity(1);
  buffer.pixelDensity(1);
  buffer.clear();
  buffer.background(palette());

  noiseSeed(brushes)

  for (let i=0; i<10; i++) {
    //x value start slightly outside the right of canvas, z value how close to viewer
    let pos = createVector(fxrand()*(width/2)+height/4, fxrand()*(height/2)+height/4, 2);
    let angle = 0; //any value to initialize
    let dir = createVector(cos(angle), sin(angle));
    let speed = 4.0;
    particles[i]= new Particle(pos, dir, speed, palette(), 1);
  }
  for (let i=0; i<chaos; i++) {
    buffer.fill(palette());
    buffer.noStroke();
    buffer.rect(0, fxrand()*height, width, height/i)
  }
  console.log(window.$fxhashFeatures.weight);
  console.log(window.$fxhashFeatures.smear);
}


function draw() {
  fill(0, 255);
  noStroke();
  shader(shaderA);
  shaderA.setUniform("u_resolution", [windowWidth, windowHeight]);
  shaderA.setUniform("tex0", buffer);
  shaderA.setUniform("tex1", can);
  shaderA.setUniform("time", millis() * 0.001);
  rect(-width / 2, -height / 2, width, height);

  for (let i=0; i<particles.length; i++) {
    particles[i].run(buffer);
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  shaderA.setUniform("u_resolution", [windowWidth, windowHeight]);
  buffer.resizeCanvas(windowWidth, windowHeight);
}

class Particle{
  constructor(p,d,s,c,r){
    this.pos = p;
    this.dir = d;
    this.speed = s;
  	this.col = c;
    this.rad = 10;
    this.prevPos = this.pos.copy();
  }
  run(b) {
    this.move();
    this.checkEdges();
    this.update(b);
    this.updatePrev();
  }
  move(){
    let angle=noise(this.pos.x/noiseScale, this.pos.y/noiseScale, frameCount/noiseScale)*TWO_PI*noiseStrength; //0-2PI
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    let vel = this.dir.copy();
    let d =1;  //direction change
    vel.mult(this.speed*d); //vel = vel * (speed*d)
    this.pos.add(vel); //loc = loc + vel
  }
  checkEdges(){
    //float distance = dist(width/2, height/2, loc.x, loc.y);
    //if (distance>150) {

    if (this.pos.x > width-100) {
      this.pos.x = 100;
      this.updatePrev();
    }
    if (this.pos.x < 100) {
      this.pos.x = width-100;
      this.updatePrev();
    }
    if (this.pos.y > height-100) {
      this.pos.y = 100;
      this.updatePrev();
    }
    if (this.pos.y < 100) {
      this.pos.y = height-100;
      this.updatePrev();
    }
  }
  updatePrev() {
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
  }
  update(b){
    b.fill(this.col);

    b.noStroke();
    b.push();
    b.translate(this.pos.x, this.pos.y);
    b.rotate(this.dir.heading());
    b.rectMode(CENTER);
    b.rect(0, 0, 20, (weight+1)*50*sin(frameCount*0.01));
    b.pop();
    let test = fxrand() < 0.5;

    if (test) {
      b.copy(can, int(this.prevPos.x-brushes/2), int(this.prevPos.y-brushes/2), brushes, brushes, int(this.pos.x-brushes/2), int(this.pos.y-brushes/2), brushes, brushes);
    }
  }
}
