-- Create extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create table for buddy profiles
CREATE TABLE IF NOT EXISTS buddies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  destination_country TEXT NOT NULL,
  university TEXT,
  field_of_study TEXT,
  intake TEXT,
  about_me TEXT,
  interests TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for buddy form fields configuration
CREATE TABLE IF NOT EXISTS buddy_form_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL,
  field_placeholder TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  options TEXT[],
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for buddy connections
CREATE TABLE IF NOT EXISTS buddy_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES buddies(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES buddies(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Create table for buddy messages
CREATE TABLE IF NOT EXISTS buddy_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID REFERENCES buddy_connections(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES buddies(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES buddies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default form fields
INSERT INTO buddy_form_fields (field_name, field_label, field_type, field_placeholder, is_required, options, "order")
SELECT * FROM (
  VALUES 
    ('full_name', 'Full Name', 'text', 'Enter your full name', TRUE, NULL, 1),
    ('email', 'Email', 'email', 'Enter your email', TRUE, NULL, 2),
    ('destination_country', 'Destination Country', 'select', 'Select country', TRUE, 
     ARRAY['United States', 'United Kingdom', 'Canada', 'Australia', 'New Zealand', 'Germany', 'Japan', 'Singapore', 'France'], 3),
    ('university', 'University (Optional)', 'text', 'Enter university name', FALSE, NULL, 4),
    ('field_of_study', 'Field of Study', 'select', 'Select field', TRUE, 
     ARRAY['Computer Science', 'Business', 'Engineering', 'Medicine', 'Arts', 'Humanities', 'Science'], 5),
    ('intake', 'Intake', 'select', 'Select intake', TRUE, 
     ARRAY['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026'], 6),
    ('about_me', 'About Me', 'textarea', 'Share a bit about yourself, your interests, and what you''re looking for in a study buddy', TRUE, NULL, 7),
    ('interests', 'Interests (Optional)', 'text', 'e.g., Music, Sports, Reading, Travel', FALSE, NULL, 8)
) AS source
WHERE NOT EXISTS (SELECT 1 FROM buddy_form_fields LIMIT 1);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_buddies_updated_at ON buddies;
CREATE TRIGGER update_buddies_updated_at
BEFORE UPDATE ON buddies
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_buddy_form_fields_updated_at ON buddy_form_fields;
CREATE TRIGGER update_buddy_form_fields_updated_at
BEFORE UPDATE ON buddy_form_fields
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_buddy_connections_updated_at ON buddy_connections;
CREATE TRIGGER update_buddy_connections_updated_at
BEFORE UPDATE ON buddy_connections
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_buddy_messages_updated_at ON buddy_messages;
CREATE TRIGGER update_buddy_messages_updated_at
BEFORE UPDATE ON buddy_messages
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 