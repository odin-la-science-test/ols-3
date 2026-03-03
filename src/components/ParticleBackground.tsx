import React, { useEffect, useRef, useMemo, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  clicked?: boolean;
  exploding?: boolean;
  explosionProgress?: number;
  explosionParticles?: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }>;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  enableClickable?: boolean;
  onTombolaReached?: () => void;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 50,
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'],
  speed = 0.5,
  enableClickable = false,
  onTombolaReached
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isInitializedRef = useRef(false);
  const [clickCount, setClickCount] = useState(0);
  const [showTombolaModal, setShowTombolaModal] = useState(false);

  // Mémoriser les couleurs pour éviter les re-renders
  const memoizedColors = useMemo(() => colors, [colors.join(',')]);

  // Gestion du clic sur les particules
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('🎯 Canvas cliqué!', { enableClickable });
    
    if (!enableClickable) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    console.log('📍 Position du clic:', { clickX, clickY });

    // Vérifier si une particule a été cliquée
    let particleClicked = false;
    particlesRef.current.forEach((particle, index) => {
      if (particle.clicked) return; // Déjà cliquée
      
      const dx = particle.x - clickX;
      const dy = particle.y - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < particle.size + 10) { // Zone de clic élargie
        console.log('💥 Particule touchée!', { index, distance, size: particle.size });
        
        particle.clicked = true;
        particle.exploding = true;
        particle.explosionProgress = 0;
        
        // Créer des particules d'explosion
        particle.explosionParticles = [];
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 * i) / 12;
          particle.explosionParticles.push({
            x: particle.x,
            y: particle.y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            size: particle.size * 0.5,
            opacity: 1
          });
        }
        
        particleClicked = true;
        
        const newCount = clickCount + 1;
        setClickCount(newCount);

        // Sauvegarder le compteur
        localStorage.setItem('particle_click_count', newCount.toString());

        // Vérifier si on atteint 100
        if (newCount >= 100) {
          setShowTombolaModal(true);
          onTombolaReached?.();
        }
      }
    });
  };

  // Charger le compteur au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('particle_click_count');
    if (saved) {
      setClickCount(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    // Éviter la réinitialisation si déjà initialisé
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Définir la taille du canvas
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialiser les particules
    const initParticles = () => {
      if (!canvas) return;
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: memoizedColors[Math.floor(Math.random() * memoizedColors.length)]
        });
      }
    };
    initParticles();

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Mettre à jour la position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebondir sur les bords
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
        }

        // Garder les particules dans les limites
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Animation d'explosion
        if (particle.exploding && particle.explosionParticles) {
          particle.explosionProgress = (particle.explosionProgress || 0) + 0.05;
          
          // Dessiner les particules d'explosion
          particle.explosionParticles.forEach(ep => {
            ep.x += ep.vx;
            ep.y += ep.vy;
            ep.opacity -= 0.02;
            
            if (ep.opacity > 0) {
              ctx.beginPath();
              ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
              ctx.fillStyle = '#fbbf24';
              ctx.globalAlpha = ep.opacity;
              ctx.fill();
              ctx.shadowBlur = 15;
              ctx.shadowColor = '#fbbf24';
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          });
          
          // Fin de l'explosion
          if (particle.explosionProgress >= 1) {
            particle.exploding = false;
            particle.explosionParticles = undefined;
          }
        }

        // Dessiner la particule principale
        if (!particle.exploding) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          
          // Changer l'apparence si cliquée
          if (particle.clicked) {
            ctx.fillStyle = '#fbbf24'; // Or
            ctx.globalAlpha = 0.8;
          } else {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
          }
          
          ctx.fill();

          // Ajouter un effet de glow
          ctx.shadowBlur = particle.clicked ? 20 : 10;
          ctx.shadowColor = particle.clicked ? '#fbbf24' : particle.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Dessiner des lignes entre les particules proches
      ctx.globalAlpha = 0.1;
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      isInitializedRef.current = false;
    };
  }, []); // Dépendances vides pour n'exécuter qu'une seule fois

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={enableClickable ? handleCanvasClick : undefined}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: enableClickable ? 'auto' : 'none',
          zIndex: enableClickable ? 1 : 0,
          opacity: 0.6,
          cursor: enableClickable ? 'pointer' : 'default'
        }}
      />
      
      {/* Compteur de clics */}
      {enableClickable && clickCount > 0 && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '2rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          border: '2px solid #fbbf24',
          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
        }}>
          ✨ {clickCount}/100 particules
        </div>
      )}

      {/* Modal Tombola */}
      {showTombolaModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out'
        }} onClick={() => setShowTombolaModal(false)}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '1.5rem',
            padding: '3rem',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            animation: 'scaleIn 0.4s ease-out',
            border: '3px solid #fbbf24'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
              Félicitations !
            </h2>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
              Vous avez trouvé les 100 particules magiques !<br/>
              Vous êtes maintenant inscrit à notre tombola exclusive.
            </p>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                Votre numéro de participation :
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>
                #{Math.floor(Math.random() * 900000 + 100000)}
              </p>
            </div>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.8 }}>
              Nous vous contacterons par email si vous êtes tiré au sort !
            </p>
            <button
              onClick={() => setShowTombolaModal(false)}
              style={{
                padding: '0.875rem 2rem',
                background: '#fbbf24',
                border: 'none',
                borderRadius: '0.75rem',
                color: '#1f2937',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ParticleBackground;
