import React, { useState, useEffect } from 'react';
import { Search, Star, Globe2, Lightbulb, Users2, HandshakeIcon, ChevronDown, Sparkles, Clock, Mail, Phone, MapPin, Facebook, Instagram, X, Linkedin } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import Cal, { getCalApi } from "@calcom/embed-react";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface ImpactStatProps {
  value: string;
  label: string;
}

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ImpactStat({ value, label }: ImpactStatProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="text-primary text-4xl font-bold mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function ContactCard({ icon, title, content, link }: ContactCardProps) {
  const Container = link ? 'a' : 'div';
  return (
    <Container
      href={link}
      target={link ? "_blank" : undefined}
      rel={link ? "noopener noreferrer" : undefined}
      className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center ${link ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}`}
    >
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </Container>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-600">{answer}</div>
      )}
    </div>
  );
}

export function AboutPage() {
  const [showBooking, setShowBooking] = useState(false);
  const [calLoaded, setCalLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquiryType: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (showBooking) {
      (async function () {
        try {
          const cal = await getCalApi({ "namespace": "30min" });
          cal("ui", {
            hideEventTypeDetails: false,
            layout: "month_view",
            styles: {
              branding: { brandColor: "#1e40af" },
            }
          });
          setCalLoaded(true);
        } catch (error) {
          console.error('Error loading Cal.com:', error);
        }
      })();
    }
  }, [showBooking]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Integrate with backend or email service
    setFormData({ fullName: '', email: '', inquiryType: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
      <SEO 
        title="About & Contact | Admissions.app"
        description="Learn about Admissions.app, our mission, and get in touch with our team for any questions about overseas education."
        canonicalUrl="/about"
      />
      {/* Hero About Section */}
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] mt-0 mb-12">
        <div className="w-[98vw] max-w-none bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#312e81] rounded-3xl shadow-2xl p-10 md:p-20 flex flex-col md:flex-row items-center border border-[#3730a3] relative overflow-hidden gap-12">
          {/* Decorative SVGs and Animations */}
          <Star className="absolute top-8 left-8 w-10 h-10 text-yellow-300 animate-pulse drop-shadow-lg" />
          <Globe2 className="absolute bottom-8 right-8 w-16 h-16 text-blue-200 animate-spin-slow opacity-30" />
          <Sparkles className="absolute top-10 right-1/3 w-8 h-8 text-purple-200 animate-bounce" />
          <Sparkles className="absolute bottom-16 left-1/4 w-8 h-8 text-pink-200 animate-bounce delay-500" />
          <div className="absolute -z-10 left-1/2 top-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-700 via-purple-800 to-blue-900 rounded-full blur-3xl opacity-30 animate-pulse -translate-x-1/2 -translate-y-1/2" />
          {/* Hero Text */}
          <div className="flex-1 flex flex-col items-start justify-center z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-50 mb-6 leading-tight drop-shadow-lg">About Admissions.app</h1>
            <p className="text-blue-100 text-2xl mb-8 max-w-2xl font-medium">
              The all-in-one platform for your global education journey. Discover universities, courses, scholarships, and trusted consultants—plus expert resources and a vibrant student community.
            </p>
            <div className="flex flex-row gap-6 mt-2">
              <Link to="/course-finder" className="px-8 py-4 bg-pink-500 text-white font-semibold rounded-lg shadow hover:bg-pink-600 hover:scale-105 transition-all duration-300 text-lg">Explore Courses</Link>
              <Link to="/scholarship-finder" className="px-8 py-4 bg-white text-pink-600 font-semibold rounded-lg shadow border border-pink-200 hover:bg-pink-50 hover:text-pink-700 hover:scale-105 transition-all duration-300 text-lg">Find Scholarships</Link>
            </div>
          </div>
          {/* Hero Image */}
          <div className="flex-1 flex items-center justify-center z-10">
            <img 
              src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" 
              alt="International students celebrating" 
              className="rounded-2xl shadow-2xl w-full max-w-md object-cover border-4 border-white/30"
            />
          </div>
        </div>
      </div>
      {/* About & Mission Section (merged, premium) */}
      <section className="relative w-full max-w-6xl mx-auto mb-20">
        <div className="absolute -z-10 left-1/2 top-1/2 w-[700px] h-[350px] bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100/40 p-10 items-center">
          <div className="flex flex-col items-start justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-pink-200 via-blue-100 to-yellow-100 text-blue-700 font-bold text-sm shadow">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-800 drop-shadow-lg tracking-tight">Empowering Your Global Education Journey</h2>
            <p className="text-blue-700 text-lg md:text-xl mb-6 font-medium">
              Admissions.app is a comprehensive platform designed to simplify the overseas education journey for students worldwide. Our mission is to connect ambitious students with top-rated education consultants and provide the tools and resources needed for a successful international education experience.
            </p>
            <p className="text-blue-600 text-base mb-6 font-medium">
              We believe that quality education should be accessible to everyone, regardless of geographical boundaries. Our platform is built to demystify the overseas education process and empower students to make informed decisions about their academic future.
            </p>
            <Link to="/agencies" className="inline-block bg-gradient-to-r from-blue-600 to-pink-500 text-white px-8 py-3 rounded-lg font-bold shadow hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg">
              Find a Consultant
            </Link>
          </div>
          <div className="flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Students collaborating on a study abroad mission" 
              className="rounded-2xl shadow-2xl w-full max-w-md object-cover border-4 border-white/30"
            />
          </div>
        </div>
        {/* Wavy SVG divider */}
        <svg className="w-full h-8 mt-[-2px]" viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#fbcfe8" fillOpacity=".3" d="M0,32L48,26.7C96,21,192,11,288,21.3C384,32,480,64,576,69.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"></path></svg>
      </section>
      {/* Our Story (premium) */}
      <section className="relative mb-20 bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 rounded-3xl shadow-xl p-0 overflow-hidden">
        {/* Wavy SVG divider at top */}
        <svg className="w-full h-8" viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#a5b4fc" fillOpacity=".18" d="M0,32L48,26.7C96,21,192,11,288,21.3C384,32,480,64,576,69.3C672,75,768,53,864,48C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"></path></svg>
        <div className="flex flex-col md:flex-row items-center gap-12 px-8 py-16">
          <div className="flex-1 flex flex-col justify-center items-start">
            <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-blue-200 via-pink-100 to-yellow-100 text-blue-700 font-bold text-sm shadow">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-800 drop-shadow-lg tracking-tight">Built by Students, for Students</h2>
            <blockquote className="text-xl md:text-2xl font-semibold text-blue-700 mb-8 bg-white/70 rounded-xl p-6 shadow border-l-4 border-pink-400">
              "Admissions.app was born from our own struggles with unreliable information, questionable consultants, and a lack of structured guidance. We set out to build the platform we wished we had—transparent, trustworthy, and truly student-first."
            </blockquote>
            <p className="text-blue-600 text-base mb-4 font-medium">
              Founded in Hyderabad, India, we've grown to connect students with 250+ verified international education advisors specializing in USA, UK, Canada, and Australia.
            </p>
            <p className="text-blue-600 text-base font-medium">
              Today, Admissions.app serves thousands of students across India, helping them achieve their dreams of studying at prestigious institutions worldwide. Our platform evolves with new features and resources based on student feedback and changing industry needs.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=800&q=80" 
              alt="Students celebrating success" 
              className="rounded-2xl shadow-2xl w-full max-w-md object-cover border-4 border-white/30"
            />
          </div>
        </div>
      </section>

      {/* Our Values (premium) */}
      <section className="mb-20 relative">
        <div className="absolute -z-10 left-1/2 top-1/2 w-[700px] h-[300px] bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100/40 px-8 py-14">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-blue-700 drop-shadow-lg text-center tracking-tight">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group bg-gradient-to-br from-blue-50 via-white to-pink-100/80 rounded-2xl border border-blue-100 shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-pink-100 shadow mb-4 group-hover:scale-110 transition-transform duration-200">
                <Search className="w-8 h-8 text-primary" />
              </span>
              <h3 className="text-xl font-bold mb-2 text-blue-700">Transparency</h3>
              <p className="text-blue-500 text-base font-medium text-center">We believe in complete transparency in the education consulting industry. Our Trust Score system ensures students can make informed decisions.</p>
            </div>
            <div className="group bg-gradient-to-br from-yellow-50 via-white to-pink-100/80 rounded-2xl border border-yellow-100 shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-100 to-pink-100 shadow mb-4 group-hover:scale-110 transition-transform duration-200">
                <Star className="w-8 h-8 text-yellow-400" />
              </span>
              <h3 className="text-xl font-bold mb-2 text-yellow-700">Quality</h3>
              <p className="text-yellow-600 text-base font-medium text-center">We maintain high standards for consultants on our platform, verifying credentials and monitoring performance to ensure quality service.</p>
            </div>
            <div className="group bg-gradient-to-br from-green-50 via-white to-blue-100/80 rounded-2xl border border-green-100 shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-200 via-green-100 to-blue-100 shadow mb-4 group-hover:scale-110 transition-transform duration-200">
                <Globe2 className="w-8 h-8 text-green-500" />
              </span>
              <h3 className="text-xl font-bold mb-2 text-green-700">Accessibility</h3>
              <p className="text-green-600 text-base font-medium text-center">We're committed to making international education accessible to all students, regardless of their background or location.</p>
            </div>
            <div className="group bg-gradient-to-br from-yellow-50 via-white to-blue-100/80 rounded-2xl border border-yellow-100 shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-100 to-blue-100 shadow mb-4 group-hover:scale-110 transition-transform duration-200">
                <Lightbulb className="w-8 h-8 text-yellow-400" />
              </span>
              <h3 className="text-xl font-bold mb-2 text-yellow-700">Innovation</h3>
              <p className="text-yellow-600 text-base font-medium text-center">We continuously innovate to provide cutting-edge tools and resources that simplify the study abroad journey.</p>
            </div>
            <div className="group bg-gradient-to-br from-purple-50 via-white to-blue-100/80 rounded-2xl border border-purple-100 shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 via-purple-100 to-blue-100 shadow mb-4 group-hover:scale-110 transition-transform duration-200">
                <Users2 className="w-8 h-8 text-purple-500" />
              </span>
              <h3 className="text-xl font-bold mb-2 text-purple-700">Community</h3>
              <p className="text-purple-600 text-base font-medium text-center">We foster a supportive community where students can connect, share experiences, and help each other navigate their education journey.</p>
            </div>
            <div className="group bg-gradient-to-br from-orange-50 via-white to-yellow-100/80 rounded-2xl border border-orange-100 shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 via-yellow-100 to-yellow-200 shadow mb-4 group-hover:scale-110 transition-transform duration-200">
                <HandshakeIcon className="w-8 h-8 text-orange-400" />
              </span>
              <h3 className="text-xl font-bold mb-2 text-orange-700">Integrity</h3>
              <p className="text-orange-600 text-base font-medium text-center">We operate with the highest level of integrity, ensuring that student interests always come first.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Community Section (premium) */}
      <section className="relative w-full max-w-6xl mx-auto mb-20 bg-gradient-to-br from-pink-400 via-blue-500 to-yellow-300 rounded-3xl shadow-2xl p-0 overflow-hidden text-center">
        {/* Decorative SVG */}
        <svg className="absolute -top-10 right-10 w-32 h-32 opacity-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="#a5b4fc" strokeWidth="4" fill="#f0f9ff" />
          <circle cx="50" cy="50" r="30" stroke="#f9a8d4" strokeWidth="2" fill="#fef9c3" />
        </svg>
        <div className="px-8 py-16 md:py-24 flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight">Join the Admissions.app Community</h2>
          <p className="text-lg md:text-2xl text-white/90 mb-10 font-medium max-w-2xl mx-auto">
            Whether you're a student dreaming of studying abroad or an education consultant looking to expand your reach, Admissions.app has something for you. Join our growing community today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-4">
            <button className="bg-white text-pink-600 px-10 py-4 rounded-xl font-bold text-lg shadow hover:bg-pink-50 hover:text-pink-700 hover:scale-105 transition-all duration-300">
              Sign Up as a Student
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg shadow hover:bg-white/10 hover:scale-105 transition-all duration-300">
              Join as a Consultant
            </button>
          </div>
        </div>
      </section>

      {/* Our Impact (premium) */}
      <section className="relative w-full max-w-6xl mx-auto mb-24">
        <div className="absolute -z-10 left-1/2 top-1/2 w-[700px] h-[300px] bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100/40 px-8 py-14">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-blue-700 drop-shadow-lg text-center tracking-tight">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-pink-100/80 rounded-2xl border border-blue-100 shadow-lg p-8">
              <Users2 className="w-12 h-12 text-cyan-400 mb-3" />
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-500">10,000+</div>
              <div className="text-blue-500 text-lg font-semibold">Students Helped</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-yellow-50 via-white to-pink-100/80 rounded-2xl border border-yellow-100 shadow-lg p-8">
              <HandshakeIcon className="w-12 h-12 text-yellow-400 mb-3" />
              <div className="text-3xl md:text-4xl font-extrabold text-yellow-500">250+</div>
              <div className="text-yellow-600 text-lg font-semibold">Verified Consultants</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-green-50 via-white to-blue-100/80 rounded-2xl border border-green-100 shadow-lg p-8">
              <Globe2 className="w-12 h-12 text-green-500 mb-3" />
              <div className="text-3xl md:text-4xl font-extrabold text-green-500">50+</div>
              <div className="text-green-600 text-lg font-semibold">Countries Covered</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-pink-50 via-white to-yellow-100/80 rounded-2xl border border-pink-100 shadow-lg p-8">
              <Star className="w-12 h-12 text-pink-400 mb-3" />
              <div className="text-3xl md:text-4xl font-extrabold text-pink-500">95%</div>
              <div className="text-pink-600 text-lg font-semibold">Student Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Us Section (integrated, premium design) */}
      <div className="mt-24 mb-24">
        <div className="w-full max-w-7xl mx-auto bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 rounded-3xl shadow-2xl p-10 md:p-20 border border-blue-100/40">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8 drop-shadow-lg">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Contact Form Section */}
            <div className="md:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">Send Us a Message</div>
                <div className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</div>
              </div>
              <div className="p-6 pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                      <input id="fullName" type="text" placeholder="Enter your full name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <input id="email" type="email" placeholder="Enter your email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="inquiryType" className="text-sm font-medium">Inquiry Type</label>
                      <select id="inquiryType" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" value={formData.inquiryType} onChange={(e) => setFormData({...formData, inquiryType: e.target.value})} required >
                        <option value="">Select inquiry type</option>
                        <option value="general">General Inquiry</option>
                        <option value="consultant">Consultant Related</option>
                        <option value="course">Course Information</option>
                        <option value="scholarship">Scholarship Information</option>
                        <option value="technical">Technical Support</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                      <input id="subject" type="text" placeholder="Enter subject" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea id="message" placeholder="Enter your message" rows={6} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required />
                  </div>
                  <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-6 py-2 transition-colors">Send Message</button>
                </form>
              </div>
            </div>
            {/* Contact Info Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center mb-2"><Clock className="h-5 w-5 text-blue-600 mr-2" /><h3 className="text-xl font-semibold">Book a Meeting</h3></div>
                <p className="text-gray-600 text-sm mb-4">Schedule a virtual meeting with one of our advisors to discuss your study abroad options.</p>
                <button onClick={() => setShowBooking(!showBooking)} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 py-2 w-full sm:w-auto">{showBooking ? 'Hide Calendar' : 'Open Calendar'}</button>
                {showBooking && (
                  <div className="mt-4 bg-white rounded-lg border overflow-hidden">
                    <Cal calLink="team/admissions-app/30min" style={{ width: "100%", height: calLoaded ? "600px" : "100px", border: "none" }} config={{ layout: "month_view" }} />
                  </div>
                )}
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Our Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex"><Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" /><div><div className="font-medium">Email</div><a href="mailto:connect@admissions.app" className="text-blue-600 hover:underline">connect@admissions.app</a></div></div>
                  <div className="flex"><Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" /><div><div className="font-medium">Phone</div><a href="tel:+916304666504" className="text-blue-600 hover:underline">+91 6304 666 504</a></div></div>
                  <div className="flex"><MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" /><div><div className="font-medium">Office Address</div><p className="text-gray-600">Plot No. 1280, Road No. 36<br />Jubilee Hills, Hyderabad<br />Telangana, India 500033</p></div></div>
                  <div className="flex"><Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" /><div><div className="font-medium">Operating Hours</div><p className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM IST<br />Sunday: Closed</p></div></div>
                </div>
                <div className="mt-6"><div className="font-medium mb-3">Connect With Us</div><div className="flex space-x-4">
                  <a href="https://facebook.com/groups/595906066127004" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"><Facebook className="h-5 w-5" /></a>
                  <a href="https://www.instagram.com/admissions.app?igsh=ZXluOHZ5Z3dwbTJk" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"><Instagram className="h-5 w-5" /></a>
                  <a href="https://x.com/admissions_app" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"><X className="h-5 w-5" /></a>
                  <a href="https://www.linkedin.com/in/mohammad-anas-5b99b8363/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"><Linkedin className="h-5 w-5" /></a>
                </div></div>
              </div>
            </div>
          </div>
          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto rounded-lg overflow-hidden divide-y">
              <FAQItem question="How can I get personalized advice for my study abroad journey?" answer="You can book a meeting with our advisors using the calendar feature on this page, or fill out the contact form with your specific requirements and questions." />
              <FAQItem question="Do you charge any fees for your services?" answer="Admissions.app is free for students to use. We connect you with verified consultants who may have their own fee structures for premium services." />
              <FAQItem question="How do you verify education consultants on your platform?" answer="Our verification process includes checking business credentials, student reviews, success rates, and in-person visits where possible. We also continuously monitor consultant performance through student feedback." />
              <FAQItem question="Can I trust the reviews on the consultant profiles?" answer="Yes, all reviews on our platform come from verified students who have actually used the consultant's services. We have measures in place to prevent fake reviews." />
              <FAQItem question="How quickly will I get a response if I submit a contact form?" answer="We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, we recommend using the phone number provided." />
            </div>
          </div>
          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Visit Our Office</h2>
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.184270530832!2d78.39980261460832!3d17.44095058804599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93deeb99c8db%3A0x5eefe11e6a0beb97!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1648526248436!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Admissions.app Office Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 