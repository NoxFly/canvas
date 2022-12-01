# node.js Canvas

[![GitHub contributors](https://img.shields.io/github/contributors/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/graphs/contributors/)
[![GitHub issues](https://img.shields.io/github/issues/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/issues/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/noxfly)
[![GitHub stars](https://img.shields.io/github/stars/NoxFly/canvas.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/NoxFly/canvas/stargazers/)
[![Npm Downloads](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)

## About

This package is for 2D canvas, on backend, meaning it cannot be animated.<br>
It is here to simplify the use of the `node-canvas` package, giving additionnal resources, like mathematical functions, perlin noise, vector, matrix, colors quadtree and image cache manager.

##  Basic usage

[https://www.npmjs.com/package/@noxfly/canvas](https://www.npmjs.com/package/@noxfly/canvas)

### CommonJS
```js
const Canvas = require('@noxfly/canvas');

const canvas = Canvas.createCanvas(640, 480);

// ...
```

### Module

```js
import * as Canvas from '@noxfly/canvas';

const canvas = Canvas.createCanvas(640, 480);
```




## Canvas creation

```js
const { createCanvas } = require('@noxfly/canvas');

// createCanvas(width, height, background=null, support=null)
const canvas = createCanvas(640, 480, '#000');
// support can be null, SVG or PDF (read the node-canvas documentation)

// no context given will by default create a 2d one
// no background given will result of an empty one

console.log(canvas.width, canvas.height); // 640, 480

// get its context
console.log(canvas.ctx);

// "real" canvas object :
console.log(canvas._);
```



## Append node canvas to html

```html
<!-- Example with EJS file -->
<img src="<%= canvas.toDataURL() %>">
```

## Append node canvas as buffer

```js
const buffer = canvas.toBuffer();
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


### push, pop, translate, rotate, scale and clip

Exactly the same thing, adding `canvas.` before.

```js
canvas.push();
    canvas.translate(x, y);
    canvas.rotate(degrees);
    canvas.scale(1.2);
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


## Matrix

Read the usage of this class [here](https://github.com/NoxFly/canvas#matrix-class).


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

## Create image cache system

If you load an image for the first time, it will load it, then store it, else it will just returns you the saved image of the first call.

```js
const { createCanvas, createImageManager } = require('@noxfly/canvas');

const canvas = createCanvas(640, 480);

const imageManager = createImageManager();

const img = await imageManager.load('myImageName', 'my/path/to/image.png');

canvas.drawImage(img);

// you can call again the imageManager.load('myImageName', 'my/path/to/image.png')
// and it will returns you the stored image
```

## Quadtree

Read the usage of this class [here](https://github.com/NoxFly/canvas#quadtree).

## Perlin Noise

Read the usage of this class [here](https://github.com/NoxFly/canvas#perlin-noise).


## License

This repo has the GPL-3.0 license. See the [LICENSE.txt](https://github.com/NoxFly/canvas/blob/master/LICENSE.txt).