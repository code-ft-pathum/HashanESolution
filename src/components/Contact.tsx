"use client";

import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Facebook, MessageCircle } from 'lucide-react';
import { sendEmail } from '@/app/actions';

const Contact = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await sendEmail(formData);

        if (result.success) {
            setStatus('success');
            (e.target as HTMLFormElement).reset();
        } else {
            setStatus('error');
            setErrorMessage(result.error || 'Something went wrong');
        }
    };

    return (
        <section id="contact" className="py-24 bg-primary-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Contact Us</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white font-poppins">Get in Touch Today</h3>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                        Have a question or need a repair quote? Send us a message and we'll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3 bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Your Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Full Name"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="e.g. 074 240 9092"
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="name@email.com"
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Your Message</label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    required
                                    placeholder="Tell us about the issue with your device..."
                                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-gray-500"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-dark py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all disabled:opacity-70"
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : status === 'success' ? (
                                    "Message Sent Successfully!"
                                ) : (
                                    <>
                                        <Send size={24} />
                                        Send Message
                                    </>
                                )}
                            </button>
                            {status === 'error' && (
                                <p className="text-red-500 text-sm font-medium text-center">{errorMessage}</p>
                            )}
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-surface p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />

                            <h4 className="text-2xl font-bold mb-8">Contact Info</h4>

                            <div className="space-y-6">
                                <a href="tel:0742409092" className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/item:bg-primary transition-colors">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Phone</p>
                                        <p className="font-semibold text-lg">074 240 9092</p>
                                    </div>
                                </a>

                                <a href="mailto:hashanmadushanka9122@gmail.com" className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/item:bg-primary transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="font-semibold">hashanmadushanka9122 @gmail.com</p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4 group/item">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Address</p>
                                        <p className="font-semibold">No 09, New Town, Welikanda</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/10 flex gap-4">
                                <a href="https://web.facebook.com/profile.php?id=61587911941346" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-primary hover:text-primary-dark transition-colors">
                                    <Facebook size={24} />
                                </a>
                                <a href="https://wa.me/94742409092" className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-whatsapp transition-colors">
                                    <MessageCircle size={24} />
                                </a>
                            </div>
                        </div>

                        <div className="bg-whatsapp p-8 rounded-[2.5rem] text-white flex items-center justify-between group cursor-pointer overflow-hidden relative">
                            <div className="relative z-10">
                                <p className="font-bold text-xl mb-2">Quick WhatsApp Fix?</p>
                                <p className="text-white/80">Message us for a quick diagnosis.</p>
                            </div>
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:scale-110 relative z-10">
                                <MessageCircle size={32} />
                            </div>
                            <div className="absolute inset-0 bg-white/10 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
