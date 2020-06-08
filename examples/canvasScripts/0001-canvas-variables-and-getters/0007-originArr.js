function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);
    fontSize(20);

    text('Shape origins:', 20, 30);
    
    stroke(255);
    strokeWeight(1);
    line(20, 40, 180, 40);

    for(let i in originArr) {
        let origin = originArr[i];
        text(origin, 20, 70+25*i);
    }
}