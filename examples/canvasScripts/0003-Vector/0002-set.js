let vec;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    vec = new Vector(random(20, width-20), random(20, height-20));
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
    text("Click anywhere on the canvas\nto change the vector's coordinates", width/2, height/2);
}

function onClick() {
    vec.set(random(20, width-20), random(20, height-20));
}