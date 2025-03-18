/**
 * Represents the main playable character in the game.
 * Inherits from `MovableObject` and includes animations, movement, and interactions.
 */
class Character extends MovableObject {
  /**
   * Global variables for the character.
   */
  x = -620;
  y = 130;
  height = 300;
  width = 130;
  speed = 10;
  isDead = false;
  isAnimating = false;
  idleTime = 0;
  sleepTimeout = null;
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
    this.gameOverImage.src =
      'img/9_intro_outro_screens/game_over/oh no you lost!.png';

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
    let moveInterval = this.characterMove();
    this.animationIntervals.push(moveInterval);
    return moveInterval;
  }

  /**
 * Controls the movement of the character based on keyboard input.
 * Handles right movement, left movement, jumping, and camera tracking.
 */
characterMove() {
  setInterval(() => {
    if (!World.instance?.isPaused && !this.isDead && this.world) {
      if (this.characterMoving()) {
        this.resetIdleTimer();
      }
      if (this.characterMoveRight()) {
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
}

/**
* Checks if the character is moving based on keyboard input.
* @returns {boolean} True if the character is moving (pressing LEFT, RIGHT, or UP), otherwise false.
*/
characterMoving() {
  return (
    this.world.keyboard.RIGHT ||
    this.world.keyboard.LEFT ||
    this.world.keyboard.UP
  );
}

/**
* Checks if the character is allowed to move right.
* @returns {boolean} True if the character can move right, otherwise false.
*/
characterMoveRight() {
  return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
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
   * Handles the character's death.
   * Stops the current animation and starts the death animation.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.stopCurrentAnimation();

    let deadInterval = this.deadIntervalCharacter();

    soundManager.stop('backgroundMusic');

    this.animationIntervals.push(deadInterval);
    if (World.instance) World.instance.allIntervals.push(deadInterval);
  }

  /**
   * Plays the death animation and triggers the falling motion after animation ends.
   */
  deadIntervalCharacter() {
    setInterval(() => {
      if (!World.instance?.isPaused) {
        this.playAnimation(this.IMAGES_DEAD);
      }
      if (this.currentImage >= this.IMAGES_DEAD.length - 1) {
        clearInterval(this);
        this.startFalling();
        this.showRestartButton();
      }
    }, 100);
  }

  /**
   * Makes the character fall after death until it disappears from the screen.
   */
  startFalling() {
    let fallInterval = setInterval(() => {
      if (!World.instance?.isPaused) {
        this.y += 20;
        if (this.y > 600) {
          clearInterval(fallInterval);
        }
      }
    }, 30);

    this.animationIntervals.push(fallInterval);
    if (World.instance) World.instance.allIntervals.push(fallInterval);
    this.removeCharacter();
  }

  /**
   * Stops all active animation intervals for the character.
   */
  stopCurrentAnimation() {
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals = [];
  }

  /**
   * Displays the restart button when the game is over.
   */
  showRestartButton() {
    let gameOverRestartBtn = document.getElementById('gameOverRestartButton');
    gameOverRestartBtn.classList.remove('hidden'); // Neuer Button im Game-Over-Screen
  }

  /**
   * Removes the character from the game world after death.
   */
  removeCharacter() {
    this.isRemoved = true;
  }

  /**
   * Starts an idle timer that puts the character into sleep mode after 15 seconds of inactivity.
   */
  startIdleTimer() {
    this.sleepTimeout = setTimeout(() => {
      this.isSleeping = true;
    }, 15000);
  }

  /**
   * Resets the idle timer when the character moves, preventing sleep mode.
   */
  resetIdleTimer() {
    clearTimeout(this.sleepTimeout);
    this.isSleeping = false;
    this.startIdleTimer();
  }
}
