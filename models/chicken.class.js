class Chicken extends MovableObject {
  width = 80;
  height = 90;
  y = 330;
  isDead = false;
  IMAGES_WALKING = [
    'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
  ];
  IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.imageCache[this.IMAGE_DEAD] = new Image();
    this.imageCache[this.IMAGE_DEAD].src = this.IMAGE_DEAD;

    this.x = -200 + Math.random() * 2500;
    this.speed = 0.2 + Math.random() * 0.5;

    this.animate();
  }

  animate() {
    let moveChickenInterval = setInterval(() => {
        if (!this.isDead && World.instance && !World.instance.isPaused) {
            this.moveLeft();
        }
    }, 1000 / 60);

    let animationInterval = setInterval(() => {
        if (!this.isDead && World.instance && !World.instance.isPaused) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 100);

    // 🟢 Nur speichern, wenn `World.instance` existiert!
    if (World.instance) {
        World.instance.allIntervals.push(moveChickenInterval);
        World.instance.allIntervals.push(animationInterval);
    }
}



  checkIfSquashed() {
    if (!this.world || this.isDead || !this.world.character.isColliding(this))
      return;

    let char = this.world.character;
    let isAbove =
      char.y + char.height - 10 >= this.y - 5 &&
      char.y + char.height - 10 <= this.y + 15;
    let isFalling = char.speedY < 0;
    let isCentered =
      Math.abs(char.x + char.width / 2 - (this.x + this.width / 2)) <
      this.width / 2 + 40;

    if (isAbove && isFalling && isCentered) {
      this.die();
      char.speedY = 15; // Charakter springt leicht nach Zerquetschen
    }
  }

  die() {
    this.isDead = true;
    this.img = this.imageCache[this.IMAGE_DEAD];
    this.speed = 0; // Stoppt Bewegung
    this.y = 350;
  }
}
