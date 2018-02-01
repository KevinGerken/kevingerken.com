//window.onload = function () {

  const timeDisplay = document.querySelector(`.timeDisplay`);
  const start = document.querySelector(`.start`);
  const stop = document.querySelector(`.stop`);
  const reset = document.querySelector(`.reset`);
  const log = document.querySelector(`.paper`);
  const logBook = document.querySelector(`.logBook`);
  let counter = 0;
  let time;
  let h = 0;
  let m = 0;
  let mt = 0;
  let s = 0;
  
  
  start.addEventListener(`click`, startClock);
  stop.addEventListener(`click`, stopClock);
  reset.addEventListener(`click`, resetClock);
  log.addEventListener(`click`, logTime);
  
  function startClock() {
    time = setInterval(function() {
      counter++;
      timeDisplay.innerHTML = counterDisplay();
    }, 10);
    start.removeEventListener(`click`, startClock);
  }
  
  function stopClock() {
    clearInterval(time);
    start.addEventListener(`click`, startClock);
  }
  
  function resetClock() {
    counter = 0;
    s = 0;
    m = 0;
    mt = 0;
    h = 0;
    timeDisplay.innerHTML = counterDisplay();
  }
  
  function logTime() {
    logBook.innerHTML += `<p>${counterDisplay()}</p><hr>`
  }
  
  function counterDisplay() {
    if(counter === 1000) {
      counter = 0;
      s++;
    }
    if(s === 6) {
      s = 0;
      m++;
    }
    if(m === 10) {
      m = 0;
      mt++
    }
    if(mt === 6) {
      mt = 0;
      h++;
    }
    return `${h}:${mt}${m}:${s}${(counter / 100).toFixed(2)}`;
  }
  
//}