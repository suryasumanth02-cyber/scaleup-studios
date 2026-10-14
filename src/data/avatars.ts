import { AvatarConfig } from '../types';

export const HUMAN_AVATARS: AvatarConfig[] = [
  {
    id: 'coach_marcus',
    name: 'Coach Marcus',
    title: 'Head Athletic Director & Coach',
    nicheMatch: 'Sports / Athletics & Fitness',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/videos/presenter_coach.mp4',
    voiceName: 'Marcus (British English, Athletic & Punchy)',
    accent: 'British Coach',
    framing: 'fullscreen',
    category: 'human',
    avatarType: 'human_presenter',
    themeColor: '#10b981',
    bio: 'Photorealistic athletic coach in a sports polo. Direct eye contact, punchy cadence, and broadcast authority.'
  },
  {
    id: 'sarah_mitchell',
    name: 'Sarah Mitchell',
    title: 'Executive Presenter & Advisor',
    nicheMatch: 'Real Estate / Corporate & B2B',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/videos/presenter_female.mp4',
    voiceName: 'Sarah (American, Clear & Professional)',
    accent: 'American Executive',
    framing: 'fullscreen',
    category: 'human',
    avatarType: 'human_presenter',
    themeColor: '#3b82f6',
    bio: 'Polished executive anchor in modern blazer. Ideal for luxury real estate, corporate pitches, and high-ticket sales.'
  },
  {
    id: 'alex_rivera',
    name: 'Alex Rivera',
    title: 'UGC Creator & Brand Host',
    nicheMatch: 'E-Commerce & DTC Brands',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/videos/presenter_young_male.mp4',
    voiceName: 'Alex (Casual & Relatable)',
    accent: 'Modern Influencer',
    framing: 'fullscreen',
    category: 'human',
    avatarType: 'human_presenter',
    themeColor: '#f59e0b',
    bio: 'Authentic TikTok/Reels UGC creator. Speaks directly to camera like a friend sharing a personal recommendation.'
  },
  {
    id: 'elena_rostova',
    name: 'Elena Rostova',
    title: 'Hospitality & Culinary Lead',
    nicheMatch: 'Restaurant, Cafe & Food',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/videos/presenter_female.mp4',
    voiceName: 'Elena (Warm & Engaging)',
    accent: 'Warm Conversational',
    framing: 'fullscreen',
    category: 'human',
    avatarType: 'human_presenter',
    themeColor: '#ec4899',
    bio: 'Warm, inviting host style. Perfect for dining showcases, boutique experiences, and event promos.'
  },
  {
    id: 'dr_vikram',
    name: 'Vikram Patel',
    title: 'Strategic Performance Specialist',
    nicheMatch: 'Academy Trials & Consultation',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/videos/presenter_male.mp4',
    voiceName: 'Vikram (Authoritative & Trustworthy)',
    accent: 'Authoritative / Global',
    framing: 'fullscreen',
    category: 'human',
    avatarType: 'human_presenter',
    themeColor: '#8b5cf6',
    bio: 'Authoritative, calm, and trustworthy specialist. Excellent for academy trials, coaching programs, and clinical services.'
  },
  {
    id: 'custom_captain_clone',
    name: 'Sports Team Captain Clone',
    title: 'Custom Human Digital Twin',
    nicheMatch: 'Sports Team Captain / Founder',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/videos/presenter_host.mp4',
    voiceName: 'Captain ElevenLabs Voice Clone',
    accent: 'Personal Voice Clone',
    framing: 'fullscreen',
    category: 'human',
    avatarType: 'human_presenter',
    themeColor: '#06b6d4',
    bio: 'Photorealistic human digital twin of your sports team captain cloned from video footage.'
  }
];

export const VIRTUAL_AVATARS: AvatarConfig[] = [
  {
    id: 'sports_champ_3d',
    name: 'Sports Champ 3D',
    title: '3D Animated Sports Mascot',
    nicheMatch: 'Sports / Athletics & Youth Academy',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    voiceName: 'Mascot Hero (Punchy Character Voice)',
    accent: 'Heroic Mascot Tone',
    framing: 'fullscreen',
    category: 'virtual',
    avatarType: '3d_mascot',
    themeColor: '#10b981',
    bio: '3D Pixar-style animated athletic character wearing sports colors and team jersey.'
  },
  {
    id: 'cyber_bot_x1',
    name: 'CyberBot X-1',
    title: 'Holographic Futuristic Android',
    nicheMatch: 'Tech / Modern Brands & Services',
    avatarUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    voiceName: 'Cyber AI (Synthetic & Crisp)',
    accent: 'Futuristic AI Voice',
    framing: 'fullscreen',
    category: 'virtual',
    avatarType: 'cyber_bot',
    themeColor: '#06b6d4',
    bio: 'Futuristic cybernetic avatar with digital LED visor and glowing holographic HUD.'
  },
  {
    id: 'blitz_toon_3d',
    name: 'Blitz Fox 3D',
    title: 'Pixar-Style 3D Character Mascot',
    nicheMatch: 'Fitness, Health & Viral TikTok',
    avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    voiceName: 'Blitz (Youthful, Upbeat & Viral)',
    accent: 'Animated Cartoon Voice',
    framing: 'bubble',
    category: 'virtual',
    avatarType: 'pixar_character',
    themeColor: '#f59e0b',
    bio: 'Stylized 3D animated character in sports streetwear with high-retention reactions.'
  }
];

export const AVATARS: AvatarConfig[] = [...HUMAN_AVATARS, ...VIRTUAL_AVATARS];

export const DEFAULT_AVATAR = HUMAN_AVATARS[0]; // Coach Marcus by default!
