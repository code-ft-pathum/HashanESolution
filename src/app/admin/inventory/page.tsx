"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import {
    Package, Plus, Search, Edit3, Trash2, Save, X,
    AlertTriangle, CheckCircle, Filter, ArrowUpDown
} from 'lucide-react';

interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    minQuantity: number;
    unitPrice: number;
    supplier: string;
    description: string;
    imageUrl?: string;
    createdAt: Timestamp;
}

const categories = [
    'TV Parts', 'Digital Meter Parts', 'Capacitors', 'Resistors', 'ICs & Chips',
    'Connectors', 'Cables', 'Display Panels', 'Power Supplies', 'Tools', 'Other'
];

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'unitPrice'>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const [formData, setFormData] = useState({
        name: '', category: 'TV Parts', quantity: 0, minQuantity: 5,
        unitPrice: 0, supplier: '', description: '', imageUrl: ''
    });

    const fetchItems = async () => {
        try {
            const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InventoryItem[];
            setItems(data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'inventory'), {
                ...formData,
                createdAt: serverTimestamp(),
            });
            toast.success('Item added to inventory');
            setShowAddForm(false);
            setFormData({ name: '', category: 'TV Parts', quantity: 0, minQuantity: 5, unitPrice: 0, supplier: '', description: '', imageUrl: '' });
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error('Failed to add item');
        }
    };

    const handleUpdate = async (itemId: string) => {
        try {
            await updateDoc(doc(db, 'inventory', itemId), { ...formData });
            toast.success('Item updated');
            setEditingId(null);
            fetchItems();
        } catch (error) {
            console.error("Error updating item:", error);
            toast.error('Failed to update item');
        }
    };

    const handleDelete = async (itemId: string) => {
        if (!confirm('Delete this inventory item?')) return;
        try {
            await deleteDoc(doc(db, 'inventory', itemId));
            setItems(prev => prev.filter(i => i.id !== itemId));
            toast.success('Item deleted');
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error('Failed to delete');
        }
    };

    const startEditing = (item: InventoryItem) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            minQuantity: item.minQuantity,
            unitPrice: item.unitPrice,
            supplier: item.supplier,
            description: item.description,
            imageUrl: item.imageUrl || '',
        });
    };

    const filteredItems = items
        .filter(item => {
            const matchesSearch = !searchTerm ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            const modifier = sortDir === 'asc' ? 1 : -1;
            if (sortBy === 'name') return a.name.localeCompare(b.name) * modifier;
            if (sortBy === 'quantity') return (a.quantity - b.quantity) * modifier;
            return (a.unitPrice - b.unitPrice) * modifier;
        });

    const lowStockCount = items.filter(i => i.quantity <= i.minQuantity).length;
    const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl text-white font-bold">
                        <span className="text-gradient">Inventory</span> Manager
                    </h1>
                    <p className="text-gray-400 mt-1">{items.length} items • Total Value: Rs. {totalValue.toLocaleString()}</p>
                </div>
                <button
                    onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); }}
                    className="flex sm:inline-flex items-center justify-center gap-2 bg-primary text-primary-dark px-5 py-3 rounded-xl font-bold hover:bg-white transition-all text-sm w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Item
                </button>
            </div>

            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
                    <AlertTriangle size={20} className="text-red-400 flex-shrink-0" />
                    <p className="text-red-400 text-sm">
                        <span className="font-bold">{lowStockCount} item(s)</span> are running low on stock!
                    </p>
                </div>
            )}

            {/* Add/Edit Form */}
            {(showAddForm || editingId) && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (editingId) handleUpdate(editingId);
                        else handleAdd(e);
                    }}
                    className="glass-morphism rounded-2xl p-6 border border-white/10 animate-fade-in-up"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-lg">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
                        <button type="button" onClick={() => { setShowAddForm(false); setEditingId(null); }} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Item Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none [color-scheme:dark]"
                            >
                                {categories.map(c => <option key={c} value={c} className="bg-gray-900 text-white">{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Quantity *</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                                required min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Min Quantity (Alert)</label>
                            <input
                                type="number"
                                value={formData.minQuantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, minQuantity: Number(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Unit Price (Rs.)</label>
                            <input
                                type="number"
                                value={formData.unitPrice}
                                onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Supplier</label>
                            <input
                                type="text"
                                value={formData.supplier}
                                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                        <div className="sm:col-span-1 lg:col-span-1">
                            <label className="block text-xs text-gray-400 mb-1">Image URL (Optional)</label>
                            <input
                                type="url"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                placeholder="https://..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className="block text-xs text-gray-400 mb-1">Description</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-primary/50 focus:outline-none"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-6 flex sm:inline-flex items-center justify-center gap-2 bg-primary text-primary-dark px-6 py-3 rounded-xl font-bold hover:bg-white transition-all text-sm w-full sm:w-auto"
                    >
                        <Save size={16} />
                        {editingId ? 'Update Item' : 'Add Item'}
                    </button>
                </form>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search items..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    <Filter size={16} className="text-gray-500 flex-shrink-0" />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary/50 focus:outline-none [color-scheme:dark]"
                    >
                        <option value="all" className="bg-gray-900 text-white">All Categories</option>
                        {categories.map(c => <option key={c} value={c} className="bg-gray-900 text-white">{c}</option>)}
                    </select>
                    <button
                        onClick={() => {
                            if (sortDir === 'asc') setSortDir('desc');
                            else { setSortDir('asc'); setSortBy(sortBy === 'name' ? 'quantity' : sortBy === 'quantity' ? 'unitPrice' : 'name'); }
                        }}
                        className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white transition-all"
                    >
                        <ArrowUpDown size={14} />
                        {sortBy}
                    </button>
                </div>
            </div>

            {/* Inventory Grid */}
            {loading ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading inventory...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="glass-morphism rounded-3xl border border-white/10 p-16 text-center">
                    <Package size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No items found</h3>
                    <p className="text-gray-400">Add items to start tracking inventory</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map(item => {
                        const isLowStock = item.quantity <= item.minQuantity;
                        return (
                            <div key={item.id} className={`glass-morphism rounded-2xl border p-5 transition-all hover:border-white/20 ${isLowStock ? 'border-red-500/30' : 'border-white/10'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {item.imageUrl ? (
                                            <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden relative flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${isLowStock ? 'bg-red-500/10' : 'bg-primary/10'}`}>
                                                <Package size={20} className={isLowStock ? 'text-red-400' : 'text-primary'} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                                            <p className="text-gray-500 text-xs">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => startEditing(item)}
                                            className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Quantity:</span>
                                        <span className={`font-bold flex items-center gap-1 ${isLowStock ? 'text-red-400' : 'text-white'}`}>
                                            {isLowStock && <AlertTriangle size={12} />}
                                            {item.quantity}
                                            {isLowStock && <span className="text-xs font-normal">(Low)</span>}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Unit Price:</span>
                                        <span className="font-medium">Rs. {item.unitPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Value:</span>
                                        <span className="font-bold text-primary">Rs. {(item.quantity * item.unitPrice).toLocaleString()}</span>
                                    </div>
                                    {item.supplier && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Supplier:</span>
                                            <span className="text-gray-300 truncate ml-2 max-w-[120px]">{item.supplier}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Stock bar */}
                                <div className="mt-3">
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isLowStock ? 'bg-red-400' : 'bg-green-400'}`}
                                            style={{ width: `${Math.min((item.quantity / (item.minQuantity * 4)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
