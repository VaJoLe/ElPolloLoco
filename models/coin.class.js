/**
 * Represents a collectible coin in the game.
 * Coins can be collected by the player to increase their score.
 * Inherits from `MovableObject`.
 */
class Coin extends MovableObject {
  /**
   * The width of the coin.
   * @type {number}
   */
  width = 150;

  /**
   * The height of the coin.
   * @type {number}
   */
  height = 150;

  /**
   * The initial vertical position of the coin.
   * @type {number}
   */
  y = 80;

  /**
   * The initial horizontal position of the coin (randomly assigned).
   * @type {number}
   */
  x = -500;

  /**
   * Image paths for the coin animation.
   * The coin alternates between these images to create a spinning effect.
   * @type {string[]}
   */
  IMAGES_COIN = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];

  /**
   * Interval reference for the coin animation cycle.
   * @type {number|null}
   */
  playInterval = null;

  /**
   * Creates a new coin at a random x-position.
   */
  constructor() {
    super().loadImage(this.IMAGES_COIN[0]);
    this.loadImages(this.IMAGES_COIN);
    this.x = -200 + Math.random() * 2200; // Assigns a random x position

    this.animate();
  }

  /**
   * Starts the animation for the coin.
   * The coin alternates between images to create a spinning effect.
   */
  animate() {
    if (this.playInterval) {
      clearInterval(this.playInterval);
    }

    this.playInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 150);

    if (World.instance) {
      World.instance.allIntervals.push(this.playInterval);
    }
  }
}
