import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Layers, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  QrCode, 
  ArrowRight,
  Flame,
  Zap,
  HelpCircle,
  Key,
  Bot,
  UserCheck,
  User,
  Video,
  Mic,
  Upload,
  Check,
  Camera,
  Film,
  Download,
  Smartphone
} from 'lucide-react';
import { Campaign, NicheType, Scene, AvatarConfig, AvatarGesture } from '../types';
import { PRESETS, NICHE_KEYS } from '../data/presets';
import { AVATARS, HUMAN_AVATARS, VIRTUAL_AVATARS } from '../data/avatars';
import { VideoPlayer } from './VideoPlayer';
import { generateQrCodeDataUrl, buildTrackingUrl } from '../utils/tracking';
import { 
  rewriteSceneContent, 
  generateHookOptions, 
  generateFullStoryboardFromPrompt,
  AI_STYLE_PRESETS 
} from '../utils/aiService';
import { AiKeyModal } from './AiKeyModal';
import { UploadAvatarModal } from './UploadAvatarModal';
import { ExportVideoModal } from './ExportVideoModal';
import { LandingPageModal } from './LandingPageModal';
import confetti from 'canvas-confetti';

interface VideoStudioProps {
  campaign: Campaign;
  setCampaign: React.Dispatch<React.SetStateAction<Campaign>>;
  onGoToPublisher: () => void;
  onSimulateScan: () => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  campaign,
  setCampaign,
  onGoToPublisher,
  onSimulateScan,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeSceneTab, setActiveSceneTab] = useState<number>(0);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Avatar states
  const [avatarTab, setAvatarTab] = useState<'human' | 'virtual' | 'custom'>('human');
  const [showCloneModal, setShowCloneModal] = useState<boolean>(false);
  const [cloneCaptainName, setCloneCaptainName] = useState<string>('Sports Team Captain');
  const [isCloning, setIsCloning] = useState<boolean>(false);
  const [customAvatars, setCustomAvatars] = useState<AvatarConfig[]>(() => {
    const saved = localStorage.getItem('scaleup_custom_avatars');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return [];
  });
  const [isUploadAvatarModalOpen, setIsUploadAvatarModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isLandingModalOpen, setIsLandingModalOpen] = useState<boolean>(false);

  // AI Prompt & Co-Pilot States
  const [customScenePrompt, setCustomScenePrompt] = useState<string>('');
  const [isSceneGenerating, setIsSceneGenerating] = useState<boolean>(false);
  const [fullStoryboardPrompt, setFullStoryboardPrompt] = useState<string>('');
  const [isFullGenerating, setIsFullGenerating] = useState<boolean>(false);
  const [showHookModal, setShowHookModal] = useState<boolean>(false);
  const [hookOptions, setHookOptions] = useState<Array<{ title: string; caption: string; voiceText: string; type: string }>>([]);
  const [isLoadingHooks, setIsLoadingHooks] = useState<boolean>(false);
  
  // Gemini API Key management
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('scaleup_gemini_key') || '';
  });

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('scaleup_gemini_key', key);
    setSuccessBanner(key ? 'Custom Gemini API Key activated!' : 'Switched to Built-in AI Engine mode.');
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  // Switch Niche Template
  const handleNicheChange = async (nicheKey: NicheType) => {
    const preset = PRESETS[nicheKey];
    if (!preset) return;

    const campaignId = `cam_${nicheKey}_${Date.now().toString(36)}`;
    const trackingLink = buildTrackingUrl(preset.defaultDestination, campaignId, 'instagram');
    const qrDataUrl = await generateQrCodeDataUrl(trackingLink);

    // Auto-pair best matching avatar
    let bestAvatar = AVATARS[0];
    if (nicheKey === 'sports' || nicheKey === 'cricket' || nicheKey === 'fitness') bestAvatar = AVATARS[0]; // Coach Marcus
    else if (nicheKey === 'realestate' || nicheKey === 'services') bestAvatar = AVATARS[1]; // Sarah Mitchell
    else if (nicheKey === 'ecommerce') bestAvatar = AVATARS[2]; // Alex Rivera
    else if (nicheKey === 'restaurant') bestAvatar = AVATARS[3]; // Elena

    setCampaign({
      id: campaignId,
      businessName: preset.defaultBusiness,
      niche: nicheKey,
      offer: preset.defaultOffer,
      targetAudience: preset.audience,
      tone: 'energetic',
      destinationUrl: preset.defaultDestination,
      scenes: JSON.parse(JSON.stringify(preset.scenes)),
      qrCodeUrl: qrDataUrl,
      trackingShortlink: `scaleup.to/c/${campaignId.slice(-6)}`,
      selectedPlatforms: ['instagram', 'tiktok', 'facebook', 'youtube'],
      status: 'rendered',
      avatar: bestAvatar,
      stats: {
        views: Math.floor(Math.random() * 4000) + 1200,
        scans: Math.floor(Math.random() * 40) + 12,
        clicks: Math.floor(Math.random() * 85) + 30,
        conversions: Math.floor(Math.random() * 8) + 2,
      },
    });

    setSuccessBanner(`Loaded ${preset.label} strategy with ${bestAvatar.name} AI Presenter!`);
    setTimeout(() => setSuccessBanner(null), 3500);
  };

  // Select Avatar Presenter
  const handleSelectAvatar = (avatar: AvatarConfig) => {
    setCampaign(prev => ({
      ...prev,
      avatar: { ...avatar, framing: prev.avatar?.framing || 'fullscreen' }
    }));
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
    setSuccessBanner(`Selected Human AI Presenter: ${avatar.name}!`);
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  // Select Framing
  const handleSelectFraming = (framing: 'fullscreen' | 'bubble' | 'split') => {
    setCampaign(prev => ({
      ...prev,
      avatar: { ...prev.avatar, framing }
    }));
  };

  // Clone Captain Avatar Simulation
  const handleSimulateClone = () => {
    setIsCloning(true);
    setTimeout(() => {
      setIsCloning(false);
      setShowCloneModal(false);
      const isHumanClone = avatarTab === 'human';
      const clonedAvatar: AvatarConfig = {
        id: `clone_${Date.now()}`,
        name: cloneCaptainName || (isHumanClone ? 'Sports Team Captain' : 'Custom 3D Mascot'),
        title: isHumanClone ? 'Sports Captain Digital Twin' : 'Custom 3D Character (Mascot)',
        nicheMatch: 'Personal Brand & Sports Club',
        avatarUrl: isHumanClone
          ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        voiceName: isHumanClone
          ? 'Captain ElevenLabs Voice Clone (Trained from video)'
          : 'Mascot Synth Voice (Energetic & Dynamic)',
        accent: isHumanClone ? 'Personal Voice Clone' : 'Animated Character Tone',
        framing: 'fullscreen',
        category: isHumanClone ? 'human' : 'virtual',
        avatarType: isHumanClone ? 'human_presenter' : '3d_mascot',
        themeColor: isHumanClone ? '#10b981' : '#8b5cf6',
        bio: isHumanClone
          ? 'Photorealistic human digital twin of your sports team captain cloned from video footage.'
          : 'Custom 3D animated character mascot with synchronized lip movement and sports energy.'
      };
      setCampaign(prev => ({ ...prev, avatar: clonedAvatar }));
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      setSuccessBanner(`Created & Activated Custom AI Avatar for "${cloneCaptainName}"!`);
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 1800);
  };

  // Generate / Regenerate AI Script for Campaign Details
  const handleRegenerateScript = async () => {
    setIsGenerating(true);
    const newScenes = await generateFullStoryboardFromPrompt(
      campaign.offer,
      campaign.businessName,
      campaign.niche,
      geminiApiKey
    );

    setIsGenerating(false);
    if (newScenes) {
      setCampaign(prev => ({ ...prev, scenes: newScenes }));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setSuccessBanner('AI Script & Storyboard optimized with high-retention retention hooks!');
      setTimeout(() => setSuccessBanner(null), 3000);
    }
  };

  // AI Re-write for Current Scene
  const handleAiRewriteScene = async (style: 'punchy' | 'urgent' | 'casual' | 'professional' | 'curiosity' | 'custom') => {
    setIsSceneGenerating(true);
    const currentScene = campaign.scenes[activeSceneTab];

    const result = await rewriteSceneContent(
      currentScene,
      campaign.businessName,
      campaign.offer,
      {
        style,
        customInstruction: style === 'custom' ? customScenePrompt : undefined,
        apiKey: geminiApiKey,
      }
    );

    setCampaign(prev => {
      const updated = [...prev.scenes];
      updated[activeSceneTab] = {
        ...updated[activeSceneTab],
        caption: result.caption,
        voiceText: result.voiceText,
        visualDescription: result.visualDescription,
      };
      return { ...prev, scenes: updated };
    });

    setIsSceneGenerating(false);
    if (style === 'custom') setCustomScenePrompt('');

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 }
    });

    setSuccessBanner(`Scene ${activeSceneTab + 1} updated with AI (${style})!`);
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  // AI Generate All 5 Scenes from Custom Prompt
  const handleGenerateFullStoryboard = async () => {
    if (!fullStoryboardPrompt.trim()) return;
    setIsFullGenerating(true);

    const generatedScenes = await generateFullStoryboardFromPrompt(
      fullStoryboardPrompt,
      campaign.businessName,
      campaign.niche,
      geminiApiKey
    );

    setIsFullGenerating(false);
    if (generatedScenes) {
      setCampaign(prev => ({
        ...prev,
        scenes: generatedScenes,
      }));
      setFullStoryboardPrompt('');
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
      setSuccessBanner('Generated 5 complete timed scenes from your AI prompt!');
      setTimeout(() => setSuccessBanner(null), 3500);
    }
  };

  // Open Hook Picker Modal
  const handleOpenHookPicker = async () => {
    setIsLoadingHooks(true);
    setShowHookModal(true);
    const hooks = await generateHookOptions(campaign.businessName, campaign.niche, campaign.offer, geminiApiKey);
    setHookOptions(hooks);
    setIsLoadingHooks(false);
  };

  const handleApplyHook = (hook: { caption: string; voiceText: string }) => {
    setCampaign(prev => {
      const updated = [...prev.scenes];
      updated[0] = {
        ...updated[0],
        caption: hook.caption,
        voiceText: hook.voiceText,
      };
      return { ...prev, scenes: updated };
    });
    setShowHookModal(false);
    setActiveSceneTab(0);
    setSuccessBanner('Applied new viral hook to Scene 1!');
    setTimeout(() => setSuccessBanner(null), 3000);
  };

  // Update specific scene
  const updateScene = (index: number, updates: Partial<Scene>) => {
    setCampaign(prev => {
      const newScenes = [...prev.scenes];
      newScenes[index] = { ...newScenes[index], ...updates };
      return { ...prev, scenes: newScenes };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Top Banner Alert */}
      {successBanner && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-xs text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main 2-Column Studio Grid: Left (Inputs & Storyboard) / Right (Live 9:16 Player) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Script Controls & Scene Storyboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section: Industry Preset Selector */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                Select Client Industry Niche
              </h2>
              
              {/* AI Engine Status Button */}
              <button
                onClick={() => setApiKeyModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                title="Configure Gemini API Key"
              >
                <Key className="w-3 h-3 text-emerald-400" />
                <span>{geminiApiKey ? 'Gemini 1.5 Active' : 'Built-in AI Mode'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {NICHE_KEYS.map((key) => {
                const item = PRESETS[key];
                const isSelected = campaign.niche === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleNicheChange(key)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="truncate">
                      <p className="text-xs font-bold truncate">{item.label}</p>
                      <p className="text-[10px] text-slate-500 truncate">{item.defaultBusiness}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: AI Avatar & Presenter Selection (Human & 3D Virtual) */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UserCheck className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                    AI Presenter & Avatar Selection
                  </h2>
                  <p className="text-xs text-slate-400">
                    Photorealistic digital humans speaking to camera or 3D animated mascots
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUploadAvatarModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 shrink-0"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>+ Upload Your Face</span>
                </button>
                <button
                  onClick={() => setShowCloneModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ 3D Mascot</span>
                </button>
              </div>
            </div>

            {/* Category Switcher Tabs: Human Presenters vs 3D Virtual Characters vs Uploaded Face */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setAvatarTab('human')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  avatarTab === 'human'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Photorealistic Humans ({HUMAN_AVATARS.length})</span>
              </button>

              <button
                onClick={() => setAvatarTab('virtual')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  avatarTab === 'virtual'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>3D Mascots ({VIRTUAL_AVATARS.length})</span>
              </button>

              <button
                onClick={() => setAvatarTab('custom')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  avatarTab === 'custom'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Your Face ({customAvatars.length})</span>
              </button>
            </div>

            {/* Avatar Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {avatarTab === 'custom' && (
                <div
                  onClick={() => setIsUploadAvatarModalOpen(true)}
                  className="p-3 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-slate-950/60 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] hover:bg-emerald-950/20 transition-all"
                >
                  <div className="p-2.5 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white">Upload New Photo</p>
                  <p className="text-[10px] text-slate-400">Turn selfie into presenter</p>
                </div>
              )}

              {(avatarTab === 'human' ? HUMAN_AVATARS : avatarTab === 'virtual' ? VIRTUAL_AVATARS : customAvatars).map((av) => {
                const isSelected = campaign.avatar?.id === av.id;
                return (
                  <div
                    key={av.id}
                    onClick={() => handleSelectAvatar(av)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 p-1 rounded-full z-20 shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2 bg-slate-900">
                      <img 
                        src={av.avatarUrl} 
                        alt={av.name} 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2">
                        <p className="text-[11px] font-extrabold text-white truncate drop-shadow">{av.name}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <p className="text-[10px] text-slate-400 font-medium truncate">{av.title}</p>
                      <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                        <Mic className="w-2.5 h-2.5" />
                        <span className="truncate">{av.accent}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Presenter Framing Selector Bar */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                Active Presenter: <strong className="text-white">{campaign.avatar?.name}</strong>
              </span>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                <span className="text-slate-400 px-1 font-medium">Layout:</span>
                <button
                  onClick={() => handleSelectFraming('fullscreen')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    campaign.avatar?.framing === 'fullscreen' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Full Screen
                </button>
                <button
                  onClick={() => handleSelectFraming('bubble')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    campaign.avatar?.framing === 'bubble' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Floating Bubble
                </button>
                <button
                  onClick={() => handleSelectFraming('split')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    campaign.avatar?.framing === 'split' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split Screen
                </button>
              </div>
            </div>
          </div>

          {/* Section: Client Offer & Business Info */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Client Campaign Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Business / Club Name
                </label>
                <input
                  type="text"
                  value={campaign.businessName}
                  onChange={(e) => setCampaign({ ...campaign, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Destination URL (Where QR sends users)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={campaign.destinationUrl}
                    onChange={(e) => setCampaign({ ...campaign, destinationUrl: e.target.value })}
                    className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <ExternalLink className="w-4 h-4 text-slate-500 absolute right-2.5 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Hook & Promo Offer (Spoken by Avatar & Embedded in QR)
              </label>
              <input
                type="text"
                value={campaign.offer}
                onChange={(e) => setCampaign({ ...campaign, offer: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Avatar Speech Voice: <span className="text-emerald-400 font-semibold">{campaign.avatar?.voiceName.split('(')[0]}</span>
              </span>
              <button
                onClick={handleRegenerateScript}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Writing Avatar Script...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    Refine Script with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section: Video Storyboard Breakdown (The section shown in the user's screenshot!) */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            
            {/* Storyboard Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-extrabold text-white">
                  Video Storyboard Breakdown (5 Timed Scenes)
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenHookPicker}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold hover:bg-purple-500/30 transition-all"
                  title="Generate 3 viral hook options for Scene 1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>3 Viral Hooks</span>
                </button>
                <span className="text-xs font-mono text-emerald-400">
                  Total Duration: {campaign.scenes.reduce((a, b) => a + b.duration, 0)}s
                </span>
              </div>
            </div>

            {/* AI Fast Storyboard Generator Bar (Client writes 1 sentence and AI builds all 5 scenes!) */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  AI Storyboard Auto-Pilot
                </span>
                <span className="text-[10px] text-slate-400">Describe any promo or client idea</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. 50% discount on weekend sports trials for players under 18..."
                  value={fullStoryboardPrompt}
                  onChange={(e) => setFullStoryboardPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateFullStoryboard()}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  onClick={handleGenerateFullStoryboard}
                  disabled={isFullGenerating || !fullStoryboardPrompt.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md shadow-emerald-500/20"
                >
                  {isFullGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Generate 5 Scenes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scene Selector Tabs (Scene 1 Hook, Scene 2 Problem, etc.) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {campaign.scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneTab(idx)}
                  className={`flex-1 min-w-[100px] p-2.5 rounded-xl border text-center transition-all ${
                    activeSceneTab === idx
                      ? 'bg-slate-800 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <p className="text-[10px] font-mono uppercase text-emerald-400">Scene {idx + 1}</p>
                  <p className="text-xs font-bold truncate">{scene.stage}</p>
                </button>
              ))}
            </div>

            {/* Active Scene Editor Box (Enhanced with AI Scene Assistant) */}
            {campaign.scenes[activeSceneTab] && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4 shadow-inner">
                
                {/* Scene Header & Duration */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Scene {activeSceneTab + 1}: {campaign.scenes[activeSceneTab].stage}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Duration:</span>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={campaign.scenes[activeSceneTab].duration}
                      onChange={(e) => updateScene(activeSceneTab, { duration: Number(e.target.value) })}
                      className="w-12 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-center font-mono text-xs"
                    />
                    <span>sec</span>
                  </div>
                </div>

                {/* AI Scene Co-Pilot Bar */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Scene Writer for Scene {activeSceneTab + 1}
                    </span>
                    <span className="text-[10px] text-slate-500">Click a style to re-write instantly</span>
                  </div>

                  {/* Quick Style Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {AI_STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        disabled={isSceneGenerating}
                        onClick={() => handleAiRewriteScene(preset.id as any)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-white transition-all disabled:opacity-50"
                        title={preset.desc}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom AI Prompt Input for this Scene */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                    <input
                      type="text"
                      placeholder={`Tell AI how to customize Scene ${activeSceneTab + 1} for ${campaign.avatar?.name} (e.g. 'Make it funnier', 'Mention free gear')...`}
                      value={customScenePrompt}
                      onChange={(e) => setCustomScenePrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && customScenePrompt && handleAiRewriteScene('custom')}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-[11px] focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleAiRewriteScene('custom')}
                      disabled={isSceneGenerating || !customScenePrompt.trim()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[11px] font-bold transition-all disabled:opacity-50 shrink-0"
                    >
                      {isSceneGenerating ? 'Rewriting...' : 'Apply AI'}
                    </button>
                  </div>
                </div>

                {/* Field 1: On-Screen Kinetic Caption */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400">
                      On-Screen Kinetic Caption (What viewers read)
                    </label>
                    <button
                      onClick={() => handleAiRewriteScene('punchy')}
                      disabled={isSceneGenerating}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Make Punchy</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={campaign.scenes[activeSceneTab].caption}
                    onChange={(e) => updateScene(activeSceneTab, { caption: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                  />
                </div>

                {/* Field 2: AI Voiceover Script */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400">
                      AI Avatar Spoken Script (Spoken by {campaign.avatar?.name})
                    </label>
                    <button
                      onClick={() => handleAiRewriteScene('urgent')}
                      disabled={isSceneGenerating}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Add Urgency</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={campaign.scenes[activeSceneTab].voiceText}
                    onChange={(e) => updateScene(activeSceneTab, { voiceText: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Field 3: Visual Prompt & B-Roll Match */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400">
                      Visual Backdrop & B-Roll Match
                    </label>
                    <button
                      onClick={() => updateScene(activeSceneTab, {
                        visualDescription: `Cinematic studio lighting with presenter ${campaign.avatar?.name} and dynamic b-roll montage of ${campaign.scenes[activeSceneTab].stage.toLowerCase()}`
                      })}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Suggest 4K B-Roll</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={campaign.scenes[activeSceneTab].visualDescription}
                    onChange={(e) => updateScene(activeSceneTab, { visualDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Field 4: 4K Commercial B-Roll Footage URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Commercial B-Roll Footage / Photo URL (Scene {activeSceneTab + 1})</span>
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      1080p Broadcast Quality
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={campaign.scenes[activeSceneTab].mediaUrl || ''}
                      placeholder="https://images.unsplash.com/..."
                      onChange={(e) => updateScene(activeSceneTab, { mediaUrl: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    {campaign.scenes[activeSceneTab].mediaUrl && (
                      <div className="w-12 h-9 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                        <img 
                          src={campaign.scenes[activeSceneTab].mediaUrl} 
                          alt="Thumbnail preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Field 5: Delivery Cadence & Subtitle Pacing */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Delivery Cadence & Subtitle Styling</span>
                    </label>
                    <span className="text-[10px] text-amber-400 font-mono">
                      Alex Hormozi Kinetic Style
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'punchy', label: '🔥 High Energy', desc: 'Fast, punchy word highlights' },
                      { id: 'broadcast', label: '🎙️ Broadcast Authority', desc: 'Clear, steady newsroom cadence' },
                      { id: 'conversational', label: '💬 UGC Influencer', desc: 'Relatable, organic flow' },
                    ].map((cadence, idx) => (
                      <div
                        key={cadence.id}
                        className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                          idx === 0 
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold block">{cadence.label}</span>
                        <span className="text-[9px] text-slate-500 mt-0.5 block">{cadence.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onSimulateScan}
                className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Test Dynamic QR Scan
              </button>

              <button
                onClick={onGoToPublisher}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Continue to Social Auto-Publishing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Live 9:16 Vertical Video Player (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
          <div className="mb-2 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live 9:16 Avatar Video Render
            </span>
            <p className="text-[11px] text-slate-500">
              Interactive preview • Click screen or Play to test avatar voice & subtitles
            </p>
          </div>

          <VideoPlayer 
            campaign={campaign} 
            onScanDetected={onSimulateScan} 
            onToggleFraming={handleSelectFraming}
            onOpenExport={() => setIsExportModalOpen(true)}
            onOpenLandingPreview={() => setIsLandingModalOpen(true)}
          />

          {/* Quick Info Box underneath player */}
          <div className="mt-4 w-[340px] sm:w-[375px] p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <p className="text-xs text-slate-300 font-medium">
              🎙️ Presenter: <span className="text-white font-bold">{campaign.avatar?.name}</span> ({campaign.avatar?.framing}) • Point phone at Scene 5 QR to test attribution!
            </p>
          </div>
        </div>

      </div>

      {/* Modal: Custom 3D Mascot / Virtual Avatar Generator */}
      {showCloneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  <Bot className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Generate Custom 3D Avatar</h3>
                  <p className="text-xs text-slate-400">Design a 3D animated character or robot mascot</p>
                </div>
              </div>
              <button onClick={() => setShowCloneModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mascot / Character Name
                </label>
                <input
                  type="text"
                  value={cloneCaptainName}
                  onChange={(e) => setCloneCaptainName(e.target.value)}
                  placeholder="e.g. Sports Lion 3D, Cyber Panther, RoboCoach..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Style Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Select Visual Style
                </label>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-purple-500 text-white font-medium text-center">
                    🏅 3D Sports Mascot
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-center">
                    🤖 Hologram CyberBot
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-center">
                    🦊 Pixar-Style Toon
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-center">
                    ⚡ Anime V-Tuber
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-[11px] text-purple-300">
                ✨ Generates an animated 3D character with synchronized mouth movements and zero human video footage.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCloneModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateClone}
                disabled={isCloning}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-500/20 disabled:opacity-50"
              >
                {isCloning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Rendering 3D Character...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Activate 3D Avatar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 3 Viral Hooks Selection */}
      {showHookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">Choose a Viral Opening Hook</h3>
                  <p className="text-xs text-slate-400">First 3 seconds that stop the scroll</p>
                </div>
              </div>
              <button onClick={() => setShowHookModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {isLoadingHooks ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
                <span>AI is crafting 3 psychological hooks...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {hookOptions.map((hook, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyHook(hook)}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/80 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-purple-300">{hook.type}: {hook.title}</span>
                      <span className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                        Click to Use →
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mb-1">"{hook.caption}"</p>
                    <p className="text-[11px] text-slate-400 italic">Spoken: "{hook.voiceText}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Gemini API Key */}
      <AiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        apiKey={geminiApiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Modal 1: Upload Custom Face Avatar */}
      <UploadAvatarModal
        isOpen={isUploadAvatarModalOpen}
        onClose={() => setIsUploadAvatarModalOpen(false)}
        defaultBusinessName={campaign.businessName}
        onSaveAvatar={(newAvatar) => {
          setCustomAvatars(prev => {
            const updated = [newAvatar, ...prev];
            localStorage.setItem('scaleup_custom_avatars', JSON.stringify(updated));
            return updated;
          });
          setAvatarTab('custom');
          handleSelectAvatar(newAvatar);
        }}
      />

      {/* Modal 2: 1-Click Video Export & MP4 Download */}
      <ExportVideoModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        campaign={campaign}
      />

      {/* Modal 3: Client Lead Generation Mobile Landing Page Preview */}
      <LandingPageModal
        isOpen={isLandingModalOpen}
        onClose={() => setIsLandingModalOpen(false)}
        campaign={campaign}
        onConversion={() => {
          onSimulateScan();
        }}
      />

    </div>
  );
};
