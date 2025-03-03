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
    this.endboss = new Endboss();
    this.hitEndboss = false;
    this.throw();
    //this.animate();
  }

  throw() {
    this.speedY = 20;
    this.applyGravity();

    let interval = setInterval(() => {
      if (!this.hitEndboss) {
        this.x += 15; // Flasche fliegt nach rechts
        this.playAnimation(this.IMAGES_ROTATION);

        // Endboss dynamisch aus der Gegnerliste abrufen
        let endboss = world.level.enemies.find(enemy => enemy instanceof Endboss);

        // Prüfen, ob die Flasche in der Mitte des Endboss ist
        if (endboss && this.x >= endboss.x + endboss.width / 2 - this.width / 2) {
          endboss.gotHit(); // Endboss-Status ändern
          this.stopGravity();
          clearInterval(interval); // Bewege die Flasche nicht weiter
          this.splash();
        }
      } else if (this.y > 400) {
        clearInterval(interval); // Falls die Flasche den Boden erreicht
      }
    }, 25);
    World.instance.allIntervals.push(interval); // 🟢 Speichert das Intervall

}


  stopGravity() {
    this.speedY = 0;
    this.acceleration = 0;
  }

  splash() {
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
