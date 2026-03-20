import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  PersonStanding,
  Share2,
  ThumbsUp,
  ShieldAlert,
  Terminal,
  Brain,
  Cpu,
} from 'lucide-react';

export default function AiGuardrailsFrontend() {
  const [liked, setLiked] = useState(false);
  const [likePop, setLikePop] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const guardrailPoints = [
    {
      index: '01',
      title: 'Prompt Sanitization',
      body: 'Never send raw user input to an LLM without structural validation and sanitization. Sanitize inputs to remove potentially malicious system instruction injection attempts.',
      icon: <Terminal size={20} className="text-[#b2f722]" />
    },
    {
      index: '02',
      title: 'Response Validation',
      body: 'Implement client-side schemas (e.g., Zod) to validate LLM responses before rendering. LLMs are non-deterministic; the frontend must enforce deterministic UI states.',
      icon: <Brain size={20} className="text-[#b2f722]" />
    },
    {
      index: '03',
      title: 'Contextual Sandboxing',
      body: 'Execute LLM-generated code or suggestions in restricted, sandboxed environments. Use Shadow DOM or iframe isolation for UI elements rendered from AI outputs.',
      icon: <Cpu size={20} className="text-[#b2f722]" />
    },
  ];

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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(178,247,34,0.15),transparent_60%)]" />
            <div className="relative mx-auto max-w-4xl">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#b2f722]">AI & Security</span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.03] tracking-tight md:text-6xl">
                AI Guardrails on Frontend: Securing the Client Layer
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-xl">
                How to sanitize inputs and place critical guardrails on the application client layer for safer AI interactions.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[10px] font-mono uppercase tracking-[0.16em] text-white/55">
                <span className="inline-flex items-center gap-2">
                  <PersonStanding size={12} />
                  Sumedh Bajracharya
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={12} />
                  8 Min Read
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={12} />
                  March 21, 2026
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
                <a href="#intro" className="flex items-center gap-3 text-[#b2f722]">
                  <span className="h-px w-8 bg-[#b2f722]" />
                  <span>Introduction</span>
                </a>
                <a href="#sanitization" className="flex items-center gap-3 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-4 bg-white/30" />
                  <span>Input Sanitization</span>
                </a>
                <a href="#validation" className="flex items-center gap-3 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-4 bg-white/30" />
                  <span>Response Validation</span>
                </a>
                <a href="#sandboxing" className="flex items-center gap-3 text-white/55 transition-colors hover:text-white">
                  <span className="h-px w-4 bg-white/30" />
                  <span>Client-Side Security</span>
                </a>
              </nav>
            </div>
          </aside>

          <article className="col-span-12 space-y-14 lg:col-span-7">
            <section id="intro" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">I. The Vulnerable Client Layer</h2>
              <p className="text-lg leading-8 text-white/75">
                As Large Language Models (LLMs) become deeply integrated into web applications, the frontend is no longer just a passive display layer. It is now the primary interface for prompt engineering and AI-driven workflows. This shift introduces a new class of security risks: prompt injection, data poisoning, and non-deterministic UI behavior.
              </p>
              <p className="text-lg leading-8 text-white/75">
                While much of AI security focus is on the backend orchestration, the "Last Mile" of AI—the frontend—is often where the most critical user interactions and data visualizations occur. Securing this layer requires a multi-faceted approach involving sanitization, validation, and isolation.
              </p>
              <blockquote className="border-l-4 border-[#b2f722] bg-white/[0.03] px-8 py-9">
                <p className="font-display text-3xl italic leading-tight text-white">
                  "In the age of AI, the frontend must act as the primary immune system of the application, filtering both what goes in and what comes out."
                </p>
              </blockquote>
            </section>

            <section id="sanitization" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">II. Effective Input Guardrails</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/[0.03] p-6 col-span-2">
                   <div className="flex items-center gap-4 mb-4 text-[#b2f722]">
                     <ShieldAlert size={24} />
                     <h3 className="font-display text-2xl font-semibold">Prompt Injection Defense</h3>
                   </div>
                   <p className="text-white/70 leading-relaxed">
                     Modern frontend applications must implement pattern recognition to detect common prompt injection patterns—such as "Ignore previous instructions"—and block them before they reach the inference engine. This reduces the attack surface and prevents unauthorized system override.
                   </p>
                </div>
              </div>
            </section>

            <section id="validation" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">III. The Three Pillars of Client-Side AI Security</h2>
              <div className="space-y-7 pt-2">
                {guardrailPoints.map((item) => (
                  <div key={item.title} className="flex gap-5">
                    <span className="font-display text-3xl font-bold text-[#b2f722]">{item.index}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {item.icon}
                        <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-white/70 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="sandboxing" className="space-y-6">
              <h2 className="font-display text-4xl font-bold tracking-tight">IV. Deterministic UI in a Non-Deterministic World</h2>
              <div className="rounded-xl border border-white/10 bg-[#111111] p-8">
                <p className="text-lg italic leading-8 text-white/75">
                  "The biggest challenge for frontend engineers today is maintaining a predictable user experience when the underlying data source is probabilistic. Guardrails are the bridge between AI's variance and the UI's need for stability."
                </p>
                <div className="mt-8 p-6 rounded-lg border border-[#b2f722]/10 bg-[#b2f722]/5">
                   <h4 className="font-mono text-xs uppercase tracking-widest text-[#b2f722] mb-3">Implementation Tip</h4>
                   <p className="text-sm text-white/80">
                     Always use a Fallback UI strategy. If an LLM response fails validation (e.g., malformed JSON or invalid schema), provide a graceful degradation path rather than breaking the application state.
                   </p>
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

        <section className="mx-auto mt-28 w-full max-w-[1200px] px-6 text-center md:px-8">
          <h2 className="font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
            Let&apos;s build 
            <br />
            <span className="text-[#b2f722]">something precise.</span>
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
            <a
              href="/#contact"
              className="btn-primary inline-flex items-center justify-center gap-2 rounded-full"
            >
              Contact Me
            </a>
            <a
              href="/blog"
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-full"
            >
              Back to Blog
            </a>
          </div>
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
