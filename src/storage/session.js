const SESSION_KEY = 'pokemon-player';

export function guardarSesion(perfil) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(perfil));
}

export function obtenerSesion() {
    const datosGuardados = sessionStorage.getItem(SESSION_KEY);

    if (datosGuardados === null) {
        return null;
    }

    try {
        const perfil = JSON.parse(datosGuardados);

        const nombreValido =
            typeof perfil.username === 'string' &&
             perfil.username.trim().length >= 3 &&
             perfil.username.trim().length <= 15;
        
        const pokemonValido =
            typeof perfil.pokemonFavorito?.id === 'number' &&
            Number.isInteger(perfil.pokemonFavorito.id) &&
            perfil.pokemonFavorito.id > 0 &&
            typeof perfil.pokemonFavorito.nombre === 'string' &&
            perfil.pokemonFavorito.nombre.trim().length > 0 &&
            typeof perfil.pokemonFavorito.imagen === 'string' &&
            perfil.pokemonFavorito.imagen.startsWith('https://');
            
        if (!nombreValido || !pokemonValido) {
            sessionStorage.removeItem(SESSION_KEY);
            return null;
        }
        
        return perfil;
    } catch {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function cerrarSesion() {
    sessionStorage.removeItem(SESSION_KEY);
}