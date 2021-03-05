let cx = document.getElementById("canvas").getContext("2d");
let mouseX = 0;
let mouseY = 0;
let mouseDown = null;
let dragged = null;

class bezierAnchor {
  constructor(x, y, r, color, parent) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.moving = false;
    this.color = color;
    this.parent = parent;
  }

  update() {
    this.draw();
    if (mouseDown) {
      if (this.mouseOver() && dragged == null) {
        this.moving = true;
        dragged = this;
      }
    } else {
      this.moving = false;
      dragged = null;
    }

    if (this.moving) this.move();
    // console.log(this.parent.offsetX);
  }

  mouseOver() {
    var a = this.x - mouseX;
    var b = this.y - mouseY;
    var c = Math.sqrt(a * a + b * b);
    return c <= this.r ? true : false;
  }

  draw() {
    // draw line
    cx.strokeStyle = "rgba(0,0,0,0.5)";
    cx.beginPath();
    cx.moveTo(this.x, this.y);
    cx.lineTo(this.parent.x, this.parent.y);
    cx.stroke();

    cx.fillStyle = this.color;
    cx.beginPath();
    cx.ellipse(this.x, this.y, this.r, this.r, Math.PI / 4, 0, 2 * Math.PI);
    cx.fill();
  }

  move() {
    this.x = mouseX;
    this.y = mouseY;
    const xOffset = this.x - this.parent.x;
    const yOffset = this.y - this.parent.y;

    if (this.parent.type === 2) {
      if (this.parent.anchor == this) {
        this.parent.offSetX = xOffset;
        this.parent.offSetY = yOffset;

        this.parent.anchor2.x = this.parent.x - (this.x - this.parent.x);
        this.parent.anchor2.y = this.parent.y - (this.y - this.parent.y);
      } else {
        this.parent.offSetX = -xOffset;
        this.parent.offSetY = -yOffset;

        this.parent.anchor.x = this.parent.x - (this.x - this.parent.x);
        this.parent.anchor.y = this.parent.y - (this.y - this.parent.y);
      }
    } else {
      this.parent.offSetX = xOffset;
      this.parent.offSetY = yOffset;
    }
  }
}

class controlPoint {
  constructor(x, y, r, color, anX, anY, type) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.offSetX = anX;
    this.offSetY = anY;
    this.moving = false;
    this.color = color;
    this.anchor = new bezierAnchor(
      this.x + this.offSetX,
      this.y + this.offSetY,
      4,
      "red",
      this
    );
    if (type === 2) {
      this.anchor2 = new bezierAnchor(
        this.x - this.offSetX,
        this.y - this.offSetY,
        4,
        "red",
        this
      );
    }
    this.type = type;
    this.update();
  }

  update() {
    // console.log(this.offSetX);

    this.anchor.update();
    if (this.type === 2) this.anchor2.update();
    this.draw();
    if (mouseDown) {
      if (this.mouseOver() && dragged == null) {
        this.moving = true;
        dragged = this;
      }
    } else {
      this.moving = false;
      dragged = null;
    }

    if (this.moving) this.move();
  }

  mouseOver() {
    var a = this.x - mouseX;
    var b = this.y - mouseY;
    var c = Math.sqrt(a * a + b * b);
    return c <= this.r ? true : false;
  }

  draw() {
    cx.fillStyle = this.color;
    cx.beginPath();
    cx.ellipse(this.x, this.y, this.r, this.r, Math.PI / 4, 0, 2 * Math.PI);
    cx.fill();
  }

  move() {
    this.x = mouseX;
    this.y = mouseY;
    if (this.type === 2) {
      this.anchor.x = this.x + this.offSetX;
      this.anchor2.x = this.x - this.offSetX;
      this.anchor.y = this.y + this.offSetY;
      this.anchor2.y = this.y - this.offSetY;
    } else if (this.type === 1) {
      this.anchor.x = this.x + this.offSetX;
      this.anchor.y = this.y + this.offSetY;
    }
  }
}

class bezier {
  constructor(points) {
    this.points = [];
    for (let i = 0; i < points.length; i++) {
      const point = new controlPoint(
        points[i][0],
        points[i][1],
        6,
        "green",
        points[i][2],
        points[i][3],
        i == 0 || i == points.length - 1 ? 1 : 2
      );
      this.points.push(point);
    }
    console.log(this.points);
    this.update();
  }

  update() {
    cx.beginPath();
    for (let i = 0; i < this.points.length - 1; i++) {
      const point = this.points[i];
      const ax = point.type == 1 ? point.anchor.x : point.anchor2.x;
      const ay = point.type == 1 ? point.anchor.y : point.anchor2.y;
      cx.moveTo(this.points[i].x, this.points[i].y);
      cx.bezierCurveTo(
        ax,
        ay,
        this.points[i + 1].anchor.x,
        this.points[i + 1].anchor.y,
        this.points[i + 1].x,
        this.points[i + 1].y
      );
    }
    cx.stroke();

    for (let i = 0; i < this.points.length; i++) {
      this.points[i].update();
    }
  }
}

const bez = new bezier([
  [100, 300, 80, 20],
  [200, 150, -50, 20],
  [420, 250, -100, -20],
  [450, 50, 50, 50],
]);

function draw() {
  // define width and height
  cx.canvas.width = window.innerWidth;
  cx.canvas.height = window.innerHeight;
  cx.fillStyle = "white";
  cx.fillRect(0, 0, canvas.width, canvas.height);

  bez.update();
}

setInterval(draw, 10);

canvas.addEventListener("mousemove", function (event) {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

canvas.addEventListener("mousedown", function (event) {
  mouseDown = true;
});

canvas.addEventListener("mouseup", function (event) {
  mouseDown = false;
});
