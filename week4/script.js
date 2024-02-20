// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6Q2qGofO70g_ycpkaui9TRJF79NNC3-g",
  authDomain: "shardminds-7c935.firebaseapp.com",
  databaseURL: "https://shardminds-7c935-default-rtdb.firebaseio.com",
  projectId: "shardminds-7c935",
  storageBucket: "shardminds-7c935.appspot.com",
  messagingSenderId: "950313031631",
  appId: "1:950313031631:web:df51efcfc1b1dccb77e4ba",
  measurementId: "G-V6KDHDVE1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";



import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/DragControls.js";
let camera, scene, renderer, cube;
let dragControls;
let orbitControls;
let draggableObjects = [];
initHTML();
init3D();

function init3D() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  let bgGeometery = new THREE.SphereGeometry(1000, 60, 40);
  bgGeometery.scale(-1, 1, 1);
  let panotexture = new THREE.TextureLoader().load("123.png");
  let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });
  let back = new THREE.Mesh(bgGeometery, backMaterial);
  scene.add(back);
  dragControls = new DragControls(
    draggableObjects,
    camera,
    renderer.domElement
  );
  orbitControls = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 0.1;
  animate();
}

function loadAndCreateTexts() {
  const db = getDatabase(app); 
  const textPositionsRef = ref(db, 'textPositions');
  onValue(textPositionsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const textData = childSnapshot.val();
      createNewText(textData.text, new THREE.Vector3(textData.position.x, textData.position.y, textData.position.z));
    });
  });
}


loadAndCreateTexts();


function animate() {
  orbitControls.update();
  for (let i = 0; i < draggableObjects.length; i++) {
    draggableObjects[i].lookAt(camera.position);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function initHTML() {
  window.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      let mouse = {
        x: window.innerWidth / 2 - 75,
        y: window.innerHeight / 2 - 75,
      };
      const pos = find3DCoornatesInFrontOfCamera(100, mouse);
      createNewText(whatToSay(), pos);
    }
  });
}

function find3DCoornatesInFrontOfCamera(distance, mouse) {
  let vector = new THREE.Vector3();
  vector.set(
    (mouse.x / window.innerWidth) * 2 - 1,
    -(mouse.y / window.innerHeight) * 2 + 1,
    0
  );
  vector.unproject(camera);
  vector.multiplyScalar(distance);
  return vector;
}

function createNewText(text_msg, posInWorld) {
  console.log("Created New Text", posInWorld);
  var canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 100;
  var context = canvas.getContext("2d");
  context.fillStyle = "red";
  context.font = "20px Arial";
  context.fillText(text_msg, 0, 50);
  var textTexture = new THREE.Texture(canvas);
  textTexture.needsUpdate = true;
  var material = new THREE.MeshBasicMaterial({
    map: textTexture,
    transparent: true,
  });
  var geo = new THREE.PlaneGeometry(1, 1);
  var mesh = new THREE.Mesh(geo, material);

  mesh.position.x = posInWorld.x;
  mesh.position.y = posInWorld.y;
  mesh.position.z = posInWorld.z;

  console.log(posInWorld);
  mesh.lookAt(0, 0, 0);
  mesh.scale.set(10, 10, 10);
  scene.add(mesh);
  mesh.lookAt(0, 0, 0);
  draggableObjects.push(mesh);

  
  const db = getDatabase(app); 
  const textPositionsRef = ref(db, 'textPositions');
  const newPositionRef = push(textPositionsRef);
  set(newPositionRef, {
    text: text_msg,
    position: {
      x: posInWorld.x,
      y: posInWorld.y,
      z: posInWorld.z
    }
  });
}


function whatToSay() {
  const strings = [
    "Hello?",
    "Is anybody here?",
    "I swear the GOD",
    "Stop messing with me",
  ];
  const randomIndex = Math.floor(Math.random() * strings.length);
  return strings[randomIndex];
}
