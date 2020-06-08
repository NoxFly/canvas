let color1, color2, color3;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    color1 = new RGB(255);
    color2 = new RGB(40, 150);
    color3 = new RGB(170, 50, 100);
}

function draw() {
    // first rec
    fill(color1);
    fillRect(width/4 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color1.toString()}\n\n${color1.toHEX().toString()}\n\n${color1.toHSL().toString()}`, width/4, height/3 + 2*50);




    // second rect
    fill(color2);
    fillRect(width/2 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color2.toString()}\n\n${color2.toHEX().toString()}\n\n${color2.toHSL().toString()}`, width/2, height/3 + 2*50);




    // third rect
    fill(color3);
    fillRect(3*width/4 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color3.toString()}\n\n${color3.toHEX().toString()}\n\n${color3.toHSL().toString()}`, 3*width/4, height/3 + 2*50);

    color1.r = (color1.r + 1) % 255;
    color2.g = (color2.g + 1) % 255;
    color3.b = (color3.b + 1) % 255;
}