import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ClientStyles.css';

const PoliticaDePrivacidad = ({ isModal = false }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const renderContent = () => {
        return (
            <div className="legal-content">
                <h1 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Política de Privacidad</h1>
                <p className="legal-meta">Última actualización: 6 de julio de 2026</p>

                <p className="legal-paragraph">
                    La presente Política de Privacidad de <strong>HotelFlow S.A. de C.V.</strong> ("HotelFlow") describe de manera clara y transparente nuestras prácticas relativas a la recolección, uso, almacenamiento, seguridad, retención y eliminación de los datos personales de nuestros usuarios en este sitio web y aplicación móvil (el "Sitio").
                </p>

                <h3 className="legal-section-title">1. Recolección de Datos y Propósito</h3>
                <p className="legal-paragraph">
                    Recopilamos información únicamente para ofrecerle nuestros servicios de reservaciones en línea y mejorar su experiencia de navegación. Los datos recopilados son:
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item"><strong>Datos de registro de cuenta:</strong> Nombre completo, correo electrónico y contraseña. Se recopilan con el propósito de crear su perfil de usuario, permitir el acceso a los dashboards de servicios (Cliente, Limpieza, Administración) y mantener la seguridad de su cuenta.</li>
                    <li className="legal-list-item"><strong>Datos de reservación y transacciones:</strong> Fechas de entrada y salida, cantidad de huéspedes, notas especiales, número de habitación y piso. Esto nos permite coordinar su estancia en el hotel.</li>
                </ul>

                <h3 className="legal-section-title">2. Medidas de Seguridad Aplicadas</h3>
                <p className="legal-paragraph">
                    Para HotelFlow, la seguridad de sus datos es una prioridad. Implementamos las siguientes medidas técnicas, físicas y organizativas para proteger su información contra daño, pérdida, alteración, destrucción o el uso, acceso o tratamiento no autorizado:
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item"><strong>Cifrado en tránsito (SSL/TLS - HTTPS):</strong> Toda comunicación de datos entre el navegador web de nuestros usuarios y nuestros servidores se realiza utilizando conexiones seguras HTTPS cifradas mediante protocolos criptográficos modernos.</li>
                    <li className="legal-list-item"><strong>Cifrado en reposo:</strong> Los datos se almacenan en una base de datos Firebase Firestore que implementa de forma automática cifrado AES-256 en reposo para proteger la información en los centros de datos de nuestro proveedor en la nube (Google Cloud Platform).</li>
                    <li className="legal-list-item"><strong>Seguridad de credenciales:</strong> Las contraseñas se protegen mediante algoritmos hash criptográficos con salting, lo que impide que puedan leerse o recuperarse en texto plano incluso para nuestros administradores.</li>
                </ul>
                <p className="legal-paragraph">
                    <em>HotelFlow revisa y refuerza continuamente sus medidas de seguridad conforme evoluciona la plataforma y las mejores prácticas de la industria.</em>
                </p>

                <h3 className="legal-section-title">3. Período de Retención y Condiciones de Eliminación</h3>
                <p className="legal-paragraph">
                    Conservamos sus datos personales únicamente durante el tiempo que sea necesario para cumplir con los propósitos descritos en esta política o por los plazos exigidos por las regulaciones aplicables (tales como obligaciones mercantiles o fiscales en México):
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item">Los datos asociados a su cuenta de usuario se retendrán de forma activa mientras su cuenta permanezca activa.</li>
                    <li className="legal-list-item">Si usted ejerce su derecho de Cancelación o decide eliminar su cuenta, procederemos al borrado seguro de su información personal de nuestras bases de datos activas en un plazo no mayor a <strong>30 (treinta) días naturales</strong>.</li>
                    <li className="legal-list-item">Una vez eliminados, ciertos registros anonimizados e históricos de reservaciones se podrán conservar únicamente para fines estadísticos o en un estado de bloqueo legal si existe alguna obligación regulatoria de retención.</li>
                </ul>

                <h3 className="legal-section-title">4. Transferencias de Datos a Terceros</h3>
                <p className="legal-paragraph">
                    <strong>HotelFlow no vende, renta ni transfiere sus datos personales a terceros comerciales</strong> bajo ninguna circunstancia.
                </p>
                <p className="legal-paragraph">
                    Sus datos personales solo podrán ser transferidos a proveedores de servicios tecnológicos que actúan como "Encargados" bajo nuestro control exclusivo (como pasarelas de pago integradas para el procesamiento de tarjetas de crédito/débito y servicios de envío de correos electrónicos automáticos), los cuales están sujetos a estrictas cláusulas de confidencialidad y tienen prohibido utilizar su información para fines propios. También podrán transferirse datos en cumplimiento de requerimientos legales emitidos por autoridades judiciales o fiscales mexicanas.
                </p>

                <h3 className="legal-section-title">5. Procedimiento de Notificación ante Brechas de Seguridad</h3>
                <p className="legal-paragraph">
                    En cumplimiento con el <strong>Artículo 19 de la LFPDPPP</strong>, en caso de ocurrir alguna vulneración de seguridad en cualquier fase del tratamiento de sus datos personales que afecte de forma significativa sus derechos patrimoniales o morales (por ejemplo: hackeo de bases de datos, accesos no autorizados, o extravío de soportes físicos de información):
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item">El Responsable realizará un análisis inmediato para identificar la naturaleza y el alcance del incidente.</li>
                    <li className="legal-list-item"><strong>Se notificará de forma inmediata al titular de los datos</strong> afectados a través del correo electrónico registrado en la plataforma.</li>
                    <li className="legal-list-item">La notificación contendrá como mínimo: la naturaleza del incidente, los datos personales comprometidos, las medidas correctivas adoptadas de forma inmediata por HotelFlow y las recomendaciones para que el titular proteja su información.</li>
                </ul>

                <h3 className="legal-section-title">6. Ejercicio de Derechos ARCO</h3>
                <p className="legal-paragraph">
                    Para el ejercicio de sus derechos de Acceso, Rectificación, Cancelación u Oposición (ARCO) sobre sus datos recopilados por este Sitio, le rogamos seguir el procedimiento oficial detallado en la sección 4 de nuestro <Link to="/aviso-privacidad" className="link-button" style={{ display: 'inline', fontWeight: 600 }}>Aviso de Privacidad</Link> o enviar su solicitud formal a <a href="mailto:privacidad@hotelflow.com" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>privacidad@hotelflow.com</a>.
                </p>
            </div>
        );
    };

    if (isModal) {
        return renderContent();
    }

    return (
        <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo-section">
                            <svg className="logo" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            <div className="logo-text">
                                <h1>HotelFlow</h1>
                                <p>Sistema de Reservaciones</p>
                            </div>
                        </Link>
                        <nav className="main-nav">
                            <Link to="/" className="nav-link">Inicio</Link>
                            <a href="/#habitaciones" className="nav-link">Habitaciones</a>
                            <a href="/#servicios" className="nav-link">Servicios</a>
                        </nav>
                        <div className="header-actions">
                            <Link to="/login" className="btn-outline">Iniciar Sesión</Link>
                            <Link to="/registro" className="btn-primary">Registrarse</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Container */}
            <main style={{ flex: 1, padding: '2rem 0' }}>
                <div className="container">
                    <button onClick={handleBack} className="legal-back-button">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Volver
                    </button>
                    <div className="legal-container">
                        {renderContent()}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-section">
                            <h3>HotelFlow</h3>
                            <p>Sistema de reservaciones en línea para hoteles de categoría premium.</p>
                        </div>
                        <div className="footer-section">
                            <h4>Contacto</h4>
                            <p>Email: reservas@hotelflow.com</p>
                            <p>Tel: +1 (555) 123-4567</p>
                        </div>
                        <div className="footer-section">
                            <h4>Horarios</h4>
                            <p>Check-in: 3:00 PM</p>
                            <p>Check-out: 12:00 PM</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 HotelFlow. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PoliticaDePrivacidad;
