let vecA, vecB, vecC;
let counter, nPoints, r;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    r = 50;

    counter = 1;
    nPoints = 500;

    // 1d vector
    vecA = new Vector(100);

    // 2d vector
    vecB = new Vector(1, 0);    

    // 3d vector
    vecC = new Vector(10, -5, 180);
}

function draw() {
    
    // VEC A - 1D
    fill('#0F0');
    fontSize(14);
    alignText('left');
    text('1D vector: new Vector(x)', 40, 20);
    
    vecA.bow(40, 50, {
        stroke: '#0F0'
    });
    
    
    
    // VEC B - 2D
    fill(255);
    alignText('center');
    fontSize(20);
    text(`2D vector: new Vector(x, y)\n\nVector(${round(vecB.x)}, ${round(vecB.y)}).bow(width/2, height/2)`, width/2, height/2 - r - 60);

    vecB.bow(width/2, height/2);

    counter = (counter+1) % nPoints;

    vecB.x = cos(counter * 2 * PI / nPoints) * r;
    vecB.y = sin(counter * 2 * PI / nPoints) * r;



    fill('#FF0');
    alignText('right');
    fontSize(14);
    text(`3D vector: new Vector(x, y, z)\n\nCannot use .bow() method for 3D vectors\n\Look the code on Github\n\nVector(x,y,z).dimension (read-only): ${vecC.dimension}`, width - 20, height - 120);


    alignText('left');
    fill(230);
    fontSize(20);
    text('You can copy a vector like that:', 20, height-70);

    //let vecB = new Vector(vecA);', 20, height-70);

    fill('#a766c1'); text('let        new', 20, height-50);
    fill('#a7b2a9'); text('vecB             (vecA);', 70, height-50);
    fill('#50a5b0'); text('=', 130, height-48);
    fill('#d2b86d'); text('Vector', 200, height-50);
}