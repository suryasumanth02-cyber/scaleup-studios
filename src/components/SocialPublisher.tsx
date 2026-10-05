import React, { useState } from 'react';
import { 
  Share2, 
  Send, 
  CheckCircle, 
  Sparkles, 
  Hash, 
  Link as LinkIcon, 
  TrendingUp,
  Settings,
  Lock,
  ExternalLink,
  Check,
  Calendar
} from 'lucide-react';
import { Campaign, ConnectedSocialAccount } from '../types';
import { ContentCalendar } from './ContentCalendar';
import confetti from 'canvas-confetti';

interface SocialPublisherProps {
  campaign: Campaign;
  accounts: ConnectedSocialAccount[];
  onPostPublished: () => void;
  onGoToAttribution: () => void;
  onOpenConnectModal: () => void;
}

export const SocialPublisher: React.FC<SocialPublisherProps> = ({
  campaign,
  accounts,
  onPostPublished,
  onGoToAttribution,
  onOpenConnectModal,
}) => {
  const [selectedChannels, setSelectedChannels] = useState<{ [key: string]: boolean }>({
    instagram: true,
    tiktok: true,
    facebook: true,
    youtube: true,
  });

  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishProgress, setPublishProgress] = useState<number>(0);
  const [publishStep, setPublishStep] = useState<string>('');
  const [isPublished, setIsPublished] = useState<boolean>(campaign.status === 'published');
  const [activeSection, setActiveSection] = useState<'instant' | 'calendar'>('instant');

  const igAccount = accounts.find(a => a.id === 'instagram') || accounts[0];

  const [captionText, setCaptionText] = useState<string>(
    `🚨 ${campaign.offer}!\n\nStop guessing your results. At ${campaign.businessName}, we combine elite coaching with data-driven progress.\n\n👇 Scan the QR code at the end of this video or tap the link in bio to claim your exclusive offer today!\n\n#${campaign.niche} #training #${campaign.businessName.toLowerCase().replace(/\s+/g, '')} #viral #growth #fyp`
  );

  const handleToggleChannel = (id: string) => {
    setSelectedChannels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePublishAll = () => {
    setIsPublishing(true);
    setPublishProgress(10);
    setPublishStep('Rendering 1080x1920 MP4 & burning kinetic subtitles...');

    setTimeout(() => {
      setPublishProgress(35);
      setPublishStep('Injecting dynamic QR code & generating unique UTM parameters...');
    }, 1000);

    setTimeout(() => {
      setPublishProgress(70);
      setPublishStep('Broadcasting payload to Meta Graph API & TikTok Posting API...');
    }, 2200);

    setTimeout(() => {
      setPublishProgress(95);
      setPublishStep('Setting up first-party cookie & conversion tracking endpoints...');
    }, 3200);

    setTimeout(() => {
      setPublishProgress(100);
      setIsPublishing(false);
      setIsPublished(true);
      onPostPublished();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 4000);
  };

  const connectedCount = accounts.filter(a => a.isConnected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Banner with Connect Social Accounts Button */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Share2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-white">
              Omnichannel Social Auto-Publisher
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch your AI video across your connected Instagram Reels, TikTok, Facebook & YouTube Shorts in a single click with embedded UTM tracking.
          </p>
        </div>

        {/* Action Button: Connect Social Accounts */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConnectModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Settings className="w-4 h-4" />
            <span>Connect My Social Accounts ({connectedCount}/4)</span>
          </button>
        </div>
      </div>

      {/* Switcher: Instant Broadcast vs Content Calendar */}
      <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 w-full sm:w-fit">
        <button
          onClick={() => setActiveSection('instant')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'instant'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>⚡ Instant Multi-Post (Direct APIs)</span>
        </button>

        <button
          onClick={() => setActiveSection('calendar')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'calendar'
              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>📅 Content Calendar & Queue Planner</span>
        </button>
      </div>

      {activeSection === 'calendar' ? (
        <ContentCalendar
          campaign={campaign}
          accounts={accounts}
          onPublishImmediately={onPostPublished}
        />
      ) : (
        /* Grid: Left (Channel Selection & Publishing) / Right (Social Feed Preview) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Channels and Trigger */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Channel Cards using Connected Accounts */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
                Connected Publishing Destinations
              </h2>
              <button
                onClick={onOpenConnectModal}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Edit My Handles</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {accounts.map((chan) => {
                const checked = selectedChannels[chan.id] && chan.isConnected;
                return (
                  <div
                    key={chan.id}
                    onClick={() => chan.isConnected && handleToggleChannel(chan.id)}
                    className={`p-4 rounded-xl border transition-all ${
                      checked
                        ? 'bg-slate-800/90 border-emerald-500/80 shadow-md shadow-emerald-500/5 cursor-pointer'
                        : chan.isConnected
                        ? 'bg-slate-950/60 border-slate-800 opacity-60 hover:opacity-90 cursor-pointer'
                        : 'bg-slate-950/40 border-dashed border-slate-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{chan.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{chan.platformName}</p>
                          <p className="text-[11px] font-mono text-emerald-300 font-semibold">{chan.handle}</p>
                        </div>
                      </div>
                      {chan.isConnected ? (
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 mt-1 cursor-pointer"
                        />
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenConnectModal();
                          }}
                          className="text-[10px] text-emerald-400 underline font-bold"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-mono">{chan.followersCount}</span>
                      <span className="text-emerald-400 font-medium">
                        {chan.isConnected ? 'Ready to Publish' : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Post Caption & Hashtags Editor */}
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                AI Generated Post Caption & Bio Link
              </h2>
              <span className="text-xs text-slate-500 font-mono">{captionText.length} chars</span>
            </div>

            <textarea
              rows={5}
              value={captionText}
              onChange={(e) => setCaptionText(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-emerald-500 transition-colors"
            />

            {/* Smart Shortlink with UTM Tracking */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <LinkIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400">Tracking Bio Link:</span>
                <span className="font-mono text-emerald-300 font-bold">
                  https://{campaign.trackingShortlink}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">UTM Auto-Tagged</span>
            </div>
          </div>

          {/* Publishing Action Box */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
            {isPublishing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                    {publishStep}
                  </span>
                  <span className="font-mono">{publishProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                    style={{ width: `${publishProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Posting to your accounts ({accounts.filter(a => selectedChannels[a.id]).map(a => a.handle).join(', ')})...
                </p>
              </div>
            ) : isPublished ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Campaign Published Across Your Channels!
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Videos are now live on {accounts.filter(a => selectedChannels[a.id]).map(a => a.platformName).join(', ')}. Attribution cookies are tracking.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onGoToAttribution}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-extrabold hover:bg-emerald-400 transition-all shrink-0 shadow-lg shadow-emerald-500/20"
                >
                  View Live Attribution →
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Ready to Auto-Publish to Your Accounts
                  </h3>
                  <p className="text-xs text-slate-400">
                    Will auto-render final 1080x1920 video and dispatch to your accounts ({accounts.filter(a => a.isConnected).length} linked).
                  </p>
                </div>
                <button
                  onClick={handlePublishAll}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to My Accounts</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right: Realistic Social Feed Preview (Displays user's exact handle!) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Social Feed Preview
            </span>
            <p className="text-[11px] text-slate-500">
              How the post appears on your account: <strong className="text-emerald-400">{igAccount.handle}</strong>
            </p>
          </div>

          {/* Mock Social Card */}
          <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-4 overflow-hidden">
            {/* Post Header with User's Exact Handle */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs">
                  {igAccount.accountName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                    {igAccount.handle}
                    <span className="text-[10px] text-blue-400">✓</span>
                  </p>
                  <p className="text-[10px] text-slate-400">{igAccount.accountName} • Reels & TikTok</p>
                </div>
              </div>
              <span className="text-xs text-slate-400">•••</span>
            </div>

            {/* Video Preview Frame with Presenter & QR Outro */}
            <div className="mt-3 w-full h-[320px] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center p-4 border border-slate-800 bg-slate-900">
              <img 
                src={campaign.avatar?.avatarUrl} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-60" 
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="p-2 bg-white rounded-xl shadow-lg border border-emerald-400">
                  <img 
                    src={campaign.qrCodeUrl} 
                    alt="Dynamic QR" 
                    className="w-24 h-24 object-contain" 
                  />
                  <div className="bg-emerald-600 text-slate-950 font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.2 rounded-full whitespace-nowrap mt-1">
                    Scan to Claim
                  </div>
                </div>
                <p className="text-xs font-extrabold text-white mt-2 px-4 drop-shadow">
                  {campaign.offer}
                </p>
                <div className="mt-1 bg-black/80 px-2.5 py-0.5 rounded-full text-[10px] text-emerald-300 font-mono">
                  {campaign.trackingShortlink}
                </div>
              </div>
            </div>

            {/* Social Post Footer */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-3">
                  <span>❤️ 3.1k</span>
                  <span>💬 142</span>
                  <span>↗️ 480</span>
                </div>
                <span className="font-mono text-emerald-400 text-[10px]">🔥 Live on {igAccount.handle}</span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed px-1">
                <span className="font-bold text-white mr-1.5 font-mono">{igAccount.handle}</span>
                {campaign.offer}. Don't miss out! Link in bio or scan QR on screen.
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                <span>View all 142 comments</span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      )}
    </div>
  );
};
