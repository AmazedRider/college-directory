import React from 'react';
import { Mail, Phone, MapPin, GraduationCap, MessageSquare, Award, Book, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#101828] text-white pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-[#6366f1] to-[#14b8a6] p-2 rounded-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-extrabold">admissions.app</span>
            </div>
            <p className="text-gray-400 text-base max-w-xs">
              India's most trusted overseas education platform connecting students with global opportunities.
            </p>
          </div>
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/agencies" className="hover:underline">Consultancy Directory</Link></li>
              <li><Link to="/scholarship-finder" className="hover:underline">Scholarship Finder</Link></li>
              <li><Link to="/course-finder" className="hover:underline">University Search</Link></li>
              <li><Link to="/visa-info" className="hover:underline">Visa Guidance</Link></li>
              <li><Link to="/ai-planner" className="hover:underline">AI Assistant</Link></li>
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/contact" className="hover:underline">Help Center</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-blue-300" /> contact@admissions.app</li>
              <li className="flex items-center gap-2"><Phone className="w-5 h-5 text-pink-300" /> +91  6304666504</li>
              <li className="flex items-center gap-2"><MapPin className="w-5 h-5 text-red-300" /> Hyderabad, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Admissions.app. All rights reserved. Made In india
            <span style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 0.25em' }}>
              <svg width="20" height="14" viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline' }}>
                <rect width="20" height="14" fill="#FF9933"/>
                <rect y="4.67" width="20" height="4.66" fill="#fff"/>
                <rect y="9.33" width="20" height="4.67" fill="#138808"/>
                <circle cx="10" cy="7" r="1.4" fill="none" stroke="#000080" strokeWidth="0.7"/>
                <g stroke="#000080" strokeWidth="0.2">
                  {[...Array(24)].map((_, i) => (
                    <line
                      key={i}
                      x1="10"
                      y1="7"
                      x2={10 + 1.4 * Math.cos((i * 15 * Math.PI) / 180)}
                      y2={7 + 1.4 * Math.sin((i * 15 * Math.PI) / 180)}
                    />
                  ))}
                </g>
              </svg>
            </span>
            for the world 🌎
          </p>
        </div>
      </div>
    </footer>
  );
}