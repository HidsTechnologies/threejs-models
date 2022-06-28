import * as THREE from "../three/build/three.module.js";
import { OrbitControls } from "../three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "../three/examples/jsm/loaders/DRACOLoader.js";
import initializeDomEvents from "../threex.domevents/threex.domevents.js";

// Language select
const languageSelect = document.getElementById("lang-select");
let selectedLang = "en";
languageSelect.addEventListener("change", (event) => {
  selectedLang = event.target.value;
  console.log(selectedLang);
});

/**
 * Base
 */
// Debug
// const gui = new dat.GUI({
//   width: 400,
// });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 20;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// DomEvent listeners
var THREEx = {};
initializeDomEvents(THREE, THREEx);
const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("../draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */

/**
 * Materials
 */

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// hepler text box
const textHelper = document.getElementById("text-helper");
const audioLoader = new THREE.AudioLoader();
let clickedItem = null;

// Light on model
const light1 = new THREE.PointLight(0xffffff, 1, 500);
light1.position.set(10, 10, 12);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(-11, 4, 4);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 1, 300);
light3.position.set(0, -15, -5);
scene.add(light3);

const light4 = new THREE.DirectionalLight(0xffffff, 1, 300);
light4.position.set(0, 10, -15);
scene.add(light4);

/**
 * Model
 */
gltfLoader.load("./assets/06.glb", (gltf) => {
  scene.add(gltf.scene);

  // Get each object

  // All objects

  const Retract_Flow_Port_Mesh = gltf.scene.children.find(
    (child) => child.name === "Retract_Flow_Port"
  );

  // console.log(gltf.scene, "-------------------------------------------");

  // MESH - mapping
  const MESH_DATA = [
    // {
    //   mesh: portalLightMesh,
    //   name: "portalLight",
    //   audio: "portal",
    //   text: {
    //     en: "This portal is entrance to the multiverse",
    //     hn: "यह पोर्टल मल्टीवर्स का प्रवेश द्वार है",
    //   },
    // },
  ];

  // click events
  // MESH_DATA.map((meshData) => {
  //   clickMesh(meshData);
  // });
});

// domEvent function
function clickMesh({ mesh, name, audio, text }) {
  domEvents.addEventListener(mesh, "click", (event) => {
    if (clickedItem === name) {
      return;
    }
    clickedItem = name;
    // load a sound and set it as the Audio object's buffer
    handleAudio(audio, text);
  });
}
function handleAudio(audio, text) {
  audioLoader.load(
    `assets/${audio}-${selectedLang}.ogg`,
    function (buffer) {
      console.log(buffer);
      textHelper.textContent = text[selectedLang];
      textHelper.style.display = "block";
      sound.setBuffer(buffer);
      sound.setLoop(false);
      sound.setVolume(0.5);
      sound.play();
      let delay = buffer.duration * 1000;
      console.log("delay");
      console.log(delay);
      setTimeout(() => {
        clearText();
      }, delay);
    },
    (xhr) => console.log(xhr),
    (err) => console.log(err)
  );
}

function clearText() {
  textHelper.style.display = "none";
}

// SPEAKER
const speaker = document.getElementById("speaker");
speaker.addEventListener("click", () => {
  let text = {
    en: "Directional control spool valve; 4 connections; 2 switching positions; manual operation by means of lever; spring return.",
    hn: "दिशात्मक नियंत्रण स्पूल वाल्व; 4 कनेक्शन; 2 स्विचिंग स्थिति; लीवर के माध्यम से मैनुअल ऑपरेशन; वसंत वापसी",
    marathi:
      "दिशात्मक नियंत्रण स्पूल वाल्व; 4 कनेक्शन; 2 स्विचिंग पोझिशन्स; लीव्हरद्वारे मॅन्युअल ऑपरेशन; वसंत ऋतु परतावा.",
  };
  handleAudio("06", text);
});
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
