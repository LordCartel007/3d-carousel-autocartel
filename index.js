var radius = 350;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = 120;
var imgHeight = 170;

setTimeout(init, 1000);

var odrag = document.getElementById("drag-container");
var ospin = document.getElementById("spin-container");
var aImg = ospin.getElementsByTagName("img");
var aVid = ospin.getElementsByTagName("iframe");
var aEle = [...aImg, ...aVid];

ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

var ground = document.createElement("div"); // Fixed the element creation to "div" instead of "getElementById"
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";
ground.id = "ground"; // Make sure the ground element has an id

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform =
      "rotateY(" +
      i * (360 / aEle.length) +
      "deg) translateZ(" +
      radius +
      "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTransform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;

  obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? "running" : "paused";
}

var sX,
  sY,
  nX,
  nY,
  desX = 0,
  desY = 0;
var tX = 0,
  tY = 10;

if (autoRotate) {
  var animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
  ospin.style.animation = `${animationName} ${Math.abs(
    rotateSpeed
  )}s infinite linear`; // Fixed this line by wrapping it correctly
}

document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
    sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
      nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTransform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTransform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

// document.onmousewheel = function (e) {
//   e = e || window.event;
//   e.preventDefault(); // Prevents the default browser zoom action
//   var d = e.wheelDelta / 20 || -e.detail;
//   radius += d;
//   init(1);
// };

document.addEventListener(
  "wheel",
  function (e) {
    // Check if the event is targeting the carousel container or any zoom-related elements
    if (e.target.closest("#spin-container")) {
      e.preventDefault(); // Prevent the default zoom (browser zoom) only for the carousel

      // Apply custom zoom for the carousel
      var zoomDelta = e.deltaY / 1; // Adjust zoom sensitivity
      radius += zoomDelta;

      // Ensure the radius doesn't go below a minimum value
      radius = Math.max(100, Math.min(radius, 600));

      init(1); // Re-initialize carousel with the new radius
    }
  },
  { passive: false }
);

/* making the image becomes full page when clicked  */

// Function to open the overlay and display the clicked image/video
function openOverlay(src, isVideo = false) {
  const overlay = document.getElementById("overlay");
  const overlayContent = document.getElementById("overlay-content");

  if (isVideo) {
    overlayContent.outerHTML = `<iframe id="overlay-content" src="${src}" allowfullscreen></iframe>`;
  } else {
    overlayContent.outerHTML = `<img id="overlay-content" src="${src}" />`;
  }

  overlay.style.display = "flex"; // Show the overlay
  document.body.style.overflow = "hidden"; // Disable background scrolling
}

// Function to close the overlay
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = "auto"; // Enable background scrolling
}

// Attach click events to images and videos
document.querySelectorAll("#drag-container img").forEach((img) => {
  img.addEventListener("click", function () {
    openOverlay(img.src, false);
  });
});

document.querySelectorAll("#drag-container iframe").forEach((video) => {
  video.addEventListener("click", function () {
    openOverlay(video.src, true);
  });
});
