window.onload = () => {

    let listDir = document.body.querySelector('#list-dir');
    let listTest = document.body.querySelector('#list-tests');
    let iframe = document.body.querySelector('iframe');


    listDir.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function() {
            listDir.classList.add('offsetLeft');
            let ul = document.body.querySelector(`#ul-${li.getAttribute('data-testDir')}`);
            ul.classList.add('offsetLeft');
        });
    });

    document.querySelectorAll('.back').forEach(back => {
        back.addEventListener('click', function() {
            ul = this.parentNode;
            ul.classList.remove('offsetLeft');
            listDir.classList.remove('offsetLeft');
        });
    });

    listTest.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', function() {
            if(li.classList.contains('back')) return;

            let active = document.body.querySelector('.active');
            if(active) active.classList.remove('active');
            li.classList.add('active');


            let dir = li.parentNode.id.replace('ul-', '');
            let script = li.id.replace('li-', '');

            iframe.setAttribute('src', `./example.php?script=${dir}/${script}`);
        }); 
    });


};