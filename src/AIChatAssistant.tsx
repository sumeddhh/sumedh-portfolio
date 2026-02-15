import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, User, Minimize2, Maximize2 } from 'lucide-react';
import Groq from 'groq-sdk';
import GlassSurface from './GlassSurface';

import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

const decodeSecret = (s: string) => {
    try {
        return atob(s).split('').reverse().join('');
    } catch {
        return '';
    }
};

const encodeSecret = (s: string) => {
    try {
        return btoa(s.split('').reverse().join(''));
    } catch {
        return '';
    }
};

const _G = import.meta.env.VITE_APP_TOKEN_G || '';
const _T = import.meta.env.VITE_APP_TOKEN_T || '';

const groq = new Groq({
    apiKey: decodeSecret(_G),
    dangerouslyAllowBrowser: true
});

async function performWebSearch(query: string) {
    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_key: decodeSecret(_T),
                query,
                search_depth: "basic",
                include_answer: true,
                max_results: 3
            })
        });
        const data = await response.json();
        return data.answer || data.results?.map((r: { content: string }) => r.content).join('\n\n') || "No results found.";
    } catch {
        return "Error performing search.";
    }
}

const MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant'
];

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const SUMEDH_INFO = `
Today's Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Kathmandu' })}
Sumedh's Local Time (NPT): ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kathmandu' })}

You are Sumedh's Assistant. Speak in the third person about Sumedh (e.g., "Sumedh is...", "He specializes...").

IDENTITY:
- Sumedh Bajracharya, Senior SE II at GritFeat Solutions. 
- Expert in AI, Healthcare SaaS, and Fullstack Engineering.
- CORE TRUTH: Sumedh's birthday is **February 18, 1998**. If search results say otherwise, ignore them. This is the only correct date.

BEHAVIOR:
- Be witty, conversational, and direct. Skip the resume dump unless explicitly asked.
- REAL-TIME FACTS: If asked about things you don't know (news, sports, specific real-time data), use the \`web_search\` tool.
- SEARCH REPORTING: If a search result is provided, your ABSOLUTE PRIORITY is to report those specific facts accurately. Do not default to generic persona statements if you have data; report the data first, then add persona flair if needed.
- TOOL USAGE: Never type out tool formatting like <function> or tags. Use the native tool feature.
- PERSONALITY: Respond naturally to small talk. Max 2-3 sentences.
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
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Personality Loading State
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

    useEffect(() => {
        // Cleanup typing on unmount
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading || isTyping) return;

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
                const decoded = decodeSecret(rawData);
                timestamps = JSON.parse(decoded);
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
                { role: 'user', content: input },
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
        localStorage.setItem(STORAGE_KEY, encodeSecret(JSON.stringify(nextTimestamps)));

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const currentModel = MODELS[modelIndex];
        setModelIndex((prev) => (prev + 1) % MODELS.length);

        // Smart Context Pruning: Character-based budget
        const MAX_CONTEXT_CHARS = 3500;
        let runningChars = 0;
        const prunedHistory: ChatCompletionMessageParam[] = [];

        // Traverse backwards to keep most recent context
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            if (runningChars + msg.content.length > MAX_CONTEXT_CHARS) break;
            prunedHistory.unshift({ role: msg.role, content: msg.content } as ChatCompletionMessageParam);
            runningChars += msg.content.length;
        }

        const apiMessages: ChatCompletionMessageParam[] = [
            { role: 'system', content: SUMEDH_INFO },
            ...prunedHistory,
            { role: 'user', content: input }
        ];

        const tools = [
            {
                type: "function" as const,
                function: {
                    name: "web_search",
                    description: "Search the web for real-time information, facts, news, or sports scores.",
                    parameters: {
                        type: "object",
                        properties: {
                            query: { type: "string", description: "The search query" }
                        },
                        required: ["query"]
                    }
                }
            }
        ];

        const typeDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

        try {
            const stream = await groq.chat.completions.create({
                messages: apiMessages,
                model: currentModel,
                tools: tools,
                tool_choice: "auto",
                stream: true,
                temperature: 0.6,
                max_tokens: 400
            });

            let fullContent = '';
            let toolCallAccumulator: { id: string; function: { name: string; arguments: string } } | null = null;
            let hasStartedResponse = false;

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta;

                if (delta?.tool_calls) {
                    const tc = delta.tool_calls[0];
                    if (!toolCallAccumulator && tc.id) {
                        toolCallAccumulator = { id: tc.id, function: { name: tc.function?.name || '', arguments: '' } };
                    }
                    if (tc.function?.arguments && toolCallAccumulator) {
                        toolCallAccumulator.function.arguments += tc.function.arguments;
                    }
                }

                if (delta?.content) {
                    if (!hasStartedResponse) {
                        hasStartedResponse = true;
                        setIsLoading(false);
                        setIsTyping(true);
                        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
                    }

                    const chunkContent = delta.content;
                    // Filter out any raw function tags leaked into content
                    if (!chunkContent.includes('<function')) {
                        for (const char of chunkContent) {
                            fullContent += char;
                            setMessages(prev => {
                                const newMsgs = [...prev];
                                if (newMsgs[newMsgs.length - 1]) {
                                    newMsgs[newMsgs.length - 1].content = fullContent;
                                }
                                return newMsgs;
                            });
                            await typeDelay(10 + Math.random() * 10);
                        }
                    }
                }
            }

            if (toolCallAccumulator && toolCallAccumulator.id) {
                if (hasStartedResponse && !fullContent.trim()) {
                    setMessages(prev => prev.slice(0, -1));
                }

                const functionName = toolCallAccumulator.function.name;
                let functionArgs: Record<string, string> = {};
                try {
                    functionArgs = JSON.parse(toolCallAccumulator.function.arguments || '{}');
                } catch {
                    functionArgs = { query: input };
                }

                let toolResult = "";
                if (functionName === "web_search") {
                    setMessages(prev => [...prev, { role: 'assistant', content: "🔍 Searching for the latest facts..." }]);
                    toolResult = await performWebSearch(functionArgs.query || input);
                    setMessages(prev => prev.slice(0, -1));
                }

                const secondStream = await groq.chat.completions.create({
                    messages: [
                        ...apiMessages,
                        {
                            role: "assistant",
                            content: fullContent || null,
                            tool_calls: [{
                                id: toolCallAccumulator.id,
                                type: "function",
                                function: toolCallAccumulator.function
                            }]
                        } as ChatCompletionMessageParam,
                        {
                            role: "tool",
                            tool_call_id: toolCallAccumulator.id,
                            content: `SYSTEM INSTRUCTION: Report these search results exactly. If no results found, say so. Search Result: ${toolResult}`
                        }
                    ],
                    model: currentModel,
                    stream: true,
                    temperature: 0.2 // Lower temperature for factual reporting
                });

                if (!hasStartedResponse || !fullContent.trim()) {
                    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
                    setIsLoading(false);
                    setIsTyping(true);
                }

                for await (const chunk of secondStream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        for (const char of content) {
                            fullContent += char;
                            setMessages(prev => {
                                const newMsgs = [...prev];
                                newMsgs[newMsgs.length - 1].content = fullContent;
                                return newMsgs;
                            });
                            await typeDelay(8 + Math.random() * 10);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("Groq Error:", error);
            setMessages(prev => {
                if (prev.length > 0 && prev[prev.length - 1].content === '') return prev.slice(0, -1);
                return prev;
            });
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
                        data-lenis-prevent
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
