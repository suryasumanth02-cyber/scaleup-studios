import { Scene, NicheType } from '../types';

export interface AiRewriteOptions {
  style: 'punchy' | 'urgent' | 'casual' | 'professional' | 'curiosity' | 'custom';
  customInstruction?: string;
  apiKey?: string;
}

export const AI_STYLE_PRESETS = [
  { id: 'punchy', label: '⚡ Viral & High Energy', desc: 'Short, snappy, punchy words designed to stop the scroll' },
  { id: 'urgent', label: '⏰ Urgent FOMO & Scarcity', desc: 'Adds time sensitivity, limited spots, or ending discounts' },
  { id: 'casual', label: '💬 Casual & Relatable', desc: 'Friendly, peer-to-peer tone (like a friend giving a tip)' },
  { id: 'professional', label: '👔 Authoritative & Expert', desc: 'High trust, data-backed, confident expertise' },
  { id: 'curiosity', label: '👀 Curiosity Gap', desc: 'Opens a loop that makes viewers need to watch to the end' },
] as const;

/**
 * Call real Google Gemini API if user has an API Key
 */
async function callGeminiApi(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });
    if (!res.ok) {
      console.warn('Gemini API call failed with status:', res.status);
      return null;
    }
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    console.warn('Gemini API fetch error:', err);
    return null;
  }
}

/**
 * Rewrite a single scene using AI (Gemini or intelligent synthesis)
 */
export async function rewriteSceneContent(
  scene: Scene,
  businessName: string,
  offer: string,
  options: AiRewriteOptions
): Promise<{ caption: string; voiceText: string; visualDescription: string }> {
  // If API key is available, call Gemini API
  if (options.apiKey && options.apiKey.trim().length > 10) {
    const prompt = `You are an elite short-form video copywriter (TikTok, Instagram Reels, YouTube Shorts).
Business: "${businessName}"
Current Offer: "${offer}"
Scene Type: "${scene.stage}"
Current On-Screen Caption: "${scene.caption}"
Current Voiceover Script: "${scene.voiceText}"
Current Visual Prompt: "${scene.visualDescription}"

Instruction: Rewrite this scene to make it ${options.style}. ${options.customInstruction ? `Specific user instruction: "${options.customInstruction}".` : ''}
Keep the caption under 15 words (bold, kinetic).
Keep the voiceover script under 25 words (natural speech).
Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "caption": "short on-screen caption",
  "voiceText": "spoken voiceover text",
  "visualDescription": "cinematic b-roll visual description"
}`;

    const geminiResult = await callGeminiApi(prompt, options.apiKey.trim());
    if (geminiResult) {
      try {
        const cleaned = geminiResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.caption && parsed.voiceText) {
          return {
            caption: parsed.caption,
            voiceText: parsed.voiceText,
            visualDescription: parsed.visualDescription || scene.visualDescription,
          };
        }
      } catch (e) {
        console.warn('Failed to parse Gemini JSON output, falling back to smart engine', e);
      }
    }
  }

  // Intelligent Built-In Creative Engine (works out-of-the-box instantly)
  return simulateSmartRewrite(scene, businessName, offer, options);
}

