import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, ShoppingBag, Settings, Star,
  CheckCircle2, AlertCircle, Trash2, Edit3, DollarSign,
  TrendingUp, Clock, Plus, Search, RefreshCw, Check, Sparkles,
  ArrowRight, Video, PhoneCall, Flame, ShieldCheck, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Talent, Booking, Category, getTalentCategoryName } from '../types';
import { api, AdminStats } from '../api';

interface AdminPageProps {
  talents: Talent[];
  categories: Category[];
  currency: 'USD' | 'ETB';
  onTalentUpdated: () => void;
  onNavigateHome: () => void;
  onSelectTalent: (talent: Talent) => void;
}

const PHOTO_PRESETS = [
  { name: 'Teddy Afro', path: '/stars/teddy_afro.jpg', title: 'Legendary Singer & National Icon', catId: 1 },
  { name: 'Aster Aweke', path: '/stars/aster_aweke.jpg', title: 'Queen of Ethiopian Soul', catId: 1 },
  { name: 'Rophnan', path: '/stars/rophnan.jpg', title: 'Afro-Electronic Pioneer & Visionary DJ', catId: 1 },
  { name: 'Mahmoud Ahmed', path: '/stars/mahmoud_ahmed.jpg', title: 'Legendary Ethio-Jazz & Soul Pioneer', catId: 1 },
  { name: 'Mulatu Astatke', path: '/stars/mulatu_astatke.jpg', title: 'Father of Ethio-Jazz & International Maestro', catId: 6 },
  { name: 'Haile Gebrselassie', path: '/stars/haile_gebrselassie.jpg', title: '2x Olympic Champion & Marathon Legend', catId: 4 },
  { name: 'Kenenisa Bekele', path: '/stars/kenenisa_bekele.jpg', title: '3x Olympic Champion & Distance Running Legend', catId: 4 },
  { name: 'Derartu Tulu', path: '/stars/derartu_tulu.jpg', title: 'Olympic Gold Medalist & Athletics Pioneer', catId: 4 },
  { name: 'Tirunesh Dibaba', path: '/stars/tirunesh_dibaba.jpg', title: '3x Olympic Champion & World Record Legend', catId: 4 },
  { name: 'Meseret Defar', path: '/stars/meseret_defar.jpg', title: '2x Olympic 5000m Gold Champion', catId: 4 },
  { name: 'Selam Tesfaye', path: '/stars/selam_tesfaye.jpg', title: 'Top Ethiopian Film Star', catId: 2 },
  { name: 'Danayit Mekbib', path: '/stars/danayit_mekbib.jpg', title: 'Actress & TV Host Extraordinaire', catId: 2 },
  { name: 'Meklit Hadero', path: '/stars/meklit_hadero.jpg', title: 'Ethio-Jazz Vocalist & TED Senior Fellow', catId: 1 },
  { name: 'Bofem', path: '/stars/bofem.jpg', title: 'TikTok Comedy Creator', catId: 3 },
];

