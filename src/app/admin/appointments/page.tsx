"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import Image from 'next/image';
import {
    Calendar, Clock, Wrench, Users, Search, Filter, Trash2,
    CheckCircle, AlertCircle, XCircle, MessageSquare, Phone,
    Mail, ChevronDown, ChevronUp, DollarSign, Save
} from 'lucide-react';

interface Appointment {
    id: string;
    userId: string;
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

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
    { value: 'confirmed', label: 'Confirmed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { value: 'in-progress', label: 'In Progress', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { value: 'completed', label: 'Completed', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
];

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
    const [editingCost, setEditingCost] = useState<Record<string, string>>({});

    const fetchAppointments = async () => {
        try {
            const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleStatusChange = async (aptId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'appointments', aptId), { status: newStatus });
            setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, status: newStatus as Appointment['status'] } : a));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error('Failed to update status');
        }
    };

    const handleSaveNotes = async (aptId: string) => {
        try {
            const updates: Record<string, unknown> = {};
            if (editingNotes[aptId] !== undefined) updates.adminNotes = editingNotes[aptId];
            if (editingCost[aptId] !== undefined) updates.estimatedCost = Number(editingCost[aptId]) || 0;

            await updateDoc(doc(db, 'appointments', aptId), updates);
            setAppointments(prev => prev.map(a => a.id === aptId ? {
                ...a,
                adminNotes: editingNotes[aptId] ?? a.adminNotes,
                estimatedCost: editingCost[aptId] !== undefined ? Number(editingCost[aptId]) : a.estimatedCost,
            } : a));
            toast.success('Appointment updated');
        } catch (error) {
            console.error("Error saving:", error);
            toast.error('Failed to save');
        }
    };

    const handleDelete = async (aptId: string) => {
        if (!confirm('Are you sure you want to delete this appointment?')) return;
        try {
            await deleteDoc(doc(db, 'appointments', aptId));
            setAppointments(prev => prev.filter(a => a.id !== aptId));
            toast.success('Appointment deleted');
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error('Failed to delete');
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = !searchTerm ||
            apt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.electricItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.issue.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Appointment <span className="text-gradient">Manager</span>
                </h1>
                <p className="text-gray-400 mt-1">{appointments.length} total appointments</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, item..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    <Filter size={16} className="text-gray-500 flex-shrink-0" />
                    {['all', ...statusOptions.map(s => s.value)].map(f => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap border transition-all ${statusFilter === f
                                ? 'bg-primary/10 text-primary border-primary/20'
                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading appointments...</p>
                </div>
            ) : filteredAppointments.length === 0 ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                    <p className="text-gray-400">
                        {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Appointments will appear here when customers book'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAppointments.map(apt => {
                        const isExpanded = expandedId === apt.id;
                        const statusInfo = statusOptions.find(s => s.value === apt.status) || statusOptions[0];

                        return (
                            <div key={apt.id} className="glass-morphism rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all">
                                {/* Header Row */}
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => setExpandedId(isExpanded ? null : apt.id)}
                                >
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {/* User Avatar */}
                                        {apt.userPhoto ? (
                                            <Image src={apt.userPhoto} alt={apt.userName} width={44} height={44} className="rounded-full border-2 border-white/10" />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Users size={18} className="text-primary" />
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold">{apt.userName}</h3>
                                                <span className="text-gray-500 text-xs">•</span>
                                                <span className="text-primary text-sm font-medium">{apt.electricItem}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm truncate">{apt.issue}</p>
                                        </div>

                                        {/* Date & Status */}
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-medium flex items-center gap-1 justify-end">
                                                    <Calendar size={14} className="text-gray-500" />
                                                    {apt.date}
                                                </p>
                                                <p className="text-gray-500 text-xs">{apt.time}</p>
                                            </div>
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            {isExpanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 border-t border-white/5 animate-fade-in-up">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                            {/* Customer Info */}
                                            <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                                <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                                                    <Users size={14} />
                                                    Customer Info
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="text-gray-500" />
                                                        <span className="text-gray-300 truncate">{apt.userEmail}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-gray-500" />
                                                        <span className="text-gray-300">{apt.phone}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Repair Details */}
                                            <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                                <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                                                    <Wrench size={14} />
                                                    Repair Details
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Category:</span>
                                                        <span>{apt.itemCategory}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Item:</span>
                                                        <span className="text-primary">{apt.electricItem}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Issue:</span>
                                                        <p className="mt-1 text-gray-200">{apt.issue}</p>
                                                    </div>
                                                    {apt.additionalNotes && (
                                                        <div>
                                                            <span className="text-gray-400">Customer Notes:</span>
                                                            <p className="mt-1 text-gray-300 text-xs">{apt.additionalNotes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Admin Controls */}
                                            <div className="bg-white/5 rounded-xl p-4 space-y-3">
                                                <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                                                    <MessageSquare size={14} />
                                                    Admin Controls
                                                </h4>
                                                <div className="space-y-3">
                                                    {/* Status Changer */}
                                                    <div>
                                                        <label className="text-xs text-gray-400 mb-1 block">Status</label>
                                                        <select
                                                            value={apt.status}
                                                            onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none [color-scheme:dark]"
                                                        >
                                                            {statusOptions.map(opt => (
                                                                <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">{opt.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Estimated Cost */}
                                                    <div>
                                                        <label className="text-xs text-gray-400 mb-1 block flex items-center gap-1">
                                                            <DollarSign size={10} />
                                                            Estimated Cost (Rs.)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            defaultValue={apt.estimatedCost || ''}
                                                            onChange={(e) => setEditingCost(prev => ({ ...prev, [apt.id]: e.target.value }))}
                                                            placeholder="0"
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* Admin Notes */}
                                                    <div>
                                                        <label className="text-xs text-gray-400 mb-1 block">Admin Notes</label>
                                                        <textarea
                                                            defaultValue={apt.adminNotes || ''}
                                                            onChange={(e) => setEditingNotes(prev => ({ ...prev, [apt.id]: e.target.value }))}
                                                            rows={2}
                                                            placeholder="Add notes for the customer..."
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none resize-none"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleSaveNotes(apt.id)}
                                                            className="flex-1 flex items-center justify-center gap-1 bg-primary/10 text-primary border border-primary/20 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-all"
                                                        >
                                                            <Save size={14} />
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(apt.id)}
                                                            className="flex items-center justify-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
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
