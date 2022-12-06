declare enum DrawModeGL {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6
}
declare const buildPlotWebGL: (target: HTMLCanvasElement, Plotfn: (x: number) => number, start?: number, end?: number, interpolation?: number, drawModeGL?: DrawModeGL, CanvasWidth?: number, CanvasHeight?: number) => void;
export { buildPlotWebGL, DrawModeGL };
