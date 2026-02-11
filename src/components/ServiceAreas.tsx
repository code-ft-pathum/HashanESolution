import React from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';

const areas = [
    "Welikanda (Primary)",
    "Polonnaruwa Town",
    "Manampitiya",
    "Aralaganwila",
    "Dimbulagala"
];

const ServiceAreas = () => {
    return (
        <section className="py-24 bg-primary-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Location Coverage</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-8 font-poppins">Proudly Serving Polonnaruwa & Beyond</h3>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            Based in Welikanda, we extend our expert electronic repair services to various key areas across the Polonnaruwa district. Whether you're in the town center or surrounding villages, we're here to help.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {areas.map((area, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 group transition-all hover:bg-white/10">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <MapPin size={20} />
                                    </div>
                                    <span className="font-semibold text-white">{area}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 p-6 rounded-3xl bg-surface text-white">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                                <CheckCircle2 size={24} className="text-whatsapp" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-primary">On-Site Service Available</p>
                                <p className="text-gray-400 text-sm">For selected TV panel repairs in the local area.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/5 group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15797.108200679803!2d81.1091523!3d7.9250024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4402660144f8f%3A0x6a05327292211425!2sWelikanda!5e0!3m2!1sen!2slk!4v1701000000000!5m2!1sen!2slk"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceAreas;
