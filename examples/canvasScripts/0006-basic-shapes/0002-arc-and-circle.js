function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    stroke(255);
    strokeWeight(6);
    
    
    fill(150);
    circle(width/2, height/2, width/height*100);
    
    fill(255, 200, 200);
    arc(width/2, height/2 + 60, 40, 0, PI - 1);

    fill(0);
    noStroke();

    arc(width/2 - 60, height/2 - 40, 20, 0, PI, true);
    arc(width/2 + 60, height/2 - 40, 20, 0, PI, true);
}