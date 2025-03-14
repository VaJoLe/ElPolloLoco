/**
 * Represents a game level, containing enemies, background elements, and collectibles.
 */
class Level {
  /**
   * The main character in the level.
   * This is assigned externally.
   * @type {Character}
   */
  character;

  /**
   * An array of enemies present in the level.
   * @type {MovableObject[]}
   */
  enemies;

  /**
   * An array of cloud objects for the background animation.
   * @type {Clouds[]}
   */
  clouds;

  /**
   * An array of background objects such as scenery and terrain.
   * @type {BackgroundObject[]}
   */
  backgroundObjects;

  /**
   * An array of collectible coins scattered throughout the level.
   * @type {Coin[]}
   */
  coins;

  /**
   * An array of collectible bottles that can be thrown by the player.
   * @type {Bottle[]}
   */
  bottles;

  /**
   * The x-coordinate where the level ends.
   * @type {number}
   */
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
