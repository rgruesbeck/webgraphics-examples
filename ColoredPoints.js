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

    void main() {
        // Coordinates
        gl_Position = a_Position;

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
    precision mediump float;
    uniform vec4 u_FragColor;

    void main() {
        // Set the color
        gl_FragColor = u_FragColor;
    }
`;

function main() {
    // Initialize WebGL
    let gl = initGL("webgl");

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        return console.log("Failed to initialize shaders.");
    }

    // Get the storage location of attribute variable 
    // not found value is -1
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        return console.log('Failed to get the storage location of a_Position');
    }

    // Get the storage location of u_FragColor
    // not found value is null 
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        return console.log('Failed to get the storage location of u_FragColor');
    }

    // Points and Colors
    let g_points = [];
    let g_colors = [];

    // Using typed array
    // let position = new Float32Array([0.0, 0.0, 0.0, 1.0])
    // gl.vertexAttrib4fv(a_Position, position)
    gl.canvas.onmousedown = function(e) {
        let x = e.clientX; // x coordinate of mouse
        let y = e.clientY; // y coordinate of mouse
        let rect = e.target.getBoundingClientRect();

        // point
        let point = normalizeCoordinates([
            x - rect.left,
            y - rect.top
        ], gl.canvas.width, gl.canvas.height);

        g_points.push(point);

        // color
        if (point[0] >= 0.0 && point[1] >= 0.0) {
            g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
        } else if (point[0] < 0.0 && point[1] < 0.0) {
            g_colors.push([0.0, 1.0, 0.0, 1.0]); // Green
        } else {
            g_colors.push([1.0, 1.0, 1.0, 1.0]); // White
        }

        render(gl, () => {
            for (let i = 0; i < g_points.length; i++) {
                let xy = g_points[i];
                let rgba = g_colors[i];
                console.log(rgba);

                gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
                gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                gl.drawArrays(gl.POINTS, 0, 1);
            }
        })
    };

    render(gl);
}

function render(gl, render_methods) {
    // Specify the color for clearing <canvas>
     gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear context with color buffer
    // (this is call to OpenGL ES which doesn't use canvas)
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Call render methods
    if (render_methods) {
        render_methods();
    }
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

// input positive coordinates
// output normalized coordinates
function normalizeCoordinates(vertex, width, height) {
    return [vertex]
    .map(pt => {
        // shift origin to center
        // and invert direction for y
        pt[0] = pt[0] - width / 2;
        pt[1] = height / 2 - pt[1];
        return pt;
    })
    .map(pt => {
        // normalize to range -1 to 1
        pt[0] = pt[0] / (width / 2);
        pt[1] = pt[1] / (height / 2);
        return pt;
    })
    .reduce(pt => pt);

}