// src/app/home/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [playerProfile, setPlayerProfile] = useState(null);
  const [recommendedTutorials, setRecommendedTutorials] = useState([]);

  useEffect(() => {
    // This function will run once the user is loaded
    const fetchData = async () => {
      if (user) {
        try {
          // 1. Fetch the player's profile from your database
          // We'll create this API route in the next big step (Profile Page)
          // For now, we'll assume a placeholder or fetch it
          // This is a simplified fetch for now
          const profileRes = await fetch(`/api/profile?id=${user.uid}`);
          const profileData = await profileRes.json();

          if (profileData.success) {
            setPlayerProfile(profileData.data);

            // 2. Fetch recommended tutorials based on the player's experience level
            const tutorialsRes = await fetch(`/api/tutorials?level=${profileData.data.experienceLevel}`);
            const tutorialsData = await tutorialsRes.json();

            if (tutorialsData.success) {
              // Show a maximum of 3 tutorials on the home page
              setRecommendedTutorials(tutorialsData.data.slice(0, 3));
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchData();
  }, [user]); // The dependency array ensures this runs when the user object changes

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user) {
    router.push('/register');
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome, {playerProfile?.email || user.email}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Section 1: Tutorial Recommendations - NOW DYNAMIC */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recommended For You ({playerProfile?.experienceLevel})</h2>
            <Link href="/tutorials" className="text-sm text-blue-400 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedTutorials.length > 0 ? (
              recommendedTutorials.map((tutorial) => (
                <div key={tutorial._id} className="bg-gray-700 p-4 rounded-md">
                  <h3 className="font-bold">{tutorial.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{tutorial.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-3">No recommendations found for your level yet.</p>
            )}
          </div>
        </div>

        {/* Section 2: Tournaments */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tournaments</h2>
            <Link href="/tournaments" className="text-sm text-blue-400 hover:underline">View All</Link>
          </div>
          <p className="text-gray-400">Upcoming tournaments will appear here.</p>
        </div>

        {/* Section 3: Coming Soon - Can be expanded later */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 lg:col-span-3">
           <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
           <p className="text-gray-400">New features, including player quests and advanced profiles, are on the way!</p>
        </div>

      </div>
    </div>
  );
}