let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none'; // Startbildschirm ausblenden
    document.getElementById('canvas').style.display = 'block'; // Spiel anzeigen
    startGame(); // Spiel starten
  });
}

function startGame() {
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
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


}

// ✅ Buttons sauber initialisieren
function setupButtons() {
  let restartBtn = document.getElementById("restartButton");
  let pauseBtn = document.getElementById("pauseButton");
  let fullscreenBtn = document.getElementById("fullscreenButton");
  let pauseBtnImg = document.querySelector("#pauseButton img");

  if (!restartBtn || !pauseBtn || !fullscreenBtn) {
    console.error("Fehler: Mindestens ein Button nicht gefunden!");
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

  // 🟢 Fullscreen-Button aktivieren
  fullscreenBtn.addEventListener("click", () => {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen(); // Safari
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen(); // IE11
    }
  });
}

// 🟢 Funktion zum Neustarten des Spiels
function restartGame() {
  location.reload(); // Einfachste Methode: Seite neu laden
}




