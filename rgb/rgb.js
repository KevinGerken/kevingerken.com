let colorArray = [];
let winningColor;
let colorType = `rgb`;
const header = document.querySelector(`h1`);
const find = document.querySelector(`#find`);
const ng = document.querySelector(`#new`);
const win = document.querySelector(`#win`);
const easy = document.querySelector(`#easy`);
const hard = document.querySelector(`#hard`);
const insanity = document.querySelector(`#insanity`);
const section = document.querySelector(`section`);
const r = document.querySelector(`#rgb`);
const h = document.querySelector(`#hex`);
const diff = document.querySelector(`#diff`);

ng.addEventListener(`click`, newGame);
easy.addEventListener(`click`, () => {
    difficulty(3);
    diff.value = 3;
});
hard.addEventListener(`click`, () => {
    difficulty(6);
    diff.value = 6;
});
insanity.addEventListener(`click`, () => {
    difficulty(99);
    diff.value = 99;
});

diff.addEventListener(`input`, () => {
    difficulty(Number(diff.value))
});

r.addEventListener(`click`, function () {
    r.classList.add(`active`);
    h.classList.remove(`active`);
    colorType = `rgb`;
    newGame();
})

h.addEventListener(`click`, function () {
    h.classList.add(`active`);
    r.classList.remove(`active`);
    colorType = `hex`;
    newGame();
})

function difficulty(num) {
    colorArray = colorArray.slice(0, 0);
    section.innerHTML = ``;
    for (let i = 0; i < num; i++) {
        colorArray.push(``);
        section.innerHTML += `<div class="color"></div>`;
    }
    let divs = document.querySelectorAll(`.color`);
    for (let i = 0; i < divs.length; i++) {
        colorArray[i] = divs[i];
    }
    newGame();
}

function randomColor() {
    c = function () {
        return Math.floor(Math.random() * 256);
    }
    return `rgb(${c()}, ${c()}, ${c()})`;
}

function newGame() {
    win.textContent = ``;
    header.style.backgroundColor = `#535993`;
    colorArray.forEach(function(color) {
        color.style.backgroundColor = randomColor();
        color.style.opacity = 1;
    }); 
    winningColor = colorArray[Math.floor(Math.random() * colorArray.length)].style.backgroundColor;
    if(colorType === `rgb`) {
        find.innerHTML = winningColor;
    } else {
        find.innerHTML = rgbToHex(winningColor);
    }
    colorArray.forEach(function(color) {
        divs = document.querySelectorAll(`.color`);
        color.addEventListener(`click`, function(){
            if (color.style.backgroundColor === winningColor) {
                header.style.backgroundColor = winningColor;  
                divs.forEach(function(color){
                    color.style.backgroundColor = winningColor;
                    color.style.opacity = 1;
                })
                win.textContent = `Winner!`;
            } else {
                color.style.opacity = 0;
                win.textContent = `Try Again`;
            }
        });
    }); 
}

function rgbToHex(rgb) {
    rgbArr = rgb.slice(4, -1).split(`, `);
    let hex = `#`;
    rgbArr.map(o => {
        testHex = Number(o).toString(16);
        if(testHex.length < 2){
            hex = hex + `0` + testHex;
        } else {
            hex += testHex;
        }
    });
    return (hex);
}

difficulty(6);