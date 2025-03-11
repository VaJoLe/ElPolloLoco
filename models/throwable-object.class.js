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
    'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ];

  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.loadImages(this.IMAGES_ROTATION); // Bilder vorladen
    this.loadImages(this.IMAGES_SPLASH); // Bilder vorladen
    this.width = 100;
    this.height = 100;
    this.x = x;
    this.y = y;
    this.hitEndboss = false;
    this.throw();
    //this.animate();
  }

  throw() {
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
    }

    this.speedY = 10;
    this.applyGravity();

    this.throwInterval = setInterval(() => {
      if (World.instance?.isPaused) return; // 🛑 Flasche bleibt in der Luft stehen, wenn pausiert

      this.x += 15;
      this.playAnimation(this.IMAGES_ROTATION); // ✅ Rotation weiterlaufen lassen
      let enemies = World.instance.level.enemies; // Alle Gegner im Level holen

      enemies.forEach(enemy => {
          if (enemy instanceof Chicken || enemy instanceof ChickenSmall) {
              if (this.isColliding(enemy)) {
                  enemy.die(); // 💀 Chicken stirbt
                  this.stopGravity();
                  clearInterval(this.throwInterval);
                  this.splash();
              }
          }
      });
  
      let endboss = enemies.find(enemy => enemy instanceof Endboss);
  

      if (endboss && this.x >= endboss.x + endboss.width / 2 - this.width / 2) {
        endboss.gotHit();
        this.stopGravity();
        clearInterval(this.throwInterval);
        this.splash();
      } else if (this.y > 400) {
        clearInterval(this.throwInterval);
      }
    }, 25);

    // if (World.instance) {
    //   World.instance.allIntervals.push(this.throwInterval);
    // }
  }

  stopGravity() {
    this.speedY = 0;
    this.acceleration = 0;
  }

  splash() {
    soundManager.play('bottleBreakSound'); // Zerbrechender Flaschensound

    this.currentImage = 0; // Wichtig: Animation zurücksetzen!

    let splashAnimationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_SPLASH); // Nutzt die vorhandene Methode

      // Prüfe, ob die Animation am Ende ist:
      if (this.currentImage >= this.IMAGES_SPLASH.length) {
        clearInterval(splashAnimationInterval); // Stoppt die Animation
        world.throwableObjects = world.throwableObjects.filter(
          obj => obj !== this
        ); // Entfernen
      }
    }, 100);
  }
}
