//scribblers by galo canizares (b. 1989)

const numBlobs = randomInt(5, 10);
const numGrids = randomInt(0, 1);
const numTris = randomInt(0, 5);
const numWorms = randomInt(5, 10);
let strokeWeight = [5, 5, 10, 10, 10, 15, 15][Math.floor(fxrand()*7)];
const numColors = [2, 2, 2, 3, 4, 5][Math.floor(fxrand()*6)];
const isRare = fxrand() > 0.8;
const isOutlined = fxrand() > 0.6;
const dashed = fxrand() > 0.5 && strokeWeight == 5;
let maxDia = window.innerWidth / 55;

window.$fxhashFeatures = {
  "blobs": numBlobs,
  "grids": numGrids,
  "triangles": numTris,
  "noodles": numWorms,
  "weight": strokeWeight,
  "two_weights": isRare,
  "outlined": isOutlined,
  "colors": numColors + 1
};

//init canvas and WEBGL
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl', {antialias: false, preserveDrawingBuffer: true});
let program, numVtx;
let time = 0;

const drawctx = document.createElement('canvas');
const ctx = drawctx.getContext('2d');
ctx.imageSmoothingEnabled = false;
document.body.appendChild(drawctx);
drawctx.width = window.innerWidth;
drawctx.height = window.innerHeight;
let mouseX = 0;
let mouseY = 0;
let grabbing = false;

function randomInt(min, max) {
  return Math.floor(fxrand() * (max - min + 1)) + min;
}

//color handling
const rgbcmyk = ["ff0000","ffff00","ff00ff","00ffff","00ff00", "0000ff", "000000"];
let palette, bg;

