# 🎲 Duelo de Dados

## 📌 Descripción
**Duelo de Dados** es un juego interactivo basado en la web donde dos jugadores compiten lanzando un dado en tres rondas. El jugador con la mayor puntuación acumulada al final de la partida gana. Este proyecto utiliza tecnologías web modernas para ofrecer una experiencia dinámica y responsiva.

El juego incluye:
- **Interfaz interactiva** para dos jugadores.
- **Historial de lanzamientos** para registrar las puntuaciones.
- **Animaciones y efectos visuales** para mejorar la experiencia del usuario.

---

## 🕹️ Instrucciones para Jugar
1. Al cargar la página, se muestra una ventana emergente para personalizar los nombres y colores de los jugadores.
2. **Jugador 1** lanza el dado presionando el botón "Lanzar dado" o la barra espaciadora.
3. **Jugador 2** realiza su lanzamiento después.
4. Se repiten los turnos hasta completar **tres rondas**.
5. Al finalizar, se muestra el ganador o un mensaje de empate.
6. Puedes reiniciar el juego con el botón "Reiniciar".

---

## 📜 Reglas del Juego
- Cada jugador lanza el dado **una vez por turno**.
- El juego tiene un total de **tres rondas**.
- Gana el jugador con la **mayor puntuación acumulada**.
- Si hay empate, se mostrará un mensaje indicando el resultado.

---

## 📸 Capturas de Pantalla

### 1. **Pantalla de Inicio**
La pantalla inicial muestra una ventana emergente donde los jugadores pueden personalizar sus nombres y colores antes de comenzar el juego.

![Pantalla de Inicio](image.png)

---

### 2. **Tablero de Juego**
El tablero principal muestra las secciones de cada jugador, el panel central con la ronda actual y el turno activo.

![Tablero de Juego](image2.png)

---

### 3. **Historial de Lanzamientos**
El historial dinámico registra los lanzamientos de cada jugador y muestra los resultados en una tabla.

![Historial de Lanzamientos](image3.png)

---

### 4. **Pantalla de Resultado**
Al finalizar las tres rondas, se muestra un mensaje indicando el ganador o si hubo un empate.

![Pantalla de Resultado](image4.png)

---

## 🛠️ Tecnologías Utilizadas
Este proyecto fue desarrollado utilizando las siguientes tecnologías:
- **HTML5**: Para la estructura semántica de la interfaz.
- **CSS3**: Para los estilos, diseño responsivo y animaciones.
- **JavaScript (ES6)**: Para la lógica del juego, manipulación del DOM y control de eventos.

---

## 🔍 Funciones Técnicas Implementadas

### 1. **Control de Turnos**
   - Se utiliza una variable global `turnoActivo` para alternar entre los jugadores.
   - La función `lanzarDado()` actualiza el turno y registra la puntuación del jugador actual.

   ```javascript
   function lanzarDado() {
       const dado = Math.floor(Math.random() * 6) + 1; // Generar número aleatorio entre 1 y 6
       actualizarPuntuacion(dado);
       cambiarTurno();
   }
   ```

### 2. **Historial de Lanzamientos**
   - Los lanzamientos de cada jugador se registran en un historial dinámico.
   - Se utiliza manipulación del DOM para agregar filas a una tabla que muestra los resultados.

   ```javascript
   function actualizarHistorial(jugador, lanzamiento) {
       const tablaHistorial = document.getElementById("history").querySelector("tbody");
       const nuevaFila = document.createElement("tr");
       nuevaFila.innerHTML = `<td>${jugador}</td><td>${lanzamiento}</td>`;
       tablaHistorial.appendChild(nuevaFila);
   }
   ```

### 3. **Ventana Emergente de Personalización**
   - Al inicio, se muestra una ventana emergente para que los jugadores ingresen sus nombres y seleccionen colores personalizados.
   - Los valores ingresados se aplican dinámicamente al tablero de juego.

   ```javascript
   document.getElementById("startGame").addEventListener("click", function () {
       const player1Name = document.getElementById("player1Name").value.trim();
       const player2Name = document.getElementById("player2Name").value.trim();
       document.querySelector(".player:nth-child(1) h2").innerText = player1Name;
       document.querySelector(".player:nth-child(3) h2").innerText = player2Name;
   });
   ```

### 4. **Diseño Responsivo**
   - Se implementaron media queries en CSS para garantizar que el diseño se adapte a diferentes tamaños de pantalla.
   - El botón flotante y el historial se ajustan dinámicamente en dispositivos móviles.

   ```css
   @media (max-width: 530px) {
       #openHistorial {
           bottom: 10px;
           right: 10px;
           width: 45px;
           height: 45px;
       }
   }
   ```

### 5. **Reinicio del Juego**
   - La función `reiniciarJuego()` restablece todas las variables y el estado del DOM para iniciar una nueva partida.

   ```javascript
   function reiniciarJuego() {
       turnoActivo = true;
       juegoTerminado = false;
       document.getElementById("score1").innerText = "0";
       document.getElementById("score2").innerText = "0";
       limpiarHistorial();
   }
   ```

---

## 👨‍💻 Instalación y Uso
1. Clona este repositorio:
   ```sh
   git clone https://github.com/Whiteherobot/duelo-dados_Lata_Alvarez
   ```
2. Abre el archivo `index.html` en tu navegador.
3. ¡Disfruta el juego! 🎲

---

## 📂 Control de Versiones
Este proyecto utiliza **Git** para el control de versiones. Asegúrate de realizar commits significativos con mensajes claros. Ejemplo:
```sh
git commit -m "Agregada funcionalidad de historial de lanzamientos"
```

---
