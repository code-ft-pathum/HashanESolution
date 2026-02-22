"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import {
    Calendar, Clock, Wrench, MessageSquare, ArrowLeft, CheckCircle,
    Tv, Gauge, Refrigerator, Zap, ChevronDown
} from 'lucide-react';
import Link from 'next/link';

const electricItems = [
    { category: "TVs", icon: Tv, items: ["LED TV", "LCD TV", "Smart TV", "OLED TV", "CRT TV"] },
    { category: "Digital Meters", icon: Gauge, items: ["Pulsar 150 Meter", "Pulsar 180 Meter", "Pulsar 220 Meter", "NS200 Meter", "Apache Meter", "Yamaha FZ Meter", "Honda CB Meter", "Other Bike Meter"] },
    { category: "Home Appliances", icon: Refrigerator, items: ["Refrigerator", "Microwave Oven", "Rice Cooker", "Blender", "Iron", "Washing Machine", "Air Conditioner", "Vacuum Cleaner", "Electric Kettle"] },
    { category: "Other Electronics", icon: Zap, items: ["Amplifier", "DVD/Blu-ray Player", "Sound System", "UPS/Inverter", "Other"] },
];

const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM",
];

export default function BookAppointmentPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        electricItem: '',
        itemCategory: '',
        issue: '',
        date: '',
        time: '',
        phone: '',
        additionalNotes: '',
    });

    const handleItemSelect = (category: string, item: string) => {
        setFormData(prev => ({ ...prev, electricItem: item, itemCategory: category }));
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'appointments'), {
                userId: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                userPhoto: user.photoURL,
                electricItem: formData.electricItem,
                itemCategory: formData.itemCategory,
                issue: formData.issue,
                date: formData.date,
                time: formData.time,
                phone: formData.phone,
                additionalNotes: formData.additionalNotes,
                status: 'pending',
                createdAt: serverTimestamp(),
            });
            setSuccess(true);
            toast.success('Appointment booked successfully!');
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error('Failed to book appointment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="glass-morphism rounded-3xl p-10 border border-white/10 text-center max-w-md w-full animate-fade-in-up">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Appointment Booked!</h2>
                    <p className="text-gray-400 mb-2">Your repair appointment has been scheduled successfully.</p>
                    <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Item:</span>
                            <span className="font-medium">{formData.electricItem}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Date:</span>
                            <span className="font-medium">{formData.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Time:</span>
                            <span className="font-medium">{formData.time}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="text-yellow-400 font-medium">Pending Review</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/appointments"
                            className="flex-1 bg-primary text-primary-dark px-6 py-3 rounded-xl font-bold hover:bg-white transition-all text-center"
                        >
                            View Appointments
                        </Link>
                        <button
                            onClick={() => { setSuccess(false); setStep(1); setFormData({ electricItem: '', itemCategory: '', issue: '', date: '', time: '', phone: '', additionalNotes: '' }); }}
                            className="flex-1 bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                        >
                            Book Another
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-4 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-white">
                    Book an <span className="text-gradient">Appointment</span>
                </h1>
                <p className="text-gray-400 mt-2">Fill in the details to schedule your repair</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map(s => (
                    <React.Fragment key={s}>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold transition-all ${step >= s
                            ? 'bg-primary border-primary text-primary-dark'
                            : 'border-white/20 text-gray-500'
                            }`}>
                            {step > s ? <CheckCircle size={18} /> : s}
                        </div>
                        {s < 3 && (
                            <div className={`flex-1 h-0.5 transition-all ${step > s ? 'bg-primary' : 'bg-white/10'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step 1: Select Item */}
            {step === 1 && (
                <div className="glass-morphism rounded-3xl p-6 sm:p-10 border border-white/10 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Wrench size={32} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">What needs repair?</h2>
                        <p className="text-gray-400 text-sm">Select the electronic item that needs to be fixed</p>
                    </div>

                    {!selectedCategory ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {electricItems.map(category => (
                                <button
                                    key={category.category}
                                    onClick={() => setSelectedCategory(category.category)}
                                    className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:border-primary/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 group"
                                >
                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary/20 group-hover:text-primary">
                                        <category.icon size={28} className="text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <span className="font-bold text-center text-sm">{category.category}</span>
                                    <span className="text-xs text-gray-500 mt-1">{category.items.length} items</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <button onClick={() => setSelectedCategory(null)} className="text-sm font-medium text-gray-400 hover:text-primary mb-6 flex items-center gap-2 group bg-white/5 px-4 py-2 rounded-full w-fit hover:bg-primary/10 border border-transparent hover:border-primary/30 transition-all">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Categories
                            </button>
                            <h3 className="text-xl font-bold mb-4">{selectedCategory}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {electricItems.find(c => c.category === selectedCategory)?.items.map(item => (
                                    <button
                                        key={item}
                                        onClick={() => handleItemSelect(selectedCategory, item)}
                                        className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all hover:scale-[1.02] bg-white/5 border-white/10 text-gray-300 hover:bg-primary/10 hover:border-primary/50 hover:text-white hover:shadow-lg hover:shadow-primary/10 group`}
                                    >
                                        <span className="font-medium">{item}</span>
                                        <CheckCircle size={18} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Issue & Details */}
            {step === 2 && (
                <div className="glass-morphism rounded-3xl p-6 sm:p-10 border border-white/10 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={32} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Describe the Issue</h2>
                        <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-sm mt-2">
                            <span className="text-gray-400">Item:</span>
                            <span className="font-bold text-primary">{formData.electricItem}</span>
                            <button onClick={() => setStep(1)} className="ml-2 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md text-white transition-colors">Change</button>
                        </div>
                    </div>

                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-primary transition-colors">What&apos;s the problem? <span className="text-red-400">*</span></label>
                            <textarea
                                value={formData.issue}
                                onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
                                placeholder="Describe the issue you're experiencing (e.g., screen is flickering, no power...)"
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-primary transition-colors">Contact Phone Number <span className="text-red-400">*</span></label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="07X XXX XXXX"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono tracking-wide"
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-primary transition-colors">Additional Notes (Optional)</label>
                            <textarea
                                value={formData.additionalNotes}
                                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                                placeholder="Any additional information..."
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                            />
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-white/10">
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    if (!formData.issue || !formData.phone) {
                                        toast.error('Please fill in the required fields (Issue & Phone)');
                                        return;
                                    }
                                    setStep(3);
                                }}
                                className="flex-1 bg-gradient-to-r from-primary to-yellow-400 text-primary-dark rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
                            >
                                Continue to Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
                <form onSubmit={handleSubmit} className="glass-morphism rounded-3xl p-6 sm:p-10 border border-white/10 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} className="text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Pick a Date & Time</h2>
                        <p className="text-gray-400 text-sm">Choose your preferred appointment slot</p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-8">
                        {/* Selected info Summary */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                            <div>
                                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Repairing Item</p>
                                <p className="font-bold text-white text-lg">{formData.electricItem}</p>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
                            <div className="flex-1">
                                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Declared Issue</p>
                                <p className="text-sm text-gray-300 line-clamp-2">{formData.issue}</p>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-medium text-gray-400 mb-3 group-focus-within:text-primary transition-colors">
                                <Calendar size={16} className="inline mr-2 -mt-0.5" />
                                Select Date <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, time: '' }))}
                                min={today}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-primary/50 focus:bg-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all [color-scheme:dark] text-lg cursor-pointer"
                                required
                            />
                        </div>

                        {formData.date && (
                            <div className="animate-fade-in-up">
                                <label className="block text-sm font-medium text-gray-400 mb-4">
                                    <Clock size={16} className="inline mr-2 -mt-0.5" />
                                    Select Time <span className="text-red-400">*</span>
                                </label>

                                <div className="space-y-6 flex flex-col sm:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex-1 h-px bg-white/10"></div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Morning</p>
                                            <div className="flex-1 h-px bg-white/10"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {timeSlots.filter(t => t.includes('AM')).map(slot => (
                                                <button
                                                    type="button"
                                                    key={slot}
                                                    onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                                                    className={`px-3 py-3 rounded-xl text-sm font-bold border transition-all hover:scale-[1.03] ${formData.time === slot
                                                        ? 'bg-primary text-primary-dark border-primary shadow-lg shadow-primary/20'
                                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white'
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex-1 h-px bg-white/10"></div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">Afternoon</p>
                                            <div className="flex-1 h-px bg-white/10"></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {timeSlots.filter(t => t.includes('PM')).map(slot => (
                                                <button
                                                    type="button"
                                                    key={slot}
                                                    onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                                                    className={`px-3 py-3 rounded-xl text-sm font-bold border transition-all hover:scale-[1.03] ${formData.time === slot
                                                        ? 'bg-primary text-primary-dark border-primary shadow-lg shadow-primary/20'
                                                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white'
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-6 mt-8 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.date || !formData.time}
                                className="flex-1 bg-gradient-to-r from-primary to-yellow-400 text-primary-dark rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin" />
                                        Confirming...
                                    </div>
                                ) : (
                                    'Confirm & Book Appointment'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
