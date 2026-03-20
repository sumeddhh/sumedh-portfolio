import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  Linkedin,
  Mail,
  PersonStanding,
  Share2,
  ThumbsUp,
} from 'lucide-react';

const stackCards = [
  {
    tag: 'FRONT-END DOMINANCE',
    title: 'React & Next.js',
    body: 'Still the strongest pair for high-performance, SEO-aware products in the Nepal market.',
  },
  {
    tag: 'ROBUST BACK-END',
    title: 'Node.js & Go',
    body: 'Used widely for microservices, API throughput, and data-heavy systems for global clients.',
  },
  {
    tag: 'MOBILE EXCELLENCE',
    title: 'Flutter & React Native',
    body: 'Cross-platform velocity remains key for startups validating products rapidly.',
  },
  {
    tag: 'DATA & CLOUD',
    title: 'AWS & PostgreSQL',
    body: 'Modern local teams are production-ready with cloud-native pipelines and relational depth.',
  },
];

const hiringPoints = [
  {
    index: '01',
    title: 'Architectural Thinking',
    body: 'Strong engineers justify tradeoffs clearly, not just syntax choices.',
  },
  {
    index: '02',
    title: 'Communication & Ownership',
    body: 'Remote-first delivery requires proactive updates and accountable execution.',
  },
  {
    index: '03',
    title: 'Adaptability',
    body: 'Top performers shift comfortably between product UX, code, infra, and deployment.',
  },
];

