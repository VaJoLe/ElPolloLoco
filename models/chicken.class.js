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
  if (this.world && this.world.character.isColliding(this)) {
      let char = this.world.character;

      let charFeet = char.y + char.height; // Unterkante des Charakters
      let chickenTop = this.y; // Oberkante des Chickens
      let charMidX = char.x + char.width / 2; // Mittelpunkt des Charakters auf der X-Achse
      let chickenMidX = this.x + this.width / 2; // Mittelpunkt des Chickens auf der X-Achse
      let isAbove = charFeet > chickenTop - 5 && charFeet < chickenTop + 20; // Mehr Spielraum!
      let isFalling = char.speedY < 0; // Charakter muss fallen
      let isCentered = Math.abs(charMidX - chickenMidX) < (char.width / 2 + this.width / 2) / 2; // Größerer Bereich

      console.log("🐔 --- Kollisionsprüfung ---");
      console.log("➡ Charakter-Position:", { x: char.x, y: char.y });
      console.log("➡ Chicken-Position:", { x: this.x, y: this.y });
      console.log("➡ Charakter-Füße:", charFeet, " | Chicken-Kopf:", chickenTop);
      console.log("➡ Ist genau auf Chicken:", isAbove);
      console.log("➡ Charakter fällt:", isFalling, " (SpeedY:", char.speedY, ")");
      console.log("➡ Mittig über Chicken:", isCentered);
      console.log("----------------------");

      if (isAbove && isFalling && isCentered) {  
          console.log("✅ Huhn zerquetscht!");
          this.die();
          char.jump(); // Charakter springt leicht nach Zerquetschen
      } else {
          console.log("❌ Kein Zerquetschen erkannt.");
      }
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


