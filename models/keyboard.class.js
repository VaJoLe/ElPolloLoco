class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;

  constructor() {
    this.setupEventListeners();
    document.addEventListener('DOMContentLoaded', () => {
      this.setupMobileControls(); // Warten, bis das DOM bereit ist
    });
  }

  setupEventListeners() {
    window.addEventListener('keydown', e => this.handleKeyDown(e));
    window.addEventListener('keyup', e => this.handleKeyUp(e));
  }

  handleKeyDown(event) {
    if (event.keyCode == 39) this.RIGHT = true;
    if (event.keyCode == 37) this.LEFT = true;
    if (event.keyCode == 38) this.UP = true;
    if (event.keyCode == 40) this.DOWN = true;
    if (event.keyCode == 32) this.SPACE = true;
  }

  handleKeyUp(event) {
    if (event.keyCode == 39) this.RIGHT = false;
    if (event.keyCode == 37) this.LEFT = false;
    if (event.keyCode == 38) this.UP = false;
    if (event.keyCode == 40) this.DOWN = false;
    if (event.keyCode == 32) this.SPACE = false;
  }

  setupMobileControls() {
    this.leftButton();
    this.rightButton();
    this.jumpButton();
    this.throwButton();
  }

  leftButton() {
    const leftBtn = document.getElementById('left-btn');
    leftBtn.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this, 'LEFT'),
      { passive: false }
    );
    leftBtn.addEventListener(
      'touchend',
      this.handleTouchEnd.bind(this, 'LEFT'),
      { passive: false }
    );
  }

  rightButton() {
    const rightBtn = document.getElementById('right-btn');
    rightBtn.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this, 'RIGHT'),
      { passive: false }
    );
    rightBtn.addEventListener(
      'touchend',
      this.handleTouchEnd.bind(this, 'RIGHT'),
      { passive: false }
    );
  }

  jumpButton() {
    const jumpBtn = document.getElementById('jump-btn');

    jumpBtn.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this, 'UP'),
      { passive: false }
    );
    jumpBtn.addEventListener('touchend', this.handleTouchEnd.bind(this, 'UP'), {
      passive: false,
    });
  }

  throwButton() {
    const throwBtn = document.getElementById('throw-btn');

    throwBtn.addEventListener(
      'touchstart',
      e => {
        e.preventDefault();
        if (World.instance) {
          World.instance.throwBottle();
        }
      },
      { passive: false }
    );
  }

  handleTouchStart(key, event) {
    event.preventDefault();
    this[key] = true;
  }

  handleTouchEnd(key, event) {
    event.preventDefault();
    this[key] = false;
  }
}
