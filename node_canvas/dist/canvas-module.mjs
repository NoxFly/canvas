/**
 * @copyright   Copyright (C) 2019 - 2022 Dorian Thivolle All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE.txt
 * @author		Dorian Thivolle
 * @name		canvas
 * @package		NoxFly/canvas
 * @see			https://github.com/NoxFly/canvas
 * @since		30 Dec 2019
 * @version		{1.6.1}
 */

import * as CVS from 'canvas';





// PI
const PI = Math.PI;



const colorTreatment = (...oColor) => {
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
};


const _perlin = {
	lod: 10,
	unit: 1.0,
	gradient: [],
	seed: [],
	generateSeed: () => {
		return Array(255).fill(0).map((i, j) => j).sort(() => Math.random() - 0.5);
	},
	get: (x, y, lod = _perlin.lod, seed = _perlin.seed) => {
		// adapt the resolution
		x /= lod;
		y /= lod;

		// get table integer indexes
		const [x0, y0] = [floor(x), floor(y)];

		// get decimal part (dx,dy) & create mask (ii, jj)
		const [dx, dy, ii, jj] = [x - x0, y - y0, x0 & 255, y0 & 255];

		// recover vectors
		const stuv = [];
		for (let i = 0; i < 4; i++) {
			try {
				const v = seed[(ii + i % 2 + seed[jj + floor(i / 2)]) % 255] % _perlin.gradient.length;
				stuv.push(_perlin.gradient[v][0] * (dx - i % 2) + _perlin.gradient[v][1] * (dy - floor(i / 2)));
			} catch (e) {
				stuv.push(0);
			}
		}

		// smoothing
		const [Cx, Cy] = [3 * dx * dx - 2 * dx * dx * dx, 3 * dy * dy - 2 * dy * dy * dy];
		const [Li1, Li2] = [stuv[0] + Cx * (stuv[1] - stuv[0]), stuv[2] + Cx * (stuv[3] - stuv[2])];

		return map(Li1 + Cy * (Li2 - Li1), -_perlin.unit, _perlin.unit, 0, 1);
	}
};

_perlin.gradient = [
	[_perlin.unit, _perlin.unit],
	[-_perlin.unit, _perlin.unit],
	[_perlin.unit, -_perlin.unit],
	[-_perlin.unit, -_perlin.unit]
];




class Canvas {
	/**
	 *
	 * @param {number} width canvas's width
	 * @param {number} height canvas's height
	 * @param {background} background canvas's background
	  * @param {string} support canvas support. It can be nothing, SVG or PDF
	 */
	constructor(width, height, background = null, support = null) {
		if (support === null || !['svg', 'pdf'].includes(support.toUpperCase())) {
			this._ = CVS.createCanvas(width, height);
		} else {
			this._ = CVS.createCanvas(width, height, support.toUpperCase());
		}

		this.background = background;

		// default text size & font-family
		this.sFontSize = "12px";
		this.sFontFamily = "Monospace";

		this.bFill = true;
		this.bStroke = true;
	}

	/**
	 * @returns {CanvasRenderingContext2D}
	 */
	get ctx() {
		return this._.ctx;
	}

	/**
	 * Canvas's width
	 */
	get width() {
		return this._.width;
	}

	 /**
	  * Canvas's height
	  */
	get height() {
		return this._.height;
	}

	/**
	 * Returns the canvas as URL data
	 */
	toDataURL() {
		return this._.toDataURL();
	}

	/**
	 * Returns the canvas as buffer
	 */
	toBuffer() {
		return this._.toBuffer();
	}

	/**
	 *
	 * @param {CanvasImageSource} image
	 * @param  {...number} args
	 * @param {number} sx
	 * @param {number} sy
	 * @param {number} dx
	 * @param {number} dy
	 * @param {number} dw
	 * @param {number} dh
	 */
	drawImage(image, ...args) {

		if (![2, 4, 6].includes(args.length)) {
			console.error('wrong number of argument passed');
		}

		this.ctx.drawImage(image, ...args);
	}

	/**
	 * Returns the node-canvas
	 */
	toString() {
		return this._;
	}


	/**
	 * starts a new path by emptying the list of sub-paths.
	 * Call this method when you want to create a new path.
	 * @example
	 * beginPath()
	 */
	beginPath() {
		ctx.beginPath();
	}

	/**
	 * attempts to add a straight line from the current point to the start of the current sub-path.
	 * If the shape has already been closed or has only one point, this function does nothing.
	 * @example
	 * closePath()
	 */
	closePath() {
		ctx.closePath();
	}

	/**
	 * Move pen cursor to a point
	 * @param {number} x x of the point to move
	 * @param {number} y y of the point to move
	 */
	moveTo(x, y) {
		this.ctx.moveTo(x, y);
	}

	/**
	 * draw a line from the last point to given x,y
	 * @param {number} x line end X
	 * @param {number} y line end y
	 */
	lineTo(x, y) {
		this.ctx.lineTo(x, y);
	};

	/**
	 * Draw a line
	 * @param {number} x1 x of the first point of the line
	 * @param {number} y1 y of the first point of the line
	 * @param {number} x2 x of the second point of the line
	 * @param {number} y2 y of the second point of the line
	 */
	line(x1, y1, x2, y2) {
		this.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);

		this.closePath();

