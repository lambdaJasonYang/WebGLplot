import { StoryFn, Meta } from '@storybook/html';
import {buildPlotWebGL, DrawModeGL} from '../dist/index.js'


export default {
    title: 'Example/PLOT TYPES',
} as Meta;

export const POINTS: StoryFn = (): HTMLElement => {
    const dummyvariable : HTMLElement = document.createElement('div');
   
    document.addEventListener("DOMContentLoaded", () => {
        let e = document.createElement("canvas")
        e.width = 500;
        e.height=500;
        dummyvariable.parentNode?.insertBefore(e,dummyvariable.nextSibling)
        const fn = (x:number) => Math.sin(x)
        buildPlotWebGL(e,fn,-30,30,0.1,DrawModeGL.POINTS);
    },{once : true})


    return dummyvariable;
};

const Template: StoryFn = (args): HTMLElement => {
    const dummyvariable : HTMLElement = document.createElement('div');
   
    document.addEventListener("DOMContentLoaded", () => {
        let e = document.createElement("canvas")
        e.width = 500;
        e.height=500;
        dummyvariable.parentNode?.insertBefore(e,dummyvariable.nextSibling)
        const fn = (x:number) => Math.tan(x)
        buildPlotWebGL(e,args.fn,args.start,args.end,args.interpolation,args.drawmode);
    },{once : true})

    return dummyvariable;
  };

export const LINES = Template.bind({});
LINES.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.1,
    drawmode: DrawModeGL.LINES,
}

export const LINE_STRIP = Template.bind({});
LINE_STRIP.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.1 * Math.PI,
    drawmode: DrawModeGL.LINE_STRIP,
}

export const LINE_LOOP = Template.bind({});
LINE_LOOP.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.1 * Math.PI,
    drawmode: DrawModeGL.LINE_LOOP,
}


export const TRIANGLES = Template.bind({});
TRIANGLES.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.1 * Math.PI,
    drawmode: DrawModeGL.TRIANGLES,
}

export const TRIANGLE_STRIP = Template.bind({});
TRIANGLE_STRIP.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.1 * Math.PI,
    drawmode: DrawModeGL.TRIANGLE_STRIP,
}

export const TRIANGLE_FAN = Template.bind({});
TRIANGLE_FAN.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.1 * Math.PI,
    drawmode: DrawModeGL.TRIANGLE_FAN,
}
