import React from "react";

const RoomCard = ({
    hab,
    roomImages = {},
    currentImages = {},
    prevImage,
    nextImage,
    goToImage
}) => {

    if (!hab) return null;

    const images = roomImages[hab.tipo] || [];
    const currentIndex = currentImages[hab.id] || 0;
    const amenidades = Array.isArray(hab.amenidades)
        ? hab.amenidades
        : typeof hab.amenidades === "string"
            ? hab.amenidades.split(",")
            : [];


    return (
        <article className="room-card">

    {/* ===== Carrusel ===== */}
    <div className="room-carousel">

        {images.length > 0 && (
            <img
                src={images[currentIndex]}
                alt={hab.tipo}
                className="room-carousel-image"
            />
        )}

        {/* Botones */}
        <button
            className="carousel-btn carousel-btn-prev"
            onClick={() => prevImage(hab.id, hab.tipo)}
        >
            ‹
        </button>

        <button
            className="carousel-btn carousel-btn-next"
            onClick={() => nextImage(hab.id, hab.tipo)}
        >
            ›
        </button>

        {/* Dots */}
        <div className="carousel-dots">
            {images.map((_, index) => (
                <button
                    key={index}
                    className={`carousel-dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => goToImage(hab.id, index)}
                />
            ))}
        </div>

        {/* Precio flotante */}
        <div className="room-price">
            <span className="price-amount">
                ${hab.precio_noche}
            </span>
            <span className="price-period">
                /noche
            </span>
        </div>

        {/* Badge */}
        <div className="room-badge">
            Disponible
        </div>

    </div>

    {/* ===== Contenido ===== */}
    <div className="room-content">
        <h3 className="room-title">{hab.tipo}</h3>

        <p className="room-description">
            Habitación {hab.num_ha} en el piso {hab.piso}.
        </p>

        {amenidades.length > 0 && (
            <div className="room-amenities">
                {amenidades.map((item, i) => (
                    <span key={i} className="amenity-tag">
                        {item.trim()}
                    </span>
                ))}
            </div>
        )}

        <button className="btn-reserve">
            Reservar Ahora
        </button>
    </div>

</article>

    );
};

export default RoomCard;
