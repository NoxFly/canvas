/**
 * @copyright   Copyright (C) 2019 - 2020 Dorian Thivolle All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE.txt
*/

// public vars
let ctx = null, canvas = null, width = 0, height = 0, realWidth = 0, realHeight = 0;
let mouseX = 0, mouseY = 0;
let MIN_DOC_SIZE;
let isDevice = {
	mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
	ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
	android: /Android/.test(navigator.userAgent)
};
let originArr = [
	'topLeft',    'top',    'topRight',
	'left',       'center', 'right',
	'bottomLeft', 'bottom', 'bottomRight'
];
let fontSize = "12px";
let fontFamily = "Monospace";
let fps = 60;

// private vars
let NOX_CVS_PVT_VAR = {
	bFill: true, bStroke: true,
	keys: {},
	isMouseDown: false,
	oldMouseX: 0, oldMouseY: 0,
	isPointerLocked: false,
	mouseDirection: {x: 0, y: 0},
	swipexDown: null,
	swipeyDown: null,
	swipePCEnable: true,
	lastSwipe: null,
	bGuideLines: false,
	now: 0, then: Date.now(), interval: 1000/fps, delta: 0, counter: 0, time_el: 0,
	tc: (oColor) => {
		let color = [], newCol = "#000";
		for(arg in oColor) color.push(oColor[arg]);
		if([0,2].indexOf(color.length) !== -1 || color.length > 4) newCol = "#000";
		else if(color.length == 1) {
			if(typeof color[0] == "number") {
				newCol = `rgb(${color[0]}, ${color[0]}, ${color[0]})`;
			} else if(typeof color[0] == "string") {
				newCol = color[0];
			}
		} else {
			if(color.every(col => typeof col == "number")) {
				if(color.length == 3)
					newCol = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
				else
					newCol = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
			}
		}
		return newCol;
	}
}

const line = (x1,y1,x2,y2) => {
	ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		if(NOX_CVS_PVT_VAR.bStroke) ctx.stroke();
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

		if(NOX_CVS_PVT_VAR.bStroke) ctx.stroke();
		if(NOX_CVS_PVT_VAR.bFill) ctx.fill();
	ctx.closePath();
}

const circle = (x, y, r) => {
	ctx.beginPath();
		ctx.arc(x, y, r, 0, 2*Math.PI);
		if(NOX_CVS_PVT_VAR.bStroke) ctx.stroke();
		if(NOX_CVS_PVT_VAR.bFill) ctx.fill();
	ctx.closePath();
};

const fillRect = (x,y,w,h) => {ctx.fillRect(x,y,w,h);};

const rect = (x, y, w, h) => {
	ctx.rect(x,y,w,h);
	if(NOX_CVS_PVT_VAR.bFill) ctx.fill();
	if(NOX_CVS_PVT_VAR.bStroke) ctx.stroke();
};

const text = (txt, x, y) => {
	if(/<br>/.test(txt)) {
		let size = fontSize.replace(/(\d+)(\w+)?/, '$1');
		txt = txt.split('<br>');
		for(let i=0; i<txt.length; i++) ctx.fillText(txt[i], x, y+i*size);
	} else {
		ctx.fillText(txt, x, y);
	}
};

const setFont = (size, font) => {ctx.font = `${size}px ${font}`; fontSize=size+"px"; fontFamily=font};
const setFontSize = size => {ctx.font = `${size}px ${fontFamily}`; fontSize=size+"px"};
const setFontFamily = font => {ctx.font = `${fontSize} ${font}`; fontFamily=font};
const alignText = alignment => {ctx.textAlign = ['left', 'right', 'center', 'start', 'end'].indexOf(alignment) > -1? alignment : 'left';};

// push & pop & translate
const push = 		() 		=> {ctx.save();};
const pop = 		() 		=> {ctx.restore();};
const translate =	(x,y) 	=> {ctx.translate(x,y);};
const rotate =		degree	=> {ctx.rotate(radians(degree))};

// noFill & noStroke
const noFill = 		() => {NOX_CVS_PVT_VAR.bFill = false;};
const noStroke = 	() => {NOX_CVS_PVT_VAR.bStroke = false;};

function background     (color)    {canvas.style.backgroundColor = NOX_CVS_PVT_VAR.tc(arguments);};

