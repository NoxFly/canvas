/**
 * @copyright   Copyright (C) 2019 - 2020 Dorian Thivolle All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE.txt
 * @author		Dorian Thivolle
 * @name		canvas
 * @package		NoxFly/canvas
 * @see			https://github.com/NoxFly/canvas
 * @since		30 Dec 2019
 * @version		{1.3.0}
*/



/**
 * @vars CANVAS PUBLIC VARS
 */
let ctx = null, canvas = null, width = 0, height = 0, realWidth = 0, realHeight = 0;
let mouseX = 0, mouseY = 0;
let fps = 60;

const documentWidth = () => document.documentElement.clientWidth;
const documentHeight = () => document.documentElement.clientHeight;

// the minimum between document width & document height
let MIN_DOC_SIZE;

// PI
const PI = Math.PI;

// object of boolean
// either it's a mobile or not, in ios or android
const isDevice = {
	mobile: 	/iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
	ios: 		/iPad|iPhone|iPod/.test(navigator.userAgent),
	android: 	/Android/.test(navigator.userAgent)
};

// the possible origins for a shape
const originArr = [
	'topLeft',    'top',    'topRight',
	'left',       'center', 'right',
	'bottomLeft', 'bottom', 'bottomRight'
];

// default text size & font-family
let sFontSize = "12px";
let sFontFamily = "Monospace";


// mouse direction - can't be a vector class instance, just a basic object {x, y}
let mouseDirection = {x: 0, y: 0};


// private vars
let NOX_PV = {
	// either the fill | stroke is enable
	bFill: true, bStroke: true,

	// pressed keys
	keys: {},

	// boolean - mouse down
	isMouseDown: false,
	
	// last frame mouse's position to know the mouse direction
	oldMouseX: 0, oldMouseY: 0,

	// boolean - pointer lock
	isPointerLocked: false,

	// swipe direction
	swipexDown: null,
	swipeyDown: null,

	// boolean swipe enabled on pc
	swipePCEnable: true,

	// swipe direction
	lastSwipe: null,

	// guide lines (cyan)
	bGuideLines: false,

	// date.now() | fps and draw interval
	now: 0, then: Date.now(), interval: 1000/fps, delta: 0, counter: 0, time_el: 0,

	// ? color treatment - I think needs to be removed
	colorTreatment: (...oColor) => {
		let n = oColor.length;

		// number - only rgb value accepted
		if(n == 1 && typeof oColor[0] == 'number') {
			oColor = oColor[0];

			if(0 <= oColor && oColor <= 255) {
				return `rgb(${oColor}, ${oColor}, ${oColor})`;
			}
		}

		// rgb are the same value + alpha
		else if(n == 2 && oColor.every((c, i) => typeof c == 'number' && (0 <= c && c <= 255) || (i == 4 && 0 <= c && c <= 1))) {
			return `rgba(${oColor[0]}, ${oColor[0]}, ${oColor[0]}, ${oColor[1]>1?oColor[1]/255:oColor[1]})`;
		}

		// rgb or rgba integers
		else if([3, 4].includes(n) && oColor.every(c => typeof c == 'number')) {
			if(oColor.every((c, i) => (0 <= c && c <= 255) || (i == 4 && 0 <= c && c <= 1))) {
				return `rgb${n==4?'a':''}(${oColor[0]}, ${oColor[1]}, ${oColor[2]}${n==4?`, ${oColor[3]>1?oColor[3]/255:oColor[3]}`:''})`;
			}
		}

		// hex, hsl, rgb[a], color name
		else if(n == 1 && typeof oColor[0] == 'string') {
			oColor = oColor[0];

			let color = oColor.replace(/\s/gi, '');

			let reg = {
				hex: /^#([0-9a-z]{3}){1,2}$/i,
				rgb: /^rgba?\((\d{1,3},){2}\d{1,3}(,\d(\.\d+)?)?\)$/,
				hsl: /^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%\)$/,
				name: /^\w{3,30}$/
			};

			for(let regex in reg) {
				if(reg[regex].test(color)) {
					return oColor;
				}
			}
		}

		// color class instance
		else if(oColor[0] instanceof HEX || oColor[0] instanceof RGB || oColor[0] instanceof HSL) {
			return oColor[0].toString();
		}

		if(canvas) {
			return window.getComputedStyle(canvas).backgroundColor;
		}

		return '#000';
	}
}






/**
 * Draw a line
 * @param {number} x1 x of the first point of the line
 * @param {number} y1 y of the first point of the line
 * @param {number} x2 x of the second point of the line
 * @param {number} y2 y of the second point of the line
 */
const line = (x1, y1, x2, y2) => {
	ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		
		if(NOX_PV.bStroke) ctx.stroke();
	ctx.closePath();
};





/**
 * Draw a polyline with given arguments
 * @argument {Array} values Array of point's positions. Need to be even number
 */
const polyline = (...values) => {
	// got an odd number of argument
	if(values.length % 2 != 0) {
		console.error('The function polyline must take an even number of values');
		return;
	}

	ctx.beginPath();
		if(values.length > 0) {
			ctx.moveTo(values[0], values[1]);
		}

		for(let i=2; i < values.length; i+=2) {
			let x = values[i],
				y = values[i+1];
			
			ctx.lineTo(x,y);
		}

		if(NOX_PV.bStroke) ctx.stroke();
		if(NOX_PV.bFill) ctx.fill();
	ctx.closePath();
}






const arc = (x, y, r, start, end, antiClockwise=false) => {
	ctx.beginPath();
		ctx.arc(x, y, r, start, end, antiClockwise);
		if(NOX_PV.bStroke) ctx.stroke();
		if(NOX_PV.bFill) ctx.fill();
	ctx.closePath();
};





/**
 * Draw a circle
 * @param {number} x circle's X
 * @param {number} y circle's y
 * @param {number} r circle's radius
 */
const circle = (x, y, r) => {
	arc(x, y, r, 0, 2*PI);
};



/**
 * Draw a filled rectangle (without borders)
 * @param {number} x rectangle's X (top-left corner)
 * @param {number} y rectangle's Y (top-left corner)
 * @param {number} w rectangle's width
 * @param {number} h rectangle's height
 */
const fillRect = (x, y, w, h) => {
	ctx.fillRect(x, y, w, h);
	if(NOX_PV.bFill) ctx.fill();
	if(NOX_PV.bStroke) ctx.stroke();
};





/**
 * 
 * @param {number} x rectangle's X (top-left corner)
 * @param {number} y rectangle's Y (top-left corner)
 * @param {number} w rectangle's width
 * @param {number} h rectangle's height
 */
const strokeRect = (x, y, w, h) => {
	ctx.strokeRect(x, y, w, h);
	if(NOX_PV.bFill) ctx.fill();
	if(NOX_PV.bStroke) ctx.stroke();
};




