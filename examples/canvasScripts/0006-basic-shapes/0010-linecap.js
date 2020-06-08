function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    stroke(255);
    strokeWeight(100);

    linecap('round');

    line(width/2 - width/4, height/2, width/2 + width/4, height/2);
}