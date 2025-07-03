import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Star, ChevronRight, Users, MessageSquare, CheckCircle, Phone } from 'lucide-react';

interface AgencyCardProps {
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  trustScore: number;
  price: number | null | undefined;
  specializations: string[];
  isVerified: boolean;
  slug: string;
}

// Mock bullet points for demo
const mockBullets = [
  ["Visa Assistance", "Scholarship Guidance", "Personalized Counseling"],
  ["Application Process", "IELTS/TOEFL Prep", "Predeparture Support"],
  ["University Selection", "Financial Aid Help", "Career Counseling"],
  ["SOP/Essay Review", "Accommodation Help", "Mock Interviews"],
  ["End-to-End Support", "Trusted by 1000+ Students", "24/7 Chat Support"],
];

function getRandomBullets() {
  const idx = Math.floor(Math.random() * mockBullets.length);
  return mockBullets[idx];
}

function getMockRating() {
  return (Math.random() * 1.2 + 3.8).toFixed(1); // 3.8–5.0
}

function getMockReviews() {
  return Math.floor(Math.random() * 109) + 12; // 12–120
}

export function AgencyCard({
  name,
  location,
  description,
  imageUrl,
  trustScore,
  price,
  specializations,
  isVerified,
  slug
}: AgencyCardProps) {
  // Mocked data
  const rating = parseFloat(getMockRating());
  const total_reviews = getMockReviews();
  const bullets = getRandomBullets();

  // Gmail compose URL for direct email
  const gmailComposeUrl =
    'https://mail.google.com/mail/?view=cm&fs=1&to=contact@admissions.aoo';

  return (
    <Link 
      to={`/agency/${slug}`}
      className="group relative bg-white/60 backdrop-blur-xl border border-blue-100 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl hover:border-primary/30 flex flex-col md:flex-row min-h-[220px]"
    >
      {/* Pastel Gradient Accent Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 md:hidden" />

      {/* Verified Badge */}
      {isVerified && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg z-10">
          <Shield className="h-4 w-4" />
          Verified
        </div>
      )}

      {/* Image (left side on desktop) */}
      <div className="flex-shrink-0 flex justify-center items-center md:justify-start md:items-start md:pl-6 py-6 md:py-0 md:pr-0 md:mt-0 md:mb-0 md:w-56">
        <div className="rounded-2xl border-4 border-white shadow-lg overflow-hidden w-32 h-32 md:w-44 md:h-44 bg-gray-100">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Section (right side on desktop) */}
      <div className="flex-1 flex flex-col px-6 pb-6 justify-between">
        {/* Header Row */}
        <div className="mb-2">
          <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">
            <MapPin className="h-4 w-4 inline-block mr-1 -mt-1" />
            {location}
          </span>
        </div>

        {/* Stars & Reviews */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 md:h-6 md:w-6 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                style={{ color: i < Math.round(rating) ? '#FFD700' : undefined }}
              />
            ))}
          </div>
          <span className="text-base font-semibold text-gray-700">{rating.toFixed(1)}</span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {total_reviews} review{total_reviews > 1 ? 's' : ''}
          </span>
        </div>

        {/* Services Bullet Points (green ticks only) */}
        <ul className="mb-3 space-y-1">
          {bullets.map((point, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-green-400" />
              {point}
            </li>
          ))}
        </ul>

        {/* Call & Message CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-auto pt-4 border-t border-gray-100 gap-3 md:gap-0">
          <div className="flex gap-3 w-full md:w-auto">
            <a
              href="tel:+916304666504"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
              style={{ minWidth: 120, justifyContent: 'center' }}
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <a
              href={gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ minWidth: 120, justifyContent: 'center' }}
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <MessageSquare className="h-4 w-4" />
              Send Message
            </a>
          </div>
          <span className="flex items-center mt-2 md:mt-0">
            <span className="mr-2 text-primary font-semibold text-sm">View Details</span>
            <span className="rounded-full bg-white/70 border border-primary p-2 shadow hover:bg-primary hover:text-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </span>
          </span>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}