// calculs & parameters
function stroke  		(color)    {ctx.strokeStyle = NOX_CVS_PVT_VAR.tc(arguments); NOX_CVS_PVT_VAR.bStroke = true;};
const strokeWeight =	weight	=> {ctx.lineWidth = weight;};
const linecap =			style	=> {ctx.lineCap = ['butt','round','square'].indexOf(style) > -1? style : 'butt';};
function fill  			(color)    {ctx.fillStyle = NOX_CVS_PVT_VAR.tc(arguments); NOX_CVS_PVT_VAR.bFill = true;};
const clear = 			() 		=> {ctx.clearRect(0,0,canvas.width,canvas.height);}
const radians = 		deg 	=> deg * (Math.PI/180);
const degree = 			rad 	=> rad * (180/Math.PI);
const angleToVector = 	angle 	=> new Vector(Math.cos(angle), Math.sin(angle));
const dist = 			(a,b) 	=> Math.hypot(a.x-b.x, a.y-b.y);
const map =				(val, start1, end1, start2, end2) => ((val-start1)/(end1-start1))*(end2-start2)+start2;
const pow =				n		=> n*n;
const abs =				n		=> (n >= 0)? n : -n;
const sqrt =			n		=> Math.sqrt(n);
function min			() 		{return Math.max(...arguments);}
function max			() 		{return Math.min(...arguments);}
const round =			n		=> Math.round(n);
const floor =			n		=> Math.floor(n);
const ceil =			n		=> Math.ceil(n);
const frameRate =		f		=> {if(f<0) return; NOX_CVS_PVT_VAR.interval = 1000/f};
const random = 			(min, max) 	=> floor(Math.random() * (max - min +1)) + min;


const hex = (r,g,b) => {   
	r = Number(r).toString(16); if(r.length < 2) r = "0"+r;
	g = Number(g).toString(16); if(g.length < 2) g = "0"+g;
	b = Number(b).toString(16); if(b.length < 2) b = "0"+b;
	return "#"+r+g+b;
};

const hexs = (rgb)=> {
	let r, g, b;
	if(typeof rgb == "number") {
		[r, g, b] = [rgb, rgb, rgb];
	} else {
		r = parseInt(rgb.replace(/rgba?\((\d+),\d+,\d+(\,\d+)?\)/,'$1'));
		g = parseInt(rgb.replace(/rgba?\(\d+,(\d+),\d+(\,\d+)?\)/,'$1'));
		b = parseInt(rgb.replace(/rgba?\(\d+,\d+,(\d+)(\,\d+)?\)/,'$1'));
	}
	return hex(r,g,b);
};

const rgb =	hexa => {
	hexa = hexa.replace('#','');
	if(hexa.length == 3) hexa = hexa[0]+hexa[0]+hexa[1]+hexa[1]+hexa[2]+hexa[2];
	return 'rgb('+parseInt(hexa.substring(0,2), 16)+','+parseInt(hexa.substring(2,4), 16)+','+parseInt(hexa.substring(4,6), 16)+')';
};

// get last swipe direction
const getSwipe = () => NOX_CVS_PVT_VAR.lastSwipe;

// key event
const isKeyDown = keyCode => NOX_CVS_PVT_VAR.keys[keyCode];
const isKeyUp 	= keyCode => !NOX_CVS_PVT_VAR.keys[keyCode];

// scale for rendering
const rendering  = (x, y=null) 	=> new Vector(((x instanceof Vector && !y)? x.x:x) * width/realWidth, ((x instanceof Vector && !y)?x.y:y) * height/realHeight);
const renderingX = x 			=> x*width/realWidth;
const renderingY = y 			=> y*height/realHeight;

