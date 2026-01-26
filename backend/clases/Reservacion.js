class Reservacion {
    constructor(datos) {
        this.id_res = datos.id_res;
        this.id_usuario = datos.id_usuario; 
        this.num_hab = datos.num_hab;   
        this.fecha_entrada = datos.fecha_entrada;
        this.fecha_salida = datos.fecha_salida;
        this.num_huespedes = datos.num_huespedes;
        this.estado_reserva = datos.estado_reserva;
        this.total = datos.total;
        this.notas = datos.notas;
    }

    set fecha_entrada(fecha) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(fecha)) this._fecha_entrada = fecha;
    }
    set fecha_salida(fecha) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (regex.test(fecha)) this._fecha_salida = fecha;
    }
    set num_huespedes(num) {
        if (!isNaN(num) && num > 0) this._num_huespedes = num;
    }
    set total(total) {
        if (!isNaN(total) && total >= 0) this._total = total;
    }
    set estado_reserva(estado) {
        const estados = ["Confirmada", "Check-in", "Check-out", "Cancelada"];
        if (estados.includes(estado)) this._estado_reserva = estado;
    }

    get obtenerDatos() {
        const datos = {
            id_usuario: this._id_usuario,
            num_hab: this._num_hab,
            fecha_entrada: this._fecha_entrada,
            fecha_salida: this._fecha_salida,
            num_huespedes: this._num_huespedes,
            estado_reserva: this._estado_reserva,
            total: this._total,
            notas: this._notas || ""
        };
        return (this._id_res !== undefined) ? { id_res: this._id_res, ...datos } : datos;
    }
}
module.exports = Reservacion;