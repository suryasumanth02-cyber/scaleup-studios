import React from 'react';
import { AvatarGesture } from '../types';

interface AvatarGesturesProps {
  gesture: AvatarGesture;
  isPlaying: boolean;
  avatarId?: string;
  themeColor?: string;
}

// Adaptive skin tone mapping based on avatar identity
interface SkinPalette {
  base: string;
  shadow: string;
  highlight: string;
  sleeve: string;
}

const SKIN_PALETTES: Record<string, SkinPalette> = {
  coach_marcus: {
    base: '#c98a58',
    shadow: '#9e6235',
    highlight: '#dba272',
    sleeve: '#1e293b', // athletic polo dark slate
  },
  sarah_mitchell: {
    base: '#f5cbb4',
    shadow: '#c99a80',
    highlight: '#fae0d2',
    sleeve: '#0f172a', // navy executive blazer
  },
  alex_rivera: {
    base: '#d49b6a',
    shadow: '#a86e3f',
    highlight: '#e2b386',
    sleeve: '#334155', // casual charcoal tee
  },
  elena_rostova: {
    base: '#fce3d5',
    shadow: '#cca895',
    highlight: '#fff1e8',
    sleeve: '#831843', // deep rose burgundy
  },
  dr_vikram: {
    base: '#9e673f',
    shadow: '#72421f',
    highlight: '#b77e53',
    sleeve: '#1e1b4b', // midnight blue formal
  },
  custom_captain_clone: {
    base: '#c98a58',
    shadow: '#9e6235',
    highlight: '#dba272',
    sleeve: '#064e3b', // sports emerald green
  },
};

const DEFAULT_PALETTE: SkinPalette = {
  base: '#d49b6a',
  shadow: '#a86e3f',
  highlight: '#e2b386',
  sleeve: '#1e293b',
};

