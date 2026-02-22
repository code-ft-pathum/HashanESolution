"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, ArrowRight, Wrench, Zap } from 'lucide-react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Appointment {
    id: string;
    userName: string;
    userEmail: string;
    userPhoto: string;
    date: string;
    time: string;
    issue: string;
    electricItem: string;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: Timestamp;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchAppointments = async () => {
            try {
                const q = query(
                    collection(db, 'appointments'),
                    where('userId', '==', user.uid)
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Appointment[];

                // Sort in memory (newest first)
                data.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis() || 0;
                    const timeB = b.createdAt?.toMillis() || 0;
                    return timeB - timeA;
                });

                setAppointments(data);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [user]);

    const statusCounts = {
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        inProgress: appointments.filter(a => a.status === 'in-progress').length,
        completed: appointments.filter(a => a.status === 'completed').length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'confirmed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'in-progress': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="glass-morphism rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        {user?.photoURL && (
                            <Image
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                width={56}
                                height={56}
                                className="rounded-2xl border-2 border-primary/30 shadow-lg shadow-primary/20"
                            />
                        )}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                Welcome back, <span className="text-gradient">{user?.displayName?.split(' ')[0]}</span>!
                            </h1>
                            <p className="text-gray-400 mt-1">{user?.email}</p>
                        </div>
                    </div>
                    <p className="text-gray-300 mt-2 max-w-xl">
                        Book appointments, track your repairs, and manage everything from your personal dashboard.
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/dashboard/book" className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Plus size={24} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Book Appointment</h3>
                                <p className="text-gray-400 text-sm">Schedule a new repair</p>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>

                <Link href="/dashboard/appointments" className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary/30 transition-all group cursor-pointer">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <Calendar size={24} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">My Appointments</h3>
                                <p className="text-gray-400 text-sm">View all your bookings</p>
                            </div>
                        </div>
                        <ArrowRight size={20} className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-morphism rounded-2xl p-5 border border-white/10 text-center">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center mx-auto mb-3">
                        <Clock size={20} className="text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</p>
                    <p className="text-gray-400 text-xs mt-1">Pending</p>
                </div>
                <div className="glass-morphism rounded-2xl p-5 border border-white/10 text-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle size={20} className="text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-blue-400">{statusCounts.confirmed}</p>
                    <p className="text-gray-400 text-xs mt-1">Confirmed</p>
                </div>
                <div className="glass-morphism rounded-2xl p-5 border border-white/10 text-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                        <Wrench size={20} className="text-orange-400" />
                    </div>
                    <p className="text-2xl font-bold text-orange-400">{statusCounts.inProgress}</p>
                    <p className="text-gray-400 text-xs mt-1">In Progress</p>
                </div>
                <div className="glass-morphism rounded-2xl p-5 border border-white/10 text-center">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={20} className="text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-green-400">{statusCounts.completed}</p>
                    <p className="text-gray-400 text-xs mt-1">Completed</p>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Zap size={20} className="text-primary" />
                        Recent Appointments
                    </h2>
                    <Link href="/dashboard/appointments" className="text-primary text-sm hover:underline">View All</Link>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading appointments...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
                        <p className="text-gray-400 mb-6">Book your first repair appointment now!</p>
                        <Link
                            href="/dashboard/book"
                            className="inline-flex items-center gap-2 bg-primary text-primary-dark px-6 py-3 rounded-xl font-bold hover:bg-white transition-all"
                        >
                            <Plus size={18} />
                            Book Now
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {appointments.slice(0, 5).map(apt => (
                            <div key={apt.id} className="p-5 hover:bg-white/5 transition-colors">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Wrench size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{apt.electricItem}</h3>
                                            <p className="text-gray-400 text-sm">{apt.issue}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{apt.date}</p>
                                            <p className="text-gray-400 text-xs">{apt.time}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
