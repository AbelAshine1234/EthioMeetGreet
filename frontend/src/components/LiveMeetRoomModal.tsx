import React, { useState, useEffect, useRef } from 'react';
import {
  X, Mic, MicOff, Video, VideoOff, MessageSquare, Send,
  Sparkles, Camera, PhoneOff, Volume2, ShieldCheck,
  CheckCircle2, Users, Radio, Smile, AlertCircle, RefreshCw, Copy, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Talent } from '../types';
import { api } from '../api';

interface LiveMeetRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  talents: Talent[];
  initialTalent?: Talent | null;
  initialRole?: 'fan' | 'creator';
  initialRoomId?: string;
  customerName?: string;
  occasion?: string;
}

interface ChatMessage {
  id: string;
  sender: 'fan' | 'creator' | 'system';
  senderName: string;
  text: string;
  time: string;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

export const LiveMeetRoomModal: React.FC<LiveMeetRoomModalProps> = ({
  isOpen,
  onClose,
  talents,
  initialTalent,
  initialRole = 'fan',
  initialRoomId = 'ethio-meet-101',
  customerName = 'Abel Ashine (Fan)',
  occasion = 'Personal 1-on-1 Meet',
}) => {
  if (!isOpen) return null;

  // 1. Account & Role Selection (Fan or Celebrity)
  const [role, setRole] = useState<'fan' | 'creator'>(initialRole);
  const [roomId, setRoomId] = useState(initialRoomId);
  const [copiedRoom, setCopiedRoom] = useState(false);

  // Selected Star (for Creator identity or Fan recipient)
  const defaultStar = initialTalent || talents.find(t => t.name.includes('Teddy')) || talents[0];
  const [selectedStar, setSelectedStar] = useState<Talent>(defaultStar);

  // User Hardware States
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [hasMediaPermission, setHasMediaPermission] = useState<boolean | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // WebRTC Peer Connection States
  const [isPeerConnected, setIsPeerConnected] = useState(false);
  const [peerName, setPeerName] = useState<string>('');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Call duration & stats
  const [callDuration, setCallDuration] = useState(300); // 5 min countdown
  const [isStarSpeaking, setIsStarSpeaking] = useState(false);

  // Chat Panel
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<any>(null);
  const lastSignalTimeRef = useRef<number>(Date.now() - 5000);

  const myIdentityName = role === 'creator' ? selectedStar.name : customerName;
  const mySenderId = `${role}_${roomId}`;

  // 1. Setup Local Media (Webcam & Mic)
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startMedia() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasMediaPermission(false);
          return;
        }

        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true,
        });

        setMediaStream(activeStream);
        setHasMediaPermission(true);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = activeStream;
        }

        // Setup audio level meter
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(activeStream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animationFrameRef.current = requestAnimationFrame(updateLevel);
          };
          updateLevel();
        } catch (audioErr) {
          console.warn('AudioContext volume error:', audioErr);
        }

      } catch (err) {
        console.warn('Camera/Mic permission denied or not found:', err);
        setHasMediaPermission(false);
      }
    }

    startMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // 2. Setup WebRTC Peer Connection & Signaling
  useEffect(() => {
    let pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    // Attach local stream tracks to WebRTC peer connection
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        pc.addTrack(track, mediaStream);
      });
    }

    // When remote track arrives
    pc.ontrack = (event) => {
      console.log('Received remote track from peer:', event.streams[0]);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        setIsPeerConnected(true);
      }
    };

    // BroadcastChannel for instant zero-latency cross-tab communication
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(`ethio_meet_${roomId}`);
      broadcastChannelRef.current = channel;
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    // Helper to send signal via both BroadcastChannel and Backend HTTP API
    const emitSignal = async (type: string, data: any) => {
      const payload = {
        roomId,
        sender: mySenderId,
        senderName: myIdentityName,
        type: type as any,
        data,
      };

      if (channel) {
        try { channel.postMessage(payload); } catch (_) {}
      }

      try {
        await api.sendSignal(payload);
      } catch (err) {
        // BroadcastChannel will handle it if same browser
      }
    };

    // Send ICE candidates to peer
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        emitSignal('candidate', event.candidate);
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      console.log('WebRTC Connection State:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsPeerConnected(true);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsPeerConnected(false);
      }
    };

    // Process incoming signal
    const handleSignal = async (signal: any) => {
      if (signal.sender === mySenderId) return; // ignore own signals

      if (signal.type === 'join') {
        setPeerName(signal.senderName || (role === 'fan' ? selectedStar.name : customerName));
        setIsPeerConnected(true);
        // Creator initiates offer when someone joins
        if (role === 'creator') {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            emitSignal('offer', offer);
          } catch (e) {
            console.error('Error creating offer:', e);
          }
        }
      } else if (signal.type === 'offer') {
        try {
          setPeerName(signal.senderName || selectedStar.name);
          await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          emitSignal('answer', answer);
          setIsPeerConnected(true);
        } catch (e) {
          console.error('Error handling offer:', e);
        }
      } else if (signal.type === 'answer') {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
          setIsPeerConnected(true);
        } catch (e) {
          console.error('Error handling answer:', e);
        }
      } else if (signal.type === 'candidate') {
        try {
          if (signal.data) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.data));
          }
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      } else if (signal.type === 'chat') {
        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now()),
            sender: signal.sender.startsWith('creator') ? 'creator' : 'fan',
            senderName: signal.senderName,
            text: signal.data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (signal.type === 'reaction') {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7, x: 0.5 }
        });
        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now()),
            sender: signal.sender.startsWith('creator') ? 'creator' : 'fan',
            senderName: signal.senderName,
            text: `${signal.data.emoji} Sent a reaction!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    };

    // Listen to BroadcastChannel messages
    if (channel) {
      channel.onmessage = (event) => {
        handleSignal(event.data);
      };
    }

    // Backend HTTP Polling for signals (handles cross-device / cross-browser calls)
    const pollSignals = async () => {
      try {
        const res = await api.getSignals(roomId, mySenderId, lastSignalTimeRef.current);
        if (res.signals && res.signals.length > 0) {
          for (const sig of res.signals) {
            if (sig.timestamp > lastSignalTimeRef.current) {
              lastSignalTimeRef.current = sig.timestamp;
              handleSignal(sig);
            }
          }
        }
      } catch (err) {
        // Polling silent catch
      }
    };

    pollIntervalRef.current = setInterval(pollSignals, 1000);

    // Announce presence in room
    emitSignal('join', { role, name: myIdentityName });

    // Initial system messages
    setMessages([
      {
        id: 'sys-welcome',
        sender: 'system',
        senderName: 'System',
        text: `Joined Room "${roomId}" as ${myIdentityName}. Open another tab to connect the 2nd account!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    return () => {
      if (channel) channel.close();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (pc) pc.close();
    };
  }, [roomId, role, selectedStar, mediaStream]);

  // 3. Call Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 4. Simulated speaking activity if solo
  useEffect(() => {
    if (isPeerConnected) return;
    const interval = setInterval(() => {
      setIsStarSpeaking(prev => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPeerConnected]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Hardware Toggles
  const toggleMic = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(t => { t.enabled = !isMicOn; });
    }
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(t => { t.enabled = !isVideoOn; });
    }
    setIsVideoOn(!isVideoOn);
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const text = chatInput.trim();
    setChatInput('');

    // Add locally
    const myMsg: ChatMessage = {
      id: String(Date.now()),
      sender: role,
      senderName: myIdentityName,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, myMsg]);

    // Emit to peer
    const payload = {
      roomId,
      sender: mySenderId,
      senderName: myIdentityName,
      type: 'chat' as any,
      data: { text },
    };

    if (broadcastChannelRef.current) {
      try { broadcastChannelRef.current.postMessage(payload); } catch (_) {}
    }
    api.sendSignal(payload).catch(() => {});

    // If solo (no 2nd peer tab joined yet), provide an interactive Star automated reply
    if (!isPeerConnected && role === 'fan') {
      setTimeout(() => {
        let reply = `Ameseginalehu ${customerName}! So thrilled to connect with you today! 🙏`;
        const lower = text.toLowerCase();
        if (lower.includes('selam') || lower.includes('hello')) reply = `Selam selam! Blessed to meet you! How are you doing?`;
        if (lower.includes('birthday') || lower.includes('lidet')) reply = `Melkam Lidet! Wishing you peace, health, and endless joy! 🎂🎉`;
        if (lower.includes('music') || lower.includes('song')) reply = `🎶 "Tikur Sew... Ethiopia lezelalem tanur!" Singing from the heart!`;

        setMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'creator',
            senderName: selectedStar.name,
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1200);
    }
  };

  // Send Emoji Reaction
  const handleSendReaction = (emoji: string) => {
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.8, x: 0.5 }
    });

    const myMsg: ChatMessage = {
      id: String(Date.now()),
      sender: role,
      senderName: myIdentityName,
      text: `${emoji} Sent a reaction!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, myMsg]);

    const payload = {
      roomId,
      sender: mySenderId,
      senderName: myIdentityName,
      type: 'reaction' as any,
      data: { emoji },
    };

    if (broadcastChannelRef.current) {
      try { broadcastChannelRef.current.postMessage(payload); } catch (_) {}
    }
    api.sendSignal(payload).catch(() => {});
  };

  const handleCopyRoomLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedRoom(true);
    setTimeout(() => setCopiedRoom(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden text-left select-none">
      <div 
        className="relative w-full max-w-6xl h-[92vh] max-h-[850px] bg-[#141414] rounded-3xl border border-[#333333] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Room Banner & Account Selector */}
        <div className="px-4 py-3 bg-[#1c1c1c] border-b border-[#2d2d2d] flex flex-wrap items-center justify-between gap-3 z-20">
          
          {/* Left: Account Role Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE ROOM</span>
            </div>

            {/* Role Tabs for Testing */}
            <div className="flex items-center bg-[#252525] rounded-xl p-1 border border-neutral-700">
              <button
                onClick={() => setRole('fan')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  role === 'fan'
                    ? 'bg-[#FDE047] text-[#181818] shadow-sm'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                👤 Fan View (Account 1)
              </button>
              <button
                onClick={() => setRole('creator')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  role === 'creator'
                    ? 'bg-[#FDE047] text-[#181818] shadow-sm'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                ⭐ Celebrity View (Account 2)
              </button>
            </div>

            {/* Star Selector */}
            <select
              value={selectedStar.id}
              onChange={(e) => {
                const s = talents.find(t => t.id === e.target.value);
                if (s) setSelectedStar(s);
              }}
              className="bg-[#252525] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-neutral-700 focus:outline-none focus:border-[#FDE047] cursor-pointer"
            >
              {talents.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.title})
                </option>
              ))}
            </select>
          </div>

          {/* Right: Room ID & Copy Link for 2nd Tab */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-[#252525] px-3 py-1.5 rounded-xl border border-neutral-700 text-xs">
              <span className="text-neutral-400 font-mono">Room:</span>
              <strong className="text-white font-mono">{roomId}</strong>
              <button
                onClick={handleCopyRoomLink}
                className="text-neutral-400 hover:text-white transition cursor-pointer ml-1"
                title="Copy Room Link to open in 2nd tab"
              >
                {copiedRoom ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-neutral-700 text-xs font-mono font-bold text-[#FDE047]">
              <span>⏱️ {formatTime(callDuration)}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#252525] hover:bg-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              title="Leave Call"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 2-Account Call Instructions Tip */}
        <div className="px-4 py-1.5 bg-[#FDE047] text-[#181818] text-[11px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>💡 How to test 2 accounts:</span>
            <span className="font-medium hidden sm:inline">
              Keep this tab as <strong>{role === 'fan' ? 'Account 1 (Fan)' : 'Account 2 (Celebrity)'}</strong>, then open this app in a second tab and select the opposite account. Both will connect live!
            </span>
          </div>
          <span className="font-mono text-[10px] bg-black/10 px-2 py-0.5 rounded">
            {isPeerConnected ? '🟢 2 Accounts Connected Live' : '🟡 Waiting for 2nd account tab...'}
          </span>
        </div>

        {/* Video Call Stage */}
        <div className="flex-1 relative flex overflow-hidden bg-[#0d0d0d]">
          
          {/* Main Stage: Remote Peer Video or Interactive Celebrity Stream */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-900 via-black to-neutral-950">
            
            {isPeerConnected && remoteStream ? (
              // Live Peer Video (from second tab / other account)
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              // Star View with simulated stream until 2nd tab joins
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={role === 'fan' ? selectedStar.avatar_url || '/stars/teddy_afro.jpg' : '/stars/haile_gebrselassie.jpg'}
                  alt={selectedStar.name}
                  className="w-full h-full object-cover sm:object-contain opacity-90 transition-transform duration-700 scale-105"
                />

                {/* Audio Waveform simulation */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg">
                  <Volume2 className="w-4 h-4 text-[#FDE047]" />
                  <span className="text-xs text-white font-bold">
                    {role === 'fan' ? selectedStar.name : 'Fan Audio Feed'}
                  </span>
                  <div className="flex items-center gap-0.5 ml-1">
                    <span className={`w-1 bg-[#FDE047] rounded-full transition-all duration-150 ${isStarSpeaking ? 'h-4' : 'h-1.5'}`} />
                    <span className={`w-1 bg-[#FDE047] rounded-full transition-all duration-150 ${isStarSpeaking ? 'h-6' : 'h-2'}`} />
                    <span className={`w-1 bg-[#FDE047] rounded-full transition-all duration-150 ${isStarSpeaking ? 'h-3' : 'h-1.5'}`} />
                    <span className={`w-1 bg-[#FDE047] rounded-full transition-all duration-150 ${isStarSpeaking ? 'h-5' : 'h-2'}`} />
                  </div>
                </div>
              </div>
            )}

            {/* Remote Overlay Name Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-3 bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 z-10 shadow-lg">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 relative" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                  <span>{isPeerConnected ? (peerName || (role === 'fan' ? selectedStar.name : customerName)) : (role === 'fan' ? selectedStar.name : 'Waiting for Fan...')}</span>
                  <span className="w-4 h-4 rounded-full bg-[#FDE047] text-[#181818] flex items-center justify-center text-[9px] font-black">✓</span>
                </h3>
                <span className="text-[10px] text-neutral-300">
                  {isPeerConnected ? '🟢 Live Peer Connected (WebRTC HD)' : (role === 'fan' ? '⭐ Standby - Ready for 2nd Account' : '👤 Waiting for Fan')}
                </span>
              </div>
            </div>

            {/* Self Video PiP (Picture-in-Picture) */}
            <div className="absolute bottom-6 right-6 w-36 h-48 sm:w-52 sm:h-64 rounded-2xl overflow-hidden bg-[#181818] border-2 border-white/20 shadow-2xl z-20 transition hover:scale-105">
              {isVideoOn && hasMediaPermission ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 p-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-white font-bold text-lg mb-2">
                    {myIdentityName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">{myIdentityName}</span>
                  <span className="text-[10px] text-neutral-400 mt-1">
                    {!isVideoOn ? 'Video Muted' : 'Camera Ready'}
                  </span>
                </div>
              )}

              {/* Self Name Tag with Realtime Mic Audio Level Indicator */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-white">
                <span className="truncate max-w-[80px] font-bold">You ({role})</span>
                <div className="flex items-center gap-1">
                  {isMicOn ? (
                    <div className="flex items-center gap-0.5">
                      <span className="w-1 rounded-full bg-emerald-400" style={{ height: `${Math.max(4, audioLevel * 0.18)}px` }} />
                      <span className="w-1 rounded-full bg-emerald-400" style={{ height: `${Math.max(4, audioLevel * 0.24)}px` }} />
                      <span className="w-1 rounded-full bg-emerald-400" style={{ height: `${Math.max(4, audioLevel * 0.15)}px` }} />
                    </div>
                  ) : (
                    <MicOff className="w-3 h-3 text-red-400" />
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Chat Panel Drawer */}
          {isChatOpen && (
            <div className="w-80 sm:w-96 bg-[#1a1a1a] border-l border-[#2b2b2b] flex flex-col z-30 transition-all duration-300">
              <div className="p-4 border-b border-[#2b2b2b] flex items-center justify-between bg-[#202020]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#FDE047]" />
                  <h4 className="text-xs font-bold text-white">Live 2-Way Chat</h4>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === role ? 'items-end' : m.sender === 'system' ? 'items-center' : 'items-start'
                    }`}
                  >
                    {m.sender === 'system' ? (
                      <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400 text-[10px] text-center my-1">
                        {m.text}
                      </span>
                    ) : (
                      <div className="max-w-[85%] space-y-0.5">
                        <span className="text-[10px] text-neutral-400 block px-1">
                          {m.senderName} • {m.time}
                        </span>
                        <div
                          className={`p-2.5 rounded-2xl ${
                            m.sender === role
                              ? 'bg-[#FDE047] text-[#181818] font-medium rounded-tr-none'
                              : 'bg-[#2b2b2b] text-white rounded-tl-none'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Habesha Reaction Buttons */}
              <div className="p-2 border-t border-[#2b2b2b] bg-[#222222] flex items-center justify-around">
                {['🇪🇹', '❤️', '👏', '☕', '🎂', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    className="w-8 h-8 rounded-lg hover:bg-neutral-700 flex items-center justify-center text-base transition hover:scale-125 cursor-pointer"
                    title={`Send ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#2b2b2b] flex gap-2 bg-[#202020]">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Type as ${myIdentityName}...`}
                  className="flex-1 bg-[#282828] border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FDE047]"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#FDE047] hover:bg-yellow-400 text-[#181818] transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Bottom Call Control Toolbar */}
        <div className="h-20 px-4 sm:px-8 bg-[#181818] border-t border-[#2b2b2b] flex items-center justify-between z-20">
          
          {/* Left Audio Meter Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#242424] px-3 py-1.5 rounded-full border border-neutral-700">
              {isMicOn ? (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              )}
              <span className="text-xs font-semibold text-neutral-300">
                {isMicOn ? `Mic (${audioLevel}%)` : 'Muted'}
              </span>
            </div>
          </div>

          {/* Center Call Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer ${
                isMicOn
                  ? 'bg-[#2a2a2a] hover:bg-neutral-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-400'
              }`}
              title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer ${
                isVideoOn
                  ? 'bg-[#2a2a2a] hover:bg-neutral-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white ring-2 ring-red-400'
              }`}
              title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg cursor-pointer ${
                isChatOpen
                  ? 'bg-[#FDE047] text-[#181818]'
                  : 'bg-[#2a2a2a] hover:bg-neutral-700 text-white'
              }`}
              title="Open Live Chat"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </button>

            {/* Red End Call Button */}
            <button
              onClick={onClose}
              className="px-6 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-lg cursor-pointer active:scale-95 ml-2"
              title="End Meet"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="hidden sm:inline">End Call</span>
            </button>
          </div>

          {/* Right Status */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-neutral-400">
              {isPeerConnected ? '🟢 2-Way Connected' : '🟡 Ready for 2nd Tab'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
