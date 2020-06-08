# Canvas framework

[![GitHub contributors](https://img.shields.io/github/contributors/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/graphs/contributors/)
![Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https://github.com/NoxFly/canvas)
[![GitHub issues](https://img.shields.io/github/issues/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/StrapDown.js/issues/)
[![npm version](https://badge.fury.io/js/%40noxfly%2Fcanvas.svg)](https://badge.fury.io/js/%40noxfly%2Fcanvas)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/noxfly)
[![GitHub stars](https://img.shields.io/github/stars/NoxFly/canvas.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/NoxFly/canvas/stargazers/)



This canvas framework is only creating 2D context, but provides 3D vectors. 

You can help me to maintain this framework with small donation on my Paypal.

You also can star it, open issues if needed, and join the official server for asking help:

https://discord.gg/j5SarbC


## JSDELIVR include links
### by the github way
```html
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/canvas.js'></script>
// minified version
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/canvas.min.js'></script>
```
### by the npm way
```html
// minified version
<script src='https://cdn.jsdelivr.net/npm/@noxfly/canvas'></script>
```




## NPM
[https://www.npmjs.com/package/@noxfly/canvas](https://www.npmjs.com/package/@noxfly/canvas)





## About
In some versions will be availible bezier and quadratic curves, but you will also can create canvas on projects that include files as modules.

Some  variables of the framework are public, but some others are private.
Please, do not use variables and functions that aren't provide for you, or you will incur some issues.


### Examples
you can give a look at the examples folder that is enumering everything from the framework.

Run `./examples/index.php` to test all examples.





## Browser compatibility
Tested and works on `Firefox`, `Chrome`, `Edge`, `new Edge`, `Opera`.






## 2 required functions
You first need to create 2 functions, that are automatically detected by the framework.

```js
function setup() {
    // create canvas & setup everything here
}

function draw() {
    // this function will loop to draw on the canvas
}
```

The `setup` function is called when the window has loaded.

The `draw` function is called after the setup function, and is looped every fixed frames (can be changed whenever you want).





## Create a canvas

If you already created one, it will overwrite the existing one.

```js
createCanvas(canvasWidth, canvasHeight, canvasBackground='#000', requestPointerLock=false);
```

This function has to be written in the setup function.
Once the canvas is created, you can access to it by the global variable `canvas`, and its context `ctx` (2d context).

If you set the requestPointerLock to `true`, you have to click on the canvas to be pointer locked (and Esc to unlock).

You also can access to the canvas size with the both variables `width` and `height`.




## resize the canvas and canvas resolution

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

You can enable guidelines while you are developping, in the setup function:

```js
function setup() {
    createCanvas(500, 500);

    showGuideLines(true); // by default set to false
}
```



## Get document size

A shortcut to get the document size, even if you resize it:
```js
documentWidth();
documentHeight();
```

Therefore, you can create full-size canvas:
```js
function setup() {
    createCanvas(documentWidth(), documentHeight());
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





## Canvas utility functions

```js
background(color); // change the canvas background
setDrawCondition(() => boolean); // tell when it must draw or not (default is "return true")
clear(x, y, w, h); // canvas clearRect function
push(); // canvas save function
pop(); // canvas restore function
translate(x, y); // canvas translate function
rotate(degree); // canvas rotate function
enablePCswipe(boolean); // in the setup function, default is true
frameRate(number); // set the draw frame rate
getSwipe(); // returns the last swipe direction done by the user
mouseDir(); // returns the direction of the mouse's movement
isKeyDown(keyCode); // returns a boolean
isKeyUp(keyCode); // returns a boolean
```





## Canvas event handlers

The framework handle a lot of events, and you can catch them with functions that will be automatically executed when an event is handled.
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






## colors

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

#

You can pass a variable that is a class instance of a color and it will takes its value automatically.

```js
let color = new HEX('#007fff');
background(color); // takes color.toString()
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

v2.invert(); // now v2.x = 3 and v2.y = 2
v3.invert(); // clockwise [x, y, z] = [y, z, x]
v3.invert(true); // anti-clockwise [x, y, z] = [z, x, y]

v2.set(1, 2); // change the vector

v4 = new Vector(10, 20);
v2.set(v4); // you can pass vector as parameter

v2.add(1); // x += 1, y += 2
v2.add(1, 3); // x += 1, y += 3
v2.add(v4); // v2 += v4

v2.mult(); // same as add() but multiply
v2.div(); // same as add() but divide

v2.normalize(); // doesn't change the vector direction but brings back in interval [-1, 1]
```





## Mathematical functions
```js
radian(deg); // convert from degree to radian
degree(rad); // convert from radian to degree
random(min, max); // random integer from min to max. if no max given, from 0 to min
pow(x, p); // power of x, default power beeing 2
sqrt(x); // sqrt of x
min(a, b, c, ...); // minimum between all given values
max(a, b, c, ...); // maximum between all given values
abs(x); // absolute of x
round(x); // the rounded value of x
floor(x); // the floored value of x
ceil(x); // the ceiled value of x
exp(x); // exponential of x
log(x); // logarithm of x
log10(x); // decimal logarithm of x
cos(x); // cosinus of x
sin(x); // sinus of x
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
fillRect(x, y, recWidth, recHeight);
strokeRect(x, y, recWidth, recHeight);
text(txt, x, y);
// for multilines using one text() function, use "\n".
text("Hello world !\nDo you like canvas ?", 10, 20);
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






## Advanced shapes

To create a new shape, you can use the class `Shape`.

However, this one has all common default parameters for all type of shapes,

so I recommend to not use this class. Use which will follow this one.

### what contains a shape

* a fill color. You can :
    * acces to it doing `shape.background`
    * modify it doing `shape.fill = 'red'`
* a stroke color. You can :
    * acces to / modify it doing `shape.stroke`
    * change its weight / get its weight using `shape.strokeWeight`
* a position (x,y).
    * You can access to them thanks `shape.x` and `shape.y`.
    * You can modify the position thanks `shape.setPosition(x, y)` or `shape.setPosition(vector)`
* a speed (by default 0, it's a static shape). You can acces to / modify it using `shape.speed`
* an acceleration (by default 0).
    * You can access to / modify it using `shape.acceleration`
    * In the case of the shape is running, it will move with `this.speed + this.acceleration`, else only `this.speed`
* to know if the shape is running, use `shape.running` (returns a boolean)
* to say either the shape is running or not, use `shape.run(bool)`
* to move a shape thanks its speed, you can do `shape.move(x,y)`. Be careful, this x and y are the vector direction of the move.

For example:
```js
shape.speed = 5;
shape.move(1,0); // will move to 5 pixels to the right per frame. Write it on draw() function to move it continually
// you can also put a vector as parameter
```

### the shape origin

The origin of the shape is the (x,y) of this one.

It can be a different one by default for each shape, but you can change it.

You can also choose if you want to show it or not (a small green circle).

```js
// says if it shows the origin of the shape
shape.showOrigin(bool);

// set a new origin
setOrigin(newOrigin);
/* Possible origins :
    topLeft, top, topRight
    left, center, right
    bottomLeft, bottom, bottomRight
*/
```

To draw a shape, use `shape.draw()`

You an also listen if you are hover the shape:

```js
if(shape.hover()) {
    shape.fill = 'red';
}
```

### Collisions

To know if two shapes are in collision, use `collision(shape1, shape2)` function.

```js
if(collision(my_rectangle, my_circle)) {
    my_circle.fill = 'red';
    my_rectangle.fill = 'red';
}
```

### RectangleShape
```js
let rect = new RectangleShape(x, y, width, height, fill='black', stroke='transparent', strokeWeight=1);
```

* get/set its width with `shape.width`
* get/set its height with `shape.height`
* default origin is `topLeft`

### CircleShape
```js
let circ = new CircleShape(x, y, r, fill='black', stroke='transparent', strokeWeight=1);
```

* get/set its radius thanks `shape.r`
* default origin is `center`

### TriangleShape
```js
let tri = new TriangleShape(x, y, baseLength, baseTilt, height, heightPosition, fill='black', stroke='transparent', strokeWeight=1);
// the baseTilt is in degree
// the heightPosition is relative to x, so
//  - heightPosition =  0 = x
//  - heightPosition = -1 = x-1
```

* get its points thanks `shape.A`, `shape.B` and `shape.C`. It's vectors. You cannot modify them
* get/set its base length thanks `shape.baseLength`
* get/set its base tilt thanks `shape.baseTilt` (in radian)
* get/set its height thanks `shape.height`
* get/set its height position thanks `shape.heightPosition`

**For now you cannot change the origin of the triangle (bottomLeft = A point).**

### Triangle
```js
let tri = new Triangle(x1,y1, x2,y2, x3,y3, fill='black', stroke='transparent', strokeWeight=1);
// it's a TriangleShape but with another constructor
```

same properties as `TriangleShape`.

## License

This repo has the GPL-3.0 license. See the [LICENSE.txt](https://github.com/NoxFly/canvas/blob/master/LICENSE.txt).