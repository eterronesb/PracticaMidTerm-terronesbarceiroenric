const HISTORY_KEY = 'pokememory-history';

export function obtenerHistorial() {
    const datosGuardados = localStorage.getItem(HISTORY_KEY);

    if (datosGuardados === null) {
        return [];
    }

    try {
        const historial = JSON.parse(datosGuardados);

        return Array.isArray(historial) ? historial : [];
    } catch {
        return [];
    }
}

export function guardarPartida(partida) {
    const historial = obtenerHistorial();
    historial.push(partida);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(historial));
}