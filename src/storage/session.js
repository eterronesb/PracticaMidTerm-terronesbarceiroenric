const SESSION_KEY = 'pokemon-player';

export function guardarSesion(perfil) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(perfil));
}

export function obtenerSesion() {
    const datosGuardados = sessionStorage.getItem(SESSION_KEY);

    if (datosGuardados === null) {
        return null;
    }
    return JSON.parse(datosGuardados);
}

export function cerrarSesion() {
    sessionStorage.removeItem(SESSION_KEY);
}