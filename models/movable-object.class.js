/**
 * Represents a movable object in the game.
 * This class extends `DrawableObject` and provides movement, gravity, and collision detection.
 */
class MovableObject extends DrawableObject {
  /**
   * Global variables for the movableobjects.
   */
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  lastHit = 0;
  energy = 100;
  bottle = 0;
  coin = 0;

  /**
   * Applies gravity to the object, making it fall if it's not above ground.
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
    if (World.instance) {
      World.instance.allIntervals.push(this.gravityInterval);
    }
  }

  /**
   * Checks if the object is above the ground.
   * Throwable objects are always considered above ground.
   * @returns {boolean} True if the object is above the ground, otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 130;
    }
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Plays an animation by cycling through a given array of images.
   * @param {string[]} images - The array of image file paths.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Makes the object jump by setting a vertical speed.
   */
  jump() {
    this.speedY = 30;
  }

  /**
   * Checks if the object is colliding with another object.
   * @param {MovableObject} obj - The object to check collision with.
   * @returns {boolean} True if a collision is detected, otherwise false.
   */
  isColliding(obj) {
    let collisionTolerance = 30;
    return (
      this.x + this.width - collisionTolerance > obj.x &&
      this.y + this.height > obj.y &&
      this.x + collisionTolerance < obj.x + obj.width &&
      this.y < obj.y + obj.height
    );
  }

  /**
   * Checks for vertical (Y-axis) collision only, useful for collecting items.
   * @param {MovableObject} obj1 - The first object.
   * @param {MovableObject} obj2 - The second object.
   * @returns {boolean} True if a Y-axis collision is detected, otherwise false.
   */
  isCollidingYOnly(obj1, obj2) {
    let tolerance = 5;
    return (
      obj1.x + obj1.width >= obj2.x &&
      obj1.x < obj2.x + obj2.width &&
      obj1.y <= obj2.y + tolerance &&
      obj1.y + obj1.height >= obj2.y
    );
  }

  /**
   * Reduces the object's energy when hit.
   * If energy reaches zero, it stays at zero.
   */
  hit(energy) {
    let now = new Date().getTime();
    if (now - this.lastHit > 500) {
      soundManager.play('hit');
      this.lastHit = now;
    }
    this.energy -= energy;
    if (this.energy < 0) {
      this.energy = 0;
    }
  }

  /**
   * Checks if the object is dead (energy is zero).
   * @returns {boolean} True if the object is dead, otherwise false.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Checks if the object is currently hurt (recently hit).
   * @returns {boolean} True if the object was hit within the last second, otherwise false.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    return timePassed / 1000 < 1;
  }

  /**
   * Increases the object's coin count when a coin is collected.
   */
  isCollectCoin() {
    this.coin += 20;
  }

  /**
   * Increases the object's bottle count when a bottle is collected.
   */
  isCollectBottle() {
    if (this.bottle < 100) {
      this.bottle += 20;
    }
  }

  /**
   * Stops all currently running animations for the object.
   */
  stopCurrentAnimation() {
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals = [];
  }
}