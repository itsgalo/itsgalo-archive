//PRINTERS by itsgalo
/*
Generative animated artwork made using shader feedback and pixel quantization.

PRINTERS is a study of rasterized type and bitmap imagery. It builds on the tradition of ASCII and typographic art, blending dithering techniques with chunky, pixelated glyphs. Here, the movement and blending of color is interpreted as a monochrome composition of recognizable pixel patterns taken from legacy video games and operating systems. What appears as typography is actually a custom set of 8x8 pixel patterns rendered in a GLSL shader that produces a conceptual tension between low-res graphics and high-power GPU computation.

PRINTERS is designed to be a correspondence with an audience. Collectors will be able to receive a printed out, folded, and signed letter containing their iteration. Ships to anywhere in the world via standard mail.

both viewed on a screen and printed on office paper with a home/office inkjet printer.

Press 'i' to invert the colors.
Press '1', '2', or '3' to scale the bitmap glyphs.
Press 'g' to download a looping animated GIF (90 frames).
Press 's' to capture a single frame.
Press 'f' (or double tap in mobile) to stretch to full screen.
Made with vanilla javascript and GLSL. By @galoandstuff.
*/

//simplex noise

function Grad(x, y, z) {
  this.x = x; this.y = y; this.z = z;
}

Grad.prototype.dot2 = function(x, y) {
  return this.x*x + this.y*y;
};

let grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
             new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
             new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

let p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
// To remove the need for index wrapping, double the permutation table length
let perm = new Array(512);
let gradP = new Array(512);

for(let i = 0; i < 256; i++) {
  let v;
  if (i & 1) {
    v = p[i] ^ (0 & 255);
  } else {
    v = p[i] ^ ((0>>8) & 255);
  }

  perm[i] = perm[i + 256] = v;
  gradP[i] = gradP[i + 256] = grad3[v % 12];
}

let F2 = 0.5*(Math.sqrt(3)-1);
let G2 = (3-Math.sqrt(3))/6;

class Simplex {
  constructor() {
    
  }

  get(xin, yin) {
    let n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    let s = (xin+yin)*F2; // Hairy factor for 2D
    let i = Math.floor(xin+s);
    let j = Math.floor(yin+s);
    let t = (i+j)*G2;
    let x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    let y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    let y1 = y0 - j1 + G2;
    let x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    let y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    let gi0 = gradP[i+perm[j]];
    let gi1 = gradP[i+i1+perm[j+j1]];
    let gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    let t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    let t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    let t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  }
}

/*
helper functions by pixlpa turned into a class
helps make sense of webgl fbo binding and textures
*/

class shaderBlock {
  constructor (vs,fs){
    this.pgm = this.createPGM(vs,fs);
    this.fbo;
    this.texture;
    this.bb = new Billboard(gl);
  }
	start(){
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo);
		gl.useProgram(this.pgm);
	};
	allocate(w,h){
		//make the framebuffer and texture output of the shader rendering with nearest interpolation
		this.fbo = gl.createFramebuffer();
		this.texture = gl.createTexture();
  		//set properties for the texture
  		gl.bindTexture(gl.TEXTURE_2D, this.texture);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w,h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  		//bind framebuffer to texture
  		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	};
	allocate2(w,h){
		//make the framebuffer and texture output with linear interpolation
		this.fbo = gl.createFramebuffer();
		this.texture = gl.createTexture();
  		//set properties for the texture
  		gl.bindTexture(gl.TEXTURE_2D, this.texture);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w,h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  		//bind framebuffer to texture
  		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	};
	//the different draw functions are there to accomodate different numbers of textures
	draw(pgm){
		this.bb.draw(pgm,this.texture);
	};
	draw2(pgm,texture2){
		this.bb.draw2(pgm,this.texture,texture2);
	};
	draw3(pgm,texture2,texture3){
		this.bb.draw3(pgm,this.texture,texture2,texture3);
	};
	draw4(pgm,texture2,texture3,texture4){
		this.bb.draw2(pgm,this.texture,texture2,texture3,texture4);
	};
	createPGM(v,f) {
		//assumes individual shaders are already compiled by the running code
	 	let program = gl.createProgram();
  		gl.attachShader(program, v);
  		gl.attachShader(program, f);
  		gl.linkProgram(program);
  		return program;
  	};
}

//this is for when you need a framebuffer to draw into, but don't need another shader
class shaderFBO {
  constructor(){
    this.fbo;
    this.texture;
    this.bb = new Billboard(gl);
  }
	start(pgm){
		//get things ready for
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo);
	};
	allocate(w,h){
		//make the framebuffer and texture output with nearest interpolation
		this.fbo = gl.createFramebuffer();
		this.texture = gl.createTexture();
  		//set properties for the texture
  		gl.bindTexture(gl.TEXTURE_2D, this.texture);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w,h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  		//bind framebuffer to texture
  		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	};
	allocate2(w,h){
		//make the framebuffer and texture output with linear interpolation
		this.fbo = gl.createFramebuffer();
		this.texture = gl.createTexture();
  		//set properties for the texture
  		gl.bindTexture(gl.TEXTURE_2D, this.texture);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w,h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  		//bind framebuffer to texture
  		gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
	};
	draw(pgm){
		this.bb.draw(pgm,this.texture);
	};
	draw2(pgm,texture2){
		this.bb.draw2(pgm,this.texture,texture2);
	};
	draw2(pgm,texture2){
		this.bb.draw2(pgm,this.texture,texture2);
	};
	draw3(pgm,texture2,texture3){
		this.bb.draw3(pgm,this.texture,texture2,texture3);
	};
	draw4(pgm,texture2,texture3,texture4){
		this.bb.draw2(pgm,this.texture,texture2,texture3,texture4);
	};
}

function blockShader(source,type){
	let shader = gl.createShader(type);
 	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    return null;
  	}
  	return shader;
}

function blockProgram(vid, fid) {
  	let program = gl.createProgram();
  	gl.attachShader(program, vid);
  	gl.attachShader(program, fid);
  	gl.linkProgram(program);
  	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
 		 throw gl.getProgramInfoLog(program);
	}
  	return program;
}


class Billboard{
  constructor() {
  //put together a basic billboard geometry to fill the screen
  this.vert = gl.createBuffer();
  initBuffer(this.vert,[
      -1.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, 1.0, 0.0,
      1.0, -1.0, 0.0
      ]);

  this.tex = gl.createBuffer();
  initBuffer(this.tex,[
      0,1,
      0,0,
      1,1,
      1,0]);

  this.color = gl.createBuffer();
  initBuffer(this.color,[
      1,1,1,1,
      1,1,1,1,
      1,1,1,1,
      1,1,1,1]);
  }

  predraw(pgm){
	//hook up the vertex attributes
	//assumes the vertex shader used will have pos,color, texcoord inputs
		gl.useProgram(pgm);
		pgm.vertexPosAttrib = gl.getAttribLocation(pgm, 'pos');
		gl.enableVertexAttribArray(pgm.vertexPosAttrib);

		pgm.vertexColorAttrib = gl.getAttribLocation(pgm, 'color');
		gl.enableVertexAttribArray(pgm.vertexColorAttrib);

		pgm.vertexTexAttrib = gl.getAttribLocation(pgm, 'texcoord');
		gl.enableVertexAttribArray(pgm.vertexTexAttrib);
	  gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(pgm.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(pgm.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(pgm.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
  }
  draw(pgm,texture){
    this.predraw(pgm);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex0"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
  }

  draw2(pgm,texture1,texture2){
    this.predraw(pgm);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex0"), 0);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex1"), 1);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
  }

  draw3(pgm,texture1,texture2,texture3){
    this.predraw(pgm);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex0"), 0);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex1"), 1);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex2"), 2);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture2);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texture3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
  }

  draw4(pgm,texture1,texture2,texture3,texture4){
    this.predraw(pgm);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex0"), 0);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex1"), 1);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex2"), 2);
      gl.uniform1i(gl.getUniformLocation(pgm,"tex3"), 3);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture2);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, texture3);
      gl.activeTexture(gl.TEXTURE3);
      gl.bindTexture(gl.TEXTURE_2D, texture4);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
  }
}

