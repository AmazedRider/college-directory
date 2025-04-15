import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, X, Facebook, Twitter, Instagram, Linkedin, ChevronDown, User, Briefcase } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

function ContactCard({ icon, title, content, link }: { icon: React.ReactNode; title: string; content: string; link?: string }) {
  const Container = link ? 'a' : 'div';
  return (
    <Container
      href={link}
      target={link ? "_blank" : undefined}
      rel={link ? "noopener noreferrer" : undefined}
      className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center ${link ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}`}
    >
      <div className="text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </Container>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
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
        <div className="px-4 pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}

const ContactPage: React.FC = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [calLoaded, setCalLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
              branding: { brandColor: "#1e40af" }, // blue-800
            }
          });
          setCalLoaded(true);
        } catch (error) {
          console.error('Error loading Cal.com:', error);
        }
      })();
    }
  }, [showBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Schema for the contact page
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us | Admissions.app',
    description: 'Get in touch with Admissions.app for any questions about college admissions, consulting services, or platform features.',
    publisher: {
      '@type': 'Organization',
      name: 'Admissions.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://admissions.app/logo.png'
      }
    },
    mainEntity: {
      '@type': 'WebPage',
      '@id': 'https://admissions.app/contact'
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Admissions.app - Get in Touch with Study Abroad Experts</title>
        <meta name="description" content="Connect with Admissions.app for expert study abroad guidance. Book a consultation, get in touch via email, phone, or visit our office. Follow us on social media for study abroad tips." />
        <meta name="keywords" content="study abroad consultation, international education, university admission, study abroad experts, education consultants, admissions guidance" />
        <meta property="og:title" content="Contact Admissions.app - Study Abroad Experts" />
        <meta property="og:description" content="Get expert guidance for your study abroad journey. Connect with our team of experienced education consultants." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://admissions.app/contact" />
        <link rel="canonical" href="https://admissions.app/contact" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <SEO 
          title="Contact Us | Admissions.app"
          description="Get in touch with Admissions.app for any questions about college admissions, consulting services, or platform features."
          canonicalUrl="/contact"
          ogType="website"
          keywords={['contact admissions.app', 'college admissions help', 'education consultant support']}
          schema={contactPageSchema}
        />
        
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Admissions.app: Your Study Abroad Partner</h1>
                <p className="text-xl text-blue-100 mb-8">
                  Have questions about finding the best college consultants? Reach out to Admissions.app, Hyderabad's trusted platform for overseas education.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Welcome Message */}
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-lg p-8 mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full opacity-20 -translate-x-12 translate-y-12"></div>
                <div className="relative text-center">
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
                  <p className="text-xl text-gray-700 leading-relaxed mb-8">
                    Whether you're a student seeking a visa consultant or an advisor looking to join our platform, we're here to help.
                  </p>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Book a Call</span>
                  </button>
                </div>
              </div>

              {/* Original Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <ContactCard
                  icon={<Phone className="h-8 w-8" />}
                  title="Phone"
                  content="+91 6304 666 504"
                  link="tel:+916304666504"
                />
                <ContactCard
                  icon={<Mail className="h-8 w-8" />}
                  title="Email"
                  content="connect@admissions.app"
                  link="mailto:connect@admissions.app"
                />
                <ContactCard
                  icon={<MapPin className="h-8 w-8" />}
                  title="Office"
                  content="Admissions.app, Code For India 3rd Floor, Serene Heights, Humayunnagar, Masab Tank, Hyderabad 500028"
                  link="https://goo.gl/maps/mdCqMAUEF8pbYgLC7"
                />
              </div>

              {/* Contact Form Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
                <h2 className="text-2xl font-semibold mb-6 text-center">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
                <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  <FAQItem
                    question="How do I find a study abroad consultant on Admissions.app?"
                    answer="You can browse our verified consultants by visiting the homepage and using our search filters to find the perfect match for your needs."
                  />
                  <FAQItem
                    question="What makes your college consultants trusted?"
                    answer="All our consultants go through a rigorous verification process, including background checks and verification of their credentials and experience."
                  />
                  <FAQItem
                    question="Can I get help with USA student visas?"
                    answer="Yes, many of our consultants specialize in USA student visas and can guide you through the entire process."
                  />
                </div>
              </div>

              {/* Social Media Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Follow Us for Study Abroad Tips</h2>
                <div className="flex justify-center space-x-6">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Facebook className="h-8 w-8" />
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700 transition-colors">
                    <X className="h-8 w-8" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 transition-colors">
                    <Instagram className="h-8 w-8" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition-colors">
                    <Linkedin className="h-8 w-8" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg overflow-hidden flex flex-col">
              <div className="flex-shrink-0 border-b border-gray-100 flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule a Meeting</h3>
                <button
                  onClick={() => {
                    setShowBooking(false);
                    setCalLoaded(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close booking modal"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {calLoaded && (
                  <Cal
                    namespace="30min"
                    calLink="forge/30min"
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "auto"
                    }}
                    config={{
                      layout: "week_view"
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContactPage; 