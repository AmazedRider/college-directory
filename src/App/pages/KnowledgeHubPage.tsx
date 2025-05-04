import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Calendar, User, FileText, HelpCircle, Clock } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Knowledge Hub</h1>
        <p className="text-xl text-gray-600 mt-2">
          Explore guides, tips, and resources to navigate your study abroad journey.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <form onSubmit={handleSearch} className="relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles, guides, and resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
          />
          <button 
            type="submit"
            className="absolute inset-y-0 right-0 px-4 text-white bg-primary rounded-r-md hover:bg-primary/90 focus:outline-none"
          >
            Search
          </button>
        </form>
      </div>

      {/* Combined Tab Navigation */}
      <div className="flex flex-wrap mb-8 gap-2">
        <button 
          className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'Articles' && activeArticleTab === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'Articles' && activeArticleTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
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
          className={`px-4 py-2 rounded-full font-medium transition-colors ${activeTab === 'Exam' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => {
            setActiveTab('Exam');
            window.history.pushState({}, '', '/knowledge-hub?tab=exam');
          }}
        >
          Exam Preparation
        </button>
      </div>

      {activeTab === 'Articles' && (
        <>
          {/* Articles Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {loading ? (
              // Loading state
              Array(6).fill(null).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-48"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : tabFilteredBlogPosts.length > 0 ? (
              tabFilteredBlogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="text-gray-400">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-primary rounded-full mb-2">
                      {post.blog_tabs?.name || post.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 truncate">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link 
                        to={`/blog/post/${post.id}`} 
                        className="inline-flex items-center text-primary font-medium"
                      >
                        Read Article
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No articles found state
              <div className="col-span-3 text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">
                  {activeArticleTab ? 'No articles found in this category' : 'No articles found'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {activeArticleTab 
                    ? 'Try selecting a different category or viewing all articles' 
                    : 'Try adjusting your search terms or check back later for new content'}
                </p>
                {activeArticleTab && (
                  <button 
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                    onClick={() => setActiveArticleTab(null)}
                  >
                    View All Articles
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'Exam' && (
        <div className="mb-12">
          {/* Featured Exam Content */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Ace Your English Proficiency Tests</h2>
                <p className="text-gray-700 mb-6">
                  Comprehensive guides and resources to help you prepare for IELTS, TOEFL, PTE, and other English exams required for international study.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    IELTS
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    TOEFL
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Duolingo
                  </span>
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    PTE Academic
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" 
                  alt="English exams preparation" 
                  className="rounded-lg shadow-md max-w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Recent Exam Blog Posts Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Exam Preparation Blogs</h2>
            <p className="text-gray-600 mb-6">
              Stay updated with our latest tips, strategies, and success stories for acing your English proficiency exams.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Blog Post 1 */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="bg-gray-200 h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="IELTS Writing Tips" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-5 flex-grow">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">IELTS</span>
                    <span className="text-gray-500 text-sm ml-auto flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      May 24, 2023
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">7 Proven Strategies to Boost Your IELTS Writing Score</h3>
                  <p className="text-gray-600 mb-4">
                    Master Task 1 and Task 2 with these expert tips that helped our students increase their writing scores by up to 1.5 bands.
                  </p>
                  <Link to="/blog/post/ielts-writing-tips" className="text-primary font-medium flex items-center mt-auto">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              {/* Blog Post 2 */}
              <div className="border rounded-lg overflow-hidden flex flex-col">
                <div className="bg-gray-200 h-48">
                  <img 
                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="TOEFL Speaking Section" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-5 flex-grow">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">TOEFL</span>
                    <span className="text-gray-500 text-sm ml-auto flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      June 2, 2023
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mastering the TOEFL Speaking Section: A Comprehensive Guide</h3>
                  <p className="text-gray-600 mb-4">
                    Overcome nervousness and deliver clear, structured responses for all six speaking tasks with our step-by-step approach.
                  </p>
                  <Link to="/blog/post/toefl-speaking-guide" className="text-primary font-medium flex items-center mt-auto">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Blog Post 3 */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-5 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80")', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Duolingo</span>
                    <span className="text-gray-500 text-sm ml-auto flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      April 18, 2023
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Duolingo English Test: What to Expect and How to Prepare</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    A detailed breakdown of this increasingly popular English proficiency test and practical preparation strategies.
                  </p>
                  <Link to="/blog/post/duolingo-test-prep" className="text-primary font-medium flex items-center text-sm">
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
              
              {/* Blog Post 4 */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-5 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80")', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">PTE</span>
                    <span className="text-gray-500 text-sm ml-auto flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      May 7, 2023
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">PTE Academic: 5 Common Mistakes and How to Avoid Them</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    Learn from the experiences of past test-takers and ensure you don't fall into these common traps during your PTE exam.
                  </p>
                  <Link to="/blog/post/pte-common-mistakes" className="text-primary font-medium flex items-center text-sm">
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
              
              {/* Blog Post 5 */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-5 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80")', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">IELTS</span>
                    <span className="text-gray-500 text-sm ml-auto flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      June 15, 2023
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">From 6.5 to 8.0: My IELTS Success Story and Lessons Learned</h3>
                  <p className="text-gray-600 mb-3 text-sm">
                    A student's personal journey of improving their IELTS score and the strategies that made the biggest difference.
                  </p>
                  <Link to="/blog/post/ielts-success-story" className="text-primary font-medium flex items-center text-sm">
                    Read More <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                View All Exam Preparation Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam Preparation Resources</h2>
            <p className="text-gray-600 mb-6">
              Resources and guides to help you prepare for English proficiency tests required for international study applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/IELTS_logo.svg/220px-IELTS_logo.svg.png" alt="IELTS logo" className="h-8 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">IELTS Preparation</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Tips, practice tests, and study materials for the International English Language Testing System.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>IELTS Reading Strategies</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Writing Task Tips</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Speaking Section Guide</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/TOEFL_logo.png/220px-TOEFL_logo.png" alt="TOEFL logo" className="h-8 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">TOEFL Preparation</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Resources and practice materials for the Test of English as a Foreign Language.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>TOEFL iBT Structure</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Listening Section Tips</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Integrated Writing Guide</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <img src="https://d23cwzsbkjbm45.cloudfront.net/static/images/duolingo-green.svg" alt="Duolingo logo" className="h-8 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Duolingo English Test</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Study materials and tips for the Duolingo English Test.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Test Format Overview</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Practice Exercises</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Scoring System Explained</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pearson_logo.svg/220px-Pearson_logo.svg.png" alt="Pearson logo" className="h-8 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">PTE Academic</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Resources for the Pearson Test of English Academic.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Speaking & Writing Tips</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Reading Strategy Guide</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Time Management Tricks</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Cambridge_University_Press_%26_Assessment_logo.svg/220px-Cambridge_University_Press_%26_Assessment_logo.svg.png" alt="Cambridge logo" className="h-8 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Cambridge English</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Study guides for Cambridge English qualifications.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>C1 Advanced Guide</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>B2 First Preparation</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Practice Test Resources</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">General Test Prep</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Universal tips for English proficiency test preparation.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Vocabulary Building</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Grammar Essentials</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-primary mr-2">•</span>
                    <span>Mock Test Strategies</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Study Schedule Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sample 8-Week IELTS Study Schedule</h2>
            <p className="text-gray-600 mb-6">
              Follow this comprehensive 8-week plan to prepare effectively for your IELTS exam.
            </p>

            <div className="flex justify-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" 
                alt="Study schedule and planning" 
                className="rounded-lg shadow-md max-w-full h-64 object-cover"
              />
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Week 1-2: Assessment and Basics</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Take a diagnostic test to identify your strengths and weaknesses</li>
                  <li>• Familiarize yourself with the IELTS format and question types</li>
                  <li>• Build foundation skills for each section</li>
                  <li>• Focus on vocabulary building for common IELTS topics</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Week 3-4: Targeted Practice</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dedicate focused practice sessions to each section</li>
                  <li>• Learn strategies for different question types</li>
                  <li>• Practice time management techniques</li>
                  <li>• Complete 2 practice tests under timed conditions</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Week 5-6: Advanced Skills</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Work on complex sentence structures for Writing Task 2</li>
                  <li>• Improve speaking fluency and practice with common questions</li>
                  <li>• Develop speed reading techniques</li>
                  <li>• Perfect note-taking skills for listening section</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Week 7-8: Final Preparation</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Take full practice tests under exam conditions</li>
                  <li>• Review common mistakes and areas of improvement</li>
                  <li>• Refine strategies based on your performance</li>
                  <li>• Focus on relaxation techniques and exam day preparation</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link to="/blog/post/detailed-ielts-schedule" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none">
                Download Complete Study Plan
              </Link>
            </div>
          </div>

          {/* Practice Tests Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Free Practice Tests</h2>
            <p className="text-gray-600 mb-6">
              Test your skills with our collection of free practice materials for English proficiency exams.
            </p>

            <div className="flex justify-center mb-6">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" 
                alt="Student taking a practice test" 
                className="rounded-lg shadow-md max-w-full h-64 object-cover"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/IELTS_logo.svg/220px-IELTS_logo.svg.png" alt="IELTS logo" className="h-8 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">IELTS Academic Practice Test</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Full-length practice test with all four sections: Listening, Reading, Writing, and Speaking.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center mr-4">
                      <FileText className="h-4 w-4 mr-1" />
                      4 Sections
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      2h 45m
                    </span>
                  </div>
                  <Link to="/resources/ielts-practice-test" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    Start Test
                  </Link>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/TOEFL_logo.png/220px-TOEFL_logo.png" alt="TOEFL logo" className="h-8 mr-2" />
                    <h3 className="text-xl font-bold text-gray-900">TOEFL iBT Sample Test</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Practice with authentic TOEFL iBT questions covering Reading, Listening, Speaking, and Writing.
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center mr-4">
                      <FileText className="h-4 w-4 mr-1" />
                      4 Sections
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      3h 30m
                    </span>
                  </div>
                  <Link to="/resources/toefl-practice-test" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    Start Test
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Pearson_logo.svg/220px-Pearson_logo.svg.png" alt="Pearson logo" className="h-6 mr-2" />
                  <h4 className="font-bold text-gray-900">PTE Academic Mini Tests</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Short practice sets for specific PTE Academic skills.
                </p>
                <Link to="/resources/pte-mini-tests" className="text-primary text-sm font-medium flex items-center">
                  Access Tests <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <img src="https://d23cwzsbkjbm45.cloudfront.net/static/images/duolingo-green.svg" alt="Duolingo logo" className="h-6 mr-2" />
                  <h4 className="font-bold text-gray-900">Duolingo Sample Questions</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Practice questions in the Duolingo English Test format.
                </p>
                <Link to="/resources/duolingo-samples" className="text-primary text-sm font-medium flex items-center">
                  Try Questions <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/Cambridge_University_Press_%26_Assessment_logo.svg/220px-Cambridge_University_Press_%26_Assessment_logo.svg.png" alt="Cambridge logo" className="h-6 mr-2" />
                  <h4 className="font-bold text-gray-900">Cambridge C1 Advanced</h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Sample papers for the Cambridge C1 Advanced exam.
                </p>
                <Link to="/resources/cambridge-samples" className="text-primary text-sm font-medium flex items-center">
                  View Papers <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </div>
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
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
          <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
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
    </div>
  );
} 