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
 * Returns to the home screen by resetting the game and hiding the game canvas.
 * Ensures the start screen and menu container are properly displayed.
 */
function goToHomeScreen() {
  if (gameManager) {
    gameManager.destroyGame(); // Reset game
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('menuContainer').classList.add('hidden');
  }
}

/**
 * Restarts the game without showing the start screen.
 * Resets the UI elements and starts the game again.
 */
function restartGameWithoutStartScreen() {
  if (gameManager) {
    document.getElementById('win-screen').classList.add('hidden'); // Hide end screen
    document.getElementById('menuContainer').classList.add('hidden');

    document.getElementById('canvas-container').style.display = 'block';
    document.getElementById('start-screen').style.display = 'none';

    gameManager.restartGame();
    gameManager.startGame();
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

  // Direkt nach dem Umschalten das Icon aktualisieren
  const muteIcon = document.getElementById('muteIcon');
  if (muteIcon) {
    muteIcon.src = soundManager.muted
      ? 'buttons/mute.svg'
      : 'buttons/unmute.svg';
  }

  // Speichert den aktuellen Mute-Status im localStorage
  localStorage.setItem('isMuted', soundManager.muted);
  // Falls Unmute: Musik erneut starten
  if (!soundManager.muted) {
    soundManager.play('backgroundMusic');
  }
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
 * Toggles the visibility of the mobile controls hint.
 * If the hint is currently hidden, it will be shown; otherwise, it will be hidden.
 */
function toggleMobileControlsHint() {
  let hint = document.getElementById('mobile-controls-hint');
  if (!hint) return; // Exit if the element does not exist

  if (hint.classList.contains('hidden')) {
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
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
 * Loads the mute status from localStorage and updates the sound settings accordingly.
 * If the game was muted previously, it remains muted; otherwise, background music
 * will start playing after the first user interaction.
 */
function loadMuteStatus() {
  const isMuted = localStorage.getItem('isMuted') === 'true';
  soundManager.muted = isMuted;

  if (isMuted) {
    soundManager.mute();
  } else {
    document.addEventListener('click', playBackgroundMusicOnce, { once: true });
  }

  const muteIcon = document.getElementById('muteIcon');
  if (muteIcon) {
    muteIcon.src = isMuted ? 'buttons/mute.svg' : 'buttons/unmute.svg';
  }
}

// Funktion zum Starten der Hintergrundmusik nach erster Interaktion
function playBackgroundMusicOnce() {
  soundManager.unmute();
  soundManager.play('backgroundMusic');
}

/**
 * Toggles the visibility of the game menu.
 * If the menu is currently hidden, it will be shown; otherwise, it will be hidden.
 */
function toggleMenu() {
  let menu = document.getElementById('menuContainer');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
}

/**
 * Adds event listeners to handle screen resizing and orientation changes.
 */
window.addEventListener('load', loadMuteStatus);

window.addEventListener('resize', checkOrientation);
window.addEventListener('load', checkOrientation);
