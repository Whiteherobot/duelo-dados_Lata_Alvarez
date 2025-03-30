document.getElementById("rollDice").addEventListener("click", function() {
    // Activar animación en el dado
    const dice1 = document.getElementById("dice1");
    const dice2 = document.getElementById("dice2");

    // Reseteamos las animaciones (esto es para que se pueda reproducir cada vez que se lance)
    dice1.style.animation = 'none';
    dice2.style.animation = 'none';
    
    // Forzar el reflow para reiniciar la animación
    dice1.offsetHeight;
    dice2.offsetHeight;

    // Reaplicamos la animación
    dice1.style.animation = 'roll 1s ease-out';
    dice2.style.animation = 'roll 1s ease-out';

    let diceRoll = Math.floor(Math.random() * 6) + 1;
    let currentPlayer = turn % 2 === 1 ? 0 : 1;
    
    document.getElementById(`dice${currentPlayer + 1}`).src = `dice${diceRoll}.png`;
    scores[currentPlayer] += diceRoll;
    rolls[currentPlayer]++;
    document.getElementById(`score${currentPlayer + 1}`).innerText = scores[currentPlayer];
    
    if (rolls[currentPlayer] === 3) {
        if (currentPlayer === 1) round++;
        if (round > 3) {
            document.getElementById("rollDice").disabled = true;
            let winnerMessage = scores[0] > scores[1] ? "¡Jugador 1 gana!" : scores[0] < scores[1] ? "¡Jugador 2 gana!" : "¡Empate!";
            document.getElementById("winnerMessage").innerText = winnerMessage;
        }
    }
    
    turn++;
    document.getElementById("turn").innerText = `Jugador ${turn % 2 === 1 ? 1 : 2}`;
});
