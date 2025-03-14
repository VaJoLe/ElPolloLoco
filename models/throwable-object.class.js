/**
 * Represents a throwable object in the game.
 * These objects can be thrown by the player and interact with enemies.
 * Inherits from `MovableObject`.
 */
class ThrowableObject extends MovableObject {
  /**
   * Array of image paths representing the bottle rotation animation.
   * @type {string[]}
   */
  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];

  /**
   * Array of image paths representing the bottle splash animation upon impact.
   * @type {string[]}
   */
  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  /**
   * Creates a new throwable object (bottle).
   * @param {number} x - The initial x-coordinate of the throwable object.
   * @param {number} y - The initial y-coordinate of the throwable object.
   */
  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.width = 100;
    this.height = 100;
    this.x = x;
    this.y = y;
    this.hitEndboss = false;
    this.throw();
  }

  /**
   * Initiates the throwing motion of the object.
   * Moves forward while applying gravity and detects collisions with enemies.
   */
  throw() {
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
    }

    this.speedY = 10;
    this.applyGravity();

    this.throwInterval = setInterval(() => {
      if (World.instance?.isPaused) return;

      this.x += 15;
      this.playAnimation(this.IMAGES_ROTATION);

      let enemies = World.instance.level.enemies;
      enemies.forEach(enemy => {
        if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
          if (this.isColliding(enemy)) {
            enemy.die();
            this.stopGravity();
            clearInterval(this.throwInterval);
            this.splash();
          }
        }
      });

      let endboss = enemies.find(enemy => enemy instanceof Endboss);

      if (endboss && this.x >= endboss.x + endboss.width / 2 - this.width / 2) {
        endboss.gotHit();
        this.stopGravity();
        clearInterval(this.throwInterval);
        this.splash();
      } else if (this.y > 400) {
        clearInterval(this.throwInterval);
      }
    }, 25);

    if (World.instance) {
      World.instance.allIntervals.push(this.throwInterval);
    }
  }

  /**
   * Stops the gravity effect for the throwable object.
   */
  stopGravity() {
    this.speedY = 0;
    this.acceleration = 0;
  }

  /**
   * Triggers the splash animation when the bottle hits an enemy or the ground.
   * Removes the object from the game world after the animation finishes.
   */
  splash() {
    soundManager.play('bottleBreakSound');

    this.currentImage = 0;

    let splashAnimationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH);

      if (this.currentImage >= this.IMAGES_SPLASH.length) {
        clearInterval(splashAnimationInterval);

        World.instance.throwableObjects =
          World.instance.throwableObjects.filter(obj => obj !== this);
      }
    }, 100);
  }
}
