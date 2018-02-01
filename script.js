//E-mail
var name = "kevin";
var domain = "kevingerken.com";
document.getElementById("email").innerHTML = '<a href="mailto:' + name + '@' + domain + '">Email</a>';

window.onload = donkey;
function donkey() {
    map.height = "1px";
    map.width = "1px";
};

// 

document.getElementById('goDemo').addEventListener('click', loadDemos);
document.getElementById('goHome').addEventListener('click', loadHome);
document.getElementById('goLocation').addEventListener('click', loadLocation);


var home = document.getElementById("home").style;
var demo = document.getElementById("demo").style;
var body = document.getElementById("body").style;
var loca = document.getElementById("loca").style;
var map =document.getElementById("map").style;

function loadDemos() {
    body.backgroundPosition = "right top";
    home.opacity = 0;
    loca.opacity = 0;
    setTimeout(appear, 3500)
    function appear() {
        home.display = "none";
        loca.display = "none";
        demo.display = "flex";
        setTimeout(appearC, 100)
            function appearC() {
                demo.opacity = 1
            }
    }   
    return false;
} 

function loadHome() {
    body.backgroundPosition = "left bottom";
    demo.opacity = 0;    
    loca.opacity = 0;
    setTimeout(appear, 3500);
    function appear() {
        demo.display = "none";
        loca.display = "none";
        home.display = "block";
        setTimeout(appearC, 100)
            function appearC() {
                home.opacity = 1
            }
    }   
    return false;
} 

function loadLocation() {
    map.width = "70vw";
    map.height = "70vh";
    body.backgroundPosition = "center";
    demo.opacity = 0;    
    home.opacity = 0;
    setTimeout(appear, 3500);
    function appear() {
        demo.display = "none";
        home.display = "none";
        loca.display = "block";
        setTimeout(appearC, 100)
            function appearC() {
                loca.opacity = 1;
            }
    }   
    return false;
}

 

//Google Maps
function initMap() {
        var uluru = {lat: 39.0725, lng: -93.7172};
        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 7,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
      }
 