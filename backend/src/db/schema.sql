-- Database schema for EthioMeetGreet

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS talents (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  hero_video_url TEXT NOT NULL,
  sample_videos JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  response_time VARCHAR(50) DEFAULT '⚡ Within 24 hours',
  price_video INTEGER NOT NULL,
  price_live_call INTEGER NOT NULL,
  etb_rate INTEGER DEFAULT 120,
  verified BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  languages TEXT[] DEFAULT ARRAY['Amharic', 'English'],
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS occasions (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(64) PRIMARY KEY,
  talent_id VARCHAR(64) REFERENCES talents(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  booking_type VARCHAR(50) NOT NULL, -- 'video_shoutout' or 'live_meet'
  occasion VARCHAR(100) NOT NULL,
  instructions TEXT NOT NULL,
  delivery_speed VARCHAR(50) DEFAULT 'standard',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'declined'
  total_price INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  scheduled_date VARCHAR(100),
  completed_video_url TEXT,
  talent_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  talent_id VARCHAR(64) REFERENCES talents(id) ON DELETE CASCADE,
  booking_id VARCHAR(64),
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  occasion VARCHAR(100),
  video_response_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_talents_category ON talents(category_id);
CREATE INDEX IF NOT EXISTS idx_talents_featured ON talents(featured);
CREATE INDEX IF NOT EXISTS idx_talents_trending ON talents(trending);
CREATE INDEX IF NOT EXISTS idx_bookings_talent ON bookings(talent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_reviews_talent ON reviews(talent_id);
