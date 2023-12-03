import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer( {canvas: document.querySelector("#bg"),} ); //prettier-ignore
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 50, 120);
renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff, 1000);
pointLight.position.set(-100, 0, 0);
// pointLight.intensity = 100000;
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//helpers😡
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.TextureLoader().load("/space.jpg");

const addPlanet = (arr) => {
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(arr[2], 32, 32),
        new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(`${arr[0]}.jpg`),
        })
    );
    planet.position.set(arr[1], 0, 0);
    scene.add(planet);
    arr.push(planet);
};

const planety = [
    ["sun", -100, 100],
    ["mercury", 2, 0.5],
    ["venus", 6, 1],
    ["earth", 10, 1],
    ["mars", 14, 0.5],
    ["jupiter", 26, 11],
    ["saturn", 50, 10],
    ["uranus", 67, 5],
    ["neptune", 79, 5],
];

planety.forEach((el) => addPlanet(el));

document.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
        let planetName = item.textContent;
        let planetData = planety.find((planet) => planet[0] === planetName);
        planety.forEach((el) => {
            el[3].position.set(el[1] - planetData[1], 0, 0);
        });
        camera.position.set(
            0,
            planetName === "sun" ? 50 : 10,
            planetName === "sun" ? planetData[2] + 70 : planetData[2] + 10
        );
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    });
});

const rotate = (speed) => planety.forEach((el, i) => (el[3].rotation.y += i === 0 ? speed / 10 : speed)); //prettier-ignore

const animate = () => {
    requestAnimationFrame(animate);
    rotate(0.005);
    renderer.render(scene, camera);
};
animate();