function setBG() {
  let c = rgbcmyk[Math.floor(fxrand()*7)];
  let index = rgbcmyk.indexOf(c);
  rgbcmyk.splice(index, 1);
  let blk = rgbcmyk.indexOf("000000");
  rgbcmyk.splice(blk, 1);
  bg = '#' + c;
  palette = shuffle(rgbcmyk);
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(fxrand() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function col() {
  let c = palette[Math.floor(fxrand()*numColors)];
  return '#'+ c;
}

//shapes and world
let world;
let c, t;

function drawBlob(x, y, pts, rad) {
  let blob = new Body(1);
  let cc = col();
  for (let i = 0; i < pts; i++) {
    blob.addPoint(rad * Math.cos(i*Math.PI/(pts/2)) + x, rad * Math.sin(i*Math.PI/(pts/2)) + y, randomInt(5, maxDia), cc);
  }
  for (let i = 0; i < pts-1; i++) {
    blob.addSpring(blob.points[i], blob.points[i+1], cc, maxDia*1.1);
  }
  blob.addSpring(blob.points[0], blob.points[pts-1], cc, maxDia*1.1);
  world.addBody(blob);
  return blob;
}

function drawGrid(width, height, cols, rows, offset) {
  let grid = new Body(1);

  //create cloth from vertex grid
  let x = (width/cols)/2+offset;
  for (let i = 0; i < cols; i++) {
    let cc = col();
    let y = (height/rows)/2;
    for (let j = 0; j < rows; j++) {
      grid.addPoint(x, y, maxDia, cc);
      y = y + (height/rows);
    }
    x = x + (width/cols);
  }
  for (let i = 0; i < cols; i++) {
    let cc = col();
    for (let j = 0; j < rows-1; j++) {
      if (i != cols) {
        grid.addSpring(grid.points[i+(rows*j)], grid.points[i+(rows*(j+1))], cc);
      }
      if (j != rows) {
        grid.addSpring(grid.points[(i * rows)+j], grid.points[(i * rows)+j+1], cc);
      }
    }
  }
  world.addBody(grid);
  return grid;
}

function drawTri(x, y, r) {
  let tri = new Body(1);
  let cc = col();

  tri.addPoint(r * Math.cos(0) + x, r * Math.sin(0) + y, maxDia, cc);
  tri.addPoint(r * Math.cos(2*Math.PI/3) + x, r * Math.sin(2*Math.PI/3) + y, maxDia, cc);
  tri.addPoint(r * Math.cos(4*Math.PI/3) + x, r * Math.sin(4*Math.PI/3) + y, maxDia, cc);
  tri.addSpring(tri.points[0], tri.points[1], cc, r*2);
  tri.addSpring(tri.points[1], tri.points[2], cc, r*2);
  tri.addSpring(tri.points[2], tri.points[0], cc, r*2);
  world.addBody(tri);
  return tri;
}

function drawWorm(x, y, pts) {
  let worm = new Body(1);
  let cc = col();
  if (isRare) {
    strokeWeight = 20;
  }
  let dia = randomInt(10, maxDia);
  for (let i = 0; i < pts; i++) {
    worm.addPoint(x+20*i, y+20*i, dia, cc);
  }
  for (let i = 0; i < pts-1; i++) {
    worm.addSpring(worm.points[i], worm.points[i+1], cc, dia*1.9);
  }
  world.addBody(worm);
  return worm;
}

const start = (e) => {
  setBG()
  console.log(window.$fxhashFeatures);
  console.log(strokeWeight)

  world = new World(1);
  let bodies = [];

  for (let i = 0; i < numGrids; i++) {
    let dims = randomInt(canvas.height/3, canvas.height);
    bodies.push(drawGrid(dims, dims, 5, 5, canvas.width*fxrand()));
  }
  for (let i = 0; i < numBlobs; i++) {
    bodies.push(drawBlob(canvas.width*fxrand(), canvas.height*fxrand(), 30, randomInt(canvas.height/10, canvas.height/4)));
  }
  for (let i = 0; i < numTris; i++) {
    bodies.push(drawTri(canvas.width*fxrand(), canvas.height*fxrand(), randomInt(canvas.height/20, canvas.height/6)));
  }
  for (let i = 0; i < numWorms; i++) {
    bodies.push(drawWorm(canvas.width*fxrand(), canvas.height*fxrand(), 20));
  }
  world.joinBodies(...bodies);
  bodies = [];
}

const mmove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

const grab = (e) => {
  grabbing = true;
}

const stop = (e) => {
  grabbing = false;
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

void main(void) {
  float gamma = 2.2;

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float dotSize = 4.0;
  vec2 pixelBin = gl_FragCoord.xy / dotSize;
  vec2 tiles = uResolution.xy / dotSize;
  vec2 uvBin = floor(pixelBin) / tiles;

  vec4 tex = pow(texture2D(tex0, uvBin), vec4(gamma));

  vec3 c = tex.rgb;
  c = c * 1.0;
  c = floor(c);
  c = c / 1.0;
  c = pow(c, vec3(1.0/gamma));

  gl_FragColor = vec4(c, 1.0);

}`
const initGL = () => {
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.disable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.clearColor(1.0,1.0,1.0,1.0);
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
  console.log("SCRIBBLERS by galo canizares (b. 1989)");
}
//render and update every frame
const render = () => {

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
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
  gl.drawArrays(gl.TRIANGLES, 0, numVtx);

  //update context
  gl.bindTexture(gl.TEXTURE_2D, gridImg);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawctx);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  world.update(ctx, canvas, mouseX, mouseY, grabbing);
  requestAnimationFrame(render);
}

const updateCanvasSize = () => {
  let width  = window.innerWidth;
  let height = window.innerHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;
    drawctx.width = width;
    drawctx.height = height;
  }
}

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
      saveFile(imgData.replace(str, 'image/octet-stream'), "scribblers.png");
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

//listeners
window.addEventListener('mousedown', grab);
window.addEventListener('mousemove', mmove);
window.addEventListener('mouseup', stop);
window.addEventListener('touchstart', e => {
  e.preventDefault();
  grab(e.touches[0]);
}, {passive: false});
window.addEventListener('touchmove', e => {
  e.preventDefault();
  mmove(e.touches[0]);
}, {passive: false});
window.addEventListener('touchend', e => {
  e.preventDefault();
  stop(e.touches[0]);
}, {passive: false});
window.addEventListener('resize', function(){
  updateCanvasSize();
});

//screenshot
document.addEventListener('keydown', screenshot);

//trigger
start();
initGL();
initShaders();
initDrawCtx();
