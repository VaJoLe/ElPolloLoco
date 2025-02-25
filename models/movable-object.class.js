class MovableObject extends DrawableObject {
  speed = 0.2;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  lastHit = 0;

  energy = 100;
  bottle = 0;
  coin = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 130;
    }
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 30;
  }

  // kollidierung der charactere
  isColliding(obj) {
    return (
      this.x + this.width > obj.x &&
      this.y + this.height > obj.y &&
      this.x < obj.x + obj.width &&
      this.y < obj.y + obj.height
    );
  }


isCollidingYOnly(obj1, obj2) {
  let tolerance = 5; // Falls nötig, Toleranz für kleine Abweichungen

  return (
      obj1.x + obj1.width >= obj2.x && // Rechte Kante des Charakters trifft auf linke Kante der Münze
      obj1.x < obj2.x + obj2.width && // Sicherstellen, dass sich die Objekte wirklich überschneiden
      obj1.y <= obj2.y + tolerance && // Oberkante Charakter ≈ Oberkante Coin
      obj1.y + obj1.height >= obj2.y // Charakter berührt obere Kante der Münze
  );
}

  hit() {
    this.energy -= 2;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // difference in ms
    timepassed = timepassed / 1000; // difference in s
    return timepassed < 1;
  }

  isCollectCoin(){
    this.coin += 20;
  }

  isCollectBottle(){
    if (this.bottle < 100) { // 100 entspricht 5 Flaschen (jede Flasche = 20)
      this.bottle += 20;
    } 
  }
  
  
}
