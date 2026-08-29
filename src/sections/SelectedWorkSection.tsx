import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import TiltedCard from '../TiltedCard';
import { shouldSkipHeavyAnimations } from '../lib/shouldSkipHeavyAnimations';

// Selected Work Section
export default function SelectedWorkSection() {
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
      tags: ['ReactFlow', 'Metamodel API', 'AI'],
      impact: '10x faster config.',
      description: 'No-code automation builder using ReactFlow and Metamodel API for canvas-based UX.',
      isCensored: true
    },
    {
      title: 'Healthcare AI',
      img: '/project_healthcare_ai.jpg',
      tags: ['React', 'Next.js', 'AWS'],
      impact: 'Zero HIPAA breach.',
      description: 'Enterprise healthcare platform optimized under strict regulatory workflows.',
      isCensored: true
    },
    {
      title: 'Care Assistant AI',
      img: '/project_care_assistant.jpg',
      tags: ['Backend', 'HIPAA', 'LLM'],
      impact: '40% cost reduction.',
      description: 'HIPAA-compliant clinical AI assistant with conversation history summarization.',
      isCensored: true
    },
    {
      title: 'Team Collaboration',
      img: '/project_team_collab.jpg',
      tags: ['Socket.io', 'Architecture', 'Web'],
      impact: '35% productivity.',
      description: 'Real-time collaboration hub leveraging Socket.io messaging and OKR tracking.',
      isCensored: true
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
              isCensored={project.isCensored}
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
