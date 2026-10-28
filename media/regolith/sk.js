//SOBEL by itsgalo

//simple perlin

// function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
// function lerp( t, a, b) { return a + t * (b - a); }
// function grad(hash, x, y, z) {
//     var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
//     var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
//             v = h<4 ? y : h==12||h==14 ? x : z;
//     return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
//   } 
// function scale(n) { return (1 + n)/2; }

// class Perlin {

//   get(x, y, z) {
//     var p = new Array(512)
//     var permutation = [ 151,160,137,91,90,15,
//     131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
//     190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
//     88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
//     77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
//     102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
//     135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
//     5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
//     223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
//     129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
//     251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
//     49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
//     138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
//     ];

//     for (var i=0; i < 256 ; i++) {
//       p[256+i] = p[i] = permutation[i]; 
//     }

//     var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
//         Y = Math.floor(y) & 255,                  // CONTAINS POINT.
//         Z = Math.floor(z) & 255;
//     x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
//     y -= Math.floor(y);                                // OF POINT IN CUBE.
//     z -= Math.floor(z);
//     var    u = fade(x),                                // COMPUTE FADE CURVES
//             v = fade(y),                                // FOR EACH OF X,Y,Z.
//             w = fade(z);
//     var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
//         B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

//     return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
//                                     grad(p[BA  ], x-1, y  , z   )), // BLENDED
//                             lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
//                                     grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
//                     lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
//                                     grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
//                             lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
//                                     grad(p[BB+1], x-1, y-1, z-1 )))));
//     }
//   }

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

//quadtree class
// Daniel Shiffman

function distSquared(a, b, c, g) {
  a = c - a;
  b = g - b;
  return a * a + b * b;
}

class qPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (point[0] >= this.x - this.w &&
      point[0] < this.x + this.w &&
      point[1] >= this.y - this.h &&
      point[1] < this.y + this.h);
  }

  intersects(range) {
    return !(range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h);
  }
}

class Circle {
  constructor(a, b, c) {
    this.x = a;
    this.y = b;
    this.r = c * 2;
    this.rSquared = this.r * this.r;
  }

  contains(a) {
    return distSquared(this.x, this.y, a.x, a.y) <= this.rSquared;
  };
}

class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;
    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new QuadTree(sw, this.capacity);
    this.divided = true;
  }

  insert(point) {

    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      if (this.northeast.insert(point)) {
        return true;
      } else if (this.northwest.insert(point)) {
        return true;
      } else if (this.southeast.insert(point)) {
        return true;
      } else if (this.southwest.insert(point)) {
        return true;
      }
    }
  }

  query(range, found) {
    if (!found) {
      found = [];
    }
    if (!this.boundary.intersects(range)) {
      return;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }
    }
    return found;
  }


  show(b) {
    b.stroke(0);
    b.noFill();
    b.strokeWeight(1);
    b.rectMode(CENTER);
    b.rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
    for (let p of this.points) {
      b.strokeWeight(2);
      //ellipse(p[0], p[1], eps, eps);
    }

    if (this.divided) {
      this.northeast.show(b);
      this.northwest.show(b);
      this.southeast.show(b);
      this.southwest.show(b);
    }
  }

}

/*
helper functions by pixlpa
helps make sense of webgl fbo binding and textures
*/

