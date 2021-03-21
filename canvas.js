/**
 * @copyright   Copyright (C) 2019 - 2020 Dorian Thivolle All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE.txt
 * @author		Dorian Thivolle
 * @name		canvas
 * @package		NoxFly/canvas
 * @see			https://github.com/NoxFly/canvas
 * @since		30 Dec 2019
 * @version		{1.4.1}
*/



/**
 * @vars CANVAS PUBLIC VARS
 */
let ctx = null, canvas = null, width = 0, height = 0, realWidth = 0, realHeight = 0;
let mouseX = 0, mouseY = 0;
let fps = 60;
pixels = undefined;

/**
 * Returns the current document's width in pixel
 * @return {number} document's width
 */
const documentWidth = () => document.documentElement.clientWidth;

/**
 * Returns the current document's height in pixel
 * @return {number} document's height
 */
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
const NOX_PV = {
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

	loop: true,

	// date.now() | fps and draw interval
	now: 0, then: Date.now(), interval: 1000/fps, delta: 0, counter: 0, time_el: 0,

	// Treat color's entries
	colorTreatment: (...oColor) => {
		const n = oColor.length;

		if(n > 0 && (oColor[0] instanceof CanvasGradient || oColor[0] instanceof CanvasPattern)) return oColor[0];


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

		// default returned color if bad entry
		return '#000';
	},

	perlin: {
		lod: 10,
		unit: 1.0,
		gradient: [],
		seed: [],
		generateSeed: () => {
			return Array(255).fill(0).map((i, j) => j).sort(() => Math.random() - 0.5);
		},
		get: (x, y, lod=NOX_PV.perlin.lod, seed=NOX_PV.perlin.seed) => {
			// adapt the resolution
			x /= lod;
			y /= lod;

			// get table integer indexes
			const [x0, y0] = [floor(x), floor(y)];

			// get decimal part (dx,dy) & create mask (ii, jj)
			const [dx, dy, ii, jj] = [x-x0, y-y0, x0&255, y0&255];

			// recover vectors
			let stuv = [];
			for(let i=0; i < 4; i++) {
				try {
					const v = seed[(ii + i%2 + seed[jj + floor(i/2)]) % 255] % NOX_PV.perlin.gradient.length;
					stuv[i] = NOX_PV.perlin.gradient[v][0]*(dx - i%2) + NOX_PV.perlin.gradient[v][1]*(dy - floor(i/2));
				} catch(e) {
					stuv[i] = 0;
				}
			}

			// smoothing
			const [Cx, Cy] = [3*dx*dx - 2*dx*dx*dx, 3*dy*dy-2*dy*dy*dy];
			const [Li1, Li2] = [stuv[0] + Cx * (stuv[1] - stuv[0]), stuv[2] + Cx * (stuv[3] - stuv[2])];
			
			return map(Li1 + Cy * (Li2 - Li1), -NOX_PV.perlin.unit, NOX_PV.perlin.unit, 0, 1);
		}
	}
};

NOX_PV.perlin.gradient = [
	[NOX_PV.perlin.unit,  NOX_PV.perlin.unit],
	[-NOX_PV.perlin.unit, NOX_PV.perlin.unit],
	[NOX_PV.perlin.unit, -NOX_PV.perlin.unit],
	[-NOX_PV.perlin.unit,-NOX_PV.perlin.unit]
];



/**
 * Begins a new sub-path at the point specified by the given (x, y) coordinates.
 * @param {number} x The x-axis (horizontal) coordinate of the point.
 * @param {number} y The y-axis (vertical) coordinate of the point.
 * @example
 * moveTo(0, 0)
 */
const moveTo = (x, y) => ctx.moveTo(x, y);

/**
 * Adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.
 * @param {number} x The x-axis coordinate of the line's end point.
 * @param {number} y The y-axis coordinate of the line's end point.
 * @example
 * lineTo(10, 50)
 */
const lineTo = (x, y) => ctx.lineTo(x, y);

/**
 * Adds a circular arc to the current sub-path, using the given control points and radius.
 * The arc is automatically connected to the path's latest point with a straight line, if necessary for the specified parameters.
 * @param {number} x1 The x-axis coordinate of the first control point.
 * @param {number} y1 The y-axis coordinate of the first control point.
 * @param {number} x2 The x-axis coordinate of the second control point.
 * @param {number} y2 The y-axis coordinate of the second control point.
 * @param {number} r The arc's radius. Must be non-negative.
 * @example
 * arcTo(200, 130, 50, 20, 40)
 */
const arcTo = (x1, y1, x2, y2, r) => ctx.arcTo(x1, y1, x2, y2, r);



/**
 * Adds a line from p1(x1, y1) to p2(x2, y2) to the current sub-path.
 * @param {number} x1 The x-axis coordinate of the first point.
 * @param {number} y1 The y-axis coordinate of the first point.
 * @param {number} x2 The x-axis coordinate of the second point.
 * @param {number} y2 The y-axis coordinate of the second point.
 * @example
 * line(10, 40, 100, 150)
 */
const line = (x1, y1, x2, y2) => {
	beginPath();
		moveTo(x1, y1);
		lineTo(x2, y2);
		
		if(NOX_PV.bStroke) ctx.stroke();
	closePath();
};





/**
 * Adds a polyline with given arguments to the current sub-path.
 * It goes by pairs (x, y), so an even number of arguments.
 * @argument {Array<number>} values Array of point's positions. Need to be even number
 * @example
 * polyline(0, 0, 10, 10, 100, 50)
 */
const polyline = (...values) => {
	// got an odd number of argument
	if(values.length % 2 != 0) {
		return console.error('The function polyline must take an even number of values');
	}

	beginPath();
		if(values.length > 0) {
			moveTo(values[0], values[1]);
		}

		for(let i=2; i < values.length; i+=2) {
			let x = values[i],
				y = values[i+1];
			
			lineTo(x,y);
		}

		if(NOX_PV.bStroke) ctx.stroke();
		if(NOX_PV.bFill) ctx.fill();
	closePath();
};





/**
 * Adds a circular arc to the current sub-path.
 * @param {number} x The horizontal coordinate of the arc's center.
 * @param {number} y The vertical coordinate of the arc's center.
 * @param {number} r The arc's radius. Must be positive.
 * @param {number} start The angle at which the arc starts in radians, measured from the positive x-axis.
 * @param {number} end The angle at which the arc ends in radians, measured from the positive x-axis.
 * @param {boolean} antiClockwise An optional Boolean. If true, draws the arc counter-clockwise between the start and end angles. The default is false (clockwise).
 * @example
 * arc(100, 70, 20)
 */
const arc = (x, y, r, start, end, antiClockwise=false) => {
	beginPath();
		ctx.arc(x, y, r, start, end, antiClockwise);
		if(NOX_PV.bStroke) ctx.stroke();
		if(NOX_PV.bFill) ctx.fill();
	closePath();
};





/**
 * Adds a circle to the current sub-path
 * @param {number} x circle's X
 * @param {number} y circle's y
 * @param {number} r circle's radius. Must be positive.
 * @example
 * circle(70, 70, 15)
 */
const circle = (x, y, r) => {
	arc(x, y, r, 0, 2*PI);
};



/**
 * Draws a rectangle that is filled according to the current fillStyle.
 * This method draws directly to the canvas without modifying the current path, so any subsequent fill() or stroke() calls will have no effect on it.
 * @param {number} x rectangle's X (top-left corner)
 * @param {number} y rectangle's Y (top-left corner)
 * @param {number} w rectangle's width. Negative values will draw rectangle to the left.
 * @param {number} h rectangle's height. Negative values will draw rectangle to the up.
 * @example
 * fillRect(0, 0, 100, 150)
 */
const fillRect = (x, y, w, h) => {
	ctx.fillRect(x, y, w, h);
};





/**
 * Draws a rectangle that is stroked (outlined) according to the current strokeStyle and other context settings.
 * This method draws directly to the canvas without modifying the current path, so any subsequent fill() or stroke() calls will have no effect on it.
 * @param {number} x rectangle's X (top-left corner)
 * @param {number} y rectangle's Y (top-left corner)
 * @param {number} w rectangle's width. Negative values will draw rectangle to the left.
 * @param {number} h rectangle's height. Negative values will draw rectangle to the up.
 * @example
 * strokeRect(0, 0, 100, 150)
 */
const strokeRect = (x, y, w, h) => {
	ctx.strokeRect(x, y, w, h);
};




/**
 * Adds a rectangle to the current path.
 * @param {number} x rectangle's X (top-left corner)
 * @param {number} y rectangle's Y (top-left corner)
 * @param {number} w rectangle's Width
 * @param {number} h rectangle's height
 * @example
 * rect(0, 0, 100, 150)
 */
const rect = (x, y, w, h) => {
	ctx.rect(x, y, w, h);
	if(NOX_PV.bFill) ctx.fill();
	if(NOX_PV.bStroke) ctx.stroke();
};



/**
 * Draws a rounded rectangle
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} w 
 * @param {Number} h 
 * @param  {...Number} radius 
 */
const roundRect = (x=0, y=0, w=0, h=0, radius=0, radiusTR, radiusBR, radiusBL) => {
    if(radiusTR == undefined) radiusTR = radius;
    if(radiusBR == undefined) radiusBR = radius;
    if(radiusBL == undefined) radiusBL = radius;
    
    radius   = min(max(0, radius),   50);
    radiusTR = min(max(0, radiusTR), 50);
    radiusBR = min(max(0, radiusBR), 50);
    radiusBL = min(max(0, radiusBL), 50);

    const x1 = x + radius,
          y1 = y;

    const x2 = x + w - radiusTR,
          y2 = y;

    const x3 = x + w,
          y3 = y + h - radiusBR;

    const x4 = x + radiusBL,
          y4 = y + h;

    const x5 = x,
          y5 = y + radius;

    beginPath();
        moveTo(x1, y1);
        lineTo(x2, y2);
        arcTo(x2 + radiusTR, y2, x2 + radiusTR, y2 + radiusTR, radiusTR);
        lineTo(x3, y3);
        arcTo(x3, y3 + radiusBR, x3 - radiusBR, y3 + radiusBR, radiusBR);
        lineTo(x4, y4);
        arcTo(x4 - radiusBL, y4, x, y4 - radiusBL, radiusBL);
        lineTo(x5, y5);
        arcTo(x5, y5 - radius, x1, y1, radius);

        if(NOX_PV.bStroke) ctx.stroke();
        if(NOX_PV.bFill) ctx.fill();
    closePath();
};



