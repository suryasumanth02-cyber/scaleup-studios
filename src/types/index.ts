export type NicheType = 
  | 'sports' 
  | 'fitness' 
  | 'restaurant' 
  | 'realestate' 
  | 'ecommerce' 
  | 'services'
  | 'cricket';

export type AvatarGesture = 
  | 'open_palms'
  | 'pointing_cta'
  | 'pointing_screen'
  | 'thumbs_up'
  | 'precision_pinch'
  | 'chest_heart';

export interface Scene {
  id: number;
  duration: number; // in seconds
  stage: 'Hook' | 'Problem' | 'Solution' | 'Social Proof' | 'Call to Action';
  caption: string;
  voiceText: string;
  visualDescription: string;
  bgGradient: string;
  bRollType: 'action' | 'product' | 'testimonial' | 'offer';
  mediaUrl?: string;
  gesture?: AvatarGesture;
}

export interface AvatarConfig {
  id: string;
  name: string;
  title: string;
  nicheMatch: string;
  avatarUrl: string;
  videoUrl?: string;
  voiceName: string;
  accent: string;
  framing: 'fullscreen' | 'bubble' | 'split';
  bio: string;
  category: 'human' | 'virtual' | 'custom';
  avatarType: 'human_presenter' | '3d_mascot' | 'cyber_bot' | 'pixar_character' | 'vtuber' | 'robot' | 'custom_client';
  themeColor: string;
  activeGesture?: AvatarGesture;
  gestureIntensity?: 'subtle' | 'expressive' | 'energetic';
}

export interface ConnectedSocialAccount {
  id: 'instagram' | 'tiktok' | 'facebook' | 'youtube';
  platformName: string;
  handle: string;
  accountName: string;
  profileUrl: string;
  isConnected: boolean;
  followersCount: string;
  authType: string;
  icon: string;
  color: string;
}

export interface Campaign {
  id: string;
  businessName: string;
  niche: NicheType;
  offer: string;
  targetAudience: string;
  tone: 'energetic' | 'authoritative' | 'friendly' | 'urgent';
  destinationUrl: string;
  scenes: Scene[];
  qrCodeUrl: string;
  trackingShortlink: string;
  selectedPlatforms: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
  status: 'draft' | 'rendered' | 'published';
  avatar: AvatarConfig;
  stats: {
    views: number;
    scans: number;
    clicks: number;
    conversions: number;
  };
}

export interface TrackingLog {
  id: string;
  timestamp: string;
  type: 'qr_scan' | 'link_click' | 'cookie_created' | 'lead_conversion';
  source: 'Instagram Reel' | 'TikTok Video' | 'Facebook Watch' | 'YouTube Short' | 'QR Code Direct';
  device: 'iPhone 15 Pro' | 'Samsung S24' | 'Google Pixel 8' | 'iPad' | 'Desktop';
  location: string;
  details: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  businessName: string;
  role: string;
  niche: NicheType;
  avatarUrl?: string;
  plan: 'Starter' | 'Pro Studio' | 'Enterprise';
  createdAt: string;
  connectedAccountsCount?: number;
}

export interface ScheduledPost {
  id: string;
  campaignId: string;
  campaignName: string;
  businessName: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  platforms: ('instagram' | 'tiktok' | 'facebook' | 'youtube')[];
  status: 'queued' | 'optimizing' | 'scheduled' | 'live';
  thumbnailUrl: string;
  caption: string;
  engagementScore?: number;
}

