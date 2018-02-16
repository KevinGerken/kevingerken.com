const home = document.getElementById(`home`).style;
const demo = document.getElementById(`demo`).style;
const body = document.getElementById(`body`).style;
const loca = document.getElementById(`loca`).style;

//E-mail
const name = `kevin`;
const domain = `kevingerken.com`;
document.getElementById(`email`).innerHTML = `<a href="mailto:${name}@${domain}">Email</a>`;

document.getElementById(`goDemo`).addEventListener(`click`, loadDemos);
document.getElementById(`goHome`).addEventListener(`click`, loadHome);

function loadDemos() {
    body.backgroundPosition = `right top`;
    home.opacity = 0;
    setTimeout(appear, 3500)
    function appear() {
        home.display = `none`;
        demo.display = `flex`;
        setTimeout(appearC, 100)
            function appearC() {
                demo.opacity = 1
            }
    }   
    return false;
} 

function loadHome() {
    body.backgroundPosition = `left bottom`;
    demo.opacity = 0;    
    setTimeout(appear, 3500);
    function appear() {
        demo.display = `none`;
        home.display = `block`;
        setTimeout(appearC, 100)
            function appearC() {
                home.opacity = 1
            }
    }   
    return false;
}