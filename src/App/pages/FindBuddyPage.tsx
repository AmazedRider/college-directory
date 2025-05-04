import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import useBuddyFormFields from '../../hooks/useBuddyFormFields';

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

export function FindBuddyPage() {
  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'register'
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [searchData, setSearchData] = useState<Record<string, any>>({});
  const [matchingBuddies, setMatchingBuddies] = useState<Buddy[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Fetch dynamic form fields
  const { fields, loading: fieldsLoading, error: fieldsError } = useBuddyFormFields();

  // ADD THIS: State for featured buddies
  const [featuredBuddies, setFeaturedBuddies] = useState<Buddy[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(false);

  // ADD THIS: Fetch featured buddies on component mount
  useEffect(() => {
    if (activeTab === 'find' && !searchPerformed) {
      fetchFeaturedBuddies();
    }
  }, [activeTab]);

  // ADD THIS: Function to fetch featured buddies
  const fetchFeaturedBuddies = async () => {
    try {
      setLoadingFeatured(true);
      
      const { data, error } = await supabase
        .from('buddies')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFeaturedBuddies(data || []);
    } catch (error) {
      console.error('Error fetching featured buddies:', error);
    } finally {
      setLoadingFeatured(false);
    }
  };

  // Handle form data change
  const handleInputChange = (fieldName: string, value: any) => {
    if (activeTab === 'find') {
      setSearchData(prev => ({ ...prev, [fieldName]: value }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  // Search for buddies
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setSearchPerformed(true);
      
      // Check if any search criteria are provided
      const hasSearchCriteria = Object.values(searchData).some(value => 
        value !== undefined && value !== null && value !== ''
      );
      
      // If no search criteria, fetch all buddies (limited to a reasonable number)
      if (!hasSearchCriteria) {
        const { data, error } = await supabase
          .from('buddies')
          .select('*')
          .limit(20)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setMatchingBuddies(data || []);
        setLoading(false);
        return;
      }
      
      // Otherwise, use filters as before
      let query = supabase.from('buddies').select('*');
      
      // Add filters for each search criteria
      if (searchData.destination_country) {
        query = query.eq('destination_country', searchData.destination_country);
      }
      
      if (searchData.university) {
        query = query.ilike('university', `%${searchData.university}%`);
      }
      
      if (searchData.field_of_study) {
        query = query.eq('field_of_study', searchData.field_of_study);
      }
      
      if (searchData.intake) {
        query = query.eq('intake', searchData.intake);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setMatchingBuddies(data || []);
    } catch (error) {
      console.error('Error searching for buddies:', error);
      toast.error('Failed to search for buddies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Register as a buddy
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Check for required fields
      const requiredFields = fields.filter(field => field.is_required);
      for (const field of requiredFields) {
        if (!formData[field.field_name]) {
          toast.error(`Please fill in the ${field.field_label} field.`);
          setLoading(false);
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('buddies')
        .insert([formData])
        .select();
      
      if (error) throw error;
      
      toast.success('Successfully registered as a buddy!');
      setFormData({});
      setActiveTab('find');
    } catch (error) {
      console.error('Error registering as buddy:', error);
      toast.error('Failed to register as a buddy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render form field based on its type
  const renderFormField = (field: any, isSearchForm = false) => {
    const value = isSearchForm ? searchData[field.field_name] || '' : formData[field.field_name] || '';
    
    switch (field.field_type) {
      case 'text':
      case 'email':
        return (
          <input 
            type={field.field_type}
            id={`${isSearchForm ? 'search-' : ''}${field.field_name}`}
            name={field.field_name}
            placeholder={field.field_placeholder || `Enter ${field.field_label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required={isSearchForm ? false : field.is_required}
          />
        );
        
      case 'textarea':
        return (
          <textarea 
            id={`${isSearchForm ? 'search-' : ''}${field.field_name}`}
            name={field.field_name}
            placeholder={field.field_placeholder || `Enter ${field.field_label.toLowerCase()}`}
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required={isSearchForm ? false : field.is_required}
          />
        );
        
      case 'select':
        return (
          <select 
            id={`${isSearchForm ? 'search-' : ''}${field.field_name}`}
            name={field.field_name}
            value={value}
            onChange={(e) => handleInputChange(field.field_name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required={isSearchForm ? false : field.is_required}
          >
            <option value="">{field.field_placeholder || `Select ${field.field_label.toLowerCase()}`}</option>
            {field.options?.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Find a Study Buddy | Admissions.app</title>
        <meta
          name="description"
          content="Connect with students heading to the same university or country as you. Find study buddies for your international education journey."
        />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Find a Buddy</h1>
          <p className="mt-4 text-xl text-gray-600">
            Connect with students heading to the same university or country as you.
          </p>
        </div>
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side - Forms */}
          <div className="lg:col-span-2">
            {/* Tabs - moved inside the left column */}
            <div className="flex mb-4">
              <button
                className={`flex-1 py-4 text-center font-medium text-lg border ${
                  activeTab === 'find' 
                    ? 'bg-gray-100 text-blue-600 border-gray-300 shadow-sm' 
                    : 'bg-white text-blue-600 hover:bg-gray-50 border-gray-200 shadow'
                } rounded-tl-lg rounded-bl-lg transition-all duration-200`}
                onClick={() => setActiveTab('find')}
              >
                Find a Buddy
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium text-lg border ${
                  activeTab === 'register' 
                    ? 'bg-gray-100 text-blue-600 border-gray-300 shadow-sm' 
                    : 'bg-white text-blue-600 hover:bg-gray-50 border-gray-200 shadow'
                } rounded-tr-lg rounded-br-lg transition-all duration-200`}
                onClick={() => setActiveTab('register')}
              >
                Register as a Buddy
              </button>
            </div>
          
            {fieldsLoading ? (
              <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 text-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-600">Loading form fields...</p>
              </div>
            ) : fieldsError ? (
              <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 text-center py-8">
                <p className="text-red-500">{fieldsError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* Find a Buddy Tab Content */}
                {activeTab === 'find' && (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Search for Study Buddies</h2>
                    <p className="text-gray-600 mb-6">Find students with similar study abroad plans to connect and share experiences.</p>
                    
                    <form onSubmit={handleSearch}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {fields
                          .filter(field => ['destination_country', 'university', 'field_of_study', 'intake'].includes(field.field_name))
                          .sort((a, b) => a.order - b.order)
                          .map(field => (
                            <div key={field.id}>
                              <label htmlFor={`search-${field.field_name}`} className="block text-sm font-medium text-gray-700 mb-2">
                                {field.field_label}
                              </label>
                              {renderFormField(field, true)}
                            </div>
                          ))
                        }
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-sm flex items-center justify-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Searching...
                          </>
                        ) : 'Search Buddies'}
                      </button>
                    </form>
                  </div>
                )}
                
                {/* Featured Buddies Section - Only show when on find tab and no search performed yet */}
                {activeTab === 'find' && !searchPerformed && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Study Buddies</h2>
                    {loadingFeatured ? (
                      <div className="text-center py-8">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-600">Loading featured buddies...</p>
                      </div>
                    ) : featuredBuddies.length === 0 ? (
                      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 text-center py-8">
                        <p className="text-gray-600">No buddies registered yet. Be the first to register!</p>
                        <button 
                          onClick={() => setActiveTab('register')}
                          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
                        >
                          Register as a Buddy
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredBuddies.map((buddy) => (
                          <div key={buddy.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex items-start mb-4">
                              <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 mr-4 flex items-center justify-center text-blue-500 font-bold text-xl">
                                  {buddy.profile_image_url ? (
                                    <img src={buddy.profile_image_url} alt={buddy.full_name} className="w-full h-full object-cover" />
                                  ) : (
                                    buddy.full_name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">{buddy.full_name}</h3>
                                <p className="text-gray-600">{buddy.destination_country}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <p className="flex items-center text-gray-700">
                                <span className="inline-block w-5 mr-2">📍</span>
                                Going to: {buddy.destination_country}
                              </p>
                              {buddy.university && (
                                <p className="flex items-center text-gray-700">
                                  <span className="inline-block w-5 mr-2">🎓</span>
                                  {buddy.university}, {buddy.field_of_study}
                                </p>
                              )}
                              {buddy.intake && (
                                <p className="flex items-center text-gray-700">
                                  <span className="inline-block w-5 mr-2">📅</span>
                                  {buddy.intake} Intake
                                </p>
                              )}
                            </div>
                            
                            {buddy.about_me && (
                              <p className="text-gray-700 mb-4 line-clamp-3">
                                {buddy.about_me}
                              </p>
                            )}
                            
                            {buddy.interests && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {buddy.interests.split(',').slice(0, 3).map((interest, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {interest.trim()}
                                  </span>
                                ))}
                                {buddy.interests.split(',').length > 3 && (
                                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                    +{buddy.interests.split(',').length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex gap-3">
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-blue-700 transition-colors">
                                <span className="mr-2">✉️</span> Connect
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Register as a Buddy Tab Content */}
                {activeTab === 'register' && (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Register as a Study Buddy</h2>
                    <p className="text-gray-600 mb-6">Share your study abroad plans to connect with other students.</p>
                    
                    <form onSubmit={handleRegister} className="space-y-6">
                      {fields.sort((a, b) => a.order - b.order).map(field => (
                        <div key={field.id} className={field.field_type === 'textarea' ? 'col-span-1 md:col-span-2' : ''}>
                          <label htmlFor={field.field_name} className="block text-sm font-medium text-gray-700 mb-2">
                            {field.field_label} {field.is_required && <span className="text-red-500">*</span>}
                          </label>
                          {renderFormField(field)}
                        </div>
                      ))}
                      
                      <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-sm flex items-center justify-center"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                          </>
                        ) : 'Register as a Buddy'}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
            
            {/* Display matching buddies when search is performed */}
            {activeTab === 'find' && searchPerformed && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Matching Buddies</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Searching for matching buddies...</p>
                  </div>
                ) : matchingBuddies.length === 0 ? (
                  <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 text-center py-8">
                    <p className="text-gray-600">No matching buddies found for your search criteria.</p>
                    <p className="text-gray-600 mt-2">Try removing some filters or click Search without any filters to see all available buddies.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchingBuddies.map((buddy) => (
                      <div key={buddy.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <div className="flex items-start mb-4">
                          <div className="bg-gray-200 w-16 h-16 rounded-full mr-4"></div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{buddy.full_name}</h3>
                            <p className="text-gray-600">From {buddy.destination_country}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="flex items-center text-gray-700">
                            <span className="inline-block w-5 mr-2">📍</span>
                            Going to: {buddy.destination_country}
                          </p>
                          {buddy.university && (
                            <p className="flex items-center text-gray-700">
                              <span className="inline-block w-5 mr-2">🎓</span>
                              {buddy.university}, {buddy.field_of_study}
                            </p>
                          )}
                          {buddy.intake && (
                            <p className="flex items-center text-gray-700">
                              <span className="inline-block w-5 mr-2">📅</span>
                              {buddy.intake} Intake
                            </p>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          {buddy.about_me}
                        </p>
                        
                        {buddy.interests && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {buddy.interests.split(',').map((interest, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {interest.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex gap-3">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-sm">
                            <span className="mr-2">✉️</span> Send Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right side - How It Works and Benefits */}
          <div>
            {/* How It Works */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-lg mr-3 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Register Your Profile</h3>
                    <p className="text-gray-600 text-sm">Share your study abroad plans, university, and interests.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-lg mr-3 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Find Matching Buddies</h3>
                    <p className="text-gray-600 text-sm">Search for students with similar study destinations and interests.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-lg mr-3 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Connect Safely</h3>
                    <p className="text-gray-600 text-sm">Use our platform to connect with potential buddies through messages.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold text-lg mr-3 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Build Your Network</h3>
                    <p className="text-gray-600 text-sm">Start your international journey with friends who share your goals.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Benefits Section */}
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Benefits of Finding a Buddy</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-800">Reduce anxiety about studying in a new country</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-800">Share accommodation and living expenses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-800">Exchange tips on visa applications and preparations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-800">Have a familiar face on campus from day one</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3">✓</span>
                  <span className="text-gray-800">Build an international network of friends</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 