function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    
    // pow
    fontSize(30);
    alignText('center');
    fill(255);

    text('pow()', width/2, 50);
    
    fontSize(15);
    alignText('left');

    text(`pow(4) = ${pow(4)}\n\npow(-4, 3) = ${pow(4, 3)}`, width/2 - 200, 100);


    // sqrt
    fontSize(30);
    alignText('center');

    text('sqrt()', width/2, 200);
    
    fontSize(15);
    alignText('left');

    text(`sqrt(64) = ${sqrt(64)}\n\nsqrt(-64) = ${sqrt(16)}`, width/2 - 200, 250);

}