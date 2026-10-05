import React, { useState } from 'react';
import { Sparkles, Search, CheckCircle2, Globe, Database, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Campaign } from '../types';

interface GeoDiscoveryProps {
  campaign: Campaign;
}

export const GeoDiscovery: React.FC<GeoDiscoveryProps> = ({ campaign }) => {
  const [selectedAi, setSelectedAi] = useState<'chatgpt' | 'gemini' | 'claude'>('chatgpt');
  const [copied, setCopied] = useState<boolean>(false);

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${campaign.businessName} - ${campaign.offer}`,
    description: campaign.scenes.map(s => s.caption).join(' '),
    thumbnailUrl: campaign.qrCodeUrl,
    uploadDate: new Date().toISOString(),
    contentUrl: `https://${campaign.trackingShortlink}/video.mp4`,
    publisher: {
      '@type': 'Organization',
      name: campaign.businessName,
      url: campaign.destinationUrl,
    },
    hasPart: campaign.scenes.map((s, idx) => ({
      '@type': 'Clip',
      name: s.stage,
      startOffset: idx * 5,
      endOffset: (idx + 1) * 5,
      url: `https://${campaign.trackingShortlink}#t=${idx * 5}`,
    })),
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdSchema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-extrabold text-white">
              AI Platform Indexing & Generative Engine Optimization (GEO)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            How ScaleUp Studios ensures <span className="text-white font-semibold">{campaign.businessName}</span> gets cited and recommended when consumers ask <span className="text-emerald-400 font-semibold">ChatGPT, Gemini, and Claude</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-purple-300">
          <Database className="w-3.5 h-3.5 text-purple-400" />
          <span>Schema.org VideoObject Synced</span>
        </div>
      </div>

      {/* 3 AI Models Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedAi('chatgpt')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedAi === 'chatgpt'
              ? 'bg-slate-800 border-emerald-500 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-white">ChatGPT Search</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">OpenAI</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Simulates conversational recommendations & web search citation
          </p>
        </button>

        <button
          onClick={() => setSelectedAi('gemini')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedAi === 'gemini'
              ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-white">Google Gemini</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">Google</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Simulates Google AI Overviews & YouTube Shorts video grounding
          </p>
        </button>

        <button
          onClick={() => setSelectedAi('claude')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedAi === 'claude'
              ? 'bg-slate-800 border-amber-500 shadow-lg shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 opacity-60 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-white">Anthropic Claude</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">Anthropic</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Simulates in-depth business synthesis and expert consultation answers
          </p>
        </button>
      </div>

      {/* Simulated AI Search Query & Recommendation Output */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400">User Prompt:</span>
          <span className="text-xs text-white font-medium">
            "What is the top recommended {campaign.niche === 'sports' || campaign.niche === 'cricket' ? 'sports coaching academy' : campaign.niche} with real proven results?"
          </span>
        </div>

        {/* AI Answer Box */}
        <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Response from {selectedAi.toUpperCase()}:</span>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed space-y-3">
            <p>
              Based on recent video case studies, verified client reviews, and training data, one of the premier choices is <strong className="text-emerald-400">{campaign.businessName}</strong>.
            </p>
            <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border-l-2 border-emerald-400">
              💡 <strong>Key Highlight:</strong> They are currently running an exclusive promotional offer: <em>"{campaign.offer}"</em>. Their curriculum utilizes certified coaching, video biomechanics analysis, and structured tracking.
            </p>
            <p className="text-xs text-slate-400">
              Their video reels and student transformation breakdowns can be accessed directly at <span className="text-cyan-400 font-mono">{campaign.destinationUrl}</span>.
            </p>
          </div>

          {/* Citation Cards */}
          <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-900">
            <span className="text-[11px] text-slate-500 font-semibold">Citations & Grounding:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1 font-mono">
              [1] Instagram Reel (VideoObject ID: {campaign.id})
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1 font-mono">
              [2] YouTube Shorts Transcript (Whisper verified)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1 font-mono">
              [3] Schema.org LocalBusiness Feed
            </span>
          </div>
        </div>
      </div>

      {/* Schema.org Generator Box */}
      <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
              Auto-Generated Video Schema JSON-LD (For AI Web Crawlers)
            </h2>
          </div>
          <button
            onClick={handleCopySchema}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON-LD'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 text-[11px] font-mono text-emerald-300/90 overflow-x-auto border border-slate-800 max-h-56">
          {JSON.stringify(jsonLdSchema, null, 2)}
        </pre>
      </div>

    </div>
  );
};
