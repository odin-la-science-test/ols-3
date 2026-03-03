import { useEffect, useRef, useState } from 'react';

interface PremiumSplashAnimationProps {
  onComplete?: () => void;
  loadingProgress?: number; // 0-100, optionnel pour sync avec chargement réel
}

// Classe Particle optimisée
class Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number = 0;
  vy: number = 0;
  size: number;
  opacity: number = 0;
  glow: number = 0;
  
  constructor(startX: number, startY: number, targetX: number, targetY: number) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.size = 2 + Math.random() * 2;
  }

  update(phase: string, time: number, index: number) {
    if (phase === 'converging') {
      // Phase 1: Convergence fluide vers l'hexagone
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 1) {
        const force = 0.08;
        this.vx += dx * force;
        this.vy += dy * force;
        this.vx *= 0.92; // Friction
        this.vy *= 0.92;
        
        this.x += this.vx;
        this.y += this.vy;
      } else {
        this.x = this.targetX;
        this.y = this.targetY;
      }
      
      this.opacity = Math.min(1, this.opacity + 0.02);
      this.glow = 0.3;
      
    } else if (phase === 'formed' || phase === 'loading') {
      // Phase 2 & 3: Ondulation subtile le long des arêtes
      this.x = this.targetX;
      this.y = this.targetY;
      
      const waveOffset = Math.sin(time * 0.002 + index * 0.1) * 2;
      const angle = Math.atan2(this.targetY, this.targetX);
      this.x += Math.cos(angle) * waveOffset;
      this.y += Math.sin(angle) * waveOffset;
      
      // Pulsation lumineuse qui parcourt l'hexagone
      const pulseWave = Math.sin(time * 0.003 - index * 0.05);
      this.glow = 0.5 + pulseWave * 0.5;
      this.opacity = 0.8 + pulseWave * 0.2;
      
    } else if (phase === 'expanding') {
      // Phase 4: Diffusion vers l'extérieur
      const angle = Math.atan2(this.targetY, this.targetX);
      const expandSpeed = 3;
      this.x += Math.cos(angle) * expandSpeed;
      this.y += Math.sin(angle) * expandSpeed;
      this.opacity = Math.max(0, this.opacity - 0.03);
      this.glow = Math.max(0, this.glow - 0.05);
    }
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    const x = centerX + this.x;
    const y = centerY + this.y;
    
    // Glow effect
    if (this.glow > 0) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.size * 4);
      gradient.addColorStop(0, `rgba(0, 245, 255, ${this.opacity * this.glow * 0.6})`);
      gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - this.size * 4, y - this.size * 4, this.size * 8, this.size * 8);
    }
    
    // Particle core
    ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const PremiumSplashAnimation = ({ onComplete, loadingProgress = 0 }: PremiumSplashAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'converging' | 'formed' | 'loading' | 'expanding' | 'done'>('converging');
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Setup canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Créer l'hexagone (points relatifs au centre)
    const hexRadius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    const hexPoints: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      hexPoints.push([
        Math.cos(angle) * hexRadius,
        Math.sin(angle) * hexRadius
      ]);
    }

    // Créer particules le long de l'hexagone
    const particlesPerSide = 20;
    const particles: Particle[] = [];
    
    for (let i = 0; i < 6; i++) {
      const p1 = hexPoints[i];
      const p2 = hexPoints[(i + 1) % 6];
      
      for (let j = 0; j < particlesPerSide; j++) {
        const t = j / particlesPerSide;
        const targetX = p1[0] + (p2[0] - p1[0]) * t;
        const targetY = p1[1] + (p2[1] - p1[1]) * t;
        
        // Position de départ aléatoire (dispersée)
        const angle = Math.random() * Math.PI * 2;
        const distance = 300 + Math.random() * 500;
        const startX = Math.cos(angle) * distance;
        const startY = Math.sin(angle) * distance;
        
        particles.push(new Particle(startX, startY, targetX, targetY));
      }
    }
    
    particlesRef.current = particles;

    // Animation loop
    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const dt = now - lastTime;
      lastTime = now;

      // Gestion des phases
      if (phase === 'converging' && elapsed > 2500) {
        setPhase('formed');
      } else if (phase === 'formed' && elapsed > 3500) {
        setPhase('loading');
      } else if (phase === 'loading' && (elapsed > 6000 || loadingProgress >= 100)) {
        setPhase('expanding');
      } else if (phase === 'expanding' && elapsed > 7000) {
        setPhase('done');
        onComplete?.();
        return;
      }

      // Clear avec dégradé spatial subtil
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0e1a');
      gradient.addColorStop(1, '#0d1117');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Update et draw particles
      particles.forEach((particle, i) => {
        particle.update(phase, now, i);
        particle.draw(ctx, centerX, centerY);
      });

      // Dessiner les arêtes de l'hexagone (phase formed/loading)
      if (phase === 'formed' || phase === 'loading') {
        ctx.strokeStyle = `rgba(0, 245, 255, ${0.3 + Math.sin(now * 0.002) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.5)';
        
        ctx.beginPath();
        hexPoints.forEach((point, i) => {
          const x = centerX + point[0];
          const y = centerY + point[1];
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Logo "O" au centre (phase formed/loading)
      if (phase === 'formed' || phase === 'loading') {
        const scale = 1 + Math.sin(now * 0.002) * 0.02; // Respiration subtile
        const opacity = 0.9 + Math.sin(now * 0.003) * 0.1;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        
        ctx.font = 'bold 120px system-ui';
        ctx.fillStyle = `rgba(0, 245, 255, ${opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(0, 245, 255, 0.8)';
        ctx.fillText('O', 0, 0);
        
        ctx.restore();
      }

      // Effet d'expansion (phase expanding)
      if (phase === 'expanding') {
        const expandProgress = (elapsed - 6000) / 1000;
        const scale = 1 + expandProgress * 15;
        const opacity = Math.max(0, 1 - expandProgress);
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(centerX, centerY);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        
        // Redessiner l'hexagone agrandi
        ctx.strokeStyle = `rgba(0, 245, 255, ${opacity * 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        hexPoints.forEach((point, i) => {
          const x = centerX + point[0];
          const y = centerY + point[1];
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, onComplete, loadingProgress]);

  if (phase === 'done') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
};

export default PremiumSplashAnimation;
