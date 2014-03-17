/*
 * @author: Mehdi Seifi / mese1979@gmail.com
 */

NavigationControls = function(container, camera, options) {

	var self = this;
	var container = container;

	var config = options || {};
	var speedFactor = config.speedFactor || 0.5;
	var delta = 1;

	var isRMouseDown = false;

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var lockMoveForward = false;
	var lockMoveBackward = false;
	var lockMoveLeft = false;
	var lockMoveRight = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;
	var maxPitch = 65 * Math.PI / 180;

	var cameraHolder = new THREE.Object3D();
	cameraHolder.add(camera);
	
	self.fpsBody = new THREE.Object3D();
	self.fpsBody.add(cameraHolder);
	self.enabled = true;

	// Nav-pad
	var navpad = new NavPad($(container).parent(), 160, 150);
	navpad.setMaxPitch(maxPitch);

	$(navpad).on('yaw', function(e) {

		if (self.enabled)
			self.fpsBody.rotation.y = e.detail.angle;
	});

	$(navpad).on('pitch', function(e) {

		if (self.enabled)
			cameraHolder.rotation.x = e.detail.angle;
	});

	$(navpad).on('navigate', function(e) {

		if (!self.enabled) return;

		switch (e.detail.direction) {

			case 'forward':
				moveForward = true;
				break;

			case 'backward':
				moveBackward = true;
				break;

			case 'left':
				moveLeft = true;
				break;

			case 'right':
				moveRight = true;
				break;
		}
	});

	$(navpad).on('navigateStop', function(e) {

		moveForward = moveBackward = moveLeft = moveRight = false;
	});

	self.navPad = navpad;

	container.addEventListener('contextmenu', onContextMenu, false);
	container.addEventListener('mousedown', onMouseDown, false);
	container.addEventListener('mouseup', onMouseUp, false);

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);
	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('mouseout', onMouseOut, false);


	//
	// Private functions
	//
	function onContextMenu(e) {

		e.preventDefault();
	};

	function onMouseDown(e) {

		if (self.enabled && e.button === 2) {
			isRMouseDown = true;
			e.preventDefault();
			e.stopPropagation();
		}
	};

	function onMouseUp(e) {

		if (self.enabled && e.button === 2) {
			isRMouseDown = false;
		}
	}

	function onMouseMove(e) {

		if (!self.enabled || !isRMouseDown) return;

		var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
		var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

		self.fpsBody.rotation.y -= movementX * 0.002;
		cameraHolder.rotation.x -= movementY * 0.002;

		cameraHolder.rotation.x = Math.max(-maxPitch, Math.min(maxPitch, cameraHolder.rotation.x));

		updateNavPad();
	}

	function onMouseOut(e) {

		self.stopMouseMoving();
	}

	function onKeyDown(e) {

		if (!self.enabled) return;

		switch (e.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;
		}
	}

	function onKeyUp(e) {

		switch (e.keyCode) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}
	}

	function updateNavPad() {

		navpad.setYawAngle(self.fpsBody.rotation.y);
		navpad.setPitchAngle(cameraHolder.rotation.x);
	}


	//
	// Public functions
	//
	self.addToScene = function(scene) {

		scene.add(self.fpsBody);
	};

	self.setPosition = function(x, y, z) {

		self.fpsBody.position.set(x, y, z);
	};

	self.update = function() {

		velocity.x += (-1 * velocity.x) * 0.75 * delta;
		velocity.z += (-1 * velocity.z) * 0.75 * delta;

		if (moveForward && !lockMoveForward) velocity.z -= speedFactor * delta;
		if (moveBackward && !lockMoveBackward) velocity.z += speedFactor * delta;

		if (moveLeft && !lockMoveLeft) velocity.x -= speedFactor * delta;
		if (moveRight && !lockMoveRight) velocity.x += speedFactor * delta;

		self.fpsBody.translateX(velocity.x);
		self.fpsBody.translateY(velocity.y);
		self.fpsBody.translateZ(velocity.z);
	};

	self.stopMouseMoving = function() {

		//Stop rotating camera when mouse goes outside of the document boundaries.
		// if (document.createEvent ) {
		// 	var rightClick = document.createEvent('MouseEvents');
		// 	rightClick.initMouseEvent(
		// 		'mouseup', 1, 1, window, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2/*right button*/, null 
		// 	);
		// 	container.dispatchEvent(rightClick);
		// }
		isRMouseDown = false;
	}

	self.getDirection = function() {

		var direction = new THREE.Vector3(0, 0, -1);
		var rotation = new THREE.Euler(0, 0, 0, "YXZ");

		return function(v) {

			rotation.set(cameraHolder.rotation.x, self.fpsBody.rotation.y, 0);
			v.copy(direction).applyEuler(rotation);
			return v;
		}
	}();

	self.setRotation = function(x, y) {

		if (x !== null)
			cameraHolder.rotation.x = x;

		if (y !== null)
			self.fpsBody.rotation.y = y;

		updateNavPad();
	}

	self.moveLeft = function() {
		return moveLeft;
	};

	self.moveRight = function() {
		return moveRight;
	};

	self.moveForward = function() {
		return moveForward;
	};

	self.moveBackward = function() {
		return moveBackward;
	};

	self.lockMoveForward = function(boolean) {
		lockMoveForward = boolean;
	};

	self.lockMoveBackward = function(boolean) {
		lockMoveBackward = boolean;
	};

	self.lockMoveLeft = function(boolean) {
		lockMoveLeft = boolean;
	};

	self.lockMoveRight = function(boolean) {
		lockMoveRight = boolean;
	};



	return self;

};
