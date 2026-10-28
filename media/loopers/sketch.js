//loopers by galo canizares (b.1989)
//2021

//generative traits
const colorPalettes = {
  "1910s": ["fffcf2","ccc5b9","403d39","252422","eb5e28"],
  "1940s": ["6f1d1b","bb9457","432818","99582a","ffe6a7"],
  "1950s": ["f4f1de","e07a5f","3d405b","81b29a","f2cc8f"],
  "1960s": ["780000","c1121f","fdf0d5","003049","669bbc"],
  "1970s": ["8cb369","f4e285","f4a259","5b8e7d","bc4b51"],
  "1980s": ["9b5de5", "f15bb5", "fee440", "00bbf9", "00f5d4"],
  "1990s": ["ef476f", "ffd166", "06d6a0", "118ab2", "073b4c"],
};

const palettes = Object.keys(colorPalettes);
const pCirc = parseInt(fxrand() * 10);
const pLines = parseInt(fxrand() * 10);
const wiggle = parseInt(fxrand() * 10);
const isRare = fxrand() < 0.05;

//checks to see if rare, then returns palette 0 if true
window.$fxhashFeatures = {
  "palette": isRare ? palettes[0] : palettes[parseInt(fxrand()*6)+1],
  "circles": ["few","some","some","some","some","lots","lots","lots","lots","lots"][pCirc],
  "lines": ["few","some","some","some","some","lots","lots","lots","lots","lots"][pLines],
  "wiggle": "level " + wiggle,
  "rare": isRare ? "yes!" : "nope",
};

//sketch core vars
let shaderA;
let can, buffer;
let mobile;
let rGests = []; //array of gestures
let lGests = []; //array of gestures

function getDensity(pct) {
  if (pct < 1) {
    return parseInt(fxrand() * 4)+1;
  } else if (pct >= 1 && pct < 5) {
    return parseInt(fxrand() * 10)+5;
  }else {
    return parseInt(fxrand() * 10)+25;
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
  buffer = createGraphics(windowWidth, windowHeight, WEBGL);

  //dont forget pixel density!
  pixelDensity(1);
  buffer.pixelDensity(1);

  buffer.background(palette());

  for (let i = 0; i < getDensity(pLines); i++) {
    let l = new Gesture(fxrand() * 0.05, fxrand() * 30, palette());
    l.initGesture(
      2,
      4,
      (fxrand() * width) / 2 - width / 2,
      (fxrand() * height) / 2 - height / 3,
      fxrand() * 50,
      fxrand() * 900
    );
    lGests.push(l);
  }
  for (let i = 0; i < getDensity(pCirc); i++) {
    let r = new Gesture(fxrand() * 0.5, fxrand() * 50, palette());
    r.initGesture(
      50,
      50 / 2,
      (fxrand() * width) / 2 - width / 4,
      (fxrand() * height) / 2 - height / 4,
      fxrand() * 200,
      fxrand()* wiggle * 10
    );
    rGests.push(r);
  }

}

function draw() {
  noStroke();
  shader(shaderA);
  shaderA.setUniform("u_resolution", [width, height]);
  shaderA.setUniform("tex0", buffer);
  shaderA.setUniform("tex1", can);
  shaderA.setUniform("time", millis() * 0.001);
  shaderA.setUniform("mobile", mobile)
  rect(-width / 2, -height / 2, width, height);

  image(buffer, -width / 2, -height / 2, width, height);

  for (let i = 0; i < rGests.length; i++) {
    rGests[i].updateGesture();
    rGests[i].drawGesture(buffer);
  }
  for (let i = 0; i < lGests.length; i++) {
    lGests[i].updateGesture();
    lGests[i].drawGesture(buffer);
  }
  if (frameCount % 240 == 0) {
    buffer.clear();
    buffer.background(palette());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shaderA.setUniform("u_resolution", [windowWidth, windowHeight]);
  buffer.resizeCanvas(windowWidth, windowHeight);
}

class Gesture {
  constructor(speed, radius, color) {
    this.pts = [];
    this.currentX = 0;
    this.currentY = 0;
    this.distX = 0;
    this.distY = 0;
    //object that holds temporary targets
    this.temp = {
      beginX: 0.0,
      beginY: 0.0,
      endX: 0.0,
      endY: 0.0,
    };
    this.col = color;
    this.radi = radius;
    this.step = speed;
    this.traveled = 0.0;
    this.next = 0;
  }
  //initialize a new gesture
  initGesture(pnts, halfpnts, ctrX, ctrY, rad, wiggle) {
    //to draw circle i < total points on a circumference
    //x = radius * cos( i * PI / half of total points)
    //y = radius * sin( i * PI / half of total points)
    for (let i = 0; i < pnts; i++) {
      let p = new p5.Vector(
        (rad + fxrand() * wiggle) * cos((i * PI) / halfpnts) + ctrX,
        (rad + fxrand() * wiggle) * sin((i * PI) / halfpnts) + ctrY
      );
      this.pts.push(p);
    }
    if (this.pts.length > 0) {
      this.temp.beginX = this.pts[0].x;
      this.temp.beginY = this.pts[0].y;
      this.temp.endX = this.pts[1].x;
      this.temp.endY = this.pts[1].y;
      this.distX = this.temp.endX - this.temp.beginX;
      this.distY = this.temp.endY - this.temp.beginY;
      this.currentX = this.temp.beginX;
      this.currentY = this.temp.beginY;
    }

    for (let i = 0; i < pnts; i++) {
      //ellipse(this.pts[i].x, this.pts[i].y, 5, 5);
    }
  }
  //update the gesture movement
  updateGesture(b) {
    this.traveled += this.step;
    if (this.traveled < 1.0) {
      this.currentX = this.temp.beginX + this.traveled * this.distX;
      this.currentY = this.temp.beginY + this.traveled * this.distY;
    } else if (this.traveled > 1.0) {
      this.nextPt();
      this.traveled = 0.0;
    }
  }
  //draw the gesture
  drawGesture(b) {
    b.fill(this.col);
    b.noStroke();
    b.ellipse(this.currentX, this.currentY, this.radi, this.radi);
    //line(this.currentX, this.currentY, this.temp.endX, this.temp.endY);
  }
  nextPt() {
    //move to next points
    if (this.next < this.pts.length - 1) {
      this.next += 1;
    } else if (this.next >= this.pts.length - 1) {
      this.next = 0;
    }

    if (this.next < this.pts.length - 1) {
      //update new targets
      this.temp.beginX = this.pts[this.next].x;
      this.temp.beginY = this.pts[this.next].y;
      this.temp.endX = this.pts[this.next + 1].x;
      this.temp.endY = this.pts[this.next + 1].y;
      //update distance
      this.distX = this.temp.endX - this.temp.beginX;
      this.distY = this.temp.endY - this.temp.beginY;
    } else if (this.next === this.pts.length - 1) {
      //reset targets to beginning
      this.temp.beginX = this.pts[this.next].x;
      this.temp.beginY = this.pts[this.next].y;
      this.temp.endX = this.pts[0].x;
      this.temp.endY = this.pts[0].y;
      //update distance
      this.distX = this.temp.endX - this.temp.beginX;
      this.distY = this.temp.endY - this.temp.beginY;
    }
  }
}
