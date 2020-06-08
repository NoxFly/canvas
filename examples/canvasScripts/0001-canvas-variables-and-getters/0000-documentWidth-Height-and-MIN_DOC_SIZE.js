function setup() {
    let data = document.createElement('div');

    data.style.position = 'absolute';
    data.style.top = '10px';
    data.style.left = '10px';


    data.innerHTML = `documentWidth(): ${documentWidth()}px<br>documentHeight(): ${documentHeight()}px<br>MIN_DOC_SIZE: ${MIN_DOC_SIZE}px`;

    document.body.appendChild(data);
}