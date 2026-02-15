import type { ReactElement } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface ResponsiveRouteProps {
  desktop: ReactElement;
  mobile: ReactElement;
}

const ResponsiveRoute = ({ desktop, mobile }: ResponsiveRouteProps) => {
  const { isMobile } = useDeviceDetection();
  
  return isMobile ? mobile : desktop;
};

export default ResponsiveRoute;