/**
 * Create a custom path with assembly of shapes.
 * It's the same use as the <path> tag for SVG.
 * It adds the path to the current one.
 * Instructions : M, L, H, V, A, Z
 * @param {string} p path string that will be converted to d path code
 * @example
 * p("M0 0 L 10 10 A 20 20 H 50 V 50 l 20 20 Z")
 */
const path = p => {
	// instruction: letter (MLHVAZ)
	// argument: numbers

	// remove spaces at the start and the end of the string
	p = p.trim();
  
	// a path must start with a moveTo instruction
	if(!p.startsWith('M')) {
		return;
	}
	
	// split each instructions / arguments
	p = p.split(' ');

	// default starting mode is moveTo to positionate the cursor
	// remove a loop in the for loop
	let mode = 'M';

	// availible modes with number of arguments that is needed
	const modes = {
		M: {
			n: 2,
			f: (x, y) => moveTo(x, y)
		},

		L: {
			n: 2,
			f: (x, y) => lineTo(x, y)
		},

		H: {
			n: 1,
			f: (x, y) => lineTo(x, y)
		},

		V: {
			n: 1,
			f: (y, x) => lineTo(x, y)
		},

		A: {
			n: 6,
			f: (x, y, r, start, end, antiClockwise) => ctx.arc(x, y, r, radian(start), radian(end), antiClockwise===1)
		},

		Z: {
			n: 0,
			f: () => lineTo(parseFloat(p[1]), parseFloat(p[2]))
		}
	};


	// regex to verify if each point is okay
	const reg = new RegExp(`^[${Object.keys(modes).join('')}]|(\-?\d+(\.\d+)?)$`, 'i');
	
	// if a point isn't well written, then stop
	if(p.filter(point => reg.test(point)).length == 0) {
		return;
	}

	// doesn't need to try to draw something: need at least an instruction M first and 2 parameters x,y
	if(p.length < 3) {
		return;
	}

	// code translated path
	let d = [];
	// number of points - 1: last index of the array of points
	const lastIdx = p.length - 1;


	// read arguments - normally starts with x,y of the M instruction
	for(let i=0; i < p.length; i++) {
		let point = p[i];

		// is a letter - new instruction
		if(/[a-z]/i.test(point)) {
			// lowercase - relative
			// uppercase - absolute
			// push pile of instructions (only 2 saved)
			mode = point;

			// if the instruction is Z
			if(mode == 'Z') {
				// and if it's the last mode
				if(i == lastIdx) {
					// then close the path
					d.push("Z");
				} else {
					// cannot use the Z somewhere else than the last point
					return;
				}
			}
			
			// lowercase Z isn't recognized
			if(['z'].includes(mode)) {
				return;
			}

			const nArg = modes[mode.toUpperCase()].n;

			// depending on the current instruction, there need to have to right number of argument following this instruction
			if(lastIdx-nArg < i) {
				return;
			}

			//
			let lastPos = {x: 0, y: 0};

			// get the last cursor position
			if(d.length > 0) {
				let prev = d[d.length-1];

				let hv = ['H', 'V'].indexOf(prev[0]);

				if(hv !== -1) {
					lastPos.x = prev[1 + hv]; // x of the last point
					lastPos.y = prev[2 - hv]; // y of the last point
				}
				
				else {
					let k = 1;

					lastPos.x = prev[k]; // x of the last point
					lastPos.y = prev[k+1]; // y of the last point
				}
			}


			// array that is refresh every instruction + argument given
			let arr = [mode.toUpperCase()];

			// if it's H or V instruction, keep the last X or Y
			let hv = ['H', 'V'].indexOf(arr[0]);


			// add each argument that are following the instruction
			for(let j=0; j < nArg; j++) {
				i++;

				let n = parseFloat(p[i]);

				// it must be a number
				if(isNaN(n)) {
					return;
				}
				
				// push the treated argument
				arr.push(n);
			}


			// onnly for H or V
			if(hv !== -1) {
				arr.push(lastPos[Object.keys(lastPos)[1-hv]]);
			}

			if(arr[0] == 'A') {
				arr[1] -= arr[3];
			}

			// lowercase: relative to last point - only for MLHVA
			if(/[mlhva]/.test(mode)) {
				if(mode === 'v') {
					arr[1] += lastPos.y;
				}

				else if(mode === 'h') {
					arr[1] += lastPos.x;
				}

				else {
					arr[1] += lastPos.x;
					arr[2] += lastPos.y;
				}
			}

			
			// add the instruction and its arguments to the translated path
			d.push(arr);


			// draw the arc isn't enough, we have to move the cursor to the end of the arc too
			if(arr[0] == 'A') {
				// arr = ['A', x, y, r, start, end, acw]
				const angle = radian(arr[5]);

				let x = arr[1] + cos(angle) * arr[3]
					y = arr[2] + sin(angle) * arr[3];

				d.push(['M', x, y]);
			}
		}

	}


	// start draw depending on what's written
	beginPath();
		d.forEach(step => {
			// surely Z()
			if(typeof step === 'string') {
				modes[step].f();
			}

			// else it's MLHVA with position arguments
			else {
				modes[step[0]].f(...step.slice(1));
			}
		});

		if(NOX_PV.bFill) ctx.fill();
		if(NOX_PV.bStroke) ctx.stroke();
	closePath();
	
}




/**
 * Adds a text to the current sub-path
 * @param {String} txt text to be displayed
 * @param {number} x text's X position
 * @param {number} y text's Y position
 * @example
 * text("Hello world", 20, 20)
 */
