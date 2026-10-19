import './style.css';
import { obtenerPokemons, obtenerPokemonPorNombre } from './api/pokemonApi.js';
import { guardarSesion, obtenerSesion, cerrarSesion} from './storage/session.js';
import { generarParejas } from './game/gameLogic.js';

const app = document.querySelector('#app');
const sesionActual = obtenerSesion();



app.innerHTML = `
  <main>
    <h1>PokeMemory</h1>
    <p>¡Bienvenido al juego de memoria Pokemon!</p>

    <h2>Crear Perfil</h2>
    <form id="profile-form">
      <label for="username">Nombre de usuario:</label>
      <input
        type="text"
        id="username"
        name="username" 
        minlength="3"
        maxlength="15"
        required 
      />
      <p id="username-error" role="alert"></p>
      <label for="pokemon-search">Pokémon favorito:</label>
      <input
        type="text"
        id="pokemon-search"
        name="pokemon-search"
        placeholder="Escribe el nombre de tu Pokémon favorito"
        autocomplete="off"
      />
      <ul id="pokemon-results"></ul>
      <div id="selected-pokemon" aria-live="polite"></div>
      <button type="submit">Crear Perfil</button>
    </form>
  </main>
`;  

const form = document.querySelector('#profile-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const usernameInput = document.querySelector('#username');
      const username = usernameInput.value.trim();
      const errorElement = document.querySelector('#username-error');

      if (username.length < 3 || username.length > 15) {
        errorElement.textContent = 'El nombre de usuario debe tener entre 3 y 15 caracteres.';
        return;
      }
      
      errorElement.textContent = '';
      if (pokemonFavorito === null) {
        errorElement.textContent = 'Debes seleccionar un Pokémon favorito antes de crear el perfil.';
        return;
      };
      const perfil = {
        username: username,
        pokemonFavorito: pokemonFavorito,
      };
      guardarSesion(perfil);
      mostrarPerfil(perfil);
      document.title = `PokeMemory - ${perfil.username}`;
    });

let listaPokemons = [];    

obtenerPokemons()
  .then((pokemons) => {
    listaPokemons = pokemons;
  })

const pokemonSearch = document.querySelector('#pokemon-search');
const pokemonResults = document.querySelector('#pokemon-results');
const selectedPokemon = document.querySelector('#selected-pokemon');
let pokemonFavorito = null;

