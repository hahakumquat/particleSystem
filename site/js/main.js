// global parameters and objects
var _;

$(document).ready(function() {
    var loader = new THREE.TextureLoader();
    loader.load("img/particle.jpg", function(texture) {
	init(texture);
	animate();
    });
});

/***************************************************************/
/*********************INIT FUNCTIONS****************************/
/***************************************************************/

function init(texture) {
	_ = {};
	initParameters(_);
	initObjects(_, texture);
}

// returns global parameters
function initParameters(params) {

    params.container = document.getElementById("container");
    params.width = window.innerWidth;
    params.height = window.innerHeight;
    params.view_angle = 45;
    params.aspect = params.width / params.height;
    params.near = 0.1;
    params.far = 1000;
}

// returns scene, camera, controls, renderer, particlesystem
function initObjects(params, texture) {

    params.scene = new THREE.Scene();
    
    params.camera= new THREE.PerspectiveCamera(
	params.view_angle,
	params.aspect,
	params.near,
	params.far);    

    params.renderer = new THREE.WebGLRenderer();
    params.renderer.setSize(params.width, params.height);
    params.container.appendChild(params.renderer.domElement);

    // orbit controls
    params.controls = new THREE.OrbitControls(params.camera, params.renderer.domElement);
    params.controls.enableDamping = true;
    params.controls.dampingFactor = 0.25;
    params.controls.enableZoom = true;
    // params.controls.autoRotate = true;

    // var sphere = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({color: "white"}));
    // params.scene.add(sphere);
    
    params.camera.position.z = 300;
    params.scene.add(params.camera);

    particleParams = {
    	maxParticles: 5000,
	size: 1.,
    };
    

    params.particleSystem = new ParticleSystem(particleParams, texture);
    params.scene.add(params.particleSystem.points);
}

/***************************************************************/
/*********************ANIMATION FUNCTION************************/
/***************************************************************/

function animate() {
    _.controls.update();
    _.particleSystem.update();
    _.renderer.render(_.scene, _.camera);
    requestAnimationFrame(animate);
}

/***************************************************************/
/**************************MISCELLANEOUS************************/
/***************************************************************/

// resize screen
window.addEventListener("resize", function() {
    _.width = window.innerWidth;
    _.height = window.innerHeight;
    _.aspect = _.width / _.height;

    _.camera.aspect = _.aspect;
    _.camera.updateProjectionMatrix();

    _.renderer.setSize(_.width, _.height);
    requestAnimationFrame(animate);
});

// exploding particles bug with timer
$(window).blur(function(){
    _.particleSystem.time.start();
});
$(window).focus(function(){
    _.particleSystem.time.stop();
});
