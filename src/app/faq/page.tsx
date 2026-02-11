"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: "What items do you repair?",
        answer: "We repair almost all household and professional electronic items, including LED/LCD TVs, Digital Meters (Bikes/Cars), Rice Cookers, Blenders, Microwave Ovens, Induction Cookers, Electric Irons, and even Refrigerators. If it has a circuit board, we can likely fix it!"
    },
    {
        question: "How long does a typical repair take?",
        answer: "Most minor repairs (Rice cookers, Blenders) are completed within 24-48 hours. More complex repairs like TV panel bonding or chip-level motherboard work may take 3-5 working days depending on the availability of genuine spare parts."
    },
    {
        question: "Do you provide a warranty for repairs?",
        answer: "Yes! We provide a warranty on all our service repairs and the genuine spare parts we supply. The duration varies from 1 month to 6 months depending on the type of repair and part replaced."
    },
    {
        question: "Do you offer on-site or home service?",
        answer: "We offer on-site inspections for large items like Refrigerators and certain TV repairs within the Polonnaruwa district (Welikanda, Manampitiya, etc.). For smaller appliances, we recommend bringing them to our workshop in Welikanda for a more detailed diagnostic."
    },
    {
        question: "How much will a repair cost?",
        answer: "Repair costs depend on the issue and the parts needed. We provide a free or low-cost initial diagnostic and will give you a full quote before proceeding with any work. No hidden charges!"
    },
    {
        question: "Do you sell spare parts separately?",
        answer: "Yes, we maintain an inventory of high-quality genuine spare parts including TV power ICs, backlight strips, universal mainboards, and digital meter displays which we sell to both individuals and other repair technicians."
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="bg-primary-dark pt-32 pb-24 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">Frequently Asked Questions</h1>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg">
                        Find quick answers to common questions about our electronic repair services and spare parts.
                    </p>
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
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-surface border border-white/10 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
                    <p className="text-gray-400 mb-8 font-medium">We're here to help you get your devices back in working order.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="https://wa.me/94742409092"
                            className="bg-whatsapp text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            Message on WhatsApp
                        </a>
                        <a
                            href="tel:0742409092"
                            className="bg-primary text-primary-dark px-8 py-4 rounded-2xl font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
                        >
                            Call Us Now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
