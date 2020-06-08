let list, funcs;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    list = []
    for(let i=0; i < 10; i++) list.push(random(100));

    funcs = {
        sum:        sum(...list),
        mean:       mean(...list),
        median:     median(...list),
        mode:       mode(...list),
        variance:   variance(...list),
        std:        std(...list)
    };
}

function draw() {
    fontSize(25);
    fill(255);
    
    text(`list = [${list}];`, 20, 30);

    fontSize(15);

    let i = 100;
    for(let func in funcs) {
        text(`${func}(...list) = ${funcs[func]}`, 20, i);
        i += 40;
    }
}