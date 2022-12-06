import { StoryFn, Meta } from '@storybook/html';
import {buildPlotWebGL, DrawModeGL} from '../dist/index.js'


export default {
    title: 'Example/INTERPOLATION',
} as Meta;

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


export const HIGH_INTERPOLATION = Template.bind({});
HIGH_INTERPOLATION.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.01,
    drawmode: DrawModeGL.POINTS,
}
 
export const MEDIUM_INTERPOLATION = Template.bind({});
MEDIUM_INTERPOLATION.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.1,
    drawmode: DrawModeGL.POINTS,
}

export const LOW_INTERPOLATION = Template.bind({});
LOW_INTERPOLATION.args = {
    fn: Math.sin,
    start: -30,
    end: 30,
    interpolation: 0.5,
    drawmode: DrawModeGL.POINTS,
}