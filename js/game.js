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
    soundManager.stop('backgroundMusic');
    soundManager.stop('sleep');
  }
}

/**
 * Restarts the game without showing the start screen.
 * Resets the UI elements and starts the game again.
 */
function restartGameWithoutStartScreen() {
  if (gameManager) {
    document.getElementById('win-screen').classList.add('hidden');
    document.getElementById('menuContainer').classList.add('hidden');
    document.getElementById('canvas-container').style.display = 'block';
    document.getElementById('start-screen').style.display = 'none';
    soundManager.stop('sleep');
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
    fullScreenRequest();
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
 * Requests fullscreen mode for the document.
 * Supports different browser implementations for fullscreen requests.
 */
function fullScreenRequest() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }
}

/**
 * Checks the screen orientation and displays a popup if the device is in portrait mode.
 * Hides or shows the game canvas and start screen accordingly.
 */
function checkOrientation() {
  let popup = document.getElementById('orientation-popup');
  let canvasContainer = document.getElementById('canvas-container');
  let startScreen = document.getElementById('start-screen');

  if (window.innerHeight > window.innerWidth && window.innerWidth < 730) {
    popup.style.display = 'flex';
    canvasContainer.style.display = 'none';
    startScreen.style.display = 'none'; // Hide start screen
  } else {
    popup.style.display = 'none';
    canvasContainer.style.display = 'block';

    // Show the start screen only if the game has not started yet
    if (!gameManager || !gameManager.world) {
      startScreen.style.display = 'block';
    }
  }
}

/**
 * Toggles the mute state of the game's sound.
 * Updates the mute button icon accordingly.
 */
function onMuteClick() {
  soundManager.toggleMute();
  const muteIcon = document.getElementById('muteIcon');
  if (muteIcon) {
    muteIcon.src = soundManager.muted
      ? 'buttons/mute.svg'
      : 'buttons/unmute.svg';
  }
  localStorage.setItem('isMuted', soundManager.muted);
  if (!soundManager.muted && World.instance && !World.instance.isPaused) {
    soundManager.play('backgroundMusic');
  } else {
    soundManager.stop('backgroundMusic');
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

  isMuteRequest(isMuted);

  const muteIcon = document.getElementById('muteIcon');
  if (muteIcon) {
    muteIcon.src = isMuted ? 'buttons/mute.svg' : 'buttons/unmute.svg';
  }
}

/**
 * Handles mute or unmute requests based on the provided parameter.
 * If muted, it mutes all sounds. If unmuted, it waits for a user interaction
 * before enabling sound and playing background music.
 *
 * @param {boolean} isMuted - Indicates whether the game should be muted or unmuted.
 */
function isMuteRequest(isMuted) {
  if (isMuted) {
    soundManager.mute();
  } else {
    document.addEventListener(
      'click',
      () => {
        if (!World.instance.isPaused) {
          soundManager.unmute();
          soundManager.play('backgroundMusic');
        }
      },
      { once: true } // Ensures this event listener is executed only once
    );
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

window.addEventListener('resize', () => {
  if (gameManager && gameManager.world) {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('canvas-container').style.display = 'block';
  }
});
