let myRectangle;
let vec;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    myRectangle = new RectangleShape(0, 0, 50, 50, 'red');

    myRectangle.showOrigin(true);

    myRectangle.speed = 1; // by default 0, so you can't move it if you use .move() method

    vec = new Vector(1, 1);

    frameRate(60);
}

function draw() {
    myRectangle.draw();

    myRectangle.move(vec);

    if(myRectangle.pos.x + myRectangle.width >= width || myRectangle.pos.x <= 0) vec.x *= -1;
    if(myRectangle.pos.y + myRectangle.height >= height || myRectangle.pos.y <= 0) vec.y *= -1;

    if(myRectangle.width < 150) myRectangle.width++;
}