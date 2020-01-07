# Canvas library

This canvas library is, for the moment, provide for 2D canvas.

![Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https://github.com/NoxFly/canvas)

## Include link
### Minified Version
```js
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/canvas.min.js'></script>
```
### Normal Version
```js
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/canvas.js'></script>
```

## NPM
[https://www.npmjs.com/package/@noxfly/canvas](https://www.npmjs.com/package/@noxfly/canvas)

## About

You can use it to create canvas games / canvas simulations easier.

You must include this file before all other scripts that will use something about canvas.

You will get some predefined variables, you can use some of them, but some others are considered as private and you should not change them, in any case not without a function which has been provided for.

If you have created some examples with this library, send me them so I'll surely add these examples on the github repo (+ credit).

version 1.1.0

## Create a canvas

To create a new canvas, you must use the function `createCanvas`.

If a canvas has already been created, it will be overwritten.

The function takes 2 minimal arguments, for a maximum of 4.
1. its width
1. its height
1. its background (optional, by default dark)
1. if it take care about pointerLock (optional, by default false). If this argument is set to true, then you must click on the canvas to enter the pointerLock mode, and Esc to come out.

The function return the canvas, but you can access to it with the global variable `canvas`.

Once the canvas is created, you cannot resize it.

```js
// canvas = null, ctx = null
// width = 0, height = 0
let my_canvas = createCanvas(canvas_width, canvas_height, background='#000', requestPointerLock=false);
/* the variable canvas is now the new created canvas
   the variable ctx is now the new context 2d of this canvas (canvas.getContext('2d'))
   the variable width is now set to canvas.width
   the variable height is now set to canvas.height
*/
```

You can change the resolution of your canvas with `setHTMLview(width, height)`.

Example: you can have an HTML canvas of 500x500, but with a resolution of 2000x2000.

You will have a lower quality of rendering, but you will have more pixel data.

```js
createCanvas(2000,2000); // canvas contains 2000x2000 pixels
setHTMLview(500,500); // user have a 500x500 canvas
```

To switch between the two resolution's values, you can use the following functions:

```js
// all these functions return either a x, y or both
rendering(vector); // with a vector as parameter
rendering(x, y); // with x,y values
renderingX(x); // only for a x value
renderingY(y); // only for a y value

// for example
createCanvas(2000,2000);
setHTMLview(500,500);

// you enter a HTMLview value -> return a canvas resolution value
console.log(rendering(250,500)); // 1000,2000
```

## The 2 basics functions

You can animate your canvas easily. Thanks for these 2 functions which will be executed automatically once your declare them:

* `function setup(void) {}`: This function is executed __before__ the `draw` function, but __after__ the window's loading. So you have access to the `document` variable in.
* `function draw(void) {}`: This function is executed __after__ the `setup` function and the window's loading. `requestAnimationFrame(draw)` is called, so the draw function is looping. Otherwise, you can set a condition to stop the requestAnimationFrame. While this condition return false, the draw loop will not be executed. Thanks for the function `setDrawCondition(condition)`.

```js
function setup() {
    // init your vars here
    createCanvas(500,500);
}

function draw() {
    // draw loop
    fill('white');
    line(0,0,500,500);
}
```

## Guidelines

You can show the h/v blue guidelines (dev tool) to show you the x/y pixel you mouse is hovering.

```js
function setup() {
    createCanvas(500,500);
    showGuideLines(true); // by default false
}
```

![Guidelines screenshot](https://www.zupimages.net/up/20/01/i3re.png)

## Public variables
* `MIN_DOC_SIZE`: The value of the minimum between the document's width / height
* `isDevice`: object that has 3 boolean keys
    * `mobile`: either the device is a mobile or not.
    * `ios`: either the device is on iOS or not.
    * `android`: either the device is on Android or not.
* `canvas`: you can access to it, but do not modify it. if you didn't create the canvas yet, its value is `null`.
* `ctx`: you can access to it, but do not modify it. if you didn't create the canvas yet, its value is `null`.
* `width`: the width of the created canvas. Please do not modify it.
* `height`: the height canvas. Please do not modify it.
* `realWidth`: the real width of your canvas if you used `setHTMLview`
* `realHeight`: the real height of your canvas if you used `setHTMLview`
* `mouseX`: it's the mouse's X position relative to the canvas
* `mouseY`: it's the mouse's Y position relative to the canvas

You can use / access to all other variables, but I do not recommend it. Let the canvas.js file do all about them, and access to it by the functions provided for this purpose.

## Vector class

The file contains a class named Vector.

It has 2 stored data: x and y.

It can be a vector for acceleration, speed, position,...

### use of the Vector class

```js
let object = new Vector(0,0); // position of the object: x=0; y=0
object.set(10,50); // finally we want to move the object to 10;50
object.add(10,50) // 10,50 + 10,50 = 20,100 -> now object has position x=20 and y=100
let mag = object.mag; // returns the magnitude of the vector
object.setMag(10); // changes the object's magnitude
object.normalize(); // adapt values of the object between 0 and 1

// access to x and y properties
console.log(object.x, object.y);

// to get a string value
console.log(object.toString()); // '{x: 2, y: 6}'
```

## Basic Functions to draw shapes

### Line

```js
line(x1, y1, x2, y2);
```

### Polyline

```js
polyline(x1,y1, x2,y2, ...); // must take an even number of arguments
```

### Circle

```js
circle(x, y, radius);
```

### Rectangle

```js
rect(x, y, width, height);
```

### Filled Rectangle

```js
fillRect(x, y, width, height);
```

## Basic functions to draw text

```js
text(txt, x, y);

// for multilines using one text() function, use "<br>".
// however it keep the same font size :
text("Hello world !<br>Do you like canvas ?", 10, 20);
```

## Personalization

### Format the text

```js
// must specify the font size unity, example:
// setFont('24px', 'Monospace');
setFont(fontSize, font);

// to change only the size
setFontSize(size);

// to change only the font family
setFontFamily(font);

alignText(alignment); // left, right, center, start or end. default is left
```

### Shape personalization

```js
noFill(); // says that the shapes that will follow will not be filled
noStroke(); // same but for stroke

stroke(color); // can be hex, rgb[a], hsl, or color name
fill(color); // same
strokeWeight(weight); // the line's stroke weight
linecap(style); // must be butt, round or square. Default is butt
```


## Canvas functions

```js
push(); // saves the canvas
translate(x, y); // translates the canvas
rotate(degree); // rotates the canvas
pop(); // restores the canvas before the translation & rotation
clear(); // clears the canvas draw. Normally you don't have to use it, because the draw() function do

background(color); // change the canvas's background
```

## Mathematical functions

```js
radians(degree); // returns the radian's value of a degree one
degree(radian); // returns the degree's value of a radian one
angleToVector(angle); // returns the vector of a degree
dist(a, b); // returns the distance between two vectors
map(val, start1, end1, start2, end2); // range mapping a value
random(max); // returns a random int from 0 to max-1
pow(n); // returns n²
sqrt(n); // return the sqrt of n
abs(n); // return the absolute of n
hex(r, g, b); // return the hexadecimal value of the rgb one for 3 given integers
hexs(rgb); // same but for a string : "rgb(255,255,255)"
rgb(hexa); // return the rgb value as a string for a given hexadecimal value
```

## Mouse Properties

```js
// mouse movement direction
let dir = mouseDir(); // returns the direction the mouse is moving on
/* Returned values:
    BOTTOM_RIGHT
    TOP_RIGHT
    TOP_LEFT
    BOTTOM_LEFT
    RIGHT
    DOWN
    UP
    LEFT
*/

// mouse swipe direction
// for mobile swipe
// or if PC's user mousedown, move his mouse then mouseup

//  possible swipe directions:
//  left / right / up / down
function onSwipe(e) {
    // e.detail.swipe is the swipe direction
}

let swipeDir = getSwipe(); // returns the last stored swipe direction

// disable the PC swipe (can be the cause if some issues)
enablePCswipe(bool); // true or false


function mouseMove(e) {
    // called when the mouse move on the canvas
}

function mouveEnter(e) {
    // called when the mouse enter the canvas
}

function mouseLeave(e) {
    // called when the mouse leave the canvas
}

function mouseWheel(e) {
    // called when the mouse wheel is used on the canvas
}

function mouseDown(e) {
    // called when the mouse is pressed on the canvas
}

function mouseUp(e) {
    // called when the mouse is released
}
```

## Keyboard properties

```js
// key down
isKeyDown(keyCode); // returns a boolean (true / false) if a given key is pressed
// example:
// if(isKeyDown('Space')) console.log('space key is down');

// key up
isKeyUp(keyCode); // same but for key up

// functions
function keyPress(e) {
    // called when a key is pressed
}

function keyDown(e) {
    // called when a key is down
}

function keyUp(e) {
    // called when a key is up
}
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