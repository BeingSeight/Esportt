'use client';

import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

const useDebounce = (callback, delay) => {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef();
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);
    const debouncedCallback = useCallback((...args) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);
    return debouncedCallback;
};

const useLinkPreview = () => {
    const [scope, animate] = useAnimate();
    const [preview, setPreview] = useState(null);

    const onMouseMove = (e, title, description, align) => {
        const link = e.currentTarget;
        const rect = link.getBoundingClientRect();

        const cardWidth = 256;
        const left = align === 'right' ? rect.right - cardWidth : rect.left;
        const top = rect.bottom + 10;

        setPreview({ title, description, left, top });

        if (scope.current) {
            animate(scope.current, { opacity: 1, scale: 1 }, { duration: 0.15, ease: "easeOut" });
        }
    };

    const onMouseLeave = useDebounce(async () => {
        if (scope.current) {
            await animate(scope.current, { opacity: 0, scale: 0.9 }, { duration: 0.15, ease: "easeIn" });
        }
        setPreview(null);
    }, 150);

    return { scope, onMouseMove, onMouseLeave, preview };
};

const LinkPreview = ({ children, title, description, align = 'left' }) => {
    const { scope, onMouseMove, onMouseLeave, preview } = useLinkPreview();

    return (
        <>
            <AnimatePresence>
                {preview && (
                    <motion.div
                        ref={scope}
                        className="pointer-events-none fixed z-[99] rounded-lg bg-neutral-900 ring-1 ring-white/10 p-4"
                        style={{
                            left: preview.left,
                            top: preview.top,
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                    >
                        <div className="w-64">
                            <h3 className="font-bold text-white mb-1">{preview.title}</h3>
                            <p className="text-sm text-neutral-400">{preview.description}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div onMouseMove={(e) => onMouseMove(e, title, description, align)} onMouseLeave={onMouseLeave}>
                {children}
            </div>
        </>
    );
};

export default LinkPreview;