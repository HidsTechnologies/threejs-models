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
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
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
const bakedTexture = textureLoader.load("./assets/baked.jpg");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

// Portal light material
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// hepler text box
const textHelper = document.getElementById("text-helper");
const audioLoader = new THREE.AudioLoader();
let clickedItem = null;

/**
 * Model
 */
gltfLoader.load("./assets/portal.glb", (gltf) => {
  scene.add(gltf.scene);

  // Get each object
  const bakedMesh = gltf.scene.children.find((child) => child.name === "baked");
  const portalLightMesh = gltf.scene.children.find(
    (child) => child.name === "portalLight"
  );
  const poleLightAMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightA"
  );
  const poleLightBMesh = gltf.scene.children.find(
    (child) => child.name === "poleLightB"
  );

  // Apply materials
  bakedMesh.material = bakedMaterial;
  portalLightMesh.material = portalLightMaterial;
  poleLightAMesh.material = poleLightMaterial;
  poleLightBMesh.material = poleLightMaterial;

  // MESH - mapping
  const MESH_DATA = [
    {
      mesh: portalLightMesh,
      name: "portalLight",
      audio: "portal",
      text: {
        en: "This portal is entrance to the multiverse",
        hn: "यह पोर्टल मल्टीवर्स का प्रवेश द्वार है",
      },
    },
    {
      mesh: poleLightAMesh,
      name: "poleLightA",
      audio: "leftLamp",
      text: {
        en: "I am the Street Lamp at the left ",
        hn: "मैं बाईं ओर का  स्ट्रीट लैंप हूं",
      },
    },
    {
      mesh: poleLightBMesh,
      name: "poleLightB",
      audio: "rightLamp",
      text: {
        en: "I am the Street Lamp at the right ",
        hn: "मैं दायीं ओर का स्ट्रीट लैंप हूं",
      },
    },
  ];

  // click events
  MESH_DATA.map((meshData) => {
    clickMesh(meshData);
  });
});

// domEvent function
function clickMesh({ mesh, name, audio, text }) {
  domEvents.addEventListener(mesh, "click", (event) => {
    if (clickedItem === name) {
      return;
    }
    // scale up mesh
    // mesh.scale.set(1.5, 1.5, 1.5);
    clickedItem = name;
    // mesh.material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    // load a sound and set it as the Audio object's buffer
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
          //   reset scale
          //   mesh.scale.set(1, 1, 1);
          clearText();
        }, delay);
      },
      (xhr) => console.log(xhr),
      (err) => console.log(err)
    );
  });
}

function clearText() {
  textHelper.style.display = "none";
}

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
