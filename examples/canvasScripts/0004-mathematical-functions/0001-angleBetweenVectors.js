let v1, v2;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    v1 = new Vector(154, 12);
    v2 = new Vector(12, 146);
}

function draw() {
    push();
        translate(width/2 - max(v1.x, v2.x)/2, height/2 - max(v1.y, v2.y)/2);

        v1.bow(0, 0);
        v2.bow(0, 0);


        fontSize(16);
        fill(255, 100, 100);
        
        text(`v1(${v1.x},${v1.y})`, 0, -10);
        text(`v2(${v2.x},${v2.y})`, -100, 50);
        
        
        
        fill(50, 255, 100);
        text('θ', 40, 50);
        
        
        noFill();
        stroke(255);
        strokeWeight(2);
        
        arc(-4, 4, 50, 0, angleBetweenVectors(v1, v2));
    pop();
        
    
    fill(255);
    fontSize(20);
    text(`θ = degree( angleBetweenVectors(v1, v2) );\n\nθ = ${degree(angleBetweenVectors(v1, v2))}`, 20, 30);

}