/**
 * Represents a drawable object in the game.
 * This class provides basic methods for loading images and rendering them on the canvas.
 */
class DrawableObject {
  /**
 * Global variables for the drawableobjects.
 */
  img;
  imageCache = {};
  currentImage = 0;

  /**
   * Loads a single image for the object.
   * @param {string} path - The file path of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into the `imageCache` for animation purposes.
   * @param {string[]} arr - An array of image file paths.
   */
  loadImages(arr) {
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a bounding box (collision frame) around the object.
   * This is used for debugging hitboxes.
   * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Coin ||
      this instanceof Bottle ||
      this instanceof ChickenSmall ||
      this instanceof Endboss ||
      this instanceof ThrowableObject
    ) {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
    }
  }
}
