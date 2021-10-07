# Canvas Framework
### A canvas framework which simplify all uses 

[![GitHub contributors](https://img.shields.io/github/contributors/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/graphs/contributors/)
[![Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https://github.com/NoxFly/canvas)](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https://github.com/NoxFly/canvas)
[![GitHub issues](https://img.shields.io/github/issues/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/issues/)
[![npm version](https://badge.fury.io/js/%40noxfly%2Fcanvas.svg)](https://badge.fury.io/js/%40noxfly%2Fcanvas)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Paypal Donate](https://img.shields.io/badge/paypal-donate-red.svg)](https://paypal.me/noxfly)
[![GitHub stars](https://img.shields.io/github/stars/NoxFly/canvas.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/NoxFly/canvas/stargazers/)
[![Npm Downloads](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)



This canvas framework is only creating 2D context, but provides 3D vectors. 

You can help me to maintain this framework with small donation on my Paypal, or with pull requests.

You also can star it, open issues if needed, and join the official Discord server for asking help or making some suggestions:

**Official Discord Server**: https://discord.gg/j5SarbC


**For module scripts :** [module README](https://github.com/NoxFly/canvas/tree/master/module#readme).

**For Nodejs backend canvas :** [nodejs README](https://github.com/NoxFly/canvas/tree/master/node_canvas#readme).



## CDN include links

**/!\\** these links refers to the latest version.

// You may have some issues if a new version is released in the future.

### By the github way

```html
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/canvas.js'></script>
<!-- minified version -->
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/canvas.min.js'></script>
```

### By the npm way

```html
<!-- minified version -->
<script src='https://cdn.jsdelivr.net/npm/@noxfly/canvas'></script>
```




## NPM
[https://www.npmjs.com/package/@noxfly/canvas](https://www.npmjs.com/package/@noxfly/canvas)

[![npm](https://nodei.co/npm/@noxfly/canvas.png?mini=true)](https://www.npmjs.com/package/@noxfly/canvas)


## About
Some variables of the framework are public, but some others are private.
Please, do not use variables and functions that aren't provided for you, or you will incur some issues.


The `setup` and `draw` structure, but also the `color managment` and the `pixel managment` (last feature) ideas come from [p5.js](https://p5js.org).

Most of shortcut functions for native canvas functions have their JSDOC that come from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

I've start this little framework just to simplify myself in a little project.

As things progress, The little code grew up, and it's why I've finally though about make it public on Github.

**There's not any desire of copying the code of someone else, just to regroup things that can help me in my codes, to do it faster, and train me in the same way.**

**If you're interested, you can contribute doing pull requests, and starring this repo.**


## Browser compatibility
Tested and works on `Firefox`, `Chrome`, `Edge`, `new Edge`, `Opera`.







## 3 required functions
You first need to create 2 functions, that are automatically detected by the framework.

```js
function setup() {
    // create canvas & setup everything here
}

function update(ms) {
    // called every loop
    // ms is the milliseconds ellapsed from when the page has loaded
}

function draw() {
    // called in the loop, after the update function if it exists, and after the canvas is cleared
}
```

The `setup` function is called when the window has loaded.

The `update` and `draw` functions are called after the setup function, and are looped every fixed frames (can be changed whenever you want).





## Create a canvas

If you already created one, it will overwrite the existing one.

```js
createCanvas(canvasWidth, canvasHeight, canvasBackground='#000', requestPointerLock=false, container=document.body);
// if you want a fullscreen canvas in a specific container
// createCanvas(null, null, '#000', false, documentQuerySelector('mySpecificContainer'));
```

This function has to be written in the setup function.
Once the canvas is created, you can access to it by the global variable `canvas`, and its context `ctx` (2d context).

If you set the requestPointerLock to `true`, you have to click on the canvas to be pointer locked (and Esc to unlock).

You also can access to the canvas size with both variables `width` and `height`.

The `canvasBackground` parameter can be any background's type (hexa, hsl, rgb, color name, ...).

If you don't set a canvas width and height, the document's size will be set.




## Resize the canvas and canvas resolution

You can change the canvas size by doing the following function:
```js
setCanvasSize(newWidth, newHeight);
```

and its resolution (so it will keep its size, but the pixel resolution inside it will change) doing this:
```js
setPixelResolution(resolutionX, resolutionY);
```

Then, for example, you can have a canvas of 500x500, and a resolution of 2000x2000.

You can convert the pixel's resolution to real HTML canvas size and inversely with this functions:

```js
rendering(vector); // 2D vector
rendering(x, y); // two numbers instead of a vector

renderingX(x);
renderingY(y);
```



## Guidelines

You can enable guidelines while you are developing, in the setup function:

```js
function setup() {
    createCanvas(500, 500);

    showGuideLines(true); // by default set to false
}
```

## Performances

You can log the performances of your code with the following function.
It will print every 6 minuts a table with passed performances.

```js
logPerformances();
```



## Get document size

A shortcut to get the document size, even if you resize it:
```js
documentWidth();
documentHeight();
```

Therefore, you can create full-screen canvas:
```js
function setup() {
    createCanvas(documentWidth(), documentHeight());
    createCanvas(); // same result
}
```





## Public variables
Here are the variables declared in the canvas file, that you can use:

**MIN_DOC_SIZE**: the value of the minimum between document width and height (change on document resizing)

**isDevice**:  object that has 3 booleans:

* `mobile`: either it's a mobile/tablet or PC

* `ios`: either it's an IOS or not
    
* `android`: either it's an Android or not

**canvas**: the canvas DOM element

**ctx**: the 2d context of the canvas variable

**width** and **height**: the size of the canvas

**realWidth** and **realHeight**: the size of the resolution of the canvas

**mouseX** and **mouseY**: the mouse current position

**fps**: the frame per seconds of the draw function (by default 60)

**mouseDirection**: object containing the x and y mouse's direction movement. The faster the mouse goes, the larger will the number be

**camera**: The canvas's camera.





## Canvas utility functions

```js
noLoop(); // draw only once, doesn't erase it, and don't loop (erase then draw in loop)
background(color); // change the canvas background
beginPath(); // ctx.beginPath()
closePath(); // ctx.closePath()
setDrawCondition(() => boolean); // tell when it must draw or not (default is "return true")
clear(x, y, w, h); // canvas clearRect function
push(); // canvas save function
pop(); // canvas restore function
translate(x, y); // canvas translate function
rotate(degree); // canvas rotate function
clip(); // ctx.clipPath() function
scale(p); // scale the context. if p < 1, then reduces it, else grows it
frameRate(number); // set the draw frame rate
createLinearGradient(x1, y1, x2, y2); // creates and returns a ctx.createLinearGradient
makeLinearGradient(x1, y1, x2, y2, ...args); // same as above, but merge it with gradient.addColorStop(offset, color) function
drawFocusIfNeeded(path|element[, element]);
setLineDash(array); // sets line dash array of the sub-path
getLineDash(); // gets line dash array
lineDashOffset(value); // sets the line dash offset
lineJoin(type); // set the line join's type
globalAlpha(alpha); // sets alpha of the sub-path
globalCompositeOperation(style); // sets a global composite operation
setSmoothingQuality(quality); // low, medium, high
isPointInPath(x, y);
isPointInStroke(x, y);
setTransform(transformMatrix|[a, b, c, d, e, f]);
getTransform();
resetTransform();
createPattern(image, repetition); // create a pattern for a given image
createImageData([width, height] | imageData);
putImageData(imageData, dx, dy[, dirtyX, dirtyY, dirtyWidth, dirtyHeight]);
getImageData(sx, sy, sw, sh);
drawImage(image, sx, sy[, sw, sh, dx, dy, dw, dh]);
enableSmoothing(); // enable imageSmoothing
disableSmoothing(); // disable imageSmoothing
loadPixels(); // loads an array of pixels from the size of the canvas (width*height). Availible through the variable called "pixels"
updatePixels(); // update the canvas with modified pixels
```


## Keyboard and mouse Functions
Keyboard functions :
```js
enablePCswipe(boolean); // in the setup function, default is true
getSwipe(); // returns the last swipe direction done by the user
mouseDir(); // returns the direction of the mouse's movement, null otherwise
isKeyDown(keyCode); // returns a boolean
isKeyUp(keyCode); // returns a boolean
```


## Canvas event handlers

The framework handles a lot of events, and you can catch them with functions that will be automatically executed when an event is handled.
```js
// mouse events
function mouseMove(e) {}
function mouseDown(e) {}
function mouseUp(e) {}
function mouseEnter(e) {}
function mouseLeave(e) {}

// mouse buttons event
function mouseWheel(e) {}
function onClick() {}
function onContextmenu(e) {}
function onSwipe() {}

// keyboard events
function keyPress(e) {}
function keyDown(e) {}
function keyUp(e) {}

// global events
function onResize(docWidth, docHeight) {}
function onFocus() {}
function onBlur() {}
function onOnline(e) {}
function onOffline(e) {}
```

## Other functions

```js
generateUUID(); // returns a unique ID
```


## Camera

You can at any moment enable or disable it with these two functions :
```js
enableCamera();
disableCamera();
```

A Camera has 2 anchors : either its top-left corner, or its center. The default is the first one.

The default position of the camera is (0, 0), so you're in a real-default-like canvas.

Here are the Camera's methods :
```js
// constructor
Camera(vectorPosition=null); // default is (0, 0)
// defines the anchor's type of the camera
Camera.setAnchor(Camera.ANCHOR_DEFAULT|Camera.ANCHOR_CENTER);
// defines the ease function to use when moving the camera
// see ease functions for it
// The default is 'quadInOut'
Camera.setMoveType(moveType);
// tells the camera to follow a given point.
// if an object is given, and if this object has the property 'position'
// which is a vector, then it will follow it
Camera.follow(vector);
Camera.stopFollow();
// moves the camera from its position to its position + given x,y
// default duration of the move is 1s.
Camera.move(x, y, duration=1000);
// moves the camera to the given (x,y) point
Camera.moveTo(x, y, duration=1000);
// tells the camera to stop its movement
Camera.stop();
```



## Colors

### RGB
```js
color = new RGB(255); // r: 255, g: 255, b: 255
color = new RGB(10, 20, 30); // r: 10, g: 20, b: 30, a: 255
color = new RGB(10, 10, 10, 40); // r: 10, g: 10, b: 10, a: 40
color = new RGB(10, 20); // r: 10, g: 10, b: 10, a: 20

color2 = color.toHEX(); // create a new HEX color class instance of this converted color
color3 = color.toHSL(); // create a new HSL color class instance of this converted color

color.r, color.g, color.b; // three color components

color.set(1, 1, 1, 1); // same as the constructor

color.toString(); // "rgba(1, 1, 1, 1)"
// if alpha = 255: "rgb(1, 1, 1)"

color.intVal(); // [1, 1, 1, 1]
```

### HEX
```js
color = new HEX('#f00'); // string of 3 values
color = new HEX('#007fff'); // string of 6 values
color = new HEX(0x007fff); // hex number

color.toRGB(); // create a new RGB class instance of this converted color
color.toHSL(); // create a new HSL class instance of this converted color

color.set('#fff'); // same as the constructor

color.toString(); // "#007fff"
color.intVal(); // 32767
```

### HSL
```js
color = new HSL(360); // h: 360, s: 0.5, l: 0.5
color = new HSL(0, 0.1); // h: 0, s: 0.1, l: 0.5
color = new HSL(50, 0.2, 0.7); // h: 50, s: 0.2, l: 0.7

color.toRGB(); // create a new RGB class instance of this converted color
color.toHEX(); // create a new HEX class instance of this converted color

color.h, color.s, color.l; // color components

color.add(hue); // add hue (loop 360)
color.sub(hue); // color substract hue (loop 360)

color.lighten(light); // add light (max 1)
color.obscure(light); // substract light (min 0)

color.addSat(sat); // add saturation (max 1)
color.subSat(sat); // substract saturation (min 0)

color.toString(); // "hsl(50, 20%, 70%)"
color.intVal(); // same as HEX.intVal()
```

### Color cast

You can pass a variable that is a class instance of a color and it will takes its value automatically.

```js
let color = new HEX('#007fff');
background(color); // takes color.toString()

// cast every type of color, for fill(), stroke() etc...
fill('white'); // color name
fill('#fff'); // hex
fill(255); // rgb
fill(255, 255); // rgb, a
fill(255, 255, 255); // r, g, b
fill(255, 255, 255, 255); // r, g, b, a
```






## Vectors

You can create vectors, from 1 dimension to 3.

Once you created the vector with a dimension, you cannot change it, but doesn't forbid you to do things between vectors of 2 different dimensions.

```js
v1 = new Vector(5); // 1D vector
v2 = new Vector(2, 3); // 2D vector
v3 = new Vector(-4, 5, 20); // 3D vector

console.log(v3.x, v3.y, v3.z); // -4 5 20

v1.bow(0, 0); // draw an arrow with the vector dimension from the point (0, 0)
v2.bow(0, 0); // same for the 2D vector
// cannot display a 3D vector (for now...)

v2.mag; // the magnitude (length) of the vector
v1.setMag(10); // change the vector's length without changing its direction

v2.toString(); // "{x: 2, y: 3}"
v2.array(); // [2, 3]
v2.object(); // { x: 2, y: 3 }

v2.invert(); // now v2.x = 3 and v2.y = 2
v3.invert(); // clockwise [x, y, z] = [y, z, x]
v3.invert(true); // anti-clockwise [x, y, z] = [z, x, y]

v2.set(1, 2); // change the vector

v4 = new Vector(10, 20);
v2.set(v4); // you can pass vector as parameter

v2.add(1); // x += 1, y += 1
v2.add(1, 3); // x += 1, y += 3
v2.add(v4); // v2 += v4
// v2.sub() has same signature

v2.mult(); // same as add() but multiply
v2.div(); // same as add() but divide

v2.normalize(); // doesn't change the vector direction but brings back in interval [-1, 1]
```


## Matrix class

```js
// multiple signatures :
const m = new Matrix(width, height=width, fill=0); // if height isn't precised, square matrix
const m = new Matrix([0, 0, 0], ...); // raw rows
const m = new Matrix([ [0, 0, 0], ... ]); // same result, passing a 2D array
const m = new Matrix(matrixToCopy); // copies an existing matrix


m.array; // returns the matrix as 2D array
m.array1D; // returns the matrix as 1D array. All row items collapsed
m.width; // matrix's width
m.height; // matrix's height
m.dimension; // matrix's dimension
m.isSymmetrical; // returns either the matrix is symmetrical or not
m.isSquare; // returns either the matrix is square or not
m.isIdentity; // returns either the matrix is idendity or not. Requires square matrix
m.isDiagonal; // returns either the matrix is diagonal or not. Requires square matrix
m.isTriangular; // returns either the matrix is both lower triangular and upper triangular. Requires square matrix
m.isLowerTri; // returns either the matrix is lower triangular or not. Requires square matrix
m.isUpperTri; // returns either the matrix is upper triangular or not. Requires square matrix
m.diagonal; // returns 1D array of the matrix's diagonal if square matrix, empty array otherwise
m.det; // returns the matrix's determining : det(M)
m.toString(); // returns the 2D matrix as a string
m.at(x, y); // returns the element at position (x,y) in the matrix
m.set(x, y, value); // set the given value at given position (x,y) in the matrix
m.equals(matrix); // compares two matrices. Returns a boolean
m.add(matrix, onACopy=false); // if matrices has same size or matrix is a number, then add all items in the m matrix. If onACopy is true, then doesn't save it on current matrix, just returns the result.
m.sub(matrix, onACopy=false); // same as m.add, but substracting
m.mult(matrix, onACopy=false); // same as m.add, but multiplying
m.transpose(onACopy=false); // transposes the matrix's rows and columns. If onACopy is true, doesn't save it on current matrix, just returns the result.
m.getColumn(x); // returns a 1D array of the column at index x. If x is out of bounds, returns an empty array.
m.getRow(y); // returns a 1D array of the row at index y. If y is out of bounds, returns an empty array.
m.setColumn(x, column); // if x isn't out of bounds, and column's length respects matrix's height, then replaces the matrix's column at index x by given one.
m.setRow(y, row); // if y isn't out of bounds, and row's length respects matrix's width, then replaces the matrix's row at index y by given one.
```


## Mathematical functions
```js
radian(deg); // convert from degree to radian
degree(rad); // convert from radian to degree
random(min, max); // random integer from min to max. if no max given, from 0 to min. If 0 argument is given, float between 0 and 1
pow(x, p); // power of x, default power beeing 2
sqrt(x); // sqrt of x
min(a, b, c, ...); // minimum between all given values
max(a, b, c, ...); // maximum between all given values
abs(x); // absolute of x
round(x); // the rounded value of x
floor(x); // the floored value of x
ceil(x); // the ceiled value of x
trunc(x); // truncates x
exp(x); // exponential of x
log(x); // logarithm of x
log10(x); // decimal logarithm of x
cos(x); // cosine of x
sin(x); // sine of x
tan(x); // tangent of x
acos(x), asin(x), atan(x);
cosh(x), sinh(x), atan2(x, y);
map(array, currentMinInterval, currentMaxInterval, newMinInterval, newMaxInterval); // range mapping
sum(a, b, c, ...); // sum of all given values
mean(a, b, c, ...); // mean of all given values
median(a, b, c, ...); // median of all given values
mode(a, b, c, ...); // mode of all given values
variance(a, b, c, ...); // variance of all given values
std(a, b, c, ...); // standard deviation of all given values

dist(v1, v2); // returns the distance between 2 vectors
angleBetweenVectors(v1, v2); // in radian
angleToVector(rad); // from angle to 2D vector
vectorToAngle(v); // from a vector to angle in radian, comparing to horizontal line (vector(1, 0))

```





## Basic shapes

```js
line(x1, y1, x2, y2);
polyline(x1, y1, x2, y2, ...); // must take an even number of arguments
arc(x, y, r, start, end, antiClockwise=false);
circle(x, y, radius);
rect(x, y, recWidth, recHeight);
roundRect(x, y, w, h, radius[, radiusTR, radiusBR, radiusBL]); // if no radius precised, default is 0. first given radius is applied to all, or Top-Left if multiple are precised.
fillRect(x, y, recWidth, recHeight);
strokeRect(x, y, recWidth, recHeight);
text(txt, x, y);
// for multilines using one text() function, use "\n".
text("Hello world !\nDo you like canvas ?", 10, 20);


// for the paths:
moveTo(x, y);
lineTo(x, y);

path(d);
```

### Custom Path
You can create custom paths faster than doing
```js
beginPath();
    moveTo(10, 10);
    lineTo(20, 20);
    arc(20, 20, 50, 0, radian(90), false);
closePath();
```
Doing this:
```js
path('M 10 10 L 20 20 A 50 0 90 0');
```

It's exactly the same way as doing a SVG `<path>` tag.

#### Path properties
Path contains instructions and arguments.

Instructions are letters, arguments are numbers (integers, decimals, positive or negative).

Path always have to start by the `M` instruction.

Possible instructions:

* `M`: like `moveTo`. Must be followed by 2 arguments (x, y)
* `L`: like `lineTo`. Must be followed by 2 arguments (x, y)
* `H`: like `Horizontal`. Must be followed by 1 argument (x)
* `V`: like `Vertical`. Must be followed by 1 argument (y)
* `A`: like `Arc`. Must take 6 arguments (x, y, radius, startAngle, endAngle, antiClockwise)
    * `antiClockwise` has to be 1 or 0 (like true or false)
    * `start` and `end` have to be in degree. They will be converted to radians
    * `x` and `y` are where the startAngle is, it's not the arc's center position
* `Z`: close the path (visible if you stroke it). Must be the last thing on the path

`M`, `L`, `H`, `V`, `A` can be written to lower case, then it will take arguments relatively to the last point of the path.

`Z` cannot be written in lower case.

### Path Class

You can create dynamic paths:
```js
let p = new Path(); // without x and y argument, p.x and p.y are null, then it cannot be drawn

p.clear(); // clear the path

p.MoveTo(x, y); // moveTo for relative way
p.LineTo(x, y); // lineTo for relative way
p.Horizontal(x); // p.horizontal(x) is the relative way
p.Vertical(y); // p.vertical(y) is the relative way
p.Arc(x, y, r, start, end, antiClockwise=false); // p.arc() for relative way
p.close(); // add a Z property at the end of the path
// if you add something after this, it will move the Z at the end
p.open(); // remove the Z at the end

p.move(vec); // moves the path with a given vector
p.move(x, y); // same but with 2 given numbers
```

## Personalization

### Format the text

```js
// setFont(24, 'Monospace');
// fontSize is a number in px, font is string
setFont(fontSize, font);

// to change only the size
setFontSize(size); // number in px

// to change only the font family
setFontFamily(font); // string

alignText(alignment); // left, right, center, start or end. default is left

const textLength = measureText("hello world"); // in pixels
```

### Shape personalization

```js
noFill(); // says that the shapes that will follow will not be filled
noStroke(); // same but for stroke

stroke(color);
fill(color);
strokeWeight(weight);
linecap(style); // must be butt, round or square. Default is butt
```





## Timed transition functions

All of those functions have the same signature :
```js
f(t, b, c, d)
```
Where :
* t is the time passed during the beginning of the animation
* b is the beginning - starting point of the animation - Usually static
* c is the amount of change during the animation - Usually static
* d is the duration of the animation - Usually static
and return a float value.

```js
// linear
easeLinear
// quad
easeInQuad, easeOutQuad, easeInOutQuad
// sine
easeInSine, easeOutSine, easeInOutSine
// expo
easeInExpo, easeOutExpo, easeInOutExpo
// circ
easeInCirc, easeOutCirc, easeInOutCirc
// cubic
easeInCubic, easeOutCubic, easeInOutCubic
// quart
easeInQuart, easeOutQuart, easeInOutQuart
// quint
easeInQuint, easeOutQuint, easeInOutQuint
// back
easeInBack, easeOutBack, easeInOutBack
// elastic
easeInElastic, easeOutElastic, easeInOutElastic
```





## Perlin noise

The seed of perlin noise is generated only once, the first time you call the function.

You only can reset it refreshing the page.

```js
const z = perlin(x[, y=0]);
```

You can modify its LOD (level of details) with this function :
```js
noiseDetails(lod);
```

If you want to reset efficiently the seed, and / or if you want to store the result array so you don't have to calculate it again and again each draw loop, you can create a `PerlinNoise` class instance :

```js
const p = new PerlinNoise(lod=10, x=0, y=0, w=width, h=height, mapNumber="default");
p.setLOD(newLOD);
p.regenerateSeed();
p.setMapNumber(n);
p.start = { x, y }; // starting coordinates of the array
p.size = { width, height }; // size of the array
p.array = [height][width]; // 2D array of floating points
```

The default LOD for both perlin and perlinNoise is 10.

What is the `mapNumber` argument ?
There're 3 types :
- `n=0`: default
- `n=1`: hexadecimal
- `n=2`: hsl

This parameter tells to the class in which interval the values has to be in the array.

- By default, it stores [-1, 1] values.
- For hexadecimal, it stores [0, 255] values.
- For HSL, it stores [0, 360] values.

However, you can store default values, and then map them with `map` function in the for loop.

This can be useful if you want to display it them both with hexadecimal and hsl color (grey & colored).

```js
const HEXvalue = map(p.array[i][j], -1, 1, 0, 255);
const HSLvalue = map(p.array[i][j], -1, 1, 0, 720); // 2*360
```



## Time

This library can handle the time with a class that's used like a timer.

```js
const t = new Time(); // create a new time from now in milliseconds, starts from now
t.asNanoseconds(); // as nano-seconds
t.asMicroSeconds(); // as micro-seconds
t.asMilliseconds(); // as milli-seconds
t.asSeconds(); // as seconds
t.asMinutes(); // as minutes

t.reset(); // actualize the timer starting's time to now
```

However, you can tell the instance to start on a fixed timestamp :
```js
const t = new Time(3000); // Time(startingTime, unit)
// this time, the given time is static, so it will not update over the time
t.asSeconds(); // 3
t.reset(); // becomes a non-static time, so it updates over the time from now

const t2 = new Time(2, 'seconds'); // you can tell which time unit you want
// availible time units :
// nano, micro, milli, seconds, minutes
t.asMilliseconds(); // 2000
```

## Quadtree

You can use Quadtrees to manage world's entities with better performances.

```js
// create quadtree
const bounds = new Quadtree.Rectangle(0, 0, width, height);
const rootCapacity = 10;
const quadtree = new Quadtree(bounds, rootCapacity);

// create entities
const entities = [];

for(let i=0; i < 1000; i++) {
    const x = random(width);
    const y = random(height);
    entities.push(new MyEntityClass(x, y));
}

// use quadtree to check collisions
researchRect = new Quadtree.Rectangle(0, 0, 100, 100); // a square

// looped
function update() {
    quadtree.clear(); // reset the quadtree in the case entities moved

    // e is an object so the Quadtree.Point will store a reference to it
    // not a copy
    for(const e of entities)
        quadTree.insert(new Quadtree.Point(e.x, e.y, e));

    // mouse the research rectangle depending on the mouse
    researchRect.x = mouseX;
    researchRect.y = mouseY;

    // recover all point that are in this area
    const queryResult = quadTree.query(researchRect);

    // do stuff with it
}

function draw() {
    quadtree.show(); // draws the Quadtree
}
```


## License

This repo has the GPL-3.0 license. See the [LICENSE.txt](https://github.com/NoxFly/canvas/blob/master/LICENSE.txt).
