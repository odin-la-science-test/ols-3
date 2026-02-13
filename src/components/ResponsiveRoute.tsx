import { lazy, Suspense } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface ResponsiveRouteProps {
    desktopComponent: React.ComponentType<any>;
    mobileComponent: React.ComponentType<any>;
}

const ResponsiveRoute = ({ desktopComponent: Desktop, mobileComponent: Mobile }: ResponsiveRouteProps) => {
    const { isMobile } = useDeviceDetection();

    return (
        <Suspense fallback={
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'var(--bg-primary)'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid var(--accent-hugin)',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        margin: '0 auto 1rem',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p>Chargement...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        }>
            {isMobile ? <Mobile /> : <Desktop />}
        </Suspense>
    );
};

export default ResponsiveRoute;
