function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    //min
    fontSize(30);
    alignText('center');
    fill(255);

    text('min()', width/2, 50);
    
    fontSize(15);

    text(`min(1, 2, 3) = ${min(1, 2, 3)}`, width/2, 100);


    // max
    fontSize(30);

    text('max()', width/2, 200);
    
    fontSize(15);

    text(`max(1, 2, 3) = ${max(1, 2, 3)}`, width/2, 250);



    // abs
    fontSize(30);

    text('abs()', width/2, 350);
    
    fontSize(15);

    text(`abs(-10) = ${abs(-10)}\n\nabs(10) = ${abs(10)}`, width/2, 400);
}