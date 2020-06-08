let x, vec;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    x = 50;
    vec = 10;

    setDrawCondition(() => x < width/2);
}

function draw() {
    fill(255);
    fontSize(13);
    text("Draw condition: circle's X must be lower than the half of the canvas", 10, 23);

    x += vec;

    if(x >= width - 50 || x <= 50) vec *= -1;

    fill('red');
    circle(x, height/2 - 20, 20);
}