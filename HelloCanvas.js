function main() {
    let canvas = document.getElementById("webgl");
    if (!canvas) {
        return console.error("Browser does not support WebGL");
    }

    let gl = canvas.getContext("webgl");
    if (!gl) {
        return console.error("Couldn't create webgl context");
    }

    // Set color buffer to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear context with color buffer
    // (this is call to OpenGL ES which doesn't use canvas)
    gl.clear(gl.COLOR_BUFFER_BIT);
}