class Clouds extends MovableObject {
  y = 20;
  height = 250;
  width = 500;
  moveInterval = null;

  constructor(imagePath, x) {
    super().loadImage(imagePath);

    this.x = x + Math.random() * 500;
    this.animate();
  }

  animate() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
    }

    this.moveInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);

    if (World.instance) {
      World.instance.allIntervals.push(this.moveInterval);
    }
  }
}