const text = (txt, x=0, y=0) => {
	// multiple lines
	if(/\n/.test(txt)) {
		const size = sFontSize.replace(/(\d+)(\w+)?/, '$1');
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
 * Text settings - sets the size and the font-family
 * @param {number} size font size
 * @param {String} font font name
 * @example
 * setFont(15, "Monospace")
 */
const setFont = (size, font) => {
	ctx.font = `${size}px ${font}`;
	sFontSize = `${size}px`;
	sFontFamily = font;
};



/**
 * Sets the font size of the text
 * @param {number} size font size
 * @example
 * fontSize(20)
 */
const fontSize = size => {
	ctx.font = `${size}px ${sFontFamily}`;
	sFontSize = `${size}px`
};



/**
 * Sets the font-family of the text
 * @param {String} font font-family
 * @example
 * fontFamily("Monospace")
 */
const fontFamily = font => {
	ctx.font = `${sFontSize} ${font}`;
	sFontFamily = font
};



/**
 * Change the text's alignement
 * @param {String} alignment text's alignment
 * @example
 * alignText("center")
 */
const alignText = alignment => {
	ctx.textAlign = (['left', 'right', 'center', 'start', 'end'].indexOf(alignment) > -1)? alignment : 'left';
};


/**
 * Adds a cubic Bézier curve to the current sub-path.
 * It requires three points: the first two are control points and the third one is the end point.
 * The starting point is the latest point in the current path, which can be changed using moveTo() before creating the Bézier curve.
 * @param {number} cp1x The x-axis coordinate of the first control point.
 * @param {number} cp1y The y-axis coordinate of the first control point.
 * @param {number} cp2x The x-axis coordinate of the second control point.
 * @param {number} cp2y The y-axis coordinate of the second control point.
 * @param {number} x The x-axis coordinate of the end point.
 * @param {number} y The y-axis coordinate of the end point.
 * @example
 * moveTo(50, 20)
 * bezierCurveTo(230, 30, 150, 80, 250, 100)
 */
const bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
	ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
};

/**
 * Adds a quadratic Bézier curve to the current sub-path.
 * It requires two points: the first one is a control point and the second one is the end point.
 * The starting point is the latest point in the current path, which can be changed using moveTo() before creating the quadratic Bézier curve.
 * @param {number} cpx The x-axis coordinate of the control point.
 * @param {number} cpy The y-axis coordinate of the control point.
 * @param {number} x The x-axis coordinate of the end point.
 * @param {number} y The y-axis coordinate of the end point.
 * @example
 * moveTo(50, 20)
 * quadraticCurveTo(230, 30, 50, 100)
 */
const quadraticCurveTo = (cpx, cpy, x, y) => {
	ctx.quadraticCurveTo(cpx, cpy, x, y);
};







/**
 * Saves the entire state of the canvas by pushing the current state onto a stack.
 * The drawing state that gets saved onto a stack consists of:
 * - The current transformation matrix.
 * - The current clipping region.
 * - The current dash list.
 * - The current values of the following attributes:
 * strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset,
 * shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation, font, textAlign,
 * textBaseline, direction, imageSmoothingEnabled.
 * @example
 * push()
 */
const push = () => ctx.save();

/**
 * restores the most recently saved canvas state by popping the top entry in the drawing state stack.
 * If there is no saved state, this method does nothing.
 * @example
 * pop()
 */
const pop = () => ctx.restore();

/**
 * Adds a translation transformation to the current matrix.
 * @param {number} x Distance to move in the horizontal direction. Positive values are to the right, and negative to the left.
 * @param {number} y Distance to move in the vertical direction. Positive values are down, and negative are up.
 * @example
 * translate(100, 200)
 */
const translate = (x, y) => ctx.translate(x,y);

/**
 * Adds a rotation to the transformation matrix.
 * @param {number} degree The rotation angle, clockwise in radians. You can use radian(deg) to calculate a radian from a degree.
 * @example
 * rotate(radian(45)) // rotates 45 degrees
 */
const rotate = degree => ctx.rotate(radian(degree));

/**
 * turns the current or given path into the current clipping region.
 * The previous clipping region, if any, is intersected with the current or given path to create the new clipping region.
 * @param  {Path2D} path A Path2D path to use as the clipping region.
 * @param {String} fillRule The algorithm by which to determine if a point is inside or outside the clipping region. Possible values:
 * - "nonzero": The non-zero winding rule. Default rule.
 * - "evenodd": The even-odd winding rule.
 * @example
 * // Create circular clipping region
 * beginPath();
 * arc(100, 75, 50, 0, PI * 2);
 * clip();

 * // Draw stuff that gets clipped
 * fill('blue');
 * fillRect(0, 0, width, height);
 * fill('orange');
 * fillRect(0, 0, 100, 100);
 */
const clip = (...args) => ctx.clip(...args);

/**
 * Adds a scaling transformation to the canvas units horizontally and/or vertically.
 * @param {*} x Scaling factor in the horizontal direction. A negative value flips pixels across the vertical axis. A value of 1 results in no horizontal scaling.
 * @param {*} y Scaling factor in the vertical direction. A negative value flips pixels across the horizontal axis. A value of 1 results in no vertical scaling.
 */
const scale = (x, y) => ctx.scale(x, y);



/**
 * Says to not fill next hapes
 */
const noFill = () => {
	NOX_PV.bFill   = false;
};

/**
 * Says to not stroke next shapes
 */
const noStroke = () => {
	NOX_PV.bStroke = false;
};


/**
 * Changes the canvas color
 * @param  {...any} color background color
 */
const background = (...color) => {
	canvas.style.backgroundColor = NOX_PV.colorTreatment(...color);
};

/**
 * Sets the stroke color for next shapes to draw
 * @param  {...any} color Stroke color
 */
const stroke = (...color) => {
	ctx.strokeStyle = NOX_PV.colorTreatment(...color);
	NOX_PV.bStroke = true;
};

/**
 * Sets the strokeweight for next shapes to draw
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
 * Creates a gradient along the line connecting two given coordinates.
 * @param {number} x1 The x-axis coordinate of the start point.
 * @param {number} y1 The y-axis coordinate of the start point.
 * @param {number} x2 The x-axis coordinate of the end point.
 * @param {number} y2 The y-axis coordinate of the end point.
 * @return {CanvasGradient} A linear CanvasGradient initialized with the specified line.
 */
const createLinearGradient = (x1, y1, x2, y2) => ctx.createLinearGradient(x1, y1, x2, y2);

/**
 * Creates a gradient along the line connecting two given coordinates.
 * Fills the gradient with given values. It's to merge createLinearGradient() and gradient.addColorStop() in one function.
 * @param {number} x1 The x-axis coordinate of the start point.
 * @param {number} y1 The y-axis coordinate of the start point.
 * @param {number} x2 The x-axis coordinate of the end point.
 * @param {number} y2 The y-axis coordinate of the end point.
 * @param  {(offset:number, color:String)} params The color parameters. It has to be as pair : offset (between 0 & 1), and color
 * @return {CanvasGradient} A linear CanvasGradient initialized with the specified line and colors.
 * @example
 * makeLinearGradient(0, 0, width, height, 0, "black", 1, "white")
 */
const makeLinearGradient  = (x1, y1, x2, y2, ...params) => {
	if(params.length % 2 !== 0) {
		return console.error("you have to tell params by pair (offset, color). Odd number of arguments given.");
	}

	const grad = createLinearGradient(x1, y1, x2, y2);

	for(let i=0; i < params.length; i+=2) {
		const offset = params[i];
		const color = NOX_PV.colorTreatment(params[i+1]);

		grad.addColorStop(offset, color);
	}

	return grad;
};

/**
 * Clears the canvas from x,y to x+w;y+h
 * Erases the pixels in a rectangular area by setting them to transparent black.
 * @param {number} x The x-axis coordinate of the rectangle's starting point.
 * @param {number} y The y-axis coordinate of the rectangle's starting point.
 * @param {number} w The rectangle's width. Positive values are to the right, and negative to the left.
 * @param {number} h The rectangle's height. Positive values are down, and negative are up.
 * @example
 * clearRect(0, 0, width, height)
 */
const clearRect = (x, y, w, h) => ctx.clearRect(x, y, x+w, y+h);


/**
 * starts a new path by emptying the list of sub-paths.
 * Call this method when you want to create a new path.
 * @example
 * beginPath()
 */
const beginPath = () => ctx.beginPath();

/**
 * attempts to add a straight line from the current point to the start of the current sub-path.
 * If the shape has already been closed or has only one point, this function does nothing.
 * @example
 * closePath()
 */
const closePath = () => ctx.closePath();

/**
 * Draws a focus ring around the current or given path, if the specified element is focused.
 * @param {Element|Path2D} elementOrPath2D A Path2D path to use.
 * @param {Element} element The element to check whether it is focused or not.
 * @example
 * drawFocusIfNeeded(button1)
 */
const drawFocusIfNeeded = (elementOrPath2D, element=null) => {
	if(element === null && !(elementOrPath2D instanceof Path2D)) {
		ctx.drawFocusIfNeeded(elementOrPath2D);
	} else {
		ctx.drawFocusIfNeeded(elementOrPath2D, element);
	}
};


/**
 * Sets line dashes to current path
 * @param {Array} array line dash to set to the current path
 * @example
 * setLineDash([5, 15])
 */
const setLineDash = array => {
	if(!Array.isArray(array)) {
		return console.error("Array type expected. Got " + typeof array);
	}

	ctx.setLineDash(array);
}

/**
 * Returns the ctx.getLineDash() function's value
 * @return {Array} An Array of numbers that specify distances to alternately draw a line and a gap (in coordinate space units).
 * If the number, when setting the elements, is odd, the elements of the array get copied and concatenated.
 * For example, setting the line dash to [5, 15, 25] will result in getting back [5, 15, 25, 5, 15, 25].
 * console.info(getLineDash())
 */
const getLineDash = () => ctx.getLineDash();

/**
 * Specifies the alpha (transparency) value that is applied to shapes and images before they are drawn onto the canvas.
 * @param {number} globalAlpha A number between 0.0 (fully transparent) and 1.0 (fully opaque), inclusive. The default value is 1.0.
 * Values outside that range, including Infinity and NaN, will not be set, and globalAlpha will retain its previous value.
 * @example
 * globalAlpha(0.5)
 */
const globalAlpha = globalAlpha => {
	ctx.globalAlpha = globalAlpha;
};

/**
 * Sets the type of compositing operation to apply when drawing new shapes.
 * @param {String} type a String identifying which of the compositing or blending mode operations to use.
 * Possible types:
 * "source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out",
 * "destination-atop", "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge",
 * "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation for more details
 * @example
 * globalCompositeOperation("soft-light")
 */
const globalCompositeOperation = type => {
	ctx.globalCompositeOperation = type;
}

/**
 * Sets the image smoothing quality
 * @param {String} quality 'low', 'medium', 'high'
 * @example
 * setSmoothingQuality('low')
 */
const setSmoothingQuality = quality => {
	if(!['low', 'medium', 'high'].includes(quality)) return;
	ctx.imageSmoothingQuality = quality;
};


/**
 * Reports whether or not the specified point is contained in the current path.
 * @param {number|Path2D} x either x point coordinate or path2D. unaffected by the current transformation of the context. If path is unspecified, current path is used.
 * @param {number} y either x or y point coordinate, following the 1st argument's type. unaffected by the current transformation of the context.
 * @param {String} fillRule The algorithm by which to determine if a point is inside or outside the path. "nonzero" (default) or "evenodd"
 * @return {Boolean} A Boolean, which is true if the specified point is contained in the current or specified path, otherwise false.
 * @example
 * if(isPointInPath(30, 20)) {
 * 	// ... do stuff
 * }
 */
const isPointInPath = function(x, y, fillRule=null) {
	return ctx.isPointInPath(...arguments);
};

/**
 * Reports whether or not the specified point is inside the area contained by the stroking of a path.
 * @param {number|Path2D} x The x-axis coordinate of the point to check. (or Path2D)
 * @param {number} y The y-axis coordinate of the point to check.
 * @return {Boolean} A Boolean, which is true if the point is inside the area contained by the stroking of a path, otherwise false.
 * @example
 * if(isPointInStroke(30, 40)) {
 * 	// ... do stuff
 * }
 */
const isPointInStroke = function(x, y) {
	return ctx.isPointInStroke(...arguments);
};

/**
 * Retrieves the current transformation matrix being applied to the context.
 * @return {DOMMatrix} A DOMMatrix object.
 * @example
 * const transformMatrix = getTransform()
 */
const getTransform = () => ctx.getTransform();

/**
 * Sets the line dash offset.
 * @param {number} value A float specifying the amount of the line dash offset. The default value is 0.0.
 * @example
 * lineDashOffset(1)
 */
const lineDashOffset = (value=0.0) => {
	ctx.lineDashOffset = value;
}

/**
 * Determines the shape used to join two line segments where they meet.
 * This property has no effect wherever two connected segments have the same direction, because no joining area will be added in this case.
 * Degenerate segments with a length of zero (i.e., with all endpoints and control points at the exact same position) are also ignored.
 * @param {String} type "round", "bevel" or "miter"
 * @example
 * lineJoin('round')
 */
const lineJoin = type => {
	ctx.lineJoin = type;
};

/**
 * Returns a TextMetrics object that contains information about the measured text.
 * @param {String} text text string to measure
 * @return {TextMetrics} A TextMetrics object.
 * @example
 * const textLength = measureText("Hello world")
 */
const measureText = text => {
	return ctx.measureText(text);
}

/**
 * Resets the current transform to the identity matrix.
 * @example
 * resetTransform()
 */
const resetTransform = () => ctx.resetTransform();

/**
 * Sets the transformation matrix that will be used when rendering the pattern during a fill or stroke painting operation.
 * @param {DOMMatrix2DInit} transform transform matrix, or 6 numbers parameters
 * @example
 * setTransform(1, .2, .8, 1, 0, 0)
 */
const setTransform = (...transform) => ctx.setTransform(...transform);


/**
 * Creates a pattern using the specified image and repetition. This method returns a CanvasPattern.
 * @param {CanvasImageSource} image A CanvasImageSource to be used as the pattern's image.
 * It can be any of the following: 
 * 	- HTMLImageElement (<img>)
 * 	- SVGImageElement (<image>)
 * 	- HTMLVideoElement (<video>, by using the capture of the video)
 * 	- HTMLCanvasElement (<canvas>)
 * 	- ImageBitmap
 * 	- OffscreenCanvas
 * @param {String} repetition A DOMString indicating how to repeat the pattern's image.
 * Possible values are: 
 * 	- "repeat" (both directions) (default)
 * 	- "repeat-x" (horizontal only)
 * 	- "repeat-y" (vertical only)
 * 	- "no-repeat" (neither direction)
 * @example
 * const img = new Image();
 * img.src = 'my/image.png';
 * img.onload = () => {
 * 	const pattern = createPattern(img, 'repeat');
 * 	fill(pattern);
 * 	fillRect(0, 0, 300, 300);
 * };
 */
const createPattern = (image, repetition) => {
	ctx.createPattern(image, repetition);
};

/**
 * creates a new, blank ImageData object with the specified dimensions.
 * All of the pixels in the new object are transparent black.
 * @param {number|ImageData} widthOrImageData The width to give the new ImageData object. A negative value flips the rectangle around the vertical axis.
 * if ImageData passed: An existing ImageData object from which to copy the width and height. The image itself is not copied.
 * @param {number} height The height to give the new ImageData object. A negative value flips the rectangle around the horizontal axis.
 * @return {ImageData} A new ImageData object with the specified width and height. The new object is filled with transparent black pixels.
 * @example
 * const imageData = createImageData(100, 50);
 * // ImageData { width: 100, height: 50, data: Uint8ClampedArray[20000] }
 */
const createImageData = function(widthOrImageData, height=null) {
	return ctx.createImageData(...arguments);
};

/**
 * paints data from the given ImageData object onto the canvas.
 * If a dirty rectangle is provided, only the pixels from that rectangle are painted.
 * This method is not affected by the canvas transformation matrix.
 * @param {ImageData} imageData An ImageData object containing the array of pixel values.
 * @param {number} dx Horizontal position (x coordinate) at which to place the image data in the destination canvas.
 * @param {number} dy Vertical position (y coordinate) at which to place the image data in the destination canvas.
 * @param {number} dirtyX Horizontal position (x coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.
 * @param {number} dirtyY Vertical position (y coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.
 * @param {number} dirtyWidth Width of the rectangle to be painted. Defaults to the width of the image data.
 * @param {number} dirtyHeight Height of the rectangle to be painted. Defaults to the height of the image data.
 * @example
 * const imgData = getImageData(0, 0, width, height);
 * putImageData(imgData, 0, 0);
 */
const putImageData = (imageData, dx, dy, dirtyX=null, dirtyY=null, dirtyWidth=null, dirtyHeight=null) => {
	if(dirtyX === null) {
		ctx.putImageData(imageData, dx, dy);
	} else {
		ctx.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
	}
}

/**
 * Returns an ImageData object representing the underlying pixel data for a specified portion of the canvas.
 * This method is not affected by the canvas's transformation matrix.
 * If the specified rectangle extends outside the bounds of the canvas, the pixels outside the canvas are transparent black in the returned ImageData object.
 * @param {number} sx The x-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
 * @param {number} sy The y-axis coordinate of the top-left corner of the rectangle from which the ImageData will be extracted.
 * @param {number} sw The width of the rectangle from which the ImageData will be extracted. Positive values are to the right, and negative to the left.
 * @param {number} sh The height of the rectangle from which the ImageData will be extracted. Positive values are down, and negative are up.
 * @return {ImageData} An ImageData object containing the image data for the rectangle of the canvas specified.
 * The coordinates of the rectangle's top-left corner are (sx, sy), while the coordinates of the bottom corner are (sx + sw, sy + sh).
 * @example
 * const data = getImageData(60, 60, 200, 100);
 */
const getImageData = (sx, sy, sw, sh) => {
	return ctx.getImageData(sx, sy, sw, sh);
};


/**
 * Provides different ways to draw an image onto the canvas.
 * @param {CanvasImageSource} image An element to draw into the context.
 * The specification permits any canvas image source (CanvasImageSource),
 * specifically, a CSSImageValue, an HTMLImageElement, an SVGImageElement, an HTMLVideoElement, an HTMLCanvasElement, an ImageBitmap, or an OffscreenCanvas.
 * @param {number} sx The x-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
 * @param {number} sy The y-axis coordinate of the top left corner of the sub-rectangle of the source image to draw into the destination context.
 * @param {number} sWidth The width of the sub-rectangle of the source image to draw into the destination context.
 * If not specified, the entire rectangle from the coordinates specified by sx and sy to the bottom-right corner of the image is used.
 * @param {number} sHeight The height of the sub-rectangle of the source image to draw into the destination context.
 * @param {number} dx The x-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
 * @param {number} dy The y-axis coordinate in the destination canvas at which to place the top-left corner of the source image.
 * @param {number} dWidth The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn.
 * @param {number} dHeight The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn.
 * @example
 * const image = document.getElementById('source');
 * image.addEventListener('load', e => {
 * 	drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
 * });
 */
const drawImage = (image, sx, sy, sWidth=null, sHeight=null, dx=null, dy=null, dWidth=null, dHeight=null) => {
	if(sWidth === null) {
		ctx.drawImage(image, sx, sy);
	} else if(dx === null) {
		ctx.drawImage(image, sx, sy, sWidth, sHeight);
	} else {
		ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	}
};




/** MATHEMATICAL FUNCTIONS SECTION */



/**
 * Convert from degrees to radians
 * @param {number} deg degree value
 * @example
 * radian(45)
 */
const radian = deg => deg * (PI/180);

/**
 * Convert from radians to degrees
 * @param {number} rad radian value
 * @example
 * degree(0.3)
 */
const degree = rad => rad * (180/PI);

/**
 * Convert an angle to a vector (class instance) (2d vector)
 * @param {number} angle angle in radian
 * @example
 * const v = angleToVector(45); // Vector{x: 0.52, y: 0.85}
 */
const angleToVector = angle => new Vector(cos(angle), sin(angle));

/**
 * Returns the angle in degree of a given vector from the default vector (1,0)
 * @param {Vector} vector vector to calculate its angle
 * @example
 * const angle = vectorToAngle(1, 1)
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
 * @example
 * const v1 = new Vector(1, 0);
 * const v2 = new Vector(0, 2);
 * const angle = angleBetweenVectors(v1, v2);
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
 * @example
 * const p1 = {x: 0, y: 0};
 * const p2 = {x: 10, y: 0};
 * const distanceBetweenp1Andp2 = dist(p1, p2);
 */
const dist = (a, b) =>  Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);

