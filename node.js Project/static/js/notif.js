let demo = document.getElementById('action');
let btn = document.getElementById('NotBtn');

btn.addEventListener('click', () => {
    if (action.style.display != 'none') {
        action.style.display = 'none';
    }
    else {
        action.style.display = 'block';

    }
});