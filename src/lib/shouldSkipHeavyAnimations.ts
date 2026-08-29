export const shouldSkipHeavyAnimations = () =>
  window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
