import { gsap } from 'gsap';
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { shouldSkipHeavyAnimations } from '../lib/shouldSkipHeavyAnimations';

const CapabilitiesLogoLoop = lazy(() => import('../CapabilitiesLogoLoop'));

// Capabilities Section (Flowing)
export default function CapabilitiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldLoadLogoLoop, setShouldLoadLogoLoop] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      const heading = content.querySelector('h2');
      if (heading) {
        gsap.fromTo(heading,
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
      }

      const blocks = content.querySelectorAll('.capability-block');
      if (blocks.length > 0) {
        gsap.fromTo(blocks,
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
      }
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
      skills: 'Codex, Cursor, Claude Code, LLM API Integration, Token Optimization, Intent Recognition'
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
          <h2 className="font-display text-4xl md:text-[5rem] font-semibold text-white text-center mb-24">
            Stacks & <span className="text-[#B9FF2C]">Capabilities</span>
          </h2>

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
