import { Campaign, Scene } from '../types';
import { bgmEngine, BgmTrackId } from './audioEngine';

export interface ExportProgress {
  percent: number;
  stage: string;
  currentScene: number;
  totalScenes: number;
}

export interface ExportResult {
  blob: Blob;
  url: string;
  filename: string;
  mimeType: string;
}

/**
 * Preload an image URL into an HTMLImageElement
 */
function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback empty image if CORS or network fails
      const fallback = new Image();
      resolve(fallback);
    };
    img.src = url;
  });
}

/**
 * High-Performance Client-Side Video Exporter
 * Renders 9:16 vertical Reel (720x1280) with presenter, kinetic captions, branding & audio
 */
export async function exportCampaignVideo(
  campaign: Campaign,
  options: {
    framing?: 'bubble' | 'fullscreen' | 'split';
    showCaptions?: boolean;
    bgmTrack?: BgmTrackId;
    fps?: number;
    onProgress?: (p: ExportProgress) => void;
  } = {}
): Promise<ExportResult> {
  const {
    framing = campaign.avatar?.framing || 'bubble',
    showCaptions = true,
    bgmTrack = 'sports_energy',
    fps = 30,
    onProgress
  } = options;

  const width = 720;
  const height = 1280;
  const scenes = campaign.scenes;
  const avatar = campaign.avatar;

  onProgress?.({
    percent: 5,
    stage: 'Preparing media & canvas buffers...',
    currentScene: 0,
    totalScenes: scenes.length
  });

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not create 2D canvas context');

  // Preload all scene images & QR code
  const sceneImages: (HTMLImageElement | null)[] = [];
  for (let i = 0; i < scenes.length; i++) {
    onProgress?.({
      percent: Math.floor(5 + (i / scenes.length) * 20),
      stage: `Preloading scene ${i + 1} assets...`,
      currentScene: i + 1,
      totalScenes: scenes.length
    });

    if (scenes[i].mediaUrl) {
      try {
        const img = await preloadImage(scenes[i].mediaUrl!);
        sceneImages.push(img);
      } catch (_) {
        sceneImages.push(null);
      }
    } else {
      sceneImages.push(null);
    }
  }

  // Preload avatar headshot / video frame
  let avatarImg: HTMLImageElement | null = null;
  if (avatar?.avatarUrl) {
    try {
      avatarImg = await preloadImage(avatar.avatarUrl);
    } catch (_) {}
  }

  // Preload QR Code
  let qrImg: HTMLImageElement | null = null;
  if (campaign.qrCodeUrl) {
    try {
      qrImg = await preloadImage(campaign.qrCodeUrl);
    } catch (_) {}
  }

  // Set up audio destination
  let audioStream: MediaStream | null = null;
  if (bgmTrack !== 'none') {
    bgmEngine.start(bgmTrack);
    audioStream = bgmEngine.getAudioDestinationStream();
  }

  // Combine canvas capture stream with audio stream
  const videoStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream();

  videoStream.getVideoTracks().forEach(t => combinedStream.addTrack(t));
  if (audioStream) {
    audioStream.getAudioTracks().forEach(t => combinedStream.addTrack(t));
  }

  // Determine supported mime type
  let mimeType = 'video/webm;codecs=vp9,opus';
  if (typeof MediaRecorder !== 'undefined') {
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')) {
      mimeType = 'video/mp4;codecs=avc1,mp4a.40.2';
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4';
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus';
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      mimeType = 'video/webm';
    }
  }

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(combinedStream, {
    mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
    videoBitsPerSecond: 4500000 // 4.5 Mbps crisp 720p HD
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const recordingFinished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      const finalBlob = new Blob(recordedChunks, { type: mimeType.split(';')[0] });
      resolve(finalBlob);
    };
  });

  recorder.start(100);

  // Render loop
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  let elapsedSeconds = 0;
  const frameIntervalSec = 1 / fps;

  for (let sIdx = 0; sIdx < scenes.length; sIdx++) {
    const scene = scenes[sIdx];
    const sceneImg = sceneImages[sIdx];
    const sceneDuration = scene.duration || 5;
    const sceneFrames = Math.floor(sceneDuration * fps);

    for (let f = 0; f < sceneFrames; f++) {
      const sceneProgress = f / sceneFrames;
      elapsedSeconds += frameIntervalSec;

      // Update progress callback every 10 frames
      if (f % 10 === 0) {
        const percent = Math.floor(25 + (elapsedSeconds / totalDuration) * 70);
        onProgress?.({
          percent: Math.min(95, percent),
          stage: `Rendering Scene ${sIdx + 1}/${scenes.length}: ${scene.stage}...`,
          currentScene: sIdx + 1,
          totalScenes: scenes.length
        });
      }

      // 1. Draw Background & Presenter
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      if (framing === 'fullscreen' && avatarImg && avatarImg.width > 0) {
        // Draw Real Human Presenter Full Screen with breathing animation
        const breathScale = 1.0 + Math.sin(f * 0.08) * 0.015;
        const dw = width * breathScale;
        const dh = height * breathScale;
        const dx = (width - dw) / 2;
        const dy = (height - dh) / 2;
        ctx.drawImage(avatarImg, dx, dy, dw, dh);

        // Cinematic lighting vignette
        const darkGrad = ctx.createLinearGradient(0, 0, 0, height);
        darkGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        darkGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
        darkGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.65)');
        darkGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = darkGrad;
        ctx.fillRect(0, 0, width, height);

        // Floating Commercial B-Roll Cutaway (during Problem/Solution/Proof scenes)
        if (sIdx > 0 && sIdx < scenes.length - 1 && sceneImg && sceneImg.width > 0) {
          const cutW = 200;
          const cutH = 260;
          const cutX = width - cutW - 24;
          const cutY = 64;

          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          ctx.shadowBlur = 20;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 3;
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(cutX, cutY, cutW, cutH, 18);
          ctx.fill();
          ctx.stroke();
          ctx.clip();

          ctx.drawImage(sceneImg, cutX, cutY, cutW, cutH);
          ctx.restore();

          // Action Tag Badge
          ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.beginPath();
          ctx.roundRect(cutX + 10, cutY + 10, 80, 20, 10);
          ctx.fill();

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(`●  ${scene.stage.toUpperCase()}`, cutX + 18, cutY + 23);
        }
      } else if (framing === 'split') {
        // Split screen: top half presenter, bottom half B-roll
        if (avatarImg && avatarImg.width > 0) {
          ctx.drawImage(avatarImg, 0, 0, width, height / 2);
        }
        if (sceneImg && sceneImg.width > 0) {
          ctx.drawImage(sceneImg, 0, height / 2, width, height / 2);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        // Bubble / PIP mode: full B-roll background
        if (sceneImg && sceneImg.width > 0) {
          const scale = 1.0 + sceneProgress * 0.08;
          const dw = width * scale;
          const dh = height * scale;
          const dx = (width - dw) / 2;
          const dy = (height - dh) / 2;
          ctx.drawImage(sceneImg, dx, dy, dw, dh);
        } else {
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#020617');
          grad.addColorStop(1, '#000000');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        const darkGrad = ctx.createLinearGradient(0, 0, 0, height);
        darkGrad.addColorStop(0, 'rgba(2, 6, 23, 0.55)');
        darkGrad.addColorStop(0.35, 'rgba(2, 6, 23, 0.2)');
        darkGrad.addColorStop(0.75, 'rgba(2, 6, 23, 0.7)');
        darkGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
        ctx.fillStyle = darkGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Top Progress Bars (Instagram Reels / TikTok style)
      const barPadding = 16;
      const barGap = 6;
      const totalBarWidth = width - (barPadding * 2);
      const singleBarWidth = (totalBarWidth - (scenes.length - 1) * barGap) / scenes.length;
      const barY = 32;
      const barH = 5;

      for (let b = 0; b < scenes.length; b++) {
        const bx = barPadding + b * (singleBarWidth + barGap);
        // Track background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.roundRect(bx, barY, singleBarWidth, barH, 3);
        ctx.fill();

        // Fill bar
        let fillFraction = 0;
        if (b < sIdx) fillFraction = 1;
        else if (b === sIdx) fillFraction = sceneProgress;

        if (fillFraction > 0) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(bx, barY, singleBarWidth * fillFraction, barH, 3);
          ctx.fill();
        }
      }

      // 3. Draw Presenter Avatar (PIP Bubble Mode)
      if (avatarImg && avatarImg.width > 0 && framing === 'bubble') {
        const pipW = 200;
        const pipH = 260;
        const pipX = width - pipW - 24;
        const pipY = 54;

        ctx.save();
        // Presenter Border glow
        ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
        ctx.shadowBlur = 16;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#020617';

        ctx.beginPath();
        ctx.roundRect(pipX, pipY, pipW, pipH, 18);
        ctx.fill();
        ctx.stroke();
        ctx.clip();

        // Draw avatar image with slight breathing animation
        const breathY = Math.sin(f * 0.1) * 2;
        ctx.drawImage(avatarImg, pipX, pipY + breathY, pipW, pipH);

        // PIP live badge
        ctx.restore();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(pipX + 8, pipY + 8, 64, 18, 9);
        ctx.fill();

        // Red live dot
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pipX + 16, pipY + 17, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('PRESENTER', pipX + 24, pipY + 20);
      }

      // 4. Draw Stage Pill (Hook / Problem / Solution / Social Proof / Call to Action)
      const stageY = 160;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(32, stageY, 150, 28, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(`●  ${scene.stage.toUpperCase()}`, 48, stageY + 18);

      // 5. Draw Hormozi-Style Kinetic Captions
      if (showCaptions && scene.caption) {
        const words = scene.caption.split(' ');
        const activeWordIdx = Math.min(words.length - 1, Math.floor(sceneProgress * words.length));

        ctx.font = '900 34px sans-serif';
        ctx.textAlign = 'center';

        // Wrap words into lines of max 4-5 words
        const lines: string[][] = [];
        let curLine: string[] = [];
        words.forEach((w) => {
          curLine.push(w);
          if (curLine.length >= 4) {
            lines.push(curLine);
            curLine = [];
          }
        });
        if (curLine.length > 0) lines.push(curLine);

        const captionStartY = 640;
        const lineHeight = 46;
        let wordCounter = 0;

        lines.forEach((lineWords, lineIdx) => {
          const lineY = captionStartY + lineIdx * lineHeight;
          const totalLineText = lineWords.join(' ');
          const lineMetrics = ctx.measureText(totalLineText);

          // Dark background backdrop for maximum readability
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.beginPath();
          ctx.roundRect(width / 2 - lineMetrics.width / 2 - 14, lineY - 32, lineMetrics.width + 28, 40, 8);
          ctx.fill();

          // Render words with highlight on current spoken word
          let startX = (width - lineMetrics.width) / 2;
          ctx.textAlign = 'left';

          lineWords.forEach((word) => {
            const isHighlighted = wordCounter === activeWordIdx;
            const wordWidth = ctx.measureText(word + ' ').width;

            if (isHighlighted) {
              // Bright Hormozi Yellow / Emerald pop
              ctx.fillStyle = '#facc15';
              ctx.shadowColor = 'rgba(250, 204, 21, 0.8)';
              ctx.shadowBlur = 12;
            } else {
              ctx.fillStyle = '#ffffff';
              ctx.shadowBlur = 0;
            }

            ctx.fillText(word, startX, lineY);
            startX += wordWidth;
            wordCounter++;
          });
        });
      }

      // 6. Draw Bottom CTA / QR Code & Brand Bar
      const ctaY = height - 160;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(24, ctaY, width - 48, 120, 24);
      ctx.fill();
      ctx.stroke();

      // Brand name & Offer
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(campaign.businessName, 44, ctaY + 38);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px sans-serif';
      const offerText = campaign.offer.length > 38 ? campaign.offer.slice(0, 38) + '...' : campaign.offer;
      ctx.fillText(`🔥 ${offerText}`, 44, ctaY + 68);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`Bio: ${campaign.trackingShortlink}`, 44, ctaY + 95);

      // Draw QR Code
      if (qrImg && qrImg.width > 0) {
        const qrSize = 92;
        const qrX = width - 48 - qrSize - 16;
        const qrY = ctaY + 14;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 12);
        ctx.fill();

        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      }

      // Frame delay to match target FPS
      await new Promise(r => setTimeout(r, Math.max(1, Math.floor(frameIntervalSec * 1000))));
    }
  }

  onProgress?.({
    percent: 98,
    stage: 'Finalizing & encoding video container...',
    currentScene: scenes.length,
    totalScenes: scenes.length
  });

  // Stop recording and stop BGM
  recorder.stop();
  bgmEngine.stop();

  const finalBlob = await recordingFinished;
  const isMp4 = mimeType.includes('mp4');
  const extension = isMp4 ? 'mp4' : 'webm';
  const cleanName = campaign.businessName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${cleanName}_Promo_Reel.${extension}`;
  const downloadUrl = URL.createObjectURL(finalBlob);

  onProgress?.({
    percent: 100,
    stage: 'Video ready for download!',
    currentScene: scenes.length,
    totalScenes: scenes.length
  });

  return {
    blob: finalBlob,
    url: downloadUrl,
    filename,
    mimeType: finalBlob.type || mimeType
  };
}

/**
 * Trigger immediate browser download
 */
export function downloadExportedVideo(result: ExportResult) {
  const a = document.createElement('a');
  a.href = result.url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
