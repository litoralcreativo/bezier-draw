let cx = document.getElementById("canvas").getContext("2d");
let mouseX = 0;
let mouseY = 0;
let mouseDown = "false";

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
      if (this.mouseOver()) {
        this.moving = true;
      }
    } else {
      this.moving = false;
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
    const xOffset = this.parent.x;
    this.parent.offsetX = xOffset;
    // console.log(this.parent.offSetX);
  }
}

class controlPoint {
  offSetX = 0;
  constructor(x, y, r, color, anX, anY) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.offSetX = anX;
    this.offSetY = anY;
    this.moving = false;
    this.color = color;
    this.parent = parent;
    this.anchor = new bezierAnchor(
      this.x + this.offSetX,
      this.y + this.offSetY,
      4,
      "red",
      this
    );
    this.update();
  }

  update() {
    // console.log(this.offSetX);

    this.anchor.update();
    this.draw();
    if (mouseDown) {
      if (this.mouseOver()) {
        this.moving = true;
      }
    } else {
      this.moving = false;
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
    // this.anchor.x = this.x + this.offSetX;
  }
}

// let first = new controlPoint(100, 150, 5, "red");
// let second = new controlPoint(400, 100, 5, "red");
let start = new controlPoint(150, 300, 6, "green", 50, 50);
let end = new controlPoint(420, 250, 6, "green", -50, -100);

function draw() {
  // define width and height
  cx.canvas.width = window.innerWidth;
  cx.canvas.height = window.innerHeight;
  cx.fillStyle = "white";
  cx.fillRect(0, 0, canvas.width, canvas.height);

  cx.beginPath();
  cx.moveTo(start.x, start.y);
  cx.bezierCurveTo(
    start.anchor.x,
    start.anchor.y,
    end.anchor.x,
    end.anchor.y,
    end.x,
    end.y
  );
  cx.stroke();

  start.update();
  end.update();
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
