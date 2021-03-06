let GF = function() {
  const canvas = document.querySelector(`#game`);
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext(`2d`);
  const backImage = new Image();
  const spritesImage = new Image(); 
  const waveMultiplier = 30;
//armada variables
  const enemyExplosionsArray = spriteArrayMaker(spritesImage, 1, 70, 30, 30, 8, true);
  let explosions = [];
  let armada = [];
  let enemyBullets = [];
  let armadaDirection, armadaShotTimeout, armadaBulletFrequency, enemyActiveSprite, kamikazeTimeout, kamikazeFrequency; 
  let bulletExplosions = [];
//game state variables
  let wave, lives, extraLivesCounter, dying;
  let opacity;
  let rotationDegree = 1;
  let lastEnemy = false;
  let frameCount = 1;
  const joystick = document.querySelector(`.joystick`) || null;
  const buttonA = document.querySelector(`.button`) || null;
//  
//  
//  Sprites
//  
//  
  
  function spriteArrayMaker(image, x, y, w, h, numOfSprites, explosion = false) {
    let outputArray = [];
    for(let i = 0; i < numOfSprites; i++){
      let ox = x + w * i;
      if(explosion) ox = x + (w + 1) * i;
      outputArray.push([image, ox, y, w, h])
    }
    return outputArray;
  }
  
  function spriteAnimation() {
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
      armada.push(new Enemy(x, y, 1, 50 +  wave * waveMultiplier));
      x += 60;
      counter++;
    }
  }
  
