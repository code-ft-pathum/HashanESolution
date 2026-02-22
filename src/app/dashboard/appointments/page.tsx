"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    Calendar, Clock, Wrench, Plus, ArrowLeft, Filter,
    CheckCircle, AlertCircle, XCircle, Loader2
} from 'lucide-react';

interface Appointment {
    id: string;
    userName: string;
    userEmail: string;
    userPhoto: string;
    electricItem: string;
    itemCategory: string;
    issue: string;
    date: string;
    time: string;
    phone: string;
    additionalNotes: string;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    adminNotes?: string;
    estimatedCost?: number;
    createdAt: Timestamp;
}

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    pending: { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', icon: Clock, label: 'Pending' },
    confirmed: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: AlertCircle, label: 'Confirmed' },
    'in-progress': { color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', icon: Wrench, label: 'In Progress' },
    completed: { color: 'text-green-400 bg-green-500/10 border-green-500/20', icon: CheckCircle, label: 'Completed' },
    cancelled: { color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Cancelled' },
};

export default function AppointmentsPage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleCancel = async (aptId: string) => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await updateDoc(doc(db, 'appointments', aptId), { status: 'cancelled' });
            setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: 'cancelled' } : a));
            toast.success('Appointment cancelled successfully');
        } catch (error) {
            console.error("Error cancelling:", error);
            toast.error('Failed to cancel appointment');
        }
    };

    useEffect(() => {
        if (!user) return;

        const fetchAppointments = async () => {
            try {
                // Fetch without orderBy to avoid Firebase missing composite index error
                const q = query(
                    collection(db, 'appointments'),
                    where('userId', '==', user.uid)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
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

    const filteredAppointments = filter === 'all'
        ? appointments
        : appointments.filter(a => a.status === filter);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-3 group text-sm">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white">
                        My <span className="text-gradient">Appointments</span>
                    </h1>
                    <p className="text-gray-400 mt-1">{appointments.length} total appointment(s)</p>
                </div>
                <Link
                    href="/dashboard/book"
                    className="inline-flex items-center gap-2 bg-primary text-primary-dark px-5 py-3 rounded-xl font-bold hover:bg-white transition-all text-sm"
                >
                    <Plus size={18} />
                    New Appointment
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter size={16} className="text-gray-500 flex-shrink-0" />
                {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all ${filter === f
                            ? 'bg-primary/10 text-primary border-primary/20'
                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                        {f !== 'all' && (
                            <span className="ml-1.5 text-xs opacity-60">
                                ({appointments.filter(a => a.status === f).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <Loader2 size={32} className="mx-auto text-primary animate-spin mb-4" />
                    <p className="text-gray-400">Loading your appointments...</p>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        {filter === 'all' ? 'No appointments yet' : `No ${filter} appointments`}
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {filter === 'all' ? 'Book your first repair appointment today!' : 'Try a different filter.'}
                    </p>
                    {filter === 'all' && (
                        <Link
                            href="/dashboard/book"
                            className="inline-flex items-center gap-2 bg-primary text-primary-dark px-6 py-3 rounded-xl font-bold hover:bg-white transition-all"
                        >
                            <Plus size={18} />
                            Book Now
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAppointments.map(apt => {
                        const statusInfo = statusConfig[apt.status] || statusConfig.pending;
                        const StatusIcon = statusInfo.icon;
                        const isExpanded = expandedId === apt.id;

                        return (
                            <div
                                key={apt.id}
                                className="glass-morphism rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
                            >
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : apt.id)}
                                    className="w-full p-5 text-left"
                                >
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Wrench size={22} className="text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{apt.electricItem}</h3>
                                                <p className="text-gray-400 text-sm line-clamp-1">{apt.issue}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium flex items-center gap-1">
                                                    <Calendar size={14} className="text-gray-500" />
                                                    {apt.date}
                                                </p>
                                                <p className="text-gray-400 text-xs flex items-center gap-1 justify-end">
                                                    <Clock size={12} />
                                                    {apt.time}
                                                </p>
                                            </div>
                                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                                                <StatusIcon size={12} />
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 pt-0 border-t border-white/5 animate-fade-in-up">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                            <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                                <h4 className="font-semibold text-sm text-primary">Repair Details</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Category:</span>
                                                        <span>{apt.itemCategory}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Item:</span>
                                                        <span>{apt.electricItem}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Issue:</span>
                                                        <p className="mt-1 text-gray-200">{apt.issue}</p>
                                                    </div>
                                                    {apt.additionalNotes && (
                                                        <div>
                                                            <span className="text-gray-400">Notes:</span>
                                                            <p className="mt-1 text-gray-200">{apt.additionalNotes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                                <h4 className="font-semibold text-sm text-primary">Appointment Info</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Date:</span>
                                                        <span>{apt.date}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Time:</span>
                                                        <span>{apt.time}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Phone:</span>
                                                        <span>{apt.phone}</span>
                                                    </div>
                                                    {apt.estimatedCost !== undefined && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Est. Cost:</span>
                                                            <span className="text-primary font-bold">Rs. {apt.estimatedCost.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {apt.adminNotes && (
                                                        <div>
                                                            <span className="text-gray-400">Admin Notes:</span>
                                                            <p className="mt-1 text-gray-200 bg-primary/5 rounded-lg p-2 border border-primary/10">{apt.adminNotes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {apt.status === 'pending' && (
                                                    <div className="mt-4 pt-4 border-t border-white/5">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleCancel(apt.id); }}
                                                            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl font-medium hover:bg-red-500/20 transition-all text-sm"
                                                        >
                                                            <XCircle size={16} />
                                                            Cancel Appointment
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
