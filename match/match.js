const canvas = document.querySelector(`canvas`),
      w = canvas.width,
      h = canvas.height,
      ctx = canvas.getContext(`2d`),
      button = document.querySelector(`button`),
      scoreDisplay = document.getElementById(`score`);
      backImg = new Image();

let faces = ['./images/1.jpg', './images/1.jpg', './images/2.jpg', './images/2.jpg', './images/3.jpg', './images/3.jpg', './images/4.jpg', './images/4.jpg', './images/5.jpg', './images/5.jpg',],
    cards = [],
    clickCount = 0,
    score = 0,
    resetTimeout,
    margin = 10;
    selectedCards = {
      card1: 0,
      card2: 0,
    };

backImg.src = `./images/back.jpg`;

class Card {
  constructor(faceImg) {
    this.face = new Image(),
    this.face.src = faceImg,
    this.back = backImg,
    this.active = this.back;
    this.x = 0,
    this.y = 0,
    this.w = 200,
    this.h = 200,
    this.clicked = false,
    this.matched = false
  }
}

button.addEventListener(`click`, newGame);

function newGame() {
  cards = [];
  faces = shuffle(faces);
  for(face of faces) {
    cards.push(new Card(face));
  }
  clickCount = 0;
  selectedCards.card1 = 0;
  selectedCards.card2 = 0;
  score = 0;
  draw();
}
  
canvas.addEventListener(`click`, (event) => {
  cardReset();
  clearTimeout(resetTimeout);
  const mousePos = {
    x: (event.pageX - canvas.offsetLeft) * w / canvas.clientWidth,
    y: (event.pageY - canvas.offsetTop) * h / canvas.clientHeight
  }
  clickCheck(mousePos);
});

function draw() {
  for(let i = 0; i < cards.length; i++) {
    let w = cards[i].w;
    let h = cards[i].h;
    if(i < 3){
      ctx.drawImage(cards[i].active, (w + margin) * i + 140, 0, w, h);
      cards[i].x = (w + margin) * i + 140;
    } else if(i < 7) {
      ctx.drawImage(cards[i].active, (w + margin) * (i - 3) + 35, h + margin, w, h);
      cards[i].x = (w + margin) * (i - 3) + 35;
      cards[i].y = h + margin;
    } else {
      ctx.drawImage(cards[i].active, (w + margin) * (i - 7) + 140, (h + margin) * 2, w, h);
      cards[i].x = (w + margin) * (i - 7) + 140;
      cards[i].y = (h + margin) * 2;
    }
  }
}

function clickCheck(mousePos) {
  for(card of cards) {
    if(mousePos.x > card.x &&
      mousePos.x < (card.x + card.w)&&
      mousePos.y > card.y &&
      mousePos.y < (card.y + card.h) &&
       card.clicked === false) {
      flip(card);
      compareCards(card);
    }
  }
}

function flip(card) {
  card.clicked = true;
  card.active = card.face;
  clickCount++;
  score++;
  scoreDisplay.innerHTML = score;
  draw();
}

function compareCards(card) {
  if(selectedCards.card1 === 0) {
    selectedCards.card1 = card;
  } else {
    selectedCards.card2 = card;
    if (selectedCards.card1.face.src === selectedCards.card2.face.src) {
      selectedCards.card1.matched = true;
      selectedCards.card2.matched = true;
      cardReset();
    } else {
      resetTimeout = setTimeout(cardReset, 2000);
    }
  }
}

function cardReset() {
  if(clickCount >= 2) {
    for(card of cards){
      if (card.matched === false) {
        card.active = card.back;
        card.clicked = false;
      }
    }
    selectedCards.card1 = 0;
    selectedCards.card2 = 0;
    clickCount = 0;
    draw();
  }
}

function shuffle(arr){
  arr.sort(() =>  .5 - Math.random());
  arr.sort(() =>  .5 - Math.random());
  return arr.sort(() =>  .5 - Math.random());
}

document.body.onload = function() {newGame();}