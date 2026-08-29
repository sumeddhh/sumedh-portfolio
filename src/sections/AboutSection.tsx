import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { shouldSkipHeavyAnimations } from '../lib/shouldSkipHeavyAnimations';

// About Section
export default function AboutSection() {
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

      const heading = text.querySelector('h2');
      if (heading) {
        scrollTl.fromTo(heading,
          { y: '-10vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.06
        );
      }

      const textItems = text.querySelectorAll('p, a, button');
      if (textItems.length > 0) {
        scrollTl.fromTo(textItems,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.12
        );
      }

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
            I'm a software engineer with 5+ years of experience building modern web applications across frontend and backend technologies. My background spans product development, UI engineering, and user experience design, bridging technical implementation with thoughtful product decisions.
          </p>
          <p className="text-white/70 text-lg leading-relaxed mb-8">
            Over the years I've worked with startups and international clients, collaborated with distributed teams, mentored engineers, and contributed to technical decision-making. Outside work, I enjoy photography, cinematography, video editing, aquascaping, and plant care.
          </p>
          <div className="mb-8 grid sm:grid-cols-2 gap-2">
            <p className="text-white/60 text-sm">Frontend Engineer @ Flockjay</p>
            <p className="text-white/60 text-sm">5+ Years Software Engineering</p>
            <p className="text-white/60 text-sm">Frontend Architecture & Design Systems</p>
            <p className="text-white/60 text-sm">Full-Stack & Performance Optimization</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://np.linkedin.com/in/sumedh-bajracharya"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
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
