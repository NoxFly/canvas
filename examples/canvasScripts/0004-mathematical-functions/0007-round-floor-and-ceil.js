let funcs;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    funcs = {
        'round': [[3.4, round(3.4)], [3.5, round(3.5)]],
        'floor': [3.7, floor(3.7)],
        'ceil':  [3.2, ceil(3.2)]
    };

}

function draw() {
    let i = 50;

    fill(255);

    for(let func in funcs) {
        alignText('center');
        fontSize(30);

        text(`${func}()`, width/2, i);

        
        fontSize(16);

        let examples = funcs[func];
        
        if(typeof examples[0] == 'object') {
            let j = i + 50;
            for(let example of examples) {
                text(`${func}(${example[0]}) = ${example[1]}`, width/2, j);
                j += 20;
            }
        } else {
            text(`${func}(${examples[0]}) = ${examples[1]}`, width/2, i + 50);
        }

        i += 150;
    }
}