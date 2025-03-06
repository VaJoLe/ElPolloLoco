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

  // Stelle sicher, dass die Clouds jetzt richtig animieren:
  world.level.clouds.forEach(cloud => cloud.animate());

  console.log('My character is', world.character);
  console.log('World instance:', World.instance); // ✅ Prüfen, ob die Instanz existiert

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

document.addEventListener('DOMContentLoaded', () => {
  let restartBtn = document.getElementById('restartButton');
  // Button beim Laden der Seite direkt anzeigen
  restartBtn.classList.remove('hidden');
  // Event-Listener zum Neustarten des Spiels
  restartBtn.addEventListener('click', restartGame);
});

document.addEventListener('DOMContentLoaded', () => {
  let pauseBtn = document.getElementById('pauseButton');

  pauseBtn.addEventListener('click', () => {
    if (World.instance && typeof World.instance.togglePause === 'function') {
      World.instance.togglePause();
      pauseBtn.innerText = World.instance.isPaused ? 'Play' : 'Pause';
    } else {
      console.error(
        'Fehler: `World.instance` oder `togglePause()` ist nicht definiert.'
      );
    }
  });
});

document.addEventListener('keydown', event => {
  if (event.code === 'Space' && World.instance?.isPaused) return; // 🛑 Keine Flaschen während der Pause werfen!
  keyboard[event.code] = true;
});

document.addEventListener('keyup', event => {
  if (event.code === 'Space' && World.instance?.isPaused) return;
  keyboard[event.code] = false;
});

function restartGame() {
  location.reload(); // Einfachste Methode: Seite neu laden
}

document.addEventListener("DOMContentLoaded", function() {
  const fullscreenButton = document.getElementById("fullscreenButton");
  const canvas = document.getElementById("canvas"); // Hole das Canvas-Element

  if (fullscreenButton && canvas) {
    fullscreenButton.addEventListener("click", function() {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if (canvas.webkitRequestFullscreen) { // Für Safari
        canvas.webkitRequestFullscreen();
      } else if (canvas.msRequestFullscreen) { // Für IE11
        canvas.msRequestFullscreen();
      }
    });
  } else {
    console.error("Button 'fullscreenButton' oder Canvas nicht gefunden!");
  }
});

