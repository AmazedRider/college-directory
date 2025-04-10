import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { SEO } from '../components/SEO';

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
}

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Fall back to dummy data if no posts are found
  const hasPosts = blogPosts.length > 0;
  const displayPosts = hasPosts ? blogPosts : [
    {
      id: '1',
      title: "How to Choose the Right College for Your Future",
      excerpt: "Deciding which college to attend is one of the most significant decisions you'll make. Here's how to navigate the selection process effectively.",
      content: "Full article content would go here...",
      author: "Dr. Sarah Johnson",
      date: "2025-02-28",
      image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "College Selection",
      created_at: "2025-02-28"
    },
    {
      id: '2',
      title: "Financial Aid Opportunities You Might Be Missing",
      excerpt: "Beyond the standard scholarships and loans, there are many lesser-known financial aid options that could significantly reduce your college costs.",
      content: "Full article content would go here...",
      author: "Michael Rodriguez",
      date: "2025-02-15",
      image_url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Financial Aid",
      created_at: "2025-02-15"
    },
    {
      id: '3',
      title: "The Growing Importance of Extracurricular Activities in College Applications",
      excerpt: "Learn why colleges are increasingly looking beyond academic achievements to evaluate prospective students.",
      content: "Full article content would go here...",
      author: "Jennifer Lee",
      date: "2025-02-05",
      image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Admissions",
      created_at: "2025-02-05"
    },
    {
      id: '4',
      title: "Making the Most of Your College Campus Visit",
      excerpt: "A campus visit can make or break your college decision. Here's how to ensure you get the most valuable insights during your tour.",
      content: "Full article content would go here...",
      author: "David Wilson",
      date: "2025-01-22",
      image_url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Campus Life",
      created_at: "2025-01-22"
    },
    {
      id: '5',
      title: "The Digital Revolution in College Learning: What to Expect",
      excerpt: "How technology is reshaping the college education experience and preparing students for the future workforce.",
      content: "Full article content would go here...",
      author: "Dr. Robert Chang",
      date: "2025-01-10",
      image_url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Education Trends",
      created_at: "2025-01-10"
    }
  ];

  // Generate schema for blog page
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    headline: 'Admissions Blog',
    description: 'Expert insights, tips, and advice to help you navigate the college admissions process',
    url: 'https://admissions.app/blog',
    blogPost: displayPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author
      },
      image: post.image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }))
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO 
        title="Blog | College Admissions Insights & Tips | Admissions.app"
        description="Expert insights, tips, and advice to help you navigate the college admissions process. Read our latest articles on college applications, essays, and more."
        canonicalUrl="/blog"
        ogType="website"
        ogImage={displayPosts[0]?.image_url}
        keywords={['college admissions blog', 'college application tips', 'admissions advice', 'college essay tips']}
        schema={blogSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admissions Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, tips, and advice to help you navigate the college admissions process
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {displayPosts.length > 0 && (
              <div className="mb-16">
                <div className="bg-white overflow-hidden rounded-2xl shadow-lg transition-shadow hover:shadow-xl">
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-1/2">
                      <img 
                        className="h-64 w-full object-cover md:h-full" 
                        src={displayPosts[0].image_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
                        alt={displayPosts[0].title} 
                      />
                    </div>
                    <div className="p-8 md:w-1/2">
                      <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                        {displayPosts[0].category}
                      </div>
                      <a href={`/blog/post/${displayPosts[0].id}`} className="block mt-1 text-2xl leading-tight font-bold text-gray-900 hover:underline">
                        {displayPosts[0].title}
                      </a>
                      <p className="mt-2 text-gray-600">
                        {displayPosts[0].excerpt}
                      </p>
                      <div className="mt-6 flex items-center">
                        <div className="flex-shrink-0">
                          <span className="sr-only">{displayPosts[0].author}</span>
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {displayPosts[0].author.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {displayPosts[0].author}
                          </p>
                          <div className="flex space-x-1 text-sm text-gray-500">
                            <time dateTime={displayPosts[0].date}>
                              {new Date(displayPosts[0].date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </time>
                            <span aria-hidden="true">&middot;</span>
                            <span>8 min read</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <a 
                          href={`/blog/post/${displayPosts[0].id}`}
                          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-800 to-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Read Article
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Post Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:gri d-cols-3">
              {displayPosts.slice(1).map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="relative h-48">
                    <img 
                      className="h-full w-full object-cover" 
                      src={post.image_url || `https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`} 
                      alt={post.title} 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <a href={`/blog/post/${post.id}`} className="block mt-1 text-xl font-semibold text-gray-900 hover:text-blue-600">
                      {post.title}
                    </a>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-800">
                          {post.author.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {post.author}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Stay updated with admission tips
              </h2>
              <p className="mt-4 max-w-3xl text-lg text-blue-100">
                Subscribe to our newsletter to receive the latest college admission advice, tips, and resources.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 border-white focus:ring-white focus:border-white rounded-md placeholder-gray-500"
                  placeholder="Enter your email"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <p className="mt-3 text-sm text-blue-100">
                We care about your data. Read our{' '}
                <a href="#" className="text-white font-medium underline">
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}