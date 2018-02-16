const canvas = document.querySelector(`#game`);
const w = canvas.width;
const h = canvas.height;
const ctx = canvas.getContext(`2d`);

let GF = function() {
  const spritesImage = new Image();
  spritesImage.src=`assets/sprites.png`;
  const backImage = new Image();
  backImage.src = `assets/SpaceBackground1.png`;
//armada variables
  const enemyExplosionsArray = explosionSpriteArrayMaker(spritesImage, 1, 70, 30, 30, 8);
  let explosions = [];
  let armada = [];
  let enemyBullets = [];
  let armadaDirection, armadaShotTimeout, armadaBulletFrequency, enemyActiveSprite; 
  let bulletExplosions = [];
//game state variables
  let wave, lives, extraLivesCounter, dying;
  let opacity;
  //high score
  let score, highScores, place, initials;
//support variables  
  let gamepad;
  let delta, oldTime;
  //FPS Counter
  let frameCount, lastTime, diffTime, fps;
  const fpsContainer = document.querySelector(`#fpsContainer`);
  //Color Shift
  let g = 99;
  let b = 71;
  let colorShiftDirection = `forward`;
//Audio
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const actx = new AudioContext();
  const destination = actx.destination;
  let bgm;
  let sfx = [];
  let sfxurls = [
    `/assets/shot 1.mp3`,
    `/assets/shot2.mp3`,
    `/assets/Explosion 2.mp3`,
    `/assets/Explosion 4.mp3`,
    `/assets/Explosion 5.mp3`
  ]
  
  function getBGM() {
    bgm = actx.createBufferSource(); 
    fetch(`/assets/bgm.mp3`).then(function (response) {
      return response.arrayBuffer();
      }).then (function(buffer) {
        actx.decodeAudioData(buffer, function(decoded) {
          bgm.buffer = decoded;
          bgm.connect(destination);
          bgm.playbackRate.setValueAtTime(0.25, 0);
          bgm.loop = true;
          bgm.start(0);
        });
    });
  }
   
  function getSFX(urls) {
    for(let i = 0; i < urls.length; i++) {
      let myRequest = new Request(sfxurls[i]);
      fetch(myRequest).then(function (response) {
        return response.arrayBuffer();
        }).then (function(buffer) {
          actx.decodeAudioData(buffer, function(decoded) {
            sfx[i] = decoded;
          });
      });
    }
  }
  
  getSFX(sfxurls);
  
  function playSFX(svar) { 
    let bufferSource = actx.createBufferSource();
    bufferSource.buffer = svar;
    bufferSource.connect(destination);
    bufferSource.start(0);
   }
 
  let inputStates = {};
  
  let player = {
    x: 475,
    y: h - 70,
    w: 64,
    h: 46,
    speed: 200, 
    shotTimeout: false,
    bulletFrequency: 750,
    fire: function () {
      if(this.shotTimeout === true  ||  dying === true) {return}
      player.bulletArray.push(new Bullet(this.x + 26, this.y));
      playSFX(sfx[0]);
      this.shotTimeout = true;
      setTimeout(()=> {this.shotTimeout = false;}, this.bulletFrequency);
    },
    bulletArray: [],
    frames: spriteArrayMaker(spritesImage, 0, 130, 64, 46, 2),
    leftFrames: spriteArrayMaker(spritesImage, 128, 130, 64, 46, 2),
    rightFrames: spriteArrayMaker(spritesImage, 256, 130, 64, 46, 2),
    activeSprite: 0,
    explosionArray: explosionSpriteArrayMaker(spritesImage, 1, 1, 61, 67, 6),
    explosionCounter: 0,
    explosionMultiplier: 5,
    exploder: false,
    explode: function() {
      ctx.drawImage(...player.explosionArray
                  [Math.floor (this.explosionCounter / this.explosionMultiplier)], this.x, this.y, 60, 60);
    }
  }
  player.activeFrames = player.frames;
  
  class Enemy {
    constructor (x, y, hp = 1, speed = 50) {
      this.x = x,
      this.y = y,
      this.h = 48,
      this.w = 48,
      this.image = spritesImage,
      this.speed = speed,
      this.hp = hp,
      this.frames = spriteArrayMaker(spritesImage, 0, 230, 48, 48, 7)
    }
  }
  
  class Bullet {
    constructor(x, y, speed = 200)  {
      this.x = x;
      this.y = y;
      this.w = 13;
      this.h = 20;
      this.speed = speed;
      this.playerFrames = spriteArrayMaker(spritesImage, 0, 110, 10, 20, 7);
    }   
  }
  
  class EnemyBullet extends Bullet {
    constructor(x, y, speed) {
      super(x, y, w, h,),
      this.speed = speed,
      this.frames = spriteArrayMaker(spritesImage, 0, 180, 16, 40, 7)
    }
  }
  
  class EnemyExplosion {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.counter = 0;
      this.multiplier = 5;
      this.explode = function() {
        ctx.drawImage(...enemyExplosionsArray
                    [Math.floor (this.counter/this.multiplier)], this.x, this.y, 50, 50);
      }
    }
  }
  
  class BulletExplosion {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.bulletCollisionArray = explosionSpriteArrayMaker(spritesImage, 0, 280, 30, 30, 2);
      this.counter = 0;
      this.multiplier = 5;
      this.bulletCollision = function() {
      ctx.drawImage(...this.bulletCollisionArray
                  [Math.floor (this.counter / this.multiplier)], this.x, this.y, 20, 20);
      }
    }
  }
  