/**
 * range mapping of a value
 * @param {Array<number>|number} val value - can be either an array or a number
 * @param {number} start1 start of the current interval
 * @param {number} end1 end of the current interval
 * @param {number} start2 start of the new interval
 * @param {number} end2 end of the new interval
 * @example
 * // converts 0 from interval [-1, 1] to interval [0, 255]
 * console.info(map(0, -1, 1, 0, 255)); // 127.5
 * 
 * // can be used for an entire array
 * console.info(map([-0.7, -0.35, 0, 0.1, 0.2, 0.5, 1], -1, 1, 0, 255));
 * // Array(7) [ 38.25000000000001, 82.875, 127.5, 140.25, 153, 191.25, 255 ]
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
 * @example
 * const powerOfTwo = pow(2); // 4
 * const powerOf3By3 = pow(3, 3); // 27
 */
const pow =	(n, p=2) => Math.pow(n, p);

/**
 * Returns the absolute value of the given one
 * @param {number} n value
 * @example
 * abs(-1); // 1
 * abs(1); // 1
 */
const abs =	n => (n >= 0)? n : -n;

/**
 * Returns the sqrt of the given value
 * @param {number} n value
 * @example
 * sqrt(16); // 4
 */
const sqrt = n => Math.sqrt(n);

/**
 * Returns the minimum of given values
 * @param  {...Number} values value(s)
 * @example
 * min(0, 1, 2, 3, -1); // -1
 */
const min = (...values) => Math.min(...values);

/**
 * Returns the maximum of given values
 * @param  {...Number} values value(s)
 * @example
 * max(0, 1, 2, 3, -1); // 3
 */
const max = (...values) => Math.max(...values);

/**
 * Returns the rounded value of the given one
 * @param {number} n value
 * @example
 * round(3.1); // 3
 * round(3.5); // 4
 */
const round = n => Math.round(n);

/**
 * Returns the floored value of the given one
 * @param {number} n value
 * @example
 * floor(3.1); // 3
 * floor(3.9); // 3
 * floor(-3.1); // -4
 */
const floor = n => Math.floor(n);

/**
 * Returns the ceiled value of the given one
 * @param {number} n value
 * @example
 * ceil(3.1); // 4
 * ceil(3.9); // 4
 * ceil(-3.1); // 3
 */
const ceil = n => Math.ceil(n);

/**
 * Returns the trunced value of the given one
 * @param {number} n value
 * @example
 * trunc(3.1); // 3
 * trunc(3.9); // 3
 * trunc(-3.1); // 3
 */
const trunc = n => Math.trunc(n);


/**
 * Returns a random integer in a given interval. If 1 argument given, minimum is set to 0
 * @param {number} min minimal value
 * @param {number} max maximal value
 * @example
 * random(100); // a random int between 0 and 100
 * random(20, 25); // a random int between 20 and 25
 * random(-25); // a random between -25 and 0
 */
const random = (iMin, iMax=0) => floor(Math.random() * (max(iMin, iMax) - min(iMin, iMax) +1)) + min(iMin, iMax);


/**
 * Returns the sinus of a number
 * @param {number} x A number
 * @example
 * sin(3); // 0.1411
 */
const sin = x => Math.sin(x);


/**
 * Returns the cosinus of a number
 * @param {number} x A number
 * @example
 * cos(3); // -0.9899
 */
const cos = x => Math.cos(x);


/**
 * Returns the tangent of a number
 * @param {number} x A number
 * @example
 * tan(3); // -0.1425
 */
const tan = x => Math.tan(x);


/**
 * Returns the asinus of a number
 * @param {number} x A number
 * @example
 * asin(-2); // NaN
 * asin(-1); // -1.5707
 * asin(0); // 0
 * asin(0.5); // 0.5235
 */
const asin = x => Math.asin(x);


/**
 * Returns the acosinus of a number
 * @param {number} x A number
 * @example
 * acos(2); // NaN
 * acos(0.8); // 0.64350
 */
const acos = x => Math.acos(x);


/**
 * Returns the atangent of a number
 * @param {number} x A number
 * @example
 * atan(1.6); // 1.03
 * atan(0.8); // 0.674740
 */
const atan = x => Math.atan(x);


/**
 * Returns the atan2 of a number
 * @param {number} x A number
 * @param {number} x A number
 * @example
 * 
 */
const atan2 = (x, y) => Math.atan2(y, x);


/**
 * Returns the sinh of a number
 * @param {number} x A number
 * @example
 * 
 */
const sinh = x => Math.sinh(x);

/**
 * Returns the cosh of a number
 * @param {number} x A number
 * @example
 * 
 */
const cosh = x => Math.cosh(x);


/**
 * Returns the exponential of e^x, where x is the argument, and e is Euler's number
 * @param {number} x A number
 * @example
 * exp(0); // 1
 * exp(1); // 2.71828
 */
const exp = x => Math.exp(x);


/**
 * Returns the logarithm of a number
 * @param {number} x A number
 * @example
 * log(0); // -Infinity
 * log(1); // 0
 * log(2); // 0.69314
 */
const log = x => Math.log(x);


