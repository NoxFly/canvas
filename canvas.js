/**
 * @copyright   Copyright (C) 2019 - 2020 Dorian Thivolle All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE.txt
 */

let ctx = null, canvas = null, width, height;
let mouseX = 0, mouseY = 0;
let bFill = true, bStroke = true;
let keys = {};
let oldMouseX = 0, oldMouseY = 0;
let isPointerLocked = false;
let mouseDirection = {x: 0, y: 0};
let MIN_DOC_SIZE;
let swipexDown = null;
var swipeyDown = null;
let swipePCEnable = true;
let lastSwipe;

let isDevice = {
	mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
	ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
	android: /Android/.test(navigator.userAgent)
};


const line = (x1,y1,x2,y2) => {
	ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		if(bStroke) ctx.stroke();
	ctx.closePath();
};

function polyline() {
	if(arguments.length % 2 != 0) {
		console.error('The function polyline must take an even number of arguments');
		return;
	}

	ctx.beginPath();

	if(arguments.length > 0) {
		ctx.moveTo(arguments[0], arguments[1]);
	}

	for(let i=2; i < arguments.length; i+=2) {
		let x = arguments[i],
			y = arguments[i+1];
		
		ctx.lineTo(x,y);
	}

	if(bStroke) ctx.stroke();
	ctx.closePath();
}

const circle = (x, y, r) => {
	ctx.beginPath();
		ctx.arc(x, y, r, 0, 2*Math.PI);
		if(bStroke) ctx.stroke();
		if(bFill) ctx.fill();
	ctx.closePath();
};

const fillRect = (x,y,w,h) => {ctx.fillRect(x,y,w,h);};

const rect = (x, y, w, h) => {
	ctx.rect(x,y,w,h);
	if(bFill) ctx.fill();
	if(bStroke) ctx.stroke();
};

const text = (txt, x, y) => {ctx.fillText(txt, x, y);};
const setFont = (fontSize, font) => {ctx.font = `${fontSize} ${font}`;};
const alignText = alignment => {ctx.textAlign = ['left', 'right', 'center', 'start', 'end'].indexOf(alignment) > -1? alignment : 'left';};

// push & pop & translate
const push = 		() 		=> {ctx.save();};
const pop = 		() 		=> {ctx.restore();};
const translate =	(x,y) 	=> {ctx.translate(x,y);};
const rotate =		degree	=> {ctx.rotate(radians(degree))};

// noFill & noStroke
const noFill = 		() => {bFill = false;};
const noStroke = 	() => {bStroke = false;};


// calculs & parameters
const stroke = 			color 	=> 	{ctx.strokeStyle = color; bStroke = true;};
const strokeWeight =	weight	=>	{ctx.lineWidth = weight;};
const linecap =			style	=>	{ctx.lineCap = ['butt','round','square'].indexOf(style) > -1? style : 'butt';};
const fill = 			color 	=> 	{ctx.fillStyle = color; bFill = true;};
const clear = 			() 		=> 	{ctx.clearRect(0,0,canvas.width,canvas.height);}
const radians = 		deg 	=> 	deg * (Math.PI/180);
const angleToVector = 	angle 	=> 	new Vector(Math.cos(angle), Math.sin(angle));
const random = 			max 	=> 	Math.floor(Math.random() * max);
const dist = 			(a,b) 	=> 	Math.hypot(a.x-b.x, a.y-b.y);
const map =				(val, start1, end1, start2, end2) => ((val-start1)/(end1-start1))*(end2-start2)+start2;

// get last swipe direction
const getSwipe = () => lastSwipe;

// key event
const isKeyDown = keyCode => keys[keyCode];
const isKeyUp = keyCode => !keys[keyCode];

const mouseDir = () =>
	isPointerLocked?
		mouseDirection
	:
		(mouseX >  oldMouseX && mouseY >  oldMouseY)? "BOTTOM_RIGHT" :
		(mouseX >  oldMouseX && mouseY <  oldMouseY)? "TOP_RIGHT" :
		(mouseX <  oldMouseX && mouseY <  oldMouseY)? "TOP_LEFT" :
		(mouseX <  oldMouseX && mouseY >  oldMouseY)? "BOTTOM_LEFT" :
		(mouseX >  oldMouseX && mouseY == oldMouseY)? "RIGHT" :
		(mouseX == oldMouseX && mouseY >  oldMouseY)? "DOWN" :
		(mouseX == oldMouseX && mouseY <  oldMouseY)? "UP" :
		(mouseX <  oldMouseX && mouseY == oldMouseY)? "LEFT":
	null;


const enablePCswipe = bool => {
	typeof bool == "boolean"? swipePCEnable = bool : swipePCEnable = true;

	if(swipePCEnable) {
		document.removeEventListener('mousedown', handleTouchStart, false);
		document.removeEventListener('mousemove', handleTouchMove, false);
	} else {
		document.removeEventListener('mousedown', handleTouchStart, false);
		document.removeEventListener('mousemove', handleTouchMove, false);
	}
};

