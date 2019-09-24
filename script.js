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
   speed: 3,
   traffic: 3
};

playerUnit.classList.add('playerUnit');

btnStart.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

function startGame() {
   btnStart.classList.add('hide');

   // create line marking
   for (let i = 0; i < getQuantityElements(100); i++) {
      const line = document.createElement('div');
      line.classList.add('gameArea__line');
      line.y = i * 100;
      line.style.top = line.y + 'px';
      gameArea.append(line); // оптимизировать, чтобы было одно обращение к Dom в финале
   }

   // create anemy bot units
   for (let i = 1; i <= getQuantityElements(100 * setOptions.traffic); i++) { // более универсальный вариант без зависимости от 100 (размера юнита)
      const botUnit = document.createElement('div');
      botUnit.classList.add('botUnit');
      botUnit.y = -100 * setOptions.traffic * i; // более универсальный вариант без зависимости от 100 (размера юнита)
      botUnit.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - botUnit.offsetWidth)) + 'px';
      botUnit.style.top = botUnit.y + 'px';
      botUnit.style.backgroundImage = 'url(\'./img/enemy_unit_2.png\')';
      gameArea.append(botUnit);
   }

   setOptions.start = true;
   gameArea.append(playerUnit);
   setOptions.x = playerUnit.offsetLeft; // получаем положение автомобиля начальное;
   setOptions.y = playerUnit.offsetTop;
   requestAnimationFrame(playGame);
}

function playGame() {
   if (setOptions.start) {
      moveRoad();
      moveBotUnit();
      if (controlKeys.ArrowLeft && setOptions.x > 0) {
         setOptions.x -= setOptions.speed;
      }
      if (controlKeys.ArrowRight && setOptions.x < (gameArea.offsetWidth - playerUnit.offsetWidth)) {
         setOptions.x += setOptions.speed;
      }
      if (controlKeys.ArrowDown && setOptions.y < (gameArea.offsetHeight - playerUnit.offsetHeight)) {
         setOptions.y += setOptions.speed;
      }
      if (controlKeys.ArrowUp && setOptions.y > 0) {
         setOptions.y -= setOptions.speed;
      }

      playerUnit.style.left = setOptions.x + 'px';
      playerUnit.style.top = setOptions.y + 'px';

      requestAnimationFrame(playGame);
   }
}

function startRun(event) {
   event.preventDefault();
   controlKeys[event.key] = true;
   //console.log(controlKeys);
}

function stopRun(event) {
   event.preventDefault();
   controlKeys[event.key] = false;
   //console.log(controlKeys); 
}

function moveRoad() {
   let lines = document.querySelectorAll('.gameArea__line'); // зачем каждый раз получать все линии? Может достаточно как то с объектом будет работать?
   lines.forEach(line => {
      line.y += setOptions.speed;
      line.style.top = line.y + 'px';

      if (line.y >= document.documentElement.clientHeight) {
         line.y = -100;
      }
   });
}

function moveBotUnit() {
   let botUnits = document.querySelectorAll('.botUnit');
   botUnits.forEach(bot => {
      bot.y += setOptions.speed / 2;
      bot.style.top = bot.y + 'px';
      if (bot.y >= document.documentElement.clientHeight) {
         bot.y = -100 * setOptions.traffic;
         bot.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      }
   });
}

function getQuantityElements(heightElement) {
   return document.documentElement.clientHeight / heightElement + 1;
}
