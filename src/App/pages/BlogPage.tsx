import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Book, FileText, ArrowRight, Sparkles, Star } from 'lucide-react';

export function BlogPage() {
  const blogCategories = [
    {
      icon: <BookOpen className="w-12 h-12 text-blue-500" />,
      title: "Knowledge Hub",
      description: "Comprehensive guides, tips, and resources for studying abroad. Everything you need to know about international education.",
      link: "/knowledge-hub",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      features: ["Study guides", "Application tips", "Country insights", "Student resources"]
    },
    {
      icon: <Book className="w-12 h-12 text-purple-500" />,
      title: "Exam Blog",
      description: "Exam preparation strategies, study materials, and success stories from students who've achieved their academic goals.",
      link: "/exam-blog",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      features: ["Test strategies", "Study materials", "Success stories", "Practice resources"]
    },
    {
      icon: <FileText className="w-12 h-12 text-green-500" />,
      title: "Visa Information",
      description: "Detailed visa requirements, application processes, and country-specific information for international students.",
      link: "/visa-info",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
      features: ["Visa requirements", "Application guides", "Country info", "Documentation help"]
    }
  ];

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
          <BookOpen className="w-5 h-5 text-[#6366f1]" />
          Blogs & Resources
        </div>
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a] z-10">
          Your Gateway to <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Expert Insights</span>
        </h1>
        {/* Description */}
        <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium z-10">
          Access expert insights, comprehensive guides, and valuable resources to support your international education journey.
        </p>
        {/* CTA Button */}
        <div className="flex flex-row gap-4 mb-4 w-full max-w-md justify-center z-10">
          <Link
            to="/knowledge-hub"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#60a5fa] text-center hover:bg-[#1d4ed8] hover:scale-105 hover:shadow-2xl"
          >
            Explore Knowledge Hub
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Resource Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each section is carefully curated to provide you with the most relevant and up-to-date information for your study abroad journey.
          </p>
        </div>

        {/* Blog Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {blogCategories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${category.color} p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-fit mb-4">
                    {category.icon}
          </div>
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {category.description}
                  </p>
                        </div>
                      </div>

              {/* Card Body */}
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What you'll find:</h4>
                  <ul className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                      </div>

                {/* CTA Button */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${category.textColor}`}>
                    Explore {category.title}
                  </span>
                  <div className={`p-2 rounded-full bg-gradient-to-r ${category.color} text-white group-hover:scale-110 transition-transform duration-200`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ))}
                      </div>

        {/* Additional Resources Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need More Help?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform offers additional tools and resources to support your international education journey.
            </p>
                        </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/course-finder"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                <h4 className="font-semibold text-gray-900">Course Finder</h4>
                      </div>
              <p className="text-sm text-gray-600">Search thousands of international courses and programs.</p>
            </Link>
            
            <Link
              to="/scholarship-finder"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FileText className="w-5 h-5 text-green-600" />
                    </div>
                <h4 className="font-semibold text-gray-900">Scholarship Finder</h4>
              </div>
              <p className="text-sm text-gray-600">Discover funding opportunities for your education.</p>
            </Link>
            
            <Link
              to="/agencies"
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Book className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900">Consultancy Directory</h4>
              </div>
              <p className="text-sm text-gray-600">Connect with verified education consultants.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}