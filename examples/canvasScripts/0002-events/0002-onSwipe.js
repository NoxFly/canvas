let vx, vy;
let x, y;
let speed;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    x = width/2;
    y = height/2;

    vx = vy = 0;

    speed = 2;
}

function draw() {
    fill('red');
    circle(x, y, 20);

    fill(255);
    alignText('center');
    fontSize(20);
    text('Swipe up/down/left/right to move the circle', width/2, height/4);

    x += vx * speed;
    y += vy * speed;
}

function onSwipe(direction) {
    switch(direction) {
        case 'left':
            vx = -1;
            vy = 0;
            break;

        case 'right':
            vx = 1;
            vy = 0;
            break;

        case 'up':
            vy = -1;
            vx = 0;
            break;

        case 'down':
            vy = 1;
            vx = 0;
    }
}