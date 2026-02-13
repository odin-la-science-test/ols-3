import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, Sliders, Download, Upload } from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const ImageAnalyzer = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [image, setImage] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [threshold, setThreshold] = useState(128);
    const [activeFilter, setActiveFilter] = useState<'none' | 'grayscale' | 'threshold' | 'edge'>('none');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                showToast('Image chargée', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const applyFilters = () => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new window.Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
            ctx.drawImage(img, 0, 0);

            if (activeFilter === 'grayscale') {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                }
                ctx.putImageData(imageData, 0, 0);
            } else if (activeFilter === 'threshold') {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    const binary = gray > threshold ? 255 : 0;
                    data[i] = data[i + 1] = data[i + 2] = binary;
                }
                ctx.putImageData(imageData, 0, 0);
            } else if (activeFilter === 'edge') {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const width = canvas.width;
                const newData = new Uint8ClampedArray(data);

                for (let y = 1; y < canvas.height - 1; y++) {
                    for (let x = 1; x < width - 1; x++) {
                        const idx = (y * width + x) * 4;
                        const gx = -data[idx - 4] + data[idx + 4];
                        const gy = -data[idx - width * 4] + data[idx + width * 4];
                        const magnitude = Math.sqrt(gx * gx + gy * gy);
                        newData[idx] = newData[idx + 1] = newData[idx + 2] = magnitude;
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    data[i] = newData[i];
                }
                ctx.putImageData(imageData, 0, 0);
            }
        };
        img.src = image;
    };

    const exportImage = () => {
        if (!canvasRef.current) return;
        const url = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `analyzed_image_${Date.now()}.png`;
        a.click();
        showToast('Image exportée', 'success');
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate('/hugin')} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={18} />
                        Retour
                    </button>
                    <Image size={24} color="var(--accent-hugin)" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>ImageAnalyzer</h1>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={18} />
                        Charger Image
                    </button>
                    {image && (
                        <button onClick={exportImage} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={18} />
                            Exporter
                        </button>
                    )}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
            </div>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '300px', borderRight: '1px solid var(--border-color)', padding: '1.5rem', overflowY: 'auto' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sliders size={18} />
                        Contrôles
                    </h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Luminosité: {brightness}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            Contraste: {contrast}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>

                    {activeFilter === 'threshold' && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Seuil: {threshold}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="255"
                                value={threshold}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                            Filtres
                        </label>
                        {[
                            { id: 'none', label: 'Aucun' },
                            { id: 'grayscale', label: 'Niveaux de gris' },
                            { id: 'threshold', label: 'Seuillage' },
                            { id: 'edge', label: 'Détection contours' }
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id as any)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '0.5rem',
                                    background: activeFilter === filter.id ? 'var(--accent-hugin)' : 'var(--bg-secondary)',
                                    color: activeFilter === filter.id ? 'white' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <button onClick={applyFilters} className="btn btn-primary" style={{ width: '100%' }}>
                        Appliquer
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'auto' }}>
                    {image ? (
                        <canvas
                            ref={canvasRef}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                border: '1px solid var(--border-color)',
                                borderRadius: '0.5rem'
                            }}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <Image size={80} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Aucune image chargée</h3>
                            <p>Cliquez sur "Charger Image" pour commencer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageAnalyzer;