/**
 * Draw a rectangle
 * @param {number} x rectangle's X (top-left corner)
 * @param {number} y rectangle's Y (top-left corner)
 * @param {number} w rectangle's Width
 * @param {number} h rectangle's height
 */
const rect = (x, y, w, h) => {
	ctx.rect(x, y, w, h);
	if(NOX_PV.bFill) ctx.fill();
	if(NOX_PV.bStroke) ctx.stroke();
};




/**
 * Draw a text
 * @param {String} txt text to be displayed
 * @param {number} x text's X position
 * @param {number} y text's Y position
 */
const text = (txt, x=0, y=0) => {

	// multiple lines
	if(/\n/.test(txt)) {

		let size = sFontSize.replace(/(\d+)(\w+)?/, '$1');
		txt = txt.split('\n');

		for(let i=0; i < txt.length; i++) {
			ctx.fillText(txt[i], x, y + i*size);
		}

	}
	
	// one line
	else {
		ctx.fillText(txt, x, y);
	}

};




/**
 * Text settings - set the size and the font-family
 * @param {number} size font size
 * @param {String} font font name
 */
const setFont = (size, font) => {
	ctx.font = `${size}px ${font}`;
	sFontSize = `${size}px`;
	sFontFamily = font;
};



/**
 * Set the font size of the text
 * @param {number} size font size
 */
const fontSize = size => {
	ctx.font = `${size}px ${sFontFamily}`;
	sFontSize = `${size}px`
};



/**
 * Set the font-family of the text
 * @param {String} font font-family
 */
const fontFamily = font => {
	ctx.font = `${sFontSize} ${font}`;
	sFontFamily = font
};



/**
 * Change the text's alignement
 * @param {String} alignment text's alignment
 */
const alignText = alignment => {
	ctx.textAlign = ['left', 'right', 'center', 'start', 'end'].indexOf(alignment) > -1? alignment : 'left';
};










// push & pop & translate
const push = 		() 		=> {ctx.save();};
const pop = 		() 		=> {ctx.restore();};
const translate =	(x,y) 	=> {ctx.translate(x,y);};
const rotate =		degree	=> {ctx.rotate(radian(degree));};




/**
 * Says to not fill the shapes
 */
const noFill = () => {
	NOX_PV.bFill   = false;
};

/**
 * Says to not create strokes for shapes
 */
const noStroke = () => {
	NOX_PV.bStroke = false;
};


/**
 * Change the canvas color
 * @param  {...any} color background color
 */
const background = (...color) => {
	canvas.style.backgroundColor = NOX_PV.colorTreatment(...color);
};

/**
 * Set the stroke color for shapes to draw
 * @param  {...any} color Stroke color
 */
const stroke = (...color) => {
	ctx.strokeStyle = NOX_PV.colorTreatment(...color);
	NOX_PV.bStroke = true;
};

/**
 * Set the strokeweight for shapes to draw
 * @param {number} weight weight of the stroke
 */
const strokeWeight = weight	=> {
	ctx.lineWidth = weight;
};

/**
 * Set the linecap style
 * @param {String} style linecap style
 */
const linecap =	style => {
	ctx.lineCap = ['butt','round','square'].indexOf(style) > -1? style : 'butt';
};


/**
 * Set the fill color for shapes to draw
 * @param  {...any} color Fill color
 */
const fill = (...color) => {
	ctx.fillStyle = NOX_PV.colorTreatment(...color);
	NOX_PV.bFill = true;
};

/**
 * Clear the canvas from x,y to x+w;y+h
 */
const clearRect = (x, y, w, h) => {
	ctx.clearRect(x, y, x+w, y+h);
}













/** MATHEMATICAL FUNCTIONS SECTION */



/**
 * Convert from degrees to radians
 * @param {number} deg degree value
 */
const radian = deg => deg * (PI/180);

/**
 * Convert from radians to degrees
 * @param {number} rad radian value
 */
const degree = rad => rad * (180/PI);

/**
 * Convert an angle to a vector (class instance) (2d vector)
 * @param {number} angle angle in radian
 */
const angleToVector = angle => new Vector(cos(angle), sin(angle));

/**
 * Returns the angle in degree of a given vector from the default vector (1,0)
 * @param {Vector} vector vector to calculate its angle
 */
const vectorToAngle = vec => {
	// horizontal vector - we don't care about its mag, but its orientation
	const baseVector = new Vector(1, 0);
	return angleBetweenVectors(baseVector, vec);
}

/**
 * Returns the angle between two given vectors
 * @param {Vector} a first vector
 * @param {Vector} b second vector
 */
const angleBetweenVectors = (a, b) => {
	const ab = a.x * b.x + a.y * b.y + a.z * b.z;

	const cosO = ab / (a.mag * b.mag);
	const O = acos(cosO);

	return O;
}



/**
 * Calculate the 2D / 3D distance between 2 points
 * @param {Vector} a first point
 * @param {Vector} b second point
 */
const dist = (a, b) =>  Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);

/**
 * range mapping of a value
 * @param {Array|number} val value - can be either an array or a number
 * @param {number} start1 start of the current interval
 * @param {number} end1 end of the current interval
 * @param {number} start2 start of the new interval
 * @param {number} end2 end of the new interval
 */
const map =	(arrayOrValue, start1, end1, start2, end2) => {

	const m = val => (val - start1) * (end2 - start2) / (end1 - start1) + start2;

	if(typeof arrayOrValue === 'number') {
		return m(arrayOrValue);
	}

	return arrayOrValue.map(val => m(val));
};

/**
 * Returns the power of the value (default power: 2)
 * @param {number} n value
 * @param {number} p power
 */
const pow =	(n, p=2) => Math.pow(n, p);

/**
 * Returns the absolute value of the given one
 * @param {number} n value
 */
const abs =	n => (n >= 0)? n : -n;

/**
 * Returns the sqrt of the given value
 * @param {number} n value
 */
const sqrt = n => Math.sqrt(n);

/**
 * Returns the minimum of given values
 * @param  {...Number} values value(s)
 */
const min = (...values) => Math.min(...values);

/**
 * Returns the maximum of given values
 * @param  {...Number} values value(s)
 */
const max = (...values) => Math.max(...values);

/**
 * Returns the rounded value of the given one
 * @param {number} n value
 */
const round = n => Math.round(n);

/**
 * Returns the floored value of the given one
 * @param {number} n value
 */
const floor = n => Math.floor(n);

/**
 * Returns the ceiled value of the given one
 * @param {number} n value
 */
const ceil = n => Math.ceil(n);


/**
 * Returns a random integer in a given interval. If 1 argument given, minimum is set to 0
 * @param {number} min minimal value
 * @param {number} max maximal value
 */
const random = (iMin, iMax=0) => floor(Math.random() * (max(iMin, iMax) - min(iMin, iMax) +1)) + min(iMin, iMax);


/**
 * 
 * @param {number} x x value to return its sinus
 */
