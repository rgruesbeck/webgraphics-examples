function main() {
    // 1. Retrieve the <canvas> element.
    const canvas = document.getElementById("example");
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // 2. Request the rendering "context" for the 2D graphics from the elment.
    const ctx = canvas.getContext("2d");

    // 3. Draw the 2D graphics using the methods that the context supports
    ctx.fillStyle = 'rgba(0, 0, 255, 1.0'; // Set fill color blue
    ctx.fillRect(120, 10, 150, 150); // fill a rectangle
}