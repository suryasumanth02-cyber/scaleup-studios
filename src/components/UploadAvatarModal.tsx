import React, { useState, useRef } from 'react';
import { 
  Upload, 
  User, 
  Camera, 
  Sparkles, 
  Check, 
  X, 
  Mic, 
  Palette, 
  Volume2, 
  ShieldCheck 
} from 'lucide-react';
import { AvatarConfig } from '../types';
import confetti from 'canvas-confetti';

interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAvatar: (avatar: AvatarConfig) => void;
  defaultBusinessName?: string;
}

export const UploadAvatarModal: React.FC<UploadAvatarModalProps> = ({
  isOpen,
  onClose,
  onSaveAvatar,
  defaultBusinessName = 'Premier Sports Academy'
}) => {
  const [name, setName] = useState<string>('Team Director');
  const [title, setTitle] = useState<string>(`Official Presenter • ${defaultBusinessName}`);
  const [photoDataUrl, setPhotoDataUrl] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );
  const [voiceName, setVoiceName] = useState<string>('Natural Executive (US Male)');
  const [accent, setAccent] = useState<string>('Energetic Commercial');
  const [themeColor, setThemeColor] = useState<string>('#10b981');
  const [isPreviewSpeaking, setIsPreviewSpeaking] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTestVoice = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPreviewSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(`Hello! Welcome to ${defaultBusinessName}. I will be your official video presenter.`);
    utterance.rate = 1.05;
    utterance.onend = () => setIsPreviewSpeaking(false);
    utterance.onerror = () => setIsPreviewSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    const newAvatar: AvatarConfig = {
      id: `custom_${Date.now()}`,
      name: name.trim() || 'Custom Presenter',
      title: title.trim() || `Host • ${defaultBusinessName}`,
      nicheMatch: 'Custom Client Brand',
      avatarUrl: photoDataUrl,
      voiceName,
      accent,
      framing: 'bubble',
      bio: `Custom branded presenter created for ${defaultBusinessName} video ads.`,
      category: 'custom',
      avatarType: 'custom_client',
      themeColor,
      activeGesture: 'open_palms',
      gestureIntensity: 'expressive'
    };

    onSaveAvatar(newAvatar);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.3 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Glow Bar */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Upload Custom Presenter Photo
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  AI Face Voice-Sync
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Turn your own face or team photo into the official video spokesperson
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          
          {/* Top Row: Photo Upload & Live Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            
            {/* Live Animated Avatar Preview Bubble */}
            <div className="relative shrink-0">
              <div 
                className={`relative w-28 h-28 rounded-2xl overflow-hidden border-2 shadow-xl bg-slate-900 flex items-center justify-center transition-all ${
                  isPreviewSpeaking ? 'scale-105 shadow-emerald-500/30 ring-4 ring-emerald-500/30' : ''
                }`}
                style={{ borderColor: themeColor }}
              >
                <img
                  src={photoDataUrl}
                  alt="Custom Avatar Preview"
                  className="w-full h-full object-cover object-top"
                />

                {/* Pulse Ring when speaking */}
                {isPreviewSpeaking && (
                  <div className="absolute inset-0 border-2 border-emerald-400 animate-ping rounded-2xl pointer-events-none" />
                )}

                {/* Live Pill */}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[8px] font-bold text-white flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPreviewSpeaking ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`} />
                  <span>{isPreviewSpeaking ? 'SPEAKING' : 'READY'}</span>
                </div>
              </div>
            </div>

            {/* Upload Buttons */}
            <div className="flex-1 space-y-2.5 text-center sm:text-left">
              <div>
                <p className="text-xs font-bold text-white">Upload Headshot or Selfie</p>
                <p className="text-[11px] text-slate-400">Clear frontal face with good lighting works best</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Choose Image File
                </button>
                <button
                  type="button"
                  onClick={handleTestVoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  {isPreviewSpeaking ? 'Speaking...' : 'Test Voice'}
                </button>
              </div>
            </div>

          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Presenter Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Coach Marcus, Sarah Jenkins..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Professional Title / Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Head Athletic Director, Founder..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Voice Personality Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              AI Voice Profile
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: 'Natural Executive (US Male)', accent: 'Authoritative & Inspiring' },
                { name: 'British Athletic Coach (UK Male)', accent: 'Energetic Sports Cadence' },
                { name: 'Warm Commercial (US Female)', accent: 'Friendly & Persuasive' },
                { name: 'High-Energy Hype Voice', accent: 'Dynamic TikTok Promo' },
              ].map((v) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => {
                    setVoiceName(v.name);
                    setAccent(v.accent);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    voiceName === v.name
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="font-bold text-[11px] truncate text-white">{v.name}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{v.accent}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Color Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-teal-400" />
              Presenter Brand Border Color
            </label>
            <div className="flex items-center gap-3">
              {[
                { color: '#10b981', label: 'Emerald' },
                { color: '#06b6d4', label: 'Cyan' },
                { color: '#8b5cf6', label: 'Purple' },
                { color: '#f59e0b', label: 'Amber' },
                { color: '#ef4444', label: 'Crimson' },
                { color: '#3b82f6', label: 'Blue' }
              ].map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setThemeColor(c.color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                    themeColor === c.color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.color }}
                >
                  {themeColor === c.color && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            Set as Video Presenter
          </button>
        </div>

      </div>
    </div>
  );
};
