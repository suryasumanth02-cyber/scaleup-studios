import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoStudio } from './components/VideoStudio';
import { SocialPublisher } from './components/SocialPublisher';
import { AttributionTracker } from './components/AttributionTracker';
import { GeoDiscovery } from './components/GeoDiscovery';
import { ConnectAccountsModal } from './components/ConnectAccountsModal';
import { AuthModal } from './components/AuthModal';
import { Campaign, TrackingLog, ConnectedSocialAccount, UserProfile } from './types';
import { PRESETS } from './data/presets';
import { DEFAULT_AVATAR, HUMAN_AVATARS } from './data/avatars';
import { 
  generateQrCodeDataUrl, 
  buildTrackingUrl, 
  getStoredLogs, 
  recordNewEvent 
} from './utils/tracking';
import { 
  getStoredSocialAccounts, 
  saveStoredSocialAccounts 
} from './utils/socialAccounts';
import { getCurrentUser, logoutUser } from './utils/auth';
import confetti from 'canvas-confetti';
import { Bell, Sparkles, UserCheck } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'publish' | 'attribution' | 'geo'>('studio');
  const [logs, setLogs] = useState<TrackingLog[]>([]);
  const [scanToast, setScanToast] = useState<{ id: string; msg: string } | null>(null);
  const [authToast, setAuthToast] = useState<string | null>(null);
  
  // Client authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Client's connected social media accounts (Instagram, TikTok, Facebook, YouTube)
  const [socialAccounts, setSocialAccounts] = useState<ConnectedSocialAccount[]>(getStoredSocialAccounts());
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  const handleSaveAccounts = (updated: ConnectedSocialAccount[]) => {
    setSocialAccounts(updated);
    saveStoredSocialAccounts(updated);
  };

  // Initialize with Sports Academy Preset or User's Niche Preset
  const defaultNiche = currentUser?.niche ? (PRESETS[currentUser.niche] || PRESETS.sports) : PRESETS.sports;
  const initialCampaignId = `cam_${defaultNiche.id}_2026`;
  const initialTrackingUrl = buildTrackingUrl(defaultNiche.defaultDestination, initialCampaignId, 'instagram');

  const [campaign, setCampaign] = useState<Campaign>({
    id: initialCampaignId,
    businessName: currentUser?.businessName || defaultNiche.defaultBusiness,
    niche: defaultNiche.id,
    offer: defaultNiche.defaultOffer,
    targetAudience: defaultNiche.audience,
    tone: 'energetic',
    destinationUrl: defaultNiche.defaultDestination,
    scenes: JSON.parse(JSON.stringify(defaultNiche.scenes)),
    qrCodeUrl: '',
    trackingShortlink: `scaleup.to/c/${defaultNiche.id}98`,
    selectedPlatforms: ['instagram', 'tiktok', 'facebook', 'youtube'],
    status: 'rendered',
    avatar: DEFAULT_AVATAR,
    stats: {
      views: 3840,
      scans: 42,
      clicks: 89,
      conversions: 7,
    },
  });

  // Load initial QR code and logs
  useEffect(() => {
    generateQrCodeDataUrl(initialTrackingUrl).then((qr) => {
      setCampaign(prev => ({ ...prev, qrCodeUrl: qr }));
    });
    setLogs(getStoredLogs());
  }, []);

  // Handle successful login or account registration
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setAuthToast(`Welcome back, ${user.name} (${user.businessName})!`);
    setTimeout(() => setAuthToast(null), 4000);

    // If niche matches a preset, switch workspace to the client's business & niche
    const preset = PRESETS[user.niche];
    if (preset) {
      const campId = `cam_${preset.id}_${Date.now().toString().slice(-4)}`;
      const trackingUrl = buildTrackingUrl(preset.defaultDestination, campId, 'instagram');
      
      generateQrCodeDataUrl(trackingUrl).then((qr) => {
        setCampaign({
          id: campId,
          businessName: user.businessName,
          niche: user.niche,
          offer: preset.defaultOffer,
          targetAudience: preset.audience,
          tone: 'energetic',
          destinationUrl: preset.defaultDestination,
          scenes: JSON.parse(JSON.stringify(preset.scenes)),
          qrCodeUrl: qr,
          trackingShortlink: `scaleup.to/c/${preset.id}${Date.now().toString().slice(-2)}`,
          selectedPlatforms: ['instagram', 'tiktok', 'facebook', 'youtube'],
          status: 'rendered',
          avatar: HUMAN_AVATARS.find(a => a.nicheMatch.toLowerCase().includes(user.niche)) || DEFAULT_AVATAR,
          stats: {
            views: 1200,
            scans: 14,
            clicks: 38,
            conversions: 3,
          }
        });
      });
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.15 }
    });
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setAuthToast('Signed out of client portal.');
    setTimeout(() => setAuthToast(null), 3000);
  };

  // Simulate or Trigger a real Scan event
  const handleSimulateScan = () => {
    const sources: TrackingLog['source'][] = [
      'Instagram Reel',
      'TikTok Video',
      'YouTube Short',
      'QR Code Direct',
    ];
    const chosenSource = sources[Math.floor(Math.random() * sources.length)];
    const details = `Dynamic QR scan from video outro (Platform: ${chosenSource}). 30-day first-party cookie dropped into client browser.`;

    const newLog = recordNewEvent('qr_scan', chosenSource, details);
    setLogs(prev => [newLog, ...prev]);

    // Update campaign stats
    setCampaign(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        scans: prev.stats.scans + 1,
        clicks: prev.stats.clicks + 1,
      }
    }));

    // Trigger celebratory confetti
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.3 }
    });

    // Show Scan Toast
    const toastId = Date.now().toString();
    setScanToast({
      id: toastId,
      msg: `📱 Real-Time Conversion: Customer scanned QR from ${chosenSource}!`
    });
    setTimeout(() => setScanToast(null), 4500);
  };

  // Handle post publish
  const handlePostPublished = (platform: string = 'Instagram') => {
    const details = `AI Video Reel automatically posted to client's verified ${platform} account via Direct API.`;
    const newLog = recordNewEvent('cookie_created', 'Instagram Reel', details);
    setLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Toast Alert for Live QR Attribution Scans */}
      {scanToast && (
        <div className="fixed top-20 right-5 z-50 animate-bounce bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center gap-3 border border-emerald-300">
          <Bell className="w-5 h-5 fill-slate-950 animate-pulse" />
          <div>
            <p className="text-xs font-black tracking-wide">ATTRIBUTION TELEMETRY DETECTED</p>
            <p className="text-[11px] font-semibold">{scanToast.msg}</p>
          </div>
        </div>
      )}

      {/* Toast Alert for Auth Actions */}
      {authToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl border border-emerald-500/50 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold">{authToast}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSimulateScan={handleSimulateScan}
        totalScans={campaign.stats.scans}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        connectedAccountsCount={socialAccounts.filter(a => a.isConnected).length}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'studio' && (
          <VideoStudio
            campaign={campaign}
            setCampaign={setCampaign}
            onGoToPublisher={() => setActiveTab('publish')}
            onSimulateScan={handleSimulateScan}
          />
        )}

        {activeTab === 'publish' && (
          <SocialPublisher
            campaign={campaign}
            accounts={socialAccounts}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onPostPublished={handlePostPublished}
            onGoToAttribution={() => setActiveTab('attribution')}
          />
        )}

        {activeTab === 'attribution' && (
          <AttributionTracker
            campaign={campaign}
            logs={logs}
            onSimulateScan={handleSimulateScan}
          />
        )}

        {activeTab === 'geo' && (
          <GeoDiscovery
            campaign={campaign}
          />
        )}
      </main>

      {/* Connect Client Social Accounts Modal */}
      <ConnectAccountsModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        accounts={socialAccounts}
        onSaveAccounts={handleSaveAccounts}
      />

      {/* Client Authentication Login / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">ScaleUp Studios</span>
            <span>•</span>
            <span>AI Automated Video, Social Distribution & Attribution System</span>
          </div>
          <p className="font-mono text-slate-600">
            Engineered for High-Conversion Client Marketing
          </p>
        </div>
      </footer>

    </div>
  );
}
export default App;
