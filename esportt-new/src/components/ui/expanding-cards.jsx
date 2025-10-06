"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export const ExpandingCards = ({
  cards,
  height = "h-[450px]",
  gap = "gap-5",
  transitionDuration = 0.4,
  classNames,
}) => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prevActive) => (prevActive + 1) % cards.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, [cards.length]);

  return (
    <div className={cn("w-full", height)}>
      <div className={cn("flex w-full h-full", gap)}>
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={cn(
              "relative h-full overflow-hidden rounded-lg", // Changed to rounded-lg
              classNames?.card,
            )}
            animate={{
              flexGrow: activeCard === index ? 2.5 : 1,
            }}
            transition={{
              duration: transitionDuration,
              ease: "easeInOut",
            }}
          >
            {/* ... rest of the component is the same ... */}
            <motion.div
              className="absolute inset-0 h-full w-full"
              initial={{ scale: 1.2, opacity: 0.8 }}
              animate={{
                scale: activeCard === index ? 1 : 1.2,
                opacity: activeCard === index ? 1 : 0.8,
              }}
              transition={{
                duration: transitionDuration,
                ease: "easeInOut",
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-end gap-3">
              <AnimatePresence>
                {activeCard === index && (
                  <motion.div
                    className={cn("flex items-center justify-center p-2 rounded-full bg-black/40", classNames?.button)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: transitionDuration / 2, ease: "easeOut" }}
                  >
                    <ArrowRight className={cn("h-5 w-5 text-white", classNames?.buttonIcon)} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <motion.p
                  className={cn("text-sm text-gray-200", classNames?.description)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: activeCard === index ? 0 : 20, opacity: activeCard === index ? 1 : 0 }}
                  transition={{ duration: transitionDuration, ease: "easeOut" }}
                >
                  {card.description}
                </motion.p>
                <motion.h2
                  className={cn("text-2xl font-extrabold tracking-wide text-white", classNames?.title)}
                >
                  {card.title}
                </motion.h2>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};