const sin = x => Math.sin(x);


/**
 * 
 * @param {number} x x value to return its cosinus
 */
const cos = x => Math.cos(x);


/**
 * 
 * @param {number} x x value to return its tan
 */
const tan = x => Math.tan(x);


/**
 * 
 * @param {number} x x value to return its asin
 */
const asin = x => Math.asin(x);


/**
 * 
 * @param {number} x x value to return its acos
 */
const acos = x => Math.acos(x);


/**
 * 
 * @param {number} x x value to return its atan
 */
const atan = x => Math.atan(x);


/**
 * 
 * @param {number} x x value to return its atan2
 * @param {number} x y value to return its atan2
 */
const atan2 = (x, y) => Math.atan2(y, x);


/**
 * 
 * @param {number} x x value to return its sinh
 */
const sinh = x => Math.sinh(x);

/**
 * 
 * @param {number} x x value to return its cosh
 */
const cosh = x => Math.cosh(x);


/**
 * 
 * @param {number} x x value to return its exponential
 */
const exp = x => Math.exp(x);


/**
 * 
 * @param {number} x x value to return its logarithm
 */
const log = x => Math.log(x);


/**
 * 
 * @param {number} x x value to return its log10
 */
const log10 = x => Math.log10(x);

/**
 * Returns the sum of all values in a list
 * @param  {...number} values all values of a list
 */
const sum = (...values) => values.reduce((a, b) => a + b);

/**
 * Returns the mean of the values in a list
 * @param  {...number} values all values of a list
 */
const mean = (...values) => sum(...values) / values.length;

/**
 * Returns the median of the values in a list
 * @param  {...number} values all values of a list
 */
const median = (...values) => {
	if(values.length === 0) return 0;

	values.sort((a, b) => a - b);

	let half = floor(values.length / 2);

	if(values.length % 2) return values[half];
	return (values[half - 1] + values[half]) / 2.0;
};

/**
 * Returns the mode of the values in a list
 * @param  {...number} values all values of a list
 */
const mode = (...values) => values.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length? a: b), null);

/**
 * Returns the variance of the values in a list
 * @param  {...number} values all values of a list
 */
const variance = (...values) => values.reduce((a, b) => a + pow((b - mean(...values))), 0);

/**
 * Returns the standard deviation of the values in a list
 * @param  {...number} values all values of a list
 */
const std = (...values) => sqrt(variance(...values));














/** COLOR MANAGMENT SECTION */

/* HSL convertions :
	https://gist.github.com/mjackson/5311256
*/