function simulateSmartRewrite(
  scene: Scene,
  businessName: string,
  offer: string,
  options: AiRewriteOptions
): { caption: string; voiceText: string; visualDescription: string } {
  const { style, customInstruction } = options;
  const stage = scene.stage;

  if (customInstruction && customInstruction.trim().length > 0) {
    return {
      caption: `🔥 ${customInstruction.slice(0, 50)}...`,
      voiceText: `Here is the insider secret: ${customInstruction}. Experience the difference with ${businessName}.`,
      visualDescription: `Dynamic close-up highlighting ${customInstruction.slice(0, 40)}, fast zoom and cinematic motion blur.`
    };
  }

  switch (style) {
    case 'urgent':
      if (stage === 'Hook') {
        return {
          caption: '⚠️ STOP SCROLLING: This exclusive offer ends in 48 hours!',
          voiceText: `Warning: If you are watching this right now, you have less than 48 hours to claim this exclusive pass from ${businessName}.`,
          visualDescription: 'Flashing red neon warning badge, countdown timer ticking down with rapid glitch effect.'
        };
      } else if (stage === 'Call to Action') {
        return {
          caption: `🚨 ONLY 7 SPOTS LEFT: Scan code now before ${offer} expires!`,
          voiceText: `There are literally only seven slots remaining. Point your phone camera at the QR code on screen right now!`,
          visualDescription: 'Pulsing emergency red-and-gold neon QR code with live countdown timer ticking to zero.'
        };
      } else {
        return {
          caption: `⏰ Limited availability: Don't wait until next season to fix this!`,
          voiceText: `Slots fill up every single month. If you wait, you will be on the waitlist until next season.`,
          visualDescription: 'Calendar booking calendar rapidly filling up with confirmed badges.'
        };
      }

    case 'punchy':
      if (stage === 'Hook') {
        return {
          caption: '99% of people are doing this completely WRONG.',
          voiceText: 'Ninety-nine percent of people are doing this completely wrong. Here is what the top one percent actually do.',
          visualDescription: 'Rapid 3-cut montage of intense action, sudden screen shake, and high-contrast flash.'
        };
      } else if (stage === 'Call to Action') {
        return {
          caption: 'SCAN NOW. Don’t miss out on this deal.',
          voiceText: 'Scan this QR code right now with your phone camera. Tap in before it is gone.',
          visualDescription: 'High-contrast bold monochrome QR code with green laser sweep animation.'
        };
      } else {
        return {
          caption: `Zero fluff. Pure results with ${businessName}.`,
          voiceText: `No wasted hours. Just proven, elite methodology designed to get you results fast.`,
          visualDescription: 'High-speed cinematic slow motion with sharp focus on execution.'
        };
      }

    case 'curiosity':
      return {
        caption: 'The secret nobody in our industry wants you to know...',
        voiceText: `Most people will never know why ${businessName} gets ten times better results, but watch this closely.`,
        visualDescription: 'Silhouette moving into spotlight, mysterious ambient lighting with glowing neon backlight.'
      };

    case 'casual':
      return {
        caption: `Honestly? Best decision I ever made with ${businessName}.`,
        voiceText: `I used to struggle with this constantly, until a buddy told me to check out ${businessName}. It completely changed the game.`,
        visualDescription: 'Authentic selfie-angle handheld camera, natural daylight, genuine smile and nod.'
      };

    case 'professional':
      return {
        caption: `Backed by data: Industry-leading performance metrics.`,
        voiceText: `Validated by certified specialists, our structured curriculum at ${businessName} consistently outperforms conventional standards.`,
        visualDescription: 'Clean 3D graphical overlay with verified biometric data and performance curve rising.'
      };

    default:
      return {
        caption: scene.caption,
        voiceText: scene.voiceText,
        visualDescription: scene.visualDescription
      };
  }
}

/**
 * Generate 3 viral Hook variations for client to choose from
 */
export async function generateHookOptions(
  businessName: string,
  niche: NicheType,
  offer: string,
  apiKey?: string
): Promise<Array<{ title: string; caption: string; voiceText: string; type: string }>> {
  if (apiKey && apiKey.trim().length > 10) {
    const prompt = `You are a viral TikTok & Reels hook specialist.
Business: "${businessName}" (${niche})
Offer: "${offer}"
Generate exactly 3 viral opening hooks for a 30s video.
Hook 1: A contrarian or controversial statement
Hook 2: A curiosity gap question
Hook 3: An urgent pain-point callout
Return JSON:
[
  { "type": "Contrarian", "title": "The Big Lie", "caption": "short text", "voiceText": "spoken hook" },
  { "type": "Curiosity", "title": "The Secret Formula", "caption": "short text", "voiceText": "spoken hook" },
  { "type": "Urgent Pain", "title": "The Cost of Inaction", "caption": "short text", "voiceText": "spoken hook" }
]`;
    const res = await callGeminiApi(prompt, apiKey);
    if (res) {
      try {
        const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      } catch (e) {
        console.warn('Failed to parse Gemini hook JSON', e);
      }
    }
  }

  // Built-in intelligent hooks
  return [
    {
      type: '🔥 Contrarian',
      title: 'Stop Doing What Everyone Else Does',
      caption: 'Why conventional training is secretly RUINING your technique...',
      voiceText: `If you are still practicing the old way, you are actively holding your own performance back. Here is why.`
    },
    {
      type: '👀 Curiosity Gap',
      title: 'The Unfair Advantage',
      caption: 'The 1 simple change that unlocked 15% better performance...',
      voiceText: `What is the single difference between amateur players and the top elite? It is not what you think.`
    },
    {
      type: '⏰ Urgent Pain',
      title: 'Don’t Waste Another Season',
      caption: 'Still making the same mistakes? Here is how to fix them today.',
      voiceText: `Another season is starting. Are you going to repeat the same frustrations, or finally make the leap with ${businessName}?`
    }
  ];
}

/**
 * Generate a complete 5-scene storyboard from a raw client prompt
 */
