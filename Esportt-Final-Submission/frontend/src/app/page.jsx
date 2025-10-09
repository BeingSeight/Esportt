"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandingCards } from "../components/ui/expanding-cards";
import BrowserMockup from "../components/BrowserMockup";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showMockup, setShowMockup] = useState(false);

  // This timer will set showMockup to true after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMockup(true);
    }, 8000); // 8000ms = 8 seconds

    // Clean up the timer if the user navigates away
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  if (user || loading) {
    return null;
  }

  const esporttCards = [

    {

      title: "Learn from Tutorials",

      description: "Improve your skills with expert guides.",

      image: "/learn.jpg",

    },

    {

      title: "Practice in Tournaments",

      description: "Compete for glory and prizes.",

      image: "/practice.jpg",

    },

    {

      title: "Level Up in Quests",

      description: "Complete challenges and earn rewards.",

      image: "/levelup.jpg",

    },

  ];

  return (
    <div className="relative h-screen w-full overflow-x-hidden flex items-center justify-center p-4">

      {/* Background Layer: Expanding Cards */}
      <div className="absolute inset-0 z-0">
        <ExpandingCards
          cards={esporttCards}
          height="h-full"
          gap="gap-2"
          classNames={{
            container: "rounded-none",
            card: "rounded-lg",
            title: "text-xl md:text-3xl font-extrabold tracking-wide",
            description: "font-medium text-gray-200",
          }}
          transitionDuration={0.5}
        />
      </div>

      {/* Foreground Layer: Browser Mockup (conditionally rendered) */}
      <AnimatePresence>
        {showMockup && (
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <BrowserMockup />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}