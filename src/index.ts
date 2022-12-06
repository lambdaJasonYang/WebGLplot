import { mat4 } from 'gl-matrix';

enum DrawModeGL {
  POINTS = 0x0000,
  LINES = 0x0001,
  LINE_LOOP = 0x0002,
  LINE_STRIP = 0x0003,
  TRIANGLES = 0x0004,
  TRIANGLE_STRIP = 0x0005,
  TRIANGLE_FAN = 0x0006
};

let ptnum = -1



const range = (start: number,end :number,step : number) => {
    const temp = [];
    for(let i = start; i < end; i += step){
        temp.push(i);
    }
    return temp;
}

const filterInf = (x : number[]) => {
    return x.filter(x => (x != Infinity && x != -Infinity));
}


const normalize = (x) => {
    const cleanx = filterInf(x);
    const xnormed = 2/Math.max(...cleanx);
    return xnormed
}

const createPoints = (x: number[],y :number[]) => {
    const cleanx : number[] = filterInf(x)
    const cleany : number[] = filterInf(y)
    // console.log("cleanedpt",cleanx,cleany)
    const xnormed : number = 2/Math.max(...cleanx);
    const ynormed : number = 2/Math.max(...cleany);
    const ret : number[] = [];
    for(let i = 0; i < x.length; i++){
        ret[i*2] = x[i]*xnormed;
        ret[(i*2)+1] = y[i]*ynormed;
    }
    ptnum = x.length;
    return ret;
}





const initBuffers = (gl: WebGL2RenderingContext, 
                     Plotfn : (x:number) => number,
                     start: number = 30,
                     end: number = 30,
                     interpolation: number = 0.1) => {
    const xdata = range(start,end,interpolation);
    const ydata = xdata.map(Plotfn as (x:number) => number);
    const positions = createPoints(xdata,ydata);    
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
   
    gl.bufferData(gl.ARRAY_BUFFER,
                      new Float32Array(positions),
                      gl.STATIC_DRAW);
    return {
          position: positionBuffer,
        };
}

const loadShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
        const shader : WebGLShader = gl.createShader(type as number);
        // Send the source to the shader object
        gl.shaderSource(shader, source as string);
        gl.compileShader(shader);      
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }     
        return shader;
}

const initShaderProgram = (gl: WebGL2RenderingContext, vsSource: string, fsSource: string) : WebGLProgram => {
        const vertexShader: WebGLShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader : WebGLShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        // Create the shader program
        const shaderProgram : WebGLProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
          alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
          return null;
        }
        return shaderProgram;
}
const drawScene= (gl: WebGL2RenderingContext, programInfo, buffers,delta, drawModeGL : number = gl.LINE_STRIP ) => {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
      
        // Clear the canvas before we start drawing on it.
      
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
      
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        if(!(gl.canvas instanceof  HTMLCanvasElement )) throw new TypeError(`canvas with type ${typeof(gl.canvas)} cannot extract height width`)
        const canvasElem : HTMLCanvasElement = gl.canvas
        const aspect = canvasElem.clientWidth / canvasElem.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        // console.log(mat4)
        const projectionMatrix = mat4.create();
      
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix,
                         fieldOfView,
                         aspect,
                         zNear,
                         zFar);
      
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = mat4.create();
      
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
      
        mat4.translate(modelViewMatrix,     // destination matrix
                       modelViewMatrix,     // matrix to translate
                       [-0.0, 0.0, -6.0]);  // amount to translate
        mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              delta,   // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around
      
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
          const numComponents = 2;
          const type = gl.FLOAT;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
          gl.vertexAttribPointer(
              programInfo.attribLocations.vertexPosition,
              numComponents,
              type,
              normalize,
              stride,
              offset);
          gl.enableVertexAttribArray(
              programInfo.attribLocations.vertexPosition);
        }
      
        // Tell WebGL to use our program when drawing
      
        gl.useProgram(programInfo.program);
      
        // Set the shader uniforms
      
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
      
        {
          const offset = 0;
          const vertexCount = 4;
        //   gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        // type glSHAPES = gl.LINE_STRIP
          gl.drawArrays(drawModeGL,0,ptnum)
        //   gl.drawArrays(gl.TRIANGLE_STRIP,0,ptnum)
        }
}




  const fsSource : string = `
  void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }`;
  const vsSource : string = `
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  void main() {
      gl_PointSize = 1.0;
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }`;






const buildPlotWebGL = (target : HTMLCanvasElement,
                        Plotfn : (x:number) => number,
                        start: number = -30,
                        end: number = 30,
                        interpolation: number = 0.1, 
                        drawModeGL : DrawModeGL = DrawModeGL.POINTS,
                        CanvasWidth : number = 400, 
                        CanvasHeight: number = 400) => {
  
  target.width = CanvasWidth 
  target.height = CanvasHeight 
  
  const gl: WebGL2RenderingContext = target.getContext('webgl2');
  const shaderProgram = initShaderProgram(gl,vsSource,fsSource)
  const programInfo = {
      program: shaderProgram as WebGLProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram as WebGLProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram as WebGLProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram as WebGLProgram, 'uModelViewMatrix'),
      },
    };
    const buffers = initBuffers(gl,Plotfn,start,end,interpolation);
    const delta = 0.0;
    drawScene(gl, programInfo, buffers,delta,drawModeGL);
}




export {buildPlotWebGL, DrawModeGL} ;

