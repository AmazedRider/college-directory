import React, { useState, useEffect, useMemo } from 'react';
import { GraduationCap, Sparkles, Calendar, Search, Globe, Star, Bookmark, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Typewriter } from 'react-simple-typewriter';

interface Scholarship {
  id: string;
  name: string;
  amount: string;
  foundation: string;
  eligibility: string;
  deadline: string;
  chance: 'High Chance' | 'Medium Chance' | 'Low Chance';
  competition: 'High Competition' | 'Medium Competition' | 'Low Competition';
  application_url?: string;
  countries?: string[];
  country?: string; // For backward compatibility
}

// Add a mapping of scholarship name to summary bullets
const scholarshipSummaries: Record<string, { link: string | null, bullets: string[] }> = {
  'CM Overseas Scholarship Scheme For Minorities': {
    link: 'https://telanganaepass.cgg.gov.in/OverseasReg.do?stu_details(studentAction)=unspecified&dept=7',
    bullets: [
      'For minority students from Telangana pursuing PG/PhD abroad.',
      'Covers up to ₹20,00,000 or full tuition + one-way airfare.',
      'Deadline: June 30, 2025.'
    ]
  },
  'Open Doors Russian Scholarship Project': {
    link: 'https://od.globaluni.ru/en/',
    bullets: [
      'Offered by the Russian Government & Association of Global Universities.',
      "Tuition and accommodation funded for master's/PhD students.",
      'Deadline: December 2025.'
    ]
  },
  'NRF Free-standing Scholarships': {
    link: 'https://www.nrf.ac.za',
    bullets: [
      'Supports postgraduate study at South African institutions.',
      'Covers tuition + monthly stipend.',
      'Deadline: August 2025.'
    ]
  },
  'Science Without Borders Program': {
    link: 'https://www.gov.br/cnpq/pt-br',
    bullets: [
      'Focus on STEM fields for international students.',
      'Offers tuition and monthly stipend.',
      'Intake: Varies annually.'
    ]
  },
  'Türkiye Scholarships': {
    link: 'https://www.turkiyeburslari.gov.tr',
    bullets: [
      "Fully funded for undergrad, master's, and PhD programs.",
      'Includes tuition, monthly stipend, accommodation.',
      'Deadline: February 2026.'
    ]
  },
  'KAUST Fellowship': {
    link: 'https://www.kaust.edu.sa/en/study/fellowships',
    bullets: [
      'Fully funded MS/PhD at KAUST with stipend, housing.',
      'GRE optional, no application fee.',
      'Deadline: December 2025.'
    ]
  },
  'Khalifa University Graduate Scholarships': {
    link: 'https://www.ku.ac.ae/scholarships',
    bullets: [
      "Master's and PhD scholarships for international students.",
      'Full tuition + stipend + travel support.',
      'Deadline: May 2025.'
    ]
  },
  'Thailand International Postgraduate Programme (TIPP)': {
    link: 'https://tica-th.org/en/page.php?page=328',
    bullets: [
      "Government-funded Master's programs in Thailand.",
      'Tuition, monthly stipend, and accommodation included.',
      'Deadline: March 2026.'
    ]
  },
  'Malaysian International Scholarship (MIS)': {
    link: 'https://biasiswa.mohe.gov.my/INTER/',
    bullets: [
      "For Master's and PhD studies in Malaysia.",
      'Includes tuition and monthly stipend.',
      'Deadline: April 2026.'
    ]
  },
  'Government of Ireland International Education Scholarships': {
    link: 'https://hea.ie/funding-governance/international/',
    bullets: [
      '€10,000 stipend + full tuition fee waiver.',
      "For master's or PhD study in Ireland.",
      'Deadline: March 2026.'
    ]
  },
  'Swiss Government Excellence Scholarships': {
    link: 'https://www.sbfi.admin.ch/sbfi/en/home/education/scholarships-and-grants/swiss-government-excellence-scholarships.html',
    bullets: [
      'For researchers and artists pursuing postgraduate work.',
      'Tuition, stipend, and insurance covered.',
      'Deadline: December 2025.'
    ]
  },
  'Singapore International Graduate Award (SINGA)': {
    link: 'https://www.a-star.edu.sg/singa',
    bullets: [
      'PhD scholarships in science and engineering.',
      'Tuition + monthly stipend + airfare.',
      'Deadline: December 2025.'
    ]
  },
  'Swedish Institute Scholarships for Global Professionals': {
    link: 'https://si.se/en/apply/scholarships/',
    bullets: [
      "Fully funded master's for professionals with leadership experience.",
      'Tuition + living + travel grant.',
      'Deadline: February 2026.'
    ]
  },
  'Holland Scholarship': {
    link: 'https://www.studyinholland.nl/finances/holland-scholarship',
    bullets: [
      '€5,000 grant for non-EEA students in year 1.',
      "For bachelor's and master's programs.",
      'Deadline: May 2026.'
    ]
  },
  'Eiffel Excellence Scholarship Program': {
    link: 'https://www.campusfrance.org/en/eiffel-scholarship-program-of-excellence',
    bullets: [
      "Funded by French Ministry for master's and PhD.",
      'Monthly stipend up to €1,700 + tuition.',
      'Deadline: January 2026.'
    ]
  },
  'Australia Awards Scholarships': {
    link: 'https://www.dfat.gov.au/people-to-people/australia-awards',
    bullets: [
      'Fully funded education + travel + monthly allowance.',
      'For long-term study in Australia (bachelor to PhD).',
      'Deadline: April 2026.'
    ]
  },
  'Chinese Government Scholarship (CSC)': {
    link: 'https://www.campuschina.org',
    bullets: [
      'Covers tuition, accommodation, and living stipend.',
      "For undergrad, master's, and PhD programs.",
      'Deadline: April 2026.'
    ]
  },
  'Global Korea Scholarship (GKS)': {
    link: 'https://studyinkorea.go.kr/en/sub/gks/allnew_invite.do',
    bullets: [
      'Fully funded for undergraduate and graduate degrees.',
      'Includes tuition, airfare, and living costs.',
      'Deadline: March 2026.'
    ]
  },
  'MEXT Scholarship': {
    link: 'https://www.studyinjapan.go.jp/en/smap-stopj-applications-scholarships.html',
    bullets: [
      'Funded by Japanese government for all levels.',
      'Tuition + monthly allowance + airfare.',
      'Deadline: January 2026 (varies by type).'
    ]
  },
  'DAAD Scholarships': {
    link: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/',
    bullets: [
      "Many programs available (master's/PhD).",
      'Covers tuition, monthly stipend, and insurance.',
      'Deadline: Varies by program.'
    ]
  },
  'Chevening Scholarships': {
    link: 'https://www.chevening.org/apply/',
    bullets: [
      "UK Government fully-funded master's degree.",
      'Tuition, flights, monthly stipend included.',
      'Deadline: November 2025.'
    ]
  },
  'Vanier Canada Graduate Scholarships': {
    link: 'https://vanier.gc.ca/en/home-accueil.html',
    bullets: [
      '$50,000/year for 3 years (PhD).',
      'Leadership + academic excellence required.',
      'Deadline: October 30, 2024.'
    ]
  },
  'Fulbright Foreign Student Program': {
    link: 'https://foreign.fulbrightonline.org/',
    bullets: [
      'Fully funded for graduate studies and research.',
      'Tuition + stipend + airfare + insurance.',
      'Deadline: Varies by country.'
    ]
  },
  'Future Leaders Grant': {
    link: null,
    bullets: [
      '$15,000 for students with leadership and community work.',
      'Deadline: November 30, 2025.'
    ]
  },
  'First Generation Scholarship': {
    link: null,
    bullets: [
      '$18,000 for first-gen college students with financial need.',
      'Deadline: August 31, 2025.'
    ]
  },
  'Arts & Humanities Scholarship': {
    link: null,
    bullets: [
      '$10,000 for creative portfolios in arts/lit/humanities.',
      'Deadline: December 15, 2025.'
    ]
  },
  'STEM Innovation Award': {
    link: null,
    bullets: [
      '$25,000 for STEM students with research experience.',
      'Deadline: September 1, 2025.'
    ]
  },
  'Global Excellence Scholarship': {
    link: null,
    bullets: [
      '$20,000 for students with GPA 3.8+ and leadership.',
      'Deadline: October 15, 2025.'
    ]
  },
};

