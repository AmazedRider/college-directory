import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MainContent } from '../components/MainContent';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Admissions.app | Find Your Perfect College Consultant</title>
        <meta name="description" content="Connect with top college consultants to help achieve your academic goals. Find experts in Ivy League admissions, international students, STEM programs, and more." />
        <meta name="keywords" content="college consultants, education consulting, college admissions, academic advisors" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <MainContent />
    </>
  );
}