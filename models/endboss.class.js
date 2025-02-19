class Endboss extends MovableObject {
  width = 300;
  height = 400;
  y = 50;
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
  speed = 1;
  hitEndboss = false; // Neuer Zustand für Treffer
  lives = 4; // Der Endboss hat 4 Leben
  isDead = false; // Neue Variable, um erneute Treffer nach dem Tod zu verhindern

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 2600;

    this.animate();
  }

  gotHit() {
    if (this.isDead) return; // Falls der Endboss schon tot ist, passiert nichts mehr

    this.lives--;
    this.speed += 10;

    if (this.lives === 3) {
      // Beim ersten Treffer wird die Alert-Animation abgespielt
      this.playAlertAnimation();
    } else if (this.lives === 2) {
      // Attack-Animation läuft weiter
      this.playAttackAnimation();
    } else if (this.lives === 1) {
      // Hurt-Animation bei nur noch einem Leben
      this.playHurtAnimation();
    } else {
      // 0 Leben → Dead-Animation
      this.die();
    }
  }

  playAlertAnimation() {
    clearInterval(this.animationInterval);
    this.alertInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_ALERT);
    }, 100);
  }

  playAttackAnimation() {
    clearInterval(this.animationInterval);
    clearInterval(this.alertInterval);
    this.animationInterval = setInterval(() => {
      this.moveLeft(); // Endboss wird schneller

      this.playAnimation(this.IMAGES_ATTACK);
    }, 100);
  }

  playHurtAnimation() {
    this.currentImage = 0;
    clearInterval(this.animationInterval);
    let hurtInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_HURT);
      if (this.currentImage >= this.IMAGES_HURT.length) {
        clearInterval(hurtInterval);
        this.animationInterval = setInterval(() => {
          this.playAnimation(this.IMAGES_HURT);
        }, 100);
      }
    }, 100);
  }

  die() {
    if (this.isDead) return; // Falls die Animation schon lief, nicht nochmal abspielen
    this.isDead = true;

    this.currentImage = 0;
    clearInterval(this.animationInterval);
    let deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
      if (this.currentImage >= this.IMAGES_DEAD.length) {
        clearInterval(deadInterval);
        this.speed = 0; // Endboss bleibt stehen
      }
    }, 100);
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.lives > 3) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }
}
