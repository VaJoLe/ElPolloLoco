class GameManager {
  constructor() {
    this.canvas = null;
    this.world = null;
    this.keyboard = new Keyboard();
  }

  startGame() {
    // Startscreen ausblenden, Canvas-Container anzeigen
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('canvas-container').style.display = 'block';

    this.createCanvas();

    //  neue World erstellen
    initLevel();
    this.world = new World(this.canvas, this.keyboard);
    this.keyboard.setupMobileControls();
    showMobileControlsHint();

    soundManager.play('backgroundMusic');

    console.log('Spiel gestartet.');
  }

  createCanvas() {
    // Canvas holen oder neu erstellen
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

  destroyGame() {
    if (this.world) {
      this.world.destroy();
      this.world = null;
    }
    clearAllIntervals();
    console.log('Spielzustand zerstört.');
  }

  restartGame() {
    this.destroyGame();

    // Entferne den alten Canvas
    let oldCanvas = document.getElementById('canvas');
    if (oldCanvas) {
      oldCanvas.remove();
    }

    this.newCanvas();

    this.resetButtons();

    soundManager.stop('backgroundMusic');
    soundManager.muted = false;

    this.world = null;
    this.keyboard = new Keyboard();
  }

  newCanvas() {
    //  neuen Canvas
    let newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas';
    newCanvas.width = 720;
    newCanvas.height = 480;
    let canvasContainer = document.getElementById('canvas-container');
    canvasContainer.insertBefore(newCanvas, canvasContainer.firstChild);
     // Startscreen anzeigen
     canvasContainer.style.display = 'none';
     document.getElementById('start-screen').style.display = 'block';
  }

  resetButtons() {
    // Setze Buttons auf Ausgangszustand
    let restartBtn = document.getElementById('restartButton');
    if (restartBtn) restartBtn.classList.remove('game-over-btn');
    let pauseBtn = document.getElementById('pauseButton');
    if (pauseBtn && pauseBtn.querySelector('img')) {
      pauseBtn.querySelector('img').src = 'buttons/break.svg';
    }
    let muteIcon = document.getElementById('muteIcon');
    if (muteIcon) muteIcon.src = 'buttons/unmute.svg';
  }
}
