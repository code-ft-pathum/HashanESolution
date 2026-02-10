import React from 'react';
import { Tv, Gauge, CircuitBoard, ChevronRight } from 'lucide-react';

const services = [
    {
        title: "LED/LCD TV Repair",
        description: "Expert chip-level and panel repair for all major TV brands. We fix display issues, power failures, and mainboard faults with precision.",
        icon: Tv,
        color: "bg-blue-500",
    },
    {
        title: "Digital Meter Repair",
        description: "Advanced diagnostics and repair for digital clusters and meters. Reliable solutions for vehicle electronics and industrial displays.",
        icon: Gauge,
        color: "bg-indigo-500",
    },
    {
        title: "General Electronics",
        description: "Comprehensive repair services for all electronic items and supply of high-quality genuine spare parts for various devices.",
        icon: CircuitBoard,
        color: "bg-blue-600",
    }
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4">Our Expertise</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">Premium Repair Services</h3>
                    <p className="max-w-2xl mx-auto text-gray-600 text-lg">
                        We provide professional chip-level electronics repair services using state-of-the-art diagnostic equipment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110" />

                            <div className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg transition-transform group-hover:rotate-12`}>
                                <service.icon size={32} />
                            </div>

                            <h4 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h4>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {service.description}
                            </p>

                            <a
                                href="#contact"
                                className="flex items-center gap-2 text-primary font-bold group/link"
                            >
                                Learn More
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
