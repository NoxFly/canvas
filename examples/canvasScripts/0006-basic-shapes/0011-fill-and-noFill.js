function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255, 0, 0);
    circle(width/2 - 30, height/2 - 10, 10);

    fill(0, 255, 0);
    circle(width/2 - 10, height/2 - 10, 10);

    fill(0, 0, 255);
    circle(width/2 + 10, height/2 - 10, 10);

    noFill();
    circle(width/2 - 10, height/2 - 10, 20);
}