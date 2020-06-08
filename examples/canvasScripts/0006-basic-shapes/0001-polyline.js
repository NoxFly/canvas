function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    stroke(255);
    strokeWeight(5);
    
    polyline(0, 0, width/2, height/2, width, 0, width/2, height/4, 0, 0);
}