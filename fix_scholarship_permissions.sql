-- Update RLS policies to allow anyone to view scholarships (including not logged in users)

-- First, check if the Public policy exists and drop it if it does (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view scholarships" ON scholarships;

-- Create a new policy that explicitly allows anonymous access
CREATE POLICY "Public can view scholarships" 
  ON scholarships 
  FOR SELECT 
  TO anon
  USING (true);

-- Make sure authenticated users can still view scholarships
DROP POLICY IF EXISTS "Authenticated users can view scholarships" ON scholarships;
CREATE POLICY "Authenticated users can view scholarships"
  ON scholarships 
  FOR SELECT
  TO authenticated
  USING (true);

-- Enable RLS to make sure it's active (in case it was disabled)
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Grant explicit SELECT permission to anonymous users
GRANT SELECT ON scholarships TO anon;

-- For debug purposes, run this to check all policies
-- SELECT * FROM pg_policies WHERE tablename = 'scholarships'; 