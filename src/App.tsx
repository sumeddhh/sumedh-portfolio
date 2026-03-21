import TiltedCard from './TiltedCard';
import GlassSurface from './GlassSurface';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowUpRight, Eye, Linkedin, Mail, X } from 'lucide-react';
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Hyperspeed = lazy(() => import('./Hyperspeed'));
const DotGrid = lazy(() => import('./DotGrid'));
const CapabilitiesLogoLoop = lazy(() => import('./CapabilitiesLogoLoop'));

const shouldSkipHeavyAnimations = () =>
  window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

declare global {
  interface Window {
    navigateToSection?: (sectionId: string) => void;
  }
}

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [showResume, setShowResume] = useState(false);

  // Section refs for reliable navigation
  const sectionRefs = useRef({
    hero: null as HTMLElement | null,
    about: null as HTMLElement | null,
    work: null as HTMLElement | null,
    capabilities: null as HTMLElement | null,
    experience: null as HTMLElement | null,
    contact: null as HTMLElement | null,
  });

  // In App.tsx, replace the navigation useEffect with this:

  useEffect(() => {
    // Global navigation handler attached to window
    window.navigateToSection = (sectionId: string) => {
      // Wait for next frame to ensure all ScrollTriggers are initialized
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        const element = document.querySelector(`#${sectionId}`);
        if (!element) return;

        let targetScroll = 0;
        let foundPinnedTrigger = false;

        // Get all triggers and find by element ID
        const allTriggers = ScrollTrigger.getAll();

        for (const st of allTriggers) {
          // Check if this trigger is pinned and matches our element
          if (st.vars.pin && st.trigger && (st.trigger as Element).id === sectionId) {
            // For pinned sections, we need the scroll position where pinning starts
            // st.start gives us the trigger position, but we need to account for 
            // any scrub/pin spacing. Use the actual pinned position.
            targetScroll = st.start;
            foundPinnedTrigger = true;
            break;
          }
        }

        // If not a pinned section, calculate based on element position
        if (!foundPinnedTrigger) {
          // For non-pinned sections, we need to account for the space taken by pinned sections
          // Calculate cumulative height of all pinned sections that come before this one
          let pinnedOffset = 0;

          allTriggers.forEach(st => {
            if (st.vars.pin && st.trigger) {
              const triggerId = (st.trigger as Element).id;
              const triggerElement = document.querySelector(`#${triggerId}`);
              const currentElement = document.querySelector(`#${sectionId}`);

              if (triggerElement && currentElement) {
                const triggerRect = triggerElement.getBoundingClientRect();
                const currentRect = currentElement.getBoundingClientRect();

                // If this pinned section comes before our target
                if (triggerRect.top < currentRect.top) {
                  // Add the pin duration (end - start) to the offset
                  pinnedOffset += (st.end - st.start);
                }
              }
            }
          });

          targetScroll = (element as HTMLElement).offsetTop - pinnedOffset;
        }

        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      });
    };

    return () => {
      delete window.navigateToSection;
    };
  }, []);

  // ScrollTrigger refresh on mount
  useEffect(() => {
    ScrollTrigger.refresh();
    
    // Store section refs for other components
    sectionRefs.current.hero = document.querySelector('#hero');
    sectionRefs.current.about = document.querySelector('#about');
    sectionRefs.current.work = document.querySelector('#work');
    sectionRefs.current.capabilities = document.querySelector('#capabilities');
    sectionRefs.current.experience = document.querySelector('#experience');
    sectionRefs.current.contact = document.querySelector('#contact');
  }, []);

  const handleViewResume = () => {
    setShowResume(true);
  };

  return (
    <div ref={mainRef} className="relative bg-[#050505] min-h-screen">
      {/* Grain Overlay */}
      <div className="grain-overlay" />


      {/* Main Content */}
      <main className="relative">
        <HeroSection />
        <AboutSection onViewResume={handleViewResume} />
        <SelectedWorkSection />
        <ResumeModal open={showResume} onOpenChange={setShowResume} />
        <CapabilitiesSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      {/* Progress Indicator */}
      <ProgressIndicator />
    </div>
  );
}

