import React, { useState, Suspense, lazy, useRef, useEffect } from 'react';
import { Menu, X, Bot, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import Preloader from './Preloader';
import DecryptedText from './DecryptedText';
import TerminalOverlay from './TerminalOverlay';
import DataStreamBackground from './DataStreamBackground';
import SignalGlitch from './SignalGlitch';
import { useSoundFX } from './SoundProvider';

const AIChatAssistant = lazy(() =>
  import('../AIChatAssistant').then((module) => ({ default: module.AIChatAssistant }))
);

interface HeaderProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  onOpenChat: () => void;
  isBlogPage?: boolean;
  isMuted: boolean;
  toggleMute: () => void;
}

export function Header({ menuOpen, toggleMenu, onOpenChat, isBlogPage, isMuted, toggleMute }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1100] px-6 py-5 flex justify-between items-center transition-all duration-300">
      <a href="/" className="flex items-center gap-2 group">
        <span className="font-display font-bold text-xl text-[#B9FF2C]">SB</span>
      </a>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Navigation Links */}
        <a
          href="/"
          className={`flex items-center px-[18px] py-[10px] rounded-full border transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${!isBlogPage
              ? 'bg-[#B9FF2C] text-black border-[#B9FF2C]'
              : 'text-white border-white/20 hover:bg-white/5'
            }`}
        >
          Portfolio
        </a>

        <a
          href="/blog"
          className={`flex items-center px-[18px] py-[10px] rounded-full border transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${isBlogPage
              ? 'bg-[#B9FF2C] text-black border-[#B9FF2C]'
              : 'text-white border-white/20 hover:bg-white/5'
            }`}
        >
          Blogs
        </a>


        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors bg-black/20 backdrop-blur-sm group"
        >
          {isMuted ? (
            <VolumeX size={16} className="text-white/40" />
          ) : (
            <Volume2 size={16} className="text-[#B9FF2C] animate-pulse" />
          )}
        </button>

        <button
          onClick={onOpenChat}
          aria-label="Open AI chat assistant"
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors group bg-black/20 backdrop-blur-sm"
        >
          <Bot size={16} className="text-[#B9FF2C] group-hover:rotate-12 transition-transform" />
          <span className="hidden lg:inline font-mono text-[10px] uppercase tracking-widest">Talk to AI</span>
        </button>

        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition-colors bg-black/20 backdrop-blur-sm"
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
          <span className="hidden md:inline font-mono text-xs uppercase tracking-widest">Menu</span>
        </button>
      </div>
    </header>
  );
}

export function FullScreenMenu({
  menuRef,
  closeMenu,
}: {
  menuRef: React.RefObject<HTMLDivElement | null>;
  closeMenu: () => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuItems = [
    { label: 'Home', section: 'hero', href: '/' },
    { label: 'Work', section: 'work', href: '/#work' },
    { label: 'Blogs', section: 'articles', href: '/blog' },
    { label: 'Capabilities', section: 'capabilities', href: '/#capabilities' },
    { label: 'Experience', section: 'experience', href: '/#experience' },
    { label: 'Contact', section: 'contact', href: '/#contact' },
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://np.linkedin.com/in/sumedh-bajracharya' },
    { label: 'Email', href: 'mailto:sumedhbajracharya07@gmail.com' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: any) => {
    if (window.location.pathname === '/' && item.section !== 'articles') {
      e.preventDefault();
      closeMenu();
      const element = document.getElementById(item.section);
      if (element) {
        // Use the global navigateToSection if available
        if (window.navigateToSection) {
          window.navigateToSection(item.section);
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // Regular navigation for other pages or blog link
      closeMenu();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-[1200] bg-[#050505]/95 backdrop-blur-2xl flex items-center justify-center p-6"
    >
      <div className="text-center w-full max-w-4xl">
        <nav className="mb-16">
          <ul className="space-y-4 md:space-y-8">
            {menuItems.map((item, index) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="font-display text-4xl md:text-8xl font-bold text-white hover:text-[#B9FF2C] transition-all duration-300 block hover:tracking-tighter"
                >
                  <DecryptedText text={item.label} isHovered={hoveredIndex === index} />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex justify-center gap-8 md:gap-12">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs md:text-sm uppercase tracking-widest text-white/50 hover:text-[#B9FF2C] transition-colors link-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const isReload = () => {
  if (typeof performance === 'undefined') return false;
  const navs = performance.getEntriesByType('navigation');
  return navs.length > 0 && (navs[0] as PerformanceNavigationTiming).type === 'reload';
};

export function NavigationShell({ children, isBlogPage }: { children: React.ReactNode; isBlogPage?: boolean }) {
  const { isMuted, toggleMute } = useSoundFX();
  const [menuOpen, setMenuOpen] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(() => {
    if (isReload()) {
      sessionStorage.removeItem('sumedh_chat_open');
      return false;
    }
    return sessionStorage.getItem('sumedh_chat_open') === 'true';
  });

  const [shouldLoadChat, setShouldLoadChat] = useState(() => {
    if (isReload()) {
      sessionStorage.removeItem('sumedh_chat_loaded');
      return false;
    }
    return sessionStorage.getItem('sumedh_chat_loaded') === 'true';
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('sumedh_chat_open', String(isChatOpen));
  }, [isChatOpen]);

  useEffect(() => {
    sessionStorage.setItem('sumedh_chat_loaded', String(shouldLoadChat));
  }, [shouldLoadChat]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(menuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuOpen]);

  return (
    <div className="relative bg-[#050505] min-h-screen">
      <Preloader bypassSessionStorage={true} duration={1000} />
      <TerminalOverlay />
      <DataStreamBackground />
      <SignalGlitch trigger={children} />
      {/* Global Grain Overlay */}
      <div className="grain-overlay pointer-events-none" />

      <Header
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        onOpenChat={() => {
          setShouldLoadChat(true);
          setIsChatOpen(true);
        }}
        isBlogPage={isBlogPage}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />

      {shouldLoadChat && (
        <Suspense fallback={null}>
          <AIChatAssistant isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </Suspense>
      )}

      {menuOpen && (
        <FullScreenMenu menuRef={menuRef} closeMenu={() => setMenuOpen(false)} />
      )}

      {children}
    </div>
  );
}
