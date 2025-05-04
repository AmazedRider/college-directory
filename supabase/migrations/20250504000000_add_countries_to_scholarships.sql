-- Add countries array field to scholarships table
ALTER TABLE IF EXISTS scholarships ADD COLUMN IF NOT EXISTS countries TEXT[];

-- Add single country field for backward compatibility 
ALTER TABLE IF EXISTS scholarships ADD COLUMN IF NOT EXISTS country TEXT;

-- Update existing scholarships with some sample country data
UPDATE scholarships 
SET countries = ARRAY['United States', 'United Kingdom', 'Canada']
WHERE name = 'Global Excellence Scholarship';

UPDATE scholarships 
SET countries = ARRAY['Australia', 'New Zealand', 'Singapore']
WHERE name = 'Future Leaders Grant';

UPDATE scholarships 
SET countries = ARRAY['United States', 'Canada', 'Germany']
WHERE name = 'STEM Innovation Award';

UPDATE scholarships 
SET countries = ARRAY['United Kingdom', 'France', 'Germany']
WHERE name = 'Arts & Humanities Scholarship';

UPDATE scholarships 
SET countries = ARRAY['Canada', 'Australia', 'New Zealand']
WHERE name = 'First Generation Scholarship';

-- Create index for country searches
CREATE INDEX IF NOT EXISTS scholarships_countries_idx ON scholarships USING GIN (countries);

-- Add new sample scholarships with country data
INSERT INTO scholarships (name, amount, foundation, eligibility, deadline, chance, competition, countries)
VALUES
  ('International STEM Scholarship', '$12,000', 'Global Education Trust', 'International students pursuing STEM degrees with minimum GPA of 3.5', 'January 15, 2026', 'Medium Chance', 'Medium Competition', ARRAY['United States', 'United Kingdom', 'Germany']),
  
  ('Study in Asia Grant', '$8,000', 'Asian Educational Exchange', 'Students interested in studying in Asian universities', 'March 30, 2026', 'High Chance', 'Low Competition', ARRAY['Japan', 'Singapore', 'China', 'South Korea']),
  
  ('European Excellence Award', '$15,000', 'European Academic Foundation', 'Students planning to study in Europe with strong academic record', 'April 15, 2026', 'Low Chance', 'High Competition', ARRAY['France', 'Germany', 'Italy', 'Spain']),
  
  ('Commonwealth Scholarship', '$20,000', 'Commonwealth Education Trust', 'Students from Commonwealth countries with outstanding academic achievements', 'February 28, 2026', 'Medium Chance', 'High Competition', ARRAY['United Kingdom', 'Canada', 'Australia', 'New Zealand']); 