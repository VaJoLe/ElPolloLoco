/**
 * Global variables for the game.
 */
let canvas;
let world;
let keyboard = new Keyboard();
let gameManager = null;

/**
 * Plays a button click sound.
 */
function buttonSound() {
  soundManager.play('buttonClickSound');
}

/**
 * Starts the game by hiding the start screen and displaying the game canvas.
 * Initializes the `GameManager` and starts the game.
 */
function startButton() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('canvas-container').style.display = 'block';
  gameManager = new GameManager();
  gameManager.startGame();
}

/**
 * Restarts the game if `gameManager` exists.
 * Ensures the restart button is visible.
 */
function restartButton() {
  if (gameManager) {
    document.getElementById('restartButton').classList.remove('hidden');
    gameManager.restartGame();
  }
}

/**
 * Toggles fullscreen mode for the game.
 * Supports different browser implementations.
 */
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

/**
 * Checks the screen orientation and displays a popup if the device is in portrait mode.
 * Hides or shows the game canvas accordingly.
 */
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

/**
 * Toggles the mute state of the game's sound.
 * Updates the mute button icon accordingly.
 */
function onMuteClick() {
  soundManager.toggleMute();
  muteIcon.src = soundManager.muted ? 'buttons/mute.svg' : 'buttons/unmute.svg';
}

/**
 * Toggles the game's pause state.
 * Updates the pause button icon accordingly.
 */
function onPauseClick() {
  const pauseBtn = document.getElementById('pauseButton');
  const pauseBtnImg = pauseBtn.querySelector('img');

  if (World.instance && typeof World.instance.togglePause === 'function') {
    World.instance.togglePause();
    pauseBtnImg.src = World.instance.isPaused
      ? 'buttons/play.svg'
      : 'buttons/break.svg';
  } else {
    console.error('Error: World.instance or togglePause() is not defined.');
  }
}

/**
 * Displays a hint for mobile controls when the screen width is below 762 pixels.
 * The hint disappears after 10 seconds.
 */
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

/**
 * Clears all active `setInterval` timers in the game.
 */
function clearAllIntervals() {
  const highestId = setInterval(() => {}, 1000);
  for (let i = 0; i <= highestId; i++) {
    clearInterval(i);
  }
}

/**
 * Adds event listeners to handle screen resizing and orientation changes.
 */
window.addEventListener('resize', () => {
  if (window.innerWidth <= 762) {
    showMobileControlsHint();
  }
});

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);