//  
//  
//  Sprites
//  
//  
  
  function spriteArrayMaker(image, x, y, w, h, numOfSprites) {
    let outputArray = [];
    for(let i = 0; i < numOfSprites; i++){
      let ox = x + w * i;
      outputArray.push([image, ox, y, w, h])
    }
    return outputArray;
  }
  
  function explosionSpriteArrayMaker(image, x, y, w, h, numOfSprites) {
    let outputArray = [];
    for(let i = 0; i < numOfSprites; i++){
      let ox = x + (w +1) * i;
      outputArray.push([image, ox, y, w, h])
    }
    return outputArray;
  }
  
  function enemySpriteAni() {
    if(enemyActiveSprite < 6) {
     enemyActiveSprite++; 
    } else {
      enemyActiveSprite = 0;
    }
    if(player.activeSprite === 0) {
      player.activeSprite++;
    } else {
      player.activeSprite--;
    }
  }
  
  function addEnemies(num) {
    let x = 300;
    let y = 100;
    let counter = 0;
    for(let i = 0; i < num; i++) {
      if(counter === 8 ) {
        y += 75;
        x = 300;
        counter = 0;
      }
      armada.push(new Enemy(x, y, 1, 50 +  wave * 10));
      x += 60;
      counter++;
    }
  }
  
//  
//  
//   Drawing
//  
//  
 
  function drawBackground() {
    ctx.drawImage(backImage, 0, 0, w, h);
  }
  
  function displayLives() {
    for(let i = 1; i <= lives; i++) {
      ctx.drawImage(spritesImage, 64, 130, 64, 46,
                    (20 + (35 * i)), h - 25, 30, 20 );
    }
  }
  
  function scoreBoard() {
    ctx.font = `32px Monoton`;
    ctx.fillStyle = `orange`;
    ctx.textAlign = `right`;
    ctx.fillText(score, w - 25, 30);
  }
  
  function drawPlayer() {
    ctx.drawImage(...player.activeFrames[player.activeSprite],
                  player.x, player.y, player.w, player.h);
  }
  
  function drawArmada() {
    for(let enemy of armada) {
      ctx.drawImage(...enemy.frames[enemyActiveSprite], enemy.x, enemy.y, enemy.w, enemy.h);
    }
  }
  
  function drawBullets() {
    if(!player.bulletArray[0]) return;
    let speed = calcMove(player.bulletArray[0].speed);
    for(let bullet of player.bulletArray) {
      if(bullet.y < 0) {
        removeElement(player.bulletArray, bullet);
      }
      bullet.y -= speed;
      ctx.drawImage(...bullet.playerFrames[enemyActiveSprite], 
                    bullet.x, bullet.y, bullet.w, bullet.h); 
    }
  } 
  
  function drawEnemyBullets() {
    if(!enemyBullets[0])return;
    let speed = calcMove(enemyBullets[0].speed);
    for(let bullet of enemyBullets) {
      if(bullet.y > h) {
        removeElement(enemyBullets, bullet);
      }
      bullet.y += speed;
      ctx.drawImage(...bullet.frames[enemyActiveSprite], bullet.x, bullet.y, bullet.w, bullet.h); 
    }
  }

  function drawExplosions() {
    if(!explosions[0]  && !bulletExplosions[0])return;
    if(explosions[0]) {  
      for(explosion of explosions) {
        if(explosion.counter < enemyExplosionsArray.length * explosion.multiplier) {
          explosion.explode();
          explosion.counter++;
        } else {
          removeElement(explosions, explosion);
        }
      }
    }
    if(bulletExplosions[0]) {  
      for(explosion of bulletExplosions) {
        if(explosion.counter < explosion.bulletCollisionArray.length * explosion.multiplier) {
          explosion.bulletCollision();
          explosion.counter++;
        } else {
          removeElement(bulletExplosions, explosion);
        }
      }
    }
  }
  
