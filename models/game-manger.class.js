/**
 * Manages the overall game state, including starting, restarting, and destroying the game.
 * Handles canvas creation and resets UI elements when needed.
 */
class GameManager {
  /**
   * Creates a new GameManager instance.
   * Initializes the canvas, world, and keyboard.
   */
  constructor() {
    /**
     * Reference to the game's canvas element.
     * @type {HTMLCanvasElement|null}
     */
    this.canvas = null;

    /**
     * Reference to the game's world instance.
     * @type {World|null}
     */
    this.world = null;

    /**
     * Instance of the `Keyboard` class to handle user input.
     * @type {Keyboard}
     */
    this.keyboard = new Keyboard();
  }

  /**
   * Starts the game by initializing the world, setting up the canvas, and playing background music.
   * Hides the start screen and displays the game container.
   */
  startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('canvas-container').style.display = 'block';

    this.createCanvas();

    initLevel();
    this.world = new World(this.canvas, this.keyboard);
    this.keyboard.setupMobileControls();

    soundManager.play('backgroundMusic');
    const muteIcon = document.getElementById('muteIcon');
    if (muteIcon) {
      muteIcon.src = soundManager.muted
        ? 'buttons/mute.svg'
        : 'buttons/unmute.svg';
    }
  }

  /**
   * Creates the game canvas if it does not exist.
   * Inserts the canvas into the canvas container.
   */
  createCanvas() {
    this.canvas = document.getElementById('canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'canvas';
      this.canvas.width = 720;
      this.canvas.height = 480;
      document
        .getElementById('canvas-container')
        .insertBefore(
          this.canvas,
          document.getElementById('canvas-container').firstChild
        );
    }
  }

  /**
   * Destroys the current game world and clears all intervals.
   * This method is used before restarting or exiting the game.
   */
  destroyGame() {
    if (this.world) {
      this.world.destroy();
      this.world = null;
    }
    clearAllIntervals();
  }

  /**
   * Restarts the game by destroying the existing game state, removing the old canvas, and creating a new one.
   * Resets UI elements and stops background music.
   */
  restartGame() {
    this.destroyGame();
    let oldCanvas = document.getElementById('canvas');
    if (oldCanvas) {
      oldCanvas.remove();
    }
    this.newCanvas();
    this.resetButtons();
    const muteIcon = document.getElementById('muteIcon');
    if (muteIcon) {
      muteIcon.src = soundManager.muted
        ? 'buttons/mute.svg'
        : 'buttons/unmute.svg';
    }

    this.world = null;
    this.keyboard = new Keyboard();
  }

  /**
   * Creates a new canvas and reinitializes the game display.
   * The start screen is shown again, and the canvas is hidden.
   */
  newCanvas() {
    let newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas';
    newCanvas.width = 720;
    newCanvas.height = 480;
    let canvasContainer = document.getElementById('canvas-container');
    canvasContainer.insertBefore(newCanvas, canvasContainer.firstChild);
    canvasContainer.style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
  }

  /**
   * Resets the state of UI buttons such as restart, pause, and mute buttons.
   * Ensures the game UI is properly initialized when restarting.
   */
  resetButtons() {
    let restartBtn = document.getElementById('gameOverRestartButton');
    if (restartBtn) restartBtn.classList.add('hidden');
    let pauseBtn = document.getElementById('pauseButton');
    if (pauseBtn && pauseBtn.querySelector('img')) {
      pauseBtn.querySelector('img').src = 'buttons/break.svg';
    }
  }
}
