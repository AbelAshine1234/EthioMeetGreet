import { Talent, Category, Occasion, Booking, Review } from './types';

const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return 'http://localhost:5050/api';
};

const API_BASE = getApiBase();

export interface AdminStats {
  totalTalents: number;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  inProgressBookings: number;
  totalRevenue: number;
  totalReviews: number;
  recentBookings: Booking[];
}

export const api = {
  // Talents
  async getTalents(params?: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    trending?: boolean;
  }): Promise<Talent[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.minPrice) query.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString());
    if (params?.featured) query.append('featured', 'true');
    if (params?.trending) query.append('trending', 'true');

    const res = await fetch(`${API_BASE}/talents?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch talents');
    return res.json();
  },

  async getTalent(id: string): Promise<Talent> {
    const res = await fetch(`${API_BASE}/talents/${id}`);
    if (!res.ok) throw new Error('Failed to fetch talent detail');
    return res.json();
  },

  async createTalent(data: Partial<Talent>): Promise<Talent> {
    const res = await fetch(`${API_BASE}/talents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to register talent');
    }
    return res.json();
  },

  async updateTalent(id: string, data: Partial<Talent>): Promise<Talent> {
    const res = await fetch(`${API_BASE}/talents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update talent');
    }
    return res.json();
  },

  async deleteTalent(id: string): Promise<{ id: string }> {
    const res = await fetch(`${API_BASE}/talents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete talent');
    return res.json();
  },

  // Categories & Occasions
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getOccasions(): Promise<Occasion[]> {
    const res = await fetch(`${API_BASE}/categories/occasions`);
    if (!res.ok) throw new Error('Failed to fetch occasions');
    return res.json();
  },

  // Bookings
  async createBooking(booking: {
    talent_id: string;
    customer_name: string;
    customer_email: string;
    recipient_name: string;
    booking_type: 'video_shoutout' | 'live_meet';
    occasion: string;
    instructions: string;
    delivery_speed: 'standard' | 'rush_24h';
    scheduled_date?: string;
  }): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create booking');
    }
    return res.json();
  },

  async getBookings(params?: { email?: string; talent_id?: string; status?: string }): Promise<Booking[]> {
    const query = new URLSearchParams();
    if (params?.email) query.append('email', params.email);
    if (params?.talent_id) query.append('talent_id', params.talent_id);
    if (params?.status) query.append('status', params.status);

    const res = await fetch(`${API_BASE}/bookings?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async updateBookingStatus(
    id: string,
    data: { status: string; completed_video_url?: string; talent_message?: string }
  ): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update booking status');
    }
    return res.json();
  },

  async deleteBooking(id: string): Promise<{ id: string }> {
    const res = await fetch(`${API_BASE}/admin/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete booking');
    return res.json();
  },

  // Reviews
  async getReviews(params?: { talent_id?: string; limit?: number }): Promise<Review[]> {
    const query = new URLSearchParams();
    if (params?.talent_id) query.append('talent_id', params.talent_id);
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/reviews?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return res.json();
  },

  async submitReview(review: {
    talent_id: string;
    booking_id?: string;
    customer_name: string;
    rating: number;
    comment: string;
    occasion?: string;
  }): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit review');
    }
    return res.json();
  },

  async deleteReview(id: string): Promise<{ id: string }> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  },

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`);
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return res.json();
  },

  // WebRTC Signaling for Live Meet Video & Audio Calls
  async sendSignal(payload: {
    roomId: string;
    sender: string;
    type: 'offer' | 'answer' | 'candidate' | 'chat' | 'reaction' | 'join' | 'leave';
    data?: any;
  }): Promise<{ success: boolean; signalId: string }> {
    const res = await fetch(`${API_BASE}/webrtc/signal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to send WebRTC signal');
    return res.json();
  },

  async getSignals(roomId: string, sender: string, since: number = 0): Promise<{
    roomId: string;
    signals: Array<{
      id: string;
      roomId: string;
      sender: string;
      type: 'offer' | 'answer' | 'candidate' | 'chat' | 'reaction' | 'join' | 'leave';
      data: any;
      timestamp: number;
    }>;
    serverTime: number;
  }> {
    const res = await fetch(`${API_BASE}/webrtc/signals/${roomId}?sender=${encodeURIComponent(sender)}&since=${since}`);
    if (!res.ok) throw new Error('Failed to poll WebRTC signals');
    return res.json();
  }
};
