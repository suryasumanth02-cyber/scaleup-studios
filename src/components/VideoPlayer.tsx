import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share2, 
  QrCode as QrIcon,
  Bot,
  UserCheck,
  Radio,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Captions,
  CaptionsOff,
  Music,
  Download,
  Smartphone,
  Film
} from 'lucide-react';
import { Campaign } from '../types';
import { AnimatedAvatarCanvas } from './AnimatedAvatarCanvas';
import { bgmEngine, BGM_TRACKS, BgmTrackId } from '../utils/audioEngine';

interface VideoPlayerProps {
  campaign: Campaign;
  onScanDetected?: () => void;
  onToggleFraming?: (framing: 'fullscreen' | 'bubble' | 'split') => void;
  onOpenExport?: () => void;
  onOpenLandingPreview?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  campaign, 
  onScanDetected,
  onToggleFraming,
  onOpenExport,
  onOpenLandingPreview
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(3180);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Lip-Sync and Captions state
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechProgress, setSpeechProgress] = useState<number>(0);

  // Background Music (BGM) state
  const [bgmTrack, setBgmTrack] = useState<BgmTrackId>(
    campaign.niche === 'fitness' ? 'fitness_pulse' : campaign.niche === 'realestate' ? 'luxury_ambient' : 'sports_energy'
  );
  const [bgmVolume, setBgmVolume] = useState<number>(0.28);

  const timerRef = useRef<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scenes = campaign.scenes;
  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const isQrScene = currentScene.stage === 'Call to Action';
  const avatar = campaign.avatar;
  const framing = avatar?.framing || 'bubble';
  const themeColor = avatar?.themeColor || '#10b981';
  const isHuman = avatar?.category === 'human' || avatar?.avatarType === 'human_presenter';

  // Total duration of campaign
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  // Play natural voiceover for current scene with word-boundary Lip-Sync binding
  const playVoice = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isMuted) {
      // If muted, simulate speaking for active scene duration so mouth moves in sync
      setIsSpeaking(true);
      setSpeechProgress(0);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    
    if (avatar?.avatarType === 'cyber_bot') {
      utterance.pitch = 0.85;
    } else if (avatar?.avatarType === '3d_mascot') {
      utterance.pitch = 1.15;
    } else {
      utterance.pitch = 1.0;
    }
    
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Daniel'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    // Precise Lip-Sync hooks:
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeechProgress(0);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const frac = Math.min(1, Math.max(0, e.charIndex / (text.length || 1)));
        setSpeechProgress(frac);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeechProgress(1);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    speechRef.current = utterance;
  };

  // Dynamic Voice Ducking: Auto-ducks BGM when speech is active, smoothly raises BGM on silence
  useEffect(() => {
    bgmEngine.setVoiceDucking(isSpeaking);
  }, [isSpeaking]);

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsSpeaking(false);
      bgmEngine.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsPlaying(true);
      if (!isMuted && bgmTrack !== 'none') {
        bgmEngine.start(bgmTrack);
      }
      playVoice(currentScene.voiceText);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsSpeaking(false);
    setSpeechProgress(0);
    bgmEngine.stop();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentSceneIndex(0);
    setSceneProgress(0);
  };

  const handleChangeTrack = (trackId: BgmTrackId) => {
    setBgmTrack(trackId);
    bgmEngine.setTrack(trackId);
  };

  // Main playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalStepMs = 50;
    const currentSceneDurationMs = (currentScene.duration || 5) * 1000;

    timerRef.current = window.setInterval(() => {
      setSceneProgress(prev => {
        const next = prev + (intervalStepMs / currentSceneDurationMs);

        // If muted, manage isSpeaking state based on scene progress
        if (isMuted) {
          setIsSpeaking(next < 0.88);
          setSpeechProgress(next);
        }

        if (next >= 1) {
          if (currentSceneIndex < scenes.length - 1) {
            const nextIdx = currentSceneIndex + 1;
            setCurrentSceneIndex(nextIdx);
            playVoice(scenes[nextIdx].voiceText);
            return 0;
          } else {
            setIsPlaying(false);
            setIsSpeaking(false);
            bgmEngine.stop();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            return 1;
          }
        }
        return next;
      });
    }, intervalStepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSceneIndex, scenes, isMuted, avatar, bgmTrack]);

  // Clean up speech and BGM on unmount
  useEffect(() => {
    return () => {
      bgmEngine.stop();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Split caption for Alex Hormozi kinetic word-by-word highlight
  const words = (currentScene.caption || '').split(' ');
  // Use speechProgress (if audio speaking) or sceneProgress as fallback
  const effectiveProgress = isSpeaking && speechProgress > 0 ? speechProgress : sceneProgress;
  const activeWordIdx = Math.min(words.length - 1, Math.floor(effectiveProgress * words.length));

  return (
    <div className="flex flex-col items-center select-none">
      
      {/* 9:16 Smartphone Frame */}
      <div className="relative w-[340px] sm:w-[375px] h-[670px] bg-slate-950 rounded-[48px] p-3 shadow-2xl shadow-emerald-500/10 border-4 border-slate-700/80 ring-1 ring-slate-800 overflow-hidden">
        
        {/* Dynamic Island Speaker Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 ml-auto mr-3"></div>
        </div>

        {/* Video Canvas Container (9:16 Inner Screen) */}
        <div 
          onClick={togglePlay}
          className="relative w-full h-full rounded-[38px] overflow-hidden cursor-pointer bg-slate-950 flex flex-col justify-between p-4 transition-all duration-700"
        >
          
          {/* ========================================================================= */}
          {/* LAYER 1: CINEMATIC B-ROLL BACKGROUND (FULL-BLEED 9:16 HIGH DEFINITION)    */}
          {/* ========================================================================= */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
            {/* If fullscreen presenter mode is chosen for human avatar */}
            {framing === 'fullscreen' && !isQrScene ? (
              <AnimatedAvatarCanvas
                avatar={avatar}
                isPlaying={isPlaying}
                isSpeaking={isSpeaking}
                speechProgress={speechProgress}
                speechRate={1.05}
                framing="fullscreen"
                isQrScene={isQrScene}
                currentScene={currentScene}
                sceneIndex={currentSceneIndex}
              />
            ) : framing === 'split' && !isQrScene ? (
              <div className="w-full h-full flex flex-col">
                {/* Top Half: Presenter Studio */}
                <div className="h-[50%] w-full relative overflow-hidden bg-slate-900 border-b border-white/10">
                  <AnimatedAvatarCanvas
                    avatar={avatar}
                    isPlaying={isPlaying}
                    isSpeaking={isSpeaking}
                    speechProgress={speechProgress}
                    speechRate={1.05}
                    framing="split"
                    currentScene={currentScene}
                    sceneIndex={currentSceneIndex}
                  />
                </div>
                {/* Bottom Half: Full Action B-Roll */}
                <div className="h-[50%] w-full relative overflow-hidden">
                  {currentScene.mediaUrl ? (
                    <img 
                      src={currentScene.mediaUrl} 
                      alt="" 
                      className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-out ${
                        isPlaying ? 'scale-110' : 'scale-100'
                      }`}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-b ${currentScene.bgGradient}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              /* Studio Anchor PIP Mode (Default & Most Realistic): Full B-Roll Canvas */
              <div className="relative w-full h-full">
                {currentScene.mediaUrl ? (
                  <img 
                    src={currentScene.mediaUrl} 
                    alt={currentScene.visualDescription}
                    className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
                      isPlaying ? 'scale-110 translate-y-[-2%]' : 'scale-100'
                    }`}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-b ${currentScene.bgGradient}`} />
                )}
                {/* High-End Commercial Lighting Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/60 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* LAYER 2: REELS PROGRESS BARS (1 PER SCENE)                                */}
          {/* ========================================================================= */}
          <div className="relative z-30 pt-6 flex items-center gap-1.5 w-full">
            {scenes.map((s, idx) => {
              let fillPercent = 0;
              if (idx < currentSceneIndex) fillPercent = 100;
              else if (idx === currentSceneIndex) fillPercent = Math.min(100, Math.floor(sceneProgress * 100));

              return (
                <div key={s.id} className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* LAYER 3: TOP BROADCAST BRANDING, STAGE PILL & CAPTION QUICK TOGGLE        */}
          {/* ========================================================================= */}
          <div className="relative z-30 flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 shadow-lg">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></span>
              <span className="text-[11px] font-bold text-white tracking-wide">
                {campaign.businessName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* On-Screen CC Quick Toggle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCaptions(!showCaptions);
                }}
                title={showCaptions ? 'Turn OFF Captions' : 'Turn ON Captions'}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md border text-[10px] font-bold transition-all shadow-md ${
                  showCaptions
                    ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300'
                    : 'bg-black/70 border-white/15 text-slate-400 hover:text-white'
                }`}
              >
                {showCaptions ? (
                  <Captions className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <CaptionsOff className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>CC</span>
              </button>

              {/* Speaking / Lip-Sync Status Pill */}
              {isPlaying ? (
                <div 
                  className="flex items-center gap-1.5 backdrop-blur-md px-3 py-1 rounded-full border text-[10px] font-bold shadow-lg"
                  style={{
                    backgroundColor: 'rgba(5, 10, 20, 0.85)',
                    borderColor: `${themeColor}70`,
                    color: themeColor
                  }}
                >
                  {isHuman ? <UserCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Lip Sync Active' : 'Standby'}</span>
                  <div className="flex items-end gap-0.5 h-2.5 ml-1">
                    <span className={`w-0.5 rounded-full ${isSpeaking ? 'h-full bg-emerald-400 animate-[bounce_0.6s_infinite]' : 'h-1 bg-slate-500'}`} />
                    <span className={`w-0.5 rounded-full ${isSpeaking ? 'h-2/3 bg-teal-300 animate-[bounce_0.4s_infinite]' : 'h-1.5 bg-slate-500'}`} />
                    <span className={`w-0.5 rounded-full ${isSpeaking ? 'h-4/5 bg-emerald-300 animate-[bounce_0.8s_infinite]' : 'h-1 bg-slate-500'}`} />
                  </div>
                </div>
              ) : (
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  {currentScene.stage}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LAYER 4: CENTER STAGE - DYNAMIC QR ATTRIBUTION OUTRO (SCENE 5)            */}
          {/* ========================================================================= */}
          <div className="relative z-30 flex-1 flex flex-col items-center justify-center text-center px-2 py-4">
            {isQrScene ? (
              <div className="w-full flex flex-col items-center animate-fade-in">
                
                {/* Presenter Callout Header */}
                <div 
                  className="mb-3 flex items-center gap-2 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border shadow-xl"
                  style={{ borderColor: `${themeColor}80` }}
                >
                  <img src={avatar?.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover border" style={{ borderColor: themeColor }} />
                  <span className="text-[11px] font-black text-white">
                    {avatar?.name}: "Scan to claim your trial!"
                  </span>
                </div>

                {/* Scannable Dynamic QR Card */}
                <div 
                  className="relative p-3 bg-white rounded-2xl shadow-2xl border-4"
                  style={{ borderColor: themeColor }}
                >
                  {campaign.qrCodeUrl ? (
                    <img 
                      src={campaign.qrCodeUrl} 
                      alt="Dynamic Tracking QR Code" 
                      className="w-40 h-40 object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-slate-900 flex items-center justify-center text-slate-400">
                      <QrIcon className="w-16 h-16 animate-spin" />
                    </div>
                  )}
                  {/* Point Phone Camera Outro Ribbon */}
                  <div 
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: themeColor }}
                  >
                    Point Phone Camera
                  </div>
                </div>

                {/* Offer & Attribution Metadata */}
                <div className="mt-5 text-center px-2">
                  <p className="text-[11px] uppercase tracking-widest font-black mb-1" style={{ color: themeColor }}>
                    Exclusive Limited-Time Offer
                  </p>
                  <p className="text-sm font-extrabold text-white leading-tight drop-shadow-md">
                    {campaign.offer}
                  </p>
                  <div className="mt-2.5 flex items-center justify-center gap-2">
                    <span className="text-[9px] text-slate-300 font-mono bg-black/80 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      30-Day Attribution Active
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* ========================================================================= */}
          {/* LAYER 5: BROADCAST STUDIO ANCHOR (PIP) - PRESENTED WHEN IN ANCHOR MODE     */}
          {/* ========================================================================= */}
          {framing === 'bubble' && !isQrScene && (
            <div className="absolute left-3 bottom-24 z-30 w-32 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/25 bg-black/90 backdrop-blur-md animate-fade-in group">
              <AnimatedAvatarCanvas
                avatar={avatar}
                isPlaying={isPlaying}
                isSpeaking={isSpeaking}
                speechProgress={speechProgress}
                speechRate={1.05}
                framing="bubble"
                currentScene={currentScene}
                sceneIndex={currentSceneIndex}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYER 6: ALEX HORMOZI / CAPCUT KINETIC KARAOKE SUBTITLES (TOGGLEABLE)     */}
          {/* ========================================================================= */}
          {showCaptions && (
            <div className="relative z-30 mb-8 px-2 text-center transition-all duration-300 animate-fade-in">
              <div className="inline-block bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 shadow-2xl max-w-full">
                <p className="text-base sm:text-lg font-black tracking-tight leading-snug uppercase flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                  {words.map((word, wIdx) => {
                    const isActive = isPlaying && isSpeaking && wIdx === activeWordIdx;
                    const isPast = isPlaying && wIdx < activeWordIdx;

                    if (isActive) {
                      return (
                        <span 
                          key={wIdx}
                          className="inline-block bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-md shadow-xl scale-110 -rotate-1 border border-amber-300 transition-all duration-75"
                        >
                          {word}
                        </span>
                      );
                    }

                    return (
                      <span 
                        key={wIdx}
                        className={`transition-colors duration-150 ${
                          isPast 
                            ? 'text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]' 
                            : 'text-white/60 font-extrabold'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LAYER 7: RIGHT SOCIAL FLOATING INTERACTION BAR (TIKTOK/REELS FORMAT)       */}
          {/* ========================================================================= */}
          <div className="absolute right-3 bottom-20 z-40 flex flex-col items-center gap-4">
            {/* Like Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
                setLikes(prev => isLiked ? prev - 1 : prev + 1);
              }}
              className="flex flex-col items-center group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-black/60 text-white group-hover:scale-110'}`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow mt-1">
                {likes.toLocaleString()}
              </span>
            </button>

            {/* Comments */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow mt-1">
                128
              </span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow mt-1">
                Share
              </span>
            </div>

            {/* Spinning Brand Vinyl Disc */}
            <div 
              className="w-9 h-9 rounded-full overflow-hidden border-2 animate-[spin_6s_linear_infinite] mt-1 shadow-lg"
              style={{ borderColor: themeColor }}
            >
              <img src={avatar?.avatarUrl} alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LAYER 8: BOTTOM HANDLE & AUDIO METADATA                                   */}
          {/* ========================================================================= */}
          <div className="relative z-30 flex items-center justify-between text-xs text-white/90">
            <div>
              <p className="font-extrabold text-white text-xs drop-shadow flex items-center gap-1">
                @{campaign.businessName.toLowerCase().replace(/\s+/g, '')}
                <span className="text-[9px] bg-blue-500 text-white rounded-full px-1">✓</span>
              </p>
              <p className="text-[10px] text-slate-300 drop-shadow flex items-center gap-1 mt-0.5">
                🎙️ {avatar?.name} • Lip-Synced Audio
              </p>
            </div>
          </div>

          {/* Paused Overlay Play Button */}
          {!isPlaying && (
            <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
              <div 
                className="w-16 h-16 rounded-full text-slate-950 flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
                style={{ backgroundColor: themeColor }}
              >
                <Play className="w-8 h-8 fill-slate-950 ml-1" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* EXTERNAL BROADCAST PLAYER CONTROLS                                        */}
      {/* ========================================================================= */}
      <div className="mt-4 flex flex-col items-center gap-2.5">
        
        {/* Main Controls: Play, Reset, Audio, Captions Toggle, Scene Counter */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 shadow-md">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-slate-950 text-xs font-black transition-colors"
            style={{ backgroundColor: themeColor }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-slate-950" /> Pause Video
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Play Video
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Restart video from Scene 1"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Mute / Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute voiceover' : 'Mute voiceover'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Captions Toggle Button (Requested by user) */}
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            title={showCaptions ? 'Turn off captions' : 'Turn on captions'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              showCaptions
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showCaptions ? (
              <Captions className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <CaptionsOff className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{showCaptions ? 'Captions: ON' : 'Captions: OFF'}</span>
          </button>

          <div className="text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-3">
            Scene <span className="text-white font-bold">{currentSceneIndex + 1}</span> of {scenes.length} ({totalDuration}s)
          </div>
        </div>

        {/* Framing Selector & Lip-Sync Telemetry Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {onToggleFraming && (
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px]">
              <span className="text-slate-400 px-2 font-semibold">Presenter Layout:</span>
              <button
                onClick={() => onToggleFraming('bubble')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  framing === 'bubble' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                🎬 Studio Anchor (PIP)
              </button>
              <button
                onClick={() => onToggleFraming('fullscreen')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  framing === 'fullscreen' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Full Screen Presenter
              </button>
              <button
                onClick={() => onToggleFraming('split')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  framing === 'split' ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Split Screen Action
              </button>
            </div>
          )}

          {/* Real-Time Lip-Sync Telemetry Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-slate-300 font-bold">Lip Sync:</span>
            <span className={isSpeaking ? 'text-emerald-400' : 'text-slate-500'}>
              {isSpeaking ? 'Locked with Speech' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Row: BGM Controls, Dynamic Voice Ducking & Action Triggers */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-slate-800/60">
          {/* BGM Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-semibold">BGM:</span>
            <select
              value={bgmTrack}
              onChange={(e) => handleChangeTrack(e.target.value as BgmTrackId)}
              className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
            >
              {BGM_TRACKS.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.icon} {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Ducking Telemetry Badge */}
          {bgmTrack !== 'none' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-slate-400">Ducking:</span>
              <span className={isSpeaking ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                {isSpeaking ? 'Active (-18dB)' : 'Normal'}
              </span>
            </div>
          )}

          {/* 1-Click Export MP4 Button */}
          {onOpenExport && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-[11px] font-bold shadow-md shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              title="Download 9:16 Video Reel (MP4)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4</span>
            </button>
          )}

          {/* Preview Mobile Landing Page Button */}
          {onOpenLandingPreview && (
            <button
              onClick={onOpenLandingPreview}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold border border-slate-700 transition-all"
              title="View Client Mobile Landing Page"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Landing Page</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
