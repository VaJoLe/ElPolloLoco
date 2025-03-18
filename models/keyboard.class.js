/**
 * Manages keyboard and touch controls for the game.
 * Listens for keypress events and provides mobile touch controls.
 */
class Keyboard {
  /**
 * Global variables for the keyboard.
 */
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;

  /**
   * Creates a new Keyboard instance.
   * Sets up event listeners for keyboard and mobile controls.
   */
  constructor() {
    this.setupEventListeners();
    document.addEventListener('DOMContentLoaded', () => {
      this.setupMobileControls();
    });
  }

  /**
   * Sets up event listeners for keyboard input.
   * Detects when keys are pressed and released.
   */
  setupEventListeners() {
    window.addEventListener('keydown', e => this.handleKeyDown(e));
    window.addEventListener('keyup', e => this.handleKeyUp(e));
  }

  /**
   * Handles keydown events and updates movement states.
   * @param {KeyboardEvent} event - The keydown event.
   */
  handleKeyDown(event) {
    if (event.keyCode === 39) this.RIGHT = true;
    if (event.keyCode === 37) this.LEFT = true;
    if (event.keyCode === 38) this.UP = true;
    if (event.keyCode === 40) this.DOWN = true;
    if (event.keyCode === 32) this.SPACE = true;
  }

  /**
   * Handles keyup events and updates movement states.
   * @param {KeyboardEvent} event - The keyup event.
   */
  handleKeyUp(event) {
    if (event.keyCode === 39) this.RIGHT = false;
    if (event.keyCode === 37) this.LEFT = false;
    if (event.keyCode === 38) this.UP = false;
    if (event.keyCode === 40) this.DOWN = false;
    if (event.keyCode === 32) this.SPACE = false;
  }

  /**
   * Sets up touch controls for mobile devices.
   * Maps touch events to the same movement states as keyboard keys.
   */
  setupMobileControls() {
    this.leftButton();
    this.rightButton();
    this.jumpButton();
    this.throwButton();
  }

  /**
   * Configures the left movement button for touch controls.
   * Listens for `touchstart` and `touchend` events.
   */
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

  /**
   * Configures the right movement button for touch controls.
   * Listens for `touchstart` and `touchend` events.
   */
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

  /**
   * Configures the jump button for touch controls.
   * Listens for `touchstart` and `touchend` events.
   */
  jumpButton() {
    const jumpBtn = document.getElementById('jump-btn');
    jumpBtn.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this, 'UP'),
      { passive: false }
    );
    jumpBtn.addEventListener(
      'touchend',
      this.handleTouchEnd.bind(this, 'UP'),
      { passive: false }
    );
  }

  /**
   * Configures the throw button for touch controls.
   * Triggers the bottle-throwing action in the game world.
   */
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

  /**
   * Handles the start of a touch event for a movement button.
   * @param {string} key - The key state to update (`LEFT`, `RIGHT`, `UP`).
   * @param {TouchEvent} event - The touch event.
   */
  handleTouchStart(key, event) {
    event.preventDefault();
    this[key] = true;
  }

  /**
   * Handles the end of a touch event for a movement button.
   * @param {string} key - The key state to update (`LEFT`, `RIGHT`, `UP`).
   * @param {TouchEvent} event - The touch event.
   */
  handleTouchEnd(key, event) {
    event.preventDefault();
    this[key] = false;
  }
}
