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
  spacePressed = false; // Verhindert mehrfaches Werfen beim Halten der Leertaste

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
    this.setupKeyboardListener(); // Event-Listener für Space hinzufügen
  }

  setupKeyboardListener() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space' && !this.spacePressed) {
        this.spacePressed = true;
        this.throwBottle();
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        this.spacePressed = false; // Taste losgelassen, erneutes Werfen möglich
      }
    });
  }

  throwBottle() {
    if (this.character.bottle > 0) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
      this.character.bottle -= 20; // Eine Flasche weniger
      this.statusbarBottle.setPercentage(this.character.bottle); // Statusbar aktualisieren
    }
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => enemy.world = this); // 👈 Jedes Huhn bekommt `world`
  }

  run() {
    setInterval(() => {
        this.checkSquash();  // 🥇 Erst prüfen, ob Gegner zerquetscht werden
        this.checkCollisions();  // 🥈 Danach erst normale Kollisionen prüfen
        this.collectCoins();
        this.collectBottles();
    }, 50);
}



checkSquash() {
  if (!this.character || this.character.isRemoved) return; // Falls Charakter entfernt wurde, keine Prüfung

  this.level.enemies.forEach(enemy => {
      if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead) {
          enemy.checkIfSquashed();
      }
  });
}



checkCollisions() {
  if (!this.character || this.character.isRemoved) return; // Falls Charakter entfernt wurde, keine Kollision prüfen

  this.level.enemies.forEach(enemy => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
          this.character.hit();
          this.statusbarHealth.setPercentage(this.character.energy);

          if (this.character.energy <= 0) { // Charakter stirbt, wenn Energie 0 ist
              this.character.die();
          }
      }
  });
}



collectCoins() {
  this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isCollidingYOnly(this.character, coin)) { // Prüft nur Y-Kollision
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
