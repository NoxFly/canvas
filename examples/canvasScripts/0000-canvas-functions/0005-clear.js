function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);
    circle(width/2, height/2, height/3);
    clearRect(width/2, height/2, height/3, height/3);
}