export async function generateFullStoryboardFromPrompt(
  promptText: string,
  businessName: string,
  niche: NicheType,
  apiKey?: string
): Promise<Scene[] | null> {
  if (apiKey && apiKey.trim().length > 10) {
    const prompt = `You are a video marketing director.
Business: "${businessName}"
Niche: "${niche}"
Client Idea: "${promptText}"

Create a viral 5-scene vertical video storyboard (Hook, Problem, Solution, Social Proof, Call to Action).
Return JSON matching:
[
  {
    "id": 1,
    "duration": 4,
    "stage": "Hook",
    "caption": "max 10 words",
    "voiceText": "max 20 words natural speech",
    "visualDescription": "cinematic b-roll visual description",
    "bgGradient": "from-amber-600/40 via-red-900/60 to-black",
    "bRollType": "action"
  },
  {
    "id": 2,
    "duration": 5,
    "stage": "Problem",
    "caption": "max 10 words",
    "voiceText": "max 25 words",
    "visualDescription": "b-roll visual description",
    "bgGradient": "from-blue-900/40 via-slate-900/80 to-black",
    "bRollType": "action"
  },
  {
    "id": 3,
    "duration": 6,
    "stage": "Solution",
    "caption": "max 12 words",
    "voiceText": "max 25 words",
    "visualDescription": "b-roll visual description",
    "bgGradient": "from-emerald-900/50 via-teal-950 to-black",
    "bRollType": "product"
  },
  {
    "id": 4,
    "duration": 5,
    "stage": "Social Proof",
    "caption": "max 10 words",
    "voiceText": "max 20 words",
    "visualDescription": "b-roll visual description",
    "bgGradient": "from-purple-900/40 via-indigo-950 to-black",
    "bRollType": "testimonial"
  },
  {
    "id": 5,
    "duration": 6,
    "stage": "Call to Action",
    "caption": "Scan QR code now to claim your offer!",
    "voiceText": "Scan the code on your screen right now to lock in this special rate!",
    "visualDescription": "Pulsing dynamic QR code with claim button",
    "bgGradient": "from-emerald-600/40 via-cyan-950 to-black",
    "bRollType": "offer"
  }
]`;
    const res = await callGeminiApi(prompt, apiKey);
    if (res) {
      try {
        const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length === 5) return parsed;
      } catch (e) {
        console.warn('Failed to parse Gemini full storyboard', e);
      }
    }
  }

  // Fallback intelligent generator based on prompt
  return [
    {
      id: 1,
      duration: 4,
      stage: 'Hook',
      caption: `Wait! If you need ${promptText.slice(0, 35)}... listen to this:`,
      voiceText: `If you are looking for ${promptText.slice(0, 45)}, you need to see what ${businessName} just released.`,
      visualDescription: `Fast-paced dynamic shot introducing ${promptText.slice(0, 30)}, bold motion graphics.`,
      bgGradient: 'from-amber-600/40 via-red-900/60 to-black',
      bRollType: 'action'
    },
    {
      id: 2,
      duration: 5,
      stage: 'Problem',
      caption: 'Most alternatives are overpriced and deliver zero real results.',
      voiceText: 'Too many people waste hard-earned money on options that never deliver on their promises.',
      visualDescription: 'Frustrated customer looking at bad results, contrast with modern high-tech solution.',
      bgGradient: 'from-blue-900/40 via-slate-900/80 to-black',
      bRollType: 'action'
    },
    {
      id: 3,
      duration: 6,
      stage: 'Solution',
      caption: `At ${businessName}, we engineered the ultimate solution for you.`,
      voiceText: `That is why ${businessName} created this all-in-one approach to give you guaranteed satisfaction.`,
      visualDescription: 'Sleek demonstration of product/service in action with happy clients.',
      bgGradient: 'from-emerald-900/50 via-teal-950 to-black',
      bRollType: 'product'
    },
    {
      id: 4,
      duration: 5,
      stage: 'Social Proof',
      caption: 'Rated 5-stars with hundreds of happy clients this month.',
      voiceText: 'Join hundreds of satisfied customers who already made the switch with five-star reviews.',
      visualDescription: 'Wall of glowing testimonials, 5-star ratings and customer celebrations.',
      bgGradient: 'from-purple-900/40 via-indigo-950 to-black',
      bRollType: 'testimonial'
    },
    {
      id: 5,
      duration: 6,
      stage: 'Call to Action',
      caption: 'SCAN THE QR CODE on screen right now to claim your exclusive pass!',
      voiceText: 'Point your smartphone camera at the QR code right on your screen to claim your special offer today!',
      visualDescription: 'High-contrast dynamic scannable QR code with pulsing neon border and countdown.',
      bgGradient: 'from-emerald-600/40 via-cyan-950 to-black',
      bRollType: 'offer'
    }
  ];
}