export const AdminPage: React.FC<AdminPageProps> = ({
  talents,
  categories,
  currency,
  onTalentUpdated,
  onNavigateHome,
  onSelectTalent,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'talents' | 'add_talent' | 'bookings' | 'settings'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [talentSearch, setTalentSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // New Celebrity Form State
  const [newTalent, setNewTalent] = useState({
    name: '',
    handle: '',
    title: '',
    category_id: categories[0]?.id || 1,
    bio: '',
    avatar_url: '/stars/teddy_afro.jpg',
    hero_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    price_video: 60,
    price_live_call: 150,
    response_time: '⚡ Within 24 hours',
    languages: 'Amharic, English',
    tags: 'Creator, Celebrity, Ethiopian Pride',
    verified: true,
    featured: true,
  });
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);
  const [createError, setCreateError] = useState('');

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatMoney = (usd: number) => {
    if (currency === 'ETB') {
      const etb = Math.round(usd * 120);
      return `${etb.toLocaleString()} ETB`;
    }
    return `$${usd.toLocaleString()}`;
  };

  const handleUpdateTalentQuick = async (id: string, updates: Partial<Talent>) => {
    try {
      await api.updateTalent(id, updates);
      setSaveSuccessMsg('Star badges updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
      onTalentUpdated();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update talent');
    }
  };

  const handleDeleteTalent = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove all their data.`)) return;
    try {
      await api.deleteTalent(id);
      setSaveSuccessMsg(`Star "${name}" deleted.`);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
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
        avatar_url: editingTalent.avatar_url,
        category_id: editingTalent.category_id,
        price_video: editingTalent.price_video,
        price_live_call: editingTalent.price_live_call,
        response_time: editingTalent.response_time,
        verified: editingTalent.verified,
        featured: editingTalent.featured,
      });
      setSaveSuccessMsg(`Profile for "${editingTalent.name}" updated!`);
      setTimeout(() => setSaveSuccessMsg(''), 3000);
      setEditingTalent(null);
      onTalentUpdated();
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save edits');
    }
  };

  const handleCreateCelebrity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newTalent.name.trim()) {
      setCreateError('Please enter celebrity name.');
      return;
    }
    if (!newTalent.handle.trim()) {
      setCreateError('Please enter stage handle/username.');
      return;
    }
    if (!newTalent.title.trim()) {
      setCreateError('Please enter professional title/headline.');
      return;
    }
    if (!newTalent.bio.trim() || newTalent.bio.trim().length < 10) {
      setCreateError('Please provide a biography of at least 10 characters.');
      return;
    }

    try {
      setIsSubmittingNew(true);

      const languagesArr = newTalent.languages
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const tagsArr = newTalent.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.createTalent({
        name: newTalent.name.trim(),
        handle: newTalent.handle.replace('@', '').trim().toLowerCase(),
        title: newTalent.title.trim(),
        category_id: Number(newTalent.category_id),
        bio: newTalent.bio.trim(),
        avatar_url: newTalent.avatar_url.trim() || '/stars/selam_tesfaye.jpg',
        hero_video_url: newTalent.hero_video_url.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        price_video: Number(newTalent.price_video) || 50,
        price_live_call: Number(newTalent.price_live_call) || 120,
        response_time: newTalent.response_time,
        languages: languagesArr.length > 0 ? languagesArr : ['Amharic', 'English'],
        tags: tagsArr.length > 0 ? tagsArr : ['Creator'],
        verified: newTalent.verified,
        featured: newTalent.featured,
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setSaveSuccessMsg(`🎉 Star "${newTalent.name}" successfully published to Meet and Greet!`);
      setTimeout(() => setSaveSuccessMsg(''), 5000);

      // Reset form
      setNewTalent({
        name: '',
        handle: '',
        title: '',
        category_id: categories[0]?.id || 1,
        bio: '',
        avatar_url: '/stars/teddy_afro.jpg',
        hero_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        price_video: 60,
        price_live_call: 150,
        response_time: '⚡ Within 24 hours',
        languages: 'Amharic, English',
        tags: 'Creator, Celebrity',
        verified: true,
        featured: true,
      });

      onTalentUpdated();
      await loadAdminData();
      setActiveTab('talents');
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create celebrity. Please try again.');
    } finally {
      setIsSubmittingNew(false);
    }
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
    <div className="w-full bg-[#FAF7F2] text-[#181818] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs & Header */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE4D7] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#777777] mb-2">
              <button 
                onClick={onNavigateHome}
                className="hover:text-[#181818] transition cursor-pointer"
              >
                Meet and Greet
              </button>
              <span>/</span>
              <span className="text-[#181818] font-bold">Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#181818] tracking-tight font-['Plus_Jakarta_Sans'] flex items-center gap-3">
              <span>Admin Management Hub</span>
              <span className="text-xs uppercase font-extrabold bg-[#FDE047] text-[#181818] px-2.5 py-1 rounded-full shadow-xs">
                Super Admin
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 font-medium">
              Manage platform metrics, enroll Ethiopian & international stars, update pricing, and fulfill fan requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              title="Refresh database records"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#E0DACE] text-[#555555] hover:text-[#181818] hover:bg-[#FAF7F2] text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={() => setActiveTab('add_talent')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Celebrity</span>
            </button>
          </div>
        </div>

        {/* Global Success Notification Alert */}
        {saveSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="text-emerald-600 hover:text-emerald-900 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Main Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-[#EAE4D7] no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#181818] text-white shadow-xs'
                : 'bg-white text-[#555555] border border-[#E0DACE] hover:bg-[#FAF7F2]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard & Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('talents')}
            className={`py-3 px-5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'talents'
                ? 'bg-[#181818] text-white shadow-xs'
                : 'bg-white text-[#555555] border border-[#E0DACE] hover:bg-[#FAF7F2]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Stars ({talents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add_talent')}
            className={`py-3 px-5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'add_talent'
                ? 'bg-[#181818] text-white ring-2 ring-[#FDE047] shadow-xs'
                : 'bg-[#FDE047]/25 text-[#181818] border border-[#FDE047] hover:bg-[#FDE047]/40 font-black'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>+ Add New Celebrity</span>
            <span className="text-[10px] uppercase font-black bg-[#181818] text-[#FDE047] px-1.5 py-0.5 rounded-full">
              Add
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#181818] text-white shadow-xs'
                : 'bg-white text-[#555555] border border-[#E0DACE] hover:bg-[#FAF7F2]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>All Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-5 rounded-full text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#181818] text-white shadow-xs'
                : 'bg-white text-[#555555] border border-[#E0DACE] hover:bg-[#FAF7F2]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Platform Settings</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD & METRICS */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[#EAE4D7] shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-[#666666] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross Platform Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-[#181818] block tracking-tight">
                  {formatMoney(stats?.totalRevenue || 0)}
                </span>
                <span className="text-[11px] text-[#777777] mt-1.5 block font-medium">100% powered by Prisma ORM</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4D7] shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-[#666666] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-[#181818] block tracking-tight">
                  {stats?.totalBookings || bookings.length}
                </span>
                <span className="text-[11px] text-[#777777] mt-1.5 block font-medium">Personalized shoutouts & live meets</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4D7] shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-[#666666] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Enrolled Stars</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-[#181818] block tracking-tight">
                  {talents.length}
                </span>
                <span className="text-[11px] text-[#777777] mt-1.5 block font-medium">Musicians, athletes, actors, creators</span>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4D7] shadow-xs hover:shadow-md transition">
                <div className="flex items-center justify-between text-[#666666] mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-3xl font-black text-[#181818] block tracking-tight">
                  {stats?.completedBookings || 0}
                </span>
                <span className="text-[11px] text-[#777777] mt-1.5 block font-medium">Delivered directly to fan emails</span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 rounded-3xl bg-white border border-[#EAE4D7] p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#EAE4D7] pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-black text-[#181818]">Recent Fan Orders</h3>
                    <p className="text-xs text-[#666666]">Live stream of incoming shoutouts</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-[#181818] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>View all ({bookings.length})</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-[#777777] border-b border-[#EAE4D7]">
                        <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Order ID</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Star</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Recipient</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Type</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Amount</th>
                        <th className="pb-3 font-bold uppercase tracking-wider text-[11px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE4D7]">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#888888]">No orders recorded yet.</td>
                        </tr>
                      ) : (
                        bookings.slice(0, 6).map((b) => (
                          <tr key={b.id} className="hover:bg-[#FAF7F2] transition">
                            <td className="py-3 font-mono font-bold text-[#777777]">{b.id.slice(0, 8).toUpperCase()}</td>
                            <td className="py-3 font-black text-[#181818]">{b.talent_name || b.talent_id}</td>
                            <td className="py-3 text-[#444444] font-medium">{b.recipient_name}</td>
                            <td className="py-3 capitalize text-[#666666]">{b.booking_type.replace('_', ' ')}</td>
                            <td className="py-3 font-black text-[#181818]">{formatMoney(b.total_price)}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] border border-[#E0DACE] capitalize text-[#181818]">
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Onboarding Card */}
              <div className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] to-[#F5F0E6] border border-[#EAE4D7] p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#181818] text-white flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-6 h-6 text-[#FDE047]" />
                  </div>
                  <h3 className="text-xl font-black text-[#181818] tracking-tight">Expand the Roster</h3>
                  <p className="text-xs text-[#555555] mt-2 leading-relaxed">
                    Add new Ethiopian singers, cinema legends, athletes, and digital creators to Meet and Greet. Choose real portraits and set custom rates.
                  </p>

                  <div className="mt-5 space-y-2 text-xs text-[#444444] font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Instant publishing to Homepage & Browse</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Stored directly in PostgreSQL via Prisma ORM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Configurable video & live call pricing</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('add_talent')}
                  className="mt-6 w-full py-3.5 bg-[#181818] hover:bg-black text-white rounded-full text-xs font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll Celebrity Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE STARS */}
        {activeTab === 'talents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={talentSearch}
                  onChange={(e) => setTalentSearch(e.target.value)}
                  placeholder="Search stars by name, @handle, headline..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0DACE] rounded-full text-xs text-[#181818] placeholder-[#888888] focus:outline-none focus:border-[#181818] shadow-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#666666]">
                  Showing <strong className="text-[#181818]">{filteredTalents.length}</strong> of {talents.length} stars
                </span>
                <button
                  onClick={() => setActiveTab('add_talent')}
                  className="px-5 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Celebrity</span>
                </button>
              </div>
            </div>

            {/* Talents Table */}
            <div className="rounded-3xl bg-white border border-[#EAE4D7] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-[#666666] border-b border-[#EAE4D7]">
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Celebrity</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Category</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Video Shoutout</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Live 1-on-1</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Response Speed</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Badges</th>
                      <th className="p-4 text-right font-bold uppercase tracking-wider text-[11px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D7]">
                    {filteredTalents.map((t) => (
                      <tr key={t.id} className="hover:bg-[#FAF7F2]/60 transition">
                        <td className="p-4">
                          <div 
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => onSelectTalent(t)}
                          >
                            <img
                              src={t.avatar_url || t.avatar}
                              alt={t.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100';
                              }}
                              className="w-11 h-11 rounded-2xl object-cover border border-[#E0DACE] shadow-xs group-hover:scale-105 transition"
                            />
                            <div>
                              <span className="font-black text-sm text-[#181818] block group-hover:text-amber-800 transition">
                                {t.name}
                              </span>
                              <span className="text-[11px] text-[#777777]">@{t.handle}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E0DACE] text-[11px] font-bold text-[#555555]">
                            {getTalentCategoryName(t)}
                          </span>
                        </td>
                        <td className="p-4 font-black text-[#181818] text-sm">
                          {formatMoney(t.price_video)}
                        </td>
                        <td className="p-4 font-bold text-[#444444]">
                          {formatMoney(t.price_live_call)}
                        </td>
                        <td className="p-4 font-medium text-[#555555]">
                          {t.response_time || '⚡ 24h'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleUpdateTalentQuick(t.id, { verified: !t.verified })}
                              title="Toggle verified checkmark"
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                t.verified
                                  ? 'bg-[#181818] text-white border-[#181818]'
                                  : 'bg-white text-[#888888] border-[#E0DACE] hover:text-[#181818]'
                              }`}
                            >
                              ✓ Verified
                            </button>
                            <button
                              onClick={() => handleUpdateTalentQuick(t.id, { featured: !t.featured })}
                              title="Toggle featured status"
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                t.featured
                                  ? 'bg-[#FDE047] text-[#181818] border-[#E0DACE] font-black'
                                  : 'bg-white text-[#888888] border-[#E0DACE] hover:text-[#181818]'
                              }`}
                            >
                              ★ Featured
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingTalent(t)}
                              className="p-2 rounded-xl bg-white hover:bg-[#F5F1E8] border border-[#E0DACE] text-[#555555] hover:text-[#181818] shadow-xs cursor-pointer transition"
                              title="Edit celebrity details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTalent(t.id, t.name)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 shadow-xs cursor-pointer transition"
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
          </div>
        )}

        {/* TAB 3: + ADD NEW CELEBRITY (The User Request) */}
        {activeTab === 'add_talent' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Form Workspace (2 Columns) */}
            <div className="lg:col-span-2 bg-white border border-[#EAE4D7] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-[#EAE4D7] pb-4 mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FDE047] text-[#181818] text-[10px] font-black uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Celebrity Onboarding Portal</span>
                </div>
                <h2 className="text-2xl font-black text-[#181818] tracking-tight">Add a New Celebrity to Platform</h2>
                <p className="text-xs text-[#666666] mt-0.5">
                  Publish stars to Meet and Greet. Data is stored directly into PostgreSQL using Prisma ORM.
                </p>
              </div>

              {createError && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateCelebrity} className="space-y-6">
                
                {/* 1. Portrait Selection & Presets */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block">
                    1. Celebrity Profile Photo
                  </label>
                  
                  {/* Presets Gallery */}
                  <div>
                    <span className="text-[11px] font-semibold text-[#888888] block mb-2">
                      Choose from verified star photo presets:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PHOTO_PRESETS.map((preset) => {
                        const isSelected = newTalent.avatar_url === preset.path;
                        return (
                          <button
                            key={preset.path}
                            type="button"
                            onClick={() => {
                              setNewTalent({
                                ...newTalent,
                                avatar_url: preset.path,
                                name: newTalent.name || preset.name,
                                title: newTalent.title || preset.title,
                                handle: newTalent.handle || preset.name.toLowerCase().replace(/\s+/g, '_'),
                                category_id: preset.catId,
                              });
                            }}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition cursor-pointer text-center ${
                              isSelected
                                ? 'bg-[#FAF7F2] border-2 border-[#181818] ring-2 ring-[#FDE047]'
                                : 'bg-white border-[#E0DACE] hover:border-[#181818]'
                            }`}
                          >
                            <img
                              src={preset.path}
                              alt={preset.name}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                            <span className="text-[10px] font-bold text-[#181818] line-clamp-1">
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom URL or Path */}
                  <div>
                    <label className="text-[11px] font-bold text-[#555555] block mb-1">
                      Or enter custom portrait URL / local file path:
                    </label>
                    <input
                      type="text"
                      value={newTalent.avatar_url}
                      onChange={(e) => setNewTalent({ ...newTalent, avatar_url: e.target.value })}
                      placeholder="/stars/your_star.jpg or https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>

                {/* 2. Identity & Category */}
                <div className="space-y-4 pt-2 border-t border-[#EAE4D7]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block">
                    2. Star Identity & Classification
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newTalent.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setNewTalent({
                            ...newTalent,
                            name,
                            handle: newTalent.handle || name.toLowerCase().replace(/[^a-z0-9]/g, '_')
                          });
                        }}
                        placeholder="e.g., Aster Aweke"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Handle / Username <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#888888]">@</span>
                        <input
                          type="text"
                          required
                          value={newTalent.handle}
                          onChange={(e) => setNewTalent({ ...newTalent, handle: e.target.value.replace('@', '') })}
                          placeholder="asteraweke"
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] font-mono focus:bg-white focus:outline-none focus:border-[#181818]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newTalent.category_id}
                        onChange={(e) => setNewTalent({ ...newTalent, category_id: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-bold text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818] cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.slug})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Headline / Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newTalent.title}
                        onChange={(e) => setNewTalent({ ...newTalent, title: e.target.value })}
                        placeholder="e.g., Queen of Ethiopian Soul & Vocalist"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#181818] block mb-1">
                      Biography / Bio <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newTalent.bio}
                      onChange={(e) => setNewTalent({ ...newTalent, bio: e.target.value })}
                      placeholder="Describe the star, their accomplishments, and what occasions they love doing shoutouts for..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818] resize-none"
                    />
                  </div>
                </div>

                {/* 3. Pricing & Delivery Speed */}
                <div className="space-y-4 pt-2 border-t border-[#EAE4D7]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block">
                    3. Booking Services & Pricing
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Video Shoutout ($ USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={5}
                        required
                        value={newTalent.price_video}
                        onChange={(e) => setNewTalent({ ...newTalent, price_video: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-bold text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818]"
                      />
                      <span className="text-[10px] text-[#777777] mt-0.5 block">
                        ≈ {Math.round(newTalent.price_video * 120).toLocaleString()} ETB
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        1-on-1 Live Meet ($ USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={10}
                        required
                        value={newTalent.price_live_call}
                        onChange={(e) => setNewTalent({ ...newTalent, price_live_call: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-bold text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818]"
                      />
                      <span className="text-[10px] text-[#777777] mt-0.5 block">
                        ≈ {Math.round(newTalent.price_live_call * 120).toLocaleString()} ETB
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Response Time Speed
                      </label>
                      <select
                        value={newTalent.response_time}
                        onChange={(e) => setNewTalent({ ...newTalent, response_time: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-bold text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818] cursor-pointer"
                      >
                        <option value="⚡ Within 24 hours">⚡ Within 24 hours</option>
                        <option value="⚡ Within 12 hours">⚡ Within 12 hours</option>
                        <option value="⚡ Within 48 hours">⚡ Within 48 hours</option>
                        <option value="Standard 3-5 days">Standard 3-5 days</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Languages, Tags & Badges */}
                <div className="space-y-4 pt-2 border-t border-[#EAE4D7]">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#777777] block">
                    4. Tags & Verification Badges
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Languages (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newTalent.languages}
                        onChange={(e) => setNewTalent({ ...newTalent, languages: e.target.value })}
                        placeholder="Amharic, English, Oromo"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#181818] block mb-1">
                        Search Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={newTalent.tags}
                        onChange={(e) => setNewTalent({ ...newTalent, tags: e.target.value })}
                        placeholder="Music, Singer, Legend, Tikur Sew"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-xs font-medium text-[#181818] focus:bg-white focus:outline-none focus:border-[#181818]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#181818] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTalent.verified}
                        onChange={(e) => setNewTalent({ ...newTalent, verified: e.target.checked })}
                        className="w-4 h-4 rounded border-[#DCD5C6] accent-[#181818] cursor-pointer"
                      />
                      <span>Verified Creator Badge (Checkmark)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-[#181818] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTalent.featured}
                        onChange={(e) => setNewTalent({ ...newTalent, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-[#DCD5C6] accent-[#181818] cursor-pointer"
                      />
                      <span>Feature on Homepage & Featured Banners</span>
                    </label>
                  </div>
                </div>

                {/* Submit Toolbar */}
                <div className="pt-4 border-t border-[#EAE4D7] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('talents')}
                    className="px-6 py-3 rounded-full border border-[#E0DACE] bg-white hover:bg-[#FAF7F2] text-[#555555] hover:text-[#181818] text-xs font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingNew}
                    className="px-8 py-3 rounded-full bg-[#181818] hover:bg-black text-white text-xs sm:text-sm font-black shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition flex items-center gap-2 cursor-pointer"
                  >
                    {isSubmittingNew ? (
                      <span>Publishing with Prisma...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#FDE047]" />
                        <span>Publish Celebrity to Platform</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Right: Live Star Card Preview */}
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-[#EAE4D7] rounded-3xl p-5 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#777777] block mb-3">
                  Live Star Card Preview
                </span>

                <div className="group flex flex-col cursor-pointer transition">
                  {/* Portrait photo */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F0EBE1] border border-[#EAE4D7] mb-2 shadow-xs">
                    <img
                      src={newTalent.avatar_url || '/stars/teddy_afro.jpg'}
                      alt={newTalent.name || 'Preview'}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Hot today flame badge */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ea580c] text-white text-[10px] font-bold shadow-md">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>Hot today</span>
                    </div>

                    {newTalent.verified && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 text-[#181818] text-[10px] font-black shadow-xs">
                        ✓ Verified
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-black text-sm text-[#181818] line-clamp-1">
                    {newTalent.name || 'Celebrity Full Name'}
                  </h3>

                  <p className="text-xs text-[#666666] line-clamp-1 mb-1 font-medium">
                    {newTalent.title || 'Professional Title & Headline'}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#555555] mb-1">
                    <span className="flex items-center text-[#181818] font-bold">
                      ★ 5.0 <span className="text-[#888888] font-normal ml-0.5">(New)</span>
                    </span>
                    <span className="flex items-center text-[#181818] font-semibold text-[11px]">
                      {newTalent.response_time}
                    </span>
                  </div>

                  <div className="text-sm font-black text-[#181818]">
                    {formatMoney(newTalent.price_video || 50)}+
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EAE4D7] text-[11px] text-[#777777]">
                  💡 This is how fans will see this star on the Homepage, Browse, and search results.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['all', 'pending', 'in_progress', 'completed', 'declined'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border capitalize transition cursor-pointer ${
                      bookingFilterStatus === st
                        ? 'bg-[#181818] border-[#181818] text-white shadow-xs'
                        : 'bg-white border-[#E0DACE] text-[#666666] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <span className="text-xs font-semibold text-[#666666]">
                Total Orders: <strong className="text-[#181818]">{filteredBookings.length}</strong>
              </span>
            </div>

            {/* Bookings Table */}
            <div className="rounded-3xl bg-white border border-[#EAE4D7] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#FAF7F2] text-[#666666] border-b border-[#EAE4D7]">
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Order ID</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Star</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Customer</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Recipient & Occasion</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Price</th>
                      <th className="p-4 font-bold uppercase tracking-wider text-[11px]">Status</th>
                      <th className="p-4 text-right font-bold uppercase tracking-wider text-[11px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE4D7]">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-[#888888]">No orders found for this status.</td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#FAF7F2]/60 transition">
                          <td className="p-4 font-mono font-bold text-[#777777]">{b.id.slice(0, 8).toUpperCase()}</td>
                          <td className="p-4 font-black text-[#181818]">{b.talent_name || b.talent_id}</td>
                          <td className="p-4">
                            <span className="text-[#181818] font-bold block">{b.customer_name}</span>
                            <span className="text-[11px] text-[#777777]">{b.customer_email}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-[#181818] font-medium block">{b.recipient_name}</span>
                            <span className="text-[11px] text-[#888888] font-semibold">{b.occasion}</span>
                          </td>
                          <td className="p-4 font-black text-[#181818]">{formatMoney(b.total_price)}</td>
                          <td className="p-4">
                            <select
                              value={b.status || 'pending'}
                              onChange={async (e) => {
                                await api.updateBookingStatus(b.id, { status: e.target.value as any });
                                loadAdminData();
                              }}
                              className="bg-white border border-[#E0DACE] rounded-lg px-2.5 py-1 text-xs text-[#181818] font-semibold capitalize focus:outline-none shadow-xs cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="declined">Declined</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-[#EAE4D7] space-y-5 shadow-xs">
              <div>
                <h3 className="text-lg font-black text-[#181818]">Platform Infrastructure & Settings</h3>
                <p className="text-xs text-[#666666]">System parameters, ORM configuration & service connections</p>
              </div>

              <div className="text-xs space-y-3.5 text-[#444444]">
                <div className="flex justify-between py-2 border-b border-[#EAE4D7]">
                  <span className="text-[#777777] font-semibold">Application Name:</span>
                  <span className="font-black text-[#181818]">Meet and Greet</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#EAE4D7]">
                  <span className="text-[#777777] font-semibold">Database ORM:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Prisma ORM (v5.22)
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#EAE4D7]">
                  <span className="text-[#777777] font-semibold">Database Engine:</span>
                  <span className="font-mono font-bold text-[#181818]">PostgreSQL 16 (Alpine)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#EAE4D7]">
                  <span className="text-[#777777] font-semibold">Backend API URL:</span>
                  <span className="font-mono text-[#181818]">http://localhost:5050</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#777777] font-semibold">Frontend Web URL:</span>
                  <span className="font-mono text-[#181818]">http://localhost:3000</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Edit Celebrity Sub-Modal */}
      {editingTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs overflow-y-auto">
          <form onSubmit={handleSaveTalentEdit} className="w-full max-w-lg bg-white border border-[#EAE4D7] rounded-3xl p-6 sm:p-7 space-y-4 shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-[#EAE4D7] pb-3">
              <h3 className="text-lg font-black text-[#181818]">Edit Star: {editingTalent.name}</h3>
              <button 
                type="button" 
                onClick={() => setEditingTalent(null)} 
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] text-[#666666] hover:text-[#181818] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#777777] block mb-1 font-bold">Name</label>
                <input
                  type="text"
                  value={editingTalent.name}
                  onChange={(e) => setEditingTalent({ ...editingTalent, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-bold focus:bg-white focus:outline-none focus:border-[#181818]"
                />
              </div>
              <div>
                <label className="text-[#777777] block mb-1 font-bold">Headline / Title</label>
                <input
                  type="text"
                  value={editingTalent.title}
                  onChange={(e) => setEditingTalent({ ...editingTalent, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
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
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-bold focus:bg-white focus:outline-none focus:border-[#181818]"
                />
              </div>
              <div>
                <label className="text-[#777777] block mb-1 font-bold">Live Meet Price ($)</label>
                <input
                  type="number"
                  value={editingTalent.price_live_call}
                  onChange={(e) => setEditingTalent({ ...editingTalent, price_live_call: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-bold focus:bg-white focus:outline-none focus:border-[#181818]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-[#777777] block mb-1 font-bold">Avatar URL / Path</label>
              <input
                type="text"
                value={editingTalent.avatar_url || ''}
                onChange={(e) => setEditingTalent({ ...editingTalent, avatar_url: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-mono focus:bg-white focus:outline-none focus:border-[#181818]"
              />
            </div>

            <div className="text-xs">
              <label className="text-[#777777] block mb-1 font-bold">Bio</label>
              <textarea
                rows={3}
                value={editingTalent.bio}
                onChange={(e) => setEditingTalent({ ...editingTalent, bio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E0DACE] text-[#181818] font-medium focus:bg-white focus:outline-none focus:border-[#181818]"
              />
            </div>

            <div className="flex items-center gap-6 text-xs pt-1">
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
                className="px-6 py-2.5 rounded-full bg-[#181818] hover:bg-black text-white font-bold shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
