class World {
  character = new Character();
  level = level1;
  ctx;
  canvas;
  keyboard;
  camera_x = 0;
  statusbarHealth = new StatusbarHealth();
  statusbarBottle = new StatusbarBottle();
  statusbarCoin = new StatusbarCoin();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => enemy.world = this); // 👈 Jedes Huhn bekommt `world`
  }

  run() {
    setInterval(() => {
      this.checkThrowableObjects();
      this.collectCoins();
      this.collectBottles()
      this.checkCollisons();
    }, 200);
    setInterval(() => {
      this.checkSquash();
    }, 100);
  
  }


  checkSquash() {
    this.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken && !enemy.isDead) {
        enemy.checkIfSquashed();
      }
    });
  }

  checkCollisons() {
    this.level.enemies.forEach(enemy => {
        if (!enemy.isDead && this.character.isColliding(enemy)) {
            this.character.hit();
            this.statusbarHealth.setPercentage(this.character.energy);
        }
    });
}



  checkThrowableObjects() {
    if (this.keyboard.SPACE && this.character.bottle > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
      this.character.bottle -= 20; // Eine Flasche weniger
      this.statusbarBottle.setPercentage(this.character.bottle); // Statusbar aktualisieren
  }

  }

  collectCoins() {
    this.level.coins = this.level.coins.filter(coin => {
        if (this.character.isColliding(coin)) {
            this.character.isCollectCoin();
            this.statusbarCoin.setPercentage(this.character.coin);
            return false; // Entfernt die Münze aus dem Array
        }
        return true; // Behält die Münze im Array
    });
  }

  collectBottles() {
    this.level.bottles = this.level.bottles.filter(bottle => {
        if (this.character.isColliding(bottle)) {
            this.character.isCollectBottle();
            this.statusbarBottle.setPercentage(this.character.bottle);
            return false; // Entfernt die Münze aus dem Array
        }
        return true; // Behält die Münze im Array
    });
  }


  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusbarHealth);
    this.addToMap(this.statusbarBottle);
    this.addToMap(this.statusbarCoin);

    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(object) {
    object.forEach(o => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);

    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    // folgende 3 Zeilen drehen das bild um die achse
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
