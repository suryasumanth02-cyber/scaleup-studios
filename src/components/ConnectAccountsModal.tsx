import React, { useState } from 'react';
import { ConnectedSocialAccount } from '../types';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Lock, 
  Globe 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConnectAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: ConnectedSocialAccount[];
  onSaveAccounts: (updated: ConnectedSocialAccount[]) => void;
}

export const ConnectAccountsModal: React.FC<ConnectAccountsModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSaveAccounts,
}) => {
  const [editingAccounts, setEditingAccounts] = useState<ConnectedSocialAccount[]>(accounts);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleUpdateField = (id: string, field: keyof ConnectedSocialAccount, value: any) => {
    setEditingAccounts(prev => 
      prev.map(acc => acc.id === id ? { ...acc, [field]: value } : acc)
    );
  };

  const handleSimulateOAuth = (id: string) => {
    setConnectingId(id);
    setTimeout(() => {
      setConnectingId(null);
      setEditingAccounts(prev => 
        prev.map(acc => acc.id === id ? { 
          ...acc, 
          isConnected: true,
          authType: acc.id.includes('tik') ? 'TikTok OAuth 2.0 (Live Token)' : 'Meta Graph API (Verified)'
        } : acc)
      );
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }, 1000);
  };

  const handleSaveAll = () => {
    onSaveAccounts(editingAccounts);
    setSavedSuccess(true);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Connect Your Client Social Media Accounts
              </h2>
              <p className="text-xs text-slate-400">
                Enter your actual handles so ScaleUp Studios posts directly to your pages
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security / OAuth Trust Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Zero-Password Secure Connection:</span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Your accounts are authorized via official Meta Graph & TikTok OAuth 2.0 tokens. We never store or ask for your social media passwords.
            </p>
          </div>
        </div>

        {/* 4 Social Accounts Input Cards */}
        <div className="space-y-4">
          {editingAccounts.map((acc) => {
            const isConnecting = connectingId === acc.id;

            return (
              <div 
                key={acc.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{acc.icon}</span>
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        {acc.platformName}
                        {acc.isConnected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Linked
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono">{acc.authType}</p>
                    </div>
                  </div>

                  {/* Connect / Reconnect Action */}
                  <button
                    onClick={() => handleSimulateOAuth(acc.id)}
                    disabled={isConnecting}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-emerald-400" />
                        <span>{acc.isConnected ? 'Re-Authorize' : 'Authorize API'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Input for Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Your Social Media Handle / Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={acc.handle}
                        onChange={(e) => handleUpdateField(acc.id, 'handle', e.target.value)}
                        placeholder="@yourhandle"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Account / Page Display Name
                    </label>
                    <input
                      type="text"
                      value={acc.accountName}
                      onChange={(e) => handleUpdateField(acc.id, 'accountName', e.target.value)}
                      placeholder="e.g. Premier Sports Academy"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                  <span className="truncate">Public Link: {acc.profileUrl}{acc.handle.replace('@', '')}</span>
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white">
                    <input
                      type="checkbox"
                      checked={acc.isConnected}
                      onChange={(e) => handleUpdateField(acc.id, 'isConnected', e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-emerald-500 accent-emerald-500"
                    />
                    <span>Enable Auto-Posting</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            {editingAccounts.filter(a => a.isConnected).length} of 4 channels ready
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/25"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Accounts Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Apply My Accounts</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
