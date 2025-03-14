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
    this.gravityInterval = setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
    if (World.instance) {
      World.instance.allIntervals.push(this.gravityInterval);
    }
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

  isColliding(obj) {
    return (
      this.x + this.width > obj.x &&
      this.y + this.height > obj.y &&
      this.x < obj.x + obj.width &&
      this.y < obj.y + obj.height
    );
  }

  isCollidingYOnly(obj1, obj2) {
    let tolerance = 5;

    return (
      obj1.x + obj1.width >= obj2.x &&
      obj1.x < obj2.x + obj2.width &&
      obj1.y <= obj2.y + tolerance &&
      obj1.y + obj1.height >= obj2.y
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
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isCollectCoin() {
    this.coin += 20;
  }

  isCollectBottle() {
    if (this.bottle < 100) {
      this.bottle += 20;
    }
  }

  stopCurrentAnimation() {
    console.log('Stoppe Animationen für:', this);
    
    this.animationIntervals.forEach(interval => clearInterval(interval));
    this.animationIntervals = [];
}


}
