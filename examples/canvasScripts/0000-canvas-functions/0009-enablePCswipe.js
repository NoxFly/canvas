let x, r, rx, moving, vx, lastX, distance;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    x = r = rx = lastX = 50;
    distance = 100;
    moving = false;
    vx = 10;

    // even with this line that listen to swipe right, it will not occurs because the next line
    // disable the pc swipe (so it's working on phones)
    canvas.addEventListener('swiperight', moveCircle);

    enablePCswipe(false);
}

function draw() {
    
    fill('red');
    stroke('red');
    circle(x, height/2, r);

    if(moving) {
        x += vx;
        if(lastX + distance == x) moving = false;
    }

    alignText('center');
    fill(255);
    fontSize(20);
    text('Because PC swipe is disabled,\neven with code that listen to swipe,\nyou cannot move the shape', width/2, height/4);
    
}

function moveCircle() {
    if(!moving) {
        moving = true;
        lastX = x;
    }
}