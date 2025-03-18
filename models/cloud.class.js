/**
 * Represents a cloud in the game's background.
 * Clouds move continuously to the left to create a scrolling effect.
 * Inherits from `MovableObject`.
 */
class Clouds extends MovableObject {
  /**
 * Global variables for the clouds.
 */
  y = 20;
  height = 250;
  width = 500;
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

  /**
 * Stops the animation of the object by clearing the play interval.
 * Ensures that the animation does not continue running when paused or stopped.
 */
  stopAnimation() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }
}
