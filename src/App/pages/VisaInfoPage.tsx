import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Globe, Star, Sparkles, Clock, Briefcase, CheckCircle } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

const visaData = [
  {
    country: 'USA',
    countryCode: 'US',
    visa: 'F-1 Visa (Academic), M-1 Visa (Vocational)',
    processing: '2 days to 3 weeks',
    fee: '$185 (Visa) + $350 (SEVIS)',
    benefits: 'Access to top universities; OPT for up to 12 months (additional 24 months for STEM)',
    work: 'Up to 20 hours/week during term; full-time during breaks',
    links: [
      { label: 'mastersportal.com', url: 'https://mastersportal.com' },
      { label: 'reuters.com', url: 'https://reuters.com' },
      { label: 'topgrad.in', url: 'https://topgrad.in' },
      { label: 'investopedia.com', url: 'https://investopedia.com' },
    ],
  },
  {
    country: 'UK',
    countryCode: 'GB',
    visa: 'Student Visa (formerly Tier 4)',
    processing: '~3 weeks; priority options available',
    fee: '£490 (Visa) + £624/year (Health Surcharge)',
    benefits: 'Post-study work visa for up to 2 years; world-class education system',
    work: 'Up to 20 hours/week during term; full-time during holidays',
    links: [
      { label: 'shiksha.com', url: 'https://shiksha.com' },
      { label: 'theaustralian.com.au', url: 'https://theaustralian.com.au' },
      { label: 'topgrad.in', url: 'https://topgrad.in' },
      { label: 'investopedia.com', url: 'https://investopedia.com' },
    ],
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    visa: 'Study Permit',
    processing: '3-4 weeks; up to 7 weeks from India',
    fee: 'C$150 (Visa) + C$255 (PGWP)',
    benefits: 'PGWP up to 3 years; pathway to permanent residency',
    work: 'Up to 24 hours/week during term; full-time during breaks',
    links: [
      { label: 'studyabroad.careers360.com', url: 'https://studyabroad.careers360.com' },
      { label: 'topgrad.in', url: 'https://topgrad.in' },
      { label: 'timeshighereducation.com', url: 'https://timeshighereducation.com' },
      { label: 'en.wikipedia.org', url: 'https://en.wikipedia.org' },
    ],
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    visa: 'Subclass 500 (Student Visa)',
    processing: '75% within 28 days; 90% within 48 days',
    fee: 'A$1,600; proposed increase to A$2,000',
    benefits: 'Temporary Graduate Visa (Subclass 485) for 2-4 years; high-quality education',
    work: 'Up to 48 hours/fortnight during term; unlimited during holidays',
    links: [
      { label: 'studyabroad.careers360.com', url: 'https://studyabroad.careers360.com' },
      { label: 'reuters.com', url: 'https://reuters.com' },
      { label: 'topgrad.in', url: 'https://topgrad.in' },
    ],
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    visa: 'Student Visa, Student Applicant Visa, Language Course Visa',
    processing: '6-12 weeks; up to 3 months',
    fee: '€75 (Visa); €56-€100 (Residence Permit)',
    benefits: 'No tuition fees at public universities; 18-month job-seeking visa post-graduation',
    work: '120 full days or 240 half days per year',
    links: [
      { label: 'rocket.com', url: 'https://rocket.com' },
      { label: 'studythem.com', url: 'https://studythem.com' },
      { label: 'studylink.com', url: 'https://studylink.com' },
    ],
  },
  {
    country: 'France',
    countryCode: 'FR',
    visa: 'VLS-TS (Long-Stay Student Visa)',
    processing: '2-4 weeks',
    fee: '€99',
    benefits: 'Work up to 964 hours/year; access to French public services',
    work: 'Up to 20 hours/week during term',
    links: [
      { label: 'campusfrance.org', url: 'https://www.campusfrance.org/en' },
      { label: 'france-visas.gouv.fr', url: 'https://france-visas.gouv.fr/en_US/web/france-visas' },
    ],
  },
  {
    country: 'New Zealand',
    countryCode: 'NZ',
    visa: 'Fee Paying Student Visa',
    processing: '4-6 weeks',
    fee: 'NZ$375',
    benefits: 'Post-study work visa up to 3 years; high quality of life',
    work: 'Up to 20 hours/week during term; full-time during breaks',
    links: [
      { label: 'immigration.govt.nz', url: 'https://www.immigration.govt.nz/new-zealand-visas/options/study' },
    ],
  },
  {
    country: 'Singapore',
    countryCode: 'SG',
    visa: 'Student Pass',
    processing: '2-4 weeks',
    fee: 'S$30 (application) + S$60 (issuance)',
    benefits: 'Access to top Asian universities; vibrant city life',
    work: 'Up to 16 hours/week during term (with permission)',
    links: [
      { label: 'ica.gov.sg', url: 'https://www.ica.gov.sg/reside/STP/apply' },
    ],
  },
  {
    country: 'Netherlands',
    countryCode: 'NL',
    visa: 'MVV (Entry Visa) + Residence Permit',
    processing: '2-3 months',
    fee: '€210',
    benefits: 'Orientation year for graduates; high English proficiency',
    work: 'Up to 16 hours/week or full-time in summer',
    links: [
      { label: 'ind.nl', url: 'https://ind.nl/en/study' },
    ],
  },
  {
    country: 'Ireland',
    countryCode: 'IE',
    visa: 'Stamp 2 (Student Visa)',
    processing: '4-8 weeks',
    fee: '€60 (single entry), €100 (multi-entry)',
    benefits: 'Stay back up to 2 years after graduation',
    work: 'Up to 20 hours/week during term; 40 hours during holidays',
    links: [
      { label: 'educationinireland.com', url: 'https://www.educationinireland.com/en/' },
      { label: 'inis.gov.ie', url: 'https://www.irishimmigration.ie/' },
    ],
  },
  {
    country: 'Sweden',
    countryCode: 'SE',
    visa: 'Residence Permit for Studies',
    processing: '2-3 months',
    fee: 'SEK 1,500',
    benefits: 'Stay back up to 1 year after studies; high quality of life',
    work: 'No official limit, but studies must be priority',
    links: [
      { label: 'studyinsweden.se', url: 'https://studyinsweden.se/' },
      { label: 'migrationsverket.se', url: 'https://www.migrationsverket.se/English/Private-individuals/Studying-in-Sweden.html' },
    ],
  },
  {
    country: 'Italy',
    countryCode: 'IT',
    visa: 'Type D (Long-Stay Student Visa)',
    processing: '1-3 months',
    fee: '€50 (visa) + €76 (residence permit)',
    benefits: 'Affordable tuition; rich cultural experience',
    work: 'Up to 20 hours/week',
    links: [
      { label: 'studyinitaly.esteri.it', url: 'https://studyinitaly.esteri.it/en/home_borse' },
    ],
  },
  {
    country: 'Switzerland',
    countryCode: 'CH',
    visa: 'National Visa (D)',
    processing: '8-12 weeks',
    fee: 'CHF 88',
    benefits: 'High standard of living; top universities',
    work: 'Up to 15 hours/week after 6 months',
    links: [
      { label: 'swissuniversities.ch', url: 'https://www.swissuniversities.ch/en/' },
    ],
  },
  {
    country: 'Spain',
    countryCode: 'ES',
    visa: 'Type D (Student Visa)',
    processing: '1-2 months',
    fee: '€60-€80',
    benefits: 'Affordable living; vibrant student life',
    work: 'Up to 20 hours/week',
    links: [
      { label: 'spainvisa.eu', url: 'https://www.spainvisa.eu/student-visa/' },
    ],
  },
  {
    country: 'South Korea',
    countryCode: 'KR',
    visa: 'D-2 (Student Visa)',
    processing: '2-4 weeks',
    fee: 'KRW 60,000',
    benefits: 'Cutting-edge technology; scholarships available',
    work: 'Up to 20 hours/week during term',
    links: [
      { label: 'studyinkorea.go.kr', url: 'https://www.studyinkorea.go.kr/' },
    ],
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    visa: 'Student Visa',
    processing: '2-3 months',
    fee: '¥3,000 (single entry)',
    benefits: 'Innovative education; scholarships for international students',
    work: 'Up to 28 hours/week',
    links: [
      { label: 'japan-study.com', url: 'https://www.japan-study.com/' },
      { label: 'studyinjapan.go.jp', url: 'https://www.studyinjapan.go.jp/en/' },
    ],
  },
  {
    country: 'China',
    countryCode: 'CN',
    visa: 'X1/X2 (Student Visa)',
    processing: '2-4 weeks',
    fee: 'Varies by country (typically $30-$150)',
    benefits: 'Affordable tuition; growing global reputation',
    work: 'Part-time work allowed with permission',
    links: [
      { label: 'campuschina.org', url: 'https://www.campuschina.org/' },
    ],
  },
  {
    country: 'UAE',
    countryCode: 'AE',
    visa: 'Student Residence Visa',
    processing: '2-4 weeks',
    fee: 'AED 3,000-5,000',
    benefits: 'Modern campuses; multicultural environment',
    work: 'Part-time work allowed with university approval',
    links: [
      { label: 'studyinuae.com', url: 'https://www.studyinuae.com/' },
    ],
  },
  {
    country: 'South Africa',
    countryCode: 'ZA',
    visa: 'Study Visa',
    processing: '4-8 weeks',
    fee: 'ZAR 1,775',
    benefits: 'Diverse culture; English-taught programs',
    work: 'Up to 20 hours/week',
    links: [
      { label: 'studyinsouthafrica.info', url: 'https://www.studyinsouthafrica.info/' },
    ],
  },
  // ...add more countries as needed
];

