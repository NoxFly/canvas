function setup() {
    createCanvas(documentWidth(), documentHeight());

}

function draw() {
    fill(255);
    fontSize(25);

    text('Move your mouse on the canvas', 20, 40);
    text(`mouseX: ${mouseX}\nmouseY: ${mouseY}`, 20, 80);
}