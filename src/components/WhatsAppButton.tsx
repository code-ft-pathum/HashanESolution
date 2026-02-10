"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const WhatsAppButton = () => {
    const whatsappUrl = "https://wa.me/94742409092?text=Hello%20Hashan%20e%20solution,%20I%20need%20a%20repair%20quote%20for...";

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-8 right-8 z-[60] flex items-center justify-center",
                "w-16 h-16 rounded-full bg-whatsapp text-white shadow-2xl",
                "transition-all duration-300 hover:scale-110 hover:-rotate-12",
                "animate-bounce-slow"
            )}
            aria-label="Contact us on WhatsApp"
        >
            <div className="absolute inset-0 rounded-full bg-whatsapp animate-ping opacity-25" />
            <MessageCircle size={32} className="relative z-10" />
        </a>
    );
};

export default WhatsAppButton;
