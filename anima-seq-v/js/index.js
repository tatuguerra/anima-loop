'use strict';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const canvasGetImage = document.getElementById('canvas-get-image');
const canvasFrame = document.getElementById('canvas-frame');
const canvasCH001 = document.getElementById('canvas-ch001');
const canvasCH002 = document.getElementById('canvas-ch002');
// const snap = document.getElementById("snap");
const errorMsgElement = document.querySelector('span#errorMsg');
let imgObj = {
  imgArray001: [],
  imgArray002: []
}
let imgArray = [];

const constraints = {
  audio: false,
  video: {
    width: 640, height: 480
  }
};

// Access webcam
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

// Success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

// Load init
init();

// Draw image
// var context = canvas.getContext('2d');
// snap.addEventListener("click", function() {
//         context.drawImage(video, 0, 0, 640, 480);
// });


// Save as gif
var gif = new GIF({
  workers: 2,
  quality: 10
});


let generateGif = function(imgs){
  // add an image element
  var ctxGetImage= canvasGetImage.getContext('2d');
  for(var i = 0; i < imgs.length; i++ ){
    
    var image = new Image();
    image.onload = function() {
      ctxGetImage.drawImage(image, 0, 0);
    };

    if(imgs[i] != undefined){
      image.src = imgs[i];
      // console.log(ctxGetImage);
      
      gif.addFrame(image);
    }
    
  }

  gif.on('finished', function(blob) {
    window.open(URL.createObjectURL(blob));
  });
  
  gif.render();
}

var cGrabFrame = canvasFrame.getContext('2d');
document.addEventListener('keydown', (event) => {
  const keyName = event.code;
  console.log(keyName);
  
  // grab image "Space"
  if(keyName == "Space"){
    cGrabFrame.drawImage(video, 0, 0, 640, 480)
    imgArray.push(canvasFrame.toDataURL('image/jpeg').replace("image/jpeg", "image/octet-stream"));
  }
  //  clear images "c"
  if(keyName == "KeyC"){
    imgArray = [];
  }

  // Onion skin "o"
  if(keyName == "KeyO"){
    document.getElementById('video').toggleAttribute("hidden");
  }
  
  // generate GIF "s"
  if(keyName == "KeyS" && imgArray.length > 0){
    generateGif(imgArray);
  }

});

var canvasPlay = canvas.getContext('2d');
//var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.


var index = 0; 
setInterval(function(){ 
  if(imgArray.length > 0){
    index == imgArray.length ? index = 0 : index++
    var image = new Image();
    image.onload = function() {
      canvasPlay.drawImage(image, 0, 0);
    };
    if(imgArray[index] != undefined){
      image.src = imgArray[index];
    }
  }
 }, 300);