export const AvatarGestures: React.FC<AvatarGesturesProps> = ({
  gesture,
  isPlaying,
  avatarId = 'coach_marcus',
  themeColor = '#10b981',
}) => {
  const palette = SKIN_PALETTES[avatarId] || DEFAULT_PALETTE;

  // Render specific hand gesture based on type
  switch (gesture) {
    case 'open_palms':
      return (
        <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-20 flex justify-between px-2 sm:px-4 items-end overflow-hidden">
          {/* Left Hand: Open Palm Conversational Explaining */}
          <div 
            className={`w-28 h-36 origin-bottom-left transition-all duration-700 ${
              isPlaying 
                ? 'animate-[handSwayLeft_2.4s_ease-in-out_infinite] opacity-95 scale-100' 
                : 'opacity-70 scale-95 translate-y-3'
            }`}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
              {/* Sleeve / Forearm */}
              <path d="M10 120 L25 80 L55 85 L45 120 Z" fill={palette.sleeve} />
              
              {/* Wrist & Palm Base */}
              <ellipse cx="40" cy="75" rx="18" ry="12" fill={palette.shadow} transform="rotate(-15 40 75)" />
              <ellipse cx="42" cy="72" rx="17" ry="11" fill={palette.base} transform="rotate(-15 42 72)" />
              
              {/* Thumb extending outward */}
              <path d="M22 68 Q10 55 18 48 Q26 46 32 58 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Four Fingers open and relaxed facing camera */}
              {/* Index */}
              <path d="M34 60 Q34 32 40 30 Q46 32 44 60 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              {/* Middle */}
              <path d="M44 58 Q47 24 53 22 Q59 24 55 58 Z" fill={palette.highlight} stroke={palette.shadow} strokeWidth="1.2" />
              {/* Ring */}
              <path d="M54 60 Q59 30 65 30 Q69 34 64 62 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              {/* Pinky */}
              <path d="M64 65 Q70 42 76 44 Q79 48 72 70 Z" fill={palette.shadow} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Palm crease highlight */}
              <path d="M30 65 Q45 70 58 64" fill="none" stroke={palette.shadow} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>

          {/* Right Hand: Open Palm Mirror */}
          <div 
            className={`w-28 h-36 origin-bottom-right transition-all duration-700 ${
              isPlaying 
                ? 'animate-[handSwayRight_2.4s_ease-in-out_infinite] opacity-95 scale-100' 
                : 'opacity-70 scale-95 translate-y-3'
            }`}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
              {/* Sleeve */}
              <path d="M90 120 L75 80 L45 85 L55 120 Z" fill={palette.sleeve} />
              
              {/* Wrist & Palm Base */}
              <ellipse cx="60" cy="75" rx="18" ry="12" fill={palette.shadow} transform="rotate(15 60 75)" />
              <ellipse cx="58" cy="72" rx="17" ry="11" fill={palette.base} transform="rotate(15 58 72)" />
              
              {/* Thumb */}
              <path d="M78 68 Q90 55 82 48 Q74 46 68 58 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Four Fingers */}
              {/* Pinky */}
              <path d="M36 65 Q30 42 24 44 Q21 48 28 70 Z" fill={palette.shadow} stroke={palette.shadow} strokeWidth="1.2" />
              {/* Ring */}
              <path d="M46 60 Q41 30 35 30 Q31 34 36 62 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              {/* Middle */}
              <path d="M56 58 Q53 24 47 22 Q41 24 45 58 Z" fill={palette.highlight} stroke={palette.shadow} strokeWidth="1.2" />
              {/* Index */}
              <path d="M66 60 Q66 32 60 30 Q54 32 56 60 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Palm crease */}
              <path d="M70 65 Q55 70 42 64" fill="none" stroke={palette.shadow} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        </div>
      );

    case 'pointing_cta':
      return (
        <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-20 flex flex-col items-center justify-end overflow-hidden">
          {/* Hand Pointing Down Directly to Dynamic QR Code */}
          <div 
            className={`w-36 h-44 origin-bottom transition-all duration-500 ${
              isPlaying ? 'animate-[pointDown_1.8s_ease-in-out_infinite]' : 'translate-y-2'
            }`}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
              {/* Sleeve */}
              <path d="M25 120 L35 75 L65 75 L75 120 Z" fill={palette.sleeve} />
              
              {/* Hand Knuckles Base */}
              <rect x="35" y="45" width="30" height="30" rx="8" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Curled Fingers (Middle, Ring, Pinky) */}
              <path d="M35 52 Q30 58 35 64 Q42 64 42 52 Z" fill={palette.shadow} />
              <path d="M58 52 Q65 58 60 64 Q53 64 53 52 Z" fill={palette.shadow} />
              <ellipse cx="50" cy="58" rx="8" ry="6" fill={palette.shadow} />
              
              {/* Extended Index Finger Pointing Firmly Downward */}
              <path 
                d="M44 48 L44 10 Q44 2 50 2 Q56 2 56 10 L56 48 Z" 
                fill={palette.highlight} 
                stroke={palette.shadow} 
                strokeWidth="1.4"
                transform="rotate(180 50 25)"
              />
              {/* Fingernail */}
              <ellipse cx="50" cy="46" rx="3.5" ry="2" fill="#fff" opacity="0.4" />
            </svg>
          </div>

          {/* Animated Glow Target Pulse Ring targeting QR Outro */}
          <div className="relative -top-4 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full animate-ping opacity-60" style={{ backgroundColor: themeColor }} />
            <span className="absolute w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: themeColor }} />
          </div>
        </div>
      );

    case 'pointing_screen':
      return (
        <div className="absolute inset-y-0 right-0 w-36 pointer-events-none z-20 flex items-center justify-end overflow-hidden">
          {/* Hand Pointing Left at Headline/Captions */}
          <div 
            className={`w-32 h-36 origin-right transition-all duration-500 ${
              isPlaying ? 'animate-[pointLeft_2s_ease-in-out_infinite]' : 'translate-x-3'
            }`}
          >
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-2xl">
              {/* Forearm / Sleeve from right */}
              <path d="M120 25 L80 35 L80 65 L120 75 Z" fill={palette.sleeve} />
              
              {/* Hand Palm / Knuckles */}
              <rect x="45" y="35" width="35" height="30" rx="8" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Curled Thumb */}
              <path d="M55 35 Q50 25 42 30 Q40 38 48 40 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1" />
              
              {/* Extended Index Finger Pointing Left at Text */}
              <path d="M48 40 L10 40 Q4 40 4 45 Q4 50 10 50 L48 50 Z" fill={palette.highlight} stroke={palette.shadow} strokeWidth="1.4" />
              <ellipse cx="12" cy="45" rx="2" ry="3.5" fill="#fff" opacity="0.4" />
              
              {/* Curled Middle/Ring/Pinky */}
              <path d="M48 52 Q38 56 48 60 Q55 60 55 52 Z" fill={palette.shadow} />
              <path d="M48 60 Q38 64 48 68 Q55 68 55 60 Z" fill={palette.shadow} />
            </svg>
          </div>
        </div>
      );

    case 'thumbs_up':
      return (
        <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-20 flex justify-center items-end overflow-hidden">
          {/* Hand Giving Confident Thumbs Up */}
          <div 
            className={`w-32 h-40 origin-bottom transition-all duration-500 ${
              isPlaying ? 'animate-[thumbsBounce_2s_ease-in-out_infinite]' : ''
            }`}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
              {/* Sleeve */}
              <path d="M25 120 L35 78 L65 78 L75 120 Z" fill={palette.sleeve} />
              
              {/* Fist Base */}
              <rect x="35" y="50" width="32" height="30" rx="8" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Curled Fingers facing front */}
              <path d="M35 55 Q28 60 35 66 Q42 66 42 55 Z" fill={palette.shadow} stroke={palette.shadow} strokeWidth="1" />
              <path d="M35 66 Q28 72 35 78 Q42 78 42 66 Z" fill={palette.shadow} stroke={palette.shadow} strokeWidth="1" />
              
              {/* Raised Thumb (Upright and Confident) */}
              <path d="M52 56 Q50 20 56 16 Q64 16 62 48 L60 56 Z" fill={palette.highlight} stroke={palette.shadow} strokeWidth="1.4" />
              <ellipse cx="56" cy="22" rx="3.5" ry="2" fill="#fff" opacity="0.4" />
            </svg>
          </div>
        </div>
      );

    case 'precision_pinch':
      return (
        <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-20 flex justify-center items-end overflow-hidden">
          {/* Hand Forming Precision Pinch (Explaining key point) */}
          <div 
            className={`w-32 h-40 origin-bottom transition-all duration-500 ${
              isPlaying ? 'animate-[handPinch_2.2s_ease-in-out_infinite]' : ''
            }`}
          >
            <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
              {/* Sleeve */}
              <path d="M30 120 L40 82 L65 82 L75 120 Z" fill={palette.sleeve} />
              
              {/* Palm / Wrist */}
              <ellipse cx="52" cy="76" rx="16" ry="10" fill={palette.base} />
              
              {/* Thumb and Index Meeting in a Precision Pinch */}
              <path d="M40 70 Q38 46 48 38 Q52 38 52 46 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              <path d="M60 70 Q62 44 54 38 Q50 38 48 46 Z" fill={palette.highlight} stroke={palette.shadow} strokeWidth="1.2" />
              
              {/* Soft touch point between thumb and finger */}
              <circle cx="50" cy="40" r="3" fill="#fff" opacity="0.3" />
              
              {/* Other 3 fingers gracefully curved */}
              <path d="M62 60 Q72 50 70 44 Q65 44 58 55 Z" fill={palette.shadow} stroke={palette.shadow} strokeWidth="1" />
              <path d="M60 68 Q74 58 72 52 Q66 52 56 62 Z" fill={palette.shadow} stroke={palette.shadow} strokeWidth="1" />
            </svg>
          </div>
        </div>
      );

    case 'chest_heart':
      return (
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-20 flex justify-center items-end overflow-hidden">
          {/* Hand Over Heart (Sincerity & Dedication) */}
          <div 
            className={`w-36 h-36 origin-bottom transition-all duration-500 ${
              isPlaying ? 'animate-[heartPulse_2.5s_ease-in-out_infinite]' : ''
            }`}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
              {/* Forearm angled across chest */}
              <path d="M10 100 L35 70 L60 85 L25 100 Z" fill={palette.sleeve} />
              
              {/* Hand resting flat on chest */}
              <ellipse cx="55" cy="65" rx="16" ry="12" fill={palette.base} transform="rotate(-20 55 65)" />
              <path d="M45 60 Q55 35 62 35 Q66 38 58 60 Z" fill={palette.highlight} stroke={palette.shadow} strokeWidth="1.2" />
              <path d="M55 62 Q66 38 72 40 Q74 44 65 62 Z" fill={palette.base} stroke={palette.shadow} strokeWidth="1.2" />
              <path d="M62 65 Q74 46 78 48 Q80 52 70 66 Z" fill={palette.shadow} stroke={palette.shadow} strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      );

    default:
      return null;
  }
};
