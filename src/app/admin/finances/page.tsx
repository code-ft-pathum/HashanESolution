"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import {
    DollarSign, TrendingUp, TrendingDown, Plus, Search, Filter,
    Trash2, X, ArrowUpRight, ArrowDownRight, Wallet, PieChart,
    Calendar, Save
} from 'lucide-react';

interface FinanceEntry {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
    date: string;
    reference: string;
    createdAt: Timestamp;
}

const incomeCategories = ['Repair Service', 'Parts Sale', 'Consultation', 'Warranty', 'Other Income'];
const expenseCategories = ['Parts Purchase', 'Tools & Equipment', 'Rent', 'Electricity', 'Transport', 'Salary', 'Marketing', 'Other Expense'];

export default function FinancesPage() {
    const [entries, setEntries] = useState<FinanceEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
    const [dateFilter, setDateFilter] = useState('');

    const [formData, setFormData] = useState({
        type: 'income' as 'income' | 'expense',
        amount: 0,
        description: '',
        category: 'Repair Service',
        date: new Date().toISOString().split('T')[0],
        reference: '',
    });

    const fetchEntries = async () => {
        try {
            const q = query(collection(db, 'finances'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FinanceEntry[];
            setEntries(data);
        } catch (error) {
            console.error("Error fetching finances:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'finances'), {
                ...formData,
                createdAt: serverTimestamp(),
            });
            toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} added!`);
            setShowAddForm(false);
            setFormData({
                type: 'income', amount: 0, description: '', category: 'Repair Service',
                date: new Date().toISOString().split('T')[0], reference: ''
            });
            fetchEntries();
        } catch (error) {
            console.error("Error adding entry:", error);
            toast.error('Failed to add entry');
        }
    };

    const handleDelete = async (entryId: string) => {
        if (!confirm('Delete this finance entry?')) return;
        try {
            await deleteDoc(doc(db, 'finances', entryId));
            setEntries(prev => prev.filter(e => e.id !== entryId));
            toast.success('Entry deleted');
        } catch (error) {
            console.error("Error deleting:", error);
            toast.error('Failed to delete');
        }
    };

    const totalIncome = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const totalExpense = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const netProfit = totalIncome - totalExpense;

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = !searchTerm ||
            entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || entry.type === typeFilter;
        const matchesDate = !dateFilter || entry.date === dateFilter;
        return matchesSearch && matchesType && matchesDate;
    });

    // Monthly totals for mini chart
    const monthlyData = entries.reduce((acc, entry) => {
        const month = entry.date?.slice(0, 7) || 'Unknown';
        if (!acc[month]) acc[month] = { income: 0, expense: 0 };
        if (entry.type === 'income') acc[month].income += entry.amount;
        else acc[month].expense += entry.amount;
        return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl text-white font-bold">
                        <span className="text-gradient">Finance</span> Manager
                    </h1>
                    <p className="text-gray-400 mt-1">Track income, expenses, and profits</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex sm:inline-flex items-center justify-center gap-2 bg-primary text-primary-dark px-5 py-3 rounded-xl font-bold hover:bg-white transition-all text-sm w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Entry
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-morphism rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <TrendingUp size={20} className="text-green-400" />
                        </div>
                        <ArrowUpRight size={16} className="text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-green-400">Rs. {totalIncome.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm mt-1">Total Income</p>
                </div>

                <div className="glass-morphism rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <TrendingDown size={20} className="text-red-400" />
                        </div>
                        <ArrowDownRight size={16} className="text-red-400" />
                    </div>
                    <p className="text-2xl font-bold text-red-400">Rs. {totalExpense.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm mt-1">Total Expenses</p>
                </div>

                <div className="glass-morphism rounded-2xl p-5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${netProfit >= 0 ? 'bg-primary/10' : 'bg-red-500/10'}`}>
                            <Wallet size={20} className={netProfit >= 0 ? 'text-primary' : 'text-red-400'} />
                        </div>
                        <PieChart size={16} className="text-gray-600" />
                    </div>
                    <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-primary' : 'text-red-400'}`}>
                        Rs. {netProfit.toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">Net Profit</p>
                </div>
            </div>

            {/* Monthly Summary */}
            {Object.keys(monthlyData).length > 0 && (
                <div className="glass-morphism rounded-3xl border border-white/10 p-6">
                    <h2 className="font-bold flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-primary" />
                        Monthly Summary
                    </h2>
                    <div className="space-y-3">
                        {Object.entries(monthlyData).slice(0, 6).map(([month, data]) => (
                            <div key={month} className="flex items-center gap-4">
                                <span className="text-sm text-gray-400 w-20">{month}</span>
                                <div className="flex-1 flex items-center gap-2">
                                    <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-green-500/60 rounded-l-full"
                                            style={{ width: `${(data.income / Math.max(data.income + data.expense, 1)) * 100}%` }}
                                        />
                                        <div
                                            className="h-full bg-red-500/60 rounded-r-full"
                                            style={{ width: `${(data.expense / Math.max(data.income + data.expense, 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-green-400">+Rs.{data.income.toLocaleString()}</span>
                                    <span className="text-red-400">-Rs.{data.expense.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Form */}
            {showAddForm && (
                <form onSubmit={handleAdd} className="glass-morphism rounded-2xl p-6 border border-white/10 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">Add Finance Entry</h2>
                        <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Type Toggle */}
                    <div className="flex gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'Repair Service' }))}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border transition-all ${formData.type === 'income'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-white/5 border-white/10 text-gray-400'
                                }`}
                        >
                            <TrendingUp size={16} />
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: 'Parts Purchase' }))}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm border transition-all ${formData.type === 'expense'
                                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                : 'bg-white/5 border-white/10 text-gray-400'
                                }`}
                        >
                            <TrendingDown size={16} />
                            Expense
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Amount (Rs.) *</label>
                            <input
                                type="number"
                                value={formData.amount || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                                required min={1}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none [color-scheme:dark]"
                            >
                                {(formData.type === 'income' ? incomeCategories : expenseCategories).map(c => (
                                    <option key={c} value={c} className="bg-gray-900 text-white">{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none [color-scheme:dark]"
                                required
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">Description *</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Brief description of the transaction..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Reference / Invoice</label>
                            <input
                                type="text"
                                value={formData.reference}
                                onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                                placeholder="INV-001"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className={`mt-6 flex sm:inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm w-full sm:w-auto transition-all ${formData.type === 'income'
                            ? 'bg-green-500 text-white hover:bg-green-400'
                            : 'bg-red-500 text-white hover:bg-red-400'
                            }`}
                    >
                        <Save size={16} />
                        Add {formData.type === 'income' ? 'Income' : 'Expense'}
                    </button>
                </form>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search entries..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setTypeFilter('all')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${typeFilter === 'all' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-gray-400 border-white/10'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setTypeFilter('income')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${typeFilter === 'income' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}
                    >
                        Income
                    </button>
                    <button
                        onClick={() => setTypeFilter('expense')}
                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${typeFilter === 'expense' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-gray-400 border-white/10'}`}
                    >
                        Expenses
                    </button>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none [color-scheme:dark]"
                    />
                </div>
            </div>

            {/* Entries List */}
            {loading ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading finances...</p>
                </div>
            ) : filteredEntries.length === 0 ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <DollarSign size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No entries found</h3>
                    <p className="text-gray-400">Start tracking your finances by adding entries</p>
                </div>
            ) : (
                <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {filteredEntries.map(entry => (
                            <div key={entry.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${entry.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                                    }`}>
                                    {entry.type === 'income' ? (
                                        <ArrowUpRight size={18} className="text-green-400" />
                                    ) : (
                                        <ArrowDownRight size={18} className="text-red-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-sm">{entry.description}</h3>
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{entry.category}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-0.5">
                                        <span className="text-gray-500 text-xs">{entry.date}</span>
                                        {entry.reference && <span className="text-gray-500 text-xs">• Ref: {entry.reference}</span>}
                                    </div>
                                </div>
                                <p className={`font-bold text-sm ${entry.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                                    {entry.type === 'income' ? '+' : '-'}Rs. {entry.amount.toLocaleString()}
                                </p>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
