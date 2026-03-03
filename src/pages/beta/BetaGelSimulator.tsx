import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkBetaAccess } from '../../utils/betaAccess';
import GelSimulator from '../hugin/GelSimulator';

const BetaGelSimulator: React.FC = () => {
  const hasAccess = checkBetaAccess();

  if (!hasAccess) {
    return <Navigate to="/home" replace />;
  }

  return <GelSimulator />;
};

export default BetaGelSimulator;
