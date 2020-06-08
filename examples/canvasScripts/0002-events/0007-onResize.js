let time, kp, kd, ku;

function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);
    fontSize(20);
    alignText('center');
    text("If you resize your window / document\nThe canvas will resize too", width/2, height/5);

    fill('red');
    noStroke();
    circle(width/2, height/2, 50);

    stroke('white');
    strokeWeight(2);
    line(30, height/2, width - 30, height/2);
}

function onResize(newWidth, newHeight) {
    setCanvasSize(newWidth, newHeight);
}