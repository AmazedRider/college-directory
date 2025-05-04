import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Globe, Facebook, Instagram, Twitter, Linkedin, X, MessageSquare, ChevronDown } from 'lucide-react';
import { SEO } from '../components/SEO';
import Cal, { getCalApi } from "@calcom/embed-react";

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

export const ContactPage: React.FC = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SEO 
        title="Contact Us | Admissions.app"
        description="Get in touch with our team for any questions about overseas education"
        canonicalUrl="/contact"
      />

      {/* Header section */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-3xl text-sm sm:text-base">
          Have questions about studying abroad or need assistance with our platform? We're here to help!
          Reach out to our team using the contact form below or through our contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
        {/* Contact Form Section */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-semibold leading-none tracking-tight">Send Us a Message</div>
            <div className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</div>
          </div>

          <div className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="inquiryType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                    required
                  >
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
                  <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Enter subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Enter your message"
                  rows={6}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-primary-foreground hover:bg-blue-700 h-10 px-6 py-2 text-white"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          {/* Book a Meeting */}
          <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border border-blue-100">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold">Book a Meeting</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Schedule a virtual meeting with one of our advisors to discuss your study abroad options.
              </p>
              
              <button 
                onClick={() => setShowBooking(!showBooking)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-primary-foreground hover:bg-blue-700 h-9 px-4 py-2 text-white w-full sm:w-auto"
              >
                {showBooking ? 'Hide Calendar' : 'Open Calendar'}
              </button>
              
              {showBooking && (
                <div className="mt-4 bg-white rounded-lg border overflow-hidden">
                  <Cal
                    calLink="team/admissions-app/30min"
                    style={{ width: "100%", height: calLoaded ? "600px" : "100px", border: "none" }}
                    config={{ layout: "month_view" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100">
            <h3 className="text-xl font-semibold mb-4">Our Contact Information</h3>
            <div className="space-y-4">
              <div className="flex">
                <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Email</div>
                  <a href="mailto:connect@admissions.app" className="text-blue-600 hover:underline">connect@admissions.app</a>
                </div>
              </div>
              <div className="flex">
                <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Phone</div>
                  <a href="tel:+916304666504" className="text-blue-600 hover:underline">+91 6304 666 504</a>
                </div>
              </div>
              <div className="flex">
                <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Office Address</div>
                  <p className="text-gray-600">
                    Plot No. 1280, Road No. 36<br />
                    Jubilee Hills, Hyderabad<br />
                    Telangana, India 500033
                  </p>
                </div>
              </div>
              <div className="flex">
                <Clock className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-medium">Operating Hours</div>
                  <p className="text-gray-600">Monday - Saturday: 9:00 AM - 7:00 PM IST<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <div className="font-medium mb-3">Connect With Us</div>
              <div className="flex space-x-4">
                <a href="https://facebook.com/groups/595906066127004" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/admissions.app?igsh=ZXluOHZ5Z3dwbTJk" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://x.com/admissions_app" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors">
                  <X className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/in/mohammad-anas-5b99b8363/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 sm:mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto rounded-lg overflow-hidden divide-y">
          <FAQItem 
            question="How can I get personalized advice for my study abroad journey?" 
            answer="You can book a meeting with our advisors using the calendar feature on this page, or fill out the contact form with your specific requirements and questions."
          />
          <FAQItem 
            question="Do you charge any fees for your services?" 
            answer="Admissions.app is free for students to use. We connect you with verified consultants who may have their own fee structures for premium services."
          />
          <FAQItem 
            question="How do you verify education consultants on your platform?" 
            answer="Our verification process includes checking business credentials, student reviews, success rates, and in-person visits where possible. We also continuously monitor consultant performance through student feedback."
          />
          <FAQItem 
            question="Can I trust the reviews on the consultant profiles?" 
            answer="Yes, all reviews on our platform come from verified students who have actually used the consultant's services. We have measures in place to prevent fake reviews."
          />
          <FAQItem 
            question="How quickly will I get a response if I submit a contact form?" 
            answer="We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, we recommend using the phone number provided."
          />
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12 sm:mt-16">
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
  );
};