export default function SoftwareDevelopmentNepalPage() {
  const [liked, setLiked] = useState(false);
  const [likePop, setLikePop] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Software Development in Nepal: Trends, Skills, and What Businesses Should Look For';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikePop(true);
    window.setTimeout(() => setLikePop(false), 180);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast('Link copied');
    } catch {
      setToast('Could not copy link');
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />


      <main className="relative z-10 pb-20 pt-10 md:pt-14">
        <header className="mx-auto mb-20 w-full max-w-[1500px] px-6 md:px-8">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111111] px-6 py-14 text-center md:px-10 md:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(178,247,34,0.26),transparent_60%)]" />
            <div className="relative mx-auto max-w-4xl">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#b2f722]">Editorial Insight</span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.03] tracking-tight md:text-6xl">
                Software Development in Nepal: Trends, Skills, and What Businesses Should Look For
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-xl">
                The evolving landscape of the technology ecosystem in Nepal.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[10px] font-mono uppercase tracking-[0.16em] text-white/55">
                <span className="inline-flex items-center gap-2">
                  <PersonStanding size={12} />
                  Sumedh Bajracharya
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={12} />
                  12 Min Read
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={12} />
                  October 24, 2024
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-12 gap-8 px-6 md:px-8 lg:gap-10">
          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Contents</p>
              <nav className="space-y-4 text-[11px] font-mono uppercase tracking-[0.14em]">
                <a href="#overview" className="flex items-center gap-3 text-[#b2f722]">
                  <span className="h-px w-8 bg-[#b2f722]" />
                  <span>Overview</span>
                </a>
                <a href="#stacks" className="flex items-center gap-3 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-4 bg-white/30" />
                  <span>Tech Stacks</span>
                </a>
                <a href="#hiring" className="flex items-center gap-3 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-4 bg-white/30" />
                  <span>Hiring Blueprint</span>
                </a>
                <a href="#trends" className="flex items-center gap-3 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-4 bg-white/30" />
                  <span>SaaS & AI</span>
                </a>
              </nav>
            </div>
          </aside>

          <article className="col-span-12 space-y-14 lg:col-span-7">
            <section id="overview" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">I. Overview of Development in Nepal</h2>
              <p className="text-lg leading-8 text-white/75">
                Nepal has moved beyond low-complexity outsourcing into product-grade engineering execution. Over the
                last decade, teams have evolved from routine maintenance to cloud architecture, scalable platforms, and
                globally distributed delivery.
              </p>
              <p className="text-lg leading-8 text-white/75">
                The shift is powered by younger engineers, stronger remote collaboration habits, and a market that
                increasingly values product thinking. Kathmandu now offers a resilient blend of cost efficiency and
                execution quality for modern software delivery.
              </p>
              <blockquote className="border-l-4 border-[#b2f722] bg-white/[0.03] px-8 py-9">
                <p className="font-display text-3xl italic leading-tight text-white">
                  "Nepal isn&apos;t just catching up to the global tech race; it&apos;s defining a hybrid of engineering
                  resilience and cultural agility."
                </p>
              </blockquote>
            </section>

            <section id="stacks" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">II. Modern Technology Stacks</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {stackCards.map((card) => (
                  <div key={card.title} className="rounded-md border border-white/10 bg-white/[0.03] p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#b2f722]">{card.tag}</p>
                    <h3 className="mt-4 font-display text-2xl font-semibold">{card.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/70">{card.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="hiring" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">III. What Businesses Should Look For</h2>
              <p className="text-lg leading-8 text-white/75">
                Strong hiring in Nepal is less about checking framework lists and more about identifying engineers who
                can drive outcomes. Product mindset, communication, and adaptability remain stronger predictors of
                long-term delivery quality than narrow technical depth alone.
              </p>
              <div className="space-y-7 pt-2">
                {hiringPoints.map((item) => (
                  <div key={item.title} className="flex gap-5">
                    <span className="font-display text-3xl font-bold text-[#b2f722]">{item.index}</span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                      <p className="mt-1.5 text-white/70">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="trends" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">IV. Trends in SaaS and AI</h2>
              <div className="rounded-xl border border-white/10 bg-[#111111] p-8">
                <p className="text-lg italic leading-8 text-white/75">
                  "Generative AI is now an execution layer, not just a novelty. Teams in Nepal increasingly use
                  AI-assisted workflows for acceleration while focusing human effort on architecture and product
                  reasoning."
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b2f722]">Trend Alpha</p>
                    <p className="mt-2 font-display text-xl font-semibold">AI-Driven Automation</p>
                  </div>
                  <div className="rounded border border-white/10 bg-white/[0.03] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b2f722]">Trend Beta</p>
                    <p className="mt-2 font-display text-xl font-semibold">Niche SaaS Verticals</p>
                  </div>
                </div>
              </div>
            </section>
          </article>

          <aside className="col-span-12 hidden lg:col-span-2 lg:block">
            <div className="sticky top-28 flex flex-col gap-4">
              <button
                aria-label="Like article"
                onClick={handleLike}
                className={`w-fit rounded-full border border-white/20 p-3 transition-all duration-150 hover:bg-white/10 ${
                  liked ? 'text-[#b2f722]' : 'text-white/70'
                } ${likePop ? 'scale-125' : 'scale-100'}`}
              >
                <ThumbsUp size={16} />
              </button>
              <button
                aria-label="Share article"
                onClick={handleShare}
                className="w-fit rounded-full border border-white/20 p-3 text-white/70 transition hover:bg-white/10"
              >
                <Share2 size={16} />
              </button>
            </div>
          </aside>
        </div>

        <section className="mx-auto mt-20 flex w-full max-w-[1500px] px-6 md:px-8 lg:hidden">
          <div className="flex gap-3">
            <button
              aria-label="Like article"
              onClick={handleLike}
              className={`rounded-full border border-white/20 p-3 transition-all duration-150 ${
                liked ? 'text-[#b2f722]' : 'text-white/70'
              } ${likePop ? 'scale-125' : 'scale-100'}`}
            >
              <ThumbsUp size={16} />
            </button>
            <button
              aria-label="Share article"
              onClick={handleShare}
              className="rounded-full border border-white/20 p-3 text-white/70 transition hover:bg-white/10"
            >
              <Share2 size={16} />
            </button>
          </div>
        </section>

        <section className="mx-auto mt-28 w-full max-w-[1200px] px-6 text-center md:px-8">
          <h2 className="font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
            Let&apos;s build something
            <br />
            <span className="text-[#b2f722]">precise.</span>
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
            <a
              href="/#contact"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full"
            >
              Contact Me
            </a>
            <a
              href="/#work"
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full"
            >
              View Portfolio
            </a>
          </div>
          <div className="mt-16 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-8 text-white/75 md:flex-row md:gap-8">
            <a href="mailto:sumedhbajracharya07@gmail.com" className="inline-flex items-center gap-2 hover:text-[#b2f722]">
              <Mail size={16} />
              <span className="font-mono text-xs">sumedhbajracharya07@gmail.com</span>
            </a>
            <a
              href="https://np.linkedin.com/in/sumedh-bajracharya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-[#b2f722]"
            >
              <Linkedin size={16} />
              <span className="font-mono text-xs">LinkedIn</span>
            </a>
          </div>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-white/40">
            © Sumedh Bajracharya — {new Date().getFullYear()}
          </p>
        </section>
      </main>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-md border border-white/20 bg-black/85 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[#b2f722] shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
