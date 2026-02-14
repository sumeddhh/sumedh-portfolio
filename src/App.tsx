import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import { ArrowUpRight, Eye, Linkedin, Mail, Menu, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
  (window as any).navigateToSection = (sectionId: string) => {
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
          
          console.log(`Found pinned section ${sectionId}:`, {
            start: st.start,
            end: st.end,
            pin: st.vars.pin
          });
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

      console.log(`Navigating to ${sectionId} at scroll position:`, targetScroll);

      const lenisInstance = (window as any).lenis;
      if (lenisInstance?.scrollTo) {
        lenisInstance.scrollTo(targetScroll, { 
          duration: 1.2,
          immediate: false
        });
      } else {
        window.scrollTo({ 
          top: targetScroll, 
          behavior: 'smooth' 
        });
      }
    });
  };

  return () => {
    delete (window as any).navigateToSection;
  };
}, []);

 // Initialize Lenis smooth scroll
useEffect(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Store on window for navigation access
  (window as any).lenis = lenis;

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Connect Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Store section refs
  sectionRefs.current.hero = document.querySelector('#hero');
  sectionRefs.current.about = document.querySelector('#about');
  sectionRefs.current.work = document.querySelector('#work');
  sectionRefs.current.capabilities = document.querySelector('#capabilities');
  sectionRefs.current.experience = document.querySelector('#experience');
  sectionRefs.current.contact = document.querySelector('#contact');

  return () => {
    lenis.destroy();
    delete (window as any).lenis;
    gsap.ticker.remove(() => {});
  };
}, []);
  // Menu toggle
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(menuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }
  }, [menuOpen]);

  const handleViewResume = () => {
    setShowResume(true);
  };

  return (
    <div ref={mainRef} className="relative bg-[#050505] min-h-screen">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Persistent Header */}
      <Header menuOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Full Screen Menu */}
      {menuOpen && <FullScreenMenu menuRef={menuRef} closeMenu={() => setMenuOpen(false)} sectionRefs={sectionRefs} />}

      {/* Main Content */}
      <main className="relative">
        <HeroSection />
        <AboutSection onViewResume={handleViewResume} />
        <SelectedWorkSection />
        <ProjectHealthcareAI />
        <ProjectFertilityBot />
        <ProjectTeamCollab />
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

// Header Component
function Header({ menuOpen, toggleMenu }: { menuOpen: boolean; toggleMenu: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] px-6 py-5 flex justify-between items-center">
      <a href="#hero" className="font-display text-xl font-bold text-white tracking-tight">
        SB
      </a>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
      >
        {menuOpen ? <X size={16} /> : <Menu size={16} />}
        <span className="font-mono text-xs uppercase tracking-widest">Menu</span>
      </button>
    </header>
  );
}