/**
 * Returns the base 10 logarithm of a number
 * @param {number} x x value to return its log10
 * @example
 * log10(0); // -Infinity
 * log10(1); // 0
 * log10(2); // 0.3010
 */
const log10 = x => Math.log10(x);

/**
 * Returns the sum of all values in a list
 * @param  {...number} values all values of a list
 * @example
 * sum(1, 2, 3); // 1+2+3 = 6
 */
const sum = (...values) => values.reduce((a, b) => a + b);

/**
 * Returns the mean of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * mean(1, 2, 3); // 2
 */
const mean = (...values) => sum(...values) / values.length;

/**
 * Returns the median of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * median(1, 2, 3);
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
 * @example
 * mode(1, 2, 3)
 */
const mode = (...values) => values.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length? a: b), null);

/**
 * Returns the variance of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * variance(1, 2, 3)
 */
const variance = (...values) => values.reduce((a, b) => a + pow((b - mean(...values))), 0);

/**
 * Returns the standard deviation of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * std(1, 2, 3)
 */
const std = (...values) => sqrt(variance(...values));














/** COLOR MANAGMENT SECTION */

/* HSL convertions :
	https://gist.github.com/mjackson/5311256
*/

class RGB {
	/**
	 * Creates a RGB[A] color
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

	/**
	 * Checks if value is in interval. If it is, then return it, else map it in interval [0;255]
	 * @param {number} val A number
	 */
	valueInInterval(val) {
		if(val < 0 || val > 255) {
			console.error(`Color interval [0 - 255] no repespected (${val} given)`);
			return min(max(val, 0), 255);
		}

		return val;
	}

	// getters (red, green, blue, alpha)
	/**
	 * Returns the red value of the color
	 * @return {number} red value
	 */
	get r() {return this.color.r;}

	/**
	 * Returns the green value of the color
	 * @return {number} green value
	 */
	get g() {return this.color.g;}

	/**
	 * Returns the blue value of the color
	 * @return {number} blue value
	 */
	get b() {return this.color.b;}

	/**
	 * Returns the alpha value of the color
	 * @return {number} alpha value
	 */
	get a() {return this.color.a;}

	// setters

	/**
	 * Sets the red value of the color
	 * @param {number} val A number between 0 and 255
	 * @example
	 * color = new RGB(0, 0, 0);
	 * color.r = 255;
	 */
	set r(val) {
		this.color.r = this.valueInInterval(val);
	}

	/**
	 * Sets the green value of the color
	 * @param {number} val A number between 0 and 255
	 * @example
	 * color = new RGB(0, 0, 0);
	 * color.g = 255;
	 */
	set g(val) {
		this.color.g = this.valueInInterval(val);
	}

	/**
	 * Sets the blue value of the color
	 * @param {number} val A number between 0 and 255
	 * @example
	 * color = new RGB(0, 0, 0);
	 * color.b = 255;
	 */
	set b(val) {
		this.color.b = this.valueInInterval(val);
	}

	/**
	 * Sets the alpha value of the color
	 * @param {number} val A number between 0 and 255
	 * @example
	 * color = new RGB(0, 0, 0);
	 * color.a = 255;
	 */
	set a(val) {
		this.color.a = this.valueInInterval(val);
	}

	/**
	 * set new RGB color. If not alpha given, keep the existing one
	 * @param {number} r red value
	 * @param {number} g green value
	 * @param {number} b blue value
	 * @param {number} a alpha value (opacity)
	 * @example
	 * const color = new Color(0, 0, 0);
	 * color.set(10, 20, 30); // now color.r = 10, color.g = 20 and color.b = 30
	 */
	set(r, g, b, a=null) {
		this.r = r;
		this.g = g;
		this.b = b;
		if(a !== null) this.a = a;
	}

	/**
	 * Returns the color value as a string
	 * @return {String}
	 * @example
	 * const color = new RGB(10, 20, 30);
	 * console.info(color); // rgb(10, 20, 30)
	 * console.info(color.toString()); // is equivalent
	 * 
	 * color.a = 100;
	 * console.info(color); // rgba(10, 20, 30, 0.3)
	 */
	toString() {
		return `rgb${this.a!=255?'a':''}(${this.r}, ${this.g}, ${this.b}${this.a!=255?`, ${round(this.a/255*10)/10}`:''})`;
	}

	/**
	 * Returns the values of the color as an Array
	 * @example
	 * const color = new RGB(10, 20, 30);
	 * console.info(color.intVal()); // [10, 20, 30]
	 * @return {Array<number>} array of values
	 */
	intVal() {
		return [this.r, this.g, this.b, this.a];
	}

	/**
	 * Returns a class instance of HEX, converting its color
	 * @return {HEX} converted hex color
	 * @example
	 * const color new RGB(255, 0, 0);
	 * console.info(color.toHEX()); // "#F00"
	 */
	toHEX() {
		let r = Number(this.r).toString(16); if(r.length < 2) r = "0"+r;
		let g = Number(this.g).toString(16); if(g.length < 2) g = "0"+g;
		let b = Number(this.b).toString(16); if(b.length < 2) b = "0"+b;
		const rgb = '#' + r + g + b;

		return new HEX(rgb);
	}

	/**
	 * Returns a class instance of HSL, converting its color
	 * @return {HSL} converted HSL color
	 * @example
	 * const color = new RGB(255, 0, 0);
	 * console.info(color.toHSL()); // "hsl(0, 50%, 50%)"
	 */
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
	 * Creates Hexadecimal color
	 * @param {string|number} HexaColor Hexadecimal number or string (3 or 6 chars accepted only)
	 */
	constructor(hexaColor) {
		this.color = {
			int: 0x000000,
			str: '#000000'
		};

		this.set(hexaColor);
	}

	/**
	 * Returns the color as string
	 * @return {String} color value as string
	 * @example
	 * const color = new HEX("#fff");
	 * console.info(color); // "#FFF"
	 * console.info(color.toString()); // is equivalent
	 */
	toString() {return this.color.str;}

	/**
	 * Returns the int value of the color
	 * @return {number} color value as int
	 */
	intVal() {return this.color.int;}

	/**
	 * Sets the new value of the color
	 * @param {String|number} hexaColor A string or a number as hexadecimal form
	 * @example
	 * const color = new HEX("#fff"); // white
	 * color.set("#f00"); // red
	 */
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

	/**
	 * Returns a class instance of RGB, converting its color
	 * @return {RGB} converted color to RGB
	 * @example
	 * const color = new HEX("#fff");
	 * console.info(color.toRGB()); // "rgb(255, 255, 255)"
	 */
	toRGB() {
		const r = (this.intVal() & 0xFF0000) >>> 16;
		const g = (this.intVal() & 0xFF00) >>> 8;
		const b = this.intVal()  & 0xFF;

		return new RGB(r, g, b);
	}

	/**
	 * Returns a class instance of HSL, converting its color
	 * @return {HSL} converted color to HSL
	 * @example
	 * const color = new HEX("#f00");
	 * console.info(color.toHSL()); // "hsl(0, 50%, 50%)"
	 */
	toHSL() {
		return this.toRGB().toHSL();
	}
}

class HSL {
	/**
	 * Creates HSL color
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

	/**
	 * Returns the hue value of the color
	 * @return {number} hue
	 */
	get h() {return this.color.h;}

	/**
	 * Returns the saturation value of the color
	 * @return {number} saturation
	 */
	get s() {return this.color.s;}

	/**
	 * Returns the brightness value of the color
	 * @return {number} brightness (luminosity)
	 */
	get l() {return this.color.l;}

	/**
	 * Sets the hue value of the color
	 * @param {number} hue value between 0 and 360. In all cases, it's bounded in the interval.
	 * @example
	 * const color = new HSL(0);
	 * color.h(50);
	 */
	set h(hue) {
		this.color.h = (hue >= 0)? hue % 360 : 360 - (abs(hue) % 360);
	}

	/**
	 * Sets the saturation value of the color
	 * @param {number} saturation value between 0 and 1. In all cases, it's bounded in the interval.
	 * @example
	 * const color = new HSL(0);
	 * color.s(0.7);
	 */
	set s(saturation) {
		this.color.s = min(max(saturation, 0), 1);
	}

	/**
	 * Sets the luminosty value of the color
	 * @param {number} luminosity value between 0 and 1. In all cases, it's bounded in the interval.
	 * @example
	 * const color = new HSL(0);
	 * color.l(0.7);
	 */
	set l(luminosity) {
		this.color.l = min(max(luminosity, 0), 1);
	}

	/**
	 * Add hue value to the current value (loop 360->0)
	 * @param {number} hueToAdd Hue to add to the current one
	 * @example
	 * const color = new HSL(10);
	 * color.add(10); // color.h is now 20
	 */
	add(hueToAdd) {
		this.h = this.h + hueToAdd;
	}

	/**
	 * Substract hue from the current value (loop -1->359)
	 * @param {number} hueToSub Hue to substract from the current one
	 * @example
	 * const color = new HSL(10);
	 * color.sub(10); // color.h is now 0
	 */
	sub(hueToSub) {
		this.h = this.h - hueToSub;
	}

	/**
	 * Add light to the current one
	 * @param {number} lightToAdd light to add to the current one
	 * @example
	 * const color = new HSL(0);
	 * color.lighten(0.1); // color.l is now 0.6
	 */
	lighten(lightToAdd) {
		this.l = this.l + lightToAdd;
	}

	/**
	 * Substract light from the current one
	 * @param {number} lightToSub light to substract from the current one
	 * @example
	 * const color = new HSL(0);
	 * color.obscure(0.1); // color.h is now 0.4
	 */
	obscure(lightToSub) {
		this.l = this.l - lightToSub;
	}

	/**
	 * Add saturation to the current one
	 * @param {number} saturationToAdd saturation to add to the current one
	 * @example
	 * const color = new HSL(0);
	 * color.addSat(0.1); // color.h is now 0.6
	 */
	addSat(saturationToAdd) {
		this.s = this.s + saturationToAdd;
	}

	/**
	 * Substract saturation from the current one
	 * @param {number} saturationToSub saturation to substract from the current one
	 * @example
	 * const color = new HSL(0);
	 * color.subSat(0.1); // color.h is now 0.4
	 */
	subSat(saturationToSub) {
		this.s = this.s - saturationToSub;
	}

	/**
	 * Returns the color's value as string
	 * @return {String} value
	 * @example
	 * const color = new HSL(0);
	 * console.info(color); // "hsl(0, 50%, 50%)"
	 * console.info(color.toString()); // is equivalent
	 */
	toString() {
		return `hsl(${this.h}, ${this.s*100}%, ${this.l*100}%)`;
	}

