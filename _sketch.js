let capture;
let timeWarpScan;
let stripRatio = 0.001;
let input;
let img;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  input = createFileInput(handleFile);
  timeWarpScan = new TimeWarpScan();
}

function draw() {
  background(0);
  // push();
  translate(width, 0);
  scale(-1, 1);

  if (img){
    image(img, 0, 0, width/6, (width * img.height) / (img.width*6))
  }
  timeWarpScan.draw();
  // pop();
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data, '');
  } else {
    img = null;
  }
}



function keyPressed() {
  console.log(key)
  if (key === 'Enter') {
    window.setTimeout(() => {
      timeWarpScan.start();
      console.log('start')
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
    if (img.loadedmetadata && this.position >= 0) {
      // [3]
      let column = img.get(
        this.position * img.width,
        0,
        Math.ceil(img.width * stripRatio),
        img.height
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
    this.images.forEach((imga) => {
      imga.draw();
    });
  }
}
