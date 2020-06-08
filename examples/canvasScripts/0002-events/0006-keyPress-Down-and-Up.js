let kp, kd, ku;

function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);
    fontSize(20);
    alignText('center');
    text("Press a key then release it", width/2, height/5);

    if(kp) {
        text(`keyPress(): ${kp.code}(${kp.charCode})`, width/2, height/5 + 60);
    }

    if(kd) {
        text(`keyDown(): ${kd.code}(${kd.charCode})`, width/2, height/5 + 90);
    }

    if(ku) {
        text(`keyUp(): ${ku.code}(${ku.charCode})`, width/2, height/5 + 90);
    }
}

function keyPress(key) {
    kp = key;
    setTimeout(() => kp = undefined, 500);
}

function keyDown(key) {
    ku = undefined;
    kd = key;
}

function keyUp(key) {
    kd = undefined;
    ku = key;
}