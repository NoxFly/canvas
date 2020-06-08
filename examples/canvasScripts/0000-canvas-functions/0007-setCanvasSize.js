let i, j, sizes;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    i = 1;
    j = 0;

    sizes = [
        {
            w: documentWidth(),
            h: documentHeight()
        },

        {
            w: 500,
            h: 500
        }
    ];

}

function draw() {
    if(i%100 == 0) {
        j = 1 - j;
        setCanvasSize(sizes[j].w, sizes[j].h);
    }

    i = (i+1) % 100;

    fill('red');

    circle(width/2, height/2, 20);
}