	/**
	 * Returns the int value of the color.
	 * It converts it to HEX color and returns the HEX's int value
	 * @return {number} int value
	 * @example
	 * const color = new HSL(0);
	 * console.info(color.intVal()); // 3840
	 */
	intVal() {
		return this.toHEX().intVal();
	}

	/**
	 * Returns a class instance of HEX, converting its color
	 * @return {HEX} converted color to HEX
	 * @example
	 * const color = new HSL(0);
	 * console.info(color.toHEX()); // "#f00"
	 */
	toHEX() {
		return this.toRGB().toHEX();
	}

	/**
	 * Returns a class instance of RGB, converting its color
	 * @return {RGB} converted color to RGB
	 * @example
	 * const color = new HSL(0);
	 * console.info(color.toRGB()); // "rgb(255, 0, 0)"
	 */
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
 * Sets the frame rate of the canvas - only positive number allowed
 * @param {number} f frame rate
 * @example
 * frameRate(60)
 */
const frameRate = f => {if(f >= 0) NOX_PV.interval = 1000/f};




/**
 * Returns last swipe direction
 * @return {String} the last swipe direction.
 * It can be "left", "right", "up" or "down"
 * @example
 * const lastSwipe = getSwipe();
 */
const getSwipe = () => NOX_PV.lastSwipe;





// key events

/**
 * Returns either the key is currently down or not
 * @param {number} keyCode the key code
 * @return {Boolean}
 * @example
 * if(isKeyDown(65)) {
 * 	// ... do stuff
 * }
 */
const isKeyDown = keyCode => NOX_PV.keys[keyCode];

/**
 * Returns either the key is currently up or not (not down)
 * @param {number} keyCode the key code
 * @return {Boolean}
 * @example
 * if(isKeyUp(65)) {
 * 	// ... do stuff
 * }
 */
const isKeyUp 	= keyCode => !NOX_PV.keys[keyCode];




// scale for rendering

/**
 * Convert pixel's position from real canvas size to translated canvas size that renders
 * @param {number} x X-axis point
 * @param {number} y Y-axis point
 * @return {number} converted position
 */
const rendering  = (x, y=null) 	=> new Vector(((x instanceof Vector && !y)? x.x : x) * width/realWidth, ((x instanceof Vector && !y)?x.y : y) * height/realHeight);

/**
 * Does the rendering(x, y) function only for the X-axis
 * @param {number} x X-axis point
 * @return {number} converted position
 */
const renderingX = x 			=> x * width / realWidth;

/**
 * Does the rendering(x, y) function only for the Y-axis
 * @param {number} y Y-axis point
 * @return {number} converted position
 */
const renderingY = y 			=> y * height / realHeight;





/**
 * Returns the mouse's direction.
 * If mouse is not moving, returns null.
 * @return {String} mouse's direction.
 * It can be "BOTTOM_RIGHT", "TOP_RIGHT", "TOP_LEFT", "BOTTOM_LEFT", "RIGHT", "DOWN", "UP", "LEFT"
 * @example
 * if(mouseDir() == "RIGHT") {
 * 	// ... do stuff
 * }
 */
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
 * Allows or disallows the swipe feature on pc
 * The swipe is by default enabled
 * @param {Boolean} bool either it enables or disables the swipe on PC
 * @example
 * enablePCswip(false); // disable
 * enablePCswip(true); // enable
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
 * Sets the html view rendering (canvas html element size & canvas view inside it)
 * @param {number} w width
 * @param {number} h height
 * @example
 * createCanvas(500, 500);
 * setPixelResolution(1000, 1000);
 * // now, HTML canvas element's size will do 500x500 pixels,
 * // but inside it, the pixel's resolution will be 1000x1000 pixels
 */
const setPixelResolution = (w, h) => {
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
};






/**
 * Resizes the canvas, affecting context too.
 * @param {number} newWidth canvas width
 * @param {number} newHeight canvas height
 */
const setCanvasSize = (newWidth, newHeight) => {
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
};












/**
 * Creates a new canvas. If already created, then remove the current one and create another canvas
 * @param {number} w width of the canvas
 * @param {number} h height of the canvas
 * @param {Color} bg canvas background color
 * @param {Boolean} requestPointerLock request or not the pointer lock
 * @param {HTMLElement} container the html element the canvas will be in. Default is document.body
 * @return {HTMLCanvasElement} created canvas. this created canvas is stored in a global variable named "canvas"
 * and its context named "ctx"
 * @example
 * createCanvas(); // fullscreen canvas
 * createCanvas(500, 250); // 500x250 canvas size
 * createCanvas(MIN_DOC_SIZE, MIN_DOC_SIZE); // create a square canvas, depending on screen's size
 * createCanvas(200, 200, "#fff"); // create 200x200 canvas with white background
 * createCanvas(200, 200, 0, true); // create 200x200 canvas with black background, and enable requestPointerLock feature
 */
const createCanvas = (w, h, bg="#000", requestPointerLock=false, container=document.body) => {
	if(w === undefined && h === undefined) {
		w = documentWidth();
		h = documentHeight();
	}

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
	
	container.appendChild(canvas);


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
};





/**
 * Shows cyan guidelines that are following the mouse on the canvas, telling the pixels x,y
 * It's mostly a dev feature
 * @param {Boolean} bool either it shows or not
 * @example
 * showGuideLines(true)
 */
const showGuideLines = bool => {
	NOX_PV.bGuideLines = typeof bool == 'boolean'? bool : false;
};







/**
 * Default draw condition - run in every cases
 * Do not use it. Use setDrawCondition instead.
 */
let drawCond = () => true;

/**
 * Sets the condition on when the draw function has to be executed (pause it if not)
 * @param {Function} condition condition in function
 * @example
 * setDrawCondition(() => x < 10);
 */
const setDrawCondition = (condition = null) => {
	if(condition) drawCond = condition;
};







/**
 * The draw loop. If drawCond returns true, then executes the draw function of the user that uses the framework.
 * Manages the frame rate.
 * Show guide lines if enabled.
 * Clear then draw canvas if the draw() function has been created and if the drawCond() returns true.
 * Do not Call it.
 */
const drawLoop = () => {
	if(NOX_PV.loop === true) requestAnimationFrame(drawLoop);

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
};





/**
 * Disables draw loop. Draw only once.
 * @example
 * noLoop();
 */
const noLoop = () => {
	NOX_PV.loop = false;
};


/**
 * Enables image's smoothing.
 * Context needs to exist
 * @example
 * enableSmoothing();
 */
const enableSmoothing = () => {
	if(ctx) ctx.imageSmoothingEnabled = true;
}

/**
 * Disables image's smoothing.
 * Context needs to exist.
 * @example
 * disableSmoothing();
 */
const disableSmoothing = () => {
	if(ctx) ctx.imageSmoothingEnabled = false;
}



/**
 * Loads an 1D array (imageData) for each pixels of the canvas.
 * Enable variable named "pixels" which are the data of loaded pixels.
 * Each pixel has 4 values, rgba.
 * So pixels[0], pixels[1], pixels[2] and pixels[3] are the value of the first pixel.
 * @example
 * loadPixels();
 * pixels[0] = 255; // first pixel is now red
 */
const loadPixels = () => {
	if(typeof ctx !== "undefined" && typeof canvas !== "undefined" && ctx !== null && canvas !== null) {
		NOX_PV.pixels = ctx.createImageData(canvas.width, canvas.height);
		pixels = NOX_PV.pixels.data;

		for(let i=0; i < width * height; i++) {
			pixels[i*4 + 3] = 255; // enable max opacity (to see each pixels)
		}
	}

	else {
		console.warn("Can't load canvas's pixels : no existing context found.");
	}
};

/**
 * Sends the array of pixels to the canvas.
 * Directly draws on the canvas.
 * Isn't affacted by other canvas's functions like fill() or stroke()
 * @example
 * updatePixels();
 */
const updatePixels = () => {
	if(typeof pixels !== 'undefined' && ctx) {
		NOX_PV.pixels.data = pixels;
		ctx.putImageData(NOX_PV.pixels, 0, 0);
	}
};








/**
 * Perlin Noise function.
 * Code from : http://pub.phyks.me/sdz/sdz/bruit-de-perlin.html
 * Returns the perlin noise value between 0 and 1 for a given point (x,y)
 * Lazily generates the perlin seed if not existing.
 * It's the perlin noise of the page, so seed will always be the same.
 * To have multiple custom Perlin noise arrays, create PerlinNoise class instance instead.
 * @param {Number} x X-axis point coordinate
 * @param {Number} y Y-axis point coordinate
 * @return {Number} floating point between 0 and 1
 * @example
 * const value = perlin(0, 0); // value between -1 and 1.
 */
const perlin = (x, y=0) => {
	// create seed if never used perlin noise previously
	if(!NOX_PV.perlin.seed || NOX_PV.perlin.seed.length === 0) {
		NOX_PV.perlin.seed = NOX_PV.perlin.generateSeed();
	}

	return NOX_PV.perlin.get(x, y);
};

/**
 * Sets the level of details for the Perlin noise function.
 * Default is 10. If given argument isn't a number, does nothing.
 * @param {number} detailLevel level of detail for Perlin noise function
 * @example
 * noiseDetails(200);
 */
const noiseDetails = detailLevel => {
	if(typeof detailLevel === 'number') {
		NOX_PV.perlin.lod = detailLevel;
	}
};




class PerlinNoise {
	static mapNumberTypes = ['default', 'rgb', 'hsl'];
	static getMapNumberTypeIndex = typeStr => PerlinNoise.mapNumberTypes.indexOf(typeStr.toLowerCase())
	/**
	 * 
	 * @param {number} lod level of details
	 * @param {number} x start x of the array
	 * @param {number} y start y of the array
	 * @param {number} w width of the array
	 * @param {number} h height of the array
	 * @param {string} mapNumber map values to [auto: (-1,1)], [rgb: (0,255)], [hsl: (0, 360)]
	 */
	constructor(lod=10, x=0, y=0, w=width, h=height, mapNumber='default') {
		this.lod = lod;
		this.seed = NOX_PV.perlin.generateSeed();
		this.start = { x, y };
		this.size = { width: w, height: h };
		this.array = [];
		this.numberMapStyle = PerlinNoise.getMapNumberTypeIndex(mapNumber);
		this.calculate();
	}

