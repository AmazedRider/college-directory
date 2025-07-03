import React, { useState } from 'react';
import { Search, ArrowRight, Star, Globe, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const sampleExamBlogs = [
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
];

export function ExamBlogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredBlogs = sampleExamBlogs.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Sparkles className="w-5 h-5 text-[#6366f1]" />
          Exam Blogs
        </div>
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a] z-10">
          Your Gateway to <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Exam Success</span>
        </h1>
        {/* Description */}
        <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium z-10">
          Tips, strategies, and stories to help you ace your English proficiency exams and more.
        </p>
        {/* CTA Button */}
        <div className="flex flex-row gap-4 mb-4 w-full max-w-md justify-center z-10">
          <a
            href="#exam-blogs"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#60a5fa] text-center hover:bg-[#1d4ed8] hover:scale-105 hover:shadow-2xl"
          >
            Browse Exam Blogs
          </a>
        </div>
      </div>
      {/* Exam Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        {filteredBlogs.length > 0 ? filteredBlogs.map((post) => (
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
                  <span className="text-xs text-blue-400">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
        )) : (
          <div className="col-span-full text-center py-12">
            <span className="text-lg font-bold text-gray-900 mb-2 block">No exam blogs found</span>
            <span className="text-gray-600 mb-4 block">Try a different search or check back later for new content.</span>
          </div>
        )}
      </div>
    </div>
  );
} 