// MAIN
function createCanvas(w, h, bg="#000", requestPointerLock=false) {
	if(canvas != null) {
		document.querySelector("#"+canvas.id).remove();
		canvas = null;
		ctx = null;
	}

	canvas = document.createElement('canvas');
	canvas.id = "dynamic-canvas";
	canvas.width = w;
	canvas.height = h;
	canvas.style.background = bg;
	document.body.appendChild(canvas);

	if(requestPointerLock) {
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

		document.addEventListener('pointerlockchange', () => {
			if(document.pointerLockElement !== canvas || document.mozPointerLockElement !== canvas) isPointerLocked = false;
		}, false);

		canvas.onclick = () => {
			if(!isPointerLocked) {
				canvas.requestPointerLock();
				isPointerLocked = true;
			}
		};
	}

	width = w;
	height = h;

	ctx = canvas.getContext('2d');
	
	return canvas;
}

let drawCond = () => true;

function setDrawCondition(condition = null) {
	if(condition) {
		drawCond = condition;
	}
}

function drawLoop() {
    if(ctx && typeof draw != "undefined" && drawCond()) {
        clear();
        draw();
    }

    requestAnimationFrame(drawLoop);
}

function handleTouchStart(e) {
	let getTouches = e2 => e2.touches || [{clientX: e.clientX, clientY: e.clientY}, null];

	const firstTouch = getTouches(e)[0];
	swipexDown = firstTouch.clientX;
	swipeyDown = firstTouch.clientY;
}

function handleTouchMove(e) {
	if(!swipexDown || !swipeyDown) {
		return;
	}

	let xUp, yUp;

	if(e.touches) {
		xUp = e.touches[0].clientX;
		yUp = e.touches[0].clientY;
	} else {
		xUp = e.clientX;
		yUp = e.clientY;
	}

	let xDiff = swipexDown - xUp;
	let yDiff = swipeyDown - yUp;

	let event, swipeDir;

	if(Math.abs(xDiff) > Math.abs(yDiff)) {
		if(xDiff > 0) 	(swipeDir = 'left')  && (event = new CustomEvent('swipeleft',  {detail: {swipe: 'left'}}));
		else 			(swipeDir = 'right') && (event = new CustomEvent('swiperight', {detail: {swipe: 'right'}}));
	} else {
		if(yDiff > 0) 	(swipeDir = 'up')    && (event = new CustomEvent('swipeup',    {detail: {swipe: 'up'}}));
		else 			(swipeDir = 'down')  && (event = new CustomEvent('swipedown',  {detail: {swipe: 'down'}}));
	}

	document.dispatchEvent(event);
	lastSwipe = swipeDir;
	
	swipexDown = null;
	swipeyDown = null;
}

window.onload = e => {
	MIN_DOC_SIZE = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth);
	
	if(typeof setup != "undefined") setup();

	document.body.onmousemove = e => {
		oldMouseX = mouseX;
		oldMouseY = mouseY;
		mouseX = e.clientX;
		mouseY = e.clientY;
		mouseDirection = {x: e.movementX, y: e.movementY};
	};

	document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchmove',  handleTouchMove, false);

	if(swipePCEnable) {
		document.addEventListener('mousedown', handleTouchStart, false);
		document.addEventListener('mousemove', handleTouchMove, false);
	}

	if(typeof onSwipe != "undefined") {
		document.addEventListener('swipeleft',  onSwipe, false);
		document.addEventListener('swiperight', onSwipe, false);
		document.addEventListener('swipeup',    onSwipe, false);
		document.addEventListener('swipedown',  onSwipe, false);
	}

	// EVENTS
	window.onkeypress = e => {
		keys[e.code] = true;
		if(typeof keyPress != "undefined") keyPress(e);
	};

	window.onkeydown = e => {
		keys[e.code] = true;
		if(typeof keyDown != "undefined") keyDown(e);
	};

	window.onkeyup = e => {
		keys[e.code] = false;
		if(typeof keyUp != "undefined") keyUp(e);
	};

	canvas.onmousemove  = e => {if(typeof mouseMove  != "undefined") mouseMove(e);};
	canvas.onmouseenter = e => {if(typeof mouseEnter != "undefined") mouseEnter(e);};
	canvas.onmouseleave = e => {if(typeof mouseLeave != "undefined") mouseLeave(e);};
	canvas.onmousewheel = e => {if(typeof mouseWheel != "undefined") mouseWheel(e);};

	drawLoop();
};

// CLASSES

class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	normalize() {
		var norm = Math.sqrt(this.x * this.x + this.y * this.y);
		if (norm != 0) {
			this.x = this.x / norm;
			this.y = this.y / norm;
		}
	}

	set(x,y) {
		this.x = x;
		this.y = y;
	}

	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
	}

	get mag() {
		return Math.hypot(this.x, this.y);
	}

	setMag(newMag) {
		this.x = this.x * newMag / this.mag;
		this.y = this.y * newMag / this.mag;
	}
};