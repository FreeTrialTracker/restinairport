/*
  # Add Detailed Content Fields to Airport Facilities

  1. Changes
    - Add `capacity` column for storing capacity details
    - Add `pricing_details` column for detailed pricing information
    - Add `access_details` column for access instructions
    - Add `amenities` column for listing amenities
    - Add `summary` column for brief summary
    - Add `full_description` column for complete detailed description
  
  2. Notes
    - All new fields are nullable to maintain compatibility with existing records
    - These fields will store rich content for facility detail pages
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'capacity'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN capacity text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'pricing_details'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN pricing_details text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'access_details'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN access_details text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'amenities'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN amenities text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'summary'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN summary text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'airport_facilities' AND column_name = 'full_description'
  ) THEN
    ALTER TABLE airport_facilities ADD COLUMN full_description text;
  END IF;
END $$;