const mouseDir = () =>
	NOX_CVS_PVT_VAR.isPointerLocked?
		NOX_CVS_PVT_VAR.mouseDirection
	:
		(mouseX >  NOX_CVS_PVT_VAR.oldMouseX && mouseY >  NOX_CVS_PVT_VAR.oldMouseY)? "BOTTOM_RIGHT" :
		(mouseX >  NOX_CVS_PVT_VAR.oldMouseX && mouseY <  NOX_CVS_PVT_VAR.oldMouseY)? "TOP_RIGHT" :
		(mouseX <  NOX_CVS_PVT_VAR.oldMouseX && mouseY <  NOX_CVS_PVT_VAR.oldMouseY)? "TOP_LEFT" :
		(mouseX <  NOX_CVS_PVT_VAR.oldMouseX && mouseY >  NOX_CVS_PVT_VAR.oldMouseY)? "BOTTOM_LEFT" :
		(mouseX >  NOX_CVS_PVT_VAR.oldMouseX && mouseY == NOX_CVS_PVT_VAR.oldMouseY)? "RIGHT" :
		(mouseX == NOX_CVS_PVT_VAR.oldMouseX && mouseY >  NOX_CVS_PVT_VAR.oldMouseY)? "DOWN" :
		(mouseX == NOX_CVS_PVT_VAR.oldMouseX && mouseY <  NOX_CVS_PVT_VAR.oldMouseY)? "UP" :
		(mouseX <  NOX_CVS_PVT_VAR.oldMouseX && mouseY == NOX_CVS_PVT_VAR.oldMouseY)? "LEFT":
	null;


const enablePCswipe = bool => {
	NOX_CVS_PVT_VAR.swipePCEnable = typeof bool == "boolean"? bool : true;

	if(NOX_CVS_PVT_VAR.swipePCEnable) {
		document.removeEventListener('mousedown', handleTouchStart, false);
		document.removeEventListener('mousemove', handleTouchMove, false);
	} else {
		document.removeEventListener('mousedown', handleTouchStart, false);
		document.removeEventListener('mousemove', handleTouchMove, false);
	}
};

function setHTMLview(w, h) {
	if(w < 0 || h < 0) return;
	realWidth = w;
	realHeight = h;
	if(canvas) {
		canvas.style.width = realWidth;
		canvas.style.height = realHeight;
	}
}

// MAIN
function createCanvas(w, h, bg="#000", requestPointerLock=false) {
	if(canvas != null) {
		document.querySelector("#"+canvas.id).remove();
		canvas = null;
		ctx = null;
	}

	canvas = document.createElement('canvas');

	width = w;
	height = h;

	canvas.width = width;
	canvas.height = height;

	if(realWidth == 0) {
		realWidth = width;
		realHeight = height;
	}

	canvas.id = "dynamic-canvas";
	canvas.style.width = realWidth;
	canvas.style.height = realHeight;
	canvas.style.background = bg;
	document.body.appendChild(canvas);

	if(requestPointerLock) {
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

		document.addEventListener('pointerlockchange', () => {
			if(document.pointerLockElement !== canvas || document.mozPointerLockElement !== canvas) NOX_CVS_PVT_VAR.isPointerLocked = false;
		}, false);

		canvas.onclick = () => {
			if(!NOX_CVS_PVT_VAR.isPointerLocked) {
				canvas.requestPointerLock();
				NOX_CVS_PVT_VAR.isPointerLocked = true;
			}
		};
	}

	ctx = canvas.getContext('2d');
	
	return canvas;
}

function showGuideLines(bool) {
	NOX_CVS_PVT_VAR.bGuideLines = typeof bool == 'boolean'? bool : false;
}

let drawCond = () => true;

function setDrawCondition(condition = null) {
	if(condition) drawCond = condition;
}

function drawLoop() {
	requestAnimationFrame(drawLoop);
	NOX_CVS_PVT_VAR.now = Date.now();
	NOX_CVS_PVT_VAR.delta = NOX_CVS_PVT_VAR.now - NOX_CVS_PVT_VAR.then;
	if(NOX_CVS_PVT_VAR.delta > NOX_CVS_PVT_VAR.interval) {
		NOX_CVS_PVT_VAR.then = NOX_CVS_PVT_VAR.now - (NOX_CVS_PVT_VAR.delta % NOX_CVS_PVT_VAR.interval);
		fps = parseInt(NOX_CVS_PVT_VAR.counter/NOX_CVS_PVT_VAR.time_el);
		if(ctx && typeof draw != "undefined" && drawCond()) {
			clear();
			draw();
			if(NOX_CVS_PVT_VAR.bGuideLines) {
				fill('#46eaea'); stroke('#46eaea'); strokeWeight(1);
				line(0,mouseY,width,mouseY); line(mouseX,0,mouseX,height);
				text(`${Math.floor(mouseX)},${Math.floor(mouseY)}`,mouseX+5,mouseY-5);
			}
		}
	}
}

