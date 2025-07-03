import React from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Search, Award, FileText, Users, Map, Book, Quote, MessageSquare } from 'lucide-react';
import './HomePage.css';
import { Typewriter } from 'react-simple-typewriter';
import { Globe, Star, Sparkles } from 'lucide-react';

interface HomePageProps {
  setShowAuth?: (show: boolean, isSignUp?: boolean) => void;
}

export function HomePage({ setShowAuth }: HomePageProps = {}) {
  const stats = [
    { number: '2,500+', label: 'Universities' },
    { number: '15,000+', label: 'Courses' },
    { number: '1,200+', label: 'Scholarships' },
    { number: '50,000+', label: 'Students Helped' },
  ];

  const features = [
    {
      icon: <Users className="w-8 h-8 text-white" aria-hidden="true" />,
      title: 'Verified Consultancies',
      description: 'Connect with 200+ trusted overseas education consultants with verified credentials.',
      link: '/agencies',
      iconBg: 'from-[#7c3aed] to-[#818cf8]'
    },
    {
      icon: <Award className="w-8 h-8 text-white" aria-hidden="true" />,
      title: 'Scholarship Finder',
      description: 'Discover 1000+ scholarships worth ₹50+ crores tailored to your profile.',
      link: '/scholarship-finder',
      iconBg: 'from-[#10b981] to-[#34d399]'
    },
    {
      icon: <Book className="w-8 h-8 text-white" aria-hidden="true" />,
      title: 'University Directory',
      description: 'Explore 5000+ global universities with detailed course information.',
      link: '/course-finder',
      iconBg: 'from-[#2563eb] to-[#38bdf8]'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-white" aria-hidden="true" />,
      title: 'AI Study Planner',
      description: 'Get personalized study abroad roadmaps powered by advanced AI.',
      link: '/ai-assistant',
      iconBg: 'from-[#a21caf] to-[#f472b6]'
    },
  ];

  const testimonials = [
    {
      initials: 'SA',
      name: 'Sarah A.',
      university: 'Now at University of Toronto',
      quote: "Admissions.app helped me find the perfect program and track all my applications in one place. I wouldn't have gotten into my dream university without it!",
      bgColor: 'bg-primary',
    },
    {
      initials: 'MK',
      name: 'Michael K.',
      university: 'Now at LSE',
      quote: "The scholarship finder feature saved me thousands of dollars! I found funding opportunities I never would have discovered otherwise.",
      bgColor: 'bg-emerald-500',
    },
    {
      initials: 'JL',
      name: 'Jessica L.',
      university: 'Now at TU Munich',
      quote: "Finding a buddy who was already studying at my university made the transition so much easier. We're still friends to this day!",
      bgColor: 'bg-orange-500',
    },
  ];

  // Structured data for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Admissions.app",
    "url": "https://admissions.app",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://admissions.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Admissions.app",
    "url": "https://admissions.app",
    "logo": "https://admissions.app/logo.png",
    "description": "A comprehensive platform for international students to find courses, scholarships, and connect with study abroad experts.",
    "sameAs": [
      "https://twitter.com/admissionsapp",
      "https://facebook.com/admissionsapp",
      "https://linkedin.com/company/admissionsapp"
    ]
  };

  return (
    <>
      <SEO 
        title="Admissions.app | Your Complete Study Abroad Platform"
        description="Find courses, scholarships, and connect with students worldwide. The #1 platform for international students planning to study abroad with 15,000+ courses and 1,200+ scholarships."
        keywords={[
          "study abroad", 
          "international education", 
          "course finder", 
          "scholarship finder", 
          "university applications", 
          "international students", 
          "education consultants", 
          "study buddy"
        ]}
        ogType="website"
        ogImage="/images/home-page-banner.jpg"
        schema={[websiteSchema, organizationSchema]}
      />
      
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
            <svg className="w-5 h-5 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17.75l-6.172 3.247 1.179-6.873L2 9.753l6.914-1.004L12 2.25l3.086 6.499L22 9.753l-5.007 4.371 1.179 6.873z" /></svg>
            India's First Overseas Education Aggregator
            <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
          </div>
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a]">
            Your Gateway to <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Global Education</span>
          </h1>
          {/* Description */}
          <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium">
            Connect with verified consultancies, discover scholarships, explore universities worldwide, and get AI-powered guidance for your study abroad journey.
          </p>
          {/* Buttons */}
          <div className="flex flex-row gap-4 mb-4 w-full max-w-md justify-center">
            <Link
              to="/agencies"
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#60a5fa] text-center hover:bg-[#1d4ed8] hover:scale-105 hover:shadow-2xl"
            >
              Explore Consultancies
            </Link>
          </div>
        </div>
        {/* Stats Section (below hero) */}
        <section className="w-full bg-white bg-opacity-80 py-16 flex justify-center items-center">
          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-4 gap-10 px-4 md:px-8">
            {/* Students Helped */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#e0e7ff] via-[#a7f3d0] to-[#f0fdfa]">
                <svg className="w-10 h-10 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0zm6 2a2 2 0 11-4 0 2 2 0 014 0zm-16 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#181c2a] mb-2">10,000+</div>
              <div className="text-[#475569] text-lg font-medium">Students Helped</div>
            </div>
            {/* Partner Consultancies */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#e0e7ff] via-[#a7f3d0] to-[#f0fdfa]">
                <svg className="w-10 h-10 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="7" height="13" rx="2" /><rect x="14" y="3" width="7" height="17" rx="2" /></svg>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#181c2a] mb-2">200+</div>
              <div className="text-[#475569] text-lg font-medium">Partner Consultancies</div>
            </div>
            {/* Countries Covered */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#e0e7ff] via-[#a7f3d0] to-[#f0fdfa]">
                <svg className="w-10 h-10 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#181c2a] mb-2">50+</div>
              <div className="text-[#475569] text-lg font-medium">Countries Covered</div>
            </div>
            {/* Scholarships Available */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#e0e7ff] via-[#a7f3d0] to-[#f0fdfa]">
                <svg className="w-10 h-10 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M12 12v8m0 0l-3-3m3 3l3-3" /></svg>
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-[#181c2a] mb-2">₹50Cr+</div>
              <div className="text-[#475569] text-lg font-medium">Scholarships Available</div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section aria-labelledby="features-heading" className="w-full max-w-6xl mx-auto py-10 px-2">
          <h2 id="features-heading" className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-blue-600 drop-shadow-lg">Everything You Need for Your Education Journey</h2>
          <p className="text-blue-500 text-center mb-8 text-base">
            Admissions.app provides all the tools and resources to make your international education journey smooth and successful, from course selection to visa preparation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link || '#'}
                className="group bg-white/90 p-6 rounded-xl border border-[#e0e7ff] shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden flex flex-col items-center text-center animate-float"
              >
                <div className="mb-4 flex items-center justify-center">
                  <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${feature.iconBg} shadow group-hover:scale-110 transition-transform duration-200`}>
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1 text-[#181c2a]">
                  {feature.title}
                </h3>
                <p className="text-[#475569] text-sm font-medium mb-1">
                  {feature.description}
                </p>
                <span className="block h-1 w-0 group-hover:w-full bg-gradient-to-r from-pink-300 via-yellow-200 to-cyan-300 transition-all duration-300 rounded-full mt-2"></span>
              </Link>
            ))}
          </div>
        </section>
        {/* How It Works Section */}
        <section className="w-full max-w-6xl mx-auto py-20 px-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-[#181c2a]">
            How It <span className="bg-gradient-to-r from-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-[#64748b] text-center mb-14 text-xl font-medium">Simple steps to your global education journey</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#7c3aed] to-[#6366f1] shadow-lg">
                <span className="text-white text-2xl font-extrabold">01</span>
              </div>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-white shadow">
                <svg className="w-8 h-8 text-[#181c2a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#181c2a] mb-2 text-center">Get AI Guidance</h3>
              <p className="text-[#64748b] text-center text-lg font-medium">Chat with our AI assistant to understand your options and create a personalized study plan</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#10b981] to-[#14b8a6] shadow-lg">
                <span className="text-white text-2xl font-extrabold">02</span>
              </div>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-white shadow">
                <svg className="w-8 h-8 text-[#181c2a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0zm6 2a2 2 0 11-4 0 2 2 0 014 0zm-16 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#181c2a] mb-2 text-center">Connect with Experts</h3>
              <p className="text-[#64748b] text-center text-lg font-medium">Get matched with verified consultancies based on your profile and preferences</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#2563eb] to-[#38bdf8] shadow-lg">
                <span className="text-white text-2xl font-extrabold">03</span>
              </div>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 bg-white shadow">
                <svg className="w-8 h-8 text-[#181c2a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.42 1.42M6.34 17.66l-1.42 1.42m12.02 0l-1.42-1.42M6.34 6.34L4.92 4.92"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#181c2a] mb-2 text-center">Apply & Succeed</h3>
              <p className="text-[#64748b] text-center text-lg font-medium">Apply to universities and scholarships with expert guidance and achieve your dreams</p>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section aria-labelledby="success-stories-heading" className="w-full max-w-6xl mx-auto py-16 px-2 bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-3xl mb-12 shadow-lg border border-blue-100">
          {/* Decorative SVG */}
          <svg className="absolute -top-10 right-10 w-32 h-32 opacity-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" stroke="#a5b4fc" strokeWidth="4" fill="#f0f9ff" />
            <circle cx="50" cy="50" r="30" stroke="#f9a8d4" strokeWidth="2" fill="#fef9c3" />
          </svg>
          <h2 id="success-stories-heading" className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-blue-700">
            Success Stories
          </h2>
          <p className="text-blue-400 text-center mb-8 text-lg font-medium">Real stories from students who found their path with Admissions.app</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-blue-100 hover:border-blue-300 hover:scale-105 hover:shadow-blue-200 transition-all duration-300 relative animate-float flex flex-col items-center`}
              >
                <div className="flex flex-col items-center mb-4">
                  <div className={`w-16 h-16 ${testimonial.bgColor} text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg mb-2`} aria-hidden="true">
                    {testimonial.initials}
                  </div>
                  <Quote className="w-7 h-7 text-blue-300 mb-2" aria-hidden="true" />
                  <div className="font-semibold text-lg text-blue-700">{testimonial.name}</div>
                  <div className="text-blue-400 text-sm font-medium">{testimonial.university}</div>
                </div>
                <p className="text-blue-600 italic text-lg leading-relaxed text-center mt-2">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </section>
        {/* Footer */}
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
    </>
  );
}
