import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// GSAP importing
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";


let canvas = document.getElementById('mycanvas');


// GLTF Loader
const loader = new GLTFLoader();


// Three scenes and cameras
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,1000);
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);


// document.body.appendChild(renderer.domElement);



// Orbital- using mouse to change the angle of view
const orbit = new OrbitControls(camera, renderer.domElement);

// geometry of a box and adding it to the scene
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({ color: 'green' });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.set(0, 0, 12);

// updating tthe orbit
orbit.update();

// helper axis
const axiss = new THREE.AxesHelper(5);
scene.add(axiss);


// gltf image
// left brain
let leftbrain;
loader.load( './assets/brain left.gltf',
    function ( gltf ) {
        console.log("left" +  gltf);
        // gltf.MeshBasicMaterial({color: "green"})
        leftbrain = gltf.scene; 
        leftbrain.position.set(1, 0, -3);
        leftbrain.traverse((node) => {
            if (!node.isMesh) return;
            node.material.wireframe = true;
          });
          leftbrain.position.set(0, 0,0)
          leftbrain.rotation.y = 1.57*3
        // scene.add( gltf.scene );
		// gltf.scenes; // Array<THREE.Group>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object
    }, undefined, function ( error ) {
	    console.error(error );
    } 
);

// right brain
let rightbrain;
loader.load('./assets/brain right.gltf', function(gltf){
    console.log("right" +  gltf)
    rightbrain = gltf.scene; 
    rightbrain.traverse((node) => {
        if (!node.isMesh) return;
        node.material.wireframe = true;
      });
      rightbrain.rotation.y = 1.57*3
      rightbrain.position.set(0, 0, 0);
    // scene.add(gltf.scene);
}, undefined, function(err){
    console.log(err);
})


// full moon
let fullmoon;
loader.load( './assets/moon.gltf',
    function ( gltf ) {
        console.log("left" +  gltf);
        // gltf.MeshBasicMaterial({color: "green"})
        fullmoon = gltf.scene; 
        fullmoon.rotation.z = 0.7
        fullmoon.position.set(0, -5, 9)
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

        scene.add(fullmoon);

    }, undefined, function ( error ) {
	    console.error(error );
    } 
);

const directionlight = new THREE.DirectionalLight(0xFFFFFF, 0.2);
directionlight.position.z = -2.2
directionlight.position.x = -0.3
// directionlight.position.y = 1
directionlight.intensity = 0.2

// experiment for position
// directionlight.position.z = 2
// directionlight.intensity = 2


scene.add(directionlight);

const spotlight = new THREE.SpotLight(0xFFFFFF)
// scene.add(spotlight);

const light = new THREE.AmbientLight(0x333333);
// scene.add(light)




// eventListener
window.addEventListener('scroll', (e)=>{
    console.log(scrollPercent.toFixed(2));
    playanimation();

    // console.log(e.deltaY);
    // if(e.deltaY < 0){
    //     leftbrain.position.x -= 0.05
    //     rightbrain.position.x += 0.05
    //     leftbrain.position.z += 0.1
    //     rightbrain.position.z += 0.1
    // }
})


// animation
// const animationScripts: { start: number; end: number; func: () => void }[] = []
const animationScripts = []

let tracer;
//add an animation that flashes the cube through 100 percent of scroll
animationScripts.push({
    start: 0,
    end: 50,
    func: () => {
        console.log("tracer->", tracer + "precentscroll->",scrollPercent);
        fullmoon.position.set(0, 0, -1)
        if(fullmoon.position.z > -1 && scrollPercent > tracer){
            fullmoon.position.z = 9-scrollPercent*0.5;
        }else if(fullmoon.position.z < 9 && scrollPercent < tracer){
            fullmoon.position.z = 9-scrollPercent*0.5;
        }

        if(fullmoon.position.y < 0){
            fullmoon.position.y = -5 + scrollPercent*0.2
        }else if(fullmoon.position.y > -5 && scrollPercent < tracer){
            fullmoon.position.y = -5 + scrollPercent*0.2
        }

        if(directionlight.position.z < 2){
            directionlight.position.z = -2.2+scrollPercent*0.2
        }else if(directionlight.position.z > -2.2 && scrollPercent < tracer){
            directionlight.position.z = -2.2+scrollPercent*0.2
        }

        if(directionlight.intensity < 2){
            directionlight.intensity = 0.2+scrollPercent*0.1
        }else if(directionlight.intensity > 0.2 && scrollPercent < tracer){
            directionlight.intensity = 0.2+scrollPercent*0.1
        }
        tracer = scrollPercent
    },
})

animationScripts.push({
    start: 53,
    end: 101,
    func: () => {
        leftbrain.position.x = -0.02*scrollPercent
        rightbrain.position.x = 0.02*scrollPercent
        leftbrain.position.z = 0.1*scrollPercent
        rightbrain.position.z = 0.1*scrollPercent
    },
})



let scrollPercent = 0

document.body.onscroll = () => {
    //calculate the current scroll progress as a percentage
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100
    ;
}




function playanimation(){
    // animationScripts.forEach((ele) => {
    //     if (scrollPercent >= ele.start && scrollPercent < ele.end) {
    //         ele.func()
    //     }
    // })
    animationScripts[0].func();
}







// rendering the scene
function animate(){
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // incresing the distance between the brains
    // leftbrain.position.x -= 0.01;

    // playanimation();
    fullmoon.rotation.x -= 0.001;
    // rightbrain.rotation.x += 0.01;
    renderer.render(scene,camera);
}
animate();