function handleTouchStart(e) {
	NOX_CVS_PVT_VAR.isMouseDown = true;
	if(typeof mouseDown != "undefined") mouseDown(e);
	let getTouches = e2 => e2.touches || [{clientX: e.clientX, clientY: e.clientY}, null];

	const firstTouch = getTouches(e)[0];
	NOX_CVS_PVT_VAR.swipexDown = firstTouch.clientX;
	NOX_CVS_PVT_VAR.swipeyDown = firstTouch.clientY;
}

function handleTouchMove(e) {
	if(typeof mouseDown != "undefined" && NOX_CVS_PVT_VAR.isMouseDown) mouseDown(e);
	if(!NOX_CVS_PVT_VAR.swipexDown || !NOX_CVS_PVT_VAR.swipeyDown) {
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

	let xDiff = NOX_CVS_PVT_VAR.swipexDown - xUp;
	let yDiff = NOX_CVS_PVT_VAR.swipeyDown - yUp;

	let event, swipeDir;

	if(Math.abs(xDiff) > Math.abs(yDiff)) {
		if(xDiff > 0) 	(swipeDir = 'left')  && (event = new CustomEvent('swipeleft',  {detail: {swipe: 'left'}}));
		else 			(swipeDir = 'right') && (event = new CustomEvent('swiperight', {detail: {swipe: 'right'}}));
	} else {
		if(yDiff > 0) 	(swipeDir = 'up')    && (event = new CustomEvent('swipeup',    {detail: {swipe: 'up'}}));
		else 			(swipeDir = 'down')  && (event = new CustomEvent('swipedown',  {detail: {swipe: 'down'}}));
	}

	canvas.dispatchEvent(event);
	NOX_CVS_PVT_VAR.lastSwipe = swipeDir;
	
	NOX_CVS_PVT_VAR.swipexDown = null;
	NOX_CVS_PVT_VAR.swipeyDown = null;
}

function getOffsetVector(shape) {
	if(!(shape instanceof Shape)) {
		console.error('Argument must be a Shape type');
		return new Vector(0, 0);
	}

	let vec = new Vector(0, 0), w, h, o;

	if(shape instanceof RectangleShape) {
		w = shape.width/2; h = shape.height/2, o = new Vector(0,0);
	}

	else if(shape instanceof CircleShape) {
		w = shape.r; h = w, o = new Vector(shape.r, shape.r);
		vec.set(shape.r, shape.r);
	}
	
	switch(shape.origin) {
		case 'topLeft':		vec.set(-o.x, -o.y);		break;
		case 'top': 		vec.set(w-o.x, -o.y); 		break;
		case 'topRight': 	vec.set(w*2-o.x, -o.y); 	break;
		case 'left': 		vec.set(-o.x, h-o.y); 		break;
		case 'center': 		vec.set(w-o.x, h-o.y); 		break;
		case 'right': 		vec.set(w*2-o.x, h-o.y); 	break;
		case 'bottomLeft': 	vec.set(-o.x, h*2-o.y); 	break;
		case 'bottom': 		vec.set(w-o.x, h*2-o.y); 	break;
		case 'bottomRight': vec.set(w*2-o.x, h*2-o.y);
	}

	return vec;
}

window.onload = e => {
	MIN_DOC_SIZE = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth);
	
	if(typeof setup != "undefined") setup();

	function offset(elt) {
		let rect = elt.getBoundingClientRect();
		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		};
	}

	if(canvas) {
		canvas.addEventListener('mousemove', e => {
			NOX_CVS_PVT_VAR.oldMouseX = mouseX;
			NOX_CVS_PVT_VAR.oldMouseY = mouseY;
			mouseX = e.clientX - offset(canvas).left;
			mouseY = e.clientY - offset(canvas).top;
			NOX_CVS_PVT_VAR.mouseDirection = {x: e.movementX, y: e.movementY};
			if(typeof mouseMove != "undefined") mouseMove(e);
		});

		canvas.addEventListener('touchstart', handleTouchStart, false);
		canvas.addEventListener('touchmove',  handleTouchMove, false);
		canvas.addEventListener('mouseup', e => {NOX_CVS_PVT_VAR.isMouseDown = false; if(typeof mouseUp != "undefined") mouseUp(e);});

		if(NOX_CVS_PVT_VAR.swipePCEnable) {
			canvas.addEventListener('mousedown', handleTouchStart, false);
			canvas.addEventListener('mousemove', handleTouchMove, false);
		}

		if(typeof onSwipe != "undefined") {
			canvas.addEventListener('swipeleft',  onSwipe, false);
			canvas.addEventListener('swiperight', onSwipe, false);
			canvas.addEventListener('swipeup',    onSwipe, false);
			canvas.addEventListener('swipedown',  onSwipe, false);
		}

		canvas.addEventListener('mouseenter', e => {if(typeof mouseEnter != "undefined") mouseEnter(e);});
		canvas.addEventListener('mouseleave', e => {if(typeof mouseLeave != "undefined") mouseLeave(e);});
		canvas.addEventListener('wheel', e => {if(typeof mouseWheel != "undefined") mouseWheel(e);});
	}
	
	// EVENTS
	window.onkeypress = e => {
		NOX_CVS_PVT_VAR.keys[e.keyCode] = true;
		if(typeof keyPress != "undefined") keyPress(e);
	};

	window.onkeydown = e => {
		NOX_CVS_PVT_VAR.keys[e.keyCode] = true;
		if(typeof keyDown != "undefined") keyDown(e);
	};

	window.onkeyup = e => {
		NOX_CVS_PVT_VAR.keys[e.keyCode] = false;
		if(typeof keyUp != "undefined") keyUp(e);
	};

	drawLoop();
};

