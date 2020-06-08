function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    stroke(255, 0, 0);
    circle(width/2, height/2, height/3);

    noStroke();
    circle(width/2, height/2, height/4);
}