class Usuario {
    constructor(datos) {
        this.id = datos.id;
        this.nombre = datos.nombre;
        this.apellidos = datos.apellidos;
        this.correo = datos.correo;
        this.telefono = datos.telefono;
        this.hash = datos.hash;
        this.salt = datos.salt;
        this.tipo = datos.tipo;
    }

    set id(id) { this._id = id; }
    set nombre(nombre) {
        const regex = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
        if (regex.test(nombre)) this._nombre = nombre;
    }
    set apellidos(apellidos) {
        const regex = /^[A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}([ ][A-ZÁÉÍÓÚÑ'][a-záéíóúñ']{1,}){0,}$/;
        if (regex.test(apellidos)) this._apellidos = apellidos;
    }
    set correo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(correo)) this._correo = correo;
    }
    set telefono(telefono) {
        const regex = /^\d{10}$/;
        if (regex.test(telefono)) this._telefono = telefono;
    }
    set hash(hash) { this._hash = hash; }
    set salt(salt) { this._salt = salt; }
    set tipo(tipo) { this._tipo = tipo; }

    get id() { return this._id; }
    get nombre() { return this._nombre; }
    get obtenerDatos() {
        const datosCifrados = {
            nombre: this._nombre,
            apellidos: this._apellidos,
            correo: this._correo,
            telefono: this._telefono,
            hash: this._hash,
            salt: this._salt,
            tipo: this._tipo
        };
        // Eliminamos el ID si es undefined para que Firestore no proteste
        return (this._id !== undefined) ? { id: this._id, ...datosCifrados } : datosCifrados;
    }
}

module.exports = Usuario;