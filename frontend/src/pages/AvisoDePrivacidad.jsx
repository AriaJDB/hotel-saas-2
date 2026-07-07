import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ClientStyles.css';

const AvisoDePrivacidad = ({ isModal = false }) => {
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
                <h1 style={{ color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>Aviso de Privacidad</h1>
                <p className="legal-meta">Última actualización: 6 de julio de 2026</p>

                <p className="legal-paragraph">
                    En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong> de México (texto vigente con última reforma publicada en el Diario Oficial de la Federación el 14-11-2025), <strong>HotelFlow S.A. de C.V.</strong> (en adelante, "HotelFlow" o "el Responsable"), con domicilio en <em>Avenida de la Reforma 123, Colonia Centro, Ciudad de México, C.P. 06000</em>, pone a su disposición el presente Aviso de Privacidad.
                </p>

                <h3 className="legal-section-title">1. Datos Personales que Recabamos</h3>
                <p className="legal-paragraph">
                    Para llevar a cabo las finalidades descritas en este documento, recabamos los siguientes datos personales de identificación y contacto de nuestros usuarios al registrarse:
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item">Nombre completo.</li>
                    <li className="legal-list-item">Dirección de correo electrónico.</li>
                    <li className="legal-list-item">Contraseña (almacenada encriptada de forma segura en formato hash unidireccional con sal).</li>
                </ul>
                <p className="legal-paragraph">
                    <strong>Datos Personales Sensibles:</strong> Declaramos que para el registro en nuestra plataforma <strong>no se recaban datos personales sensibles</strong> (tales como origen étnico, estado de salud, información genética, creencias religiosas, filosóficas o morales, afiliación sindical, opiniones políticas o preferencia sexual).
                </p>
                <p className="legal-paragraph">
                    Para el procesamiento de reservaciones y transacciones de pago, se recabarán adicionalmente datos financieros y patrimoniales (como números de tarjeta de crédito/débito, fecha de vencimiento y código de seguridad), los cuales son tratados con cifrado estricto y bajo las más altas medidas de seguridad bancaria, requiriendo su consentimiento expreso al momento de la compra.
                </p>

                <h3 className="legal-section-title">2. Finalidades del Tratamiento</h3>
                <p className="legal-paragraph">
                    Los datos personales recabados serán utilizados para las siguientes finalidades:
                </p>
                <p className="legal-paragraph">
                    <strong>Finalidades Primarias (Necesarias para la relación jurídica):</strong>
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item">Crear, gestionar y administrar su cuenta de usuario en la plataforma HotelFlow.</li>
                    <li className="legal-list-item">Procesar y gestionar sus reservaciones de habitaciones y servicios de hotel adicionales.</li>
                    <li className="legal-list-item">Realizar la facturación y el procesamiento de los pagos correspondientes.</li>
                    <li className="legal-list-item">Establecer un canal de comunicación para enviar confirmaciones de reservaciones, actualizaciones de servicio, atención a clientes y soporte técnico.</li>
                </ul>
                <p className="legal-paragraph">
                    <strong>Finalidades Secundarias (No necesarias para la relación jurídica, pero de utilidad para mejorar su experiencia):</strong>
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item">Enviar boletines informativos, promociones, ofertas de temporada y publicidad sobre nuestros servicios.</li>
                    <li className="legal-list-item">Realizar encuestas de satisfacción, estudios de mercado y análisis de uso del sistema.</li>
                </ul>
                <p className="legal-paragraph">
                    <em>Mecanismo de Oposición para Fines Secundarios:</em> Si usted no desea que sus datos sean tratados para las finalidades secundarias, puede oponerse en cualquier momento enviando un correo electrónico a <a href="mailto:privacidad@hotelflow.com" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>privacidad@hotelflow.com</a>, indicando su negativa. Esto no afectará la prestación de los servicios de hospedaje ni el uso de su cuenta.
                </p>

                <h3 className="legal-section-title">3. Opciones y Medios para Limitar el Uso o Divulgación de sus Datos</h3>
                <p className="legal-paragraph">
                    Además de ejercer sus derechos ARCO, usted puede limitar el uso o divulgación de sus datos personales registrándose en el Registro Público para Evitar Publicidad (REPEP) ante la Procuraduría Federal del Consumidor (PROFECO). Asimismo, puede solicitar su exclusión de nuestras listas de correo promocional enviando su petición al correo <a href="mailto:privacidad@hotelflow.com" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>privacidad@hotelflow.com</a> o haciendo clic en el enlace de "cancelar suscripción" ubicado al pie de todos nuestros correos electrónicos comerciales.
                </p>

                <h3 className="legal-section-title">4. Medios para Ejercer los Derechos ARCO</h3>
                <p className="legal-paragraph">
                    Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (<strong>Rectificación</strong>); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada adecuadamente (<strong>Cancelación</strong>); así como oponerse al uso de sus datos personales para fines específicos (<strong>Oposición</strong>). Estos derechos se conocen como derechos ARCO.
                </p>
                <p className="legal-paragraph">
                    <strong>Procedimiento para ejercer los Derechos ARCO:</strong>
                    Usted o su representante legal debidamente acreditado podrán enviar una solicitud al Departamento de Privacidad de HotelFlow vía correo electrónico a <a href="mailto:privacidad@hotelflow.com" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>privacidad@hotelflow.com</a>.
                </p>
                <p className="legal-paragraph">
                    La solicitud deberá contener y acompañarse de lo siguiente:
                </p>
                <ul className="legal-list">
                    <li className="legal-list-item">Nombre completo del titular, domicilio o dirección de correo electrónico para comunicarle la respuesta a su solicitud.</li>
                    <li className="legal-list-item">Documentos oficiales que acrediten la identidad del titular (INE, Pasaporte, etc.) o, en su caso, del representante legal junto con el poder correspondiente.</li>
                    <li className="legal-list-item">Descripción clara y precisa de los datos personales respecto de los que se busca ejercer alguno de los derechos ARCO.</li>
                    <li className="legal-list-item">Cualquier otro elemento o documento que facilite la localización de los datos personales.</li>
                </ul>
                <p className="legal-paragraph">
                    HotelFlow comunicará la respuesta al titular en un plazo máximo de <strong>20 (veinte) días hábiles</strong>, contados desde la fecha en que se recibió la solicitud. Si resulta procedente, se hará efectiva dentro de los 15 (quince) días hábiles siguientes a la fecha en que se comunique la respuesta.
                </p>

                <h3 className="legal-section-title">5. Revocación del Consentimiento</h3>
                <p className="legal-paragraph">
                    Usted puede revocar el consentimiento que nos haya otorgado para el tratamiento de sus datos personales en cualquier momento. Sin embargo, es importante que tenga en cuenta que no en todos los casos podremos atender su solicitud de forma inmediata si requerimos seguir tratando sus datos por alguna obligación legal. Asimismo, la revocación del consentimiento para las finalidades primarias implicará que no podremos seguir prestándole el servicio o la cancelación de su cuenta.
                </p>
                <p className="legal-paragraph">
                    La revocación <strong>no tendrá efectos retroactivos</strong>. El trámite se realiza mediante el mismo procedimiento detallado para el ejercicio de los Derechos ARCO ante nuestro correo de contacto <a href="mailto:privacidad@hotelflow.com" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>privacidad@hotelflow.com</a>.
                </p>

                <h3 className="legal-section-title">6. Cambios al Aviso de Privacidad</h3>
                <p className="legal-paragraph">
                    El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales, de nuestras propias necesidades por los servicios que ofrecemos, de nuestras prácticas de privacidad, o por cambios en nuestro modelo de negocio.
                </p>
                <p className="legal-paragraph">
                    Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir este aviso de privacidad a través de publicaciones en nuestro sitio web oficial <strong>www.hotelflow.com</strong>, en la sección de "Aviso de Privacidad", o mediante el envío de un correo electrónico a los usuarios registrados.
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

export default AvisoDePrivacidad;