// CLASSES

class Vector {
	constructor(x,y) {
		if(x instanceof Vector) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}

	normalize() {
		let norm = Math.sqrt(this.x * this.x + this.y * this.y);
		if (norm != 0) {
			this.x = this.x / norm;
			this.y = this.y / norm;
		}
	}

	set(x,y) {
		this.x = x;
		this.y = y;
		return this;
	}

	add(vec) {
		if(vec instanceof Vector) {
			this.x += vec.x;
			this.y += vec.y;
		} else {
			if(arguments.length == 1) {
				this.x += vec;
				this.y += vec;
			} else {
				this.x += vec;
				this.y += arguments[1];
			}
		}
		return this;
	}

	mult(vec) {
		if(vec instanceof Vector) {
			this.x *= vec.x;
			this.y *= vec.y;
		} else {
			if(arguments.length == 1) {
				this.x *= vec;
				this.y *= vec;
			} else {
				this.x *= vec;
				this.y *= arguments[1];
			}
		}
		return this;
	}

	div(vec) {
		if(vec instanceof Vector) {
			this.x /= vec.x;
			this.y /= vec.y;
		} else {
			if(arguments.length == 1) {
				this.x /= vec;
				this.y /= vec;
			} else {
				this.x /= vec;
				this.y /= arguments[1];
			}
		}
		return this;
	}

	invert(inverse=false) {
		[this.x, this.y] = [inverse?1-this.y:this.y, inverse?1-this.x:this.x];
	}

	get mag() {
		return Math.hypot(this.x, this.y);
	}

	setMag(newMag) {
		this.x = this.x * newMag / this.mag;
		this.y = this.y * newMag / this.mag;
	}

	toString() {
		return "{x: "+this.x+", y: "+this.y+"}";
	}
}

