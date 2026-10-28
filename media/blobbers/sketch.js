//blobbers by galo canizares (b.1989)

//generative traits
const colorPalettes = {
  "mono": ["000000","66666e","9999a1","e6e6e9","f4f4f6"],
  "hotdog": ["335c67","fff3b0","e09f3e","9e2a2b","540b0e"],
  "salad": ["8cb369","f4e285","f4a259","5b8e7d","bc4b51"],
  "stew": ["0a0908","22333b","eae0d5","c6ac8f","5e503f"],
  "icecream": ["227c9d","17c3b2","ffcb77","fef9ef","fe6d73"],
  "sorbet": ["3d5a80","98c1d9","e0fbfc","ee6c4d","293241"],
  "pizza": ["264653","2a9d8f","e9c46a","f4a261","e76f51"],
};

const palettes = Object.keys(colorPalettes);
const density = parseInt(fxrand() * 10);
const isTouching = fxrand() < 0.5;
const isOutlined = fxrand() < 0.15 && !isTouching;
const isRare = fxrand() < 0.05;

//checks to see if rare, then returns palette 0 if true
window.$fxhashFeatures = {
  "palette": isRare ? palettes[0] : palettes[parseInt(fxrand()*6)+1],
  "blobbers": ["few","few","some","some","some","some","some","lots","lots","lots"][density],
  "outlined": isOutlined ? "yeah" : "nah",
  "relationship": isTouching ? "touching" : "apart",
};
//sketch core vars
let shaderA;
let can, buffer;
let bg;
let mobile;

let blbs = [];
let grid = [];

let touching = isTouching ? 0 : 50;

function getDensity(d) {
  if (d < 2) {
    return 10;
  } else if (d >= 2 || d < 7) {
    return 50;
  }else {
    return 600;
  }
}

function palette() {
  let p = colorPalettes[window.$fxhashFeatures.palette];
  let colorFromArray = p[parseInt(fxrand() * 5)];
  let c = color("#" + colorFromArray);
  //c.setAlpha(150.0);
  return c;
}

function preload() {
  //test if mobile
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
   (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) {
    // true for mobile device
    mobile = 1.0;
  } else {
    mobile = 0.0;
  }
  // load the shader
  shaderA = loadShader("shader.vert", "bayer.frag");
}

function setup() {
  can = createCanvas(windowWidth, windowHeight, WEBGL);
  buffer = createGraphics(windowWidth, windowHeight);

  //dont forget pixel density!
  pixelDensity(1);
  buffer.pixelDensity(1);

  bg = palette();
  buffer.background(bg);

  noStroke();
  //generate grid
  let protection = 0;
  while (grid.length < getDensity(density)) {
    let circle = {
      x: (fxrand()*width),//+width/4,
      y: (fxrand()*height),//+height/4,
      r: fxrand()*200
    }
    let overlapping = false;

    for (let j = 0; j < grid.length; j++) {
      //check i against all j's
      let other = grid[j];
      let d = dist(circle.x, circle.y, other.x, other.y);
      if (d < circle.r + other.r + touching) {
        overlapping = true;
      }
    }
      //push circle to grid if it's not overlapping
      if (!overlapping) {
        grid.push(circle);
      }
      //shiffman's protection
      protection++;
      if (protection > 10000) {
        break;
      }
  }
    for (let i = 0; i < grid.length; i++) {
      let b = new Blobby(grid[i].r, 10, palette(), fxrand()*0.5, 0.3);
      b.init(grid[i].x, grid[i].y);
      blbs.push(b);
    }
  console.log(window.$fxhashFeatures.relationship);
  console.log(window.$fxhashFeatures.outlined);
  console.log(window.$fxhashFeatures.palette);
  console.log(window.$fxhashFeatures.blobbers);
}


function draw() {
  //fill(0);
  noStroke();
  shader(shaderA);
  shaderA.setUniform("u_resolution", [windowWidth, windowHeight]);
  shaderA.setUniform("tex0", buffer);
  shaderA.setUniform("tex1", can);
  shaderA.setUniform("mobile", mobile);
  shaderA.setUniform("time", millis() * 0.001);
  rect(-width / 2, -height / 2, width, height);

  image(buffer, -width / 2, -height / 2, width, height);

  for (let i = 0; i < grid.length; i++) {
    //buffer.ellipse(grid[i].x, grid[i].y, 5, 5)
    blbs[i].update();
    blbs[i].display(buffer);
  }

}

class Blobby {
  constructor(rad, pts, clr, wA, wS) {
    this.pts = pts;
    this.radius = rad;
    this.pnts = [];
    this.off = [];
    this.col = clr;
    this.amp = 0.0;
    this.wAmount = wA;
    this.wSpeed = wS;
  }
  init(ctrX, ctrY) {
    for (let i = 0; i < this.pts; i++) {
      let p = new p5.Vector(((this.radius)+10) * cos(i*PI/(this.pts/2)) + (ctrX), ((this.radius)+10) * sin(i*PI/(this.pts/2)) + (ctrY));
      this.pnts.push(p);
      this.off[i] = floor(fxrand()*100);
    }
  }

  update() {
    this.amp += this.wAmount * this.wSpeed;
    for (let i = 0; i < this.pnts.length; i++) {
      this.pnts[i].x += cos((this.amp+this.off[i]))*this.wAmount*2;
      this.pnts[i].y += sin((this.amp+this.off[i]))*this.wAmount*2;
    }
  }

  display(b) {
    b.fill(this.col);
    if (isTouching) {
      b.noStroke();
    } else {
      isOutlined ? b.stroke(0) : b.stroke(bg);
    }
    //add first three points at the end to close the shape smoothly
    b.beginShape();

    for (let i = 0; i < this.pnts.length; i++) {
      b.curveVertex(this.pnts[i].x, this.pnts[i].y);
    }
    b.curveVertex(this.pnts[0].x, this.pnts[0].y);
    b.curveVertex(this.pnts[1].x, this.pnts[1].y);
    b.curveVertex(this.pnts[2].x, this.pnts[2].y);
    b.endShape();
  }

}
