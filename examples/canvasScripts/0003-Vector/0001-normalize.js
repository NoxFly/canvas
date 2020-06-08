let vec;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    vec = new Vector(100, 0);
}

function draw() {
    vec.bow(width/2 - 50, 200);
    vec.normalize().mult(50).bow(width/2 - 25, 350);

    fill(150);
    alignText('center');
    fontSize(20);

    text(`Vector's length: ${vec.x}`, width/2, 50);
    text(`vec.bow(): vector's length = 100`, width/2, 150);
    text(`vec.normalize().mult(50).bow():\nvector is normalized in the range [0,1] and then mult by 50\nSo vector's length = 50`, width/2, 270);


    text("Vector.normalize() returns the vector in the range [0,1]\n\nVector.normalize(true) does same,\nbut also applies this range to the vector", width/2, 500);
}