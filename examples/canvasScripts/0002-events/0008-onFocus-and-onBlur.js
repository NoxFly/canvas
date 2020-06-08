let focus;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    focus = false;
}

function draw() {
    fill(255);
    fontSize(20);
    alignText('center');
    text("Change the focus\n\nfocusing another window\n\nor clicking on the title \"CANVAS TEST\"", width/2, height/5);

    text(`Focusing: ${focus}`, width/2, height/2);
}

function onFocus() {
    focus = true;
}

function onBlur() {
    focus = false;
}