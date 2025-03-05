class Coin extends MovableObject {
  width = 150;
  height = 150;
  y = 80;
  x = -500;
  IMAGES_COIN = ['img/8_coin/coin_1.png', 'img/8_coin/coin_2.png'];
  playInterval = null;

  constructor() {
    super().loadImage(this.IMAGES_COIN[0]);
    this.loadImages(this.IMAGES_COIN);
    this.x = -200 + Math.random() * 2200;

    this.animate();
  }

  animate() {
    if (this.playInterval) {
      clearInterval(this.playInterval);
    }

    this.playInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 150);

    if (World.instance) {
      World.instance.allIntervals.push(this.playInterval);
    }
  }
}
