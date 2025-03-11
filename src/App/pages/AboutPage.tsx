import React, { useState, useEffect } from 'react';
import { GraduationCap, Users, BookOpen, Target, Star, Mail, Phone, MapPin, Globe, Clock, MessageSquare, X } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <div className="text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

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

export function AboutPage() {
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "30min" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: {
          branding: { brandColor: "#1e40af" }, // blue-800
        }
      });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Admissions.app</h1>
            <p className="text-xl text-blue-100">
              Your trusted partner in the college admissions journey, connecting ambitious students with expert consultants.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 transform -mt-20">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We believe that every student deserves access to quality college consulting. Our mission is to democratize the college admissions process by making expert guidance accessible to students from all backgrounds. Through our platform, we're breaking down barriers and empowering students to reach their full potential.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Expert Consultants"
            description="Access to a network of verified college consultants with proven track records of success."
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Application Guidance"
            description="Personalized support for crafting compelling essays and building strong applications."
          />
          <FeatureCard
            icon={<Target className="h-8 w-8" />}
            title="Strategic Planning"
            description="Expert advice on college selection and application strategy tailored to your goals."
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Successful Applications</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Expert Consultants</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards of quality in our consulting services and platform features.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Accessibility</h3>
              <p className="text-gray-600">
                Making quality college consulting available to students regardless of their background.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Transparency</h3>
              <p className="text-gray-600">
                Providing clear, honest information and maintaining an open review system.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Innovation</h3>
              <p className="text-gray-600">
                Continuously improving our platform to better serve students and consultants.
              </p>
            </div>
          </div>
        </div>

        {/* Connect With Us Section */}
        <div id="connect-with-us" className="scroll-mt-20 mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Connect With Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help! Reach out to us through any of the following channels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ContactCard
              icon={<Phone className="h-8 w-8" />}
              title="Phone"
              content="+91 6304 666 504"
              link="tel:+916304666504"
            />
            <ContactCard
              icon={<Mail className="h-8 w-8" />}
              title="Email"
              content="support@admissions.app"
              link="mailto:support@admissions.app"
            />
            <ContactCard
              icon={<MapPin className="h-8 w-8" />}
              title="Office"
              content="Admissions.app, Code For India 3rd Floor, Serene Heights, Humayunnagar, Masab Tank, Hyderabad 500028"
              link="https://goo.gl/maps/mdCqMAUEF8pbYgLC7"
            />
          </div>

          <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
            <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Schedule a Consultation</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Want to discuss your college admissions journey? Schedule a free consultation with one of our expert advisors.
            </p>
            <button
              onClick={() => setShowBooking(true)}
              className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book a Call
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
          <div className="h-full w-full flex flex-col">
            <div className="bg-white w-full flex-1 flex flex-col">
              <div className="flex-shrink-0 border-b border-gray-100 flex items-center justify-between p-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule a Meeting</h3>
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close booking modal"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
                <Cal
                  namespace="30min"
                  calLink="forge/30min"
                  style={{
                    width: "100%",
                    height: "100vh",
                    overflow: "auto"
                  }}
                  config={{
                    layout: "week_view"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
