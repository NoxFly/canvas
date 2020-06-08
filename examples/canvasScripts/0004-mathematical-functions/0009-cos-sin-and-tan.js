let funcs, n;

function setup() {
    createCanvas(documentWidth(), documentHeight());

    n = 0.3;

    funcs = {
        'cos':  x => cos(x),  'sin':  x => sin(x),  'tan':   x => tan(x),
        'acos': x => acos(x), 'asin': x => asin(x), 'atan':  x => atan(x),
        'cosh': x => cosh(x), 'sinh': x => sinh(x), 'atan2': null
    };

}

function draw() {
    let i = [40, height/3 + 40, 2*height/3 + 40];

    for(let k=0; k < 3; k++) {
        let func1 = Object.keys(funcs)[k];
        let func2 = Object.keys(funcs)[k+3];
        let func3 = Object.keys(funcs)[k+6];

        fill('#007fff');
        fontSize(30);
        alignText('center');

        text(`${func1}()   -   ${func2}()   -   ${func3}`, width/2, i[k]);

        fontSize(16);
        fill(255);

        let thirdFunc = (func3 == 'atan2')? `atan2(5, 5) = ${atan2(5, 5)}` : `${func3}(${n}) = ${funcs[func3](n)}`;

        text(`${func1}(${n}) = ${funcs[func1](n)}\n\n${func2}(${funcs[func1](n)}) = ${funcs[func2](funcs[func1](n))}\n\n${thirdFunc}`, width/2, i[k] + 50);
    }
}