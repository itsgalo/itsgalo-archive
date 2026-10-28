//WRAPPERS by itsgalo
/*
Generative animated artwork made using shader feedback and pixel quantization.

WRAPPERS is a study of virtual surfaces and textures. It explores the tension between hard and soft forms and parallel projection, where the illusion of perspective is flattened into a highly geometric composition. These geometries feature a flowing texture that runs infinitely, reflecting on the endless nature of virtual space. The project blends together imagery from early computer terminals, video games, and ascii art to produce a dynamic, intricate, visual experience.

WRAPPERS is very GPU intensive. For a smoother experience, you can change the scale by adding the parameter "?scale=2" to the URL.

Press 'i' to invert the colors.
Press '1', '2', '3', '4', '5', '6' to scale the bitmap glyphs.
Press 'g' to download a looping animated GIF (150 frames). Please make sure to let the animation run for at least 30 seconds first.
Press 's' to capture a single frame.
Press 'f' (or double tap in mobile) to stretch to full screen.
Made with vanilla javascript and GLSL. By @galoandstuff.
*/

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

let R = new Random;
let queryString = new URLSearchParams(window.location.search);

const canvas = document.createElement('canvas');
const canScale = queryString.get("scale") || 1;
document.body.appendChild(canvas);
let devicePixelRatio = window.devicePixelRatio || 1;
let w, h;
window.innerHeight <= window.innerWidth ? (w = Math.max(window.innerHeight, 1) * 0.75, h = Math.max(window.innerHeight, 1)) : (w = Math.max(window.innerWidth, 1), h = Math.max(window.innerWidth, 1) / 0.75);
canvas.width = (Math.floor(w/32)*32) / canScale;
canvas.height = (Math.floor(h/32)*32) / canScale;

canvas.style.transform = `translate(-50%, -50%) scale(${canScale}, ${canScale})`;

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

let DOTSIZE = '4.0';
let INVERT = R.random_bool(0.25);

const SEED = R.random_dec();
const SHAPE = R.random_choice([1, 1, 2, 3, 3, 4]);
const OCTAVES = R.random_int(2, 4);
const NANGLE = R.random_choice(['2.0', '2.0', '4.0', '180.0']);
const FRACT = R.random_choice(['0.5', '1.0', '2.0', '4.0', '6.0', '6.0', '8.0']);
const PINDEX = parseInt(R.random_dec() * 7);
const WELD = R.random_choice(['0.3', '0.4', '0.5']);

const colorPalettes = {
  ancient: [0/256, 18/256, 25/256,
  0/256, 95/256, 115/256,
  10/256, 147/256, 150/256,
  148/256, 210/256, 189/256,
  233/256, 216/256, 166/256,
  238/256, 155/256, 0/256,
  202/256, 103/256, 2/256,
  187/256, 62/256, 3/256,
  174/256, 32/256, 18/256,
  155/256, 34/256, 38/256],
  poster: [0/256, 48/256, 73/256,
  214/256, 40/256, 40/256,
  247/256, 127/256, 0/256,
  252/256, 191/256, 73/256,
  234/256, 226/256, 183/256,
  244/256, 241/256, 222/256,
  224/256, 122/256, 95/256,
  61/256, 64/256, 91/256,
  129/256, 178/256, 154/256,
  242/256, 204/256, 143/256],
  sumeria: [0/256, 18/256, 25/256,
  0/256, 95/256, 115/256,
  10/256, 147/256, 150/256,
  148/256, 210/256, 189/256,
  233/256, 216/256, 166/256,
  238/256, 155/256, 0/256,
  202/256, 103/256, 2/256,
  187/256, 62/256, 3/256,
  174/256, 32/256, 18/256,
  155/256, 34/256, 38/256],
  inca: [214/256, 64/256, 69/256,
  233/256, 225/256, 229/256,
  158/256, 216/256, 219/256,
  70/256, 117/256, 153/256,
  29/256, 51/256, 84/256,
  21/256, 96/256, 100/256,
  0/256, 196/256, 154/256,
  248/256, 225/256, 108/256,
  255/256, 194/256, 180/256,
  251/256, 143/256, 103/256],
  ottoman: [228/256, 229/256, 220/256,
  233/256, 236/256, 239/256,
  222/256, 226/256, 230/256,
  206/256, 212/256, 218/256,
  173/256, 181/256, 189/256,
  249/256, 65/256, 68/256,
  73/256, 80/256, 87/256,
  52/256, 58/256, 64/256,
  33/256, 37/256, 41/256,
  27/256, 28/256, 29/256],
  midnight: [248/256, 249/256, 250/256,
  233/256, 236/256, 239/256,
  222/256, 226/256, 230/256,
  206/256, 212/256, 218/256,
  173/256, 181/256, 189/256,
  73/256, 130/256, 207/256,
  73/256, 80/256, 87/256,
  52/256, 58/256, 64/256,
  33/256, 37/256, 41/256,
  27/256, 28/256, 29/256],
  teletext: [0/256, 0/256, 0/256,
  0/256, 256/256, 256/256,
  256/256, 0/256, 0/256,
  256/256, 256/256, 0/256,
  0/256, 0/256, 256/256,
  256/256, 0/256, 256/256,
  256/256, 0/256, 256/256,
  0/256, 256/256, 0/256,
  256/256, 0/256, 0/256,
  0/256, 0/256, 256/256],
};

