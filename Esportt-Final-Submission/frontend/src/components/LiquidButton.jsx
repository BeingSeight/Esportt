'use client';
import React, { useState } from 'react';
import { Star, FileText } from 'lucide-react';
import { Liquid } from './liquid-gradient'; // Corrected Path

const COLORS = {
  color1: '#FFFFFF', color2: '#1E10C5', color3: '#9089E2',
  color4: '#FCFCFE', color5: '#F9F9FD', color6: '#B2B8E7',
  color7: '#0E2DCB', color8: '#0017E9', color9: '#4743EF',
  color10: '#7D7BF4', color11: '#0B06FC', color12: '#C5C1EA',
  color13: '#1403DE', color14: '#B6BAF6', color15: '#C1BEEB',
  color16: '#290ECB', color17: '#3F4CC0',
};

const LiquidButton = () => {
  const [isHoveredRepo, setIsHoveredRepo] = useState(false);
  const [isHoveredReport, setIsHoveredReport] = useState(false);

return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <a
            href="https://github.com/BeingSeight/Esportt"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            style={{ position: 'relative', display: 'inline-block', width: '10rem', height: '2.7em', backgroundColor: '#0f172a', border: '2px solid #3f3f46', borderRadius: '0.5rem' }}
        >
            <div style={{ position: 'absolute', width: '113%', height: '129%', top: '8.57%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(19px)', opacity: 0.7 }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '0.5rem' }}>
                    <Liquid isHovered={isHoveredRepo} colors={COLORS} />
                </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '0.5rem' }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '0.5rem', backgroundColor: 'black' }}></span>
                <Liquid isHovered={isHoveredRepo} colors={COLORS} />
            </div>
            <button
                style={{ position: 'absolute', inset: 0, borderRadius: '0.5rem', backgroundColor: 'transparent', cursor: 'pointer' }}
                aria-label="Repository"
                type="button"
                onMouseEnter={() => setIsHoveredRepo(true)}
                onMouseLeave={() => setIsHoveredRepo(false)}
            >
                <span className="flex items-center justify-center px-2 gap-2 text-white text-lg font-semibold tracking-wide whitespace-nowrap group-hover:text-yellow-400">
                    <Star className="inline-block w-5 h-5 flex-shrink-0 group-hover:fill-yellow-400" />
                    Repository
                </span>
            </button>
        </a>
        <a
            href="https://docs.google.com/document/d/11Z3u_nSxS61Lw9hCiN-hGDOhTkPSXt8d9sDq7Khqj7U/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            style={{ position: 'relative', display: 'inline-block', width: '10rem', height: '2.7em', backgroundColor: '#0f172a', border: '2px solid #3f3f46', borderRadius: '0.5rem' }}
        >
            <div style={{ position: 'absolute', width: '113%', height: '129%', top: '8.57%', left: '50%', transform: 'translateX(-50%)', filter: 'blur(19px)', opacity: 0.7 }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '0.5rem' }}>
                    <Liquid isHovered={isHoveredReport} colors={COLORS} />
                </div>
            </div>
            <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '0.5rem' }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '0.5rem', backgroundColor: 'black' }}></span>
                <Liquid isHovered={isHoveredReport} colors={COLORS} />
            </div>
            <button
                style={{ position: 'absolute', inset: 0, borderRadius: '0.5rem', backgroundColor: 'transparent', cursor: 'pointer' }}
                aria-label="Business Report"
                type="button"
                onMouseEnter={() => setIsHoveredReport(true)}
                onMouseLeave={() => setIsHoveredReport(false)}
            >
                <span className="flex items-center justify-center px-2 gap-2 text-white text-lg font-semibold tracking-wide whitespace-nowrap group-hover:text-green-400">
                    <FileText className="inline-block w-5 h-5 flex-shrink-0 group-hover:fill-green-400" />
                    Business
                </span>
            </button>
        </a>
    </div>
);
};

export default LiquidButton;