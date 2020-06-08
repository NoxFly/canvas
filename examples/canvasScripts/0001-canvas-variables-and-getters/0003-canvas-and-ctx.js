let x, y, counter;

function setup() {



    let arrow = document.createElement('div');
    arrow.classList.add('blue-arrow');

    
    let canvasDesc = document.createElement('div');
    canvasDesc.innerText = 'canvas = canvas DOM element';
    canvasDesc.classList.add('cvsDesc');
    
    let ctxDesc = document.createElement('div');
    ctxDesc.innerText = 'ctx = 2d context of the canvas';
    ctxDesc.classList.add('ctxDesc');
    
    
    
    createCanvas(400, 200);
    
    canvas.classList.add('specialCanvas');
    
    
    
    document.body.appendChild(arrow);
    document.body.appendChild(canvasDesc);
    document.body.appendChild(ctxDesc);


    x = -20;
    y = height/2 - height/4;
    counter = 0;

    frameRate(120);
}

function draw() {
    x += 2;
    y += sin(counter) * 5;

    counter += 5/180*PI;

    if(x > width + 20) x = -20;

    fill('red');
    circle(x, y, 20);
}