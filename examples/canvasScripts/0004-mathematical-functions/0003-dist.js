let p1, p2;
let direction;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    p1 = new Vector(width/4, height/2);
    p2 = new Vector(3*width/4, height/2);

    // 1D vector: the X of p2 will change
    direction = new Vector(1);

    setInterval(() => {
        direction.x = chooseRandomDir(-Math.sign(direction.x));
    }, 1000);
}

function draw() {
    stroke('rgba(255, 255, 255, 0.4)');
    line(p1.x, p1.y, p2.x, p2.y);


    noStroke();
    
    fill('red');
    circle(p1.x, p1.y, 10);

    fill('green');
    circle(p2.x, p2.y, 10);

    p2.x += direction.x;



    fill(255);
    alignText('center');
    fontSize(20);

    text(`Distance between 2 points:\n\n${dist(p1, p2)}px`, width/2, 40);

}

function chooseRandomDir(v) {
    return random(v, v*3);
}