"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, Send, Minimize2, Maximize2, Loader2, Bot, Trash2, Zap, ChevronDown, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    reasoning_details?: any;
    timestamp: Date;
}

interface ChatBotProps {
    isAdmin?: boolean;
    contextData?: any;
}

const WELCOME_MESSAGES: Record<string, string> = {
    admin: `👋 Welcome back, **Hashan**! I'm **Spark**, your business intelligence assistant.\n\nI'm ready to analyze your:\n• 📊 Recent repair appointments\n• 💰 Revenue & financial health\n• 📦 Inventory status\n• 📈 Shop performance trends\n\nWhich business insight would you like to explore?`,
    user: `👋 Hello! I'm **Spark**, the AI expert for **Hashan E Solution**.\n\nI can assist you with:\n• 📺 **TV Repair** (LED/LCD/Smart TVs)\n• 🏍️ **Digital Meter Repair** (Bajaj Pulsar, Apache, etc.)\n• 🏠 **Home Appliances** (Microwaves, Fridges, Blenders)\n• 📅 **Booking Appointments** online\n\nHow can I help with your device today?`,
};

function parseMarkdown(text: string): string {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-yellow-300 text-xs font-mono">$1</code>')
        .replace(/^• (.+)/gm, '<li class="ml-4 list-none flex items-start gap-2 mb-1"><span class="text-yellow-400 mt-1">●</span><span>$1</span></li>')
        .replace(/^#{1,3} (.+)/gm, '<h4 class="text-yellow-300 font-bold mt-2 mb-1">$1</h4>')
        .replace(/\n\n/g, '</p><p class="mt-3">')
        .replace(/\n/g, '<br/>');
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatBot({ isAdmin = false, contextData = null }: ChatBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Initialize chat with welcome message when opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: isAdmin ? WELCOME_MESSAGES.admin : WELCOME_MESSAGES.user,
                timestamp: new Date(),
            }]);
        }
    }, [isOpen, isAdmin, messages.length]);

    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setShowScrollButton(false);
    }, []);

    // Auto-scroll when messages change
    useEffect(() => {
        if (!isMinimized) {
            const t = setTimeout(scrollToBottom, 50);
            return () => clearTimeout(t);
        }
    }, [messages, isMinimized, scrollToBottom]);

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        setShowScrollButton(!nearBottom);
    };

    // Listen for business data updates from admin dashboard
    useEffect(() => {
        const handleDataUpdate = (e: any) => {
            if (e.detail) (window as any).sparkContextData = e.detail;
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

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        const apiMessages = newMessages
            .filter(m => 
                m.id !== 'welcome' && 
                m.content !== '' && 
                !m.content.includes('Sorry, I encountered an error') &&
                !m.content.includes('Authentication failed') &&
                !m.content.includes('AI service error')
            )
            .map(m => ({
                role: m.role,
                content: m.content,
                // Preserve reasoning details for subsequent calls
                ...(m.reasoning_details ? { reasoning_details: m.reasoning_details } : {})
            }));

        const assistantMsgId = (Date.now() + 1).toString();
        // Add a placeholder message for the assistant that will be updated
        setMessages(prev => [...prev, {
            id: assistantMsgId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
        }]);

        try {
            abortControllerRef.current = new AbortController();

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: apiMessages, 
                    isAdmin, 
                    contextData: currentData 
                }),
                signal: abortControllerRef.current.signal,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error || 'AI service is currently unavailable');
            }

            if (data.content !== undefined || data.reasoning_details) {
                setMessages(prev =>
                    prev.map(m =>
                        m.id === assistantMsgId 
                            ? { 
                                ...m, 
                                content: data.content || '', 
                                reasoning_details: data.reasoning_details || null 
                            } 
                            : m
                    )
                );
                if (isMinimized) setHasUnread(true);
            }
        } catch (error: any) {
            if (error?.name === 'AbortError') {
                setMessages(prev => prev.filter(m => m.id !== assistantMsgId));
            } else {
                const errorMessage = error?.message || 'Sorry, I encountered an error. Please try again.';
                setMessages(prev =>
                    prev.map(m =>
                        m.id === assistantMsgId
                            ? { ...m, content: errorMessage }
                            : m
                    )
                );
            }
        } finally {
            setIsLoading(false);
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
        setIsLoading(false);
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: isAdmin ? WELCOME_MESSAGES.admin : WELCOME_MESSAGES.user,
            timestamp: new Date(),
        }]);
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

    const userSuggestions = ['📅 Book an appointment', '🔧 My appliance is broken', '⏳ What are your hours?'];
    const adminSuggestions = ['📈 How are we performing today?', '📅 Summary of appointments', '💰 Finance health check'];
    const suggestions = isAdmin ? adminSuggestions : userSuggestions;
    const hasUserMessages = messages.some(m => m.role === 'user');

    return (
        <>
            <style>{`
                @keyframes slideInUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .spark-msg-anim {
                    animation: slideInUp 0.25s ease forwards;
                }
                .spark-typing-dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #9ca3af;
                    animation: sparkBounce 1.2s infinite ease-in-out both;
                }
                .spark-typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .spark-typing-dot:nth-child(2) { animation-delay: -0.16s; }
                .spark-typing-dot:nth-child(3) { animation-delay: 0s; }
                @keyframes sparkBounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }
                .spark-scrollbar::-webkit-scrollbar { width: 4px; }
                .spark-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .spark-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 10px; }
                .spark-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
            `}</style>

            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    className="fixed bottom-[104px] right-6 z-50 group"
                    aria-label="Open Spark AI Assistant"
                >
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-full opacity-20 animate-ping"
                            style={{ background: accentColor, animationDuration: '3s' }}
                        />
                        <div
                            className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:-translate-y-1 active:scale-95"
                            style={{ background: accentGradient, border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <Bot size={28} className="text-white" />
                            <Sparkles className="absolute -top-1 -right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                        </div>

                        {hasUnread && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-slate-900 text-[9px] font-bold text-white items-center justify-center">!</span>
                            </span>
                        )}

                        <div className="absolute right-20 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                            Ask Spark AI...
                        </div>
                    </div>
                </button>
            )}

            {/* Main Chat Window */}
            {isOpen && (
                <div
                    className={`fixed z-[100] transition-all duration-300 ${isMinimized
                        ? 'bottom-[104px] right-6 w-72 h-16'
                        : 'bottom-0 right-0 w-full h-full md:bottom-6 md:right-6 md:w-[420px] md:h-[680px] md:max-h-[calc(100vh-120px)]'
                        }`}
                >
                    <div
                        className="flex flex-col h-full md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                        style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' }}
                    >
                        {/* Header */}
                        <div
                            className="flex items-center gap-3 px-5 py-4 flex-shrink-0 cursor-pointer select-none"
                            style={{
                                borderBottom: isMinimized ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                background: isMinimized ? accentGradient : 'transparent'
                            }}
                            onClick={() => isMinimized && setIsMinimized(false)}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 bg-white/5 p-1">
                                    <Image src="/images/logo.png" alt="Spark" width={40} height={40} className="object-contain" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-sm tracking-tight">Spark Intelligence</h3>
                                    {isAdmin && (
                                        <span className="bg-red-500/15 text-red-400 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-red-500/20 tracking-wider">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    {isLoading ? (
                                        <span className="text-yellow-400 animate-pulse">Thinking...</span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                                            Online Support
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                {!isMinimized && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); clearChat(); }}
                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                                        title="Clear conversation"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMinimized(v => !v); }}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
                                </button>
                                <button
                                    onClick={() => { abortControllerRef.current?.abort(); setIsOpen(false); }}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <X size={17} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        {!isMinimized && (
                            <>
                                <div
                                    ref={messagesContainerRef}
                                    onScroll={handleScroll}
                                    className="flex-1 overflow-y-auto px-4 py-5 space-y-5 spark-scrollbar"
                                >
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex gap-3 spark-msg-anim ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                {message.role === 'assistant' ? (
                                                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-white/5 p-1">
                                                        <Image src="/images/logo.png" alt="Spark" width={24} height={24} className="opacity-80" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
                                                        <span className="text-blue-400 text-[10px] font-black">Me</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bubble */}
                                            <div className={`max-w-[82%] flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div
                                                    className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed ${message.role === 'user'
                                                        ? 'rounded-tr-sm text-white'
                                                        : 'rounded-tl-sm text-gray-200 border border-white/5'
                                                        }`}
                                                    style={{
                                                        background: message.role === 'user'
                                                            ? accentGradient
                                                            : 'rgba(255,255,255,0.04)'
                                                    }}
                                                >
                                                    {message.content ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
                                                        />
                                                    ) : (
                                                        <div className="flex gap-1.5 items-center py-1">
                                                            <div className="spark-typing-dot" />
                                                            <div className="spark-typing-dot" />
                                                            <div className="spark-typing-dot" />
                                                        </div>
                                                    )}
                                                </div>
                                                {message.reasoning_details && (
                                                    <details className="mt-1 text-xs text-gray-400 bg-gray-800/50 rounded-md p-2">
                                                        <summary className="cursor-pointer font-semibold mb-1 hover:text-gray-300">View Thinking Process</summary>
                                                        <div className="mt-2 whitespace-pre-wrap">
                                                            {(() => {
                                                                try {
                                                                    // Determine if it's already an array/object, or needs parsing
                                                                    const parsed = typeof message.reasoning_details === 'string'
                                                                        ? (message.reasoning_details.startsWith('[') ? JSON.parse(message.reasoning_details) : null)
                                                                        : message.reasoning_details;

                                                                    if (Array.isArray(parsed)) {
                                                                        return parsed.map((item: any) => item.text || '').join('\n');
                                                                    } else if (parsed && typeof parsed === 'object' && parsed.text) {
                                                                        return parsed.text;
                                                                    }
                                                                    return typeof message.reasoning_details === 'string'
                                                                        ? message.reasoning_details
                                                                        : JSON.stringify(message.reasoning_details, null, 2);
                                                                } catch (e) {
                                                                    return String(message.reasoning_details);
                                                                }
                                                            })()}
                                                        </div>
                                                    </details>
                                                )}
                                                <span className="text-[10px] text-gray-600 px-1">
                                                    {formatTime(message.timestamp)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Scroll to bottom button */}
                                {showScrollButton && (
                                    <div className="relative">
                                        <button
                                            onClick={scrollToBottom}
                                            className="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-full px-4 py-1.5 rounded-full bg-slate-800 border border-white/10 text-white text-[11px] font-medium shadow-lg flex items-center gap-1.5 z-10"
                                        >
                                            <ChevronDown size={13} /> Scroll down
                                        </button>
                                    </div>
                                )}

                                {/* Quick Suggestion Chips */}
                                {!hasUserMessages && (
                                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                                        {suggestions.map(prompt => (
                                            <button
                                                key={prompt}
                                                onClick={() => { setInputValue(prompt); inputRef.current?.focus(); }}
                                                className="text-xs px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Input */}
                                <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                                    <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 focus-within:border-white/20 transition-colors">
                                        <textarea
                                            ref={inputRef}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder={isAdmin ? 'Type business query...' : 'Ask Spark anything...'}
                                            rows={1}
                                            className="flex-1 bg-transparent text-white text-sm outline-none resize-none max-h-28 py-1 placeholder:text-gray-500 spark-scrollbar"
                                            onInput={(e) => {
                                                const t = e.target as HTMLTextAreaElement;
                                                t.style.height = 'auto';
                                                t.style.height = `${Math.min(t.scrollHeight, 112)}px`;
                                            }}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!inputValue.trim() || isLoading}
                                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 active:scale-95"
                                            style={{ background: inputValue.trim() && !isLoading ? accentGradient : 'rgba(255,255,255,0.06)' }}
                                        >
                                            {isLoading
                                                ? <Loader2 size={16} className="text-white animate-spin" />
                                                : <Send size={16} className="text-white" />
                                            }
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-600 mt-2 text-center flex items-center justify-center gap-1">
                                        <Zap size={9} className="text-yellow-600" />
                                        Powered by OpenRouter AI · Enter to send
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
