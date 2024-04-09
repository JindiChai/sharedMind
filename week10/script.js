let handPose;
let video;
let hands = [];
let trash = [];
let trashEmoji = "💩";
let interval = 5000;
let score = 0;

// A variable to track a pinch between thumb and index
let pinch = 0;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
  setInterval(createTrash, interval);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  textSize(32);
  text("🐕‍🦺: " + score + trashEmoji, 10, height - 30);

  // If there is at least one hand
  if (hands.length > 0) {
    // Find the index finger tip and thumb tip
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    // Draw circles at finger positions
    let centerX = (finger.x + thumb.x) / 2;
    let centerY = (finger.y + thumb.y) / 2;
    // Calculate the pinch "distance" between finger and thumb
    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

    // This circle's size is controlled by a "pinch" gesture
    fill(0, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(centerX, centerY, pinch);
    for (let i = 0; i < trash.length; i++) {
      let x = trash[i].x + 31 - centerX;
      let y = trash[i].y + 31 - centerY;
      if (x < 50 && x > 0 && y < 50 && y > 0 && pinch < 40) {
        trash.splice(i, 1);
        score++;
      }
    }
}
    for (let i = 0; i < trash.length; i++) {
      textSize(62);
      text(trashEmoji, trash[i].x, trash[i].y);
    }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

function createTrash() {
  let trashX = random(width - 100);
  let trashY = random(height - 100);
  trash.push({ x: trashX + 50, y: trashY + 50 });
}
