import React, { useState } from 'react';
import { 
  Video, 
  Share2, 
  BarChart3, 
  Sparkles, 
  QrCode, 
  Globe, 
  User, 
  Lock, 
  LogOut, 
  ChevronDown, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'studio' | 'publish' | 'attribution' | 'geo';
  setActiveTab: (tab: 'studio' | 'publish' | 'attribution' | 'geo') => void;
  onSimulateScan: () => void;
  totalScans: number;
  onOpenConnectModal?: () => void;
  connectedAccountsCount?: number;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSimulateScan,
  totalScans,
  onOpenConnectModal,
  connectedAccountsCount = 4,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  ScaleUp<span className="text-emerald-400">Studios</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  AI Marketing Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated AI Video • Social Auto-Publishing • QR & Cookie Attribution
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'studio'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Video Studio
            </button>
            <button
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'publish'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              Social Publisher
            </button>
            <button
              onClick={() => setActiveTab('attribution')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                activeTab === 'attribution'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Attribution & Cookies
              {totalScans > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-400/20 text-emerald-300 font-mono">
                  {totalScans}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('geo')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'geo'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Discovery (GEO)
            </button>
          </nav>

          {/* Right Action & User Auth Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* My Accounts Modal Trigger */}
            {onOpenConnectModal && (
              <button
                onClick={onOpenConnectModal}
                title="Enter and manage your actual social media accounts (Instagram, TikTok, Facebook, YouTube)"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 hover:text-white text-xs font-semibold transition-all group shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
                <span className="hidden sm:inline">My Accounts</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                  {connectedAccountsCount}
                </span>
              </button>
            )}

            {/* Simulate Scan Trigger */}
            <button
              onClick={onSimulateScan}
              title="Test a simulated customer scanning the dynamic QR code from their phone"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-medium transition-all group"
            >
              <QrCode className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-emerald-400" />
              <span className="hidden lg:inline">Simulate QR Scan</span>
            </button>

            {/* User Profile / Login Trigger */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 transition-all text-left shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-emerald-400">
                        {currentUser.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[11px] font-bold text-white leading-none truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[9px] font-mono text-emerald-400 mt-0.5 leading-none truncate max-w-[110px]">
                      {currentUser.businessName}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="absolute right-0 top-11 mt-1 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-fade-in"
                  >
                    <div className="px-3 py-2 border-b border-slate-800">
                      <p className="text-xs font-black text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                          {currentUser.plan} Plan
                        </span>
                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5" />
                          {currentUser.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={onOpenAuthModal}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
                      >
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Switch Client Account</span>
                      </button>
                      
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all shadow-md shadow-emerald-500/20"
              >
                <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Client Login</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
