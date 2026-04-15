// Hook para manejo de huella dactilar con WebAuthn
const BIOMETRIC_KEY = 'biometric_users'; // { [correo]: credentialId }
const LAST_USER_KEY = 'biometric_last_user';

/**
 * Retorna si el navegador soporta WebAuthn
 */
export const biometricsDisponibles = () => {
    return !!(window.PublicKeyCredential && navigator.credentials);
};

/**
 * Registra la huella del usuario con su correo como identificador
 * @param {string} correo 
 * @param {string} nombre 
 * @returns {boolean} éxito
 */
export const registrarHuella = async (correo, nombre) => {
    try {
        const userId = new TextEncoder().encode(correo);
        const challenge = crypto.getRandomValues(new Uint8Array(32));

        const credential = await navigator.credentials.create({
            publicKey: {
                challenge,
                rp: { name: 'HotelFlow', id: window.location.hostname },
                user: {
                    id: userId,
                    name: correo,
                    displayName: nombre,
                },
                pubKeyCredParams: [
                    { alg: -7, type: 'public-key' },   // ES256
                    { alg: -257, type: 'public-key' }, // RS256
                ],
                authenticatorSelection: {
                    authenticatorAttachment: 'platform', // huella del dispositivo
                    userVerification: 'required',
                },
                timeout: 60000,
            }
        });

        if (!credential) return false;

        // Guardar el credentialId asociado al correo
        const guardados = JSON.parse(localStorage.getItem(BIOMETRIC_KEY) || '{}');
        guardados[correo] = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        localStorage.setItem(BIOMETRIC_KEY, JSON.stringify(guardados));
        localStorage.setItem(LAST_USER_KEY, correo);

        return true;
    } catch (err) {
        console.error('Error registrando huella:', err);
        return false;
    }
};

/**
 * Verifica la huella del usuario
 * @param {string} correo
 * @returns {boolean} autenticado
 */
export const verificarHuella = async (correo) => {
    try {
        const guardados = JSON.parse(localStorage.getItem(BIOMETRIC_KEY) || '{}');
        const rawIdB64 = guardados[correo];
        if (!rawIdB64) return false;

        // Convertir de base64 a Uint8Array
        const rawIdBytes = Uint8Array.from(atob(rawIdB64), c => c.charCodeAt(0));

        const challenge = crypto.getRandomValues(new Uint8Array(32));

        const assertion = await navigator.credentials.get({
            publicKey: {
                challenge,
                allowCredentials: [{
                    id: rawIdBytes,
                    type: 'public-key',
                    transports: ['internal'],
                }],
                userVerification: 'required',
                timeout: 60000,
            }
        });

        return !!assertion;
    } catch (err) {
        console.error('Error verificando huella:', err);
        return false;
    }
};

/**
 * Retorna el correo del último usuario que registró huella
 */
export const obtenerUltimoUsuarioBiometrico = () => {
    return localStorage.getItem(LAST_USER_KEY) || null;
};

/**
 * Retorna si un correo específico tiene huella registrada
 */
export const tieneHuellaRegistrada = (correo) => {
    const guardados = JSON.parse(localStorage.getItem(BIOMETRIC_KEY) || '{}');
    return !!guardados[correo];
};

/**
 * Actualiza el último usuario que usó huella (al cambiar de cuenta)
 */
export const actualizarUltimoUsuario = (correo) => {
    localStorage.setItem(LAST_USER_KEY, correo);
};
