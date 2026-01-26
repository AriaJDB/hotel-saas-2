class Habitacion {
    constructor(datos) {
        this.num = datos.num;
        this.piso = datos.piso;
        this.tipo = datos.tipo;
        this.precio_noche = datos.precio_noche;
        this.amenidades = datos.amenidades;
        this.estado = datos.estado;
    }

    set num(num) {
        const regex = /^[A-Z0-9]{1,5}$/;
        if (regex.test(num)) this._num = num;
    }
    set piso(piso) {
        if (!isNaN(piso) && piso >= 0) this._piso = piso;
    }
    set tipo(tipo) {
        const tiposValidos = ["Sencilla", "Doble", "Suite", "Deluxe"];
        if (tiposValidos.includes(tipo)) this._tipo = tipo;
    }
    set precio_noche(precio) {
        if (!isNaN(precio) && precio > 0) this._precio_noche = precio;
    }
    set amenidades(amenidades) { this._amenidades = amenidades; }
    set estado(estado) {
        const estadosValidos = ["Disponible", "Ocupada", "Limpiando", "Mantenimiento"];
        if (estadosValidos.includes(estado)) this._estado = estado;
    }

    get obtenerDatos() {
        return {
            num: this._num,
            piso: this._piso,
            tipo: this._tipo,
            precio_noche: this._precio_noche,
            amenidades: this._amenidades,
            estado: this._estado
        };
    }
}
module.exports = Habitacion;