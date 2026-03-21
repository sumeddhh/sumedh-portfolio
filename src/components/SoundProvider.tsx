import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playTick: () => void;
  playSummon: () => void;
  playGlitch: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtx = useRef<AudioContext | null>(null);
  const masterGain = useRef<GainNode | null>(null);
  const ambientNode = useRef<OscillatorNode | null>(null);

  // Initialize Audio Context on user interaction (unmute)
  const initAudio = useCallback(() => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain.current = audioCtx.current.createGain();
      masterGain.current.connect(audioCtx.current.destination);
      masterGain.current.gain.value = isMuted ? 0 : 0.08; // Very low base volume
    }
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  }, [isMuted]);

  const toggleMute = () => {
    initAudio();
    setIsMuted(prev => {
      const next = !prev;
      if (masterGain.current) {
        masterGain.current.gain.setTargetAtTime(next ? 0 : 0.1, audioCtx.current!.currentTime, 0.05);
      }
      return next;
    });
  };

  // 1. Ambient Background Hum
  useEffect(() => {
    if (!isMuted && audioCtx.current && !ambientNode.current) {
      const g = audioCtx.current.createGain();
      g.gain.value = 0.02; // Super faint
      g.connect(masterGain.current!);

      const osc = audioCtx.current.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 32.7; // Low C0
      osc.connect(g);
      osc.start();
      ambientNode.current = osc;
    } else if (isMuted && ambientNode.current) {
      ambientNode.current.stop();
      ambientNode.current = null;
    }
  }, [isMuted]);

  // 2. Technical Tick (UI Hover)
  const playTick = useCallback(() => {
    if (isMuted || !audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(2400, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.current.currentTime + 0.03);
    
    g.gain.setValueAtTime(0.02, audioCtx.current.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.03);
    
    osc.connect(g);
    g.connect(masterGain.current!);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.03);
  }, [isMuted]);

  // 3. Technical Summon (Modal/Drawer)
  const playSummon = useCallback(() => {
    if (isMuted || !audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.current.currentTime + 0.15);
    
    g.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    g.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + 0.15);
    
    osc.connect(g);
    g.connect(masterGain.current!);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.15);
  }, [isMuted]);

  // 4. Glitch/Signal Static (Transition)
  const playGlitch = useCallback(() => {
    if (isMuted || !audioCtx.current) return;
    const bufferSize = audioCtx.current.sampleRate * 0.1;
    const buffer = audioCtx.current.createBuffer(1, bufferSize, audioCtx.current.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.current.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.current.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, audioCtx.current.currentTime);
    filter.Q.value = 10;
    
    const g = audioCtx.current.createGain();
    g.gain.setValueAtTime(0.04, audioCtx.current.currentTime);
    g.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + 0.1);
    
    noise.connect(filter);
    filter.connect(g);
    g.connect(masterGain.current!);
    
    noise.start();
  }, [isMuted]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playTick, playSummon, playGlitch }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundFX = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSoundFX must be used within a SoundProvider');
  return context;
};
