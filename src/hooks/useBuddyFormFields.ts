import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface FormField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: string;
  field_placeholder?: string;
  is_required: boolean;
  options?: string[];
  order: number;
}

export const useBuddyFormFields = () => {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('buddy_form_fields')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) throw error;
        
        setFields(data || []);
      } catch (err) {
        console.error('Error fetching buddy form fields:', err);
        setError('Failed to load form fields. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormFields();
  }, []);

  return { fields, loading, error };
};

export default useBuddyFormFields; 