/**
 * Represents the game world, including the character, level, enemies, collectibles, and interactions.
 * Manages game logic such as collisions, animations, and user inputs.
 */
class World {
  /**
   * Global variables for the world.
   */
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusbarHealth = new StatusbarHealth();
  statusbarBottle = new StatusbarBottle();
  statusbarCoin = new StatusbarCoin();
  throwableObjects = [];
  spacePressed = false;
  static instance;
  allIntervals = [];
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
    this.pauseCoins(); // Hier Coins pausieren
    this.pauseClouds(); // Hier Coins pausieren
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
    this.resumeForEnemies();
    this.level.clouds.forEach(cloud => cloud.animate());
    this.level.bottles.forEach(bottle => bottle.animate());
    this.level.coins.forEach(coin => coin.animate());
    this.run();
    this.character.resetIdleTimer();
  }

  /**
   * Resumes enemies intervals and animations after unpausing.
   */
  resumeForEnemies() {
    return this.level.enemies.forEach(enemy => {
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
    if (this.isPaused || this.character.isDead) return;

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
   * Continuously renders the game by updating the canvas.
   * Draws the game objects and overlays the game-over screen if the character is dead.
   */
  draw() {
    this.drawContent();

    if (this.character.isDead) {
      this.ctx.drawImage(this.character.gameOverImage, 0, 0, 720, 480);
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Clears the canvas and redraws all game objects in the correct order.
   * Handles background movement and character positioning.
   */
  drawContent() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusbarHealth);
    this.addToMap(this.statusbarBottle);
    this.addToMap(this.statusbarCoin);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Loops through an array of game objects and adds each to the canvas.
   * @param {Array} object - The array of objects to be drawn.
   */
  addObjectsToMap(object) {
    object.forEach(o => {
      this.addToMap(o);
    });
  }

  /**
   * Draws a single game object on the canvas.
   * Handles image flipping for objects that move in the opposite direction.
   * @param {MovableObject} mo - The game object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Flips an image horizontally to create a mirrored effect.
   * Used for objects that change direction.
   * @param {MovableObject} mo - The game object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the original position after flipping an object.
   * @param {MovableObject} mo - The game object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Stops all active intervals and removes event listeners.
   * Destroys the game world instance.
   */
  destroy() {
    this._destroyed = true;
    this.stopAllIntervals();
    if (this.boundKeyDown) {
      document.removeEventListener('keydown', this.boundKeyDown);
    }
    if (this.boundKeyUp) {
      document.removeEventListener('keyup', this.boundKeyUp);
    }
  }
  /**
   * Pauses or resumes coin animations based on the game state.
   * If the game is paused, the coin animation stops; otherwise, it resumes.
   */
  pauseCoins() {
    this.level.coins.forEach(coin => {
      if (this.isPaused) {
        coin.stopAnimation();
      } else {
        coin.animate();
      }
    });
  }

  /**
   * Pauses or resumes cloud animations based on the game state.
   * If the game is paused, the cloud animation stops; otherwise, it resumes.
   */
  pauseClouds() {
    this.level.clouds.forEach(cloud => {
      if (this.isPaused) {
        cloud.stopAnimation();
      } else {
        cloud.animate();
      }
    });
  }
}
