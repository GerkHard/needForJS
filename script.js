const gameScore = document.querySelector('.score'),
   btnStart = document.querySelector('.start'),
   gameArea = document.querySelector('.gameArea'),
   playerUnit = document.createElement('div');

const controlKeys = {
   ArrowUp: false,
   ArrowDown: false,
   ArrowRight: false,
   ArrowLeft: false
};

const setOptions = {
   start: false,
   score: 0,
   speed: 3
};

playerUnit.classList.add('playerUnit');

btnStart.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startGame() {
   btnStart.classList.add('hide');
   gameArea.append(playerUnit);
   setOptions.start = true;
   requestAnimationFrame(playGame);
}

function playGame() {
   console.log('Play Game');
   if (setOptions.start) {
      requestAnimationFrame(playGame);
   }
}

function startRun(event) {
   event.preventDefault();
   controlKeys[event.key] = true;
   console.log(controlKeys);
}

function stopRun(event) {
   event.preventDefault();
   controlKeys[event.key] = false;
   console.log(controlKeys); 
}

//console.dir(btnStart);