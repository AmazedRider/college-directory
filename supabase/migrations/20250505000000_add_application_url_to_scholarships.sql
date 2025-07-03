-- Add application_url field to scholarships table
ALTER TABLE IF EXISTS scholarships ADD COLUMN IF NOT EXISTS application_url TEXT;

-- Update existing scholarships with sample application URLs
UPDATE scholarships 
SET application_url = 'https://www.internationaleducationfoundation.org/apply'
WHERE name = 'Global Excellence Scholarship';

UPDATE scholarships 
SET application_url = 'https://www.leadershipacademy.org/future-leaders-grant'
WHERE name = 'Future Leaders Grant';

UPDATE scholarships 
SET application_url = 'https://www.sciencetechfund.org/stem-innovation-award'
WHERE name = 'STEM Innovation Award';

UPDATE scholarships 
SET application_url = 'https://www.culturalheritage.org/arts-humanities-scholarship'
WHERE name = 'Arts & Humanities Scholarship';

UPDATE scholarships 
SET application_url = 'https://www.educationalaccess.org/first-generation-scholarship'
WHERE name = 'First Generation Scholarship';

UPDATE scholarships 
SET application_url = 'https://www.globaleducationtrust.org/international-stem'
WHERE name = 'International STEM Scholarship';

UPDATE scholarships 
SET application_url = 'https://www.asianeducationalexchange.org/study-in-asia'
WHERE name = 'Study in Asia Grant';

UPDATE scholarships 
SET application_url = 'https://www.europeanacademic.org/excellence-award'
WHERE name = 'European Excellence Award';

UPDATE scholarships 
SET application_url = 'https://www.commonwealtheducation.org/commonwealth-scholarship'
WHERE name = 'Commonwealth Scholarship';

-- Create index for application_url searches
CREATE INDEX IF NOT EXISTS scholarships_application_url_idx ON scholarships (application_url); 