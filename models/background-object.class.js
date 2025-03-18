/**
 * Represents a background object in the game.
 * These objects are used to create the parallax scrolling effect in the level.
 * Inherits from `MovableObject`.
 */
class BackgroundObject extends MovableObject {
 /**
 * Global variables for the background.
 */
  width = 720;
  height = 480;

  /**
   * Creates a new background object.
   * @param {string} imagePath - The path to the image used for the background.
   * @param {number} x - The initial x-coordinate position of the background object.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height; // Aligns the background object to the bottom of the canvas.
  }
}