		if (this.bStroke)
			this.ctx.stroke();
	}

	/**
	 * Draw a polyline with given arguments
	 * @argument {number[]} values Array of point's positions. Need to be even number
	 */
	polyline(...values) {
		// got an odd number of argument
		if (values.length % 2 !== 0) {
			console.error('The function polyline must take an even number of values');
			return;
		}

		this.beginPath();
		if (values.length > 0) {
			this.ctx.moveTo(values[0], values[1]);
		}

		for (let i = 2; i < values.length; i += 2) {
			let x = values[i],
				y = values[i + 1];

			this.ctx.lineTo(x, y);
		}

		this.closePath();

		if (this.bStroke) this.ctx.stroke();
		if (this.bFill) this.ctx.fill();
	}

	/**
	 * Draw a filled rectangle (without borders)
	 * @param {number} x rectangle's X (top-left corner)
	 * @param {number} y rectangle's Y (top-left corner)
	 * @param {number} width rectangle's width
	 * @param {number} height rectangle's height
	 */
	fillRect(x, y, width, height) {
		this.ctx.fillRect(x, y, width, height);
		if (this.bFill) this.ctx.fill();
		if (this.bStroke) this.ctx.stroke();
	}

	/**
	 * Draw an arc
	 * @param {number} x arc's X
	 * @param {number} y arc's Y
	 * @param {number} r arc's radius
	 * @param {number} start angle start
	 * @param {number} end angle end
	 * @param {boolean} antiClockwise
	 */
	arc(x, y, r, start, end, antiClockwise = false) {
		this.beginPath();
		this.ctx.arc(x, y, r, start, end, antiClockwise);
		if (this.bStroke) this.ctx.stroke();
		if (this.bFill) this.ctx.fill();
		this.closePath();
	}

	/**
	 * Draw a circle
	 * @param {number} x circle's X
	 * @param {number} y circle's y
	 * @param {number} r circle's radius
	 */
	circle(x, y, r) {
		this.arc(x, y, r, 0, 2 * Math.PI);
	}

	/**
	 * Draw a strokeRect
	 * @param {number} x rectangle's X (top-left corner)
	 * @param {number} y rectangle's Y (top-left corner)
	 * @param {number} width rectangle's width
	 * @param {number} height rectangle's height
	 */
	strokeRect(x, y, width, height) {
		this.ctx.strokeRect(x, y, width, height);
		if (this.bFill) this.ctx.fill();
		if (this.bStroke) this.ctx.stroke();
	}

	/**
	 * Draw a rectangle
	 * @param {number} x rectangle's X (top-left corner)
	 * @param {number} y rectangle's Y (top-left corner)
	 * @param {number} width rectangle's Width
	 * @param {number} height rectangle's height
	 */
	rect(x, y, width, height) {
		this.ctx.rect(x, y, width, height);
		if (this.bFill) this.ctx.fill();
		if (this.bStroke) this.ctx.stroke();
	}

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
	roundRect(x = 0, y = 0, w = 0, h = 0, radius = 0, radiusTR, radiusBR, radiusBL) {
		if (radiusTR === undefined) radiusTR = radius;
		if (radiusBR === undefined) radiusBR = radius;
		if (radiusBL === undefined) radiusBL = radius;

		radius = min(max(0, radius), 50);
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

		this.beginPath();
		this.moveTo(x1, y1);
		this.lineTo(x2, y2);
		this.arcTo(x2 + radiusTR, y2, x2 + radiusTR, y2 + radiusTR, radiusTR);
		this.lineTo(x3, y3);
		this.arcTo(x3, y3 + radiusBR, x3 - radiusBR, y3 + radiusBR, radiusBR);
		this.lineTo(x4, y4);
		this.arcTo(x4 - radiusBL, y4, x, y4 - radiusBL, radiusBL);
		this.lineTo(x5, y5);
		this.arcTo(x5, y5 - radius, x1, y1, radius);
		this.closePath();

		if (this.bFill) this.ctx.fill();
		if (this.bStroke) this.ctx.stroke();
	}

	/**
	 * Create a custom path with assembly of shapes
	 * @param {string|Path} p path string that will be converted to d path code or Path class instance
	 */
	path(p) {
		// instruction: letter (MLHVAZ)
		// argument: numbers

		// remove spaces at the start and the end of the string
		p = p.trim();

		// a path must start with a moveTo instruction
		if (!p.startsWith('M')) {
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
				f: (x, y) => this.moveTo(x, y)
			},

			L: {
				n: 2,
				f: (x, y) => this.lineTo(x, y)
			},

			H: {
				n: 1,
				f: (x, y) => this.lineTo(x, y)
			},

			V: {
				n: 1,
				f: (y, x) => this.lineTo(x, y)
			},

			A: {
				n: 6,
				f: (x, y, r, start, end, antiClockwise) => this.ctx.arc(x, y, r, radian(start), radian(end), antiClockwise === 1)
			},

			Z: {
				n: 0,
				f: () => this.lineTo(parseFloat(p[1]), parseFloat(p[2]))
			}
		};


		// regex to verify if each point is okay
		const reg = new RegExp(`^[${Object.keys(modes).join('')}]|(\-?\d+(\.\d+)?)$`, 'i');

		// if a point isn't well written, then stop
		if (p.filter(point => reg.test(point)).length == 0) {
			return;
		}

		// doesn't need to try to draw something: need at least an instruction M first and 2 parameters x,y
		if (p.length < 3) {
			return;
		}

		// code translated path
		const d = [];
		// number of points - 1: last index of the array of points
		const lastIdx = p.length - 1;


		// read arguments - normally starts with x,y of the M instruction
		for (let i = 0; i < p.length; i++) {
			let point = p[i];

			// is a letter - new instruction
			if (/[a-z]/i.test(point)) {
				// lowercase - relative
				// uppercase - absolute
				// push pile of instructions (only 2 saved)
				mode = point;

				// if the instruction is Z
				if (mode === 'Z') {
					// and if it's the last mode
					if (i === lastIdx) {
						// then close the path
						d.push("Z");
					} else {
						// cannot use the Z somewhere else than the last point
						return;
					}
				}

				// lowercase Z isn't recognized
				if (['z'].includes(mode)) {
					return;
				}

				const nArg = modes[mode.toUpperCase()].n;

				// depending on the current instruction, there need to have to right number of argument following this instruction
				if (lastIdx - nArg < i) {
					return;
				}

				//
				let lastPos = { x: 0, y: 0 };

				// get the last cursor position
				if (d.length > 0) {
					let prev = d[d.length - 1];

					let hv = ['H', 'V'].indexOf(prev[0]);

					if (hv !== -1) {
						lastPos.x = prev[1 + hv]; // x of the last point
						lastPos.y = prev[2 - hv]; // y of the last point
					}

					else {
						let k = 1;

						lastPos.x = prev[k]; // x of the last point
						lastPos.y = prev[k + 1]; // y of the last point
					}
				}


				// array that is refresh every instruction + argument given
				let arr = [mode.toUpperCase()];

				// if it's H or V instruction, keep the last X or Y
				let hv = ['H', 'V'].indexOf(arr[0]);


				// add each argument that are following the instruction
				for (let j = 0; j < nArg; j++) {
					i++;

					let n = parseFloat(p[i]);

					// it must be a number
					if (isNaN(n)) {
						return;
					}

					// push the treated argument
					arr.push(n);
				}


				// onnly for H or V
				if (hv !== -1) {
					arr.push(lastPos[Object.keys(lastPos)[1 - hv]]);
				}

				if (arr[0] == 'A') {
					arr[1] -= arr[3];
				}

				// lowercase: relative to last point - only for MLHVA
				if (/[mlhva]/.test(mode)) {
					if (mode === 'v') {
						arr[1] += lastPos.y;
					}

					else if (mode === 'h') {
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
				if (arr[0] == 'A') {
					// arr = ['A', x, y, r, start, end, acw]
					const angle = radian(arr[5]);

					let x = arr[1] + cos(angle) * arr[3]
					y = arr[2] + sin(angle) * arr[3];

					d.push(['M', x, y]);
				}
			}

		}


		// start draw depending on what's written
		this.beginPath();

		d.forEach(step => {
			// surely Z()
			if (typeof step === 'string') {
				modes[step].f();
			}

			// else it's MLHVA with position arguments
			else {
				modes[step[0]].f(...step.slice(1));
			}
		});

		if (this.bFill) this.ctx.fill();
		if (this.bStroke) this.ctx.stroke();

	}

	/**
	 * Draw a text
	 * @param {String} txt text to be displayed
	 * @param {number} x text's X position
	 * @param {number} y text's Y position
	 */
	text(txt, x = 0, y = 0) {

		// multiple lines
		if (/\n/.test(txt)) {

			const size = parseInt(this.sFontSize.replace(/(\d+)(\w+)?/, '$1'));
			txt = txt.split('\n');

			for (let i = 0; i < txt.length; i++) {
				this.ctx.fillText(txt[i], x, y + i * size);
			}

		}

		// one line
		else {
			this.ctx.fillText(txt, x, y);
		}

	}


	/**
	 * Text settings - set the size and the font-family
	 * @param {number} size font size
	 * @param {String} font font name
	 */
	setFont(size, font) {
		this.ctx.font = `${size}px ${font}`;
		this.sFontSize = `${size}px`;
		this.sFontFamily = font;
	}



	/**
	 * Set the font size of the text
	 * @param {number} size font size
	 */
	fontSize(size) {
		this.ctx.font = `${size}px ${this.sFontFamily}`;
		this.sFontSize = `${size}px`;
	}



	/**
	 * Set the font-family of the text
	 * @param {String} font font-family
	 */
	fontFamily(font) {
		ctx.font = `${this.sFontSize} ${font}`;
		sFontFamily = font;
	}



	/**
	 * Change the text's alignement
	 * @param {CanvasTextAlign} alignment text's alignment
	 */
	alignText(alignment) {
		this.ctx.textAlign = ['left', 'right', 'center', 'start', 'end'].indexOf(alignment) > -1 ? alignment : 'left';
	}


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
	bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
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
	quadraticCurveTo(cpx, cpy, x, y) {
		this.ctx.quadraticCurveTo(cpx, cpy, x, y);
	};


	/**
	 * Says to not fill the shapes
	 */
	noFill() {
		this.bFill = false;
	}

	/**
	 * Says to not create strokes for shapes
	 */
	noStroke() {
		this.bStroke = false;
	}


	/**
	 * Change the canvas color
	 * @param  {...any} color background color
	 */
	background(...color) {
		this.background = colorTreatment(...color);
	}

	/**
	 * Set the stroke color for shapes to draw
	 * @param  {...any} color Stroke color
	 */
	stroke(...color) {
		this.ctx.strokeStyle = colorTreatment(...color);
		this.bStroke = true;
	}

	/**
	 * Set the strokeweight for shapes to draw
	 * @param {number} weight weight of the stroke
	 */
	strokeWeight(weight) {
		this.ctx.lineWidth = weight;
	}

	/**
	 * Set the linecap style
	 * @param {CanvasLineCap} style linecap style
	 */
	linecap(style) {
		this.ctx.lineCap = ['butt', 'round', 'square'].indexOf(style) > -1 ? style : 'butt';
	}


	/**
	 * Set the fill color for shapes to draw
	 * @param  {...any} color Fill color
	 */
	fill(...color) {
		this.ctx.fillStyle = colorTreatment(...color);
		this.bFill = true;
	}

	/**
	 * Clear the canvas from x,y to x+w;y+h
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 */
	clearRect(x, y, width, height) {
		this.ctx.clearRect(x, y, x + width, y + height);
	}






	/**
	 * create a save of the canvas at this given point
	 */
	push() {
		this.ctx.save();
	}

	/**
	 * Returns from the last save of the canvas
	 */
	pop() {
		this.ctx.restore();
	}

	/**
	 * Translate the canvas at the given point
	 * @param {number} x translation's X
	 * @param {number} y translation's Y
	 */
	translate(x, y) {
		this.ctx.translate(x, y);
	}

	/**
	 * rotate the canvas with given angle (in degree)
	 * @param {number} degree rotation's angle in degree
	 */
	rotate(degree) {
		this.ctx.rotate(radian(degree));
	}

	/**
	 * Clip the canvas with the drawn shape
	 */
	clip(...args) {
		this.ctx.clip(...args);
	}

	/**
	 * Adds a scaling transformation to the canvas units horizontally and/or vertically.
	 * @param {number} x Scaling factor in the horizontal direction. A negative value flips pixels across the vertical axis. A value of 1 results in no horizontal scaling.
	 * @param {number} y Scaling factor in the vertical direction. A negative value flips pixels across the horizontal axis. A value of 1 results in no vertical scaling.
	 */
	scale(x, y) {
		this.ctx.scale(x, y);
	}

	/**
	 * Creates a gradient along the line connecting two given coordinates.
	 * @param {number} x1 The x-axis coordinate of the start point.
	 * @param {number} y1 The y-axis coordinate of the start point.
	 * @param {number} x2 The x-axis coordinate of the end point.
	 * @param {number} y2 The y-axis coordinate of the end point.
	 * @return {CanvasGradient} A linear CanvasGradient initialized with the specified line.
	 */
	createLinearGradient(x1, y1, x2, y2) {
		this.ctx.createLinearGradient(x1, y1, x2, y2)
	}

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
	makeLinearGradient(x1, y1, x2, y2, ...params) {
		if (params.length % 2 !== 0) {
			return console.error('you have to tell params by pair (offset, color). Odd number of arguments given.');
		}

		const grad = this.createLinearGradient(x1, y1, x2, y2);

		for (let i = 0; i < params.length; i += 2) {
			const offset = params[i];
			const color = colorTreatment(params[i + 1]);

			grad.addColorStop(offset, color);
		}

		return grad;
	}

	/**
	 * Sets line dashes to current path
	 * @param {Array} array line dash to set to the current path
	 * @example
	 * setLineDash([5, 15])
	 */
	setLineDash(array) {
		if (!Array.isArray(array)) {
			return console.error('Array type expected. Got ' + typeof array);
		}

		this.ctx.setLineDash(array);
	}

	/**
	 * Returns the ctx.getLineDash() function's value
	 * @return {Array} An Array of numbers that specify distances to alternately draw a line and a gap (in coordinate space units).
	 * If the number, when setting the elements, is odd, the elements of the array get copied and concatenated.
	 * For example, setting the line dash to [5, 15, 25] will result in getting back [5, 15, 25, 5, 15, 25].
	 * console.info(getLineDash())
	 */
	getLineDash() {
		return this.ctx.getLineDash();
	}

	/**
	 * Specifies the alpha (transparency) value that is applied to shapes and images before they are drawn onto the canvas.
	 * @param {number} globalAlpha A number between 0.0 (fully transparent) and 1.0 (fully opaque), inclusive. The default value is 1.0.
	 * Values outside that range, including Infinity and NaN, will not be set, and globalAlpha will retain its previous value.
	 * @example
	 * globalAlpha(0.5)
	 */
	globalAlpha(globalAlpha) {
		this.ctx.globalAlpha = globalAlpha;
	}

	/**
	 * Sets the type of compositing operation to apply when drawing new shapes.
	 * @param {GlobalCompositeOperation} type a string identifying which of the compositing or blending mode operations to use.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation for more details
	 * @example
	 * globalCompositeOperation('soft-light')
	 */
	globalCompositeOperation(type) {
		this.ctx.globalCompositeOperation = type;
	}

	/**
	 * Sets the image smoothing quality
	 * @param {ImageSmoothingQuality} quality smooth quality
	 * @example
	 * setSmoothingQuality('low')
	 */
	setSmoothingQuality(quality) {
		this.ctx.imageSmoothingQuality = quality;
	}

	/**
	 * Retrieves the current transformation matrix being applied to the context.
	 * @return {DOMMatrix} A DOMMatrix object.
	 * @example
	 * const transformMatrix = getTransform()
	 */
	getTransform() {
		return this.ctx.getTransform();
	}

	/**
	 * Sets the line dash offset.
	 * @param {number} value A float specifying the amount of the line dash offset. The default value is 0.0.
	 * @example
	 * lineDashOffset(1)
	 */
	lineDashOffset(value = 0.0) {
		this.ctx.lineDashOffset = value;
	}

	/**
	 * Determines the shape used to join two line segments where they meet.
	 * This property has no effect wherever two connected segments have the same direction, because no joining area will be added in this case.
	 * Degenerate segments with a length of zero (i.e., with all endpoints and control points at the exact same position) are also ignored.
	 * @param {CanvasLineJoin} type 'round', 'bevel' or 'miter'
	 * @example
	 * lineJoin('round')
	 */
	lineJoin(type) {
		this.ctx.lineJoin = type;
	}

	/**
	 * Returns a TextMetrics object that contains information about the measured text.
	 * @param {string} text text string to measure
	 * @return {TextMetrics} A TextMetrics object.
	 * @example
	 * const textLength = measureText('Hello world')
	 */
	measureText(text) {
		return this.ctx.measureText(text);
	}

	/**
	 * Resets the current transform to the identity matrix.
	 * @example
	 * resetTransform()
	 */
	resetTransform() {
		this.ctx.resetTransform();
	}

	/**
	 * Sets the transformation matrix that will be used when rendering the pattern during a fill or stroke painting operation.
	 * @param {DOMMatrix2DInit} transform transform matrix, or 6 numbers parameters
	 * @example
	 * setTransform(1, .2, .8, 1, 0, 0)
	 */
	setTransform(...transform) {
		this.ctx.setTransform(...transform);
	}

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
	createPattern(image, repetition = 'repeat') {
		this.ctx.createPattern(image, repetition);
	}

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
	createImageData(widthOrImageData, height = null) {
		return this.ctx.createImageData(...arguments);
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
	putImageData(imageData, dx, dy, dirtyX = null, dirtyY = null, dirtyWidth = null, dirtyHeight = null) {
		if (dirtyX === null) {
			this.ctx.putImageData(imageData, dx, dy);
		} else {
			this.ctx.putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
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
	getImageData(sx, sy, sw, sh) {
		this.ctx.getImageData(sx, sy, sw, sh);
	}


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
	drawImage(image, sx, sy, sWidth = null, sHeight = null, dx = null, dy = null, dWidth = null, dHeight = null) {
		if (sWidth === null) {
			this.ctx.drawImage(image, sx, sy);
		} else if (dx === null) {
			this.ctx.drawImage(image, sx, sy, sWidth, sHeight);
		} else {
			this.ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		}
	};
}









class CanvasImageManager {
	images = {};

	/**
	 * Load an image if never used before then store it, and return it
	 * @param {string} name name of the image to be stored in the object
	 * @param {string} url image path
	 */
	async load(name, url = null) {
		if (typeof url === 'string') {
			if (!(name in this.images)) {
				this.images[name] = await CVS.loadImage(url);
			}
		}

		return this.images[name];
	}
}











/**
 * Create and return a new canvas with 2D context.
 * @param {number} width width of the canvas
 * @param {number} height height of the canvas
 * @param {string} context the canvas context
 * @param {any} background the background of the canvas (fillRect on the creation)
 * @param {string} support canvas support. It can be nothing, SVG or PDF
 */
const createCanvas = (width, height, background = null, support = null) => {
	if (width <= 0 || height <= 0) {
		console.warn('Canvas size must be higher than 0');
		return null;
	}

	if (background !== null) {
		background = colorTreatment(background);
	}

	const canvas = new Canvas(width, height, background, support);

	return canvas;
};



/**
 * Create a cache system for images
 */
const createImageManager = () => {
	return new CanvasImageManager();
};












/** MATHEMATICAL FUNCTIONS SECTION */



/**
 * Convert from degrees to radians
 * @param {number} deg degree value
 */
const radian = deg => deg * (PI / 180);

/**
 * Convert from radians to degrees
 * @param {number} rad radian value
 */
const degree = rad => rad * (180 / PI);

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
 * @example
 * const p1 = {x: 0, y: 0};
 * const p2 = {x: 10, y: 0};
 * const distanceBetweenp1Andp2 = dist(p1, p2);
 */
const dist = (a, b) => {
	const x = b.x - a.x;
	const y = b.y - a.y;
	const z = b.z - a.z;
	return sqrt(x*x + y*y + z*z);
}


/**
 * Returns a new vector, the magnitude of the two given.
 * @param {Vector} a first point
 * @param {Vector} b second point
 * @returns {Vector} The resulting magnitude vector
 */
const mag = (a, b) => new Vector(b.x - a.x, b.y - a.y);

/**
 * range mapping of a value
 * @param {Array|number} val value - can be either an array or a number
 * @param {number} start1 start of the current interval
 * @param {number} end1 end of the current interval
 * @param {number} start2 start of the new interval
 * @param {number} end2 end of the new interval
 */
const map = (arrayOrValue, start1, end1, start2, end2) => {
	const m = val => (val - start1) * (end2 - start2) / (end1 - start1) + start2;

	return (typeof arrayOrValue === 'number')
		? m(arrayOrValue)
		: arrayOrValue.map(val => m(val));
};

/**
 * Returns the power of the value (default power: 2)
 * @param {number} n value
 * @param {number} p power
 */
const pow = (n, p = 2) => Math.pow(n, p);

/**
 * Returns the absolute value of the given one
 * @param {number} n value
 */
const abs = n => (n >= 0) ? n : -n;

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
const clamp = (a, b, c) => max(a, min(b, c));

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
const random = (iMin = null, iMax = 0) => iMin === null ? Math.random() : floor(random() * (max(iMin, iMax) - min(iMin, iMax) + 1)) + min(iMin, iMax);


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
	if (values.length === 0) return 0;

	values.sort((a, b) => a - b);

	let half = floor(values.length / 2);

	if (values.length % 2) return values[half];
	return (values[half - 1] + values[half]) / 2.0;
};

/**
 * Returns the mode of the values in a list
 * @param  {...number} values all values of a list
 */
const mode = (...values) => values.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), null);

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



