let state;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    state = 'CONNECTED'; // maybe ?
}

function draw() {
    fill(255);
    fontSize(20);
    alignText('center');
    text("Detect if you are connected to internet", width/2, height/5);

    fontSize(40);
    text(`${state}`, width/2, height/2);
}

function onOnline() {
    state = 'CONNECTED';
}

function onOffline() {
    state = 'DISCONNECTED';
}