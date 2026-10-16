export async function obtenerPokemons() {
    const url = 'https://pokeapi.co/api/v2/pokemon';

    const respuestaInicial = await fetch(`${url}?limit=1`);

    if (!respuestaInicial.ok) {
        throw new Error('Error al obtener la lista de Pokémon');
    }

    const datosIniciales = await respuestaInicial.json();

    const respuesta = await fetch(`${url}?limit=${datosIniciales.count}`);
    if (!respuesta.ok) {
        throw new Error('Error al obtener la lista completa de Pokémon');
    }

    const datos = await respuesta.json();
    return datos.results;
}

export async function obtenerPokemonPorNombre(nombre) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
        throw new Error(`Error al obtener el Pokémon con nombre: ${nombre}`);
    }

    const datos = await respuesta.json();
    
    return {
        id: datos.id,
        nombre: datos.name,
        imagen: datos.sprites.front_default,
    };
}