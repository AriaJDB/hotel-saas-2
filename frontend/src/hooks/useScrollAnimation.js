import { useEffect, useRef, useState } from 'react';

/**
 * useScrollAnimation
 * Retorna [ref, isVisible].
 * Cuando el elemento entra al viewport, isVisible = true.
 * El componente usa isVisible para agregar 'is-visible' en className.
 */
const useScrollAnimation = (threshold = 0, rootMargin = '0px', once = true) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, isVisible];
};

export default useScrollAnimation;