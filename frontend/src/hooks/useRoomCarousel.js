import { useState } from "react";

export const useRoomCarousel = (roomImages) => {

    const [currentImages, setCurrentImages] = useState({});

    const nextImage = (habId, tipo) => {
        const images = roomImages[tipo] || roomImages["Individual"];
        setCurrentImages(prev => ({
            ...prev,
            [habId]: (prev[habId] + 1) % images.length
        }));
    };

    const prevImage = (habId, tipo) => {
        const images = roomImages[tipo] || roomImages["Individual"];
        setCurrentImages(prev => ({
            ...prev,
            [habId]: prev[habId] === 0
                ? images.length - 1
                : prev[habId] - 1
        }));
    };

    const goToImage = (habId, index) => {
        setCurrentImages(prev => ({
            ...prev,
            [habId]: index
        }));
    };

    return {
        currentImages,
        nextImage,
        prevImage,
        goToImage,
        setCurrentImages
    };
};