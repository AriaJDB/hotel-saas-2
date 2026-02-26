import React from "react";

const UsuariosSection = ({
    usuarios,
    abrirModal,
    eliminarUsuario
}) => {
    return (
        <div className="section-card">
            <div className="section-header">
                <h2>Usuarios</h2>
                <button
                    className="btn-primary"
                    onClick={() => abrirModal("usuario", "crear")}
                >
                    Nuevo Usuario
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((user) => (
                        <tr key={user.id}>
                            <td>{user.nombre} {user.apellidos}</td>
                            <td>{user.correo}</td>
                            <td>{user.tipo}</td>
                            <td>
                                <button
                                    className="btn-icon"
                                    onClick={() =>
                                        abrirModal("usuario", "editar", user)
                                    }
                                    
                                >
                                    ✏️
                                </button>

                                <button
                                    className="btn-icon btn-danger"
                                    onClick={() =>
                                        eliminarUsuario(user.id)
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

export default UsuariosSection;