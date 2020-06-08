function setup() {
    createCanvas(documentWidth(), documentHeight());

    setPixelRatio(700, 1000);
}

function draw() {
    
    fill(255);
    fontSize(20);

    text(`canvas html width & height: ${width}x${height}px\n\ncanvas view realWidth & realHeight: ${realWidth}x${realHeight}px`, 20, 40);
    
    text(`Circle of 50px radius in a view of ${realWidth}x${realHeight}:`, 20, 150);

    fill('red');
    circle(realWidth/2, realHeight/2, 50);
}