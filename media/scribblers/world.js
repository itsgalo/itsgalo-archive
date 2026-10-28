//physics classes for physics interactions
//office ca 2022

class World {
  constructor() {
    this.bodies = [];
  }
  joinBodies(...args) {
    let joinedBody = new Body(this.iterations);

    let points = [];
    let springs = [];

    // loop through the args and push points and sticks to the array
    for (let i = 0; i < args.length; i++) {
      points.push(args[i].points);
      springs.push(args[i].springs);

      // get the index which item we should splice in [this.entities]
      let index = this.bodies.indexOf(args[i]);
      this.bodies.splice(index, 1);
    }

    // join multiple arrays
    points = [].concat.apply([], points);
    springs = [].concat.apply([], springs);

    // add the arrays to the joined body
    joinedBody.points = points;
    joinedBody.springs = springs;

    // add the mix::Entity to [this.entities]
    this.addBody(joinedBody);
    return joinedBody; // return for chaining
  }
  addBody(body) {
    this.bodies.push(body);
  }
  update(ctx, canvas, mx, my, md) {
    for (let i = 0; i < this.bodies.length; i++) {
      this.bodies[i].update(ctx, canvas, mx, my, md);
    }
  }
}

class Body {
  constructor(iterations) {
    this.points = [];
    this.springs = [];
    this.iterations = iterations || 4;
  }

  addPoint(x, y, r, c) {
    this.points.push(new Point(x, y, r, c));
  }

  addSpring(p1, p2, color, length) {
    //this.springs.push(new Spring(this.points[p1], this.points[p2], color, length));
    this.springs.push(new Spring(p1, p2, color, length));
  }

  removeSpring(sp) {
    this.springs.splice(this.springs.indexOf(sp), 1);
  }

  tear(threshold) {
    for (let i = 0; i < this.springs.length; i++) {
      // find the distance between two points
      let dx = this.springs[i].endPoint.pos.x - this.springs[i].startPoint.pos.x;
      let dy = this.springs[i].endPoint.pos.y - this.springs[i].startPoint.pos.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > (threshold || 150)) { // remove if the dist is > than threshold
        this.removeSpring(this.springs[i]);
      }
    }
  }

  trackPoints(mx, my) {
    for (let i = 0; i < this.points.length; i++) {
      let dx = mx - this.points[i].pos.x;
      let dy = my - this.points[i].pos.y;
      if ((dx*dx) / Math.pow(this.points[i].radius, 2) + (dy*dy) / Math.pow(this.points[i].radius, 2) <= 1) {
        if (!this.points.find(e => e.grabbed == true)) {
          this.points[i].grabbable = true;
        }
      } else {
        this.points[i].grabbable = false;
      }
    }
  }

  collidePoints() {
    for (let i = 0; i < this.points.length; i++) {
      let pt = this.points[i];
      pt.collide(this.points, i);
    }
  }

  updatePoints(c, mx, my, md) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].update(c, mx, my, md);
    }
  }

  updateSprings() {
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].update();
    }
  }

  updateConstraints(c, m) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].constrain(c, m);
    }
  }

  renderPoints(ctx) {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].render(ctx);
    }
  }
  renderSprings(ctx) {
    //render shadows
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].renderShadow(ctx);
    }
    //render springs
    for (let i = 0; i < this.springs.length; i++) {
      this.springs[i].render(ctx);
    }
  }

  update(ctx, canvas, mx, my, md) {
    this.trackPoints(mx, my);
    this.updatePoints(canvas, mx, my, md);
    //this.tear(200);
    for (let j = 0; j < this.iterations; j++) {
      this.collidePoints();
      this.updateSprings();
      this.updateConstraints(canvas, 20);
    }

    this.renderPoints(ctx);
    this.renderSprings(ctx);
  }
}

