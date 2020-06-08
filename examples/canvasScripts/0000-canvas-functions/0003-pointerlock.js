let x, y;

function setup() {
    createCanvas(documentWidth(), documentHeight(), '#000', true);

    x = width /2;
    y = height/3;
}

function draw() {
    fill(255);
    alignText('center');
    fontSize(20);
    text('Click or press Esc on the canvas\nto enable/disable pointerlock\n\nand move the mouse horizontally', width/2, height/2);

    
    if(document.pointerLockElement) {
        let dir = mouseDir();

        if(dir) {
            x += dir.x;

            if(x < -10) x = width + 10;
            if(x > width + 10) x = -10;
        }
    }
    
    stroke(255);
    strokeWeight(2);
    line(x - 10, y, x + 10, y);
}