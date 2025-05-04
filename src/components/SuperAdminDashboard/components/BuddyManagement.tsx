import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { PencilIcon, TrashIcon, PlusIcon, X, UserPlus, Settings, AlertTriangle, Database } from 'lucide-react';
import toast from 'react-hot-toast';

interface Buddy {
  id: string;
  full_name: string;
  email: string;
  destination_country: string;
  university: string;
  field_of_study: string;
  intake: string;
  about_me: string;
  interests: string;
  created_at: string;
}

interface FormField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  options?: string[];
  order: number;
}

export function BuddyManagement() {
  const [buddies, setBuddies] = useState<Buddy[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuddyModal, setShowBuddyModal] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [showDatabaseSetupModal, setShowDatabaseSetupModal] = useState(false);
  const [currentBuddy, setCurrentBuddy] = useState<Partial<Buddy> | null>(null);
  const [currentField, setCurrentField] = useState<Partial<FormField> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('buddies'); // 'buddies' or 'form-fields'
  const [databaseInitStatus, setDatabaseInitStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [databaseError, setDatabaseError] = useState<string | null>(null);

  useEffect(() => {
    checkAndInitializeDatabase();
  }, []);

  useEffect(() => {
    if (databaseInitStatus === 'success') {
      if (activeTab === 'buddies') {
        loadBuddies();
      } else {
        loadFormFields();
      }
    }
  }, [activeTab, databaseInitStatus]);

  const checkAndInitializeDatabase = async () => {
    try {
      setLoading(true);
      
      // Check if buddy_form_fields table exists by trying to query it
      const { error: checkError } = await supabase
        .from('buddy_form_fields')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === '42P01') { // Table does not exist error
        // Show the database setup modal
        setShowDatabaseSetupModal(true);
        setDatabaseInitStatus('error');
        setDatabaseError('Buddy system database tables not found. Please run the SQL migration script.');
      } else if (checkError) {
        // Some other error occurred
        throw checkError;
      } else {
        // Table exists, everything is fine
        setDatabaseInitStatus('success');
        setShowDatabaseSetupModal(false);
      }
    } catch (error) {
      console.error('Error checking database:', error);
      setDatabaseError(error instanceof Error ? error.message : 'Unknown database error');
      setDatabaseInitStatus('error');
      setShowDatabaseSetupModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSqlFile = () => {
    // SQL content from the buddy_system_tables.sql file
    const sqlContent = `-- Create extension if it doesn't exist
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
  order INTEGER NOT NULL,
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
INSERT INTO buddy_form_fields (field_name, field_label, field_type, field_placeholder, is_required, options, order)
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
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();`;

      // Create a blob from the SQL content
      const blob = new Blob([sqlContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = url;
      a.download = 'buddy_system_tables.sql';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('SQL file downloaded successfully');
    };

  const loadBuddies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buddies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuddies(data || []);
    } catch (error) {
      console.error('Error loading buddies:', error);
      toast.error('Failed to load buddies');
    } finally {
      setLoading(false);
    }
  };

  const loadFormFields = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buddy_form_fields')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setFormFields(data || []);
    } catch (error) {
      console.error('Error loading form fields:', error);
      toast.error('Failed to load form fields');
    } finally {
      setLoading(false);
    }
  };

  // Buddy Management Functions
  const handleAddBuddy = () => {
    setCurrentBuddy({
      full_name: '',
      email: '',
      destination_country: '',
      university: '',
      field_of_study: '',
      intake: '',
      about_me: '',
      interests: ''
    });
    setShowBuddyModal(true);
  };

  const handleEditBuddy = (buddy: Buddy) => {
    setCurrentBuddy(buddy);
    setShowBuddyModal(true);
  };

  const handleDeleteBuddy = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this buddy?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('buddies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Buddy deleted successfully');
      loadBuddies();
    } catch (error) {
      console.error('Error deleting buddy:', error);
      toast.error('Failed to delete buddy');
    }
  };

  const handleSubmitBuddy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBuddy) return;

    try {
      const isEditing = !!currentBuddy.id;
      
      const buddyData = {
        full_name: currentBuddy.full_name || '',
        email: currentBuddy.email || '',
        destination_country: currentBuddy.destination_country || '',
        university: currentBuddy.university || '',
        field_of_study: currentBuddy.field_of_study || '',
        intake: currentBuddy.intake || '',
        about_me: currentBuddy.about_me || '',
        interests: currentBuddy.interests || ''
      };

      if (isEditing) {
        const { error } = await supabase
          .from('buddies')
          .update(buddyData)
          .eq('id', currentBuddy.id);

        if (error) throw error;
        toast.success('Buddy updated successfully');
      } else {
        const { error } = await supabase
          .from('buddies')
          .insert([buddyData]);

        if (error) throw error;
        toast.success('Buddy added successfully');
      }

      setShowBuddyModal(false);
      loadBuddies();
    } catch (error) {
      console.error('Error saving buddy:', error);
      toast.error('Failed to save buddy');
    }
  };

  // Form Field Management Functions
  const handleAddField = () => {
    setCurrentField({
      field_name: '',
      field_label: '',
      field_type: 'text',
      is_required: false,
      options: [],
      order: formFields.length + 1
    });
    setShowFieldModal(true);
  };

  const handleEditField = (field: FormField) => {
    setCurrentField({
      ...field,
      options: field.options || []
    });
    setShowFieldModal(true);
  };

  const handleDeleteField = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this form field?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('buddy_form_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Form field deleted successfully');
      loadFormFields();
    } catch (error) {
      console.error('Error deleting form field:', error);
      toast.error('Failed to delete form field');
    }
  };

  const handleSubmitField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentField) return;

    try {
      const isEditing = !!currentField.id;
      
      // Convert options array to string if needed
      const fieldData = {
        field_name: currentField.field_name || '',
        field_label: currentField.field_label || '',
        field_type: currentField.field_type || 'text',
        is_required: currentField.is_required || false,
        options: currentField.field_type === 'select' ? currentField.options : null,
        order: currentField.order || formFields.length + 1
      };

      if (isEditing) {
        const { error } = await supabase
          .from('buddy_form_fields')
          .update(fieldData)
          .eq('id', currentField.id);

        if (error) throw error;
        toast.success('Form field updated successfully');
      } else {
        const { error } = await supabase
          .from('buddy_form_fields')
          .insert([fieldData]);

        if (error) throw error;
        toast.success('Form field added successfully');
      }

      setShowFieldModal(false);
      loadFormFields();
    } catch (error) {
      console.error('Error saving form field:', error);
      toast.error('Failed to save form field');
    }
  };

  // Filter buddies based on search query
  const filteredBuddies = buddies.filter(buddy => 
    buddy.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.destination_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.field_of_study?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add option to field being edited
  const addOption = () => {
    if (currentField && currentField.options) {
      setCurrentField({
        ...currentField,
        options: [...currentField.options, '']
      });
    }
  };

  // Update option at index
  const updateOption = (index: number, value: string) => {
    if (currentField && currentField.options) {
      const newOptions = [...currentField.options];
      newOptions[index] = value;
      setCurrentField({
        ...currentField,
        options: newOptions
      });
    }
  };

  // Remove option at index
  const removeOption = (index: number) => {
    if (currentField && currentField.options) {
      const newOptions = [...currentField.options];
      newOptions.splice(index, 1);
      setCurrentField({
        ...currentField,
        options: newOptions
      });
    }
  };

  if (databaseInitStatus === 'checking' || loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Checking buddy system database...</p>
      </div>
    );
  }

  // Database Setup Modal
  if (showDatabaseSetupModal) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-start">
            <Database className="h-6 w-6 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-blue-800 text-lg mb-2">Database Setup Required</h3>
              <p className="text-blue-700 mb-4">
                The buddy system requires some database tables to be created before it can be used.
              </p>
              
              <h4 className="font-medium text-blue-800 mb-2">Setup Instructions:</h4>
              <ol className="list-decimal pl-5 text-blue-700 mb-4 space-y-1">
                <li>Go to your Supabase dashboard</li>
                <li>Open the SQL editor</li>
                <li>
                  Copy and paste the SQL script from <code className="bg-blue-200 px-1 rounded">src/db/migrations/buddy_system_tables.sql</code> or
                  <button 
                    onClick={handleDownloadSqlFile}
                    className="ml-2 text-blue-600 underline hover:text-blue-800"
                  >
                    download it here
                  </button>
                </li>
                <li>Run the script</li>
                <li>Return to this page and click the button below</li>
              </ol>
              
              <button 
                onClick={checkAndInitializeDatabase}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                I've Run the SQL Script
              </button>
              
              {databaseError && (
                <div className="mt-4 bg-red-100 p-3 rounded text-sm text-red-700 font-mono overflow-x-auto">
                  Error: {databaseError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Buddy System Management</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('buddies')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              activeTab === 'buddies' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <UserPlus size={16} />
            Buddies
          </button>
          <button 
            onClick={() => setActiveTab('form-fields')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              activeTab === 'form-fields' 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Settings size={16} />
            Form Settings
          </button>
        </div>
      </div>

      {activeTab === 'buddies' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search buddies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 pr-10 border rounded-md"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button 
              onClick={handleAddBuddy}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <PlusIcon size={16} />
              Add New Buddy
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Destination</th>
                    <th className="py-3 px-4 text-left">University</th>
                    <th className="py-3 px-4 text-left">Field of Study</th>
                    <th className="py-3 px-4 text-left">Intake</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuddies.length > 0 ? (
                    filteredBuddies.map((buddy) => (
                      <tr key={buddy.id} className="border-b border-gray-200">
                        <td className="py-3 px-4">{buddy.full_name}</td>
                        <td className="py-3 px-4">{buddy.email}</td>
                        <td className="py-3 px-4">{buddy.destination_country}</td>
                        <td className="py-3 px-4">{buddy.university}</td>
                        <td className="py-3 px-4">{buddy.field_of_study}</td>
                        <td className="py-3 px-4">{buddy.intake}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            onClick={() => handleEditBuddy(buddy)}
                            className="p-1 bg-blue-100 text-blue-600 rounded"
                            title="Edit buddy"
                          >
                            <PencilIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBuddy(buddy.id)}
                            className="p-1 bg-red-100 text-red-600 rounded"
                            title="Delete buddy"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        {searchQuery
                          ? 'No buddies found matching your search criteria.'
                          : 'No buddies available. Click "Add New Buddy" to create one.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Buddy Form Fields Configuration</h2>
            <button 
              onClick={handleAddField}
              className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <PlusIcon size={16} />
              Add New Field
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Order</th>
                    <th className="py-3 px-4 text-left">Field Name</th>
                    <th className="py-3 px-4 text-left">Label</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Required</th>
                    <th className="py-3 px-4 text-left">Options</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formFields.length > 0 ? (
                    formFields.map((field) => (
                      <tr key={field.id} className="border-b border-gray-200">
                        <td className="py-3 px-4">{field.order}</td>
                        <td className="py-3 px-4">{field.field_name}</td>
                        <td className="py-3 px-4">{field.field_label}</td>
                        <td className="py-3 px-4">{field.field_type}</td>
                        <td className="py-3 px-4">{field.is_required ? 'Yes' : 'No'}</td>
                        <td className="py-3 px-4">
                          {field.options && field.options.length > 0 
                            ? field.options.join(', ') 
                            : '-'}
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            onClick={() => handleEditField(field)}
                            className="p-1 bg-blue-100 text-blue-600 rounded"
                            title="Edit field"
                          >
                            <PencilIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteField(field.id)}
                            className="p-1 bg-red-100 text-red-600 rounded"
                            title="Delete field"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No form fields configured. Click "Add New Field" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Buddy Modal */}
      {showBuddyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentBuddy?.id ? 'Edit Buddy' : 'Add New Buddy'}
              </h2>
              <button onClick={() => setShowBuddyModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitBuddy} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={currentBuddy?.full_name || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, full_name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={currentBuddy?.email || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Destination Country</label>
                <input
                  type="text"
                  value={currentBuddy?.destination_country || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, destination_country: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Country"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">University</label>
                <input
                  type="text"
                  value={currentBuddy?.university || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, university: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="University"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Field of Study</label>
                <input
                  type="text"
                  value={currentBuddy?.field_of_study || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, field_of_study: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Field of Study"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Intake</label>
                <input
                  type="text"
                  value={currentBuddy?.intake || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, intake: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Fall 2024"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">About Me</label>
                <textarea
                  value={currentBuddy?.about_me || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, about_me: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="About the buddy..."
                  rows={4}
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium mb-1">Interests</label>
                <input
                  type="text"
                  value={currentBuddy?.interests || ''}
                  onChange={(e) => setCurrentBuddy({ ...currentBuddy, interests: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Music, Sports, Reading, Travel"
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBuddyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  {currentBuddy?.id ? 'Update Buddy' : 'Add Buddy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Form Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {currentField?.id ? 'Edit Form Field' : 'Add New Form Field'}
              </h2>
              <button onClick={() => setShowFieldModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitField} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Field Name (ID)</label>
                  <input
                    type="text"
                    value={currentField?.field_name || ''}
                    onChange={(e) => setCurrentField({ ...currentField, field_name: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., full_name, destination_country"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is used as the field identifier in the database.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Field Label</label>
                  <input
                    type="text"
                    value={currentField?.field_label || ''}
                    onChange={(e) => setCurrentField({ ...currentField, field_label: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Full Name, Destination Country"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is shown to users on the form.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Field Type</label>
                  <select
                    value={currentField?.field_type || 'text'}
                    onChange={(e) => setCurrentField({ 
                      ...currentField, 
                      field_type: e.target.value,
                      options: e.target.value === 'select' ? (currentField?.options || []) : [] 
                    })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="textarea">Text Area</option>
                    <option value="select">Select (Dropdown)</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Field Order</label>
                  <input
                    type="number"
                    value={currentField?.order || 0}
                    onChange={(e) => setCurrentField({ ...currentField, order: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    placeholder="Field position in form"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required-field"
                  checked={currentField?.is_required || false}
                  onChange={(e) => setCurrentField({ ...currentField, is_required: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="required-field" className="text-sm font-medium">
                  This field is required
                </label>
              </div>

              {currentField?.field_type === 'select' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Options</label>
                  {currentField.options && currentField.options.map((option, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="flex-grow p-2 border rounded"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="p-2 bg-red-100 text-red-600 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 text-blue-600 text-sm flex items-center gap-1"
                  >
                    <PlusIcon size={14} /> Add Option
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowFieldModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  {currentField?.id ? 'Update Field' : 'Add Field'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 