let vec, isMouseDown;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    vec = new Vector(width/2, height-height/3);
    isMouseDown = false;
}

function draw() {

    fill(255, 0, 0);
    noStroke();
    circle(vec.x, vec.y, 10);


    fill(255);
    fontSize(20);
    
    alignText('left');
    text(`Vector's coordinates: ${vec.toString()}`, 20, 20);

    alignText('center');
    text("Stay mouse down to move circle to the right\nRelease to let it move to the left", width/2, height/2);

    if(isMouseDown) vec.add(5, 0);
    else vec.add(-1, 0);
}

function mouseDown() {
    isMouseDown = true;
}

function mouseUp() {
    isMouseDown = false;
}