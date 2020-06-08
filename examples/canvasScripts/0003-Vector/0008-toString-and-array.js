function setup() {
    createCanvas(documentWidth(), documentHeight());

    vec = new Vector(-25, 42);
}

function draw() {
    fill(255);
    fontSize(20);
    alignText('center');
    text(`Vector.toString():  ${vec.toString()}\n\nVector.array(): [${vec.array()}]`, width/2, height/2);
}