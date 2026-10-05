import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Share2, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Play, 
  Flame, 
  Trash2, 
  Send, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Filter 
} from 'lucide-react';
import { Campaign, ScheduledPost, ConnectedSocialAccount } from '../types';
import confetti from 'canvas-confetti';

interface ContentCalendarProps {
  campaign: Campaign;
  accounts: ConnectedSocialAccount[];
  onPublishImmediately?: (postId: string) => void;
}

const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'post_101',
    campaignId: 'cam_sports_2026',
    campaignName: 'Weekend Athletic Trials Promo',
    businessName: 'Premier Sports Academy',
    scheduledDate: '2026-10-08',
    scheduledTime: '18:30',
    platforms: ['instagram', 'tiktok', 'youtube'],
    status: 'scheduled',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
    caption: 'Want to boost your athletic speed & power? Free 1-on-1 assessment trials this weekend! #sports #training',
    engagementScore: 94
  },
  {
    id: 'post_102',
    campaignId: 'cam_sports_2026',
    campaignName: 'AI Speed Analytics Breakdown',
    businessName: 'Premier Sports Academy',
    scheduledDate: '2026-10-10',
    scheduledTime: '12:15',
    platforms: ['instagram', 'facebook'],
    status: 'scheduled',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
    caption: 'How our certified coaches track biomechanics to shave 0.3s off your sprint time. Link in bio!',
    engagementScore: 88
  },
  {
    id: 'post_103',
    campaignId: 'cam_sports_2026',
    campaignName: 'Monday Motivation & Pro Drills',
    businessName: 'Premier Sports Academy',
    scheduledDate: '2026-10-12',
    scheduledTime: '08:00',
    platforms: ['tiktok', 'youtube'],
    status: 'queued',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80',
    caption: 'Top 3 agility drills every competitive athlete should run before match day. Save this reel!',
    engagementScore: 91
  }
];

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  campaign,
  accounts,
  onPublishImmediately
}) => {
  const [posts, setPosts] = useState<ScheduledPost[]>(() => {
    const saved = localStorage.getItem('scaleup_scheduled_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return INITIAL_SCHEDULED_POSTS;
  });

  const [viewMode, setViewMode] = useState<'calendar' | 'queue'>('calendar');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<string>('2026-10-09');
  const [newTime, setNewTime] = useState<string>('18:30');
  const [targetPlatforms, setTargetPlatforms] = useState<{ [key: string]: boolean }>({
    instagram: true,
    tiktok: true,
    youtube: true,
    facebook: false
  });

  const savePosts = (updated: ScheduledPost[]) => {
    setPosts(updated);
    localStorage.setItem('scaleup_scheduled_posts', JSON.stringify(updated));
  };

  const handleAddSchedule = () => {
    const selectedList = Object.keys(targetPlatforms).filter(k => targetPlatforms[k]) as any[];
    if (selectedList.length === 0) return;

    const newPost: ScheduledPost = {
      id: `post_${Date.now()}`,
      campaignId: campaign.id,
      campaignName: `${campaign.businessName} Reel Drop`,
      businessName: campaign.businessName,
      scheduledDate: newDate,
      scheduledTime: newTime,
      platforms: selectedList,
      status: 'scheduled',
      thumbnailUrl: campaign.scenes[0]?.mediaUrl || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80',
      caption: `🚨 ${campaign.offer}! Scan the QR code or tap bio link to claim. #${campaign.niche} #training`,
      engagementScore: 92
    };

    savePosts([newPost, ...posts]);
    setIsScheduleModalOpen(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.3 }
    });
  };

  const handleDeletePost = (id: string) => {
    savePosts(posts.filter(p => p.id !== id));
  };

  const handlePublishNow = (id: string) => {
    savePosts(posts.map(p => p.id === id ? { ...p, status: 'live' as const } : p));
    onPublishImmediately?.(id);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Social Media Auto-Scheduler & Content Calendar
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 font-mono">
                {posts.filter(p => p.status === 'scheduled').length} Scheduled
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              AI queues and broadcasts your reels at peak algorithmic engagement hours
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Switch View Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'calendar' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              📅 7-Day Planner
            </button>
            <button
              onClick={() => setViewMode('queue')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'queue' ? 'bg-purple-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 Queue List ({posts.length})
            </button>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Drop</span>
          </button>
        </div>
      </div>

      {/* View 1: 7-Day Calendar Grid */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {[
            { day: 'Mon', date: 'Oct 06', full: '2026-10-06' },
            { day: 'Tue', date: 'Oct 07', full: '2026-10-07' },
            { day: 'Wed', date: 'Oct 08', full: '2026-10-08', peak: '6:30 PM Peak' },
            { day: 'Thu', date: 'Oct 09', full: '2026-10-09' },
            { day: 'Fri', date: 'Oct 10', full: '2026-10-10', peak: '12:15 PM Peak' },
            { day: 'Sat', date: 'Oct 11', full: '2026-10-11' },
            { day: 'Sun', date: 'Oct 12', full: '2026-10-12', peak: '8:00 AM Peak' }
          ].map((col) => {
            const dayPosts = posts.filter(p => p.scheduledDate === col.full);
            const isToday = col.full === '2026-10-06';

            return (
              <div 
                key={col.day} 
                className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all ${
                  isToday 
                    ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-white">{col.day}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{col.date}</span>
                  </div>

                  {col.peak && (
                    <div className="mt-2 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 text-center">
                      🔥 {col.peak}
                    </div>
                  )}

                  {/* Posts Cards for this day */}
                  <div className="mt-2.5 space-y-2">
                    {dayPosts.map((p) => (
                      <div 
                        key={p.id}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 space-y-1.5 shadow-sm group hover:border-purple-500 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-purple-300 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {p.scheduledTime}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            p.status === 'live' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            {p.status}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold text-white line-clamp-1">{p.campaignName}</p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                          <div className="flex items-center gap-1">
                            {p.platforms.map(plat => (
                              <span key={plat} className="text-[10px]" title={plat}>
                                {plat === 'instagram' ? '📸' : plat === 'tiktok' ? '🎵' : plat === 'youtube' ? '▶️' : '📘'}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => handlePublishNow(p.id)}
                            title="Publish immediately"
                            className="text-[9px] text-emerald-400 hover:underline font-bold"
                          >
                            Push Live
                          </button>
                        </div>
                      </div>
                    ))}

                    {dayPosts.length === 0 && (
                      <div className="text-center py-6 text-[10px] text-slate-600">
                        No drops queued
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNewDate(col.full);
                    setIsScheduleModalOpen(true);
                  }}
                  className="mt-3 w-full py-1 text-center rounded-lg bg-slate-900/60 hover:bg-slate-800 border border-dashed border-slate-800 hover:border-slate-700 text-[10px] text-slate-400 transition-colors"
                >
                  + Add Post
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* View 2: Detailed Queue List */
        <div className="space-y-3">
          {posts.map((post) => (
            <div 
              key={post.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={post.thumbnailUrl}
                  alt=""
                  className="w-14 h-18 object-cover rounded-xl border border-slate-700 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{post.campaignName}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      post.status === 'live' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {post.status}
                    </span>
                    {post.engagementScore && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-mono">
                        <Flame className="w-2.5 h-2.5" />
                        {post.engagementScore}% Viral Index
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{post.caption}</p>

                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {post.scheduledDate} at {post.scheduledTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      Target:
                      {post.platforms.map(pl => (
                        <span key={pl} className="text-xs">
                          {pl === 'instagram' ? '📸' : pl === 'tiktok' ? '🎵' : pl === 'youtube' ? '▶️' : '📘'}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {post.status !== 'live' && (
                  <button
                    onClick={() => handlePublishNow(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                  >
                    <Send className="w-3 h-3" />
                    Push Live Now
                  </button>
                )}
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                  title="Remove from schedule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Drop Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Queue New Reel Drop</h3>
            <p className="text-xs text-slate-400 mb-4">Set time and target distribution accounts</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Broadcast Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Broadcast Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setNewTime('18:30')}
                  className="mt-1.5 text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  ⚡ Use Algorithmic Peak Time (18:30 / 6:30 PM)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Platforms</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'instagram', label: 'Instagram Reels', icon: '📸' },
                    { id: 'tiktok', label: 'TikTok Video', icon: '🎵' },
                    { id: 'youtube', label: 'YouTube Shorts', icon: '▶️' },
                    { id: 'facebook', label: 'Facebook Watch', icon: '📘' }
                  ].map(plat => (
                    <label
                      key={plat.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={targetPlatforms[plat.id] || false}
                        onChange={(e) => setTargetPlatforms({ ...targetPlatforms, [plat.id]: e.target.checked })}
                        className="rounded accent-purple-500"
                      />
                      <span>{plat.icon}</span>
                      <span className="text-[11px] font-medium text-slate-200">{plat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSchedule}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold shadow-md shadow-purple-500/30"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
