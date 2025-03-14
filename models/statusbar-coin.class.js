/**
 * Represents the status bar for coins in the game.
 * Displays the number of collected coins as a visual progress indicator.
 * Inherits from `DrawableObject`.
 */
class StatusbarCoin extends DrawableObject {
  /**
   * Array of image paths representing different coin levels.
   * @type {string[]}
   */
  IMAGES = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png',
  ];

  /**
   * The current percentage of collected coins.
   * @type {number}
   */
  percentage = 0;

  /**
   * Creates a new coin status bar.
   * Loads the status images and sets the initial position and size.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 40;
    this.width = 180;
    this.height = 50;
    this.setPercentage(this.percentage);
  }

  /**
   * Sets the status bar to reflect the current percentage of collected coins.
   * Updates the displayed image accordingly.
   * @param {number} percentage - The percentage of coins collected (0-100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let imagePath = this.IMAGES[this.resolvePercentage()];
    this.img = this.imageCache[imagePath];
  }

  /**
   * Determines the correct image index based on the percentage value.
   * @returns {number} The index of the image to display.
   */
  resolvePercentage() {
    if (this.percentage == 0) {
      return 0;
    } else if (this.percentage == 20) {
      return 1;
    } else if (this.percentage == 40) {
      return 2;
    } else if (this.percentage == 60) {
      return 3;
    } else if (this.percentage == 80) {
      return 4;
    } else {
      return 5;
    }
  }
}
