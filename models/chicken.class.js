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
    setInterval(() => {
        if (!this.isDead) {
            this.moveLeft();
        }
    }, 1000 / 60);

    setInterval(() => {
        if (!this.isDead) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }, 100);
}

checkIfSquashed() {
  let char = this.world.character;
  
  let charBottom = char.y + char.height;
  let chickenTop = this.y;

  let charXRight = char.x + char.width;
  let charXLeft = char.x;
  let chickenXRight = this.x + this.width;
  let chickenXLeft = this.x;

  let horizontalCollision = charXRight > chickenXLeft && charXLeft < chickenXRight;
  let verticalCollision = charBottom >= chickenTop && char.speedY < 0;

  if (horizontalCollision && verticalCollision) {
      this.die();
      char.y = this.y - char.height; // Charakter landet exakt auf Huhn
      char.jump(); // Charakter springt leicht nach Zerquetschen
  }
}


die() {
  this.isDead = true;
  this.img = this.imageCache[this.IMAGE_DEAD]; 
  this.speed = 0; // Stoppt Bewegung
}
}


  //   checkIfSquashed() {
  //     if (this.world && this.world.character.isColliding(this)) {
  //         let char = this.world.character;

  //         let charBottom = char.y + char.height;
  //         let chickenTop = this.x;
  //         let isAbove = charBottom - 15 < chickenTop; // Puffer für realistischere Kollision

  //         console.log("🐔 Kollisionsprüfung: ", {
  //             charBottom,
  //             chickenTop,
  //             isAbove,
  //             speedY: char.speedY
  //         });

  //         if (isAbove && char.speedY < 0) {
  //             console.log("✅ Huhn zerquetscht!");
  //             this.die();
  //             char.jump(); // Charakter springt leicht nach Zerquetschen
  //         }
  //     }
  // }


