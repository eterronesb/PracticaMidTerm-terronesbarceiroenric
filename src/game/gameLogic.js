export function generarParejas(pokemons, cantidadCartas) {
  const cantidadParejas = cantidadCartas / 2;

  const pokemonsMezclados = [...pokemons].sort(
    () => Math.random() - 0.5
  );

  const seleccionados = pokemonsMezclados.slice(0, cantidadParejas);

  const cartas = seleccionados.flatMap((pokemon, indice) => [
    {
      id: `${indice}-1`,
      pokemon: pokemon.name,
      parejaId: indice
    },
    {
      id: `${indice}-2`,
      pokemon: pokemon.name,
      parejaId: indice
    }
  ]);

  return cartas.sort(() => Math.random() - 0.5);
}