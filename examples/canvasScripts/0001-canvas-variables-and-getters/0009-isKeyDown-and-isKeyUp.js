function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);
    fontSize(20);
    alignText('center');

    text('Press A or Z to change variables\n\nYou must click on the canvas to\nfocus it and enable listeners', width/2, height/4);

    alignText('left');

    text(`isKeyDown(65): ${isKeyDown(65)}`, width/4 , height/2 - 10);
    text(`isKeyUp(90): ${isKeyUp(90)}`, width/4, height/2 + 10);
}