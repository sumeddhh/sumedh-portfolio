import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import DecryptedText from '../components/DecryptedText';
import { shouldSkipHeavyAnimations } from '../lib/shouldSkipHeavyAnimations';

const DotGrid = lazy(() => import('../DotGrid'));

// Subtle Ghost Text Component
function GhostText() {
  return (
    <div aria-hidden="true" className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
      <div className="font-display text-[120px] font-bold leading-none tracking-tighter text-lime-300/[0.05] whitespace-nowrap">
        FULLSTACK
      </div>
      <div className="font-display text-[120px] font-bold leading-none tracking-tighter text-lime-300/[0.05] whitespace-nowrap -mt-4">
        ENGINEER
      </div>
    </div>
  );
}

// Hero Section
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [shouldLoadDotGrid, setShouldLoadDotGrid] = useState(false);

  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    if (win.requestIdleCallback) {
      idleHandle = win.requestIdleCallback(() => setShouldLoadDotGrid(true), { timeout: 1200 });
    } else {
      timeoutHandle = window.setTimeout(() => setShouldLoadDotGrid(true), 450);
    }

    return () => {
      if (idleHandle !== null && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const windowEl = windowRef.current;
    const headline = headlineRef.current;
    const cta = ctaRef.current;

    if (!section || !windowEl || !headline || !cta) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline();

      loadTl.fromTo(windowEl,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' }
      );

      if (headline.children.length > 0) {
        loadTl.fromTo(headline.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
          '-=0.5'
        );
      }

      if (cta.children.length > 0) {
        loadTl.fromTo(cta.children,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          '-=0.3'
        );
      }

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          pin: false,
          scrub: 1.2,
          onLeaveBack: () => {
            const targets: (Element | HTMLElement)[] = [windowEl];
            if (headline.children.length > 0) targets.push(...Array.from(headline.children));
            if (cta.children.length > 0) targets.push(...Array.from(cta.children));
            gsap.set(targets, { clearProps: 'all' });
            loadTl.progress(1);
          }
        }
      });

      // Exit phase (70%-100%)
      scrollTl.fromTo(headline,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(windowEl,
        { scale: 1, opacity: 1 },
        { scale: 1.06, opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(cta,
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned bg-[#050505] flex items-center justify-center z-10"
    >
      {/* Window Frame */}
      <div
        ref={windowRef}
        style={{ borderRadius: '6rem' }}
        className="window-frame relative w-[86vw] h-[82vh] bg-[#050505] flex flex-col justify-between p-[6%]"
      >
        {/* DotGrid background */}
        <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, overflow: 'hidden' }} className="rounded-[inherit]">
          {shouldLoadDotGrid ? (
            <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#20330c_0%,#050505_55%)]" />}>
              <DotGrid
                dotSize={5}
                gap={15}
                baseColor="#B9FF2C10"
                activeColor="#B9FF2C"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                returnDuration={1.5}
                className="!p-0 absolute inset-0"
              />
            </Suspense>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#20330c_0%,#050505_55%)]" />
          )}
        </div>


        {/* Ghost Text */}
        <GhostText />

        {/* Headline */}
        <div ref={headlineRef} className="mt-auto relative z-10">
          <p className="font-display text-xl md:text-4xl text-white/60 mb-2">Sup, I'm</p>
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-[0.9]">
            Sumedh <br /> Bajracharya.
          </h1>
        </div>

        {/* Subheadline & CTA */}
        <div className="mt-6 md:mt-8 relative z-10">
          <p className="text-white/60 text-base md:text-xl mb-4 md:mb-6">
            Software Engineer · Web Development · UX
          </p>
          <HeroCTAs ctaRef={ctaRef} />
        </div>
      </div>
    </section>
  );
}

function HeroCTAs({ ctaRef }: { ctaRef: React.RefObject<HTMLDivElement | null> }) {
  const [hoveredBtn, setHoveredBtn] = useState<'work' | 'contact' | null>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (window.navigateToSection) {
      window.navigateToSection(sectionId);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 md:gap-4 py-2 md:py-4">
      <a
        href="#work"
        onClick={(e) => handleNavClick(e, 'work')}
        onMouseEnter={() => setHoveredBtn('work')}
        onMouseLeave={() => setHoveredBtn(null)}
        className="btn-primary flex items-center justify-center gap-2 text-base md:text-base"
      >
        <DecryptedText text="View work" isHovered={hoveredBtn === 'work'} />
        <ArrowUpRight size={18} />
      </a>
      <a
        href="#contact"
        onClick={(e) => handleNavClick(e, 'contact')}
        onMouseEnter={() => setHoveredBtn('contact')}
        onMouseLeave={() => setHoveredBtn(null)}
        className="btn-secondary text-base md:text-base text-center"
      >
        <DecryptedText text="Contact" isHovered={hoveredBtn === 'contact'} />
      </a>
    </div>
  );
}
