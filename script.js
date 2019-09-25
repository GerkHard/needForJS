const gameScore = document.querySelector('.score'),
   btnStart = document.querySelector('.start'),
   gameArea = document.querySelector('.gameArea'),
   playerUnit = document.createElement('div'),
   //music = document.createElement('audio');
   music = document.createElement('embed');

//music.setAttribute('autoplay', true);
//music.setAttribute('src', './audio.mp3');
//music.setAttribute('controls', true);
music.setAttribute('src', './audio.mp3');
music.setAttribute('type', 'audio/mp3');
music.classList.add('music');

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
   gameArea.innerHTML = ''; // рассчищаем наше поле игровое перед стартом игры
   
   // create line marking
   for (let i = 0; i < getQuantityElements(100) + 1; i++) { // зачем тут добавили +1
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
      let botImg = Math.floor(Math.random() * 2) + 1; // ? разобраться с этим вопросом!!!
      console.log(botImg);
      botUnit.style.backgroundImage = `url(\'./img/enemy_unit_${botImg}.png\')`;
      gameArea.append(botUnit);
   }

   setOptions.score = 0;
   setOptions.start = true;
   gameArea.append(playerUnit);
   // задаем юниту игрока начальные позиции на старте
   playerUnit.style.left = (gameArea.offsetWidth/2 - playerUnit.offsetWidth/2) + 'px';
   playerUnit.style.top = 'auto';
   playerUnit.style.bottom = '25px';

   gameArea.append(music);

   setOptions.x = playerUnit.offsetLeft; // получаем положение автомобиля начальное;
   setOptions.y = playerUnit.offsetTop;
   requestAnimationFrame(playGame);

   /*setTimeout(() => {
      setOptions.start = false;
   }, 10000);*/
}

function playGame() {
   if (setOptions.start) {
      setOptions.score += setOptions.speed;
      gameScore.textContent = 'SCORE: ' + setOptions.score; // оптимизировать, чтоб текст каждый раз не выводить
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
   } else {
      music.remove();
   }
}

function startRun(event) {
   event.preventDefault();
   if (controlKeys.hasOwnProperty(event.key)) { // разобраться с этой логикой
      controlKeys[event.key] = true;
   }

   /*if (event.key in controlKeys) { // второй способ. но более затратный так как if in будет искать эти свойства/конпки во всей ветке, не только в объекте, но и его прототипе
      controlKeys[event.key] = true;
   }*/
   //console.log(controlKeys);
}

function stopRun(event) {
   event.preventDefault();
   if (controlKeys.hasOwnProperty(event.key)) { // разобраться с этой логикой
      controlKeys[event.key] = false;
   }
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
      let playerUnitDimensions = playerUnit.getBoundingClientRect();
      let botUnitDimensions = bot.getBoundingClientRect();

      if (playerUnitDimensions.top <= botUnitDimensions.bottom &&
         playerUnitDimensions.right >= botUnitDimensions.left &&
         playerUnitDimensions.left <= botUnitDimensions.right &&
         playerUnitDimensions.bottom >= botUnitDimensions.top) {
            setOptions.start = false;
            console.warn('ДТП');
            btnStart.classList.remove('hide');
            btnStart.style.top = gameScore.offsetHeight + 'px';

      }

      bot.y += setOptions.speed / 2;
      bot.style.top = bot.y + 'px';
      if (bot.y >= document.documentElement.clientHeight) {
         bot.y = -100 * setOptions.traffic;
         bot.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      }
   });
}

function getQuantityElements(heightElement) {
   //return document.documentElement.clientHeight / heightElement + 1;
   return Math.ceil(gameArea.offsetHeight / heightElement); // разобраться !!!
}
