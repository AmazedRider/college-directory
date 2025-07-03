import React, { useState, useEffect } from 'react';
import { MapPin, Loader2, Search, Filter, Star, BookOpen, DollarSign, Clock, GraduationCap, Heart, Share2, Eye, Building, Globe, Landmark, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Cal from "@calcom/embed-react";

interface Course {
  id: string;
  course_name: string;
  university_name: string;
  location: string;
  tuition_fee: string;
  duration: string;
  degree_type: string;
  description: string;
}

export function CourseFinderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Relevance');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCourses, setTotalCourses] = useState(0);
  
  // Filter states
  const [country, setCountry] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [degreeTypes, setDegreeTypes] = useState<string[]>([]);
  const [tuitionRange, setTuitionRange] = useState(100000);
  const [intakePeriods, setIntakePeriods] = useState<string[]>([]);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  
  const [showBooking, setShowBooking] = React.useState(false);
  
  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error, count } = await supabase
        .from('university_courses')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCourses(data || []);
      setTotalCourses(count || 0);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle degree type selection
  const toggleDegreeType = (degreeType: string) => {
    setDegreeTypes(prev => 
      prev.includes(degreeType)
        ? prev.filter(type => type !== degreeType)
        : [...prev, degreeType]
    );
  };

  // Toggle intake period selection
  const toggleIntakePeriod = (period: string) => {
    setIntakePeriods(prev => 
      prev.includes(period)
        ? prev.filter(p => p !== period)
        : [...prev, period]
    );
  };

  // Apply filters
  const applyFilters = () => {
    setIsFiltersApplied(true);
  };

  // Reset filters
  const resetFilters = () => {
    setCountry('');
    setFieldOfStudy('');
    setDegreeTypes([]);
    setTuitionRange(100000);
    setIntakePeriods([]);
    setIsFiltersApplied(false);
  };

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter(course => {
    // Text search (always applied)
    const matchesSearch = 
      searchQuery === '' || 
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Only apply the additional filters if the apply button was clicked
    if (!isFiltersApplied) return true;
    
    // Country filter
    if (country && !course.location.toLowerCase().includes(country.toLowerCase())) {
      return false;
    }
    
    // Field of study filter (basic implementation - would need more structured data for better filtering)
    if (fieldOfStudy && !course.course_name.toLowerCase().includes(fieldOfStudy.toLowerCase())) {
      return false;
    }
    
    // Degree type filter
    if (degreeTypes.length > 0 && !degreeTypes.some(type => 
      course.degree_type.toLowerCase().includes(type.toLowerCase())
    )) {
      return false;
    }
    
    // Tuition fee filter (basic implementation assuming the format has numbers)
    if (tuitionRange < 100000) {
      // Extract numeric part from tuition fee string (this is a simplification)
      const feeMatch = course.tuition_fee.match(/\$?([\d,]+)/);
      if (feeMatch) {
        const fee = parseInt(feeMatch[1].replace(/,/g, ''));
        if (fee > tuitionRange) return false;
      }
    }
    
    // Intake periods (this would require actual data about intake periods)
    // For now, we'll assume all courses match if no intake period is selected
    if (intakePeriods.length > 0) {
      // This is a placeholder. In a real application, you would check if the course's intake periods
      // include any of the selected intake periods
      // return intakePeriods.some(period => course.intakePeriods.includes(period));
    }
    
    return true;
  });

  // Sort filtered courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === 'PriceLowToHigh') {
      // Extract numeric part from tuition fee string (this is a simplification)
      const aFeeMatch = a.tuition_fee.match(/\$?([\d,]+)/);
      const bFeeMatch = b.tuition_fee.match(/\$?([\d,]+)/);
      
      const aFee = aFeeMatch ? parseInt(aFeeMatch[1].replace(/,/g, '')) : 0;
      const bFee = bFeeMatch ? parseInt(bFeeMatch[1].replace(/,/g, '')) : 0;
      
      return aFee - bFee;
    } else if (sortOption === 'PriceHighToLow') {
      // Extract numeric part from tuition fee string (this is a simplification)
      const aFeeMatch = a.tuition_fee.match(/\$?([\d,]+)/);
      const bFeeMatch = b.tuition_fee.match(/\$?([\d,]+)/);
      
      const aFee = aFeeMatch ? parseInt(aFeeMatch[1].replace(/,/g, '')) : 0;
      const bFee = bFeeMatch ? parseInt(bFeeMatch[1].replace(/,/g, '')) : 0;
      
      return bFee - aFee;
    }
    
    // Default sort by relevance (created_at desc, which is handled by the API)
    return 0;
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the filteredCourses variable
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f4f8fb] via-[#f6fbfa] to-[#eaf6fa] relative overflow-hidden py-0 px-2">
      {/* Blurred Gradient Blobs */}
      <div className="absolute left-[-10vw] top-[-10vh] w-[400px] h-[400px] bg-[#e0e7ff] rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute right-[-8vw] bottom-[-8vh] w-[350px] h-[350px] bg-[#99f6e4] rounded-full blur-3xl opacity-30 z-0" />
      {/* Greenish Tint Blob (left side) */}
      <div className="absolute left-[-15vw] top-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#6ee7b7] via-[#a7f3d0] to-transparent rounded-full blur-3xl opacity-50 z-0" />
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center min-h-[80vh] z-10">
        {/* Badge */}
        <div className="flex items-center gap-2 px-6 py-2 bg-white border border-[#e0e7ff] rounded-full shadow text-[#6366f1] font-semibold text-base mb-8 mt-8 max-w-fit mx-auto animate-fade-in">
          <BookOpen className="w-5 h-5 text-[#6366f1]" />
          Global University & Course Directory
        </div>
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a]">
          Find Your <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Perfect University</span>
        </h1>
        {/* Description */}
        <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium">
          Discover top universities and courses worldwide. Filter by country, field of study, tuition, and more to find your ideal academic path.
        </p>
        {/* Details Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 z-10">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-base shadow-sm border border-green-200">Top Universities <span className="font-bold ml-1">(100+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold text-base shadow-sm border border-blue-200">Popular Courses <span className="font-bold ml-1">(500+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-base shadow-sm border border-yellow-200">Affordable Tuition <span className="font-bold ml-1">(50+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-pink-100 text-pink-800 font-semibold text-base shadow-sm border border-pink-200">Global Recognition <span className="font-bold ml-1">(30+)</span></span>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 w-full">
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 flex flex-col gap-6 items-center w-full">
          {/* Search bar row */}
          <div className="w-full mb-2">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-blue-300" />
              <input
                type="text"
                placeholder="Search courses by name, university, or keyword..."
                className="w-full pl-14 pr-4 py-5 text-lg border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 bg-blue-50 text-gray-900 shadow font-semibold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* Filters row */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Country Filter */}
            <select
              className="w-full px-4 py-4 text-base rounded-xl border border-blue-100 bg-blue-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 hover:border-blue-300"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              aria-label="Filter by country"
            >
              <option value="">All Countries</option>
              <option value="USA">🇺🇸 United States</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="Germany">🇩🇪 Germany</option>
              <option value="Netherlands">🇳🇱 Netherlands</option>
              <option value="Singapore">🇸🇬 Singapore</option>
              <option value="New Zealand">🇳🇿 New Zealand</option>
            </select>
            {/* Field of Study Filter */}
            <select
              className="w-full px-4 py-4 text-base rounded-xl border border-purple-100 bg-purple-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all duration-200 hover:border-purple-300"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              aria-label="Filter by field of study"
            >
              <option value="">All Fields</option>
              <option value="Computer Science">💻 Computer Science</option>
              <option value="Business">📊 Business & Management</option>
              <option value="Engineering">⚙️ Engineering</option>
              <option value="Medicine">🏥 Medicine & Health</option>
              <option value="Arts">🎨 Arts & Design</option>
              <option value="Law">⚖️ Law</option>
              <option value="Education">📚 Education</option>
              <option value="Science">🔬 Science</option>
            </select>
            {/* Degree Level Filter */}
            <select
              className="w-full px-4 py-4 text-base rounded-xl border border-green-100 bg-green-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 hover:border-green-300"
              value={degreeTypes[0] || ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  setDegreeTypes([]);
                } else {
                  setDegreeTypes([e.target.value]);
                }
              }}
              aria-label="Filter by degree level"
            >
              <option value="">All Levels</option>
              <option value="Bachelor">Bachelor's Degree</option>
              <option value="Master">Master's Degree</option>
              <option value="Doctorate">PhD/Doctorate</option>
              <option value="Certificate">Diploma/Certificate</option>
            </select>
            {/* Tuition Fee Range */}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tuition Fee (₹):</label>
              <input
                type="number"
                min="0"
                className="w-full px-4 py-3 text-base rounded-xl border border-yellow-100 bg-yellow-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300"
                value={tuitionRange}
                onChange={e => setTuitionRange(Number(e.target.value))}
                aria-label="Max tuition fee"
              />
            </div>
          </div>
          {/* Intake Periods */}
          <div className="w-full flex flex-wrap gap-4 items-center mt-4">
            <label className="block text-sm font-medium text-gray-700">Intake Period:</label>
            {['Fall', 'Winter', 'Spring', 'Summer'].map(period => (
              <label key={period} className="inline-flex items-center gap-2 text-gray-700 font-medium">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded-lg"
                  checked={intakePeriods.includes(period)}
                  onChange={() => toggleIntakePeriod(period)}
                />
                {period}
              </label>
            ))}
          </div>
          {/* Apply/Reset Buttons */}
          <div className="w-full flex flex-wrap gap-4 items-center justify-end mt-4">
            <button
              type="button"
              onClick={applyFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
            >
              Apply All Filters
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="bg-white border-2 border-blue-200 text-blue-600 font-semibold rounded-xl px-6 py-3 shadow hover:bg-blue-50 transition-all duration-200"
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter and Results Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Results Info and Sort */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                  <p className="text-lg text-gray-700 font-semibold">
                    {loading 
                      ? 'Loading courses...' 
                      : error 
                        ? 'Error loading courses' 
                        : `${sortedCourses.length} of ${totalCourses} courses found`
                    }
                  </p>
                </div>
                {isFiltersApplied && (
                  <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-medium border border-primary/20">
                    Filters Applied
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="sort" className="text-sm text-gray-600 font-medium">Sort by:</label>
                <select
                  id="sort"
                  className="text-sm border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white shadow-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="Relevance">Relevance</option>
                  <option value="PriceLowToHigh">Price: Low to High</option>
                  <option value="PriceHighToLow">Price: High to Low</option>
                  <option value="Rating">Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Results - Card Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 col-span-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4 mx-auto" />
                <p className="text-gray-600 text-lg text-center">Loading courses...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 col-span-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-200 max-w-md mx-auto">
                <p className="text-red-600 text-lg mb-4">{error}</p>
                <button 
                  onClick={fetchCourses}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : sortedCourses.length === 0 ? (
            <div className="text-center py-16 col-span-full">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 max-w-md mx-auto">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-4">
                  {searchQuery || isFiltersApplied
                    ? 'No courses found matching your search criteria. Try adjusting your filters.'
                    : 'No courses available at this time.'}
                </p>
                {isFiltersApplied && (
                  <button 
                    onClick={resetFilters}
                    className="text-primary hover:text-primary/80 font-medium underline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            sortedCourses.map(course => {
              // Mock data for type, rating, and popular courses
              const type = Math.random() > 0.5 ? 'Public' : 'Private';
              const rating = (4.5 + Math.random() * 0.5).toFixed(1);
              const popularCourses = ['Business', 'Engineering', 'Medicine', 'Liberal Arts', 'Sciences', 'Law', 'Computer Science'];
              const coursePills = popularCourses.slice(0, Math.floor(Math.random() * 3) + 2);
              // Random SVGs for each card
              const svgIcons = [
                <GraduationCap className="h-7 w-7 text-purple-500" />,
                <Heart className="h-7 w-7 text-red-500" />,
                <Star className="h-7 w-7 text-yellow-500" />,
                <BookOpen className="h-7 w-7 text-blue-500" />,
                <Globe className="h-7 w-7 text-green-500" />,
                <Landmark className="h-7 w-7 text-orange-500" />,
                <MapPin className="h-7 w-7 text-pink-500" />,
                <Building className="h-7 w-7 text-teal-500" />,
              ];
              const svgIcon = svgIcons[Math.floor(Math.random() * svgIcons.length)];
              const flag = (
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 border border-gray-200 shadow">{svgIcon}</span>
              );
              return (
                <div key={course.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col justify-between min-h-[420px] relative group transition-all duration-200 hover:shadow-2xl">
                  {/* Top Row: Flag/SVG and Rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div>{flag}</div>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span>{rating}</span>
                    </div>
                  </div>
                  {/* University Name and Location */}
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{course.university_name}</h3>
                  <div className="flex items-center gap-2 text-gray-500 mb-4">
                    <MapPin className="h-5 w-5" />
                    <span className="text-base font-medium">{course.location}</span>
                  </div>
                  {/* Tuition and Type */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-700 font-semibold text-lg">Tuition:</div>
                    <div className="text-xl font-bold text-gray-900">{course.tuition_fee || 'N/A'}</div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-gray-700 font-semibold">Type:</div>
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-bold ${type === 'Private' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{type}</span>
                  </div>
                  {/* Popular Courses */}
                  <div className="mb-4">
                    <div className="text-gray-700 font-semibold mb-1">Popular Courses:</div>
                    <div className="flex flex-wrap gap-2">
                      {coursePills.map((pill, idx) => (
                        <span key={idx} className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold border border-gray-200">{pill}</span>
                      ))}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button
                      className="flex-1 bg-[#5b4bdb] hover:bg-[#4338ca] text-white px-4 py-2 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow text-base min-w-0"
                      onClick={() => setShowBooking(true)}
                    >
                      <GraduationCap className="h-5 w-5" />
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
          <div className="h-full w-full flex flex-col">
            <div className="bg-white w-full flex-1 flex flex-col">
              <div className="flex-shrink-0 border-b border-gray-100 flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold text-gray-900">Book a Consultation</h3>
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close booking modal"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
                <Cal
                  calLink="forge/consultation"
                  style={{ width: "100%", height: "100vh", overflow: "auto" }}
                  config={{ layout: "month_view", hideEventTypeDetails: "false" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 