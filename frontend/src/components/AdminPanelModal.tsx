import React, { useState, useEffect } from 'react';
import {
  X, LayoutDashboard, Users, ShoppingBag, Settings, Star,
  CheckCircle2, AlertCircle, Trash2, Edit3, DollarSign,
  TrendingUp, Clock, Plus, Search, RefreshCw, Check, Sparkles
} from 'lucide-react';
import { Talent, Booking, Category } from '../types';
import { api, AdminStats } from '../api';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  talents: Talent[];
  categories: Category[];
  currency: 'USD' | 'ETB';
  onTalentUpdated: () => void;
  onOpenJoinTalent: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  talents,
  categories,
  currency,
  onTalentUpdated,
  onOpenJoinTalent,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'talents' | 'bookings' | 'settings'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [talentSearch, setTalentSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [adminStats, allBookings] = await Promise.all([
        api.getAdminStats(),
        api.getBookings()
      ]);
      setStats(adminStats);
      setBookings(allBookings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateTalentQuick = async (id: string, updates: Partial<Talent>) => {
    try {
      await api.updateTalent(id, updates);
      setSaveSuccessMsg('Star updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
      onTalentUpdated();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update talent');
    }
  };

  const handleDeleteTalent = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.deleteTalent(id);
      onTalentUpdated();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete talent');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm(`Delete booking ${id}?`)) return;
    try {
      await api.deleteBooking(id);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete booking');
    }
  };

  const handleSaveTalentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTalent) return;
    try {
      await api.updateTalent(editingTalent.id, {
        name: editingTalent.name,
        title: editingTalent.title,
        bio: editingTalent.bio,
        price_video: editingTalent.price_video,
        price_live_call: editingTalent.price_live_call,
        verified: editingTalent.verified,
        featured: editingTalent.featured,
      });
      setSaveSuccessMsg('Star profile updated!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
      setEditingTalent(null);
      onTalentUpdated();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save edits');
    }
  };

  const formatMoney = (usd: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usd * 120);
      return `${etb.toLocaleString()} ETB`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const filteredTalents = talents.filter(
    (t) =>
      t.name.toLowerCase().includes(talentSearch.toLowerCase()) ||
      t.title.toLowerCase().includes(talentSearch.toLowerCase()) ||
      t.handle.toLowerCase().includes(talentSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus === 'all') return true;
    return b.status === bookingFilterStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-xs overflow-y-auto text-left">
      <div 
        className="relative w-full max-w-6xl bg-white border border-[#EAE4D7] rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Top Header */}
        <div className="px-6 py-5 border-b border-[#EAE4D7] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FDE047] text-[#181818] border border-[#E0DACE] flex items-center justify-center font-black text-sm shadow-xs">
              M&G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#181818] tracking-tight">Meet and Greet Admin Center</h2>
                <span className="text-[10px] uppercase font-bold bg-[#181818] text-white px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-[#666666]">Platform overview, creator directory, and order management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              title="Refresh data"
              className="p-2.5 rounded-full bg-white border border-[#E0DACE] text-[#555555] hover:text-[#181818] hover:bg-[#FAF7F2] transition shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close admin panel"
              className="w-9 h-9 rounded-full bg-white hover:bg-[#F0EBE1] border border-[#EAE4D7] text-[#666666] hover:text-[#181818] flex items-center justify-center transition shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#EAE4D7] bg-[#FAF7F2]/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[#181818] text-[#181818]'
                : 'border-transparent text-[#666666] hover:text-[#181818]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('talents')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'talents'
                ? 'border-[#181818] text-[#181818]'
                : 'border-transparent text-[#666666] hover:text-[#181818]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Stars ({talents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-[#181818] text-[#181818]'
                : 'border-transparent text-[#666666] hover:text-[#181818]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>All Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#181818] text-[#181818]'
                : 'border-transparent text-[#666666] hover:text-[#181818]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>App Settings</span>
          </button>
        </div>

        {/* Modal Body / Tab Views */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 bg-white">

          {/* 1. DASHBOARD OVERVIEW TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] shadow-xs">
                  <div className="flex items-center justify-between text-[#666666] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-black text-[#181818] block">
                    {formatMoney(stats?.totalRevenue || 0)}
                  </span>
                  <span className="text-[11px] text-[#777777] mt-1 block">Gross bookings volume</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] shadow-xs">
                  <div className="flex items-center justify-between text-[#666666] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                    <ShoppingBag className="w-4 h-4 text-[#181818]" />
                  </div>
                  <span className="text-2xl font-black text-[#181818] block">
                    {stats?.totalBookings || bookings.length}
                  </span>
                  <span className="text-[11px] text-[#777777] mt-1 block">Orders across all stars</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] shadow-xs">
                  <div className="flex items-center justify-between text-[#666666] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Registered Stars</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-2xl font-black text-[#181818] block">
                    {talents.length}
                  </span>
                  <span className="text-[11px] text-[#777777] mt-1 block">Musicians, athletes & creators</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] shadow-xs">
                  <div className="flex items-center justify-between text-[#666666] mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-2xl font-black text-[#181818] block">
                    {stats?.completedBookings || 0}
                  </span>
                  <span className="text-[11px] text-[#777777] mt-1 block">Delivered personalized videos</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EAE4D7] pb-3">
                  <h3 className="text-sm font-black text-[#181818]">Recent Booking Requests</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-[#181818] hover:underline font-bold"
                  >
                    View all orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-[#777777] border-b border-[#EAE4D7]">
                        <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]">Order ID</th>
                        <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]">Star</th>
                        <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]">Recipient</th>
                        <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]">Type</th>
                        <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]">Amount</th>
                        <th className="pb-2.5 font-bold uppercase tracking-wider text-[11px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE4D7]">
                      {bookings.slice(0, 5).map((b) => (
                        <tr key={b.id} className="hover:bg-white transition">
                          <td className="py-3 font-mono text-[#777777]">{b.id.slice(0, 8).toUpperCase()}</td>
                          <td className="py-3 font-bold text-[#181818]">{b.talent_name || b.talent_id}</td>
                          <td className="py-3 font-medium text-[#444444]">{b.recipient_name}</td>
                          <td className="py-3 capitalize text-[#666666]">{b.booking_type.replace('_', ' ')}</td>
                          <td className="py-3 font-black text-[#181818]">{formatMoney(b.total_price)}</td>
                          <td className="py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-[#E0DACE] capitalize text-[#181818] shadow-xs">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. STARS / TALENTS MANAGEMENT TAB */}
          {activeTab === 'talents' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={talentSearch}
                    onChange={(e) => setTalentSearch(e.target.value)}
                    placeholder="Search stars by name, handle, title..."
                    className="w-full pl-10 pr-3 py-2 bg-white border border-[#E0DACE] rounded-xl text-xs text-[#181818] placeholder-[#999999] focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenJoinTalent();
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll New Star</span>
                </button>
              </div>

              {/* Talents Table */}
              <div className="rounded-2xl bg-white border border-[#EAE4D7] overflow-x-auto shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-[#666666] border-b border-[#EAE4D7]">
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Star</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Title</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Video Price</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Live Call</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Rating</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Badges</th>
                      <th className="p-3.5 text-right font-bold uppercase tracking-wider text-[11px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D7]">
                    {filteredTalents.map((t) => (
                      <tr key={t.id} className="hover:bg-[#FAF7F2]/50 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={t.avatar_url || t.avatar} 
                              alt={t.name} 
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                              }}
                              className="w-9 h-9 rounded-xl object-cover border border-[#E0DACE]" 
                            />
                            <div>
                              <span className="font-black text-[#181818] block">{t.name}</span>
                              <span className="text-[11px] text-[#777777]">@{t.handle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-[#555555] max-w-[180px] truncate font-medium">{t.title}</td>
                        <td className="p-3.5 font-black text-[#181818]">${t.price_video}</td>
                        <td className="p-3.5 font-bold text-[#444444]">${t.price_live_call}</td>
                        <td className="p-3.5 text-amber-600 font-bold">★ {t.rating}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateTalentQuick(t.id, { verified: !t.verified })}
                              title="Toggle verified"
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                t.verified
                                  ? 'bg-[#181818] text-white border-[#181818]'
                                  : 'bg-white text-[#777777] border-[#E0DACE]'
                              }`}
                            >
                              Verified
                            </button>
                            <button
                              onClick={() => handleUpdateTalentQuick(t.id, { featured: !t.featured })}
                              title="Toggle featured"
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                t.featured
                                  ? 'bg-[#FDE047] text-[#181818] border-[#E0DACE]'
                                  : 'bg-white text-[#777777] border-[#E0DACE]'
                              }`}
                            >
                              Featured
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingTalent(t)}
                              className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#E0DACE] text-[#555555] hover:text-[#181818]"
                              title="Edit star"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTalent(t.id, t.name)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600"
                              title="Delete star"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. BOOKINGS MANAGEMENT TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Status Filter buttons */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['all', 'pending', 'in_progress', 'completed', 'declined'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border capitalize transition cursor-pointer ${
                      bookingFilterStatus === st
                        ? 'bg-[#181818] border-[#181818] text-white shadow-xs'
                        : 'bg-white border-[#E0DACE] text-[#666666] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Bookings Table */}
              <div className="rounded-2xl bg-white border border-[#EAE4D7] overflow-x-auto shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-[#666666] border-b border-[#EAE4D7]">
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Order ID</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Star</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Customer / Email</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Recipient & Occasion</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Amount</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider text-[11px]">Status</th>
                      <th className="p-3.5 text-right font-bold uppercase tracking-wider text-[11px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D7]">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF7F2]/50 transition">
                        <td className="p-3.5 font-mono text-[#777777]">{b.id.slice(0, 8).toUpperCase()}</td>
                        <td className="p-3.5 font-black text-[#181818]">{b.talent_name || b.talent_id}</td>
                        <td className="p-3.5">
                          <span className="text-[#181818] font-bold block">{b.customer_name}</span>
                          <span className="text-[11px] text-[#777777]">{b.customer_email}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[#181818] font-medium block">{b.recipient_name}</span>
                          <span className="text-[11px] text-[#888888] font-semibold">{b.occasion}</span>
                        </td>
                        <td className="p-3.5 font-black text-[#181818]">{formatMoney(b.total_price)}</td>
                        <td className="p-3.5">
                          <select
                            value={b.status}
                            onChange={async (e) => {
                              await api.updateBookingStatus(b.id, { status: e.target.value as any });
                              loadAdminData();
                            }}
                            className="bg-white border border-[#E0DACE] rounded-lg px-2 py-1 text-xs text-[#181818] capitalize focus:outline-none shadow-xs"
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="declined">Declined</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. APP SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-6">
              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE4D7] space-y-4 shadow-xs">
                <h3 className="text-sm font-black text-[#181818]">Application Identity & Infrastructure</h3>
                <div className="text-xs space-y-3 text-[#444444]">
                  <div className="flex justify-between py-1.5 border-b border-[#EAE4D7]">
                    <span className="text-[#777777] font-medium">Application Name:</span>
                    <span className="font-black text-[#181818]">Meet and Greet</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAE4D7]">
                    <span className="text-[#777777] font-medium">Platform Mode:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Dockerized Full-Stack</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAE4D7]">
                    <span className="text-[#777777] font-medium">Database Engine:</span>
                    <span className="font-mono font-bold text-[#181818]">PostgreSQL 16</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAE4D7]">
                    <span className="text-[#777777] font-medium">Backend API:</span>
                    <span className="font-mono text-[#181818]">http://localhost:5050</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#777777] font-medium">Frontend UI:</span>
                    <span className="font-mono text-[#181818]">http://localhost:3000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Edit Star Sub-Modal */}
        {editingTalent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <form onSubmit={handleSaveTalentEdit} className="w-full max-w-lg bg-white border border-[#EAE4D7] rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#EAE4D7] pb-3">
                <h3 className="text-base font-black text-[#181818]">Edit Star: {editingTalent.name}</h3>
                <button type="button" onClick={() => setEditingTalent(null)} className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#666666] hover:text-[#181818] flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#777777] block mb-1 font-bold">Name</label>
                  <input
                    type="text"
                    value={editingTalent.name}
                    onChange={(e) => setEditingTalent({ ...editingTalent, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
                  />
                </div>
                <div>
                  <label className="text-[#777777] block mb-1 font-bold">Title</label>
                  <input
                    type="text"
                    value={editingTalent.title}
                    onChange={(e) => setEditingTalent({ ...editingTalent, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[#777777] block mb-1 font-bold">Video Price ($)</label>
                  <input
                    type="number"
                    value={editingTalent.price_video}
                    onChange={(e) => setEditingTalent({ ...editingTalent, price_video: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
                  />
                </div>
                <div>
                  <label className="text-[#777777] block mb-1 font-bold">Live Meet Price ($)</label>
                  <input
                    type="number"
                    value={editingTalent.price_live_call}
                    onChange={(e) => setEditingTalent({ ...editingTalent, price_live_call: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="text-[#777777] block mb-1 font-bold">Bio</label>
                <textarea
                  rows={3}
                  value={editingTalent.bio}
                  onChange={(e) => setEditingTalent({ ...editingTalent, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
                />
              </div>

              <div className="flex items-center gap-4 text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#181818] font-bold">
                  <input
                    type="checkbox"
                    checked={editingTalent.verified}
                    onChange={(e) => setEditingTalent({ ...editingTalent, verified: e.target.checked })}
                    className="rounded border-[#DCD5C6] accent-[#181818]"
                  />
                  <span>Verified Badge</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[#181818] font-bold">
                  <input
                    type="checkbox"
                    checked={editingTalent.featured}
                    onChange={(e) => setEditingTalent({ ...editingTalent, featured: e.target.checked })}
                    className="rounded border-[#DCD5C6] accent-[#181818]"
                  />
                  <span>Featured Section</span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#EAE4D7] flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEditingTalent(null)}
                  className="px-5 py-2.5 rounded-full border border-[#E0DACE] text-[#555555] hover:bg-[#FAF7F2] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
