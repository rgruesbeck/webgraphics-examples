/*
    Vertex shaders are programs that describe the traits
    (position, colors, etc) of a vertex.
    A vertex is a point in 2D/3D space, like the corcer or intersetion
    of a 2D/3D shape.

    This vertex shader specifies the position and size of a point.
 */
const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform vec4 u_Translation;

    void main() {
        // Coordinates
        gl_Position = a_Position + u_Translation;

        gl_PointSize = 2.0;
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

    // Set the positions of vertices
    let n = initVertexBuffers(gl);
    if (n < 0) {
        return console.log("Failed to set the positions of the vertices");
    }

    // Pass the translation distance to the vertex shader
    let Tx = 0.5;
    let Ty = 0.5;
    let Tz = 0.0;

    let u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0);


    // Get the storage location of attribute variable 
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        return console.log('Failed to get the storage location of a_Position');
    }

    // Event handlers
    document.addEventListener('change', (e) => {
        // handle mode selection
        if (e.target.id === 'mode-select') {
            handleModeSelect(e.target.value);
        }
    })

    function handleModeSelect(mode) {
        if (mode === 'LINES') {
            render(gl, () => {
                gl.drawArrays(gl.LINES, 0, n);
            });
        } else if (mode === 'LINE_STRIP') {
            render(gl, () => {
                gl.drawArrays(gl.LINE_STRIP, 0, n);
            });
        } else if (mode === 'LINE_LOOP') {
            render(gl, () => {
                gl.drawArrays(gl.LINE_LOOP, 0, n);
            });
        } else if (mode === 'TRIANGLES') {
            render(gl, () => {
                gl.drawArrays(gl.TRIANGLES, 0, n);
            });
        } else if (mode === 'TRIANGLE_STRIP') {
            render(gl, () => {
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
            });
        } else if (mode === 'TRIANGLE_FAN') {
            render(gl, () => {
                gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
            });
        } else {
            render(gl, () => {
                gl.drawArrays(gl.POINTS, 0, n);
            });
        }
    }

    render(gl, () => {
        gl.drawArrays(gl.POINTS, 0, n); // n is 3
    });
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

    // Set the point size
    gl_PointSize = 10.0;

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

function initVertexBuffers(gl) {
    let vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
    let n = 3;

    // create a buffer object
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // assign the buffer object to a_Position
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
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