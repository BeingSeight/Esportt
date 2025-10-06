// src/components/BrowserMockup.jsx
'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./ui/button"; // Using ShadCN button

export default function BrowserMockup() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full max-w-4xl"
      >
        <div className="w-full bg-neutral-900/80 backdrop-blur-sm border border-white/10 rounded-t-lg flex items-center p-2 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <div className="flex-1 text-center text-sm text-neutral-400">EsportTT</div>
        </div>
        <div className="w-full bg-neutral-950/80 backdrop-blur-sm border-x border-b border-white/10 rounded-b-lg p-8 sm:p-16 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
            Your Arena Awaits
          </h1>
          <p className="text-neutral-300 max-w-xl mx-auto mb-8">
            The ultimate platform for competitive gaming. Create, compete, and conquer. Join tournaments, complete quests, and rise to the top.
          </p>
          <Link href="/register">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}