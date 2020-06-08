let hist, mappedHist;

function setup() {
    createCanvas(documentWidth(), documentHeight(), '#ccc');

    hist = [];

    for(let i=0; i < 500; i++) {
        hist.push(random(500));
    }

    mappedHist = map(hist, 0, 500, 100, 430);

    // just print one time before setting the frame rate to 1 (else black screen during one second)
    draw();

    frameRate(1);
}

function draw() {
    stroke('#007fff');
    strokeWeight(1);

    fontSize(15);
    
    // default histogram
    push();
        translate(width/2 - 250, height/2.5);

        line(-1, 0, 500, 0);
        line(-1, 0, -1, -height/4);

        alignText('center');
        fill(0);
        text('Histogram', 250, 30);
        text('0', 0, 20);
        text('500', 500, 20);


        stroke('#444');
        for(let i in hist) {
            line(hist[i], -random(0, 100), hist[i], 0);
        }

        
    pop();
    
    alignText('center');
    text('mappedHist = map(hist, 0, 500, 100, 430);', width/2, height/2);

    // mapped histogram
    push();
        translate(width/2 - 250, 5*height/6);

        line(-1, 0, 500, 0);
        line(-1, 0, -1, -height/4);

        alignText('center');
        fill(0);
        text('Mapped Histogram', 250, 30);
        text('100', 100, 20);
        text('430', 430, 20);

        stroke('#444');
        for(let i in mappedHist) {
            line(mappedHist[i], -random(0, 100), mappedHist[i], 0);
        }
    pop();

    fontSize(25);
    fill(0);
    alignText('center');
    text('RANGE MAPPING', width/2, 40);
}