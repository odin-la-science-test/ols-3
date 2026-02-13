import React from 'react';
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from './ThemeContext';

interface PageLayoutProps {
    children: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    const { theme } = useTheme();
    const c = theme.colors;
    const ds = theme.designSystem;

    return (
        <div style={{
            minHeight: '100vh',
            background: c.bgPrimary,
            color: c.textPrimary,
            fontFamily: ds.fontFamily,
            position: 'relative',
            overflowX: 'hidden',
        }}>
            {/* Background Effects matching LandingPage */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: `
                    radial-gradient(circle at 20% 30%, ${c.accentPrimary}11 0%, transparent 40%),
                    radial-gradient(circle at 80% 70%, ${c.accentSecondary}11 0%, transparent 40%)
                `,
                zIndex: 0,
            }} />

            <Navbar />
            <div style={{ position: 'relative', zIndex: 1, paddingTop: '40px', paddingBottom: '80px' }}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default PageLayout;