//
//
//Objects
//
//  
  const player = {
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
    explosionArray: spriteArrayMaker(spritesImage, 1, 1, 61, 67, 6, true),
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
      this.frames = spriteArrayMaker(spritesImage, 0, 230, 48, 48, 7),
      this.kamikaze = false,
      this.rotation = false
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
      super(x, y, speed, w, h),
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
      this.bulletCollisionArray = spriteArrayMaker(spritesImage, 0, 280, 30, 30, 2, true);
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
    if(rotationDegree > 360) rotationDegree -= 360;
    rotationDegree += 5; 
    for(let enemy of armada) {
        if(enemy.rotation === true) {
        ctx.save();
        let horizontalCenter = (enemy.x + 24);
        let verticalCenter = (enemy.y + 24);
        ctx.translate(horizontalCenter, verticalCenter);
        ctx.rotate(rotationDegree * Math.PI / 180);
        ctx.translate(-horizontalCenter, -verticalCenter);
        ctx.drawImage(...enemy.frames[enemyActiveSprite], enemy.x, enemy.y, enemy.w, enemy.h);
        ctx.restore();
      } else {
        ctx.drawImage(...enemy.frames[enemyActiveSprite], enemy.x, enemy.y, enemy.w, enemy.h);
      }
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
      if(rectCollide(bullet, player)) {
        removeElement(enemyBullets, bullet);
        player.exploder = true;
        dying = true;
      }
    }
  }
  
  function enemyHit() {
    for(let bullet of player.bulletArray) {
      for(let enemy of armada) {
        if(rectCollide(bullet, enemy)){
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
        if(rectCollide(bullet, enemyB)){
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
      if(rectCollide(enemy, player)){
        removeElement(armada, enemy);
        playSFX(sfx[2]);
        playSFX(sfx[3]);
        player.exploder = true;
        dying = true;
      }
    }
  }
  
  function rectCollide(firstObj, secondObj) {
    if(firstObj.x < secondObj.x + secondObj.w && 
       firstObj.x + firstObj.w > secondObj.x && 
       firstObj.y < secondObj.y + secondObj.h  && 
       firstObj.y + firstObj.h > secondObj.y) {
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
      if(joystick) joystick.classList.add(`left`);
    }
    if (inputStates.right && player.x < w - 75 && dying === false) {
      player.x += calcMove(player.speed);
      player.activeFrames = player.rightFrames;
      if(joystick) joystick.classList.add(`right`);
    }
    if (inputStates.down || inputStates.up || inputStates.space) {
      buttonA.style.background = `pink`;
      player.fire();
    } else {
      buttonA.style.background = `red`;
    }
    if (!inputStates.left && !inputStates.right) {
      player.activeFrames = player.frames;
      if(joystick) joystick.classList.remove(`left`);
      if(joystick) joystick.classList.remove(`right`);
    }
  }  
  
  function moveArmada() {
    if(!armada[0])return;
    let speed = calcMove(armada[0].speed);
    for(let enemy of armada) {
      if(enemy.kamikaze) {
        kamikazeMovement(enemy, speed);
      } else if(armadaDirection === `right`) {
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
  
  function kamikazeMovement(enemy, speed) {
    speed = speed * 2;
    enemy.y += speed;
    if(enemy.x > player.x) {
      enemy.x -= speed;
    } else {
      enemy.x += speed;
    }
  }
  
  function armadaFire() {
    if(armadaShotTimeout === true) {return}
    if(!armada[0]) {return}
    let shooter = armada[Math.floor(Math.random() * armada.length)];
    enemyBullets.push(new EnemyBullet(shooter.x + shooter.w/2, shooter.y + shooter.h, 50 + wave * waveMultiplier));
    playSFX(sfx[1]);
    armadaShotTimeout = true;
    setTimeout(()=> {armadaShotTimeout = false;}, armadaBulletFrequency);
  }
  
  function kamikazeAttack() {
    if(kamikazeTimeout === true) {return}
    if(!armada[4]) {return}
    let kamikaze = armada[Math.floor(Math.random() * armada.length)]
    setTimeout(() => {kamikaze.kamikaze = true}, 1000);
    kamikaze.rotation = true;
    kamikazeTimeout = true;
    setTimeout(()=> {kamikazeTimeout = false;}, kamikazeFrequency);
  }
  
  function enemyAttacks() {
    armadaFire();
    kamikazeAttack();
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
  let score, highScores, place, initials;
  
  if(localStorage.getItem(`highScores`)) {
    highScores = JSON.parse(localStorage.getItem(`highScores`));
  } else {
    highScores = [[200000, `RJG`], 
                  [150000, `EEE`], 
                  [125000, `VJG`], 
                  [100000, `NSR`],
                  [75000, `GJG`], 
                  [50000, `EAM`], 
                  [40000, `OJG`], 
                  [30000, `TUE`], 
                  [20000, `FJG`],
                  [10000, `HCN`],]
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
      displayHighScores();
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
    setTimeout(() => {attractScreen()}, 3000);
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
//  Assets
//  
//  
  
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const actx = new AudioContext();
  const destination = actx.destination;
  let bgm ;
  let bgmSpeed = .25;
  const sfx = [];

  function getBGM() {
    bgm = actx.createBufferSource(); 
    fetch(`assets/bgm.mp3`).then(function (response) {
      return response.arrayBuffer();
      }).then (function(buffer) {
        actx.decodeAudioData(buffer, function(decoded) {
          bgm.buffer = decoded;
          bgm.connect(destination);
          bgm.playbackRate.setValueAtTime(bgmSpeed, 0);
          bgm.loop = true;
          bgm.start(0);
        });
    });
  }
   
  function getSFX() {
    const sfxurls = [
      `assets/shot 1.mp3`,
      `assets/shot2.mp3`,
      `assets/Explosion 2.mp3`,
      `assets/Explosion 4.mp3`,
      `assets/Explosion 5.mp3`
    ]
    for(let i = 0; i < sfxurls.length; i++) {
      const myRequest = new Request(sfxurls[i]);
      fetch(myRequest).then(function (response) {
        return response.arrayBuffer();
        }).then (function(buffer) {
          actx.decodeAudioData(buffer, function(decoded) {
            sfx[i] = decoded;
          });
      });
    }
  }
  
  function playSFX(svar) { 
    const bufferSource = actx.createBufferSource();
    bufferSource.buffer = svar;
    bufferSource.connect(destination);
    bufferSource.start(0);
   }
  
  function fetchAssets() { 
    getSFX();
    spritesImage.src=`assets/sprites.png`;
    backImage.src = `assets/SpaceBackground1.png`;
    start();
  }
  
//  
//  
//Support
//  
//  
  let gamepad;
  let delta, oldTime;
  let inputStates = {};
  function removeElement(array, element) {
    const index = array.indexOf(element)
    if(index !== -1) {
      array.splice(index, 1);
    }
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
  
  let g = 99;
  let b = 71;
  let colorShiftDirection = `forward`;
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
  function attractScreen() {
    titleScreen();
    if(inputStates.space === true) {
      newGame();
      return;
    }
    requestAnimationFrame(attractScreen);
  }
  
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
      setTimeout(() => {kamikazeTimeout = false}, kamikazeFrequency);
      requestAnimationFrame(mainLoop);
    }
  }
   
  let mainLoop = function(time) {
    timer(time); 
    if(armada.length === 1 && !lastEnemy) {
      armada[0].speed *= 3; 
      lastEnemy = true;
    }
    if(!armada[0]) {
      lastEnemy = false;
      fadeOut();
      return;
    }
    if(player.exploder === true) {
      playSFX(sfx[2]);
      playerExplosion();
      if(joystick) joystick.classList.remove(`left`);
      if(joystick) joystick.classList.remove(`right`);
      return;
    }
    frameCount++;
    if(frameCount >= 15) {
      spriteAnimation();
      frameCount = 0;
    }
    drawBackground();
    displayLives();
    drawPlayer();
    drawBullets(); 
    drawArmada(); 
    drawEnemyBullets();
    collisions();
    movePlayer();
    moveArmada();
    drawExplosions();
    enemyAttacks();
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
    bgmSpeed = bgmSpeed + .1;
    bgm.playbackRate.setValueAtTime(bgmSpeed, 0);
    sharedReset();
  }
  
  function sharedReset() {
    player.x = 475;
    explosions = explosions.splice(0, -1);
    player.bulletArray = player.bulletArray.splice(0, -1);
    armada = armada.splice(0, -1);
    enemyBullets = enemyBullets.splice(0, -1);
    delta = 0;
    oldTime = undefined;   
    armadaDirection = `right`;
    armadaShotTimeout = false;
    kamikazeTimeout = true;
    if(wave < 200) {
      armadaBulletFrequency = 2000 - wave * 30;
      kamikazeFrequency = 10000;
    } else {armadaBulletFrequency = 0;}
    enemyActiveSprite = 0;
    player.activeSprite = 0;
    addEnemies(32);
    opacity = .01;
    fadeIn();
  }
  
  function newGame() {
    bgmSpeed = .25;
    dying = false;
    wave = 1;
    extraLivesCounter = 0;
    lives = 2;
    score = 0;
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
  
  const start = function () {
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
        event.preventDefault();
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
    requestAnimationFrame(attractScreen);
  };
  
  return {
    start: fetchAssets,
  }
}

let game = new GF();
game.start();

const cabinetSheet = document.querySelector(`#cabinetSheet`);
const baseSheet = document.querySelector(`#baseStyles`);
//const touchSheet = document.querySelector(`#touch`);
//touchSheet.disabled = true;

function cabinetToggle() {
  const link = document.querySelector(`#cabinetToggleLink`);
  if(cabinetSheet.disabled === true) {
    addCabinet(cabinetSheet, link);
  } else {
    removeCabinet(cabinetSheet, link);
  }
}

function removeCabinet(sheet, link) {
  link.innerHTML = `Add Cabinet`;
  sheet.disabled = true;
}

function addCabinet(sheet, link) {
  link.innerHTML = `Remove Cabinet`;
  sheet.disabled = false;
}

window.addEventListener(`touchstart`, function() {
  cabinetSheet.disabled = true;
  baseSheet.disabled = true;
  touchSheet.disabled = false;
});