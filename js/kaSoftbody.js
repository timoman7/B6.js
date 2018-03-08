//Hitboxes
var _Error = new Object.constructor("return Error;")();
var clone = function(arr) {
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    temp.push(new PVector(arr[i].x, arr[i].y));
  }
  return temp;
};
PVector.prototype.applyForce = function() {
  if (arguments.length === 0 || arguments.length > 3) {
    var newErr = new _Error("applyForce requires atleast (1) argument, you supplied (" + arguments.length + ")!");
    throw newErr;
  }
  if (arguments.length === 1) {
    this.force = new PVector(arguments[0].x, arguments[0].y, arguments[0].z);
  }
  if (arguments.length === 2) {
    this.force = new PVector(arguments[0], arguments[1], 0);
  }
  if (arguments.length === 3) {
    this.force = new PVector(arguments[0], arguments[1], arguments[2]);
  }
  this.x += this.force.x;
  this.y += this.force.y;
  this.z += this.force.z;
};
var PVmid = function(v1, v2) {
  var temp = new PVector(v1.x, v1.y, v1.z);
  temp.x += v2.x;
  temp.y += v2.y;
  temp.z += v2.z;
  temp.div(2);
  return temp;
};
var firstErr = false;
var Hitbox = function(points) {
  this.originShape = points;
  this.points = points;
  this.options = {
    mass: 1,
    res: 0.5,
    cof: 0.5,
    x: 0,
    y: 0,
  };
  this.checkCol = function(tx, ty, accuracy, tpx, tpy) {
    for (var i = 0; i < this.points.length; i++) {
      var curP = this.points[i];
      this.points[i].px = this.points[i].x;
      this.points[i].py = this.points[i].y;
      fill(255, 0, 0);
      var td = dist(tx, ty, curP.x, curP.y);
      var ntx = tx;
      var nty = ty;
      if (tpx !== undefined) {
        ntx = tx - tpx;
      } else {
        ntx = tx;
      }
      if (tpy !== undefined) {
        nty = ty - tpy;
      } else {
        nty = ty;
      }
      var tdx = curP.x - ntx;
      var tdy = curP.y - nty;
      if (td < accuracy) {
        fill(0, 255, 0);
        ellipse(tx, ty, 8, 8);
        /*
        if(tdx>accuracy){
            tdx-=accuracy;
        }if(tdx<-accuracy){
            tdx+=accuracy;
        }if(tdy>accuracy){
            tdy-=accuracy;
        }if(tdy<accuracy){
            tdy+=accuracy;
        }
        */
        tdx = tdx * 0.6;
        tdy = tdy * 0.6;
        var force = new PVector(tdx, tdy);
        this.points[i].applyForce(force);
      }
      try {
        if (i === 0) {
          if (dist(this.points[this.points.length - 1].px, this.points[this.points.length - 1].py, this.points[this.points.length - 1].x, this.points[this.points.length - 1].y) > accuracy) {
            var temp = new PVector(
              this.points[this.points.length - 1].x,
              this.points[this.points.length - 1].y,
              this.points[this.points.length - 1].z);
            temp.px = this.points[this.points.length - 1].px;
            temp.py = this.points[this.points.length - 1].py;
            var temp2 = new PVector(temp.x, temp.y, temp.z);
            temp2.px = this.points[this.points.length - 1].px;
            temp2.py = this.points[this.points.length - 1].py;
            temp2.x -= temp.px;
            temp2.y -= temp.py;
            temp.x += temp2.x - accuracy;
            temp.y += temp2.y - accuracy;
            this.points[this.points.length - 1] = temp;
          }
        } else {
          var d = dist(this.points[i - 1].px, this.points[i - 1].py, this.points[i - 1].x, this.points[i - 1].y);
          if (d > accuracy) {
            var temp = new PVector(this.points[i - 1].x, this.points[i - 1].y, this.points[i - 1].z);
            temp.px = this.points[i - 1].px;
            temp.py = this.points[i - 1].py;
            var temp2 = new PVector(temp.x, temp.y, temp.z);
            temp2.px = this.points[i - 1].px;
            temp2.py = this.points[i - 1].py;
            temp2.x -= temp.px;
            temp2.y -= temp.py;
            temp.x += temp2.x;
            temp.y += temp2.y;
            this.points[i - 1] = temp;
          }
        }
      } catch (err) {
        println(err);
      }
    }
  };
  this.addPoint = function(px, py, indx) {
    var front = [];
    var back = [];
    var temp = [];
    for (var i = 0; i < indx; i++) {
      front.push(this.points[i]);
    }
    for (var i = indx; i < this.points.length; i++) {
      back.push(this.points[i]);
    }
    for (var i = 0; i < front.length; i++) {
      temp.push(front[i]);
    }
    temp.push(new PVector(px, py));
    for (var i = 0; i < back.length; i++) {
      temp.push(back[i]);
    }
    this.points = temp;
  };
  this.refine = function(iterations) {
    for (var inc = 0; inc < iterations; inc++) {
      var temp = [];
      var temp2 = [];
      for (var i = 0; i < this.points.length - 1; i++) {
        temp.push(PVmid(this.points[i], this.points[i + 1]));
      }
      temp.push(PVmid(this.points[this.points.length - 1], this.points[0]));
      for (var i = 0; i < this.points.length; i++) {
        temp2.push(this.points[i]);
        temp2.push(temp[i]);
      }
      this.points = temp2;
    }
    this.originShape = clone(this.points);
  };
  this.refine(5);
  this.update = function() {
    for (var i = 0; i < this.points.length; i++) {
      var d = dist(this.points[i].x, this.points[i].y, this.originShape[i].x, this.originShape[i].y);
      if (d > 9) {
        this.points[i].x = lerp(this.points[i].x, this.originShape[i].x, this.options.res) + this.options.x;
        this.points[i].y = lerp(this.points[i].y, this.originShape[i].y, this.options.res) + this.options.y;
        this.points[i].z = lerp(this.points[i].z, this.originShape[i].z, this.options.res);
        //println(this.points[i]);
      }
    }
  };
  this.draw = function() {
    fill(255);
    beginShape();
    for (var i = 0; i < this.points.length; i++) {
      fill(255);
      ellipse(this.points[i].x, this.points[i].y, 4, 4);
      vertex(this.points[i].x, this.points[i].y);
    }
    vertex(this.points[0].x, this.points[0].y);
    endShape();
  };
};
var Softbody = function(x, y, options, hitbox) {
  this.x = x;
  this.y = y;
  this.options = options;
  this.mass = options.mass || 1;
  this.res = options.res || 0.5;
  this.cof = options.cof || 0.5;
  this.hitbox = hitbox;
  this.options.x = this.x;
  this.options.y = this.y;
  this.hitbox.options = this.options;

  this.addPoint = function(px, py, indx) {
    this.hitbox.addPoint(px + this.x, py + this.y, indx);
  };
  this.checkDist = function() {

  };
  this.checkCollisions = function() {
    this.hitbox.checkCol(mouseX, mouseY, 6);
  };
  this.update = function() {
    this.checkCollisions();
    this.checkDist();
    this.hitbox.update();
  };
  this.draw = function() {
    this.hitbox.draw();
  };
};
var addPV = function(prnt, x, y) {
  prnt.push(new PVector(x, y));
};
var points = [];
addPV(points, 0, 0);
addPV(points, 30, 30);
addPV(points, 30, 0);
var testHit = new Hitbox(points);
testHit.options.x = 200;
testHit.options.y = 200;
var test = new Softbody(200, 200, {
  res: 0.5,
  mass: 0.5,
  cof: 0.5,
  x: 200,
  y: 200
}, testHit);
draw = function() {
  background(255);
  test.draw();
  test.update();
};
