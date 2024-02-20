import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue, update, set, push, onChildAdded, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/DragControls.js";
let camera, scene, renderer, cube;
let dragControls;
let orbitControls;
let draggableObjects = [];
let alltextt = [];
let db;
let textPositionsRef= "textPositions";
initHTML();
init3D();
initFirebase();
recall();

function save() {
  let forFirebase = { objects: alltextt };
  setDataInFirebase(textPositionsRef, forFirebase);
}

function recall() {
  scene.remove();
  getStuffFromFirebase(textPositionsRef, (data) => {
      if (data) {
          console.log("got data", data);
          for (let i = 0; i < data.objects.length; i++) {
            createNewText(data.objects[i].text, data.objects[i].position);
          }
      }
  });
}

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


      save();


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
  
  let textt = {text: text_msg, position: posInWorld};
  console.log(posInWorld);
  mesh.lookAt(0, 0, 0);
  mesh.scale.set(10, 10, 10);
  scene.add(mesh);
  mesh.lookAt(0, 0, 0);
  draggableObjects.push(mesh);
  alltextt.push(textt);

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





function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyBNIpGK2Wc8Ps8iQ2ca7WgxOMnDgkLJgp0",
    authDomain: "sharedminds-61cfe.firebaseapp.com",
    databaseURL: "https://sharedminds-61cfe-default-rtdb.firebaseio.com",
    projectId: "sharedminds-61cfe",
    storageBucket: "sharedminds-61cfe.appspot.com",
    messagingSenderId: "54734878071",
    appId: "1:54734878071:web:636ec290398ebd70c2dd72",
    measurementId: "G-RV12ZWPEKL"
  };
  const app = initializeApp(firebaseConfig);
  //make a folder in your firebase for this example
  db = getDatabase();
}



function setDataInFirebase(folder, data) {
  //if it doesn't exist, it adds (pushes) with you providing the key
  //if it does exist, it overwrites
  const dbRef = ref(db, folder + '/')
  set(dbRef, data);
}

function getStuffFromFirebase(folder, callback) {
  //make a one time ask, not a subscription
  const dbRef = ref(db, folder + '/');
  onValue(dbRef, (snapshot) => {
      console.log("here is a snapshot of everyting", snapshot.val());
      callback(snapshot.val());

  });
}