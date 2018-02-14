const nav = document.getElementById(`nav`);
const burger = document.getElementById(`burger`);
const body = document.getElementById(`body`);
let navVis = false;

burger.addEventListener(`click`, navToggle);

function navToggle() {
  if (navVis === true) {
    fadeOut();
  } else {
    navVis = true;
    burger.value = `X`;
    nav.style.opacity = 1;
    nav.style.visibility = `visible`;
    nav.addEventListener('click', fadeOut);
  }
}
     
function fadeOut() {
  navVis = false;
  burger.value = `☰`;
  nav.style.opacity = 0;
  setTimeout(function () {nav.style.visibility = "hidden";}, 1000) ;
}


