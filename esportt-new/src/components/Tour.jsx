// src/components/Tour.jsx
'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./ui/button"; // Using ShadCN button

const tourSteps = [
  { id: "#logo-step", title: "Welcome to EsportTT", content: "This is your new home for competitive gaming." },
  { id: "#features-step", title: "Discover Features", content: "Find tournaments, track your progress with quests, and improve with tutorials." },
  { id: "#cta-step", title: "Join the Arena", content: "Ready to start? Create your account to join the competition." },
];

export default function Tour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const targetElement = document.querySelector(tourSteps[currentStep].id);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(); // Signal that the tour is finished
    }
  };

  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="fixed z-50 rounded-lg border border-white/20"
        animate={{
          top: position.top,
          left: position.left,
          width: position.width,
          height: position.height,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <motion.div
        className="fixed z-50 p-4 bg-neutral-900 rounded-lg border border-white/20 text-white w-72"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          top: position.top + position.height + 20,
          left: position.left + position.width / 2 - 144, // 144 is half of w-72
        }}
      >
        <h3 className="font-bold mb-2">{tourSteps[currentStep].title}</h3>
        <p className="text-sm text-neutral-300 mb-4">{tourSteps[currentStep].content}</p>
        <Button onClick={handleNext} className="w-full">
          {isLastStep ? "Finish" : "Next"}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}