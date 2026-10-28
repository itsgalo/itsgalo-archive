//debuggers by galo canizares (b. 1989)
//built with toxiclibs and raw js/WEBGL
const VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
const GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
const AttractionBehavior = toxi.physics2d.behaviors.AttractionBehavior;
const VerletParticle2D = toxi.physics2d.VerletParticle2D;
const VerletSpring2D = toxi.physics2d.VerletSpring2D;
const VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D;
const Vec2D = toxi.geom.Vec2D;
const Rect = toxi.geom.Rect;

class Particle extends VerletParticle2D {

  constructor(x, y, co) {
    super(x, y);
    this.c = co;
  }

   display(buff) {
    buff.fillStyle = this.c;
    buff.lineWidth = 4;

    if (toggleDot) {
      //buff.strokeStyle = 'black';
      buff.save();
      buff.translate(this.x, this.y);
      buff.rotate(45 * Math.PI / 180);
      buff.fillRect(0-(4), 0-(25), 8, 50);
      buff.fillRect(0-(25), 0-(4), 50, 8);
      buff.restore();
    } else {
      buff.strokeStyle = this.c;
      buff.beginPath();
      buff.ellipse(this.x, this.y, 20, 20, Math.PI*2, 0, 2 * Math.PI);
      buff.fill();
    }
  }
}

class Spring extends VerletSpring2D {

  constructor(a, b, co) {
    super(a, b, w, 0.1);
    this.c = co;
  }

  display(buff, wid) {
    buff.strokeStyle = this.c;
    buff.lineWidth = wid;
    buff.beginPath();
    buff.moveTo(this.a.x, this.a.y);
    buff.lineTo(this.b.x, this.b.y);
    buff.stroke();
  }
}
//screenshot
const screenshot = (e) => {
  if (e.key === 's') {
    saveAsImage();
  }
}

const saveAsImage = () => {
  let imgData, imgNode;
  try {
      let str = "image/png";
      imgData = canvas.toDataURL(str, 1.0);
      saveFile(imgData.replace(str, 'image/octet-stream'), "debuggers.png");
  } catch (e) {
      console.log(e);
      return;
  }
}

const saveFile = function (strData, filename) {
  let link = document.createElement('a');
  if (typeof link.download === 'string') {
      document.body.appendChild(link); //Firefox requires the link to be in the body
      link.download = filename;
      link.href = strData;
      link.click();
      document.body.removeChild(link); //remove the link when done
  } else {
      location.replace(uri);
  }
}
//color function
const colo = () => {
  return ["#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#000000","#ffffff","#06d6a0","#118ab2","#073b4c"][parseInt(fxrand()*10)];
}

const toggleDot = fxrand() < 0.5;
const paletteSelector = parseInt(fxrand()*9);
const widthSelector = parseInt(fxrand()*6);
//init canvas and WEBGL
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl', {antialias: false, preserveDrawingBuffer: true});
let time = 0;
let program, numVtx;
let lut = ["04.png", "05.png", "06.png", "07.png", "08.png", "09.png", "10.png", "11.png", "12.png"][paletteSelector];
let thickness = [10, 15, 20, 30, 50, 80][widthSelector];
let mouseIsPressed = false;
let mouseX, mouseY;
let bg = colo();

const drawctx = document.createElement('canvas');
document.body.appendChild(drawctx);
drawctx.width = window.innerWidth;
drawctx.height = window.innerHeight;
let ctx = drawctx.getContext('2d', {alpha: true});

window.$fxhashFeatures = {
  "marker": toggleDot ? String.fromCodePoint(0x274C) : String.fromCodePoint(0x2B55),
  "palette": [String.fromCodePoint(0x1F36C),
    String.fromCodePoint(0x1F382),
    String.fromCodePoint(0x1F32E),
    String.fromCodePoint(0x1F35C),
    String.fromCodePoint(0x1F5A5),
    String.fromCodePoint(0x1F4D3),
    String.fromCodePoint(0x1F333),
    String.fromCodePoint(0x1F392),
    String.fromCodePoint(0x1F9E2)][paletteSelector]
};

document.addEventListener('keydown', screenshot);

window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function getMousePos(evt) {
    return {
      x: evt.clientX,
      y: evt.clientY
    };
}

window.addEventListener('mousedown', function(e) {
  mouseIsPressed = true;
});

window.addEventListener('mouseup', function(e) {
  mouseIsPressed = false;
  let dir = new Vec2D(0, 0);
  mouseDir = dir;
});

window.addEventListener('mousemove', function(e) {
  mouseX = getMousePos(e).x;
  mouseY = getMousePos(e).y;
});

window.addEventListener('touchstart', function(e) {
  e.preventDefault();
  mouseIsPressed = true;
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
});

window.addEventListener('touchend', function(e) {
  e.preventDefault();
  mouseIsPressed = false;
  let dir = new Vec2D(0, 0);
  mouseDir = dir;
});

const make2DArray = (col, row) => {
  var arr = new Array(col);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(row);
  }
  return arr;
}

let ww = window.innerWidth;
let hh = window.innerHeight;
//start physics
let cols = Math.floor(fxrand()*15)+8;
let rows = Math.floor(fxrand()*15)+8;

let particles = make2DArray(cols,rows);
let springs = [];

let u = hh / cols;
let v = ww / rows;
let w = Math.max(u, v);
let physics;
let mouseDir = new Vec2D(0, 0);
let springW = thickness;

