let circle1, circle2;
let vec1, vec2;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    let r1 = 50,
        r2 = 100,
        strokeWidth = 4;

    circle1 = new CircleShape(r1+strokeWidth, height/2, r1, '#f00', '#fff', strokeWidth);
    circle2 = new CircleShape(width/2, r2+strokeWidth, r2, '#00f', '#fff', strokeWidth);

    circle1.speed = 1;
    circle2.speed = 2;

    vec1 = new Vector(4, 0);
    vec2 = new Vector(0, 4);

    frameRate(60);
}

function draw() {
    circle1.draw();
    circle2.draw();

    circle1.move(vec1);
    circle2.move(vec2);

    if(circle1.pos.x + circle1.r >= width || circle1.pos.x - circle1.r <= 0) vec1.mult(-1, -1);
    if(circle2.pos.y + circle2.r >= height || circle2.pos.y - circle2.r <= 0) vec2.mult(-1, -1);

    if(collision(circle1, circle2)) {
        vec1.set(0, 0);
        vec2.set(0, 0);
    }
}