class RGB {
	/**
	 * Create a RGB[A] color
	 * @param {number} r red value [0 - 255]
	 * @param {number} g green value [0 - 255]
	 * @param {number} b blue value [0 - 255]
	 * @param {number} a alpha (opacity) value [0 - 255]
	 */
	constructor(r, g=null, b=null, a=255) {
		this.color = {r: 0, g: 0, b: 0};

		if(r === undefined) {
			r = 0;
		}
		
		if(g !== null && b === null) {
			a = g;
			g = b = r;
		}

		// only one argument given: 3 are same (do grey)
		if(g === null) {
			g = r;
			b = r;
		}

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	valueInInterval(val) {
		if(val < 0 || val > 255) {
			console.error(`Color interval [0 - 255] no repespected (${val} given)`);
			return min(max(val, 0), 255);
		}

		return val;
	}

	// getters (red, green, blue, alpha)
	get r() {return this.color.r;}
	get g() {return this.color.g;}
	get b() {return this.color.b;}
	get a() {return this.color.a;}

	// setters

	// red
	set r(val) {
		this.color.r = this.valueInInterval(val);
	}

	// green
	set g(val) {
		this.color.g = this.valueInInterval(val);
	}

	// blue
	set b(val) {
		this.color.b = this.valueInInterval(val);
	}

	// alpha
	set a(val) {
		this.color.a = this.valueInInterval(val);
	}

	/**
	 * set new RGB color. If not alpha given, keep the existing one
	 * @param {number} r red value
	 * @param {number} g green value
	 * @param {number} b blue value
	 * @param {number} a alpha value (opacity)
	 */
	set(r, g, b, a=null) {
		this.r = r;
		this.g = g;
		this.b = b;
		if(a) this.a = a;
	}


	toString() {
		return `rgb${this.a!=255?'a':''}(${this.r}, ${this.g}, ${this.b}${this.a!=255?`, ${round(this.a/255*10)/10}`:''})`;
	}

	intVal() {
		return [this.r, this.g, this.b, this.a];
	}

	// return a class instance of HEX, converting its color
	toHEX() {
		let r = Number(this.r).toString(16); if(r.length < 2) r = "0"+r;
		let g = Number(this.g).toString(16); if(g.length < 2) g = "0"+g;
		let b = Number(this.b).toString(16); if(b.length < 2) b = "0"+b;
		const rgb = '#' + r + g + b;

		return new HEX(rgb);
	}

	// return a class instance of HSL, converting its color
	toHSL() {
		const r = this.r / 255,
			  g = this.g / 255,
			  b = this.b / 255;

		const imax = max(r, g, b),
			  imin = min(r, g, b);

		let h, s, l = (imax + imin) / 2;

		if(imax == imin) {
			h = s = 0;
		}
		
		else {
			let d = imax - imin;
			s = (l > 0.5)? d / (2 - imax - imin) : d / (imax + imin);

			switch(imax) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return new HSL(round(h * 10) / 10, round(s * 10) / 10, round(l * 10) / 10);
	}

}

class HEX {
	/**
	 * Create Hexadecimal color
	 * @param {string|number} HexaColor Hexadecimal number or string (3 or 6 chars accepted only)
	 */
	constructor(hexaColor) {
		this.color = {
			int: 0x000000,
			str: '#000000'
		};

		this.set(hexaColor);
	}

	toString() {return this.color.str;}
	intVal() {return this.color.int;}

	set(hexaColor) {
		if(typeof hexaColor == 'number') {
			this.color.int = hexaColor;
			let h = hexaColor.toString(16) + '';
			this.color.str = '#' + (h.length == 4? '00' : '') + h;
		}

		else if(typeof hexaColor == 'string' && /^#?([0-9a-f]{3}){1,2}$/i.test(hexaColor)) {
			hexaColor = hexaColor.replace('#', '');
			if(hexaColor.length == 3) hexaColor = hexaColor[0].repeat(2) + hexaColor[1].repeat(2) + hexaColor[2].repeat(2);
			this.color.str = '#' + hexaColor;
			this.color.int = parseInt(hexaColor, 16);
		}

		else {
			console.error(`Given parameter isn't a recognized hexadecimal number: ${hexaColor}`);
		}
	}

	// return a class instance of RGB, converting its color
	toRGB() {
		const r = (this.intVal() & 0xFF0000) >>> 16;
		const g = (this.intVal() & 0xFF00) >>> 8;
		const b = this.intVal()  & 0xFF;

		return new RGB(r, g, b);
	}

	// return a class instance of HSL, converting its color
	toHSL() {
		return this.toRGB().toHSL();
	}
}

class HSL {
	/**
	 * Create HSL color
	 * @param {number} hue hue value [0 - 359] (360 = 0)
	 * @param {number} saturation saturation value [0 - 1]
	 * @param {number} light brightness value [0 - 1]
	 */
	constructor(hue, saturation=0.5, light=0.5) {
		this.color = {h: 0, s: 0, l: 0};

		if(typeof hue !== 'number') {
			console.error(`Hue given parameter isn't a recognized number value: ${hue}`);
			hue = 0;
		}

		this.h = hue;
		this.s = saturation;
		this.l = light;
	}

	get h() {return this.color.h;}
	get s() {return this.color.s;}
	get l() {return this.color.l;}

	set h(hue) {
		this.color.h = (hue >= 0)? hue % 360 : 360 - (abs(hue) % 360);
	}

	set s(saturation) {
		this.color.s = min(max(saturation, 0), 1);
	}

	set l(light) {
		this.color.l = min(max(light, 0), 1);
	}

	/**
	 * Add hue value to the current value (loop 360->0)
	 * @param {number} hueToAdd Hue to add to the current one
	 */
	add(hueToAdd) {
		this.h = this.h + hueToAdd;
	}

	/**
	 * Substract hue from the current value (loop -1->359)
	 * @param {number} hueToSub Hue to substract from the current one
	 */
	sub(hueToSub) {
		this.h = this.h - hueToSub;
	}

	/**
	 * Add light to the current one
	 * @param {number} lightToAdd light to add to the current one
	 */
	lighten(lightToAdd) {
		this.l = this.l + lightToAdd;
	}

	/**
	 * Substract light from the current one
	 * @param {number} lightToSub light to substract from the current one
	 */
	obscure(lightToSub) {
		this.l = this.l - lightToSub;
	}

	/**
	 * Add saturation to the current one
	 * @param {number} saturationToAdd saturation to add to the current one
	 */
	addSat(saturationToAdd) {
		this.s = this.s + saturationToAdd;
	}

	/**
	 * Substract saturation from the current one
	 * @param {number} saturationToSub saturation to substract from the current one
	 */
	subSat(saturationToSub) {
		this.s = this.s - saturationToSub;
	}

	toString() {
		return `hsl(${this.h}, ${this.s*100}%, ${this.l*100}%)`;
	}

	intVal() {
		return this.toHEX().intVal();
	}

	// return a class instance of HEX, converting its color
	toHEX() {
		return this.toRGB().toHEX();
	}

	// return a class instance of RGB, converting its color
	toRGB() {
		const C = (1 - abs(2 * this.l - 1)) * this.s;
		const hh = this.h / 60;
		const X = C * (1 - abs(hh % 2 - 1));
		let r, g, b;

		r = g = b = 0;

		if(hh >= 0 && hh < 1)       [r, g] = [C, X];
		else if (hh >= 1 && hh < 2) [r, g] = [X, C];
		else if (hh >= 2 && hh < 3) [g, b] = [C, X];
		else if (hh >= 3 && hh < 4) [g, b] = [X, C];
		else if (hh >= 4 && hh < 5) [r, b] = [X, C];
		else                        [r, b] = [C, X];

		const m = this.l - C / 2;

		r = round((r + m) * 255);
		g = round((g + m) * 255);
		b = round((b + m) * 255);

		return new RGB(r, g, b);
	}
}







/**
 * Set the frame rate of the canvas - only positive number allowed
 * @param {number} f frame rate
 */
const frameRate = f => {if(f >= 0) NOX_PV.interval = 1000/f};




// get last swipe direction
const getSwipe = () => NOX_PV.lastSwipe;





// key event
const isKeyDown = keyCode => NOX_PV.keys[keyCode];
const isKeyUp 	= keyCode => !NOX_PV.keys[keyCode];




// scale for rendering
const rendering  = (x, y=null) 	=> new Vector(((x instanceof Vector && !y)? x.x : x) * width/realWidth, ((x instanceof Vector && !y)?x.y : y) * height/realHeight);
const renderingX = x 			=> x * width / realWidth;
const renderingY = y 			=> y * height / realHeight;






const mouseDir = () =>
	NOX_PV.isPointerLocked?
		mouseDirection
	:
		(mouseX >  NOX_PV.oldMouseX && mouseY >  NOX_PV.oldMouseY)? "BOTTOM_RIGHT" :
		(mouseX >  NOX_PV.oldMouseX && mouseY <  NOX_PV.oldMouseY)? "TOP_RIGHT" :
		(mouseX <  NOX_PV.oldMouseX && mouseY <  NOX_PV.oldMouseY)? "TOP_LEFT" :
		(mouseX <  NOX_PV.oldMouseX && mouseY >  NOX_PV.oldMouseY)? "BOTTOM_LEFT" :
		(mouseX >  NOX_PV.oldMouseX && mouseY == NOX_PV.oldMouseY)? "RIGHT" :
		(mouseX == NOX_PV.oldMouseX && mouseY >  NOX_PV.oldMouseY)? "DOWN" :
		(mouseX == NOX_PV.oldMouseX && mouseY <  NOX_PV.oldMouseY)? "UP" :
		(mouseX <  NOX_PV.oldMouseX && mouseY == NOX_PV.oldMouseY)? "LEFT":
	null;








/**
 * Allow or disallow the swipe on pc
 * @param {Boolean} bool either we enable or disable the swipe on PC
 */
const enablePCswipe = bool => {
	NOX_PV.swipePCEnable = typeof bool == "boolean"? bool : true;

	if(NOX_PV.swipePCEnable) {
		document.addEventListener('mousedown', handleTouchStart, false);
		document.addEventListener('mousemove', handleTouchMove, false);
	} else {
		document.removeEventListener('mousedown', handleTouchStart, true);
		document.removeEventListener('mousemove', handleTouchMove, true);
	}
};









/**
 * Set the html view rendering (canvas html element size & canvas view inside it)
 * @param {number} w width
 * @param {number} h height
 */
function setPixelResolution(w, h) {
	if(w <= 0 || h <= 0) return;

	if(canvas && ctx) {
		realWidth = w;
		realHeight = h;

		canvas.width = realWidth;
		canvas.height = realHeight;

		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
	}
	
	else {
		console.warn("No canvas created yet, so cannot apply changes for its size.");
	}
}







function setCanvasSize(newWidth, newHeight) {
	if(canvas && ctx) {
		canvas.style.width = newWidth + 'px';
		canvas.style.height = newHeight + 'px';

		canvas.width = newWidth;
		canvas.height = newHeight;

		width = newWidth;
		height = newHeight;
	}

	else {
		console.warn("No canvas created yet, so cannot apply changes for its size.");
	}
}












/**
 * Create a new canvas. If already created, then remove the current one and create another one
 * @param {number} w width of the canvas
 * @param {number} h height of the canvas
 * @param {Color} bg canvas background color
 * @param {Boolean} requestPointerLock request or not the pointer lock
 */
function createCanvas(w, h, bg="#000", requestPointerLock=false) {
	if(w <= 0 || h <= 0) {
		console.warn('Canvas size must be higher than 0');
		return;
	}

	// if canvas already created, then remove it and recreate it
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
	canvas.style.width = width;
	canvas.style.height = height;

	realWidth = width;
	realHeight = height;

	canvas.id = "dynamic-canvas";
	canvas.style.background = NOX_PV.colorTreatment(bg);
	
	document.body.appendChild(canvas);


	if(requestPointerLock) {

		canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
		document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

		document.addEventListener('pointerlockchange', () => {
			if(!document.pointerLockElement || document.pointerLockElement.id != 'dynamic-canvas') {
				NOX_PV.isPointerLocked = false;
			}
		}, false);

		canvas.onclick = () => {
			if(!NOX_PV.isPointerLocked) {
				NOX_PV.isPointerLocked = true;
				canvas.requestPointerLock();
			}
		};

	}

	ctx = canvas.getContext('2d');
	
	return canvas;

}





/**
 * Shows cyan guidelines that are following the mouse on the canvas, telling the pixels x,y
 * @param {Boolean} bool either it show or not
 */
function showGuideLines(bool) {
	NOX_PV.bGuideLines = typeof bool == 'boolean'? bool : false;
}







// default draw condition - run in every cases
let drawCond = () => true;

/**
 * Set the condition on when the draw function has to be executed (pause it if not)
 * @param {Function} condition condition in function
 */
function setDrawCondition(condition = null) {
	if(condition) drawCond = condition;
}







/**
 * The draw loop. If drawCond returns true, then execute the draw function of the user that uses the framework
 */
function drawLoop() {
	requestAnimationFrame(drawLoop);

	NOX_PV.now = Date.now();
	NOX_PV.delta = NOX_PV.now - NOX_PV.then;

	if(NOX_PV.delta > NOX_PV.interval) {

		NOX_PV.then = NOX_PV.now - (NOX_PV.delta % NOX_PV.interval);
		fps = parseInt(NOX_PV.counter / NOX_PV.time_el);

		// if canvas created & drawCond returns true
		if(ctx && typeof draw != "undefined" && drawCond()) {

			clearRect(0, 0, width, height); // clear the canvas
			draw(); // draw on the canvas

			// if guidelines enabled
			if(NOX_PV.bGuideLines) {
				fill('#46eaea'); stroke('#46eaea'); strokeWeight(1);
				line(0, mouseY, width, mouseY); line(mouseX, 0, mouseX, height);
				text(`${Math.floor(mouseX)}, ${Math.floor(mouseY)}`, mouseX + 5, mouseY - 5);
			}

		}

	}
}








/**
 * Handled when the user starts to press screen with his finger / mouse
 * @param {Object} e event default object
 */
function handleTouchStart(e) {
	NOX_PV.isMouseDown = true;

	if(typeof mouseDown != "undefined") mouseDown(e);

	let getTouches = e2 => e2.touches || [{clientX: e.clientX, clientY: e.clientY}, null];

	const firstTouch = getTouches(e)[0];

	NOX_PV.swipexDown = firstTouch.clientX;
	NOX_PV.swipeyDown = firstTouch.clientY;
}

/**
 * Handled when the user moves his finger / mouse on the screen, while he is pressing it
 * @param {Object} e event default object
 */
function handleTouchMove(e) {

	if(typeof mouseDown != "undefined" && NOX_PV.isMouseDown) mouseDown(e);

	if(!NOX_PV.swipexDown || !NOX_PV.swipeyDown) {
		return;
	}

	let xUp, yUp;


	if(e.touches) {
		xUp = e.touches[0].clientX;
		yUp = e.touches[0].clientY;
	}
	
	else {
		xUp = e.clientX;
		yUp = e.clientY;
	}



	let xDiff = NOX_PV.swipexDown - xUp;
	let yDiff = NOX_PV.swipeyDown - yUp;

	let event, swipeDir;



	if(Math.abs(xDiff) > Math.abs(yDiff)) {
		if(xDiff > 0) 	(swipeDir = 'left')  && (event = new CustomEvent('swipeleft',  {detail: {swipe: 'left'}}));
		else 			(swipeDir = 'right') && (event = new CustomEvent('swiperight', {detail: {swipe: 'right'}}));
	}
	
	else {
		if(yDiff > 0) 	(swipeDir = 'up')    && (event = new CustomEvent('swipeup',    {detail: {swipe: 'up'}}));
		else 			(swipeDir = 'down')  && (event = new CustomEvent('swipedown',  {detail: {swipe: 'down'}}));
	}



	canvas.dispatchEvent(event);

	NOX_PV.lastSwipe = swipeDir;
	
	NOX_PV.swipexDown = null;
	NOX_PV.swipeyDown = null;
}



/**
 * Returns the vector from center to origin of the shape
 * @param {Shape} shape shape instance
 */
function getOffsetVector(shape) {
	if(!(shape instanceof Shape)) {
		console.error('Argument must be a Shape type');
		return new Vector(0, 0);
	}

	let vec = new Vector(0, 0), w, h, o;

	if(shape instanceof RectangleShape) {
		w = shape.width / 2;
		h = shape.height / 2;
		o = new Vector(0, 0);
	}

	else if(shape instanceof CircleShape) {
		w = shape.r;
		h = w;
		o = new Vector(shape.r, shape.r);
		
		vec.set(shape.r, shape.r);
	}
	
	switch(shape.origin) {
		case 'topLeft':		vec.set(-o.x,		-o.y);		break;
		case 'top': 		vec.set(w-o.x,		-o.y); 		break;
		case 'topRight': 	vec.set(w*2-o.x,	-o.y); 		break;
		case 'left': 		vec.set(-o.x,		h-o.y); 	break;
		case 'center': 		vec.set(w-o.x,		h-o.y); 	break;
		case 'right': 		vec.set(w*2-o.x,	h-o.y); 	break;
		case 'bottomLeft': 	vec.set(-o.x,		h*2-o.y); 	break;
		case 'bottom': 		vec.set(w-o.x,		h*2-o.y); 	break;
		case 'bottomRight': vec.set(w*2-o.x,	h*2-o.y);
	}

	return vec;
}






const initializeCanvasWorld = () => {
    if(window) {
        window.onload = () => {
            // the minimum between document width | height
            MIN_DOC_SIZE = min(documentWidth(), documentHeight());
            


            // if user created a setup function
            if(typeof setup != "undefined") {
                setup();
            }



            /**
             * Calculate the {top, left} offset of a DOM element
             * @param {DOMElement} elt the dom Element
             */
            function offset(elt) {
                let rect = elt.getBoundingClientRect();

                return {
                    top: rect.top + document.body.scrollTop,
                    left: rect.left + document.body.scrollLeft
                };
            }



            // if the user created the canvas on the setup function
            if(canvas) {

                // event mouse move
                canvas.addEventListener('mousemove', e => {
                    NOX_PV.oldMouseX = mouseX;
                    NOX_PV.oldMouseY = mouseY;

                    mouseX = e.clientX - offset(canvas).left;
                    mouseY = e.clientY - offset(canvas).top;

                    if(NOX_PV.isPointerLocked) {
                        mouseDirection = {x: e.movementX, y: e.movementY};
                    }

                    if(typeof mouseMove != "undefined") mouseMove(e);
                });



                // event touch start
                canvas.addEventListener('touchstart', handleTouchStart, false);
                // event touch move
                canvas.addEventListener('touchmove',  handleTouchMove, false);
                // event mouse up
                canvas.addEventListener('mouseup', e => {NOX_PV.isMouseDown = false; if(typeof mouseUp != "undefined") mouseUp(e);});
                // event click
                canvas.addEventListener('click', e => {if(typeof onClick != "undefined") onClick(e);});




                // if the swipe is enable on pc, call event handler
                if(NOX_PV.swipePCEnable) {
                    canvas.addEventListener('mousedown', handleTouchStart, false);
                    canvas.addEventListener('mousemove', handleTouchMove, false);
                }



                // if the user has created a function onSwipe() {} then call it if it's swiping
                if(typeof onSwipe != "undefined") {
                    canvas.addEventListener('swipeleft',  () => {onSwipe('left');}, false);
                    canvas.addEventListener('swiperight', () => {onSwipe('right');}, false);
                    canvas.addEventListener('swipeup',    () => {onSwipe('up');}, false);
                    canvas.addEventListener('swipedown',  () => {onSwipe('down');}, false);
                }



                // event mouse enter
                canvas.addEventListener('mouseenter', e => {if(typeof mouseEnter != "undefined") mouseEnter(e);});
                // event mouse leave
                canvas.addEventListener('mouseleave', e => {if(typeof mouseLeave != "undefined") mouseLeave(e);});
                // event wheel
                canvas.addEventListener('wheel', e => {if(typeof mouseWheel != "undefined") mouseWheel(e);});

                // right click
                canvas.oncontextmenu = e => {
                    if(typeof onContextmenu != "undefined") onContextmenu(e);
                }
            
                // double click
                canvas.ondblclick = e => {
                    if(typeof onDblClick != "undefined") onDblClick(e);
                }

            }
            



            // keyboard events

            // key pressed
            window.onkeypress = e => {
                NOX_PV.keys[e.keyCode] = true;
                if(typeof keyPress != "undefined") keyPress(e);
            };


            // key downed
            window.onkeydown = e => {
                NOX_PV.keys[e.keyCode] = true;
                if(typeof keyDown != "undefined") keyDown(e);
            };


            // key upped
            window.onkeyup = e => {
                NOX_PV.keys[e.keyCode] = false;
                if(typeof keyUp != "undefined") keyUp(e);
            };

            // when user resize window or document
            window.onresize = () => {
                let newWidth = document.documentElement.clientWidth,
                    newHeight = document.documentElement.clientHeight;

                MIN_DOC_SIZE = min(newWidth, newHeight);

                if(typeof onResize != "undefined") onResize(newWidth, newHeight);
            };

            // when user stop focus the document or the window
            window.onblur = () => {
                if(typeof onBlur != "undefined") onBlur();
            };

            // when user focus the page
            window.onfocus = () => {
                if(typeof onFocus != "undefined") onFocus();
            }

            // user goes online (internet)
            window.ononline = e => {
                if(typeof onOnline != "undefined") onOnline(e);
            }

            // user goes offline (internet)
            window.onoffline = e => {
                if(typeof onOffline != "undefined") onOffline(e);
            }


            // start running the draw loop
            drawLoop();
        };
    }
};



/**
 * initialize everything from here
 * When the page has loaded
 */
initializeCanvasWorld();












/**
 * Calculate the collision between two shapes
 * @param {Shape} shape1 first shape
 * @param {Shape} shape2 second shape
 */
function collision(shape1, shape2) {
	// must be 2 instances of shape
	if(!(shape1 instanceof Shape && shape2 instanceof Shape)) {
		console.error('Collision is only for 2 Shape types');
		return undefined;
	}

	// collision: Rectangle & Rectangle
	function colRaR(a, b) {
		let x2 = x1 + a.width, y2 = y1 + a.height,
			x4 = x3 + b.width, y4 = y3 + b.height;
		return 	x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3;
	}

	// collision: Rectangle & Circle
	function colRaC(r, c) {
		offset1 = getOffsetVector(r);
		offset2 = getOffsetVector(c);

		let cx = c.x - offset2.x, cy = c.y - offset2.y,
			rx = r.x - offset1.x, ry = r.y - offset1.y;

		let testX = (cx < rx)? rx : (cx > rx+r.width)?  rx + r.width :  cx,
			testY = (cy < ry)? ry : (cy > ry+r.height)? ry + r.height : cy;

		return sqrt(pow(cx - testX) + pow(cy - testY)) <= c.r;
	}

	// collision: Circle & Circle
	function colCaC(c1, c2) {
		let dx = x1 - x3,
			dy = y1 - y3;

		return sqrt(dx * dx + dy * dy) < c1.r + c2.r;
	}

	
	
	let offset1 = getOffsetVector(shape1),
		offset2 = getOffsetVector(shape2);

	
	
	let x1 = shape1.x - offset1.x, y1 = shape1.y  - offset1.y,
		x3 = shape2.x - offset2.x, y3 = shape2.y - offset2.y;

	
	// check instances

	// shape1 is Rectangle
	if(shape1 instanceof RectangleShape) {
		// shape2 is Rectangle
		if(shape2 instanceof RectangleShape) 	return colRaR(shape1, shape2);
		// shape2 is Circle
		else if(shape2 instanceof CircleShape) 	return colRaC(shape1, shape2);
	}
	
	// shape1 is Circle
	else if(shape1 instanceof CircleShape) {
		// shape2 is Circle
		if(shape2 instanceof CircleShape) 		return colCaC(shape1, shape2);
		// shape2 is Rectangle
		if(shape2 instanceof RectangleShape) 	return colRaC(shape2, shape1);
	}

	// default return if previous code bugs
	return false;
}




























// CLASSES


class Vector {
	/**
	 * CREATE A VECTOR 1/2/3 Dimension(s)
	 * @param {number} x x vector's coordinate
	 * @param {number} y y vector's coordinate
	 * @param {number} z z vector's coordinate
	 */
	constructor(x, y=null, z=null) {
		let dimension = 1;

		this.coords = {
			x: 0,
			y: 0,
			z: 0
		};

		// import from another vector
		if(x instanceof Vector) {
			// same dimension
			dimension = x.dimension;

			this.coords.x = x.x;
			if(dimension == 2) this.coords.y = x.y;
			if(dimension == 3) this.coords.z = x.z;
		}

		// create new vector
		else {
			// 1D
			this.coords.x = x;
			
			// 2D
			if(y !== null) {
				this.coords.y = y;
				dimension++;
			}
			// not 2D
			else {
				this.coords.y = 0;
			}

			// 3D
			if(z !== null) {
				this.coords.z = z;
				dimension++;
			}
			// not 3D
			else {
				this.coords.z = 0;
			}
		}

		// cannot modify the initial vector's dimension
		this.constants = Object.freeze({dimension: dimension});
	}

	get dimension() {return this.constants.dimension;}

	get x() {return this.coords.x;}
	get y() {return this.coords.y;}
	get z() {return this.coords.z;}

	set x(x) {this.coords.x = x;}
	
	set y(y) {
		if(this.dimension > 1) {
			this.coords.y = y;
		} else {
			console.error('Cannot modify the Y of a 1D vector');
		}
	}

	set z(z) {
		if(this.dimension > 2) {
			this.coords.z = z;
		} else {
			console.error(`Cannot modify the Y of a ${this.dimension}D vector`);
		}
	}

	/**
	 * Adapt the vector on a scale of 1
	 * @param {boolean} apply either it should apply the changes to the vector or just return it
	 */
	normalize(apply=false) {
		// does not care about vector dimension
		let norm = Math.sqrt(pow(this.x) + pow(this.y) + pow(this.z));

		let me = new Vector(this);

		if(norm != 0) {
			if(apply) {
				this.x = this.x / norm;
				// care about dimension because we divide
				if(this.dimension > 1) this.y = this.y / norm;
				if(this.dimension > 2) this.z = this.z / norm;
			}

			me.x = me.x / norm;
			// care about dimension because we divide
			if(me.dimension > 1) me.y = me.y / norm;
			if(me.dimension > 2) me.z = me.z / norm;
		}

		return me;
	}

	/**
	 * Change the vector's values
	 * @param {number} x new X
	 * @param {number} y new y
	 * @param {number} z new z
	 */
	set(x, y=0, z=0) {
		this.x = x;
		if(this.dimension > 1) this.y = y;
		if(this.dimension > 2) this.z = z;

		return this;
	}

	/**
	 * Add values to the vector
	 * @param {Vector|number} vec or x vector additionning the vector
	 * @param {number} y
	 */
	add(vec) {
		// add a vector to the vector
		if(vec instanceof Vector) {
			this.x += vec.x;
			if(this.dimension > 1 && vec.dimension > 1) this.y += vec.y;
			if(this.dimension > 2 && vec.dimension > 2) this.z += vec.z;
		}
		
		// number given
		else if(typeof vec == 'number') {
			
			if(arguments.length == 1) {
				this.x += vec;
				if(this.dimension > 1) this.y += vec;
				if(this.dimension > 2) this.z += vec;
			}
			
			else if(arguments.length == 2 && this.dimension == 2) {
				this.x += vec;
				this.y += arguments[1];
			}
			
			else if(arguments.length == 3 && this.dimension == 3) {
				this.x += vec;
				this.y += arguments[1];
				this.z += arguments[2];
			}
			
			else {
				console.error(`Wrong number of argument compared to the vector's dimension (${this.dimension})`);
			}

		} else {
			console.error('Argument type not accepted');
		}
		
		return this;
	}

	/**
	 * mutliply the vector by another vector / or x,y
	 * @param {Vector|number} vec or x vector multiplying the vector
	 * @param {number} y
	 */
	mult(vec) {
		// mult a vector to the vector
		if(vec instanceof Vector) {
			this.x *= vec.x;
			if(this.dimension > 1 && vec.dimension > 1) this.y *= vec.y;
			if(this.dimension > 2 && vec.dimension > 2) this.z *= vec.z;
		}
		
		// number given
		else if(typeof vec == 'number') {
			
			if(arguments.length == 1) {
				this.x *= vec;
				if(this.dimension > 1) this.y *= vec;
				if(this.dimension > 2) this.z *= vec;
			}
			
			else if(arguments.length == 2 && this.dimension == 2) {
				this.x *= vec;
				this.y *= arguments[1];
			}
			
			else if(arguments.length == 3 && this.dimension == 3) {
				this.x *= vec;
				this.y *= arguments[1];
				this.z *= arguments[2];
			}
			
			else {
				console.error(`Wrong number of argument compared to the vector's dimension (${this.dimension})`);
			}
			
		} else {
			console.error('Argument type not accepted');
		}

		return this;
	}

	/**
	 * Divide the vector by another vector / or x,y
	 * @param {Vector|number} vec or x vector dividing the vector
	 * @param {number} y
	 */
	div(vec) {
		// divide a vector to the vector
		if(vec instanceof Vector) {
			this.x /= vec.x;
			if(this.dimension > 1 && vec.dimension > 1) this.y /= vec.y;
			if(this.dimension > 2 && vec.dimension > 2) this.z /= vec.z;
		}
		
		// number given
		else if(typeof vec == 'number') {
			
			if(arguments.length == 1) {
				this.x /= vec;
				if(this.dimension > 1) this.y /= vec;
				if(this.dimension > 2) this.z /= vec;
			}
			
			else if(arguments.length == 2 && this.dimension == 2) {
				this.x /= vec;
				this.y /= arguments[1];
			}
			
			else if(arguments.length == 3 && this.dimension == 3) {
				this.x /= vec;
				this.y /= arguments[1];
				this.z /= arguments[2];
			}
			
			else {
				console.error(`Wrong number of argument compared to the vector's dimension (${this.dimension})`);
			}
			
		} else {
			console.error('Argument type not accepted');
		}

		return this;
	}

	/**
	 * invert vector's x,y,z
	 * @param {boolean} antiClockwise either clockwise or anti-clockwise (only for 3D)
	 */
	invert(antiClockwise=false) {
		// not 1D, else we just have to do x = x
		if(this.dimension > 1) {

			// 2D
			if(this.dimension == 2) {
				[this.x, this.y] = [this.y, this.x];
			}
			
			// 3D
			else {
				if(antiClockwise) {
					[this.x, this.y, this.z] = [this.y, this.z, this.x];
				} else {
					[this.x, this.y, this.z] = [this.z, this.x, this.y];
				}
			}
		}

		return this;
	}

	/**
	 * Returns the vector magnitude
	 * @returns {number}
	 */
	get mag() {
		// for 1/2D vectors, y = z = 0, so it will not change anything
		return Math.hypot(this.x, this.y, this.z);
	}

	/**
	 * Change vector's magnitude
	 * @param {number} newMag new magnitude
	 */
	setMag(newMag) {
		this.x = this.x * newMag / this.mag;
		if(this.dimension > 1) this.y = this.y * newMag / this.mag;
		if(this.dimension > 2) this.z = this.z * newMag / this.mag;

		return this;
	}

	/**
	 * Returns the vector's object as a string
	 * @returns {String}
	 */
	toString() {
		return `{x: ${this.x}${(this.dimension > 1)? `, y: ${this.y}` : ''}${(this.dimension > 2)? `, z: ${this.z}` : ''}}`;
	}

	/**
	 * Returns an array [x, y, z]
	 * @returns {Array}
	 */
	array() {
		let arr = [this.x];
		if(this.dimension > 1) arr.push(this.y);
		if(this.dimension > 2) arr.push(this.z);

		return arr;
	}

	/**
	 * Draw the vector on the canvas (1 & 2 dimensions only for now)
	 * @param {number} x vector's position on the canvas
	 * @param {number} y vector's position on the canvas
	 */
	bow(x, y, style={}) {
		// not implemented for the 3rd dimension yet
		if(this.dimension == 3) return;

		// arrow's style
		if(style.strokeWeight) strokeWeight(style.strokeWeight);
		else strokeWeight(1);

		if(style.stroke) stroke(style.stroke);
		else stroke('#fff');
		

		// calculate the vector's rotation from the horizontal
		let rotation = degree(vectorToAngle(this));
		// know if it's pointing to the top or to the bottom
		if(this.y < 0) rotation *= -1;
		
		push();
			// trunk
			translate(x, y);
			line(0, 0, this.x, this.y);
			linecap('round');

			// spike
			push();
				translate(this.x, this.y);
			
				push();
					// left
					rotate(rotation + 25);
					line(0, 0, -min(this.mag/2.5, 10), 0);

					// right
					rotate(-50);
					line(0, 0, -min(this.mag/2.5, 10), 0);
				pop();
			pop();

		pop();
	}
}







class Shape {
	constructor(x, y, fill='transparent', stroke='transparent', strokeWeight=1) {
		this.pos = new Vector(x, y);

		this.style = {
			background: fill,
			stroke: stroke,
			strokeWeight: strokeWeight
		};

		this.drawOrigin 	= false;
		this.speed 			= 0;
		this.acceleration 	= 0;
		this.isRunning 		= false;
		this.origin 		= 'topLeft';
	}


	set fill(color) 		{this.style.background = color;}
	set stroke(color) 		{this.style.stroke = color;}
	set strokeWeight(int) 	{this.style.strokeWeight = int;}
	set run(bool) 			{this.running = typeof bool == "boolean"?  bool : false;}

	get background() 		{return this.style.background;}
	get stroke() 			{return this.style.stroke;}
	get strokeWeight() 		{return this.style.strokeWeight;}
	get x() 				{return this.pos.x;}
	get y() 				{return this.pos.y;}
	get running() 			{return this.isRunning;}



	showOrigin(bool) {this.drawOrigin = typeof bool == "boolean"?  bool : false;}

	setOrigin(newOrigin) {
		this.origin = originArr.includes(newOrigin)? newOrigin : 'topLeft';
	}

	setPosition(x, y=null) {
		if(!y && x instanceof Vector) {
			this.pos.x = x.x;
			this.pos.y = x.y;
		}
		
		else {
			this.pos.x = x;
			this.pos.y = y;
		}
	}

	move(x, y) {
		let speed = this.speed + (this.running? this.acceleration : 0);

		if(!y && x instanceof Vector) {
			this.pos.x += x.x * speed;
			this.pos.y += x.y * speed;
		}
		
		else {
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
		// top
		line(this.x-offset.x-this.strokeWeight/2, this.y-offset.y, this.x-offset.x+this.width+this.strokeWeight/2, this.y-offset.y);
		// bottom
		line(this.x-offset.x-this.strokeWeight/2, this.y-offset.y+this.height, this.x-offset.x+this.width+this.strokeWeight/2, this.y-offset.y+this.height);
		// left
		line(this.x-offset.x, this.y-offset.y, this.x-offset.x, this.y-offset.y+this.height);
		// right
		line(this.x-offset.x+this.width, this.y-offset.y, this.x-offset.x+this.width, this.y-offset.y+this.height);

		// put a little green circle at the shape's origin
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
		this.radius = r - strokeWeight;
		this.origin = "center";
	}

	get r() {return this.radius + this.strokeWeight;}
	set r(newRadius) {this.radius = newRadius - this.strokeWeight;}

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
		this.baseTilt = radian(baseTiltinDegree);
		this.height = triangleHeight;
		this.heightPos = heightPosition;
		this.origin = "bottomLeft";

		this.vertex = {
			A: new Vector(0, 0),
			B: new Vector(0, 0),
			C: new Vector(0, 0)
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

		this.vertex.B.set(this.A.x + this.baseLength*vec.x, this.A.y + this.baseLength*vec.y);

		let d = dist(this.A, this.B)/2;

		let k = new Vector(this.A.x + d*vec.x, this.A.y + d*vec.y);

		let angle = angleToVector(radian(degree(this.baseTilt) - 90));

		this.vertex.C.set(k.x + this.height*angle.x, k.y + this.height*angle.y, 5);
	}

	hover() {
		let triArea = 	abs((this.B.x-this.A.x)	* (this.C.y-this.A.y) 	- (this.C.x-this.A.x)	* (this.B.y-this.A.y));
		let area1 = 	abs((this.A.x-mouseX)	* (this.B.y-mouseY) 	- (this.B.x-mouseX)		* (this.A.y-mouseY));
		let area2 = 	abs((this.B.x-mouseX)	* (this.C.y-mouseY) 	- (this.C.x-mouseX)		* (this.B.y-mouseY));
		let area3 = 	abs((this.C.x-mouseX)	* (this.A.y-mouseY) 	- (this.A.x-mouseX)		* (this.C.y-mouseY));

		return area1 + area2 + area3 == triArea;
	}
}








class Triangle extends TriangleShape {
	constructor(x1, y1, x2, y2, x3, y3, fill='black', stroke='black', strokeWeight=1) {
		let A = new Vector(x1, y1),
			B = new Vector(x2, y2),
			C = new Vector(x3, y3);

		let baseTilt = degree(Math.atan2(B.y-A.y, B.x-A.x)),
			base = dist(A, B);

		let atv = angleToVector(radian(baseTilt));

		let k = new Vector(A.x + base/2 * atv.x, A.y + base/2 * atv.y);

		let tHeight = dist(k,C), heightPosition = C.x-A.x;

		super(A.x, A.y, base, baseTilt, tHeight, heightPosition, fill, stroke, strokeWeight);
	}
}