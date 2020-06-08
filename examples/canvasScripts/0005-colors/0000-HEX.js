let color1, color2, color3;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    color1 = new HEX('#007fff');
    color2 = new HEX('#0FA');
    color3 = new HEX(0xAAAA71);
}

function draw() {
    // first rec
    fill(color1);
    fillRect(width/4 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color1.toString()}\n\n${color1.toRGB().toString()}\n\n${color1.toHSL().toString()}`, width/4, height/3 + 2*50);




    // second rect
    fill(color2);
    fillRect(width/2 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color2.toString()}\n\n${color2.toRGB().toString()}\n\n${color2.toHSL().toString()}`, width/2, height/3 + 2*50);




    // third rect
    fill(color3);
    fillRect(3*width/4 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color3.toString()}\n\n${color3.toRGB().toString()}\n\n${color3.toHSL().toString()}`, 3*width/4, height/3 + 2*50);
}