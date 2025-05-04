import React from 'react';
import { Helmet } from 'react-helmet-async';

export function VisaInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Student Visa Information | Admissions.app</title>
        <meta
          name="description"
          content="Comprehensive information about student visas for various countries, including processing times, fees, benefits, and work allowances."
        />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Visa Information</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guide to student visas for popular study destinations, including visa types, processing times, fees, benefits, and work allowances.
          </p>
        </div>
        
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Country</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Visa Name & Type</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Processing Time</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Fee (Approx.)</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Benefits</th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Work Hours Allowed</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* USA */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">USA</td>
                <td className="px-6 py-4 text-sm text-gray-500">F-1 Visa (Academic), M-1 Visa (Vocational)</td>
                <td className="px-6 py-4 text-sm text-gray-500">2 days to 3 weeks <br/><a href="https://mastersportal.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">mastersportal.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">$185 (Visa) + $350 (SEVIS) <br/><a href="https://reuters.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">reuters.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Access to top universities; Optional Practical Training (OPT) for up to 12 months (additional 24 months for STEM graduates) <br/><a href="https://topgrad.in" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">topgrad.in</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 20 hours/week during term; full-time during breaks <br/><a href="https://investopedia.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">investopedia.com</a></td>
              </tr>
              
              {/* UK */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">UK</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student Visa (formerly Tier 4)</td>
                <td className="px-6 py-4 text-sm text-gray-500">~3 weeks; priority options available <br/><a href="https://shiksha.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">shiksha.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">£490 (Visa) + £624/year (Health Surcharge) <br/><a href="https://theaustralian.com.au" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">theaustralian.com.au</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Post-study work visa for up to 2 years; world-class education system <br/><a href="https://topgrad.in" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">topgrad.in</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 20 hours/week during term; full-time during holidays <br/><a href="https://investopedia.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">investopedia.com</a></td>
              </tr>
              
              {/* Canada */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Canada</td>
                <td className="px-6 py-4 text-sm text-gray-500">Study Permit</td>
                <td className="px-6 py-4 text-sm text-gray-500">3-4 weeks; up to 7 weeks from India <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">C$150 (Visa) + C$255 (Post-Graduation Work Permit) <br/><a href="https://topgrad.in" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">topgrad.in</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Post-Graduation Work Permit (PGWP) up to 3 years; pathway to permanent residency <br/><a href="https://timeshighereducation.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">timeshighereducation.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 24 hours/week during term; full-time during scheduled breaks <br/><a href="https://en.wikipedia.org" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">en.wikipedia.org</a></td>
              </tr>
              
              {/* Australia */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Australia</td>
                <td className="px-6 py-4 text-sm text-gray-500">Subclass 500 (Student Visa)</td>
                <td className="px-6 py-4 text-sm text-gray-500">75% within 28 days; 90% within 48 days <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">A$1,600; proposed increase to A$2,000 <br/><a href="https://reuters.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">reuters.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Temporary Graduate Visa (Subclass 485) for 2-4 years; high-quality education <br/><a href="https://topgrad.in" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">topgrad.in</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 48 hours/fortnight during term; unlimited during holidays <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
              </tr>
              
              {/* Germany */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Germany</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student Visa, Student Applicant Visa, Language Course Visa</td>
                <td className="px-6 py-4 text-sm text-gray-500">6-12 weeks; up to 3 months <br/><a href="https://rocket.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">rocket.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">€75 (Visa); €56-€100 (Residence Permit) <br/><a href="https://studythem.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studythem.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">No tuition fees at public universities; 18-month job-seeking visa post-graduation</td>
                <td className="px-6 py-4 text-sm text-gray-500">120 full days or 240 half days per year <br/><a href="https://studylink.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studylink.com</a></td>
              </tr>
              
              {/* China */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">China</td>
                <td className="px-6 py-4 text-sm text-gray-500">X1 (Long-term), X2 (Short-term)</td>
                <td className="px-6 py-4 text-sm text-gray-500">4-8 business days <br/><a href="https://studyinternational.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyinternational.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">$140 (Visa) + $185 (Service Fee) <br/><a href="https://studyinternational.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyinternational.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Affordable education; cultural immersion</td>
                <td className="px-6 py-4 text-sm text-gray-500">Limited part-time work; regulations vary</td>
              </tr>
              
              {/* Malaysia */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Malaysia</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student Pass</td>
                <td className="px-6 py-4 text-sm text-gray-500">1-3 weeks <br/><a href="https://studyinternational.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyinternational.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">MYR 1,060-1,560 (Visa) <br/><a href="https://studyinternational.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyinternational.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Affordable tuition; diverse culture</td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 20 hours/week during term; full-time during holidays</td>
              </tr>
              
              {/* Japan */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Japan</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student Visa</td>
                <td className="px-6 py-4 text-sm text-gray-500">~2 weeks <br/><a href="https://unipage.net" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">unipage.net</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">JPY 3,000 (Visa) <br/><a href="https://studyabroad.shiksha.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.shiksha.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">High-quality education; cultural experience</td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 28 hours/week during term; full-time during holidays</td>
              </tr>
              
              {/* South Korea */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">South Korea</td>
                <td className="px-6 py-4 text-sm text-gray-500">D-2 Student Visa</td>
                <td className="px-6 py-4 text-sm text-gray-500">~2 weeks <br/><a href="https://studyabroad.shiksha.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.shiksha.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">KRW 60,000 (Visa) <br/><a href="https://studyab" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyab</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">High-quality education; growing international programs</td>
                <td className="px-6 py-4 text-sm text-gray-500">Limited part-time work with permission</td>
              </tr>
              
              {/* New Zealand */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">New Zealand</td>
                <td className="px-6 py-4 text-sm text-gray-500">Fee Paying Student Visa</td>
                <td className="px-6 py-4 text-sm text-gray-500">~6 weeks; 90% within 47 weekdays <br/><a href="https://shiksha.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">shiksha.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">NZ$375 (Visa) <br/><a href="https://theaustralian.com.au" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">theaustralian.com.au</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Post-study work visa up to 3 years; quality education system <br/><a href="https://timeshighereducation.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">timeshighereducation.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 20 hours/week during term; full-time during holidays <br/><a href="https://investopedia.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">investopedia.com</a></td>
              </tr>
              
              {/* Ireland */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ireland</td>
                <td className="px-6 py-4 text-sm text-gray-500">D Study Visa (for courses &gt;3 months)</td>
                <td className="px-6 py-4 text-sm text-gray-500">8 weeks or longer <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">€60 (Visa) <br/><a href="https://theaustralian.com.au" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">theaustralian.com.au</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Post-study work visa up to 2 years; access to EU job market <br/><a href="https://timeshighereducation.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">timeshighereducation.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 20 hours/week during term; full-time during holidays <br/><a href="https://investopedia.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">investopedia.com</a></td>
              </tr>
              
              {/* Singapore */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Singapore</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student Pass</td>
                <td className="px-6 py-4 text-sm text-gray-500">2-5 weeks <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">SGD 90 (Visa) <br/><a href="https://studyabroad.shiksha.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.shiksha.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Efficient visa process; strong education system</td>
                <td className="px-6 py-4 text-sm text-gray-500">Part-time work allowed during term; full-time during holidays</td>
              </tr>
              
              {/* France */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">France</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student Visa (Type D)</td>
                <td className="px-6 py-4 text-sm text-gray-500">15 days <br/><a href="https://unipage.net" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">unipage.net</a> <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">€99 (Visa) <br/><a href="https://unipage.net" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">unipage.net</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Access to EU education; post-study work opportunities</td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 964 hours/year (approx. 20 hours/week)</td>
              </tr>
              
              {/* Netherlands */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Netherlands</td>
                <td className="px-6 py-4 text-sm text-gray-500">MVV (Provisional Residence Permit)</td>
                <td className="px-6 py-4 text-sm text-gray-500">2-4 weeks <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">€174 (Visa) <br/><a href="https://unipage.net" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">unipage.net</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">High-quality education; post-study work options</td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 16 hours/week during term; full-time during holidays</td>
              </tr>
              
              {/* Sweden */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sweden</td>
                <td className="px-6 py-4 text-sm text-gray-500">Residence Permit for Studies</td>
                <td className="px-6 py-4 text-sm text-gray-500">~3 weeks <br/><a href="https://studyabroad.careers360.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">studyabroad.careers360.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">SEK 1,500 (Visa) <br/><a href="https://unipage.net" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">unipage.net</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Innovative education system; post-study work opportunities</td>
                <td className="px-6 py-4 text-sm text-gray-500">Up to 20 hours/week during term; full-time during holidays</td>
              </tr>
              
              {/* UAE */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">UAE</td>
                <td className="px-6 py-4 text-sm text-gray-500">Student Visa</td>
                <td className="px-6 py-4 text-sm text-gray-500">15-20 days <br/><a href="https://shiksha.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">shiksha.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">AED 1,000-3,000 (Visa) <br/><a href="https://shiksha.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">shiksha.com</a></td>
                <td className="px-6 py-4 text-sm text-gray-500">Quick processing; potential for 5-year visa for outstanding students</td>
                <td className="px-6 py-4 text-sm text-gray-500">Limited part-time work; full-time during holidays</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-12 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Visa Information</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Visa requirements, processing times, and fees are subject to change. Always check with the official embassy or consulate of your destination country for the most current information.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Additional documentation such as proof of financial means, health insurance, and accommodation may be required as part of your visa application.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Work allowances may have specific restrictions or require additional permits. Check the official immigration websites for detailed regulations.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Some countries offer priority or express processing for an additional fee.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Post-study work options vary significantly between countries and may depend on your level of study and field.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 