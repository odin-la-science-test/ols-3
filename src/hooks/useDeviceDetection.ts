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
    const [deviceType, setDeviceType] = useState({ isMobile: false, isTablet: false });

    useEffect(() => {
        setMounted(true);
        
        // Detect device type based on User Agent and touch capability
        const detectDevice = () => {
            const ua = navigator.userAgent.toLowerCase();
            const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
            const isTabletUA = /ipad|android(?!.*mobile)|tablet/i.test(ua);
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            
            // Mobile if: mobile UA OR (touch device AND small screen initially)
            const isMobile = isMobileUA && !isTabletUA;
            const isTablet = isTabletUA;
            
            setDeviceType({ isMobile, isTablet });
        };

        const handleResize = () => setWidth(window.innerWidth);

        detectDevice();
        handleResize();
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isDesktop = !deviceType.isMobile && !deviceType.isTablet;

    return { 
        isMobile: deviceType.isMobile, 
        isTablet: deviceType.isTablet, 
        isDesktop, 
        isTouch, 
        width 
    };
};