function pxSlab(vs,fs){
	//the "start" method is borrowed from the OpenFrameworks implementation of texture processing
	this.start = function(){
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo);
		gl.useProgram(this.pgm);
	};
	this.allocate = function(w,h){
		//make the framebuffer and texture output of the shader rendering
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
	this.allocate2 = function(w,h){
		//make the framebuffer and texture output
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
	this.draw = function(pgm){
		this.bb.draw(pgm,this.texture);
	};
	this.draw2 = function(pgm,texture2){
		this.bb.draw2(pgm,this.texture,texture2);
	};
	this.draw3 = function(pgm,texture2,texture3){
		this.bb.draw3(pgm,this.texture,texture2,texture3);
	};
	this.draw4 = function(pgm,texture2,texture3,texture4){
		this.bb.draw2(pgm,this.texture,texture2,texture3,texture4);
	};
	this.createPGM = function(v,f) {
		//assumes individual shaders are already compiled by the running code
	 	let program = gl.createProgram();
  		gl.attachShader(program, v);
  		gl.attachShader(program, f);
  		gl.linkProgram(program);
  		return program;
  	};
  this.pgm = this.createPGM(vs,fs);
	this.fbo;
	this.texture;
	this.bb = new Billboard(gl);
}

//this is for when you need a framebuffer to draw into, but don't need another shader
function pxFBO(){
	this.start = function(pgm){
		//get things ready for
		gl.bindFramebuffer(gl.FRAMEBUFFER,this.fbo);
	};
	this.allocate = function(w,h){
		//make the framebuffer and texture output
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
	this.allocate2 = function(w,h){
		//make the framebuffer and texture output
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
	this.draw = function(pgm){
		this.bb.draw(pgm,this.texture);
	};
	this.draw2 = function(pgm,texture2){
		this.bb.draw2(pgm,this.texture,texture2);
	};
	this.draw2 = function(pgm,texture2){
		this.bb.draw2(pgm,this.texture,texture2);
	};
	this.draw3 = function(pgm,texture2,texture3){
		this.bb.draw3(pgm,this.texture,texture2,texture3);
	};
	this.draw4 = function(pgm,texture2,texture3,texture4){
		this.bb.draw2(pgm,this.texture,texture2,texture3,texture4);
	};
	this.fbo;
	this.texture;
	this.bb = new Billboard(gl);
}

function pxShader(source,type){
	let shader = gl.createShader(type);
 	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    return null;
  	}
  	return shader;
}

function pxProgram(vid, fid) {
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
    this.useA = false;
    let sfc32 = function (uint128Hex) {
      let a = parseInt(uint128Hex.substr(0, 8), 16);
      let b = parseInt(uint128Hex.substr(8, 8), 16);
      let c = parseInt(uint128Hex.substr(16, 8), 16);
      let d = parseInt(uint128Hex.substr(24, 8), 16);
      return function () {
        a |= 0; b |= 0; c |= 0; d |= 0;
        let t = (((a + b) | 0) + d) | 0;
        d = (d + 1) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
      };
    };
    // seed prngA with first half of tokenData.hash
    this.prngA = new sfc32(tokenData.hash.substr(2, 32));
    // seed prngB with second half of tokenData.hash
    this.prngB = new sfc32(tokenData.hash.substr(34, 32));
    for (let i = 0; i < 1e6; i += 2) {
      this.prngA();
      this.prngB();
    }
  }
  // random number between 0 (inclusive) and 1 (exclusive)
  random_dec() {
    this.useA = !this.useA;
    return this.useA ? this.prngA() : this.prngB();
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

function color() {
  let a = 1.0;
  let b = R.random_dec();
  let g = R.random_dec();
  let r = R.random_dec();
  return ((Math.round(a * 0xFF)) << 24) |
    ((Math.round(b * 0xFF)) << 16) |
    ((Math.round(g * 0xFF)) << 8) |
    ((Math.round(r * 0xFF)));
}

function colorBGR(b, g, r) {
  let a = 1.0;
  return ((Math.round(a * 0xFF)) << 24) |
    ((Math.round(b * 0xFF)) << 16) |
    ((Math.round(g * 0xFF)) << 8) |
    ((Math.round(r * 0xFF)));
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

const postfs = `
#ifdef GL_ES
precision mediump float;
precision mediump sampler2D;
#endif
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform vec2 uResolution;
varying vec4 vColor;
varying vec2 tc;
varying vec2 vUv;

uniform vec3 palette[10];

// All components are in the range [0…1], including hue.
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

float rcount = 2.0;
float gcount = 2.0;
float bcount = 2.0;
float acount = 1.0;

float bayer[4];

const float bayerSize = 2.0;
float bayerDivider = bayerSize * bayerSize;

//takes input color from matrix index
vec4 nearestColor(vec4 incolor) {
    vec4 rgbaCounts = vec4(rcount, gcount, bcount, acount);

    vec4 color = incolor;
    //lightness calculation
    color.r = (floor((rgbaCounts.r - 1.0) * color.r + 0.5) / (rgbaCounts.r - 1.0));
    color.g = (floor((rgbaCounts.g - 1.0) * color.g + 0.5) / (rgbaCounts.g - 1.0));
    color.b = (floor((rgbaCounts.b - 1.0) * color.b + 0.5) / (rgbaCounts.b - 1.0));
    color.a = 1.0;
    //float newcolor = length(color.rgb * vec3(0.2126,0.7152,0.0722));
    float newcolor = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    //0.2126,0.7152,0.0722
    vec4 grey = vec4(newcolor, newcolor, newcolor, 1.0);

    return color;
}

float indexValue(int idx) {
    int x = int(mod(gl_FragCoord.x, 2.0));
    int y = int(mod(gl_FragCoord.y, 2.0));

    if(x < 4){
      if (idx == 0) return bayer[0] / 16.0;
      if (idx == 1) return bayer[1] / 16.0;
      if (idx == 2) return bayer[2] / 16.0;
      if (idx == 3) return bayer[3] / 16.0;
    }
}

float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float blueNoise(vec2 p) {
  return  (hash(p+vec2(-1,-1)) + hash(p+vec2(0,-1)) + hash(p+vec2(1,-1))
           + hash(p+vec2(-1, 0)) - 8.* hash( p ) + hash(p+vec2(1, 0))
           + hash(p+vec2(-1, 1)) + hash(p+vec2(0, 1)) + hash(p+vec2(1, 1))) * .5/9. * 2.1 +.5;
}

float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);

	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));

	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

//simple blur

vec2 random2(vec3 p3) {
  p3 = fract(p3 * vec3(443.897, 441.423, .0973));
  p3 += dot(p3, p3.yzx+19.19);
  return fract((p3.xx+p3.yz)*p3.zy);
}

#define TAU 6.2831853071795864769252867665590
#define NOISEBLUR_GAUSSIAN_K 1.0

vec4 noiseBlur(in sampler2D tex, in vec2 st, in vec2 pixel, float radius) {
    float blurRadius = radius;
    vec2 whiteNoiseUV = st;
    vec4 result = vec4(0.0);
    for (float i = 0.0; i < 8.0; ++i) {
        vec2 whiteNoiseRand = random2(vec3(whiteNoiseUV.xy+0., i));
        whiteNoiseUV = whiteNoiseRand;

        vec2 r = whiteNoiseRand;
        r.x *= TAU;
        
        #if defined(NOISEBLUR_GAUSSIAN_K)
        // box-muller transform to get gaussian distributed sample points in the circle
        vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(-NOISEBLUR_GAUSSIAN_K * log(r.y));
        #else
        // uniform sample the circle
        vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(r.y);
        #endif
        
        vec4 color = texture2D(tex, st + cr * blurRadius * pixel );
        // average the samples as we get em
        // https://blog.demofox.org/2016/08/23/incremental-averaging/
        result = mix(result, color, 1.0 / (i+1.0));
    }
    return result;
}

// R dither mask
float intensity(vec2 pixel) {
  const float a1 = 0.75487766624669276;
  const float a2 = 0.569840290998;
  return fract(a1 * pixel.x + a2 * pixel.y);
}

float dither(vec2 coords, float color, float grey) {
  // Calculated noised gray value
  float noised = (2.0/grey) * (blueNoise(coords)) + color - (1.0/grey);
  // Clamp to the number of gray levels we want
  float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
  return levels;
}

//saturation function
vec3 sat(vec3 rgb, float intensity) {
  vec3 L = vec3(0.2125, 0.7154, 0.0721);
  vec3 grayscale = vec3(dot(rgb, L));
  return mix(grayscale, rgb, intensity);
}

float smoothFract(float x, float sf) {
  x = fract(x); return min(x, x*(1.-x)*sf);
}

void main() {

  bayer[0] = 0.0;
  bayer[1] = 2.0;
  bayer[2] = 3.0;
  bayer[3] = 1.0;

  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  float height = 0.0;

  if (uResolution.y < 256.) {
    height = floor(uResolution.y / uResolution.y);
  } else {
    height = floor(uResolution.y / uResolution.y);
  }
  
  vec2 pixelBin = gl_FragCoord.xy / height;
  vec2 tiles = uResolution.xy / height;
  vec2 vuv = floor(pixelBin) / tiles;
  vuv.y = 1.0 - vuv.y;

  vec4 c = texture2D(tex0, vuv);

  float step_x = floor(uResolution.y/256.)/uResolution.x;
  float step_y = floor(uResolution.y/256.)/uResolution.y;
  vec4 edgeRight = texture2D(tex0, vuv+vec2(step_x, 0.));
  vec4 edgeBottom = texture2D(tex0, vuv+vec2(0., step_y));
  float dx = length(c-edgeRight)/step_x;
  float dy = length(c-edgeBottom)/step_y;
  float g = length(vec2(dx, dy)) * 0.006;

  vec2 xyPos = floor(pixelBin);//floor(mod(pixelBin.xy, bayerSize));
  int idx = int(xyPos.x) + int(xyPos.y) * int(bayerSize);
  //vec4 dither = nearestColor(c + 5.0 * (indexValue(idx) / bayerDivider)); //bayerDivider normalizes the color range
  vec3 dith = vec3(dither(xyPos, c.r, 2.0), dither(xyPos, c.g, 2.0), dither(xyPos, c.b, 2.0));

  if(g > 0.8) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    //gl_FragColor = vec4(closestColor(1.0-dither.rgb), 1.0);
  } else {
    gl_FragColor = vec4(closestColor(dith.rgb), 1.0);
  }
  //gl_FragColor = vec4(uv.x, c.g, uv.y, 1.0);
  //gl_FragColor = vec4(closestColor(sat(dith.rgb, 1.0)), 1.0);

  
  //emboss
  vec2 lightPosition = vec2(vuv-0.2);
  vec2 offsetUv = (vuv - lightPosition) * 1.01 + lightPosition;

  float a = texture2D(tex0, vuv).x;
  float b = texture2D(tex0, offsetUv).x;
  float difference = (b - a) * 5.0;

  float lighting = difference * 0.5 + 0.5;
  //gl_FragColor = vec4(dith.rgb * vec3(lighting), 1.0);
  //gl_FragColor = vec4(vec3(smoothFract(lighting, 2.0)), 1.0);

  vec4 final = vec4(closestColor(dith.rgb) + difference, 1.0);

  //gl_FragColor = vec4(closestColor(noiseBlur(tex0, vuv, 1.0/uResolution.xy, 50.0).rgb), 1.0);
  gl_FragColor = final;//texture2D(tex0, vuv);

}`

const noisefs = `
#ifdef GL_ES
precision mediump float;
precision mediump sampler2D;
#endif
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform vec3 rc;
uniform float SEED;

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

vec2 random2(vec3 p3) {
  p3 = fract(p3 * vec3(443.897, 441.423, .0973));
  p3 += dot(p3, p3.yzx+19.19);
  return fract((p3.xx+p3.yz)*p3.zy);
}

#define TAU 6.2831853071795864769252867665590
#define NOISEBLUR_GAUSSIAN_K 1.0

vec4 noiseBlur(in sampler2D tex, in vec2 st, in vec2 pixel, float radius) {
    float blurRadius = radius;
    vec2 whiteNoiseUV = st;
    vec4 result = vec4(0.0);
    for (float i = 0.0; i < 8.0; ++i) {
        vec2 whiteNoiseRand = random2(vec3(whiteNoiseUV.xy+0., i));
        whiteNoiseUV = whiteNoiseRand;

        vec2 r = whiteNoiseRand;
        r.x *= TAU;
        
        #if defined(NOISEBLUR_GAUSSIAN_K)
        // box-muller transform to get gaussian distributed sample points in the circle
        vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(-NOISEBLUR_GAUSSIAN_K * log(r.y));
        #else
        // uniform sample the circle
        vec2 cr = vec2(sin(r.x),cos(r.x))*sqrt(r.y);
        #endif
        
        vec4 color = texture2D(tex, st + cr * blurRadius * pixel );
        // average the samples as we get em
        // https://blog.demofox.org/2016/08/23/incremental-averaging/
        result = mix(result, color, 1.0 / (i+1.0));
    }
    return result;
}

const int octaves = 2;

float fbm(vec2 vuv) {
  //int octaves = 6.0;
  float amplitude = 0.5;
  float freq = 2.0;
	float value = 0.0;
  vec2 shift = vec2(10.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

  for(int i = 0; i < octaves; i++) {
      value += amplitude * snoise(vec4(freq*vuv.x*1.0+555.*SEED, freq*vuv.y*1.0+565.*SEED, 0.01*cos(uTime), 0.01*sin(uTime)));
      vuv = rot * vuv * 2.0 + shift;
      amplitude *= 0.6;
      freq *= 1.0;//2
  }
  return value;
}

float circle(vec2 uv, float radius, vec2 ctr){  
  vec2 dist = uv - ctr;
  //iq metaball code: 1.0-smoothstep(0.0,0.7,length(uv-c1));

  float m = 1. - smoothstep(0.0, radius, length(dist) * 1.0);
  return m;//1. - smoothstep(0.0 , 1.5, dot(dist, dist)*radius);
}

float box(vec2 coord, vec2 offset, vec2 dimensions) {
  vec2 shaper = vec2(step(offset.x, coord.x), step(offset.y, coord.y));
  shaper *= vec2(step(coord.x, offset.x + dimensions.x), step(coord.y, offset.y + dimensions.y));

  return shaper.x * shaper.y;
}

vec3 drawParticles(sampler2D tex, vec2 dimensions, vec2 st, float r) {
  vec3 c = vec3(0.0);
  for (int idx = 0; idx <= 720; idx++) {
    float y = floor(float(idx) / dimensions.x);
    float x = mod(float(idx), dimensions.x);
    vec2 texcoord = vec2(x, y) / dimensions;
    if (idx < 50) {
      c += vec3(0.0, circle(st, r, texture2D(tex, texcoord).xy), circle(st, r, texture2D(tex, texcoord).xy));
    } else if (idx < 200) {
      c += vec3(0.0, circle(st, r, texture2D(tex, texcoord).xy), 0.0);
    } else if (idx < 300) {
      c += vec3(0.0, 0.0, circle(st, r, texture2D(tex, texcoord).xy));
    } else if (idx < 500) {
      c += vec3(circle(st, r, texture2D(tex, texcoord).xy), circle(st, r, texture2D(tex, texcoord).xy), 0.0);
    } else {
      c += vec3(circle(st, r, texture2D(tex, texcoord).xy), 0.0, 0.0);
    }
    //c += circle(st, r, texture2D(tex, texcoord).xy);
  }
  return c; 
}

vec2 curl(vec2 pos) {
	float s = 1.;
	pos *= s;
	
	float n = fbm(pos);
	
	float e = 0.001;
	float nx = fbm(pos + vec2(e, 0));
	float ny = fbm(pos + vec2(0, e));
	
	return vec2(-(ny-n),nx-n)/e;
}

const float PI = 3.141592653;

vec2 clampAngle(vec2 coord){
  float angle = PI / 90.0;
  float inangle = atan(coord.y, coord.x);
  float newangle = floor(inangle/angle + 0.5)*angle;
  float l = length(coord);
  vec2 t = vec2(cos(newangle), sin(newangle)) * l;
  return t;
}

void main() {

  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.y / uResolution.x;

  vec2 pixelBin = gl_FragCoord.xy / floor(uResolution.y / 64.0);
  vec2 tiles = uResolution.xy / floor(uResolution.y / 64.0);
  vec2 vuv = floor(pixelBin) / tiles;

  // get the image as a vec4 using texture2D and plug in our distored uv's
  vec4 incolor = vec4(0.0);

  vec3 metaball = vec3(0.0);
  vec3 color = vec3(0.0);
  float rad = 0.03;

  float tx = floor((gl_FragCoord.x/uResolution.x) * 22.0);
  float ty = floor((gl_FragCoord.y/uResolution.y) * 22.0);
  vec2 texcoord = vec2(tx, ty) / vec2(22.0, 22.0);
  //vec2 position = texture2D(tex2, vec2(0.0, 0.0) / vec2(22.0, 22.0)).xy;
  vec2 position = texture2D(tex2, texcoord).xy;

  //color = texture2D(tex1, vuv).rgb;
  color += drawParticles(tex2, vec2(22.0, 22.0), uv, rad);

  float mask = smoothstep(-0.1, 0.1, fbm(vec2(vuv.x*4.1, vuv.y*4.1)));

  float x = fbm(1.1*uv);
  float y = fbm(1.1*uv+vec2(5.0, 1.0));
  vec2 flow = vec2(x*0.01, y*0.01);//curl noise
  
  incolor = texture2D(tex0, uv - clampAngle(flow));

  vec4 final = mix(vec4(color, 1.0), vec4(incolor.rgb, 1.0), 0.995);

  //background color hack
  if (incolor.rgb == vec3(0.0)) {
    //background color
    gl_FragColor = vec4(rc, 1.0);
  } else {
    gl_FragColor = final;
  }

  //gl_FragColor = final;
}`

function genTokenData(projectNum) {
  let data = {};
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += Math.floor(Math.random() * 16).toString(16);
  }
  data.hash = hash;//"0xc85173eb3bb886b8f3f1bed872936bde771d686a351645dcd7ab41b3f3ebaa8b"//hash;
  data.tokenId = (projectNum * 1000000 + Math.floor(Math.random() * 1000)).toString();
  return data;
}

let tokenData = genTokenData(123);

let projectNumber = Math.floor(parseInt(tokenData.tokenId) / 1000000);
let mintNumber = parseInt(tokenData.tokenId) % 1000000;
let R = new Random;
//let noise = new openSimplexNoise(tokenData.hash);
let noise = new Simplex();

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
let devicePixelRatio = window.devicePixelRatio || 1;
let w, h;
window.innerHeight <= window.innerWidth ? (w = Math.max(window.innerHeight, 1) * 0.75, h = Math.max(window.innerHeight, 1)) : (w = Math.max(window.innerWidth, 1), h = Math.max(window.innerWidth, 1) / 0.75);
canvas.width = w;
canvas.height = h;

const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
canvas.style.imageRendering = "pixelated";
canvas.imageSmoothingEnabled = false;

let floatTextures = gl.getExtension('OES_texture_float');

let basev, basef, noisef, ditherf, postf, ppgm, post, lastf, baseSlab, feedback;

let program, numVtx;
let time = 0;

const drawCan = document.createElement('canvas');
const ctx = drawCan.getContext('2d', {alpha: true});
ctx.imageSmoothingEnabled = false;
//document.body.appendChild(drawCan);
drawCan.width = 192;//144 192
drawCan.height = 256;

let mouseX = 0;
let mouseY = 0;
let grabbing = false;
let polygons = [];
let points = [];
let qtree;
let angle = 0.01;
let pts = [];
let ptsTex;

const eps = 1;
const THETA = R.random_choice([0.1, 30]);
const N = R.random_choice([0.1, 0.3, 0.6, 0.9, 1.0]);
const FRICTION = 0.999;
const SHADOW = R.random_dec() > 0.8;
const BG = color();
const MARGIN = 10//R.random_choice([12, 18, 24]);
const XOFF = R.random_int(0, 999);
const YOFF = R.random_int(0, 999);
const LEN = R.random_choice([drawCan.width, drawCan.width/2]);
const PINDEX = 0//parseInt(R.random_dec() * 5);
const RCOLOR = [R.random_choice([0.0, 0.01, 0.01]), R.random_choice([0.0, 0.01, 0.01]), R.random_choice([0.0, 0.01, 0.01])];
const SEED = R.random_dec();
const OUTLINE = R.random_dec();
const OCTAVES = R.random_int(3, 8);

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
  155/256, 34/256, 38/256]
};

const palettes = Object.keys(colorPalettes);
const palette = colorPalettes[palettes[PINDEX]];

let world = [];

function drawLine(poly) {
  let blob = new Array();
  for (let i = 0; i < poly.length; i++) {
    blob.push([poly[i][0], poly[i][1]]);
  }
  return blob;
}

function start() {
  let bg = BG;

  let boundary = new Rectangle(0, 0, drawCan.width, drawCan.height);
  qtree = new QuadTree(boundary, 2);

  for (let i = 0; i < 2000; i++) {
    let poly = generatePolygon();

    if (canPutPoly(poly, points) && polygons.length < 200) {

      polygons.push(poly);
      for (let p = 0; p < poly.length; p++) {
        qtree.insert(poly[p]);
      }
    }
  }

  for (let i = 0; i < polygons.length; i++) {
    let p = polygons[i];
    let f = ["#000000","#ff0000","#ffff00","#00ff00","#00ffff","#ff00ff","#ffffff","#00ff00","#ff00ff","#0000ff"][parseInt(Math.random()*10)];
    world.push(...drawLine(polygons[i])); //pushes list of [x, y]
    for (let j = 0; j < p.length; j++) {
      ctx.fillStyle = f;
      ctx.fillRect(p[j][0], p[j][1], 1, 1);
    }
  }
  console.log(world)
  //draw the points
  for (let i = 0; i < world.length; i++) {
    //ctx.fillStyle = ["#000000","#ff0000","#ffff00","#00ff00","#00ffff","#ff00ff","#ffffff","#00ff00","#ff00ff","#0000ff"][parseInt(Math.random()*10)];
    //ctx.fillRect(world[i][0], world[i][1], 2, 2);
  }

  //create limited array of points
  for (let i = 0; i < 1024; i++) {
    if (world[i] != undefined) {
      pts.push([world[i][0]/drawCan.width, world[i][1]/drawCan.height]);
    } else {
      pts.push([-1.0, -1.0]);
    }
  }

  const ids = new Array(512).fill(0).map((_, i) => i);
  const positions = new Float32Array(ids.map((_, i) => [pts[i][0], pts[i][1], 0, 0]).flat());
  ptsTex = createTexture(gl, positions, 16, 16);

  console.log(RCOLOR, palettes[PINDEX], OCTAVES, SEED);
  console.log(`
  REGOLITH by Galo Canizares (b. 1989)
  all rights reserved
  `);
}

// create and return 1 polygon
function generatePolygon() {

  let xc = random(0, drawCan.width);
  let yc = random(0, drawCan.height);
  let n = Math.floor(random(3, LEN));
  let prev = [xc, yc];

  let poly = [];
  //flow field
  //poly.push([xc, yc]); //debug test
  for (let i = 0; i < n; i++) {
    let a = (fbm(1, prev[0], prev[1], 0.5, 0.002, 0, 1) * Math.PI * 2 * 0.1);
    let nx = -Math.cos(a);
    let ny = -Math.sin(a);
    let nextVector = [nx, ny];
    nextVector[0] *= 6;
    nextVector[1] *= 6;
    let p = prev;
    p[0] += nextVector[0];
    p[1] += nextVector[1];
    poly.push([p[0], p[1]]);
    prev = [p[0], p[1]];
  }

  return poly;
}

function canPutPoly(newPoly) {
  if (polygonIsOut(newPoly)) {
    return false;
  }

  for (let j = 0; j < newPoly.length; j++) {
    let range = new Rectangle(newPoly[j][0], newPoly[j][1], eps * 2, eps * 2);
    //rect(range.x, range.y, range.w, range.h);
    let pts = qtree.query(range);
    for (let i = 0; i < pts.length; i++) {
      if (dist(pts[i][0], pts[i][1], newPoly[j][0], newPoly[j][1]) < eps) {
        return false;
      }
    }
  }
  return true;
}

// check whether we can place the polygon
function canPlace(poly) {
  if (polygonIsOut(poly)) {
    return false;
  }
  for (let poly2 of polygons) {
    if (polygonsIntersect(poly, poly2)) {
      return false;
    }
  }
  return true;
}

// check whether poly has vertices outside of the canvas
function polygonIsOut(poly) {
  for (let v of poly) {
    if ((v[0] < MARGIN) || (v[0] > drawCan.width - MARGIN) || (v[1] < MARGIN) || (v[1] > drawCan.height - MARGIN)) {
      return true;
    }
  }
  return false;
}

function initGL() {
  gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);
  gl.clearColor(1.0,0.0,0.0,1.0);
  gl.viewport(0,0,canvas.width,canvas.height);

}
  
