// src/app/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Tour from '../components/Tour'; // Using relative path
import BrowserMockup from '../components/BrowserMockup'; // Using relative path
import { useAuth } from '../context/AuthContext'; // Using relative path
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [tourCompleted, setTourCompleted] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // If the user is already logged in, redirect them to the home dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  // Don't render anything if user is logged in and we are redirecting
  if (user || loading) {
    return <div className="min-h-screen" />; // Render a blank screen to avoid flash of content
  }

  // These are invisible elements for the Tour component to find and highlight
  const TourPlaceholders = () => (
    <div className="pointer-events-none opacity-0 fixed inset-0 flex items-center justify-center">
        <div id="logo-step" className="w-48 h-16" />
        <div id="features-step" className="absolute top-1/2 w-96 h-24" />
        <div id="cta-step" className="absolute bottom-1/4 w-48 h-12" />
    </div>
  );

  return (
    <div className="landing-page-bg">
      {tourCompleted ? (
        <BrowserMockup />
      ) : (
        <>
          <TourPlaceholders />
          <Tour onComplete={() => setTourCompleted(true)} />
        </>
      )}
    </div>
  );
}