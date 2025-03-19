/**
 * Represents the status bar for the Endboss's health.
 * Displays different images based on the Endboss's remaining health.
 * Inherits from `DrawableObject`.
 */
class StatusbarEndboss extends DrawableObject {
  /**
   * Image paths for the different health levels of the Endboss.
   * @type {string[]}
   */
  IMAGES = [
    'img/7_statusbars/2_statusbar_endboss/100.png',
    'img/7_statusbars/2_statusbar_endboss/75.png',
    'img/7_statusbars/2_statusbar_endboss/50.png',
    'img/7_statusbars/2_statusbar_endboss/25.png',
    'img/7_statusbars/2_statusbar_endboss/0.png',
  ];

  /**
   * Creates a new status bar for the Endboss.
   * The status bar follows the Endboss and updates based on health.
   *
   * @param {Endboss} endboss - The Endboss instance this status bar is linked to.
   */
  constructor(endboss) {
    super();
    this.endboss = endboss;
    this.loadImages(this.IMAGES);
    this.x = endboss.x + endboss.width / 4;
    this.y = endboss.y;
    this.width = 150;
    this.height = 40;
    this.setPercentage(100);
  }

  /**
   * Updates the displayed image based on the given percentage.
   * The percentage determines which image from the status bar is shown.
   *
   * @param {number} percentage - The current percentage (0-100) representing the status.
   */
  setPercentage(percentage) {
    let index = Math.max(0, Math.min(4, 4 - Math.floor(percentage / 25)));
    this.img = this.imageCache[this.IMAGES[index]];
  }

  /**
   * Updates the position of the object relative to the Endboss.
   * Ensures that the object follows the Endboss's position dynamically.
   */
  updatePosition() {
    this.x = this.endboss.x + this.endboss.width / 4;
    this.y = this.endboss.y - 30;
  }
}
