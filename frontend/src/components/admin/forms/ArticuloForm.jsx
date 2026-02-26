import React from "react";

const ArticuloForm = ({
    formArticulo,
    setFormArticulo
}) => {
    return (
        <div className="form-grid">

            <div className="form-group">
                <label>Nombre</label>
                <input
                    type="text"
                    value={formArticulo.nombre}
                    onChange={(e) =>
                        setFormArticulo({
                            ...formArticulo,
                            nombre: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Precio</label>
                <input
                    type="number"
                    value={formArticulo.precio}
                    onChange={(e) =>
                        setFormArticulo({
                            ...formArticulo,
                            precio: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Categoría</label>
                <select
                    value={formArticulo.categoria}
                    onChange={(e) =>
                        setFormArticulo({
                            ...formArticulo,
                            categoria: e.target.value
                        })
                    }
                    className="form-input"
                >
                    <option value="Restaurante">Restaurante</option>
                    <option value="Blancos">Blancos</option>
                </select>
            </div>

            <div className="form-group">
                <label>Disponibilidad</label>
                <select
                    value={formArticulo.disponibilidad}
                    onChange={(e) =>
                        setFormArticulo({
                            ...formArticulo,
                            disponibilidad: e.target.value
                        })
                    }
                    className="form-input"
                >
                    <option value="Disponible">Disponible</option>
                    <option value="Agotado">Agotado</option>
                </select>
            </div>

            <div className="form-group form-group-full">
                <label>Descripción</label>
                <textarea
                    value={formArticulo.descripcion}
                    onChange={(e) =>
                        setFormArticulo({
                            ...formArticulo,
                            descripcion: e.target.value
                        })
                    }
                    className="form-input"
                    rows="3"
                />
            </div>

        </div>
    );
};

export default ArticuloForm;