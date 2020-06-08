let myCircle;
let vec;
function setup() {
    createCanvas(documentWidth(), documentHeight());

    myCircle = new CircleShape(width/2, height/2, 20, 'red');

    myCircle.showOrigin(true);

    vec = 0;

    frameRate(60);
}

function draw() {
    myCircle.draw();

    alignText('center');
    fontSize(20);
    fill(255);
    text('Hover me !', width/2, height/3);


    if((vec == 5 && myCircle.r < 100) || (vec == -5 && myCircle.r > 20)) {
        myCircle.r += vec;
    }




    if(myCircle.hover()) {
        myCircle.fill = 'blue';
        vec = 5;
    }
    
    else {

        myCircle.fill = 'red';
        vec = -5;
    }
}