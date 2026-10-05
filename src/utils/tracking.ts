import QRCode from 'qrcode';
import { TrackingLog } from '../types';

export async function generateQrCodeDataUrl(url: string, color = '#ffffff'): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 320,
      margin: 1,
      color: {
        dark: '#000000',
        light: color,
      },
      errorCorrectionLevel: 'H',
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

export function buildTrackingUrl(
  baseUrl: string,
  campaignId: string,
  platform: string,
  placement: string = 'video_outro_qr'
): string {
  const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
  url.searchParams.set('utm_source', platform.toLowerCase());
  url.searchParams.set('utm_medium', 'ai_video');
  url.searchParams.set('utm_campaign', campaignId);
  url.searchParams.set('utm_content', placement);
  url.searchParams.set('ref', 'scaleup_studios');
  return url.toString();
}

const STORAGE_KEY = 'scaleup_tracking_logs';

export function getStoredLogs(): TrackingLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultInitialLogs();
    return JSON.parse(raw);
  } catch {
    return getDefaultInitialLogs();
  }
}

export function saveStoredLogs(logs: TrackingLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs', err);
  }
}

export function recordNewEvent(
  type: TrackingLog['type'],
  source: TrackingLog['source'],
  details: string
): TrackingLog {
  const devices: TrackingLog['device'][] = [
    'iPhone 15 Pro',
    'Samsung S24',
    'Google Pixel 8',
    'iPad',
  ];
  const locations = [
    'London, UK',
    'Manchester, UK',
    'Birmingham, UK',
    'Sydney, AU',
    'Melbourne, AU',
    'Mumbai, IN',
    'New York, US',
  ];

  const randomDevice = devices[Math.floor(Math.random() * devices.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];

  const newLog: TrackingLog = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    type,
    source,
    device: randomDevice,
    location: randomLocation,
    details,
  };

  // Set first-party tracking cookie in browser to demonstrate cookie tracking!
  try {
    const cookieValue = `scaleup_vid_id=${newLog.id}&src=${encodeURIComponent(source)}&t=${Date.now()}`;
    document.cookie = `scaleup_attribution=${encodeURIComponent(cookieValue)}; path=/; max-age=2592000; SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie set error:', e);
  }

  const logs = getStoredLogs();
  const updated = [newLog, ...logs.slice(0, 49)];
  saveStoredLogs(updated);

  return newLog;
}

function getDefaultInitialLogs(): TrackingLog[] {
  return [
    {
      id: 'ev_101',
      timestamp: '17:18:24',
      type: 'qr_scan',
      source: 'Instagram Reel',
      device: 'iPhone 15 Pro',
      location: 'London, UK',
      details: 'Scanned Dynamic QR code from Outro Screen (Session Cookie dropped: scaleup_attr_894)'
    },
    {
      id: 'ev_102',
      timestamp: '17:15:10',
      type: 'lead_conversion',
      source: 'TikTok Video',
      device: 'Samsung S24',
      location: 'Birmingham, UK',
      details: 'Customer completed assessment booking form ($180 estimated value)'
    },
    {
      id: 'ev_103',
      timestamp: '17:09:44',
      type: 'link_click',
      source: 'YouTube Short',
      device: 'Google Pixel 8',
      location: 'Manchester, UK',
      details: 'Tapped bio link: utm_campaign=sports_academy_trials'
    },
    {
      id: 'ev_104',
      timestamp: '16:54:19',
      type: 'cookie_created',
      source: 'Facebook Watch',
      device: 'iPhone 15 Pro',
      location: 'Leeds, UK',
      details: 'First-party cookie registered (30-day attribution window initiated)'
    }
  ];
}
