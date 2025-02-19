class ChickenSmall extends MovableObject {
    width = 60;
    height = 60;
    y = 360;
  isDead = false;

    IMAGES_WALKING = [
      'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ]
    IMAGES_DEAD = [
      'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
  
    constructor() {
      super().loadImage(this.IMAGES_WALKING[0]);
      this.loadImages(this.IMAGES_WALKING);
  
  
      this.x = -200 + Math.random() * 2500;
      this.speed = 0.2 + Math.random() * 0.5;
  
      this.animate();
    }
  
    
    animate() {
      setInterval(() => {
        this.moveLeft();
      }, 1000 / 60);
  
      setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING)
      }, 100);
    }
  }