let capture;
let timeWarpScan;
let stripRatio = 0.001;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  capture = createCapture(VIDEO);
  capture.hide();
  noStroke();
  timeWarpScan = new TimeWarpScan();
}

function draw() {
  background(0);
  push();
  translate(width, 0);
  scale(-1, 1);

  image(capture, 0, 0, width, (width * capture.height) / capture.width);
  timeWarpScan.draw();
  pop();
}

function keyPressed() {
  if (key === ' ') {
    window.setTimeout(() => {
      timeWarpScan.start();
    }, 3000);
  }
}

function getDisplayHeight() {
  return (width * capture.height) / capture.width;
}

class TimeWarpImage {
  constructor(image, position) {
    this.image = image;
    this.position = position;
  }

  draw() {
    image(
      this.image,
      width * this.position,
      0,
      stripRatio * width,
      getDisplayHeight()
    );
  }
}

class TimeWarpScan {
  constructor() {
    this.images = [];
    this.position = 1;
    this.active = false;
    this.done = false;
  }

  draw() {
    this.captureVideo();
    fill(color('#0EEE29'));
    rect(this.position * width, 0, 5, getDisplayHeight());
  }

  start() {
    this.images = [];
    this.done = false;
    this.position = 1;
    this.active = true;
  }
  captureVideo() {
    // [1]
    if (!this.active) return;

    // [2]
    if (capture.loadedmetadata && this.position >= 0) {
      // [3]
      let column = capture.get(
        this.position * capture.width,
        0,
        Math.ceil(capture.width * stripRatio),
        capture.height
      );

      this.images.push(new TimeWarpImage(column, this.position));

      // [5]
      this.position -= stripRatio;
    }

    //[6]
    if (this.position > 1) {
      this.done = true;
    }

    // [7]
    this.images.forEach((img) => {
      img.draw();
    });
  }
}
