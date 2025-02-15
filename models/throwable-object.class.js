class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ];
  IMAGES_SPLASH = [
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
  ];

  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.loadImages(this.IMAGES_ROTATION); // Bilder vorladen
    this.loadImages(this.IMAGES_SPLASH); // Bilder vorladen
    this.width = 100;
    this.height = 100;
    this.x = x;
    this.y = y;
    this.endboss = new Endboss();
    this.hitEndboss = false;
    this.throw();
    this.animate();
  }

  throw() {
    this.speedY = 20;
    this.applyGravity();

    let interval = setInterval(() => {
      this.x += 15; // Geschwindigkeit nach rechts
      if (this.isColliding(this.endboss)) {
        this.hitEndboss = true;
        this.stopGravity(); // Schwerkraft ausschalten
        clearInterval(interval); // Bewegung stoppen
      } else if (this.y > 400) {
        clearInterval(interval);
        // Wenn die Flasche den Boden erreicht
      }
    }, 25);
  }

  stopGravity() {
    this.speedY = 0;  // Geschwindigkeit auf 0 setzen, um Fallen zu stoppen
    this.acceleration = 0; // Keine weitere Gravitation anwenden
  }

  animate() {
    let splashAnimationInterval;
    setInterval(() => {
      if (this.hitEndboss) {
        this.y = this.endboss.y + this.endboss.height / 2; // Flasche bleibt auf Y-Höhe des Endbosses
        this.playAnimation(this.IMAGES_SPLASH);

        if (!splashAnimationInterval) {
          splashAnimationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_SPLASH);
            if (this.currentImage >= this.IMAGES_SPLASH.length - 1) {
              clearInterval(splashAnimationInterval);
              world.throwableObjects.splice(world.throwableObjects.indexOf(this), 1); // Flasche aus Array entfernen
            }
          }, 100);
        }
      } else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 50);
  }
}

// (this.x >= this.endboss.x + this.endboss.width / 2 - this.width / 2) {
  // this.x = this.endboss.x + this.endboss.width / 2 - this.width / 2;