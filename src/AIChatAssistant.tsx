import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, User, Minimize2, Maximize2 } from 'lucide-react';
import Groq from 'groq-sdk';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const groq = new Groq({
    apiKey: GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true
});

const MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant'
];

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUMEDH_INFO = `
You are Sumedh's AI Assistant. Always use third person (e.g., "Sumedh is...").
BIO:
- Sumedh Bajracharya, Sr. SE II @ GritFeat
- Stack: Fullstack JS, especially Next.js, NestJS, modern databases
- Impact: 60% faster AI streaming, 30% faster CI/CD, knows AWS,Azure
- Born: Kathmandu, Feb 18, 1998
- Education: Swarnim School, NCCS College, Tribhuvan Uni BIM, KLUST Malaysia MIT
- Contact: sumedhbajracharya07@gmail.com
Reply in max 2 sentences. Be direct and professional, some humor here and there. If unsure, share contact email.
`;

export function AIChatAssistant({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void
}) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [modelIndex, setModelIndex] = useState(0);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm Sumedh's Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<any>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Cleanup typing on unmount
        return () => {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading || isTyping) return;

        // Rate Limiting (Client-side)
        const STORAGE_KEY = 'chat_rate_limit';
        const LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
        const MSG_LIMIT = 20;

        const now = Date.now();
        const timestamps = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const recentTimestamps = timestamps.filter((t: number) => now - t < LIMIT_WINDOW);

        if (recentTimestamps.length >= MSG_LIMIT) {
            setMessages(prev => [
                ...prev,
                { role: 'user', content: input },
                { role: 'assistant', content: "⚠️ Rate limit exceeded. Please try again in an hour." }
            ]);
            setInput('');
            return;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify([...recentTimestamps, now]));

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const currentModel = MODELS[modelIndex];
            setModelIndex((prev) => (prev + 1) % MODELS.length);

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: SUMEDH_INFO },
                    ...messages.slice(-6).map(m => ({ role: m.role, content: m.content.slice(0, 1000) })), // Limit history tokens
                    { role: 'user', content: input.slice(0, 500) } // Limit current input
                ],
                model: currentModel,
                max_tokens: 120,    // Force brevity (approx 3-4 sentences max)
                temperature: 0.6,   // More focused/efficient responses
            });

            const fullContent = completion.choices[0]?.message?.content || "Connection lost.";

            setIsLoading(false);
            setIsTyping(true);

            // Add empty assistant message first
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            let charIndex = 0;

            const typeNextChar = () => {
                if (charIndex < fullContent.length) {
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        // Ensure we are updating the last assistant message
                        if (lastMsg && lastMsg.role === 'assistant') {
                            lastMsg.content = fullContent.slice(0, charIndex + 1);
                        }
                        return newMessages;
                    });
                    charIndex++;
                    // Random delay between 10ms and 30ms for natural feel
                    typingTimeoutRef.current = setTimeout(typeNextChar, 10 + Math.random() * 20);
                } else {
                    setIsTyping(false);
                    typingTimeoutRef.current = null;
                }
            };

            typeNextChar();

        } catch (error) {
            console.error("Groq Error:", error);
            setIsLoading(false);
            setMessages(prev => [...prev, { role: 'assistant', content: "Brain fried. Try later or email Sumedh." }]);
        }
    };

    return (
        <>
            {/* Toggle Button - Hidden when open */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-24 right-6 z-[1000] w-14 h-14 rounded-full bg-[#B9FF2C] text-black shadow-[0_0_20px_rgba(185,255,44,0.4)] flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}`}
                title="Chat with AI"
            >
                <Bot size={28} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            x: 0,
                            height: isMinimized ? '80px' : 'min(82vh, 600px)',
                            width: 'min(90vw, 400px)'
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="fixed bottom-6 right-6 z-[2000] overflow-hidden"
                    >
                        <div className="w-full h-full flex flex-col bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl relative">
                            {/* Animated Background Subtle Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#B9FF2C]/5 to-transparent pointer-events-none" />

                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10 w-full relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#B9FF2C] flex items-center justify-center text-black shadow-[0_0_15px_rgba(185,255,44,0.3)]">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-white leading-none">Sumedh's Assistant</h3>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <span className="w-1.5 h-1.5 bg-[#B9FF2C] rounded-full animate-pulse shadow-[0_0_5px_#B9FF2C]" />
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Online</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setIsMinimized(!isMinimized)}
                                        className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors"
                                        title={isMinimized ? "Maximize" : "Minimize"}
                                    >
                                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-full text-white/60 transition-colors"
                                        title="Close"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            {!isMinimized && (
                                <>
                                    <div
                                        ref={scrollRef}
                                        data-lenis-prevent
                                        className="flex-1 overflow-y-auto p-4 space-y-5 font-sans relative z-10 scrollbar-thin scrollbar-thumb-white/10"
                                    >
                                        {messages.map((msg, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                key={i}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[85%] flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#B9FF2C] text-black'}`}>
                                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                                    </div>
                                                    <div className={`p-3.5 rounded-2xl text-[13.5px] leading-[1.6] shadow-sm ${msg.role === 'user' ? 'bg-[#B9FF2C]/10 text-white border border-[#B9FF2C]/20 rounded-tr-none' : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="w-7 h-7 rounded-full bg-[#B9FF2C] text-black flex items-center justify-center shrink-0">
                                                        <Bot size={14} />
                                                    </div>
                                                    <div className="bg-white/5 text-white/90 p-3.5 rounded-2xl rounded-tl-none border border-white/10">
                                                        <div className="flex gap-1">
                                                            <span className="w-1.5 h-1.5 bg-[#B9FF2C]/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                            <span className="w-1.5 h-1.5 bg-[#B9FF2C]/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                            <span className="w-1.5 h-1.5 bg-[#B9FF2C]/50 rounded-full animate-bounce" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input */}
                                    <div className="p-4 bg-black/40 border-t border-white/10 w-full relative z-10">
                                        <div className="relative flex items-center">
                                            <input
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                placeholder="Ask a question..."
                                                className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 px-6 pr-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#B9FF2C]/50 focus:bg-white/[0.08] transition-all"
                                            />
                                            <button
                                                onClick={handleSend}
                                                disabled={isLoading || !input.trim()}
                                                className="absolute right-2 p-2.5 bg-[#B9FF2C] text-black rounded-full disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-[0_0_10px_rgba(185,255,44,0.4)]"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 mt-4">
                                            <span className="w-8 h-px bg-white/10" />
                                            <p className="text-[9px] text-white/20 font-mono uppercase tracking-[0.25em]">
                                                Groq AI Engine
                                            </p>
                                            <span className="w-8 h-px bg-white/10" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
