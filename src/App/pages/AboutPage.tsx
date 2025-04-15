import React from 'react';
import { Users, BookOpen, Target } from 'lucide-react';
import { SEO } from '../components/SEO';

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

export function AboutPage() {
  // Schema for the about page
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Admissions.app',
    description: 'Learn about Admissions.app and our mission to connect students with the best college admissions consultants.',
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
      '@id': 'https://admissions.app/about'
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO 
        title="About Us | Admissions.app"
        description="Learn about Admissions.app and our mission to connect students with the best college admissions consultants for their unique needs and goals."
        canonicalUrl="/about"
        ogType="website"
        keywords={['about admissions.app', 'college admissions platform', 'education consultant directory']}
        schema={aboutPageSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering Your Study Abroad Journey</h1>
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

            {/* New About Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                At Admissions.app, we believe every student deserves expert guidance to achieve their academic dreams. Based in Hyderabad, India, our platform connects students with verified college consultants worldwide, specializing in overseas education, student visas, and university admissions. From engineering to MBA programs, our advisors help you navigate applications, secure scholarships, and prepare for top universities in the USA, UK, Canada, Australia, and beyond.
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

          {/* New About Section */}
          <div className="mt-16">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-10 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full opacity-20 -translate-x-12 translate-y-12"></div>
              
              <div className="relative">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                  Founded to simplify the complex world of college admissions, Admissions.app combines technology and expertise to make your journey stress-free. Whether you're a high school student in Hyderabad or an international applicant, our platform empowers you to find the best college consultants for your needs. Join thousands of students who've trusted us to turn their study abroad dreams into reality. Explore our platform today!
                </p>
              </div>
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
        </div>
      </div>
    </div>
  );
} 