let x;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    x = 20;
}

function draw() {
    fill('red');
    circle(x, height/2, 20);

    fill(255);
    alignText('center');
    fontSize(20);
    text('Move your mouse to move the circle', width/2, height/4);
}

function mouseMove() {
    x++;
}