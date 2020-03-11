// Vertex shader program
const VSHADER_SOURCE = `
    void main() {
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);

        // Coordinates
        gl_PointSize = 10.0; // Set the point size
    };
`;

// Fragment shader program
const FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Set the color
    };
`;

function main() {

    // Retrieve <canvas> element
    let canvas = document.getElementById("webgl");
    if (!canvas) {
        return console.error("Browser does not support WebGL");
    }

    // Get the rendering context for the WebGL
    let gl = canvas.getContext("webgl");
    if (!gl) {
        return console.error("Couldn't create webgl context");
    }

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return console.log("Failed to initialize shaders.");
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear context with color buffer
    // (this is call to OpenGL ES which doesn't use canvas)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw a point
    gl.drawArray(gl.POINTS, 0, 1);
}

function initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) {

    let vertexShader = gl.createShader(gl.VERTEX_SHADER); // create new vertex shader
    gl.shaderSource(vertexShader, VSHADER_SOURCE); // load shader code
    gl.compileShader(vertexShader); // compile shader

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, FSHADER_SOURCE);
    gl.compileShader(fragmentShader);

    // CREATE SHADER PROGRAM
    let shaderProgram = gl.createProgram();

    // attach shaders
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // link and use program
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    return true;
}