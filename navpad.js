/*
 * @author: Mehdi Seifi / mese1979@gmail.com
 */
 
NavPad = function(parent, w, h) {

	var self = this;
	var $parent = parent ? parent : $('body');
	var baseWidth = w;
	var baseHeight = h;
	var yawMouseDown = false;
	var pitchMouseDown = false;
	var baseRadius = 20;
	var handleRadius = 8;
	var handleBoxSize = handleRadius * 2 + 4;
	var pitchTrack = {};
	var outerLineWidth = 2;
	var startAngle = 90*(Math.PI/180);
	var positions = {};
	var horizontalAlign = 'right';
	var verticalAlign = 'bottom';
	var maxPitch = 90;

	pitchTrack.width = 12;
	pitchTrack.min = 0;
	pitchTrack.max = 0;
	pitchTrack.length = 0;
	

	self.baseDiv = $('<div class="navpad"></div>');

	self.baseCanvas = $('<canvas id="padBaseCanvas" class=""> </canvas>');
	self.baseCanvas.attr({
		width: baseWidth,
		height: baseHeight
	});
	self.baseDiv.append(self.baseCanvas);

	self.yawCanvas = $('<canvas id="padYawCanvas" class="navpad rotation-handle"> </canvas>');
	self.yawCanvas.attr({
		width: handleBoxSize,
		height: handleBoxSize
	});
	self.baseDiv.append(self.yawCanvas);

	self.pitchCanvas = $('<canvas id="padPitchCanvas" class="navpad rotation-handle"> </canvas>');
	self.pitchCanvas.attr({
		width: handleBoxSize,
		height: handleBoxSize
	});
	self.baseDiv.append(self.pitchCanvas);

	// Add pad to the dom and draw it.
	self.baseDiv.css({
		width: baseWidth + 2,
		height: baseHeight + 2
	});
	$parent.append(self.baseDiv);

	addNavKeys();
	redraw();

	self.yawCanvas.css({
		top: positions.centerY - baseRadius + handleRadius,
		left: positions.centerX
	});
	self.pitchCanvas.css({
		top: pitchTrack.length/2,
		left: baseWidth - pitchTrack.width - handleRadius + 2
	});

	// Events
	self.yawCanvas.on('mousedown', onYawMouseDown);
	self.pitchCanvas.on('mousedown', onPitchMouseDown);
	$(document).on('mouseup', onMouseUp);
	$(document).on('mousemove', onMouseMove);



	function redraw() {

		baseRadius = self.baseCanvas.width()/2 - pitchTrack.width - outerLineWidth;

		positions.baseOffsetX = self.baseCanvas.offset().left;
		positions.baseOffsetY = self.baseCanvas.offset().top;
		positions.baseHalfW = self.baseCanvas.width() / 2 - pitchTrack.width;
		positions.baseHalfH = self.baseCanvas.height() / 2;
		positions.handleHalfW = self.yawCanvas.width()/2;
		positions.handleHalfH = self.yawCanvas.height()/2;
		positions.centerX = (self.baseCanvas.width() - self.yawCanvas.width()) / 2 - pitchTrack.width;
		positions.centerY = (self.baseCanvas.height() - self.yawCanvas.height()) / 2;
		//console.log(positions);

		drawBase();
		drawYawHandle();
		drawPitchHandle();
	}

	function drawBase() {

		var ctx = self.baseCanvas.get(0).getContext('2d');
		ctx.clearRect(0, 0, baseWidth, baseHeight);
		ctx.beginPath();
		ctx.lineWidth = outerLineWidth;
		ctx.arc(baseWidth/2 - pitchTrack.width, baseHeight/2, baseRadius, 0, Math.PI * 2, true);
		ctx.strokeStyle	= '#77838C';
		ctx.fillStyle = 'rgba(54, 60, 64, 0.5)';
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		// ctx.moveTo(baseWidth/2 - pitchTrack.width, baseHeight/2);
		// ctx.beginPath();
		// ctx.lineWidth = 1;
		// ctx.fillStyle = 'rgba(54, 60, 64, 0.5)';
		// ctx.arc(baseWidth/2 - pitchTrack.width, baseHeight/2, baseRadius - 1, 0, Math.PI * 2, true); 
		// ctx.fill();
		// ctx.closePath();

		// Pitch track
		pitchTrack.width = 12;
		pitchTrack.min = baseHeight/2 - baseRadius;
		pitchTrack.max = baseHeight/2 + baseRadius;
		pitchTrack.length = pitchTrack.max - pitchTrack.min;
		//console.log(pitchTrack);
		ctx.moveTo(baseWidth - pitchTrack.width, pitchTrack.min);
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle	= '#77838C';
		ctx.fillStyle = 'rgba(54, 60, 64, 0.5)';
		ctx.fillRect(baseWidth - pitchTrack.width, pitchTrack.min, 6, pitchTrack.length);
		ctx.strokeRect(baseWidth - pitchTrack.width, pitchTrack.min, 6, pitchTrack.length);
		ctx.closePath();
	}

	function drawYawHandle() {

		var w = self.yawCanvas.width();
		var	h = self.yawCanvas.height();
		ctx = self.yawCanvas.get(0).getContext('2d');
		ctx.clearRect(0, 0, w, h);
		ctx.beginPath(); 
		ctx.lineWidth = 1;
		ctx.arc(w/2, h/2, handleRadius, 0, Math.PI * 2, true);
		ctx.closePath();
		var gradient = ctx.createRadialGradient(w/2 - 2, h/2 - 2, 1, w/2, h/2, 9);
		// gradient.addColorStop(0, '#d0d0d0');
		// gradient.addColorStop(1, '#848484');
		gradient.addColorStop(0, '#CADBE8');
		gradient.addColorStop(1, '#93A2AD');
		ctx.fillStyle = gradient;
		ctx.strokeStyle	= '#828F99';
		ctx.fill();
		ctx.stroke();
	}

	function drawPitchHandle() {

		var w = self.pitchCanvas.width();
		var	h = self.pitchCanvas.height();
		ctx = self.pitchCanvas.get(0).getContext('2d');
		ctx.clearRect(0, 0, w, h);
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.arc(w/2, h/2, handleRadius, 0, Math.PI * 2, true);
		ctx.closePath();
		var gradient = ctx.createRadialGradient(w/2 - 2, h/2 - 2, 2, w/2, h/2, 9);
		gradient.addColorStop(0, '#CADBE8');
		gradient.addColorStop(1, '#93A2AD');
		ctx.fillStyle = gradient;
		ctx.strokeStyle	= '#828F99';
		ctx.fill();
		ctx.stroke();
	}

	function addNavKeys() {

		var navKeys = $('<div class="navKey" />');
		var first = $('<div />');
		first.append('<button id="navForward" class="btn btn-default"><span>&#x2191;</span> W</button>');
		navKeys.append(first);
		var second = $('<div />');
		second.append('<button id="navLeft" class="btn btn-default"><span>&#x2190;</span> A</button>');
		second.append('<button id="navBackward" class="btn btn-default"><span>&#x2193;</span> S</button>');
		second.append('<button id="navRight" class="btn btn-default"><span>&#x2192;</span> D</button>');
		navKeys.append(second);

		self.baseDiv.append(navKeys);
		navKeys.css({
			top: 35,
			left: (baseWidth - navKeys.width()) / 2 - pitchTrack.width + 1
		});

		// Events
		self.baseDiv.find('.navKey button').on('mousedown', function(e){
			var navEvent = new CustomEvent('navigate', {
				detail: {direction: e.currentTarget.id.substr(3).toLowerCase()}
			});
			$(self).trigger(navEvent);
		});

		self.baseDiv.find('.navKey button').on('mouseup', function(e){
			$(self).trigger('navigateStop');
		});

		self.baseCanvas.on('mouseout', function(e) {
			$(self).trigger('navigateStop');
		})
	}

	function onYawMouseDown(e) {

		yawMouseDown = true;
		// if (!startAngle)
		// 	startAngle = Math.atan2(-1*(e.pageY - self.yawCanvas.data.centerY), e.pageX - self.yawCanvas.data.centerX);
	}

	function onPitchMouseDown(e) {

		positions.pitchStartPageY = e.pageY;
		positions.pitchStartY = self.pitchCanvas.position().top;
		pitchMouseDown = true;
	}

	function onMouseUp(e) {

		yawMouseDown = false;
		pitchMouseDown = false;
	}

	function onMouseMove(e) {

		if (yawMouseDown) {

			var x = e.pageX - positions.baseOffsetX - positions.baseHalfW;
			var y = e.pageY - positions.baseOffsetY - positions.baseHalfH; // + positions.handleHalfH;
			var newAngle = Math.atan2(y, x);

			var newLeft = Math.cos(newAngle) * (baseRadius - handleRadius) + positions.centerX;
			var newTop = Math.sin(newAngle) * (baseRadius - handleRadius) + positions.centerY;

			self.yawCanvas.css({
				top: newTop,
				left: newLeft
			});

			var yawEvent = new CustomEvent('yaw', {
				detail: {angle: -1 * (newAngle + startAngle)}
			});
			$(self).trigger(yawEvent);
		}

		if (pitchMouseDown) {

			var newTop = positions.pitchStartY + (e.pageY - positions.pitchStartPageY);
			newTop = Math.max(pitchTrack.min - handleBoxSize/2, Math.min(pitchTrack.length, newTop));

			self.pitchCanvas.css({
				top: newTop
			});
			
			var pitchAngle = Math.ceil( ((maxPitch*2) * (newTop - 1)) / (pitchTrack.length - 1) ) + (-1*maxPitch);
			//console.log(newTop, pitchAngle);
			var pitchEvent = new CustomEvent('pitch', {
				detail: {angle: -1 * pitchAngle * Math.PI/180}
			});
			$(self).trigger(pitchEvent);
		}
	}


	//
	// Public functions
	//
	self.hide = function() {

		this.baseDiv.fadeOut(350);
	};

	self.show = function() {

		this.baseDiv.fadeIn(350);
	};

	self.setYawAngle = function(angle) {

		var newLeft = Math.cos(-1 * angle - startAngle) * (baseRadius - handleRadius) + positions.centerX;
		var newTop = Math.sin(-1 * angle - startAngle) * (baseRadius - handleRadius) + positions.centerY;

		self.yawCanvas.css({
			top: newTop,
			left: newLeft
		});
	};

	self.setPitchAngle = function(angle) {

		var degree = (-1 * angle) * 180/Math.PI;
		var newTop = Math.ceil( ((pitchTrack.length - 1) * (degree + maxPitch)) / (maxPitch*2) ) + 1;

		self.pitchCanvas.css({
			top: newTop,
		});
	};

	self.align = function(alignment, w, h) {

		var left = w - self.baseDiv.width() - 2;
		var top = h - self.baseDiv.height() - 2;

		alignment = $.extend({h: 'right', v: 'bottom'}, alignment);

		horizontalAlign = alignment.h;
		verticalAlign = alignment.v;

		switch(horizontalAlign) {

			case 'right':
				left = w - self.baseDiv.width() - 2;
				break;

			case 'left':
				left = 2;
				break;

			case 'center':
				left = (w - self.baseDiv.width()) / 2
				break;
		}

		switch(verticalAlign) {

			case 'top':
				top = 2;
				break;

			case 'bottom':
				top = h - self.baseDiv.height() - 2;
				break;

			case 'middle':
				top = (h - self.baseDiv.height()) / 2
				break;
		}

		self.baseDiv.css({
			top: top,
			left: left
		});

		redraw();
	};

	self.setMaxPitch = function(angle) {

		// Convert it to degree.
		maxPitch = angle * 180/Math.PI;
	}



};
