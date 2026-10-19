const HISTORY_KEY = 'pokememory-history';

export function obtenerHistorial() {
    const datosGuardados = localStorage.getItem(HISTORY_KEY);

    if (datosGuardados === null) {
        return [];
    }

    try {
        const historial = JSON.parse(datosGuardados);

        if (!Array.isArray(historial)) {
            return [];
        }
        return historial.filter((partida) =>
            partida !== null &&
            typeof partida === 'object' &&
            typeof partida.id === 'string' &&
            partida.id.length > 0 &&
            typeof partida.username === 'string' &&
            partida.username.trim().length > 0 &&
            typeof partida.pokemonFavorito === 'string' &&
            Number.isInteger(partida.cantidadCartas) &&
            partida.cantidadCartas >= 2 &&
            partida.cantidadCartas <= 24 &&
            partida.cantidadCartas % 2 === 0 &&
            Number.isInteger(partida.tiempoSegundos) &&
            partida.tiempoSegundos >= 0 &&
            typeof partida.fecha === 'string' &&
            !Number.isNaN(Date.parse(partida.fecha))
        );
    } catch {
        return [];
    }
}

export function guardarPartida(partida) {
    const historial = obtenerHistorial();
    historial.push(partida);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historial));
}

export function obtenerRanking() {
    const historial = obtenerHistorial();

    return [...historial].sort((a,b) => {
        if(a.cantidadCartas !== b.cantidadCartas) {
            return b.cantidadCartas - a.cantidadCartas;
        }

        return a.tiempoSegundos - b.tiempoSegundos;
    });
}