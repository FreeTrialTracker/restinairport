/*
  # Add website URL field to airport facilities

  1. Changes
    - Add `website_url` column to `airport_facilities` table
    - This will store the official website URL for each facility
  
  2. Notes
    - Using text type for flexibility with URL formats
    - Column is nullable as some facilities may not have websites
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN website_url text;
  END IF;
END $$;
