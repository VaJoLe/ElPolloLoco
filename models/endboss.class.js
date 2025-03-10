class Endboss extends MovableObject {
  width = 300;
  height = 400;
  y = 50;
  speed = 1;
  lives = 4;
  isDead = false;
  isAnimating = false;
  currentAnimationImages = this.IMAGES_WALKING; // Standard-Zustand


  IMAGES_WALKING = [
    'img/4_enemie_boss_chicken/1_walk/G1.png',
    'img/4_enemie_boss_chicken/1_walk/G2.png',
    'img/4_enemie_boss_chicken/1_walk/G3.png',
    'img/4_enemie_boss_chicken/1_walk/G4.png',
  ];
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
  IMAGES_HURT = [
    'img/4_enemie_boss_chicken/4_hurt/G21.png',
    'img/4_enemie_boss_chicken/4_hurt/G22.png',
    'img/4_enemie_boss_chicken/4_hurt/G23.png',
  ];
  IMAGES_DEAD = [
    'img/4_enemie_boss_chicken/5_dead/G24.png',
    'img/4_enemie_boss_chicken/5_dead/G25.png',
    'img/4_enemie_boss_chicken/5_dead/G26.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2600;

    this.animationIntervals = []; // Speichert alle Intervalle
    this.animate();
  }

  animate() {
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

  changeAnimation(images) {
    if (!images || images.length === 0) return; // 🛑 Verhindert den Fehler


    this.stopCurrentAnimation();
  let animInterval = setInterval(() => {
    if (!World.instance?.isPaused && !this.isDead) {
      // Wenn es sich um die Angriff-Animation handelt, bewegt sich der Endboss vorwärts
      if (images === this.IMAGES_ATTACK) {
        this.moveLeft();
      }
      this.playAnimation(images);
    }
  }, 100);

    this.animationIntervals.push(animInterval);
    if (World.instance) World.instance.allIntervals.push(animInterval);
      
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.stopCurrentAnimation();

    let deadInterval = setInterval(() => {
      if (!World.instance?.isPaused) {
        this.playAnimation(this.IMAGES_DEAD);
      }
      if (this.currentImage >= this.IMAGES_DEAD.length - 1) {
        clearInterval(deadInterval);
        this.speed = 0;
      }
    }, 100);

    this.animationIntervals.push(deadInterval);
    if (World.instance) World.instance.allIntervals.push(deadInterval);
  }

  stopCurrentAnimation() {
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals = [];
  }
}