//  
//  
//Collisions
//  
//  
  
  function collisions() {
    playerHit();
    enemyHit();
    bulletsCollide();
    shipsCollide();
  }
  
  function playerHit() {
    for(let bullet of enemyBullets) {
      if(rectCollide(bullet.x, bullet.y, bullet.w, bullet.h, 
                     player.x, player.y, player.w, player.h)) {
        removeElement(enemyBullets, bullet);
        player.exploder = true;
        dying = true;
      }
    }
  }
  
  function enemyHit() {
    for(let bullet of player.bulletArray) {
      for(let enemy of armada) {
        if(rectCollide(bullet.x, bullet.y, bullet.w, bullet.h,
                      enemy.x, enemy.y, enemy.w, enemy.h)){
          removeElement(player.bulletArray, bullet);
          removeElement(armada, enemy);
          playSFX(sfx[3]);
          explosions.push(new EnemyExplosion(enemy.x, enemy.y));
          score += 1000;
        }
      }
    }
  }
  
  function bulletsCollide() {
    for(let bullet of player.bulletArray) {
      for(let enemyB of enemyBullets) {
        if(rectCollide(bullet.x, bullet.y, bullet.w, bullet.h,
                      enemyB.x, enemyB.y, enemyB.w, enemyB.h)){
          removeElement(player.bulletArray, bullet);
          removeElement(enemyBullets, enemyB);
          playSFX(sfx[4]);
          bulletExplosions.push(new BulletExplosion(bullet.x, bullet.y));
          score += 20;
        }
      }
    }
  }
  
  function shipsCollide() { 
    for(let enemy of armada) {
      if(rectCollide(enemy.x, enemy.y, enemy.w, enemy.h,
                    player.x, player.y, player.w, player.h)){
        removeElement(armada, enemy);
        playSFX(sfx[2]);
        playSFX(sfx[3]);
        dying = true;
      }
    }
  }
  
  function rectCollide(x1, y1, w1, h1, x2, y2, w2, h2) {
    if(x1 < x2 + w2 && 
       x1 + w1 > x2 && 
       y1 < y2 + h2  && 
       y1 + h1 > y2) {
      return true;
    } else {
      return false;
    }
  }
    
//  
//  
//Movement
//  
//  
  
  function movePlayer() {
    if (inputStates.left && player.x > 0 && dying === false) {
      player.x -= calcMove(player.speed);
      player.activeFrames = player.leftFrames;
    }
    if (inputStates.right && player.x < w - 75 && dying === false) {
      player.x += calcMove(player.speed);
      player.activeFrames = player.rightFrames;
    }
    if (inputStates.down || inputStates.up || inputStates.space) {
      player.fire();
    }
    if (!inputStates.left && !inputStates.right) {
      player.activeFrames = player.frames;
    }
  }  
  
  function moveArmada() {
    if(!armada[0])return;
    let speed = calcMove(armada[0].speed);
    for(let enemy of armada) {
      if(armadaDirection === `right`) {
        enemy.x += speed;
        if(enemy.x + 50 >= w) {
          armadaDirection = `left`;
          for(let enemy of armada) {
            enemy.y += 10;
          }
        } 
      } else if(armadaDirection === `left`) {
        enemy.x -= speed;
        if(enemy.x <= 0) {
          armadaDirection = `right`;
          for(let enemy of armada) {
            enemy.y += 10;
          }
        }
      }
      if(enemy.y > h) {
        removeElement(armada, enemy);
      }
    }
  } 
  
  function armadaFire() {
    if(armadaShotTimeout === true) {return}
    if(!armada[0]) {return}
    let shooter = armada[Math.floor(Math.random() * armada.length)];
    enemyBullets.push(new EnemyBullet(shooter.x + shooter.w/2, shooter.y + shooter.h, 50 + wave * 20));
    playSFX(sfx[1]);
    armadaShotTimeout = true;
    setTimeout(()=> {armadaShotTimeout = false;}, armadaBulletFrequency);
  }
  