function initBuffer(buf,dataset){
  	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataset), gl.STATIC_DRAW);
}

//random AB
class Random {
  constructor() {

  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    return fxrand();
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
}

function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
};

function map(n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
};

function random(rmin, rmax) {
  return (rmax - rmin) * R.random_dec() + rmin;
}

function radians(degrees) {
  let pi = Math.PI;
  return degrees * (pi / 180);
}

function dist(x1, y1, x2, y2) {
  let y = x2 - x1;
  let x = y2 - y1;

  return Math.sqrt(x * x + y * y);
}

function fbm(iterations, x, y, persistence, scale, low, high) {
  let maxAmp = 0;
  let amp = 1;
  let freq = scale;
  let bnoise = 0;
  
  //add successively smaller, higher-frequency terms
  for (let i = 0; i < iterations; i++) {
    //bnoise += noise.noise2D(x * freq + XOFF, y * freq + YOFF) * amp;
    bnoise += noise.get(x * freq + XOFF, y * freq + YOFF, 0) * amp;
    maxAmp += amp;
    amp *= persistence;
    freq *= 2;
  }
  //take average of iterations
  bnoise /= maxAmp;
  //normalize
  bnoise = bnoise * (high-low) / 2 + (high+low) / 2;
  return bnoise;
}

let R = new Random;
//let noise = new openSimplexNoise(tokenData.hash);
let noise = new Simplex();

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
let devicePixelRatio = window.devicePixelRatio || 1;
let w, h;
//window.innerHeight <= window.innerWidth ? (w = Math.max(window.innerHeight, 1) * 0.75, h = Math.max(window.innerHeight, 1)) : (w = Math.max(window.innerWidth, 1), h = Math.max(window.innerWidth, 1) / 0.75);
w = window.innerWidth;
h = window.innerHeight;
canvas.width = Math.floor(w/32)*32;
canvas.height = Math.floor(h/32)*32;

const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
canvas.style.imageRendering = "pixelated";
canvas.imageSmoothingEnabled = false;

let floatTextures = gl.getExtension('OES_texture_float');

let basev, basef, noisef, ditherf, postf, ppgm, post, lastf, baseBlock, feedback, program;
let time = 0;

const drawCan = document.createElement('canvas');
const ctx = drawCan.getContext('2d', {alpha: true});
ctx.imageSmoothingEnabled = false;
drawCan.width = 192;
drawCan.height = 256;

let DOTSIZE = '8.0';
let INVERT = false;

const colors = ['0.0, 0.471, 0.745', '0.004, 0.663, 0.357', '0.933, 0.498, 0.29', '1.0, 0.71, 0.071', '0.424, 0.365, 0.502', '0.62, 0.478, 0.824','0.655, 0.318, 0.329','0.271, 0.839, 0.173', '0.0, 0.0, 0.0'];

const XOFF = R.random_int(0, 999);
const YOFF = R.random_int(0, 999);
const SEED = R.random_dec();
const SHAPE = R.random_choice([1, 1, 2, 3, 3, 4]);
const OCTAVES = R.random_int(2, 4);
const NSCALE = R.random_choice(['0.001', '0.0025', '0.005']);
const NREP = R.random_choice(['0.25', '0.5', '0.75', '0.95']);
const NANGLE = R.random_choice(['2.0', '2.0', '4.0', '180.0']);
const CHARCOL = R.random_choice(colors);
const CHARSET = R.random_choice([1, 2, 3, 4, 5]);
const FRACT = R.random_choice(['2.0', '4.0', '6.0', '8.0', '10.0']);
const FBACK = R.random_choice(['0.9', '0.95', '0.99']);
const DITHER = R.random_choice(['rgb.rgb', 'inColor.rgb']);
const POINTA = [R.random_dec(), R.random_dec()];
const POINTB = [R.random_dec(), R.random_dec()];
const POINTC = [R.random_dec(), R.random_dec()];

$fx.features({
  'noise octaves': OCTAVES,
  'composition': ['rectangle', 'crystal', 'volumes', 'oval'][SHAPE-1],
  'noise scale': NSCALE,
  'noise repetitions': NREP,
  'angle constraint': 'PI/' + NANGLE,
  'color': ['RISO BLUE', 'RISO GREEN', 'PAPRIKA', 'SUNFLOWER', 'GRAPE', 'VIOLET', 'BRICK', 'FLOURESCENT GREEN'][colors.indexOf(CHARCOL)],
  'bitmap set': ['icons', 'ascii', 'grid', 'shapes', 'chess'][CHARSET-1],
  'dithered': DITHER == 'rgb.rgb' ? 'yes' : 'no'
})

function start() {
  console.log($fx._features)
  console.log(`
  PRINTERS by Galo Canizares (b. 1989)
  all rights reserved
  `);
}

