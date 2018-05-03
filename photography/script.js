const imageLinks = document.querySelectorAll(`.galleries a`),
      images = document.querySelectorAll(`.galleries a img`),
      galleryName = document.querySelector(`.galleries h3`),
      weddingsButton = document.querySelector(`.weddings`),
      seniorsButton = document.querySelector(`.seniors`),
      babiesButton = document.querySelector(`.babies`),
      familiesButton = document.querySelector(`.families`),
      popupImage = document.querySelector(`.popup-image`),
      popup = document.querySelector(`.popup`),
      stopButton = document.querySelector(`.stop-button`),
      leftArrow = document.querySelector(`.arrow-left`),
      rightArrow = document.querySelector(`.arrow-right`),
      x = document.querySelector(`.close`),
      altTags = [
        ``,
        `A newlywed couple outside in front of trees, about to kiss.`,
        `A newlywed couple, kissing, seen from behind sitting on a large rock by a pond.`,
        `A bride in her gown leaning next to a window in profile.`,
        `A bride walking down a sidewalk, holding her bouqet, train trailing behind.`,
        `A newlywed couple in a posed kiss on a path through a grove of trees.  The groom behind in a grey suit, the bride tilting her head over her shoulder in white holding a bouqet.`,
        `A bride in her gown laying in the grass, train splayed behind her head with leaves dotting it's surface.`,
        `A newlywed couple facing each other holding hands, in siloutte in front of the setting sun.`,
        `A groom hugging his new bride and lifting her into the air in the middle of a road running through a forrest.`,
        'A bride seated in a room with sun shining through the slats of the shutters wearing a salmon colored gown with a long fluffy train.',
        `A close shot of a bouqet being held by a bride.`,
        `A newlywed couple, from behind, cuddling on a park bench looking toward the horizon, colorful fall leaves on the ground.`,
        `Close up of a couples clasped hands while they recite thier vows.`,
        `Close up of a bouqet held by a bride with her grooms arms encircling her.`,
        `Close up of a ring being slid over a groom's finger by his bride.`,
        `A teen girl with shoulder-length brown hair wearing a grey t-shirt and overalls standing in front of a backdrop of dark green leaves.`,
        `A young man wearing glasses and a scarf standing in front of a red train car.`,
        `A young woman with long black hair wearing a jean jacket and leather baseball cap.`,
        `A teen girl laying in the grass long brown hair spread out beside her with yellow flowers in it.`,
        `A young woman with long black hair wearing a black dress sitting on an indoor bench with her bare feet on it.`,
        `A teen woman standing in a field, long dark hair draped in front of her shoulders, wearing an aqua shirt with cut out shoulders.`,
        `A young lady laying on her side on bleachers in black and white.`,
        `A teen girl sitting cross legged in a wooded park, fall leaves on the ground wearing a light sweater and dark leather pants.`,
        `A young woman standing thigh deep in a stream with cheek length red hair wearing a wet red dress`,
        `A young woman leaning against  a railing next to train tracks running through woods.`,
        `A teenage woman in a white dress, in front of concreate stairs, leaning against a stone wall`,
        `A young lady wearing a maids outfit posed on her stomach on a pile of pallets.`,
        `A teen girl sitting in front of pine trees.`,
        `A young woman posed on a ledge in front of a building wearing a leather jacket and ripped black jeans`,
        `A smiling baby laying in a white blanket.  In black and white.`,
        `A side shot of a baby posed in front of a laptop.`,
        `A toddler girl coming through a wooden gate with fading green paint into a garden.`,
        `A human infant in a turqoise knit cap with a bright red bow.`,
        `A man's arm holding a sleeping baby head resting in his hand`,
        `A baby laying on it's back wearing a striped knit hat.`,
        `A baby wearing a large tutu looking up into the overhead camera.`,
        `A female human infant wearing a dress and Raggedy Ann style hat that will surely embarass her in the future, seated on a table next to a basket with a small stuffed dog in it.`,
        `A four year old holding a newborn sitting on a chair on the front porch.`,
        `A baby sitting on fall leaves on the ground.`,
        `A five year old laying on a bed with thier newborn sibling laying on thier arm.`,
        `A baby in a basket.`,
        `A baby's hand grabbing an adult finger.`,
        `A baby laying on it's stomach on a fluffy rug.`,
        `Three boys aged six, four and three standing on the grass looking up toward the camera.`,
        `A young family with a toddler sitting on a blanket in the park.`,
        `A father holding up a newborn with his wife next to him touching it's cheek.`,
        `A couple sitting on thier living room floor with thier three year old and newborn.`,
        `Three sisters aged five, four, and three outside in coats and scarves after an inch of snow has fallen.`,
        `A mother kissing her six year old daughter on the cheek as she carries her down a city street.`,
        `A man posed with his right arm around his wife the other holding his two year old son, in the park.`,
        `A pair of grandparents, the grandfather holding the baby, the grandmother holding the two year old.`,
        `A mother making a face at her three year old while they're both seated on the floor.`,
        `A couple with thier arms around a baby.`,
        `A family posing with thier heads against each other the wife holding the two year old between them.`,
        `A family holding hands raised in the air seven year olds in the middle, husband and wife on each end, on the beach, in siloutte at sunset.`,
        `Three teen sisters posing with the outer ones leaning thier heads on the middle's shoulders.`,
        `A father with his arm around his son looking at him while the sit crossways in a hammock.`
      ]