//  
//  
//Dying
//  
//  
  
  function playerExplosion() {
    if(player.explosionCounter < player.explosionArray.length * player.explosionMultiplier) {
      drawBackground();
      player.explode();
      drawArmada();
      player.explosionCounter++;
      requestAnimationFrame(playerExplosion);
    } else {
      player.explosionCounter = 0;
      player.exploder = false;
      playerDeath();
    }
  }
  
  function playerDeath() {
    lives--;
    if(lives === 0){
      bgm.stop();
      gameOver();
    } else {
      deathFadeOut();
    }
  }
  
  function deathFadeOut() {
    if (opacity > .1) {
      ctx.globalAlpha = 1;
      drawBackground();
      moveArmada();
      drawArmada();
      ctx.globalAlpha = opacity;
      opacity -= .01;
      requestAnimationFrame(deathFadeOut);
    } else {
      player.x = 475;
      explosions = explosions.splice(0, -1);
      bulletExplosions = bulletExplosions.splice(0, -1);
      enemyBullets = enemyBullets.splice(0, -1);
      player.bulletArray = player.bulletArray.splice(0, -1);
      deathFadeIn();
    }
  }
  
  function deathFadeIn() {
    
    if (opacity < 1) {
      ctx.globalAlpha = 1;
      drawBackground();
      moveArmada();
      drawArmada();
      ctx.globalAlpha = opacity;
      movePlayer();
      drawPlayer();
      opacity += .005;
      player.x = 475;
      requestAnimationFrame(deathFadeIn);
    } else {
      dying = false;
      oldTime = undefined;
      requestAnimationFrame(mainLoop);
    }
  }
  
//   
//  
//High Scores
//  
//  
  
  if(localStorage.getItem(`highScores`)) {
    highScores = JSON.parse(localStorage.getItem(`highScores`));
  } else {
    highScores = [[1000, `RJG`], 
                    [900, `EEE`], 
                    [800, `VJG`], 
                    [700, `NSR`],
                    [600, `GJG`], 
                   [500, `EAM`], 
                   [400, `OJG`], 
                   [300, `TUE`], 
                   [200, `FJG`],
                   [100, `HCN`],]
  }

  function checkScore() { 
    if(score > highScores[9][0]) {
      place = 9;
      if(score > highScores[0][0]) {
        place = 0;
      } else {
        for(let i = 8; score > highScores[i][0]; i--) {
          place--;
        }
      }
      enterInitials();
    } else {
      attractScreen();
    }
  }
  
  function enterInitials() {
    let done = false;
    let count = 1000;
    let input = document.querySelector(`input`);
    input.classList.remove(`hidden`);
    input.focus();
    window.addEventListener(`keydown`, function(event){
      if(event.keyCode === 13) {
        done = true;
      }
    });
    requestAnimationFrame(countDown);
    function countDown() {
      drawBackground();
      ctx.font = `64px Monoton`;
      ctx.fillStyle = `orange`;
      ctx.textAlign = `center`;
      ctx.fillText(`Enter Initials`, 500, 100);
      ctx.font = `128px Monoton`;
      ctx.fillText((count / 100).toFixed(), 500, 250);
      count -= 1;
      if (done === true || count === 0) {
        initials = input.value.toUpperCase();
        input.classList.add('hidden');
        storeScore();
        return;
      }
      requestAnimationFrame(countDown);
    }
  }
  
  function storeScore() {
      highScores.splice(place, 0, [score, initials]);
      highScores.pop();
      localStorage.setItem(`highScores`,  JSON.stringify(highScores));
      displayHighScores();
  }
  
  function displayHighScores() {
    drawBackground();
    ctx.font = `64px Monoton`;
    ctx.fillStyle = `orange`;
    ctx.textAlign = `center`;
    ctx.fillText(`High Scores`, 500, 100);
    ctx.font = `32px Monoton`;
    let row = 200;
    for(let score of highScores) {
      ctx.textAlign = `left`;
      ctx.fillText(score[1], 350, row);
      ctx.textAlign = `right`;
      ctx.fillText(score[0], 650, row);
      row += 40;
    }
    setTimeout(function() {
      attractScreen();
      return;
    }, 3000);
  }
  
  function checkExtraLives() {
    if(score > 25000 && extraLivesCounter < 1) {
      lives++;
      extraLivesCounter++;
    }
    if(score > 50000 && extraLivesCounter < 2) {
      lives++;
      extraLivesCounter++;
    }
    if(score > 75000 && extraLivesCounter < 3) {
      lives++;
      extraLivesCounter++;
    }
    if(score > 100000 && extraLivesCounter < 4) {
      lives += 2;
      extraLivesCounter++;
    }
    if(score > 250000 && extraLivesCounter < 5) {
      lives += 3;
      extraLivesCounter++;
    }
    if(score > 1000000 && extraLivesCounter < 6) {
      lives += 5;
      extraLivesCounter++;
    }
  }
  