function collision(shape1, shape2) {
	if(!(shape1 instanceof Shape && shape2 instanceof Shape)) {
		console.error('Collision is only for 2 Shape types');
		return undefined;
	}

	function colRaR(a, b) {
		let x2 = x1 + a.width, y2 = y1 + a.height,
			x4 = x3 + b.width, y4 = y3 + b.height;
		return 	x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3;
	}

	function colRaC(r, c) {
		offset1 = getOffsetVector(r);
		offset2 = getOffsetVector(c);

		let cx = c.x - offset2.x, cy = c.y - offset2.y,
			rx = r.x - offset1.x, ry = r.y - offset1.y;

		let testX = (cx<rx)? rx : (cx>rx+r.width)? rx + r.width : cx,
			testY = (cy<ry)? ry : (cy>ry+r.height)? ry + r.height : cy;

		return sqrt(pow(cx - testX) + pow(cy - testY)) <= c.r;
	}

	function colCaC(c1, c2) {
		let dx = x1 - x3, dy = y1 - y3;
		return sqrt(dx * dx + dy * dy) < c1.r + c2.r;
	}

	let offset1 = getOffsetVector(shape1),
		offset2 = getOffsetVector(shape2);

	let x1 = shape1.x - offset1.x, y1 = shape1.y  - offset1.y,
		x3 = shape2.x - offset2.x, y3 = shape2.y - offset2.y;

	if(shape1 instanceof RectangleShape) {
		if(shape2 instanceof RectangleShape) 	return colRaR(shape1, shape2)
		else if(shape2 instanceof CircleShape) 	return colRaC(shape1, shape2)
	} else if(shape1 instanceof CircleShape) {
		if(shape2 instanceof CircleShape) 		return colCaC(shape1, shape2);
		if(shape2 instanceof RectangleShape) 	return colRaC(shape2, shape1);
	}

	return false;
}

class Shape {
	constructor(x, y, fill='transparent', stroke='transparent', strokeWeight=1) {
		this.pos = new Vector(x, y);
		this.style = {
			background: fill,
			stroke: stroke,
			strokeWeight: strokeWeight
		};
		this.drawOrigin = false;
		this.speed = 0;
		this.acceleration = 0;
		this.isRunning = false;
		this.origin = 'topLeft';
	}

	set fill(color) {this.style.background = color;}
	set stroke(color) {this.style.stroke = color;}
	set strokeWeight(int) {this.style.strokeWeight = int;}
	set run(bool) {this.running = typeof bool == "boolean"?  bool : false;}

	get background() {return this.style.background;}
	get stroke() {return this.style.stroke;}
	get strokeWeight() {return this.style.strokeWeight;}
	get x() {return this.pos.x;}
	get y() {return this.pos.y;}
	get running() {return this.isRunning;}

	showOrigin(bool) {this.drawOrigin = typeof bool == "boolean"?  bool : false;}

	setOrigin(newOrigin) {
		this.origin = originArr.indexOf(newOrigin)? newOrigin : 'topLeft';
	}

	setPosition(x, y=null) {
		if(!y && x instanceof Vector) {
			this.pos.x = x.x;
			this.pos.y = x.y;
		} else {
			this.pos.x = x;
			this.pos.y = y;
		}
	}

	move(x, y) {
		let speed = this.speed + (this.running? this.acceleration : 0);
		if(!y && x instanceof Vector) {
			this.pos.x += x.x * speed;
			this.pos.y += x.y * speed;
		} else {
			this.pos.x += x * speed;
			this.pos.y += y * speed;
		}
	}
}

class RectangleShape extends Shape {
	constructor(x, y, w, h, fill='black', stroke='transparent', strokeWeight=1) {
		super(x, y, fill, stroke, strokeWeight);
		this.dim = new Vector(w, h);
	}

	get width() {return this.dim.x;}
	get height() {return this.dim.y;}
	
	set width(newWidth) {this.dim.x = newWidth;}
	set height(newHeight) {this.dim.y = newHeight;}

	draw() {
		fill(this.background);
		stroke(this.stroke);
		strokeWeight(this.strokeWeight);
		
		let offset = getOffsetVector(this);

		fillRect(this.x-offset.x, this.y-offset.y, this.width, this.height);
		line(this.x-offset.x-this.strokeWeight/2, this.y-offset.y, this.x-offset.x+this.width+this.strokeWeight/2, this.y-offset.y);
		line(this.x-offset.x-this.strokeWeight/2, this.y-offset.y+this.height, this.x-offset.x+this.width+this.strokeWeight/2, this.y-offset.y+this.height);
		line(this.x-offset.x, this.y-offset.y, this.x-offset.x, this.y-offset.y+this.height);
		line(this.x-offset.x+this.width, this.y-offset.y, this.x-offset.x+this.width, this.y-offset.y+this.height);

		if(this.drawOrigin) {
			fill('#0F8');
			noStroke();
			circle(this.x, this.y, 2);
		}
	}

