/*
  # Add Beauty Products and Recommendations

  1. New Tables
    - `beauty_products`
      - `id` (uuid, primary key)
      - `standard_id` (uuid, references beauty_standards)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for public read access
*/

-- Create beauty_products table
CREATE TABLE IF NOT EXISTS beauty_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_id uuid REFERENCES beauty_standards(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE beauty_products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read beauty products"
  ON beauty_products
  FOR SELECT
  TO public
  USING (true);

-- Insert sample products for each beauty standard
INSERT INTO beauty_products (standard_id, name, description, category, price, image_url) 
SELECT 
  id as standard_id,
  CASE culture
    WHEN 'Korean' THEN 'Glass Skin Perfecting Serum'
    WHEN 'Japanese' THEN 'Natural Essence Moisturizer'
    WHEN 'Chinese' THEN 'Imperial Jade Facial Roller'
    WHEN 'Western' THEN 'Pro Contour Kit'
    WHEN 'African' THEN 'Radiance Glow Oil'
    WHEN 'Middle Eastern' THEN 'Luxury Eye Palette'
  END as name,
  CASE culture
    WHEN 'Korean' THEN 'Achieve the perfect glass skin with this hydrating serum'
    WHEN 'Japanese' THEN 'Light, natural moisturizer for everyday use'
    WHEN 'Chinese' THEN 'Traditional beauty tool for facial massage and lymphatic drainage'
    WHEN 'Western' THEN 'Professional-grade contour kit for sculpted features'
    WHEN 'African' THEN 'Rich facial oil for a natural, radiant glow'
    WHEN 'Middle Eastern' THEN 'Dramatic eyeshadow palette for bold looks'
  END as description,
  CASE culture
    WHEN 'Korean' THEN 'Skincare'
    WHEN 'Japanese' THEN 'Skincare'
    WHEN 'Chinese' THEN 'Tools'
    WHEN 'Western' THEN 'Makeup'
    WHEN 'African' THEN 'Skincare'
    WHEN 'Middle Eastern' THEN 'Makeup'
  END as category,
  CASE culture
    WHEN 'Korean' THEN 45.99
    WHEN 'Japanese' THEN 38.99
    WHEN 'Chinese' THEN 29.99
    WHEN 'Western' THEN 54.99
    WHEN 'African' THEN 42.99
    WHEN 'Middle Eastern' THEN 59.99
  END as price,
  CASE culture
    WHEN 'Korean' THEN 'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600'
    WHEN 'Japanese' THEN 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600'
    WHEN 'Chinese' THEN 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600'
    WHEN 'Western' THEN 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600'
    WHEN 'African' THEN 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600'
    WHEN 'Middle Eastern' THEN 'https://images.unsplash.com/photo-1596704017704-0ad6c79ffdc1?auto=format&fit=crop&w=600'
  END as image_url
FROM beauty_standards;

-- Add more products for each standard
INSERT INTO beauty_products (standard_id, name, description, category, price, image_url) 
SELECT 
  id as standard_id,
  CASE culture
    WHEN 'Korean' THEN 'Pore Minimizing Toner'
    WHEN 'Japanese' THEN 'Rice Water Cleanser'
    WHEN 'Chinese' THEN 'Pearl Extract Mask'
    WHEN 'Western' THEN 'Full Coverage Foundation'
    WHEN 'African' THEN 'Shea Butter Cream'
    WHEN 'Middle Eastern' THEN 'Kohl Eyeliner'
  END as name,
  CASE culture
    WHEN 'Korean' THEN 'Refining toner for smooth, poreless skin'
    WHEN 'Japanese' THEN 'Traditional rice water based gentle cleanser'
    WHEN 'Chinese' THEN 'Luxurious mask with pearl extract for brightening'
    WHEN 'Western' THEN 'Long-lasting full coverage foundation'
    WHEN 'African' THEN 'Rich moisturizing cream with natural shea butter'
    WHEN 'Middle Eastern' THEN 'Traditional kohl eyeliner for dramatic eyes'
  END as description,
  CASE culture
    WHEN 'Korean' THEN 'Skincare'
    WHEN 'Japanese' THEN 'Skincare'
    WHEN 'Chinese' THEN 'Skincare'
    WHEN 'Western' THEN 'Makeup'
    WHEN 'African' THEN 'Skincare'
    WHEN 'Middle Eastern' THEN 'Makeup'
  END as category,
  CASE culture
    WHEN 'Korean' THEN 32.99
    WHEN 'Japanese' THEN 28.99
    WHEN 'Chinese' THEN 45.99
    WHEN 'Western' THEN 39.99
    WHEN 'African' THEN 34.99
    WHEN 'Middle Eastern' THEN 24.99
  END as price,
  CASE culture
    WHEN 'Korean' THEN 'https://images.unsplash.com/photo-1601049676869-702ea24cfd58?auto=format&fit=crop&w=600'
    WHEN 'Japanese' THEN 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600'
    WHEN 'Chinese' THEN 'https://images.unsplash.com/photo-1598452963314-b09f397486c6?auto=format&fit=crop&w=600'
    WHEN 'Western' THEN 'https://images.unsplash.com/photo-1596704017666-0825e60bf22d?auto=format&fit=crop&w=600'
    WHEN 'African' THEN 'https://images.unsplash.com/photo-1598452963892-b55587c13c8c?auto=format&fit=crop&w=600'
    WHEN 'Middle Eastern' THEN 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&w=600'
  END as image_url
FROM beauty_standards;