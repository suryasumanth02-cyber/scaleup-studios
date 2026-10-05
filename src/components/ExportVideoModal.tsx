import React, { useState } from 'react';
import { 
  Download, 
  Film, 
  Music, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Captions, 
  Play, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { Campaign } from '../types';
import { BGM_TRACKS, BgmTrackId } from '../utils/audioEngine';
import { 
  exportCampaignVideo, 
  downloadExportedVideo, 
  ExportProgress, 
  ExportResult 
} from '../utils/videoExporter';
import confetti from 'canvas-confetti';

interface ExportVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

export const ExportVideoModal: React.FC<ExportVideoModalProps> = ({
  isOpen,
  onClose,
  campaign
}) => {
  const [selectedTrack, setSelectedTrack] = useState<BgmTrackId>('sports_energy');
  const [includeCaptions, setIncludeCaptions] = useState<boolean>(true);
  const [framing, setFraming] = useState<'bubble' | 'fullscreen' | 'split'>('bubble');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportResult(null);
    setProgress({
      percent: 0,
      stage: 'Initializing video rendering engine...',
      currentScene: 0,
      totalScenes: campaign.scenes.length
    });

    try {
      const result = await exportCampaignVideo(campaign, {
        framing,
        showCaptions: includeCaptions,
        bgmTrack: selectedTrack,
        fps: 25,
        onProgress: (p) => setProgress(p)
      });

      setExportResult(result);
      setIsExporting(false);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.4 }
      });
    } catch (err: any) {
      console.error('Video export error:', err);
      setError(err?.message || 'Failed to export video. Please try again.');
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (exportResult) {
      downloadExportedVideo(exportResult);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Glowing Top Aura */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Export 9:16 Video Reel
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                  1080x1920 HD
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generate high-converting MP4 / WebM ready for Instagram & TikTok
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* If Result Ready -> Show Video Player & Download Button */}
          {exportResult ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Reel Successfully Rendered!</h3>
                    <p className="text-xs text-emerald-300 font-mono">
                      {exportResult.filename} ({(exportResult.blob.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Video Preview */}
              <div className="relative w-full max-w-[240px] mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl">
                <video
                  src={exportResult.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  Download Reel File
                </button>
                <button
                  onClick={() => setExportResult(null)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Re-configure
                </button>
              </div>
            </div>
          ) : isExporting ? (
            /* Exporting Progress Bar */
            <div className="py-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center animate-spin">
                <RefreshCw className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <p className="text-base font-bold text-white">{progress?.stage}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rendering 30 FPS visual frames, presenter lip-sync & audio mix
                </p>
              </div>

              <div className="space-y-1.5 max-w-sm mx-auto">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Scene {progress?.currentScene} of {progress?.totalScenes}</span>
                  <span className="text-emerald-400 font-bold">{progress?.percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-200"
                    style={{ width: `${progress?.percent || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Configure Settings Before Export */
            <div className="space-y-4">
              
              {/* Background Music Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-emerald-400" />
                  Background Music (BGM)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BGM_TRACKS.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => setSelectedTrack(track.id)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        selectedTrack === track.id
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-lg">{track.icon}</span>
                      <div className="truncate">
                        <p className="text-xs font-bold truncate text-white">{track.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{track.genre} {track.bpm > 0 ? `• ${track.bpm} BPM` : ''}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Presenter Framing */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  Presenter Framing Layout
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'bubble', label: '🎬 Studio PIP', desc: 'Corner Broadcast' },
                    { id: 'fullscreen', label: '👤 Fullscreen', desc: 'Direct Camera' },
                    { id: 'split', label: '⚡ Split Screen', desc: 'Top/Bottom Split' }
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFraming(f.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        framing === f.id
                          ? 'bg-teal-500/20 border-teal-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <p className="text-xs">{f.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Captions Burn-In Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Captions className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Burn-in Kinetic Captions</p>
                    <p className="text-[10px] text-slate-400">Alex Hormozi word-by-word synchronized subtitles</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCaptions}
                    onChange={(e) => setIncludeCaptions(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Campaign Summary Pill */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Total Duration: <strong className="text-white">{campaign.scenes.reduce((a, b) => a + b.duration, 0)}s</strong></span>
                <span>Scenes: <strong className="text-white">{campaign.scenes.length}</strong></span>
                <span>Resolution: <strong className="text-white">720x1280 (9:16)</strong></span>
              </div>

              {/* Export Trigger Button */}
              <button
                type="button"
                onClick={handleStartExport}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                Render & Export Reel (MP4)
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
