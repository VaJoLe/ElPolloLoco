let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
      soundManager.play('buttonClickSound'); // Button-Klick-Sound
    });
  });
  
  document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none'; // Startbildschirm ausblenden
    document.getElementById('canvas-container').style.display = 'block';
  initLevel();
  // Spiel anzeigen
    startGame(); // Spiel starten
  });

  let fullscreenBtn = document.getElementById("fullscreenButton");


  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      // Falls noch kein Element im Fullscreen ist, wechsle in den Fullscreen-Modus:
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE11
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Falls bereits im Fullscreen, verlasse den Fullscreen-Modus:
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
      }
    }
  });

}

function startGame() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
  soundManager.play('backgroundMusic');
  // setupMobileControls();
  setupButtons();


  // Stelle sicher, dass die Clouds jetzt richtig animieren:
  world.level.clouds.forEach(cloud => cloud.animate());

  console.log('My character is', world.character);
  console.log('World instance:', World.instance); // ✅ Prüfen, ob die Instanz existiert

document.addEventListener('keydown', event => {
  if (event.code === 'Space' && World.instance?.isPaused) return; // 🛑 Keine Flaschen während der Pause werfen!
  keyboard[event.code] = true;
});

document.addEventListener('keyup', event => {
  if (event.code === 'Space' && World.instance?.isPaused) return;
  keyboard[event.code] = false;
});

window.addEventListener('keydown', () => {
  if (world && world.character) {
      world.character.resetIdleTimer();
  }
});


}

// ✅ Buttons sauber initialisieren
function setupButtons() {
  let restartBtn = document.getElementById("restartButton");
  let pauseBtn = document.getElementById("pauseButton");
  let pauseBtnImg = pauseBtn.querySelector("img");
  let muteIcon = document.getElementById('muteIcon');


  if (!restartBtn || !pauseBtn) {
    console.error("Fehler: Mindestens ein Button nicht gefunden!");
    return;
  }

  if (!pauseBtnImg) {
    console.error("Fehler: Pause-Button enthält kein <img>-Element!");
    return;
  }

  // 🟢 Restart-Button wieder sichtbar machen
  restartBtn.classList.remove("hidden");
  restartBtn.addEventListener("click", restartGame);

  // 🟢 Pause-Button klickbar machen
  pauseBtn.addEventListener("click", () => {
    if (World.instance && typeof World.instance.togglePause === "function") {
      World.instance.togglePause();

      // 🛑 Ändert das Bild im Button je nach Spielstatus
      pauseBtnImg.src = World.instance.isPaused
        ? "/buttons/play.svg" // Play-Icon
        : "/buttons/break.svg"; // Pause-Icon
    } else {
      console.error("Fehler: `World.instance` oder `togglePause()` ist nicht definiert.");
    }
  });

  muteButton.addEventListener('click', () => {
    let muteIcon = document.getElementById('muteIcon');

    soundManager.toggleMute(); // Schaltet den Ton um

    if (soundManager.muted) {
        muteIcon.src = "/buttons/mute.svg";  // Wechsel zu Mute-Icon
    } else {
        muteIcon.src = "/buttons/unmute.svg";  // Wechsel zu Unmute-Icon
    }
});

  
  
}

// 🟢 Funktion zum Neustarten des Spiels
function restartGame() {
  location.reload(); // Einfachste Methode: Seite neu laden
}

