
var controls,target;

class Cannonball {

	constructor(barrel, force, direct) {
  	let geo = new THREE.CylinderGeometry(.52,2,5,20)
    let mat = new THREE.MeshNormalMaterial()
  	this.main = new THREE.Mesh(geo, mat);
    this.main.rotation.y = direct;
    scene.add(this.main);
    const SPEED = 25;
    this.vel = barrel.localToWorld(new THREE.Vector3(0,20,0)).sub(
    barrel.localToWorld(new THREE.Vector3(0,0,0))).setLength(SPEED);
    this.pos = barrel.localToWorld(new THREE.Vector3(0,22,0));
    this.force = force;
  }
  
  update(dt) {
    // Euler's method
    this.vel.add(this.force.clone().multiplyScalar(dt));
    let prePos = this.pos.clone();
    this.pos.add(this.vel.clone().multiplyScalar(dt));
    this.main.position.copy(this.pos);
    this.main.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), this.pos.clone().sub(prePos).normalize());
  }
}


class Cannon {
	constructor() {
  	this.main = new THREE.Group();
    this.barrelPart = new THREE.Group();
    let geo, mat;
    geo = new THREE.SphereGeometry(10, 20, 20, Math.PI+Math.PI*0.1, Math.PI*1.8,0, Math.PI/2);
    mat = new THREE.MeshNormalMaterial();
    let body = new THREE.Mesh(geo, mat);
    this.main.add(body);
    geo = new THREE.CylinderGeometry(2, 2, 20, 18);
    mat = new THREE.MeshNormalMaterial();
    let barrel = new THREE.Mesh(geo, mat);
    barrel.position.y = 10;
    this.barrelPart.add(barrel);
    this.barrelPart.rotation.z = -Math.PI/3;
    this.main.add(this.barrelPart);
    this.force = new THREE.Vector3(0, -10, 0);
    this.isShooting = false;
  }
  
  update(dt) {
    // shooting control
    if (keyboard.down('space')) {
      if (!this.isShooting) {
        this.isShooting = true;
        this.cannonball = new Cannonball(this.barrelPart, this.force, this.main.rotation.y);
      }
    }
    
    if (this.isShooting) {
    	this.cannonball.update(dt);
      if (this.cannonball.pos.y < 0) {
        scene.remove(this.cannonball.main);
        this.isShooting = false;
      }
    }
    this.drawLine();
  }
  drawLine() {
    let points = [];
    const SPEED = 25;
    let vel = this.barrelPart.localToWorld(new THREE.Vector3(0,20,0)).sub(
    this.barrelPart.localToWorld(new THREE.Vector3(0,0,0))).setLength(SPEED);
    let pos = this.barrelPart.localToWorld(new THREE.Vector3(0,22,0));
  	for (let i = 0; pos.y>0; i++) {
		points.push(pos.clone());
		vel.add(this.force.clone().multiplyScalar(0.05));
		pos.add(vel.clone().multiplyScalar(0.05));
    }
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    let parabola = new THREE.Line(geometry, new THREE.LineDashedMaterial({color:'cyan'}));
    parabola.computeLineDistances();
    scene.remove(this.parabola);
    this.parabola = parabola;
		scene.add(this.parabola);
  }
}

function init() {
  // OrbitControls
  controls = new OrbitControls( camera, renderer.domElement );
  controls.target =  new THREE.Vector3(0, 25, 0);
  controls.update();
}

function animate() {
	controls.update();
	keyboard.update();
	target.update(dt);
}

</script>