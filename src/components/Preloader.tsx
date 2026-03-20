import { useState, useEffect } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const decryptText = (targetText: string, progress: number) => {
  return targetText.split('').map((char, index) => {
    if (char === ' ') return ' ';
    const charProgress = (index / targetText.length);
    // Add a bit of randomness to how fast each character resolves
    if (progress > charProgress + 0.1) return char;
    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }).join('');
};

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const line1 = "SYS_BOOT::PORTFOLIO_ENGINE_V2";
  const line2 = "INITIALIZING CORE MODULES...";
  const line3 = "SUMEDH BAJRACHARYA // SOFTWARE COMPONENT";
  
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('sumedh_preloader_done')) {
      setLoading(false);
      return;
    }

    let start = Date.now();
    const duration = 1600; // 1.6s of decryption

    const animate = () => {
      const now = Date.now();
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      
      setText1(decryptText(line1, p * 1.5));
      setText2(decryptText(line2, p * 1.5 - 0.2));
      setText3(decryptText(line3, p * 1.5 - 0.4));

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('sumedh_preloader_done', 'true');
          }, 500); // 500ms fade transition
        }, 300); // hold decrypted text briefly
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center font-mono text-[#B9FF2C] tracking-widest text-xs md:text-sm p-6 overflow-hidden transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="grain-overlay pointer-events-none opacity-50" />
      <div className="flex flex-col gap-4 text-center max-w-lg w-full relative z-10">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="w-2 h-2 bg-[#B9FF2C] rounded-full animate-ping" />
          <span className="opacity-70">CONN ESTABLISHED</span>
        </div>
        <p className="min-h-[1.5rem] break-all">{text1}</p>
        <p className="min-h-[1.5rem] break-all opacity-80">{text2}</p>
        <p className="min-h-[1.5rem] break-all text-white font-bold mt-4">{text3}</p>
        
        <div className="w-full h-px bg-white/10 mt-8 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[#B9FF2C]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between w-full text-[10px] opacity-40 mt-2">
          <span>SYS.LOADING</span>
          <span>{Math.floor(progress * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
