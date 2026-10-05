# ScaleUp Studios 🚀
### AI Video Creation, Social Auto-Publishing & Conversion Attribution Engine

---

## 🌟 What is Built

**ScaleUp Studios** is an end-to-end, automated AI content and marketing operations platform built for businesses. It solves the 3 biggest problems facing SMBs, creators, and agencies:
1. **Automated AI Video Creation with Human Avatars:** Generates high-retention 9:16 vertical videos featuring photorealistic digital human presenters speaking directly to camera (Coach Marcus, Sarah Mitchell, Alex Rivera, Elena, or a Custom Captain Clone) with synchronized speech, kinetic subtitles, and dynamic B-roll.
2. **Omnichannel Social Publishing:** One-click dispatch and scheduling across Instagram Reels, TikTok, Facebook Pages & Watch, and YouTube Shorts with pre-formatted captions and hashtags.
3. **Real Attribution Tracking (Barcodes & Cookies):** In-video dynamic QR codes + smart redirect links with first-party cookies and server-side CAPI telemetry, proving to the client exactly how many views, scans, and paying leads the video generated.
4. **AI Platform Discovery (GEO):** Generative Engine Optimization ensuring the client's business is cited and recommended when consumers ask ChatGPT, Google Gemini, and Anthropic Claude.

---

## 🏃 Running the Application

The server is currently running live:
* **Local Web Browser:** [http://localhost:5173/](http://localhost:5173/)
* **Mobile / Local Network:** `http://192.168.0.174:5173/` (Open this on your smartphone on the same Wi-Fi!)

To start or restart the app manually:
```bash
npm install
npm run dev
```

---

## 📂 Key Architecture & Components

* **`src/components/VideoPlayer.tsx`**: High-fidelity 9:16 smartphone player with kinetic karaoke subtitles, speech synthesis voiceover, social engagement overlay, and dynamic scannable QR outro.
* **`src/components/VideoStudio.tsx`**: Interactive campaign creator with pre-built industry presets (Cricket Academy, Gym/Fitness, Restaurant, Real Estate, E-Commerce, Local Services) and AI script refinement.
* **`src/components/SocialPublisher.tsx`**: Multi-platform distribution center with mock OAuth status and realistic feed preview.
* **`src/components/AttributionTracker.tsx`**: Conversion analytics console tracking video views, dynamic QR scans, first-party cookie drops, and calculated pipeline value.
* **`src/components/GeoDiscovery.tsx`**: Generative Engine Optimization simulation and auto-generated Schema.org JSON-LD for AI search models.
* **`src/utils/tracking.ts`**: High-performance QR code generator and cookie attribution engine.
>>>>>>> 38f6764 (feat: ScaleUp Studios AI Video Marketing Engine)
