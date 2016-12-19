// global parameters and objects
var _;

$(document).ready(function() {
    var loader = new THREE.TextureLoader();
    loader.load("img/particle.png", function(texture) {
	_ = {};
	_.texture = texture;
	init();
	animate();	
    });

    // resize screen
    window.addEventListener("resize", function() {
	_.width = window.innerWidth;
	_.height = window.innerHeight;
	_.aspect = _.width / _.height;

	_.camera.aspect = _.aspect;
	_.camera.updateProjectionMatrix();

	_.renderer.setSize(_.width, _.height);
    });

    // Leaving page bug
    $(window).blur(function(){
	_.particleSystem.time.start();
    });
    $(window).focus(function(){
	_.particleSystem.time.stop();
    });
});
/***************************************************************/
/*********************INIT FUNCTIONS****************************/
/***************************************************************/

function init(texture) {
	initParameters();
	initObjects();
}

// returns global parameters
function initParameters() {

    _.container = document.getElementById("container");
    _.width = window.innerWidth;
    _.height = window.innerHeight;
    _.view_angle = 45;
    _.aspect = _.width / _.height;
    _.near = 0.1;
    _.far = 2000;

    // particle parameters
    _.canvasParticle = false;
    _.maxParticles = 10000;
    _.size = 1.;
    _.lifetime = 5.;

    // physics parameters
    _.physics = true;
    _.gravity = new THREE.Vector3(0, -10, 0);
    _.wind = new THREE.Vector3(0, 0, 0);
}

// returns scene, camera, controls, renderer, particlesystem
function initObjects() {

    _.scene = new THREE.Scene();
    
    _.camera= new THREE.PerspectiveCamera(
	_.view_angle,
	_.aspect,
	_.near,
	_.far);    

    _.renderer = new THREE.WebGLRenderer();
    _.renderer.setSize(_.width, _.height);
    _.container.appendChild(_.renderer.domElement);
    
    // orbit controls
    _.controls = new THREE.OrbitControls(_.camera, _.renderer.domElement);
    _.controls.enableDamping = true;
    _.controls.rotateSpeed = 0.2;
    _.controls.zoomSpeed = 0.5;
    _.controls.dampingFactor = 0.25;
    _.controls.enableZoom = true;
    
    // aesthetic background
    initBackground();
    
    _.camera.position.z = 100;
    _.camera.position.y = 50;
    _.scene.add(_.camera);

    // overwrite jpg texture with canvas texture if desired
    if (_.canvasParticle) {	
	_.canvas = document.createElement("canvas");
	_.canvas.width = 256;
	_.canvas.height = 256;
	_.ctx = _.canvas.getContext("2d");
	
	_.texture = new THREE.Texture(_.canvas);
	document.body.appendChild(_.canvas);
    }
    
    _.particleSystem = new ParticleSystem(_);
    _.scene.add(_.particleSystem.points);
}

function initBackground() {
    var light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    light.position.set(0, 70, -200);
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(1000, 50, 50),
				new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
	side: THREE.BackSide,
    }));
    _.scene.add(light);
    _.scene.add(sphere);
}

/***************************************************************/
/*********************ANIMATION FUNCTION************************/
/***************************************************************/

function animate() {
    _.controls.update();
    // drawCanvas();
    _.particleSystem.update();
    _.renderer.render(_.scene, _.camera);
    requestAnimationFrame(animate);
}

function drawCanvas() {
    _.ctx.fillRect(0, 0, 256, 256);
    var w = _.canvas.width / 2;
    var h = _.canvas.height / 2;
    var r = w * .4;
    _.ctx.arc(-w, -h, r, 0, 2  * Math.PI);
    _.ctx.shadowColor = "#010890";
    _.ctx.shadowBlur = 200;
    _.ctx.shadowOffsetX = w * 2;
    _.ctx.shadowOffsetY = h * 2;
    _.ctx.fill();
}
