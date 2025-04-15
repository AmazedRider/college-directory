import React, { useState } from 'react';
import { MainContent } from '../components/MainContent';
import { SEO } from '../components/SEO';

export function HomePage() {
  // Schema for the homepage
  const homepageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Admissions.app',
    url: 'https://admissions.app',
    description: 'Find your ideal college consultant with Admissions.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://admissions.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    about: {
      '@type': 'Thing',
      name: 'College Admissions Consulting',
      description: 'Professional college admissions consulting services'
    }
  };

  return (
    <div>
      <SEO
        title="Find Your College Consultant | Admissions.app"
        description="Connect with expert college consultants who can guide you through your academic journey. Search by location, specialization, and more."
        keywords={['college consultant', 'admissions consultant', 'college admissions help', 'education consultant']}
        schema={homepageSchema}
      />
      <MainContent />
    </div>
  );
}
