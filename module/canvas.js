/**
 * @copyright   Copyright (C) 2019 - 2022 Dorian Thivolle All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE.txt
 * @author		Dorian Thivolle
 * @name		canvas
 * @package		NoxFly/canvas
 * @see			https://github.com/NoxFly/canvas
 * @since		30 Dec 2019
 * @version		{1.6.2}
 */



/**
 * @vars CANVAS PUBLIC VARS
 * read-only, do not modify it
 */
/** @type {CanvasRenderingContext2D} */
export let ctx = null;
/** @type {HTMLCanvasElement} */
export let canvas = null;

export let width = 0,
	height = 0,
	mouseX = 0,
	mouseY = 0,
	fps = 60;

/** @type {{ x: number, y: number }} */
export let dragPoint = null;

/** @type {Uint8ClampedArray} */
export var pixels = undefined;

/**
 * Returns the current document's width in pixel
 * @return {number} document's width
 */
export const documentWidth = () => document.documentElement.clientWidth;

/**
 * Returns the current document's height in pixel
 * @return {number} document's height
 */
export const documentHeight = () => document.documentElement.clientHeight;

// the minimum between document width & document height
export let MIN_DOC_SIZE = Math.min(documentWidth(), documentHeight());

// PI
export const PI = Math.PI;

// object of boolean
// either it's a mobile or not, in ios or android
export const isDevice = Object.freeze({
	mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
	ios: /iPad|iPhone|iPod/.test(navigator.userAgent),
	android: /Android/.test(navigator.userAgent)
});


// mouse direction - can't be a vector class instance, just a basic object {x, y}
export const mouseDirection = { x: 0, y: 0 };


/**
 * Begins a new sub-path at the point specified by the given (x, y) coordinates.
 * @param {number} x The x-axis (horizontal) coordinate of the point.
 * @param {number} y The y-axis (vertical) coordinate of the point.
 * @example
 * moveTo(0, 0)
 */
export const moveTo = (x, y) => ctx.moveTo(x - NOX_PV.cam.x, y - NOX_PV.cam.y);

/**
 * Adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.
 * @param {number} x The x-axis coordinate of the line's end point.
 * @param {number} y The y-axis coordinate of the line's end point.
 * @example
 * lineTo(10, 50)
 */
export const lineTo = (x, y) => ctx.lineTo(x - NOX_PV.cam.x, y - NOX_PV.cam.y);

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
export const arcTo = (x1, y1, x2, y2, r) => ctx.arcTo(x1 - NOX_PV.cam.x, y1 - NOX_PV.cam.y, x2 - NOX_PV.cam.x, y2 - NOX_PV.cam.y, r);



/**
 * Adds a line from p1(x1, y1) to p2(x2, y2) to the current sub-path.
 * @param {number} x1 The x-axis coordinate of the first point.
 * @param {number} y1 The y-axis coordinate of the first point.
 * @param {number} x2 The x-axis coordinate of the second point.
 * @param {number} y2 The y-axis coordinate of the second point.
 * @example
 * line(10, 40, 100, 150)
 */
export const line = (x1, y1, x2, y2) => {
	beginPath();
	moveTo(x1, y1);
	lineTo(x2, y2);

	if(NOX_PV.bStroke)
		ctx.stroke();
};





/**
 * Adds a polyline with given arguments to the current sub-path.
 * It goes by pairs (x, y), so an even number of arguments.
 * @argument {number[]} values Array of point's positions. Need to be even number
 * @example
 * polyline(0, 0, 10, 10, 100, 50)
 */
export const polyline = (...values) => {
	// got an odd number of argument
	if(values.length % 2 !== 0) {
		return console.error('The function polyline must take an even number of values');
	}

	beginPath();

	if(values.length > 0) {
		moveTo(values[0], values[1]);
	}

	for(let i=2; i < values.length; i += 2) {
		const x = values[i],
			y = values[i+1];

		lineTo(x, y);
	}

	if(NOX_PV.bStroke)
		ctx.stroke();

	if(NOX_PV.bFill)
		ctx.fill();
};





/**
 * Adds a circular arc to the current sub-path.
 * @param {number} x The horizontal coordinate of the arc's center.
 * @param {number} y The vertical coordinate of the arc's center.
 * @param {number} r The arc's radius. Must be positive.
 * @param {number} start The angle at which the arc starts in radians, measured from the positive x-axis.
 * @param {number} end The angle at which the arc ends in radians, measured from the positive x-axis.
 * @param {boolean} antiClockwise An optional boolean. If true, draws the arc counter-clockwise between the start and end angles. The default is false (clockwise).
 * @example
 * arc(100, 70, 20)
 */
export const arc = (x, y, r, start, end, antiClockwise=false) => {
	beginPath();
	ctx.arc(x - NOX_PV.cam.x, y - NOX_PV.cam.y, r, start, end, antiClockwise);
	closePath();

	if(NOX_PV.bStroke)
		ctx.stroke();

	if(NOX_PV.bFill)
		ctx.fill();
};





/**
 * Adds a circle to the current sub-path
 * @param {number} x circle's X
 * @param {number} y circle's y
 * @param {number} r circle's radius. Must be positive.
 * @example
 * circle(70, 70, 15)
 */
