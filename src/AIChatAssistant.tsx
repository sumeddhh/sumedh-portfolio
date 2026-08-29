import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, User, Minimize2, Maximize2 } from 'lucide-react';
import GlassSurface from './GlassSurface';

const MODELS = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'groq/compound',
    'groq/compound-mini',
    'qwen/qwen3.8-27b',
    'qwen/qwen3.6-27b'
];

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatApiResponse {
    reply?: string;
    error?: string;
}

async function requestAssistantReply(input: string, messages: Message[], model: string) {
    const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input,
            model,
            messages
        })
    });

    const data = (await response.json()) as ChatApiResponse;
    if (!response.ok) {
        throw new Error(data.error || 'Failed to get assistant response');
    }

    return data.reply || '';
}

const isReload = () => {
    if (typeof performance === 'undefined') return false;
    const navs = performance.getEntriesByType('navigation');
    return navs.length > 0 && (navs[0] as PerformanceNavigationTiming).type === 'reload';
};

export function AIChatAssistant({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void
}) {
    const [isMinimized, setIsMinimized] = useState(() => {
        if (isReload()) {
            sessionStorage.removeItem('sumedh_chat_minimized');
            return false;
        }
        return sessionStorage.getItem('sumedh_chat_minimized') === 'true';
    });
    const [modelIndex, setModelIndex] = useState(0);
    const [messages, setMessages] = useState<Message[]>(() => {
        if (isReload()) {
            sessionStorage.removeItem('sumedh_chat_messages');
            return [{ role: 'assistant', content: "Hi! I'm Sumedh's Assistant. How can I help you today?" }];
        }
        const saved = sessionStorage.getItem('sumedh_chat_messages');
        if (!saved) {
            return [{ role: 'assistant', content: "Hi! I'm Sumedh's Assistant. How can I help you today?" }];
        }
        try {
            return JSON.parse(saved) as Message[];
        } catch {
            return [{ role: 'assistant', content: "Hi! I'm Sumedh's Assistant. How can I help you today?" }];
        }
    });

    useEffect(() => {
        sessionStorage.setItem('sumedh_chat_minimized', String(isMinimized));
    }, [isMinimized]);

    useEffect(() => {
        sessionStorage.setItem('sumedh_chat_messages', JSON.stringify(messages));
    }, [messages]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [loadingText, setLoadingText] = useState("Thinking...");

    useEffect(() => {
        if (!isLoading) return;
        const texts = ["Thinking...", "Checking my local nodes...", "Accessing memory banks...", "Connecting to Sumedh's brain...", "Drafting witty reply..."];
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % texts.length;
            setLoadingText(texts[i]);
        }, 1500);
        return () => clearInterval(interval);
    }, [isLoading]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || isTyping) return;
        const userInput = input.trim();

        const rejectInput = (reason: string) => {
            setMessages(prev => [
                ...prev,
                { role: 'user', content: userInput },
                { role: 'assistant', content: reason || "Input blocked by security protocols." }
            ]);
            setInput('');
        };

        // 1. Length Guardrail (Max 500 chars)
        if (userInput.length > 500) {
            return rejectInput("I'm built for concise queries. Please keep your input under 500 characters.");
        }

        // 2. Jailbreak / DAN Guardrails
        const jailbreakPatterns = [
            /ignore (all )?previous (instructions|prompts)/i,
            /forget (all )?previous/i,
            /system prompt/i,
            /do anything now/i,
            /\bdan\b/i,
            /developer mode/i,
            /jailbreak/i,
            /override (your )?instructions/i
        ];
        if (jailbreakPatterns.some(pattern => pattern.test(userInput))) {
            return rejectInput("I am configured strictly as Sumedh's professional assistant. I cannot override my core instructions, bypass filters, or adopt alternative personas.");
        }

        // 3. SQLi / XSS Sanitization Guardrails
        const sqliXssPatterns = [
            /<script/i,
            /javascript:/i,
            /drop\s+table/i,
            /select\s+.*\s+from/i,
            /delete\s+from/i,
            /insert\s+into/i,
            /union\s+select/i,
            /1\s*=\s*1/i
        ];
        if (sqliXssPatterns.some(pattern => pattern.test(userInput))) {
            return rejectInput("Input rejected. Security guardrails detected potential unauthorized code, scripting, or query injection patterns.");
        }

        // Obfuscated Rate Limiting: 15/hr, 60/daily
        const STORAGE_KEY = '_sys_tokens_ref';
        const HR_WINDOW = 60 * 60 * 1000;
        const DAY_WINDOW = 24 * 60 * 60 * 1000;
        const HR_LIMIT = 15;
        const DAY_LIMIT = 60;

        const now = Date.now();
        const rawData = localStorage.getItem(STORAGE_KEY);
        let timestamps: number[] = [];

        if (rawData) {
            try {
                timestamps = JSON.parse(rawData);
            } catch {
                timestamps = [];
            }
        }

        const hourlyMsgs = timestamps.filter((t: number) => now - t < HR_WINDOW);
        const dailyMsgs = timestamps.filter((t: number) => now - t < DAY_WINDOW);

        if (hourlyMsgs.length >= HR_LIMIT || dailyMsgs.length >= DAY_LIMIT) {
            const isDayLimit = dailyMsgs.length >= DAY_LIMIT;
            setMessages(prev => [
                ...prev,
                { role: 'user', content: userInput },
                {
                    role: 'assistant',
                    content: isDayLimit
                        ? "The assistant has reached its daily processing limit. Please come back tomorrow or email Sumedh for inquiries."
                        : "You're chatting quite fast! Let's take a short break for an hour before continuing our conversation."
                }
            ]);
            setInput('');
            return;
        }

        const nextTimestamps = [...dailyMsgs, now];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTimestamps));

        const userMsg: Message = { role: 'user', content: userInput };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const currentModel = MODELS[modelIndex];
        setModelIndex((prev) => (prev + 1) % MODELS.length);

        // Smart Context Pruning: Character-based budget
        const MAX_CONTEXT_CHARS = 3500;
        let runningChars = 0;
        const prunedHistory: Message[] = [];

        // Traverse backwards to keep most recent context
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (runningChars + msg.content.length > MAX_CONTEXT_CHARS) break;
            prunedHistory.unshift({ role: msg.role, content: msg.content });
            runningChars += msg.content.length;
        }

        const typeDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

        try {
            const responseText = await requestAssistantReply(userInput, prunedHistory, currentModel);
            const fullResponse = responseText.trim() || "I couldn't generate a response right now.";

            setIsLoading(false);
            setIsTyping(true);
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            let typedResponse = '';
            for (const char of fullResponse) {
                typedResponse += char;
                setMessages(prev => {
                    const newMsgs = [...prev];
                    if (newMsgs[newMsgs.length - 1]) {
                        newMsgs[newMsgs.length - 1].content = typedResponse;
                    }
                    return newMsgs;
                });
                await typeDelay(8 + Math.random() * 10);
            }
        } catch (error) {
            console.error('Assistant request error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Brain fried. Try later or email Sumedh." }]);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
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
                            height: isMinimized ? '80px' : 'min(82dvh, 600px)',
                            width: 'min(92vw, 400px)'
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="fixed bottom-6 right-6 z-[2000] overflow-hidden"
                    >
                        <GlassSurface
                            width="100%"
                            height="100%"
                            borderRadius={24}
                            backgroundOpacity={0.6}
                            innerClassName="p-0"
                            className="shadow-2xl"
                        >
                            <div className="w-full h-full flex flex-col relative">
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
                                            className="flex-1 overflow-y-auto p-4 space-y-5 font-sans relative z-10 scrollbar-thin scrollbar-thumb-white/10"
                                        >
                                            {messages.map((msg, i) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                    key={i}
                                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-[85%] flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-[#B9FF2C] text-black'}`}>
                                                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                                        </div>
                                                        <div className={`p-3.5 rounded-2xl text-[13.5px] leading-[1.6] shadow-sm ${msg.role === 'user' ? 'bg-[#B9FF2C]/10 text-white border border-[#B9FF2C]/20 rounded-tr-none' : 'bg-white/5 text-white/90 rounded-tl-none border border-white/10'}`}>
                                                            {msg.content.split(/(\[.*?\]\(.*?\))/g).map((part, idx) => {
                                                                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                                                if (match) {
                                                                    return <a key={idx} href={match[2]} className="text-[#B9FF2C] font-semibold underline underline-offset-2 hover:text-white transition-colors">{match[1]}</a>;
                                                                }
                                                                return <span key={idx}>{part}</span>;
                                                            })}
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
                                                        <div className="bg-white/5 text-white/90 p-3.5 rounded-2xl rounded-tl-none border border-white/10 flex items-center gap-3">
                                                            <div className="flex gap-1">
                                                                <span className="w-1.5 h-1.5 bg-[#B9FF2C] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                                <span className="w-1.5 h-1.5 bg-[#B9FF2C] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                                <span className="w-1.5 h-1.5 bg-[#B9FF2C] rounded-full animate-bounce" />
                                                            </div>
                                                            <span className="text-[11px] font-mono text-[#B9FF2C]/70 animate-pulse">{loadingText}</span>
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
                        </GlassSurface>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
