import * as THREE from 'https://esm.sh/three';
import { OrbitControls } from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://esm.sh/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Bloom effect
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85));

// Controls
new OrbitControls(camera, renderer.domElement);

// Create particle system
const count = 10000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(count * 3);
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({ color: 0x00ffff, size: 0.5 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Shapes to morph into
const shapes = [
  new THREE.SphereGeometry(30, 64, 64),
  new THREE.TorusGeometry(20, 8, 64, 100),
  new THREE.BoxGeometry(40, 40, 40, 20, 20, 20)
];

let shapeIndex = 0;

function updateShape(shape) {
  const positionAttribute = shape.getAttribute('position');
  for (let i = 0; i < count; i++) {
    let idx = i % positionAttribute.count;
    positions[i * 3] = positionAttribute.getX(idx);
    positions[i * 3 + 1] = positionAttribute.getY(idx);
    positions[i * 3 + 2] = positionAttribute.getZ(idx);
  }
  geometry.attributes.position.needsUpdate = true;
}

updateShape(shapes[0]);

// Animation
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  composer.render();
}
animate();

// Interaction
window.addEventListener('click', () => {
  shapeIndex = (shapeIndex + 1) % shapes.length;
  updateShape(shapes[shapeIndex]);
});
