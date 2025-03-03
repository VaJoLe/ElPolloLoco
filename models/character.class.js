class Character extends MovableObject {
  x = -620;
  y = 130;
  height = 300;
  width = 130;
  speed = 10;
  IMAGES_STAND = [
    'img/2_character_pepe/1_idle/idle/I-1.png',
    'img/2_character_pepe/1_idle/idle/I-2.png',
    'img/2_character_pepe/1_idle/idle/I-3.png',
    'img/2_character_pepe/1_idle/idle/I-4.png',
    'img/2_character_pepe/1_idle/idle/I-5.png',
    'img/2_character_pepe/1_idle/idle/I-6.png',
    'img/2_character_pepe/1_idle/idle/I-7.png',
    'img/2_character_pepe/1_idle/idle/I-8.png',
    'img/2_character_pepe/1_idle/idle/I-9.png',
    'img/2_character_pepe/1_idle/idle/I-10.png',
  ];
  IMAGES_WALKING = [
    '/img/2_character_pepe/2_walk/W-21.png',
    '/img/2_character_pepe/2_walk/W-22.png',
    '/img/2_character_pepe/2_walk/W-23.png',
    '/img/2_character_pepe/2_walk/W-24.png',
    '/img/2_character_pepe/2_walk/W-25.png',
    '/img/2_character_pepe/2_walk/W-26.png',
  ];
  IMAGES_JUMPING = [
    'img/2_character_pepe/3_jump/J-31.png',
    'img/2_character_pepe/3_jump/J-32.png',
    'img/2_character_pepe/3_jump/J-33.png',
    'img/2_character_pepe/3_jump/J-34.png',
    'img/2_character_pepe/3_jump/J-35.png',
    'img/2_character_pepe/3_jump/J-36.png',
    'img/2_character_pepe/3_jump/J-37.png',
    'img/2_character_pepe/3_jump/J-38.png',
    'img/2_character_pepe/3_jump/J-39.png',
  ];
  IMAGES_DEAD = [
    'img/2_character_pepe/5_dead/D-51.png',
    'img/2_character_pepe/5_dead/D-52.png',
    'img/2_character_pepe/5_dead/D-53.png',
    'img/2_character_pepe/5_dead/D-54.png',
    'img/2_character_pepe/5_dead/D-55.png',
    'img/2_character_pepe/5_dead/D-56.png',
    'img/2_character_pepe/5_dead/D-57.png',
  ];
  IMAGES_HURT = [
    'img/2_character_pepe/4_hurt/H-41.png',
    'img/2_character_pepe/4_hurt/H-42.png',
    'img/2_character_pepe/4_hurt/H-43.png',
  ];

  world;
  animationSpeed;
  lastInputTime = new Date().getTime();
  isDead = false;
  deadAnimationPlayed = false; // Flag, ob die Dead-Animation bereits abgespielt wurde

  constructor() {
    super().loadImage('/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_STAND);
    this.applyGravity();
    this.gameOverImage = new Image();
    this.gameOverImage.src =
      'img/9_intro_outro_screens/game_over/oh no you lost!.png';

    this.animate();
  }

  animate() {
    let moveCharacterInterval = setInterval(() => {
        if (!this.isDead && this.world && World.instance && !World.instance.isPaused) {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (this.world.keyboard.LEFT && this.x > -620) {
                this.moveLeft();
                this.otherDirection = true;
            }
            if (this.world.keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }

            this.world.camera_x = -this.x + 90;
        }
    }, 1000 / 60);

    let playAnimationInterval = setInterval(() => {
        if (this.isDead || (World.instance && World.instance.isPaused)) return; // 🛑 Stoppt Animationen während Pause

        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (
            (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) &&
            !this.isAboveGround()
        ) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_STAND);
        }
    }, 85);

    if (World.instance) {
        World.instance.allIntervals.push(moveCharacterInterval);
        World.instance.allIntervals.push(playAnimationInterval);
    }
}


die() {
  if (this.isDead) return;
  this.isDead = true;
  this.deadAnimationPlayed = true;

  this.currentImage = 0;
  clearInterval(this.animationInterval);

  let deadInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
      if (this.currentImage >= this.IMAGES_DEAD.length - 1) {
          clearInterval(deadInterval);
          this.startFalling();
      }
  }, 100);

  // 🟢 Nur speichern, wenn `World.instance` existiert!
  if (World.instance) {
      World.instance.allIntervals.push(deadInterval);
  }
}


startFalling() {
  let fallInterval = setInterval(() => {
      this.y += 20;
      if (this.y > 600) {
          clearInterval(fallInterval);
          this.removeCharacter();
      }
  }, 30);

  // 🟢 Nur speichern, wenn `World.instance` existiert!
  if (World.instance) {
      World.instance.allIntervals.push(fallInterval);
  }

  let restartBtn = document.getElementById('restartButton');
  restartBtn.classList.add('game-over-btn');
  restartBtn.addEventListener('click', restartGame);
}


  removeCharacter() {
    this.isRemoved = true; // Setzt eine Flag, damit keine Kollisionen mehr geprüft werden
  }
}
