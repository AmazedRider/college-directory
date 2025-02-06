import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AgencyDetails } from '../components/AgencyDetails';
import { useAgency } from '../hooks/useAgency';

export function AgencyPage() {
  const { slug } = useParams<{ slug: string }>();
  const { agency, loading, error } = useAgency(slug);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Agency Not Found</h1>
          <p className="text-gray-600">The agency you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${agency.name} | College Consultancy Directory`}</title>
        <meta name="description" content={agency.description} />
        <meta name="keywords" content={`${agency.name}, ${agency.location}, ${agency.specializations.join(', ')}, college consulting`} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={`${agency.name} | College Consultancy Directory`} />
        <meta property="og:description" content={agency.description} />
        <meta property="og:image" content={agency.imageUrl} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={agency.name} />
        <meta name="twitter:description" content={agency.description} />
        <meta name="twitter:image" content={agency.imageUrl} />
      </Helmet>
      <AgencyDetails agency={agency} />
    </>
  );
}