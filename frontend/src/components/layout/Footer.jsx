const Footer = () => {
    return (
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
                        <p>Soporte 24/7</p>
                    </div>
                    <div className="footer-section">
                        <h4>Horarios</h4>
                        <p>Check-in: 3:00 PM</p>
                        <p>Check-out: 12:00 PM</p>
                        <p>Recepción: 24 horas</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 HotelFlow. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
