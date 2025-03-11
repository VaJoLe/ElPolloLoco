class SoundManager {
  constructor() {
    this.sounds = {
      backgroundMusic: new Audio('audio/background.mp3'),
      throwSound: new Audio('audio/bottle1.mp3'),
      bottleBreakSound: new Audio('audio/bottle2.mp3'),
      buttonClickSound: new Audio('audio/button.mp3'),
      endbossDeadSound: new Audio('audio/finish.mp3'),
      jumpOnChickenSound: new Audio('audio/onTop.mp3'),
    };

    this.sounds.backgroundMusic.loop = true;
    this.muted = false;
  }

  play(sound) {
    if (this.sounds[sound] && !this.muted) {
      this.sounds[sound].currentTime = 0;
      this.sounds[sound].play();
    }
  }

  stop(sound) {
    if (this.sounds[sound]) {
      this.sounds[sound].pause();
      this.sounds[sound].currentTime = 0;
    }
  }

  toggleBackgroundMusic(paused) {
    if (paused) {
      this.sounds.backgroundMusic.volume = 0;
    } else if (!this.muted) {
      this.sounds.backgroundMusic.volume = 1;
    }
  }

  mute() {
    this.muted = true;
    for (let key in this.sounds) {
      this.sounds[key].volume = 0; // Statt pause() setzen wir die Lautstärke auf 0
    }
  }

  unmute() {
    this.muted = false;
    for (let key in this.sounds) {
      this.sounds[key].volume = 1; // Statt play() setzen wir die Lautstärke zurück
    }
  }

  toggleMute() {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }
}

const soundManager = new SoundManager();
