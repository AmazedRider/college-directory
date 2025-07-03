// import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';
// import { supabase } from '../../lib/supabase';
// import toast from 'react-hot-toast';
// import useBuddyFormFields from '../../hooks/useBuddyFormFields';

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
  profile_image_url?: string;
}

// export function FindBuddyPage() {
//   ...entire component code commented out...
// } 