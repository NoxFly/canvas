function setup() {
    createCanvas(documentWidth(), documentHeight());

    let data = document.createElement('div');

    data.style.position = 'absolute';
    data.style.color = 'white';
    data.style.top = '10px';
    data.style.left = '10px';


    data.innerHTML = `fps (by default): ${fps}`;

    document.body.appendChild(data);
}