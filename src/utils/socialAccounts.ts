import { ConnectedSocialAccount } from '../types';

const STORAGE_KEY = 'scaleup_social_accounts_v1';

export const DEFAULT_ACCOUNTS: ConnectedSocialAccount[] = [
  {
    id: 'instagram',
    platformName: 'Instagram Reels',
    handle: '@my_business_reels',
    accountName: 'Instagram Business Profile',
    profileUrl: 'https://instagram.com/',
    isConnected: true,
    followersCount: '12.4K Followers',
    authType: 'Meta Graph API v19 (OAuth 2.0)',
    icon: '📸',
    color: 'from-pink-500 to-purple-600',
  },
  {
    id: 'tiktok',
    platformName: 'TikTok Video',
    handle: '@my_business_tiktok',
    accountName: 'TikTok Creator Account',
    profileUrl: 'https://tiktok.com/@',
    isConnected: true,
    followersCount: '28.1K Followers',
    authType: 'TikTok Content Posting API (OAuth 2.0)',
    icon: '🎵',
    color: 'from-cyan-400 to-rose-500',
  },
  {
    id: 'facebook',
    platformName: 'Facebook Pages & Reels',
    handle: 'My Business Official',
    accountName: 'Facebook Business Page',
    profileUrl: 'https://facebook.com/',
    isConnected: true,
    followersCount: '8.9K Page Likes',
    authType: 'Meta Pages API (Token Active)',
    icon: '📘',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'youtube',
    platformName: 'YouTube Shorts',
    handle: '@MyBusinessChannel',
    accountName: 'YouTube Brand Channel',
    profileUrl: 'https://youtube.com/@',
    isConnected: true,
    followersCount: '4.2K Subscribers',
    authType: 'YouTube Data API v3 (Google OAuth)',
    icon: '▶️',
    color: 'from-red-600 to-rose-700',
  },
];

export function getStoredSocialAccounts(): ConnectedSocialAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 4) return parsed;
    return DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function saveStoredSocialAccounts(accounts: ConnectedSocialAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save social accounts', err);
  }
}
