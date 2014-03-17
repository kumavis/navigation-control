var width = 700, height = 400;
var viewAngle = 45, near = 0.1, far = 10000;
var aspect = width / height;

var renderer, camera, scene, controls;

var composer;

var cursorSprite;
	

function startScene(container) {
	
	width = window.innerWidth - 50;
	height = window.innerHeight - 60;
		
	scene = new THREE.Scene();
	
	// Lights
	var ambient = new THREE.AmbientLight(0x404040);
	scene.add(ambient);
	
	var light1 = new THREE.SpotLight(0xddeeee);
	light1.position.set(0, 400, 110);
	light1.intensity = 0.9;
	//light1.castShadow = true;
	scene.add(light1);
	
	var light2 = new THREE.PointLight(0xFFFFFF);
	light2.position.x = 10;
	light2.position.y = 70;
	light2.position.z = -120;
	light2.intensity = 0.4;
	scene.add(light2);
	
	// Camera
	camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
	
	// controls
	controls = new NavigationControls(container.get(0), camera, {speedFactor: 0.9});
	controls.setPosition(0, 22, 220);
	controls.addToScene(scene);
	controls.navPad.align({h: 'right', v: 'bottom'}, width, height);
	controls.setRotation(0.15, -0.15);
	//console.log(controls);
	
	var axes = new THREE.AxisHelper(500);
	scene.add(axes);
	
	var floor = new THREE.Mesh(
			new THREE.CubeGeometry(420, 420, 5),
			new THREE.MeshLambertMaterial({color: 0xcba980})
	);
	floor.position.set(0,-50,-15);
	floor.rotation.x = Math.PI / 2;
	//scene.add(floor);
	
	
	// Load models
	var loader = new THREE.JSONLoader();
	loader.load("model/model.js", function(geometry, materials) {
		zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		zmesh.position.set(0, 0, 0);
		zmesh.scale.set(13, 13, 13);
		scene.add(zmesh);
	});
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	container.append(renderer.domElement);
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.bottom = '0px';
	$('body').append( stats.domElement );
	
	window.addEventListener('resize', onWindowResize, false);
	
	animate();
}

function animate() {
	
	requestAnimationFrame(animate);
	
	controls.update();
	stats.update();
	
	renderer.render(scene, camera);
}

function onMouseOut() {

	controls.stopMouseMoving();
}

function onWindowResize() {

	width = window.innerWidth - 40;
	height = window.innerHeight - 50;

	controls.navPad.align({}, width, height);

	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	
	renderer.setSize(width, height);
}

