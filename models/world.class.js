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
  spacePressed = false; 
  static instance;
  allIntervals = []; 
  isPaused = false; 

  constructor(canvas, keyboard) {
    World.instance = this;
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.camera_x = 0;
    this.allIntervals = [];
    this._destroyed = false; // Flag, um den Zeichnungsloop zu stoppen
    this.isPaused = false;
    this.draw(); 
    this.setWorld();
    this.run();
    this.setupKeyboardListener();
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.stopAllIntervals(); 
      soundManager.toggleBackgroundMusic(true); 
    } else {
      this.resumeAllIntervals(); 
      soundManager.toggleBackgroundMusic(false); 
    }

    this.pauseThrowableObjects();
  }

  pauseThrowableObjects() {
    this.throwableObjects.forEach(bottle => {
      if (this.isPaused) {
        bottle.stopGravity();
      } else {
        bottle.acceleration = 2.5; 
        bottle.applyGravity();
      }
    });
  }

  stopAllIntervals() {
    console.log('Stoppe alle Intervalle. Anzahl vorher: ', this.allIntervals.length);

    this.allIntervals.forEach(interval => clearInterval(interval));
    this.allIntervals = [];

    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
    }

    console.log('Alle Intervalle gelöscht. Anzahl nachher: ', this.allIntervals.length);
}

  resumeAllIntervals() {
    // Nur starten, wenn KEINE Intervalle laufen!
    if (this.allIntervals.length > 0) {
      console.log('Es laufen bereits Intervalle. Kein erneutes Starten nötig.');
      return;
  }
    this.character.stopCurrentAnimation(); // ALLE bestehenden Animationen stoppen
    this.character.isAnimating = false; // Setze Animationsstatus zurück
    this.character.animate(); 
    this.level.enemies.forEach(enemy => {
      if (!enemy.isAnimating) { 
        console.log('Starte Animation für Gegner:', enemy);

        enemy.stopCurrentAnimation(); // ALTE Intervalle stoppen

          enemy.isAnimating = false;
          if (enemy instanceof Endboss && enemy.currentAnimationImages !== enemy.IMAGES_WALKING) {
              enemy.changeAnimation(enemy.currentAnimationImages);
          } else {
              enemy.animate(); 
          }
      }
  });
    this.level.clouds.forEach(cloud => cloud.animate()); // ▶️ Startet alle Gegner-Animationen neu
    this.level.bottles.forEach(bottle => bottle.animate()); // ▶️ Startet alle Gegner-Animationen neu
    this.level.coins.forEach(coin => coin.animate()); // ▶️ Startet alle Gegner-Animationen neu

    this.run(); // Starte die Bewegungsintervalle neu
    this.character.resetIdleTimer(); // <-- Setzt den Idle-Timer zurück

    console.log('Alle Bewegungsintervalle wieder gestartet.');
  }

  onKeyDown(event) {
    if (event.code === 'Space' && !this.spacePressed) {
      this.spacePressed = true;
      this.throwBottle();
    }
  }

  onKeyUp(event) {
    if (event.code === 'Space') {
      this.spacePressed = false;
    }
  }

  setupKeyboardListener() {
    this.boundKeyDown = this.onKeyDown.bind(this);
    this.boundKeyUp = this.onKeyUp.bind(this);

    document.addEventListener('keydown', this.boundKeyDown);
    document.addEventListener('keyup', this.boundKeyUp);
  }

  throwBottle() {
    if (this.isPaused) return; 

    if (this.character.bottle > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
      this.character.bottle -= 10; 
      this.statusbarBottle.setPercentage(this.character.bottle); 
      soundManager.play('throwSound'); 
    }
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach(enemy => (enemy.world = this)); 
  }

  run() {
    let intervalId = setInterval(() => {
      this.checkSquash(); 
      this.checkCollisions(); 
      this.collectCoins();
      this.collectBottles();
    }, 50);
    this.allIntervals.push(intervalId);
  }

  checkSquash() {
    if (!this.character || this.character.isRemoved) return;
    this.level.enemies.forEach(enemy => {
      if (
        (enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
        !enemy.isDead
      ) {
        enemy.checkIfSquashed();
      }
    });
  }

  checkCollisions() {
    if (!this.character || this.character.isRemoved) return; 

    this.level.enemies.forEach(enemy => {
      if (!enemy.isDead && this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusbarHealth.setPercentage(this.character.energy);

        if (this.character.energy <= 0) {
          this.character.die();
        }
      }
    });
  }

  collectCoins() {
    this.level.coins = this.level.coins.filter(coin => {
      if (this.character.isCollidingYOnly(this.character, coin)) {
        // Prüft nur Y-Kollision
        this.character.isCollectCoin();
        this.statusbarCoin.setPercentage(this.character.coin);
        return false;
      }
      return true; 
    });
  }

  collectBottles() {
    this.level.bottles = this.level.bottles.filter(bottle => {
      if (this.character.isColliding(bottle)) {
        this.character.isCollectBottle();
        this.statusbarBottle.setPercentage(this.character.bottle);
        return false; 
      }
      return true; 
    });
  }

  draw() {
    this.drawContent();

    if (this.character.isDead) {
      this.ctx.drawImage(this.character.gameOverImage, 0, 0, 720, 480);
    }

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }
  
  drawContent(){
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

  // Neue Methode zum Zerstören der Welt
  destroy() {
    this._destroyed = true;
    this.stopAllIntervals();
    // Entferne die Keyboard-Listener, die wir in setupKeyboardListener hinzugefügt haben:
    if (this.boundKeyDown) {
      document.removeEventListener('keydown', this.boundKeyDown);
    }
    if (this.boundKeyUp) {
      document.removeEventListener('keyup', this.boundKeyUp);
    }
    console.log('Welt zerstört.');
  }
}