pokemonSearch.addEventListener('input', (event) => {
  const textoBuscado = event.target.value.trim().toLowerCase();

  pokemonFavorito = null;
  selectedPokemon.replaceChildren();

  if (textoBuscado === '') {
    pokemonResults.replaceChildren();
    return;
  }

  const coincidencias = listaPokemons
    .filter((pokemon) => pokemon.name.toLowerCase().includes(textoBuscado))
    .slice(0, 5);
  pokemonResults.replaceChildren();

  coincidencias.forEach((pokemon) => {
    const elemento = document.createElement('li');
    const boton = document.createElement('button');

    boton.type = 'button';
    boton.textContent = pokemon.name;
    boton.addEventListener('click', async() => {
      try {
        const datosPokemon = await obtenerPokemonPorNombre(pokemon.name);

        pokemonFavorito = datosPokemon;
        pokemonSearch.value = datosPokemon.nombre;
        pokemonResults.replaceChildren();

        selectedPokemon.replaceChildren();

        const nombre = document.createElement('p');
        nombre.textContent = `${datosPokemon.nombre} - Nº ${datosPokemon.id}`;

        const imagen = document.createElement('img');
        imagen.src = datosPokemon.imagen;
        imagen.alt = `Imagen de ${datosPokemon.nombre}`;

        selectedPokemon.append(nombre, imagen);
      } catch {
        selectedPokemon.textContent = 'No se pudo cargar el Pokemon, por favor inténtalo de nuevo.';
      }  
    });

    elemento.appendChild(boton);
    pokemonResults.appendChild(elemento);
  });
});
function mostrarPerfil(perfil) {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <main>
      <h1>PokeMemory</h1>
      <h2 id="welcome-message"></h2>

      <p>Tu Pokémon favorito es: ${perfil.pokemonFavorito.nombre}</p>
      <img
        src="${perfil.pokemonFavorito.imagen}"
        alt="Imagen de ${perfil.pokemonFavorito.nombre}" 
      />
      <div>
        <label for="card-count">Número de cartas:</label>
        <input
          type="number"
          id="card-count"
          min="2"
          step="2"
          value="12"
          required
        />
        <p id="card-count-error" role="alert"></p>
      </div>
      <button id="play-button" type="button">Jugar</button>

      <button id="logout-button" type="button">Cerrar Sesión</button>
    </main>
  `;
  const welcomeMessage = document.querySelector('#welcome-message');
  welcomeMessage.textContent = `¡Bienvenido, ${perfil.username}!`;

  const logoutButton = document.querySelector('#logout-button');
  logoutButton.addEventListener('click', () => {
    cerrarSesion();
    window.location.reload();
  });

  const playButton = document.querySelector('#play-button');
  const cardCountInput = document.querySelector('#card-count');
  const cardCountError = document.querySelector('#card-count-error');

  playButton.addEventListener('click', () => {
    const cantidad = Number(cardCountInput.value);

    if (
      cardCountInput.value.trim() === '' ||
      !Number.isInteger(cantidad) ||
      cantidad < 2 ||
      cantidad % 2 !== 0
    ) {
      cardCountError.textContent = 'Por favor, ingresa un número par mayor o igual a 2.';
      return;
    }

    cardCountError.textContent = '';

    mostrarJuego(perfil, cantidad);
  });   
}

function mostrarJuego(perfil, cantidad) {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <main>
      <h1>PokeMemory</h1>
      <h2>Juego de memoria Porkémon</h2>

      <p id="game-player"></p>
      <p id="total-cards"></p>

      <section id="game-board" aria-label="Tablero de memoria"></section>
    </main>
  `;
  
  document.querySelector('#game-player').textContent = `Jugador: ${perfil.username}`;
  document.querySelector('#total-cards').textContent = `Número de cartas: ${cantidad}`;

  obtenerPokemons()
    .then((pokemons) => {
      if (cantidad / 2 > pokemons.length) {
        document.querySelector('#game-board').textContent =
          'No hay suficientes Pokémon para crear tantas parejas.';
        return;
      }

      const cartas = generarParejas(pokemons, cantidad);
      const tablero = document.querySelector('#game-board');
      const cartasDescubiertas = [];
      let tableroBloqueado = false;

      let parejasEncontradas = 0;
      const totalParejas = cantidad / 2;

      cartas.forEach((carta) => {
        const boton = document.createElement('button');

        boton.type = 'button';
        boton.classList.add('memory-card');
        boton.textContent = '?';
        boton.dataset.pokemon = carta.pokemon;
        boton.dataset.parejaId = String(carta.parejaId);

        boton.addEventListener('click', () => {
          if (
            tableroBloqueado ||
            boton.classList.contains('revealed') ||
            boton.classList.contains('matched')
          ) {
            return;
          }

          boton.textContent = carta.pokemon;
          boton.classList.add('revealed');
          cartasDescubiertas.push(boton);

          if (cartasDescubiertas.length === 2) {
            const [primeraCarta, segundaCarta] = cartasDescubiertas;

            if (primeraCarta.dataset.parejaId === segundaCarta.dataset.parejaId) {
              primeraCarta.classList.add('matched');
              segundaCarta.classList.add('matched');
            
              cartasDescubiertas.length = 0;
              parejasEncontradas ++;

              if (parejasEncontradas === totalParejas) {
                const mensajeVictoria = document.createElement('p');

                mensajeVictoria.id = 'victory-message';
                mensajeVictoria.textContent = `¡Felicidades, ${perfil.username}! Has encontrado todas las parejas.`;

                tablero.appendChild(mensajeVictoria);
              } 
          }else {
            tableroBloqueado = true;

            setTimeout(() => {
              primeraCarta.textContent = '?';
              segundaCarta.textContent = '?';
              primeraCarta.classList.remove('revealed');
              segundaCarta.classList.remove('revealed');
              cartasDescubiertas.length = 0;
              tableroBloqueado = false;
            }, 1000);
          }
        }
      });
      tablero.appendChild(boton);
    });
  })
  .catch(() => {
    document.querySelector('#game-board').textContent =
      'No se pudieron cargar los Pokémon. Inténtalo de nuevo.';
  });
}

if (sesionActual !== null) {
  document.title = `PokeMemory - ${sesionActual.username}`;
  mostrarPerfil(sesionActual);
}