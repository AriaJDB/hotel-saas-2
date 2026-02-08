class Pedido {
    constructor(datos) {
        this.id_res = datos.id_res;
        this.id_art = datos.id_art;
        this.cantidad = datos.cantidad;
        this.estado = datos.estado;
        this.fecha = datos.fecha;
    }

    set cantidad(cant) {
        if (!isNaN(cant) && cant > 0) this._cantidad = cant;
    }
    set estado(est) {
        const estados = ["Recibido", "Preparando", "Entregado"];
        if (estados.includes(est)) this._estado = est;
    }

    get obtenerDatos() {
        return {
            id_res: this._id_res,
            id_art: this._id_art,
            cantidad: this._cantidad,
            estado: this._estado,
            fecha: this._fecha || new Date().toISOString()
        };
    }
}
module.exports = Pedido;