import { useEffect, useRef, useState } from 'react';

/**
 * useScrollAnimation
 * Detecta cuando un elemento entra al viewport usando IntersectionObserver
 * y devuelve una ref + un booleano `isVisible`.
 *
 * Uso:
 *   const [ref, isVisible] = useScrollAnimation();
 *   <div ref={ref} className={`fade-in-section ${isVisible ? 'is-visible' : ''}`}>
 *
 * @param {number} threshold  - Qué fracción del elemento debe estar visible (0.0 – 1.0)
 * @param {string} rootMargin - Margen del viewport, e.g. '0px 0px -80px 0px'
 * @param {boolean} once      - Si es true, deja de observar después de la primera vez visible
 */
const useScrollAnimation = (threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(element);
                } else {
                    if (!once) setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, isVisible];
};

export default useScrollAnimation;
