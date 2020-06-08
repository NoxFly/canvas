function setup() {
    createCanvas(documentWidth(), documentHeight());

    draw();

    frameRate(1);
}

function draw() {
    fontSize(30);
    alignText('center');
    fill(255);

    text(`random(100) = random(0, 100) = ${random(100)}`, width/2, height/2);
    text(`random(50, 150) = ${random(50, 150)}`, width/2, height/2 + 40);
}