var navVis = false;
var nav = document.getElementById("nav");
var burger = document.getElementById("burger");
burger.addEventListener('click', navToggle);
var body = document.getElementById("body");

function navToggle() {
    if (navVis === true) {
        fadeOut();
    } else {
        navVis = true;
        nav.style.opacity = 1;
        nav.style.visibility = "visible";
        nav.addEventListener('click', fadeOut);
        }
}
     
function fadeOut() {
        navVis = false;
        nav.style.opacity = 0;
        setTimeout(function () {nav.style.visibility = "hidden";}, 1000) ;
}


