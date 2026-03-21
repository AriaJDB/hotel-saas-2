import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ClientStyles.css';
import { roomImages } from "../constants/roomImages";
import { useRoomCarousel } from '../hooks/useRoomCarousel';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/HeaderHome';

const Home = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const { currentImages, nextImage, prevImage, goToImage, setCurrentImages } = useRoomCarousel(roomImages);

    const intervalsRef = useRef({});

    useEffect(() => {
        cargarHabitaciones();
        return () => {
            Object.values(intervalsRef.current).forEach(clearInterval);
        };
    }, []);

    const [flippedServices, setFlippedServices] = useState({});

    const toggleServiceFlip = (index) => {
        setFlippedServices(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Lógica de Autoplay al entrar el mouse
    const handleMouseEnter = (habId, habTipo) => {
        if (intervalsRef.current[habId]) return;
        intervalsRef.current[habId] = setInterval(() => {
            nextImage(habId, habTipo);
        }, 1000);
    };

    const handleMouseLeave = (habId) => {
        if (intervalsRef.current[habId]) {
            clearInterval(intervalsRef.current[habId]);
            delete intervalsRef.current[habId];
        }
    };

    // Efecto de Scroll
    useEffect(() => {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [habitaciones]);

    const cargarHabitaciones = async () => {
        try {
            const response = await axios.get('http://localhost:3000/habitaciones');
            let lista = Array.isArray(response.data) ? response.data : (response.data?.datos || []);
            setHabitaciones(lista);

            const initialImages = {};
            lista.forEach(hab => { initialImages[hab.id] = 0; });
            setCurrentImages(initialImages);
        } catch (error) {
            console.error('Error cargando habitaciones:', error);
            setHabitaciones([]);
        }
    };

    return (
        <div>
            <Header />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="container">
                    <div className="hero-content">
                        <h2 className="hero-title">Bienvenido a HotelFlow</h2>
                        <p className="hero-subtitle">Experiencia de hospedaje premium para viajeros de negocios y placer</p>
                        <div className="booking-card">
                            <h3 className="booking-title">Reserve su Habitación</h3>
                            <form className="booking-form">
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label>Fecha de Entrada</label>
                                        <input type="date" className="input" required />
                                    </div>
                                    <div className="form-field">
                                        <label>Fecha de Salida</label>
                                        <input type="date" className="input" required />
                                    </div>
                                    <div className="form-field">
                                        <label>Huéspedes</label>
                                        <select className="input">
                                            <option>1 Adulto</option>
                                            <option>2 Adultos</option>
                                            <option>3 Adultos</option>
                                            <option>4+ Adultos</option>
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Tipo de Habitación</label>
                                        <select className="input">
                                            <option>Todas</option>
                                            <option>Individual</option>
                                            <option>Doble</option>
                                            <option>Suite</option>
                                            <option>Suite Ejecutiva</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn-search">
                                    <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.35-4.35"></path>
                                    </svg>
                                    Buscar Disponibilidad
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - ICONOS RESTAURADOS */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        {/* Feature 1 */}
                        <div className="feature-card">
                            <div className="reveal">
                                <div className="feature-icon feature-icon-blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                    </svg>
                                </div>
                                <h3>Múltiples Ubicaciones</h3>
                                <p>Hoteles en las principales ciudades del país</p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="feature-card">
                            <div className="reveal">
                                <div className="feature-icon feature-icon-green">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <h3>Confirmación Inmediata</h3>
                                <p>Reserva confirmada al instante sin esperas</p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="feature-card">
                            <div className="reveal">
                                <div className="feature-icon feature-icon-purple">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                        <line x1="1" y1="10" x2="23" y2="10"></line>
                                    </svg>
                                </div>
                                <h3>Pago Seguro</h3>
                                <p>Transacciones protegidas y cifradas</p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="feature-card">
                            <div className="reveal">
                                <div className="feature-icon feature-icon-orange">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <h3>Soporte 24/7</h3>
                                <p>Atención al cliente las 24 horas del día</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms Section */}
            <section id="habitaciones" className="rooms">
                <div className="container">
                    <div className="section-header">
                        <div className="reveal">
                            <h2 className="section-title">Nuestras Habitaciones</h2>
                            <p className="section-subtitle">Espacios diseñados para su comodidad y productividad</p>
                        </div>
                    </div>

                    <div className="rooms-grid">
                        {habitaciones.slice(0, 3).map((hab, index) => {
                            const images = roomImages[hab.tipo] || roomImages['Individual'];
                            const currentIndex = currentImages[hab.id] || 0;

                            return (
                                <article
                                    key={hab.id}
                                    className="room-card"
                                    onMouseEnter={() => handleMouseEnter(hab.id, hab.tipo)}
                                    onMouseLeave={() => handleMouseLeave(hab.id)}
                                >
                                    <div className="reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
                                        <div className="room-carousel">
                                            <img
                                                src={images[currentIndex]}
                                                alt={`${hab.tipo}`}
                                                className="room-carousel-image"
                                            />
                                            <button className="carousel-btn carousel-btn-prev" onClick={(e) => { e.preventDefault(); prevImage(hab.id, hab.tipo); }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <polyline points="15 18 9 12 15 6"></polyline>
                                                </svg>
                                            </button>
                                            <button className="carousel-btn carousel-btn-next" onClick={(e) => { e.preventDefault(); nextImage(hab.id, hab.tipo); }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                </svg>
                                            </button>
                                            <div className="carousel-dots">
                                                {images.map((_, dotIdx) => (
                                                    <button
                                                        key={dotIdx}
                                                        className={`carousel-dot ${dotIdx === currentIndex ? 'active' : ''}`}
                                                        onClick={() => goToImage(hab.id, dotIdx)}
                                                    />
                                                ))}
                                            </div>
                                            <div className="room-badge">{hab.estado}</div>
                                            <div className="room-price">
                                                <span className="price-amount">${hab.precio_noche}</span>
                                                <span className="price-period">/noche</span>
                                            </div>
                                        </div>

                                        <div className="room-content">
                                            <h3 className="room-title">{hab.tipo}</h3>
                                            <p className="room-description">
                                                Perfecta para viajeros. Incluye escritorio ejecutivo, WiFi de alta velocidad y espacio de trabajo cómodo.
                                            </p>
                                            <div className="room-amenities">
                                                <div className="amenity">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                        <circle cx="9" cy="7" r="4"></circle>
                                                    </svg>
                                                    <span>Confortable</span>
                                                </div>
                                                <div className="amenity">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M2 4v16"></path>
                                                        <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                                    </svg>
                                                    <span>Hab. {hab.num}</span>
                                                </div>
                                            </div>
                                            <Link to="/registro" className="btn-reserve">
                                                Reservar Ahora
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Resto de secciones (Services, CTA, Footer) sin cambios de lógica */}
            <section id="servicios" className="services">
                <div className="container">
                    <div className="section-header">
                        <div className="reveal">
                            <h2 className="section-title">Servicios Adicionales</h2>
                            <p className="section-subtitle">Complemente su estadía con nuestros servicios premium</p>
                        </div>
                    </div>

                    <div className="services-grid">
                        {[
                            {
                                title: "Desayuno Continental",
                                desc: "Buffet completo de 6:00 AM a 10:00 AM",
                                price: "+ $15/día",
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    </svg>
                                )
                            },
                            {
                                title: "Late Check-out",
                                desc: "Salida hasta las 4:00 PM",
                                price: "+ $25",
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                )
                            },
                            {
                                title: "Traslado Aeropuerto",
                                desc: "Servicio privado ida y vuelta",
                                price: "+ $30",
                                icon: (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                )
                            }
                        ].map((srv, index) => (
                            <div
                                key={index}
                                className={`service-flip-card ${flippedServices[index] ? 'is-flipped' : ''} reveal`}
                                onClick={() => toggleServiceFlip(index)}
                                style={{ transitionDelay: `${index * 0.1}s` }}
                            >
                                <div className="service-flip-inner">
                                    {/* PARTE FRONTAL */}
                                    <div className="service-front">
                                        <div className="service-icon" style={{ marginBottom: '1rem' }}>
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '2rem', opacity: 0.5 }}>
                                                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <span>Clic para revelar servicio</span>
                                    </div>

                                    {/* PARTE TRASERA (CONTENIDO ORIGINAL) */}
                                    <div className="service-back">
                                        <div className="service-icon">
                                            {srv.icon}
                                        </div>
                                        <h4>{srv.title}</h4>
                                        <p>{srv.desc}</p>
                                        <span className="service-price">{srv.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;