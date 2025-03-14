/**
 * Represents the game world, including the character, level, enemies, collectibles, and interactions.
 * Manages game logic such as collisions, animations, and user inputs.
 */
class World {
  /**
   * The main character controlled by the player.
   * @type {Character}
   */
  character = new Character();

  /**
   * The level being played, containing enemies, objects, and collectibles.
   * @type {Level}
   */
  level = level1;

  /**
   * The rendering context for the game canvas.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * The HTML canvas element where the game is rendered.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The keyboard instance handling player inputs.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * The horizontal camera offset for scrolling effects.
   * @type {number}
   */
  camera_x = 0;

  /**
   * The health status bar displaying the character's remaining health.
   * @type {StatusbarHealth}
   */
  statusbarHealth = new StatusbarHealth();

  /**
   * The bottle status bar displaying the number of collected bottles.
   * @type {StatusbarBottle}
   */
  statusbarBottle = new StatusbarBottle();

  /**
   * The coin status bar displaying the number of collected coins.
   * @type {StatusbarCoin}
   */
  statusbarCoin = new StatusbarCoin();

  /**
   * List of throwable objects (bottles) currently in the game.
   * @type {ThrowableObject[]}
   */
  throwableObjects = [];

  /**
   * Indicates whether the space key is pressed for throwing bottles.
   * @type {boolean}
   */
  spacePressed = false;

  /**
   * Singleton instance of the game world.
   * @type {World}
   */
  static instance;

  /**
   * Array storing all active intervals in the game for pausing and stopping.
   * @type {number[]}
   */
  allIntervals = [];

  /**
   * Indicates whether the game is currently paused.
   * @type {boolean}
   */
  isPaused = false;

  /**
   * Creates a new game world and initializes the game loop.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering the game.
   * @param {Keyboard} keyboard - The keyboard instance handling player input.
   */
  constructor(canvas, keyboard) {
    World.instance = this;
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.camera_x = 0;
    this.allIntervals = [];
    this._destroyed = false;
    this.isPaused = false;
    this.draw();
    this.setWorld();
    this.run();
    this.setupKeyboardListener();
  }

  /**
   * Toggles the game pause state and stops/resumes animations and sounds.
   */
  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.stopAllIntervals();
      soundManager.toggleBackgroundMusic(true);
    } else {
      this.resumeAllIntervals();
      soundManager.toggleBackgroundMusic(false);
    }

    this.pauseThrowableObjects();
  }

  /**
   * Pauses or resumes throwable object animations based on game state.
   */
  pauseThrowableObjects() {
    this.throwableObjects.forEach(bottle => {
      if (this.isPaused) {
        bottle.stopGravity();
      } else {
        bottle.acceleration = 2.5;
        bottle.applyGravity();
      }
    });
  }

  /**
   * Stops all active intervals and animation frames.
   */
  stopAllIntervals() {
    this.allIntervals.forEach(interval => clearInterval(interval));
    this.allIntervals = [];

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /**
   * Resumes all intervals and animations after unpausing.
   */
  resumeAllIntervals() {
    if (this.allIntervals.length > 0) return;
    this.character.stopCurrentAnimation();
    this.character.isAnimating = false;
    this.character.animate();
    this.level.enemies.forEach(enemy => {
      if (!enemy.isAnimating) {
        enemy.stopCurrentAnimation();
        enemy.isAnimating = false;
        if (
          enemy instanceof Endboss &&
          enemy.currentAnimationImages !== enemy.IMAGES_WALKING
        ) {
          enemy.changeAnimation(enemy.currentAnimationImages);
        } else {
          enemy.animate();
        }
      }
    });
    this.level.clouds.forEach(cloud => cloud.animate());
    this.level.bottles.forEach(bottle => bottle.animate());
    this.level.coins.forEach(coin => coin.animate());
    this.run();
    this.character.resetIdleTimer();
  }

  /**
   * Handles key press events, specifically for throwing bottles.
   * @param {KeyboardEvent} event - The keydown event.
   */
  onKeyDown(event) {
    if (event.code === 'Space' && !this.spacePressed) {
      this.spacePressed = true;
      this.throwBottle();
    }
  }

  /**
   * Handles key release events.
   * @param {KeyboardEvent} event - The keyup event.
   */
  onKeyUp(event) {
    if (event.code === 'Space') {
      this.spacePressed = false;
    }
  }

  /**
   * Sets up keyboard event listeners for user inputs.
   */
  setupKeyboardListener() {
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);

    document.addEventListener('keydown', this.boundKeyDown);
    document.addEventListener('keyup', this.boundKeyUp);
  }

  /**
   * Handles throwing a bottle by the player character.
   */
  throwBottle() {
    if (this.isPaused) return;

    if (this.character.bottle > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
      this.character.bottle -= 10;
      this.statusbarBottle.setPercentage(this.character.bottle);
      soundManager.play('throwSound');
    }
  }

  /**
   * Sets the world reference for all game entities.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => (enemy.world = this));
  }

  /**
   * Starts the game loop for checking interactions.
   */
  run() {
    let intervalId = setInterval(() => {
      this.checkSquash();
      this.checkCollisions();
      this.collectCoins();
      this.collectBottles();
    }, 50);
    this.allIntervals.push(intervalId);
  }

  /**
   * Checks if an enemy was squashed by the character.
   */
  checkSquash() {
    if (!this.character || this.character.isRemoved) return;
    this.level.enemies.forEach(enemy => {
      if (
        (enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
        !enemy.isDead
      ) {
        enemy.checkIfSquashed();
      }
    });
  }

  /**
   * Checks for collisions between the character and enemies.
   */
  checkCollisions() {
    if (!this.character || this.character.isRemoved) return;

    this.level.enemies.forEach(enemy => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusbarHealth.setPercentage(this.character.energy);

        if (this.character.energy <= 0) {
          this.character.die();
        }
      }
    });
  }

  /**
   * Handles coin collection.
   */
  collectCoins() {
    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isCollidingYOnly(this.character, coin)) {
        this.character.isCollectCoin();
        this.statusbarCoin.setPercentage(this.character.coin);
        return false;
      }
      return true;
    });
  }

  /**
   * Handles bottle collection.
   */
  collectBottles() {
    this.level.bottles = this.level.bottles.filter(bottle => {
      if (this.character.isColliding(bottle)) {
        this.character.isCollectBottle();
        this.statusbarBottle.setPercentage(this.character.bottle);
        return false;
      }
      return true;
    });
  }

  /**
   * Draws the game content.
   */
  draw() {
    this.drawContent();
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }
}
