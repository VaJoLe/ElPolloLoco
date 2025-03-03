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

  console.log('My character is', world.character);
  console.log("World instance:", World.instance); // ✅ Prüfen, ob die Instanz existiert


  window.addEventListener('keydown', e => {
    if (e.keyCode == 39) {
      keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) {
      keyboard.LEFT = true;
    }
    if (e.keyCode == 38) {
      keyboard.UP = true;
    }
    if (e.keyCode == 40) {
      keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
      keyboard.SPACE = true;
    }
  });

  window.addEventListener('keyup', e => {
    if (e.keyCode == 39) {
      keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) {
      keyboard.LEFT = false;
    }
    if (e.keyCode == 38) {
      keyboard.UP = false;
    }
    if (e.keyCode == 40) {
      keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
      keyboard.SPACE = false;
    }
  });

}

document.addEventListener("DOMContentLoaded", () => {
  let restartBtn = document.getElementById("restartButton");
  // Button beim Laden der Seite direkt anzeigen
  restartBtn.classList.remove("hidden");
  // Event-Listener zum Neustarten des Spiels
  restartBtn.addEventListener("click", restartGame);

  let pauseBtn = document.getElementById("pauseButton");

    pauseBtn.addEventListener("click", () => {
        World.instance.togglePause(); // 🎮 Pausieren oder Fortsetzen des Spiels
        pauseBtn.innerText = World.instance.isPaused ? "Play" : "Pause"; // 🛠 Button-Text aktualisieren
    });
});

function restartGame() {
  location.reload(); // Einfachste Methode: Seite neu laden
}
