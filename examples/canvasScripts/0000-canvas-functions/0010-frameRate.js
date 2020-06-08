let x, r, vec;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    x = r = 50;

    vec = 10;

    frameRate(10);
}

function draw() {
    fill('red');
    circle(x, height/2, r);

    x += vec;

    if(x >= width - r || x <= r) vec *= -1;
}