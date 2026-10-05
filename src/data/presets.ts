import { Campaign, NicheType } from '../types';

export interface PresetNiche {
  id: NicheType;
  label: string;
  icon: string;
  defaultBusiness: string;
  defaultOffer: string;
  defaultDestination: string;
  audience: string;
  scenes: Campaign['scenes'];
}

export const NICHE_KEYS: NicheType[] = ['sports', 'fitness', 'restaurant', 'realestate', 'ecommerce', 'services'];

const basePresets: Record<'sports' | 'fitness' | 'restaurant' | 'realestate' | 'ecommerce' | 'services', PresetNiche> = {
  sports: {
    id: 'sports',
    label: 'Sports & Athletic Academy',
    icon: '🏅',
    defaultBusiness: 'Premier Sports Academy',
    defaultOffer: 'Free 1-on-1 Elite Athletic Assessment + 20% Off Coaching',
    defaultDestination: 'https://sportsacademy.club/register',
    audience: 'Aspiring athletes, sports players, and league competitors aged 14-35',
    scenes: [
      {
        id: 1,
        duration: 4,
        stage: 'Hook',
        caption: 'Want to boost your athletic speed & power or dominate your competition this season?',
        voiceText: 'Want to boost your athletic speed and power or finally dominate your competition this sports season?',
        visualDescription: 'Dynamic slow-motion athletic sprint & pro athlete performance under stadium floodlights',
        mediaUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-amber-600/40 via-red-900/60 to-black',
        bRollType: 'action'
      },
      {
        id: 2,
        duration: 5,
        stage: 'Problem',
        caption: 'Most athletes train for hours without personalized biomechanics feedback.',
        voiceText: 'Most athletes practice for hours every week, but repeat the exact same technical flaws week after week.',
        visualDescription: 'Close-up of sports training session, high-speed camera tracking footwork and form',
        mediaUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-blue-900/40 via-slate-900/80 to-black',
        bRollType: 'action'
      },
      {
        id: 3,
        duration: 6,
        stage: 'Solution',
        caption: 'At Premier Sports Academy, our certified coaches use AI speed analytics & pro drills.',
        voiceText: 'At Premier Sports Academy, certified coaches combine AI movement analytics with state-of-the-art pro athletic drills.',
        visualDescription: 'Coach reviewing tablet screen with athlete, showing movement metrics and speed angle',
        mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-emerald-900/50 via-teal-950 to-black',
        bRollType: 'product'
      },
      {
        id: 4,
        duration: 5,
        stage: 'Social Proof',
        caption: 'Over 140 academy athletes drafted into top premier leagues and tournaments.',
        voiceText: 'Over 140 academy athletes have earned spots in top premier leagues and tournaments this year alone.',
        visualDescription: 'Trophy cabinet and celebrating championship sports team holding the season trophy',
        mediaUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-purple-900/40 via-indigo-950 to-black',
        bRollType: 'testimonial'
      },
      {
        id: 5,
        duration: 6,
        stage: 'Call to Action',
        caption: 'SCAN THE QR CODE on screen right now to claim your Free Assessment!',
        voiceText: 'Scan the QR code on screen right now or tap the link below to claim your free assessment session before slots fill up!',
        visualDescription: 'Dynamic animated QR code with neon pulse border, countdown timer, and claim button',
        mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-amber-500/30 via-emerald-950 to-black',
        bRollType: 'offer'
      }
    ]
  },
  fitness: {
    id: 'fitness',
    label: 'Fitness & Health Club',
    icon: '💪',
    defaultBusiness: 'Apex Fitness Club',
    defaultOffer: 'First Month for $1 + Free Personal Fitness Strategy Session',
    defaultDestination: 'https://apexfitness.com/promo',
    audience: 'Busy professionals and fitness enthusiasts in the local metro area',
    scenes: [
      {
        id: 1,
        duration: 4,
        stage: 'Hook',
        caption: 'Tired of generic workout plans that give you zero fitness results?',
        voiceText: 'Tired of paying for fitness memberships that give you zero real results?',
        visualDescription: 'Athlete tying shoes, walking into modern fitness club with heavy dumbbells and barbell weights',
        mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-cyan-900/50 via-blue-950 to-black',
        bRollType: 'action'
      },
      {
        id: 2,
        duration: 5,
        stage: 'Problem',
        caption: 'Crowded facilities, generic plans, and no accountability keep you stuck.',
        voiceText: 'Crowded facilities, generic workout plans, and zero accountability will keep you spinning your wheels.',
        visualDescription: 'Fast-paced clips of crowded fitness floors and frustrating routine logs',
        mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-red-950/60 via-slate-900 to-black',
        bRollType: 'action'
      },
      {
        id: 3,
        duration: 6,
        stage: 'Solution',
        caption: 'Apex Fitness combines elite coaching, custom nutrition & 24/7 VIP access.',
        voiceText: 'Apex Fitness gives you custom nutrition blueprints, dedicated 1-on-1 coaches, and 24/7 luxury facilities.',
        visualDescription: 'Trainer cheering client on sled push, high-fiving, showing biometric progress chart',
        mediaUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-emerald-900/50 via-slate-950 to-black',
        bRollType: 'product'
      },
      {
        id: 4,
        duration: 5,
        stage: 'Social Proof',
        caption: 'Over 850 members reached their fitness transformation in their first 90 days.',
        voiceText: 'Over 850 local members have completely transformed their fitness in their first 90 days.',
        visualDescription: 'Split screen transformation success stories and smiling fitness club members',
        mediaUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-blue-900/50 via-indigo-950 to-black',
        bRollType: 'testimonial'
      },
      {
        id: 5,
        duration: 6,
        stage: 'Call to Action',
        caption: 'Scan this code to grab your $1 First Month VIP Fitness Pass today!',
        voiceText: 'Scan the QR code right on your screen to lock in your 1 dollar first month fitness pass today!',
        visualDescription: 'Bold scannable QR code pulsing in the center with swipe-up arrows and badge',
        mediaUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-emerald-600/40 via-cyan-950 to-black',
        bRollType: 'offer'
      }
    ]
  },
  restaurant: {
    id: 'restaurant',
    label: 'Restaurant & Cafe',
    icon: '🍕',
    defaultBusiness: 'Artisan Woodfire Kitchen',
    defaultOffer: 'Buy 1 Signature Pizza, Get 1 Free This Weekend',
    defaultDestination: 'https://artisanwoodfire.com/deal',
    audience: 'Foodies, families, and couples looking for the best dinner spot',
    scenes: [
      {
        id: 1,
        duration: 4,
        stage: 'Hook',
        caption: 'Craving authentic 72-hour sourdough pizza with melted buffalo mozzarella?',
        voiceText: 'Craving authentic 72-hour slow fermented sourdough pizza with sizzling buffalo mozzarella?',
        visualDescription: 'Crispy blistered pizza pulled from glowing 900-degree brick oven with steam rising',
        mediaUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-orange-900/60 via-amber-950 to-black',
        bRollType: 'product'
      },
      {
        id: 2,
        duration: 5,
        stage: 'Problem',
        caption: 'Frozen dough and greasy fast-food delivery always ruins date night.',
        voiceText: 'Greasy delivery boxes and frozen chain pizza always ruin dinner and date night.',
        visualDescription: 'Soggy cardboard takeout box compared against freshly hand-stretched dough',
        mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-stone-900/70 via-stone-950 to-black',
        bRollType: 'action'
      },
      {
        id: 3,
        duration: 6,
        stage: 'Solution',
        caption: 'We craft every pie with San Marzano tomatoes, fresh basil & imported olive oil.',
        voiceText: 'Every pie at Artisan Kitchen is handcrafted with San Marzano tomatoes, organic basil, and imported olive oil.',
        visualDescription: 'Chef drizzling fragrant extra virgin olive oil over fresh pizza and grating parmesan cheese',
        mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-red-900/50 via-amber-950 to-black',
        bRollType: 'product'
      },
      {
        id: 4,
        duration: 5,
        stage: 'Social Proof',
        caption: 'Voted #1 Best Artisan Pizzeria in the city for 3 years running.',
        voiceText: 'Voted number one best woodfire pizzeria in the city with over 2,000 five-star reviews.',
        visualDescription: 'Lively cozy dining room with clinking glasses, laughing patrons, and glowing warm string lights',
        mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-amber-900/50 via-stone-950 to-black',
        bRollType: 'testimonial'
      },
      {
        id: 5,
        duration: 6,
        stage: 'Call to Action',
        caption: 'Scan this code to unlock our Buy-1-Get-1-Free voucher for this weekend!',
        voiceText: 'Scan this QR code with your phone camera right now to claim your Buy 1 Get 1 Free pizza voucher!',
        visualDescription: 'High contrast QR code with delicious food graphics and voucher bar code graphic',
        mediaUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-red-600/30 via-orange-950 to-black',
        bRollType: 'offer'
      }
    ]
  },
  realestate: {
    id: 'realestate',
    label: 'Real Estate Agency',
    icon: '🏡',
    defaultBusiness: 'Apex Luxury Properties',
    defaultOffer: 'Free Off-Market Luxury Listings Guide + Private VIP Tour',
    defaultDestination: 'https://apexluxury.com/vip-tours',
    audience: 'High-net-worth buyers, investors, and homeowners looking to upgrade',
    scenes: [
      {
        id: 1,
        duration: 4,
        stage: 'Hook',
        caption: 'Take a look inside this $2.4M waterfront penthouse you cannot find on Zillow.',
        voiceText: 'Take a private tour inside this 2.4 million dollar waterfront penthouse you cannot find on public listings.',
        visualDescription: 'Drone sweeping past floor-to-ceiling glass windows overlooking ocean skyline at sunset',
        mediaUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-blue-900/60 via-indigo-950 to-black',
        bRollType: 'action'
      },
      {
        id: 2,
        duration: 5,
        stage: 'Problem',
        caption: 'The best properties sell before they ever get listed publicly.',
        voiceText: 'The most prestigious luxury properties sell through private networks before they ever hit public listing sites.',
        visualDescription: 'Elegant marble foyer, floating staircase, and designer Italian kitchen',
        mediaUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-slate-900/60 via-slate-950 to-black',
        bRollType: 'product'
      },
      {
        id: 3,
        duration: 6,
        stage: 'Solution',
        caption: 'Our private client network gives you exclusive first-look access.',
        voiceText: 'Apex Luxury Properties gives you direct, off-market access to pre-construction and private seller portfolios.',
        visualDescription: 'Infinity pool overlooking twilight horizon with modern firepit lounge',
        mediaUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-cyan-900/40 via-blue-950 to-black',
        bRollType: 'product'
      },
      {
        id: 4,
        duration: 5,
        stage: 'Social Proof',
        caption: 'Over $120M in private transactions closed with 100% client confidentiality.',
        voiceText: 'Over 120 million dollars in private transactions handled with absolute discretion.',
        visualDescription: 'Satisfied couple signing closing documents in sleek modern office overlooking downtown',
        mediaUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-emerald-900/40 via-slate-950 to-black',
        bRollType: 'testimonial'
      },
      {
        id: 5,
        duration: 6,
        stage: 'Call to Action',
        caption: 'Scan this QR code to download the complete private property brochure & pricing.',
        voiceText: 'Scan the QR code on your screen now to download the private brochure and floor plans.',
        visualDescription: 'Minimalist luxury aesthetic QR code frame with sleek gold trim and instant download CTA',
        mediaUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-amber-600/30 via-slate-950 to-black',
        bRollType: 'offer'
      }
    ]
  },
  ecommerce: {
    id: 'ecommerce',
    label: 'E-Commerce / DTC Brand',
    icon: '📦',
    defaultBusiness: 'Aura Glow Skincare',
    defaultOffer: 'Get 40% Off the Viral Vitamin C + Peptide Duo',
    defaultDestination: 'https://auraglow.shop/bundle',
    audience: 'Beauty enthusiasts, skincare shoppers, and gift buyers',
    scenes: [
      {
        id: 1,
        duration: 4,
        stage: 'Hook',
        caption: 'Why is this peptide serum selling out in 14 countries in under 3 hours?',
        voiceText: 'Why is this peptide serum selling out in 14 countries in under three hours?',
        visualDescription: 'Dropper pulling golden iridescent serum, dropping onto radiant, dewy cheekbone',
        mediaUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-rose-900/60 via-purple-950 to-black',
        bRollType: 'product'
      },
      {
        id: 2,
        duration: 5,
        stage: 'Problem',
        caption: 'Most anti-aging creams sit on top of your skin without penetrating.',
        voiceText: 'Most commercial serums use cheap fillers that just sit on your skin without penetrating the moisture barrier.',
        visualDescription: 'Scientific 3D animation showing molecular absorption through cellular layers',
        mediaUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-violet-950/70 via-slate-950 to-black',
        bRollType: 'action'
      },
      {
        id: 3,
        duration: 6,
        stage: 'Solution',
        caption: 'Our micro-encapsulated formula delivers active hydration deep into the dermis.',
        voiceText: 'Our patented micro-encapsulated formula delivers pure botanical peptides right where your skin needs it most.',
        visualDescription: 'Clean laboratory aesthetic with glass beakers, botanical extracts, and rose petals',
        mediaUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-pink-900/50 via-rose-950 to-black',
        bRollType: 'product'
      },
      {
        id: 4,
        duration: 5,
        stage: 'Social Proof',
        caption: '98% of users reported brighter, firmer skin in just 14 days.',
        voiceText: 'Ninety-eight percent of clinical trial participants noticed visibly brighter, firmer skin in just two weeks.',
        visualDescription: 'Customer unboxing with authentic selfie camera reactions and 5-star review quotes',
        mediaUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-amber-900/40 via-purple-950 to-black',
        bRollType: 'testimonial'
      },
      {
        id: 5,
        duration: 6,
        stage: 'Call to Action',
        caption: 'Scan this code to claim 40% off your bundle before inventory runs out!',
        voiceText: 'Scan the code on screen now to claim 40% off your bundle before our limited restock sells out completely!',
        visualDescription: 'Flashing discount badge, dynamic QR code with live inventory ticker',
        mediaUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-rose-600/40 via-purple-950 to-black',
        bRollType: 'offer'
      }
    ]
  },
  services: {
    id: 'services',
    label: 'Local Services / Auto / HVAC',
    icon: '🛠️',
    defaultBusiness: 'ProTech Home Services',
    defaultOffer: '$49 Complete Seasonal AC & Heating Tune-Up Inspection',
    defaultDestination: 'https://protechservices.com/tuneup',
    audience: 'Homeowners looking for reliable, licensed local technicians',
    scenes: [
      {
        id: 1,
        duration: 4,
        stage: 'Hook',
        caption: 'Hearing this weird rattle when your AC or furnace kicks on?',
        voiceText: 'Hearing a strange clicking or rattling noise whenever your AC kicks on?',
        visualDescription: 'Modern thermostat display flashing warning icon, technician inspecting modern home unit',
        mediaUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-blue-900/60 via-slate-950 to-black',
        bRollType: 'action'
      },
      {
        id: 2,
        duration: 5,
        stage: 'Problem',
        caption: 'Ignoring small noises can lead to a $3,500 emergency breakdown in peak season.',
        voiceText: 'Ignoring small system rattles can suddenly cause a thirty-five hundred dollar system breakdown in the middle of summer.',
        visualDescription: 'Thermal camera imaging showing heat loss and worn mechanical motor bearings',
        mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-red-950/70 via-stone-950 to-black',
        bRollType: 'action'
      },
      {
        id: 3,
        duration: 6,
        stage: 'Solution',
        caption: 'ProTech licensed technicians perform a 28-point precision inspection.',
        voiceText: 'ProTech licensed technicians perform a thorough 28-point inspection to ensure your system runs at peak efficiency.',
        visualDescription: 'Friendly technician in clean uniform showing digital diagnostic results on iPad',
        mediaUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-emerald-900/50 via-slate-950 to-black',
        bRollType: 'product'
      },
      {
        id: 4,
        duration: 5,
        stage: 'Social Proof',
        caption: 'Over 4,500 happy homeowners and a 4.9-star rating on Google.',
        voiceText: 'Over 4,500 local homeowners trust ProTech, backed by our 100% satisfaction guarantee.',
        visualDescription: 'Family relaxing in cool comfortable living room giving thumbs up to technician',
        mediaUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-cyan-900/50 via-slate-950 to-black',
        bRollType: 'testimonial'
      },
      {
        id: 5,
        duration: 6,
        stage: 'Call to Action',
        caption: 'Scan this code to book your $49 inspection with zero diagnostic fee!',
        voiceText: 'Scan this QR code with your smartphone right now to schedule your 49-dollar tune-up today!',
        visualDescription: 'Pulsing QR code with appointment booking calendar badge and instant dispatch icon',
        mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1080&q=85',
        bgGradient: 'from-blue-600/40 via-slate-950 to-black',
        bRollType: 'offer'
      }
    ]
  }
};

// PRESETS export with backwards-compatibility alias: cricket maps to sports
export const PRESETS: Record<NicheType, PresetNiche> = {
  ...basePresets,
  cricket: basePresets.sports
};

