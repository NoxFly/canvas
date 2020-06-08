let vec;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    vec = new Vector(50, height/2);
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
    text("Click reverse X and Y vector's coordinates", width/2, height/2);
}

function onClick() {
    vec.invert();
}