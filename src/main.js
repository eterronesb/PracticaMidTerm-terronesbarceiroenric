import './style.css';
import { obtenerPokemons, obtenerPokemonPorNombre } from './api/pokemonApi.js';
import { guardarSesion, obtenerSesion, cerrarSesion} from './storage/session.js';

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
}

if (sesionActual !== null) {
  document.title = `PokeMemory - ${sesionActual.username}`;
  mostrarPerfil(sesionActual);
}