class Bottle extends MovableObject {
  width = 100;
  height = 100;
  y = 300;
  x = -400;
  animationInterval = null; // 🛑 Speichert das aktuelle Intervall
  IMAGES_BOTTLE = [
    'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_BOTTLE[0]);
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = -200 + Math.random() * 2200;

    this.animate();
  }

  animate() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval); // 🛑 Stoppt das alte Intervall, falls es existiert
    }

    this.animationInterval = setInterval(() => {
      if (World.instance && !World.instance.isPaused) { 
        this.playAnimation(this.IMAGES_BOTTLE);
      }
    }, 150);

    if (World.instance) {
      World.instance.allIntervals.push(this.animationInterval);
    }
  }
}
