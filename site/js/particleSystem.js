// particle system class
ParticleSystem = function(params) {

    var self = this;
    self.numParticles = params.numParticles || 1000;
    self.lifetime = params.lifetime || 2.0;
    self.color = params.color || new THREE.Color(0xFFFFFF);
    self.size = params.size || 1.0;
    self.blending = params.blending || THREE.AdditiveBlending;
    self.transparent = params.transparent || true;
    self.imagePath = params.imagePath || "img/particle.jpg";

    var particles = new THREE.BufferGeometry();
}

ParticleSystem.prototype.init = function() {
}


    
