// Variables globales
let turn = 1;
let round = 1;
let scores = [0, 0];
let rolls = [0, 0];
let bestScore = localStorage.getItem("bestScore") || 0;
let bestScorePlayer = localStorage.getItem("bestScorePlayer") || ""; // Jugador con el mejor puntaje
let playerNames = ["Jugador 1", "Jugador 2"];
let turnoActivo = true;
let juegoTerminado = false;
let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];
const openHistorialButton = document.getElementById("openHistorial");
const historialPanel = document.getElementById("historialPanel");
const popup = document.getElementById("popup");
const mainContent = document.querySelector("main"); 
const diceSound = new Audio("dice-roll.mp3"); // Sonido de lanzamiento

// Variable para controlar si se está visualizando una partida guardada
let viendoPartidaGuardada = false;

// Función para lanzar el dado
function lanzarDado() {
    if (viendoPartidaGuardada) {
        cerrarVistaPartidaGuardada(); 
    }

    if (juegoTerminado || !turnoActivo) return;

    turnoActivo = false; // Bloquear interacción hasta que termine el turno

    diceSound.play();

    let currentPlayer = turn % 2 === 1 ? 0 : 1;
    let diceRoll = Math.floor(Math.random() * 6) + 1;
    let diceElement = document.getElementById(`dice${currentPlayer + 1}`);

    diceElement.classList.add("rolling");
    setTimeout(() => {
        diceElement.classList.remove("rolling");
        actualizarDados(diceElement, diceRoll);
        actualizarHistorial(currentPlayer, diceRoll);

        scores[currentPlayer] += diceRoll;
        rolls[currentPlayer]++;
        document.getElementById(`score${currentPlayer + 1}`).innerText = scores[currentPlayer];

        if (rolls[currentPlayer] === 1) {
            rolls[currentPlayer] = 0;
            if (currentPlayer === 1) {
                round++;
                document.getElementById("round").innerText = round;
            }
        }

        if (turn >= 6) {
            juegoTerminado = true;
            determinarGanador();
            agregarGanadorAlHistorial();
            guardarPartida();
            return;
        }

        turn++;
        document.getElementById("turn").innerText = `Turno de: ${turn % 2 === 1 ? playerNames[0] : playerNames[1]}`;

        // Habilitar interacción después de 1 segundo
        setTimeout(() => {
            turnoActivo = true;
        }, 1000);
    }, 500); 
}
// Función para actualizar visualización de los dados
function actualizarDados(diceElement, number) {
    diceElement.setAttribute("data-value", number);
    diceElement.innerHTML = "";
    for (let i = 1; i <= 9; i++) {
        let dot = document.createElement("div");
        dot.classList.add("dot");
        diceElement.appendChild(dot);
    }
}
// Función para limpiar la tabla del historial
function limpiarHistorial() {
    const table = document.getElementById("history");
    table.innerHTML = `
        <tr>
            <th>Jugador</th>
            <th>Lanzamiento</th>
        </tr>
    `;
}
// Función para actualizar el historial
function actualizarHistorial(player, roll) {
    const table = document.getElementById("history");
    const row = table.insertRow();
    row.innerHTML = `
        <td><strong>${playerNames[player]}</strong></td>
        <td>${roll}</td>
    `;

    guardarHistorialEnLocalStorage();
}
// Función para borrar el historial completamente
function borrarHistorial() {
    // Limpiar el historial visualmente
    document.getElementById("history").innerHTML = `
        <tr>
            <th>Jugador</th>
            <th>Lanzamiento</th>
        </tr>
    `;

    localStorage.removeItem("historial");
    localStorage.removeItem("savedGames");
    savedGames = [];
    actualizarListaPartidas();
}
// Función para guardar la partida
function guardarPartida() {
    const partida = {
        jugadores: [...playerNames],
        movimientos: Array.from(document.querySelectorAll("#history tr"))
            .slice(1) 
            .map(row => ({
                jugador: row.cells[0]?.innerText || "",
                lanzamiento: row.cells[1]?.innerText || ""
            })),
        ganador: document.querySelector("#history tr:last-child td").innerText
    };

    savedGames.push(partida);
    localStorage.setItem("savedGames", JSON.stringify(savedGames));
    actualizarListaPartidas();
}
// Función para actualizar la lista de partidas guardadas
function actualizarListaPartidas() {
    const savedGamesList = document.getElementById("savedGames");
    savedGamesList.innerHTML = ""; // Limpiar la lista
    savedGames.forEach((partida, index) => {
        const li = document.createElement("li");
        
        const ganadorConTrofeo = partida.ganador.includes(bestScorePlayer)
            ? `${partida.ganador} 🏆`
            : partida.ganador;

        li.innerText = ganadorConTrofeo;

        li.addEventListener("click", () => mostrarMovimientosPartida(index));
        savedGamesList.appendChild(li);
    });
}
// Función para mostrar los movimientos de una partida guardada
function mostrarMovimientosPartida(index) {
    if (!juegoTerminado) {
        alert("No puedes visualizar partidas guardadas mientras estás en una partida activa.");
        return;
    }

    const partida = savedGames[index];
    limpiarHistorial(); 
    const table = document.getElementById("history");

    
    partida.movimientos.forEach(movimiento => {
        const row = table.insertRow();
        row.innerHTML = `
            <td><strong>${movimiento.jugador}</strong></td>
            <td>${movimiento.lanzamiento}</td>
        `;
    });

    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 2;
    cell.innerText = partida.ganador;
    cell.style.textAlign = "center";
    cell.style.fontWeight = "bold";
    cell.style.backgroundColor = "#444";
    cell.style.color = "#ffcc00";

    viendoPartidaGuardada = true;
    document.getElementById("rollDice").disabled = true; 
    document.getElementById("winnerMessage").innerText = "Visualizando partida guardada";
}
// Función para cerrar la vista de una partida guardada
function cerrarVistaPartidaGuardada() {
    if (viendoPartidaGuardada) {
        limpiarHistorial(); 
        resetGameState(); 
        document.getElementById("winnerMessage").innerText = ""; 
        viendoPartidaGuardada = false;
    }
}
// Función para determinar el ganador
function determinarGanador() {
    document.getElementById("rollDice").disabled = true; 
    turnoActivo = false; 

    let message;
    if (scores[0] > scores[1]) {
        message = `${playerNames[0]} gana 🎉`;
        actualizarMejorScore(playerNames[0], scores[0]);
    } else if (scores[0] < scores[1]) {
        message = `${playerNames[1]} gana 🎉`;
        actualizarMejorScore(playerNames[1], scores[1]);
    } else {
        message = "¡Empate! 🤝";
    }

    document.getElementById("winnerMessage").innerText = message;

    // Actualizar la interfaz con la copa
    actualizarCopa();
}
// Función para actualizar el mejor puntaje
function actualizarMejorScore(player, score) {
    if (score > bestScore) {
        bestScore = score;
        bestScorePlayer = player;
        localStorage.setItem("bestScore", bestScore);
        localStorage.setItem("bestScorePlayer", bestScorePlayer);
    }
}
// Función para actualizar la copa en la interfaz
function actualizarCopa() {
    document.querySelectorAll(".player h2").forEach((h2, index) => {
        // Eliminar cualquier copa existente
        h2.innerText = playerNames[index];

        // Agregar la copa solo si el jugador tiene el mejor puntaje
        if (playerNames[index] === bestScorePlayer) {
            h2.innerText += " 🏆";
        }
    });
}
// Función para determinar el ganador y agregarlo al historial
function agregarGanadorAlHistorial() {
    // Determinar quién ganó
    let ganador;
    if (scores[0] > scores[1]) {
        ganador = `${playerNames[0]} ganó 🎉 🏆`;
    } else if (scores[0] < scores[1]) {
        ganador = `${playerNames[1]} ganó 🎉 🏆`;
    } else {
        ganador = "¡Empate! 🤝";
    }

    // Agregar una fila al final de la tabla del historial
    const table = document.getElementById("history");
    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 2; 
    cell.innerText = ganador;
    cell.style.textAlign = "center"; 
    cell.style.fontWeight = "bold"; 
    cell.style.backgroundColor = "#444"; 
    cell.style.color = "#ffcc00"; 

    // Guardar el historial en localStorage
    guardarHistorialEnLocalStorage();
}
// Función para reiniciar el mejor puntaje
function reiniciarBestScore() {
    bestScore = 0; 
    localStorage.setItem("bestScore", bestScore); 
    document.getElementById("bestScore").innerText = `Mejor Puntuación: ${bestScore}`; 
}
// Función para reiniciar el juego
function reiniciarJuego() {
    // Crear una ventana emergente personalizada
    const confirmationPopup = document.createElement("div");
    confirmationPopup.classList.add("popup");
    confirmationPopup.innerHTML = `
        <div class="popup-content">
            <h2>¿Deseas reiniciar?</h2>
            <p>¿Quieres continuar con los mismos jugadores o agregar nuevos?</p>
            <button id="continueSamePlayers">Continuar con los mismos</button>
            <button id="addNewPlayers">Agregar nuevos jugadores</button>
        </div>
    `;
    document.body.appendChild(confirmationPopup);

    // Mostrar la ventana emergente
    confirmationPopup.classList.add("show");
    openHistorialButton.classList.add("disabled-overlay"); 

    // Manejar la opción de continuar con los mismos jugadores
    document.getElementById("continueSamePlayers").addEventListener("click", () => {
        // Cerrar la ventana emergente
        confirmationPopup.classList.remove("show");
        setTimeout(() => confirmationPopup.remove(), 300);

        // Restaurar el botón del historial
        openHistorialButton.classList.remove("disabled-overlay");

        // Reiniciar el juego con los mismos jugadores
        resetGameState();
    });

    // Manejar la opción de agregar nuevos jugadores
    document.getElementById("addNewPlayers").addEventListener("click", () => {
        // Cerrar la ventana emergente
        confirmationPopup.classList.remove("show");
        setTimeout(() => confirmationPopup.remove(), 300);

        // Restaurar el botón del historial
        openHistorialButton.classList.remove("disabled-overlay");

        // Reiniciar el estado del juego
        resetGameState();

        // Mostrar la ventana emergente de bienvenida para agregar nuevos jugadores
        const popup = document.getElementById("popup");
        popup.classList.add("show");

        // Actualizar los nombres de los jugadores después de cerrar la ventana emergente
        document.getElementById("startGame").addEventListener("click", function () {
            const player1Name = document.getElementById("player1Name").value.trim();
            const player2Name = document.getElementById("player2Name").value.trim();

            if (player1Name) playerNames[0] = player1Name;
            if (player2Name) playerNames[1] = player2Name;

            document.querySelectorAll(".player h2")[0].innerText = playerNames[0];
            document.querySelectorAll(".player h2")[1].innerText = playerNames[1];

            // Ocultar la ventana emergente
            popup.classList.remove("show");

            // Actualizar la interfaz con la copa
            actualizarCopa();
        });
    });
}
// Función para reiniciar el estado del juego
function resetGameState() {
    scores = [0, 0];
    rolls = [0, 0];
    turn = 1;
    round = 1;
    turnoActivo = true; 
    juegoTerminado = false; 

    // Mostrar el mejor puntaje actual desde localStorage
    bestScore = localStorage.getItem("bestScore") || 0; 
    document.getElementById("bestScore").innerText = `Mejor Puntuación: ${bestScore}`;

    // Restablecer los textos de la ronda y el turno
    document.getElementById("round").innerText = round;
    document.getElementById("turn").innerText = `Turno de: ${playerNames[0]}`;

    document.getElementById("score1").innerText = "0";
    document.getElementById("score2").innerText = "0";
    document.getElementById("winnerMessage").innerText = "";
    document.getElementById("rollDice").disabled = false;

    // Limpiar la tabla del historial
    limpiarHistorial();

    // Actualizar la interfaz con la copa
    actualizarCopa();
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
// Función para guardar el historial en localStorage
function guardarHistorialEnLocalStorage() {
    const table = document.getElementById("history");
    const rows = Array.from(table.rows).slice(1); 
    const historial = rows.map(row => ({
        jugador: row.cells[0]?.innerText || "",
        lanzamiento: row.cells[1]?.innerText || ""
    }));
    localStorage.setItem("historial", JSON.stringify(historial));
}
// Función para cargar el historial desde localStorage
function cargarHistorialDesdeLocalStorage() {
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    const table = document.getElementById("history");
    historial.forEach(entry => {
        const row = table.insertRow();
        if (entry.lanzamiento) {
            row.innerHTML = `
                <td><strong>${entry.jugador}</strong></td>
                <td>${entry.lanzamiento}</td>
            `;
        } else {
            const cell = row.insertCell(0);
            cell.colSpan = 2; // Hacer que la celda ocupe las dos columnas
            cell.innerText = entry.jugador; // Mostrar el ganador
            cell.style.textAlign = "center";
            cell.style.fontWeight = "bold";
            cell.style.backgroundColor = "#444";
            cell.style.color = "#ffcc00";
        }
    });
}
// Mostrar la ventana emergente al cargar la página
window.onload = function () {
    const popup = document.getElementById("popup");
    popup.classList.add("show");
    openHistorialButton.classList.add("disabled-overlay"); 
    mainContent.classList.add("disabled-overlay"); 
    limpiarHistorial(); 
    cargarHistorialDesdeLocalStorage();
    actualizarListaPartidas();
    actualizarCopa(); 
};
// Aplicar personalización y cerrar la ventana
document.getElementById("startGame").addEventListener("click", function () {
    // Obtener los valores ingresados por el usuario
    const player1Name = document.getElementById("player1Name").value.trim();
    const player2Name = document.getElementById("player2Name").value.trim();
    const player1Color = document.getElementById("colorPlayer1").value;
    const player2Color = document.getElementById("colorPlayer2").value;

    // Validar que se hayan ingresado nombres
    if (!player1Name || !player2Name) {
        alert("Por favor, ingresa los nombres de ambos jugadores.");
        return; 
    }

    // Aplicar nombres y colores personalizados
    playerNames[0] = player1Name;
    playerNames[1] = player2Name;

    document.querySelector(".player:nth-child(1) h2").innerText = player1Name;
    document.querySelector(".player:nth-child(3) h2").innerText = player2Name;

    document.querySelector(".player:nth-child(1)").style.backgroundColor = player1Color;
    document.querySelector(".player:nth-child(3)").style.backgroundColor = player2Color;

    // Ocultar la ventana emergente
    const popup = document.getElementById("popup");
    popup.classList.remove("show");
    openHistorialButton.classList.remove("disabled-overlay"); 
    mainContent.classList.remove("disabled-overlay"); 

    // Reiniciar el estado del juego
    resetGameState();
});
// Función para alternar la visibilidad del panel
openHistorialButton.addEventListener("click", () => {
    
    if (popup && popup.classList.contains("show")) {
        return; 
    }
    if (historialPanel.classList.contains("show")) {
        historialPanel.classList.remove("show"); 
        openHistorialButton.style.right = "20px"; 
    } else {
        historialPanel.classList.add("show"); 
        openHistorialButton.style.right = "320px"; 
    }
});

// Eventos
document.getElementById("rollDice").addEventListener("click", lanzarDado);
document.getElementById("resetBestScore").addEventListener("click", reiniciarBestScore);
document.getElementById("resetGame").addEventListener("click", reiniciarJuego);
document.getElementById("clearHistory").addEventListener("click", borrarHistorial);

document.addEventListener("keydown", (e) => {
    const popup = document.getElementById("popup");
    if (e.code === "Space" && turnoActivo && !juegoTerminado && !popup.classList.contains("show")) {
        if (viendoPartidaGuardada) {
            cerrarVistaPartidaGuardada(); // Cerrar automáticamente la vista de la partida guardada
        }
        lanzarDado(); // Lanzar el dado
    }
});