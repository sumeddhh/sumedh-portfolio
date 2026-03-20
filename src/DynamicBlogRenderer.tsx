
import { useEffect, useState, useMemo } from 'react';
import Markdown from 'markdown-to-jsx';
import { CalendarDays, Clock3, PersonStanding, ThumbsUp, Share2 } from 'lucide-react';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  date: string;
  category: string;
  read_time: string;
  image?: string;
}

export default function DynamicBlogRenderer({ post }: { post: BlogPost }) {
  const [activeHeading, setActiveHeading] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrollY / height) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${post.title} | Blogs`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0% -70% 0%' }
    );

    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [post]);

  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(() => setToast(''), 2000);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const toc = useMemo(() => {
    const headings = post.content.match(/^#{2}\s+(.+)$/gm) || [];
    return headings.map((h, i) => {
      const text = h.replace(/^#{2}\s+/, '');
      return {
        text,
        id: `section-${i}`,
      };
    });
  }, [post.content]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToast('Link copied to clipboard');
    } catch {
      setToast('Could not copy link');
    }
  };

  const mdOptions = {
    overrides: {
      h2: {
        props: {
          className: 'font-display text-4xl font-bold tracking-tight mb-8 mt-16 scroll-mt-32 text-white',
        },
        component: ({ children, ...props }: any) => {
          const content = post.content;
          const headings = content.match(/^#{2}\s+(.+)$/gm) || [];
          const text = typeof children === 'string' ? children : '';
          const index = headings.findIndex(h => h.includes(text));
          const id = index !== -1 ? `section-${index}` : '';
          return (
            <section id={id} className="scroll-mt-32">
              <h2 {...props}>{children}</h2>
            </section>
          );
        }
      },
      p: {
        props: {
          className: 'text-lg leading-8 text-white/75 mb-6',
        }
      },
      blockquote: {
        props: {
          className: 'border-l-4 border-[#b2f722] bg-white/[0.03] px-8 py-9 my-12 font-display text-3xl italic leading-tight text-white',
        }
      },
      ul: {
        props: {
          className: 'space-y-4 mb-8 list-none ml-2',
        }
      },
      li: {
        component: ({ children }: any) => (
          <li className="flex gap-4 text-white/75 text-lg leading-8">
            <span className="h-px w-4 bg-[#b2f722]/40 mt-4 shrink-0" />
            <div>{children}</div>
          </li>
        )
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/5 z-[9999]">
        <div 
          className="h-full bg-[#B9FF2C] transition-all duration-150 ease-out leading-none"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="min-h-screen bg-[#0c0c0c] text-white">
        {/* Grain Overlay */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        <main className="relative z-10 pb-20 pt-10 md:pt-14">
          {/* Header Section - Identical to Static Blog */}
          <header className="mx-auto mb-20 w-full max-w-[1500px] px-6 md:px-8">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#111111] px-6 py-14 text-center md:px-10 md:py-20">
            {post.image && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.07] mix-blend-overlay"
                style={{ backgroundImage: `url(${post.image})` }}
              />
            )}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(178,247,34,0.15),transparent_60%)]" />
            <div className="relative mx-auto max-w-4xl">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#b2f722]">{post.category}</span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.03] tracking-tight md:text-6xl text-white">
                {post.title}
              </h1>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[10px] font-mono uppercase tracking-[0.16em] text-white/55">
                <span className="inline-flex items-center gap-2">
                  <PersonStanding size={12} />
                  Sumedh Bajracharya
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={12} />
                  {post.read_time}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={12} />
                  {post.date}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-12 gap-8 px-6 md:px-8 lg:gap-10">
          {/* TOC Sidebar - 1:1 with Static */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Contents</p>
              <nav className="space-y-4 text-[11px] font-mono uppercase tracking-[0.14em]">
                {toc.map((item) => {
                  const isActive = activeHeading === item.id;
                  return (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className={`flex items-center gap-3 transition-all duration-300 ${isActive ? 'text-[#b2f722]' : 'text-white/55 hover:text-white'}`}
                    >
                      <span className={`h-px transition-all duration-300 ${isActive ? 'w-8 bg-[#b2f722]' : 'w-4 bg-white/30'}`} />
                      <span>{item.text}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Article - Matching Static col-span-7 */}
          <article className="col-span-12 space-y-14 lg:col-span-7">
            <Markdown options={mdOptions}>{post.content}</Markdown>
          </article>

          {/* Interaction aside - Matching Static col-span-2 */}
          <aside className="col-span-12 hidden lg:col-span-2 lg:block">
            <div className="sticky top-28 flex flex-col gap-4">
              <button
                aria-label="Like article"
                onClick={() => setLiked(!liked)}
                className={`w-fit rounded-full border border-white/20 p-3 transition-all duration-150 hover:bg-white/10 ${
                  liked ? 'text-[#b2f722] border-[#b2f722]/40 bg-[#b2f722]/5' : 'text-white/70'
                }`}
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

        {/* Footer Build component - Shared aesthetics */}
        <section className="mx-auto mt-28 w-full max-w-[1200px] px-6 text-center md:px-8">
          <h2 className="font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
            Let&apos;s build 
            <br />
            <span className="text-[#b2f722]">something precise.</span>
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 md:flex-row">
            <a
              href="/#contact"
              className="px-8 py-3 rounded-full bg-[#b2f722] text-black font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(178,247,34,0.2)]"
            >
              Contact Me
            </a>
            <a
              href="/blog"
              className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              Back to Blog
            </a>
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-md border border-white/20 bg-black/85 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[#b2f722] shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
    </>
  );
}
