import React from 'react';
import { Mail, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-400">
              Connecting students with the best college consultants to help achieve their academic goals.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>connect@admissions.app</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+91 6304 666 504</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4 mt-2">
              <a href="https://www.facebook.com/groups/595906066127004" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/admissions.app?igsh=ZXluOHZ5Z3dwbTJk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.reddit.com/r/Admissions_app/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <g>
                    <path d="M18.67,12A2.13,2.13,0,0,0,16.54,9.9a2.19,2.19,0,0,0-1.28.42,8.68,8.68,0,0,0-3.26-.56l.77-2.4,2.14.45A1.51,1.51,0,1,0,16.33,6a1.52,1.52,0,0,0-1.36.81l-2.66-.56a.4.4,0,0,0-.47.24l-1,3.12a8.75,8.75,0,0,0-3.32.56A2.19,2.19,0,0,0,6.29,9.9,2.14,2.14,0,0,0,6,14.08l.09.09a3.86,3.86,0,0,0,0,.76c0,2.76,3.21,5,7.15,5s7.15-2.24,7.15-5a3.86,3.86,0,0,0,0-.76,2.13,2.13,0,0,0,.28-2.17ZM8.92,13.39a1.54,1.54,0,1,1,1.4,1.55A1.48,1.48,0,0,1,8.92,13.39Zm6.65,3.43A4.33,4.33,0,0,1,12,17.7a4.33,4.33,0,0,1-3.54-.88.4.4,0,0,1,0-.56.39.39,0,0,1,.56,0A3.7,3.7,0,0,0,12,17a3.7,3.7,0,0,0,2.95-.75.39.39,0,0,1,.56,0A.4.4,0,0,1,15.57,16.82Zm-.11-2.93a1.54,1.54,0,0,1,0-3.07,1.48,1.48,0,0,1,1.4,1.52A1.48,1.48,0,0,1,15.46,13.89Z"/>
                  </g>
                </svg>
              </a>
              <a href="https://x.com/admissions_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/mohammad-anas-5b99b8363/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Admissions.app. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}