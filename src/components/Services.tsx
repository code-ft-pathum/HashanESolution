import React from 'react';
import { Tv, Gauge, CircuitBoard, ChevronRight } from 'lucide-react';

const services = [
    {
        title: "LED/LCD TV Repair",
        description: "Expert chip-level and panel repair for all brands including Samsung, LG, Sony, Panasonic, TCL, Hisense, Singer, and Abans. We fix display issues, power failures, and mainboard faults with genuine parts.",
        tags: ["Samsung", "LG", "Sony", "TCL", "Panasonic"],
        icon: Tv,
        color: "bg-primary text-primary-dark",
    },
    {
        title: "Digital Meter Repair",
        description: "Specialized restoration for bike digital meters. Expert solutions for Bajaj Pulsar (150, 180, 220, NS), TVS Apache, Hero, and Yamaha FZ series. Fixed display fading, lighting, and circuit issues.",
        tags: ["Pulsar", "Apache", "Yamaha", "Hero"],
        icon: Gauge,
        color: "bg-primary text-primary-dark",
    },
    {
        title: "Home Electronics",
        description: "Reliable repair for all household items: Microwave Ovens, Refrigerators, Blenders, Rice Cookers, and Electric Irons. We restore your essential home appliances to perfect working condition.",
        tags: ["Ovens", "Fridges", "Blenders", "Cookers"],
        icon: CircuitBoard,
        color: "bg-primary text-primary-dark",
    }
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-primary-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Our Expertise</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 font-poppins">Premium Repair Center</h3>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg">
                        Specialized in high-tech electronics diagnostics and repair. From high-end TVs to precision bike meters, we fix it all.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-16 -mt-16 transition-all group-hover:scale-110" />

                            <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-12`}>
                                <service.icon size={32} />
                            </div>

                            <h4 className="text-2xl font-bold text-white mb-4">{service.title}</h4>
                            <p className="text-gray-400 mb-8 leading-relaxed flex-grow">
                                {service.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {service.tags.map((tag, i) => (
                                    <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <a
                                href="#contact"
                                className="flex items-center gap-2 text-primary font-bold group/link mt-auto"
                            >
                                Inquire Service
                                <ChevronRight size={18} className="transition-transform group-hover/link:translate-x-1" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
