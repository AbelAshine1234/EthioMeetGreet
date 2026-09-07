export interface SampleVideo {
  title: string;
  url: string;
}

export interface Review {
  id: string;
  talent_id: string;
  booking_id?: string;
  customer_name: string;
  rating: number;
  comment: string;
  occasion?: string;
  video_response_url?: string;
  created_at: string;
  talent_name?: string;
  talent_avatar?: string;
  talent_handle?: string;
}

export interface Talent {
  id: string;
  name: string;
  handle: string;
  title: string;
  category_id: number;
  category?: string | { id: number; name: string; slug: string; [key: string]: any };
  category_name?: string;
  category_slug?: string;
  bio: string;
  avatar_url: string;
  avatar?: string;
  hero_video_url: string;
  sample_videos: SampleVideo[];
  rating: number;
  review_count: number;
  reviews_count?: number;
  response_time: string;
  price_video: number;
  price_live_call: number;
  price_live?: number;
  etb_rate: number;
  verified: boolean;
  featured: boolean;
  trending: boolean;
  languages: string[];
  tags: string[];
  social_following?: string;
  currency?: string;
  reviews?: Review[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  talent_count?: number;
}

export interface Occasion {
  id: string;
  name: string;
  icon: string;
}

export interface Booking {
  id: string;
  talent_id: string;
  talent_name?: string;
  talent_avatar?: string;
  talent_handle?: string;
  customer_name: string;
  customer_email: string;
  recipient_name: string;
  booking_type: 'video_shoutout' | 'live_meet';
  occasion: string;
  instructions: string;
  delivery_speed: 'standard' | 'rush_24h';
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'declined';
  total_price: number;
  currency: string;
  scheduled_date?: string;
  completed_video_url?: string;
  video_url?: string;
  talent_message?: string;
  created_at: string;
  updated_at: string;
}

export function getTalentCategoryName(t?: Partial<Talent> | null): string {
  if (!t) return 'Creator';
  if (t.category_name) return t.category_name;
  if (typeof t.category === 'object' && t.category && 'name' in t.category) {
    return String((t.category as any).name);
  }
  if (typeof t.category === 'string') return t.category;
  return 'Creator';
}

export function getTalentCategorySlug(t?: Partial<Talent> | null): string {
  if (!t) return '';
  if (t.category_slug) return String(t.category_slug).toLowerCase();
  if (typeof t.category === 'object' && t.category && 'slug' in t.category) {
    return String((t.category as any).slug).toLowerCase();
  }
  if (typeof t.category === 'string') return t.category.toLowerCase();
  return '';
}
