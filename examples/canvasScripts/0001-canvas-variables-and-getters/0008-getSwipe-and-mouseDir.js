function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);
    fontSize(20);
    alignText('center');


    text('Mouse your move\nin any direction to enable mouseDir()', width/2, height/4);

    text('Swipe\nin any direction to enable getSwipe()', width/2, height/2);


    const dir = mouseDir();
    const swipe = getSwipe();


    if(dir) {
        text(`mouseDir(): ${dir}`, width/2, height/4 + 60);
    }

    if(swipe) {
        text(`getSwipe(): ${swipe}`, width/2, height/2 + 60);
    }
}