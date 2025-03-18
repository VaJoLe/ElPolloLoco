/**
 * Represents a small chicken enemy in the game.
 * Small chickens move left and can be squashed by the player.
 * Inherits from `MovableObject`.
 */
class ChickenSmall extends MovableObject {
  /**
 * Global variables for the small chicken.
 */
  width = 60;
  height = 60;
  y = 360;
  isDead = false;
  isAnimating = false;

  /**
   * Image paths for the walking animation of the small chicken.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
  ];

  /**
   * Image path for the dead state of the small chicken.
   * @type {string}
   */
  IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';

  /**
   * Interval reference for the animation cycle.
   * @type {number|null}
   */
  animationInterval = null;

  /**
   * Interval reference for the movement cycle.
   * @type {number|null}
   */
  moveInterval = null;

  /**
   * Creates a new small chicken enemy at a random x-position.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.imageCache[this.IMAGE_DEAD] = new Image();
    this.imageCache[this.IMAGE_DEAD].src = this.IMAGE_DEAD;

    this.x = -200 + Math.random() * 2500; // Assign a random x position
    this.speed = 0.3 + Math.random() * 0.5; // Randomize speed for variety

    this.animationIntervals = [];
    this.animate();
  }

  /**
   * Starts the animation and movement of the small chicken.
   */
  animate() {
    this.stopCurrentAnimation();

    if (this.isAnimating) return;
    this.isAnimating = true;

    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.moveInterval = this.moveIntervalChickenS();
    this.animationInterval = this.animationIntervalChickenS();

    if (World.instance) {
      World.instance.allIntervals.push(this.moveInterval);
      World.instance.allIntervals.push(this.animationInterval);
    }
  }

  /**
   * Moves the small chicken continuously to the left unless paused or dead.
   * @returns {number} - Interval reference
   */
  moveIntervalChickenS() {
    return setInterval(() => {
      if (!this.isDead && World.instance && !World.instance.isPaused) {
        this.moveLeft();
      }
    }, 1000 / 60);
  }

  /**
   * Animates the small chicken by cycling through its walking images.
   * @returns {number} - Interval reference
   */
  animationIntervalChickenS() {
    return setInterval(() => {
      if (!this.isDead && World.instance && !World.instance.isPaused) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }

  /**
   * Checks if the small chicken is being squashed by the player character.
   * If so, the chicken dies and the player gets a bounce effect.
   */
  checkIfSquashed() {
    if (!this.world || this.isDead || !this.world.character.isColliding(this)) return;

    let char = this.world.character;
    let isAbove =
      char.y + char.height - 10 >= this.y - 5 &&
      char.y + char.height - 10 <= this.y + 15;
    let isFalling = char.speedY < 0;
    let isCentered =
      Math.abs(char.x + char.width / 2 - (this.x + this.width / 2)) < this.width / 2 + 30;

    if (isAbove && isFalling && isCentered) {
      soundManager.play('jumpOnChickenSound');
      this.die();
      char.speedY = 15; // Character bounces upon squashing the chicken
      char.y = 130;

    }
  }

  /**
   * Marks the small chicken as dead and updates its image.
   */
  die() {
    this.isDead = true;
    this.img = this.imageCache[this.IMAGE_DEAD];
    this.speed = 0;
  }

  /**
   * Stops the current animation intervals.
   */
  stopCurrentAnimation() {
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals = [];
  }
}
