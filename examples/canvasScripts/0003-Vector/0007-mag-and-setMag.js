let vec, defaultMag;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    vec = new Vector(100, 0);
    defaultMag = vec.mag;
}

function draw() {
    vec.bow(0, height/4);


    fill(255);
    fontSize(20);
    alignText('center');
    text("The mag(nitude) is the length of the vector\n\nMouse the mouse from left to right\n\nVector.mag = "+vec.mag, width/2, height/2);
}

function mouseMove() {
    vec.setMag(mouseX);
}