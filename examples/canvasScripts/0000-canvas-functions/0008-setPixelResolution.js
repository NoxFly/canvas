function setup() {
    createCanvas(documentWidth(), documentHeight());

    setPixelResolution(2000, 2000);
}

function draw() {
    
    fill('red');
    circle(200, 200, 200);

    stroke(255);
    strokeWeight(2);
    strokeRect(2, 2, width-2, height-2);
    
}