let slideshowIntervalID;

function fadeOut() {
  for(let i = 0; i < images.length; i++) {
    setTimeout(function() {
      images[i].style.opacity = 0;
    }, i * 200);
    setTimeout(function() {
      galleryName.style.opacity = 0;
    }, 3000)
  }
}

function fadeIn() {
  galleryName.style.opacity = 1;
  for(let i = 0; i < images.length; i++) {
    setTimeout(function() {
      images[i].style.opacity = 1;
    }, i * 200);
  }
}

function loadGallery(startingPic) {
  for(let i = 0; i < images.length; i++) {
    if(i+startingPic > 9) {
      imageLinks[i].href = `images/${i + startingPic}.jpg`;
      images[i].src = `images/${i + startingPic}_thumb.jpg`;
      images[i].alt = `${altTags[i + startingPic]}`;
    } else {
      imageLinks[i].href = `images/0${i + startingPic}.jpg`;
      images[i].src = `images/0${i + startingPic}_thumb.jpg`;
      images[i].alt = `${altTags[Math.floor(i + startingPic)]}`;
    }
  }
}

function changeGallery(startingPic, name) {
  fadeOut();
  setTimeout(function(){
    loadGallery(startingPic);
    galleryName.innerHTML = name;
  }, 3500);
  setTimeout(fadeIn, 4500);
} 

weddingsButton.addEventListener(`click`, ()=> {
  changeGallery(1, `Weddings`)
});

seniorsButton.addEventListener(`click`, ()=> {
  changeGallery(15, `Senoirs`);
});

babiesButton.addEventListener(`click`, ()=> {
  changeGallery(29, `Babies`);
});

familiesButton.addEventListener(`click`, ()=> {
  changeGallery(43, `Families`);
});

for(image of imageLinks) {
  image.addEventListener(`click`, function(event) {
    event.preventDefault();
    popupImage.src = `images/${this.childNodes[1].src.slice(-12, -10)}.jpg`;
    popupImage.alt = `${altTags[Math.floor(this.childNodes[1].src.slice(-12, -10))]}`;
    popup.classList.remove(`hidden`);
    x.focus();
  });
}

x.addEventListener(`click`, ()=> {
  popup.classList.add(`hidden`);
  stopSlideshow();
  stopButton.classList.add(`play-button`);
});
leftArrow.addEventListener(`click`, slideBackward);
rightArrow.addEventListener(`click`, slideForward);
stopButton.addEventListener(`click`, function() {
  stopButton.classList.toggle(`play-button`);
  if(stopButton.classList.contains(`play-button`)) {
    stopSlideshow();
  } else {
    slideshow();
  }
});

function slideForward() {
  let currentImgNum = Number(popupImage.src.slice(-6, -4));
  if(currentImgNum < 9){
    popupImage.src = `images/0${currentImgNum + 1}.jpg`;
    popupImage.alt = altTags[(currentImgNum + 1)];
  } else if (currentImgNum < 56) {
    popupImage.src = `images/${currentImgNum + 1}.jpg`;
    popupImage.alt = altTags[(currentImgNum + 1)];
  } else {
    popupImage.alt = altTags[(1)];
    popupImage.src = `images/01.jpg`;
  }
}

function slideBackward() {
  let currentImgNum = Number(popupImage.src.slice(-6, -4));
  if (currentImgNum === 1) {
    popupImage.src = `images/56.jpg`;
    popupImage.alt = altTags[(56)];
  } else if(currentImgNum < 10){
    popupImage.src = `images/0${currentImgNum - 1}.jpg`;
    popupImage.alt = altTags[(currentImgNum - 1)];
  } else {
    popupImage.src = `images/${currentImgNum - 1}.jpg`;  
    popupImage.alt = altTags[(currentImgNum - 1)];
  }
}

function slideshow() {
  slideForward();
  slideshowIntervalID = setInterval(slideForward, 2000);
}

function stopSlideshow() {
  clearInterval(slideshowIntervalID); 
}