// Full Screen Menu
function FullScreenMenu({ 
  menuRef, 
  closeMenu,
  sectionRefs 
}: { 
  menuRef: React.RefObject<HTMLDivElement | null>; 
  closeMenu: () => void;
  sectionRefs: React.MutableRefObject<{
    hero: HTMLElement | null;
    about: HTMLElement | null;
    work: HTMLElement | null;
    capabilities: HTMLElement | null;
    experience: HTMLElement | null;
    contact: HTMLElement | null;
  }>;
}) {
  const menuItems = [
    { label: 'Home', section: 'hero' as const },
    { label: 'Capabilities', section: 'capabilities' as const },
    { label: 'Experience', section: 'experience' as const },
    { label: 'Contact', section: 'contact' as const },
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://np.linkedin.com/in/sumedh-bajracharya' },
    { label: 'Email', href: 'mailto:sumedhbajracharya07@gmail.com' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    closeMenu();
    
    // Special case for home - scroll to top
    if (section === 'hero') {
      e.preventDefault();
      setTimeout(() => {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }, 300);
    }
    // For other sections, let the browser handle anchor navigation naturally
  };

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[999] bg-[#050505]/98 backdrop-blur-md flex items-center justify-center"
    >
      <div className="text-center">
        <nav className="mb-16">
          <ul className="space-y-6">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={`#${item.section}`}
                  onClick={(e) => handleNavClick(e, item.section)}
                  className="font-display text-5xl md:text-7xl font-semibold text-white hover:text-[#B9FF2C] transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex justify-center gap-8">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm uppercase tracking-widest text-white/60 hover:text-[#B9FF2C] transition-colors link-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
// Subtle Ghost Text Component
function GhostText() {
  return (
    <div className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
      <div className="font-display text-[120px] font-bold leading-none tracking-tighter text-white/[0.02] whitespace-nowrap">
        FULLSTACK
      </div>
      <div className="font-display text-[120px] font-bold leading-none tracking-tighter text-white/[0.02] whitespace-nowrap -mt-4">
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const windowEl = windowRef.current;
    const headline = headlineRef.current;
    const cta = ctaRef.current;

    if (!section || !windowEl || !headline || !cta) return;

    // Skip animations on mobile
    // Mobile check removed
    

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
          end: '+=80%',
          pin: window.innerWidth > 768,
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
        className="window-frame relative w-[86vw] h-[82vh] bg-[#050505] flex flex-col justify-between p-[6%]"
      >
        {/* Decorative hairlines */}
        <div className="hairline-v left-[28%] top-0 h-full" />
        <div className="hairline-h left-0 top-[34%] w-full" />

        {/* Available Badge */}
        <div className="absolute right-[6%] top-[8%] flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#B9FF2C] pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-widest text-white/80">Available for projects</span>
        </div>

        {/* Ghost Text */}
        <GhostText />

        {/* Headline */}
        <div ref={headlineRef} className="mt-auto">
          <p className="font-display text-xl md:text-4xl text-white/60 mb-2">Sup, I'm</p>
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-[0.9]">
            Sumedh
          </h1>
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-[0.9]">
            Bajracharya.
          </h1>
        </div>

        {/* Subheadline & CTA */}
        <div className="mt-6 md:mt-8">
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
  const listRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    const cards = cardsRef.current;
    // Mobile check removed
    

    if (!section || !list || !cards) return;

    // Skip animations on mobile
    

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=80%',
          pin: window.innerWidth > 768,
          
          scrub: 1.2,
        }
      });

      // Entrance (0%-30%)
      scrollTl.fromTo(list,
        { x: '-10vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(list.querySelectorAll('li'),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.06
      );

      scrollTl.fromTo(cards,
        { x: '20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.out' },
        0.08
      );

      // Exit (70%-100%)
      scrollTl.fromTo(list,
        { x: 0, opacity: 1 },
        { x: '-5vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(cards,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0.45, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const projects = [
    { label: 'Healthcare AI', href: '#project-healthcare-ai' },
    { label: 'Fertility Bot', href: '#project-fertility-bot' },
    { label: 'Team Collaboration Platform', href: '#project-team-collab' },
  ];

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-pinned bg-[#050505] flex items-center justify-center z-20"
    >
      <div className="window-frame relative w-[86vw] h-[82vh] bg-[#050505] flex flex-col md:flex-row items-center justify-center p-6 md:p-12 gap-10">
        {/* Project List */}
        <div ref={listRef} className="w-full md:w-[30%] flex flex-col justify-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[#B9FF2C] mb-8">
            Highlighted work
          </h2>
          <ul className="space-y-4">
            {projects.map((project) => (
              <li
                key={project.label}
                className="font-display text-xl md:text-2xl leading-snug break-words whitespace-normal text-white"
              >
                {project.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Project Cards */}
        <div
          ref={cardsRef}
          className="relative w-full md:w-[60%] mt-6 md:mt-0 grid gap-4 md:gap-6 md:grid-cols-3"
        >
          {[
            { title: 'Healthcare AI', img: '/project_healthcare_ai.jpg', tags: ['AI', 'UX Research', 'App Design'] },
            { title: 'Fertility Bot', img: '/project_fertility_bot.jpg', tags: ['Service Design', 'Concepting', 'App Design'] },
            { title: 'Team Collaboration Platform', img: '/project_team_collab.jpg', tags: ['Product Design', 'Design System', 'Branding'] },
          ].map((card) => (
            <div key={card.title} className="relative h-[36vh] md:h-[50vh] rounded-[14px] overflow-hidden">
              <img src={card.img} alt={card.title} className="w-full h-full object-cover img-mono" />
              <div className="card-gradient absolute inset-0" />
              <div className="absolute bottom-[6%] left-[6%]">
                <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-2">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Project: Healthcare AI
function ProjectHealthcareAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    // Mobile check removed
    

    if (!section || !card || !content) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=80%',
          pin: window.innerWidth > 768,
          
          scrub: 1.2,
        }
      });

      // Entrance (0%-30%)
      scrollTl.fromTo(card,
        { x: '60vw', rotateY: 14, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(content.querySelectorAll('*'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.1
      );

      // Exit (70%-100%)
      scrollTl.fromTo(card,
        { x: 0, rotateY: 0, opacity: 1 },
        { x: '-40vw', rotateY: -10, opacity: 0.4, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(content,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-healthcare-ai"
      className="section-pinned bg-[#0B0B0C] flex items-center justify-center z-30"
    >
      <div
        ref={cardRef}
        className="relative w-[92vw] h-[78vh] rounded-[14px] overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <img
          src="/project_healthcare_ai.jpg"
          alt="Healthcare AI"
          className="w-full h-full object-cover img-mono"
        />
        <div className="card-gradient absolute inset-0" />
        <div ref={contentRef} className="absolute bottom-[6%] left-[4%]">
          <h3 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">
            Healthcare AI
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="tag-pill">AI</span>
            <span className="tag-pill">UX Research</span>
            <span className="tag-pill">App Design</span>
          </div>
          <p className="text-white/70 text-sm md:text-base">
            Impact: 10x faster healthcare app building for clients.
          </p>
        </div>
      </div>
    </section>
  );
}

// Project: Fertility Bot
function ProjectFertilityBot() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    const img = imgRef.current;
    // Mobile check removed
    

    if (!section || !card || !content || !img) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=80%',
          pin: window.innerWidth > 768,
          
          scrub: 1.2,
        }
      });

      // Entrance (0%-30%)
      scrollTl.fromTo(card,
        { x: '60vw', rotateY: 14, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(img,
        { scale: 1.14, x: '6vw' },
        { scale: 1, x: 0, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(content.querySelectorAll('*'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.1
      );

      // Exit (70%-100%)
      scrollTl.fromTo(card,
        { x: 0, rotateY: 0, opacity: 1 },
        { x: '-40vw', rotateY: -10, opacity: 0.4, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(content,
        { y: 0, opacity: 1 },
        { y: '-6vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-fertility-bot"
      className="section-pinned bg-[#0B0B0C] flex items-center justify-center z-40"
    >
      <div
        ref={cardRef}
        className="relative w-[92vw] h-[78vh] rounded-[14px] overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <img
          ref={imgRef}
          src="/project_fertility_bot.jpg"
          alt="Fertility Bot"
          className="w-full h-full object-cover img-mono"
        />
        <div className="card-gradient absolute inset-0" />
        <div ref={contentRef} className="absolute bottom-[6%] left-[4%]">
          <h3 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">
            Fertility Bot
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="tag-pill">Service Design</span>
            <span className="tag-pill">Concepting</span>
            <span className="tag-pill">App Design</span>
          </div>
          <p className="text-white/70 text-sm md:text-base">
            Impact: 40% operational cost reduction with optimized AI context.
          </p>
        </div>
      </div>
    </section>
  );
}

// Project: Team Collaboration Platform
function ProjectTeamCollab() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    const img = imgRef.current;
    // Mobile check removed
    

    if (!section || !card || !content || !img) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=80%',
          pin: window.innerWidth > 768,
          
          scrub: 1.2,
        }
      });

      // Entrance (0%-30%)
      scrollTl.fromTo(card,
        { x: '60vw', rotateY: 14, opacity: 0 },
        { x: 0, rotateY: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      scrollTl.fromTo(img,
        { scale: 1.12, x: '-4vw' },
        { scale: 1, x: 0, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(content.querySelectorAll('*'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.1
      );

      // Exit (70%-100%)
      scrollTl.fromTo(card,
        { scale: 1, opacity: 1 },
        { scale: 1.18, opacity: 0.35, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(content,
        { y: 0, opacity: 1 },
        { y: '8vh', opacity: 0, ease: 'power2.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="project-team-collab"
      className="section-pinned bg-[#0B0B0C] flex items-center justify-center z-50"
    >
      <div
        ref={cardRef}
        className="relative w-[92vw] h-[78vh] rounded-[14px] overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <img
          ref={imgRef}
          src="/project_team_collab.jpg"
          alt="Team Collaboration Platform"
          className="w-full h-full object-cover img-mono"
        />
        <div className="card-gradient absolute inset-0" />
        <div ref={contentRef} className="absolute bottom-[6%] left-[4%]">
          <h3 className="font-display text-3xl md:text-5xl font-semibold text-white mb-4">
            Team Collaboration Platform
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="tag-pill">Product Design</span>
            <span className="tag-pill">Design System</span>
            <span className="tag-pill">Branding</span>
          </div>
          <p className="text-white/70 text-sm md:text-base">
            Impact: 35% improvement in internal team productivity.
          </p>
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
    // Mobile check removed
    

    if (!section || !windowEl || !portrait || !text) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=80%',
          pin: window.innerWidth > 768,
          
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
        className="window-frame relative w-[86vw] h-[82vh] bg-[#050505] flex flex-col md:flex-row items-start md:items-center p-[6%] md:p-0"
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
            I'm a senior frontend engineer who cares about the space between design and code—performance,
            accessibility, and interaction quality.
          </p>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            I've led UI for healthcare platforms, built design systems, and shipped products used by thousands.
            With 4.5+ years of experience, I specialize in React, Next.js, and AI-powered solutions.
          </p>
          <div className="mb-8 grid sm:grid-cols-2 gap-2">
            <p className="text-white/60 text-sm">15+ production deployments</p>
            <p className="text-white/60 text-sm">99.9% uptime in healthcare systems</p>
            <p className="text-white/60 text-sm">40% development cost reduction</p>
            <p className="text-white/60 text-sm">8+ engineers mentored</p>
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    // Mobile check removed
    

    if (!section || !content) return;

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

  const capabilities = [
    {
      category: 'Frontend',
      skills: 'React, Next.js, TypeScript, Vue, TailwindCSS, React Query, ReactFlow, Redux'
    },
    {
      category: 'Backend',
      skills: 'Node.js, Nest.js, PostgreSQL, MongoDB, Redis, GraphQL, Microservices'
    },
    {
      category: 'Cloud / DevOps',
      skills: 'AWS (S3, Lambda, Cognito), Azure, Docker, Harness, CI/CD'
    },
    {
      category: 'AI & Automation',
      skills: 'Cursor, Claude Code, LLM APIs, Token Optimization, Intent Recognition'
    },
    {
      category: 'Design',
      skills: 'Figma, Adobe XD, Design Systems, Prototyping, Usability Testing'
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative bg-[#050505] py-24 z-[70]"
    >
      <div className="window-frame w-[86vw] mx-auto bg-[#050505] p-[6%]">
        <div ref={contentRef}>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
            Capabilities
          </h2>
          <div className="w-24 h-1 bg-[#B9FF2C] mb-12" />

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
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
    // Mobile check removed
    

    if (!section || !content) return;

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
    { role: 'Sr. Software Engineer II', company: 'GritFeat Solutions', period: '2024–Present', highlight: 'Led AI chat streaming rollout with 60% faster responses and lower token costs.' },
    { role: 'Sr. Software Engineer I', company: 'GritFeat Solutions', period: '2023–2024', highlight: 'Managed AWS + Azure infrastructure and reduced deployment time by 30% with CI/CD.' },
    { role: 'Software Engineer III', company: 'GritFeat Solutions', period: '2023', highlight: 'Built design systems that cut feature delivery time by 25%.' },
    { role: 'Software Engineer I & II', company: 'GritFeat Solutions', period: '2021–2022', highlight: 'Improved initial load times by 50% through refactoring and bundle optimization.' },
    { role: 'Associate UI/UX Engineer', company: 'GritFeat Solutions', period: '2020–2021', highlight: 'Converted business requirements into high-fidelity product prototypes.' },
    { role: 'UX & Full-Stack Intern', company: 'ITGlance', period: '2020', highlight: 'Supported full-stack workflows for manual record digitization systems.' },
  ];

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative bg-[#050505] py-24 z-[80]"
    >
      <div className="window-frame w-[86vw] mx-auto bg-[#050505] p-[6%]">
        <div ref={contentRef}>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-12">
            Experience
          </h2>

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
                      <p className="text-white/45 mt-2 text-sm md:text-base">{exp.highlight}</p>
                    </div>
                    <span className="font-mono text-sm text-white/40 mt-2 md:mt-0">
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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    // Mobile check removed
    

    if (!section || !content) return;

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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#050505] py-24 z-[90]"
    >
      <div className="window-frame w-[86vw] mx-auto bg-[#050505] p-[6%] text-center">
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

// Progress Indicator
function ProgressIndicator() {
  const [progress, setProgress] = useState(1);
  const totalSections = 9;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(Math.ceil((scrollTop / docHeight) * totalSections), totalSections);
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
      <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <span className="font-mono text-xs text-white/60">
          {String(progress).padStart(2, '0')} / {totalSections}
        </span>
      </div>
    </div>
  );
}

export default App;
