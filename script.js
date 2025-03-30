// Variables globales
let turn = 1;
let round = 1;
let scores = [0, 0];
let rolls = [0, 0];
let bestScore = localStorage.getItem("bestScore") || 0;
let playerNames = ["Jugador 1", "Jugador 2"];
const diceSound = new Audio("dice-roll.mp3"); // Sonido de lanzamiento

// Función para lanzar el dado
function lanzarDado() {
    if (round > 3) return; // Si ya jugaron 3 rondas, no hacer nada

    let currentPlayer = turn % 2 === 1 ? 0 : 1;
    let diceRoll = Math.floor(Math.random() * 6) + 1;
    let diceElement = document.getElementById(`dice${currentPlayer + 1}`);

    diceSound.play(); // Reproduce el sonido
    diceElement.classList.add("rolling");

    setTimeout(() => {
        diceElement.classList.remove("rolling");
        actualizarDados(diceElement, diceRoll);
        actualizarHistorial(currentPlayer, diceRoll);
    }, 1000);

    scores[currentPlayer] += diceRoll;
    rolls[currentPlayer]++;
    document.getElementById(`score${currentPlayer + 1}`).innerText = scores[currentPlayer];

    if (rolls[currentPlayer] === 3) {
        if (currentPlayer === 1) round++;
        if (round > 3) return determinarGanador();
    }

    turn++;
    document.getElementById("turn").innerText = `${playerNames[turn % 2 === 1 ? 0 : 1]}`;
}

// Función para actualizar visualización de los dados
function actualizarDados(diceElement, number) {
    diceElement.setAttribute("data-value", number); // Actualiza el valor del dado
    diceElement.innerHTML = ""; // Limpiar puntos anteriores

    // Crear los puntos dinámicos (siempre 9 para que coincida con el CSS)
    for (let i = 1; i <= 9; i++) {
        let dot = document.createElement("div");
        dot.classList.add("dot"); // Clase general de puntos
        diceElement.appendChild(dot);
    }
}

// Función para actualizar el historial
function actualizarHistorial(player, roll) {
    let table = document.getElementById("history");
    let row = table.insertRow();
    row.innerHTML = `<td>${playerNames[player]}</td><td>${roll}</td>`;
}

// Función para determinar el ganador
function determinarGanador() {
    document.getElementById("rollDice").disabled = true;

    let message =
        scores[0] > scores[1]
            ? `${playerNames[0]} gana 🎉`
            : scores[0] < scores[1]
            ? `${playerNames[1]} gana 🎉`
            : "¡Empate! 🤝";

    document.getElementById("winnerMessage").innerText = message;

    if (Math.max(scores[0], scores[1]) > bestScore) {
        bestScore = Math.max(scores[0], scores[1]);
        localStorage.setItem("bestScore", bestScore);
        document.getElementById("bestScore").innerText = `Mejor Puntuación: ${bestScore}`;
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    scores = [0, 0];
    rolls = [0, 0];
    turn = 1;
    round = 1;
    document.getElementById("score1").innerText = "0";
    document.getElementById("score2").innerText = "0";
    document.getElementById("winnerMessage").innerText = "";
    document.getElementById("rollDice").disabled = false;
    document.getElementById("history").innerHTML = "<tr><th>Jugador</th><th>Lanzamiento</th></tr>";
}

// Función para personalizar nombres
function personalizarNombres() {
    let name1 = prompt("Ingresa el nombre del Jugador 1", playerNames[0]);
    let name2 = prompt("Ingresa el nombre del Jugador 2", playerNames[1]);
    if (name1) playerNames[0] = name1;
    if (name2) playerNames[1] = name2;
    document.querySelectorAll(".player h2")[0].innerText = playerNames[0];
    document.querySelectorAll(".player h2")[1].innerText = playerNames[1];
}

// Eventos
document.getElementById("rollDice").addEventListener("click", lanzarDado);
document.getElementById("resetGame").addEventListener("click", reiniciarJuego);
document.getElementById("customNames").addEventListener("click", personalizarNombres);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") lanzarDado();
});