function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    
    push();
    
    translate(width/2, height/2);
    rotate(45);
    
    fill(255, 0, 0);
    fillRect(0, 0, width/6, height/6);

    pop();

    fill(0, 0, 255);
    fillRect(0, 0, width/6, height/6);
}