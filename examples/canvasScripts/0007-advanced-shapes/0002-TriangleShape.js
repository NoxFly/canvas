let myTriangle, myTriangle2, myTriangle3;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    myTriangle = new TriangleShape(width/2, height/2, 50, 0, 50, 0, 'red');
    myTriangle.showOrigin(true);

    myTriangle2 = new TriangleShape(width/3, height/3, 100, 50, 50, -10, 'green');
    myTriangle2.showOrigin(true);

    myTriangle3 = new TriangleShape(width/1.5, height/1.5, 20, -90, 100, 0, 'blue');
    myTriangle3.showOrigin(true);
}

function draw() {
    myTriangle.draw();
    myTriangle2.draw();
    myTriangle3.draw();

    if(myTriangle.hover()) myTriangle.fill = 'white';
    else myTriangle.fill = 'red';

    if(myTriangle2.hover()) myTriangle2.fill = 'white';
    else myTriangle2.fill = 'green';

    if(myTriangle3.hover()) myTriangle3.fill = 'white';
    else myTriangle3.fill = 'blue';
}