//  
//  
//Support
//  
//  
  
  function removeElement(array, element) {
    const index = array.indexOf(element)
    if(index !== -1) {
      array.splice(index, 1);
    }
  }
  
  let measureFPS = function(newTime) {
    if(lastTime === undefined) {
      lastTime = newTime;
      return;
    }
    
    diffTime = newTime - lastTime;
  
    if(diffTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = newTime;
    }
  
    fpsContainer.innerHTML = `FPS: ${fps} Player.x: ${player.x}`;
    frameCount++;
  }
  
  function timer(currentTime) {
    if(oldTime === undefined){
      oldTime = currentTime;
    }
    delta = currentTime - oldTime;
    oldTime = currentTime;
  }
  
  let calcMove = function (speed) {
    return (speed * delta) / 1000;
  }
  
  function scangamepads() {
    let gamepads = navigator.getGamepads();
    if(!gamepads) return;
    for(let i = 0; i< gamepads.length; i++) {
      if(gamepads[i]) {
        gamepad = gamepads[i];
      }
    }
  }
  function checkButtons(gamepad) {
    if(gamepad === undefined) return;
    if(!gamepad.connected) return;
      let x = gamepad.buttons[0];
      if(x.pressed) {
        player.fire();
    }
  }
    
  function checkAxes(gamepad) {
    if(gamepad === undefined) return;
    if(!gamepad.connected) return; 
    if(gamepad.axes[0] > 0.25) {
      inputStates.right = true;
      inputStates.left = false;
    } else if(gamepad.axes[0] < -0.25) {
      inputStates.right = false;
      inputStates.left = true;
    } else if(gamepad.axes[0] > -0.25 && gamepad.axes[0] < 0.25) {
      inputStates.right = false;
      inputStates.left = false;
    }

    if(gamepad.axes[1] > 0.25) {
      inputStates.down = true;
      inputStates.up = false;
    } else if(gamepad.axes[1] < -0.25) {
      inputStates.down = false;
      inputStates.up = true;
    } else if(gamepad.axes[1] > -0.25 && gamepad.axes[1] < 0.25) {
      inputStates.down = false;
      inputStates.up = false;
    }
  }
  function updateGamePadStatus() {
    if(navigator.getGamepads()[0] === null) return;
    scangamepads();
    checkButtons(gamepad);
    checkAxes(gamepad);
  }
  
  function colorShift() {
    if(colorShiftDirection === `forward`) {
      g += 2;
      b -= 1;
      if(b <= 0) {
        colorShiftDirection = `reverse`;
      }
    }
    if(colorShiftDirection === `reverse`) {
      g -= 2;
      b += 1;
      if(b >= 71){
        colorShiftDirection = 'forward';
      }
    }
  }
  
