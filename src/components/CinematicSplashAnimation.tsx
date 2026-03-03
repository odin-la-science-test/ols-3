import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CinematicSplashAnimationProps {
  onComplete: () => void;
  loadingProgress?: number; // 0-100 pour sync avec chargement réel
}

// Vertex Shader - Particules avec bruit procédural
const vertexShader = `
  uniform float uTime;
  uniform float uPhase; // 0=genesis, 1=converging, 2=formed, 3=loading, 4=expanding
  uniform float uProgress;
  uniform vec3 uTargetPosition;
  
  attribute vec3 targetPos;
  attribute float randomSeed;
  attribute float particleIndex;
  
  varying float vAlpha;
  varying float vGlow;
  
  // Simplex noise 3D
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vec3 pos = position;
    float alpha = 1.0;
    float glow = 0.0;
    
    if (uPhase < 0.5) {
      // PHASE 0: Genesis - Mouvement organique avec curl noise
      float noiseScale = 0.3;
      float noiseSpeed = 0.0003;
      vec3 noisePos = pos * noiseScale + uTime * noiseSpeed;
      
      float noise1 = snoise(noisePos);
      float noise2 = snoise(noisePos + vec3(100.0));
      float noise3 = snoise(noisePos + vec3(200.0));
      
      // Curl noise pour mouvement tourbillonnant
      vec3 curl = vec3(noise1, noise2, noise3) * 0.5;
      pos += curl;
      
      alpha = smoothstep(0.0, 1.0, uProgress);
      glow = 0.2;
      
    } else if (uPhase < 1.5) {
      // PHASE 1: Converging - Attraction vers hexagone
      vec3 toTarget = targetPos - position;
      float dist = length(toTarget);
      
      // Easing cubique pour accélération naturelle
      float easeProgress = uProgress * uProgress * (3.0 - 2.0 * uProgress);
      pos = mix(position, targetPos, easeProgress);
      
      // Ajout de turbulence pendant le voyage
      float turbulence = (1.0 - easeProgress) * 0.3;
      pos += vec3(
        snoise(vec3(particleIndex * 0.1, uTime * 0.001, 0.0)),
        snoise(vec3(particleIndex * 0.1, uTime * 0.001, 100.0)),
        0.0
      ) * turbulence;
      
      alpha = 1.0;
      glow = mix(0.3, 0.6, easeProgress);
      
    } else if (uPhase < 2.5) {
      // PHASE 2: Formed - Hexagone vivant avec ondulation
      pos = targetPos;
      
      // Ondulation le long des arêtes
      float waveFreq = 2.0;
      float waveAmp = 0.015;
      float wave = sin(uTime * 0.002 * waveFreq + particleIndex * 0.1) * waveAmp;
      
      // Direction radiale pour respiration
      vec3 radialDir = normalize(targetPos);
      pos += radialDir * wave;
      
      // Pulsation lumineuse
      float pulse = sin(uTime * 0.003 + particleIndex * 0.05) * 0.5 + 0.5;
      glow = 0.5 + pulse * 0.3;
      alpha = 0.9 + pulse * 0.1;
      
    } else if (uPhase < 3.5) {
      // PHASE 3: Loading - Onde de chargement
      pos = targetPos;
      
      // Vague qui parcourt l'hexagone
      float loadingWave = sin(uTime * 0.004 - particleIndex * 0.08) * 0.5 + 0.5;
      loadingWave = pow(loadingWave, 3.0); // Rendre la vague plus prononcée
      
      glow = 0.4 + loadingWave * 0.6 * (uProgress / 100.0);
      alpha = 0.8 + loadingWave * 0.2;
      
      // Micro respiration
      vec3 radialDir = normalize(targetPos);
      float breathe = sin(uTime * 0.002) * 0.01;
      pos += radialDir * breathe;
      
    } else {
      // PHASE 4: Expanding - Désintégration élégante
      vec3 radialDir = normalize(targetPos);
      float expandSpeed = (uPhase - 3.5) * 8.0;
      pos = targetPos + radialDir * expandSpeed;
      
      alpha = max(0.0, 1.0 - (uPhase - 3.5) * 2.0);
      glow = max(0.0, 0.8 - (uPhase - 3.5) * 1.5);
    }
    
    vAlpha = alpha;
    vGlow = glow;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Taille adaptative selon distance caméra
    gl_PointSize = (3.0 / -mvPosition.z) * (1.0 + vGlow * 2.0);
  }
`;

