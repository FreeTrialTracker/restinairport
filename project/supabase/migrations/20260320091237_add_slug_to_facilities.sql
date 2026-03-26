/*
  # Add Slug Column to Airport Facilities

  1. Changes
    - Add `slug` column to `airport_facilities` table
    - Slug is a URL-friendly version of the facility name
    - Used for clean, SEO-friendly URLs (e.g., /facility/yotel-heathrow)
    - Auto-generated from facility name using lowercase and hyphens
    - Unique constraint ensures no duplicate slugs
    - Indexed for fast lookups

  2. Notes
    - Existing facilities will need slugs populated separately
    - New facilities should have slugs generated on insert
*/

-- Add slug column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'slug'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN slug text UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_airport_facilities_slug ON airport_facilities(slug);
  END IF;
END $$;