/** EASE FUNCTIONS */
// not avalaible for back-end because it's a static canvas.



/* */
/**
 * Perlin Noise function.
 *
 * Code from : http://pub.phyks.me/sdz/sdz/bruit-de-_perlin.html
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
const perlin = (x, y = 0) => {
	// create seed if never used perlin noise previously
	if (!_perlin.seed || _perlin.seed.length === 0) {
		_perlin.seed = _perlin.generateSeed();
	}

	return _perlin.get(x, y);
};

/**
 * Sets the level of details for the Perlin noise function.
 *
 * Default is 10. If given argument isn't a number, does nothing.
 * @param {number} detailLevel level of detail for Perlin noise function
 * @example
 * noiseDetails(200);
 */
const noiseDetails = detailLevel => {
	if (typeof detailLevel === 'number') {
		_perlin.lod = detailLevel;
	}
};


class PerlinNoise {
	static mapnumberTypes = ['default', 'rgb', 'hsl'];
	static getMapNumberTypeIndex = typeStr => PerlinNoise.mapnumberTypes.indexOf(typeStr.toLowerCase())
	/**
	 *
	 * @param {number} lod level of details
	 * @param {number} x start x of the array
	 * @param {number} y start y of the array
	 * @param {number} w width of the array
	 * @param {number} h height of the array
	 * @param {string} mapnumber map values to [auto: (-1,1)], [rgb: (0,255)], [hsl: (0, 360)]
	 */
	constructor(lod = 10, x = 0, y = 0, w = width, h = height, mapnumber = 'default') {
		this.lod = lod;
		this.seed = _perlin.generateSeed();
		this.start = { x, y };
		this.size = { width: w, height: h };
		this.array = [];
		this.numberMapStyle = PerlinNoise.getMapNumberTypeIndex(mapnumber);
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

		if (tmp !== lod) {
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
		this.seed = _perlin.generateSeed();
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
		mapnumber = PerlinNoise.getMapnumberTypeIndex(mapnumber);
		if (this.numberMapStyle === mapnumber) return;

		let Lmin = 0, Lmax = _perlin.unit, Rmin = 0, Rmax = _perlin.unit;

		if (this.numberMapStyle > 0) [Lmin, Lmax] = [0, (this.numberMapStyle === 1) ? 255 : 360];
		this.numberMapStyle = mapnumber;
		if (this.numberMapStyle > 0) [Rmin, Rmax] = [0, (this.numberMapStyle === 1) ? 255 : 360];

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

		for (let y = this.start.y; y < this.start.y + this.size.height; y++) {
			const row = [];

			for (let x = this.start.x; x < this.start.x + this.size.width; x++) {
				row.push(_perlin.get(x, y, this.lod, this.seed));
			}

			this.array.push(row);
		}

		if (this.numberMapStyle > 0) {
			this.setMapNumber(PerlinNoise.mapnumberTypes[this.numberMapStyle]);
		}
	}
}

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
	constructor(r, g = null, b = null, a = 255) {
		this.color = { r: 0, g: 0, b: 0 };

		if (r === undefined) {
			r = 0;
		}

		if (g !== null && b === null) {
			a = g;
			g = b = r;
		}

		// only one argument given: 3 are same (do grey)
		if (g === null) {
			g = r;
			b = r;
		}

		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	valueInInterval(val) {
		if (val < 0 || val > 255) {
			console.error(`Color interval [0 - 255] no repespected (${val} given)`);
			return min(max(val, 0), 255);
		}

		return val;
	}

	// getters (red, green, blue, alpha)
	get r() { return this.color.r; }
	get g() { return this.color.g; }
	get b() { return this.color.b; }
	get a() { return this.color.a; }

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
	set(r, g, b, a = null) {
		this.r = r;
		this.g = g;
		this.b = b;
		if (a) this.a = a;
	}


	toString() {
		return `rgb${this.a != 255 ? 'a' : ''}(${this.r}, ${this.g}, ${this.b}${this.a != 255 ? `, ${round(this.a / 255 * 10) / 10}` : ''})`;
	}

	intVal() {
		return [this.r, this.g, this.b, this.a];
	}

	// return a class instance of HEX, converting its color
	toHEX() {
		let r = Number(this.r).toString(16); if (r.length < 2) r = "0" + r;
		let g = Number(this.g).toString(16); if (g.length < 2) g = "0" + g;
		let b = Number(this.b).toString(16); if (b.length < 2) b = "0" + b;
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

		if (imax == imin) {
			h = s = 0;
		}

		else {
			let d = imax - imin;
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

	toString() { return this.color.str; }
	intVal() { return this.color.int; }

	set(hexaColor) {
		if (typeof hexaColor == 'number') {
			this.color.int = hexaColor;
			let h = hexaColor.toString(16) + '';
			this.color.str = '#' + (h.length == 4 ? '00' : '') + h;
		}

		else if (typeof hexaColor == 'string' && /^#?([0-9a-f]{3}){1,2}$/i.test(hexaColor)) {
			hexaColor = hexaColor.replace('#', '');
			if (hexaColor.length == 3) hexaColor = hexaColor[0].repeat(2) + hexaColor[1].repeat(2) + hexaColor[2].repeat(2);
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
		const b = this.intVal() & 0xFF;

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
	constructor(hue, saturation = 0.5, light = 0.5) {
		this.color = { h: 0, s: 0, l: 0 };

		if (typeof hue !== 'number') {
			console.error(`Hue given parameter isn't a recognized number value: ${hue}`);
			hue = 0;
		}

		this.h = hue;
		this.s = saturation;
		this.l = light;
	}

	get h() { return this.color.h; }
	get s() { return this.color.s; }
	get l() { return this.color.l; }

	set h(hue) {
		this.color.h = (hue >= 0) ? hue % 360 : 360 - (abs(hue) % 360);
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
		return `hsl(${this.h}, ${this.s * 100}%, ${this.l * 100}%)`;
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

		if (hh >= 0 && hh < 1) [r, g] = [C, X];
		else if (hh >= 1 && hh < 2) [r, g] = [X, C];
		else if (hh >= 2 && hh < 3) [g, b] = [C, X];
		else if (hh >= 3 && hh < 4) [g, b] = [X, C];
		else if (hh >= 4 && hh < 5) [r, b] = [X, C];
		else[r, b] = [C, X];

		const m = this.l - C / 2;

		r = round((r + m) * 255);
		g = round((g + m) * 255);
		b = round((b + m) * 255);

		return new RGB(r, g, b);
	}
}





class Vector {
	/**
	 * Creates a vector of dimension 1, 2 or 3
	 * @param {number} x x vector's coordinate
	 * @param {number} y y vector's coordinate
	 * @param {number} z z vector's coordinate
	 */
	constructor(x, y = null, z = null) {
		let dimension = 1;

		this.coords = {
			x: 0,
			y: 0,
			z: 0
		};

		const tmp = { x: 0, y: 0, z: 0 };

		// import from another vector
		if (x instanceof Vector) {
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
		if (this.dimension > 1) {
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
		if (this.dimension > 2) {
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
	normalize(apply = false) {
		// does not care about vector dimension
		const norm = Math.hypot(this.x, this.y, this.z);

		if (!apply) {
			return new Vector(this).normalize(true);
		}

		if (norm !== 0) {
			this.x = this.x / norm;

			if (this.dimension > 1) {
				this.y = this.y / norm;

				if (this.dimension === 3) {
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
	set(x, y = null, z = null) {
		if (x instanceof Vector) {
			this.x = x.x;
			if (this.dimension === 2) this.y = x.y;
			if (this.dimension === 3) this.z = x.z;
		}

		else if (typeof x !== 'number') {
			return console.error('[Error] Vector::set : x parameter must be a number or a Vector');
		}

		else {
			if (this.dimension > 1) {
				if (y !== null && typeof y !== 'number') {
					return console.error('[Error] Vector::set : y parameter must be a number');
				}

				if (z !== null && this.dimension > 2 && typeof z !== 'number') {
					return console.error('[Error] Vector::set : z parameter must be a number');
				}
			}

			this.x = x;

			if (this.dimension > 1) {
				if (y !== null) {
					this.y = y;
				}

				if (this.dimension === 3 && z != null) {
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
	add(x, y = null, z = null) {
		if (x instanceof Vector) {
			return this.set(this.x + x.x, this.y + x.y, this.z + x.z);
		}

		if (y === null) {
			y = x;
		}

		if (z === null) {
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
	sub(x, y = null, z = null) {
		if (x instanceof Vector) {
			return this.set(this.x - x.x, this.y - x.y, this.z - x.z);
		}

		if (y === null) {
			y = x;
		}

		if (z === null) {
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
	mult(x, y = null, z = null) {
		if (x instanceof Vector) {
			return this.set(this.x * x.x, this.y * x.y, this.z * x.z);
		}

		if (y === null) {
			y = x;
		}

		if (z === null) {
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
	div(x, y = null, z = null) {
		if (x instanceof Vector) {
			return this.set(this.x / x.x, this.y / x.y, this.z / x.z);
		}

		if (y === null) {
			y = x;
		}

		if (z === null) {
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
	invert(antiClockwise = false) {
		// not 1D, else we just have to do x = x
		if (this.dimension > 1) {
			// 2D
			if (this.dimension === 2) {
				[this.x, this.y] = [this.y, this.x];
			}

			// 3D
			else {
				if (antiClockwise) {
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
		if (this.dimension > 1) this.y = this.y * newMag / this.mag;
		if (this.dimension > 2) this.z = this.z * newMag / this.mag;

		return this;
	}

	/**
	 * Returns the vector's object as a string
	 * @returns {string}
	 * @example
	 * const v = new Vector(1, 2);
	 * console.info(v); // {x: 1, y: 2}
	 * console.info(v.toString()); // is equivalent
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
		if (this.dimension > 1) arr.push(this.y);
		if (this.dimension > 2) arr.push(this.z);

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

		if (this.dimension > 1) {
			o.y = this.y;

			if (this.dimension > 2) {
				o.z = this.z;
			}
		}

		return o;
	}
}


class Matrix {

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
		if (args.length > 0) {
			if (args[0] instanceof Matrix) {
				this.properties.width = args[0].width;
				this.properties.height = args[0].height;

				for (let i = 0; i < args[0].height; i++) {
					const row = [];
					for (let j = 0; j < args[0].width; j++) {
						row.push(args[0].at(j, i));
					}
					this.properties.array.push(row);
				}
			}

			// [width, height, fill?]
			else if (typeof args[0] === 'number') {
				let fill = 0;
				const w = args[0];
				let h = w;

				if (args.length > 1 && typeof args[1] === 'number') {
					h = args[1];

					if (args.length > 2 && typeof args[2] === 'number') {
						fill = args[2];
					}
				} // else square matrix if only 1 number given

				for (let i = 0; i < h; i++) {
					const row = [];
					for (let j = 0; j < w; j++) {
						row.push(fill);
					}
					this.properties.array.push(row);
				}

				this.properties.width = w;
				this.properties.height = h;
			}

			// argument is an array (of arrays ?)
			else if (args.length === 1 && Array.isArray(args[0]) && args[0].every(a => Array.isArray(a) && a.length === args[0][0].length && a.every(e => typeof e === 'number'))) {
				// all elements of parent array are arrays
				// form of argument :
				// [[0, 0, 0],[0, 0, 0]] : 2D array
				this.properties.array = args[0];
				if (args[0].length > 0) this.properties.width = args[0][0].length;
				this.properties.height = args[0].length;
			}

			// all elements of parent array are numbers
			// form of argument :
			// [0, 0, 0], [0, 0, 0] : multiple arguments which are arrays of numbers
			else if (args.every(a => Array.isArray(a) && a.length === args[0].length && a.every(e => typeof e === 'number'))) {
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
		const m = uncluttered ? max(...this.array.map(a => max(...a.map(e => e.toString().length)))) : 0;

		const _format = uncluttered ?
			arr => {
				return arr.map(e => ' '.repeat(6 + m - e.toString().length * 2) + e).join(' ');
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
		if (typeof x === 'number' && typeof y === 'number' && x > -1 && y > -1 && x < this.width && y < this.height) {
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
		if (this.at(x, y) !== null && typeof value === 'number') {
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
		if (matrix.width !== this.width || matrix.height !== this.height)
			return false;

		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if (matrix.at(j, i) !== this.at(j, i))
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
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				if (this.at(i, j) !== this.at(j, i))
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
		if (!this.isSquare)
			return false;

		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				const e = this.at(j, i);
				if (j >= i && e !== 0)
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
		if (!this.isSquare)
			return false;

		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				const e = this.at(j, i);
				if (j <= i && e !== 0)
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
		if (this.isSquare)
			return this.array.map((arr, i) => arr[i]);

		return [];
	}

	/**
	 * Returns the matrix determining. det(M).
	 * @returns {number} The determining of the matrix
	 */
	get det() {
		if (!this.isSquare)
			return 0;

		if (this.isIdendity)
			return 1;

		if (this.isDiagonal || this.isTriangular) {
			const diag = this.diagonal;
			return diag.reduce((acc, curr) => acc * curr, 1);
		}

		if (this.width === 2) {
			return this.at(0, 0) * this.at(1, 1) - this.at(1, 0) * this.at(0, 1);
		}

		else if (this.width === 3) {
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
		if (!('op' in this))
			this.op = (a, b) => a + b;

		if (!(matrix instanceof Matrix) && typeof matrix !== 'number') {
			console.error(`[Error] Matrix::add : Matrix expected, ${typeof matrix} given`);
			delete this.op;
			return this;
		}

		if (matrix instanceof Matrix) {
			if (matrix.width !== this.width || matrix.height !== this.height) {
				console.error('[Error] Matrix::add : Cannot operate an addition between 2 matrices with different dimensions.');
				delete this.op;
				return this;
			}
		}

		const result = onACopy ? new Matrix(this) : this;
		const b = matrix instanceof Matrix;

		// operate
		for (let i = 0; i < result.height; i++) {
			for (let j = 0; j < result.width; j++) {
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
		if (typeof m === 'number') {
			for (let i = 0; i < result.height; i++) {
				for (let j = 0; j < result.width; j++) {
					result.set(j, i, result.at(j, i) * m);
				}
			}
		}

		// matrices multiplication
		else if (m instanceof Matrix) {
			if (m.height !== this.width || m.width !== this.height) {
				console.error('[Error] Matrix::mult : matrices must have same transposed size.');
			}

			else {
				result = new Matrix(this.height);

				for (let i = 0; i < this.height; i++) {
					for (let j = 0; j < this.height; j++) {
						let s = 0;
						for (let k = 0; k < this.width; k++) {
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

		if (onACopy)
			[copy, me] = [me, copy];

		me.properties.size = Object.freeze({
			x: me.properties.size.y,
			y: me.properties.size.x
		});

		me.properties.array = [];

		for (let i = 0; i < copy.width; i++) {
			const row = [];
			for (let j = 0; j < copy.height; j++) {
				row.push(0);
			}
			me.properties.array.push(row);
		}

		for (let i = 0; i < copy.height; i++) {
			for (let j = 0; j < copy.width; j++) {
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
		if (x < 0 || x > this.width)
			return [];

		const column = [];
		for (let i = 0; i < this.height; i++)
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
		if (y < 0 || y > this.height)
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
		if (x < 0 || x > this.width)
			return console.error('[Error] Matrix::setColumn : wrong index given.');

		if (column.length !== this.height)
			return console.error('[Error] Matrix::setColumn : column must have the same length as the matrix\'s height.');

		for (let i = 0; i < this.height; i++)
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
		if (y < 0 || y > this.height)
			return console.error('[Error] Matrix::setRow : wrong index given.');

		if (row.length !== this.height)
			return console.error('[Error] Matrix::setRow : row must have the same length as the matrix\'s width.');

		this.properties.array[y] = row;

		return this;
	}
}



class Path {
	/**
	 * Creates Path instance
	 * @param {number} x where must start the path X
	 * @param {number} y where must start the path Y
	 */
	constructor(x = null, y = null) {
		this.d = null;
		this.isClosed = false;

		if (x && y) {
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
		if (this.d !== null) {
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
		if (this.d === null) {
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
		if (this.d === null) return console.error('You have to initialize the fist path\'s position');
		this.d += ` m ${x} ${y}`;
	}


	/**
	 * LineTo instruction - absolute
	 * @param {number} x X-axis coordinate
	 * @param {number} y y-axis coordinate
	 */
	LineTo(x, y) {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` L ${x} ${y}`;
	}

	/**
	 * lineTo instruction - relative
	 * @param {number} x X-axis coordinate
	 * @param {number} y y-axis coordinate
	 */
	lineTo(x, y) {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` l ${x} ${y}`;

	}


	/**
	 * Horizontal instruction - absolute
	 * @param {number} x X-axis coordinate
	 */
	Horizontal(x) {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` H ${x}`;
	}

	/**
	 * horizontal instruction - relative
	 * @param {number} x X-axis coordinate
	 */
	horizontal(x) {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` h ${x}`;
	}


	/**
	 * Vertical instruction - absolute
	 * @param {number} y Y-axis coordinate
	 */
	Vertical(y) {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` V ${y}`;
	}

	/**
	 * Vertical instruction - relative
	 * @param {number} y Y-axis coordinate
	 */
	vertical(y) {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
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
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
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
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.d += ` a ${x} ${y} ${r} ${start} ${end} ${(antiClockwise === true) ? 1 : 0}`;
	}


	/**
	 * Close path
	 */
	close() {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.isClosed = true;
	}

	/**
	 * Removes the instruction that close the path if it was.
	 */
	open() {
		if (this.d === null) return console.error('You have to initialize the first path\'s position');
		this.isClosed = false;
	}

	/**
	 * Moves the entire path.
	 * @param {number} x X-axis coordinate
	 * @param {number} y Y-axis coordinate
	 */
	move(x, y = null) {
		// 1 argument and it's a vector
		if (y === null && x instanceof Vector) {
			[x, y] = [x.x, x.y];
		}

		if (this.d === null) return;

		this.d = this.d.replace(/([MLHVA])\s([\d\.]+)(\s([\d\.]+))?/g, (c, p1, p2, p3) => {
			if (p1 === 'H') return `${p1} ${parseFloat(p2) + x}`;

			if (p1 === 'V') return `${p1} ${parseFloat(p2) + y}`;

			return `${p1} ${parseFloat(p2) + x} ${parseFloat(p3) + y}`;
		});
	}
}


/**
 * A 4-children based tree that is used to manage world entities relations
 * with better performances.
 */
class Quadtree {
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
	constructor(boundary, capacity = 5) {
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
		return this.divided ? [this.northwest, this.northeast, this.southwest, this.southeast] : [];
	}

	/**
	 * Subdivides the Quadtree if it isn't.<br>
	 * Separates itself in 4 regions that fill itself.
	 */
	subdivide() {
		if (!this.divided) {
			const { x, y, w, h } = this.boundary;

			const ne = new Quadtree.Rectangle(x + w / 2, y, w / 2, h / 2);
			const nw = new Quadtree.Rectangle(x, y, w / 2, h / 2);
			const se = new Quadtree.Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
			const sw = new Quadtree.Rectangle(x, y + h / 2, w / 2, h / 2);

			this.northwest = new Quadtree(nw);
			this.northeast = new Quadtree(ne);
			this.southwest = new Quadtree(sw);
			this.southeast = new Quadtree(se);

			this.divided = true;

			for (const p of this.points) {
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
		if (!this.boundary.contains(point))
			return false;

		if (this.divided) {
			return this.northeast.insert(point)
				|| this.northwest.insert(point)
				|| this.southeast.insert(point)
				|| this.southwest.insert(point);
		}
		else if (this.points.length < this.capacity) {
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
		if (!this.divided) {
			if (range.wrap(this.boundary)) {
				return this.points;
			}
			else if (range.intersect(this.boundary)) {
				const found = [];

				for (const p of this.points) {
					if (range.contains(p))
						found.push(p);
				}

				return found;
			}

			return [];
		}

		// node
		// totally wraps the boundary : add all leafs
		if (range.wrap(this.boundary)) {
			return this.getAllPoints();
		}

		// partially or does not collides the range
		const found = [];

		found.push(...this.northwest.query(range, _isWrapped));
		found.push(...this.northeast.query(range, _isWrapped));
		found.push(...this.southwest.query(range, _isWrapped));
		found.push(...this.southeast.query(range, _isWrapped));

		return found;
	}

	/**
	 * Delimits the bounds of the Quadtree and recursivly do it for its children
	 * if it is splitted.<br>
	 * Default stroke color is #141414, but you can change it.
	 * @param {any} color The color of the limits. Default is #141414
	 */
	show(color = 20) {
		noFill();
		stroke(color);
		strokeWeight(1);
		strokeRect(this.boundary.x, this.boundary.y, this.boundary.w - 1, this.boundary.h - 1);

		if (this.divided) {
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
		if (!this.divided)
			return this.points;

		const points = [];

		for (const region of this.children)
			points.push(...region.getAllPoints());

		return points;
	}

	/**
	 * Returns the total size of the tree, containing its point and the points of its children.
	 * @returns {number} The total size of the tree (number of points contained inside it)
	 */
	size() {
		let n = this.points.length;

		for (const region of this.children)
			n += region.size();

		return n;
	}
}




/* *********** */
export {
	PI,
	createCanvas,
	createImageManager,

	radian, degree,
	angleToVector, vectorToAngle, angleBetweenVectors,
	dist, mag,
	map,
	pow, abs, sqrt, min, max, clamp, round, floor, ceil,
	random, sin, cos, tan, asin, acos, atan, atan2,
	sinh, cosh, exp, log, log10, mean, median, mode,
	variance, std,

	perlin, noiseDetails,

	PerlinNoise,
	RGB, HEX, HSL,
	Vector, Matrix,
	Path,
	Quadtree
};