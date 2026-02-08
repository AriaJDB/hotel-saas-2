class Articulo {
    constructor(datos) {
        this.id_art = datos.id_art;
        this.nombre = datos.nombre;
        this.descripcion = datos.descripcion;
        this.precio = datos.precio;
        this.categoria = datos.categoria;
        this.disponibilidad = datos.disponibilidad;
    }

    set nombre(nombre) {
        if (nombre && nombre.length > 2) this._nombre = nombre;
    }
    set precio(precio) {
        if (!isNaN(precio) && precio >= 0) this._precio = precio;
    }
    set disponibilidad(disp) {
        this._disponibilidad = (disp === true || disp === "true");
    }

    get obtenerDatos() {
        const datos = {
            nombre: this._nombre,
            descripcion: this._descripcion,
            precio: this._precio,
            categoria: this._categoria,
            disponibilidad: this._disponibilidad
        };
        return (this._id_art !== undefined) ? { id_art: this._id_art, ...datos } : datos;
    }
}
module.exports = Articulo;