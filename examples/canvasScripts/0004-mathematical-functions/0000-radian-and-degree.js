function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255)
    fontSize(20);

    text(`radian(90)  = ${radian(90)}\n\ndegree(1.3) = ${degree(1.3)}`, width/2 - 170, height/2 - 20);
}