const initSketch = () => {
  physics = new VerletPhysics2D();
  let gravity = new Vec2D(0, 0.1);
  let gb = new GravityBehavior(gravity);
  physics.addBehavior(gb);
  let ctr = new Vec2D(ww/2,hh/2);
  let ext = new Vec2D(ww/2,hh/2);
  physics.setWorldBounds(Rect.fromCenterExtent(ctr,ext));

  let x = u/2;
  for (let i = 0; i < cols; i++) {
    let y = v/2;
    for (let j = 0; j < rows; j++) {
      let p = new Particle(x, y, colo());
      particles[i][j] = p;
      physics.addParticle(p);
      y = y + v;
    }
    x = x + u;
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let a = particles[i][j];
      if (i != cols-1) {
        let b1 = particles[i+1][j];
        let s1 = new Spring(a, b1, colo());
        springs.push(s1);
        physics.addSpring(s1);
      }
      if (j != rows-1) {
        let b2 = particles[i][j+1];
        let s2 = new Spring(a, b2, colo());
        springs.push(s2);
        physics.addSpring(s2);
      }
    }
  }


  particles[Math.floor(fxrand()*cols)][0].lock();
  particles[Math.floor(fxrand()*cols)][Math.floor(fxrand()*rows)].lock();
  particles[Math.floor(fxrand()*cols)][Math.floor(fxrand()*rows)].lock();
}

//init shader
const vertexShaderSource = `
attribute vec2 aVertexPosition;
void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}`

const fragmentShaderW = `
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;	// canvas that you draw on, src
uniform sampler2D tex1; // saved image of canvas, buffer
uniform float uTime;
uniform vec2 uResolution;

//glsl-lut
vec4 lookup(in vec4 textureColor, in sampler2D lookupTable) {

    mediump float blueColor = textureColor.b * 63.0;
    mediump vec2 quad1;
    quad1.y = floor(floor(blueColor) / 8.0);
    quad1.x = floor(blueColor) - (quad1.y * 8.0);
    mediump vec2 quad2;
    quad2.y = floor(ceil(blueColor) / 8.0);
    quad2.x = ceil(blueColor) - (quad2.y * 8.0);
    highp vec2 texPos1;
    texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);
    highp vec2 texPos2;
    texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);
    lowp vec4 newColor1 = texture2D(lookupTable, texPos1);
    lowp vec4 newColor2 = texture2D(lookupTable, texPos2);
    lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
    return newColor;
}

void main(void) {
  float gamma = 2.2;

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float dotSize = 8.0;
  vec2 pixelBin = gl_FragCoord.xy / dotSize;
  vec2 tiles = uResolution.xy / dotSize;
  vec2 uvBin = floor(pixelBin) / tiles;

  vec3 tex = pow(texture2D(tex0, uvBin).rgb, vec3(gamma));

  vec3 c = tex;
  c = c * 2.0;
  c = floor(c);
  c = c / 2.0;
  c = pow(c, vec3(1.0/gamma));

  vec4 remap = lookup(vec4(c, 1.0), tex1);
  gl_FragColor = remap;

}`

const initGL = () => {
  gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.clearColor(1.0,0.0,0.0,1.0);
	gl.viewport(0,0,canvas.width,canvas.height);
}

const initShaders = () => {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderW);
  gl.compileShader(fragmentShader);

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  //set up a rectangle geometry for the shader
  const vertices = new Float32Array([
    -1, 1,
     1, 1,
     1, -1,
    -1, 1,
     1, -1,
    -1, -1
    ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const itemSize = 2;
  numVtx = vertices.length / itemSize;

  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
  gl.enableVertexAttribArray(program.aVertexPosition);
  gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
}
//load LUT image
const lookup = gl.createTexture();
const initLUT = () => {
  let img = new Image();
      img.onload = function() {
          gl.bindTexture(gl.TEXTURE_2D, lookup);
          //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
          //gl.generateMipmap(gl.TEXTURE_2D);
          //render();
          initDrawCtx();
      };
      img.onerror = function() {
          console.log("Sorry, could not load texture.")
      };
      img.src = lut;
}
//drawing canvas
const gridImg = gl.createTexture();
const initDrawCtx = () => {
  gridImg.image = drawctx;
  gl.bindTexture(gl.TEXTURE_2D, gridImg);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawctx);
  render();
  console.log("debuggers by galo canizares (b. 1989)");
}

//render and update every frame
const render = () => {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //set uniforms
  program.uResolution = gl.getUniformLocation(program, 'uResolution');
  gl.uniform2fv(program.uResolution, [canvas.width ,canvas.height]);
  time += 0.05;
  program.uTime = gl.getUniformLocation(program, 'uTime');
  gl.uniform1f(program.uTime, time);



  //draw shader
  gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
  gl.uniform1i(gl.getUniformLocation(program,"tex1"), 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, gridImg);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, lookup);
  gl.drawArrays(gl.TRIANGLES, 0, numVtx);

  //update context
  gl.bindTexture(gl.TEXTURE_2D, gridImg);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawctx);

  physics.update();
  ctx.clearRect(0,0, canvas.width, canvas.height);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, ww, hh);

  for (let s = 0; s < springs.length; s++) {
    springs[s].display(ctx, springW);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      particles[i][j].display(ctx);
      particles[i][j].addForce(mouseDir);
    }
  }

  if (mouseIsPressed) {
    if (mouseX > canvas.width/2){
      let dir = new Vec2D(2, 0.0);
      mouseDir = dir;
    } else {
      let dir = new Vec2D(-2, 0.0);
      mouseDir = dir;
    }
  }
  requestAnimationFrame(render);
}

initSketch();
initGL();
initShaders();
initLUT();
