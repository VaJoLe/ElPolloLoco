/**
 * Represents a cloud in the game's background.
 * Clouds move continuously to the left to create a scrolling effect.
 * Inherits from `MovableObject`.
 */
class Clouds extends MovableObject {
  /**
   * The initial vertical position of the cloud.
   * @type {number}
   */
  y = 20;

  /**
   * The height of the cloud.
   * @type {number}
   */
  height = 250;

  /**
   * The width of the cloud.
   * @type {number}
   */
  width = 500;

  /**
   * Interval reference for cloud movement.
   * @type {number|null}
   */
  moveInterval = null;

  /**
   * Creates a new cloud object at a specified x-position.
   * @param {string} imagePath - The path to the cloud image.
   * @param {number} x - The initial horizontal position of the cloud.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);

    this.x = x + Math.random() * 500; // Adds a random offset to vary cloud positions
    this.animate();
  }

  /**
   * Starts the animation to move the cloud continuously to the left.
   */
  animate() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }

    this.moveInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    if (World.instance) {
      World.instance.allIntervals.push(this.moveInterval);
    }
  }
}
