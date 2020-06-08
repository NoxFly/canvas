let v1, v2, v3;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    v1 = new Vector(200, 200);
    v2 = new Vector(-300, -100);
    v3 = angleToVector(radian(120)).mult(60);
}

function draw() {
    // horizontal lines
    stroke(200);

    line(0, height/2, width, height/2);
    line(100, 50, 200, 50);
    

    // vector's representations
    v1.bow(width/6, height/2);
    v2.bow(3*width/4, height/2);
    v3.bow(150, 50);



    // angle's representations
    noFill();

    stroke(50, 255, 100);
    arc(width/6, height/2, 160, 0, vectorToAngle(v1));

    stroke(255, 50, 100);
    arc(3*width/4, height/2, 100, -vectorToAngle(v2), 0);

    stroke(100, 50, 255);
    arc(150, 50, 30, 0, vectorToAngle(v3));



    // texts
    fontSize(16);
    alignText('center');
    
    fill(255);
    text("vectorToAngle(v) compares the given vector\n\nwith an horizontal line", width/2, 40);

    fill(200, 200, 0);
    text("Angles are in radian", width/2, 120);


    fontSize(12);
    

    // v1
    fill(50, 255, 100);
    alignText('left');
    text("vectorToAngle(Vector(200, 200))", width/4 + 80, height/2 + 80);

    // v2
    fill(255, 50, 100);
    alignText('center');
    text("vectorToAngle(Vector(-300, -100))", 3*width/4, height/2 - 120);

    // v3
    fill(100, 50, 255);
    alignText('left');
    text("v = angleToVector(radian(120)).mult(60)", 150, 100);
}