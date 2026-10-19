function mezclarArray(elementos) {
  const resultado = [...elementos];

  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }

  return resultado;
}

export function generarParejas(pokemons, cantidadCartas) {
  const cantidadParejas = cantidadCartas / 2;

  const pokemonsMezclados = mezclarArray(pokemons);

  const seleccionados = pokemonsMezclados.slice(0, cantidadParejas);

  const cartas = seleccionados.flatMap((pokemon, indice) => {
    const pokemonId = Number(pokemon.url.split('/').filter(Boolean).pop());

    const imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    return [
      {
        id: `${indice}-1`,
        pokemon: pokemon.name,
        imagen: imagen,
        parejaId: indice
      },
      {
        id: `${indice}-2`,
        pokemon: pokemon.name,
        imagen: imagen,
        parejaId: indice
      }
    ];
  });

  return mezclarArray(cartas);
}