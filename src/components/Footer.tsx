import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary-dark text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-12 h-12 overflow-hidden rounded-lg bg-white/10 flex items-center justify-center">
                                <Image src="/images/logo.png" alt="Hashan e solution" width={48} height={48} className="object-cover" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">
                                Hashan <span className="text-primary">e solution</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Your trusted partner for high-quality electronics repair services in Polonnaruwa. We specialize in chip-level diagnostics and genuine spare parts.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://web.facebook.com/profile.php?id=61587911941346" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-dark transition-all border border-white/10">
                                <Facebook size={20} />
                            </a>
                            <a href="mailto:hashanmadushanka9122@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-primary-dark transition-all border border-white/10">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/work" className="hover:text-white transition-colors">Our Work</Link></li>
                            <li><Link href="/#services" className="hover:text-white transition-colors">Services</Link></li>
                            <li><Link href="/#products" className="hover:text-white transition-colors">Spare Parts</Link></li>
                            <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Services</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li>LED/LCD TV Repair</li>
                            <li>Digital Meter Diagnostics</li>
                            <li>Chip-Level Board Repair</li>
                            <li>Panel Repair Services</li>
                            <li>Electronic Spare Parts</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Reach Us</h4>
                        <ul className="space-y-6 text-gray-400">
                            <li className="flex gap-3">
                                <MapPin className="text-primary shrink-0" size={20} />
                                <span>No 09, New Town, Welikanda, Polonnaruwa</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="text-primary shrink-0" size={20} />
                                <span>074 240 9092</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="text-primary shrink-0" size={20} />
                                <span className="break-all">hashanmadushanka9122 @gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} Hashan e solution. All rights reserved.</p>
                    <p>Developed by <a href="https://gappathum-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold transition-all">GAP-Pathum</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
