"use client";

import { useState, useEffect } from "react";
import { Check, ChevronUp, Trophy, DoorOpen, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ProgressBar } from "../../components/ui/progress-bar";

// Quest data is now defined directly in the component, no API needed.
const allQuests = {
  "Bronze Tier": [
    { id: "q1", title: "Complete 5 Tutorials", completed: true }, // Example: one is completed
    { id: "q2", title: "Join Your First Tournament", completed: false },
    { id: "q3", title: "Invite a Friend", completed: false },
  ],
  "Silver Tier": [
    { id: "q4", title: "Win a Tournament Match", completed: false },
    { id: "q5", title: "Complete 5 Tutorials in 3 Days", completed: false },
    { id: "q6", title: "Achieve a 3-Win Streak", completed: false },
  ],
  "Gold Tier": [
    { id: "q7", title: "Win a Full Tournament", completed: false },
    { id: "q8", title: "Mentor a Bronze Tier Player", completed: false },
    { id: "q9", title: "Complete All Tutorials", completed: false },
  ],
};

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [playerProfile, setPlayerProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // This useEffect is now simpler
    const fetchData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const profileRes = await fetch(`/api/profile?firebaseId=${user.uid}`);
          const profileData = await profileRes.json();

          if (profileData.success) {
            const profile = profileData.data;
            setPlayerProfile(profile);

            // Get quests directly from our local object
            const questsForLevel = allQuests[profile.experienceLevel] || [];
            setQuests(questsForLevel);
          }
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading) {
      if (!user) router.push('/login');
      else fetchData();
    }
  }, [user, authLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  // Calculate quest progress
  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const progressPercentage = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  if (authLoading || isLoading) {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-gray-900 border border-gray-700"
      >
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="relative w-12 h-12 mr-4">
              <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-blue-400">
                {playerProfile?.name ? playerProfile.name.charAt(0).toUpperCase() : ''}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-white">{playerProfile?.name}</h2>
              </div>
              <p className="text-gray-400 text-sm">{playerProfile?.email}</p>
            </div>
            <motion.button className="text-gray-400" onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronUp className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>

              {/* Quests Section */}
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-4">Quests for {playerProfile?.experienceLevel}</h3>
                <div className="space-y-4">
                    {quests.map(quest => (
                        <div key={quest.id} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${quest.completed ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                                {quest.completed ? <Check className="w-5 h-5 text-green-400" /> : <Trophy className="w-5 h-5 text-gray-400" />}
                            </div>
                            <span className={quest.completed ? 'text-gray-500 line-through' : 'text-white'}>{quest.title}</span>
                        </div>
                    ))}
                </div>
              </div>

              {/* Progress Bar Section */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-400">Promotion Progress</h3>
                    <span className="text-sm font-bold text-white">{completedQuests} / {totalQuests}</span>
                </div>
                <ProgressBar value={progressPercentage} />
                <p className="text-xs text-gray-500 mt-2">Complete all quests to be eligible for promotion to the next tier.</p>
              </div>

              {/* Sign Out Button */}
              <div className="p-4">
                <p className="text-xs text-gray-500 mt-2">Complete every tutorial to receive an email assessment. Pass the assessment to be eligible for promotion.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}