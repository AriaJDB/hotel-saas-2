import React from "react";

const ArticulosSection = ({
    articulos,
    abrirModal,
    eliminarArticulo
}) => {
    return (
        <div className="section-card">
            <div className="section-header">
                <h2>Artículos</h2>
                <button
                    className="btn-primary"
                    onClick={() => abrirModal("articulo", "crear")}
                >
                    Nuevo Artículo
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Disponibilidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {articulos.map((art) => (
                        <tr key={art.id}>
                            <td>{art.nombre}</td>
                            <td>${art.precio}</td>
                            <td>{art.categoria}</td>
                            <td>{art.disponibilidad}</td>
                            <td>
                                <button
                                    className="btn-icon"
                                    onClick={() =>
                                        abrirModal("articulo", "editar", art)
                                    }
                                >
                                    ✏️
                                </button>

                                <button
                                    className="btn-icon btn-danger"
                                    onClick={() =>
                                        eliminarArticulo(art.id)
                                    }
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ArticulosSection;