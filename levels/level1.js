/**
 * Global variable for the first level of the game.
 * It will be initialized in the `initLevel` function.
 */
let level1;

/**
 * Initializes the first level of the game by creating enemies, clouds, backgrounds, coins, and bottles.
 */
function initLevel() {
  level1 = new Level(
    /**
     * Array of enemies appearing in the level.
     * Includes Chickens, Small Chickens, and the Endboss.
     */
    [
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new ChickenSmall(),
      new ChickenSmall(),
      new ChickenSmall(),
      new Endboss(),
    ],

    /**
     * Array of cloud objects to create a moving background effect.
     * The clouds are positioned at different horizontal offsets.
     */
    [
      new Clouds('img/5_background/layers/4_clouds/1.png', -600),
      new Clouds('img/5_background/layers/4_clouds/2.png', 0),
      new Clouds('img/5_background/layers/4_clouds/1.png', 600),
      new Clouds('img/5_background/layers/4_clouds/2.png', 1200),
      new Clouds('img/5_background/layers/4_clouds/1.png', 1800),
    ],

    /**
     * Array of background objects representing different layers of the scenery.
     * These objects are positioned at various distances to create a parallax effect.
     */
    [
      new BackgroundObject('img/5_background/layers/air.png', -719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),

      new BackgroundObject('img/5_background/layers/air.png', 0),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
      new BackgroundObject('img/5_background/layers/air.png', 719),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719),

      new BackgroundObject('img/5_background/layers/air.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 719 * 2),
      new BackgroundObject('img/5_background/layers/air.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 719 * 3),
      new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 719 * 3),
    ],

    /**
     * Array of collectible coins placed in the level.
     * Players can collect these to increase their score.
     */
    [new Coin(), new Coin(), new Coin(), new Coin(), new Coin()],

    /**
     * Array of collectible bottles.
     * These can be used as throwable weapons.
     */
    [
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
    ]
  );
}
