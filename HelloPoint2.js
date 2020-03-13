/*
    Vertex shaders are programs that describe the traits
    (position, colors, etc) of a vertex.
    A vertex is a point in 2D/3D space, like the corcer or intersetion
    of a 2D/3D shape.

    This vertex shader specifies the position and size of a point.
 */
const VSHADER_SOURCE = `
    // Position attribute
    // <Storage Qualifier> <Type> <Variable Name>
    attribute vec4 a_Position;

    // Size attribute
    attribute float a_PointSize;

    void main() {
        // Coordinates
        gl_Position = a_Position;

        // Set the point size
        gl_PointSize = a_PointSize;
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
    // Initialize WebGL
    let gl = initGL("webgl");

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return console.log("Failed to initialize shaders.");
    }

    // Get the storate location of attribute variable 
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        return console.log('Failed to get the storage location of a_Position');
    }

    // Pass the vertex position to attribute variable
    // eg: gl.vertexAttrib3f()
    // <method name> <params #> <param type>
    // equivalent to glVertexAttrib3f() in OpenGL

    // Using parameters
    // let position = [0.0, 0.0, 0.0].map(val => Math.random());
    // gl.vertexAttrib3f(a_Position, ...position);

    // Using typed array
    let position = new Float32Array([0.0, 0.0, 0.0, 1.0])
    gl.vertexAttrib4fv(a_Position, position)

    // Pass the point size attribute
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_PointSize < 0) {
        return console.log('Failed to get the storage location of a_PointSize');
    }

    gl.vertexAttrib1f(a_PointSize, 5.0);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear context with color buffer
    // (this is call to OpenGL ES which doesn't use canvas)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw a point
    gl.drawArrays(gl.POINTS, 0, 1);
}

function initGL(canvas_id) {
    // Check for canvas id
    if (!canvas_id) {
        return console.error("Canvas ID not specified");
    }

    // Retrieve <canvas> element
    let canvas = document.getElementById(canvas_id);
    if (!canvas) {
        return console.error("Browser does not support WebGL");
    }

    // Get the rendering context for the WebGL
    let gl = canvas.getContext("webgl");
    if (!gl) {
        return console.error("Couldn't create webgl context");
    }

    // Return WebGL context
    return gl;
}

function initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
    // Vertext Shader
    let vertexShader = gl.createShader(gl.VERTEX_SHADER); // create new vertex shader
    gl.shaderSource(vertexShader, VSHADER_SOURCE); // load shader code
    gl.compileShader(vertexShader); // compile shader

    // Fragment Shader
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, FSHADER_SOURCE);
    gl.compileShader(fragmentShader);

    // CREATE SHADER PROGRAM
    gl.program = gl.createProgram();

    // attach shaders
    gl.attachShader(gl.program, vertexShader);
    gl.attachShader(gl.program, fragmentShader);

    // link and use program
    gl.linkProgram(gl.program);
    gl.useProgram(gl.program);

    return gl.getProgramParameter(gl.program, gl.LINK_STATUS);
}