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
    text("Click to duplicate the rectangle\n\ndouble click to change its color", width/2, height/5);
}

function onDblClick(e) {
    if(bg == '#555') bg = '#f00';
    else bg = '#555';
}

function onClick(e) {
    x = mouseX;
    y = mouseY;
}