// Fragment Shader - Rendu particules avec glow
const fragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vGlow;
  
  void main() {
    // Distance au centre du point
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Particule circulaire avec glow
    float circle = 1.0 - smoothstep(0.0, 0.5, dist);
    float glow = 1.0 - smoothstep(0.0, 1.0, dist);
    
    // Combinaison core + glow
    float finalAlpha = (circle + glow * vGlow * 0.5) * vAlpha;
    
    vec3 finalColor = uColor * (1.0 + vGlow * 0.5);
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

const CinematicSplashAnimation = ({ onComplete, loadingProgress = 0 }: CinematicSplashAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Créer hexagone
    const hexRadius = 4;
    const hexPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      hexPoints.push(new THREE.Vector3(
        Math.cos(angle) * hexRadius,
        Math.sin(angle) * hexRadius,
        0
      ));
    }

    // Créer particules le long de l'hexagone
    const particlesPerSide = 40;
    const particleCount = particlesPerSide * 6;
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    const randomSeeds = new Float32Array(particleCount);
    const particleIndices = new Float32Array(particleCount);

    let idx = 0;
    for (let i = 0; i < 6; i++) {
      const p1 = hexPoints[i];
      const p2 = hexPoints[(i + 1) % 6];

      for (let j = 0; j < particlesPerSide; j++) {
        const t = j / particlesPerSide;
        const target = new THREE.Vector3().lerpVectors(p1, p2, t);

        // Position de départ aléatoire (dispersée dans l'espace)
        const angle = Math.random() * Math.PI * 2;
        const distance = 15 + Math.random() * 20;
        const height = (Math.random() - 0.5) * 10;

        positions[idx * 3] = Math.cos(angle) * distance;
        positions[idx * 3 + 1] = Math.sin(angle) * distance;
        positions[idx * 3 + 2] = height;

        targetPositions[idx * 3] = target.x;
        targetPositions[idx * 3 + 1] = target.y;
        targetPositions[idx * 3 + 2] = target.z;

        randomSeeds[idx] = Math.random();
        particleIndices[idx] = idx;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('targetPos', new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('randomSeed', new THREE.BufferAttribute(randomSeeds, 1));
    geometry.setAttribute('particleIndex', new THREE.BufferAttribute(particleIndices, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPhase: { value: 0 },
        uProgress: { value: 0 },
        uColor: { value: new THREE.Color(0x00f5ff) },
        uTargetPosition: { value: new THREE.Vector3(0, 0, 0) }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Hexagone wireframe (visible en phase formed/loading)
    const hexGeometry = new THREE.BufferGeometry().setFromPoints([...hexPoints, hexPoints[0]]);
    const hexMaterial = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0
    });
    const hexLine = new THREE.Line(hexGeometry, hexMaterial);
    scene.add(hexLine);

    // Animation loop
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const material = particles.material as THREE.ShaderMaterial;

      // Gestion des phases
      let phase = 0;
      let progress = 0;

      if (elapsed < 1.5) {
        // Phase 0: Genesis
        phase = 0;
        progress = Math.min(elapsed / 1.5, 1);
      } else if (elapsed < 4.0) {
        // Phase 1: Converging
        phase = 1;
        progress = Math.min((elapsed - 1.5) / 2.5, 1);
      } else if (elapsed < 5.0) {
        // Phase 2: Formed
        phase = 2;
        hexMaterial.opacity = Math.min((elapsed - 4.0) / 0.5, 0.4);
      } else if (elapsed < 8.0 || loadingProgress < 100) {
        // Phase 3: Loading
        phase = 3;
        progress = loadingProgress;
        hexMaterial.opacity = 0.3 + Math.sin(elapsed * 2) * 0.1;
      } else if (elapsed < 9.5) {
        // Phase 4: Expanding
        phase = 4 + (elapsed - 8.0) / 1.5;
        hexMaterial.opacity = Math.max(0, 0.4 - (elapsed - 8.0) * 0.3);
        
        // Zoom caméra
        camera.position.z = 15 - (elapsed - 8.0) * 8;
      } else {
        // Done
        onComplete();
        return;
      }

      phaseRef.current = phase;

      material.uniforms.uTime.value = Date.now();
      material.uniforms.uPhase.value = phase;
      material.uniforms.uProgress.value = progress;

      // Micro mouvement caméra (parallax subtil)
      if (phase < 4) {
        camera.position.x = Math.sin(elapsed * 0.2) * 0.3;
        camera.position.y = Math.cos(elapsed * 0.15) * 0.2;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onComplete, loadingProgress]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(ellipse at center, #0d1117 0%, #0a0e1a 100%)',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    />
  );
};

export default CinematicSplashAnimation;