class Spring {
  constructor(p1, p2, color, length) {
    this.startPoint = p1;
    this.endPoint = p2;
    this.stiffness = 2;
    this.color = color;
    this.weight = strokeWeight;
    // if the length is not given then calculate the distance based on position
    if (!length) {
      this.length = this.startPoint.pos.dist(this.endPoint.pos);
    } else {
      this.length = length;
    }
  }
  update() {
    // calculate the distance between two dots
    let dx = this.endPoint.pos.x - this.startPoint.pos.x;
    let dy = this.endPoint.pos.y - this.startPoint.pos.y;
    // pythagoras theorem
    let dist = Math.sqrt(dx * dx + dy * dy);
    // calculate the resting distance betwen the dots
    let diff = (this.length - dist) / dist * this.stiffness;

    // getting the offset of the points
    let offsetx = dx * diff * 0.1;//default 0.5
    let offsety = dy * diff * 0.1;//default 0.5

    // calculate mass
    let m1 = this.startPoint.mass + this.endPoint.mass;
    let m2 = this.startPoint.mass / m1;
    m1 = this.endPoint.mass / m1;

    // and finally apply the offset with calculated mass
    if (!this.startPoint.pinned) {
      this.startPoint.pos.x -= offsetx * m1;
      this.startPoint.pos.y -= offsety * m1;
    }
    if (!this.endPoint.pinned) {
      this.endPoint.pos.x += offsetx * m2;
      this.endPoint.pos.y += offsety * m2;
    }
  }
  render(ctx) {
    ctx.beginPath();
    if (dashed) {
      ctx.setLineDash([5, 15]);
    }
    ctx.lineWidth = this.weight;
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.startPoint.pos.x, this.startPoint.pos.y);
    ctx.lineTo(this.endPoint.pos.x, this.endPoint.pos.y);
    ctx.stroke();
    ctx.closePath();
  }
  renderShadow(ctx) {
    let off;
    ctx.beginPath();
    ctx.lineWidth = this.weight*2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = "black";
    if (isOutlined) {
      off = 0;
    } else {
      off = this.weight;
    }
    ctx.moveTo(this.startPoint.pos.x+off, this.startPoint.pos.y+off);
    ctx.lineTo(this.endPoint.pos.x+off, this.endPoint.pos.y+off);
    ctx.stroke();
    ctx.closePath();
  }
}

