/**
 * Represents a collectible bottle in the game.
 * Bottles can be collected and used as throwable weapons.
 * Inherits from `MovableObject`.
 */
class Bottle extends MovableObject {
  /**
 * Global variables for the bottles.
 */
  width = 100;ht = 100;
  y = 325;
  x = -400;
  animationInterval = null;

  /**
   * Image paths for the bottle's animation.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  /**
   * Creates a new bottle object at a random x-position.
   */
  constructor() {
    super().loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = -200 + Math.random() * 2200; // Random position for variety.

    this.animate();
  }

  /**
   * Starts the animation of the bottle.
   * The bottle will alternate between two images to simulate a slight movement effect.
   */
  animate() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.animationInterval = setInterval(() => {
      if (World.instance && !World.instance.isPaused) {
        this.playAnimation(this.IMAGES_BOTTLE);
      }
    }, 150);

    if (World.instance) {
      World.instance.allIntervals.push(this.animationInterval);
    }
  }
}
