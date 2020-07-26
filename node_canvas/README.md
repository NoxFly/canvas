# node.js Canvas

[![GitHub contributors](https://img.shields.io/github/contributors/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/graphs/contributors/)
![Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https://github.com/NoxFly/canvas)
[![GitHub issues](https://img.shields.io/github/issues/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/issues/)
[![npm version](https://badge.fury.io/js/%40noxfly%2Fcanvas.svg)](https://badge.fury.io/js/%40noxfly%2Fcanvas)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/noxfly)
[![GitHub stars](https://img.shields.io/github/stars/NoxFly/canvas.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/NoxFly/canvas/stargazers/)
[![Npm Downloads](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)

All basics are in [default README](https://github.com/NoxFly/canvas#canvas-framework).



## Dependency

It only requires [canvas](https://www.npmjs.com/package/canvas) module.




## about

You don't have to use the framework as the front-end versions.

You have to see this part of the framework as a framework that simplify the node-canvas uses.

That means you don't have a `setup` and a `draw` functions do to.

You also can't create animated / interactive canvas, with mouse or keyboard events.



##  NPM

[https://www.npmjs.com/package/@noxfly/canvas](https://www.npmjs.com/package/@noxfly/canvas)

```js
const Canvas = require('@noxfly/canvas');

const canvas = Canvas.createCanvas(640, 480);

// ...
```




## Canvas creation

```js
const { createCanvas } = require('@noxfly/canvas');

// createCanvas(width, height, context='2d', background=null)
const canvas = createCanvas(640, 480, '2d', '#000');

// no context given will by default create a 2d one
// no background given will result of an empty one

console.log(canvas.width, canvas.height); // 640, 480

// get its context
console.log(canvas.ctx);

// "real" canvas object :
console.log(canvas._);
```



## append node canvas to html

```html
<img src="<%= canvas.toDataURL() %>">
```



## Canvas methods


### Shapes

You can find their documentation to know their parameters [here](https://github.com/NoxFly/canvas#basic-shapes).

Instead of the front version where you have to do `line(x1, y1, x2, y2)`,

you have to do `canvas.line(x1, y1, x2, y2)`.

```js
canvas.line(0, 0, 640, 480);
// same for all other shapes
```


### Shape personalization

Same as before, it's as their [documention](https://github.com/NoxFly/canvas#personalization) describes you their usage, but adding a `canvas.` before.

```js
canvas.fill(255);
// same for other functions
```


### push, pop, translate, rotate and clip

Exactly the same thing, adding `canvas.` before.

```js
canvas.push();
    canvas.translate(x, y);
    canvas.rotate(degrees);
    // ...
    canvas.clip(); // ctx.clipPath()
canvas.pop();
```





## Colors

If you read the [default README](https://github.com/NoxFly/canvas#canvas-framework), you know this framework has some useful functions as color managment and convertions, for RGB, HEX and HSL.

You can find their usage [here](https://github.com/NoxFly/canvas#colors).

```js
const { RGB, HEX, HSL } = require('@noxfly/canvas');
```



## Vectors

Same as the color section, you can read how to use vectors [here](https://github.com/NoxFly/canvas#vectors).

```js
const { Vector } = require('@noxfly/canvas');
```



## Mathematical and statistical functions

Same as the color section, you can read their usage [here](https://github.com/NoxFly/canvas#mathematical-functions).

```js
const { radian, degree, random, ... } = require('@noxfly/canvas');
```



## Path class

Read the usage of this class [here](https://github.com/NoxFly/canvas#path-class).

```js
const { Path } = require('@noxfly/canvas');
```



## License

This repo has the GPL-3.0 license. See the [LICENSE.txt](https://github.com/NoxFly/canvas/blob/master/LICENSE.txt).