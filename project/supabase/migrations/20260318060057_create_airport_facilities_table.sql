/*
  # Create Airport Facilities Database

  ## Overview
  This migration creates the core database structure for RestInAirport.com, 
  a comprehensive directory of airport rest facilities worldwide.

  ## New Tables
  
  ### `airport_facilities`
  Stores information about rest facilities available at airports globally.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each facility
  - `airport` (text) - Airport name and code (e.g., "Bangkok (BKK)")
  - `airport_code` (text) - Extracted airport code for easier filtering
  - `facility` (text) - Name of the rest facility
  - `location` (text) - Specific location within the airport
  - `type` (text) - Type of facility (Hotel, Pod, Suite, Lounge, etc.)
  - `immigration` (text) - Immigration requirements
  - `transit_safe` (boolean) - Whether facility is accessible without immigration
  - `zone` (text) - Airport zone (International Transit, Schengen, etc.)
  - `connectivity` (text) - How to access the facility
  - `eligibility` (text) - Who can use the facility
  - `cards` (text) - Accepted lounge cards (PP, LK, DP, etc.)
  - `price` (text) - Pricing information
  - `notes` (text) - Additional notes
  - `search_text` (text) - Generated column for full-text search
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  
  1. Enable Row Level Security (RLS)
  2. Create public read policy (all users can view facilities)
  3. No write policies (data managed by admins only)

  ## Indexes
  
  - Full-text search index on search_text
  - Index on airport_code for filtering
  - Index on type for filtering
*/

-- Create airport_facilities table
CREATE TABLE IF NOT EXISTS airport_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  airport text NOT NULL,
  airport_code text NOT NULL,
  facility text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  immigration text NOT NULL,
  transit_safe boolean NOT NULL DEFAULT true,
  zone text NOT NULL,
  connectivity text NOT NULL,
  eligibility text NOT NULL,
  cards text,
  price text NOT NULL,
  notes text,
  search_text text GENERATED ALWAYS AS (
    lower(airport || ' ' || facility || ' ' || location || ' ' || type || ' ' || zone || ' ' || notes)
  ) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE airport_facilities ENABLE ROW LEVEL SECURITY;

-- Create public read policy (everyone can view facilities)
CREATE POLICY "Anyone can view airport facilities"
  ON airport_facilities
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_airport_facilities_search 
  ON airport_facilities USING gin(to_tsvector('english', search_text));

CREATE INDEX IF NOT EXISTS idx_airport_facilities_airport_code 
  ON airport_facilities(airport_code);

CREATE INDEX IF NOT EXISTS idx_airport_facilities_type 
  ON airport_facilities(type);

CREATE INDEX IF NOT EXISTS idx_airport_facilities_transit_safe 
  ON airport_facilities(transit_safe);