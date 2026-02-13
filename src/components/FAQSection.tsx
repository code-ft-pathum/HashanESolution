"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: "What items do you repair?",
        answer: "We repair almost all household and professional electronic items, including LED/LCD TVs, Digital Meters (Bikes/Cars), Rice Cookers, Blenders, Microwave Ovens, Induction Cookers, Electric Irons, and Refrigerators. If it has a circuit board, we can likely fix it!"
    },
    {
        question: "Which bike digital meters do you fix?",
        answer: "We specialize in digital cluster repairs for Bajaj Pulsar (150, 180, 220, NS), TVS Apache, Hero, and Yamaha FZ. Common fixes include display fading, backlight issues, and circuit board failures."
    },
    {
        question: "Do you repair Refrigerators and Ovens?",
        answer: "Yes, we specialized in repairing the electronic control boards (PCBs) of modern Refrigerators and Microwave Ovens. We can often fix the existing board at a fraction of the cost of a full replacement."
    },
    {
        question: "How long does a typical repair take?",
        answer: "Most minor repairs (Rice cookers, Blenders) are completed within 24-48 hours. More complex repairs like TV panel bonding or chip-level work take 3-5 working days depending on part availability."
    },
    {
        question: "Do you offer on-site service?",
        answer: "We offer on-site inspections for large items like Refrigerators and certain TV repairs within the Polonnaruwa district (Welikanda, Manampitiya, etc.). Smaller items should be brought to our workshop."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-surface">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">FAQ</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white font-poppins">Common Questions</h3>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={cn(
                                "group rounded-3xl transition-all duration-300 border",
                                openIndex === index
                                    ? "bg-white/10 border-primary/30 shadow-xl shadow-primary/5"
                                    : "bg-white/5 border-white/10 hover:border-white/20"
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left"
                            >
                                <span className={cn(
                                    "text-lg font-bold transition-colors",
                                    openIndex === index ? "text-primary" : "text-white"
                                )}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-primary shrink-0" size={24} />
                                ) : (
                                    <ChevronDown className="text-gray-500 group-hover:text-primary shrink-0 transition-colors" size={24} />
                                )}
                            </button>

                            <div className={cn(
                                "px-8 overflow-hidden transition-all duration-300 ease-in-out",
                                openIndex === index ? "max-h-96 pb-8 opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <p className="text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
