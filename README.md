# Canvas

This canvas library is, for the moment, provide for 2D canvas.

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

## Create a canvas

To create a new canvas, you must use the function `createCanvas`.

If a canvas has already been created, it will be overwritten.

The function takes 2 minimal arguments, for a maximum of 4.
1. its width
1. its height
1. its background (optional, by default dark)
1. if it take care about pointerLock (optional, by default false). If this argument if set to true, then you must click on the canvas to enter the pointerLock mode, and Esc to come out.

The function return the canvas, but you can access to it with the global variable `canvas`.

Once the canvas is created, you cannot resize it.

```js
let canvas = createCanvas(width, height, background='#000', requestPointerLock=false);
```

## The 2 basics functions

You can animate your canvas easily. Thanks for these 2 functions which will be executed automatically once your declare them:

* `function setup(void) {}`: This function is executed __before__ the `draw` function, but __after__ the window's loading. So you have access to the `document` variable in.
* `function draw(void) {}`: This function is executed __after__ the `setup` function and the window's loading. `requestAnimationFrame(draw)` is called, so the draw function is looping. Otherwise, you can set a condition to stop the requestAnimationFrame. While this condition return false, the draw loop will not be executed. Thanks for the function `setDrawCondition(condition)`.

## Public variables
* `MIN_DOC_SIZE`: The value of the minimum between the document's width / height
* `isDevice`: object that has 3 boolean keys
    * `mobile`: either the device is a mobile or not.
    * `ios`: either the device is on iOS or not.
    * `android`: either the device is on Android or not.
* `canvas`: you can access to it, but do not modify it. if you didn't create the canvas yet, its value is `null`.
* `ctx`: you can access to it, but do not modify it. if you didn't create the canvas yet, its value is `null`.
* `width`: The width of the created canvas. Please do not modify it.
* `height`: The height canvas. Please do not modify it.


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
```

## Personalization

### Format the text

```js
setFont(fontSize, font);
// must specify the font size unity, example:
// setFont('24px', 'Monospace');

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
```

## Mathematical functions

```js
radians(degree); // returns the radian's value of a degree one
angleToVector(angle); // returns the vector of a degree
dist(a, b); // returns the distance between two vectors
map(val, start1, end1, start2, end2); // range mapping a value
random(max); // returns a random int from 0 to max-1
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


function mouseMouse(e) {
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

## License

This repo has the GPL-3.0 license. See the [LICENSE.txt](https://github.com/NoxFly/canvas/blob/master/LICENSE.txt).