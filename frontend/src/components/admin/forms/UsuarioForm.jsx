import React from "react";

const UsuarioForm = ({
    formUsuario,
    setFormUsuario,
    modoModal
}) => {
    return (
        <div className="form-grid">

            <div className="form-group">
                <label>Nombre</label>
                <input
                    type="text"
                    value={formUsuario.nombre}
                    onChange={(e) =>
                        setFormUsuario({
                            ...formUsuario,
                            nombre: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Apellidos</label>
                <input
                    type="text"
                    value={formUsuario.apellidos}
                    onChange={(e) =>
                        setFormUsuario({
                            ...formUsuario,
                            apellidos: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Correo</label>
                <input
                    type="email"
                    value={formUsuario.correo}
                    onChange={(e) =>
                        setFormUsuario({
                            ...formUsuario,
                            correo: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Teléfono</label>
                <input
                    type="tel"
                    value={formUsuario.telefono}
                    onChange={(e) =>
                        setFormUsuario({
                            ...formUsuario,
                            telefono: e.target.value
                        })
                    }
                    className="form-input"
                />
            </div>

            <div className="form-group">
                <label>Contraseña</label>
                <input
                    type="password"
                    value={formUsuario.password}
                    onChange={(e) =>
                        setFormUsuario({
                            ...formUsuario,
                            password: e.target.value
                        })
                    }
                    className="form-input"
                    placeholder={
                        modoModal === "editar"
                            ? "Dejar en blanco para no cambiar"
                            : ""
                    }
                />
            </div>

            <div className="form-group">
                <label>Tipo de Usuario</label>
                <select
                    value={formUsuario.tipo}
                    onChange={(e) =>
                        setFormUsuario({
                            ...formUsuario,
                            tipo: e.target.value
                        })
                    }
                    className="form-input"
                >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                    <option value="empleado">Empleado</option>
                </select>
            </div>

        </div>
    );
};

export default UsuarioForm;