// Progress Indicator
function ProgressIndicator() {
  const [progress, setProgress] = useState(1);
  const totalSections = 6;

  const sectionDescriptions: Record<number, string> = {
    1: "Introductory section for my landing page",
    2: "About my background & journey",
    3: "Showcase of selected projects",
    4: "Technical skills & expertise",
    5: "Professional experience & milestones",
    6: "Contact & collaboration"
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(Math.ceil((scrollTop / docHeight) * totalSections), totalSections);
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
            <span className="text-white">{progress}</span> / {totalSections}
          </span>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="font-mono text-[10px] md:text-xs text-white truncate text-right">
            {sectionDescriptions[progress]}
          </span>
        </div>
      </GlassSurface>
    </div>
  );
}

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
function HeroSection() {
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

      loadTl.fromTo(headline.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
        '-=0.5'
      );

      loadTl.fromTo(cta.children,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          pin: false,
          scrub: 1.2,
          onLeaveBack: () => {
            gsap.set([windowEl, headline.children, cta.children], { clearProps: 'all' });
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
            Sumedh
          </h1>
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-[0.9]">
            Bajracharya.
          </h1>
        </div>

        {/* Subheadline & CTA */}
        <div className="mt-6 md:mt-8 relative z-10">
          <p className="text-white/60 text-base md:text-xl mb-4 md:mb-6">
            Senior Software Engineer II · Web Development · UX
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 md:gap-4 py-2 md:py-4">
            <a href="#work" className="btn-primary flex items-center justify-center gap-2 text-base md:text-base">
              View work
              <ArrowUpRight size={18} />
            </a>
            <a href="#contact" className="btn-secondary text-base md:text-base text-center">
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// Selected Work Section
function SelectedWorkSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          pin: false,
          scrub: 1.2,
        }
      });

      // Entrance (0%-30%)
      scrollTl.fromTo(cards,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Exit (70%-100%)
      scrollTl.fromTo(cards,
        { scale: 1, opacity: 1 },
        { scale: 0.95, opacity: 0.45, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const projects = [
    {
      title: 'Marketing Engine',
      img: '/project_marketing_engine.png',
      tags: ['ReactFlow', 'Omnichannel', 'AI'],
      impact: '20% higher conversion.',
      description: 'Node-based campaign builder with conditional messaging.'
    },
    {
      title: 'Healthcare AI',
      img: '/project_healthcare_ai.jpg',
      tags: ['ReactFlow', 'Metamodel API', 'AI'],
      impact: '10x faster app building.',
      description: 'No-code healthcare builder via ReactFlow.'
    },
    {
      title: 'Fertility Bot',
      img: '/project_fertility_bot.jpg',
      tags: ['Backend', 'HIPAA', 'LLM'],
      impact: '40% cost reduction.',
      description: 'HIPAA AI chatbot with context optimization.'
    },
    {
      title: 'Team Collaboration',
      img: '/project_team_collab.jpg',
      tags: ['Socket.io', 'Architecture', 'Web'],
      impact: '35% team productivity.',
      description: 'Real-time collaboration and OKR tracking.'
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-pinned bg-[#050505] flex items-center justify-center z-20"
    >
      <div
        style={{ borderRadius: '6rem' }}
        className="window-frame relative w-[86vw] h-auto min-h-[82vh] bg-[#050505] flex flex-col items-center justify-center p-6 md:p-12">
        <h2 className="font-display text-4xl md:text-[5rem] font-semibold text-[#B9FF2C] mb-16 text-center">
          Highlighted <span className="text-white">Work</span>
        </h2>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full max-w-[92rem] mx-auto items-center justify-items-center px-4"
        >
          {projects.map((project) => (
            <TiltedCard
              key={project.title}
              imageSrc={project.img}
              altText={project.title}
              captionText={project.title}
              containerHeight="400px"
              containerWidth="100%"
              imageHeight="300px"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip
              displayOverlayContent
              overlayContent={
                <div className="p-6 w-full h-full flex flex-col justify-end bg-gradient-to-t from-black/90 to-transparent group-hover:bg-black/60 transition-all duration-300 rounded-[15px]">
                  <div className="transform translate-y-[62px] group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <p className="font-display text-xl md:text-2xl font-bold text-white mb-2">
                      {project.title}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 border border-[#B9FF2C]/50 rounded text-[9px] uppercase tracking-wider text-[#B9FF2C] font-mono bg-black/40 backdrop-blur-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <p className="font-display text-sm text-white/95 leading-relaxed mb-2">
                        {project.description}
                      </p>
                      <p className="font-mono text-[10px] text-[#B9FF2C] font-semibold tracking-wide">
                        Impact: {project.impact}
                      </p>
                    </div>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// About Section
function AboutSection({ onViewResume }: { onViewResume: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const windowEl = windowRef.current;
    const portrait = portraitRef.current;
    const text = textRef.current;
    if (!section || !windowEl || !portrait || !text) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          pin: false,
          scrub: 1.2,
        }
      });

      // Entrance (0%-30%)
      scrollTl.fromTo(portrait,
        { x: '-50vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(text.querySelector('h2'),
        { y: '-10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.06
      );

      scrollTl.fromTo(text.querySelectorAll('p, a, button'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.12
      );

      // Exit (70%-100%)
      scrollTl.fromTo(portrait,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(text,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(windowEl,
        { opacity: 1 },
        { opacity: 0.25, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pinned bg-[#050505] flex items-center justify-center z-[60]"
    >
      <div
        ref={windowRef}
        style={{ borderRadius: '6rem' }}
        className="window-frame relative w-[86vw] h-[82vh] bg-[#050505] flex flex-col md:flex-row items-start md:items-center p-[6%] md:p-0 overflow-hidden"
      >
        {/* Portrait */}
        <div
          ref={portraitRef}
          className="relative md:absolute left-auto md:left-[6%] top-auto md:top-1/2 md:-translate-y-1/2 w-full md:w-[34vw] h-[38vh] md:h-[62vh] rounded-[14px] overflow-hidden"
        >
          <img
            src="/about_portrait.jpg"
            alt="Sumedh Bajracharya"
            className="w-full h-full object-cover img-mono"
          />
        </div>

        {/* Text Content */}
        <div
          ref={textRef}
          className="relative md:absolute left-auto md:left-[50%] top-auto md:top-1/2 md:-translate-y-1/2 w-full md:w-[42vw] mt-6 md:mt-0"
        >
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-white mb-8">
            About
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-6">
            I'm a Senior Software Engineer focused on frontend architecture, full-stack product delivery, and design-to-code execution, with strong attention to performance, accessibility, and interaction quality.
          </p>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            I've led enterprise healthcare platforms, delivered 15+ production deployments, and built HIPAA-compliant systems with 99.9% uptime. With 4.5+ years of experience, I specialize in React, Next.js, TypeScript, and AI-powered product workflows.
          </p>
          <div className="mb-8 grid sm:grid-cols-2 gap-2">
            <p className="text-white/60 text-sm">15+ production deployments</p>
            <p className="text-white/60 text-sm">99.9% uptime in healthcare systems</p>
            <p className="text-white/60 text-sm">10,000+ monthly active healthcare users served</p>
            <p className="text-white/60 text-sm">40% LLM operational cost reduction</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={onViewResume} className="btn-primary flex items-center gap-2">
              <Eye size={18} />
              View Resume
            </button>
            <a
              href="https://np.linkedin.com/in/sumedh-bajracharya"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              LinkedIn
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResumeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#050505] border border-white/10 w-full max-w-5xl h-[86vh] rounded-lg p-4 md:p-6 shadow-2xl">
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Close resume"
          className="absolute top-3 right-3 rounded-full border border-white/10 text-white/80 hover:text-white hover:border-white/30 transition-colors p-2"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col h-full">
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-white mb-4">
            Resume
          </h2>
          <div className="rounded-[14px] overflow-hidden border border-white/10 bg-black/40 flex-1">
            <iframe
              src="/Sumedh_Bajracharya_CV.pdf#view=FitH"
              title="Sumedh Bajracharya Resume"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Capabilities Section (Flowing)
function CapabilitiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldLoadLogoLoop, setShouldLoadLogoLoop] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(content.querySelector('h2'),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          }
        }
      );

      gsap.fromTo(content.querySelectorAll('.capability-block'),
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldLoadLogoLoop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setShouldLoadLogoLoop(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin: '300px 0px', threshold: 0.01 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadLogoLoop]);

  const capabilities = [
    {
      category: 'Frontend',
      skills: 'React, Next.js, TypeScript, Vue.js, TailwindCSS, React Query, ReactFlow, Redux, Vite, Webpack'
    },
    {
      category: 'Backend',
      skills: 'Node.js, Nest.js, PostgreSQL, MongoDB, Redis, GraphQL, REST APIs, Microservices'
    },
    {
      category: 'Testing',
      skills: 'Jest, Cypress, Vitest, React Testing Library'
    },
    {
      category: 'Cloud / DevOps',
      skills: 'AWS (S3, EC2, Lambda, Cognito, CloudFront), Azure (ACR, Container Apps, DevOps), Docker, Kubernetes, GitHub Actions, Harness'
    },
    {
      category: 'Security / Auth',
      skills: 'OAuth, JWT, HIPAA-compliant architecture, AWS Cognito'
    },
    {
      category: 'AI & Automation',
      skills: 'Cursor, Claude Code, LLM API Integration, Token Optimization, Intent Recognition'
    },
    {
      category: 'Design',
      skills: 'Figma, Adobe XD, Storybook, Design Systems, Usability Testing'
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative bg-[#050505] py-24 z-[70]"
    >
      <div
        style={{ borderRadius: '6rem' }}
        className="window-frame w-[86vw] mx-auto bg-[#050505] p-[6%] relative overflow-hidden">
        {/* Ghost Text */}
        <div aria-hidden="true" className="absolute right-[-2%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
          <div className="font-display text-[5rem] font-bold leading-none tracking-tighter text-lime-300/[0.05] whitespace-nowrap uppercase">
            Capabilities
          </div>
        </div>
        <div ref={contentRef}>
          <div className="font-display text-4xl md:text-[5rem] font-semibold text-white text-center mb-24">
            Stacks & <span className="text-[#B9FF2C]">Capabilities</span>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 mt-10">
            {capabilities.map((cap) => (
              <div key={cap.category} className="capability-block">
                <h3 className="font-mono text-sm uppercase tracking-widest text-[#B9FF2C] mb-3">
                  {cap.category}
                </h3>
                <p className="text-white/70 text-lg">
                  {cap.skills}
                </p>
              </div>
            ))}
          </div>

          {/* Logo Loop Carousel */}
          <div className="mt-20 pt-10 border-t border-white/5">
            {shouldLoadLogoLoop ? (
              <Suspense fallback={<div className="h-[84px] w-full" />}>
                <CapabilitiesLogoLoop />
              </Suspense>
            ) : (
              <div className="h-[84px] w-full" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Experience Section (Flowing)
function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(content.querySelectorAll('.experience-item'),
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true,
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const experiences = [
    { role: 'Sr. Software Engineer II', company: 'GritFeat Solutions', period: '2024–Present', highlight: 'Led frontend architecture and chunk-based AI chat streaming; improved response times by 60% and reduced token costs by 40%.' },
    { role: 'Sr. Software Engineer I', company: 'GritFeat Solutions', period: '2023', highlight: 'Managed AWS/Azure infrastructure and automated CI/CD with GitHub Actions + Harness, reducing deployment time by 30%.' },
    { role: 'Software Engineer (Associate through III)', company: 'GritFeat Solutions', period: '2020–2022', highlight: 'Delivered design systems, cut initial load times by 50%, reduced API calls by 70%, and improved feature delivery by 25%.' },
    { role: 'UX & Full-Stack Intern', company: 'ITGlance', period: '2020', highlight: 'Contributed to JavaScript/Java full-stack workflows for manual record digitization systems.' },
  ];

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative bg-[#050505] py-24 z-[80]"
    >
      <div
        style={{ borderRadius: '6rem' }}
        className="window-frame w-[86vw] mx-auto bg-[#050505] p-[6%] relative overflow-hidden">
        {/* Ghost Text */}
        <div aria-hidden="true" className="absolute right-[-2%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
          <div className="font-display text-[140px] font-bold leading-none tracking-tighter text-lime-300/[0.05] whitespace-nowrap uppercase">
            Experience
          </div>
        </div>
        <div ref={contentRef}>
          <div className="font-display !text-[5rem] tracking-tight md:text-5xl font-semibold text-white text-center mb-12">
            Work <span className="text-[#B9FF2C]">Experience</span>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 w-px h-full bg-white/10" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <div key={i} className="experience-item relative pl-8">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-2 h-2 -translate-x-1/2 rounded-full bg-[#B9FF2C]" />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-white">
                        {exp.role}
                      </h3>
                      <p className="text-white/60 mt-1">{exp.company}</p>
                      <p className="text-white/50 mt-2 text-sm md:text-base">{exp.highlight}</p>
                    </div>
                    <span className="font-mono text-sm text-white/50 mt-2 md:mt-0">
                      {exp.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Contact Section (Flowing)
function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldLoadHyperspeed, setShouldLoadHyperspeed] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(content.querySelectorAll('*'),
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
        className="window-frame w-[86vw] mx-auto bg-[#050505]/60 backdrop-blur-[10px] p-[6%] text-center relative overflow-hidden z-10">
        {/* Ghost Text */}
        <div aria-hidden="true" className="absolute right-[-2%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
          <div className="font-display text-[140px] font-bold leading-none tracking-tighter text-lime-300/[0.05] whitespace-nowrap uppercase">
            Contact
          </div>
        </div>
        <div ref={contentRef}>
          <h2 className="font-display text-5xl md:text-7xl font-semibold text-white mb-8">
            Let's build something<br />
            <span className="text-[#B9FF2C]">precise.</span>
          </h2>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12">
            <a
              href="mailto:sumedhbajracharya07@gmail.com"
              className="flex items-center gap-3 text-white/80 hover:text-[#B9FF2C] transition-colors"
            >
              <Mail size={20} />
              <span className="font-mono text-sm">sumedhbajracharya07@gmail.com</span>
            </a>
            <a
              href="https://np.linkedin.com/in/sumedh-bajracharya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/80 hover:text-[#B9FF2C] transition-colors"
            >
              <Linkedin size={20} />
              <span className="font-mono text-sm">LinkedIn</span>
            </a>
          </div>

          <div className="mt-24 pt-8 border-t border-white/10">
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">
              © Sumedh Bajracharya — {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default App;
