import React from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Search, Award, FileText, Users, Map, Book } from 'lucide-react';

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 88f10b76e8007c00ccacb927a5cf688aad4569fb
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
      icon: <Search className="w-8 h-8 text-primary" aria-hidden="true" />,
      title: 'Course Finder',
      description: 'Search through thousands of courses worldwide with intuitive filters for program type, location, and tuition fees.',
      link: '/course-finder',
<<<<<<< HEAD
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" aria-hidden="true" />,
      title: 'Scholarship Finder',
      description: 'Discover international scholarships with detailed eligibility indicators and comprehensive application guidance.',
      link: '/scholarship-finder',
    },
    {
      icon: <FileText className="w-8 h-8 text-emerald-500" aria-hidden="true" />,
      title: 'Application Tracker',
      description: 'Track all your university applications with visual timelines, deadline reminders, and document management.',
      link: '/application-tracker',
    },
    {
      icon: <Users className="w-8 h-8 text-primary" aria-hidden="true" />,
      title: 'Find a Buddy',
      description: 'Connect with international students already studying at your dream university for insights and guidance.',
      link: '/find-buddy',
    },
    {
      icon: <Map className="w-8 h-8 text-orange-500" aria-hidden="true" />,
      title: 'Consultancy Directory',
      description: 'Find verified education consultants with trust scores, reviews, and expertise in your target country and field.',
      link: '/agencies',
    },
    {
      icon: <Book className="w-8 h-8 text-emerald-500" aria-hidden="true" />,
      title: 'Knowledge Hub',
      description: 'Access expert guides, visa information, and application resources to help with your study abroad journey.',
      link: '/knowledge-hub',
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
=======
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" aria-hidden="true" />,
      title: 'Scholarship Finder',
      description: 'Discover international scholarships with detailed eligibility indicators and comprehensive application guidance.',
      link: '/scholarship-finder',
    },
    {
      icon: <FileText className="w-8 h-8 text-emerald-500" aria-hidden="true" />,
      title: 'Application Tracker',
      description: 'Track all your university applications with visual timelines, deadline reminders, and document management.',
      link: '/application-tracker',
    },
    {
      icon: <Users className="w-8 h-8 text-primary" aria-hidden="true" />,
      title: 'Find a Buddy',
      description: 'Connect with international students already studying at your dream university for insights and guidance.',
      link: '/find-buddy',
    },
    {
      icon: <Map className="w-8 h-8 text-orange-500" aria-hidden="true" />,
      title: 'Consultancy Directory',
      description: 'Find verified education consultants with trust scores, reviews, and expertise in your target country and field.',
      link: '/agencies',
    },
    {
      icon: <Book className="w-8 h-8 text-emerald-500" aria-hidden="true" />,
      title: 'Knowledge Hub',
      description: 'Access expert guides, visa information, and application resources to help with your study abroad journey.',
      link: '/knowledge-hub',
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
=======
export function HomePage() {
  // Enhanced Schema for the homepage with more structured data
  const homepageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Admissions.app - Study Abroad Consultants in Hyderabad',
    url: 'https://admissions.app',
    description: 'Connect with verified study abroad consultants in Hyderabad. Expert guidance for USA, UK, Canada & Australia university admissions, visas, and scholarships.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://admissions.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    about: {
      '@type': 'Organization',
      name: 'Admissions.app',
      description: 'Premier study abroad consultancy platform in Hyderabad connecting students with verified education consultants',
      areaServed: [
        {
          '@type': 'City',
          name: 'Hyderabad',
          containedIn: 'India'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'India',
        addressRegion: 'Telangana',
        addressLocality: 'Hyderabad'
      },
      knowsAbout: [
        'Study Abroad Consulting',
        'University Admissions',
        'Student Visa Services',
        'Scholarship Guidance',
        'International Education',
        'USA University Applications',
        'UK University Admissions',
        'Canada Study Permits',
        'Australia Student Visas'
      ],
      serviceArea: [
        'HITEC City',
        'Banjara Hills',
        'Jubilee Hills',
        'Gachibowli',
        'Madhapur',
        'Ameerpet',
        'Kukatpally'
      ],
      offers: {
        '@type': 'Offer',
        itemOffered: [
          {
            '@type': 'Service',
            name: 'Study Abroad Consultation',
            description: 'Expert guidance for international university admissions'
          },
          {
            '@type': 'Service',
            name: 'Visa Assistance',
            description: 'Professional support for student visa applications'
          },
          {
            '@type': 'Service',
            name: 'Scholarship Guidance',
            description: 'Help with international scholarship applications'
          }
        ]
      }
>>>>>>> 73056b2bee1fb462aedd795d002a04c2f148942e
>>>>>>> 88f10b76e8007c00ccacb927a5cf688aad4569fb
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 88f10b76e8007c00ccacb927a5cf688aad4569fb
    <>
      <SEO 
        title="Admissions.app | Your Complete Study Abroad Platform"
        description="Find courses, scholarships, and connect with students worldwide. The #1 platform for international students planning to study abroad with 15,000+ courses and 1,200+ scholarships."
<<<<<<< HEAD
=======
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
=======
    <div>
      <SEO
        title="Admissions.app | Your Trusted Study Abroad Platform in Hyderabad"
        description="Welcome to Hyderabad's premier study abroad platform. Expert guidance for USA, UK, Canada & Australia university admissions, visas, scholarships, and admission essays. 250+ verified consultants ready to help."
>>>>>>> 88f10b76e8007c00ccacb927a5cf688aad4569fb
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
<<<<<<< HEAD
        ogImage="/images/home-page-banner.jpg"
        schema={[websiteSchema, organizationSchema]}
=======
        ogImage="/images/admissions-app-og.jpg"
        twitterCard="summary_large_image"
        canonicalUrl="https://admissions.app"
>>>>>>> 73056b2bee1fb462aedd795d002a04c2f148942e
>>>>>>> 88f10b76e8007c00ccacb927a5cf688aad4569fb
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <header className="bg-blue-50 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Your Journey to <span className="text-primary">Global Education</span> Starts Here
            </h1>
            <p className="text-gray-600 text-xl mb-8">
              Discover 15,000+ courses worldwide, track applications to top universities, and connect with international students on our comprehensive study abroad platform.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/agencies"
                className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                aria-label="Start your study abroad journey"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                aria-label="Learn more about our study abroad platform"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Stats */}
          <section aria-labelledby="stats-heading" className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <h2 id="stats-heading" className="sr-only">Key statistics about our platform</h2>
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="text-primary text-4xl font-bold">{stat.number}</div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </section>
        </header>

        <main>
          {/* Features Section */}
          <section aria-labelledby="features-heading" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 id="features-heading" className="text-4xl font-bold text-center mb-4">
                Everything You Need for Your Education Journey
              </h2>
              <p className="text-gray-600 text-center mb-16">
                Admissions.app provides all the tools and resources to make your international education journey smooth and successful, from course selection to visa preparation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Link key={index} to={feature.link || '#'} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section aria-labelledby="cta-heading" className="bg-primary py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <h2 id="cta-heading" className="text-4xl font-bold text-white mb-4">
                Ready to Begin Your Global Education Journey?
              </h2>
              <p className="text-white/90 text-xl mb-8">
                Join 50,000+ students who have successfully found their path to top universities worldwide with Admissions.app
              </p>
              <button
                onClick={() => {
                  if (setShowAuth) {
                    setShowAuth(true, true);
                  }
                }}
                className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors"
                aria-label="Create your free account to start your study abroad journey"
              >
                Create Free Account
              </button>
            </div>
          </section>

          {/* Testimonials Section */}
          <section aria-labelledby="testimonials-heading" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 id="testimonials-heading" className="text-4xl font-bold text-center mb-4">What Students Say</h2>
              <p className="text-gray-600 text-center mb-16">
                Hear from international students who have successfully navigated their education journey with our platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${testimonial.bgColor} text-white rounded-full flex items-center justify-center font-semibold`} aria-hidden="true">
                        {testimonial.initials}
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.university}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-600 mb-4">© 2025 Admissions.app. All rights reserved.</p>
            <nav aria-label="Footer navigation">
              <ul className="flex justify-center gap-6 text-gray-600">
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
