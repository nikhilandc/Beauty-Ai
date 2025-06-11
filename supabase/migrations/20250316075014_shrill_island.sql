/*
  # Add Global Beauty Standards

  1. New Tables
    - `beauty_standards`
      - `id` (uuid, primary key)
      - `culture` (text)
      - `name` (text)
      - `description` (text)
      - `key_features` (text[])
      - `style_recommendations` (text[])
      - `created_at` (timestamp)

    - `user_beauty_matches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `standard_id` (uuid, references beauty_standards)
      - `match_percentage` (integer)
      - `created_at` (timestamp)

  2. Changes
    - Add new columns to user_analysis table
      - `facial_features` (text[])
      - `beauty_matches` (jsonb)

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create beauty_standards table
CREATE TABLE IF NOT EXISTS beauty_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  culture text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  key_features text[] NOT NULL,
  style_recommendations text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_beauty_matches table
CREATE TABLE IF NOT EXISTS user_beauty_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  standard_id uuid REFERENCES beauty_standards(id) ON DELETE CASCADE,
  match_percentage integer NOT NULL CHECK (match_percentage BETWEEN 0 AND 100),
  created_at timestamptz DEFAULT now()
);

-- Add new columns to user_analysis
ALTER TABLE user_analysis 
ADD COLUMN IF NOT EXISTS facial_features text[],
ADD COLUMN IF NOT EXISTS beauty_matches jsonb;

-- Enable RLS
ALTER TABLE beauty_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_beauty_matches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read beauty standards"
  ON beauty_standards
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can read own beauty matches"
  ON user_beauty_matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own beauty matches"
  ON user_beauty_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert beauty standards data
INSERT INTO beauty_standards (culture, name, description, key_features, style_recommendations) VALUES
  (
    'Korean',
    'Glass Skin',
    'Emphasizes clear, luminous, and dewy skin with a focus on facial harmony and soft features.',
    ARRAY['Bright and dewy complexion', 'Small face shape', 'V-line jaw', 'Large, bright eyes', 'Straight eyebrows'],
    ARRAY['Focus on skincare layering', 'Light, natural makeup', 'Soft gradient lips', 'Minimal contouring']
  ),
  (
    'Japanese',
    'Soft & Natural',
    'Centers on natural beauty with a focus on elegant simplicity and youthful features.',
    ARRAY['Clear, matte skin', 'Round face', 'Straight nose bridge', 'Double eyelids', 'Small, rosy lips'],
    ARRAY['Matte base makeup', 'Natural blush', 'Subtle eye makeup', 'Light eyebrow styling']
  ),
  (
    'Chinese',
    'Sharp Features',
    'Values defined features with a balance of sophistication and grace.',
    ARRAY['High cheekbones', 'Defined jaw', 'Phoenix eyes', 'Straight nose', 'Fair complexion'],
    ARRAY['Strategic contouring', 'Bold eye makeup', 'Classic red lips', 'Structured brows']
  ),
  (
    'Western',
    'Contoured & Defined',
    'Emphasizes sculpted features and dimensional makeup techniques.',
    ARRAY['High contrast features', 'Strong bone structure', 'Full lips', 'Defined brows', 'Sculpted nose'],
    ARRAY['Full coverage foundation', 'Heavy contouring', 'Bold eye makeup', 'Statement lips']
  ),
  (
    'African',
    'Bold & Radiant',
    'Celebrates rich skin tones and striking features with vibrant expressions.',
    ARRAY['Rich skin tone', 'Full lips', 'High cheekbones', 'Wide-set eyes', 'Strong bone structure'],
    ARRAY['Glowing foundation', 'Bold color choices', 'Metallic accents', 'Creative eye designs']
  ),
  (
    'Middle Eastern',
    'Sculpted Look',
    'Focuses on dramatic features and intense eye makeup with defined contours.',
    ARRAY['Almond eyes', 'Strong brows', 'Defined nose', 'Full lips', 'Olive complexion'],
    ARRAY['Dramatic eye makeup', 'Bold brow styling', 'Matte finish', 'Neutral lip colors']
  );