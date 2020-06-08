function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    stroke(255);
    strokeWeight(3);
    
    strokeRect(width/2 - width/4, height/2 - height/4, width/2, height/2);
}