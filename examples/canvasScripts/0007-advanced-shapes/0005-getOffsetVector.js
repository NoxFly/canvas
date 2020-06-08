let myRectangle;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    let w = 200,
        h = 100;

    myRectangle = new RectangleShape(width/2, height/2, w, h, 'red');

    myRectangle.setOrigin('center');

    myRectangle.showOrigin(true);
}

function draw() {
    myRectangle.draw();

    fill(255);
    fontSize(20);
    alignText('center');

    text(`getOffsetVector(myRectangle):\n${getOffsetVector(myRectangle).toString()}`, width/2, height/4);

    stroke(255);
    strokeWeight(2);
    
    line(
        myRectangle.pos.x - myRectangle.width/2,
        myRectangle.pos.y - myRectangle.height/2 - 10,
        myRectangle.pos.x + myRectangle.width/2,
        myRectangle.pos.y - myRectangle.height/2 - 10
    );
    
    text(`${myRectangle.width}`, myRectangle.pos.x, myRectangle.pos.y - myRectangle.height/2 - 20);

    
    line(
        myRectangle.pos.x - myRectangle.width/2 - 10,
        myRectangle.pos.y - myRectangle.height/2,
        myRectangle.pos.x - myRectangle.width/2 - 10,
        myRectangle.pos.y + myRectangle.height/2
    );

    push();
        translate(myRectangle.pos.x - myRectangle.width/2 - 20, myRectangle.pos.y);
        rotate(-90);
        text(`${myRectangle.height}`, 0, 0);
    pop();

    text("It's the offset vector comparing the real shape origin\n(here top-left) with its current origin (here center)", width/2, height/1.2);
}