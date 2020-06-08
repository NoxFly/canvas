function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    stroke(255);
    strokeWeight(10);
    line(width/2 - width/10, height/2 - height/10, width/2 + width/10, height/2 + height/10);
}