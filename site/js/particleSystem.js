// particle system class
ParticleSystem = function(params) {

    var self = this;
    // timer 
    self.time = new THREE.Clock(true);
    
    // initial position
    self.position = params.position || new THREE.Vector3(0, -30, 0);

    // particle rate
    self.maxParticles = params.maxParticles || 1000;

    // how long a particle lives
    self.lifetime = params.lifetime || 5.0;

    // how big a particle is
    self.size = params.size || 1.0;

    // newtonian physics
    self.physics = params.physics || false;
    self.gravity = params.gravity || new THREE.Vector3();
    
    self.wind = params.wind || new THREE.Vector3();

    var particleMaterial = new THREE.PointsMaterial({
    	color: 0xffffff,
    	size: self.size,
    	blending: THREE.AdditiveBlending,
    	map: _.texture,
    	transparent: true,
    	alphaTest: 0.5,
    	depthTest : false,
    	depthWrite : false
    });

    var particleGeometry = new THREE.BufferGeometry();
    // stores position of particle
    var positionBuffer = new Float32Array(self.maxParticles * 3);
    // stores initial velocity of particle
    var velocityBuffer = new Float32Array(self.maxParticles * 3);
    // initial life, life remaining
    var lifeBuffer = new Float32Array(self.maxParticles * 2);

    for (var k = 0; k < self.maxParticles; k++) {
	positionBuffer[k * 3 + 0] = self.position.x;
	positionBuffer[k * 3 + 1] = self.position.y;
	positionBuffer[k * 3 + 2] = self.position.z;

	var theta = (Math.random()) * 2 * Math.PI;
	var phi = (Math.random()) * Math.PI / 2;
	velocityBuffer[k * 3 + 0] = Math.cos(theta) * 20;	
	velocityBuffer[k * 3 + 2] = Math.sin(theta) * 20;
	velocityBuffer[k * 3 + 1] = Math.tan(phi) * 20;
	lifeBuffer[k * 2 + 0] = Math.random() * self.lifetime;
	lifeBuffer[k * 2 + 1] = lifeBuffer[k * 2 + 0];
    }

    var positionAttribute = new THREE.BufferAttribute(positionBuffer, 3);
    positionAttribute.setDynamic(true);
    particleGeometry.addAttribute("position", positionAttribute);

    var velocityAttribute = new THREE.BufferAttribute(velocityBuffer, 1);
    velocityAttribute.setDynamic(false);
    particleGeometry.addAttribute("velocity", velocityAttribute);
    
    var lifeAttribute = new THREE.BufferAttribute(lifeBuffer, 2);
    lifeAttribute.setDynamic(true);
    particleGeometry.addAttribute("life", lifeAttribute);
    
    var particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    
    self.points = particlePoints;
}

ParticleSystem.prototype.update = function() {
    var self = this;
    var delta = self.time.getDelta();

    var positions = self.points.geometry.attributes.position.array;
    var velocities = self.points.geometry.attributes.velocity.array;
    var lives = self.points.geometry.attributes.life.array;
    
    for (var k = 0; k < self.maxParticles; k++) {
    	if (lives[k * 2 + 1] - delta < 0) {
	    lives[k * 2 + 0] = Math.random() * self.lifetime;
	    lives[k * 2 + 1] = lives[k * 2 + 0];
    	    positions[k * 3 + 0] = self.position.x;
    	    positions[k * 3 + 1] = self.position.y;
    	    positions[k * 3 + 2] = self.position.z;
    	}
    	else {
	    lives[k * 2 + 1] -= delta;	    
	    var v0 = new THREE.Vector3(velocities[k * 3 + 0],
				       velocities[k * 3 + 1],
				       velocities[k * 3 + 2]);
    	    var s0 = new THREE.Vector3(positions[k * 3 + 0],
    				       positions[k * 3 + 1],
    				       positions[k * 3 + 2]);

	    if (self.physics) {
		physicalMove(v0, s0, lives, k);
	    }
	    else {
		basicMove(v0, k);
	    }
    	}
    }
    self.points.geometry.attributes.position.needsUpdate = true;
    self.points.geometry.attributes.life.needsUpdate = true;
    _.texture.needsUpdate = true;
    _.renderer.render(_.scene, _.camera);
}

function basicMove(v0, k) {
    var self = _.particleSystem;
    var positions = self.points.geometry.attributes.position.array;
    var i = k * 3;
    positions[i + 0] += v0.x / 100;
    positions[i + 1] += v0.y / 100;
    positions[i + 2] += v0.z / 100;
}

function physicalMove(v0, s0, lives, k) {
    var self = _.particleSystem;
    var positions = self.points.geometry.attributes.position.array;
    var velocities = self.points.geometry.attributes.velocity.array;
    var t = lives[k * 2 + 0] - lives[k * 2 + 1];
    var i = k * 3;
    var newX = self.position.x + self.wind.x * t + velocities[i + 0] * t + 0.5 * self.gravity.x * t * t;
    var newY = self.position.y + self.wind.y * t + velocities[i + 1] * t + 0.5 * self.gravity.y * t * t;
    var newZ = self.position.z + self.wind.z * t + velocities[i + 2] * t + 0.5 * self.gravity.z * t * t;
    positions[k * 3 + 0] = newX;
    positions[k * 3 + 1] = newY;
    positions[k * 3 + 2] = newZ;
}
