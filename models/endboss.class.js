/**
 * Represents the final boss enemy in the game.
 * The Endboss moves, attacks, and reacts to hits with different animations.
 * Inherits from `MovableObject`.
 */
class Endboss extends MovableObject {
  /**
 * Global variables for the endboss.
 */
  width = 300;
  height = 400;
  y = 50;
  speed = 5;
  lives = 4;
  isDead = false;
  isAnimating = false;

  /**
   * Stores the current animation images based on the Endboss's state.
   * @type {string[]}
   */
  currentAnimationImages = this.IMAGES_WALKING;

  /**
   * Image paths for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];

  /**
   * Image paths for the alert animation.
   * This animation is triggered when the Endboss takes the first hit.
   * @type {string[]}
   */
  IMAGES_ALERT = [
    'img/4_enemie_boss_chicken/2_alert/G5.png',
    'img/4_enemie_boss_chicken/2_alert/G6.png',
    'img/4_enemie_boss_chicken/2_alert/G7.png',
    'img/4_enemie_boss_chicken/2_alert/G8.png',
    'img/4_enemie_boss_chicken/2_alert/G9.png',
    'img/4_enemie_boss_chicken/2_alert/G10.png',
    'img/4_enemie_boss_chicken/2_alert/G11.png',
    'img/4_enemie_boss_chicken/2_alert/G12.png',
  ];

  /**
   * Image paths for the attack animation.
   * This animation is triggered when the Endboss becomes more aggressive.
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    'img/4_enemie_boss_chicken/3_attack/G13.png',
    'img/4_enemie_boss_chicken/3_attack/G14.png',
    'img/4_enemie_boss_chicken/3_attack/G15.png',
    'img/4_enemie_boss_chicken/3_attack/G16.png',
    'img/4_enemie_boss_chicken/3_attack/G17.png',
    'img/4_enemie_boss_chicken/3_attack/G18.png',
    'img/4_enemie_boss_chicken/3_attack/G19.png',
    'img/4_enemie_boss_chicken/3_attack/G20.png',
  ];

  /**
   * Image paths for the hurt animation.
   * This animation is triggered when the Endboss is close to defeat.
   * @type {string[]}
   */
  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];

  /**
   * Image paths for the death animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  /**
   * Creates a new Endboss instance and loads animations.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2600;

    this.animationIntervals = [];
    this.animate();
  }

  /**
   * Starts the walking animation for the Endboss.
   */
  animate() {
    this.stopCurrentAnimation();
    if (this.isAnimating) return;

    this.isAnimating = true;

    let interval = setInterval(() => {
      if (!World.instance?.isPaused && !this.isDead) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);

    this.animationIntervals.push(interval);
    if (World.instance) World.instance.allIntervals.push(interval);
  }

  /**
   * Handles the logic when the Endboss is hit.
   * Changes animation and increases speed as health decreases.
   */
  gotHit() {
    if (this.isDead) return;

    this.lives--;
    this.speed += 10;

    if (this.lives === 3) {
      this.currentAnimationImages = this.IMAGES_ALERT;
      this.changeAnimation(this.IMAGES_ALERT);
    } else if (this.lives === 2) {
      this.currentAnimationImages = this.IMAGES_ATTACK;
      this.changeAnimation(this.IMAGES_ATTACK);
    } else if (this.lives === 1) {
      this.currentAnimationImages = this.IMAGES_HURT;
      this.changeAnimation(this.IMAGES_HURT);
    } else {
      this.die();
    }
  }

  /**
   * Changes the animation of the Endboss to the specified set of images.
   * @param {string[]} images - The new animation images.
   */
  changeAnimation(images) {
    if (!images || images.length === 0) return;

    this.stopCurrentAnimation();
    let animInterval = setInterval(() => {
      if (!World.instance?.isPaused && !this.isDead) {
        if (images === this.IMAGES_ATTACK) {
          this.moveLeft();
        }
        this.playAnimation(images);
      }
    }, 100);

    this.animationIntervals.push(animInterval);
    if (World.instance) World.instance.allIntervals.push(animInterval);
  }

  /**
   * Triggers the death sequence of the Endboss.
   * Stops all current animations and plays the death animation.
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.stopCurrentAnimation();

    soundManager.play('endbossDeadSound');
    this.deadIntervalEndboss();
    
    setTimeout(() => {
      if (World.instance) {
        World.instance.togglePause(); // Pausiere die Welt nach 3 Sekunden
        document.getElementById('win-screen').classList.remove('hidden'); // Zeige den Win-Screen
        soundManager.stop('backgroundMusic');
      }
  }, 3000); // 3 Sekunden Verzögerung
  }

  /**
   * Plays the Endboss's death animation.
   * Stops the animation once the last frame is reached.
   */
  deadIntervalEndboss() {
    this.currentImage = 0;
    let deadInterval = setInterval(() => {
      if (!World.instance?.isPaused) {
        this.playAnimation(this.IMAGES_DEAD);
      }
      if (this.currentImage >= this.IMAGES_DEAD.length) {
        this.currentImage = this.IMAGES_DEAD.length;
        clearInterval(deadInterval);
      }
    }, 100);

    this.animationIntervals.push(deadInterval);
    if (World.instance) World.instance.allIntervals.push(deadInterval);
  }

  /**
   * Stops all current animation intervals.
   */
  stopCurrentAnimation() {
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals = [];
  }
}
