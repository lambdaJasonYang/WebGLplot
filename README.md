# Simple WebGL Plotting

![LINES.png](LINES.png)

* Extremely basic with very few features

# Installation

```bash
npm install basicwebglplot
```

# Use

```js
import {buildPlotWebGL, DrawModeGL} from 'webglplot'

const dummyvariable : HTMLElement = document.createElement('div');

document.addEventListener("DOMContentLoaded", () => {
    let e=document.createElement("canvas")
    e.width=500;
    e.height=500;
    dummyvariable.parentNode?.insertBefore(e,dummyvariable.nextSibling)
    const fn = (x:number) => Math.sin(x)
    buildPlotWebGL(e,fn,-30,30,0.1,DrawModeGL.POINTS);
},{once : true})
```