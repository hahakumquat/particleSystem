// particle system class
ParticleSystem = function(params, particleTex) {

    var self = this;
    self.time = new THREE.Clock(true);
    self.position = params.position || new THREE.Vector3(0, 0, 0);
    self.maxParticles = params.maxParticles || 1000;
    self.lifetime = params.lifetime || 5.0;
    self.color = params.color || new THREE.Color(0xFFFFFF);
    self.size = params.size || 1.0;
    self.blending = params.blending || THREE.AdditiveBlending;
    self.transparent = params.transparent || true;

    // // geometry object that holds buffers
    var particleGeometry = new THREE.Geometry();

    for (var k = 0; k < self.maxParticles; k++) {
	particleGeometry.vertices.push(new THREE.Vector3(0, Math.random(), Math.random()));
    }
    
    var particleMaterial = new THREE.PointsMaterial({
	color: 0xffffff,
	size: self.size,
	blending: self.blending,
	map: particleTex,
	transparent: self.transparent,
	alphaTest: 0.5,
	depthTest : false,
	depthWrite : false
    });
    
    var particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    
    for (var k = 0; k < self.maxParticles; k++) {
	
	particlePoints.geometry.vertices[k].velocity = new THREE.Vector3(
	    Math.random() / 2, Math.random() / 2, Math.random() / 2);
	
	particlePoints.geometry.vertices[k].life = self.lifetime - (k * self.lifetime / self.maxParticles);
    }
    self.points = particlePoints;
}

ParticleSystem.prototype.update = function() {
    var self = this;
    var delta = self.time.getDelta();
    for (var k = 0; k < self.maxParticles; k++) {
	if (self.points.geometry.vertices[k].life - delta < 0) {
	    self.points.geometry.vertices[k].life = self.lifetime;
	    self.points.geometry.vertices[k].x = self.position.x;
	    self.points.geometry.vertices[k].y = self.position.y;
	    self.points.geometry.vertices[k].z = self.position.z;
	}
	else {
	    self.points.geometry.vertices[k].life -= delta;
	    var velocity = self.points.geometry.vertices[k].velocity;
	    self.points.geometry.vertices[k].x += velocity.x;
	    self.points.geometry.vertices[k].y += velocity.y;
	    self.points.geometry.vertices[k].z += velocity.z;
	}
    }
    self.points.geometry.verticesNeedUpdate = true;
}
