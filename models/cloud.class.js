class Clouds extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  constructor(imagePath, x) {
    super().loadImage(imagePath);

    this.x = x + Math.random() * 500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}