const palettes = Object.keys(colorPalettes);
const palette = colorPalettes[palettes[PINDEX]];

$fx.features({
  'color': palettes[PINDEX],
  'frequency': FRACT
})

function start() {
  console.log($fx._features)
  console.log(`
  WRAPPERS by Galo Canizares (b. 1989)
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
  c += P(7,pos,0,0,0,0,0,0,0,1);
  c += P(6,pos,0,0,0,0,0,0,1,0);
  c += P(5,pos,0,0,0,0,0,1,0,0);
  c += P(4,pos,0,0,0,0,1,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,0,1,0,0,0,0,0);
  c += P(1,pos,0,1,0,0,0,0,0,0);
  c += P(0,pos,1,0,0,0,0,0,0,0);
}
else if( g < .2 ) // .
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,1,0,0,0,0);
  c += P(5,pos,0,0,0,0,0,0,1,0);
  c += P(4,pos,0,0,0,1,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,0,1,0);
  c += P(2,pos,0,0,0,1,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,1,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .3 ) // .
{
  c += P(7,pos,0,0,0,1,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,1,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,1,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .4 ) // ,
{
  c += P(7,pos,0,1,0,1,0,1,0,1);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,1,0,1,0,1,0,1);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,0,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if( g < .5 ) // -
{
  c += P(7,pos,0,0,0,1,0,0,0,1);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,1,0,0,0,1,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,1);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,1,0,0,0,1,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .6 ) // a
{
  c += P(7,pos,0,0,0,1,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,1,0,1,0,1,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .7 ) // *
{
  c += P(7,pos,0,0,0,0,0,1,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,1,0,0,0,1);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,1,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .8 ) // #
{
  c += P(7,pos,0,1,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,1,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,0,0,1,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,1);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else if(g < .9 ) // #
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,0,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,1,0,0,0,0,0);
  c += P(2,pos,0,1,0,1,0,0,0,0);
  c += P(1,pos,0,0,1,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
else // @
{
  c += P(7,pos,0,0,0,0,0,0,0,0);
  c += P(6,pos,0,0,0,0,0,0,0,0);
  c += P(5,pos,0,0,0,0,0,0,0,0);
  c += P(4,pos,0,0,0,0,0,0,0,0);
  c += P(3,pos,0,0,0,1,0,0,0,0);
  c += P(2,pos,0,0,0,0,0,0,0,0);
  c += P(1,pos,0,0,0,0,0,0,0,0);
  c += P(0,pos,0,0,0,0,0,0,0,0);
}
`

const postfs = `
#ifdef GL_ES
precision highp float;
precision highp sampler2D;
#endif
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform vec2 uResolution;
uniform float pixel;
uniform bool inv;
varying vec4 vColor;
varying vec2 tc;
varying vec2 vUv;

uniform vec3 palette[10];

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 closestColor(vec3 color) {
    vec3 targetHSV = rgb2hsv(color);

    vec3 closest = palette[0];
    float minDist = 999.0;
  
    //float dmin = distance(idealColor, color0);
  
    for (int i = 0; i < 10; i++) {
        vec3 col = palette[i];
        vec3 colHSV = rgb2hsv(col);
        
        float dr = abs(color.r - col.r);
        float dg = abs(color.g - col.g);
        float db = abs(color.b - col.b);
        
        float dist = sqrt(dr * dr + dg * dg + db * db);
        
        if (dist < minDist) {
            closest = col;
            minDist = dist;
        }
    }
    return closest;
}

// R dither mask
float intensity(vec2 pixel) {
    const float a1 = 0.75487766624669276;
    const float a2 = 0.569840290998;
    //const float a1 = 0.75;
    //const float a2 = 0.25;
    return fract(a1 * pixel.x + a2 * pixel.y);
}

//interleaved gradient noise
float IGN(vec2 coords) {
    return mod(52.9829189 * mod(0.06711056 * float(coords.x) + 0.00583715 * float(coords.y), 1.0), 1.0);
}

float rdither(vec2 coords, float color, float grey) {
    // Calculated noised gray value
    float noised = (0.2/grey) * (IGN(coords)) + color - (0.1/grey);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
    return levels;
}

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

void main(void) {
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
  
  float c = 1.0;

  vec2 xyPos = floor(pixelBin);//floor(gl_FragCoord.xy/(u_resolution.y/pixRes));

  vec3 rgb = vec3(rdither(xyPos, inColor.r, 2.0), rdither(xyPos, inColor.g, 2.0), rdither(xyPos, inColor.b, 2.0));
  
  float g = greyscale(rgb.rgb, 1.5);

  ${icons}
  
  if (c == 1.0) {
    //gl_FragColor = vec4(vec3(1.0), 1.0);
    gl_FragColor = vec4(closestColor(rgb), 1.0);
  } else {
    //gl_FragColor = vec4(vec3(0.0), 1.0);
    gl_FragColor = vec4(closestColor(0.5-rgb), 1.0);
  }
  
  //gl_FragColor = vec4((rgb), 1.0);

}
`

const noisefs = `
#ifdef GL_ES
precision highp float;
precision highp sampler2D;
#endif

#define MAX_STEPS 30
#define MAX_DIST 20.0
#define SURF_DIST 0.01

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform float pixel;
uniform float SEED;

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

float ridgeNoise(vec4 p) {
  float rn = 2.0 * (0.5 - abs(0.5 - snoise(p)));
  return rn;
}

const int octaves = 4;

float fbm(vec2 vuv) {
  float amplitude = 0.5;
  float freq = 2.0;
	float value = 0.0;
  vec2 shift = vec2(0.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

  for(int i = 0; i < octaves; i++) {
      value += amplitude * ridgeNoise(vec4(freq*vuv.x+999.*SEED, freq*vuv.y+565.*SEED, 0.2*cos(1.0), 0.2*sin(1.0)));
      vuv = rot * vuv * 2.0 + shift;
      amplitude *= 0.6;
      freq *= 1.0;//2
  }
  return -pow(value, 2.0);
}

//raymarching code

float hash1( float n ) {
    return fract(sin(n)*43758.5453123);
}

vec2 hash2( float n ) {
    return fract(sin(vec2(n,n+1.0))*vec2(43758.5453123,22578.1459123));
}

vec3 hash3( float n ) {
    return fract(sin(vec3(n,n+1.0,n+2.0))*vec3(43758.5453123,22578.1459123,19642.3490423));
}

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

vec3 rotateZ(vec3 v, float theta) {
  float c = cos(theta);
  float s = sin(theta);

  //rot=(x,y,c,s)=>[c*x+s*y,c*y-s*x]
  return vec3(c * v.y + s * v.x, c * v.x - s * v.y, v.z);
}

float sdBox( vec3 p, vec3 b ) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdRoundBox( vec3 p, vec3 b, vec3 offset, float r, vec2 angle) {
  p = (p - offset);
  p = rotateX(p, angle.x);
  p = rotateZ(p, angle.y);
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
    return mix( d2, -d1, h ) + k*h*(1.0-h); 
}

vec2 sim2d(vec2 p, float s) {
   vec2 ret = p;
   ret = p+s/2.0;
   ret = fract(ret/s)*s-s/2.0;
   return ret;
}

vec3 stepspace(vec3 p, float s) {
    return p-mod(p-s/2.0,s);
}

#define rot(a) mat2(cos(a),sin(a),-sin(a),cos(a))

//get distance field to objects in scene
float GetDist(vec3 p) {
  p.yz *= rot(-atan(1.0 / sqrt(2.0)));
  //p.xz *= rot(PI / 4.0);

  // vec3 repeat = p;//rotateY(p, uTime);
  // vec3 fp = stepspace(repeat, 0.4);;
  // float dd = fbm(vec2(fp.x*0.3, fp.z*0.3));//sin(fp.x*0.1+uTime*4.0)+cos(fp.z*0.1+uTime*2.0);
  // repeat.y = repeat.y + dd;
  // repeat.xz = sim2d(repeat.xz, 0.4);

  vec3 r = p - 0.9 * floor( (p / 0.9) + 0.5);

  // float sph = sdSphere(repeat, vec3(0.0, 0.0, 0.0), dd*4.0);
  float box = sdRoundBox(r, vec3(0.1, 0.1, 0.1), vec3(0.0), 0.0, vec2(0.0, 0.0));
  float pl = p.y + fbm(vec2(p.x*0.1, p.z*0.1))*0.5; //snoise(vec4(p*0.5+SEED, 1.0))+0.5;//
    
  float d;
  //d = sdSphere(p, vec3(cos(time), sin(time), 1.0), 0.25);
  d = pl;
  for(int i = 0; i < 7; i++) {
    float h = float(i)/7.0;
    vec3 pos = 1.0 * (hash3(h * 1.1799 + SEED) + hash3(h * 13.7 + SEED)) - vec3(1.0, 0.0, 1.0);

    float b = sdRoundBox(p, vec3(abs(pos.x)*2.0, abs(pos.y)*0.2, 0.19), vec3(h*2.0-1.0, cos(uTime + float(i))*0.25, pos.z * 2.5), 0.0, vec2(0.0, 0.0));
    //float b = sdSphere(p, pos, 0.5);
    d = opSmoothUnion(b, d, ${WELD});
  }
  //d = opSmoothUnion(pl, box, 0.9);
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
  vec3 col = vec3(0.0);
  
  float distanceToIntersection = RayMarch(rayOrigin, rayDir, 1.0);
  
  if (distanceToIntersection < MAX_DIST) {
    vec3 p = rayOrigin + rayDir * distanceToIntersection; //3d hit position
    vec3 n = GetNormal(p); //normal of surface ... orientation

    //lighting
    vec3 lightdir = normalize(vec3(-1.0, 2.0, 3.0));
    
    //vec3 mat = findcolor(p);
    
    float NdotL = max(0.0, dot(n, lightdir));
    vec3 R = -normalize(reflect(lightdir, n));
    float spec = pow(max(dot(R, -rayDir), 0.0), 10.0);

    float dif = dot(n, lightdir)*0.5+0.5;

    float fresnel = pow(1.+dot(rayDir, n), 5.);
    col = vec3(fract(dif * 1.0 * sin(uTime+p.z*${FRACT})), fract(dif * 1.0 * cos(uTime+p.z*3.0*${FRACT})), fract(dif * 1.0 * sin(uTime+p.z*5.0*${FRACT}))) * 0.5 + vec3(dif + spec) * 0.5;
    //col = vec3(dif);
  }
  
  return col;
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

  vec2 flow;

  color += threeDScene(vec3(0.0, 0.2, -8.0) + vec3(ruv * 4.0, 0.), normalize(vec3(0.0, 0.0, 1.0)), ruv);
  gl_FragColor = vec4(sat(color, 3.0), 1.0);
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
  let ncan = document.createElement('canvas');
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
    canvas.width = (Math.floor(window.innerWidth/32)*32) / canScale;
    canvas.height = (Math.floor(window.innerHeight/32)*32) / canScale;
  } else {
    window.innerHeight <= window.innerWidth ? (w = Math.max(window.innerHeight, 1) * 0.75, h = Math.max(window.innerHeight, 1)) : (w = Math.max(window.innerWidth, 1), h = Math.max(window.innerWidth, 1) / 0.75);
    canvas.width = (Math.floor(w/32)*32) / canScale;
    canvas.height = (Math.floor(h/32)*32) / canScale;
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
let totalFrames = 150;
let frameStep = 0;
let saveframes = false;
let fs = 1;
let imgs = [];
let hasBeenCaptured = false;

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
    }
    time = (frameStep / totalFrames) * (Math.PI * 2.0);

    //console.log(time)

    gl.useProgram(baseBlock.pgm);
    gl.uniform1f(gl.getUniformLocation(baseBlock.pgm, 'pixel'), DOTSIZE);
    gl.uniform1f(gl.getUniformLocation(baseBlock.pgm, 'SEED'), SEED);
    gl.uniform1f(gl.getUniformLocation(baseBlock.pgm,"uTime"), time);
    gl.uniform2fv(gl.getUniformLocation(baseBlock.pgm,"uResolution"), [canvas.width, canvas.height]);

    gl.useProgram(post.pgm);
    gl.uniform3fv(gl.getUniformLocation(post.pgm, 'palette'), palette);
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
    DOTSIZE = '1.0';
  }
  if (e.key === '2') {
    DOTSIZE = '2.0';
  }
  if (e.key === '3') {
    DOTSIZE = '4.0';
  }
  if (e.key === '4') {
    DOTSIZE = '8.0';
  }
  if (e.key === '5') {
    DOTSIZE = '16.0';
  }
  if (e.key === '6') {
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
    if (imgs.length == totalFrames) {
      makeGIF();
    } else {
      alert("not all frames recorded, yet. please let the canvas run for a bit longer")
    }
    
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
    saveFile(imgData.replace(str, 'image/octet-stream'), "WRAPPERS-"+fxhash+".png");
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
    saveFile(imgData.replace(str, 'image/octet-stream'), "WRAPPERS-"+addLeadingZeros(num, 3)+".png");
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
      link.download = 'WRAPPERS-'+ fxhash +'.gif';
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