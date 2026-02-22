"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
    Calendar, Users, Package, DollarSign, TrendingUp,
    Clock, CheckCircle, Wrench, AlertCircle, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Appointment {
    id: string;
    userName: string;
    userEmail: string;
    userPhoto: string;
    electricItem: string;
    issue: string;
    date: string;
    time: string;
    status: string;
    createdAt: Timestamp;
}

interface FinanceEntry {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    createdAt: Timestamp;
}

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [inventoryCount, setInventoryCount] = useState(0);
    const [finances, setFinances] = useState<FinanceEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch appointments
                const aptQuery = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
                const aptSnap = await getDocs(aptQuery);
                const aptData = aptSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Appointment[];
                setAppointments(aptData);

                // Fetch inventory count
                const invSnap = await getDocs(collection(db, 'inventory'));
                setInventoryCount(invSnap.size);

                // Fetch finances
                const finQuery = query(collection(db, 'finances'), orderBy('createdAt', 'desc'));
                const finSnap = await getDocs(finQuery);
                const finData = finSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FinanceEntry[];
                setFinances(finData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalIncome = finances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
    const totalExpense = finances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
    const pendingCount = appointments.filter(a => a.status === 'pending').length;
    const todayCount = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

    const stats = [
        { label: 'Total Appointments', value: appointments.length, icon: Calendar, color: 'text-blue-400 bg-blue-500/10', href: '/admin/appointments' },
        { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'text-yellow-400 bg-yellow-500/10', href: '/admin/appointments' },
        { label: 'Inventory Items', value: inventoryCount, icon: Package, color: 'text-purple-400 bg-purple-500/10', href: '/admin/inventory' },
        { label: 'Net Revenue', value: `Rs. ${(totalIncome - totalExpense).toLocaleString()}`, icon: DollarSign, color: 'text-green-400 bg-green-500/10', href: '/admin/finances' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Admin <span className="text-gradient">Dashboard</span>
                </h1>
                <p className="text-gray-400 mt-1">Overview of your business operations</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                    <Link key={stat.label} href={stat.href} className="glass-morphism rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <ArrowUpRight size={16} className="text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                    </Link>
                ))}
            </div>

            {/* Quick Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Appointments */}
                <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-bold flex items-center gap-2">
                            <Calendar size={18} className="text-primary" />
                            Recent Appointments
                        </h2>
                        <Link href="/admin/appointments" className="text-primary text-sm hover:underline">View All</Link>
                    </div>
                    {appointments.length === 0 ? (
                        <div className="p-10 text-center">
                            <Calendar size={36} className="mx-auto text-gray-600 mb-3" />
                            <p className="text-gray-400">No appointments yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {appointments.slice(0, 5).map(apt => (
                                <div key={apt.id} className="p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {apt.userPhoto ? (
                                            <Image src={apt.userPhoto} alt={apt.userName} width={36} height={36} className="rounded-full" />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Users size={16} className="text-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{apt.userName}</p>
                                            <p className="text-gray-400 text-xs truncate">{apt.electricItem} - {apt.issue}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">{apt.date}</p>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${apt.status === 'pending' ? 'text-yellow-400 bg-yellow-500/10'
                                                : apt.status === 'confirmed' ? 'text-blue-400 bg-blue-500/10'
                                                    : apt.status === 'in-progress' ? 'text-orange-400 bg-orange-500/10'
                                                        : apt.status === 'completed' ? 'text-green-400 bg-green-500/10'
                                                            : 'text-red-400 bg-red-500/10'
                                                }`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                    {/* Today's Summary */}
                    <div className="glass-morphism rounded-3xl border border-white/10 p-6">
                        <h2 className="font-bold flex items-center gap-2 mb-4">
                            <TrendingUp size={18} className="text-primary" />
                            Today&apos;s Summary
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-blue-400">{todayCount}</p>
                                <p className="text-gray-400 text-xs mt-1">Today&apos;s Appointments</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
                                <p className="text-gray-400 text-xs mt-1">Awaiting Review</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-green-400">Rs. {totalIncome.toLocaleString()}</p>
                                <p className="text-gray-400 text-xs mt-1">Total Income</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold text-red-400">Rs. {totalExpense.toLocaleString()}</p>
                                <p className="text-gray-400 text-xs mt-1">Total Expenses</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="glass-morphism rounded-3xl border border-white/10 p-6">
                        <h2 className="font-bold flex items-center gap-2 mb-4">
                            <Wrench size={18} className="text-primary" />
                            Appointment Status
                        </h2>
                        <div className="space-y-3">
                            {[
                                { label: 'Pending', count: appointments.filter(a => a.status === 'pending').length, color: 'bg-yellow-400', icon: Clock },
                                { label: 'Confirmed', count: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-blue-400', icon: AlertCircle },
                                { label: 'In Progress', count: appointments.filter(a => a.status === 'in-progress').length, color: 'bg-orange-400', icon: Wrench },
                                { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'bg-green-400', icon: CheckCircle },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <item.icon size={16} className={`${item.color.replace('bg-', 'text-')}`} />
                                    <span className="text-sm text-gray-300 flex-1">{item.label}</span>
                                    <span className="text-sm font-bold">{item.count}</span>
                                    <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all`}
                                            style={{ width: `${appointments.length > 0 ? (item.count / appointments.length) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
