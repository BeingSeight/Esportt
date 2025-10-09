'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Plus, Loader2, Info } from 'lucide-react';
import styles from './Home.module.css';
import { TextBlurReveal } from '../../components/ui/text-blur-reveal';
import { NpsSurveyForm } from '../../components/NpsSurveyForm';

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

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [playerProfile, setPlayerProfile] = useState(null);
  const [recommendedTutorials, setRecommendedTutorials] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        console.log('🔍 Fetching data for user:', user.uid);
        try {
          const [profileRes, tutorialsRes, tournamentsRes] = await Promise.all([
            fetch(`/api/profile?firebaseId=${user.uid}`),
            fetch('/api/tutorials'),
            fetch('/api/tournaments'),
          ]);

          const profileData = await profileRes.json();
          const tutorialsData = await tutorialsRes.json();
          const tournamentsData = await tournamentsRes.json();

          console.log('📊 API responses:', {
            profile: profileData.success,
            tutorials: tutorialsData.success,
            tournaments: tournamentsData.success
          });

          if (profileData.success) {
            setPlayerProfile(profileData.data);
            const userExperienceLevel = profileData.data.experienceLevel;

            // Filter tutorials for the user's level
            if (tutorialsData.success) {
              const recommended = tutorialsData.data.filter(t => t.experienceLevel === userExperienceLevel).slice(0, 5);
              setRecommendedTutorials(recommended);
            }

            // ✅ THIS IS THE FIX: Filter tournaments for the user's level
            if (tournamentsData.success) {
              const filteredTournaments = tournamentsData.data.filter(t => t.experienceLevel === userExperienceLevel);
              setTournaments(filteredTournaments);
            }
          } else {
            console.log('❌ Profile not found for user:', user.uid);
            console.log('🔧 User needs to complete registration');
            // Redirect to registration if profile not found
            router.push('/register');
            return;
          }

          // If we have tutorials but no user profile, show all tutorials
          if (tutorialsData.success && !profileData.success) {
            setRecommendedTutorials(tutorialsData.data.slice(0, 5));
          }

          // If we have tournaments but no user profile, show all tournaments  
          if (tournamentsData.success && !profileData.success) {
            setTournaments(tournamentsData.data);
          }

        } catch (error) {
          console.error("Failed to fetch page data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading) {
      if (!user) router.push('/register');
      else fetchData();
    }
  }, [user, authLoading, router]);

  if (authLoading || !playerProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const loopedTutorials = recommendedTutorials.length > 0 ? [...recommendedTutorials, ...recommendedTutorials] : [];
  const loopedTournaments = tournaments.length > 0 ? [...tournaments, ...tournaments] : [];

  const renderCard = (item, type) => (
    <Dialog>
      <DialogTrigger className="w-full text-left flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 hover:border-gray-500 transition-all h-full">
        <DialogImage
          src={item.imageUrl || `https://img.youtube.com/vi/${item.youtubeVideoId}/maxresdefault.jpg`}
          alt={item.title}
          className="h-40 w-full object-cover"
        />
        <div className="flex flex-grow flex-col justify-end p-4">
          <DialogTitle className="text-base font-bold text-white line-clamp-2">{item.title}</DialogTitle>
          <div className="flex justify-end mt-2">
            <div className="p-2 bg-neutral-700 rounded-lg"><Plus className="w-4 h-4 text-white" /></div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContainer>
        <DialogContent className="max-w-4xl p-0">
          {item.youtubeVideoId ? (
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
          ) : (
            <DialogImage
              src={item.imageUrl}
              alt={item.title}
              className="max-h-[70vh] w-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8">
            <DialogTitle className="text-3xl font-bold text-white mb-2">{item.title}</DialogTitle>
            <DialogDescription className="text-gray-300">{item.description}</DialogDescription>
            {type === 'tournament' && (
              <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 rounded-lg flex items-start gap-3 text-yellow-300 text-sm">
                <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>You must complete your tier's tutorials and quests for this month to be eligible to join this tournament.</span>
              </div>
            )}
          </div>
          <DialogClose />
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );

  return (
    <div className="space-y-16">
      <div className="relative border border-gray-700 rounded-xl p-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/banner.jpg')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-gray-800/50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome, {playerProfile?.name || user.email}!</h1>
          <p className="text-gray-300">Your journey continues here. Explore tutorials, join tournaments, and complete quests.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recommended Tutorials ({playerProfile?.experienceLevel})</h2>
          <Link href="/tutorials" className="text-sm text-blue-400 hover:underline">View All</Link>
        </div>
        {isLoading ? <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading...</span></div> :
          loopedTutorials.length > 0 ? (
            <div className={styles.marqueeContainer}>
              <div className={styles.marqueeContent}>
                {loopedTutorials.map((item, index) => (
                  <div key={`${item._id}-tut-${index}`} className={styles.cardWrapper}>
                    {renderCard(item, 'tutorial')}
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-400">No recommendations found for your '{playerProfile?.experienceLevel}' level yet.</p>}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Tier's Tournaments</h2>
          <Link href="/tournaments" className="text-sm text-blue-400 hover:underline">View All</Link>
        </div>
        {isLoading ? <div className="flex items-center gap-2 text-gray-400"><Loader2 className="h-4 w-4 animate-spin" /><span>Loading...</span></div> :
          loopedTournaments.length > 0 ? (
            <div className={styles.marqueeContainer}>
              <div className={styles.marqueeContent} style={{ animationDuration: '60s' }}>
                {loopedTournaments.map((item, index) => (
                  <div key={`${item._id}-tourn-${index}`} className={styles.cardWrapper}>
                    {renderCard(item, 'tournament')}
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-gray-400">No tournaments found for your '{playerProfile?.experienceLevel}' tier.</p>}
      </div>

      {/* 5. NPS SURVEY SECTION */}
      <div className="py-16">
        <NpsSurveyForm userId={user.uid} />
      </div>

      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-8">What's Next?</h2>
        <TextBlurReveal text="Player Quests Advanced Profiles Leaderboards And Much More Are Coming Soon" />
      </div>
    </div>
  );
}