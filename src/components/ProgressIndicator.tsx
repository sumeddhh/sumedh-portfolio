import { useEffect, useState } from 'react';
import GlassSurface from '../GlassSurface';

const TOTAL_SECTIONS = 6;

const SECTION_DESCRIPTIONS: Record<number, string> = {
  1: 'Introductory section for my landing page',
  2: 'About my background & journey',
  3: 'Showcase of selected projects',
  4: 'Technical skills & expertise',
  5: 'Professional experience & milestones',
  6: 'Contact & collaboration'
};

export default function ProgressIndicator() {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(
        Math.ceil((scrollTop / docHeight) * TOTAL_SECTIONS),
        TOTAL_SECTIONS
      );
      setProgress(Math.max(1, scrollPercent));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[min(90vw,480px)]">
      <GlassSurface
        width="100%"
        height={48}
        borderRadius={50}
        backgroundOpacity={0.5}
        blur={24}
        displace={4}
        distortionScale={-120}
        mixBlendMode="multiply"
      >
        <div className="px-6 w-full flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] md:text-xs text-white whitespace-nowrap">
            <span className="text-white">{progress}</span> / {TOTAL_SECTIONS}
          </span>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="font-mono text-[10px] md:text-xs text-white truncate text-right">
            {SECTION_DESCRIPTIONS[progress]}
          </span>
        </div>
      </GlassSurface>
    </div>
  );
}