function initSlabs() {
  //generate shaders
  basev = pxShader(basevs, gl.VERTEX_SHADER);
  basef = pxShader(basefs, gl.FRAGMENT_SHADER);
  noisef = pxShader(noisefs, gl.FRAGMENT_SHADER);
  postf = pxShader(postfs, gl.FRAGMENT_SHADER);

  ppgm = pxProgram(basev, basef);

  //create Slab - essentially an FBO with a shader program
  baseSlab = new pxSlab(basev, noisef);
  baseSlab.allocate(canvas.width, canvas.height);

  //create blank FBO
  feedback = new pxFBO();
  feedback.allocate(canvas.width, canvas.height);

  //create postprocessing FBO
  post = new pxSlab(basev, postf);
  post.allocate(canvas.width, canvas.height);

  lastf = new pxFBO();
  lastf.allocate(canvas.width, canvas.height);

  gl.useProgram(post.pgm);
  gl.uniform2fv(gl.getUniformLocation(post.pgm,"uResolution"), [canvas.width, canvas.height]);

  gl.useProgram(baseSlab.pgm);
  gl.uniform2fv(gl.getUniformLocation(baseSlab.pgm,"uResolution"), [canvas.width, canvas.height]);

  initDrawCtx();

  render();
}

const gridImg = gl.createTexture();