class Point {
  constructor(x, y, r, c) {
    this.pos = new Vector(x, y, 0);
    this.oldpos = new Vector(x, y, 0);
    this.vel = new Vector(0, 0, 0);
    this.pinned = false;
    this.grabbed = false;
    this.grabbable = false;
    this.friction = 0.999;
    this.bounce = 0.9;
    this.index = 0;
    this.isCollided = false;
    //this.groundFriction = 0.9;

    this.gravity = new Vector(0, 0.0, 0);

    this.radius = r;
    this.color = c;
    this.mass = 1;
  }
  pin() {
    this.pinned = true;
    return this;
  }
  unpin() {
    this.pinned = false;
    return this;
  }
  applyImpulse(x, y, z) {
    this.applyForce(new Vector(x, y, z));
  }
  applyForce(f) {
    this.pos.addVector(f);
  }
  collide(otherPoints, i) {
    this.index = i;
    for (let p = 0; p < otherPoints.length; p++) {
      let other = otherPoints[p];
      if (other.index != this.index) {
        //let dist = Vector.distXY(bp.pos.x, pt.pos.x, bp.pos.y, pt.pos.y);
        let dx = Math.abs(other.pos.x - this.pos.x);
        let dy = Math.abs(other.pos.y - this.pos.y);
        let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (dist < this.radius + other.radius) {
          let newvel = this.pos.copy();
          newvel = newvel.subVector(other.pos);
          newvel = newvel.div(dist);
          newvel = newvel.mult(dist - (this.radius + other.radius))
          newvel = newvel.mult(-this.bounce);
          this.pos = this.pos.addVector(newvel);
          other.pos = other.pos.subVector(newvel);
        }
      }
    }
  }
  update(c, mx, my, md) {
    if (this.pinned) return;
    if (this.grabbable && md) {
      this.grabbed = true;
    } else if (!md) {
      this.grabbed = false;
    }
    if (this.grabbed) {
      this.pos.x = mx;
      this.pos.y = my;
      this.oldpos.setXYZ(this.pos.x, this.pos.y, 0);
    } else {
      this.vel = Vector.sub(this.pos, this.oldpos);
      this.vel.mult(this.friction);

      this.oldpos.setXYZ(this.pos.x, this.pos.y, 0);
      this.pos.addVector(this.vel);
      this.pos.addVector(this.gravity);
    }
  }
  constrain(c, margin) {
    this.vel = Vector.sub(this.pos, this.oldpos);
    this.vel.mult(this.friction);

     if (this.pos.x > (c.width-margin) - this.radius) {
       this.pos.x = (c.width-margin) - this.radius;
       this.oldpos.x = this.pos.x + this.vel.x * this.restitution;
     }
     if (this.pos.x < this.radius+margin) {
       this.pos.x = this.radius+margin;
       this.oldpos.x = this.pos.x + this.vel.x * this.restitution;
     }
     if (this.pos.y > (c.height-margin) - this.radius) {
       this.pos.y = (c.height-margin) - this.radius;
       this.oldpos.y = this.pos.y + this.vel.y * this.restitution;
     }
     if (this.pos.y < this.radius+margin) {
       this.pos.y = this.radius+margin;
       this.oldpos.y = this.pos.y + this.vel.y * this.restitution;
     }
  }
  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

class Vector {

  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
  //static functions are of the class itself, like P5.Vector. use Vector.zero();
  static zero() {
      return new Vector(0, 0, 0);
  }
  static fromAngle(t) {
      return new Vector(Math.cos(t), Math.sin(t))
  }
  static random2D() {
      return Vector.fromAngle(Math.random() * Math.PI * 2)
  }
  static add(t, e) {
      return new Vector(t.x + e.x, t.y + e.y, t.z + e.z)
  }
  static sub(t, e) {
      return new Vector(t.x - e.x, t.y - e.y, t.z - e.z)
  }
  static div(t, e) {
      return new Vector(t.x / e, t.y / e, t.z / e)
  }
  static mult(t, e) {
      return new Vector(t.x * e, t.y * e, t.z * e)
  }
  static angleBetween(t, e) {
      if (t.x == 0 && t.y == 0 && t.z == 0 || e.x == 0 && e.y == 0 && e.z == 0) return 0;
      let r = t.x * e.x + t.y * e.y + t.z * e.z,
          n = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z),
          o = Math.sqrt(e.x * e.x + e.y * e.y + e.z * e.z),
          s = r / (n * o);
      return s <= -1 ? Math.PI : s >= 1 ? 0 : Math.acos(s)
  }
  static average(t) {
      if (t.length === 0) return;
      let e = new Vector;
      return t.forEach(r => e.addVector(r)), e.div(t.length), e;
  }
  static distXY(t1, t2, e1, e2) {
      let y = Math.abs(t2 - t1);
      let x = Math.abs(e2 - e1);
      return Math.sqrt(x * x + y * y);
  }
  dist(t) {
      let e = t.x - this.x;
      let r = t.y - this.y;
      let n = t.z - this.z;
      return Math.sqrt(e * e + r * r + n * n);
  }
  distXY(t, e) {
      let r = t - this.x;
      let n = e - this.y;
      return Math.sqrt(r * r + n * n);
  }
  addVector(t) {
      this.x += t.x;
      this.y += t.y;
      this.z += t.z;
      return this;
  }
  add(t, e, r) {
      this.x += t;
      this.y += e;
      this.z += r;
      return this;
  }
  subVector(t) {
      this.x -= t.x
      this.y -= t.y
      this.z -= t.z
      return this;
  }
  sub(t, e, r) {
      this.x -= t;
      this.y -= e;
      this.z -= r;
      return this;
  }
  mult(t) {
      this.x *= t;
      this.y *= t;
      this.z *= t;
      return this;
  }
  div(t) {
      this.x /= t;
      this.y /= t;
      this.z /= t;
      return this;
  }
  magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  magnitudeSquared() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  heading2D() {
      return Math.atan2(this.y, this.x)
  }
  normalize() {
      let t = this.magnitude();
      this.div(t);
      return this;
      //return new Vector(this.x/(Math.sqrt(this.x * this.x + this.y * this.y)), this.y/(Math.sqrt(this.x * this.x + this.y * this.y)));
  }
  setMag(t) {
      this.normalize();
      this.mult(t);
      return this;
  }
  copy() {
      return new Vector(this.x, this.y, this.z);
  }
  rotate(t, angle) {
      let radians = (Math.PI / 180) * angle;
      let cos = Math.cos(radians);
      let sin = Math.sin(radians);
      let nx = (cos * (this.x - t.x)) + (sin * (this.y - t.y)) + t.x;
      let ny = (cos * (this.y - t.y)) - (sin * (this.x - t.x)) + t.y;
      return new Vector(nx, ny, 0);
  }
  zero() {
      this.x = this.y = this.z = 0;
  }
  set(t, e, r) {
      this.x = t;
      this.y = e;
      this.z = r;
  }
  setFromVector(t) {
      this.x = t.x;
      this.y = t.y;
      this.z = t.z;
  }
  setXYZ(t, e, r) {
      this.x = t;
      this.y = e;
      this.z = r;
  }
  swapXY() {
      let t = this.x;
      this.x = this.y;
      this.y = t;
  }
  toString() {
      return "<" + this.x + ", " + this.y + ", " + this.z + ">";
  }
  dot(t) {
      let e = Vector.angleBetween(this, t);
      return this.magnitude() * t.magnitude() * Math.cos(e);
  }
  cross(t) {
      let e = Vector.angleBetween(this, t);
      return this.magnitude() * t.magnitude() * Math.sin(e);
  }
}
