import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { shouldSkipHeavyAnimations } from '../lib/shouldSkipHeavyAnimations';

// Experience Section (Flowing)
export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    if (shouldSkipHeavyAnimations()) return;

    const ctx = gsap.context(() => {
      const items = content.querySelectorAll('.experience-item');
      if (items.length > 0) {
        gsap.fromTo(items,
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
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const experiences = [
    {
      role: 'Software Engineer',
      company: 'Flockjay · Kathmandu, Nepal (Remote)',
      period: 'August 2026 – Present',
      summary: 'Joined Flockjay to build and scale product experiences for a global customer base, working closely with product, design, and engineering teams in a fast-paced startup environment.',
      highlights: [
        'Building and shipping production-ready features across modern frontend technologies.',
        'Collaborating with cross-functional teams to improve product quality, usability, and performance.',
        'Driving technical decisions that balance engineering quality with product outcomes.',
        'Contributing to scalable frontend architecture, developer experience, and engineering best practices.',
        'Working asynchronously with distributed teams across multiple time zones.'
      ],
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs']
    },
    {
      role: 'Software Engineer',
      company: 'GritFeat Solutions',
      period: 'May 2021 – July 2026',
      summary: 'Started as a junior engineer and grew into a senior contributor over five years, helping deliver web products from concept to production while mentoring teammates and improving engineering practices.',
      highlights: [
        'Developed and maintained modern web applications for international clients.',
        'Built reusable UI systems and scalable frontend architectures.',
        'Worked across both frontend and backend to deliver end-to-end product features.',
        'Collaborated closely with designers, product owners, and stakeholders throughout the development lifecycle.',
        'Improved application performance, accessibility, and overall user experience.',
        'Mentored junior engineers through code reviews, technical guidance, and day-to-day collaboration.',
        'Participated in hiring by reviewing resumes, conducting technical interviews, and evaluating engineering candidates.',
        'Helped shape engineering standards and development workflows within the team.'
      ],
      tech: ['React', 'Next.js', 'Vue', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'Git']
    },
    {
      role: 'UX & Full-Stack Intern',
      company: 'ITGlance',
      period: '2020',
      summary: 'Contributed to JavaScript/Java full-stack workflows for manual record digitization systems.',
      highlights: [
        'Worked across UX and full-stack development on record digitization systems.',
        'Built and supported features using JavaScript and Java.'
      ],
      tech: ['JavaScript', 'Java']
    }
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
          <div className="font-display text-4xl tracking-tight md:text-[5rem] font-semibold text-white text-center mb-16">
            Work <span className="text-[#B9FF2C]">Experience</span>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="space-y-12">
              {experiences.map((exp, i) => (
                <div key={i} className="experience-item relative pl-8 border-l border-white/10 group">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-2.5 h-2.5 -translate-x-1/2 rounded-full bg-[#B9FF2C] shadow-[0_0_10px_rgba(185,255,44,0.5)]" />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white group-hover:text-[#B9FF2C] transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-[#B9FF2C]/90 font-mono text-sm font-semibold mt-0.5">{exp.company}</p>
                    </div>
                    <span className="font-mono text-xs text-white/50 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                    {exp.summary}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {exp.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-white/60 text-xs md:text-sm">
                        <span className="text-[#B9FF2C] text-xs mt-1">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.tech.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
                        {t}
                      </span>
                    ))}
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
