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

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 2700;

    this.animate();
  }

  gotHit() {
    this.lives--; // Ein Leben abziehen
    this.speed += 0.5; // Endboss wird schneller

    if (this.lives > 2) {
        // Bei 4 & 3 Leben bleibt Attack-Animation aktiv
        this.playAnimation(this.IMAGES_ATTACK);
    } else if (this.lives > 0) {
        // Bei 2 & 1 Leben: Hurt-Animation einmal abspielen, dann stoppen
        this.playAnimation(this.IMAGES_HURT);
    } else {
        // Bei 0 Leben: Dead-Animation abspielen und Bewegung stoppen
        this.die();
    }
}

die() {
    this.playAnimation(this.IMAGES_DEAD);
    this.speed = 0; // Endboss bleibt stehen
}

animate() {
    setInterval(() => {
        if (this.lives > 2) {
            this.moveLeft();
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 200);
}

}