// Add type options
const typeOptions = [
  'All Types',
  'Government',
  'University',
  'Merit-based',
  'Private',
  'NGO',
];

// Add amount options
const amountOptions = [
  { label: 'All Amounts', min: 0 },
  { label: '1L+', min: 100000 },
  { label: '5L+', min: 500000 },
  { label: '10L+', min: 1000000 },
  { label: '20L+', min: 2000000 },
  { label: '30L+', min: 3000000 },
  { label: '50L+', min: 5000000 },
];

export function ScholarshipFinderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOption, setSortOption] = useState('Relevance');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedAmount, setSelectedAmount] = useState(amountOptions[0].label);
  
  // Predefined list of countries for the filter
  const countries = [
    'All Countries',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'New Zealand',
    'Germany',
    'France',
    'Japan',
    'Singapore',
    'China',
    'India'
  ];
  
  // Fetch scholarships on component mount
  useEffect(() => {
    fetchScholarships();
  }, []);

  // Fetch scholarships from Supabase
  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setScholarships(data || []);
    } catch (error: any) {
      console.error('Error fetching scholarships:', error);
      setError('Failed to load scholarships. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter scholarships based on search query, category, country, type, and amount
  const filteredScholarships = scholarships.filter(scholarship => {
    // Search query filter
    const matchesQuery = searchQuery === '' ||
      scholarship.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.foundation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.eligibility?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All Categories' ||
      scholarship.eligibility?.toLowerCase().includes(selectedCategory.toLowerCase());
    
    // Country filter - handle both array of countries and single country string
    const matchesCountry = selectedCountry === 'All Countries' ||
      (scholarship.countries && Array.isArray(scholarship.countries) && 
        scholarship.countries.some(country => country.includes(selectedCountry))) ||
      (scholarship.country && scholarship.country.includes(selectedCountry)) ||
      scholarship.eligibility?.toLowerCase().includes(selectedCountry.toLowerCase());
    
    // Type filter (assume type is in scholarship.foundation or add a 'type' field if available)
    const matchesType = selectedType === 'All Types' ||
      (scholarship.foundation && scholarship.foundation.toLowerCase().includes(selectedType.toLowerCase())) ||
      (scholarship.eligibility && scholarship.eligibility.toLowerCase().includes(selectedType.toLowerCase()));
    
    // Amount filter (dropdown)
    const getAmount = (amt: string | undefined) => {
      if (!amt) return 0;
      const num = amt.replace(/[^\d]/g, '');
      return parseInt(num, 10) || 0;
    };
    const selectedAmountObj = amountOptions.find(opt => opt.label === selectedAmount) || amountOptions[0];
    const amount = getAmount(scholarship.amount);
    const matchesAmount = amount >= selectedAmountObj.min;
    
    return matchesQuery && matchesCategory && matchesCountry && matchesType && matchesAmount;
  });

  // Memoized sorted scholarships
  const sortedScholarships = useMemo(() => {
    let arr = [...filteredScholarships];
    if (sortOption === 'Amount: High to Low') {
      arr.sort((a, b) => {
        // Try to extract numeric value from amount string
        const getAmount = (amt: string | undefined): number => {
          if (!amt) return 0;
          const num = amt.replace(/[^\d]/g, '');
          return parseInt(num, 10) || 0;
        };
        return getAmount(b.amount) - getAmount(a.amount);
      });
    } else if (sortOption === 'Deadline: Soonest') {
      arr.sort((a, b) => {
        // Try to parse date
        const parseDate = (d: string | undefined): number => {
          if (!d) return Infinity;
          const date = new Date(d);
          return isNaN(date.getTime()) ? Infinity : date.getTime();
        };
        return parseDate(a.deadline) - parseDate(b.deadline);
      });
    }
    // Default: Relevance (no sort)
    return arr;
  }, [filteredScholarships, sortOption]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by filteredScholarships
  };

  // Get chance badge color
  const getChanceBadgeColor = (chance: string) => {
    switch(chance) {
      case 'High Chance':
        return 'bg-green-100 text-green-800';
      case 'Medium Chance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low Chance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get competition text color
  const getCompetitionColor = (competition: string) => {
    switch(competition) {
      case 'High Competition':
        return 'text-red-600';
      case 'Medium Competition':
        return 'text-orange-600';
      case 'Low Competition':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedCountry('All Countries');
    setSelectedType('All Types');
    setSelectedAmount(amountOptions[0].label);
  };

  // Handle apply button click
  const handleApplyClick = (scholarship: Scholarship) => {
    if (scholarship.application_url) {
      // Open the application URL in a new tab
      window.open(scholarship.application_url, '_blank', 'noopener,noreferrer');
    } else {
      // If no application URL is available, show an alert
      alert(`Application link for ${scholarship.name} is not available yet. Please check back later or contact the foundation directly.`);
    }
  };
  
  // Stats for the grid below hero
  const stats = [
    { number: '1,200+', label: 'Scholarships' },
    { number: '50+', label: 'Countries' },
    { number: '100+', label: 'Fields of Study' },
    { number: '₹100Cr+', label: 'Funding Opportunities' },
  ];
  
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
          <GraduationCap className="w-5 h-5 text-[#6366f1]" />
          India's Largest Scholarship Directory
        </div>
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a]">
          Find Your <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Perfect Scholarship</span>
        </h1>
        {/* Description */}
        <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium">
          Discover and apply to scholarships that match your profile and help fund your international education journey.
        </p>
        {/* Details Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 z-10">
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-base shadow-sm border border-green-200">Active Scholarships <span className="font-bold ml-1">(12+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-800 font-semibold text-base shadow-sm border border-blue-200">Overseas Scholarships <span className="font-bold ml-1">(8+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-base shadow-sm border border-yellow-200">Fully Funded <span className="font-bold ml-1">(5+)</span></span>
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-pink-100 text-pink-800 font-semibold text-base shadow-sm border border-pink-200">Deadline Soon <span className="font-bold ml-1">(3+)</span></span>
        </div>
      </div>
      {/* Search and Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Scholarship</h2>
            <p className="text-gray-600">Use our advanced search and filters to find the perfect scholarship for your needs.</p>
          </div>
          <form onSubmit={handleSearch} className="relative bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100 shadow-xl px-6 py-8 flex flex-col gap-6 items-center w-full">
            {/* Search bar row */}
            <div className="w-full mb-2">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-pink-300" />
                <input
                  type="text"
                  placeholder="Search scholarships or organizations..."
                  className="w-full pl-14 pr-4 py-5 text-lg border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 bg-pink-50 text-gray-900 shadow font-semibold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {/* Filters row */}
            <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
              <select
                className="w-full md:w-auto px-4 py-4 text-base rounded-xl border border-pink-100 bg-pink-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all duration-200 hover:border-pink-300"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option>All Categories</option>
                <option>STEM</option>
                <option>Business</option>
                <option>Arts & Humanities</option>
                <option>Social Sciences</option>
                <option>Healthcare</option>
              </select>
              <div className="relative w-full md:w-auto">
                <select
                  className="w-full px-4 py-4 text-base rounded-xl border border-blue-100 bg-blue-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 hover:border-blue-300 appearance-none pr-10"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  aria-label="Filter by country"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-blue-300" />
                </div>
              </div>
              <div className="relative w-full md:w-auto">
                <select
                  className="w-full px-4 py-4 text-base rounded-xl border border-green-100 bg-green-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition-all duration-200 hover:border-green-300 appearance-none pr-10"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  aria-label="Filter by type"
                >
                  {typeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Sparkles className="h-5 w-5 text-green-300" />
                </div>
              </div>
              <div className="relative w-full md:w-auto">
                <select
                  className="w-full px-4 py-4 text-base rounded-xl border border-yellow-100 bg-yellow-50 text-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:border-yellow-300 transition-all duration-200 hover:border-yellow-300 appearance-none pr-10"
                  value={selectedAmount}
                  onChange={e => setSelectedAmount(e.target.value)}
                  aria-label="Filter by amount"
                >
                  {amountOptions.map(opt => (
                    <option key={opt.label} value={opt.label}>{opt.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Star className="h-5 w-5 text-yellow-300" />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex justify-center items-center px-8 py-4 bg-gradient-to-r from-pink-400 to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 mt-4 md:mt-0"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex justify-center items-center px-6 py-4 bg-white border-2 border-pink-200 text-pink-600 font-semibold rounded-xl shadow hover:bg-pink-50 hover:scale-105 transition-all duration-200 mt-4 md:mt-0"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Scholarships Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Available Scholarships
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover scholarships that match your profile and help fund your international education journey.
          </p>
          
          {/* Results Summary */}
          {!loading && !error && (
            <div className="mt-6 flex justify-center">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{filteredScholarships.length}</span> scholarships found
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Featured Scholarships Section - Redesigned */}
        <section className="w-full py-14 px-2 bg-gradient-to-br from-blue-50 via-pink-50 to-white rounded-3xl mb-12 shadow-lg border border-blue-100">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 shadow">
                <Star className="w-6 h-6 text-white" />
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight">Featured Scholarships</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredScholarships.slice(0, 3).map((scholarship) => (
                <div
                  key={`featured-${scholarship.id}`}
                  className="relative bg-white border-2 border-pink-200 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.03] transition-transform duration-200"
                >
                  {/* Featured Badge */}
                  <span className="absolute top-5 left-5 inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-pink-400 to-blue-400 text-white shadow-lg z-10">
                    <Star className="w-4 h-4" /> Featured
                  </span>
                  {/* Chance Badge */}
                  <span className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-bold shadow border-2 z-10 ${getChanceBadgeColor(scholarship.chance)} border-white/60`}>
                    {scholarship.chance}
                  </span>
                  <div className="mt-10">
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                      {scholarship.name}
                    </h3>
                    {scholarship.foundation && (
                      <div className="text-blue-600 text-sm font-medium mb-1">
                        {scholarship.foundation}
                      </div>
                    )}
                    {scholarship.amount && scholarship.amount !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Amount:</span> {scholarship.amount}
                      </div>
                    )}
                    {scholarship.eligibility && scholarship.eligibility !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Eligibility:</span> {scholarship.eligibility}
                      </div>
                    )}
                    {scholarship.deadline && scholarship.deadline !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Deadline:</span> {scholarship.deadline}
                      </div>
                    )}
                    {scholarship.competition && scholarship.competition !== 'Medium Competition' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Competition:</span> {scholarship.competition}
                      </div>
                    )}
                    {scholarship.countries && scholarship.countries.length > 0 && scholarship.countries[0] !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Countries:</span> {scholarship.countries.join(', ')}
                      </div>
                    )}
                    {scholarshipSummaries[scholarship.name] && (
                      <div className="mb-3 p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                        <div className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                          Scholarship Highlights
                        </div>
                        <ul className="pl-4 space-y-1">
                          {scholarshipSummaries[scholarship.name].bullets.map((b, i) => (
                            <li key={i} className="text-xs text-gray-800 flex items-start gap-2">
                              <span className="mt-1 w-2 h-2 rounded-full bg-blue-300 inline-block"></span>
                              <span className="font-medium">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!scholarship.application_url && (
                      <div className="mt-8 text-center text-xs text-gray-400 font-semibold">Application Link Coming Soon</div>
                    )}
                    {scholarship.application_url && (
                      <button 
                        onClick={() => handleApplyClick(scholarship)}
                        className="w-full py-3 rounded-xl font-semibold text-white shadow transition-all text-base mt-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Scholarships Section - Redesigned */}
        <section className="w-full py-12 px-2 bg-gradient-to-br from-white via-blue-100 via-60% to-pink-100 rounded-3xl shadow-2xl border-2 border-pink-200 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 shadow-lg border-2 border-pink-300">
                <Bookmark className="w-5 h-5 text-white" />
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-pink-600 tracking-tight drop-shadow">All Scholarships</h2>
              <span className="ml-auto">
                <select
                  className="bg-white border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                >
                  <option value="Relevance">Sort by: Relevance</option>
                  <option value="Amount: High to Low">Amount: High to Low</option>
                  <option value="Deadline: Soonest">Deadline: Soonest</option>
                </select>
              </span>
            </div>
            <p className="text-gray-600 mb-8 text-center md:text-left max-w-2xl">Browse all available opportunities and find your perfect match. Use filters and sorting to discover scholarships that fit your needs.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white/80 rounded-2xl border-2 border-blue-100 p-8 animate-pulse shadow">
                    <div className="h-5 bg-blue-100 rounded mb-3 w-1/2"></div>
                    <div className="h-4 bg-pink-100 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-blue-100 rounded-full w-20"></div>
                      <div className="h-6 bg-green-100 rounded-full w-16"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-blue-100 rounded w-20"></div>
                      <div className="h-8 bg-pink-100 rounded w-16"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                // Error message
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery || selectedCategory !== 'All Categories' || selectedCountry !== 'All Countries'
                      ? "Try adjusting your search criteria."
                      : "Check back later for new opportunities."}
                  </p>
                  {(searchQuery || selectedCategory !== 'All Categories' || selectedCountry !== 'All Countries') && (
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                // Scholarship cards
                sortedScholarships.map(scholarship => (
                  <div
                    key={scholarship.id}
                    className="relative bg-white border-2 border-pink-100 rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.02] hover:shadow-pink-200 transition-transform duration-200"
                  >
                    {/* Chance Badge */}
                    <span className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-bold shadow border-2 z-10 ${getChanceBadgeColor(scholarship.chance)} border-white/60`}>
                      {scholarship.chance}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {scholarship.name}
                    </h3>
                    {scholarship.foundation && (
                      <div className="text-blue-600 text-sm font-medium mb-1">
                        {scholarship.foundation}
                      </div>
                    )}
                    {scholarship.amount && scholarship.amount !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Amount:</span> {scholarship.amount}
                      </div>
                    )}
                    {scholarship.eligibility && scholarship.eligibility !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Eligibility:</span> {scholarship.eligibility}
                      </div>
                    )}
                    {scholarship.deadline && scholarship.deadline !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Deadline:</span> {scholarship.deadline}
                      </div>
                    )}
                    {scholarship.competition && scholarship.competition !== 'Medium Competition' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Competition:</span> {scholarship.competition}
                      </div>
                    )}
                    {scholarship.countries && scholarship.countries.length > 0 && scholarship.countries[0] !== 'N/A' && (
                      <div className="text-gray-700 text-sm mb-2">
                        <span className="font-semibold">Countries:</span> {scholarship.countries.join(', ')}
                      </div>
                    )}
                    {scholarshipSummaries[scholarship.name] && (
                      <div className="mb-3 p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                        <div className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                          Scholarship Highlights
                        </div>
                        <ul className="pl-4 space-y-1">
                          {scholarshipSummaries[scholarship.name].bullets.map((b, i) => (
                            <li key={i} className="text-xs text-gray-800 flex items-start gap-2">
                              <span className="mt-1 w-2 h-2 rounded-full bg-blue-300 inline-block"></span>
                              <span className="font-medium">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!scholarship.application_url && (
                      <div className="mt-8 text-center text-xs text-gray-400 font-semibold">Application Link Coming Soon</div>
                    )}
                    {scholarship.application_url && (
                      <button 
                        onClick={() => handleApplyClick(scholarship)}
                        className="w-full py-3 rounded-xl font-semibold text-white shadow transition-all text-base mt-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Load More */}
        {!loading && !error && filteredScholarships.length > 6 && (
          <div className="text-center mt-12">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Load More Scholarships
            </button>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <div className="text-center max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-gray-600 mb-4">Get notified about new scholarships that match your profile.</p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          © 2025 Admissions.app. All rights reserved.
        </div>
      </div>
    </div>
  );
} 