import { useState, useCallback, useRef } from 'react';

/**
 * useRoomCarousel
 * Maneja el índice de imagen actual para cada habitación
 * e incluye transición fade al cambiar de imagen.
 *
 * Devuelve:
 *  - currentImages   : { [habId]: index }
 *  - fadingImages    : { [habId]: true/false }  ← nuevo: controla la clase CSS del fade
 *  - nextImage       : (habId, tipo) => void
 *  - prevImage       : (habId, tipo) => void
 *  - goToImage       : (habId, index) => void
 *  - setCurrentImages: setState directo (para inicialización)
 */
const FADE_DURATION = 300; // ms — debe coincidir con transition en CSS

const useRoomCarousel = (roomImages) => {
    const [currentImages, setCurrentImages] = useState({});
    const [fadingImages, setFadingImages] = useState({});
    const timeouts = useRef({});

    // Inicia el fade-out, cambia imagen, luego hace fade-in
    const changeImage = useCallback((habId, getNextIndex) => {
        // Cancela cualquier transición pendiente para esta habitación
        if (timeouts.current[habId]) clearTimeout(timeouts.current[habId]);

        // 1. Fade-out
        setFadingImages(prev => ({ ...prev, [habId]: true }));

        // 2. Cambia la imagen a mitad de la transición
        timeouts.current[habId] = setTimeout(() => {
            setCurrentImages(prev => {
                const nextIndex = getNextIndex(prev[habId] ?? 0);
                return { ...prev, [habId]: nextIndex };
            });
            // 3. Fade-in
            setFadingImages(prev => ({ ...prev, [habId]: false }));
        }, FADE_DURATION);
    }, []);

    const nextImage = useCallback((habId, tipo) => {
        const images = roomImages[tipo] || roomImages['Individual'] || [];
        changeImage(habId, (current) => (current + 1) % images.length);
    }, [roomImages, changeImage]);

    const prevImage = useCallback((habId, tipo) => {
        const images = roomImages[tipo] || roomImages['Individual'] || [];
        changeImage(habId, (current) => (current === 0 ? images.length - 1 : current - 1));
    }, [roomImages, changeImage]);

    const goToImage = useCallback((habId, index) => {
        changeImage(habId, () => index);
    }, [changeImage]);

    return {
        currentImages,
        fadingImages,
        nextImage,
        prevImage,
        goToImage,
        setCurrentImages,
    };
};

export default useRoomCarousel;
