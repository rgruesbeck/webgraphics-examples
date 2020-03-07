/*
  Notes for Kieth Peters WebGL class
  https://egghead.io/lessons/webgl-webgl-vertex-buffers

  vertices: points in 3d space
  shaders: small programs
  - determine how vertices are interpreted and rendered on the screen
  - writen in GLSL (OpenGL Shader Language) a C like language
*/

class Game {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.gl = initGL(this.canvas);
        this.shaderProgram = createShaders(this.gl);

        this.state = {
            frame: 0,
            coords: [0.5, 0.5, 0],
            pointSize: 100
        };
    }

    update() {
        let size = Math.cos(this.state.frame / 10) * 10 + 20;
        this.state.pointSize = size;

        this.state.frame = window.requestAnimationFrame(() => {
            this.render();
            this.update();
        });
    }

    render() {
        setVertices(this.gl, this.shaderProgram, this.state);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.POINTS, 0, 1);
    }

    start() {
        this.update();
    }
}


function main() {
    let game = new Game("canvas");
    game.start();
}

function initGL(canvas) {
    let gl = canvas.getContext("webgl");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 1, 1);

    return gl;
}

function createShaders(gl) {
    // CREATE VERTEX SHADER
    let vertexShaderCode = `
        attribute vec4 coords;
        attribute float pointSize;

        void main(void) {
            gl_Position = coords;
            gl_PointSize = pointSize;
        }
    `; // create vertex shader code
    // read more about gl_Position and Homogeneours coordinates
    // https://gamedev.stackexchange.com/questions/153078/what-can-i-do-with-the-4th-component-of-gl-position
    // https://en.wikipedia.org/wiki/Homogeneous_coordinates
    // https://www.youtube.com/watch?v=JSLG8n_IY9s
    // https://www.youtube.com/watch?v=vQ60rFwh2ig

    let vertexShader = gl.createShader(gl.VERTEX_SHADER); // create new vertex shader
    gl.shaderSource(vertexShader, vertexShaderCode); // load shader code
    gl.compileShader(vertexShader); // compile shader


    // CREATE FRAGMENT SHADER
    let fragmentShaderCode = `
        precision mediump float;
        uniform vec4 color;

        void main(void) {
            gl_FragColor = color;
        }
    `; // create fragment shader code

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    // CREATE SHADER PROGRAM
    let shaderProgram = gl.createProgram();

    // attach shaders
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // link and use program
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    return shaderProgram;
}

function setVertices(gl, shaderProgram, state) {
    let coords = gl.getAttribLocation(shaderProgram, "coords");
    gl.vertexAttrib3f(coords, ...state.coords);

    let pointSize = gl.getAttribLocation(shaderProgram, "pointSize");
    gl.vertexAttrib1f(pointSize, state.pointSize);

    let color = gl.getUniformLocation(shaderProgram, "color");
    gl.uniform4f(color, 1, 0, 1, 1);
}