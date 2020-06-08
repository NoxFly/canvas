function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);

    alignText('center');

    text('This is a string', width/2, height/2);
}