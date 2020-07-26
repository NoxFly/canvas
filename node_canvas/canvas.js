/**
 * @copyright   Copyright (C) 2019 - 2020 Dorian Thivolle All rights reserved.
 * @license     GNU General Public License version 3 or later; see LICENSE.txt
 * @author		Dorian Thivolle
 * @name		canvas
 * @package		NoxFly/canvas
 * @see			https://github.com/NoxFly/canvas
 * @since		30 Dec 2019
 * @version		{1.3.5}
 */

const NodeCanvas = require('canvas');





// PI
module.exports.PI = Math.PI;



const NOX_PV = {
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










class Canvas {
    /**
     * 
     * @param {number} width canvas's width
     * @param {number} height canvas's height
     * @param {background} background canvas's background
 	 * @param {string} support canvas support. It can be nothing, SVG or PDF
     */
    constructor(width, height, background=null, support=null) {
		if(support === null  || ['svg', 'pdf'].includes(support.toUpperCase())) {
			this._ = new NodeCanvas.createCanvas(width, height);
		} else {
			this._ = new NodeCanvas.createCanvas(width, height, support.toUpperCase());
		}

		this.background = background;

		// default text size & font-family
		this.sFontSize = "12px";
		this.sFontFamily = "Monospace";

		this.bFill = true;
		this.bStroke = true;
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
		try {
			switch(args.length) {
				case 0:
					this.ctx.drawImage(image); break;
				case 2:
					this.ctx.drawImage(image, dx, dy); break;
				case 4:
					this.ctx.drawImage(image, dx, dy, dw, dh); break;
				case 6:
					this.ctx.drawImage(image, sx, sy, dx, dy, dw, dh); break;
				default:
					console.error('Wrong number of argument given');
			}
		} catch(error) {
			console.error('An error occured while attempting to draw an image:\n' + error);
		}
	}

    /**
     * Canvas's width
     */
    get width() {return this._.width;}

    /**
     * Canvas's height
     */
	get height() {return this._.height;}
	



    /**
     * Create a new context to the canvas
     * @param {string} context either 2d or 3d context
     */
    getContext(context) {
        if(typeof this.ctx === 'undefined') {
            this.ctx = this._.getContext(context);
			
            if(this.background !== null) {
                this.fill(this.background);
                this.fillRect(0, 0, this.width, this.height);
            }
        }
        
        else {
            console.error('This canvas already has a context.');
        }

        return this.ctx;
    }

	/**
	 * Returns the node-canvas
	 */
	toString() {
		return this._;
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
        this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            
            if(this.bStroke) this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
     * Draw a polyline with given arguments
     * @argument {Array<number>} values Array of point's positions. Need to be even number
     */
    polyline(...values) {
        // got an odd number of argument
        if(values.length % 2 != 0) {
            console.error('The function polyline must take an even number of values');
            return;
        }

        this.ctx.beginPath();
            if(values.length > 0) {
                this.ctx.moveTo(values[0], values[1]);
            }

            for(let i=2; i < values.length; i+=2) {
                let x = values[i],
                    y = values[i+1];
                
                this.ctx.lineTo(x,y);
            }

            if(this.bStroke) this.ctx.stroke();
            if(this.bFill) this.ctx.fill();
        this.ctx.closePath();
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
        if(this.bFill) this.ctx.fill();
        if(this.bStroke) this.ctx.stroke();
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
    arc(x, y, r, start, end, antiClockwise=false) {
        this.ctx.beginPath();
            this.ctx.arc(x, y, r, start, end, antiClockwise);
            if(this.bStroke) this.ctx.stroke();
            if(this.bFill) this.ctx.fill();
        this.ctx.closePath();
    }

    /**
     * Draw a circle
     * @param {number} x circle's X
     * @param {number} y circle's y
     * @param {number} r circle's radius
     */
    circle(x, y, r) {
        this.arc(x, y, r, 0, 2 * PI);
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
        if(this.bFill) this.ctx.fill();
        if(this.bStroke) this.ctx.stroke();
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
        if(this.bFill) this.ctx.fill();
        if(this.bStroke) this.ctx.stroke();
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
                f: (x, y, r, start, end, antiClockwise) => this.ctx.arc(x, y, r, radian(start), radian(end), antiClockwise===1)
            },

            Z: {
                n: 0,
                f: () => this.lineTo(parseFloat(p[1]), parseFloat(p[2]))
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
        this.ctx.beginPath();
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

            if(this.bFill) this.ctx.fill();
            if(this.bStroke) this.ctx.stroke();
        this.ctx.closePath();
        
    }

    /**
     * Draw a text
     * @param {String} txt text to be displayed
     * @param {number} x text's X position
     * @param {number} y text's Y position
     */
    text(txt, x=0, y=0) {

        // multiple lines
        if(/\n/.test(txt)) {

            let size = this.sFontSize.replace(/(\d+)(\w+)?/, '$1');
            txt = txt.split('\n');

            for(let i=0; i < txt.length; i++) {
                this.ctx.fillText(txt[i], x, y + i*size);
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
        this.sFontSize = `${size}px`
    }



    /**
     * Set the font-family of the text
     * @param {String} font font-family
     */
    fontFamily(font) {
        ctx.font = `${this.sFontSize} ${font}`;
        sFontFamily = font
    }



    /**
     * Change the text's alignement
     * @param {String} alignment text's alignment
     */
    alignText(alignment) {
        this.ctx.textAlign = ['left', 'right', 'center', 'start', 'end'].indexOf(alignment) > -1? alignment : 'left';
    }





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
        this.background = NOX_PV.colorTreatment(...color);
    }

    /**
     * Set the stroke color for shapes to draw
     * @param  {...any} color Stroke color
     */
    stroke(...color) {
        this.ctx.strokeStyle = NOX_PV.colorTreatment(...color);
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
     * @param {String} style linecap style
     */
    linecap(style) {
        this.ctx.lineCap = ['butt','round','square'].indexOf(style) > -1? style : 'butt';
    }


    /**
     * Set the fill color for shapes to draw
     * @param  {...any} color Fill color
     */
    fill(...color) {
        this.ctx.fillStyle = NOX_PV.colorTreatment(...color);
        this.bFill = true;
    }

    /**
     * Clear the canvas from x,y to x+w;y+h
     */
    clearRect(x, y, width, height) {
        this.ctx.clearRect(x, y, x+width, y+height);
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
    translate(x,y) {
		this.ctx.translate(x,y);
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
	clip() {
		this.ctx.clipPath();
	}
}









class CanvasImageManager {
	constructor() {
		this.images = {};
	}

	/**
	 * Load an image if never used before then store it, and return it
	 * @param {string} name name of the image to be stored in the object
	 * @param {string} url image path
	 */
	async load(name, url=null) {
		if(typeof url === 'string') {
			if(!(name in this.images)) {
				this.images[name] = await NodeCanvas.loadImage(url);
			}
		}

		return this.images[name];
	}
}











/**
 * Create and return a new canvas.
 * @param {number} width width of the canvas
 * @param {number} height height of the canvas
 * @param {string} context the canvas context
 * @param {any} background the background of the canvas (fillRect on the creation)
 * @param {string} support canvas support. It can be nothing, SVG or PDF
 */
module.exports.createCanvas = (width, height, context='2d', background=null, support=null) => {
	if(width <= 0 || height <= 0) {
		console.warn('Canvas size must be higher than 0');
		return null;
    }
    
    if(background !== null) {
        background = NOX_PV.colorTreatment(background);
    }

	const canvas = new Canvas(width, height, background, support);

    const ctx = canvas.getContext(context);
    
	
	return canvas;
};



/**
 * Create a cache system for images
 * @param {Canvas} canvas 
 */
module.exports.createImageManager = () => {
	return new CanvasImageManager();
};


/**
 * Load an image
 * @param {string} src image path
 * @param {object} options image's options
 */
module.export.loadImage = (src, options={}) => NodeCanvas.loadImage(src, options);












/** MATHEMATICAL FUNCTIONS SECTION */



/**
 * Convert from degrees to radians
 * @param {number} deg degree value
 */
module.exports.radian = deg => deg * (PI/180);

/**
 * Convert from radians to degrees
 * @param {number} rad radian value
 */
module.exports.degree = rad => rad * (180/PI);

/**
 * Convert an angle to a vector (class instance) (2d vector)
 * @param {number} angle angle in radian
 */
module.exports.angleToVector = angle => new Vector(cos(angle), sin(angle));

/**
 * Returns the angle in degree of a given vector from the default vector (1,0)
 * @param {Vector} vector vector to calculate its angle
 */
module.exports.vectorToAngle = vec => {
	// horizontal vector - we don't care about its mag, but its orientation
	const baseVector = new Vector(1, 0);
	return angleBetweenVectors(baseVector, vec);
}

/**
 * Returns the angle between two given vectors
 * @param {Vector} a first vector
 * @param {Vector} b second vector
 */
module.exports.angleBetweenVectors = (a, b) => {
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
module.exports.dist = (a, b) =>  Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);

/**
 * range mapping of a value
 * @param {Array|number} val value - can be either an array or a number
 * @param {number} start1 start of the current interval
 * @param {number} end1 end of the current interval
 * @param {number} start2 start of the new interval
 * @param {number} end2 end of the new interval
 */
module.exports.map =	(arrayOrValue, start1, end1, start2, end2) => {

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
module.exports.pow =	(n, p=2) => Math.pow(n, p);

/**
 * Returns the absolute value of the given one
 * @param {number} n value
 */
module.exports.abs =	n => (n >= 0)? n : -n;

/**
 * Returns the sqrt of the given value
 * @param {number} n value
 */
module.exports.sqrt = n => Math.sqrt(n);

/**
 * Returns the minimum of given values
 * @param  {...Number} values value(s)
 */
module.exports.min = (...values) => Math.min(...values);

/**
 * Returns the maximum of given values
 * @param  {...Number} values value(s)
 */
module.exports.max = (...values) => Math.max(...values);

/**
 * Returns the rounded value of the given one
 * @param {number} n value
 */
module.exports.round = n => Math.round(n);

/**
 * Returns the floored value of the given one
 * @param {number} n value
 */
module.exports.floor = n => Math.floor(n);

/**
 * Returns the ceiled value of the given one
 * @param {number} n value
 */
module.exports.ceil = n => Math.ceil(n);


/**
 * Returns a random integer in a given interval. If 1 argument given, minimum is set to 0
 * @param {number} min minimal value
 * @param {number} max maximal value
 */
module.exports.random = (iMin, iMax=0) => floor(Math.random() * (max(iMin, iMax) - min(iMin, iMax) +1)) + min(iMin, iMax);


/**
 * 
 * @param {number} x x value to return its sinus
 */
module.exports.sin = x => Math.sin(x);


/**
 * 
 * @param {number} x x value to return its cosinus
 */
module.exports.cos = x => Math.cos(x);


/**
 * 
 * @param {number} x x value to return its tan
 */
module.exports.tan = x => Math.tan(x);


/**
 * 
 * @param {number} x x value to return its asin
 */
module.exports.asin = x => Math.asin(x);


/**
 * 
 * @param {number} x x value to return its acos
 */
module.exports.acos = x => Math.acos(x);


/**
 * 
 * @param {number} x x value to return its atan
 */
module.exports.atan = x => Math.atan(x);


/**
 * 
 * @param {number} x x value to return its atan2
 * @param {number} x y value to return its atan2
 */
module.exports.atan2 = (x, y) => Math.atan2(y, x);


/**
 * 
 * @param {number} x x value to return its sinh
 */
module.exports.sinh = x => Math.sinh(x);

/**
 * 
 * @param {number} x x value to return its cosh
 */
module.exports.cosh = x => Math.cosh(x);


/**
 * 
 * @param {number} x x value to return its exponential
 */
module.exports.exp = x => Math.exp(x);


/**
 * 
 * @param {number} x x value to return its logarithm
 */
module.exports.log = x => Math.log(x);


/**
 * 
 * @param {number} x x value to return its log10
 */
module.exports.log10 = x => Math.log10(x);

/**
 * Returns the sum of all values in a list
 * @param  {...number} values all values of a list
 */
module.exports.sum = (...values) => values.reduce((a, b) => a + b);

/**
 * Returns the mean of the values in a list
 * @param  {...number} values all values of a list
 */
module.exports.mean = (...values) => sum(...values) / values.length;

/**
 * Returns the median of the values in a list
 * @param  {...number} values all values of a list
 */
module.exports.median = (...values) => {
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
module.exports.mode = (...values) => values.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length? a: b), null);

/**
 * Returns the variance of the values in a list
 * @param  {...number} values all values of a list
 */
module.exports.variance = (...values) => values.reduce((a, b) => a + pow((b - mean(...values))), 0);

/**
 * Returns the standard deviation of the values in a list
 * @param  {...number} values all values of a list
 */
module.exports.std = (...values) => sqrt(variance(...values));






/** COLOR MANAGMENT SECTION */

/* HSL convertions :
	https://gist.github.com/mjackson/5311256
*/

module.exports.RGB = class {
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

module.exports.HEX = class {
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



module.exports.HSL = class {
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





module.exports.Vector = class {
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
}



module.exports.Path = class {
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

	clear() {
		this.d = null;
	}

	toString() {
        return this.d + (this.isClosed? ' Z' : '');
	}

	// M
	MoveTo(x, y) {
		if(this.d === null) {
			this.d = `M ${x} ${y}`;
		}
	
		else {
			this.d += ` M ${x} ${y}`;
		}
	}
	
	// m
	moveTo(x, y) {
		if(this.d === null) return console.error("You have to initialize the fist path's position");
		this.d += ` m ${x} ${y}`;
	}


	// L
	LineTo(x, y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` L ${x} ${y}`;
	}

	// l
	lineTo(x, y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` l ${x} ${y}`;

	}


	// H
	Horizontal(x) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` H ${x}`;
	}

	// h
	horizontal(x) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` h ${x}`;
	}


	// V
	Vertical(y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` V ${y}`;
	}

	// v
	vertical(y) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` v ${y}`;
	}

	
	// A
	Arc(x, y, r, start, end, antiClockwise=false) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` A ${x} ${y} ${r} ${start} ${end} ${(antiClockwise==true)?1:0}`;
	}

	// a
	arc(x, y, r, start, end, antiClockwise=false) {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.d += ` a ${x} ${y} ${r} ${start} ${end} ${(antiClockwise==true)?1:0}`;
	}


	// Z
	close() {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.isClosed = true;
	}

	open() {
		if(this.d === null) return console.error("You have to initialize the first path's position");
		this.isClosed = false;
	}

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