import { useState, useEffect } from 'react';

export default function SignalGlitch({ trigger }: { trigger: any }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const timeout = setTimeout(() => setActive(false), 250);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[11000] pointer-events-none overflow-hidden bg-black/20 mix-blend-screen opacity-[0.4]">
      {/* Glitch Slices */}
      <div className="absolute inset-x-0 h-1 bg-[#B9FF2C]/30 animate-pulse top-[20%] skew-x-12" />
      <div className="absolute inset-x-0 h-px bg-white/20 animate-pulse top-[50%] -skew-x-12" />
      <div className="absolute inset-x-0 h-2 bg-[#B9FF2C]/10 animate-pulse top-[80%] skew-x-6" />
      
      {/* Chromatic Aberration Simulation */}
      <div className="absolute inset-0 border-[20px] border-[#B9FF2C]/5 blur-[60px]" />
      
      {/* Brief Flash Overlay */}
      <div className="absolute inset-0 bg-white/5 animate-in fade-in zoom-in duration-75" />
    </div>
  );
}
