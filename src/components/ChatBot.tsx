"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
    X, Send, Minimize2, Maximize2, Loader2, Bot,
    Trash2, Zap, ChevronDown, Sparkles, MessageSquare
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatBotProps {
    isAdmin?: boolean;
    contextData?: any;
}

const WELCOME_MESSAGES: Record<string, string> = {
    admin: `👋 Welcome back, Admin! I'm **Spark**, your Hashan E Solution business intelligence assistant.\n\nI can help you with:\n• 📊 Analyzing appointments & revenue trends\n• 📦 Inventory management insights\n• 💰 Financial analysis & business strategy\n• 📅 Scheduling optimization\n• 🎯 Customer behavior patterns\n\nWhat business insights can I help you with today?`,
    user: `👋 Hello! I'm **Spark**, the AI assistant for **Hashan E Solution**.\n\nI'm here to help you with:\n• ⚡ Information about our repair services\n• 📅 Guidance on booking appointments\n• 🔧 Troubleshooting tips for your appliances\n• ❓ Any questions about our services\n\nHow can I assist you today?`,
};

export default function ChatBot({ isAdmin = false, contextData = null }: ChatBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Initialize chat with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMsg: Message = {
                id: 'welcome',
                role: 'assistant',
                content: isAdmin ? WELCOME_MESSAGES.admin : WELCOME_MESSAGES.user,
                timestamp: new Date(),
            };
            setMessages([welcomeMsg]);
        }
    }, [isOpen, isAdmin, messages.length]);

    const scrollToBottom = useCallback((smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        }
        setShowScrollButton(false);
    }, []);

    useEffect(() => {
        if (!isMinimized) {
            setTimeout(() => scrollToBottom(true), 100);
        }
    }, [messages, isMinimized, scrollToBottom]);

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        setShowScrollButton(!isNearBottom);
    };

    const parseMarkdown = (text: string): string => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-yellow-300 text-xs font-mono">$1</code>')
            .replace(/^• (.+)/gm, '<li class="ml-4 list-none flex items-start gap-2 mb-1"><span class="text-yellow-400 mt-1">●</span><span>$1</span></li>')
            .replace(/^#{1,3} (.+)/gm, '<h4 class="text-yellow-300 font-bold mt-2 mb-1">$1</h4>')
            .replace(/\n\n/g, '</p><p class="mt-3">')
            .replace(/\n/g, '<br/>');
    };

    // Listen for business data updates
    useEffect(() => {
        const handleDataUpdate = (e: any) => {
            if (e.detail) {
                (window as any).sparkContextData = e.detail;
            }
        };

        window.addEventListener('spark-data-update', handleDataUpdate as any);
        return () => window.removeEventListener('spark-data-update', handleDataUpdate as any);
    }, []);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const currentData = contextData || (window as any).sparkContextData;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setIsTyping(true);

        const apiMessages = [...messages, userMessage]
            .filter(m => m.id !== 'welcome')
            .map(m => ({ role: m.role, content: m.content }));

        const assistantMsgId = (Date.now() + 1).toString();
        const assistantMsg: Message = {
            id: assistantMsgId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);

        try {
            abortControllerRef.current = new AbortController();

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages, isAdmin, contextData: currentData }),
                signal: abortControllerRef.current.signal,
            });

            if (!res.ok) throw new Error('API request failed');

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error('No response body');

            setIsTyping(false);
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') break;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                setMessages(prev =>
                                    prev.map(m =>
                                        m.id === assistantMsgId
                                            ? { ...m, content: m.content + parsed.content }
                                            : m
                                    )
                                );
                                if (isMinimized) setHasUnread(true);
                            }
                        } catch { }
                    }
                }
            }
        } catch (error: any) {
            if (error?.name === 'AbortError') {
                setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
            } else {
                setMessages(prev =>
                    prev.map(m =>
                        m.id === assistantMsgId
                            ? { ...m, content: 'Sorry, I encountered an error. Please check your connection or try again later.' }
                            : m
                    )
                );
            }
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        abortControllerRef.current?.abort();
        setMessages([]);
        setIsLoading(false);
        setIsTyping(false);
        setTimeout(() => {
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: isAdmin ? WELCOME_MESSAGES.admin : WELCOME_MESSAGES.user,
                timestamp: new Date(),
            }]);
        }, 50);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setHasUnread(false);
    };

    const accentColor = isAdmin ? '#EF4444' : '#EAB308';
    const accentGradient = isAdmin
        ? 'linear-gradient(135deg, #EF4444, #991B1B)'
        : 'linear-gradient(135deg, #EAB308, #854D0E)';

    return (
        <>
            <style jsx global>{`
                @keyframes slideInUp {
                    from { transform: translateY(12px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .message-anim {
                    animation: slideInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
                .typing-dot {
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: currentColor;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
                .spark-custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .spark-custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .spark-custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .spark-custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>

            {/* Floating Launcher Icon */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-[104px] right-6 z-50 group active:scale-95 transition-transform duration-200"
                    aria-label="Open Spark AI Support"
                >
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-full animate-ping opacity-25"
                            style={{ background: accentColor, animationDuration: '3s' }}
                        />
                        <div
                            className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] group-hover:-translate-y-1"
                            style={{
                                background: accentGradient,
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            <Bot size={28} className="text-white group-hover:scale-110 transition-transform" />

                            {/* Animated sparkles around the icon */}
                            <Sparkles className="absolute -top-1 -right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" size={16} />
                        </div>

                        {hasUnread && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-slate-900 text-[9px] font-bold text-white items-center justify-center">!</span>
                            </span>
                        )}

                        <div className="absolute right-20 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden md:block backdrop-blur-md">
                            Ask Spark AI...
                        </div>
                    </div>
                </button>
            )}

            {/* Main Chat Interface */}
            {isOpen && (
                <div
                    className={`fixed z-[100] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isMinimized
                            ? 'bottom-[104px] right-6 w-[280px] h-16 opacity-100'
                            : 'bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-[420px] md:h-[680px] md:max-h-[calc(100vh-120px)] opacity-100'
                        }`}
                >
                    <div
                        className="flex flex-col h-full md:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden backdrop-blur-2xl"
                        style={{
                            background: 'linear-gradient(170deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
                        }}
                    >
                        {/* Elegant Header */}
                        <div
                            className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none relative"
                            style={{
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                background: isMinimized ? accentGradient : 'transparent'
                            }}
                            onClick={() => isMinimized && setIsMinimized(false)}
                        >
                            <div className="relative group">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white/5 p-1 transition-transform group-hover:scale-105">
                                    <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 shadow-sm" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-[15px] tracking-tight">Spark Intelligence</h3>
                                    {isAdmin && (
                                        <span className="bg-red-500/10 text-red-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-red-500/20 tracking-wider">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-400 font-medium">
                                    {isLoading ? (
                                        <span className="flex items-center gap-1.5 text-yellow-500/80">
                                            <span className="animate-pulse">Analyzing...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <span className="w-1 h-1 bg-green-500 rounded-full" />
                                            Online Support
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-0.5">
                                {!isMinimized && (
                                    <button
                                        onClick={clearChat}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                        title="Clear conversation"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => { abortControllerRef.current?.abort(); setIsOpen(false); }}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Message Feed */}
                        {!isMinimized && (
                            <>
                                <div
                                    ref={messagesContainerRef}
                                    onScroll={handleScroll}
                                    className="flex-1 overflow-y-auto px-5 py-6 space-y-6 spark-custom-scrollbar"
                                >
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3.5 message-anim ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            <div className="flex-shrink-0">
                                                {message.role === 'assistant' ? (
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 shadow-sm overflow-hidden p-1">
                                                        <Image src="/images/logo.png" alt="Spark" width={24} height={24} className="opacity-80" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shadow-inner">
                                                        <span className="text-blue-400 text-[10px] font-black uppercase">Me</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`max-w-[85%] flex flex-col gap-1.5 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-lg ${message.role === 'user'
                                                            ? 'rounded-tr-none text-white'
                                                            : 'rounded-tl-none text-gray-200 border border-white/5'
                                                        }`}
                                                    style={{
                                                        background: message.role === 'user'
                                                            ? accentGradient
                                                            : 'rgba(255,255,255,0.03)',
                                                    }}
                                                >
                                                    {message.content ? (
                                                        <div
                                                            className="prose prose-invert prose-sm"
                                                            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                                                        />
                                                    ) : (
                                                        <div className="flex gap-1.5 items-center justify-center min-w-[40px] h-5">
                                                            <div className="typing-dot" />
                                                            <div className="typing-dot" />
                                                            <div className="typing-dot" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest px-1">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="flex gap-3.5 message-anim">
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 p-1">
                                                <Image src="/images/logo.png" alt="Spark" width={24} height={24} className="opacity-80" />
                                            </div>
                                            <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/5">
                                                <div className="flex gap-1.5 items-center">
                                                    <div className="typing-dot" />
                                                    <div className="typing-dot" />
                                                    <div className="typing-dot" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Floating Scroll Down */}
                                {showScrollButton && (
                                    <button
                                        onClick={() => scrollToBottom(true)}
                                        className="absolute bottom-28 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-800/90 border border-white/10 text-white text-[11px] font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce cursor-pointer z-10"
                                    >
                                        <ChevronDown size={14} /> New Messages
                                    </button>
                                )}

                                {/* Smart Suggestions */}
                                {messages.filter(m => m.role === 'user').length === 0 && (
                                    <div className="px-5 pb-4 flex flex-wrap gap-2">
                                        {(isAdmin
                                            ? ['📈 How are we performing today?', '📅 Summary of appointments', '💰 Finance health check']
                                            : ["🔧 How much for a TV repair?", "📅 I'd like to book an appointment", "⏳ What are your hours?"]
                                        ).map(prompt => (
                                            <button
                                                key={prompt}
                                                onClick={() => { setInputValue(prompt); inputRef.current?.focus(); }}
                                                className="text-xs px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 text-left"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Polished Input Component */}
                                <div className="p-5 relative" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-2.5 shadow-inner focus-within:border-white/20 transition-colors">
                                        <textarea
                                            ref={inputRef}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={isAdmin ? "Type business query..." : "Ask Spark anything..."}
                                            rows={1}
                                            className="flex-1 bg-transparent text-white text-sm outline-none resize-none max-h-32 px-2 py-1 placeholder:text-gray-500 placeholder:font-medium spark-custom-scrollbar"
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = 'auto';
                                                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                                            }}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!inputValue.trim() || isLoading}
                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale group active:scale-95"
                                            style={{
                                                background: inputValue.trim() && !isLoading ? accentGradient : 'rgba(255,255,255,0.05)',
                                            }}
                                        >
                                            {isLoading ? (
                                                <Loader2 size={18} className="text-white animate-spin" />
                                            ) : (
                                                <Send size={18} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 px-1">
                                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <Zap size={10} className="text-yellow-500" /> Powered by OpenRouter AI
                                        </p>
                                        <p className="text-[9px] text-gray-600 font-bold">Press Shift + Enter for new line</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