//init shader
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
}`

const basefs = `
#ifdef GL_ES
precision mediump float;
precision mediump sampler2D;
#endif
uniform sampler2D tex0;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec4 c = texture2D(tex0, vUv);
  gl_FragColor = c;
}`

let chars;

const icons = `
if( g < .1 )
{
  c += P(7,pos,0,0,0,1,0,0,0,0);
  c += P(6,pos,0,0,0,1,0,0,0,0);
  c += P(5,pos,0,0,0,1,0,0,0,0);
  c += P(4,pos,0,0,0,1,0,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,0,0,1,0,0,0,0);
  c += P(1,pos,0,0,0,1,0,0,0,0);
  c += P(0,pos,0,0,0,1,0,0,0,0);
}
else if( g < .2 ) // .
{
  c += P(7,pos,0,0,0,0,0,0,0,1);
  c += P(6,pos,0,0,0,0,0,0,1,0);
  c += P(5,pos,0,0,0,0,0,1,0,0);
  c += P(4,pos,0,0,0,0,1,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,0,1,0,0,0,0,0);
  c += P(1,pos,0,1,0,0,0,0,0,0);
  c += P(0,pos,1,0,0,0,0,0,0,0);
}
else if( g < .3 ) // .
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,1,1,0,0,0);
  c += P(5,pos,0,0,1,0,0,1,0,0);
  c += P(4,pos,0,1,0,0,0,0,1,0);
  c += P(3,pos,0,1,0,0,0,0,1,0);
  c += P(2,pos,0,0,1,0,0,1,0,0);
  c += P(1,pos,0,0,0,1,1,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .4 ) // ,
{
  c += P(7,pos,0,1,1,1,1,1,1,0);
  c += P(6,pos,1,0,0,0,0,0,0,1);
  c += P(5,pos,1,0,1,0,0,1,0,1);
  c += P(4,pos,1,0,0,0,0,0,0,1);
  c += P(3,pos,1,0,1,1,1,1,0,1);
  c += P(2,pos,1,0,0,1,1,0,0,1);
  c += P(1,pos,1,0,0,0,0,0,0,1);
  c += P(0,pos,0,1,1,1,1,1,1,0);
}
else if( g < .5 ) // -
{
  c += P(7,pos,0,1,0,0,0,0,0,0);
  c += P(6,pos,0,1,1,1,0,0,0,0);
  c += P(5,pos,0,1,0,0,1,0,0,0);
  c += P(4,pos,1,1,1,1,1,1,0,0);
  c += P(3,pos,0,1,0,0,1,0,0,0);
  c += P(2,pos,0,1,1,1,0,0,0,0);
  c += P(1,pos,0,1,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .6 ) // a
{
  c += P(7,pos,0,0,0,1,0,0,0,0);
  c += P(6,pos,0,1,0,1,1,0,1,0);
  c += P(5,pos,0,0,1,1,0,1,0,0);
  c += P(4,pos,0,1,1,1,1,1,1,1);
  c += P(3,pos,1,1,1,1,1,1,1,0);
  c += P(2,pos,0,0,1,1,1,1,0,0);
  c += P(1,pos,0,1,0,1,1,0,1,0);
  c += P(0,pos,0,0,0,0,1,0,0,0);
}
else if(g < .7 ) // *
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,1,1,0,1,1,0,0);
  c += P(5,pos,1,1,1,1,1,1,1,0);
  c += P(4,pos,1,1,1,1,1,1,1,0);
  c += P(3,pos,0,1,1,1,1,1,0,0);
  c += P(2,pos,0,0,1,1,1,0,0,0);
  c += P(1,pos,0,0,0,1,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .8 ) // #
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,1,1,1,1,1,0);
  c += P(4,pos,0,1,0,0,0,0,1,0);
  c += P(3,pos,0,1,1,1,1,1,1,0);
  c += P(2,pos,0,1,0,1,0,0,1,0);
  c += P(1,pos,0,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .9 ) // #
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,1,1,0,0,0);
  c += P(5,pos,0,0,0,1,1,0,0,0);
  c += P(4,pos,0,1,1,1,1,1,1,0);
  c += P(3,pos,0,1,1,1,1,1,1,0);
  c += P(2,pos,0,0,0,1,1,0,0,0);
  c += P(1,pos,0,0,0,1,1,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else // @
{
  c += P(7,pos,0,0,1,1,1,0,0,0);
  c += P(6,pos,0,1,1,1,1,1,0,0);
  c += P(5,pos,1,0,0,1,0,0,1,0);
  c += P(4,pos,1,0,1,1,0,1,1,0);
  c += P(3,pos,1,1,1,1,1,1,1,0);
  c += P(2,pos,1,1,1,1,1,1,1,0);
  c += P(1,pos,1,0,1,0,1,0,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
`

//.:-=+*#%@0
const ascii = `
if( g < .1 ) // .
{
    c += P(7,pos,0,0,0,0,0,0,0,0);
    c += P(6,pos,0,0,0,0,0,0,0,0);
    c += P(5,pos,0,0,0,0,0,0,0,0);
    c += P(4,pos,0,0,0,0,0,0,0,0);
    c += P(3,pos,0,0,0,0,0,0,0,0);
    c += P(2,pos,0,0,0,1,1,0,0,0);
    c += P(1,pos,0,0,0,1,1,0,0,0);
    c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .2 ) // :
{
    c += P(7,pos,0,0,0,0,0,0,0,0);
    c += P(6,pos,0,0,0,0,0,0,0,0);
    c += P(5,pos,0,0,0,1,1,0,0,0);
    c += P(4,pos,0,0,0,0,0,0,0,0);
    c += P(3,pos,0,0,0,0,0,0,0,0);
    c += P(2,pos,0,0,0,1,1,0,0,0);
    c += P(1,pos,0,0,0,0,0,0,0,0);
    c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .3 ) // -
{
    c += P(7,pos,0,0,0,0,0,0,0,0);
    c += P(6,pos,0,0,0,0,0,0,0,0);
    c += P(5,pos,0,0,0,0,0,0,0,0);
    c += P(4,pos,0,1,1,1,1,1,1,0);
    c += P(3,pos,0,0,0,0,0,0,0,0);
    c += P(2,pos,0,0,0,0,0,0,0,0);
    c += P(1,pos,0,0,0,0,0,0,0,0);
    c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .4 ) // =
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,1,1,1,1,1,1,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,1,1,1,1,1,1,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .5 ) // +
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,1,1,0,0,0);
  c += P(5,pos,0,0,0,1,1,0,0,0);
  c += P(4,pos,1,1,1,1,1,1,1,1);
  c += P(3,pos,0,0,0,1,1,0,0,0);
  c += P(2,pos,0,0,0,1,1,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .6 ) // *
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,1,1,0,0,1,1,0);
  c += P(5,pos,0,0,1,1,1,1,0,0);
  c += P(4,pos,1,1,1,1,1,1,1,1);
  c += P(3,pos,0,0,1,1,1,1,0,0);
  c += P(2,pos,0,1,1,0,0,1,1,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .7 ) // #
{
  c += P(7,pos,0,1,1,0,0,1,1,0);
  c += P(6,pos,0,1,1,0,0,1,1,0);
  c += P(5,pos,1,1,1,1,1,1,1,1);
  c += P(4,pos,0,1,1,0,0,1,1,0);
  c += P(3,pos,1,1,1,1,1,1,1,1);
  c += P(2,pos,0,1,1,0,0,1,1,0);
  c += P(1,pos,0,1,1,0,0,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .8 ) // %
{
  c += P(7,pos,0,1,1,0,0,0,1,0);
  c += P(6,pos,0,1,1,0,0,1,1,0);
  c += P(5,pos,0,0,0,0,1,1,0,0);
  c += P(4,pos,0,0,0,1,1,0,0,0);
  c += P(3,pos,0,0,1,1,0,0,0,0);
  c += P(2,pos,0,1,1,0,0,1,1,0);
  c += P(1,pos,0,1,0,0,0,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .9 ) // @
{
  c += P(7,pos,0,0,1,1,1,1,0,0);
  c += P(6,pos,0,1,1,0,0,1,1,0);
  c += P(5,pos,0,1,1,0,1,1,1,0);
  c += P(4,pos,0,1,1,0,1,1,1,0);
  c += P(3,pos,0,1,1,0,0,0,0,0);
  c += P(2,pos,0,1,1,0,0,0,1,0);
  c += P(1,pos,0,0,1,1,1,1,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else // 0
{
  c += P(7,pos,0,0,1,1,1,1,0,0);
  c += P(6,pos,0,1,1,0,0,1,1,0);
  c += P(5,pos,0,1,1,0,1,1,1,0);
  c += P(4,pos,0,1,1,1,0,1,1,0);
  c += P(3,pos,0,1,1,0,0,1,1,0);
  c += P(2,pos,0,1,1,0,0,1,1,0);
  c += P(1,pos,0,0,1,1,1,1,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
`

const shapes = `
if( g < .1 )
{
    c += P(7,pos,0,0,0,0,0,0,0,0);
    c += P(6,pos,0,0,0,0,0,0,0,0);
    c += P(5,pos,0,0,0,0,0,0,0,0);
    c += P(4,pos,1,1,1,1,1,1,1,1);
    c += P(3,pos,0,0,0,0,0,0,0,0);
    c += P(2,pos,0,0,0,0,0,0,0,0);
    c += P(1,pos,0,0,0,0,0,0,0,0);
    c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .2 ) // :
{
    c += P(7,pos,0,0,0,1,0,0,0,0);
    c += P(6,pos,0,0,0,1,0,0,0,0);
    c += P(5,pos,0,0,0,1,0,0,0,0);
    c += P(4,pos,0,0,0,1,0,0,0,0);
    c += P(3,pos,0,0,0,1,0,0,0,0);
    c += P(2,pos,0,0,0,1,0,0,0,0);
    c += P(1,pos,0,0,0,1,0,0,0,0);
    c += P(0,pos,0,0,0,1,0,0,0,0);
}
else if( g < .3 ) // -
{
    c += P(7,pos,0,0,0,0,0,0,0,1);
    c += P(6,pos,0,0,0,0,0,0,1,0);
    c += P(5,pos,0,0,0,0,0,1,0,0);
    c += P(4,pos,0,0,0,0,1,0,0,0);
    c += P(3,pos,0,0,0,1,0,0,0,0);
    c += P(2,pos,0,0,1,0,0,0,0,0);
    c += P(1,pos,0,1,0,0,0,0,0,0);
    c += P(0,pos,1,0,0,0,0,0,0,0);
}
else if( g < .4 ) // =
{
  c += P(7,pos,1,0,0,0,0,0,0,0);
  c += P(6,pos,0,1,0,0,0,0,0,0);
  c += P(5,pos,0,0,1,0,0,0,0,0);
  c += P(4,pos,0,0,0,1,0,0,0,0);
  c += P(3,pos,0,0,0,0,1,0,0,0);
  c += P(2,pos,0,0,0,0,0,1,0,0);
  c += P(1,pos,0,0,0,0,0,0,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,1);
}
else if( g < .5 ) // +
{
  c += P(7,pos,0,0,0,1,0,0,0,0);
  c += P(6,pos,0,0,0,1,0,0,0,0);
  c += P(5,pos,0,0,0,1,0,0,0,0);
  c += P(4,pos,1,1,1,1,1,1,1,1);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,0,0,1,0,0,0,0);
  c += P(1,pos,0,0,0,1,0,0,0,0);
  c += P(0,pos,0,0,0,1,0,0,0,0);
}
else if(g < .6 ) // *
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,1,1,1,1,1,1,0);
  c += P(5,pos,0,1,0,0,0,0,1,0);
  c += P(4,pos,0,1,0,0,0,0,1,0);
  c += P(3,pos,0,1,0,0,0,0,1,0);
  c += P(2,pos,0,1,0,0,0,0,1,0);
  c += P(1,pos,0,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .7 ) // #
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,1,1,1,1,1,1,0);
  c += P(5,pos,0,1,0,0,0,0,1,0);
  c += P(4,pos,0,1,0,1,1,0,1,0);
  c += P(3,pos,0,1,0,1,1,0,1,0);
  c += P(2,pos,0,1,0,0,0,0,1,0);
  c += P(1,pos,0,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .8 ) // %
{
  c += P(7,pos,1,0,0,0,0,0,0,1);
  c += P(6,pos,0,1,0,0,0,0,1,0);
  c += P(5,pos,0,0,1,0,0,1,0,0);
  c += P(4,pos,0,0,0,1,1,0,0,0);
  c += P(3,pos,0,0,0,1,1,0,0,0);
  c += P(2,pos,0,0,1,0,0,1,0,0);
  c += P(1,pos,0,1,0,0,0,0,1,0);
  c += P(0,pos,1,0,0,0,0,0,0,1);
}
else if(g < .9 ) // @
{
  c += P(7,pos,0,0,0,1,0,0,0,0);
  c += P(6,pos,0,1,1,1,1,1,0,0);
  c += P(5,pos,0,1,0,1,0,1,0,0);
  c += P(4,pos,1,1,1,1,1,1,1,1);
  c += P(3,pos,0,1,0,1,0,1,0,0);
  c += P(2,pos,0,1,1,1,1,1,0,0);
  c += P(1,pos,0,0,0,1,0,0,0,0);
  c += P(0,pos,0,0,0,1,0,0,0,0);
}
else // 0
{
  c += P(7,pos,1,1,0,0,0,0,1,1);
  c += P(6,pos,1,1,1,1,1,1,1,1);
  c += P(5,pos,0,1,1,1,1,1,1,0);
  c += P(4,pos,0,1,1,1,1,1,1,0);
  c += P(3,pos,0,1,1,1,1,1,1,0);
  c += P(2,pos,0,1,1,1,1,1,1,0);
  c += P(1,pos,1,1,1,1,1,1,1,1);
  c += P(0,pos,1,1,0,0,0,0,1,1);
}
`

const grid = `
if( g < .1 )
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,0,0,0,0,0);
  c += P(4,pos,0,0,0,1,1,0,0,0);
  c += P(3,pos,0,0,0,1,1,0,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .2 ) // :
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,0,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,0,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,1,1,1,0,0,1,1,1);
  c += P(0,pos,1,1,1,0,0,1,1,1);
}
else if( g < .3 ) // -
{
  c += P(7,pos,1,1,0,0,0,0,0,0);
  c += P(6,pos,1,1,0,0,0,0,0,0);
  c += P(5,pos,1,1,0,0,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,0,0,0);
  c += P(2,pos,1,1,0,0,0,0,0,0);
  c += P(1,pos,1,1,0,0,0,0,0,0);
  c += P(0,pos,1,1,0,0,0,0,0,0);
}
else if( g < .4 ) // =
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,0,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,1,1,0,0,1,1,0);
  c += P(2,pos,0,1,1,0,0,1,1,0);
  c += P(1,pos,0,1,1,0,0,1,1,0);
  c += P(0,pos,0,1,1,0,0,1,1,0);
}
else if( g < .5 ) // +
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,1,1,1,1);
  c += P(5,pos,0,0,0,0,1,1,1,1);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,0,0,0);
  c += P(2,pos,0,0,0,0,1,1,1,1);
  c += P(1,pos,0,0,0,0,1,1,1,1);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .6 ) // *
{
  c += P(7,pos,1,1,0,0,1,1,0,0);
  c += P(6,pos,1,1,0,0,1,1,0,0);
  c += P(5,pos,0,0,1,1,0,0,1,1);
  c += P(4,pos,0,0,1,1,0,0,1,1);
  c += P(3,pos,1,1,0,0,1,1,0,0);
  c += P(2,pos,1,1,0,0,1,1,0,0);
  c += P(1,pos,0,0,1,1,0,0,1,1);
  c += P(0,pos,0,0,1,1,0,0,1,1);
}
else if(g < .7 ) // #
{
  c += P(7,pos,0,0,0,0,1,1,1,1);
  c += P(6,pos,0,0,0,0,1,1,1,1);
  c += P(5,pos,0,0,0,0,1,1,1,1);
  c += P(4,pos,0,0,0,0,1,1,1,1);
  c += P(3,pos,1,1,1,1,0,0,0,0);
  c += P(2,pos,1,1,1,1,0,0,0,0);
  c += P(1,pos,1,1,1,1,0,0,0,0);
  c += P(0,pos,1,1,1,1,0,0,0,0);
}
else if(g < .8 ) // %
{
  c += P(7,pos,0,0,0,1,1,0,0,0);
  c += P(6,pos,0,0,0,1,1,0,0,0);
  c += P(5,pos,0,0,0,1,1,0,0,0);
  c += P(4,pos,1,1,1,1,1,1,1,1);
  c += P(3,pos,1,1,1,1,1,1,1,1);
  c += P(2,pos,0,0,0,1,1,0,0,0);
  c += P(1,pos,0,0,0,1,1,0,0,0);
  c += P(0,pos,0,0,0,1,1,0,0,0);
}
else if(g < .9 ) // @
{
  c += P(7,pos,1,1,1,0,0,1,1,1);
  c += P(6,pos,1,1,1,0,0,1,1,1);
  c += P(5,pos,1,1,1,1,1,1,1,1);
  c += P(4,pos,0,0,1,1,1,1,0,0);
  c += P(3,pos,0,0,1,1,1,1,0,0);
  c += P(2,pos,1,1,1,1,1,1,1,1);
  c += P(1,pos,1,1,1,0,0,1,1,1);
  c += P(0,pos,1,1,1,0,0,1,1,1);
}
else // 0
{
  c += P(7,pos,1,1,1,1,1,1,1,1);
  c += P(6,pos,1,1,1,1,1,1,1,1);
  c += P(5,pos,1,1,0,0,0,0,1,1);
  c += P(4,pos,1,1,0,0,0,0,1,1);
  c += P(3,pos,1,1,0,0,0,0,1,1);
  c += P(2,pos,1,1,0,0,0,0,1,1);
  c += P(1,pos,1,1,1,1,1,1,1,1);
  c += P(0,pos,1,1,1,1,1,1,1,1);
}
`

const chess = `
if( g < .1 )
{
  c += P(7,pos,0,0,0,1,1,0,0,0);
  c += P(6,pos,0,0,1,1,0,1,0,0);
  c += P(5,pos,0,0,1,1,0,1,0,0);
  c += P(4,pos,0,0,1,1,1,1,0,0);
  c += P(3,pos,0,0,0,1,1,0,0,0);
  c += P(2,pos,0,0,1,1,1,1,0,0);
  c += P(1,pos,0,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .2 ) // :
{
  c += P(7,pos,0,1,1,1,1,0,0,0);
  c += P(6,pos,0,0,1,1,1,1,0,0);
  c += P(5,pos,0,1,1,0,1,1,1,0);
  c += P(4,pos,0,1,1,1,1,1,1,0);
  c += P(3,pos,0,1,1,0,1,1,1,0);
  c += P(2,pos,0,0,0,0,1,1,0,0);
  c += P(1,pos,0,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .3 ) // -
{
  c += P(7,pos,0,0,0,1,1,0,0,0);
  c += P(6,pos,0,0,1,1,1,1,0,0);
  c += P(5,pos,0,0,1,0,0,1,0,0);
  c += P(4,pos,0,0,0,1,1,0,0,0);
  c += P(3,pos,0,0,0,1,1,0,0,0);
  c += P(2,pos,0,0,1,1,1,1,0,0);
  c += P(1,pos,0,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .4 ) // =
{
  c += P(7,pos,1,0,1,0,1,0,1,0);
  c += P(6,pos,1,1,1,1,1,1,1,0);
  c += P(5,pos,0,1,1,1,0,1,0,0);
  c += P(4,pos,0,1,1,1,0,1,0,0);
  c += P(3,pos,0,1,1,1,0,1,0,0);
  c += P(2,pos,0,1,1,1,0,1,0,0);
  c += P(1,pos,1,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .5 ) // +
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,1,1,0,0,0,0);
  c += P(4,pos,0,0,1,1,0,0,0,0);
  c += P(3,pos,0,0,0,0,1,1,0,0);
  c += P(2,pos,0,0,0,0,1,1,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .6 ) // *
{
  c += P(7,pos,1,1,1,1,0,0,0,0);
  c += P(6,pos,1,1,1,1,0,0,0,0);
  c += P(5,pos,1,1,1,1,0,0,0,0);
  c += P(4,pos,1,1,1,1,0,0,0,0);
  c += P(3,pos,0,0,0,0,1,1,1,1);
  c += P(2,pos,0,0,0,0,1,1,1,1);
  c += P(1,pos,0,0,0,0,1,1,1,1);
  c += P(0,pos,0,0,0,0,1,1,1,1);
}
else if(g < .7 ) // #
{
  c += P(7,pos,0,0,1,1,0,0,1,1);
  c += P(6,pos,0,0,1,1,0,0,1,1);
  c += P(5,pos,1,1,0,0,1,1,0,0);
  c += P(4,pos,1,1,0,0,1,1,0,0);
  c += P(3,pos,0,0,1,1,0,0,1,1);
  c += P(2,pos,0,0,1,1,0,0,1,1);
  c += P(1,pos,1,1,0,0,1,1,0,0);
  c += P(0,pos,1,1,0,0,1,1,0,0);
}
else if(g < .8 ) // %
{
  c += P(7,pos,0,0,1,1,1,0,0,0);
  c += P(6,pos,0,1,0,0,0,1,0,0);
  c += P(5,pos,0,1,1,0,1,1,0,0);
  c += P(4,pos,0,0,1,1,1,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,1,1,1,1,1,0,0);
  c += P(1,pos,1,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .9 ) // @
{
  c += P(7,pos,0,1,0,1,0,1,0,0);
  c += P(6,pos,0,1,1,1,1,1,0,0);
  c += P(5,pos,0,0,1,1,1,0,0,0);
  c += P(4,pos,0,0,0,1,0,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,1,1,1,1,1,0,0);
  c += P(1,pos,1,1,1,1,1,1,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else // 0
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,0,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,0,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
`

if (CHARSET == 1) {chars = icons} else if(CHARSET == 2) {chars = ascii} else if(CHARSET == 3) {chars = grid} else if(CHARSET == 4) {chars = shapes} else {chars = chess }

const postfs = `
#ifdef GL_ES
precision mediump float;
precision mediump sampler2D;
#endif
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform vec2 uResolution;
uniform float pixel;
uniform bool inv;
varying vec4 vColor;
varying vec2 tc;
varying vec2 vUv;

//bitmap drawing adapted from iq https://www.shadertoy.com/view/4dfXWj
//#define P(id,a,b,c,d,e,f,g,h) if( id == int(pos.y) ){ int pa = a+2*(b+2*(c+2*(d+2*(e+2*(f+2*(g+2*(h))))))); cha = floor(mod(float(pa)/pow(2.,float(pos.x)),2.)); }

// "steps" of R, G and B. Must be integer && equal or greater than 2
float rcount = 4.0;
float gcount = 4.0;
float bcount = 4.0;
float acount = 1.0;

float bayer[16];

const float bayerSize = 4.0;
float bayerDivider = bayerSize * bayerSize;


vec4 nearestColor(vec4 incolor) {
    vec4 rgbaCounts = vec4(rcount, gcount, bcount, acount);

    vec4 color = incolor;

    color.r = (floor((rgbaCounts.r - 1.0) * color.r + 0.5) / (rgbaCounts.r - 1.0));
    color.g = (floor((rgbaCounts.g - 1.0) * color.g + 0.5) / (rgbaCounts.g - 1.0));
    color.b = (floor((rgbaCounts.b - 1.0) * color.b + 0.5) / (rgbaCounts.b - 1.0));
    color.a = 1.0;
    float newcolor = length(color.rgb * vec3(0.2126,0.7152,0.0722));
    //0.2126,0.7152,0.0722
    vec4 grey = vec4(newcolor, newcolor, newcolor, 1.0);

    return color;
}

float indexValue(int idx) {
    int x = int(mod(gl_FragCoord.x, 4.0));
    int y = int(mod(gl_FragCoord.y, 4.0));

    if(x < 8){
      if (idx == 0) return bayer[0] / 16.0;
      if (idx == 1) return bayer[1] / 16.0;
      if (idx == 2) return bayer[2] / 16.0;
      if (idx == 3) return bayer[3] / 16.0;
      if (idx == 4) return bayer[4] / 16.0;
      if (idx == 5) return bayer[5] / 16.0;
      if (idx == 6) return bayer[6] / 16.0;
      if (idx == 7) return bayer[7] / 16.0;
      if (idx == 8) return bayer[8] / 16.0;
      if (idx == 9) return bayer[9] / 16.0;
      if (idx == 10) return bayer[10] / 16.0;
      if (idx == 11) return bayer[11] / 16.0;
      if (idx == 12) return bayer[12] / 16.0;
      if (idx == 13) return bayer[13] / 16.0;
      if (idx == 14) return bayer[14] / 16.0;
      if (idx == 15) return bayer[15] / 16.0;

    }
}

// float P(int id, ivec2 pos, int a,int b,int c,int d,int e,int f,int g,int h) {
//   if(id == int(pos.y)){
//     //binary conversion
//     int idx = a+2*(b+2*(c+2*(d+2*(e+2*(f+2*(g+2*(h)))))));
//     if (inv) {
//       return 1.0 - floor(mod(float(idx)/pow(2.,float(pos.x)),2.));
//     } else {
//       return floor(mod(float(idx)/pow(2.,float(pos.x)),2.));
//     }
//   } else {
//     return 0.0;
//     //return closestColor(texture2D(tex0, floor(gl_FragCoord.xy / 8.0) / (uResolution.xy / 8.0)).rgb);
//   }
// }

float P(int id, vec2 pos, int a, int b, int c, int d, int e, int f, int g, int h) {
  if(id == int(pos.y)){
    // Binary conversion
    int idx = a + 2*(b + 2*(c + 2*(d + 2*(e + 2*(f + 2*(g + 2*h))))));
    
    // Manual bit extraction using mod() function
    float result = 0.0;
    int x = int(pos.x);
    
    if(x == 0) result = mod(float(idx), 2.0);
    else if(x == 1) result = mod(float(idx / 2), 2.0);
    else if(x == 2) result = mod(float(idx / 4), 2.0);
    else if(x == 3) result = mod(float(idx / 8), 2.0);
    else if(x == 4) result = mod(float(idx / 16), 2.0);
    else if(x == 5) result = mod(float(idx / 32), 2.0);
    else if(x == 6) result = mod(float(idx / 64), 2.0);
    else if(x == 7) result = mod(float(idx / 128), 2.0);
    
    if(inv) {
      return 1.0 - result;
    } else {
      return result;
    }
  } else {
    return 0.0;
  }
}

float greyscale(vec3 color, float strength) {
    float g = dot(color, vec3(0.299, 0.587, 0.114));
    return g * strength;
}

//saturation function
vec3 sat(vec3 rgb, float intensity) {
  vec3 L = vec3(0.2125, 0.7154, 0.0721);
  vec3 grayscale = (vec3(dot(rgb, L)));
  return mix(grayscale, rgb, intensity);
}

vec3 posterize(vec3 color, float levels) {
    return floor(color * levels) / levels;
}

void main(void) {
  //0,  8,  2,  10, 12, 4,  14, 6, 3,  11, 1,  9, 15, 7,  13, 5
  bayer[0] = 0.0;
  bayer[1] = 8.0;
  bayer[2] = 2.0;
  bayer[3] = 10.0;
  bayer[4] = 12.0;
  bayer[5] = 4.0;
  bayer[6] = 14.0;
  bayer[7] = 6.0;
  bayer[8] = 3.0;
  bayer[9] = 11.0;
  bayer[10] = 1.0;
  bayer[11] = 9.0;
  bayer[12] = 15.0;
  bayer[13] = 7.0;
  bayer[14] = 13.0;
  bayer[15] = 5.0;


  // create texture coordinates based on pixelSize //
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv.y = 1.0 - uv.y;

  //width of pixel region in texture coordinates. changes the dither dot size.
  float dotSize = pixel;
  //pixel region number using the texture coordinates
  vec2 pixelBin = gl_FragCoord.xy / dotSize;

  //add step to incolor to downscale pixelate uvs (bin)
  vec2 tiles = uResolution.xy / dotSize;
  vec2 uvBin = floor(pixelBin) / tiles;
  
  //bitmap tex coords, every 8th pixel x, y
  vec2 pos = vec2(mod(pixelBin.x*8.0, 8.0), mod(pixelBin.y*8.0, 8.0));

  // get the image as a vec4 using texture2D and plug in our distored uv's
  vec4 inColor = texture2D(tex0, uvBin);
  
  vec2 entry = mod(pixelBin.xy, vec2(bayerSize, bayerSize));
  int idx = int(entry.y) * int(bayerSize) + int(entry.x);
  
  float c = 1.0;
  
  vec3 rgb = (nearestColor(vec4(inColor.rgb, 1.0) + 1.5 * (indexValue(idx) / bayerDivider)).rgb);
  
  float g = greyscale(inColor.rgb, 2.0);

  ${chars}
  
  if (c == 1.0) {
    gl_FragColor = vec4(vec3(1.0), 1.0);
  } else {
    gl_FragColor = vec4(vec3(${CHARCOL}), 1.0);
    //gl_FragColor = vec4(posterize(sat(inColor.rgb, 10.0), 2.0), 1.0);
  }
  
  //gl_FragColor = vec4(sat(inColor.rgb, 1.0), 1.0);

}
`

let shape;
const boxA = `
color += vec3(box2(vuv, POINTA, vec2(${NREP})), 0.0, 0.0);
color += vec3(0.0, 0.0, box2(vuv, POINTB, vec2(${NREP})));
color += vec3(0.0, box2(vuv, POINTC, vec2(${NREP})), 0.0);
`
const circleA = `
color += vec3(circle(vuv, rad, POINTA), 0.0, 1.0);
color += vec3(0.0, 1.0, circle(vuv, rad, POINTB));
color += vec3(1.0, circle(vuv, rad, POINTC), 0.0);
`

const sdf = `
color += threeDScene(vec3(0.0, 0.0, -4.0) + vec3(ruv * 3.0, 0.), normalize(vec3(0., 0., 0.1)), ruv);
`

const circleB = `
color += vec3(circle(vuv, rad, POINTA), 0.0, 0.0);
color += vec3(0.0, 0.0, circle(vuv, rad, POINTB));
color += vec3(0.0, circle(vuv, rad, POINTA), 0.0);
`

if (SHAPE == 1) { shape = boxA } else if (SHAPE == 2) { shape = circleA } else if (SHAPE == 3) { shape = sdf } else { shape = circleB }

const noisefs = `
#ifdef GL_ES
precision mediump float;
precision mediump sampler2D;
#endif

#define MAX_STEPS 300
#define MAX_DIST 20.0
#define SURF_DIST 0.001

uniform float uTime;
uniform float totalTime;
uniform vec2 uResolution;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform float pixel;
uniform float SEED;
uniform vec2 POINTA;
uniform vec2 POINTB;
uniform vec2 POINTC;

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

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

const int octaves = ${OCTAVES};

float fbm(vec2 vuv, float sd) {

  float amplitude = 0.5;
  float freq = 2.0;
	float value = 0.0;
  vec2 shift = vec2(10.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

  for(int i = 0; i < octaves; i++) {
      value += amplitude * snoise(vec4(freq*vuv.x*1.0+5.*sd, freq*vuv.y*1.0+6.*sd, 0.02*cos(uTime), 0.02*sin(uTime)));
      vuv = rot * vuv * 2.0 + shift;
      amplitude *= 0.6;
      freq *= 1.0;//2
  }
  return value;
}

//raymarching code
vec3 rotateX(vec3 v, float theta) {
    float c = cos(theta);
    float s = sin(theta);

    //rot=(x,y,c,s)=>[c*x+s*y,c*y-s*x]
    return vec3(v.x, c * v.y + s * v.z, c * v.z - s * v.y);
}
vec3 rotateY(vec3 v, float theta) {
  float c = cos(theta);
  float s = sin(theta);

  //rot=(x,y,c,s)=>[c*x+s*y,c*y-s*x]
  return vec3(c * v.x + s * v.z, v.y, c * v.z - s * v.x);
}
float sdBox( vec3 p, vec3 b ) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdRoundBox( vec3 p, vec3 b, vec3 offset, float r, vec2 angle) {
  p = (p - offset);
  p = rotateX(p, angle.x);
  p = rotateY(p, angle.y);
  vec3 q = (abs(p) - b);
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}
float sdSphere( vec3 p, vec3 c, float s ) {
    return length(p-c)-s;
}
float sdTorus( vec3 p, vec2 t ) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}
float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h); 
}
float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h); }

//get distance field to objects in scene
float GetDist(vec3 p) {
  float sphere = sdSphere(p, vec3(0.0, 0.0, 0.0), 1.0);
  float box = sdRoundBox(p, vec3(0.1, 1.5, 0.1), vec3(0.0), 0.05, vec2(${POINTA}));
    
  float d;
  //d = sdSphere(p, vec3(cos(time), sin(time), 1.0), 0.25);
  d = sdRoundBox(p, vec3(0.5, 0.5, 1.0), vec3(0.0), 0.05, vec2(${POINTB}));
  for(int i = 0; i < 8; i++) {
    d = opSmoothUnion(sdRoundBox(p, vec3(0.15, 0.15, 6.0), vec3(0.0), 0.0, float(i+1)*vec2(${POINTC})), d, 0.15);
  }
  //d = opSmoothUnion(d, n, 0.5);
  float totalDist = min(d, 1.0);
  return totalDist;
}
//raymarch loop
float RayMarch(vec3 rayO, vec3 rayD, float side) {
  float distOrigin = 0.0;
  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = rayO + rayD * distOrigin;
    float distToScene = GetDist(p) * side;
    distOrigin += distToScene;
    if(distOrigin > MAX_DIST || distToScene < SURF_DIST) break;
    
  }
  return distOrigin;
}

vec3 GetNormal(vec3 pointOnSurface) {
  float distanceAtPoint = GetDist(pointOnSurface);
  vec2 e = vec2(0.01, 0.0);
  vec3 norm = distanceAtPoint - vec3(
    GetDist(pointOnSurface - e.xyy),
    GetDist(pointOnSurface - e.yxy),
    GetDist(pointOnSurface - e.yyx));
  return normalize(norm);
}

vec3 threeDScene(vec3 ro, vec3 rd, vec2 bg) {
  
  vec3 rayOrigin = ro;
  vec3 rayDir = rd;
  vec3 col = vec3(fract(bg.x*${FRACT}), 1.0-fract(bg.y*${FRACT}), 1.0-fract(bg.y*${FRACT}));
  
  float distanceToIntersection = RayMarch(rayOrigin, rayDir, 1.0);
  
  if (distanceToIntersection < MAX_DIST) {
    vec3 p = rayOrigin + rayDir * distanceToIntersection; //3d hit position
    vec3 n = GetNormal(p); //normal of surface ... orientation

    float dif = dot(n, normalize(vec3(1.0, 2.0, -3.0)))*0.5+0.5;
    float fresnel = pow(1.+dot(rayDir, n), 5.);
    col = vec3(fract(dif*n*10.0));
  }
  
  return col;
}

float circle(vec2 uv, float radius, vec2 ctr){  
  vec2 dist = uv - ctr;
  //iq metaball code: 1.0-smoothstep(0.0,0.7,length(uv-c1));
  float d = 1.0 - smoothstep(0.0, 1.0, fract(length(dist)*${FRACT}));

  float m = 1. - smoothstep(0.0, radius, dot(dist, dist) * 2.1);
  return d*3.0; //1. - smoothstep(0.0 , 1.5, length(uv - ctr)*radius);
}

float box(vec2 coord, vec2 offset, vec2 dimensions) {
  vec2 shaper = vec2(step(offset.x, coord.x), step(offset.y, coord.y));
  shaper *= vec2(step(coord.x, offset.x + dimensions.x), step(coord.y, offset.y + dimensions.y));

  return shaper.x * shaper.y;
}

float box2(vec2 p, vec2 off, vec2 b) {
  p = p - off;
  vec2 d = abs(p)-b;
  return fract(length(max(d,0.0)) + min(max(d.x,d.y),0.0)*${FRACT});
}

vec2 curl(vec2 pos, float sd) {
	float s = 0.5;
	pos *= s;
	
	float n = fbm(pos, sd);
	
	float e = 0.01;
	float nx = fbm(pos + vec2(e, 0), sd);
	float ny = fbm(pos + vec2(0, e), sd);
	
	return vec2((ny-n),nx-n)/e;
}

vec2 clampAngle(vec2 coord){
  float angle = PI / ${NANGLE};
  float inangle = atan(coord.y, coord.x);
  float newangle = floor(inangle/angle + 0.5)*angle;
  float l = length(coord);
  vec2 t = vec2(cos(newangle), sin(newangle)) * l;
  return t;
}

//saturation function
vec3 sat(vec3 rgb, float intensity) {
  vec3 L = vec3(0.2125, 0.7154, 0.0721);
  vec3 grayscale = (vec3(dot(rgb, L)));
  return mix(grayscale, rgb, intensity);
}

void main() {

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.y / uResolution.x;
  vec2 ruv = (gl_FragCoord.xy-0.5*uResolution.xy) / uResolution.y;
  float dotSize = pixel;

  vec2 pixelBin = gl_FragCoord.xy / dotSize;
  vec2 tiles = uResolution.xy / dotSize;
  vec2 vuv = floor(pixelBin) / tiles;

  // get the image as a vec4 using texture2D and plug in our distored uv's
  vec4 incolor = vec4(1.0);

  vec3 color = vec3(0.0);
  float rad = 0.001;

  vec2 flow;

  float sd = SEED;
  // if (mod(uTime, 20.0) == 0.0) {
  //   sd += uTime * SEED;
  // }


  //{shape}
  //color += vec3(circle(vuv, 0.2, vec2(0.5)), circle(vuv, 0.15, vec2(0.5)), circle(vuv, 0.1, vec2(0.5)) );

  //color += vec3(circle(vuv, 0.2, vec2(0.25)), 0.0, 0.0);
  //color += vec3(0.0, 0.0, circle(vuv, 0.15, vec2(0.5)));
  //color += vec3(0.0, circle(vuv, 0.1, vec2(0.75)), 0.0);

  color += vec3(box2(vuv, vec2(0.25), vec2(${NREP})), 0.0, 0.0);
  color += vec3(0.0, 0.0, box2(vuv, vec2(0.5), vec2(${NREP})));
  color += vec3(0.0, box2(vuv, vec2(0.75), vec2(${NREP})), 0.0);


  // move the uv space between -1 and 1
  //vuv = uv * 2.0 - 1.0;


  float x = curl(${NREP}*vuv, sd).x;
  float y = 4.0 + curl(${NREP}*vuv+vec2(5.0, 999.0), sd).y;

  //float y = 4.0 + fbm(4.0*vuv+vec2(999.0, 5.0), sd);
  
  flow = vec2(x*${NSCALE}, y*${NSCALE}*1.0);//curl noise

  // scale the uvs up just a tad for a feedback zoom
  //vuv += vec2(vuv.x, vuv.y) * -0.01;

  // return the uvs to 0 - 1 range
  //vuv = vuv * 0.5 + 0.5;

  incolor = texture2D(tex0, vuv + clampAngle(flow));

  vec4 final = vec4(1.0);

  if (color.r < 0.5) {
    //final = vec4(color, 1.0);
    final = mix(vec4(sat(color, 1.0), 1.0), vec4(incolor.rgb, 1.0), 0.95);//{FBACK}
  } else {
    //final = vec4(incolor.rgb, 1.0);
    final = mix(vec4(sat(color, 3.0), 1.0), vec4(incolor.rgb, 1.0), 0.995);
  }

  gl_FragColor = final;
  //gl_FragColor = vec4(incolor.rgb, 1.0);
}`

function initGL() {
  gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.clearColor(1.0,0.0,0.0,1.0);
  gl.viewport(0,0,canvas.width,canvas.height);

}
  
function initBlocks() {
  //generate shaders
  basev = blockShader(basevs, gl.VERTEX_SHADER);
  basef = blockShader(basefs, gl.FRAGMENT_SHADER);
  noisef = blockShader(noisefs, gl.FRAGMENT_SHADER);
  postf = blockShader(postfs, gl.FRAGMENT_SHADER);

  ppgm = blockProgram(basev, basef);

  //create Block - essentially an FBO with a shader program
  baseBlock = new shaderBlock(basev, noisef);
  baseBlock.allocate(canvas.width, canvas.height);

  //create blank FBO
  feedback = new shaderFBO();
  feedback.allocate(canvas.width, canvas.height);

  //create postprocessing FBO
  post = new shaderBlock(basev, postf);
  post.allocate(canvas.width, canvas.height);

  //create empty FBO
  lastf = new shaderFBO();
  lastf.allocate(canvas.width, canvas.height);

  gl.useProgram(post.pgm);
  gl.uniform2fv(gl.getUniformLocation(post.pgm,"uResolution"), [canvas.width, canvas.height]);

  gl.useProgram(baseBlock.pgm);
  gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm,"uResolution"), [canvas.width, canvas.height]);

  render();
}

function createTexture(gl, data, width, height) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(
      gl.TEXTURE_2D,
      0,        // mip level
      gl.RGBA,  // internal format
      width,
      height,
      0,        // border
      gl.RGBA,  // format
      gl.FLOAT, // type
      data,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

function cloneCanvas(can) {

  //create a new canvas
  var ncan = document.createElement('canvas');
  let nctx = ncan.getContext('2d');

  //set dimensions
  ncan.width = can.width;
  ncan.height = can.height;

  //apply the old canvas to the new one
  nctx.drawImage(can, 0, 0);

  //return the new canvas
  return ncan;
}

function fullscreen() {
  fs++;
  if (fs % 2 == 0) {
    canvas.width = Math.floor(window.innerWidth/32)*32;
    canvas.height = Math.floor(window.innerHeight/32)*32;
  } else {
    window.innerHeight <= window.innerWidth ? (w = Math.max(window.innerHeight, 1) * 0.75, h = Math.max(window.innerHeight, 1)) : (w = Math.max(window.innerWidth, 1), h = Math.max(window.innerWidth, 1) / 0.75);
    canvas.width = Math.floor(w/32)*32;;
    canvas.height = Math.floor(h/32)*32;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  post.allocate(canvas.width, canvas.height);
  feedback.allocate(canvas.width, canvas.height);
  lastf.allocate(canvas.width, canvas.height);
  baseBlock.allocate(canvas.width, canvas.height);
  gl.useProgram(post.pgm);
  gl.uniform2fv(gl.getUniformLocation(post.pgm,"uResolution"), [canvas.width, canvas.height]);
  gl.useProgram(baseBlock.pgm);
  gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm,"uResolution"), [canvas.width, canvas.height]);
}

let fps = 30;
let now;
let then = Date.now();
let interval;
let delta;
let totalFrames = 90;
let frameStep = 0;
let saveframes = false;
let fs = 1;
let imgs = [];
let hasBeenCaptured = false;

let sd = SEED;
let tt = 0;

//render and update every frame
function render() {

  requestAnimationFrame(render);
  //fps calc
  now = Date.now();
  delta = now - then;
  interval = 1000/fps;

  if (delta > interval) {
    //update time
    then = now - (delta % interval);
    //step frame
    if (frameStep > totalFrames - 1) {
      frameStep = 0;
      //sd = 100*Math.random();
    }
    time = (frameStep / totalFrames) * (Math.PI * 2.0);
    tt++;

    gl.useProgram(baseBlock.pgm);
    gl.uniform1f(gl.getUniformLocation(baseBlock.pgm, 'pixel'), DOTSIZE);
    gl.uniform1f(gl.getUniformLocation(baseBlock.pgm, 'SEED'), sd);
    gl.uniform1f(gl.getUniformLocation(baseBlock.pgm,"uTime"), time);
    gl.uniform1f(gl.getUniformLocation(baseBlock.pgm,"totalTime"), tt);
    gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm,"POINTA"), POINTA);
    gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm,"POINTB"), POINTB);
    gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm,"POINTC"), POINTC);
    gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm,"uResolution"), [canvas.width, canvas.height]);

    gl.useProgram(post.pgm);
    gl.uniform1f(gl.getUniformLocation(post.pgm, 'pixel'), DOTSIZE);
    gl.uniform1i(gl.getUniformLocation(post.pgm, 'inv'), INVERT);

    //clear the frame
    gl.clear(gl.COLOR_BUFFER_BIT);
    //bind the "base" slab
    baseBlock.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    //draw the "feedback" image base
    feedback.draw(baseBlock.pgm);

    //bind the postprocessing slab and draw 
    post.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    baseBlock.draw(post.pgm);

    //bind the feedback slab and draw to the postprocessing fbo
    feedback.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    baseBlock.draw(ppgm);

    //bind the empty fbo and draw the feedback texture to the postprocessing fbo
    lastf.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    post.draw2(post.pgm, ppgm.texture);

    //unbind the framebuffer so that we draw to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //draw the base buffer to screen
    post.draw(ppgm);

    //write frames to array (similar to RASTER)
    imgs[frameStep] = cloneCanvas(canvas);
  
    frameStep += 1;
    if (saveframes) {
      saveAsFrame(frameStep);
      if (frameStep % totalFrames == 0) {
        fps = 30;
        saveframes = false;
      }
    }
    if (frameStep == 89 && hasBeenCaptured == false) {
      console.log("preview trigger!");
      fxpreview();
      hasBeenCaptured = true;
    }

  }
}

function keypress(e) {
  if (e.key === '1') {
    DOTSIZE = '8.0';
  }
  if (e.key === '2') {
    DOTSIZE = '16.0';
  }
  if (e.key === '3') {
    DOTSIZE = '32.0';
  }
  if (e.key === 's') {
    saveAsImage();
  }
  if (e.key === 'z') {
    fps = 3;
    frameStep = 0;
    saveframes = true;
  }
  if (e.key === 'q') {
    fps = 30;
    saveframes = false;
  }
  if (e.key === 'g') {
    makeGIF();
  }
  if (e.key === 'i') {
    INVERT = !INVERT;
  }
  if (e.key === 'f') {
    fullscreen();
  }
}

function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}

function saveAsImage() {
  let imgData, imgNode;
  try {
    let str = "image/png";
    imgData = canvas.toDataURL(str, 1.0);
    saveFile(imgData.replace(str, 'image/octet-stream'), "PRINTERS-"+fxhash+".png");
  } catch (e) {
    console.log(e);
    return;
  }
}

function saveAsFrame(num) {
  let imgData, imgNode;
  try {
    let str = "image/png";
    imgData = canvas.toDataURL(str, 1.0);
    saveFile(imgData.replace(str, 'image/octet-stream'), "PRINTERS-"+addLeadingZeros(num, 3)+".png");
  } catch (e) {
    console.log(e);
    return;
  }
}

function saveFile(strData, filename) {
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

function makeGIF() {
  let gif = new CCapture({
      format: 'gif',
      workersPath: './',
      framerate: 30,
      quality: 0
  });
  gif.start();
  for (let i = 0; i < totalFrames; i++) {
      gif.capture(imgs[i]);
  }
  gif.stop();
  gif.save(function(b) {
      window.open(URL.createObjectURL(b));
      let link = document.createElement('a');
      document.body.appendChild(link);
      link.download = 'PRINTERS-'+ fxhash +'.gif';
      link.href = URL.createObjectURL(b);
      link.click();
      document.body.removeChild(link);
      console.log('GIF recorded!');
  });
}

//keypressed
document.addEventListener('keydown', keypress);

//mouse listeners
let lastClick = 0;
window.addEventListener('touchstart', e => {
  e.preventDefault();
  //pauseAnim();
  let dd = new Date();
  let tt = dd.getTime();
  const time_between_taps = 500; // 500ms
  if (tt - lastClick < time_between_taps) {
    fullscreen();
  }
  lastClick = tt;
}, { passive: false });

//trigger
start();
initGL();
initBlocks();