let funcs;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    funcs = {
        'exp':   [[10, exp(10)], [-10, exp(-10)]],
        'log':   [[30, log(30)], [-30, log(-30)]],
        'log10': [[50, log10(50)], [-50, log10(-50)]]
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