let color1, color2, color3;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    color1 = new HSL(0);
    color2 = new HSL(90, 0.7);
    color3 = new HSL(170, 0.3, 0.4);
}

function draw() {
    // first rec
    fill(color1);
    fillRect(width/4 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color1.toString()}\n\n${color1.toHEX().toString()}\n\n${color1.toRGB().toString()}`, width/4, height/3 + 2*50);




    // second rect
    fill(color2);
    fillRect(width/2 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color2.toString()}\n\n${color2.toHEX().toString()}\n\n${color2.toRGB().toString()}`, width/2, height/3 + 2*50);




    // third rect
    fill(color3);
    fillRect(3*width/4 - 100, height/3 - 50, 200, 100);

    fill('white');
    fontSize(15);
    alignText('center');
    text(`${color3.toString()}\n\n${color3.toHEX().toString()}\n\n${color3.toRGB().toString()}`, 3*width/4, height/3 + 2*50);

    color1.add(1);
    color2.s = (color2.s + 0.001) % 1;
    color3.l = (color3.l + 0.001) % 1;
}