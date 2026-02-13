import { useState, useEffect } from 'react';

export interface DeviceInfo {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouch: boolean;
    width: number;
}

export const useDeviceDetection = (): DeviceInfo => {
    const [mounted, setMounted] = useState(false);
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleResize = () => setWidth(window.innerWidth);
        const handleTouch = () => setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);

        handleResize();
        handleTouch();
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;

    return { isMobile, isTablet, isDesktop, isTouch, width };
};
