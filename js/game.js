let canvas;
let world;
let keyboard = new Keyboard();
let gameManager = null;

function buttonSound() {
  soundManager.play('buttonClickSound');
}

function startButton() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('canvas-container').style.display = 'block';
  gameManager = new GameManager();
  gameManager.startGame();
}

function restartButton() {
  if (gameManager) {
    document.getElementById('restartButton').classList.remove('hidden');
    gameManager.restartGame();
  }
}

function fullscreenButton() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function checkOrientation() {
  let popup = document.getElementById('orientation-popup');
  let canvasContainer = document.getElementById('canvas-container');

  if (window.innerHeight > window.innerWidth && window.innerWidth < 720) {
    popup.style.display = 'flex';
    canvasContainer.style.display = 'none';
  } else {
    popup.style.display = 'none';
    canvasContainer.style.display = 'block';
  }
}

function onMuteClick() {
  soundManager.toggleMute();

  muteIcon.src = soundManager.muted ? 'buttons/mute.svg' : 'buttons/unmute.svg';
}

function onPauseClick() {
  const pauseBtn = document.getElementById('pauseButton');
  const pauseBtnImg = pauseBtn.querySelector('img');

  if (World.instance && typeof World.instance.togglePause === 'function') {
    World.instance.togglePause();

    pauseBtnImg.src = World.instance.isPaused
      ? 'buttons/play.svg'
      : 'buttons/break.svg';
  } else {
    console.error('Fehler: World.instance oder togglePause() nicht definiert.');
  }
}

function showMobileControlsHint() {
  let hint = document.getElementById('mobile-controls-hint');
  if (!hint) return;

  if (window.innerWidth <= 762) {
    hint.classList.remove('hidden');

    setTimeout(() => {
      hint.classList.add('hidden');
    }, 10000);
  }
}

function clearAllIntervals() {
  const highestId = setInterval(() => {}, 1000);
  for (let i = 0; i <= highestId; i++) {
    clearInterval(i);
  }
  console.log('Alle Intervalle wurden gelöscht.');
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 762) {
    showMobileControlsHint();
  }
});

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);
