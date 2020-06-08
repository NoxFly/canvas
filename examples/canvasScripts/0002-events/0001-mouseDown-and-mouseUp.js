let x, vx;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    x = vx = 0;
}

function draw() {
    fill('red');
    circle(x, height/2, 20);

    
    fill(255);
    alignText('center');
    fontSize(20);
    text('Left/Right/Wheel click with your mouse to move the circle', width/2, height/4);
    
    
    x += vx;
}

function mouseDown() {
    vx = 1;
}

function mouseUp() {
    vx = 0;
}