function initDrawCtx() {
  for (let i = 0; i < drawCan.width; i += 10) {
    for ( let j = 0; j < drawCan.height; j += 10) {
      //ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = ["#000000","#ff0000","#ffff00","#00ff00","#00ffff","#ff00ff","#cccccc","#00ff00","#ff00ff","#0000ff"][parseInt(Math.random()*10)];
      ctx.fillRect(i, j, 10, 10);
    }
  }
  gridImg.image = drawCan;
  gl.bindTexture(gl.TEXTURE_2D, gridImg);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, drawCan);
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

//fps debug
//let fpsOut = document.getElementById('stats');

let fps = 30;
let now;
let then = Date.now();
let interval;
let delta;
let totalFrames = 30;
let frameStep = 0;
let saveframes = false;

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
    //fpsOut.innerHTML = frameStep;
    //step frame
    if (frameStep > totalFrames - 1) {
      frameStep = 0;
    }
    time = (frameStep / totalFrames) * (Math.PI * 2.0);

    gl.useProgram(baseSlab.pgm);
    gl.uniform3fv(gl.getUniformLocation(baseSlab.pgm, 'rc'), RCOLOR);
    gl.uniform1f(gl.getUniformLocation(baseSlab.pgm, 'SEED'), SEED);
    gl.uniform1f(gl.getUniformLocation(baseSlab.pgm,"uTime"), time);
    gl.uniform2fv(gl.getUniformLocation(baseSlab.pgm,"uResolution"), [canvas.width, canvas.height]);

    gl.useProgram(post.pgm);
    gl.uniform3fv(gl.getUniformLocation(post.pgm, 'palette'), palette);

    //clear the frame
    gl.clear(gl.COLOR_BUFFER_BIT);
    //bind the "base" slab
    baseSlab.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    //draw the "feedback" image base along with any other textures, using the baseSlab shader
    feedback.draw3(baseSlab.pgm, gridImg, ptsTex);
    //feedback.draw(baseSlab.pgm);

    //bind the postprocessing slab and draw 
    post.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    //baseSlab.draw2(post.pgm, texA);
    baseSlab.draw(post.pgm);

    //bind the feedback slab and draw to the postprocessing fbo
    feedback.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    baseSlab.draw(ppgm);

    //bind the empty fbo and draw the feedback texture to the postprocessing fbo
    lastf.start();
    gl.clear(gl.COLOR_BUFFER_BIT);
    post.draw2(post.pgm, ppgm.texture);

    //unbind the framebuffer so that we draw to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //draw the base buffer to screen
    post.draw(ppgm);
  
    frameStep += 1;
    if (saveframes) {
      saveAsFrame(frameStep);
    }
    if (frameStep == 200) {
      //saveAsFrame(frameStep);
      console.log("preview trigger!")
    }
  }
}

function screenshot(e) {
  if (e.key === 's') {
    saveAsImage();
  }
  if (e.key === 'z') {
    fps = 3;
    saveframes = true;
  }
  if (e.key === 'q') {
    fps = 30;
    saveframes = false;
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
    saveFile(imgData.replace(str, 'image/octet-stream'), "REGOLITH-"+tokenData.hash+".png");
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
    saveFile(imgData.replace(str, 'image/octet-stream'), "REGOLITH-"+addLeadingZeros(num, 3)+".png");
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
//screenshot
document.addEventListener('keydown', screenshot);

//trigger
start();
initGL();
initSlabs();