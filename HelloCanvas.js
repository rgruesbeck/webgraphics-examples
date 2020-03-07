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

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear context with color buffer
    // (this is call to OpenGL ES which doesn't use canvas)
    gl.clear(gl.COLOR_BUFFER_BIT);
}