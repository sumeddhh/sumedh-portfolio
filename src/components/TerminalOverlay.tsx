import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight } from 'lucide-react';
import { useSoundFX } from './SoundProvider';

interface CommandOutput {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { playSummon } = useSoundFX();
  const [history, setHistory] = useState<CommandOutput[]>([
    { type: 'system', text: 'Sumedh Portfolio OS v2.4.0 (stable)' },
    { type: 'system', text: 'Type "help" to see available commands.' }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        setIsOpen(prev => {
          if (!prev) playSummon();
          return !prev;
        });
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory: CommandOutput[] = [...history, { type: 'input', text: cmd }];

    switch (cleanCmd) {
      case 'help':
        newHistory.push({ type: 'output', text: 'Available commands:\n  ls       - List available modules (sections)\n  cd [dir] - Navigate to a section\n  clear    - Clear terminal history\n  whoami   - Display current identity\n  exit     - Close terminal modal' });
        break;
      case 'ls':
        newHistory.push({ type: 'output', text: 'home\nwork\nabout\ncapabilities\nexperience\nblog\ncontact' });
        break;
      case 'clear':
        setHistory([{ type: 'system', text: 'Terminal history wiped.' }]);
        return;
      case 'whoami':
        newHistory.push({ type: 'output', text: 'guest_user@portfolio_engine' });
        break;
      case 'exit':
        setIsOpen(false);
        break;
      default:
        if (cleanCmd.startsWith('cd ')) {
          const section = cleanCmd.replace('cd ', '');
          const validSections = ['home', 'work', 'about', 'capabilities', 'experience', 'blog', 'contact'];
          if (validSections.includes(section)) {
            newHistory.push({ type: 'system', text: `Navigating to ${section}...` });
            if (section === 'blog') {
              window.location.href = '/blog';
            } else if (section === 'home') {
              window.location.href = '/';
            } else {
              if (window.location.pathname !== '/') {
                 window.location.href = `/#${section}`;
              } else if (window.navigateToSection) {
                window.navigateToSection(section);
              }
            }
          } else {
            newHistory.push({ type: 'error', text: `Directory not found: ${section}` });
          }
        } else {
          newHistory.push({ type: 'error', text: `Command not found: ${cleanCmd}` });
        }
    }
    setHistory(newHistory);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-12">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-3xl h-[60vh] bg-[#0c0c0c] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono text-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <TerminalIcon size={14} className="text-[#B9FF2C]" />
            <span className="text-[10px] uppercase tracking-widest text-white/60">Portfolio Terminal</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 scroll-smooth">
          {history.map((line, i) => (
            <div key={i} className={`flex gap-3 ${line.type === 'error' ? 'text-red-400' : line.type === 'system' ? 'text-white/40' : line.type === 'input' ? 'text-white' : 'text-[#B9FF2C]'}`}>
              {line.type === 'input' && <ChevronRight size={14} className="mt-0.5 shrink-0" />}
              <pre className="whitespace-pre-wrap break-all">{line.text}</pre>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 pt-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) handleCommand(input);
              setInput('');
            }}
            className="flex items-center gap-2 border-t border-white/5 pt-4"
          >
            <ChevronRight size={14} className="text-[#B9FF2C] shrink-0" />
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full"
              placeholder="type help..."
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
