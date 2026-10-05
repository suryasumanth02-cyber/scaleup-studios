import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Send, 
  Flame, 
  Sparkles,
  Phone,
  Calendar,
  Smartphone
} from 'lucide-react';
import { Campaign } from '../types';
import confetti from 'canvas-confetti';

interface LandingPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  onConversion?: (details: string) => void;
}

export const LandingPageModal: React.FC<LandingPageModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onConversion
}) => {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(299); // 4m 59s urgent countdown
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [goal, setGoal] = useState<string>('Speed & Agility Dominance');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 299));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleClaimTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitted(true);
    const details = `Lead Captured on Mobile Landing Page: ${name} (${phone || 'No phone'}) - Goal: ${goal}`;
    onConversion?.(details);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  const handleWhatsAppClick = () => {
    const details = `Direct WhatsApp Lead Click from Landing Page for ${campaign.businessName}`;
    onConversion?.(details);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.4 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-950 border-2 border-emerald-500/40 rounded-[44px] shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Mobile Status Bar & Notch */}
        <div className="relative bg-slate-900/90 pt-3 pb-2 px-6 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 shrink-0">
          <span className="font-bold text-white font-mono">9:41</span>
          
          {/* Dynamic Island */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800 ml-auto mr-2" />
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span>5G</span>
            <span className="text-emerald-400 font-bold">100%</span>
          </div>

          <button
            onClick={onClose}
            className="absolute -right-3 -top-3 sm:-right-4 sm:-top-4 w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 shadow-xl z-50"
            title="Close mobile preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Mobile Page Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5 selection:bg-emerald-500 selection:text-slate-950">
          
          {/* Business Hero Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Official Enrollment Page</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {campaign.businessName}
            </h1>
            <p className="text-xs text-slate-400">
              {campaign.targetAudience}
            </p>
          </div>

          {/* Urgent Countdown Timer Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-950 border border-amber-500/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <p className="text-[11px] font-bold text-white">VIP Promo Trial Spot Expires In:</p>
                <p className="text-[10px] text-amber-300">Only 4 spots remaining this week</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black font-mono text-sm shadow-md">
              {formattedTime}
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl aspect-video bg-slate-900">
            <img
              src={campaign.scenes[0]?.mediaUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80'}
              alt={campaign.businessName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
                Exclusive Offer
              </span>
              <p className="text-sm font-extrabold text-white mt-1 leading-snug">
                {campaign.offer}
              </p>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
            <p className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              What's Included in Your Session:
            </p>
            {[
              '1-on-1 Biomechanics & Athletic Assessment with Certified Coach',
              'High-Speed Video Movement Analysis & Speed Scorecard',
              'Personalized 30-Day Performance & Strength Blueprint',
              'Zero Long-Term Contract Required • 100% Satisfaction Guarantee'
            ].map((pt, i) => (
              <div key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Lead Capture Form */}
          {isSubmitted ? (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2 animate-fade-in">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Your Trial Assessment is Reserved!</h3>
              <p className="text-xs text-emerald-300">
                Our coaching team will reach out via WhatsApp/SMS within 15 minutes to confirm your time slot.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-[11px] text-slate-400 hover:text-white underline mt-2"
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleClaimTrial} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Reserve Your Free Assessment Slot
              </h3>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +44 7700 900123"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Primary Training Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option>Speed & Agility Dominance</option>
                  <option>Power & Biomechanics Strength</option>
                  <option>Match Play Preparation & Drills</option>
                  <option>Injury Prevention & Recovery</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Claim Free Assessment Now
              </button>
            </form>
          )}

          {/* Instant 1-Tap WhatsApp Button */}
          <div className="space-y-1.5">
            <button
              onClick={handleWhatsAppClick}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              Chat Directly on WhatsApp (Fastest Response)
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Average coach response time: under 3 minutes
            </p>
          </div>

          {/* Facility Location & Map Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs">
            <div className="p-2 rounded-xl bg-slate-800 text-emerald-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-white">{campaign.businessName} Facility</p>
              <p className="text-[11px] text-slate-400">Olympic Standard Training Facility • Open 6:00 AM – 9:00 PM</p>
              <p className="text-[10px] text-emerald-400 font-semibold pt-1">Free On-Site Athlete Parking Available</p>
            </div>
          </div>

          {/* Live Attribution Telemetry Badge */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Tracking: utm_campaign={campaign.niche}_trials</span>
            <span className="text-emerald-400 font-bold">Cookie Active (30d)</span>
          </div>

        </div>

      </div>
    </div>
  );
};
