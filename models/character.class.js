/**
 * Represents the main playable character in the game.
 * Inherits from `MovableObject` and includes animations, movement, and interactions.
 */
class Character extends MovableObject {
  /**
   * The initial horizontal position of the character.
   * @type {number}
   */
  x = -620;

  /**
   * The initial vertical position of the character.
   * @type {number}
   */
  y = 130;

  /**
   * The height of the character.
   * @type {number}
   */
  height = 300;

  /**
   * The width of the character.
   * @type {number}
   */
  width = 130;

  /**
   * The movement speed of the character.
   * @type {number}
   */
  speed = 10;

  /**
   * Indicates whether the character is dead.
   * @type {boolean}
   */
  isDead = false;

  /**
   * Indicates whether the character's animations are active.
   * @type {boolean}
   */
  isAnimating = false;

  /**
   * Idle time counter to determine if the character should sleep.
   * @type {number}
   */
  idleTime = 0;

  /**
   * Timeout reference for sleep mode.
   * @type {number|null}
   */
  sleepTimeout = null;

  /**
   * Indicates whether the character is in sleep mode.
   * @type {boolean}
   */
  isSleeping = false;

  /**
   * Image set for sleep animation.
   * @type {string[]}
   */
  IMAGES_SLEEP = [
    'img/2_character_pepe/1_idle/long_idle/I-11.png',
    'img/2_character_pepe/1_idle/long_idle/I-12.png',
    'img/2_character_pepe/1_idle/long_idle/I-13.png',
    'img/2_character_pepe/1_idle/long_idle/I-14.png',
    'img/2_character_pepe/1_idle/long_idle/I-15.png',
    'img/2_character_pepe/1_idle/long_idle/I-16.png',
    'img/2_character_pepe/1_idle/long_idle/I-17.png',
    'img/2_character_pepe/1_idle/long_idle/I-18.png',
    'img/2_character_pepe/1_idle/long_idle/I-19.png',
    'img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];

  /**
   * Image set for standing animation.
   * @type {string[]}
   */
  IMAGES_STAND = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];

  /**
   * Image set for walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    'img/2_character_pepe/2_walk/W-21.png',
    'img/2_character_pepe/2_walk/W-22.png',
    'img/2_character_pepe/2_walk/W-23.png',
    'img/2_character_pepe/2_walk/W-24.png',
    'img/2_character_pepe/2_walk/W-25.png',
    'img/2_character_pepe/2_walk/W-26.png',
  ];

  /**
   * Image set for jumping animation.
   * @type {string[]}
   */
  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];

  /**
   * Image set for the character's death animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];

  /**
   * Image set for the character's hurt animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  /**
   * Creates a new character instance.
   * Loads images, applies gravity, and starts animations.
   */
  constructor() {
    super().loadImage('img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_STAND);
    this.loadImages(this.IMAGES_SLEEP);
    this.applyGravity();

    this.gameOverImage = new Image();
    this.gameOverImage.src = 'img/9_intro_outro_screens/game_over/oh no you lost!.png';

    this.animationIntervals = [];
    this.animate();
  }

  /**
   * Starts the character's animation, including movement and idle checks.
   */
  animate() {
    this.stopCurrentAnimation();
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.moveIntervalCharacter();
    this.animIntervalCharacter();
    this.startIdleTimer();
  }

  /**
   * Controls character movement and updates camera position.
   */
  moveIntervalCharacter() {
    let moveInterval = setInterval(() => {
      if (!World.instance?.isPaused && !this.isDead && this.world) {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP) {
          this.resetIdleTimer();
        }
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
          this.moveRight();
          this.otherDirection = false;
        }
        if (this.world.keyboard.LEFT && this.x > -620) {
          this.moveLeft();
          this.otherDirection = true;
        }
        if (this.world.keyboard.UP && !this.isAboveGround()) {
          this.jump();
        }
        this.world.camera_x = -this.x + 90;
      }
    }, 1000 / 60);
    this.animationIntervals.push(moveInterval);
    return moveInterval;
  }

  /**
   * Animates character actions based on state (walking, jumping, hurt, idle, or sleeping).
   */
  animIntervalCharacter() {
    let animInterval = setInterval(() => {
      if (!World.instance?.isPaused && !this.isDead) {
        if (this.isHurt()) {
          this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
          this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
          this.playAnimation(this.IMAGES_WALKING);
        } else if (this.isSleeping) {
          this.playAnimation(this.IMAGES_SLEEP);
        } else {
          this.playAnimation(this.IMAGES_STAND);
        }
      }
    }, 85);
    this.animationIntervals.push(animInterval);
    return animInterval;
  }

  /**
   * Handles character death and triggers the appropriate animation.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.stopCurrentAnimation();
    soundManager.stop('backgroundMusic');
  }
}