export const circle = (x, y, r) => {
	arc(x, y, r, 0, 2 * PI);
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
export const fillRect = (x, y, w, h) => {
	ctx.fillRect(x - NOX_PV.cam.x, y - NOX_PV.cam.y, w, h);
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
export const strokeRect = (x, y, w, h) => {
	ctx.strokeRect(x - NOX_PV.cam.x, y - NOX_PV.cam.y, w, h);
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
export const rect = (x, y, w, h) => {
	ctx.rect(x - NOX_PV.cam.x, y - NOX_PV.cam.y, w, h);

	if(NOX_PV.bFill)
		ctx.fill();

	if(NOX_PV.bStroke)
		ctx.stroke();
};



/**
 * Draws a rounded rectangle
 * @param {number} x The X-Axis rounded rectangle's position
 * @param {number} y The Y-Axis rounded rectangle's position
 * @param {number} w The width of the rounded rectangle
 * @param {number} h The height of the rounded rectangle
 * @param  {number} radius top-left corner's radius or 4 corners radius if this is the only one passed
 * @param  {number} radiusTR top-right corner's radius
 * @param  {number} radiusBR bottom-right corner's radius
 * @param  {number} radiusBL bottom-left corner's radius
 */
export const roundRect = (x=0, y=0, w=0, h=0, radius=0, radiusTR, radiusBR, radiusBL) => {
	if(radiusTR === undefined) radiusTR = radius;
	if(radiusBR === undefined) radiusBR = radius;
	if(radiusBL === undefined) radiusBL = radius;

	radius 		= min(max(0, radius), 50);
	radiusTR 	= min(max(0, radiusTR), 50);
	radiusBR 	= min(max(0, radiusBR), 50);
	radiusBL 	= min(max(0, radiusBL), 50);

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
	closePath();

	if(NOX_PV.bStroke)
		ctx.stroke();

	if(NOX_PV.bFill)
		ctx.fill();
};



/**
 * Create a custom path with assembly of shapes.
 * It's the same use as the <path> tag for SVG.
 * It adds the path to the current one.
 * Instructions : M, L, H, V, A, Z
 * @param {string} p path string that will be converted to d path code
 * @example
 * p('M0 0 L 10 10 A 20 20 H 50 V 50 l 20 20 Z')
 */
export const path = p => {
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
			f: (x, y, r, start, end, antiClockwise) => ctx.arc(x - NOX_PV.cam.x, y - NOX_PV.cam.y, r, radian(start), radian(end), antiClockwise === 1)
		},

		Z: {
			n: 0,
			f: () => lineTo(parseFloat(p[1]), parseFloat(p[2]))
		}
	};


	// regex to verify if each point is okay
	const reg = new RegExp(`^[${Object.keys(modes).join('')}]|(\-?\d+(\.\d+)?)$`, 'i');

	// if a point isn't well written, then stop
	if(p.filter(point => reg.test(point)).length === 0) {
		return;
	}

	// doesn't need to try to draw something: need at least an instruction M first and 2 parameters x,y
	if(p.length < 3) {
		return;
	}

	// code translated path
	const d = [];
	// number of points - 1: last index of the array of points
	const lastIdx = p.length - 1;


	// read arguments - normally starts with x,y of the M instruction
	for(let i=0; i < p.length; i++) {
		const point = p[i];

		// is a letter - new instruction
		if(/[a-z]/i.test(point)) {
			// lowercase - relative
			// uppercase - absolute
			// push pile of instructions (only 2 saved)
			mode = point;

			// if the instruction is Z
			if(mode === 'Z') {
				// and if it's the last mode
				if(i === lastIdx) {
					// then close the path
					d.push('Z');
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
			if(lastIdx - nArg < i) {
				return;
			}

			//
			const lastPos = { x: 0, y: 0 };

			// get the last cursor position
			if(d.length > 0) {
				const prev = d[d.length - 1];

				const hv = ['H', 'V'].indexOf(prev[0]);

				if(hv !== -1) {
					lastPos.x = prev[1+hv]; // x of the last point
					lastPos.y = prev[2-hv]; // y of the last point
				}

				else {
					const k = 1;

					lastPos.x = prev[k]; // x of the last point
					lastPos.y = prev[k+1]; // y of the last point
				}
			}


			// array that is refresh every instruction + argument given
			const arr = [mode.toUpperCase()];

			// if it's H or V instruction, keep the last X or Y
			const hv = ['H', 'V'].indexOf(arr[0]);


			// add each argument that are following the instruction
			for(let j=0; j < nArg; j++) {
				i++;

				const n = parseFloat(p[i]);

				// it must be a number
				if(isNaN(n)) {
					return;
				}

				// push the treated argument
				arr.push(n);
			}


			// only for H or V
			if(hv !== -1) {
				arr.push(lastPos[Object.keys(lastPos)[1-hv]]);
			}

			if(arr[0] === 'A') {
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
			if(arr[0] === 'A') {
				// arr = ['A', x, y, r, start, end, acw]
				const angle = radian(arr[5]);

				const x = arr[1] + cos(angle) * arr[3]
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

	if(NOX_PV.bFill)
		ctx.fill();

	if(NOX_PV.bStroke)
		ctx.stroke();
}




/**
 * Adds a text to the current sub-path
 * @param {string} txt text to be displayed
 * @param {number} x text's X position
 * @param {number} y text's Y position
 * @example
 * text('Hello world', 20, 20)
 */
export const text = (txt, x=0, y=0) => {
	// multiple lines
	if(/\n/.test(txt)) {
		const size = parseInt(NOX_PV.fontSize.replace(/(\d+)(\w+)?/, '$1'));
		txt = txt.split('\n');

		for(let i=0; i < txt.length; i++) {
			ctx.fillText(txt[i], x - NOX_PV.cam.x, y - NOX_PV.cam.y + i * size);
		}
	}

	// one line
	else {
		ctx.fillText(txt, x - NOX_PV.cam.x, y - NOX_PV.cam.y);
	}
};




/**
 * Text settings - sets the size and the font-family
 * @param {number} size font size
 * @param {string} font font name
 * @example
 * setFont(15, 'Monospace')
 */
export const setFont = (size, font) => {
	ctx.font = `${size}px ${font}`;
	NOX_PV.fontSize = `${size}px`;
	NOX_PV.fontFamily = font;
};



/**
 * Sets the font size of the text
 * @param {number} size font size
 * @example
 * fontSize(20)
 */
export const fontSize = size => {
	ctx.font = `${size}px ${NOX_PV.fontFamily}`;
	NOX_PV.fontSize = `${size}px`;
};



/**
 * Sets the font-family of the text
 * @param {string} font font-family
 * @example
 * fontFamily('Monospace')
 */
export const fontFamily = font => {
	ctx.font = `${NOX_PV.fontSize} ${font}`;
	NOX_PV.fontFamily = font;
};



/**
 * Change the text's alignement
 * @param {CanvasTextAlign} alignment text's alignment
 * @example
 * alignText('center')
 */
export const alignText = alignment => {
	ctx.textAlign = (['left', 'right', 'center', 'start', 'end'].indexOf(alignment) > -1) ? alignment : 'left';
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
export const bezierCurveTo = (cp1x, cp1y, cp2x, cp2y, x, y) => {
	ctx.bezierCurveTo(cp1x - NOX_PV.cam.x, cp1y - NOX_PV.cam.y, cp2x - NOX_PV.cam.x, cp2y - NOX_PV.cam.y, x - NOX_PV.cam.x, y - NOX_PV.cam.y);
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
export const quadraticCurveTo = (cpx, cpy, x, y) => {
	ctx.quadraticCurveTo(cpx - NOX_PV.cam.x, cpy - NOX_PV.cam.y, x - NOX_PV.cam.x, y - NOX_PV.cam.y);
};

/**
 * Applies a shadow to the shape that needs to be drawn.
 * @param {*} shadowColor The shadow's color
 * @param {number} shadowBlur The shadow's blur. Can be used for glow effect
 * @param {number} shadowOffsetX The shadow X-Axis offset
 * @param {number} shadowOffsetY The shadow Y-Axis offset
 */
const setShadow = (shadowColor, shadowBlur=0, shadowOffsetX=0, shadowOffsetY=0) => {
	ctx.shadowColor = NOX_PV.colorTreatment([shadowColor]);
	ctx.shadowBlur = shadowBlur;
	ctx.shadowOffsetX = shadowOffsetX;
	ctx.shadowOffsetY = shadowOffsetY;
};

/**
 * Removes the shadow settings if there's any.
 */
const removeShadow = () => {
	ctx.shadowColor = rgba(0, 0, 0, 0);
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
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
export const push = () => ctx.save();

/**
 * restores the most recently saved canvas state by popping the top entry in the drawing state stack.
 * If there is no saved state, this method does nothing.
 * @example
 * pop()
 */
export const pop = () => ctx.restore();

/**
 * Adds a translation transformation to the current matrix.
 * @param {number} x Distance to move in the horizontal direction. Positive values are to the right, and negative to the left.
 * @param {number} y Distance to move in the vertical direction. Positive values are down, and negative are up.
 * @example
 * translate(100, 200)
 */
export const translate = (x, y) => ctx.translate(x, y);

/**
 * Adds a rotation to the transformation matrix.
 * @param {number} degree The rotation angle, clockwise in degree. You can use radian(deg) to calculate a radian from a degree.
 * @example
 * rotate(45) // rotates 45 degrees
 */
export const rotate = degree => ctx.rotate(radian(degree));

/**
 * turns the current or given path into the current clipping region.
 * The previous clipping region, if any, is intersected with the current or given path to create the new clipping region.
 * @param  {Path2D} path A Path2D path to use as the clipping region.
 * @param {string} fillRule The algorithm by which to determine if a point is inside or outside the clipping region. Possible values:
 * - 'nonzero': The non-zero winding rule. Default rule.
 * - 'evenodd': The even-odd winding rule.
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
export const clip = (...args) => ctx.clip(...args);

/**
 * Adds a scaling transformation to the canvas units horizontally and/or vertically.
 * @param {number} x Scaling factor in the horizontal direction. A negative value flips pixels across the vertical axis. A value of 1 results in no horizontal scaling.
 * @param {number} y Scaling factor in the vertical direction. A negative value flips pixels across the horizontal axis. A value of 1 results in no vertical scaling.
 */
export const scale = (x, y=x) => ctx.scale(x, y);



/**
 * Says to not fill next hapes
 */
export const noFill = () => {
	NOX_PV.bFill = false;
};

/**
 * Says to not stroke next shapes
 */
export const noStroke = () => {
	NOX_PV.bStroke = false;
};


/**
 * Changes the canvas color
 * @param  {...any} color background color
 */
export const background = (...color) => {
	canvas.style.backgroundColor = NOX_PV.colorTreatment(...color);
};

/**
 * Sets the stroke color for next shapes to draw
 * @param  {...any} color Stroke color
 */
export const stroke = (...color) => {
	ctx.strokeStyle = NOX_PV.colorTreatment(...color);
	NOX_PV.bStroke = true;
};

/**
 * Sets the strokeweight for next shapes to draw
 * @param {number} weight weight of the stroke
 */
export const strokeWeight = weight => {
	ctx.lineWidth = weight;
};

/**
 * Set the linecap style
 * @param {CanvasLineCap} style linecap style
 */
export const linecap = style => {
	ctx.lineCap = ['butt', 'round', 'square'].indexOf(style) > -1 ? style : 'butt';
};


/**
 * Set the fill color for shapes to draw
 * @param  {...any} color Fill color
 */
export const fill = (...color) => {
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
export const createLinearGradient = (x1, y1, x2, y2) => ctx.createLinearGradient(x1, y1, x2, y2);

/**
 * Creates a gradient along the line connecting two given coordinates.
 * Fills the gradient with given values. It's to merge createLinearGradient() and gradient.addColorStop() in one function.
 * @param {number} x1 The x-axis coordinate of the start point.
 * @param {number} y1 The y-axis coordinate of the start point.
 * @param {number} x2 The x-axis coordinate of the end point.
 * @param {number} y2 The y-axis coordinate of the end point.
 * @param  {(offset:number, color:string)} params The color parameters. It has to be as pair : offset (between 0 & 1), and color
 * @return {CanvasGradient} A linear CanvasGradient initialized with the specified line and colors.
 * @example
 * makeLinearGradient(0, 0, width, height, 0, 'black', 1, 'white')
 */
export const makeLinearGradient = (x1, y1, x2, y2, ...params) => {
	if(params.length % 2 !== 0) {
		return console.error('you have to tell params by pair (offset, color). Odd number of arguments given.');
	}

	const grad = createLinearGradient(x1, y1, x2, y2);

	for(let i=0; i < params.length; i += 2) {
		const offset = params[i];
		const color = NOX_PV.colorTreatment(params[i + 1]);

		grad.addColorStop(offset, color);
	}

	return grad;
};

/**
 * Clears the canvas from x,y to x+w;y+h
 * Erases the pixels in a rectangular area.
 * @param {number} x The x-axis coordinate of the rectangle's starting point.
 * @param {number} y The y-axis coordinate of the rectangle's starting point.
 * @param {number} w The rectangle's width. Positive values are to the right, and negative to the left.
 * @param {number} h The rectangle's height. Positive values are down, and negative are up.
 * @example
 * clearRect(0, 0, width, height)
 */
export const clearRect = (x, y, w, h) => ctx.clearRect(x - NOX_PV.cam.x, y - NOX_PV.cam.y, w, h);


/**
 * starts a new path by emptying the list of sub-paths.
 * Call this method when you want to create a new path.
 * @example
 * beginPath()
 */
export const beginPath = () => ctx.beginPath();

/**
 * attempts to add a straight line from the current point to the start of the current sub-path.
 * If the shape has already been closed or has only one point, this function does nothing.
 * @example
 * closePath()
 */
export const closePath = () => ctx.closePath();

/**
 * Draws a focus ring around the current or given path, if the specified element is focused.
 * @param {Element|Path2D} elementOrPath2D A Path2D path to use.
 * @param {Element} element The element to check whether it is focused or not.
 * @example
 * drawFocusIfNeeded(button1)
 */
export const drawFocusIfNeeded = (elementOrPath2D, element = null) => {
	if(elementOrPath2D instanceof Element) {
		ctx.drawFocusIfNeeded(elementOrPath2D);
	}
	else {
		ctx.drawFocusIfNeeded(elementOrPath2D, element);
	}
};


/**
 * Sets line dashes to current path
 * @param {Array} array line dash to set to the current path
 * @example
 * setLineDash([5, 15])
 */
export const setLineDash = array => {
	if(!Array.isArray(array)) {
		return console.error('Array type expected. Got ' + typeof array);
	}

	ctx.setLineDash(array);
};

/**
 * Returns the ctx.getLineDash() function's value
 * @return {Array} An Array of numbers that specify distances to alternately draw a line and a gap (in coordinate space units).
 * If the number, when setting the elements, is odd, the elements of the array get copied and concatenated.
 * For example, setting the line dash to [5, 15, 25] will result in getting back [5, 15, 25, 5, 15, 25].
 * console.info(getLineDash())
 */
export const getLineDash = () => ctx.getLineDash();

/**
 * Specifies the alpha (transparency) value that is applied to shapes and images before they are drawn onto the canvas.
 * @param {number} globalAlpha A number between 0.0 (fully transparent) and 1.0 (fully opaque), inclusive. The default value is 1.0.
 * Values outside that range, including Infinity and NaN, will not be set, and globalAlpha will retain its previous value.
 * @example
 * globalAlpha(0.5)
 */
export const globalAlpha = globalAlpha => {
	ctx.globalAlpha = globalAlpha;
};

/**
 * Sets the type of compositing operation to apply when drawing new shapes.
 * @param {GlobalCompositeOperation} type a string identifying which of the compositing or blending mode operations to use.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation for more details
 * @example
 * globalCompositeOperation('soft-light')
 */
export const globalCompositeOperation = type => {
	ctx.globalCompositeOperation = type;
}

/**
 * Sets the image smoothing quality
 * @param {ImageSmoothingQuality} quality smooth quality
 * @example
 * setSmoothingQuality('low')
 */
export const setSmoothingQuality = quality => {
	ctx.imageSmoothingQuality = quality;
};

/**
 * Reports whether or not the specified point is contained in the current path.
 * @param {number|Path2D} x either x point coordinate or path2D. unaffected by the current transformation of the context. If path is unspecified, current path is used.
 * @param {number} y either x or y point coordinate, following the 1st argument's type. unaffected by the current transformation of the context.
 * @param {CanvasFillRule} fillRule The algorithm by which to determine if a point is inside or outside the path. 'nonzero' (default) or 'evenodd'
 * @return {boolean} A boolean, which is true if the specified point is contained in the current or specified path, otherwise false.
 * @example
 * if(isPointInPath(30, 20)) {
 * 	// ... do stuff
 * }
 */
export const isPointInPath = function(x, y, fillRule='nonzero') {
	return ctx.isPointInPath(...arguments);
};

/**
 * Reports whether or not the specified point is inside the area contained by the stroking of a path.
 * @param {number|Path2D} x The x-axis coordinate of the point to check. (or Path2D)
 * @param {number} y The y-axis coordinate of the point to check.
 * @return {boolean} A boolean, which is true if the point is inside the area contained by the stroking of a path, otherwise false.
 * @example
 * if(isPointInStroke(30, 40)) {
 * 	// ... do stuff
 * }
 */
export const isPointInStroke = function(x, y) {
	return ctx.isPointInStroke(...arguments);
};

/**
 * Retrieves the current transformation matrix being applied to the context.
 * @return {DOMMatrix} A DOMMatrix object.
 * @example
 * const transformMatrix = getTransform()
 */
export const getTransform = () => ctx.getTransform();

/**
 * Sets the line dash offset.
 * @param {number} value A float specifying the amount of the line dash offset. The default value is 0.0.
 * @example
 * lineDashOffset(1)
 */
export const lineDashOffset = (value=0.0) => {
	ctx.lineDashOffset = value;
};

/**
 * Determines the shape used to join two line segments where they meet.
 * This property has no effect wherever two connected segments have the same direction, because no joining area will be added in this case.
 * Degenerate segments with a length of zero (i.e., with all endpoints and control points at the exact same position) are also ignored.
 * @param {CanvasLineJoin} type 'round', 'bevel' or 'miter'
 * @example
 * lineJoin('round')
 */
export const lineJoin = type => {
	ctx.lineJoin = type;
};

/**
 * Returns a TextMetrics object that contains information about the measured text.
 * @param {string} text text string to measure
 * @return {TextMetrics} A TextMetrics object.
 * @example
 * const textLength = measureText('Hello world')
 */
export const measureText = text => ctx.measureText(text);

/**
 * Resets the current transform to the identity matrix.
 * @example
 * resetTransform()
 */
export const resetTransform = () => ctx.resetTransform();

/**
 * Sets the transformation matrix that will be used when rendering the pattern during a fill or stroke painting operation.
 * @param {DOMMatrix2DInit} transform transform matrix, or 6 numbers parameters
 * @example
 * setTransform(1, .2, .8, 1, 0, 0)
 */
export const setTransform = (...transform) => ctx.setTransform(...transform);


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
 * @param {'repeat'|'repeat-x'|'repeat-y'|'no-repeat'} repetition A DOMstring indicating how to repeat the pattern's image.
 * Possible values are:
 * 	- 'repeat' (both directions) (default)
 * 	- 'repeat-x' (horizontal only)
 * 	- 'repeat-y' (vertical only)
 * 	- 'no-repeat' (neither direction)
 * @example
 * const img = new Image();
 * img.src = 'my/image.png';
 * img.onload = () => {
 * 	const pattern = createPattern(img, 'repeat');
 * 	fill(pattern);
 * 	fillRect(0, 0, 300, 300);
 * };
 */
export const createPattern = (image, repetition='repeat') => {
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
export const createImageData = function(widthOrImageData, height=null) {
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
export const putImageData = (imageData, dx, dy, dirtyX=null, dirtyY=null, dirtyWidth=null, dirtyHeight=null) => {
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
export const getImageData = (sx, sy, sw, sh) => ctx.getImageData(sx, sy, sw, sh);


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
export const drawImage = (image, sx, sy, sWidth=null, sHeight=null, dx=null, dy=null, dWidth=null, dHeight=null) => {
	if(sWidth === null) {
		ctx.drawImage(image, sx - NOX_PV.cam.x, sy - NOX_PV.cam.y);
	} else if(dx === null) {
		ctx.drawImage(image, sx - NOX_PV.cam.x, sy - NOX_PV.cam.y, sWidth, sHeight);
	} else {
		ctx.drawImage(image, sx, sy, sWidth, sHeight, dx - NOX_PV.cam.x, dy - NOX_PV.cam.y, dWidth, dHeight);
	}
};




/** MATHEMATICAL FUNCTIONS SECTION */



/**
 * Convert from degrees to radians
 * @param {number} deg degree value
 * @example
 * radian(45)
 */
export const radian = deg => deg * (PI / 180);

/**
 * Convert from radians to degrees
 * @param {number} rad radian value
 * @example
 * degree(0.3)
 */
export const degree = rad => rad * (180 / PI);

/**
 * Convert an angle to a vector (class instance) (2d vector)
 * @param {number} angle angle in radian
 * @example
 * const v = angleToVector(45); // Vector{x: 0.52, y: 0.85}
 */
export const angleToVector = angle => new Vector(cos(angle), sin(angle));

/**
 * Returns the angle in degree of a given vector from the default vector (1,0)
 * @param {Vector} vector vector to calculate its angle
 * @example
 * const angle = vectorToAngle(1, 1)
 */
export const vectorToAngle = vec => {
	// horizontal vector - we don't care about its mag, but its orientation
	const baseVector = new Vector(1, 0);
	let angle = angleBetweenVectors(baseVector, vec);

    if(vec.y > 0)
        angle *= -1;

    return angle%360;
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
export const angleBetweenVectors = (a, b) => {
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
export const dist = (a, b) => {
	const x = b.x - a.x;
	const y = b.y - a.y;
	const z = b.z - a.z;
	return sqrt(x*x + y*y + z*z);
};

/**
 * Returns a new vector, the magnitude of the two given.
 * @param {Vector} a first point
 * @param {Vector} b second point
 * @returns {Vector} The resulting magnitude vector
 */
export const mag = (a, b) => new Vector(b.x - a.x, b.y - a.y);

/**
 * range mapping of a value
 * @param {number[]|number} val value - can be either an array or a number
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
export const map = (arrayOrValue, start1, end1, start2, end2) => {
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
export const pow = (n, p = 2) => Math.pow(n, p);

/**
 * Returns the absolute value of the given one
 * @param {number} n value
 * @example
 * abs(-1); // 1
 * abs(1); // 1
 */
export const abs = n => (n >= 0) ? n : -n;

/**
 * Returns the sqrt of the given value
 * @param {number} n value
 * @example
 * sqrt(16); // 4
 */
export const sqrt = n => Math.sqrt(n);

/**
 * Returns the minimum of given values
 * @param  {...number} values value(s)
 * @example
 * min(0, 1, 2, 3, -1); // -1
 */
export const min = (...values) => Math.min(...values);

/**
 * Returns the maximum of given values
 * @param  {...number} values value(s)
 * @example
 * max(0, 1, 2, 3, -1); // 3
 */
export const max = (...values) => Math.max(...values);

/**
 * Clamps the value b between a and c and returns it.
 * @param {number} a The bottom value of the interval
 * @param {number} b The value to clamp between a and c
 * @param {number} c The top value of the interval
 * @returns {number} The clamped value
 * @example
 * clamp(0, -1, 1); // 0
 * clamp(0, 2, 1); // 1
 * clamp(0, 50, 100); // 50
 */
export const clamp = (a, b, c) => max(a, min(b, c));

/**
 * Returns the rounded value of the given one
 * @param {number} n value
 * @example
 * round(3.1); // 3
 * round(3.5); // 4
 */
export const round = n => Math.round(n);

/**
 * Returns the floored value of the given one
 * @param {number} n value
 * @example
 * floor(3.1); // 3
 * floor(3.9); // 3
 * floor(-3.1); // -4
 */
export const floor = n => Math.floor(n);

/**
 * Returns the ceiled value of the given one
 * @param {number} n value
 * @example
 * ceil(3.1); // 4
 * ceil(3.9); // 4
 * ceil(-3.1); // 3
 */
export const ceil = n => Math.ceil(n);

/**
 * Returns the trunced value of the given one
 * @param {number} n value
 * @example
 * trunc(3.1); // 3
 * trunc(3.9); // 3
 * trunc(-3.1); // 3
 */
export const trunc = n => Math.trunc(n);


/**
 * Returns a random integer in a given interval. If 1 argument given, minimum is set to 0.<br>
 * If no argument is given, then just returns a floating value between 0 and 1.
 * @param {number} min minimal value
 * @param {number} max maximal value
 * @example
 * random(100); // a random int between 0 and 100
 * random(20, 25); // a random int between 20 and 25
 * random(-25); // a random between -25 and 0
 * random(); // a random float between 0 and 1
 */
export const random = (iMin=null, iMax = 0) => iMin===null? Math.random() : floor(random() * (max(iMin, iMax) - min(iMin, iMax) + 1)) + min(iMin, iMax);


/**
 * Returns the sinus of a number
 * @param {number} x A number
 * @example
 * sin(3); // 0.1411
 */
export const sin = x => Math.sin(x);


/**
 * Returns the cosinus of a number
 * @param {number} x A number
 * @example
 * cos(3); // -0.9899
 */
export const cos = x => Math.cos(x);


/**
 * Returns the tangent of a number
 * @param {number} x A number
 * @example
 * tan(3); // -0.1425
 */
export const tan = x => Math.tan(x);


/**
 * Returns the asinus of a number
 * @param {number} x A number
 * @example
 * asin(-2); // NaN
 * asin(-1); // -1.5707
 * asin(0); // 0
 * asin(0.5); // 0.5235
 */
export const asin = x => Math.asin(x);


/**
 * Returns the acosinus of a number
 * @param {number} x A number
 * @example
 * acos(2); // NaN
 * acos(0.8); // 0.64350
 */
export const acos = x => Math.acos(x);


/**
 * Returns the atangent of a number
 * @param {number} x A number
 * @example
 * atan(1.6); // 1.03
 * atan(0.8); // 0.674740
 */
export const atan = x => Math.atan(x);


/**
 * Returns the atan2 of a number
 * @param {number} x A number
 * @param {number} x A number
 * @example
 *
 */
export const atan2 = (x, y) => Math.atan2(y, x);


/**
 * Returns the sinh of a number
 * @param {number} x A number
 * @example
 *
 */
export const sinh = x => Math.sinh(x);

/**
 * Returns the cosh of a number
 * @param {number} x A number
 * @example
 *
 */
export const cosh = x => Math.cosh(x);


/**
 * Returns the exponential of e^x, where x is the argument, and e is Euler's number
 * @param {number} x A number
 * @example
 * exp(0); // 1
 * exp(1); // 2.71828
 */
export const exp = x => Math.exp(x);


/**
 * Returns the logarithm of a number
 * @param {number} x A number
 * @example
 * log(0); // -Infinity
 * log(1); // 0
 * log(2); // 0.69314
 */
export const log = x => Math.log(x);


/**
 * Returns the base 10 logarithm of a number
 * @param {number} x x value to return its log10
 * @example
 * log10(0); // -Infinity
 * log10(1); // 0
 * log10(2); // 0.3010
 */
export const log10 = x => Math.log10(x);

/**
 * Returns the sum of all values in a list
 * @param  {...number} values all values of a list
 * @example
 * sum(1, 2, 3); // 1+2+3 = 6
 */
export const sum = (...values) => values.reduce((a, b) => a + b);

/**
 * Returns the mean of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * mean(1, 2, 3); // 2
 */
export const mean = (...values) => sum(...values) / values.length;

/**
 * Returns the median of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * median(1, 2, 3);
 */
export const median = (...values) => {
	if(values.length === 0)
		return 0;

	values.sort((a, b) => a - b);

	const half = floor(values.length / 2);

	if(values.length % 2)
		return values[half];

	return (values[half - 1] + values[half]) / 2.0;
};

/**
 * Returns the mode of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * mode(1, 2, 3)
 */
export const mode = (...values) => values.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), null);

/**
 * Returns the variance of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * variance(1, 2, 3)
 */
export const variance = (...values) => values.reduce((a, b) => a + pow((b - mean(...values))), 0);

/**
 * Returns the standard deviation of the values in a list
 * @param  {...number} values all values of a list
 * @example
 * std(1, 2, 3)
 */
export const std = (...values) => sqrt(variance(...values));






//////////////////////////
// EASING FUNCTIONS
// https://spicyyoghurt.com/tools/easing-functions
/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeLinear = (t, b, c, d) => c * t / d + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInQuad = (t, b, c, d) => c * (t /= d) * t + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutQuad = (t, b, c, d) => -c * (t /= d) * (t - 2) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutQuad = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t + b : -c / 2 * ((--t) * (t - 2) - 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInSine = (t, b, c, d) => -c * cos(t / d * (PI / 2)) + c + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutSine = (t, b, c, d) => c * sin(t / d * (PI / 2)) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutSine = (t, b, c, d) => -c / 2 * (cos(PI * t / d) - 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInExpo = (t, b, c, d) => (t === 0) ? b : c * pow(2, 10 * (t / d - 1)) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutExpo = (t, b, c, d) => (t === d) ? b + c : c * (-pow(2, -10 * t / d) + 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutExpo = (t, b, c, d) => (t === 0) ? b :
	(t === d)
		? b + c
		: ((t /= d / 2) < 1)
			? c / 2 * pow(2, 10 * (t - 1)) + b
			: c / 2 * (-pow(2, -10 * --t) + 2) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInCirc = (t, b, c, d) => -c * (sqrt(1 - (t /= d) * t) - 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutCirc = (t, b, c, d) => c * sqrt(1 - (t = t / d - 1) * t) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutCirc = (t, b, c, d) => ((t /= d / 2) < 1) ? -c / 2 * (sqrt(1 - t * t) - 1) + b : c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInCubic = (t, b, c, d) => c * (t /= d) * t * t + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutCubic = (t, b, c, d) => c * ((t = t / d - 1) * t * t + 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutCubic = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t * t + b : c / 2 * ((t -= 2) * t * t + 2) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInQuart = (t, b, c, d) => c * (t /= d) * t * t * t + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutQuart = (t, b, c, d) => -c * ((t = t / d - 1) * t * t * t - 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutQuart = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t * t * t + b : -c / 2 * ((t -= 2) * t * t * t - 2) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInQuint = (t, b, c, d) => c * (t /= d) * t * t * t * t + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutQuint = (t, b, c, d) => c * ((t = t / d - 1) * t * t * t * t + 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutQuint = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInBack = (t, b, c, d) => c * (t /= d) * t * (2.7 * t - 1.7) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutBack = (t, b, c, d) => c * ((t = t / d - 1) * t * (2.7 * t + 1.7) + 1) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutBack = (t, b, c, d) => ((t /= d / 2) < 1) ? c / 2 * (t * t * (3.5925 * t - 1.7)) + b : c / 2 * ((t -= 2) * t * (3.5925 * t + 1.7) + 2) + b;

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInElastic = (t, b, c, d) => NOX_PV.easeElastic('in', t, b, c, d);

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeOutElastic = (t, b, c, d) => NOX_PV.easeElastic('out', t, b, c, d);

/**
 * Returns the coordinate of a point on time t, on a trajectory from b to b+c, with a duration of d.
 * @param {number} t Time passed during the beginning of the animation
 * @param {number} b Beginning - starting point of the animation - Usually static
 * @param {number} c The amount of change during the animation - Usually static
 * @param {number} d The duration of the animation - Usually static
 * @returns {number} The new position's value
 */
export const easeInOutElastic = (t, b, c, d) => NOX_PV.easeElastic('inout', t, b, c, d);

/**
 *
 * @param {number|Vector} v The source value to move to the given target. It can be a number or a Vector.
 * @param {number|Vector} t The target coordinate. If v is a number, the target is a number, otherwise it's a Vector.
 * @param {number} p The percentage of offset to move the value forword
 * @example
 * let x = 0;
 * let target = 100;
 *
 * function update() {
 *     x = lerp(x, target, 0.2);
 * }
 *
 * // or
 *
 * let position = new Vector(0, 0);
 * let target = new Vector(100, 200);
 *
 * function update() {
 *     // even if it returns the vector
 *     // it modifies it by reference.
 *     lerp(position, target, 0.2);
 * }
 */
export const lerp = (v, t, p) => {
	if(v instanceof Vector && t instanceof Vector) {
		v.x = lerp(v.x, t.x, p);
		v.y = lerp(v.y, t.y, p);
		return v;
	}
	else if(typeof v === 'number' && typeof t === 'number') {
		return v + (t - v) * p;
	}

	return 0;
};

/**
 * Sets the frame rate of the canvas - only positive number allowed
 * @param {number} f frame rate
 * @example
 * frameRate(60)
 */
export const frameRate = f => { if(f >= 0) NOX_PV.interval = 1000 / f; };




/**
 * Returns last swipe direction
 * @return {'left'|'right'|'up'|'down'} the last swipe direction.
 * @example
 * const lastSwipe = getSwipe();
 */
export const getSwipe = () => NOX_PV.lastSwipe;

/**
 * Returns the number of seconds passed since the script started to run.
 * @returns {number}
 */
export const getSecondsPassed = () => NOX_PV.timer.asSeconds();

/**
 * Returns the number of milliseconds passed since the script started to run.
 * @returns {number}
 */
export const getMSPassed = () => NOX_PV.timer.asMilliseconds();




// key events

/**
 * Returns either the key is currently down or not
 * @param {number} key the key code
 * @return {boolean}
 * @example
 * if(isKeyDown(keyQ)) {
 * 	// ... do stuff
 * }
 */
export const isKeyDown = key => NOX_PV.keys[key];

/**
 * Returns either the key is currently up or not (not down)
 * @param {number} key the key code
 * @return {boolean}
 * @example
 * if(isKeyUp(keyQ)) {
 * 	// ... do stuff
 * }
 */
export const isKeyUp = key => !NOX_PV.keys[key];



/**
 * Returns the mouse's direction.
 * If mouse is not moving, returns null.
 * @return {{x: number, y: number}|'TOP_LEFT'|'UP'|'TOP_RIGHT'|'LEFT'|'RIGHT'|'BOTTOM_LEFT'|'DOWN'|'BOTTOM_RIGHT'|null} mouse's direction.
 * @example
 * if(mouseDir() === 'RIGHT') {
 * 	// ... do stuff
 * }
 */
export const mouseDir = () =>
	NOX_PV.isPointerLocked ?
		mouseDirection
		:
		(mouseX > NOX_PV.oldMouseX && mouseY > NOX_PV.oldMouseY) 	? 'BOTTOM_RIGHT' :
		(mouseX > NOX_PV.oldMouseX && mouseY < NOX_PV.oldMouseY) 	? 'TOP_RIGHT' :
		(mouseX < NOX_PV.oldMouseX && mouseY < NOX_PV.oldMouseY) 	? 'TOP_LEFT' :
		(mouseX < NOX_PV.oldMouseX && mouseY > NOX_PV.oldMouseY) 	? 'BOTTOM_LEFT' :
		(mouseX > NOX_PV.oldMouseX && mouseY === NOX_PV.oldMouseY) 	? 'RIGHT' :
		(mouseX === NOX_PV.oldMouseX && mouseY > NOX_PV.oldMouseY) 	? 'DOWN' :
		(mouseX === NOX_PV.oldMouseX && mouseY < NOX_PV.oldMouseY) 	? 'UP' :
		(mouseX < NOX_PV.oldMouseX && mouseY === NOX_PV.oldMouseY) 	? 'LEFT' :
		null;



/**
 * Resizes the canvas, affecting context too.
 * @param {number} newWidth canvas width
 * @param {number} newHeight canvas height
 */
export const setCanvasSize = (newWidth, newHeight) => {
	if(canvas && ctx) {
		canvas.style.width = newWidth + 'px';
		canvas.style.height = newHeight + 'px';

		canvas.width = newWidth;
		canvas.height = newHeight;

		width = newWidth;
		height = newHeight;

        if(camera.anchorType === Camera.ANCHOR_CENTER)
            camera.anchorPoint.set(width/2, height/2);
	}

	else {
		console.warn('No canvas created yet, so cannot apply changes for its size.');
	}
};

/**
 * Either enables or disables the automatic canvas resizing.
 * @param {boolean} enable Either it has to enable or not this feature.
 * @param {boolean} onceDone Either it has to resize when the user stopped resize the page or at any resize moment.
 */
export const setAutoResize = (enable, onceDone=true) => {
	NOX_PV.autoResize = enable? (onceDone? 2 : 1) : 0;
};










/**
 * Creates a new canvas. If already created, then remove the current one and create another canvas
 * @param {number} w width of the canvas
 * @param {number} h height of the canvas
 * @param {Color} bg canvas background color
 * @param {boolean} requestPointerLock request or not the pointer lock
 * @param {HTMLElement} container the html element the canvas will be in. Default is document.body
 * @return {HTMLCanvasElement} created canvas. this created canvas is stored in a global variable named 'canvas'
 * and its context named 'ctx'
 * @example
 * createCanvas(); // fullscreen canvas
 * createCanvas(500, 250); // 500x250 canvas size
 * createCanvas(MIN_DOC_SIZE, MIN_DOC_SIZE); // create a square canvas, depending on screen's size
 * createCanvas(200, 200, '#fff'); // create 200x200 canvas with white background
 * createCanvas(200, 200, 0, true); // create 200x200 canvas with black background, and enable requestPointerLock feature
 */
export const createCanvas = (w=null, h=null, bg='#000', requestPointerLock=false, container=document.body) => {
	if(w == null && h == null) {
		w = documentWidth();
		h = documentHeight();
	}

	if(w <= 0 || h <= 0) {
		console.warn('Canvas size must be higher than 0');
		return;
	}

	// if canvas already created, then remove it and recreate it
	if(canvas != null) {
		canvas.remove();
		canvas = null;
		ctx = null;
	}

	canvas = document.createElement('canvas');

	width = w;
	height = h;

	canvas.width = width;
	canvas.height = height;
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';

	canvas.id = 'nox-canvas';
	canvas.style.background = NOX_PV.colorTreatment(bg);

	if(camera.anchorType === Camera.ANCHOR_CENTER) {
		camera.setAnchor(Camera.ANCHOR_CENTER);
	}

	container.appendChild(canvas);

	if(requestPointerLock) {
		document.addEventListener('pointerlockchange', () => {
			if(!document.pointerLockElement || document.pointerLockElement.id != 'nox-canvas') {
				NOX_PV.isPointerLocked = false;
			}
		}, false);

		canvas.addEventListener('click', () => {
			if(!NOX_PV.isPointerLocked) {
				NOX_PV.isPointerLocked = true;
				canvas.requestPointerLock();
			}
		});
	}

	ctx = canvas.getContext('2d');

	initializeAllEventHandlers();

	return canvas;
};





/**
 * Shows cyan guidelines that are following the mouse on the canvas, telling the pixels x,y
 * It's mostly a dev feature
 * @param {boolean} bool either it shows or not
 * @example
 * showGuideLines(true)
 */
export const showGuideLines = bool => {
	NOX_PV.bGuideLines = `${bool}` === 'true';
};







/**
 * Sets the condition on when the draw function has to be executed (pause it if not)
 * @param {Function} condition condition in function
 * @example
 * setDrawCondition(() => x < 10);
 */
export const setDrawCondition = (condition = null) => {
	if(condition) {
		NOX_PV.drawCond = condition;
	}
};







/**
 * The draw loop. If drawCond returns true, then executes the draw function of the user that uses the library.
 * Manages the frame rate.
 * Show guide lines if enabled.
 * Clear then draw canvas if the draw() function has been created and if the drawCond() returns true.
 * Manages entities and camera.
 * Do not Call it.
 */
const drawLoop = () => {
	if(NOX_PV.loop === true)
		requestAnimationFrame(drawLoop);

	// Perfs
	const t0 = performance.now();

	if(NOX_PV.logPerfs && NOX_PV.drawLoopInfo.it === 0) {
		NOX_PV.drawLoopInfo.start = t0;
	}
	//

	// FPS
	NOX_PV.now = Date.now();
	NOX_PV.delta = NOX_PV.now - NOX_PV.then;


	// Camera
    if(camera.following) {
        camera.position.set(camera.followPoint.x, camera.followPoint.y);
    }

    else if(camera.moving) {
        const m = NOX_PV.camera.move;
        const t = m.start.asMilliseconds();
        const x = easeInOutQuad(t, m.from.x, m.length.x, m.duration);
        const y = easeInOutQuad(t, m.from.y, m.length.y, m.duration);

        if(t >= m.duration) {
            camera.position.set(m.from.x + m.length.x, m.from.y + m.length.y);
            NOX_PV.camera.move = null;
        }
        else
            camera.position.set(x, y);
    }
	//

	// UPDATE
	for(const module of NOX_PV.updateModules)
		module.update(NOX_PV.delta);

	NOX_PV.updateFunc(NOX_PV.delta); // user update function
	//

	// Perfs
	if(NOX_PV.logPerfs)
		NOX_PV.drawLoopInfo.t1 += performance.now() - t0;

	// FPS -> Draw
	if(NOX_PV.delta > NOX_PV.interval) {
		NOX_PV.then = NOX_PV.now - (NOX_PV.delta % NOX_PV.interval);

		if(NOX_PV.then - NOX_PV.firstThen > 99999) {
			NOX_PV.firstThen = NOX_PV.now;
			NOX_PV.then = NOX_PV.firstThen;
			NOX_PV.counter = 0;
		}

		NOX_PV.time_el = ((NOX_PV.then - NOX_PV.firstThen) / 1000) || 1;

		NOX_PV.counter++;

		fps = round(NOX_PV.counter / NOX_PV.time_el);

		// if canvas created & drawCond returns true
		if(ctx && NOX_PV.drawCond()) {
			const t = performance.now();

			push();
				clearRect(NOX_PV.cam.x, NOX_PV.cam.y, width, height); // clear the canvas

				// draw extra before the basic drawing
				for(const module of NOX_PV.renderingModules) {
					module.render();
				}

				// user draw function
				NOX_PV.drawFunc();

				// if guidelines enabled
				if(NOX_PV.bGuideLines) {
					push();
						fill('#46eaea'); stroke('#46eaea');
						strokeWeight(1);
						line(0, mouseY, width, mouseY);
						line(mouseX, 0, mouseX, height);
						text(`${floor(mouseX)}, ${floor(mouseY)}`, mouseX + 5, mouseY - 5);
					pop();
				}
			pop();

			// Perfs
			NOX_PV.drawLoopInfo.t2 += performance.now() - t;
		}
	}

	// Perfs
	if(NOX_PV.logPerfs) {
		NOX_PV.drawLoopInfo.it = (NOX_PV.drawLoopInfo.it + 1) % NOX_PV.drawLoopInfo.freq;

		if(NOX_PV.drawLoopInfo.it === 0) {
			NOX_PV.drawLoopInfo.t1 /= NOX_PV.drawLoopInfo.freq;
			NOX_PV.drawLoopInfo.t2 /= NOX_PV.drawLoopInfo.freq;

			const t1 = floor(NOX_PV.drawLoopInfo.t1 * 100) / 100;
			const t2 = floor(NOX_PV.drawLoopInfo.t2 * 100) / 100;
			const t3 = floor((t1 + t2) * 100) / 100;

			NOX_PV.drawLoopInfo.t1 = 0;
			NOX_PV.drawLoopInfo.t2 = 0;

			const data = {
				update: { ms: t1 },
				draw: { ms: t2 },
				total: { ms: t3 },
			};

			console.table(data);
		}
	}
};





/**
 * Disables draw loop. Draw only once.
 * @example
 * noLoop();
 */
export const noLoop = () => {
	NOX_PV.loop = false;
};


/**
 * Enables image's smoothing.
 * Context needs to exist
 * @example
 * enableSmoothing();
 */
export const enableSmoothing = () => {
	if(ctx) ctx.imageSmoothingEnabled = true;
}

/**
 * Disables image's smoothing.
 * Context needs to exist.
 * @example
 * disableSmoothing();
 */
export const disableSmoothing = () => {
	if(ctx) ctx.imageSmoothingEnabled = false;
}


/**
 * Enables the camera.
 */
export const disableCamera = () => {
    NOX_PV.camera.enabled = false;
    NOX_PV.cam = NOX_PV.camera.hud;
};

/**
 * Disables the camera.
 */
export const enableCamera = () => {
    NOX_PV.camera.enabled = true;
    NOX_PV.cam = camera;
};


/**
 * Loads an 1D array (imageData) for each pixels of the canvas.
 * Enable variable named 'pixels' which are the data of loaded pixels.
 * Each pixel has 4 values, rgba.
 * So pixels[0], pixels[1], pixels[2] and pixels[3] are the value of the first pixel.
 * @example
 * loadPixels();
 * pixels[0] = 255; // first pixel is now red
 */
export const loadPixels = () => {
	if(ctx instanceof CanvasRenderingContext2D && canvas instanceof HTMLCanvasElement) {
		NOX_PV.pixels = ctx.createImageData(canvas.width, canvas.height);
		pixels = NOX_PV.pixels.data;

		for(let i=0; i < width * height; i++) {
			pixels[i * 4 + 3] = 255; // enable max opacity (to see each pixels)
		}
	}

	else {
		console.warn('Can\'t load canvas\'s pixels : no existing context found.');
	}
};

/**
 * Sends the array of pixels to the canvas.
 * Directly draws on the canvas.
 * Isn't affacted by other canvas's functions like fill() or stroke()
 * @example
 * updatePixels();
 */
export const updatePixels = () => {
	if(typeof pixels !== 'undefined' && ctx instanceof CanvasRenderingContext2D) {
		NOX_PV.pixels.data = pixels;
		ctx.putImageData(NOX_PV.pixels, 0, 0);
	}
};








/**
 * Perlin Noise function.
 *
 * Code from : http://pub.phyks.me/sdz/sdz/bruit-de-perlin.html
 *
 * Returns the perlin noise value between 0 and 1 for a given point (x,y)
 *
 * Lazily generates the perlin seed if not existing.
 *
 * It's the perlin noise of the page, so seed will always be the same.
 *
 * To have multiple custom Perlin noise arrays, create PerlinNoise class instance instead.
 * @param {number} x X-axis point coordinate
 * @param {number} y Y-axis point coordinate
 * @return {number} floating point between 0 and 1
 * @example
 * const value = perlin(0, 0); // value between -1 and 1.
 */
export const perlin = (x, y=0) => {
	// create seed if never used perlin noise previously
	if(!NOX_PV.perlin.seed || NOX_PV.perlin.seed.length === 0) {
		NOX_PV.perlin.seed = NOX_PV.perlin.generateSeed();
	}

	return NOX_PV.perlin.get(x, y);
};

/**
 * Sets the level of details for the Perlin noise function.
 *
 * Default is 10. If given argument isn't a number, does nothing.
 * @param {number} detailLevel level of detail for Perlin noise function
 * @example
 * noiseDetails(200);
 */
export const noiseDetails = detailLevel => {
	if(typeof detailLevel === 'number') {
		NOX_PV.perlin.lod = detailLevel;
	}
};


/**
 * Generates a random UUID
 * @returns {string} the generated UUID
 * @see https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid#answer-21963136
 */
export const generateUUID = () => {
	const d0 = Math.random() * 0xffffffff | 0;
	const d1 = Math.random() * 0xffffffff | 0;
	const d2 = Math.random() * 0xffffffff | 0;
	const d3 = Math.random() * 0xffffffff | 0;
	return NOX_PV.lut[d0 & 0xff] + NOX_PV.lut[d0 >> 8 & 0xff] + NOX_PV.lut[d0 >> 16 & 0xff] + NOX_PV.lut[d0 >> 24 & 0xff] + '-' +
		NOX_PV.lut[d1 & 0xff] + NOX_PV.lut[d1 >> 8 & 0xff] + '-' + NOX_PV.lut[d1 >> 16 & 0x0f | 0x40] + NOX_PV.lut[d1 >> 24 & 0xff] + '-' +
		NOX_PV.lut[d2 & 0x3f | 0x80] + NOX_PV.lut[d2 >> 8 & 0xff] + '-' + NOX_PV.lut[d2 >> 16 & 0xff] + NOX_PV.lut[d2 >> 24 & 0xff] +
		NOX_PV.lut[d3 & 0xff] + NOX_PV.lut[d3 >> 8 & 0xff] + NOX_PV.lut[d3 >> 16 & 0xff] + NOX_PV.lut[d3 >> 24 & 0xff];
};



// CLASSES

/** COLOR MANAGMENT SECTION */

/* HSL convertions :
	https://gist.github.com/mjackson/5311256
*/

export class RGB {
	/**
	 * Creates a RGB[A] color
	 * @param {number} r red value [0 - 255]
	 * @param {number} g green value [0 - 255]
	 * @param {number} b blue value [0 - 255]
	 * @param {number} a alpha (opacity) value [0 - 255]
	 */
	constructor(r, g=null, b=null, a=255) {
		this.color = { r: 0, g: 0, b: 0 };

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
	get r() { return this.color.r; }

	/**
	 * Returns the green value of the color
	 * @return {number} green value
	 */
	get g() { return this.color.g; }

	/**
	 * Returns the blue value of the color
	 * @return {number} blue value
	 */
	get b() { return this.color.b; }

	/**
	 * Returns the alpha value of the color
	 * @return {number} alpha value
	 */
	get a() { return this.color.a; }

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
	 * @return {string}
	 * @example
	 * const color = new RGB(10, 20, 30);
	 * console.info(color); // rgb(10, 20, 30)
	 * console.info(color.toString()()); // is equivalent
	 *
	 * color.a = 100;
	 * console.info(color); // rgba(10, 20, 30, 0.3)
	 */
	toString() {
		return `rgb${this.a != 255 ? 'a' : ''}(${this.r}, ${this.g}, ${this.b}${this.a != 255 ? `, ${round(this.a / 255 * 10) / 10}` : ''})`;
	}

	/**
	 * Returns the values of the color as an Array
	 * @example
	 * const color = new RGB(10, 20, 30);
	 * console.info(color.intVal()); // [10, 20, 30]
	 * @return {number[]} array of values
	 */
	intVal() {
		return [this.r, this.g, this.b, this.a];
	}

	/**
	 * Returns a class instance of HEX, converting its color
	 * @return {HEX} converted hex color
	 * @example
	 * const color new RGB(255, 0, 0);
	 * console.info(color.toHEX()); // '#F00'
	 */
	toHEX() {
		let r = Number(this.r).toString()(16); if(r.length < 2) r = '0' + r;
		let g = Number(this.g).toString()(16); if(g.length < 2) g = '0' + g;
		let b = Number(this.b).toString()(16); if(b.length < 2) b = '0' + b;
		const rgb = '#' + r + g + b;

		return new HEX(rgb);
	}

	/**
	 * Returns a class instance of HSL, converting its color
	 * @return {HSL} converted HSL color
	 * @example
	 * const color = new RGB(255, 0, 0);
	 * console.info(color.toHSL()); // 'hsl(0, 50%, 50%)'
	 */
	toHSL() {
		const r = this.r / 255,
			g = this.g / 255,
			b = this.b / 255;

		const imax = max(r, g, b),
			imin = min(r, g, b);

		let h, s, l = (imax + imin) / 2;

		if(imax === imin) {
			h = s = 0;
		}

		else {
			const d = imax - imin;
			s = (l > 0.5) ? d / (2 - imax - imin) : d / (imax + imin);

			switch (imax) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		return new HSL(round(h * 10) / 10, round(s * 10) / 10, round(l * 10) / 10);
	}

}

export class HEX {
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
	 * @return {string} color value as string
	 * @example
	 * const color = new HEX('#fff');
	 * console.info(color); // '#FFF'
	 * console.info(color.toString()()); // is equivalent
	 */
	toString() { return this.color.str; }

	/**
	 * Returns the int value of the color
	 * @return {number} color value as int
	 */
	intVal() { return this.color.int; }

	/**
	 * Sets the new value of the color
	 * @param {string|number} hexaColor A string or a number as hexadecimal form
	 * @example
	 * const color = new HEX('#fff'); // white
	 * color.set('#f00'); // red
	 */
	set(hexaColor) {
		if(typeof hexaColor === 'number') {
			this.color.int = hexaColor;
			const h = hexaColor.toString()(16) + '';
			this.color.str = '#' + (h.length === 4 ? '00' : '') + h;
		}

		else if(typeof hexaColor === 'string' && /^#?([0-9a-f]{3}){1,2}$/i.test(hexaColor)) {
			hexaColor = hexaColor.replace('#', '');
			if(hexaColor.length === 3) hexaColor = hexaColor[0].repeat(2) + hexaColor[1].repeat(2) + hexaColor[2].repeat(2);
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
	 * const color = new HEX('#fff');
	 * console.info(color.toRGB()); // 'rgb(255, 255, 255)'
	 */
	toRGB() {
		const r = (this.intVal() & 0xFF0000) >>> 16;
		const g = (this.intVal() & 0xFF00) >>> 8;
		const b = this.intVal() & 0xFF;

		return new RGB(r, g, b);
	}

	/**
	 * Returns a class instance of HSL, converting its color
	 * @return {HSL} converted color to HSL
	 * @example
	 * const color = new HEX('#f00');
	 * console.info(color.toHSL()); // 'hsl(0, 50%, 50%)'
	 */
	toHSL() {
		return this.toRGB().toHSL();
	}
}

export class HSL {
	/**
	 * Creates HSL color
	 * @param {number} hue hue value [0 - 359] (360 = 0)
	 * @param {number} saturation saturation value [0 - 1]
	 * @param {number} light brightness value [0 - 1]
	 */
	constructor(hue, saturation=0.5, light=0.5) {
		this.color = { h: 0, s: 0, l: 0 };

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
	get h() { return this.color.h; }

	/**
	 * Returns the saturation value of the color
	 * @return {number} saturation
	 */
	get s() { return this.color.s; }

	/**
	 * Returns the brightness value of the color
	 * @return {number} brightness (luminosity)
	 */
	get l() { return this.color.l; }

	/**
	 * Sets the hue value of the color
	 * @param {number} hue value between 0 and 360. In all cases, it's bounded in the interval.
	 * @example
	 * const color = new HSL(0);
	 * color.h(50);
	 */
	set h(hue) {
		this.color.h = (hue >= 0) ? hue % 360 : 360 - (abs(hue) % 360);
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
	 * @return {string} value
	 * @example
	 * const color = new HSL(0);
	 * console.info(color); // 'hsl(0, 50%, 50%)'
	 * console.info(color.toString()()); // is equivalent
	 */
	toString() {
		return `hsl(${this.h}, ${this.s * 100}%, ${this.l * 100}%)`;
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
	 * console.info(color.toHEX()); // '#f00'
	 */
	toHEX() {
		return this.toRGB().toHEX();
	}

	/**
	 * Returns a class instance of RGB, converting its color
	 * @return {RGB} converted color to RGB
	 * @example
	 * const color = new HSL(0);
	 * console.info(color.toRGB()); // 'rgb(255, 0, 0)'
	 */
	toRGB() {
		const C = (1 - abs(2 * this.l - 1)) * this.s;
		const hh = this.h / 60;
		const X = C * (1 - abs(hh % 2 - 1));
		let r, g, b;

		r = g = b = 0;

		if(hh >= 0 && hh < 1) [r, g] = [C, X];
		else if(hh >= 1 && hh < 2) [r, g] = [X, C];
		else if(hh >= 2 && hh < 3) [g, b] = [C, X];
		else if(hh >= 3 && hh < 4) [g, b] = [X, C];
		else if(hh >= 4 && hh < 5) [r, b] = [X, C];
		else[r, b] = [C, X];

		const m = this.l - C / 2;

		r = round((r + m) * 255);
		g = round((g + m) * 255);
		b = round((b + m) * 255);

		return new RGB(r, g, b);
	}
}


export class PerlinNoise {
	static mapnumberTypes = ['default', 'rgb', 'hsl'];
	static getMapnumberTypeIndex = typeStr => PerlinNoise.mapnumberTypes.indexOf(typeStr)
	/**
	 *
	 * @param {number} lod level of details
	 * @param {number} x start x of the array
	 * @param {number} y start y of the array
	 * @param {number} w width of the array
	 * @param {number} h height of the array
	 * @param {string} mapnumber map values to [auto: (-1,1)], [rgb: (0,255)], [hsl: (0, 360)]
	 */
	constructor(lod=10, x=0, y=0, w=width, h=height, mapnumber='default') {
		this.lod = lod;
		this.seed = NOX_PV.perlin.generateSeed();
		this.start = { x, y };
		this.size = { width: w, height: h };
		this.array = [];
		this.numberMapStyle = PerlinNoise.getMapnumberTypeIndex(mapnumber);
		this.calculate();
	}

	/**
	 * Sets the level of detail for this class instance.
     *
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
     *
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
     *
	 * Default is [-1,1] (0).
     *
	 * You can choose [0,255] (1) or [0,360] (2).
	 * @param {0|1|2} mapnumber map style's index
	 * @example
	 * const p = new PerlinNoise();
	 * p.setMapNumber(1); // sets values between 0 and 255.
	 */
	setMapNumber(mapnumber) {
		mapnumber = PerlinNoise.getMapNumberTypeIndex(mapnumber);
		if(this.numberMapStyle === mapnumber) return;

		let Lmin = 0, Lmax = NOX_PV.perlin.unit, Rmin = 0, Rmax = NOX_PV.perlin.unit;

		if(this.numberMapStyle > 0) [Lmin, Lmax] = [0, (this.numberMapStyle === 1) ? 255 : 360];
		this.numberMapStyle = mapnumber;
		if(this.numberMapStyle > 0) [Rmin, Rmax] = [0, (this.numberMapStyle === 1) ? 255 : 360];

		this.array.forEach((row, i) => {
			this.array[i] = map(this.array[i], Lmin, Lmax, Rmin, Rmax);
		});
	}

	/**
	 * Calculates the noised array.
     *
	 * You normally don't have to call it.
     *
     * It's automatically called if an option is changed through methods.
	 * @example
	 * const p = new PerlinNoise();
	 * p.calculate();
	 */
	calculate() {
		this.array = [];

		for(let y = this.start.y; y < this.start.y + this.size.height; y++) {
			const row = [];

			for(let x = this.start.x; x < this.start.x + this.size.width; x++) {
				row.push(NOX_PV.perlin.get(x, y, this.lod, this.seed));
			}

			this.array.push(row);
		}

		if(this.numberMapStyle > 0) {
			this.setMapNumber(PerlinNoise.mapnumberTypes[this.numberMapStyle]);
		}
	}
}



export class Time {
	static units = {
		// unit => milliseconds to unit
		nano: ms => ms * 100000000,
		micro: ms => ms * 1000,
		milli: (t, unit = 'milli') => {
			switch (unit) {
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
	 * @param {'nano'|'micro'|'milli'|'seconds'|'minutes'} unity unity of given time (by default milliseconds).
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




export class Vector {
	/**
	 * Creates a vector of dimension 1, 2 or 3
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

		const tmp = { x: 0, y: 0, z: 0 };

		// import from another vector
		if(x instanceof Vector) {
			// same dimension
			dimension = x.dimension;
			tmp.x = x.x;
			tmp.y = x.y;
			tmp.z = x.z;
		}

		// create new vector
		else {
			dimension = Array.from(arguments).filter(a => typeof a === 'number').length;
			tmp.x = x;
			tmp.y = y;
			tmp.z = z;
		}

		// cannot modify the initial vector's dimension
		this.constants = Object.freeze({ dimension: dimension });
		this.set(tmp.x, tmp.y, tmp.z);
	}

	/**
	 * Returns the dimension of the vector
	 * @return {number} vector's dimension
	 * @example
	 * const v = new Vector(10, 10);
	 * console.info(v.dimension); // 2
	 */
	get dimension() { return this.constants.dimension; }

	/**
	 * Returns the x value of the vector
	 * @return {number} x value
	 * @example
	 * const v = new Vector(10, 20);
	 * console.info(v.x); // 10
	 */
	get x() { return this.coords.x; }

	/**
	 * Returns the y value of the vector.
	 * By default, for a 1D vector, Y equals 0.
	 * @return {number} y value
	 * @example
	 * const v = new Vector(10, 20);
	 * console.info(v.x); // 20
	 */
	get y() { return this.coords.y; }

	/**
	 * Returns the z value of the vector.
	 * By default, for a 1D or 2D vector, Z equals 0
	 * @return {number} z value
	 * @example
	 * const v = new Vector(10, 20, 30);
	 * console.info(v.x); // 30
	 */
	get z() { return this.coords.z; }

	/**
	 * Sets the x value of the vector
	 * @param {number} x A number
	 * @example
	 * const v = new Vector(10, 20);
	 * v.x = 10;
	 */
	set x(x) { this.coords.x = x; }

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

    copy() {
        return new Vector(this);
    }

	/**
	 * Adapts the vector on a scale of 1
	 * @param {boolean} apply either it should apply the changes to the vector or just return it
	 * @return {Vector} the vector (modified or not following 'apply' argument (by default false)).
	 * @example
	 * const v = new Vector(10);
	 * v.normalize(true); // now v.x = 1;
	 *
	 * v.set(20);
	 * const v2 = v.normalize(); // v.x = 20, v2.x = 1
	 */
	normalize(apply=false) {
		// does not care about vector dimension
		const norm = Math.hypot(this.x, this.y, this.z);

		if(!apply) {
			return new Vector(this).normalize(true);
		}

		if(norm !== 0) {
			this.x = this.x / norm;

			if(this.dimension > 1) {
				this.y = this.y / norm;

				if(this.dimension === 3) {
					this.z = this.z / norm;
				}
			}
		}

		return this;
	}

	/**
	 * Changes the vector's values.
	 * If vector's dimension is lower than number of argument passed, it does not change the value for it.
	 * @param {number|Vector} x new X
	 * @param {number} y new y
	 * @param {number} z new z
	 * @example
	 * const v = new Vector(10, 20, 30);
	 * v.set(30, 20, 10);
	 */
	set(x, y=null, z=null) {
		if(x instanceof Vector) {
			this.x = x.x;
			if(this.dimension === 2) this.y = x.y;
			if(this.dimension === 3) this.z = x.z;
		}

		else if(typeof x !== 'number') {
			return console.error('[Error] Vector::set : x parameter must be a number or a Vector');
		}

		else {
			if(this.dimension > 1) {
				if(y !== null && typeof y !== 'number') {
					return console.error('[Error] Vector::set : y parameter must be a number');
				}

				if(z !== null && this.dimension > 2 && typeof z !== 'number') {
					return console.error('[Error] Vector::set : z parameter must be a number');
				}
			}

			this.x = x;

			if(this.dimension > 1) {
				if(y !== null) {
					this.y = y;
				}

				if(this.dimension === 3 && z != null) {
					this.z = z;
				}
			}
		}

		return this;
	}

	/**
	 * Adds values to the vector and returns it.
	 * @param {Vector|number} x
	 * @param {number} y
	 * @param {number} z
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(10, 10);
	 * const v2 = new Vector(20, 20);
	 * const v3 = v.add(1, 2); // now v{x: 11, y: 12} and v3 is same
	 * v2.add(v); // now v2{x: 31, y: 32}
	 */
	add(x, y=null, z=null) {
		if(x instanceof Vector) {
			return this.set(this.x + x.x, this.y + x.y, this.z + x.z);
		}

		if(y === null) {
			y = x;
		}

		if(z === null) {
			z = x;
		}

		return this.set(this.x + x, this.y + y, this.z + z);
	}

	/**
	 * Substracts values to the vector and returns it.
	 * @param {Vector|number} x
	 * @param {number} y
	 * @param {number} z
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(10, 10);
	 * const v2 = new Vector(20, 20);
	 * const v3 = v.sub(1, 2); // now v{x: 9, y: 8} and v3 is same
	 * v2.sub(v); // now v2{x: 11, y: 12}
	 */
	sub(x, y=null, z=null) {
		if(x instanceof Vector) {
			return this.set(this.x - x.x, this.y - x.y, this.z - x.z);
		}

		if(y === null) {
			y = x;
		}

		if(z === null) {
			z = x;
		}

		return this.set(this.x - x, this.y - y, this.z - z);
	}

	/**
	 * mutliplys the vector by another vector / or x,y and returns it.
	 * You can multiply 2 vectors from 2 different dimension.
	 * @param {Vector|number} x
	 * @param {number} y
	 * @param {number} z
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(10, 10);
	 * const v2 = new Vector(20, 20);
	 * v.mult(2); // now v{x: 20, 20}
	 * const v3 = v.mult(1, 2); // now v{x: 20, y: 40} and v3 is same
	 * v2.mult(v); // now v2{x: 400, y: 800}
	 */
	mult(x, y=null, z=null) {
		if(x instanceof Vector) {
			return this.set(this.x * x.x, this.y * x.y, this.z * x.z);
		}

		if(y === null) {
			y = x;
		}

		if(z === null) {
			z = x;
		}

		return this.set(this.x * x, this.y * y, this.z * z);
	}

	/**
	 * Divides the vector by another vector / or x,y and returns it.
	 * @param {Vector|number} x
	 * @param {number} y
	 * @param {number} z
	 * @return {Vector} modified vector
	 * @example
	 * const v = new Vector(10, 10);
	 * const v2 = new Vector(20, 20);
	 * const v3 = v.div(2); // now v{x: 5, 5} and v3 is same
	 * v2.div(v); // now v2{x: 4, y: 4}
	 */
	div(x, y=null, z=null) {
		if(x instanceof Vector) {
			return this.set(this.x / x.x, this.y / x.y, this.z / x.z);
		}

		if(y === null) {
			y = x;
		}

		if(z === null) {
			z = x;
		}

		return this.set(this.x / x, this.y / y, this.z / z);
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
			if(this.dimension === 2) {
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
	 * @returns {string}
	 * @example
	 * const v = new Vector(1, 2);
	 * console.info(v); // {x: 1, y: 2}
	 * console.info(v.toString()()); // is equivalent
	 */
	toString() {
		return `{ x: ${this.x}${(this.dimension > 1) ? `, y: ${this.y}` : ''}${(this.dimension > 2) ? `, z: ${this.z}` : ''} }`;
	}

	/**
	 * Returns an array [x, y, z]
	 * @returns {number[]}
	 * @example
	 * const v = new Vector(1, 2);
	 * console.info(v.array()); // [1, 2]
	 */
	array() {
		const arr = [this.x];
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
     * @return {object}
     */
    object() {
        const o = { x: this.x };

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
		if(this.dimension === 3)
			return;

		// arrow's style
		if(style.strokeWeight) strokeWeight(style.strokeWeight);
		else strokeWeight(1);

		if(style.stroke) stroke(style.stroke);
		else stroke('#fff');


		// calculate the vector's rotation from the horizontal
		const rotation = degree(vectorToAngle(this));

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
					line(0, 0, -min(this.mag / 2.5, 10), 0);

					// right
					rotate(-50);
					line(0, 0, -min(this.mag / 2.5, 10), 0);
				pop();
			pop();
		pop();
	}
}


export class Matrix {

	properties = {
		array: [],
		width: 0,
		height: 0
	};


	/**
	 * Creates a Matrix of numbers, with 4 signatures.
	 *
	 * 1. with matrix's size (and default fill value ? - default 0)
	 *
	 * 2. with multiple arrays of numbers
	 *
	 * 3. with a 2D array of numbers
	 *
	 * 4. from another Matrix
	 *
	 * @signature new Matrix(width, height, fill)
	 * @param {number} width size X of the matrix
	 * @param {number} height size Y of the matrix. If not precised, a square matrix is created
	 * @param {number} fill fill value in the matrix (default is 0)
	 * @example
	 * // [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ]
	 * const m1 = new Matrix(3);
	 * // [ [0, 0, 0], [0, 0, 0] ]
	 * const m2 = new Matrix(3, 2);
	 * // [ [1, 1], [1, 1] ]
	 * const m3 = new Matrix(2, 2, 1);
	 *
	 * @signature new Matrix([0, 0, 0], ...)
	 * @param {...number[]} args multiple arrays of numbers
	 * @example
	 * // [ [0, 0, 0], [0, 0, 0] ]
	 * const m1 = new Matrix([0, 0, 0], [0, 0, 0]);
	 *
	 * @signature new Matrix([[0, 0, 0], ...])
	 * @param {number[][]} args 2D array of numbers
	 * @example
	 * // [ [0, 0, 0], [0, 0, 0] ]
	 * const m1 = new Matrix([[0, 0, 0], [0, 0, 0]]);
	 *
	 * @signature new Matrix(matrix)
	 * @param {Matrix} args existing matrix
	 * @example
	 * const m1 = new Matrix(3);
	 * const m2 = new Matrix(m1); // creates a copy of m1
	 */
	constructor(...args) {
		if(args.length > 0) {
			if(args[0] instanceof Matrix) {
				this.properties.width = args[0].width;
				this.properties.height = args[0].height;

				for(let i=0; i < args[0].height; i++) {
					const row = [];
					for(let j=0; j < args[0].width; j++) {
						row.push(args[0].at(j, i));
					}
					this.properties.array.push(row);
				}
			}

			// [width, height, fill?]
			else if(typeof args[0] === 'number') {
				let fill = 0;
				const w = args[0];
				let h = w;

				if(args.length > 1 && typeof args[1] === 'number') {
					h = args[1];

					if(args.length > 2 && typeof args[2] === 'number') {
						fill = args[2];
					}
				} // else square matrix if only 1 number given

				for(let i=0; i < h; i++) {
					const row = [];
					for(let j=0; j < w; j++) {
						row.push(fill);
					}
					this.properties.array.push(row);
				}

				this.properties.width = w;
				this.properties.height = h;
			}

			// argument is an array (of arrays ?)
			else if(args.length === 1 && Array.isArray(args[0]) && args[0].every(a => Array.isArray(a) && a.length === args[0][0].length && a.every(e => typeof e === 'number'))) {
				// all elements of parent array are arrays
				// form of argument :
				// [[0, 0, 0],[0, 0, 0]] : 2D array
				this.properties.array = args[0];
				if(args[0].length > 0) this.properties.width = args[0][0].length;
				this.properties.height = args[0].length;
			}

			// all elements of parent array are numbers
			// form of argument :
			// [0, 0, 0], [0, 0, 0] : multiple arguments which are arrays of numbers
			else if(args.every(a => Array.isArray(a) && a.length === args[0].length && a.every(e => typeof e === 'number'))) {
				this.properties.array = args;
				this.properties.width = args[0].length;
				this.properties.height = args.length;
			}

			else {
				console.error('[Error] Matrix constructor : Unrecognized parameters.');
			}
		}

		this.properties.size = Object.freeze({
			x: this.properties.width,
			y: this.properties.height
		});

		delete this.properties.width;
		delete this.properties.height;
	}

	/**
	 * Returns the matrix as 2D array.
	 * @returns {number[][]} The matrix
	 */
	get array() {
		return this.properties.array;
	}

	/**
	 * Returns the matrix's values in an 1D array
	 * @returns {number[]} The matrix as 1D array
	 */
	get array1D() {
		return this.array.reduce((a, b) => [...a, ...b], []);
	}

	/**
	 * Returns the matrix's width.
	 * @returns {number} The matrix's width
	 */
	get width() {
		return this.properties.size.x;
	}

	/**
	 * Returns the matrix's height.
	 * @returns {number} The matrix's height
	 */
	get height() {
		return this.properties.size.y;
	}

	/**
	 * Returns the dimension of the matrix
	 * @returns {object} The dimension of the matrix {x, y}
	 */
	get dimension() {
		return this.properties.size;
	}

	/**
	 * Returns the matrix as a string
	 * @returns {string} The matrix as string
	 */
	toString(uncluttered = false) {
		const sep = this.height > 0 ? '\n' : '';
		const brackets = {
			open: uncluttered ? '' : '[',
			close: uncluttered ? '' : ']'
		};
		const m = uncluttered ? max(...this.array.map(a => max(...a.map(e => e.toString()().length)))) : 0;

		const _format = uncluttered ?
			arr => {
				return arr.map(e => ' '.repeat(6 + m - e.toString()().length * 2) + e).join(' ');
			} :
			arr => arr.join(', ');

		return brackets.open + sep +
			this.properties.array.map(a => '\t' + brackets.open + _format(a) + brackets.close).join('\n') +
			sep + brackets.close;
	}

	/**
	 * Returns the value of an element at given indexes
	 * @param {number} x X-Axis index of the element
	 * @param {number} y Y-Axis index of the element
	 * @returns {number|null} The value of the element - null if wrong indexes given
	 * @example
	 * const m1 = new Matrix(3);
	 * m1.at(0, 0); // first element of first row - 0
	 */
	at(x, y) {
		if(typeof x === 'number' && typeof y === 'number' && x > -1 && y > -1 && x < this.width && y < this.height) {
			return this.array[y][x];
		}

		return null;
	}

	/**
	 * Set the given value at the given indexes in the matrix
	 * @param {number} x X-Axis index in the matrix
	 * @param {number} y Y-Axis index in the matrix
	 * @param {number} value Value to set at the given indexes in the matrix
	 * @example
	 * const m1 = new Matrix(3);
	 * m1.set(0, 0, 1); // m1[0][0] = 1
	 */
	set(x, y, value) {
		if(this.at(x, y) !== null && typeof value === 'number') {
			this.array[y][x] = value;
		}
	}

	/**
	 * Compares the two matrices and returns either these have the same matrix or not
	 * @param {Matrix} matrix the matrix to compare with
	 * @returns {boolean} Either the 2 matrices are equals or not
	 * @example
	 * const m1 = new Matrix(3);
	 * const m2 = new Matrix(3);
	 * m1.equals(m2); // true
	 * m1.set(0, 0, 1);
	 * m1.equals(m2); // false
	 */
	equals(matrix) {
		if(matrix.width !== this.width || matrix.height !== this.height)
			return false;

		for(let i=0; i < this.height; i++) {
			for(let j=0; j < this.width; j++) {
				if(matrix.at(j, i) !== this.at(j, i))
					return false;
			}
		}

		return true;
	}

	/**
	 * Returns either the matrix is symmetrical or not
	 * @returns {boolean} Either the matrix is symmetrical or not
	 */
	get isSymmetrical() {
		for(let i=0; i < this.width; i++) {
			for(let j=0; j < this.height; j++) {
				if(this.at(i, j) !== this.at(j, i))
					return false;
			}
		}

		return true;
	}

	/**
	 * Returns either the matrix is a square matrix or not.
	 *
	 * A square matrix has its width equals to its height.
	 * @returns {boolean} Either it's a square matrix or not
	 */
	get isSquare() {
		return this.width === this.height;
	}

	/**
	 * Returns either the matrix is idendity/unity matrix.
	 *
	 * An idendity/unity matrix has its diagonal filled by 1, all other elements are 0
	 * @returns {boolean} Either the matrix is an identity/unity matrix or not
	 */
	get isIdentity() {
		return this.isSquare && this.array.every((arr, i) => arr.every((e, j) => (i === j && e === 1) || (i !== j && e === 0)));
	}

	/**
	 * Returns either the matrix has is a diagonal matrix or not.
	 *
	 * A diagonal matrix is a matrix with a diagonal filled by values different from 0, all other elements are 0
	 * @returns {boolean} Either the matrix is a diagonal matrix or not
	 */
	get isDiagonal() {
		return this.isSquare && this.array.every((arr, i) => arr.every((e, j) => (i === j && e !== 0) || (i !== j && e === 0)));
	}

	/**
	 * Returns either the matrix is triangular or not. (lower triangular or upper triangular)
	 * @returns {boolean} Either the matrix is triangular or not
	 */
	get isTriangular() {
		const a = this.isLowerTri;
		const b = this.isUpperTri;
		return a ? !b : b;
	}

	/**
	 * Returns either the matrix is lower triangular or not.
	 *
	 * A lower triangular matrix is a matrix with all the entries above the main diagonal equals to zero
	 * @returns {boolean} Either the matrix is lower triangular or not
	 */
	get isLowerTri() {
		if(!this.isSquare)
			return false;

		for(let i=0; i < this.height; i++) {
			for(let j=0; j < this.width; j++) {
				const e = this.at(j, i);
				if(j >= i && e !== 0)
					return false;
			}
		}

		return true;
	}

	/**
	 * Returns either the matrix is upper triangular or not.
	 *
	 * An upper triangular matrix is a matrix with all the entries below the main diagonal equals to zero
	 * @returns {boolean} Either the matrix is upper triangular or not
	 */
	get isUpperTri() {
		if(!this.isSquare)
			return false;

		for(let i=0; i < this.height; i++) {
			for(let j=0; j < this.width; j++) {
				const e = this.at(j, i);
				if(j <= i && e !== 0)
					return false;
			}
		}

		return true;
	}

	/**
	 * Returns a 1D array with the diagonal of the matrix if the matrix is a square matrix.
	 *
	 * If the matrix is not a square matrix, then it returns an empty array.
	 * @returns {number[]} The diagonal values
	 */
	get diagonal() {
		if(this.isSquare)
			return this.array.map((arr, i) => arr[i]);

		return [];
	}

	/**
	 * Returns the matrix determining. det(M).
	 * @returns {number} The determining of the matrix
	 */
	get det() {
		if(!this.isSquare)
			return 0;

		if(this.isIdentity)
			return 1;

		if(this.isDiagonal || this.isTriangular) {
			const diag = this.diagonal;
			return diag.reduce((acc, curr) => acc * curr, 1);
		}

		if(this.width === 2) {
			return this.at(0, 0) * this.at(1, 1) - this.at(1, 0) * this.at(0, 1);
		}

		else if(this.width === 3) {
			const [a, b, c, d, e, f, g, h, i] = this.array1D;
			return a * e * i + d * h * c + b * f * g - (g * e * c + d * b * i + a * h * f);
		}

		else {
			const det = m =>
				m.length === 1 ? m[0][0] :
					m.length === 2 ? m[0][0] * m[1][1] - m[0][1] * m[1][0] :
						m[0].reduce((r, e, i) => r + (-1) ** (i + 2) * e * det(m.slice(1).map(c => c.filter((_, j) => i != j))), 0);
			return det(this.array);
		}
	}

	/**
	 * Operates an addition between 2 matrices. Matrices must have the same dimension
	 * @param {Matrix|number} matrix The matrix to addition with, or a number to apply the operation on each element of the matrix
	 * @param {boolean} onACopy Either it has to store the result in the current matrix or just return the result
	 * @returns {Matrix} Either 'this' or a newly created matrix, the result of the operation
	 * @example
	 * const m1 = new Matrix(3, 2, 1);
	 * const m2 = new Matrix(3, 2, 1);
	 * const m3 = m1.add(m2);
	 * // m3 = [ [2, 2, 2], [2, 2, 2] ]
	 * const m4 = m1.add(m2, true);
	 * // m4 = m1 = [ [2, 2, 2], [2, 2, 2]]
	 */
	add(matrix, onACopy = false) {
		if(!('op' in this))
			this.op = (a, b) => a + b;

		if(!(matrix instanceof Matrix) && typeof matrix !== 'number') {
			console.error(`[Error] Matrix::add : Matrix expected, ${typeof matrix} given`);
			delete this.op;
			return this;
		}

		if(matrix instanceof Matrix) {
			if(matrix.width !== this.width || matrix.height !== this.height) {
				console.error('[Error] Matrix::add : Cannot operate an addition between 2 matrices with different dimensions.');
				delete this.op;
				return this;
			}
		}

		const result = onACopy ? new Matrix(this) : this;
		const b = matrix instanceof Matrix;

		// operate
		for(let i=0; i < result.height; i++) {
			for(let j=0; j < result.width; j++) {
				result.set(j, i, this.op(result.at(j, i), (b ? matrix.at(j, i) : matrix)));
			}
		}

		delete this.op;
		return result;
	}

	/**
	 * Operates a substraction between 2 matrices. Matrices must have the same dimension
	 * @param {Matrix|number} matrix The matrix to substract, or a number to apply the operation on each element of the matrix
	 * @param {boolean} onACopy Either it has to store the result in the current matrix or just return the result
	 * @returns {Matrix} Either 'this' or a newly created matrix, the result of the operation
	 * @example
	 * const m1 = new Matrix(3, 2, 1);
	 * const m2 = new Matrix(3, 2, 1);
	 * const m3 = m1.add(m2);
	 * // m3 = [ [0, 0, 0], [0, 0, 0] ]
	 * const m4 = m1.add(m2, true);
	 * // m4 = m1 = [ [0, 0, 0], [0, 0, 0]]
	 */
	sub(matrix, onACopy = false) {
		this.op = (a, b) => a - b;
		return this.add(matrix, onACopy);
	}

	/**
	 * Multiplies the matrix by a number (scalar) or another matrix.
	 * @param {Matrix|number} matrixOrnumber Either a matrix or a number
	 * @param {boolean} onACopy Either it has to operate on a copy or on the matrix itself. If it's a matrix product, it's on another matrix
	 * @return {Matrix} Either 'this' or a copy, depending of the parameter 'save'
	 */
	mult(matrixOrnumber, onACopy = false) {
		const m = matrixOrnumber;
		let result = onACopy ? new Matrix(this) : this;

		// scalar product
		if(typeof m === 'number') {
			for(let i=0; i < result.height; i++) {
				for(let j=0; j < result.width; j++) {
					result.set(j, i, result.at(j, i) * m);
				}
			}
		}

		// matrices multiplication
		else if(m instanceof Matrix) {
			if(m.height !== this.width || m.width !== this.height) {
				console.error('[Error] Matrix::mult : matrices must have same transposed size.');
			}

			else {
				result = new Matrix(this.height);

				for(let i=0; i < this.height; i++) {
					for(let j=0; j < this.height; j++) {
						let s = 0;
						for(let k=0; k < this.width; k++) {
							s += this.at(k, i) * m.at(j, k);
						}
						result.set(j, i, s);
					}
				}
			}
		}

		else {
			console.error(`[Error] Matrix::mult : Matrix or number expected, got ${typeof matrixOrnumber}`);
		}

		return result;
	}

	/**
	 * Transposes the rows and columns of the matrix
	 * @param {boolean} onACopy Either it has to operate on the matrix itself or on a copy. By default false
	 * @returns {Matrix} The transformed matrix
	 */
	transpose(onACopy = false) {
		let copy = new Matrix(this);
		let me = this;

		if(onACopy)
			[copy, me] = [me, copy];

		me.properties.size = Object.freeze({
			x: me.properties.size.y,
			y: me.properties.size.x
		});

		me.properties.array = [];

		for(let i=0; i < copy.width; i++) {
			const row = [];
			for(let j=0; j < copy.height; j++) {
				row.push(0);
			}
			me.properties.array.push(row);
		}

		for(let i=0; i < copy.height; i++) {
			for(let j=0; j < copy.width; j++) {
				me.set(i, j, copy.at(j, i));
			}
		}

		return me;
	}

	/**
	 * Returns the column at given index.
	 *
	 * If wrong index given returns an empty array.
	 * @param {number} x The index of the column to get
	 * @returns {number[]} The column
	 */
	getColumn(x) {
		if(x < 0 || x > this.width)
			return [];

		const column = [];
		for(let i=0; i < this.height; i++)
			column.push(this.at(x, i));
		return column;
	}

	/**
	 * Returns the column at given idnex.
	 *
	 * If wrong idnex given, returns an empty array.
	 * @param {number} y The index of the row to get
	 * @returns {number[]} The row
	 */
	getRow(y) {
		if(y < 0 || y > this.height)
			return [];

		return this.properties.array[y];
	}

	/**
	 * Updates a column in the matrix.
	 * @param {number} x The index of the column
	 * @param {number[]} column The column of values to set
	 * @returns {Matrix} 'this'
	 */
	setColumn(x, column) {
		if(x < 0 || x > this.width)
			return console.error('[Error] Matrix::setColumn : wrong index given.');

		if(column.length !== this.height)
			return console.error('[Error] Matrix::setColumn : column must have the same length as the matrix\'s height.');

		for(let i=0; i < this.height; i++)
			this.set(x, i, column[i]);

		return this;
	}

	/**
	 * Updates a row in the matrix.
	 * @param {number} y The index of the row
	 * @param {number[]} row The row of values to set
	 * @returns {Matrix} 'this'
	 */
	setRow(y, row) {
		if(y < 0 || y > this.height)
			return console.error('[Error] Matrix::setRow : wrong index given.');

		if(row.length !== this.height)
			return console.error('[Error] Matrix::setRow : row must have the same length as the matrix\'s width.');

		this.properties.array[y] = row;

		return this;
	}
}



export class Camera {
    // CAMERA ANCHOR TYPES. DEFAULT IS TOP-LEFT CORNER
    static ANCHOR_DEFAULT = 0;
    static ANCHOR_CENTER = 1;

    uuid = generateUUID();
    position = new Vector(0, 0);
    anchorType = Camera.ANCHOR_DEFAULT;
    anchorPoint = new Vector(0, 0);
    followPoint = null;

    /**
     * Creates a Camera which can moves in the canvas.
     *
     * Default position is (0, 0), and default anchor is top-left corner.
     *
     * The camera is by default activated. You can disable and enable it with
     * `disableCamera()` and `enableCamera()`.
     *
     * <b>The Camera is NOT using the `translate()` function.</b>
     *
     * You can create your own camera, but never replace the one used by the library.
     *
     * Instead, use `camera.set(myCamera)` to copy the position of your camera.
     *
     * You can draw static HUD using the `disableCamera()`. It will stay static in your
     * screen even if you move your camera.
     * @see {@link disableCamera}
     * @see {@link enableCamera}
     * @param {Vector} position position of the Camera at its creation.
     */
    constructor(position=null) {
        if(position instanceof Vector)
            this.position = position;
    }

    /**
     * Returns the in-world anchor X-axis point of the camera.
     * @return {number}
     */
    get x() { return this.position.x - this.anchorPoint.x; }

    /**
     * Returns the in-world anchor Y-axis point of the camera.
     * @return {number}
     */
    get y() { return this.position.y - this.anchorPoint.y; }

    /**
     * Returns either the camera is following a point or not.
     * @return {boolean}
     */
    get following() { return this.followPoint !== null; }

    /**
     * Returns either the camera is currently moving or not.
     * @return {boolean}
     */
    get moving() { return NOX_PV.camera.move !== null; }

    /**
     * Defines either the anchor of the camera is top-left corner or center.<br>
     * Default is top-left corner.<br>
     * The method only accepts `Camera.ANCHOR_DEFAULT` and `Camera.ANCHOR_CENTER`.
     * @param {Camera.ANCHOR_DEFAULT|Camera.ANCHOR_CENTER} anchor
     * @return {Camera} this
     */
    setAnchor(anchor) {
        if(anchor === Camera.ANCHOR_DEFAULT) {
            this.anchorPoint.set(0, 0);
            this.anchorType = anchor;
        }
        else if(anchor === Camera.ANCHOR_CENTER) {
            this.anchorPoint.set(width/2, height/2);
            this.anchorType = anchor;
        }

        return this;
    }

    /**
     * Defines the ease movement's type of the camera while its moving.<br>
     * Default is 'quadInOut'.
     * @param {'linear'
     * |'quadIn'|'quadOut'|'quadInOut'
     * |'sineIn'|'sineOut'|'sineInOut'
     * |'expoIn'|'expoOut'|'expoInOut'
     * |'circIn'|'circOut'|'circInOut'
     * |'cubicIn'|'cubicOut'|'cubicInOut'
     * |'quartIn'|'quartOut'|'quartInOut'
     * |'quintIn'|'quintOut'|'quintInOut'
     * |'backIn'|'backOut'|'backInOut'
     * |'elasticIn'|'elasticOut'|'elasticInOut'} moveType
     * @return {Camera} this
     */
    setMoveType(moveType) {
        if(moveType in Object.keys(NOX_PV.easeFuncMap))
            this.moveType = moveType;

        return this;
    }

    /**
     * Tells the camera to follow a point. This must be a Vector.
     *
     * If you instead give an object than contains a `position` attribute
     * which is of type Vector, then it will follow its position.
     * @param {Vector|{position: Vector}} point The point to follow
     * @returns {Camera} this
     */
    follow(point) {
        if(point instanceof Vector)
            this.followPoint = point;
        else if(typeof point === 'object' && point.position instanceof Vector)
            this.followPoint = point.position;
        else
            console.error('[Error] Camera::follow : parameter should be a Vector.');

        return this;
    }

    /**
     * Tells the camera to stop follow if it was.
     * @return {Camera} this
     */
    stopFollow() {
        this.followPoint = null;
        return this;
    }

    /**
     * Moves the camera with the given vector.
     *
     * Default duration of the move is 1000 ms.
     *
     * You can change the ease animation of the move with `Camera.setMoveType()`
     * @see {@link Camera.setMoveType}
     * @param {number|Vector} x A Vector or a X-axis point to move
     * @param {number} y The Y-axis point to move - or the duration if the first argument is a Vector
     * @param {number} duration The duration of the move
     * @return {Camera} this
     */
    move(x, y, duration=1000) {
        if(this.moving)
            return;

        if(this.following)
            this.stopFollow();

        const length = new Vector(0, 0);

        if(x instanceof Vector) {
            length.set(x);
            duration = y || 1000;
        }
        else
            length.set(x, y);

        length.sub(this.anchorPoint);

        NOX_PV.camera.move = {
            from: this.position.copy(),
            length,
            duration,
            start: new Time()
        };

        return this;
    }

    /**
     * Moves the camera to the given point.
     *
     * Default duration of the move is 1000 ms.
     *
     * You can change the ease animation of the move with `Camera.setMoveType()`
     * @see {@link Camera.setMoveType}
     * @param {number|Vector} x A Vector or a X-axis point to move
     * @param {number} y The Y-axis point to move - or the duration if the first argument is a Vector
     * @param {number} duration The duration of the move
     * @return {Camera} this
     */
    moveTo(x, y, duration=1000) {
        const v = new Vector(0, 0);

        if(x instanceof Vector) {
            v.set(x.x, x.y);
            duration = y;
        }
        else
            v.set(x, y);

        v.sub(this.position).add(this.anchorPoint);

        this.move(v.x, v.y, duration);

        return this;
    }

    /**
     * Immediatly stops to move the camera.
     * @returns {Camera} this
     */
    stop() {
        NOX_PV.camera.move = null;
        return this;
    }
}





export class Path {
	/**
	 * Creates Path instance
	 * @param {number} x where must start the path X
	 * @param {number} y where must start the path Y
	 */
	constructor(x = null, y = null) {
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
			path(this.d + (this.isClosed ? ' Z' : ''));
		}

		else {
			console.error('Cannot draw it because you didn\'t make a path');
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
		if(this.d === null) return console.error('You have to initialize the fist path\'s position');
		this.d += ` m ${x} ${y}`;
	}


	/**
	 * LineTo instruction - absolute
	 * @param {number} x X-axis coordinate
	 * @param {number} y y-axis coordinate
	 */
	LineTo(x, y) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` L ${x} ${y}`;
	}

	/**
	 * lineTo instruction - relative
	 * @param {number} x X-axis coordinate
	 * @param {number} y y-axis coordinate
	 */
	lineTo(x, y) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` l ${x} ${y}`;

	}


	/**
	 * Horizontal instruction - absolute
	 * @param {number} x X-axis coordinate
	 */
	Horizontal(x) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` H ${x}`;
	}

	/**
	 * horizontal instruction - relative
	 * @param {number} x X-axis coordinate
	 */
	horizontal(x) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` h ${x}`;
	}


	/**
	 * Vertical instruction - absolute
	 * @param {number} y Y-axis coordinate
	 */
	Vertical(y) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` V ${y}`;
	}

	/**
	 * Vertical instruction - relative
	 * @param {number} y Y-axis coordinate
	 */
	vertical(y) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` v ${y}`;
	}


	/**
	 * Arc instruction - absolute
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 * @param {number} r radius. Must be positive
	 * @param {number} start start angle
	 * @param {number} end end angle
	 * @param {boolean} antiClockwise either it has to draw it anti-clockwisly or not
	 */
	Arc(x, y, r, start, end, antiClockwise = false) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` A ${x} ${y} ${r} ${start} ${end} ${(antiClockwise === true) ? 1 : 0}`;
	}

	/**
	 * Arc instruction - relative
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 * @param {number} r radius. Must be positive
	 * @param {number} start start angle
	 * @param {number} end end angle
	 * @param {boolean} antiClockwise either it has to draw it anti-clockwisly or not
	 */
	arc(x, y, r, start, end, antiClockwise = false) {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` a ${x} ${y} ${r} ${start} ${end} ${(antiClockwise === true) ? 1 : 0}`;
	}


	/**
	 * Close path
	 */
	close() {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.isClosed = true;
	}

	/**
	 * Removes the instruction that close the path if it was.
	 */
	open() {
		if(this.d === null) return console.error('You have to initialize the first path\'s position');
		this.isClosed = false;
	}

	/**
	 * Moves the entire path.
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 */
	move(x, y = null) {
		// 1 argument and it's a vector
		if(y === null && x instanceof Vector) {
			[x, y] = [x.x, x.y];
		}

		if(this.d === null) return;

		this.d = this.d.replace(/([MLHVA])\s([\d\.]+)(\s([\d\.]+))?/g, (c, p1, p2, p3) => {
			if(p1 === 'H') return `${p1} ${parseFloat(p2) + x}`;

			if(p1 === 'V') return `${p1} ${parseFloat(p2) + y}`;

			return `${p1} ${parseFloat(p2) + x} ${parseFloat(p3) + y}`;
		});
	}
}



/**
 * A 4-children based tree that is used to manage world entities relations
 * with better performances.
 */
export class Quadtree {
    /**
     * A Quadtree's Point has a position and a pointer to an object
     */
    static Point = class Point {
        /**
         * A Quadtree's Point that has a position and a pointer to an object
         * @param {number} x Point's X
         * @param {number} y Point's Y
         * @param {object} dataPtr Object data
         */
        constructor(x, y, dataPtr) {
            this.x = x;
            this.y = y;
            this.dataPtr = dataPtr;
        }
    }

    /**
     * A Quadtree's Rectangle is a basic rectangle that checks<br>
     * if it contains a given point or intersects with a given Rectangle
     */
    static Rectangle = class Rectangle {
        /**
         * Creates a Quadtree's Rectangle.
         * @param {number} x Rectangle top-left corner's X
         * @param {number} y Rectangle top-left corner's Y
         * @param {number} w Rectangle's width
         * @param {number} h Rectangle's height
         */
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }

        /**
         * Checks if a given Quadtree's Point is in the Rectangle or not.
         * @param {Quadtree.Point} point A Quadtree's Point
         * @returns boolean - either the point is in the Rectangle or not
         */
        contains(point) {
            return (
                this.x <= point.x && point.x <= this.x + this.w &&
                this.y <= point.y && point.y <= this.y + this.h
            );
        }

        /**
         * Checks if 2 Quadtree's Rectangles are intersecting or not.
         * @param {QuadTree.Rectangle} rectangle A Quadtree's Rectangle
         * @returns boolean - either both Rectangles intersect or not
         */
        intersect(rectangle) {
            return !(
                rectangle.x > this.x + this.w ||
                rectangle.x + rectangle.w < this.x ||
                rectangle.y > this.y + this.h ||
                rectangle.y + rectangle.h < this.y
            );
        }

        /**
         * Checks if this Quadtree's Rectangle totally wraps the given Rectangle or not.
         * @param {Quadtree.Rectangle} rectangle A Quadtree's Rectangle
         * @returns boolean - either this Rectangle totally wraps the given rectangle or not
         */
        wrap(rectangle) {
            return (
                this.x <= rectangle.x && rectangle.x + rectangle.w <= this.x + this.w &&
                this.y <= rectangle.y && rectangle.y + rectangle.h <= this.y + this.h
            )
        }
    }

    /**
     * Creates a new Quadtree.
     * @param {Quadtree.Rectangle} boundary The region covered by the Quadtree
     * @param {number} capacity The max capacity of Points that can supports this Quadtree
     */
    constructor(boundary, capacity=5) {
        this.boundary = boundary;
        this.capacity = capacity;
        this.points = [];
        this.divided = false;
    }

    /**
     * Clears the Quadtree and delete its 4 children if divided.
     */
    clear() {
        this.points = [];
        this.divided = false;
        delete this.northeast;
        delete this.northwest;
        delete this.southeast;
        delete this.southwest;
    }

    /**
     * Returns an array containing the tree's children.
     * @returns {Quadtree[]} All tree's children
     */
	get children() {
		return this.divided? [this.northwest, this.northeast, this.southwest, this.southeast] : [];
	}

    /**
     * Subdivides the Quadtree if it isn't.<br>
     * Separates itself in 4 regions that fill itself.
     */
    subdivide() {
        if(!this.divided) {
            const { x, y, w, h } = this.boundary;

            const ne = new Quadtree.Rectangle(x + w/2, y, w/2, h/2);
            const nw = new Quadtree.Rectangle(x, y, w/2, h/2);
            const se = new Quadtree.Rectangle(x + w/2, y + h/2, w/2, h/2);
            const sw = new Quadtree.Rectangle(x, y + h/2, w/2, h/2);

            this.northwest = new Quadtree(nw);
            this.northeast = new Quadtree(ne);
            this.southwest = new Quadtree(sw);
            this.southeast = new Quadtree(se);

            this.divided = true;

			for(const p of this.points) {
				this.insert(p);
			}

			this.points = [];
        }
    }

    /**
     * Tries to insert a Quadtree's Point in itself.<br>
     * If the Point is already present in the Quadtree, does nothing.<br>
     * Two Points cannot have the same position in it.<br>
     * If the Quadtree has reach its max capacity, then splits / subdivides
     * itself and tries to insert the Point in one of its child.
     * @param {Quadtree.Point} point The Point to insert
     * @returns Either the Point is well inserted or not in the Quadtree
     */
    insert(point) {
        if(!this.boundary.contains(point))
            return false;

		if(this.divided) {
			return this.northeast.insert(point)
				|| this.northwest.insert(point)
				|| this.southeast.insert(point)
				|| this.southwest.insert(point);
		}
		else if(this.points.length < this.capacity) {
			this.points.push(point);
			return true;
		}
		else {
			this.subdivide();
			this.insert(point);
		}
    }

    /**
     * Finds and returns all Quadtree's Points that are in the requested area
     * @param {Quadtree.Rectangle} range The Rectangle where to find and returns all points
     * @returns {Quadtree.Point[]} Returns an array of all Points that are in the requested area.
     */
    query(range) {
		// leaf
		if(!this.divided) {
			if(range.wrap(this.boundary)) {
				return this.points;
			}
			else if(range.intersect(this.boundary)) {
				const found = [];

				for(const p of this.points) {
					if(range.contains(p))
						found.push(p);
				}

				return found;
			}

			return [];
		}

		// node
		// totally wraps the boundary : add all leafs
		if(range.wrap(this.boundary)) {
			return this.getAllPoints();
		}

		// partially or does not collides the range
		const found = [];

		found.push(...this.northwest.query(range));
		found.push(...this.northeast.query(range));
		found.push(...this.southwest.query(range));
		found.push(...this.southeast.query(range));

		return found;
    }

    /**
     * Delimits the bounds of the Quadtree and recursivly do it for its children
     * if it is splitted.<br>
     * Default stroke color is #141414, but you can change it.
     * @param {any} color The color of the limits. Default is #141414
     */
    show(color=20) {
        noFill();
        stroke(color);
        strokeWeight(1);
        strokeRect(this.boundary.x, this.boundary.y, this.boundary.w-1, this.boundary.h-1);

        if(this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }
    }

	/**
	 * Returns all the children of this tree and its regions.
	 * @returns {Quadtree.Point[]} A list of all children and subchildren of this tree
	 */
	getAllPoints() {
		if(!this.divided)
			return this.points;

		const points = [];

		for(const region of this.children)
			points.push(...region.getAllPoints());

		return points;
	}

    /**
     * Returns the total size of the tree, containing its point and the points of its children.
     * @returns {number} The total size of the tree (number of points contained inside it)
     */
    size() {
        let n = this.points.length;

        for(const region of this.children)
            n += region.size();

        return n;
    }
}



/**
 * Listen to an event on the canvas or the window.
 * resize, blur, focus, online, offline, keydown, keyup and keypress are part of window's listeners
 * @param {'resize'|'resizeended'|'blur'|'focus'|'online'|'offline'|'keydown'|'keyup'|'keypress'|'mouseup'|'mousemove'|'drag'|'click'|'dblclick'|'mouseenter'|'mouseleave'|'wheel'|'contextmenu'|'swipe'} event - event to listen
 * @param {function} callback function which's called once event is fired
 */
export const listen = (event, callback) => {
	NOX_PV.callbackListeners[event] = callback;
};

/**
 * Stop listen to an event on the canvas or the window.
 * resize, blur, focus, online, offline, keydown, keyup and keypress are part of window's listeners
 * @param {'resize'|'resizeended'|'blur'|'focus'|'online'|'offline'|'keydown'|'keyup'|'keypress'|'mouseup'|'mousemove'|'drag'|'click'|'dblclick'|'mouseenter'|'mouseleave'|'wheel'|'contextmenu'|'swipe'} event - event to stop listen
 */
export const stopListen = event => {
	if(event in NOX_PV.callbackListeners) {
		delete NOX_PV.callbackListeners[event];
	}
};

/**
 * Draw function that must be called for animated canvas
 * @param {function} drawFunction the function that will be execute in loop to draw on the canvas
 */
export const draw = drawFunction => {
	if(typeof drawFunction !== 'function') {
		console.error(`The draw function must take an argument as type 'function'.`);
	}

	else if(NOX_PV.hasDrawFunc) {
		console.warn('You already declared your draw function.');
	}

	else {
		NOX_PV.hasDrawFunc = true;
		NOX_PV.drawFunc = drawFunction;

		if(!NOX_PV.hasUpdateFunc)
			drawLoop();
	}
};

/**
 * Update function that must be called for animated canvas.<br>
 * On each loops, canvas will update then draw.
 * @param {function} updateFunction the function that will be execute in loop to update on the canvas
 */
export const update = updateFunction => {
	if(typeof updateFunction !== 'function') {
		console.error(`The update function must take an argument as type 'function'.`);
	}

	else if(NOX_PV.hasUpdateFunc) {
		console.warn('You already declared your update function.');
	}

	else {
		NOX_PV.hasUpdateFunc = true;
		NOX_PV.updateFunc = updateFunction;

		if(!NOX_PV.hasDrawFunc)
			drawLoop();
	}
};




export class NoxCanvasModule {
	constructor() {
		if(this.constructor === NoxCanvasModule) {
			throw new Error("[NoxCanvasModule] Object of Abstract Class cannot be created");
		}
	}
}

/**
 *
 * @param {NoxCanvasModule} module
 */
export const addModule = module => {
	if(!(module instanceof NoxCanvasModule)) {
		throw new Error("[addModule] given module does not extends NoxCanvasModule.");
	}

	if(typeof module.update === 'function')
		NOX_PV.updateModules.push(module);

	if(typeof module.render === 'function')
		NOX_PV.renderingModules.push(module);

	NOX_PV.modules.push(module);
};



/**
 * This will tell the library to log in the console the performances about the initialization of the canvas.
 */
export const logPerformances = () => {
	NOX_PV.logPerfs = true;
};


// private vars
const NOX_PV = {
	timer: new Time(),

	hasInitGlobalHandlers: false,

	hasUpdateFunc: false,
	hasDrawFunc: false,

	updateFunc: () => {},
	drawFunc: () => {},

	modules: [],
	updateModules: [],
	renderingModules: [],

	logPerfs: false,
	drawLoopInfo: {
		it: 0,
		t0: 0, // start
		t1: 0, // update time
		t2: 0, // draw time
		freq: 720
	},
	/**
	 * Default draw condition - run in every cases
	 * Do not use it. Use setDrawCondition instead.
	 */
	drawCond: () => true,

    camera: {
        hud: null,
        enabled: true,
        move: null
    },

    cam: null,

	lut: [],

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
	swipexDown: null, swipeyDown: null,
	// automatic canvas resizing
	autoResize: 0,
	// swipe direction
	lastSwipe: null,

	// guide lines (cyan)
	bGuideLines: false,

	// default text size & font-family
	fontSize: '12px',
	fontFamily: 'Monospace',

	loop: true,

	timer: 0,
	now: 0, then: Date.now(), firstThen: Date.now(), interval: 1000 / fps, delta: 0, counter: 0, time_el: 0,

	// Treat color's entries
	colorTreatment: (...oColor) => {
		const n = oColor.length;
		const color0 = oColor[0];

		if(color0 instanceof CanvasGradient || color0 instanceof CanvasPattern)
			return color0;

		// color class instance
		else if(color0 instanceof HEX || color0 instanceof RGB || color0 instanceof HSL)
			return color0.toString();

		// rgb[a]
		else if(n > 0 && n < 5 && oColor.every(c => typeof c === 'number')) {
			let p = 'rgb';
			let g = 0, b = 0, a = 0;

			if(n === 3 || n === 4) {
				g = 1;
				b = 2;
			}
			if(n === 2 || n === 4) {
				p += 'a';
				a = n-1;
			}

			let color = `${p}(${color0}, ${oColor[g]}, ${oColor[b]}`;

			if(a > 0)
				color += `, ${oColor[a]}`;

			color += ')';

			return color;
		}

		// hex, hsl[a], rgb[a], color name
		else if(n === 1 && typeof color0 === 'string') {
			oColor = color0.replace(/\s/gi, '');

			const reg = {
				hex: /^#([0-9a-z]{3}){1,2}$/i,
				rgb: /^rgba?\((\d{1,3},){2}\d{1,3}(,(0|1|(0?\.\d+)))?\)$/,
				hsl: /^hsl\(\d{1,3},\d{1,3}%,\d{1,3}%\)$/,
				hsla: /^hsla\(\d{1,3},\d{1,3}%,\d{1,3}%,(0|1|(0?.\d+))\)$/,
				name: /^\w{3,30}$/
			};

			for(const regex in reg) {
				if(reg[regex].test(oColor))
					return oColor;
			}
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
			const [dx, dy, ii, jj] = [x - x0, y - y0, x0 & 255, y0 & 255];

			// recover vectors
			const stuv = [];
			for(let i=0; i < 4; i++) {
				try {
					const v = seed[(ii + i % 2 + seed[jj + floor(i / 2)]) % 255] % NOX_PV.perlin.gradient.length;
					stuv.push(NOX_PV.perlin.gradient[v][0] * (dx - i % 2) + NOX_PV.perlin.gradient[v][1] * (dy - floor(i / 2)));
				} catch(e) {
					stuv.push(0);
				}
			}

			// smoothing
			const [Cx, Cy] = [3 * dx * dx - 2 * dx * dx * dx, 3 * dy * dy - 2 * dy * dy * dy];
			const [Li1, Li2] = [stuv[0] + Cx * (stuv[1] - stuv[0]), stuv[2] + Cx * (stuv[3] - stuv[2])];

			return map(Li1 + Cy * (Li2 - Li1), -NOX_PV.perlin.unit, NOX_PV.perlin.unit, 0, 1);
		}
	},

	easeElastic: (type, t, b, c, d) => {
		if(t === 0) return b;
		if((t /= d) === 1) return b + c;
		const p = d * .45;
		const s = p / ((c < 0) ? 4 : (2 * PI) * 1.57);
		const x = sin((t * d - s) * (2 * PI) / p);
		return (
            // in
            (type === 'in') ?
                -(c * pow(2, 10 * --t) * x) + b :
            // out
            (type === 'out') ?
                c * pow(2, -10 * t) * x + c + b :
            // in-out
            (t < 1) ?
                c * pow(2, 10 * --t) * x * -.5 + b :
                c * pow(2, -10 * --t) * x * .5 + c + b
        );
	},

	callbackListeners: {},

	callback: (event, e) => {
		if(event in NOX_PV.callbackListeners) {
			NOX_PV.callbackListeners[event](e);
		}
	}
};

NOX_PV.perlin.gradient = [
	[NOX_PV.perlin.unit, NOX_PV.perlin.unit],
	[-NOX_PV.perlin.unit, NOX_PV.perlin.unit],
	[NOX_PV.perlin.unit, -NOX_PV.perlin.unit],
	[-NOX_PV.perlin.unit, -NOX_PV.perlin.unit]
];

for(let i=0; i < 256; i++) {
	NOX_PV.lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
}

NOX_PV.easeFuncMap = {
	linear: easeLinear,
	quadIn: easeInQuad, quadOut: easeOutQuad, quadInOut: easeInOutQuad,
	sineIn: easeInSine, sineOut: easeOutSine, sineInOut: easeInOutSine,
	expoIn: easeInExpo, expoOut: easeOutExpo, expoInOut: easeInOutExpo,
	circIn: easeInCirc, circOut: easeOutCirc, circInOut: easeInOutCirc,
	cubicIn: easeInCubic, cubicOut: easeOutCubic, cubicInOut: easeInOutCubic,
	quartIn: easeInQuart, quartOut: easeOutQuart, quartInOut: easeInOutQuart,
	quintIn: easeInQuint, quintOut: easeOutQuint, quintInOut: easeInOutQuint,
	backIn: easeInBack, backOut: easeOutBack, backInOut: easeInOutBack,
	elasticIn: easeInElastic, elasticOut: easeOutElastic, elasticInOut: easeInOutElastic
};


const camera = new Camera();
NOX_PV.camera.hud = new Camera();
NOX_PV.cam = camera;

/**
 * Load all events about the canvas
 */
 const initializeAllEventHandlers = () => {
	const t0 = performance.now();

	/**
	 * Calculate the {top, left} offset of a DOM element
	 * @param {Element} elt the dom Element
	 */
	const offset = elt => {
		const rect = elt.getBoundingClientRect();

		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft
		};
	};



	// event mouse move
	canvas.addEventListener('pointerdown', e => {
		canvas.setPointerCapture(e.pointerId);

		NOX_PV.isMouseDown = true;

		dragPoint = {
			x: e.clientX - offset(canvas).left,
			y: e.clientY - offset(canvas).top
		};

		NOX_PV.callback('mousedown', e);

		canvas.addEventListener('pointerup', () => {
			try {
				canvas.releasePointerCapture(e.pointerId);
			} catch(e) {}

			dragPoint = null;

			NOX_PV.isMouseDown = false;

			if(typeof mouseUp === 'function')
				mouseUp(e);
		}, { once: true });
	});

	canvas.addEventListener('pointermove', e => {
		mouseX = e.clientX;
		mouseY = e.clientY;

		mouseDirection.x = e.movementX;
		mouseDirection.y = e.movementY;

		if(NOX_PV.isMouseDown) {
			const xUp = e.clientX;
			const yUp = e.clientY;

			const xDiff = dragPoint.x - xUp;
			const yDiff = dragPoint.y - yUp;

			let swipeDir;

			if(abs(xDiff) > abs(yDiff))
				swipeDir = (xDiff > 0)? 'left' : 'right';
			else
				swipeDir = (yDiff > 0)? 'up' : 'down';

			NOX_PV.lastSwipe = swipeDir;

			NOX_PV.callback('swipe', swipeDir);
			NOX_PV.callback('drag', e);
		}
		else {
			NOX_PV.callback('mousemove', e);
		}
	});

	canvas.addEventListener('click', e => NOX_PV.callback('click', e));
	canvas.addEventListener('mouseenter', e => NOX_PV.callback('mouseenter', e));
	canvas.addEventListener('mouseleave', e => NOX_PV.callback('mouseleave', e));
	canvas.addEventListener('wheel', e => NOX_PV.callback('wheel', e));
	canvas.addEventListener('contextmenu', e => NOX_PV.callback('contextmenu', e));
	canvas.addEventListener('dblclick', e => NOX_PV.callback('dblclick', e));



	// keyboard events

	if(NOX_PV.hasInitGlobalHandlers)
		return;

	NOX_PV.hasInitGlobalHandlers = true;

	// key pressed
	window.addEventListener('keypress', e => {
		NOX_PV.keys[e.code] = true;
		NOX_PV.callback('keypress', e);
	});


	// key downed
	window.addEventListener('keydown', e => {
		NOX_PV.keys[e.code] = true;
		NOX_PV.callback('keydown', e);
	});


	// key upped
	window.addEventListener('keyup', e => {
		NOX_PV.keys[e.code] = false;
		NOX_PV.callback('keyup', e);
	});

	// when user resize window or document
	window.addEventListener('resize', () => {
		const newWidth = document.documentElement.clientWidth,
			newHeight = document.documentElement.clientHeight;

		// avoids performance's hit if the user plays to resize a lot
		// if never defined before, it does not throw an error
		clearTimeout(NOX_PV.resizeEndedCallback);

		NOX_PV.resizeEndedCallback = setTimeout(() => {
			MIN_DOC_SIZE = min(newWidth, newHeight);
			NOX_PV.loop = true;

			if(NOX_PV.autoResize === 2) {
				setCanvasSize(newWidth, newHeight);
			}

			NOX_PV.callback('resizeended', { width: newWidth, height: newHeight });
		}, 100);

		if(NOX_PV.autoResize === 1) {
			setCanvasSize(newWidth, newHeight);
		}

		NOX_PV.callback('resize', { width: newWidth, height: newHeight });
	});

	window.addEventListener('blur', () => NOX_PV.callback('blur'));
	window.addEventListener('focus', () => NOX_PV.callback('focus'));
	window.addEventListener('online', e => NOX_PV.callback('online', e));
	window.addEventListener('offline', e => NOX_PV.callback('offline', e));

	const t1 = performance.now();

	if(NOX_PV.logPerfs) {
		const perfData = {
			initHandlers: { ms: (t1 - t0) },
		};

		console.info('Performances while initializing the canvas environment :');
		console.table(perfData);
	}

	NOX_PV.timer = new Time();
};