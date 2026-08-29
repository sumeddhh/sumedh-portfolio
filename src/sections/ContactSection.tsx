import { gsap } from 'gsap';
import { ArrowUpRight, Copy, Linkedin, Mail } from 'lucide-react';
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { shouldSkipHeavyAnimations } from '../lib/shouldSkipHeavyAnimations';

const Hyperspeed = lazy(() => import('../Hyperspeed'));

export default function ContactSection({ setToast }: { setToast: (toast: string) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldLoadHyperspeed, setShouldLoadHyperspeed] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      const items = content.querySelectorAll('.contact-animate');
      if (items.length > 0) {
        gsap.fromTo(items,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 50%',
              scrub: true,
            }
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldLoadHyperspeed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setShouldLoadHyperspeed(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: '350px 0px', threshold: 0.01 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadHyperspeed]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText('sumedhbajracharya07@gmail.com')
      .then(() => setToast('Email copied to clipboard'))
      .catch(() => setToast('Could not copy email'));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#050505] min-h-screen z-[90] flex items-center justify-center w-full overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-[0.7]">
        {shouldLoadHyperspeed ? (
          <Suspense fallback={<div className="h-full w-full bg-[#050505]" />}>
            <Hyperspeed
              effectOptions={{
                distortion: 'turbulentDistortion',
                length: 400,
                roadWidth: 4,
                islandWidth: 1,
                lanesPerRoad: 3,
                fov: 70,
                fovSpeedUp: 120,
                speedUp: 2,
                carLightsFade: 0.4,
                totalSideLightSticks: 20,
                lightPairsPerRoadWay: 40,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [12, 80],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.8, 0.8],
                carFloorSeparation: [0, 5],
                colors: {
                  roadColor: 0x080808,
                  islandColor: 0x0a0a0a,
                  background: 0x000000,
                  shoulderLines: 0x131318,
                  brokenLines: 0x131318,
                  leftCars: [0xB9FF2C, 0xffffff, 0xddff88],
                  rightCars: [0xB9FF2C, 0x88cc00, 0xddff88],
                  sticks: 0xFFFFFF
                }
              }}
            />
          </Suspense>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,#101010,#050505_60%)]" />
        )}
      </div>
      <div
        style={{ borderRadius: '6rem' }}
        className="window-frame w-[86vw] mx-auto bg-[#050505]/65 backdrop-blur-[12px] p-[6%] text-center relative overflow-hidden z-10">
        {/* Ghost Text */}
        <div aria-hidden="true" className="absolute right-[-2%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
          <div className="font-display text-[140px] font-bold leading-none tracking-tighter text-lime-300/[0.05] whitespace-nowrap uppercase">
            Contact
          </div>
        </div>
        
        <div ref={contentRef} className="w-full max-w-5xl mx-auto">
          <h2 className="font-display text-5xl md:text-7xl font-semibold text-white mb-6 text-center contact-animate">
            Let's build something<br />
            <span className="text-[#B9FF2C]">precise.</span>
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12 contact-animate">
            {/* Direct Email Card with Clipboard Copy */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-3 hover:border-[#B9FF2C]/30 transition-all duration-300">
              <a
                href="mailto:sumedhbajracharya07@gmail.com"
                className="flex items-center gap-3 text-white/80 hover:text-[#B9FF2C] transition-colors"
              >
                <Mail size={18} className="text-[#B9FF2C]" />
                <span className="font-mono text-xs md:text-sm select-all">sumedhbajracharya07@gmail.com</span>
              </a>
              <span className="h-4 w-px bg-white/15 mx-1" />
              <button
                onClick={handleCopyEmail}
                className="p-1 hover:text-[#B9FF2C] text-white/40 transition-colors cursor-pointer"
                title="Copy Email to Clipboard"
              >
                <Copy size={14} />
              </button>
            </div>

            {/* LinkedIn Profile */}
            <a
              href="https://np.linkedin.com/in/sumedh-bajracharya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3 hover:border-[#B9FF2C]/30 hover:text-[#B9FF2C] text-white/80 transition-all duration-300"
            >
              <Linkedin size={18} className="text-[#B9FF2C]" />
              <span className="font-mono text-xs md:text-sm">LinkedIn</span>
              <ArrowUpRight size={14} className="text-white/40" />
            </a>
          </div>

          <div className="mt-24 pt-8 border-t border-white/10 text-center contact-animate">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              © Sumedh Bajracharya — {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
