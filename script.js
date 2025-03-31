// Variables globales
let turn = 1;
let round = 1;
let scores = [0, 0];
let rolls = [0, 0];
let bestScore = localStorage.getItem("bestScore") || 0;
let playerNames = ["Jugador 1", "Jugador 2"];
let turnoActivo = true; // Control para evitar múltiples interacciones
let juegoTerminado = false; // Control para detener el juego
let juegoActivo = false; // El juego está inactivo al principio
const openHistorialButton = document.getElementById("openHistorial");
const historialPanel = document.getElementById("historialPanel");
const popup = document.getElementById("popup");
const mainContent = document.querySelector("main"); 
const diceSound = new Audio("dice-roll.mp3"); // Sonido de lanzamiento

// Variables globales para guardar partidas
let savedGames = [];

// Función para lanzar el dado
function lanzarDado() {
    if (juegoTerminado) return; // Si el juego terminó, no permitir más lanzamientos
    if (!turnoActivo) return; // Bloquear interacción mientras el dado está rodando

    turnoActivo = false; // Deshabilitar interacción durante el lanzamiento

    let currentPlayer = turn % 2 === 1 ? 0 : 1; // Determinar el jugador actual
    let diceRoll = Math.floor(Math.random() * 6) + 1; // Generar número aleatorio del dado
    let diceElement = document.getElementById(`dice${currentPlayer + 1}`);

    diceSound.play(); // Reproducir el sonido del dado
    diceElement.classList.add("rolling"); // Agregar animación de lanzamiento

    setTimeout(() => {
        diceElement.classList.remove("rolling");
        actualizarDados(diceElement, diceRoll); // Actualizar visualización del dado
        actualizarHistorial(currentPlayer, diceRoll); // Registrar el lanzamiento en el historial

        scores[currentPlayer] += diceRoll; // Sumar puntos al jugador actual
        rolls[currentPlayer]++; // Incrementar el contador de lanzamientos del jugador actual
        document.getElementById(`score${currentPlayer + 1}`).innerText = scores[currentPlayer];

        // Verificar si el jugador completó sus 3 lanzamientos
        if (rolls[currentPlayer] === 3) {
            rolls[currentPlayer] = 0; // Reiniciar lanzamientos para el siguiente ciclo
            if (currentPlayer === 1) {
                round++; // Incrementar la ronda después del turno del Jugador 2
                document.getElementById("round").innerText = round; // Actualizar la visualización de la ronda
            }
        }

        // Verificar si el juego debe terminar después de 18 turnos
        if (turn >= 18) {
            juegoTerminado = true; // Marcar el juego como terminado
            determinarGanador(); // Mostrar el ganador
            agregarGanadorAlHistorial(); // Agregar el ganador al historial
            return; // Evitar más interacciones
        }

        turn++; // Cambiar al siguiente turno
        document.getElementById("turn").innerText = `Jugador ${turn % 2 === 1 ? 1 : 2}`;
        turnoActivo = true; // Habilitar interacción para el próximo turno
    }, 500); // Reducir el delay a 0.5 segundos
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

// Función para actualizar el historial con un diseño mejorado
function actualizarHistorial(player, roll) {
    let table = document.getElementById("history");
    let row = table.insertRow();
    row.innerHTML = `
        <td><strong>${playerNames[player]}</strong></td>
        <td>${roll}</td>
    `;

    // Guardar el historial en localStorage
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

    // Limpiar el historial de localStorage
    localStorage.removeItem("historial");
}

// Función para guardar la partida
function guardarPartida() {
    const partida = {
        jugadores: [...playerNames],
        movimientos: Array.from(document.querySelectorAll("#history tr"))
            .slice(1) // Ignorar la fila de encabezado
            .map(row => ({
                jugador: row.cells[0].innerText,
                lanzamiento: row.cells[1].innerText
            }))
    };
    savedGames.push(partida);
    actualizarListaPartidas();
}

// Función para actualizar la lista de partidas guardadas
function actualizarListaPartidas() {
    const savedGamesList = document.getElementById("savedGames");
    savedGamesList.innerHTML = ""; // Limpiar la lista
    savedGames.forEach((partida, index) => {
        const li = document.createElement("li");
        li.innerText = `Partida de ${partida.jugadores[0]} y ${partida.jugadores[1]}`;
        li.addEventListener("click", () => mostrarMovimientosPartida(index));
        savedGamesList.appendChild(li);
    });
}

// Función para mostrar los movimientos de una partida guardada
function mostrarMovimientosPartida(index) {
    const partida = savedGames[index];
    const table = document.getElementById("history");
    table.innerHTML = `
        <tr>
            <th>Jugador</th>
            <th>Lanzamiento</th>
        </tr>
    `;
    partida.movimientos.forEach(movimiento => {
        const row = table.insertRow();
        row.innerHTML = `
            <td><strong>${movimiento.jugador}</strong></td>
            <td>${movimiento.lanzamiento}</td>
        `;
    });
}

// Función para determinar el ganador
function determinarGanador() {
    document.getElementById("rollDice").disabled = true; // Deshabilitar el botón
    turnoActivo = false; // Bloquear interacción adicional

    let message =
        scores[0] > scores[1]
            ? `${playerNames[0]} gana 🎉`
            : scores[0] < scores[1]
            ? `${playerNames[1]} gana 🎉`
            : "¡Empate! 🤝";

    document.getElementById("winnerMessage").innerText = message;

    // Actualizar el mejor puntaje en localStorage
    let highestScore = Math.max(scores[0], scores[1]); // Calcular el puntaje más alto de los jugadores
    if (highestScore > bestScore) {
        bestScore = highestScore; // Actualizar la variable global
        localStorage.setItem("bestScore", bestScore); // Guardar el nuevo mejor puntaje en localStorage
    }

    // Mostrar el mejor puntaje en la interfaz
    document.getElementById("bestScore").innerText = `Mejor Puntuación: ${bestScore}`;
}

// Función para determinar el ganador y agregarlo al historial
function agregarGanadorAlHistorial() {
    // Determinar quién ganó
    let ganador;
    if (scores[0] > scores[1]) {
        ganador = `${playerNames[0]} ganó 🎉`;
    } else if (scores[0] < scores[1]) {
        ganador = `${playerNames[1]} ganó 🎉`;
    } else {
        ganador = "¡Empate! 🤝";
    }

    // Agregar una fila al final de la tabla del historial
    const table = document.getElementById("history");
    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 2; // Hacer que la celda ocupe las dos columnas
    cell.innerText = ganador;
    cell.style.textAlign = "center"; // Centrar el texto
    cell.style.fontWeight = "bold"; // Hacer el texto en negrita
    cell.style.backgroundColor = "#444"; // Fondo oscuro para consistencia
    cell.style.color = "#ffcc00"; // Texto en amarillo para destacar

    // Guardar el historial en localStorage
    guardarHistorialEnLocalStorage();
}

// Función para reiniciar el mejor puntaje
function reiniciarBestScore() {
    bestScore = 0; // Reiniciar la variable global a 0
    localStorage.setItem("bestScore", bestScore); // Actualizar el valor en localStorage
    document.getElementById("bestScore").innerText = `Mejor Puntuación: ${bestScore}`; // Mostrar el cambio en la interfaz
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
    openHistorialButton.classList.add("disabled-overlay"); // Hacer opaco el botón del historial

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
        });
    });
}

