/* Explanations at junerockwell.com */
var canvas, context;
var star_img = new Image();
var isDraggable = false;

var currentX = 0;
var currentY = 0;
let input;
var img = new Image();
let timeWarpScan;
let stripRatio = 0.001;


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    timeWarpScan = new TimeWarpScan();
    canvas = document.getElementById("defaultCanvas0");
    context = canvas.getContext("2d");
  }


// image upload 
var imageLoader = document.getElementById('imageloader')
imageLoader.addEventListener('change', function(e){ handleImage(e)});


var handleImage = function (e) {
    var reader = new FileReader();
    reader.onload = function(e) {      
        img.onload = function( ) {
            resizeCanvas(img.width/2, img.height/2)
            currentX = canvas.width/2;
            currentY = canvas.height/2;
            _Go();
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(e.target.files[0]); 
}

function keyPressed() {
    if (key === ' ') {
        window.setTimeout(() => {
            timeWarpScan.start();
          }, 3000);
    }
}


  function getDisplayHeight() {
    return (width * canvas.height) / canvas.width;
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
        
      const imageData = context.getImageData(0,0, canvas.width, canvas.height);
      // [2]
      if ( imageData && this.position > 0) {
          
        // [3]
        let column = get(
          this.position * imageData.width,
          0,
          Math.ceil(imageData.width * stripRatio),
          imageData.height
        );
        this.images.push(new TimeWarpImage(column, this.position));
  
        // [5]
        this.position -= stripRatio;
      }
  
      //[6]
      if (this.position == 0) {
        this.done = true;
        console.log('done')
        var img = ctx.createImageData(w, h);
        for (var i = img.data.length; --i >= 0; )
        img.data[i] = 0;
        ctx.putImageData(img, 100, 100);
        context.drawImage(img, currentX-(img.width/8), currentY-(img.height/8),img.width/4, img.height/4 );
      }
  
      // [7]
      this.images.forEach((imga) => {
        imga.draw();
      });
      console.log(this.position)
    }
  }


function _Go() {
  _MouseEvents();

  setInterval(function() {
    _ResetCanvas();
    _DrawImage();
  }, 1000/30);
}
function _ResetCanvas() {
  context.fillStyle = '#fff';
  context.fillRect(0,0, canvas.width, canvas.height);
}
function _MouseEvents() {
  canvas.onmousedown = function(e) {

    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;


    if (mouseX >= (currentX - img.width/2) &&
        mouseX <= (currentX + img.width/2) &&
        mouseY >= (currentY - img.height/2) &&
        mouseY <= (currentY + img.height/2)) {
      isDraggable = true;
      //currentX = mouseX;
      //currentY = mouseY;
    }
  };
  canvas.touchstart = function(e) {
    getTouchPos(canvas, e);
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;


    if (mouseX >= (currentX - img.width/2) &&
        mouseX <= (currentX + img.width/2) &&
        mouseY >= (currentY - img.height/2) &&
        mouseY <= (currentY + img.height/2)) {
      isDraggable = true;
      //currentX = mouseX;
      //currentY = mouseY;
    }
  };
  canvas.onmousemove = function(e) {

    if (isDraggable) {
      currentX = e.pageX - this.offsetLeft;
      currentY = e.pageY - this.offsetTop;
    }
  };
  canvas.touchmove = function(e) {

    if (isDraggable) {
      currentX = e.pageX - this.offsetLeft;
      currentY = e.pageY - this.offsetTop;
    }
  };
  canvas.onmouseup = function(e) {
    isDraggable = false;
  };
  canvas.touchend = function(e) {
    isDraggable = false;
  };
  canvas.onmouseout = function(e) {
    isDraggable = false;
  };
  canvas.touchcancel = function(e) {
    isDraggable = false;
  };
}
function _DrawImage() {
    background(0);
    // push();
    // translate(width, 0);
    // scale(-1, 1);
  context.drawImage(img, currentX-(img.width/8), currentY-(img.height/8),img.width/4, img.height/4 );
  timeWarpScan.draw();
//   pop();
}

// ===========================================