	/**
	 * Sets the level of detail for this class instance.
	 * If the lod changed, then it re-calculates the array.
	 * @param {number} lod level of detail
	 * @example
	 * const p = new PerlinNoise();
	 * p.setLOD(200);
	 */
	setLOD(lod) {
		const tmp = this.lod;
		this.lod = lod;

		if(tmp !== lod) {
			this.calculate();
		}
	}
	
	/**
	 * Regenerates the noise's seed.
	 * Then it re-calculates the array.
	 * @example
	 * const p = new PerlinNoise();
	 * p.regenerateSeed();
	 */
	regenerateSeed() {
		this.seed = NOX_PV.perlin.generateSeed();
		this.calculate();
	}

	/**
	 * Sets the map number of the array.
	 * Default is [-1,1] (0).
	 * You can choose [0,255] (1) or [0,360] (2).
	 * @param {number} mapNumber map style's index
	 * @example
	 * const p = new PerlinNoise();
	 * p.setMapNumber(1); // sets values between 0 and 255.
	 */
	setMapNumber(mapNumber) {
		mapNumber = PerlinNoise.getMapNumberTypeIndex(mapNumber);
		if(this.numberMapStyle === mapNumber) return;

		let Lmin=0, Lmax=NOX_PV.perlin.unit, Rmin=0, Rmax=NOX_PV.perlin.unit;
		
		if(this.numberMapStyle > 0) [Lmin, Lmax] = [0, (this.numberMapStyle===1)?255:360];
		this.numberMapStyle = mapNumber;
		if(this.numberMapStyle > 0) [Rmin, Rmax] = [0, (this.numberMapStyle===1)?255:360];
		
		this.array.forEach((row, i) => {
			this.array[i] = map(this.array[i], Lmin, Lmax, Rmin, Rmax);
		});
	}

