function setup() {
    createCanvas(documentWidth(), documentHeight());
}

function draw() {
    fill(255);
    fontSize(20);


    text(`isDevice.mobile (pc or mobile/tablet): ${isDevice.mobile}\nisDevice.android: ${isDevice.android}\nisDevice.ios: ${isDevice.ios}`, 20, 40);
}