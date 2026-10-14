import React, { useEffect, useRef, useState } from 'react';
import { AvatarConfig, Scene } from '../types';
import { Bot, Radio, UserCheck, ShieldCheck } from 'lucide-react';

interface AnimatedAvatarCanvasProps {
  avatar?: AvatarConfig;
  isPlaying: boolean;
  isSpeaking?: boolean;
  speechProgress?: number;
  speechRate?: number;
  framing: 'fullscreen' | 'bubble' | 'split';
  isQrScene?: boolean;
  currentScene?: Scene;
  sceneIndex?: number;
}

export const AnimatedAvatarCanvas: React.FC<AnimatedAvatarCanvasProps> = ({
  avatar,
  isPlaying,
  isSpeaking = false,
  speechProgress = 0,
  speechRate = 1.05,
  framing,
  isQrScene = false,
  currentScene,
  sceneIndex = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  // Smooth Video Controller:
  // When isPlaying is true -> video plays continuously and fluidly at broadcast quality
  // When isPlaying is false -> video pauses cleanly
  useEffect(() => {
    if (!videoRef.current) return;
    const vid = videoRef.current;

    // Ensure video is properly configured for web playback
    vid.muted = true;
    vid.playsInline = true;
    vid.loop = true;

    if (isPlaying) {
      vid.playbackRate = speechRate || 1.0;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video playback handled:', err);
        });
      }
    } else {
      vid.pause();
      if (sceneIndex === 0 && speechProgress === 0) {
        try {
          vid.currentTime = 0;
        } catch (_) {}
      }
    }
  }, [isPlaying, speechRate, avatar?.videoUrl, sceneIndex, speechProgress]);

  if (!avatar) return null;

  const themeColor = avatar.themeColor || '#10b981';
  const isHuman = avatar.category === 'human' || avatar.avatarType === 'human_presenter';
  const avatarUrl = avatar.avatarUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80';
  const videoSrc = avatar.videoUrl || '/videos/presenter_young_male.mp4';

  const isCustom = avatar.category === 'custom' || avatar.avatarType === 'custom_client';

  // === RENDER FOR CUSTOM CLIENT-UPLOADED FACE ===
  if (isCustom) {
    return (
      <div 
        className="relative w-full h-full rounded-2xl overflow-hidden border-2 shadow-2xl bg-slate-950 flex flex-col justify-between"
        style={{ borderColor: `${themeColor}` }}
      >
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src={avatarUrl}
            alt={avatar.name}
            className={`w-full h-full object-cover object-top transition-transform duration-300 ${
              isSpeaking ? 'scale-105' : 'scale-100'
            }`}
          />
          {/* Subtle talking pulse ring */}
          {isSpeaking && (
            <div 
              className="absolute inset-0 border-2 animate-ping rounded-2xl pointer-events-none opacity-40"
              style={{ borderColor: themeColor }}
            />
          )}

          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

          {/* Live Indicator Pill */}
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10">
            <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-[8px] font-bold text-white tracking-wider uppercase">
              {isSpeaking ? 'VOICE SYNC' : 'STANDBY'}
            </span>
          </div>

          {/* Presenter Nameplate & Equalizer */}
          <div className="absolute bottom-1 inset-x-1.5 flex items-center justify-between text-white">
            <div className="flex items-center gap-1 truncate">
              <span className="text-[10px] font-black truncate">{avatar.name}</span>
              <span className="text-[8px] bg-emerald-500/30 text-emerald-300 px-1 rounded font-mono">✓</span>
            </div>
            
            {/* Dynamic Equalizer Bars */}
            {isSpeaking ? (
              <div className="flex items-end gap-0.5 h-2.5 shrink-0">
                <span className="w-0.5 h-full rounded-full bg-emerald-400 animate-[bounce_0.6s_infinite]" />
                <span className="w-0.5 h-2/3 rounded-full bg-teal-300 animate-[bounce_0.4s_infinite]" />
                <span className="w-0.5 h-4/5 rounded-full bg-emerald-300 animate-[bounce_0.7s_infinite]" />
              </div>
            ) : isPlaying ? (
              <div className="flex items-end gap-0.5 h-2.5 shrink-0 opacity-40">
                <span className="w-0.5 h-1 rounded-full bg-slate-400" />
                <span className="w-0.5 h-1.5 rounded-full bg-slate-400" />
                <span className="w-0.5 h-1 rounded-full bg-slate-400" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // === RENDER FOR REAL DIRECT HUMAN PRESENTER ===
  if (isHuman) {
    // Bubble Framing Mode: Sleek Broadcast Studio Anchor (PIP)
    if (framing === 'bubble') {
      return (
        <div 
          className="relative w-full h-full rounded-2xl overflow-hidden border-2 shadow-2xl bg-slate-950 flex flex-col justify-between"
          style={{ borderColor: `${themeColor}90` }}
        >
          {/* Real Human Video with Synchronized Lips */}
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              muted
              loop
              preload="auto"
              onLoadedData={() => setIsVideoLoaded(true)}
              className="w-full h-full object-cover object-top"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20 pointer-events-none" />
            
            {/* Live Indicator Pill */}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10">
              <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-[8px] font-bold text-white tracking-wider uppercase">
                {isSpeaking ? 'LIP SYNC' : 'STANDBY'}
              </span>
            </div>

            {/* Presenter Nameplate & Waveform */}
            <div className="absolute bottom-1 inset-x-1.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-1 truncate">
                <span className="text-[10px] font-black truncate">{avatar.name}</span>
                <span className="text-[8px] bg-emerald-500/30 text-emerald-300 px-1 rounded font-mono">✓</span>
              </div>
              
              {/* Dynamic Equalizer Bars */}
              {isSpeaking ? (
                <div className="flex items-end gap-0.5 h-2.5 shrink-0">
                  <span className="w-0.5 h-full rounded-full bg-emerald-400 animate-[bounce_0.6s_infinite]" />
                  <span className="w-0.5 h-2/3 rounded-full bg-teal-300 animate-[bounce_0.4s_infinite]" />
                  <span className="w-0.5 h-4/5 rounded-full bg-emerald-300 animate-[bounce_0.7s_infinite]" />
                </div>
              ) : isPlaying ? (
                <div className="flex items-end gap-0.5 h-2.5 shrink-0 opacity-40">
                  <span className="w-0.5 h-1 rounded-full bg-slate-400" />
                  <span className="w-0.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="w-0.5 h-1 rounded-full bg-slate-400" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    // Full Screen & Split Screen Mode: Broadcast Studio Presenter
    return (
      <div className="relative w-full h-full overflow-hidden select-none bg-black">
        {/* Real Human Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          muted
          loop
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover object-center"
        />

        {/* Cinematic Studio Lighting Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40 pointer-events-none" />
        <div 
          className="absolute inset-0 mix-blend-color pointer-events-none opacity-10"
          style={{ backgroundColor: themeColor }}
        />

        {/* Broadcast Studio Presenter Lower-Third / Live Badge (Placed at top for clear caption readability) */}
        <div className="absolute top-16 left-3.5 z-30 flex flex-col items-start pointer-events-auto">
          <div 
            className="px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 border shadow-2xl"
            style={{
              backgroundColor: 'rgba(5, 10, 20, 0.85)',
              borderColor: `${themeColor}80`
            }}
          >
            <UserCheck className="w-3.5 h-3.5" style={{ color: themeColor }} />
            <span className="text-[11px] font-black text-white tracking-wide">{avatar.name}</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
              {isSpeaking ? 'ON AIR' : 'READY'}
            </span>
          </div>

          {/* Real-Time Speech Articulation Waveform */}
          {isPlaying && (
            <div className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] text-slate-300 font-mono shadow-md">
              <Radio className={`w-2.5 h-2.5 ${isSpeaking ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
              <span>{isSpeaking ? 'Speech Synced' : 'Ready'}</span>
              <div className="flex items-end gap-0.5 h-2.5">
                <span className={`w-0.5 rounded-full ${isSpeaking ? 'h-2 bg-emerald-400 animate-[pulse_0.4s_ease-in-out_infinite]' : 'h-1 bg-slate-600'}`} />
                <span className={`w-0.5 rounded-full ${isSpeaking ? 'h-2.5 bg-teal-300 animate-[pulse_0.3s_ease-in-out_infinite_0.1s]' : 'h-1 bg-slate-600'}`} />
                <span className={`w-0.5 rounded-full ${isSpeaking ? 'h-1.5 bg-emerald-400 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]' : 'h-1 bg-slate-600'}`} />
                <span className={`w-0.5 rounded-full ${isSpeaking ? 'h-2.5 bg-emerald-300 animate-[pulse_0.35s_ease-in-out_infinite_0.15s]' : 'h-1 bg-slate-600'}`} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === RENDER FOR 3D CHARACTER / VIRTUAL AVATARS ===
  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden ${
      framing === 'bubble' ? 'p-1' : 'p-4'
    }`}>
      {framing === 'fullscreen' && !isQrScene && (
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 opacity-40 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${themeColor} 0%, #030712 70%)`
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        </div>
      )}

      <div className={`relative z-10 flex flex-col items-center transition-transform duration-300 ${
        isSpeaking ? 'scale-105' : 'scale-100'
      }`}>
        <div 
          className={`relative rounded-3xl p-1 shadow-2xl transition-all ${
            framing === 'bubble' ? 'w-16 h-16 rounded-full' : 'w-48 sm:w-56 h-48 sm:h-56'
          }`}
          style={{
            boxShadow: `0 0 35px ${themeColor}40`,
            border: `3px solid ${themeColor}`
          }}
        >
          <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-slate-900 flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={avatar.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isSpeaking ? 'scale-110' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          </div>
        </div>

        {framing === 'fullscreen' && !isQrScene && (
          <div className="mt-4 flex flex-col items-center">
            <div 
              className="px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 border shadow-lg"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderColor: `${themeColor}60`
              }}
            >
              <Bot className="w-4 h-4" style={{ color: themeColor }} />
              <span className="text-xs font-black tracking-wide text-white">
                {avatar.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
