// Web Audio API Background Music Engine with Dynamic Voice Ducking
// Synthesizes rhythmic, royalty-free audio tracks entirely offline (Zero CORS, Zero external assets)

export type BgmTrackId = 'sports_energy' | 'fitness_pulse' | 'luxury_ambient' | 'lofi_chill' | 'none';

export interface BgmTrack {
  id: BgmTrackId;
  name: string;
  genre: string;
  bpm: number;
  icon: string;
  description: string;
}

export const BGM_TRACKS: BgmTrack[] = [
  {
    id: 'sports_energy',
    name: 'High-Energy Athletic Drill',
    genre: 'Sports Electronic',
    bpm: 128,
    icon: '⚡',
    description: 'Punchy kick, energetic bassline and driving rhythmic synths'
  },
  {
    id: 'fitness_pulse',
    name: 'Cardio Fitness Pulse',
    genre: 'Tech House',
    bpm: 124,
    icon: '💪',
    description: 'Four-on-the-floor driving beat with motivating sidechain chords'
  },
  {
    id: 'luxury_ambient',
    name: 'Modern Luxury Flow',
    genre: 'Ambient Future',
    bpm: 95,
    icon: '✨',
    description: 'Smooth sub-bass, warm electric piano chords and airy texture'
  },
  {
    id: 'lofi_chill',
    name: 'Lo-Fi Chill & Focus',
    genre: 'Lo-Fi Hip Hop',
    bpm: 85,
    icon: '☕',
    description: 'Warm Rhodes chords, mellow swing rhythm and relaxed groove'
  },
  {
    id: 'none',
    name: 'No Background Music',
    genre: 'Muted',
    bpm: 0,
    icon: '🔇',
    description: 'Voiceover only with zero background music'
  }
];

class AudioBgmEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrack: BgmTrackId = 'sports_energy';
  private timerId: number | null = null;
  private currentBeat: number = 0;
  private userVolume: number = 0.28; // 28% comfortable backing volume
  private isDucked: boolean = false;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();

      this.musicGain.gain.setValueAtTime(this.userVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      // Create stream destination for MediaRecorder export
      this.destinationNode = this.ctx.createMediaStreamDestination();
      this.masterGain.connect(this.destinationNode);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioDestinationStream(): MediaStream | null {
    this.initContext();
    return this.destinationNode ? this.destinationNode.stream : null;
  }

  public setVolume(vol: number) {
    this.userVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx) {
      const targetGain = this.isDucked ? this.userVolume * 0.25 : this.userVolume;
      this.musicGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.userVolume;
  }

  public setTrack(trackId: BgmTrackId) {
    this.currentTrack = trackId;
    if (trackId === 'none') {
      this.stop();
    } else if (this.isPlaying) {
      this.stop();
      this.start(trackId);
    }
  }

  public getCurrentTrack(): BgmTrackId {
    return this.currentTrack;
  }

  // Dynamic Voice Ducking: Lowers BGM volume when avatar speaks, smoothly restores it on silence
  public setVoiceDucking(isSpeaking: boolean) {
    this.isDucked = isSpeaking;
    if (!this.musicGain || !this.ctx || !this.isPlaying) return;

    const targetGain = isSpeaking ? this.userVolume * 0.22 : this.userVolume;
    const rampTime = isSpeaking ? 0.08 : 0.25; // Quick duck on speech, smooth fade up on pause
    this.musicGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, rampTime);
  }

  public start(trackId: BgmTrackId = this.currentTrack) {
    this.currentTrack = trackId;
    if (trackId === 'none') return;

    this.initContext();
    if (!this.ctx || this.isPlaying) return;

    this.isPlaying = true;
    this.currentBeat = 0;

    const track = BGM_TRACKS.find(t => t.id === trackId) || BGM_TRACKS[0];
    const bpm = track.bpm || 120;
    const beatIntervalMs = (60 / bpm / 2) * 1000; // 8th note interval

    this.timerId = window.setInterval(() => {
      this.playStep(trackId);
      this.currentBeat = (this.currentBeat + 1) % 16;
    }, beatIntervalMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.currentBeat = 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Synthesize musical step on the fly using Web Audio oscillators & envelopes
  private playStep(trackId: BgmTrackId) {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const step = this.currentBeat;

    if (trackId === 'sports_energy') {
      // 128 BPM Energetic Beat
      // Kick on 0, 4, 8, 12
      if (step % 4 === 0) {
        this.synthKick(now, 140, 0.22);
      }
      // Hi-hat on every off-beat
      if (step % 2 === 1) {
        this.synthHiHat(now, 0.04, step % 4 === 1 ? 0.08 : 0.05);
      }
      // Snare on 4, 12
      if (step === 4 || step === 12) {
        this.synthSnare(now, 0.15);
      }
      // Bassline note
      const bassNotes = [55, 55, 65.4, 55, 73.4, 55, 82.4, 73.4];
      const freq = bassNotes[Math.floor(step / 2) % bassNotes.length];
      if (step % 2 === 0) {
        this.synthBass(now, freq, 0.2, 'sawtooth');
      }
    } else if (trackId === 'fitness_pulse') {
      // 124 BPM Cardio House Beat
      // Four-on-the-floor Kick
      if (step % 4 === 0) {
        this.synthKick(now, 130, 0.25);
      }
      // Open hat on step 2, 6, 10, 14
      if (step % 4 === 2) {
        this.synthHiHat(now, 0.12, 0.09);
      }
      // Synth chord stab on step 0, 6, 10
      if (step === 0 || step === 6 || step === 10) {
        this.synthPad(now, [220, 261.63, 329.63], 0.25);
      }
      // Deep Sub Bass
      const subNotes = [65.4, 65.4, 73.4, 55];
      const subFreq = subNotes[Math.floor(step / 4) % subNotes.length];
      if (step % 4 === 0) {
        this.synthBass(now, subFreq, 0.3, 'sine');
      }
    } else if (trackId === 'luxury_ambient') {
      // 95 BPM Ambient Future Lounge
      if (step === 0 || step === 8) {
        this.synthKick(now, 90, 0.3);
        this.synthPad(now, [174.61, 220, 261.63, 329.63], 0.8);
      }
      if (step % 4 === 2) {
        this.synthHiHat(now, 0.06, 0.04);
      }
    } else if (trackId === 'lofi_chill') {
      // 85 BPM Warm Rhodes Beat
      if (step === 0 || step === 10) {
        this.synthKick(now, 100, 0.25);
      }
      if (step === 4 || step === 12) {
        this.synthSnare(now, 0.12);
      }
      if (step % 2 === 1) {
        this.synthHiHat(now, 0.04, 0.03);
      }
      if (step === 0 || step === 8) {
        this.synthPad(now, [196, 246.94, 293.66], 0.6);
      }
    }
  }

  // Synthesizer Primitives
  private synthKick(time: number, startFreq: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + duration);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private synthSnare(time: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    // Noise buffer for snap
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  private synthHiHat(time: number, duration: number, volume: number = 0.06) {
    if (!this.ctx || !this.musicGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.7;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    source.start(time);
    source.stop(time + duration);
  }

  private synthBass(time: number, freq: number, duration: number, type: OscillatorType) {
    if (!this.ctx || !this.musicGain) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + duration);

    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  private synthPad(time: number, freqs: number[], duration: number) {
    if (!this.ctx || !this.musicGain) return;
    freqs.forEach(f => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.05, time);
      gain.gain.linearRampToValueAtTime(0.08, time + duration * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(time);
      osc.stop(time + duration);
    });
  }
}

// Global Singleton for the entire app
export const bgmEngine = new AudioBgmEngine();
