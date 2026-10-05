import React from 'react';
import { 
  BarChart3, 
  QrCode, 
  Cookie, 
  Users, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  ShieldCheck, 
  Smartphone, 
  ArrowUpRight,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Campaign, TrackingLog } from '../types';

interface AttributionTrackerProps {
  campaign: Campaign;
  logs: TrackingLog[];
  onSimulateScan: () => void;
}

export const AttributionTracker: React.FC<AttributionTrackerProps> = ({
  campaign,
  logs,
  onSimulateScan,
}) => {
  const qrScans = logs.filter(l => l.type === 'qr_scan').length;
  const linkClicks = logs.filter(l => l.type === 'link_click').length;
  const conversions = logs.filter(l => l.type === 'lead_conversion').length;
  const cookiesCreated = logs.filter(l => l.type === 'cookie_created').length + qrScans + linkClicks;

  const totalInteractions = qrScans + linkClicks;
  const estimatedRevenue = (conversions * 180).toLocaleString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Header */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-white">
              Attribution, Barcode (QR) & Cookie Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking exact return on investment (ROI) for <span className="text-white font-semibold">{campaign.businessName}</span> across video views, QR code scans, and 30-day first-party cookies.
          </p>
        </div>

        <button
          onClick={onSimulateScan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-emerald-500/20"
        >
          <QrCode className="w-4 h-4" />
          <span>Simulate Live Mobile Scan</span>
        </button>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Video Views */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video Views</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Eye className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-white mt-3 font-mono">{campaign.stats.views.toLocaleString()}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across IG, TikTok & Shorts</span>
          </div>
        </div>

        {/* KPI 2: Dynamic QR Scans (Barcodes) */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-emerald-500/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Dynamic QR Scans</span>
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400"><QrCode className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-3 font-mono">{qrScans + campaign.stats.scans}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <span>Scan conversion: </span>
            <span className="text-white font-bold font-mono">1.8%</span>
          </div>
        </div>

        {/* KPI 3: First-Party Cookies Dropped */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Cookie Sessions</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Cookie className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-white mt-3 font-mono">{cookiesCreated + campaign.stats.clicks}</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>30-Day Attribution Window</span>
          </div>
        </div>

        {/* KPI 4: Converted Leads & Value */}
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Captured Leads</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><DollarSign className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-purple-300 mt-3 font-mono">{conversions + campaign.stats.conversions}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <span>~${estimatedRevenue} Value</span>
          </div>
        </div>

      </div>

      {/* Middle Section: Attribution Funnel & Live Cookie Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: How Tracking Works Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              How the Cookie & Barcode Tracking Pipeline Operates
            </h2>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Dynamic QR Code (In-Video Barcode)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Each video carries a unique dynamic barcode pointing to <span className="text-emerald-400 font-mono">scaleup.to/{campaign.id}</span>. When scanned on a smartphone, the system instantly logs the video timestamp and platform.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-xs font-bold text-white">First-Party Session Cookie Dropped</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    A first-party cookie (<span className="text-emerald-400 font-mono">scaleup_attribution</span>) is saved in the customer's mobile browser. Even if they don't buy immediately, if they return in 30 days, your client gets full attribution.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-xs font-bold text-white">Server-Side Conversion API (CAPI) Sync</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    When the customer books an assessment or purchases on the client's website, an event webhook fires back to Meta and TikTok to train their algorithms to show the video to higher-converting prospects.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Cookie Diagnostic Box */}
            <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Cookie className="w-3.5 h-3.5" />
                  Active Browser Cookie Inspector
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">Live in this Session</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 break-all">
                scaleup_attribution=vid_{campaign.id}&ref=instagram_reels&cookie_exp=30d&device=mobile
              </p>
            </div>
          </div>
        </div>

        {/* Right: Live Real-Time Scan & Click Event Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Live Event Stream ({logs.length})
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Listening
              </span>
            </div>

            {/* Stream List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {logs.map((log) => {
                let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                let icon = <MousePointerClick className="w-3.5 h-3.5" />;
                if (log.type === 'qr_scan') {
                  badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                  icon = <QrCode className="w-3.5 h-3.5" />;
                } else if (log.type === 'lead_conversion') {
                  badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                  icon = <DollarSign className="w-3.5 h-3.5" />;
                } else if (log.type === 'cookie_created') {
                  badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                  icon = <Cookie className="w-3.5 h-3.5" />;
                }

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded-md border text-[10px] flex items-center gap-1 font-semibold ${badgeColor}`}>
                          {icon}
                          <span className="capitalize">{log.type.replace('_', ' ')}</span>
                        </span>
                        <span className="text-[11px] font-bold text-white">{log.source}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">
                      {log.details}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>📱 {log.device}</span>
                      <span>📍 {log.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onSimulateScan}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trigger Test Customer Scan Event</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
