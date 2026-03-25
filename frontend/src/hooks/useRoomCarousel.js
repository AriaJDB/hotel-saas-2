import { useState, useCallback, useRef } from 'react';

const FADE_DURATION = 300; // ms — debe coincidir con transition en CSS

/**
 * useRoomCarousel
 * Compatible con Home.jsx y ClientDashboard.jsx.
 *
 * roomImages es opcional (default: {}).
 * nextImage / prevImage aceptan (habId, tipoOrLength):
 *   - string → busca roomImages[tipo]
 *   - number → lo usa directamente como total de imágenes
 */
const useRoomCarousel = (roomImages = {}) => {
    const [currentImages, setCurrentImages] = useState({});
    const [fadingImages, setFadingImages]   = useState({});
    const timeouts = useRef({});

    const changeImage = useCallback((habId, getNextIndex) => {
        if (timeouts.current[habId]) clearTimeout(timeouts.current[habId]);

        // 1. Fade-out
        setFadingImages(prev => ({ ...prev, [habId]: true }));

        // 2. Cambia la imagen a mitad de la transición, luego fade-in
        timeouts.current[habId] = setTimeout(() => {
            setCurrentImages(prev => {
                const nextIndex = getNextIndex(prev[habId] ?? 0);
                return { ...prev, [habId]: nextIndex };
            });
            setFadingImages(prev => ({ ...prev, [habId]: false }));
        }, FADE_DURATION);
    }, []);

    // tipoOrLength: string (tipo de hab) o number (longitud del array)
    const getLength = useCallback((tipoOrLength) => {
        if (typeof tipoOrLength === 'number') return tipoOrLength;
        const imgs = roomImages[tipoOrLength] || roomImages['Individual'] || [];
        return imgs.length || 1;
    }, [roomImages]);

    const nextImage = useCallback((habId, tipoOrLength) => {
        const len = getLength(tipoOrLength);
        changeImage(habId, (current) => (current + 1) % len);
    }, [getLength, changeImage]);

    const prevImage = useCallback((habId, tipoOrLength) => {
        const len = getLength(tipoOrLength);
        changeImage(habId, (current) => (current === 0 ? len - 1 : current - 1));
    }, [getLength, changeImage]);

    const goToImage = useCallback((habId, index) => {
        changeImage(habId, () => index);
    }, [changeImage]);

    return { currentImages, fadingImages, nextImage, prevImage, goToImage, setCurrentImages };
};

// Exportación doble para compatibilidad:
// import useRoomCarousel from '...'       ← ClientDashboard (default)
// import { useRoomCarousel } from '...'   ← Home (named)
export { useRoomCarousel };
export default useRoomCarousel;