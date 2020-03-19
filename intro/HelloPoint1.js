/*
    Vertex shaders are programs that describe the traits
    (position, colors, etc) of a vertex.
    A vertex is a point in 2D/3D space, like the corcer or intersetion
    of a 2D/3D shape.

    This vertex shader specifies the position and size of a point.
 */
const VSHADER_SOURCE = `
    void main() {
        // Coordinates
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);

        // Set the point size
        gl_PointSize = 10.0;
    }
`;

/*
    Fragment shaders are programs that deal with fragment processing.
    A frament is a WebGL word equivalent to the word pixel.

    This fragment shader specifies the color of fragments displaying the point.
 */
const FSHADER_SOURCE = `
    void main() {
        // Set the color
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
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
    if (!initShaders(gl)) {
        return console.log("Failed to initialize shaders.");
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear context with color buffer
    // (this is call to OpenGL ES which doesn't use canvas)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
}

function initShaders(gl) {
    // Vertext Shader
    let vertexShader = gl.createShader(gl.VERTEX_SHADER); // create new vertex shader
    gl.shaderSource(vertexShader, VSHADER_SOURCE); // load shader code
    gl.compileShader(vertexShader); // compile shader

    // Fragment Shader
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

    return gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
}