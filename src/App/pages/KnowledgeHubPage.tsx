import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Calendar, User, FileText, HelpCircle, Clock, Star, Globe, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getGuides, getBlogPosts, getBlogTabs } from '../../lib/api';
import { Guide } from '../../lib/types';
import { toast } from 'react-hot-toast';

// Add BlogPost interface
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image_url: string;
  category: string;
  created_at: string;
  tab_id: string | null;
  blog_tabs: {
    name: string;
  } | null;
}

export function KnowledgeHubPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Articles');
  const [activeArticleTab, setActiveArticleTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogTabs, setBlogTabs] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Set initial tab based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    if (tabParam === 'exam') {
      setActiveTab('Exam');
    }
  }, [location.search]);

  async function loadData() {
    try {
      setLoading(true);
      
      // Load guides
      const guidesData = await getGuides();
      setGuides(guidesData);
      
      // Load blog posts and tabs
      const [blogPostsData, tabsData] = await Promise.all([
        getBlogPosts(),
        getBlogTabs()
      ]);
      
      setBlogPosts(blogPostsData);
      setBlogTabs(tabsData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Popular topics derived from blog posts categories or tab names if guides are empty
  const popularTopics = guides.length > 0
    ? Array.from(new Set(guides.map(guide => guide.category)))
        .filter(Boolean)
        .slice(0, 8)
    : Array.from(new Set([
        ...blogPosts.map(post => post.category),
        ...blogTabs.map(tab => tab.name)
      ]))
    .filter(Boolean)
    .slice(0, 8);

  // Format date for blog posts
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter guides based on search query
  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter blog posts based on search query
  const filteredBlogPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter blog posts by tab
  const tabFilteredBlogPosts = activeArticleTab
    ? filteredBlogPosts.filter(post => post.tab_id === activeArticleTab)
    : filteredBlogPosts;

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching for "${searchQuery}"`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f8fb] via-[#f6fbfa] to-[#eaf6fa]">
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden py-0 px-2">
        {/* Blurred Gradient Blobs */}
        <div className="absolute left-[-10vw] top-[-10vh] w-[400px] h-[400px] bg-[#e0e7ff] rounded-full blur-3xl opacity-40 z-0" />
        <div className="absolute right-[-8vw] bottom-[-8vh] w-[350px] h-[350px] bg-[#99f6e4] rounded-full blur-3xl opacity-30 z-0" />
        {/* Greenish Tint Blob (left side) */}
        <div className="absolute left-[-15vw] top-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#6ee7b7] via-[#a7f3d0] to-transparent rounded-full blur-3xl opacity-50 z-0" />
        {/* Badge */}
        <div className="flex items-center gap-2 px-6 py-2 bg-white border border-[#e0e7ff] rounded-full shadow text-[#6366f1] font-semibold text-base mb-8 mt-8 max-w-fit mx-auto animate-fade-in z-10">
          <FileText className="w-5 h-5 text-[#6366f1]" />
          Knowledge Hub
        </div>
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a] z-10">
          Your Gateway to <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Guides & Resources</span>
        </h1>
        {/* Description */}
        <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium z-10">
          Explore expert guides, tips, and resources to navigate your study abroad journey with confidence.
        </p>
        {/* CTA Button */}
        <div className="flex flex-row gap-4 mb-4 w-full max-w-md justify-center z-10">
          <a
            href="#guides"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#60a5fa] text-center hover:bg-[#1d4ed8] hover:scale-105 hover:shadow-2xl"
          >
            Explore Guides
          </a>
        </div>
      </div>

      {/* Combined Tab Navigation */}
      <div className="flex flex-wrap mb-10 gap-3 justify-center">
        <button
          className={`px-5 py-2 rounded-full font-bold transition-colors shadow-sm border-2 ${activeTab === 'Articles' && activeArticleTab === null ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white border-pink-400' : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'}`}
          onClick={() => {
            setActiveTab('Articles');
            setActiveArticleTab(null);
            window.history.pushState({}, '', '/knowledge-hub');
          }}
        >
          All Articles
        </button>
        {blogTabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-5 py-2 rounded-full font-bold transition-colors shadow-sm border-2 ${activeTab === 'Articles' && activeArticleTab === tab.id ? 'bg-gradient-to-r from-pink-400 to-blue-400 text-white border-pink-400' : 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50'}`}
            onClick={() => {
              setActiveTab('Articles');
              setActiveArticleTab(tab.id);
              window.history.pushState({}, '', `/knowledge-hub?category=${tab.id}`);
            }}
          >
            {tab.name}
          </button>
        ))}
        <button 
          className={`px-5 py-2 rounded-full font-bold transition-colors shadow-sm border-2 ${activeTab === 'Exam' ? 'bg-gradient-to-r from-blue-400 to-pink-400 text-white border-blue-400' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
          onClick={() => {
            setActiveTab('Exam');
            window.history.pushState({}, '', '/knowledge-hub?tab=exam');
          }}
        >
          Exam Preparation
        </button>
      </div>

      {/* Guides Section */}
      {filteredGuides.length > 0 && (
        <section id="guides" className="max-w-4xl mx-auto px-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#181c2a]">
            Featured <span className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Guides</span>
          </h2>
          <p className="text-blue-500 text-center mb-8 text-base max-w-2xl mx-auto">
            Step-by-step guides and resources to help you succeed in your study abroad journey.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.slice(0, 6).map((guide) => (
              <div
                key={guide.id}
                className="group bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden flex flex-col min-h-[260px] max-w-full transition-transform duration-200 hover:scale-[1.03] hover:shadow-blue-200 relative"
              >
                {/* Guide image or fallback gradient */}
                <div className="relative h-28 w-full flex items-end justify-between bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100">
                  {guide.image_url ? (
                    <img
                      src={guide.image_url}
                      alt={guide.title}
                      className="w-full h-full object-cover absolute inset-0 z-0"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full absolute inset-0 z-0 bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100" />
                  )}
                  {/* Floating category badge */}
                  <span className="z-10 m-3 px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-full shadow-lg absolute top-3 left-3">
                    {guide.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-extrabold text-blue-800 mb-1 line-clamp-2">{guide.title}</h3>
                  <p className="text-gray-700 mb-2 font-medium line-clamp-2 text-sm">{guide.description}</p>
                  <div className="flex items-center gap-2 mb-2 mt-auto">
                    {/* Author avatar/initials */}
                    {guide.author_name ? (
                      guide.author_image ? (
                        <img src={guide.author_image} alt={guide.author_name} className="w-7 h-7 rounded-full object-cover shadow" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center text-blue-700 font-bold text-base shadow">
                          {guide.author_name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                      )
                    ) : null}
                    <div className="flex flex-col">
                      {guide.author_name && <span className="text-xs font-semibold text-blue-700">{guide.author_name}</span>}
                      <span className="text-xs text-blue-400">{guide.read_time} min read</span>
                    </div>
                  </div>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="inline-flex items-center justify-center px-4 py-1.5 mt-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:from-blue-600 hover:to-pink-600 transition-all text-xs"
                  >
                    Read Guide <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'Articles' && (
        <>
          {/* Articles Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {loading ? (
              Array(6).fill(null).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl shadow-xl border-2 border-blue-100 overflow-hidden animate-pulse min-h-[340px]">
                  <div className="bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100 h-40 w-full" />
                  <div className="p-7">
                    <div className="h-4 bg-blue-100 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-blue-100 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-blue-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-blue-100 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-blue-100 rounded w-1/4"></div>
                      <div className="h-4 bg-blue-100 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : tabFilteredBlogPosts.length > 0 ? (
              tabFilteredBlogPosts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-white rounded-3xl shadow-xl border-2 border-blue-100 overflow-hidden flex flex-col min-h-[380px] transition-transform duration-200 hover:scale-[1.03] hover:shadow-blue-200 relative"
                >
                  {/* Header image or gradient */}
                  <div className="relative h-40 w-full flex items-end justify-between bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover absolute inset-0 z-0"
                      />
                    ) : null}
                    {/* Floating category badge */}
                    <span className="z-10 m-4 px-4 py-1 text-xs font-bold bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-full shadow-lg absolute top-4 left-4">
                      {post.blog_tabs?.name || post.category}
                    </span>
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-extrabold text-blue-800 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-700 mb-4 font-medium line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mb-4 mt-auto">
                      {/* Author avatar/initials */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
                        {post.author?.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-blue-700">{post.author}</span>
                        <span className="text-xs text-blue-400">{formatDate(post.date)}</span>
                      </div>
                    </div>
                    <Link
                      to={`/blog/post/${post.id}`}
                      className="inline-flex items-center justify-center px-5 py-2 mt-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-pink-600 transition-all text-sm"
                    >
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <HelpCircle className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-4">Try a different search or check back later for new content.</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mb-12">
            <Link
              to="/exam-blog"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-pink-600 transition-all text-lg"
            >
              View All Exam Blogs <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </>
      )}

      {activeTab === 'Exam' && (
        <div className="mb-12">
          {/* Exam Blogs Grid - same design as articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {/* Replace with dynamic exam blog posts if available, else use static for demo */}
            {/* Example static exam blogs, replace with dynamic data as needed */}
            {[
              {
                id: 'ielts-writing-tips',
                title: '7 Proven Strategies to Boost Your IELTS Writing Score',
                excerpt: 'Master Task 1 and Task 2 with these expert tips that helped our students increase their writing scores by up to 1.5 bands.',
                author: 'Priya Sharma',
                date: '2023-05-24',
                image_url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'IELTS',
              },
              {
                id: 'toefl-speaking-guide',
                title: 'Mastering the TOEFL Speaking Section: A Comprehensive Guide',
                excerpt: 'Overcome nervousness and deliver clear, structured responses for all six speaking tasks with our step-by-step approach.',
                author: 'Amit Patel',
                date: '2023-06-02',
                image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                category: 'TOEFL',
              },
              {
                id: 'duolingo-test-prep',
                title: 'Duolingo English Test: What to Expect and How to Prepare',
                excerpt: 'A detailed breakdown of this increasingly popular English proficiency test and practical preparation strategies.',
                author: 'Sara Lee',
                date: '2023-04-18',
                image_url: 'https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                category: 'Duolingo',
              },
              {
                id: 'pte-common-mistakes',
                title: 'PTE Academic: 5 Common Mistakes and How to Avoid Them',
                excerpt: 'Learn from the experiences of past test-takers and ensure you don\'t fall into these common traps during your PTE exam.',
                author: 'John Smith',
                date: '2023-05-07',
                image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                category: 'PTE',
              },
              {
                id: 'ielts-success-story',
                title: 'From 6.5 to 8.0: My IELTS Success Story and Lessons Learned',
                excerpt: "A student's personal journey of improving their IELTS score and the strategies that made the biggest difference.",
                author: 'Meera Nair',
                date: '2023-06-15',
                image_url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                category: 'IELTS',
              },
            ].map((post) => (
              <div
                key={post.id}
                className="group bg-white rounded-3xl shadow-xl border-2 border-blue-100 overflow-hidden flex flex-col min-h-[380px] transition-transform duration-200 hover:scale-[1.03] hover:shadow-blue-200 relative"
              >
                {/* Header image or gradient */}
                <div className="relative h-40 w-full flex items-end justify-between bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover absolute inset-0 z-0"
                    />
                  ) : null}
                  {/* Floating category badge */}
                  <span className="z-10 m-4 px-4 py-1 text-xs font-bold bg-gradient-to-r from-blue-400 to-pink-400 text-white rounded-full shadow-lg absolute top-4 left-4">
                    {post.category}
                  </span>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-extrabold text-blue-800 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-700 mb-4 font-medium line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-3 mb-4 mt-auto">
                    {/* Author avatar/initials */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-pink-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow">
                      {post.author?.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-blue-700">{post.author}</span>
                      <span className="text-xs text-blue-400">{formatDate(post.date)}</span>
                    </div>
                  </div>
                  <Link
                    to={`/blog/post/${post.id}`}
                    className="inline-flex items-center justify-center px-5 py-2 mt-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-xl shadow hover:from-blue-600 hover:to-pink-600 transition-all text-sm"
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personalized Guidance Section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Need Personalized Guidance?</h2>
          <p className="mt-4 text-gray-700">
            Connect with our verified education consultants who can provide tailored 
            advice for your study abroad journey.
          </p>
          <div className="mt-6">
            <Link 
              to="/agencies" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              Find a Consultant
            </Link>
          </div>
        </div>
        <div className="h-64 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-pink-100 relative overflow-hidden">
          {/* Modern chat/help icon in a gradient circle */}
          <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[#6366f1] via-[#38bdf8] to-[#a7f3d0] shadow-lg">
            <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth="2">
              <path d="M24 44c10.493 0 19-7.163 19-16S34.493 12 24 12 5 19.163 5 28c0 3.53 1.47 6.77 4 9.39V44l6.29-3.14C17.47 42.44 20.66 44 24 44z" fill="#fff" stroke="#6366f1" />
              <circle cx="16" cy="28" r="2.5" fill="#6366f1" />
              <circle cx="24" cy="28" r="2.5" fill="#6366f1" />
              <circle cx="32" cy="28" r="2.5" fill="#6366f1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Popular Topics Section - Only show if we have topics */}
      {popularTopics.length > 0 && (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
        <div className="flex flex-wrap gap-3">
            {popularTopics.map((topic, index) => (
              <Link 
                key={index} 
                to={`/knowledge-hub?category=${topic.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="border-t py-6 px-4 sm:px-6 lg:px-8 bg-white/90 w-full mt-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 mb-2 text-sm">© 2025 Admissions.app. All rights reserved.</p>
          <nav aria-label="Footer navigation">
            <ul className="flex justify-center gap-4 text-gray-600 text-sm">
              <li><Link to="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
} 