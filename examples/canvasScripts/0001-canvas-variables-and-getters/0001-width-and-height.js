function setup() {
    createCanvas(500, 200);

    let data = document.createElement('div');

    data.style.position = 'absolute';
    data.style.color = 'white';
    data.style.top = '10px';
    data.style.left = '10px';


    data.innerHTML = `width (canvas width): ${width}px<br>height (canvas height): ${height}px`;

    document.body.appendChild(data);
}