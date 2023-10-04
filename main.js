import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(50);
camera.position.setY(30);
renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff, 1000);
pointLight.position.set(-100,0,0);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);
//helpers😡
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

const spaceTexture = new THREE.TextureLoader().load('/space.jpg')
scene.background = spaceTexture

const addPlanet = (name, imgSrc, x, y, z, size) => {
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(imgSrc),
        })
    );
    planet.position.set(x, y, z);
    scene.add(planet);
    planet.name = name;
}

const planety = [
    ['sun',-100,0,0,100],
    ['mercury',2,0,0,0.5],
    ['venus',6,0,0,1],
    ['earth',10,0,0,1],
    ['mars',14,0,0,0.5],
    ['jupiter',26,0,0,11],
    ['saturn',50,0,0,10],
    ['uranus',67,0,0,5],
    ['neptune',79,0,0,5]
]

planety.forEach((v,i)=>{
    if(i===3){
        const earth = new THREE.Mesh(
            new THREE.CircleGeometry(planety[i][4], 32),
            new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load('earth.jpg'),
                side: THREE.DoubleSide
            })
        );
        earth.position.set(planety[3][1], planety[3][2], planety[3][3]);
        scene.add(earth);
        earth.name = planety[3][0];
        earth.rotation.x += 4.7;
    }else{
        addPlanet(`${planety[i][0]}`,`${planety[i][0]}.jpg`,planety[i][1],planety[i][2],planety[i][3],planety[i][4]);
    }
})

const listItems = document.querySelectorAll('li');

listItems.forEach((item) => {
  item.addEventListener('click', () => {
    let planetName = item.textContent;
    
    let planetData = planety.find((planet) => planet[0] === planetName);
    camera.position.setY(planetName ==='sun' ? 50 : 10);
    camera.position.setX(planetData[1]);
    camera.position.setZ(planetName ==='sun' ? planetData[4]+70 : planetData[4]+10);
    camera.lookAt(new THREE.Vector3(planetData[1], planetData[2], planetData[3]));
  });
});

const planet = (name) => scene.getObjectByName(name)
const rotate = (speed) => planety.forEach((item, index) => index === 3 ? scene.getObjectByName(planety[index][0]).rotation.z += speed : scene.getObjectByName(planety[index][0]).rotation.y += index === 0 ? speed / 10 : speed);

const animate = () => {
    requestAnimationFrame(animate);
    rotate(0.005);
    renderer.render(scene, camera);
}
animate();

//plan do zrobienia 
//dodanie opisu planet
//dodanie tekstur
//dodanie orbit