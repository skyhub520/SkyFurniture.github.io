
var perloader = document.getElementById('loader');
window.addEventListener('load', function () {
    loader.style.display = 'none'
})

$(window).on('scroll', function () {
    if ($(window).scrollTop()) {
        $('header').addClass('black');
    }
    else {
        $('header').removeClass('black');
    }
})

const onInput = document.getElementById('oninput')

onInput.addEventListener('input', () => {
    const x = onInput.value;
    console.log(x)
    document.getElementById('input-text').innerHTML = x;
});


let stopCss = 'color:red; font-size:36px; font-weight:600; -webkit-text-steoke:1px black;';
console.log(`%cdon't hack this website`, stopCss)




const currentLocation = location.href;
const menuItem = document.querySelectorAll('nav a')
const menuLength = menuItem.length
for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
        menuItem[i].className = 'active'
    }
}



// Show/hide password onClick of button using Javascript only

// https://stackoverflow.com/questions/31224651/show-hide-password-onclick-of-button-using-javascript-only
// Show/hide password onClick of button using Javascript only

// https://stackoverflow.com/questions/31224651/show-hide-password-onclick-of-button-using-javascript-only

function show() {
    var p = document.getElementById('pwd');
    p.setAttribute('type', 'text');
}

function hide() {
    var p = document.getElementById('pwd');
    p.setAttribute('type', 'password');
}

var pwShown = 0;

document.getElementById("eye").addEventListener("click", function () {
    if (pwShown == 0) {
        pwShown = 1;
        show();
    } else {
        pwShown = 0;
        hide();
    }
}, false);


