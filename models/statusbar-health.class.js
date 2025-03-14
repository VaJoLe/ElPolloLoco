/**
 * Represents the health status bar in the game.
 * Displays the player's health as a visual progress indicator.
 * Inherits from `DrawableObject`.
 */
class StatusbarHealth extends DrawableObject {
  /**
   * Array of image paths representing different health levels.
   * @type {string[]}
   */
  IMAGES = [
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
  ];

  /**
   * The current percentage of the player's health.
   * Starts at 100%.
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new health status bar.
   * Loads the status images and sets the initial position and size.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 0;
    this.width = 180;
    this.height = 50;
    this.setPercentage(100);
  }

  /**
   * Sets the status bar to reflect the current health percentage.
   * Updates the displayed image accordingly.
   * @param {number} percentage - The percentage of health remaining (0-100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let imagePath = this.IMAGES[this.resolvePercentage()];
    this.img = this.imageCache[imagePath];
  }

  /**
   * Determines the correct image index based on the health percentage value.
   * @returns {number} The index of the image to display.
   */
  resolvePercentage() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