// Función para reiniciar el estado del juego
function resetGameState() {
    scores = [0, 0];
    rolls = [0, 0];
    turn = 1;
    round = 1;
    turnoActivo = true; // Habilitar interacción
    juegoTerminado = false; // Resetear el estado del juego

    // Mostrar el mejor puntaje actual desde localStorage
    bestScore = localStorage.getItem("bestScore") || 0; // Obtener el mejor puntaje almacenado
    document.getElementById("bestScore").innerText = `Mejor Puntuación: ${bestScore}`;

    // Restablecer los textos de la ronda y el turno
    document.getElementById("round").innerText = round;
    document.getElementById("turn").innerText = `Jugador 1`;

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

// Función para guardar el historial en localStorage
function guardarHistorialEnLocalStorage() {
    const table = document.getElementById("history");
    const rows = Array.from(table.rows).slice(1); // Ignorar la fila de encabezado
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
    openHistorialButton.classList.add("disabled-overlay"); // Hacer opaco el botón
    mainContent.classList.add("disabled-overlay"); // Hacer opaco el contenido principal
    cargarHistorialDesdeLocalStorage();
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
        return; // Detener si no se ingresaron nombres
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
    openHistorialButton.classList.remove("disabled-overlay"); // Restaurar el botón
    mainContent.classList.remove("disabled-overlay"); // Restaurar el contenido principal

    // Reiniciar el estado del juego
    resetGameState();
});

// Función para alternar la visibilidad del panel
openHistorialButton.addEventListener("click", () => {
    // Verificar si la ventana emergente está activa
    if (popup && popup.classList.contains("show")) {
        return; // No hacer nada si la ventana emergente está activa
    }

    if (historialPanel.classList.contains("show")) {
        historialPanel.classList.remove("show"); // Oculta el panel
        openHistorialButton.style.right = "20px"; // Regresa el botón a su posición original
    } else {
        historialPanel.classList.add("show"); // Muestra el panel
        openHistorialButton.style.right = "320px"; // Mueve el botón junto con el panel
    }
});

// Eventos
document.getElementById("rollDice").addEventListener("click", lanzarDado);
document.getElementById("resetBestScore").addEventListener("click", reiniciarBestScore);
document.getElementById("resetGame").addEventListener("click", reiniciarJuego);
document.getElementById("clearHistory").addEventListener("click", borrarHistorial);
document.getElementById("resetGame").addEventListener("click", guardarPartida);

document.addEventListener("keydown", (e) => {
    const popup = document.getElementById("popup");
    if (e.code === "Space" && turnoActivo && !juegoTerminado && !popup.classList.contains("show")) {
        lanzarDado(); // Bloquear barra espaciadora si la ventana emergente está activa
    }
});