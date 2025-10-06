'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogImage,
  DialogClose,
  DialogDescription,
  DialogContainer,
} from '../../components/ui/linear-modal';

export default function TutorialsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tutorials, setTutorials] = useState([]);
  const [filter, setFilter] = useState('All');
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

  const experienceLevels = ['All', 'Bronze Tier', 'Silver Tier', 'Gold Tier'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Tutorial Library</h1>
      <p className="text-gray-400 mb-8">Browse tutorials to improve your skills. Click any card to watch the video.</p>

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
          {filteredTutorials.map((tutorial) => (
            <Dialog key={tutorial._id}>
              <DialogTrigger className="w-full text-left flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 hover:border-gray-500 transition-all">
                <DialogImage
                  src={`https://img.youtube.com/vi/${tutorial.youtubeVideoId}/maxresdefault.jpg`}
                  alt={tutorial.title}
                  className="h-40 w-full object-cover"
                />
                <div className="flex flex-grow flex-row items-end justify-between p-4">
                  <div>
                    {/* FIX 2: Truncate long titles on the card */}
                    <DialogTitle className="text-base font-bold text-white truncate">
                      {tutorial.title}
                    </DialogTitle>
                     <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        tutorial.experienceLevel === 'Bronze Tier' ? 'bg-green-500/20 text-green-400' :
                        tutorial.experienceLevel === 'Silver Tier' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                      {tutorial.experienceLevel}
                    </span>
                  </div>
                  <div className="p-2 bg-neutral-700 rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContainer>
                <DialogContent className="max-w-4xl p-0">
                  <div className="aspect-video w-full">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${tutorial.youtubeVideoId}`}
                      title={tutorial.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  {/* FIX 1: Add a background overlay for the text */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8">
                    <DialogTitle className="text-3xl font-bold text-white mb-2">
                      {tutorial.title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      {tutorial.description}
                    </DialogDescription>
                  </div>
                  <DialogClose />
                </DialogContent>
              </DialogContainer>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}