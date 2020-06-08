let bg;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    bg = '#555';
}

function draw() {
    fill(bg);
    rect(width/2 - width/8, height/2 - height/8, width/4, width/4);

    fill(255);
    fontSize(20);
    alignText('center');
    text("Right click to change rectangle color", width/2, height/5);
}

function onContextmenu(e) {
    e.preventDefault();
    if(bg == '#555') bg = '#f00';
    else bg = '#555';
}