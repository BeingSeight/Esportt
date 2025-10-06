// src/app/tutorials/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function TutorialsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tutorials, setTutorials] = useState([]);
  const [filter, setFilter] = useState('All'); // 'All', 'Rookie', 'Contender', 'Champion'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTutorials = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/tutorials');
        const data = await res.json();
        if (data.success) {
          setTutorials(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tutorials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  if (loading) return <div>Loading session...</div>;
  if (!user) {
    router.push('/register');
    return null;
  }

  const filteredTutorials = tutorials.filter(tutorial => 
    filter === 'All' || tutorial.experienceLevel === filter
  );

  const experienceLevels = ['All', 'Rookie', 'Contender', 'Champion'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">All Tutorials</h1>

      <div className="flex space-x-2 mb-8 border-b border-gray-700 pb-4">
        {experienceLevels.map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              filter === level
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p>Loading tutorials...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((tutorial) => (
              <div key={tutorial._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <span 
                  className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-2 ${
                    tutorial.experienceLevel === 'Rookie' ? 'bg-green-500/20 text-green-400' :
                    tutorial.experienceLevel === 'Contender' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}
                >
                  {tutorial.experienceLevel}
                </span>
                <h3 className="text-lg font-bold text-white">{tutorial.title}</h3>
                <p className="text-gray-400 mt-2 text-sm">{tutorial.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-3">No tutorials found for this filter.</p>
          )}
        </div>
      )}
    </div>
  );
}