	/**
	 * Calculates the noised array.
	 * You normally don't have to call it. It's automatically called if an option is changed through methods.
	 * @example
	 * const p = new PerlinNoise();
	 * p.calculate();
	 */
	calculate() {
		this.array = [];

		for(let y=this.start.y; y < this.start.y + this.size.height; y++) {
			let row = [];

			for(let x=this.start.x; x < this.start.x + this.size.width; x++) {
				row.push(NOX_PV.perlin.get(x, y, this.lod, this.seed));
			}

			this.array.push(row);
		}

		if(this.numberMapStyle > 0) {
			this.setMapNumber(PerlinNoise.mapNumberTypes[this.numberMapStyle]);
		}
	}
}











/**
 * Handled when the user starts to press screen with his finger / mouse
 * @param {Object} e event default object
 */
const handleTouchStart = e => {
	NOX_PV.isMouseDown = true;

	if(typeof mouseDown != "undefined") mouseDown(e);

	let getTouches = e2 => e2.touches || [{clientX: e.clientX, clientY: e.clientY}, null];

	const firstTouch = getTouches(e)[0];

	NOX_PV.swipexDown = firstTouch.clientX;
	NOX_PV.swipeyDown = firstTouch.clientY;
};

/**
 * Handled when the user moves his finger / mouse on the screen, while he is pressing it
 * @param {Object} e event default object
 */
const handleTouchMove = e => {

	if(typeof mouseMove != "undefined" && NOX_PV.isMouseDown) mouseMove(e);

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
};



/**
 * Returns the vector from center to origin of the shape
 * @param {Shape} shape shape instance
 * @return {Vector} offset vector of a Shape
 * @example
 * const r = new Rectangle(10, 10, 50, 50);
 * console.info(getOffsetVector(r));
 */
const getOffsetVector = shape => {
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
};





// initialize all the canvas's environment, when window is ready
const initializeCanvasWorld = () => {
    if(window) {
        window.onload = () => {
            // the minimum between document width | height
            MIN_DOC_SIZE = min(documentWidth(), documentHeight());
            


            // if user created a setup function
            if(typeof setup != "undefined") {
				setup();

				if(pixels === undefined) {
					delete pixels;
				}
            }



            /**
             * Calculate the {top, left} offset of a DOM element
             * @param {DOMElement} elt the dom Element
             */
            const offset = elt => {
                let rect = elt.getBoundingClientRect();

                return {
                    top: rect.top + document.body.scrollTop,
                    left: rect.left + document.body.scrollLeft
                };
            };



            // if the user created the canvas on the setup function
            if(canvas) {

                // event mouse move
                canvas.addEventListener('mousemove', e => {
                    NOX_PV.oldMouseX = mouseX;
                    NOX_PV.oldMouseY = mouseY;

                    mouseX = e.clientX - offset(canvas).left;
                    mouseY = e.clientY - offset(canvas).top;

                    //if(NOX_PV.isPointerLocked) {
                        mouseDirection = {x: e.movementX, y: e.movementY};
                    //}

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
                const newWidth = document.documentElement.clientWidth,
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
 * Calculates the collision between two shapes
 * @param {Shape} shape1 first shape
 * @param {Shape} shape2 second shape
 * @return {Boolean} either the shapes are colliding or not
 * @example
 * const s1 = new Circle(0, 0, 10);
 * const s2 = new Circle(20, 20, 5);
 * console.info(collision(s1, s2)); // false
 */
const collision = (shape1, shape2) => {
	// must be 2 instances of shape
	if(!(shape1 instanceof Shape && shape2 instanceof Shape)) {
		console.error('Collision is only for 2 Shape types');
		return undefined;
	}

	// collision: Rectangle & Rectangle
	const colRaR = (a, b) => {
		let x2 = x1 + a.width, y2 = y1 + a.height,
			x4 = x3 + b.width, y4 = y3 + b.height;
		return 	x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3;
	};

	// collision: Rectangle & Circle
	const colRaC = (r, c) => {
		offset1 = getOffsetVector(r);
		offset2 = getOffsetVector(c);

		let cx = c.x - offset2.x, cy = c.y - offset2.y,
			rx = r.x - offset1.x, ry = r.y - offset1.y;

		let testX = (cx < rx)? rx : (cx > rx+r.width)?  rx + r.width :  cx,
			testY = (cy < ry)? ry : (cy > ry+r.height)? ry + r.height : cy;

		return sqrt(pow(cx - testX) + pow(cy - testY)) <= c.r;
	};

	// collision: Circle & Circle
	const colCaC = (c1, c2) => {
		let dx = x1 - x3,
			dy = y1 - y3;

		return sqrt(dx * dx + dy * dy) < c1.r + c2.r;
	};

	
	
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
};




























// CLASSES

class Time {
	static units = {
		// unit => milliseconds to unit
		nano: ms => ms * 100000000,
		micro: ms => ms * 1000,
		milli: (t, unit='milli') => {
			switch(unit) {
				case 'nano': return t / 100000000 // nano to ms
				case 'micro': return t / 1000 // micro to ms
				case 'seconds': return t * 1000 // seconds to ms
				case 'minutes': return t * 60000 // minutes to ms
				default: return t;
			}
		},
		seconds: ms => ms / 1000,
		minutes: ms => ms / 60000
	};

	/**
	 * Creates a timer since its instanciation.
	 * 
	 * If a parameter is given, the timer will starts from the given time.
	 * 
	 * The default time's unity is milliseconds if nothing's precised.
	 * @param {number} value initial time value (by default in milliseconds).
	 * @param {string} unity unity of given time (by default milliseconds).
	 * 
	 * It can be 'nano', 'micro', 'milli', 'seconds', 'minutes'
	 */
	constructor(startingTime=undefined, unity='milli') {
		if(typeof startingTime === 'undefined' || !Object.keys(Time.units).includes(unity)) {
			this.reset();
			this.staticTime = false;
		} else {
			this.start = Time.units.milli(startingTime, unity);
			this.staticTime = true;
		}
	}

	/**
	 * Returns the time elapsed as nanoseconds
	 * @return {number}
	 */
	asNanoseconds() {
		return Time.units.nano(this.asMilliseconds());
	}

	/**
	 * Returns the time elapsed as microseconds
	 * @return {number}
	 */
	asMicroseconds() {
		return Time.units.micro(this.asMilliseconds());
	}

	/**
	 * Returns the time elapsed as milliseconds
	 * @return {number}
	 */
	asMilliseconds() {
		return Time.units.milli(this.staticTime? this.start : (Date.now() - this.start));
	}

	/**
	 * Returns the time elapsed as seconds
	 * @return {number}
	 */
	asSeconds() {
		return Time.units.seconds(this.asMilliseconds());
	}

	/**
	 * Returns the time elapsed as minutes
	 * @return {number}
	 */
	asMinutes() {
		return Time.units.minutes(this.asMilliseconds());
	}

	/**
	 * Resets the start timestamp of the timer
	 */
	reset() {
		this.start = Date.now();
	}
}










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

	/**
	 * Returns the dimension of the vector
	 * @return {number} vector's dimension
	 * @example
	 * const v = new Vector(10, 10);
	 * console.info(v.dimension); // 2
	 */
	get dimension() {return this.constants.dimension;}

	/**
	 * Returns the x value of the vector
	 * @return {number} x value
	 * @example
	 * const v = new Vector(10, 20);
	 * console.info(v.x); // 10
	 */
	get x() {return this.coords.x;}

	/**
	 * Returns the y value of the vector.
	 * By default, for a 1D vector, Y equals 0.
	 * @return {number} y value
	 * @example
	 * const v = new Vector(10, 20);
	 * console.info(v.x); // 20
	 */
	get y() {return this.coords.y;}

	/**
	 * Returns the z value of the vector.
	 * By default, for a 1D or 2D vector, Z equals 0
	 * @return {number} z value
	 * @example
	 * const v = new Vector(10, 20, 30);
	 * console.info(v.x); // 30
	 */
	get z() {return this.coords.z;}

	/**
	 * Sets the x value of the vector
	 * @param {number} x A number
	 * @example
	 * const v = new Vector(10, 20);
	 * v.x = 10;
	 */
	set x(x) {this.coords.x = x;}
	
	/**
	 * Sets the y value of the vector.
	 * Does an error if trying to modify 1D vector.
	 * @param {number} y A number
	 * @example
	 * const v = new Vector(10, 20);
	 * v.y = 10;
	 */
	set y(y) {
		if(this.dimension > 1) {
			this.coords.y = y;
		} else {
			console.error('Cannot modify the Y of a 1D vector');
		}
	}

	/**
	 * Sets the z value of the vector.
	 * Does an error if trying to modify 2D vector.
	 * @param {number} z A number
	 * @example
	 * const v = new Vector(10, 20, 30);
	 * v.z = 10;
	 */
	set z(z) {
		if(this.dimension > 2) {
			this.coords.z = z;
		} else {
			console.error(`Cannot modify the Y of a ${this.dimension}D vector`);
		}
	}

	/**
	 * Adapts the vector on a scale of 1
	 * @param {boolean} apply either it should apply the changes to the vector or just return it
	 * @return {Vector} the vector (modified or not following "apply" argument (by default false)).
	 * @example
	 * const v = new Vector(10);
	 * v.normalize(true); // now v.x = 1;
	 * 
	 * v.set(20);
	 * const v2 = v.normalize(); // v.x = 20, v2.x = 1
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
	 * Changes the vector's values.
	 * If vector's dimension is lower than number of argument passed, it does not change the value for it.
	 * @param {number} x new X
	 * @param {number} y new y
	 * @param {number} z new z
	 * @example
	 * const v = new Vector(10, 20, 30);
	 * v.set(30, 20, 10);
	 */
	set(x, y=0, z=0) {
		this.x = x;
		if(this.dimension > 1) this.y = y;
		if(this.dimension > 2) this.z = z;

		return this;
	}

	/**
	 * Adds values to the vector and returns it.
	 * @param {Vector|number} vec or x vector additionning the vector
	 * @param {number} y A number
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(10, 10);
	 * const v2 = new Vector(20, 20);
	 * const v3 = v.add(1, 2); // now v{x: 11, y: 12} and v3 is same
	 * v2.add(v); // now v2{x: 31, y: 32}
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
	 * mutliplys the vector by another vector / or x,y and returns it.
	 * You can multiply 2 vectors from 2 different dimension.
	 * @param {Vector|number} vec or x vector multiplying the vector
	 * @param {number} y A number
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(10, 10);
	 * const v2 = new Vector(20, 20);
	 * v.mult(2); // now v{x: 20, 20}
	 * const v3 = v.mult(1, 2); // now v{x: 20, y: 40} and v3 is same
	 * v2.mult(v); // now v2{x: 400, y: 800}
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
	 * Divides the vector by another vector / or x,y and returns it.
	 * @param {Vector|number} vec or x vector dividing the vector
	 * @param {number} y A number
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(10, 10);
	 * const v2 = new Vector(20, 20);
	 * const v3 = v.div(2); // now v{x: 5, 5} and v3 is same
	 * v2.div(v); // now v2{x: 4, y: 4}
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
	 * invert vector's x,y,z. Does nothing for 1D vectors. Returns it.
	 * @param {boolean} antiClockwise either clockwise or anti-clockwise (only for 3D)
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(1, 2);
	 * v.invert(); // now v{x: 2, y: 1}
	 * 
	 * const v2 = new Vector(1, 2, 3);
	 * v2.invert(); // now v2{x: 3, y: 1, z: 2}
	 * v2.invert(true); // now v2{x: 1, y:2, z: 3}
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
	 * Returns the vector's magnitude (length)
	 * @returns {number} magnitude
	 * @example
	 * const v = new Vector(1, 0);
	 * console.inf(v.mag); // 1
	 */
	get mag() {
		// for 1/2D vectors, y = z = 0, so it will not change anything
		return Math.hypot(this.x, this.y, this.z);
	}

	/**
	 * Changes vector's magnitude
	 * @param {number} newMag new magnitude
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(1, 1);
	 * v.setMag(2); // does not change the sens of the vector, but changes its length
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
	 * @example
	 * const v = new Vector(1, 2);
	 * console.info(v); // {x: 1, y: 2}
	 * console.info(v.toString()); // is equivalent
	 */
	toString() {
		return `{x: ${this.x}${(this.dimension > 1)? `, y: ${this.y}` : ''}${(this.dimension > 2)? `, z: ${this.z}` : ''}}`;
	}

	/**
	 * Returns an array [x, y, z]
	 * @returns {Array<number>}
	 * @example
	 * const v = new Vector(1, 2);
	 * console.info(v.array()); // [1, 2]
	 */
	array() {
		let arr = [this.x];
		if(this.dimension > 1) arr.push(this.y);
		if(this.dimension > 2) arr.push(this.z);

		return arr;
	}

    /**
     * Returns the vector's properties as a basic object { x, y, z }
     * 
     * { x } for dimension 1
     * 
     * { x, y } for dimension 2
     * 
     * { x, y, z } for dimension 3
     * @return {Object}
     */
    object() {
        let o = { x: this.x };

        if(this.dimension > 1) {
            o.y = this.y;

            if(this.dimension > 2) {
                o.z = this.z;
            }
        }

        return o;
    }

	/**
	 * Draw the vector on the canvas (1 & 2 dimensions only for now)
	 * @param {number} x vector's position on the canvas
	 * @param {number} y vector's position on the canvas
	 * @param {Object (strokeWeight: number, stroke: any)} style bow's fill & stroke style
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
	/**
	 * Creates a shape instance with properties
	 * @param {number} x shape's position X
	 * @param {number} y shape's position Y
	 * @param {any} fill shape's background
	 * @param {any} stroke shape's outline
	 * @param {number} strokeWeight shape outline's size
	 */
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
	/**
	 * Create a Rectangle shape instance with properties, heeriting from Shape class
	 * @param {number} x rectangle's position X
	 * @param {number} y rectangle's position Y
	 * @param {any} fill rectangle's background
	 * @param {any} stroke rectangle's outline
	 * @param {number} strokeWeight rectangle outline's size
	 */
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
	/**
	 * Create Circle shape instance with properties, heriting from Shape class
	 * @param {number} x circle's position X
	 * @param {number} y circle's position Y
	 * @param {number} r circle's radius
	 * @param {any} fill circle's background
	 * @param {any} stroke circle's outline
	 * @param {number} strokeWeight circle outline's size
	 */
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
	/**
	 * Create Triangle shape instance with properties, heriting from Shape class
	 * @param {number} x triangle's position X
	 * @param {number} y triangle's position Y
	 * @param {number} baseLength triangle's base length
	 * @param {number} baseTiltinDegree triangle's rotation (in degree)
	 * @param {number} triangleHeight triangle's height
	 * @param {number} heightPosition triangle's height position from its base. 0 is the center
	 * @param {any} fill triangle's background
	 * @param {any} stroke triangle's outline
	 * @param {number} strokeWeight triangle outline's size
	 */
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
	/**
	 * Create Triangle shape instance with properties, heriting from Shape class
	 * @param {number} x1 first point position X
	 * @param {number} y1 first point position Y
	 * @param {number} x2 second point position X
	 * @param {number} y2 second point position Y
	 * @param {number} x3 third point position X
	 * @param {number} y3 third point position Y
	 * @param {any} fill triangle's background
	 * @param {any} stroke triangle's outline
	 * @param {number} strokeWeight triangle outline's size
	 */
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




class Path {
	/**
	 * Create Path instance
	 * @param {number} x where must start the path X
	 * @param {number} y where must start the path Y
	 */
	constructor(x=null, y=null) {
		this.d = null;
		this.isClosed = false;

		if(x && y) {
			this.MoveTo(x, y);
		}
	}

	/**
	 * Removes everyting from the path
	 */
	clear() {
		this.d = null;
	}

	/**
	 * Draws the path
	 */
	draw() {
		if(this.d !== null) {
			path(this.d + (this.isClosed? ' Z' : ''));
		}

		else {
			console.error("Cannot draw it because you didn't make a path");
		}
	}

	/**
	 * MoveTo instruction - absolute
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 */
	MoveTo(x, y) {
		if(this.d === null) {
			this.d = `M ${x} ${y}`;
		}
	
		else {
			this.d += ` M ${x} ${y}`;
		}
	}
	
	/**
	 * moveTo instruction - relative
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 */
	moveTo(x, y) {
		if(this.d === null) return console.error("You have to initialize the fist path's position");
		this.d += ` m ${x} ${y}`;
	}


	/**
	 * LineTo instruction - absolute
	 * @param {number} x X-axis coordinate
	 * @param {number} y y-axis coordinate
	 */
	LineTo(x, y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` L ${x} ${y}`;
	}

	/**
	 * lineTo instruction - relative
	 * @param {number} x X-axis coordinate
	 * @param {number} y y-axis coordinate
	 */
	lineTo(x, y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` l ${x} ${y}`;

	}


	/**
	 * Horizontal instruction - absolute
	 * @param {number} x X-axis coordinate
	 */
	Horizontal(x) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` H ${x}`;
	}

	/**
	 * horizontal instruction - relative
	 * @param {number} x X-axis coordinate
	 */
	horizontal(x) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` h ${x}`;
	}


	/**
	 * Vertical instruction - absolute
	 * @param {number} y Y-axis coordinate
	 */
	Vertical(y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` V ${y}`;
	}

	/**
	 * Vertical instruction - relative
	 * @param {number} y Y-axis coordinate
	 */
	vertical(y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` v ${y}`;
	}

	
	/**
	 * Arc instruction - absolute
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 * @param {number} r radius. Must be positive
	 * @param {number} start start angle
	 * @param {number} end end angle
	 * @param {Boolean} antiClockwise either it has to draw it anti-clockwisly or not
	 */
	Arc(x, y, r, start, end, antiClockwise=false) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` A ${x} ${y} ${r} ${start} ${end} ${(antiClockwise===true)?1:0}`;
	}

	/**
	 * Arc instruction - relative
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 * @param {number} r radius. Must be positive
	 * @param {number} start start angle
	 * @param {number} end end angle
	 * @param {Boolean} antiClockwise either it has to draw it anti-clockwisly or not
	 */
	arc(x, y, r, start, end, antiClockwise=false) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` a ${x} ${y} ${r} ${start} ${end} ${(antiClockwise===true)?1:0}`;
	}


	/**
	 * Close path
	 */
	close() {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.isClosed = true;
	}

	/**
	 * Removes the instruction that close the path if it was.
	 */
	open() {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.isClosed = false;
	}

	/**
	 * Moves the entire path.
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 */
	move(x, y=null) {
		// 1 argument and it's a vector
		if(y === null && x instanceof Vector) {
			[x, y] = [x.x, x.y];
		}

		if(this.d === null) return;

		this.d = this.d.replace(/([MLHVA])\s([\d\.]+)(\s([\d\.]+))?/g, (c, p1, p2, p3) => {
			if(p1 == 'H') return `${p1} ${parseFloat(p2) + x}`;
			
			if(p1 == 'V') return `${p1} ${parseFloat(p2) + y}`;
			
			return `${p1} ${parseFloat(p2) + x} ${parseFloat(p3) + y}`;
		});
	}
}