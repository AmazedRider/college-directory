-- Create scholarships table with all required fields including countries
CREATE TABLE IF NOT EXISTS scholarships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  amount TEXT NOT NULL,
  foundation TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  deadline TEXT NOT NULL,
  chance TEXT NOT NULL CHECK (chance IN ('High Chance', 'Medium Chance', 'Low Chance')),
  competition TEXT NOT NULL CHECK (competition IN ('High Competition', 'Medium Competition', 'Low Competition')),
  countries TEXT[],
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for common search fields
CREATE INDEX IF NOT EXISTS scholarships_name_idx ON scholarships (name);
CREATE INDEX IF NOT EXISTS scholarships_foundation_idx ON scholarships (foundation);
CREATE INDEX IF NOT EXISTS scholarships_chance_idx ON scholarships (chance);
CREATE INDEX IF NOT EXISTS scholarships_competition_idx ON scholarships (competition);
CREATE INDEX IF NOT EXISTS scholarships_countries_idx ON scholarships USING GIN (countries);

-- Create view for scholarship listings
CREATE OR REPLACE VIEW scholarship_listings AS
SELECT *
FROM scholarships
ORDER BY created_at DESC;

-- Enable Row Level Security
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow authenticated users to view all scholarships
CREATE POLICY "Authenticated users can view scholarships"
  ON scholarships FOR SELECT
  TO authenticated
  USING (true);

-- Allow public access to view scholarships
CREATE POLICY "Public can view scholarships"
  ON scholarships FOR SELECT
  TO anon
  USING (true);

-- Allow admin users to manage scholarships
CREATE POLICY "Admins can manage scholarships"
  ON scholarships FOR ALL
  TO authenticated
  USING (true);

-- Create trigger function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column before an update
CREATE TRIGGER update_scholarships_updated_at
BEFORE UPDATE ON scholarships
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample scholarships with country data
INSERT INTO scholarships (name, amount, foundation, eligibility, deadline, chance, competition, countries)
VALUES
  ('Global Excellence Scholarship', '$20,000', 'International Education Foundation', 'International students with a minimum GPA of 3.8 and demonstrated leadership skills', 'October 15, 2025', 'High Chance', 'High Competition', ARRAY['United States', 'United Kingdom', 'Canada']),
  
  ('Future Leaders Grant', '$15,000', 'Leadership Academy', 'Students with leadership positions and community service experience', 'November 30, 2025', 'Medium Chance', 'Medium Competition', ARRAY['Australia', 'New Zealand', 'Singapore']),
  
  ('STEM Innovation Award', '$25,000', 'Science & Technology Fund', 'Students pursuing degrees in STEM fields with research experience', 'September 1, 2025', 'Low Chance', 'High Competition', ARRAY['United States', 'Canada', 'Germany']),
  
  ('Arts & Humanities Scholarship', '$10,000', 'Cultural Heritage Foundation', 'Students in arts, literature, or humanities with creative portfolio', 'December 15, 2025', 'Medium Chance', 'Low Competition', ARRAY['United Kingdom', 'France', 'Germany']),
  
  ('First Generation Scholarship', '$18,000', 'Educational Access Initiative', 'First-generation college students with financial need', 'August 31, 2025', 'High Chance', 'Medium Competition', ARRAY['Canada', 'Australia', 'New Zealand']),
  
  ('International STEM Scholarship', '$12,000', 'Global Education Trust', 'International students pursuing STEM degrees with minimum GPA of 3.5', 'January 15, 2026', 'Medium Chance', 'Medium Competition', ARRAY['United States', 'United Kingdom', 'Germany']),
  
  ('Study in Asia Grant', '$8,000', 'Asian Educational Exchange', 'Students interested in studying in Asian universities', 'March 30, 2026', 'High Chance', 'Low Competition', ARRAY['Japan', 'Singapore', 'China', 'South Korea']),
  
  ('European Excellence Award', '$15,000', 'European Academic Foundation', 'Students planning to study in Europe with strong academic record', 'April 15, 2026', 'Low Chance', 'High Competition', ARRAY['France', 'Germany', 'Italy', 'Spain']),
  
  ('Commonwealth Scholarship', '$20,000', 'Commonwealth Education Trust', 'Students from Commonwealth countries with outstanding academic achievements', 'February 28, 2026', 'Medium Chance', 'High Competition', ARRAY['United Kingdom', 'Canada', 'Australia', 'New Zealand']);

-- Grant permissions
GRANT SELECT ON scholarships TO anon, authenticated;
GRANT ALL ON scholarships TO service_role; 