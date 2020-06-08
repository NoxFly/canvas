function setup() {
    createCanvas(documentWidth(), documentHeight());

    setPixelRatio(1000, 1000);
}

function draw() {
    fill('red');
    circle(0, 0, 50);



    fill(255);

    fontSize(13);

    text(`width & height: ${width}x${height}`, 60, 20);
    text(`realWidth & realHeight: ${realWidth}x${realHeight}`, 60, 40);



    fontSize(20);

    text(`rendering(10, 10) : ${rendering(10, 10)}`, 10, 100);
    text(`renderingX(10): ${renderingX(10)}`, 10, 130);
    text(`renderingY(10): ${renderingY(10)}`, 10, 160);
}