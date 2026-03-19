import { useEffect } from 'react';
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Clock3,
  Menu,
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

const relatedArticles = [
  {
    title: 'The Future of Digital Payments in Southeast Asia',
    image: '/project_healthcare_ai.jpg',
  },
  {
    title: 'Mastering Cloud-Native Architectures',
    image: '/project_team_collab.jpg',
  },
  {
    title: 'Clean Code: Engineering Beyond the Syntax',
    image: '/project_marketing_engine.png',
  },
];

export default function SoftwareDevelopmentNepalPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Software Development in Nepal: Trends, Skills, and What Businesses Should Look For';
    return () => {
      document.title = previousTitle;
    };
  }, []);

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

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0c0c]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-6 py-5 md:px-8">
          <a href="/" className="font-display text-base font-bold uppercase tracking-wider">
            The Neon Monolith
          </a>
          <div className="hidden items-center gap-8 text-[11px] font-mono uppercase tracking-[0.2em] md:flex">
            <a className="text-white/55 transition-colors hover:text-white" href="/#work">
              Portfolio
            </a>
            <span className="border-b border-[#b2f722] pb-1 text-[#b2f722]">Articles</span>
            <a className="text-white/55 transition-colors hover:text-white" href="/#contact">
              Contact
            </a>
          </div>
          <button aria-label="Open menu" className="rounded-md border border-white/20 p-2 text-white/75">
            <Menu size={16} />
          </button>
        </div>
      </nav>

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
              <button aria-label="Like article" className="w-fit rounded-full border border-white/20 p-3 text-white/70 hover:bg-white/10">
                <ThumbsUp size={16} />
              </button>
              <button aria-label="Share article" className="w-fit rounded-full border border-white/20 p-3 text-white/70 hover:bg-white/10">
                <Share2 size={16} />
              </button>
              <button aria-label="Save article" className="w-fit rounded-full border border-white/20 p-3 text-white/70 hover:bg-white/10">
                <Bookmark size={16} />
              </button>
            </div>
          </aside>
        </div>

        <section className="mx-auto mt-24 w-full max-w-[1500px] px-6 md:px-8">
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">More from the Monolith</p>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((post) => (
              <article key={post.title} className="group cursor-pointer">
                <div className="aspect-[16/10] overflow-hidden rounded-md border border-white/10 bg-white/[0.02]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold transition-colors group-hover:text-[#b2f722]">
                  {post.title}
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-28 w-full max-w-[900px] px-6 text-center md:px-8">
          <h2 className="font-display text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">
            LET&apos;S BUILD <span className="text-[#b2f722]">SOMETHING PRECISE.</span>
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-sm bg-[#b2f722] px-8 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:brightness-95"
            >
              Contact Me
              <ArrowRight size={14} />
            </a>
            <a
              href="/#work"
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-8 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/5"
            >
              View Portfolio
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
