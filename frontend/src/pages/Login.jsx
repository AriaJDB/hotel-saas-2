import React, { useState } from 'react';
import { loginUsuario } from '../api/servicios';
import { Link } from 'react-router-dom';

const Login = () => {
    const [credenciales, setCredenciales] = useState({ correo: '', password: '' });

    const manejarLogin = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await loginUsuario(credenciales);
            if (respuesta.data === true) {
                alert("Bienvenido al Hotel");
                // Aquí podrías redireccionar al Dashboard
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <form onSubmit={manejarLogin}>
            <h2>Acceso al Sistema</h2>
            <input type="email" placeholder="Correo" onChange={e => setCredenciales({...credenciales, correo: e.target.value})} required />
            <input type="password" placeholder="Contraseña" onChange={e => setCredenciales({...credenciales, password: e.target.value})} required />
            <button type="submit">Entrar</button>
            <Link to="/registro" className="footer-link">¿No tienes cuenta? Regístrate aquí</Link>
        </form>
    );
};

export default Login;