	hover() {
		let offset = getOffsetVector(this);
		let x1 = this.x - offset.x,
			y1 = this.y - offset.y;
		let x2 = x1 + this.width,
			y2 = y1 + this.height;

		return x1 <= mouseX && mouseX <= x2 && y1 <= mouseY && mouseY <= y2;
	}
}

class CircleShape extends Shape {
	constructor(x, y, r, fill='black', stroke='transparent', strokeWeight=1) {
		super(x, y, fill, stroke, strokeWeight);
		this.radius = r;
		this.origin = "center";
	}

	get r() {return this.radius;}
	set r(newRadius) {this.radius = newRadius;}

	draw() {
		fill(this.background);
		stroke(this.stroke);
		strokeWeight(this.strokeWeight);

		let offset = getOffsetVector(this);

		circle(this.x-offset.x, this.y-offset.y, this.r);

		if(this.drawOrigin) {
			fill('#0F8');
			noStroke();
			circle(this.x, this.y, 2);
		}
	}

	hover() {
		let offset = getOffsetVector(this);
		return pow(mouseX - this.x-offset.x) + pow(mouseY - this.y-offset.y) < pow(this.r);
	}
}

class TriangleShape extends Shape {
	constructor(x, y, baseLength, baseTiltinDegree, triangleHeight, heightPosition, fill='black', stroke='transparent', strokeWeight=1) {
		super(x, y, fill, stroke, strokeWeight);
		this.baseLength = baseLength;
		this.baseTilt = radians(baseTiltinDegree);
		this.height = triangleHeight;
		this.heightPos = heightPosition;
		this.origin = "bottomLeft";

		this.vertex = {
			A: new Vector(0,0),
			B: new Vector(0,0),
			C: new Vector(0,0)
		};
		this.refreshVertexPos();
	}

	get A() {return this.vertex.A;}
	get B() {return this.vertex.B;}
	get C() {return this.vertex.C;}

	draw() {
		this.refreshVertexPos();

		fill(this.background);
		stroke(this.stroke);
		strokeWeight(this.strokeWeight);

		polyline(this.A.x, this.A.y, this.B.x, this.B.y, this.C.x, this.C.y, this.vertex.A.x, this.A.y);

		if(this.drawOrigin) {
			fill('#0F8');
			noStroke();
			circle(this.x, this.y, 2);
		}
	} 

	refreshVertexPos() {
		let vec = angleToVector(this.baseTilt);
		this.vertex.A.set(this.x, this.y);
		this.vertex.B.set(this.A.x+this.baseLength*vec.x, this.A.y+this.baseLength*vec.y);
		let d = dist(this.A, this.B)/2;
		let k = new Vector(this.A.x+d*vec.x, this.A.y+d*vec.y);
		let angle = angleToVector(radians(degree(this.baseTilt) - 90));
		this.vertex.C.set(k.x+this.height*angle.x, k.y+this.height*angle.y, 5);
	}

	hover() {
		let triArea = abs((this.B.x-this.A.x)*(this.C.y-this.A.y) - (this.C.x-this.A.x)*(this.B.y-this.A.y));
		let area1 = abs((this.A.x-mouseX)*(this.B.y-mouseY) - (this.B.x-mouseX)*(this.A.y-mouseY));
		let area2 = abs((this.B.x-mouseX)*(this.C.y-mouseY) - (this.C.x-mouseX)*(this.B.y-mouseY));
		let area3 = abs((this.C.x-mouseX)*(this.A.y-mouseY) - (this.A.x-mouseX)*(this.C.y-mouseY));
		return area1 + area2 + area3 == triArea;
	}
}

class Triangle extends TriangleShape {
	constructor(x1, y1, x2, y2, x3, y3, fill='black', stroke='black', strokeWeight=1) {
		let A = new Vector(x1, y1), B = new Vector(x2, y2), C = new Vector(x3, y3);
		let baseTilt = degree(Math.atan2(B.y-A.y, B.x-A.x)), base = dist(A, B);
		let atv = angleToVector(radians(baseTilt));
		let k = new Vector(A.x+base/2*atv.x, A.y+base/2*atv.y);
		let tHeight = dist(k,C), heightPosition = C.x-A.x;
		super(A.x, A.y, base, baseTilt, tHeight, heightPosition, fill, stroke, strokeWeight);
	}
}