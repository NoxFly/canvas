# Canvas for front-end modules

[![GitHub contributors](https://img.shields.io/github/contributors/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/graphs/contributors/)
![Hits](https://hitcounter.pythonanywhere.com/count/tag.svg?url=https://github.com/NoxFly/canvas)
[![GitHub issues](https://img.shields.io/github/issues/NoxFly/canvas.svg)](https://GitHub.com/NoxFly/canvas/issues/)
[![npm version](https://badge.fury.io/js/%40noxfly%2Fcanvas.svg)](https://badge.fury.io/js/%40noxfly%2Fcanvas)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/noxfly)
[![GitHub stars](https://img.shields.io/github/stars/NoxFly/canvas.svg?style=social&label=Star&maxAge=2592000)](https://GitHub.com/NoxFly/canvas/stargazers/)
[![Npm Downloads](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)](https://img.shields.io/npm/dt/@noxfly/canvas.svg?maxAge=3600)

## CDN links

```html
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/tree/master/module/canvas.js'></script>
<!-- minified version -->
<script src='https://cdn.jsdelivr.net/gh/NoxFly/canvas/tree/master/module/canvas.min.js'></script>
```

# Usage

```js
import * as Canvas from 'canvas/module/canvas.min.js';

const { canvas, ctx } = Canvas.createCanvas(); // initialize everything if called for the first time

Canvas.draw(() => {
    // draw stuff here...
});


// to listen to events
Canvas.listen('eventname', e => {
    // ...
});
```

All basics are in [default README](https://github.com/NoxFly/canvas#canvas-framework).

With module's type you don't have to create the `setup()` function.

## License

This repo has the GPL-3.0 license. See the [LICENSE.txt](https://github.com/NoxFly/canvas/blob/master/LICENSE.txt).