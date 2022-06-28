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
// const bakedTexture = textureLoader.load("./assets/baked.jpg");
// bakedTexture.flipY = false;
// bakedTexture.encoding = THREE.sRGBEncoding;

/**
 * Materials
 */
// Baked material
// const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// Pole light material
// const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

// Portal light material
const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

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
gltfLoader.load("./assets/01.glb", (gltf) => {
  scene.add(gltf.scene);

  // Get each object

  // All objects
  // Retract_flow_port
  // Extend_flow_port
  // Piston_Rod
  // Rod_Seals
  const Retract_Flow_Port_Mesh = gltf.scene.children.find(
    (child) => child.name === "Retract_Flow_Port"
  );
  const Extend_Flow_Port_Mesh = gltf.scene.children.find(
    (child) => child.name === "Extend_Flow_Port"
  );
  const Piston_Rod_Mesh = gltf.scene.children.find(
    (child) => child.name === "Piston_Rod"
  );
  const Rod_Seals_Mesh = gltf.scene.children.find(
    (child) => child.name === "Rod_Seals"
  );

  // Apply materials

  // MESH - mapping
  const MESH_DATA = [
    // {
    //   mesh: Retract_Flow_Port_Mesh,
    //   name: "Retract_Flow_Port",
    //   audio: "Retract_Flow_Port",
    //   text: {
    //     en: "This portal is entrance to the multiverse",
    //     hn: "यह पोर्टल मल्टीवर्स का प्रवेश द्वार है",
    //   },
    // },
    // {
    //   mesh: Extend_Flow_Port_Mesh,
    //   name: "Extend_Flow_Port",
    //   audio: "Extend_Flow_Port",
    //   text: {
    //     en: "I am the Street Lamp at the left ",
    //     hn: "मैं बाईं ओर का  स्ट्रीट लैंप हूं",
    //   },
    // },
    // {
    //   mesh: Piston_Rod_Mesh,
    //   name: "Piston_Rod",
    //   audio: "Piston_Rodmp",
    //   text: {
    //     en: "I am the Street Lamp at the right ",
    //     hn: "मैं दायीं ओर का स्ट्रीट लैंप हूं",
    //   },
    // },
    // {
    //   mesh: Rod_Seals_Mesh,
    //   name: "Rod_Seals",
    //   audio: "Rod_Sealsamp",
    //   text: {
    //     en: "I am the Street Lamp at the right ",
    //     hn: "मैं दायीं ओर का स्ट्रीट लैंप हूं",
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
    // scale up mesh
    // mesh.scale.set(1.5, 1.5, 1.5);
    clickedItem = name;
    // mesh.material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
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
      setTimeout(() => {
        clearText();
      }, delay);
    },
    (xhr) => console.log(xhr),
    (err) => console.log(err)
  );
}

function clearText() {
  // textHelper.style.display = "none";
}

// SPEAKER
const speaker = document.getElementById("speaker");
speaker.addEventListener("click", () => {
  let text = {
    en: "Hydraulic Double Acting Cylinders are intended to manage flow or load in both side of piston, through whichcylinder is extended or retracted. Connecting ports (typically called A & B) are situated on either side of piston to received input oil flow & discharge return flow from cylinder. ",
    hn: "हाइड्रोलिक डबल अभिनय सिलेंडर प्रवाह या भार का प्रबंधन करने के लिए पिस्टन के दोनों ओर होते हैं, जिसके माध्यम से सिलेंडर उठाया या वापस ले लिया है। कनेक्टिंग पोर्ट (आमतौर पर ए और बी कहा जाता है) पिस्टन के दोनों ओर स्थित होते हैं सिलेंडर से इनपुट ऑयल फ्लो और डिस्चार्ज रिटर्न फ्लो प्राप्त करने के लिए।",
    marathi:
      "हायड्रॉलिक डबल-अॅक्टिंग सिलिंडर पिस्टनच्या दोन्ही बाजूला प्रवाह किंवा भार व्यवस्थापित करण्यासाठी असतात, ज्याद्वारे सिलेंडर वर केले जाते किंवा मागे घेतले जाते. कनेक्टिंग पोर्ट्स (सामान्यतः A आणि B म्हणतात) पिस्टनच्या दोन्ही बाजूला स्थित आहेत सिलेंडरमधून इनपुट ऑइल फ्लो आणि डिस्चार्ज रिटर्न फ्लो प्राप्त करण्यासाठी.",
  };
  handleAudio("01", text);
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
