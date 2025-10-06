"use client";
import { motion } from "framer-motion";

export const ProgressBar = ({ value }) => {
  const percentage = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 w-full rounded-full bg-gray-700">
      <motion.div
        className="h-full rounded-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
};