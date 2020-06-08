let myTriangle;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    myTriangle = new Triangle(width/2 - width/4, height/2, width/2, height/2 - height/4, width/2 + width/4, height/2, 'red', 'white', 10);
}

function draw() {
    myTriangle.draw();

    if(myTriangle.hover()) myTriangle.fill = 'green';
    else myTriangle.fill = 'red';
}