/**
 * Represents a game level, containing enemies, background elements, and collectibles.
 */
class Level {
  /**
 * Global variables for the level.
 */
  character;
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottles;
  level_end_x = 2240;

  /**
   * Creates a new level instance with enemies, clouds, background elements, coins, and bottles.
   * @param {MovableObject[]} enemies - The enemies in the level.
   * @param {Clouds[]} clouds - The clouds used for the background animation.
   * @param {BackgroundObject[]} backgroundObjects - The background elements.
   * @param {Coin[]} coin - The collectible coins in the level.
   * @param {Bottle[]} bottle - The collectible bottles in the level.
   */
  constructor(enemies, clouds, backgroundObjects, coin, bottle) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coin;
    this.bottles = bottle;
  }
}
