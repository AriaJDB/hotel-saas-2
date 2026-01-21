import React, { useState } from 'react';
import { registrarUsuario } from '../api/servicios';
import { Link } from 'react-router-dom';

const Registro = () => {
    const [datos, setDatos] = useState({
        nombre: '', apellidos: '', correo: '', telefono: '', password: ''
    });

    const manejarEnvio = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await registrarUsuario(datos);
            if (respuesta.data) alert("¡Registro exitoso!");
        } catch (error) {
            alert("Error en el registro. Revisa las validaciones.");
        }
    };

    return (
        <form onSubmit={manejarEnvio}>
            <h2>Registro de Huésped</h2>
            <input type="text" placeholder="Nombre" onChange={e => setDatos({...datos, nombre: e.target.value})} required />
            <input type="text" placeholder="Apellidos" onChange={e => setDatos({...datos, apellidos: e.target.value})} required />
            <input type="email" placeholder="Correo" onChange={e => setDatos({...datos, correo: e.target.value})} required />
            <input type="text" placeholder="Teléfono" onChange={e => setDatos({...datos, telefono: e.target.value})} required />
            <input type="password" placeholder="Contraseña" onChange={e => setDatos({...datos, password: e.target.value})} required />
            <button type="submit">Registrarme</button>
            <Link to="/login" className="footer-link">¿Ya tienes cuenta? Inicia sesión</Link>
        </form>
    );
};

export default Registro;