import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    navigateToSection?: (sectionId: string) => void;
  }
}

export function useSectionNavigation() {
  useEffect(() => {
    window.navigateToSection = (sectionId: string) => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        const element = document.querySelector(`#${sectionId}`);
        if (!element) return;

        let targetScroll = 0;
        let foundPinnedTrigger = false;
        const allTriggers = ScrollTrigger.getAll();

        for (const trigger of allTriggers) {
          if (trigger.vars.pin && trigger.trigger && (trigger.trigger as Element).id === sectionId) {
            targetScroll = trigger.start;
            foundPinnedTrigger = true;
            break;
          }
        }

        if (!foundPinnedTrigger) {
          let pinnedOffset = 0;

          allTriggers.forEach((trigger) => {
            if (trigger.vars.pin && trigger.trigger) {
              const triggerId = (trigger.trigger as Element).id;
              const triggerElement = document.querySelector(`#${triggerId}`);
              const currentElement = document.querySelector(`#${sectionId}`);

              if (
                triggerElement &&
                currentElement &&
                triggerElement.getBoundingClientRect().top < currentElement.getBoundingClientRect().top
              ) {
                pinnedOffset += trigger.end - trigger.start;
              }
            }
          });

          targetScroll = (element as HTMLElement).offsetTop - pinnedOffset;
        }

        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      });
    };

    document.title = 'Sumedh Bajracharya | Portfolio | Frontend Engineer in Nepal';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Portfolio of Sumedh Bajracharya, a frontend and software engineer in Nepal focused on React, TypeScript, AI, and high-performance product engineering.'
      );

    return () => {
      delete window.navigateToSection;
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);
}
