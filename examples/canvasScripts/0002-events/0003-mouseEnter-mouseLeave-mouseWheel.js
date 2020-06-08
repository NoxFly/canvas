let bg, x, y, s;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    bg = '#555';
    x = width/2 - width/8;
    y = height/2 - height/8;
    s = width/4;
}

function draw() {
    fill(bg);
    rect(x, y, s, s);

    fill(255);
    fontSize(20);
    alignText('center');
    text("Scroll canvas to change rectangle's X position", width/2, height/5);
}

function mouseEnter() {
    bg = '#f00';
}

function mouseLeave() {
    bg = '#555';
}

function mouseWheel(e) {
    x += e.deltaY;
}