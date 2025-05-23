/**
 * Manages all sound effects and background music in the game.
 * Allows playing, stopping, muting, and unmuting sounds.
 */
class SoundManager {
  /**
   * Creates a new SoundManager instance.
   * Initializes all game sounds and enables background music looping.
   */
  constructor() {
    /**
     * Object containing all game sounds mapped by their names.
     * @type {Object.<string, HTMLAudioElement>}
     */
    this.sounds = {
      backgroundMusic: new Audio('audio/background.mp3'),
      throwSound: new Audio('audio/bottle1.mp3'),
      bottleBreakSound: new Audio('audio/bottle2.mp3'),
      buttonClickSound: new Audio('audio/button.mp3'),
      endbossDeadSound: new Audio('audio/finish.mp3'),
      jumpOnChickenSound: new Audio('audio/onTop.mp3'),
      hit: new Audio('audio/hit.wav'),
      sleep: new Audio('audio/sleep.mp3'),
    };

    /**
     * Ensures the background music loops continuously.
     * @type {boolean}
     */
    this.sounds.backgroundMusic.loop = true;

    /**
     * Indicates whether all sounds are muted.
     * @type {boolean}
     */
    this.muted = false;

    /**
     * Ensures the sleep music loops continuously.
     * @type {boolean}
     */
    this.sounds.sleep.loop = true;
  }

  /**
   * Plays the specified sound if it exists and is not muted.
   * @param {string} sound - The name of the sound to play.
   */
  play(sound) {
    if (this.sounds[sound] && !this.muted) {
      this.sounds[sound].currentTime = 0;
      this.sounds[sound].play();
    }
  }

  /**
   * Stops the specified sound if it exists.
   * @param {string} sound - The name of the sound to stop.
   */
  stop(sound) {
    if (this.sounds[sound]) {
      this.sounds[sound].pause();
      this.sounds[sound].currentTime = 0;
    }
  }

  /**
   * Toggles the background music volume based on game state.
   * @param {boolean} paused - Whether the game is paused.
   */
  toggleBackgroundMusic(paused) {
    if (paused) {
      this.sounds.backgroundMusic.volume = 0;
    } else if (!this.muted) {
      this.sounds.backgroundMusic.volume = 1;
    }
  }

  /**
   * Mutes all sounds in the game.
   */
  mute() {
    this.muted = true;
    for (let key in this.sounds) {
      this.sounds[key].volume = 0;
    }
  }

  /**
   * Unmutes all sounds in the game, but only plays background music if the game is not paused.
   */
  unmute() {
    this.muted = false;
    localStorage.setItem('isMuted', 'false');
    for (let key in this.sounds) {
      this.sounds[key].volume = 1;
    }
    if (
      World.instance &&
      !World.instance.isPaused &&
      World.instance.character.isSleeping
    ) {
      this.sounds.sleep.play();
    } else {
      this.sounds.sleep.pause();
      this.sounds.sleep.currentTime = 0;
    }
    if (World.instance && !World.instance.isPaused) {
      this.sounds.backgroundMusic.play();
    } else {
      this.sounds.backgroundMusic.pause();
    }
  }

  /**
   * Toggles the mute state between muted and unmuted.
   */
  toggleMute() {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
      this.sounds.sleep.pause();
      this.sounds.sleep.currentTime = 0;
    }
  }

  /**
   * Toggles the sleep sound volume based on game state.
   * @param {boolean} paused - Whether the game is paused.
   */
  toggleSleepSound(paused) {
    if (this.sounds.sleep) {
      if (paused) {
        this.sounds.sleep.pause();
        this.sounds.sleep.currentTime = 0;
      } else if (World.instance?.character.isSleeping) {
        this.sounds.sleep.play();
      }
    }
  }
}

/**
 * Global instance of the SoundManager.
 */
const soundManager = new SoundManager();
