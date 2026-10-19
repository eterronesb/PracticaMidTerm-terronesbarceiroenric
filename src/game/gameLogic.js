export function generarParejas(pokemons, cantidadCartas) {
  const cantidadParejas = cantidadCartas / 2;

  const pokemonsMezclados = [...pokemons].sort(
    () => Math.random() - 0.5
  );

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

  return cartas.sort(() => Math.random() - 0.5);
}