//  
//  
//Loops
//  
//  
  
  function titleScreen() {
    drawBackground();
    ctx.font = `64px Monoton`;
    ctx.fillStyle = `orange`;
    ctx.textAlign = `center`;
    ctx.fillText(`Attack of the`, 500, 100); 
    ctx.fillText(`Saucer Men`, 500, 200); 
    ctx.font = `32px Monoton`;
    ctx.fillStyle = `rgb(255, ${g}, ${b})`;
    ctx.fillText(`Press Fire To Start`, 500, 450);
    colorShift();
  }
  
  function attractScreen() {
    titleScreen();
    if(inputStates.space === true) {
      newGame();
      return;
    }
    requestAnimationFrame(attractScreen);
  }
  
  function fadeIn() {
    if (opacity < 1) {
      ctx.globalAlpha = 1;
      drawBackground();
      ctx.globalAlpha = opacity;
      drawArmada();
      drawPlayer();
      ctx.font = `64px Monoton`;
      ctx.fillStyle = `orange`;
      ctx.textAlign = `center`;
      ctx.fillText(`Wave ${wave}`, 500, 300);
      opacity += .005;
      requestAnimationFrame(fadeIn);
    } else {
      requestAnimationFrame(mainLoop);
    }
  }
   
  let mainLoop = function(time) {
    timer(time); 
    if(!armada[0]) {
      fadeOut();
      return;
    }
    if(player.exploder === true) {
      playSFX(sfx[2]);
      playerExplosion();
      return;
    }
    drawBackground();
    measureFPS(time);
    displayLives();
    drawPlayer();
    drawBullets();
    drawArmada(); 
    drawEnemyBullets();
    collisions();
    movePlayer();
    moveArmada();
    drawExplosions();
    armadaFire();
    scoreBoard();
    checkExtraLives();
    updateGamePadStatus();
    requestAnimationFrame(mainLoop);
  } 

  function fadeOut() {
    if (opacity > .1) {
      ctx.globalAlpha = 1;
      drawBackground();
      ctx.globalAlpha = opacity;
      drawArmada();
      drawPlayer();
      opacity -= .01;
      requestAnimationFrame(fadeOut);
    } else {
      nextWave();
    }
  }
  
  function nextWave() {
    wave++;
    sharedReset();
  }
  
  function sharedReset() {
    player.x = 475;
    explosions = explosions.splice(0, -1);
    player.bulletArray = player.bulletArray.splice(0, -1);
    armada = armada.splice(0, -1);
    enemyBullets = enemyBullets.splice(0, -1);
    lastTime = undefined;
    delta = 0;
    diffTime = 0;
    oldTime = undefined;   
    armadaDirection = `right`;
    armadaShotTimeout = false;
    if(wave < 200) {
      armadaBulletFrequency = 2000 - wave * 10;
    } else {armadaBulletFrequency = 0;}
    frameCount = 0;
    enemyActiveSprite = 0;
    player.activeSprite = 0;
    addEnemies(32);
    opacity = .01;
    fadeIn();
  }
  
  function newGame() {
    dying = false;
    wave = 1 ;
    extraLivesCounter = 0;
    lives = 2;
    score = 0;
    console.log(sfx[0]);
    getBGM();
    sharedReset();
  }
  
  function gameOver() {
    if (opacity > .1) {
      ctx.globalAlpha = 1;
      drawBackground();
      ctx.globalAlpha = opacity;
      drawArmada();
      opacity -= .01;
      requestAnimationFrame(gameOver);
    } else {
      gameOver2();
    }
  }
  function gameOver2() {
    if (opacity < 1) {
      ctx.globalAlpha = 1;
      drawBackground();
      ctx.globalAlpha = opacity;
      ctx.font = `128px Monoton`;
      ctx.fillStyle = `orange`;
      ctx.textAlign = `center`;
      ctx.fillText(`GAME`, 500, 300);
      ctx.fillText(`OVER`, 500, 450);
      opacity += .005;
      requestAnimationFrame(gameOver2);
    } else {
      checkScore();
    }
  }
  
  let start = function () {
    window.addEventListener(`keydown`, function(event){
      if(event.keyCode === 37) {
        inputStates.left = true;
      } else if(event.keyCode === 38) {
        inputStates.up = true;
      } else if(event.keyCode === 39) {
        inputStates.right = true;
      } else if(event.keyCode === 40) {
        inputStates.down = true;
      } else if(event.keyCode === 32) {
        inputStates.space = true;
      } 
    });
    window.addEventListener(`keyup`, function(event){
      if(event.keyCode === 37) {
        inputStates.left = false;
      } else if(event.keyCode === 38) {
        inputStates.up = false;
      } else if(event.keyCode === 39) {
        inputStates.right = false;
      } else if(event.keyCode === 40) {
        inputStates.down = false;
      } else if(event.keyCode === 32) {
        inputStates.space = false;
      } 
    });
    setInterval(enemySpriteAni, 250);
    requestAnimationFrame(attractScreen);
  };
  
  return {
    start: start,
  }
}

let game = new GF();
setTimeout(game.start, 500);