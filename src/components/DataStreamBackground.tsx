import { useEffect, useRef } from 'react';

export default function DataStreamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 32); 
    const drops: number[] = new Array(columns).fill(0);
    const characters = '01'; // Binary stream is more subtle and high-tech

    const draw = () => {
      // Very faint trail
      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Binary drops
      ctx.fillStyle = '#B9FF2C';
      ctx.font = '10px monospace';

      for (let i = 0; i < drops.length; i++) {
        // Randomly skip to make it non-uniform
        if (Math.random() > 0.95) {
          const text = characters[Math.floor(Math.random() * characters.length)];
          const x = i * 32;
          const y = drops[i] * 32;

          // Varying opacity for depth
          ctx.globalAlpha = Math.random() * 0.15;
          ctx.fillText(text, x, y);
          
          drops[i]++;

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    let frame: number;
    const animate = () => {
      draw();
      frame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const newCols = Math.floor(width / 32);
      drops.length = newCols;
      if (drops.length < newCols) {
        for (let i = drops.length; i < newCols; i++) drops[i] = 0;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.4]"
    />
  );
}