export function VisaInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f8fb] via-[#f6fbfa] to-[#eaf6fa]">
      <Helmet>
        <title>Student Visa Information | Admissions.app</title>
        <meta
          name="description"
          content="Comprehensive information about student visas for various countries, including processing times, fees, benefits, and work allowances."
        />
      </Helmet>
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden py-0 px-2">
        {/* Blurred Gradient Blobs */}
        <div className="absolute left-[-10vw] top-[-10vh] w-[400px] h-[400px] bg-[#e0e7ff] rounded-full blur-3xl opacity-40 z-0" />
        <div className="absolute right-[-8vw] bottom-[-8vh] w-[350px] h-[350px] bg-[#99f6e4] rounded-full blur-3xl opacity-30 z-0" />
        {/* Greenish Tint Blob (left side) */}
        <div className="absolute left-[-15vw] top-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#6ee7b7] via-[#a7f3d0] to-transparent rounded-full blur-3xl opacity-50 z-0" />
        {/* Badge */}
        <div className="flex items-center gap-2 px-6 py-2 bg-white border border-[#e0e7ff] rounded-full shadow text-[#6366f1] font-semibold text-base mb-8 mt-8 max-w-fit mx-auto animate-fade-in z-10">
          <Globe className="w-5 h-5 text-[#6366f1]" />
          Student Visa Info
        </div>
        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6 leading-tight text-[#181c2a] z-10">
          Your Gateway to <span className="bg-gradient-to-r from-[#6366f1] via-[#6366f1] to-[#14b8a6] bg-clip-text text-transparent">Visa Success</span>
        </h1>
        {/* Description */}
        <p className="text-[#475569] text-center text-xl md:text-2xl mb-10 max-w-3xl font-medium z-10">
          Comprehensive guides, tips, and resources for student visas in top study destinations.
        </p>
        {/* CTA Button */}
        <div className="flex flex-row gap-4 mb-4 w-full max-w-md justify-center z-10">
          <a
            href="#visa-info"
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl shadow-lg text-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#60a5fa] text-center hover:bg-[#1d4ed8] hover:scale-105 hover:shadow-2xl"
          >
            Explore Visa Info
          </a>
        </div>
      </div>
      {/* Visa Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {visaData.map((visa, idx) => (
            <div key={visa.country} className="group bg-white rounded-3xl shadow-2xl border-2 border-blue-100 p-0 flex flex-col min-h-[380px] transition-transform duration-200 hover:scale-[1.04] hover:shadow-blue-300 relative overflow-hidden">
              {/* Card header gradient */}
              <div className="h-20 w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-pink-400 flex items-center px-7 gap-4">
                <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-blue-200 mt-2 mb-1 overflow-hidden p-0">
                  <span className="w-full h-full flex items-center justify-center overflow-hidden rounded-full">
                    <ReactCountryFlag
                      countryCode={visa.countryCode}
                      svg
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '50%' }}
                      title={visa.country}
                    />
                  </span>
                </span>
                <span className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">{visa.country}</span>
              </div>
              <div className="flex-1 flex flex-col p-7 bg-gradient-to-br from-white via-blue-50 to-pink-50">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded-full text-xs shadow mr-2"><Globe className="w-4 h-4 inline-block mr-1" />{visa.visa}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 font-semibold rounded-full text-xs shadow mr-2"><Clock className="w-4 h-4 inline-block mr-1" />{visa.processing}</span>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 font-semibold rounded-full text-xs shadow"><Star className="w-4 h-4 inline-block mr-1" />{visa.fee}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-semibold rounded-full text-xs shadow"><CheckCircle className="w-4 h-4 inline-block mr-1" />{visa.benefits}</span>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 font-semibold rounded-full text-xs shadow"><Briefcase className="w-4 h-4 inline-block mr-1" />{visa.work}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {visa.links.map(link => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-pink-100 text-blue-700 font-semibold rounded-full text-xs shadow hover:from-blue-200 hover:to-pink-200 hover:text-blue-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 mb-24 bg-gradient-to-r from-blue-50 via-pink-50 to-yellow-50 shadow-md rounded-2xl p-8 border border-blue-100/40">
          <div className="flex items-center gap-3 mb-2">
            <Star className="text-yellow-400 w-7 h-7 animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight">Visa Essentials & Tips</h2>
          </div>
          <p className="text-blue-700 text-lg mb-4 font-medium">Stay updated and prepared for your study abroad journey with these key visa insights:</p>
          <ul className="space-y-2 text-gray-700 text-base">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Visa requirements, processing times, and fees can change. Always check the official embassy or consulate for the latest info.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Be ready with documents like proof of funds, health insurance, and accommodation details.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Work allowances may have restrictions or need extra permits. Review immigration rules carefully.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Some countries offer priority or express processing for an extra fee.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Post-study work options differ by country, study level, and field.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 