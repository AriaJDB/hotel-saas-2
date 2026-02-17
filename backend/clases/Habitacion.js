class Habitacion {
    constructor(datos) {
        this.num = datos.num_ha || datos.num;
        this.piso = datos.piso;
        this.tipo = datos.tipo;
        this.precio_noche = datos.precio_noche;
        this.amenidades = datos.amenidades;
        this.estado = datos.estado;
        this.ultima_lim = datos.ultima_lim || null;
        this.id_em = datos.id_em || null;
    }

    set num(val) {
        const valorNumerico = parseInt(val);
        if (!isNaN(valorNumerico)) {
            this._num = valorNumerico;
        }
    }

    set piso(piso) {
        if (!isNaN(piso) && piso >= 0) this._piso = parseInt(piso);
    }

    set tipo(tipo) {
        // Sincronizado con tu imagen: individual, doble, triple
        const tiposValidos = ["Individual", "Doble", "Triple", "Suite", "Deluxe"];
        if (tiposValidos.includes(tipo)) this._tipo = tipo;
    }

    set estado(estado) {
        // Sincronizado con tu imagen: ocupada, libre, limpieza, mantenimiento
        const estadosValidos = ["Ocupada", "Disponible", "Limpieza", "Mantenimiento"];
        if (estadosValidos.includes(estado)) this._estado = estado;
    }

    set precio_noche(precio) {
        if (!isNaN(precio) && precio > 0) this._precio_noche = parseFloat(precio);
    }

    set amenidades(amenidades) {
        if (Array.isArray(amenidades)) {
            this._amenidades = amenidades;
        } else if (typeof amenidades === 'string' && amenidades.trim() !== "") {
            this._amenidades = amenidades.split(',').map(a => a.trim());
        } else {
            this._amenidades = [];
        }
    }


    set ultima_lim(fecha) { this._ultima_lim = fecha; }
    set id_em(id) { this._id_em = id; }

    get obtenerDatos() {
        return {
            num: this._num,
            piso: this._piso,
            tipo: this._tipo,
            precio_noche: this._precio_noche,
            amenidades: this._amenidades,
            estado: this._estado,
            ultima_lim: this.ultima_lim,
            id_em: this.id_em
        };
    }
}

module.exports = Habitacion;