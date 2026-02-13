import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mic, MicOff, Video, VideoOff, ScreenShare,
    PhoneOff, ChevronLeft, Shield, Radio,
    Phone, Plus, LogIn, Copy, Check
} from 'lucide-react';
import { useToast } from '../../components/ToastContext';

const API_BASE = `http://${window.location.hostname}:3001/api/module`;
const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
];
const POLL_MS = 1200;

type Phase = 'lobby' | 'connecting' | 'incall';

const CLIENT_ID = Math.random().toString(36).slice(2, 10);

const log = (...args: any[]) => console.log(`[Visio ${CLIENT_ID}]`, ...args);
log('VISIO V3 ACTIVE');

const Meetings = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [phase, setPhase] = useState<Phase>('lobby');
    const [roomId, setRoomId] = useState('');
    const [joinInput, setJoinInput] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [peerConnected, setPeerConnected] = useState(false);
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState('');

    const localVidRef = useRef<HTMLVideoElement>(null);
    const remoteVidRef = useRef<HTMLVideoElement>(null);
    const localStream = useRef<MediaStream | null>(null);
    const screenStream = useRef<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    const poller = useRef<ReturnType<typeof setInterval> | null>(null);
    const seen = useRef<Set<string>>(new Set());
    const iceBuf = useRef<RTCIceCandidateInit[]>([]);
    const remoteDescSet = useRef(false);

    const raw = localStorage.getItem('currentUser') || '';
    let displayName = 'Moi';
    try { const p = JSON.parse(raw); displayName = p.username || p.email || p.name || raw || displayName; } catch { if (raw) displayName = raw; }

    const cleanup = useCallback(() => {
        log('cleanup');
        if (poller.current) { clearInterval(poller.current); poller.current = null; }
        if (pc.current) { pc.current.close(); pc.current = null; }
        if (localStream.current) { localStream.current.getTracks().forEach(t => t.stop()); localStream.current = null; }
        if (screenStream.current) { screenStream.current.getTracks().forEach(t => t.stop()); screenStream.current = null; }
        seen.current.clear();
        iceBuf.current = [];
        remoteDescSet.current = false;
        setPeerConnected(false);
    }, []);

    useEffect(() => () => cleanup(), [cleanup]);

    const post = async (room: string, type: string, data: any) => {
        const sig = { id: `${room}_${type}_${CLIENT_ID}_${Date.now()}`, room, type, sender: CLIENT_ID, data: JSON.stringify(data), timestamp: Date.now() };
        log('POST signal', type, sig.id);
        try {
            const r = await fetch(`${API_BASE}/meeting_signals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sig) });
            log('POST result', r.status);
        } catch (e) { log('POST error', e); }
    };

    const fetchSigs = async (room: string) => {
        try {
            const r = await fetch(`${API_BASE}/meeting_signals`);
            if (!r.ok) return [];
            const items = await r.json();
            if (!Array.isArray(items)) return [];
            return items.filter((s: any) => s.room === room && s.sender !== CLIENT_ID);
        } catch { return []; }
    };

    const getMedia = async () => {
        try {
            const ms = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = ms;
            if (localVidRef.current) localVidRef.current.srcObject = ms;
            log('Got local media');
            return ms;
        } catch (e) {
            log('Media error', e);
            showToast('Caméra ou micro refusé', 'error');
            return null;
        }
    };

    const flushIce = async () => {
        if (!pc.current || !remoteDescSet.current) return;
        while (iceBuf.current.length > 0) {
            const c = iceBuf.current.shift()!;
            try {
                await pc.current.addIceCandidate(new RTCIceCandidate(c));
                log('Added buffered ICE candidate');
            } catch (e) { log('ICE add err', e); }
        }
    };

    const makePc = (room: string) => {
        const conn = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        pc.current = conn;
        remoteDescSet.current = false;
        iceBuf.current = [];

        conn.ontrack = (ev) => {
            log('ontrack', ev.streams.length, 'streams');
            if (remoteVidRef.current && ev.streams[0]) {
                remoteVidRef.current.srcObject = ev.streams[0];
                setPeerConnected(true);
                setPhase('incall');
                setStatus('Connecté');
            }
        };

        conn.onicecandidate = (ev) => {
            if (ev.candidate) {
                log('Local ICE candidate');
                post(room, 'ice', ev.candidate.toJSON());
            }
        };

        conn.onconnectionstatechange = () => {
            log('Connection state:', conn.connectionState);
            if (conn.connectionState === 'connected') {
                setPeerConnected(true); setPhase('incall'); setStatus('Connecté');
            }
            if (conn.connectionState === 'disconnected' || conn.connectionState === 'failed') {
                showToast('Connexion perdue', 'error'); setPeerConnected(false);
            }
        };

        conn.oniceconnectionstatechange = () => {
            log('ICE state:', conn.iceConnectionState);
        };

        return conn;
    };

    const processing = useRef(false);

    const processSignals = async (room: string, conn: RTCPeerConnection, role: 'creator' | 'joiner') => {
        if (processing.current) return;
        processing.current = true;
        try {
            const sigs = await fetchSigs(room);
            const sorted = sigs.sort((a, b) => {
                const priority = (t: string) => t === 'offer' || t === 'answer' ? 0 : 1;
                return priority(a.type) - priority(b.type);
            });

            for (const sig of sorted) {
                if (seen.current.has(sig.id)) continue;
                const data = JSON.parse(sig.data);
                log('Received signal:', sig.type, 'from', sig.sender);

                if (sig.type === 'answer' && role === 'creator') {
                    if (conn.signalingState === 'have-local-offer') {
                        log('Setting remote description (answer)');
                        await conn.setRemoteDescription(new RTCSessionDescription(data));
                        seen.current.add(sig.id);
                        remoteDescSet.current = true;
                        setStatus('Connecté');
                        await flushIce();
                    }
                } else if (sig.type === 'ice') {
                    if (conn.remoteDescription) {
                        try {
                            await conn.addIceCandidate(new RTCIceCandidate(data));
                            seen.current.add(sig.id);
                            log('Added ICE candidate directly');
                        } catch (e) { log('ICE err', e); }
                    } else {
                        log('Buffering ICE candidate (no remote desc yet)');
                        iceBuf.current.push(data);
                        seen.current.add(sig.id);
                    }
                } else {
                    seen.current.add(sig.id);
                }
            }
        } finally {
            processing.current = false;
        }
    };

    const createRoom = async () => {
        const room = `room-${Date.now().toString(36)}`;
        setRoomId(room);
        setPhase('connecting');
        setStatus("En attente d'un participant...");
        log('Creating room', room);

        const ms = await getMedia();
        if (!ms) { setPhase('lobby'); return; }

        const conn = makePc(room);
        ms.getTracks().forEach(t => conn.addTrack(t, ms));

        const offer = await conn.createOffer();
        await conn.setLocalDescription(offer);
        log('Offer created');

        await post(room, 'offer', { sdp: offer.sdp, type: offer.type });

        poller.current = setInterval(() => processSignals(room, conn, 'creator'), POLL_MS);
    };

    const joinRoom = async () => {
        const room = joinInput.trim();
        if (!room) { showToast('Entrez un ID de salon', 'error'); return; }
        setRoomId(room);
        setPhase('connecting');
        setStatus('Recherche du salon...');
        log('Joining room', room);

        const ms = await getMedia();
        if (!ms) { setPhase('lobby'); return; }

        const conn = makePc(room);
        ms.getTracks().forEach(t => conn.addTrack(t, ms));

        let offerSig: any = null;
        for (let i = 0; i < 30; i++) {
            setStatus(`Recherche du salon... (${i + 1}/30)`);
            const sigs = await fetchSigs(room);
            offerSig = sigs.find((s: any) => s.type === 'offer');
            if (offerSig) break;
            await new Promise(r => setTimeout(r, 1500));
        }

        if (!offerSig) {
            showToast('Salon introuvable', 'error');
            cleanup(); setPhase('lobby'); return;
        }

        seen.current.add(offerSig.id);
        const offerData = JSON.parse(offerSig.data);
        log('Got offer, setting remote description');
        await conn.setRemoteDescription(new RTCSessionDescription(offerData));
        remoteDescSet.current = true;

        if (conn.remoteDescription) {

            const existingSigs = await fetchSigs(room);
            for (const sig of existingSigs) {
                if (seen.current.has(sig.id)) continue;
                if (sig.type === 'ice') {
                    const d = JSON.parse(sig.data);
                    try {
                        await conn.addIceCandidate(new RTCIceCandidate(d));
                        seen.current.add(sig.id);
                        log('Added existing ICE');
                    } catch (e) { log('ICE err', e); }
                }
            }
        }

        const answer = await conn.createAnswer();
        await conn.setLocalDescription(answer);
        log('Answer created');

        await post(room, 'answer', { sdp: answer.sdp, type: answer.type });
        setStatus('En attente de connexion...');

        poller.current = setInterval(() => processSignals(room, conn, 'joiner'), POLL_MS);
    };

    const toggleMic = () => {
        const t = localStream.current?.getAudioTracks()[0];
        if (t) { t.enabled = !t.enabled; setIsMuted(!t.enabled); }
    };
    const toggleVideo = () => {
        const t = localStream.current?.getVideoTracks()[0];
        if (t) { t.enabled = !t.enabled; setIsVideoOff(!t.enabled); }
    };
    const toggleScreen = async () => {
        if (!pc.current) return;
        const p = pc.current;
        if (isSharing) {
            screenStream.current?.getTracks().forEach(t => t.stop()); screenStream.current = null;
            const cam = localStream.current?.getVideoTracks()[0];
            const sender = p.getSenders().find(s => s.track?.kind === 'video');
            if (cam && sender) await sender.replaceTrack(cam);
            setIsSharing(false);
        } else {
            try {
                const sm = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStream.current = sm;
                const st = sm.getVideoTracks()[0];
                const sender = p.getSenders().find(s => s.track?.kind === 'video');
                if (sender) await sender.replaceTrack(st);
                setIsSharing(true);
                st.onended = () => {
                    setIsSharing(false);
                    const cam = localStream.current?.getVideoTracks()[0];
                    if (cam && sender) sender.replaceTrack(cam);
                    screenStream.current = null;
                };
            } catch { showToast("Partage d'écran annulé", 'info'); }
        }
    };
    const hangUp = () => { cleanup(); setPhase('lobby'); setRoomId(''); setJoinInput(''); setIsMuted(false); setIsVideoOff(false); setIsSharing(false); setStatus(''); };
    const copyId = () => { navigator.clipboard.writeText(roomId); setCopied(true); showToast('ID copié !', 'success'); setTimeout(() => setCopied(false), 2000); };


    if (phase === 'lobby') {
        return (
            <div style={{ height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                <button onClick={() => navigate('/hugin')} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ChevronLeft size={20} /> Retour
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Shield size={20} color="#10b981" />
                        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Chiffrement de bout en bout</span>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>Hugin Visio</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginTop: '0.5rem' }}>{"Créez ou rejoignez un salon d'appel vidéo"}</p>
                </div>

                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px', width: '100%', padding: '0 2rem' }}>
                    {/* Create */}
                    <div style={{ flex: '1 1 280px', maxWidth: '320px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><Plus size={28} color="white" /></div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Créer un salon</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>{"Démarrez un appel et partagez l'ID"}</p>
                        <button onClick={createRoom} style={{ padding: '0.85rem', borderRadius: '1rem', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Phone size={18} /> Nouveau salon
                        </button>
                    </div>

                    {/* Join */}
                    <div style={{ flex: '1 1 280px', maxWidth: '320px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><LogIn size={28} color="white" /></div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Rejoindre un salon</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>{"Entrez l'ID d'un salon existant"}</p>
                        <input type="text" value={joinInput} onChange={e => setJoinInput(e.target.value)} placeholder="Ex: room-abc123" style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.95rem', textAlign: 'center' }} />
                        <button onClick={joinRoom} style={{ padding: '0.85rem', borderRadius: '1rem', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <LogIn size={18} /> Rejoindre
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header style={{ padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Hugin Visio</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <Shield size={12} color="#10b981" /> Chiffré
                        <span style={{ margin: '0 0.25rem' }}>•</span>
                        <Radio size={12} color={peerConnected ? '#10b981' : '#f59e0b'} />
                        {status}
                    </div>
                </div>
                <button onClick={copyId} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {roomId}
                </button>
            </header>

            <main style={{ flex: 1, display: 'flex', gap: '1rem', padding: '1rem', overflow: 'hidden' }}>
                <div style={{ flex: 1, background: '#0f172a', borderRadius: '1rem', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {peerConnected ? (
                        <video ref={remoteVidRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Phone size={40} color="#6366f1" />
                            </div>
                            <p style={{ fontSize: '1.1rem' }}>{status || 'En attente...'}</p>
                        </div>
                    )}

                    <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '220px', aspectRatio: '16/9', borderRadius: '0.75rem', overflow: 'hidden', border: '2px solid rgba(99,102,241,0.5)', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', background: '#1e293b' }}>
                        <video ref={localVidRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: isVideoOff ? 'none' : 'block' }} />
                        {isVideoOff && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{displayName.charAt(0).toUpperCase()}</div>
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '0.4rem', left: '0.4rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.7rem' }}>{displayName} (Moi)</div>
                    </div>
                </div>
            </main>

            <footer style={{ padding: '1.25rem', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 20 }}>
                <div style={{ background: 'rgba(15,23,42,0.9)', padding: '0.6rem', borderRadius: '5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
                    <button onClick={toggleMic} style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: isMuted ? '#f43f5e' : 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                    </button>
                    <button onClick={toggleVideo} style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: isVideoOff ? '#f43f5e' : 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
                    </button>
                    <button onClick={toggleScreen} style={{ width: '48px', height: '48px', borderRadius: '50%', border: 'none', background: isSharing ? '#6366f1' : 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ScreenShare size={22} />
                    </button>
                    <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.1)', margin: '0 0.25rem' }} />
                    <button onClick={hangUp} style={{ padding: '0 1.5rem', height: '48px', borderRadius: '5rem', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600 }}>
                        <PhoneOff size={22} /> Raccrocher
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Meetings;
