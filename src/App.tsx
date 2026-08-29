import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import ProgressIndicator from './components/ProgressIndicator';
import { useSectionNavigation } from './hooks/useSectionNavigation';
import AboutSection from './sections/AboutSection';
import CapabilitiesSection from './sections/CapabilitiesSection';
import ContactSection from './sections/ContactSection';
import ExperienceSection from './sections/ExperienceSection';
import HeroSection from './sections/HeroSection';
import SelectedWorkSection from './sections/SelectedWorkSection';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const [toast, setToast] = useState('');

  useSectionNavigation();

  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(() => setToast(''), 3000);
    return () => window.clearTimeout(handle);
  }, [toast]);

  return (
    <div className="relative bg-[#050505] min-h-screen">
      <div className="grain-overlay" />

      <main className="relative">
        <HeroSection />
        <AboutSection />
        <SelectedWorkSection />
        <CapabilitiesSection />
        <ExperienceSection />
        <ContactSection setToast={setToast} />
      </main>

      <ProgressIndicator />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] rounded-md border border-white/20 bg-black/85 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[#B9FF2C] shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
