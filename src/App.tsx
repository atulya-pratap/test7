import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  Crown,
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Compass,
  BookOpen,
  Heart,
  Upload,
  Play,
  RotateCcw,
  Pause,
  HelpCircle,
  Award,
  Flower2,
  DoorOpen,
  Image as ImageIcon,
  Check,
  Move
} from 'lucide-react';

// ============================================================================
// DEFAULT ROYAL DATA — MEMORIES, PLAQUES & INITIAL PLACEHOLDER ARTWORK
// ============================================================================
const INITIAL_MEMORIES = [
  {
    id: 1,
    code: 'MEMORY 01',
    title: 'A BEAUTIFUL BEGINNING',
    subtitle: 'Chapter I of the Royal Archives',
    caption:
      'Every fairytale has a moment where the light changes and an ordinary day quietly becomes unforgettable. Your warmth and grace turned the very first chapter into pure magic.',
    date: 'The First Royal Chronicle',
    position: { x: -8.6, y: 4.5, z: 18, rotY: Math.PI / 2 },
    viewPos: { x: -3.2, y: 4.4, z: 18 },
    themeColors: ['#4a0e1e', '#d4af37', '#f8bbd0'],
    motif: 'sunrise',
    imageUrl: './photo1.jpg'
  },
  {
    id: 2,
    code: 'MEMORY 02',
    title: 'LITTLE MOMENTS',
    subtitle: 'Chapter II of the Royal Archives',
    caption:
      'It is never just the grand banquets that define a kingdom—it is the spontaneous laughter, the shared glances, and the tiny everyday moments that shine brighter than gold.',
    date: 'Golden Afternoon Echoes',
    position: { x: 8.6, y: 4.5, z: 12, rotY: -Math.PI / 2 },
    viewPos: { x: 3.2, y: 4.4, z: 12 },
    themeColors: ['#2c1810', '#e8b4bc', '#f3e5ab'],
    motif: 'stars',
    imageUrl: './photo2.jpg'
  },
  {
    id: 3,
    code: 'MEMORY 03',
    title: 'THE ICE CREAM TREATY',
    subtitle: 'Chapter III of the Royal Archives',
    caption:
      'Ratified under the highest royal authority: no matter how busy or chaotic the world becomes, an impromptu treaty sealed with sweet ice cream restores peace and joy immediately.',
    date: 'The Sweetest Decree',
    position: { x: -8.6, y: 4.5, z: 4, rotY: Math.PI / 2 },
    viewPos: { x: -3.2, y: 4.4, z: 4 },
    themeColors: ['#3b0a18', '#f48fb1', '#fff8e7'],
    motif: 'treaty',
    imageUrl: './photo3.jpg'
  },
  {
    id: 4,
    code: 'MEMORY 04',
    title: 'THE UNFORGETTABLE DAYS',
    subtitle: 'Chapter IV of the Royal Archives',
    caption:
      'Sunlit adventures, endless conversations, and memories etched into time. Whenever the palace halls grow quiet, these are the days that fill the kingdom with music.',
    date: 'Timeless Horizons',
    position: { x: 8.6, y: 4.5, z: -4, rotY: -Math.PI / 2 },
    viewPos: { x: 3.2, y: 4.4, z: -4 },
    themeColors: ['#4a1525', '#d4af37', '#fce4ec'],
    motif: 'palace',
    imageUrl: './photo4.jpg'
  },
  {
    id: 5,
    code: 'MEMORY 05',
    title: 'A MEMORY TO KEEP',
    subtitle: 'Chapter V of the Royal Archives',
    caption:
      'Preserved forever in the heart of the palace. Through every season ahead, may you always remember how deeply cherished, admired, and celebrated you truly are.',
    date: 'Forever & Always',
    position: { x: -8.6, y: 4.5, z: -11, rotY: Math.PI / 2 },
    viewPos: { x: -3.2, y: 4.4, z: -11 },
    themeColors: ['#2a0812', '#e6c65a', '#f8bbd0'],
    motif: 'crown',
    imageUrl: './photo5.jpg'
  }
];

const GARDEN_PLAQUES = [
  {
    id: 'plaque-1',
    title: 'FIRST ROYAL INSCRIPTION',
    quote: 'Your presence makes ordinary moments special.',
    subtext: 'Engraved in the Western Rose Arbor',
    position: { x: -3.8, y: 1.5, z: -49 },
    viewPos: { x: -1.2, y: 2.3, z: -46.5 }
  },
  {
    id: 'plaque-2',
    title: 'SECOND ROYAL INSCRIPTION',
    quote: 'Some people bring their own sunshine.',
    subtext: 'Engraved beside the Imperial Fountain',
    position: { x: 3.8, y: 1.5, z: -63 },
    viewPos: { x: 1.2, y: 2.3, z: -60.5 }
  },
  {
    id: 'plaque-3',
    title: 'THIRD ROYAL INSCRIPTION',
    quote: 'Every rose has its own story.',
    subtext: 'Engraved at the Sovereign Terrace',
    position: { x: -3.8, y: 1.5, z: -76 },
    viewPos: { x: -1.2, y: 2.3, z: -73.5 }
  }
];

const SCENE_WAYPOINTS = [
  {
    id: 'exterior',
    label: 'I. Palace Exterior',
    shortLabel: 'Exterior',
    pos: { x: 0, y: 3.6, z: 72 },
    lookAt: { x: 0, y: 7.5, z: 32 },
    description: 'The Grand Courtyard of The Ghana Regency at golden sunset.'
  },
  {
    id: 'entrance',
    label: 'II. Grand Entrance',
    shortLabel: 'Doors',
    pos: { x: 0, y: 3.3, z: 44.5 },
    lookAt: { x: 0, y: 4.2, z: 35 },
    description: 'The ceremonial carved walnut doors of the palace.'
  },
  {
    id: 'gallery',
    label: 'III. Royal Gallery',
    shortLabel: 'Gallery',
    pos: { x: 0, y: 3.4, z: 26 },
    lookAt: { x: 0, y: 4.0, z: 0 },
    description: 'The grand colonnade illuminated by crystal chandeliers.'
  },
  {
    id: 'memories',
    label: 'IV. Memory Gallery',
    shortLabel: 'Memories',
    pos: { x: 0, y: 3.4, z: 12 },
    lookAt: { x: -8.6, y: 4.4, z: 11 },
    description: 'Five cherished royal frames holding personalized memories.'
  },
  {
    id: 'portrait',
    label: 'V. Portrait Hall',
    shortLabel: 'Portrait',
    pos: { x: 0, y: 3.4, z: -21.5 },
    lookAt: { x: 0, y: 4.8, z: -30 },
    description: 'The Sovereign Rotunda featuring Shruti’s centerpiece portrait.'
  },
  {
    id: 'garden',
    label: 'VI. Rose Garden',
    shortLabel: 'Rose Garden',
    pos: { x: 0, y: 3.2, z: -45 },
    lookAt: { x: 0, y: 3.0, z: -68 },
    description: 'Sunlit rose arches, floating petals, and engraved golden plaques.'
  },
  {
    id: 'letter',
    label: 'VII. Royal Letter',
    shortLabel: 'Letter',
    pos: { x: 0, y: 2.9, z: -83.5 },
    lookAt: { x: 0, y: 1.9, z: -88.5 },
    description: 'An antique writing desk bearing a wax-sealed royal decree.'
  },
  {
    id: 'crown',
    label: 'VIII. Crown Ceremony',
    shortLabel: 'Crown',
    pos: { x: 0, y: 3.1, z: -96.5 },
    lookAt: { x: 0, y: 2.9, z: -102.5 },
    description: 'The Royal Pavilion where Princess Shruti claims her crown.'
  },
  {
    id: 'reveal',
    label: 'IX. Royal Reveal',
    shortLabel: 'Finale',
    pos: { x: 0, y: 18.5, z: -132 },
    lookAt: { x: 0, y: 6.0, z: -40 },
    description: 'The grand finale overlooking the palace and rose kingdom.'
  }
];

// ============================================================================
// WEB AUDIO API ORCHESTRAL & SOUND EFFECTS ENGINE (100% SELF-CONTAINED)
// ============================================================================
class RoyalAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.musicVolume = 0.55;
    this.sfxEnabled = true;
    this.chordIndex = 0;
    this.loopTimer = null;
    this.arpTimer = null;
    this.lastStepTime = 0;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();

    this.masterGain.gain.value = this.isMuted ? 0 : 1;
    this.musicGain.gain.value = this.musicVolume;
    this.sfxGain.gain.value = this.sfxEnabled ? 0.65 : 0;

    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  startMusic() {
    this.init();
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;

    // Warm fairytale orchestral chord progression (Fmaj7 - Dm9 - Bbmaj7 - C13 - Am7 - Gm9)
    const chords = [
      [174.61, 220.0, 261.63, 329.63, 392.0], // Fmaj9
      [146.83, 220.0, 261.63, 329.63, 440.0], // Dm9
      [116.54, 174.61, 220.0, 293.66, 349.23], // Bbmaj7
      [130.81, 196.0, 246.94, 293.66, 392.0]  // Cmaj9/G
    ];

    const arpeggios = [
      [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25],
      [440.0, 523.25, 659.25, 880.0, 659.25, 523.25],
      [466.16, 587.33, 698.46, 932.33, 698.46, 587.33],
      [392.0, 523.25, 659.25, 783.99, 659.25, 523.25]
    ];

    const playWarmPadChord = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = chords[this.chordIndex % chords.length];

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const env = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        subOsc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        subOsc.frequency.setValueAtTime(freq * 0.5, now);
        // Gentle detune for lush orchestral string chorus
        osc.detune.setValueAtTime((idx - 2) * 4, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(950, now);

        env.gain.setValueAtTime(0.0001, now);
        env.gain.linearRampToValueAtTime(0.045 / chord.length, now + 1.8);
        env.gain.exponentialRampToValueAtTime(0.0008, now + 5.8);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(env);
        env.connect(this.musicGain);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 6.0);
        subOsc.stop(now + 6.0);
      });

      // Delicate harp / celesta notes
      const arpNotes = arpeggios[this.chordIndex % arpeggios.length];
      arpNotes.forEach((noteFreq, i) => {
        const start = now + i * 0.85;
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, start);

        env.gain.setValueAtTime(0.0001, start);
        env.gain.linearRampToValueAtTime(0.022, start + 0.04);
        env.gain.exponentialRampToValueAtTime(0.0001, start + 1.9);

        osc.connect(env);
        env.connect(this.musicGain);
        osc.start(start);
        osc.stop(start + 2.0);
      });

      this.chordIndex++;
    };

    playWarmPadChord();
    this.loopTimer = setInterval(playWarmPadChord, 5200);
  }

  setVolume(val) {
    this.musicVolume = val;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.1);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.1);
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(enabled ? 0.65 : 0, this.ctx.currentTime, 0.1);
    }
  }

  playSparkle() {
    this.init();
    if (!this.ctx || !this.sfxEnabled || this.isMuted) return;
    const now = this.ctx.currentTime;
    const notes = [783.99, 987.77, 1174.66, 1567.98, 2093.0];
    notes.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.055);
      env.gain.setValueAtTime(0.001, now + idx * 0.055);
      env.gain.linearRampToValueAtTime(0.05, now + idx * 0.055 + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.055 + 0.75);
      osc.connect(env);
      env.connect(this.sfxGain);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.8);
    });
  }

  playDoorOpen() {
    this.init();
    if (!this.ctx || !this.sfxEnabled || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Deep ceremonial bass swell + golden chime
    const bass = this.ctx.createOscillator();
    const bassEnv = this.ctx.createGain();
    bass.type = 'triangle';
    bass.frequency.setValueAtTime(65.41, now);
    bass.frequency.exponentialRampToValueAtTime(130.81, now + 2.8);

    bassEnv.gain.setValueAtTime(0.001, now);
    bassEnv.gain.linearRampToValueAtTime(0.18, now + 0.8);
    bassEnv.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    bass.connect(bassEnv);
    bassEnv.connect(this.sfxGain);
    bass.start(now);
    bass.stop(now + 3.3);

    setTimeout(() => this.playSparkle(), 700);
  }

  playCrownClimax() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    // Triumphant Royal Fanfare & Orchestral Swell
    const fanfare = [
      { f: 261.63, t: 0, d: 1.8 },
      { f: 329.63, t: 0.15, d: 1.8 },
      { f: 392.0, t: 0.3, d: 1.8 },
      { f: 523.25, t: 0.45, d: 2.6 },
      { f: 659.25, t: 0.75, d: 3.0 },
      { f: 783.99, t: 1.05, d: 3.6 },
      { f: 1046.5, t: 1.35, d: 4.2 }
    ];
    fanfare.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      env.gain.setValueAtTime(0.0001, now + n.t);
      env.gain.linearRampToValueAtTime(0.09, now + n.t + 0.12);
      env.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
      osc.connect(env);
      env.connect(this.sfxGain);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.1);
    });
  }

  playFootstep() {
    if (!this.ctx || !this.sfxEnabled || this.isMuted) return;
    const now = performance.now();
    if (now - this.lastStepTime < 390) return;
    this.lastStepTime = now;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(115, t);
    osc.frequency.exponentialRampToValueAtTime(48, t + 0.07);

    env.gain.setValueAtTime(0.04, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    osc.connect(env);
    env.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.085);
  }

  dispose() {
    this.isPlaying = false;
    if (this.loopTimer) clearInterval(this.loopTimer);
    if (this.ctx) {
      this.ctx.close().catch(() => {});
    }
  }
}

// ============================================================================
// PROCEDURAL CANVAS TEXTURE GENERATORS FOR 3D PALACE MATERIALS & FRAMES
// ============================================================================
function createMarbleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Warm royal cream marble tiles with subtle gold & burgundy borders
  ctx.fillStyle = '#f6efe6';
  ctx.fillRect(0, 0, 512, 512);

  const tileSize = 128;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const isAlt = (x + y) % 2 === 1;
      ctx.fillStyle = isAlt ? '#eadbc8' : '#fbf7f2';
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      // Subtle diamond inlay
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * tileSize + 4, y * tileSize + 4, tileSize - 8, tileSize - 8);
    }
  }

  // Soft marble veining
  ctx.strokeStyle = 'rgba(180, 150, 130, 0.16)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 512, Math.random() * 512);
    ctx.bezierCurveTo(
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 512,
      Math.random() * 512
    );
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 18);
  return tex;
}

function createCarpetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep royal burgundy runner
  ctx.fillStyle = '#4a0e1e';
  ctx.fillRect(0, 0, 256, 512);

  // Antique gold side borders
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(10, 0, 8, 512);
  ctx.fillRect(238, 0, 8, 512);
  ctx.fillStyle = '#f3e5ab';
  ctx.fillRect(24, 0, 3, 512);
  ctx.fillRect(229, 0, 3, 512);

  // Damask floral motif along center
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
  ctx.lineWidth = 2;
  for (let y = 32; y < 512; y += 64) {
    ctx.beginPath();
    ctx.arc(128, y, 18, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 14);
  return tex;
}

function createMemoryFrameCanvasTexture(memory, loadedImg = null) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 512, 640);
  grad.addColorStop(0, memory.themeColors[0]);
  grad.addColorStop(0.6, '#2a0812');
  grad.addColorStop(1, '#1a050b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 640);

  // Ornate inner gold border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 472, 600);
  ctx.strokeStyle = 'rgba(243, 229, 171, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, 448, 576);

  if (loadedImg) {
    // Draw user's custom uploaded photograph preserving aspect ratio (cover)
    ctx.save();
    ctx.beginPath();
    ctx.rect(36, 36, 440, 460);
    ctx.clip();
    const imgRatio = loadedImg.width / loadedImg.height;
    const boxW = 440;
    const boxH = 460;
    const boxRatio = boxW / boxH;
    let drawW = boxW;
    let drawH = boxH;
    let offsetX = 36;
    let offsetY = 36;
    if (imgRatio > boxRatio) {
      drawW = boxH * imgRatio;
      offsetX = 36 - (drawW - boxW) / 2;
    } else {
      drawH = boxW / imgRatio;
      offsetY = 36 - (drawH - boxH) / 2;
    }
    ctx.drawImage(loadedImg, offsetX, offsetY, drawW, drawH);
    ctx.restore();
  } else {
    // Elegant Royal Illustrated Placeholder
    const glow = ctx.createRadialGradient(256, 250, 20, 256, 250, 210);
    glow.addColorStop(0, 'rgba(243, 229, 171, 0.35)');
    glow.addColorStop(0.5, 'rgba(216, 167, 177, 0.15)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(40, 40, 432, 440);

    // Decorative emblem illustration
    ctx.save();
    ctx.translate(256, 235);
    ctx.strokeStyle = '#f3e5ab';
    ctx.lineWidth = 3;

    // Outer celestial ring
    ctx.beginPath();
    ctx.arc(0, 0, 88, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    ctx.beginPath();
    ctx.arc(0, 0, 104, 0, Math.PI * 2);
    ctx.stroke();

    // Crown / motif silhouette in center
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.moveTo(-45, 25);
    ctx.lineTo(-55, -25);
    ctx.lineTo(-22, 2);
    ctx.lineTo(0, -42);
    ctx.lineTo(22, 2);
    ctx.lineTo(55, -25);
    ctx.lineTo(45, 25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Bottom plaque caption bar inside frame
  ctx.fillStyle = 'rgba(26, 5, 11, 0.92)';
  ctx.fillRect(36, 496, 440, 108);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 496, 440, 108);

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 18px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(memory.code, 256, 530);

  ctx.fillStyle = '#fdfbf7';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText(memory.title, 256, 562);

  ctx.fillStyle = '#e8b4bc';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillText('Click to Open Royal Memory', 256, 588);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createRoyalPortraitTexture(loadedImg = null) {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 780;
  const ctx = canvas.getContext('2d');

  // Rich burgundy & antique gold oil-painting backdrop
  const bg = ctx.createRadialGradient(300, 340, 40, 300, 360, 420);
  bg.addColorStop(0, '#631429');
  bg.addColorStop(0.55, '#3b0a18');
  bg.addColorStop(1, '#1a040a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 600, 780);

  // Ornate inner frame matting
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 12;
  ctx.strokeRect(24, 24, 552, 732);
  ctx.strokeStyle = '#f3e5ab';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 520, 700);

  if (loadedImg) {
    // Natural, un-distorted display of Shruti's uploaded portrait
    ctx.save();
    ctx.beginPath();
    ctx.rect(46, 46, 508, 575);
    ctx.clip();

    const imgRatio = loadedImg.width / loadedImg.height;
    const boxW = 508;
    const boxH = 575;
    const boxRatio = boxW / boxH;
    let drawW = boxW;
    let drawH = boxH;
    let offsetX = 46;
    let offsetY = 46;

    if (imgRatio > boxRatio) {
      drawW = boxH * imgRatio;
      offsetX = 46 - (drawW - boxW) / 2;
    } else {
      drawH = boxW / imgRatio;
      offsetY = 46 - (drawH - boxH) / 2;
    }
    ctx.drawImage(loadedImg, offsetX, offsetY, drawW, drawH);
    ctx.restore();
  } else {
    // Dignified Royal Masterpiece Placeholder waiting for Shruti's photograph
    const halo = ctx.createRadialGradient(300, 290, 15, 300, 290, 190);
    halo.addColorStop(0, 'rgba(243, 229, 171, 0.45)');
    halo.addColorStop(0.6, 'rgba(212, 175, 55, 0.14)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(50, 50, 500, 540);

    // Ornate oval cameo border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(300, 300, 145, 185, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Royal Crown above monogram
    ctx.save();
    ctx.translate(300, 200);
    ctx.fillStyle = '#f3e5ab';
    ctx.beginPath();
    ctx.moveTo(-50, 22);
    ctx.lineTo(-62, -28);
    ctx.lineTo(-24, 0);
    ctx.lineTo(0, -46);
    ctx.lineTo(24, 0);
    ctx.lineTo(62, -28);
    ctx.lineTo(50, 22);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Calligraphic Monogram 'S'
    ctx.fillStyle = '#fdfbf7';
    ctx.font = 'italic bold 120px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('S', 300, 355);

    ctx.fillStyle = '#f3e5ab';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText('Her Royal Highness', 300, 425);
  }

  // Nameplate at bottom of portrait
  ctx.fillStyle = 'rgba(24, 4, 10, 0.95)';
  ctx.fillRect(46, 624, 508, 110);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 624, 508, 110);

  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 19px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('HER ROYAL HIGHNESS', 300, 658);

  ctx.fillStyle = '#fdfbf7';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.fillText('PRINCESS SHRUTI', 300, 696);

  ctx.fillStyle = '#e8b4bc';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillText('Click to Inspect or Upload Royal Portrait', 300, 722);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Experience stages: 'invitation' -> 'cinematic_intro' -> 'exploring' -> 'final_reveal'
  const [stage, setStage] = useState('invitation');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [activeWaypoint, setActiveWaypoint] = useState('exterior');
  const [doorsOpened, setDoorsOpened] = useState(false);
  const [crownClaimed, setCrownClaimed] = useState(false);

  // Interactive Modals & Focused Prompts
  const [nearbyPrompt, setNearbyPrompt] = useState(null);
  const [activeMemoryIndex, setActiveMemoryIndex] = useState(null);
  const [portraitModalOpen, setPortraitModalOpen] = useState(false);
  const [activePlaque, setActivePlaque] = useState(null);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [controlsModalOpen, setControlsModalOpen] = useState(false);
  const [crownRevealCardOpen, setCrownRevealCardOpen] = useState(false);

  // Customizable Memories & Shruti's Portrait State
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const [shrutiPortraitUrl, setShrutiPortraitUrl] = useState('./photo6.jpg');
  
  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.55);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [webglError, setWebglError] = useState(false);

  // Refs for Three.js scene & live interaction
  const mountRef = useRef(null);
  const audioRef = useRef(null);
  const sceneObjectsRef = useRef({
    camera: null,
    leftDoorPivot: null,
    rightDoorPivot: null,
    crownGroup: null,
    crownLight: null,
    memoryFrameMeshes: [],
    portraitMesh: null,
    doorsOpening: false,
    doorsOpenAmount: 0,
    crownClaimedAnim: false,
    crownHeightOffset: 0,
    cameraTween: null,
    playerYaw: 0,
    playerPitch: 0,
    moveState: { forward: 0, right: 0 },
    isDraggingLook: false
  });

  // Initialize Audio Engine ref
  useEffect(() => {
    audioRef.current = new RoyalAudioEngine();
    return () => {
      if (audioRef.current) audioRef.current.dispose();
    };
  }, []);

  // Opening Sequence Progress Bar Animation
  useEffect(() => {
    if (stage !== 'invitation') return;
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 65);
    return () => clearInterval(interval);
  }, [stage]);

  // Smooth Camera Tween Helper
  const flyCameraTo = useCallback((targetPos, targetLookAt, duration = 2400, onComplete = null) => {
    const sc = sceneObjectsRef.current;
    if (!sc.camera) return;

    const startPos = sc.camera.position.clone();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(sc.camera.quaternion);
    const startLookAt = startPos.clone().add(forward.multiplyScalar(10));

    sc.cameraTween = {
      startPos,
      endPos: new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z),
      startLookAt,
      endLookAt: new THREE.Vector3(targetLookAt.x, targetLookAt.y, targetLookAt.z),
      startTime: performance.now(),
      duration,
      onComplete
    };
  }, []);

  // Jump to any scene waypoint
  const navigateToWaypoint = useCallback(
    (waypointId) => {
      const wp = SCENE_WAYPOINTS.find((w) => w.id === waypointId);
      if (!wp) return;

      // Close open overlays when flying
      setActiveMemoryIndex(null);
      setPortraitModalOpen(false);
      setActivePlaque(null);
      setLetterModalOpen(false);
      setCrownRevealCardOpen(false);

      // If flying inside the palace, make sure the grand doors are open
      const interiorScenes = ['gallery', 'memories', 'portrait', 'garden', 'letter', 'crown', 'reveal'];
      if (interiorScenes.includes(waypointId) && !doorsOpened) {
        setDoorsOpened(true);
        sceneObjectsRef.current.doorsOpening = true;
      }

      if (waypointId === 'reveal') {
        setStage('final_reveal');
      } else {
        setStage('exploring');
      }
      setActiveWaypoint(waypointId);
      if (audioRef.current) audioRef.current.playSparkle();

      flyCameraTo(wp.pos, wp.lookAt, 2400, () => {
        // Sync player yaw & pitch after camera flight finishes
        const sc = sceneObjectsRef.current;
        if (!sc.camera) return;
        const euler = new THREE.Euler().setFromQuaternion(sc.camera.quaternion, 'YXZ');
        sc.playerYaw = euler.y;
        sc.playerPitch = euler.x;
      });
    },
    [doorsOpened, flyCameraTo, stage]
  );

  // Start the Palace Experience from Invitation Screen
  const handleEnterPalace = () => {
    if (audioRef.current) {
      audioRef.current.startMusic();
      audioRef.current.playSparkle();
    }
    setStage('cinematic_intro');
    setActiveWaypoint('exterior');

    // Start wide at Z=84 and sweep gracefully to the Grand Entrance at Z=44.5
    const sc = sceneObjectsRef.current;
    if (sc.camera) {
      sc.camera.position.set(0, 6.2, 84);
      sc.camera.lookAt(0, 8.0, 32);
    }

    flyCameraTo(
      { x: 0, y: 3.3, z: 44.5 },
      { x: 0, y: 4.2, z: 35 },
      5200,
      () => {
        setStage('exploring');
        setActiveWaypoint('entrance');
        const euler = new THREE.Euler().setFromQuaternion(sc.camera.quaternion, 'YXZ');
        sc.playerYaw = euler.y;
        sc.playerPitch = euler.x;
      }
    );
  };

  // Open the Grand Palace Doors (Scene 2 -> Scene 3)
  const handleOpenGrandDoors = useCallback(() => {
    if (doorsOpened) return;
    setDoorsOpened(true);
    sceneObjectsRef.current.doorsOpening = true;
    if (audioRef.current) {
      audioRef.current.playDoorOpen();
    }
    setActiveWaypoint('gallery');

    // Glide ceremonially through the opening doors into the Royal Gallery
    flyCameraTo(
      { x: 0, y: 3.4, z: 24 },
      { x: 0, y: 4.2, z: -5 },
      3600,
      () => {
        const sc = sceneObjectsRef.current;
        if (!sc.camera) return;
        const euler = new THREE.Euler().setFromQuaternion(sc.camera.quaternion, 'YXZ');
        sc.playerYaw = euler.y;
        sc.playerPitch = euler.x;
      }
    );
  }, [doorsOpened, flyCameraTo]);

  // Claim Crown Ceremony Action (Scene 8)
  const handleClaimCrown = useCallback(() => {
    if (crownClaimed) {
      setCrownRevealCardOpen(true);
      return;
    }
    setCrownClaimed(true);
    sceneObjectsRef.current.crownClaimedAnim = true;
    if (audioRef.current) {
      audioRef.current.playCrownClimax();
    }
    flyCameraTo(
      { x: 0, y: 3.2, z: -98.2 },
      { x: 0, y: 3.9, z: -102.5 },
      2200,
      () => {
        setTimeout(() => {
          setCrownRevealCardOpen(true);
        }, 900);
      }
    );
  }, [crownClaimed, flyCameraTo]);

  // Trigger Final Scene — The Royal Reveal (Scene 9)
  const handleLaunchFinalReveal = useCallback(() => {
    setCrownRevealCardOpen(false);
    setLetterModalOpen(false);
    setPortraitModalOpen(false);
    setActiveMemoryIndex(null);
    setActivePlaque(null);
    setStage('final_reveal');
    setActiveWaypoint('reveal');
    if (audioRef.current) {
      audioRef.current.playCrownClimax();
    }
    flyCameraTo(
      { x: 0, y: 19.5, z: -134 },
      { x: 0, y: 6.5, z: -38 },
      4600
    );
  }, [flyCameraTo]);

  // Update 3D Memory Frame Texture when user uploads a photo
  const handleMemoryPhotoUpload = (memoryIndex, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        setMemories((prev) => {
          const updated = [...prev];
          updated[memoryIndex] = { ...updated[memoryIndex], imageUrl: dataUrl };
          const mesh = sceneObjectsRef.current.memoryFrameMeshes[memoryIndex];
          if (mesh) {
            const newTex = createMemoryFrameCanvasTexture(updated[memoryIndex], img);
            mesh.material.map = newTex;
            mesh.material.needsUpdate = true;
          }
          return updated;
        });
        if (audioRef.current) audioRef.current.playSparkle();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Update Shruti's 3D Masterpiece Portrait Texture when user uploads a photo
  const handleShrutiPortraitUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        setShrutiPortraitUrl(dataUrl);
        const portraitMesh = sceneObjectsRef.current.portraitMesh;
        if (portraitMesh) {
          const newTex = createRoyalPortraitTexture(img);
          portraitMesh.material.map = newTex;
          portraitMesh.material.needsUpdate = true;
        }
        if (audioRef.current) audioRef.current.playSparkle();
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Focus on a specific Memory Frame in 3D space
  const focusMemoryFrame = useCallback(
    (index) => {
      const mem = memories[index];
      if (!mem) return;
      setActiveMemoryIndex(index);
      setActiveWaypoint('memories');
      if (audioRef.current) audioRef.current.playSparkle();
      flyCameraTo(
        mem.viewPos,
        { x: mem.position.x, y: mem.position.y, z: mem.position.z },
        1400
      );
    },
    [flyCameraTo, memories]
  );

  // ============================================================================
  // THREE.JS COMPLETE 3D PALACE CONSTRUCTION & INTERACTION LOOP
  // ============================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch (err) {
      setWebglError(true);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. SCENE, CAMERA & WARM GOLDEN SUNSET FOG
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#2c0c18');
    scene.fog = new THREE.FogExp2('#38121f', 0.0068);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      320
    );
    camera.position.set(0, 5.5, 82);
    camera.lookAt(0, 7.5, 32);
    sceneObjectsRef.current.camera = camera;

    // 2. SHARED ROYAL MATERIALS
    const marbleFloorTex = createMarbleTexture();
    const carpetTex = createCarpetTexture();

    const matGold = new THREE.MeshStandardMaterial({
      color: '#d4af37',
      metalness: 0.85,
      roughness: 0.22
    });
    const matChampagneGold = new THREE.MeshStandardMaterial({
      color: '#f3e5ab',
      metalness: 0.75,
      roughness: 0.28,
      emissive: '#422d05',
      emissiveIntensity: 0.2
    });
    const matCreamStone = new THREE.MeshStandardMaterial({
      color: '#f5ebe1',
      roughness: 0.65,
      metalness: 0.05
    });
    const matWarmIvory = new THREE.MeshStandardMaterial({
      color: '#fdfbf7',
      roughness: 0.45,
      metalness: 0.08
    });
    const matBurgundyVelvet = new THREE.MeshStandardMaterial({
      color: '#4a0e1e',
      roughness: 0.78,
      metalness: 0.08
    });
    const matDarkWalnut = new THREE.MeshStandardMaterial({
      color: '#2c1810',
      roughness: 0.42,
      metalness: 0.15
    });
    const matMarbleFloor = new THREE.MeshStandardMaterial({
      map: marbleFloorTex,
      roughness: 0.18,
      metalness: 0.12
    });
    const matCarpet = new THREE.MeshStandardMaterial({
      map: carpetTex,
      roughness: 0.85
    });
    const matMansardRoof = new THREE.MeshStandardMaterial({
      color: '#28232c',
      roughness: 0.5,
      metalness: 0.3
    });
    const matWarmWindow = new THREE.MeshBasicMaterial({
      color: '#ffdf9e'
    });
    const matHedge = new THREE.MeshStandardMaterial({
      color: '#223d28',
      roughness: 0.88
    });

    // 3. LIGHTING — GOLDEN SUNSET, AMBIENT & PALACE CHANDELIERS
    const hemiLight = new THREE.HemisphereLight('#ffe5b4', '#3b0a18', 0.75);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#ffb86c', 1.85);
    sunLight.position.set(45, 58, -95);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 260;
    sunLight.shadow.camera.left = -75;
    sunLight.shadow.camera.right = 75;
    sunLight.shadow.camera.top = 75;
    sunLight.shadow.camera.bottom = -75;
    scene.add(sunLight);

    // Sunset Sky Dome & Glowing Horizon Sun Disc
    const skyGeo = new THREE.SphereGeometry(240, 32, 24);
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 64;
    skyCanvas.height = 256;
    const sCtx = skyCanvas.getContext('2d');
    const skyGrad = sCtx.createLinearGradient(0, 0, 0, 256);
    skyGrad.addColorStop(0, '#160512');
    skyGrad.addColorStop(0.38, '#3b0f26');
    skyGrad.addColorStop(0.62, '#8b263d');
    skyGrad.addColorStop(0.78, '#d96b43');
    skyGrad.addColorStop(0.9, '#f7b267');
    skyGrad.addColorStop(1, '#fae19c');
    sCtx.fillStyle = skyGrad;
    sCtx.fillRect(0, 0, 64, 256);
    const skyTex = new THREE.CanvasTexture(skyCanvas);
    const skyMesh = new THREE.Mesh(
      skyGeo,
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false })
    );
    scene.add(skyMesh);

    const sunDisc = new THREE.Mesh(
      new THREE.CircleGeometry(18, 32),
      new THREE.MeshBasicMaterial({ color: '#ffe8a3', fog: false })
    );
    sunDisc.position.set(0, 26, -195);
    scene.add(sunDisc);

    // Interactive click targets array for Raycaster
    const interactables = [];

    // ========================================================================
    // SCENE 1: GRAND PALACE EXTERIOR & COURTYARD (Z: +95 to +36)
    // ========================================================================
    const courtyardGround = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 90),
      new THREE.MeshStandardMaterial({ color: '#cbb9a8', roughness: 0.85 })
    );
    courtyardGround.rotation.x = -Math.PI / 2;
    courtyardGround.position.set(0, 0, 78);
    courtyardGround.receiveShadow = true;
    scene.add(courtyardGround);

    // Central Stone Walkway & Red Carpet approach
    const approachPath = new THREE.Mesh(new THREE.PlaneGeometry(11, 56), matCreamStone);
    approachPath.rotation.x = -Math.PI / 2;
    approachPath.position.set(0, 0.02, 64);
    approachPath.receiveShadow = true;
    scene.add(approachPath);

    // Courtyard Royal Fountain at Z = 62
    const fountainGroup = new THREE.Group();
    fountainGroup.position.set(0, 0, 62);
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 6.0, 0.9, 32), matCreamStone);
    basin.position.y = 0.45;
    fountainGroup.add(basin);

    const waterPool = new THREE.Mesh(
      new THREE.CylinderGeometry(5.1, 5.1, 0.75, 32),
      new THREE.MeshStandardMaterial({
        color: '#4ea8de',
        roughness: 0.1,
        metalness: 0.6,
        transparent: true,
        opacity: 0.82
      })
    );
    waterPool.position.y = 0.5;
    fountainGroup.add(waterPool);

    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.5, 2.2, 16), matCreamStone);
    tier1.position.y = 1.4;
    fountainGroup.add(tier1);

    const tierBowl = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 1.2, 0.55, 24), matGold);
    tierBowl.position.y = 2.4;
    fountainGroup.add(tierBowl);

    const spireTop = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.4, 16), matGold);
    spireTop.position.y = 3.2;
    fountainGroup.add(spireTop);
    scene.add(fountainGroup);

    // Symmetrical Courtyard Gardens, Cypress Trees & Glowing Lanterns
    [-16, 16].forEach((sideX) => {
      for (let z = 46; z <= 82; z += 12) {
        // Manicured Boxwood Hedge & Rose bed
        const hedge = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 8), matHedge);
        hedge.position.set(sideX, 0.55, z);
        hedge.castShadow = true;
        scene.add(hedge);

        // Cypress Tree
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.35, 1.4, 8),
          matDarkWalnut
        );
        trunk.position.set(sideX, 0.7, z);
        scene.add(trunk);

        const foliage = new THREE.Mesh(new THREE.ConeGeometry(1.5, 6.5, 12), matHedge);
        foliage.position.set(sideX, 4.2, z);
        foliage.castShadow = true;
        scene.add(foliage);
      }
    });

    // Golden Courtyard Lanterns lining the main path
    [-6.5, 6.5].forEach((lx) => {
      [44, 54, 70, 80].forEach((lz) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.8, 10), matGold);
        post.position.set(lx, 1.9, lz);
        scene.add(post);

        const globe = new THREE.Mesh(
          new THREE.SphereGeometry(0.38, 12, 12),
          new THREE.MeshBasicMaterial({ color: '#ffebb3' })
        );
        globe.position.set(lx, 3.95, lz);
        scene.add(globe);
      });
    });

    // GRAND SYMMETRICAL PALACE FACADE (at Z = 36)
    const facadeGroup = new THREE.Group();
    facadeGroup.position.set(0, 0, 36);

    // Left and Right Palace Wings
    [-26, 26].forEach((wingX) => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(36, 16, 8), matCreamStone);
      wing.position.set(wingX, 8, 0);
      wing.castShadow = true;
      wing.receiveShadow = true;
      facadeGroup.add(wing);

      // Mansard Roof on Wing
      const roof = new THREE.Mesh(new THREE.ConeGeometry(26, 5.5, 4), matMansardRoof);
      roof.rotation.y = Math.PI / 4;
      roof.scale.set(1, 1, 0.32);
      roof.position.set(wingX, 18.7, 0);
      facadeGroup.add(roof);

      // Warmly Illuminated Tall French Windows across 2 floors
      for (let wx = wingX - 13; wx <= wingX + 13; wx += 6.5) {
        [4.8, 11.2].forEach((wy) => {
          const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 4.2, 0.3), matGold);
          winFrame.position.set(wx, wy, 4.05);
          facadeGroup.add(winFrame);

          const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.8), matWarmWindow);
          winGlass.position.set(wx, wy, 4.22);
          facadeGroup.add(winGlass);
        });
      }
    });

    // Central Frontispiece & Royal Dome above the Grand Entrance
    const centerHeader = new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 8.5), matCreamStone);
    centerHeader.position.set(0, 12.25, 0);
    facadeGroup.add(centerHeader);

    // Classical Pediment Triangle
    const pediment = new THREE.Mesh(new THREE.ConeGeometry(10.5, 4.2, 4), matGold);
    pediment.rotation.y = Math.PI / 4;
    pediment.scale.set(1.15, 1, 0.45);
    pediment.position.set(0, 18.0, 1.5);
    facadeGroup.add(pediment);

    // Sovereign Central Dome & Golden Spire
    const centralDome = new THREE.Mesh(
      new THREE.SphereGeometry(6.8, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      matMansardRoof
    );
    centralDome.position.set(0, 16, -2);
    facadeGroup.add(centralDome);

    const domeSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.45, 6.5, 12), matGold);
    domeSpire.position.set(0, 25.5, -2);
    facadeGroup.add(domeSpire);

    // Corinthian Columns framing the Grand Entrance
    [-6.8, -4.6, 4.6, 6.8].forEach((colX) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 14, 16), matWarmIvory);
      col.position.set(colX, 7, 4.3);
      col.castShadow = true;
      facadeGroup.add(col);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.7, 1.5), matGold);
      cap.position.set(colX, 14.1, 4.3);
      facadeGroup.add(cap);
    });

    scene.add(facadeGroup);

    // ========================================================================
    // SCENE 2: THE GRAND ENTRANCE — ANIMATED CARVED WALNUT DOORS (Z = 36)
    // ========================================================================
    const doorFrameArch = new THREE.Mesh(new THREE.BoxGeometry(8.6, 9.2, 1.4), matGold);
    doorFrameArch.position.set(0, 4.6, 36);
    // Cut out inner doorway by placing left/right/top jambs
    scene.remove(doorFrameArch);

    const jambLeft = new THREE.Mesh(new THREE.BoxGeometry(0.9, 8.8, 1.8), matGold);
    jambLeft.position.set(-3.85, 4.4, 36);
    scene.add(jambLeft);

    const jambRight = new THREE.Mesh(new THREE.BoxGeometry(0.9, 8.8, 1.8), matGold);
    jambRight.position.set(3.85, 4.4, 36);
    scene.add(jambRight);

    const lintelTop = new THREE.Mesh(new THREE.BoxGeometry(8.8, 1.2, 2.0), matGold);
    lintelTop.position.set(0, 8.9, 36);
    scene.add(lintelTop);

    // Left and Right Pivoting Walnut Doors
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-3.4, 0, 36);
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(3.4, 0, 36);

    const buildPalaceDoorLeaf = (isLeft) => {
      const leafGroup = new THREE.Group();
      const offsetX = isLeft ? 1.7 : -1.7;

      const panel = new THREE.Mesh(new THREE.BoxGeometry(3.38, 8.4, 0.36), matDarkWalnut);
      panel.position.set(offsetX, 4.2, 0);
      panel.castShadow = true;
      leafGroup.add(panel);

      // Ornate gold mouldings & royal crest on each door leaf
      [2.1, 6.2].forEach((py) => {
        const moulding = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.1, 0.42), matGold);
        moulding.position.set(offsetX, py, 0);
        leafGroup.add(moulding);

        const innerWood = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.8, 0.45), matDarkWalnut);
        innerWood.position.set(offsetX, py, 0);
        leafGroup.add(innerWood);
      });

      // Royal Emblem Medallion
      const crest = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.48, 20), matGold);
      crest.rotation.x = Math.PI / 2;
      crest.position.set(offsetX, 4.5, 0);
      leafGroup.add(crest);

      // Antique Gold Door Handle
      const handleX = isLeft ? 3.05 : -3.05;
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 12, 24), matChampagneGold);
      handle.position.set(handleX, 3.8, 0.28);
      leafGroup.add(handle);

      panel.userData = { interactType: 'grand_doors' };
      interactables.push(panel);
      return leafGroup;
    };

    leftDoorPivot.add(buildPalaceDoorLeaf(true));
    rightDoorPivot.add(buildPalaceDoorLeaf(false));
    scene.add(leftDoorPivot);
    scene.add(rightDoorPivot);

    sceneObjectsRef.current.leftDoorPivot = leftDoorPivot;
    sceneObjectsRef.current.rightDoorPivot = rightDoorPivot;

    // Warm Golden Light Spilling from Inside the Doorway
    const doorwaySpillLight = new THREE.PointLight('#ffcf75', 2.4, 24);
    doorwaySpillLight.position.set(0, 5.5, 32);
    scene.add(doorwaySpillLight);

    // ========================================================================
    // SCENE 3 & 4: THE ROYAL GALLERY & MEMORY GALLERY (Z: +36 to -18)
    // ========================================================================
    // Marble Floor spanning Gallery & Portrait Hall (Z: +36 to -38)
    const interiorFloor = new THREE.Mesh(new THREE.PlaneGeometry(24, 76), matMarbleFloor);
    interiorFloor.rotation.x = -Math.PI / 2;
    interiorFloor.position.set(0, 0.01, -2);
    interiorFloor.receiveShadow = true;
    scene.add(interiorFloor);

    // Royal Red/Burgundy Carpet Runner down the center
    const royalRunner = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 74), matCarpet);
    royalRunner.rotation.x = -Math.PI / 2;
    royalRunner.position.set(0, 0.03, -1);
    royalRunner.receiveShadow = true;
    scene.add(royalRunner);

    // Coffered Ceiling over Gallery
    const galleryCeiling = new THREE.Mesh(new THREE.PlaneGeometry(24, 56), matWarmIvory);
    galleryCeiling.rotation.x = Math.PI / 2;
    galleryCeiling.position.set(0, 12.5, 9);
    scene.add(galleryCeiling);

    // Gallery Side Walls, Dark Walnut Wainscoting, Fluted Columns & Volumetric Sunbeams
    [-10.2, 10.2].forEach((wallX) => {
      const mainWall = new THREE.Mesh(new THREE.BoxGeometry(0.8, 12.5, 54), matCreamStone);
      mainWall.position.set(wallX, 6.25, 9);
      mainWall.receiveShadow = true;
      scene.add(mainWall);

      // Dark Walnut Wainscoting Lower Panel
      const wainscot = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.6, 54), matDarkWalnut);
      wainscot.position.set(wallX, 1.3, 9);
      scene.add(wainscot);

      const goldChairRail = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.18, 54), matGold);
      goldChairRail.position.set(wallX, 2.65, 9);
      scene.add(goldChairRail);
    });

    // Fluted Colonnade Pillars & Royal Velvet Benches along the Gallery
    for (let z = 30; z >= -14; z -= 8) {
      [-8.8, 8.8].forEach((colX) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.52, 11.8, 16),
          matWarmIvory
        );
        pillar.position.set(colX, 5.9, z);
        pillar.castShadow = true;
        scene.add(pillar);

        const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 1.3), matGold);
        base.position.set(colX, 0.3, z);
        scene.add(base);

        const cap = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.65, 1.35), matGold);
        cap.position.set(colX, 11.9, z);
        scene.add(cap);
      });
    }

    // Royal Benches
    [22, 6, -8].forEach((bz) => {
      [-5.6, 5.6].forEach((bx) => {
        const benchGroup = new THREE.Group();
        benchGroup.position.set(bx, 0, bz);
        const cushion = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.35, 3.2),
          matBurgundyVelvet
        );
        cushion.position.y = 0.75;
        benchGroup.add(cushion);

        const trim = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.12, 3.26), matGold);
        trim.position.y = 0.55;
        benchGroup.add(trim);
        scene.add(benchGroup);
      });
    });

    // 4 Ornate Golden Crystal Chandeliers along the Royal Gallery
    const chandelierPositionsZ = [26, 14, 2, -10];
    chandelierPositionsZ.forEach((cz) => {
      const chand = new THREE.Group();
      chand.position.set(0, 10.2, cz);

      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8), matGold);
      chain.position.y = 1.2;
      chand.add(chain);

      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.09, 12, 24), matGold);
      ring1.rotation.x = Math.PI / 2;
      chand.add(ring1);

      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.07, 12, 20), matGold);
      ring2.rotation.x = Math.PI / 2;
      ring2.position.y = 0.55;
      chand.add(ring2);

      // Glowing crystal candles around chandelier ring
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 8, 8),
          new THREE.MeshBasicMaterial({ color: '#fff3c4' })
        );
        bulb.position.set(Math.cos(angle) * 1.6, 0.22, Math.sin(angle) * 1.6);
        chand.add(bulb);
      }

      const chandLight = new THREE.PointLight('#ffcf78', 1.25, 22);
      chandLight.position.set(0, -0.4, 0);
      chand.add(chandLight);

      scene.add(chand);
    });

    // Volumetric Golden Light Shafts pouring through upper gallery windows
    const rayMat = new THREE.MeshBasicMaterial({
      color: '#ffe49e',
      transparent: true,
      opacity: 0.065,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    [24, 8, -6].forEach((rz) => {
      const rayCone = new THREE.Mesh(new THREE.ConeGeometry(3.2, 13, 16, 1, true), rayMat);
      rayCone.position.set(5.2, 6.2, rz);
      rayCone.rotation.z = Math.PI / 5.5;
      scene.add(rayCone);
    });

    // ========================================================================
    // SCENE 4: 5 INTERACTIVE MEMORY GALLERY FRAMES (Z: +18 to -11)
    // ========================================================================
    const memoryMeshes = [];
    INITIAL_MEMORIES.forEach((mem, index) => {
      const frameGroup = new THREE.Group();
      frameGroup.position.set(mem.position.x, mem.position.y, mem.position.z);
      frameGroup.rotation.y = mem.position.rotY;

      // Outer sculpted antique gold frame
      const outerGold = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.0, 0.22), matGold);
      outerGold.castShadow = true;
      frameGroup.add(outerGold);

     const portraitTex = createRoyalPortraitTexture(null);
    const portraitMat = new THREE.MeshBasicMaterial({ map: portraitTex });
    const portraitCanvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 5.2), portraitMat);
    portraitCanvasMesh.position.z = 0.2;
    portraitCanvasMesh.userData = { interactType: 'portrait' };
    portraitHolder.add(portraitCanvasMesh);
    interactables.push(portraitCanvasMesh);
    sceneObjectsRef.current.portraitMesh = portraitCanvasMesh;

    const defaultPortraitImg = new Image();
    defaultPortraitImg.crossOrigin = 'anonymous';
    defaultPortraitImg.onload = () => {
      portraitMat.map = createRoyalPortraitTexture(defaultPortraitImg);
      portraitMat.needsUpdate = true;
    };
    defaultPortraitImg.src = './photo6.jpg';

      // Dedicated Museum Picture Light above frame
      const lampBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8), matGold);
      lampBar.rotation.z = Math.PI / 2;
      lampBar.position.set(0, 2.25, 0.35);
      frameGroup.add(lampBar);

      scene.add(frameGroup);
    });
    sceneObjectsRef.current.memoryFrameMeshes = memoryMeshes;

    // ========================================================================
    // SCENE 5: THE ROYAL PORTRAIT HALL (Z: -18 to -38)
    // ========================================================================
    const rotundaGroup = new THREE.Group();
    rotundaGroup.position.set(0, 0, -28);

    // Octagonal / Curved Rotunda Side Walls
    [-12.5, 12.5].forEach((rx) => {
      const rWall = new THREE.Mesh(new THREE.BoxGeometry(1.0, 12.5, 22), matBurgundyVelvet);
      rWall.position.set(rx, 6.25, 0);
      rotundaGroup.add(rWall);
    });

    // Raised Circular Marble Dais for Shruti's Central Masterpiece Portrait
    const portraitDais = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.2, 0.45, 32), matGold);
    portraitDais.position.set(0, 0.22, -3.2);
    rotundaGroup.add(portraitDais);

    const innerDais = new THREE.Mesh(
      new THREE.CylinderGeometry(4.5, 4.5, 0.5, 32),
      matBurgundyVelvet
    );
    innerDais.position.set(0, 0.25, -3.2);
    rotundaGroup.add(innerDais);

    // Central Masterpiece Frame for Princess Shruti at Z = -31.2
    const portraitHolder = new THREE.Group();
    portraitHolder.position.set(0, 4.9, -3.2);

    const masterOuterFrame = new THREE.Mesh(new THREE.BoxGeometry(4.6, 5.8, 0.35), matGold);
    masterOuterFrame.castShadow = true;
    portraitHolder.add(masterOuterFrame);

    // Crown topper above Shruti's frame
    const crownTopper = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.9, 6), matChampagneGold);
    crownTopper.position.set(0, 3.25, 0.1);
    portraitHolder.add(crownTopper);

    const portraitTex = createRoyalPortraitTexture(null);
    const portraitMat = new THREE.MeshBasicMaterial({ map: portraitTex });
    const portraitCanvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 5.2), portraitMat);
    portraitCanvasMesh.position.z = 0.2;
    portraitCanvasMesh.userData = { interactType: 'portrait' };
    portraitHolder.add(portraitCanvasMesh);
    interactables.push(portraitCanvasMesh);
    sceneObjectsRef.current.portraitMesh = portraitCanvasMesh;

    // Dedicated warm spotlight on Shruti's Portrait
    const portraitSpot = new THREE.PointLight('#ffdf91', 2.2, 16);
    portraitSpot.position.set(0, 3.8, 3.5);
    portraitHolder.add(portraitSpot);

    rotundaGroup.add(portraitHolder);

    // Velvet Stanchion Ropes flanking the Portrait Dais
    [-3.4, 3.4].forEach((sx) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 1.2, 12), matGold);
      post.position.set(sx, 0.6, 0.5);
      rotundaGroup.add(post);
    });

    scene.add(rotundaGroup);

    // ========================================================================
    // SCENE 6: THE SUNSET ROSE GARDEN & INTERACTIVE PLAQUES (Z: -38 to -90)
    // ========================================================================
    const gardenGround = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 110),
      new THREE.MeshStandardMaterial({ color: '#1f3622', roughness: 0.92 })
    );
    gardenGround.rotation.x = -Math.PI / 2;
    gardenGround.position.set(0, 0, -88);
    gardenGround.receiveShadow = true;
    scene.add(gardenGround);

    // Stone Garden Walkway extending from Z = -38 to Z = -108
    const gardenPath = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 72), matCreamStone);
    gardenPath.rotation.x = -Math.PI / 2;
    gardenPath.position.set(0, 0.03, -74);
    gardenPath.receiveShadow = true;
    scene.add(gardenPath);

    // Rose-Covered Golden Arches over the Garden Path
    const rosePinkMat = new THREE.MeshStandardMaterial({ color: '#e8b4bc', roughness: 0.5 });
    const deepRoseMat = new THREE.MeshStandardMaterial({ color: '#c95b76', roughness: 0.5 });
    const ivoryRoseMat = new THREE.MeshStandardMaterial({ color: '#fdfbf7', roughness: 0.5 });
    const roseMaterials = [rosePinkMat, deepRoseMat, ivoryRoseMat];

    [-44, -56, -68, -80].forEach((archZ) => {
      const archGroup = new THREE.Group();
      archGroup.position.set(0, 0, archZ);

      [-3.6, 3.6].forEach((ax) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.8, 12), matGold);
        col.position.set(ax, 2.4, 0);
        archGroup.add(col);
      });

      const archTop = new THREE.Mesh(
        new THREE.TorusGeometry(3.6, 0.16, 12, 28, Math.PI),
        matGold
      );
      archTop.position.set(0, 4.8, 0);
      archGroup.add(archTop);

      // Climbing roses along the arch
      for (let i = 0; i <= 10; i++) {
        const angle = (i / 10) * Math.PI;
        const rx = Math.cos(angle) * 3.6;
        const ry = 4.8 + Math.sin(angle) * 3.6;
        const bloom = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.32, 1),
          roseMaterials[i % roseMaterials.length]
        );
        bloom.position.set(rx, ry, (Math.random() - 0.5) * 0.3);
        archGroup.add(bloom);
      }

      scene.add(archGroup);
    });

    // Lush 3D Rose Bushes & Symmetrical Hedges lining the Garden
    const swayingFoliage = [];
    for (let z = -42; z >= -94; z -= 5.5) {
      [-6.2, 6.2].forEach((bx, sideIdx) => {
        const bushGroup = new THREE.Group();
        bushGroup.position.set(bx + (Math.random() - 0.5) * 0.8, 0, z);

        const leafMound = new THREE.Mesh(new THREE.SphereGeometry(1.35, 12, 10), matHedge);
        leafMound.scale.set(1.2, 0.85, 1.1);
        leafMound.position.y = 0.85;
        leafMound.castShadow = true;
        bushGroup.add(leafMound);

        // Cluster of 3D Roses on each bush
        for (let r = 0; r < 9; r++) {
          const theta = (r / 9) * Math.PI * 2;
          const rose = new THREE.Mesh(
            new THREE.DodecahedronGeometry(0.22, 1),
            roseMaterials[(r + sideIdx) % roseMaterials.length]
          );
          rose.position.set(
            Math.cos(theta) * 1.1,
            1.1 + ( r % 3 ) * 0.25,
            Math.sin(theta) * 0.95
          );
          bushGroup.add(rose);
        }

        scene.add(bushGroup);
        swayingFoliage.push(bushGroup);
      });
    }

    // 3 Interactive Royal Brass Plaques on Stone Pedestals (Scene 6)
    GARDEN_PLAQUES.forEach((plaque) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(plaque.position.x, 0, plaque.position.z);
      pGroup.rotation.y = plaque.position.x < 0 ? Math.PI / 5 : -Math.PI / 5;

      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.55, 1.35, 16),
        matCreamStone
      );
      pedestal.position.y = 0.675;
      pedestal.castShadow = true;
      pGroup.add(pedestal);

      const brassPlate = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.85, 0.12), matGold);
      brassPlate.position.set(0, 1.5, 0);
      brassPlate.rotation.x = -Math.PI / 6;
      brassPlate.userData = { interactType: 'plaque', plaqueData: plaque };
      pGroup.add(brassPlate);
      interactables.push(brassPlate);

      scene.add(pGroup);
    });

    // ========================================================================
    // SCENE 7: THE ROYAL WRITING DESK & WAX-SEALED LETTER (Z = -88.5)
    // ========================================================================
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, -88.5);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.22, 1.8), matDarkWalnut);
    deskTop.position.y = 1.55;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    const deskGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.1, 1.9), matGold);
    deskGoldTrim.position.y = 1.52;
    deskGroup.add(deskGoldTrim);

    // 4 Cabriole Desk Legs
    [
      [-1.35, -0.7],
      [1.35, -0.7],
      [-1.35, 0.7],
      [1.35, 0.7]
    ].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 1.5, 12), matDarkWalnut);
      leg.position.set(lx, 0.75, lz);
      deskGroup.add(leg);
    });

    // 3D Royal Envelope with Crimson & Gold Wax Seal
    const envelopeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.08, 0.65),
      matWarmIvory
    );
    envelopeMesh.position.set(0, 1.71, 0.1);
    envelopeMesh.rotation.y = 0.08;
    envelopeMesh.userData = { interactType: 'letter' };
    deskGroup.add(envelopeMesh);
    interactables.push(envelopeMesh);

    const waxSeal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: '#8b001a', roughness: 0.3, metalness: 0.2 })
    );
    waxSeal.position.set(0, 1.75, 0.12);
    waxSeal.userData = { interactType: 'letter' };
    deskGroup.add(waxSeal);
    interactables.push(waxSeal);

    // Golden Candelabra on the Writing Desk
    const candelabra = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 0.65, 12), matGold);
    candelabra.position.set(-1.1, 1.95, -0.35);
    deskGroup.add(candelabra);

    const deskLight = new THREE.PointLight('#ffcf70', 1.8, 12);
    deskLight.position.set(0, 2.8, 0.4);
    deskGroup.add(deskLight);

    scene.add(deskGroup);

    // ========================================================================
    // SCENE 8: THE CROWN CEREMONY PAVILION & 3D GOLDEN CROWN (Z = -102.5)
    // ========================================================================
    const pavilionGroup = new THREE.Group();
    pavilionGroup.position.set(0, 0, -102.5);

    // 3-step Circular Marble Steps
    [
      { r: 7.2, h: 0.3, y: 0.15 },
      { r: 6.2, h: 0.3, y: 0.45 },
      { r: 5.2, h: 0.3, y: 0.75 }
    ].forEach((st) => {
      const step = new THREE.Mesh(
        new THREE.CylinderGeometry(st.r, st.r + 0.2, st.h, 36),
        matCreamStone
      );
      step.position.y = st.y;
      step.receiveShadow = true;
      pavilionGroup.add(step);
    });

    // Ring of 6 Classical Pavilion Columns supporting an Open Golden Ring Dome
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
      const px = Math.cos(angle) * 4.5;
      const pz = Math.sin(angle) * 4.5;
      const pCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.38, 6.2, 16),
        matWarmIvory
      );
      pCol.position.set(px, 3.9, pz);
      pCol.castShadow = true;
      pavilionGroup.add(pCol);
    }

    const pavilionRing = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.32, 16, 48), matGold);
    pavilionRing.rotation.x = Math.PI / 2;
    pavilionRing.position.y = 7.1;
    pavilionGroup.add(pavilionRing);

    // Royal Crown Pedestal & Velvet Cushion
    const crownPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.92, 1.55, 24),
      matWarmIvory
    );
    crownPedestal.position.y = 1.65;
    crownPedestal.castShadow = true;
    crownPedestal.userData = { interactType: 'crown' };
    pavilionGroup.add(crownPedestal);
    interactables.push(crownPedestal);

    const cushionMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.28, 1.15),
      matBurgundyVelvet
    );
    cushionMesh.position.y = 2.5;
    cushionMesh.userData = { interactType: 'crown' };
    pavilionGroup.add(cushionMesh);
    interactables.push(cushionMesh);

    // DETAILED 3D GOLDEN PRINCESS CROWN
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 2.85, 0);

    const baseBand = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.065, 16, 36), matGold);
    baseBand.rotation.x = Math.PI / 2;
    crownGroup.add(baseBand);

    const upperBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.51, 0.035, 12, 36),
      matChampagneGold
    );
    upperBand.rotation.x = Math.PI / 2;
    upperBand.position.y = 0.14;
    crownGroup.add(upperBand);

    const rubyMat = new THREE.MeshStandardMaterial({
      color: '#e0115f',
      roughness: 0.1,
      metalness: 0.4,
      emissive: '#6b052b',
      emissiveIntensity: 0.5
    });
    const pearlMat = new THREE.MeshStandardMaterial({
      color: '#fffdf9',
      roughness: 0.15,
      metalness: 0.2
    });

    // 8 Ornate Crown Spires, Pearls & Gemstones
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = 0.49;
      const sx = Math.cos(a) * r;
      const sz = Math.sin(a) * r;
      const spireH = i % 2 === 0 ? 0.46 : 0.3;

      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.085, spireH, 8), matGold);
      spire.position.set(sx, 0.15 + spireH / 2, sz);
      crownGroup.add(spire);

      const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), pearlMat);
      pearl.position.set(sx, 0.16 + spireH, sz);
      crownGroup.add(pearl);

      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), rubyMat);
      gem.position.set(Math.cos(a) * 0.54, 0.05, Math.sin(a) * 0.54);
      crownGroup.add(gem);
    }

    //Invisible click sphere around the crown for easy interaction
    const crownHitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.95, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    crownHitBox.userData = { interactType: 'crown' };
    crownGroup.add(crownHitBox);
    interactables.push(crownHitBox);

    const crownLight = new THREE.PointLight('#ffd86b', 2.2, 18);
    crownLight.position.set(0, 1.2, 0);
    crownGroup.add(crownLight);

    pavilionGroup.add(crownGroup);
    scene.add(pavilionGroup);

    sceneObjectsRef.current.crownGroup = crownGroup;
    sceneObjectsRef.current.crownLight = crownLight;

    // ========================================================================
    // ATMOSPHERIC PARTICLES: GOLDEN DUST MOTES & FLOATING ROSE PETALS
    // ========================================================================
    // 1. Golden Dust Particles throughout the Palace & Courtyard
    const dustCount = 420;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 44;
      dustPos[i * 3 + 1] = 0.6 + Math.random() * 11;
      dustPos[i * 3 + 2] = 85 - Math.random() * 200;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustPoints = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: '#fae094',
        size: 0.16,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      })
    );
    scene.add(dustPoints);

    // 2. 3D Floating Rose Petals in the Sunset Garden & Finale
    const petalCount = 110;
    const petalMeshes = [];
    const petalGeo = new THREE.CircleGeometry(0.14, 6);
    petalGeo.scale(1.4, 0.85, 1);
    for (let i = 0; i < petalCount; i++) {
      const pMesh = new THREE.Mesh(
        petalGeo,
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#f48fb1' : '#f8bbd0',
          side: THREE.DoubleSide
        })
      );
      pMesh.position.set(
        (Math.random() - 0.5) * 36,
        1.0 + Math.random() * 14,
        -35 - Math.random() * 85
      );
      pMesh.userData = {
        speedY: 0.012 + Math.random() * 0.018,
        driftX: (Math.random() - 0.5) * 0.02,
        rotSpeed: 0.015 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2
      };
      scene.add(pMesh);
      petalMeshes.push(pMesh);
    }

    // ========================================================================
    // INPUT LISTENERS: KEYBOARD (WASD), MOUSE LOOK & RAYCAST CLICK
    // ========================================================================
    const keysPressed = {};
    const handleKeyDown = (e) => {
      keysPressed[e.code] = true;
      if (e.code === 'Escape') {
        setControlsModalOpen((prev) => !prev);
      }
    };
    const handleKeyUp = (e) => {
      keysPressed[e.code] = false;
    };

    renderer.domElement.style.touchAction = 'none';
    let activePointerId = null;
    let pointerDownPos = { x: 0, y: 0 };
    let lastPointerPos = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      if (e.target !== renderer.domElement) return;
      sceneObjectsRef.current.isDraggingLook = true;
      activePointerId = e.pointerId;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      lastPointerPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e) => {
      if (!sceneObjectsRef.current.isDraggingLook || e.pointerId !== activePointerId) return;
      const dx = e.clientX - lastPointerPos.x;
      const dy = e.clientY - lastPointerPos.y;
      lastPointerPos = { x: e.clientX, y: e.clientY };

      const isTouch = e.pointerType === 'touch';
      const yawSpeed = isTouch ? 0.0095 : 0.0032;
      const pitchSpeed = isTouch ? 0.007 : 0.0025;

      const sc = sceneObjectsRef.current;
      sc.playerYaw -= dx * yawSpeed;
      sc.playerPitch = Math.max(-0.55, Math.min(0.55, sc.playerPitch - dy * pitchSpeed));
    };
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const handlePointerUp = (e) => {
      if (!sceneObjectsRef.current.isDraggingLook) return;
      sceneObjectsRef.current.isDraggingLook = false;

      // If pointer barely moved, treat as an interactive 3D click
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist < 6 && e.target === renderer.domElement) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseVec, camera);
        const hits = raycaster.intersectObjects(interactables, false);
        if (hits.length > 0 && hits[0].distance < 24) {
          const data = hits[0].object.userData;
          if (data.interactType === 'grand_doors') {
            handleOpenGrandDoors();
          } else if (data.interactType === 'memory') {
            focusMemoryFrame(data.memoryIndex);
          } else if (data.interactType === 'portrait') {
            if (audioRef.current) audioRef.current.playSparkle();
            setPortraitModalOpen(true);
            flyCameraTo({ x: 0, y: 4.5, z: -24.5 }, { x: 0, y: 4.9, z: -31.2 }, 1400);
          } else if (data.interactType === 'plaque') {
            if (audioRef.current) audioRef.current.playSparkle();
            setActivePlaque(data.plaqueData);
            flyCameraTo(
              data.plaqueData.viewPos,
              {
                x: data.plaqueData.position.x,
                y: 1.5,
                z: data.plaqueData.position.z
              },
              1300
            );
          } else if (data.interactType === 'letter') {
            if (audioRef.current) audioRef.current.playSparkle();
            setLetterModalOpen(true);
            flyCameraTo({ x: 0, y: 2.6, z: -85.2 }, { x: 0, y: 1.75, z: -88.5 }, 1300);
          } else if (data.interactType === 'crown') {
            handleClaimCrown();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ========================================================================
    // MAIN ANIMATION & FIRST-PERSON EXPLORATION LOOP
    // ========================================================================
    let animId;
    let lastProximityCheck = 0;

    const animate = (now) => {
      animId = requestAnimationFrame(animate);
      const t = now * 0.001;
      const sc = sceneObjectsRef.current;

      // 1. Animate Grand Palace Doors swinging inward smoothly
      if (sc.doorsOpening && sc.doorsOpenAmount < 1) {
        sc.doorsOpenAmount = Math.min(1, sc.doorsOpenAmount + 0.009);
        const eased = 1 - Math.pow(1 - sc.doorsOpenAmount, 3);
        const targetAngle = eased * (Math.PI * 0.62);
        if (sc.leftDoorPivot) sc.leftDoorPivot.rotation.y = targetAngle;
        if (sc.rightDoorPivot) sc.rightDoorPivot.rotation.y = -targetAngle;
      }

      // 2. Animate 3D Golden Princess Crown Rotation & Ceremony Levitation
      if (sc.crownGroup) {
        sc.crownGroup.rotation.y = t * (sc.crownClaimedAnim ? 1.15 : 0.45);
        if (sc.crownClaimedAnim && sc.crownHeightOffset < 1.15) {
          sc.crownHeightOffset = Math.min(1.15, sc.crownHeightOffset + 0.008);
        }
        sc.crownGroup.position.y = 2.85 + sc.crownHeightOffset + Math.sin(t * 2.2) * 0.06;
        if (sc.crownClaimedAnim && sc.crownLight) {
          sc.crownLight.intensity = 3.8 + Math.sin(t * 4) * 0.6;
        }
      }

      // 3. Gentle Wind Sway on Rose Garden Bushes
      swayingFoliage.forEach((bush, idx) => {
        bush.rotation.z = Math.sin(t * 1.4 + idx) * 0.022;
      });

      // 4. Animate Floating Rose Petals
      petalMeshes.forEach((p) => {
        p.position.y -= p.userData.speedY;
        p.position.x += Math.sin(t + p.userData.phase) * 0.015;
        p.rotation.x += p.userData.rotSpeed;
        p.rotation.y += p.userData.rotSpeed * 0.8;
        if (p.position.y < 0.2) {
          p.position.y = 13.5;
        }
      });

      // 5. Animate Golden Dust Particles
      const posAttr = dustGeo.getAttribute('position');
      for (let i = 0; i < dustCount; i++) {
        let py = posAttr.getY(i) + 0.004;
        if (py > 12) py = 0.6;
        posAttr.setY(i, py);
      }
      posAttr.needsUpdate = true;

      // 6. Camera Tweening OR First-Person Player Movement
      if (sc.cameraTween) {
        const tw = sc.cameraTween;
        const progress = Math.min(1, (now - tw.startTime) / tw.duration);
        // Smooth quintic ease-in-out
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        camera.position.lerpVectors(tw.startPos, tw.endPos, ease);
        const currentLook = new THREE.Vector3().lerpVectors(tw.startLookAt, tw.endLookAt, ease);
        camera.lookAt(currentLook);

        if (progress >= 1) {
          const cb = tw.onComplete;
          sc.cameraTween = null;
          if (cb) cb();
        }
      } else {
        // First-Person WASD + Virtual Joystick Exploration
        let moveZ = sc.moveState.forward;
        let moveX = sc.moveState.right;

        if (keysPressed['KeyW'] || keysPressed['ArrowUp']) moveZ += 1;
        if (keysPressed['KeyS'] || keysPressed['ArrowDown']) moveZ -= 1;
        if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) moveX -= 1;
        if (keysPressed['KeyD'] || keysPressed['ArrowRight']) moveX += 1;

        const euler = new THREE.Euler(sc.playerPitch, sc.playerYaw, 0, 'YXZ');
        camera.quaternion.setFromEuler(euler);

        if (Math.abs(moveZ) > 0.05 || Math.abs(moveX) > 0.05) {
          const speed = 0.16;
          const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            sc.playerYaw
          );
          const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            sc.playerYaw
          );

          const nextPos = camera.position
            .clone()
            .addScaledVector(forwardVec, moveZ * speed)
            .addScaledVector(rightVec, moveX * speed);

          // Prevent walking through closed Grand Doors at Z = 36
          if (!sc.doorsOpening && nextPos.z < 38.2 && camera.position.z >= 38.2) {
            nextPos.z = 38.2;
          }

          // Corridor & Garden bounds
          const maxHalfWidth = nextPos.z > 36 || nextPos.z < -38 ? 14 : 7.4;
          nextPos.x = Math.max(-maxHalfWidth, Math.min(maxHalfWidth, nextPos.x));
          nextPos.z = Math.max(-112, Math.min(86, nextPos.z));

          // Gentle head-bob while walking
          nextPos.y = 3.3 + Math.sin(t * 8.5) * 0.045;
          camera.position.copy(nextPos);

          if (audioRef.current) audioRef.current.playFootstep();
        }
      }

      // 7. Proximity Detection for Floating Interactive Prompts (throttled to every 180ms)
      if (now - lastProximityCheck > 180) {
        lastProximityCheck = now;
        const cz = camera.position.z;
        const cx = camera.position.x;

        let detected = null;

        // Check Grand Doors proximity
        if (!sc.doorsOpening && cz > 36 && cz < 50) {
          detected = {
            type: 'doors',
            title: 'Welcome, Your Highness.',
            subtitle: 'The doors are waiting for you.',
            buttonText: 'OPEN THE DOORS'
          };
        }

        // Check 5 Memory Frames proximity
        if (!detected) {
          INITIAL_MEMORIES.forEach((m, idx) => {
            const dist = Math.hypot(cx - m.position.x, cz - m.position.z);
            if (dist < 7.5) {
              detected = {
                type: 'memory',
                memoryIndex: idx,
                title: `${m.code} — ${m.title}`,
                subtitle: 'Approach or click to inspect this royal memory frame',
                buttonText: 'OPEN MEMORY CARD'
              };
            }
          });
        }

        // Check Central Portrait Hall proximity
        if (!detected && Math.hypot(cx - 0, cz - -26) < 8.5) {
          detected = {
            type: 'portrait',
            title: 'Every kingdom deserves its own masterpiece.',
            subtitle: 'The Sovereign Portrait of Princess Shruti',
            buttonText: 'INSPECT ROYAL PORTRAIT'
          };
        }

        // Check 3 Rose Garden Plaques proximity
        if (!detected) {
          GARDEN_PLAQUES.forEach((pl) => {
            const dist = Math.hypot(cx - pl.position.x, cz - pl.position.z);
            if (dist < 5.8) {
              detected = {
                type: 'plaque',
                plaque: pl,
                title: pl.title,
                subtitle: `"${pl.quote}"`,
                buttonText: 'READ ROYAL PLAQUE'
              };
            }
          });
        }

        // Check Royal Letter Desk proximity
        if (!detected && Math.hypot(cx - 0, cz - -85.5) < 6.8) {
          detected = {
            type: 'letter',
            title: 'TO: HER ROYAL HIGHNESS SHRUTI',
            subtitle: 'A wax-sealed royal letter rests upon the writing desk.',
            buttonText: 'OPEN ROYAL LETTER'
          };
        }

        // Check Crown Pedestal proximity
        if (!detected && Math.hypot(cx - 0, cz - -99) < 7.8) {
          detected = {
            type: 'crown',
            title: 'Every princess deserves her crown.',
            subtitle: 'The Royal Pavilion of Princess Shruti',
            buttonText: 'CLAIM YOUR CROWN'
          };
        }

        setNearbyPrompt(detected);
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [
    flyCameraTo,
    focusMemoryFrame,
    handleClaimCrown,
    handleOpenGrandDoors
  ]);

  // Mobile Virtual Touch Pad Handler
  const setMobileMove = (forward, right) => {
    sceneObjectsRef.current.moveState = { forward, right };
  };

  // Current active memory object
  const currentMemory = activeMemoryIndex !== null ? memories[activeMemoryIndex] : null;

  // Graceful fallback if WebGL is disabled
  if (webglError) {
    return (
      <div className="min-h-screen bg-[#24050e] text-[#fdfbf7] flex flex-col items-center justify-center p-8 text-center font-serif">
        <Crown className="w-16 h-16 text-[#d4af37] mb-4" />
        <h1 className="text-3xl font-bold text-[#f3e5ab] mb-2">THE GHANA REGENCY</h1>
        <p className="max-w-md text-[#e8b4bc]">
          Happy Princess Day, Your Highness Shruti! Please enable hardware acceleration (WebGL) in
          your browser to explore your 3D Royal Palace.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a040a] select-none font-serif text-[#fdfbf7]">
      {/* ====================================================================
          3D THREE.JS PALACE CANVAS
      ==================================================================== */}
      <div
        ref={mountRef}
        style={{ touchAction: 'none' }}
        className={`w-full h-full touch-none transition-all duration-700 ${
          activeMemoryIndex !== null ||
          portraitModalOpen ||
          activePlaque !== null ||
          letterModalOpen ||
          crownRevealCardOpen
            ? 'blur-[4px] scale-[1.01] brightness-75'
            : ''
        }`}
      />

      {/* Subtle Golden Vignette Overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 58%, rgba(20, 3, 9, 0.65) 100%)'
        }}
      />

      {/* ====================================================================
          OPENING SEQUENCE — THE ROYAL INVITATION (MILESTONE 1)
      ==================================================================== */}
      {stage === 'invitation' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a040b] via-[#2e0713] to-[#170308] px-6 text-center">
          {/* Decorative Floating Golden Dust in Invitation Overlay */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-[#f3e5ab] animate-pulse"
                style={{
                  width: `${3 + (i % 4)}px`,
                  height: `${3 + (i % 4)}px`,
                  left: `${(i * 19) % 100}%`,
                  top: `${(i * 27) % 100}%`,
                  animationDuration: `${2 + (i % 3)}s`
                }}
              />
            ))}
          </div>

          {/* Ornate Antique Gold Border Frame */}
          <div className="relative max-w-xl w-full border border-[#d4af37]/50 bg-[#260610]/85 backdrop-blur-md p-8 sm:p-12 rounded-sm shadow-[0_0_80px_rgba(212,175,55,0.18)]">
            <div className="absolute inset-2 border border-[#d4af37]/25 pointer-events-none" />

            {/* Royal Emblem SVG */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-full border-2 border-[#d4af37] bg-[#3b0a18] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.35)]">
              <Crown className="w-10 h-10 text-[#f3e5ab]" />
            </div>

            <p className="text-xs tracking-[0.38em] uppercase text-[#e8b4bc] mb-2">
              A Royal Princess Day Dedication
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-[0.14em] text-[#f3e5ab] mb-2">
              THE GHANA REGENCY
            </h1>
            <p className="text-lg sm:text-xl italic text-[#d8a7b1] mb-8">
              A Royal Experience for Princess Shruti
            </p>

            {/* Loading Progress & Filigree Bar */}
            <div className="max-w-xs mx-auto mb-8">
              <div className="flex items-center justify-between text-xs tracking-[0.2em] text-[#f3e5ab]/80 uppercase mb-2">
                <span>Preparing your palace...</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#160308] border border-[#d4af37]/40 overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] transition-all duration-150"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleEnterPalace}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-[#1f040b] font-bold tracking-[0.22em] text-xs sm:text-sm uppercase rounded-sm shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_50px_rgba(243,229,171,0.75)] hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#24050e]" />
              <span>[ ENTER THE PALACE ]</span>
              <Sparkles className="w-4 h-4 text-[#24050e]" />
            </button>

            <p className="mt-5 text-[11px] tracking-widest text-[#e8b4bc]/70 uppercase">
              Best Experienced with Orchestral Sound Enabled
            </p>
          </div>
        </div>
      )}

      {/* ====================================================================
          CINEMATIC INTRO SUBTITLE OVERLAY (SCENE 1)
      ==================================================================== */}
      {stage === 'cinematic_intro' && (
        <div className="pointer-events-none fixed inset-x-0 top-24 z-30 flex flex-col items-center text-center px-4 animate-fade-in">
          <p className="text-xs tracking-[0.35em] uppercase text-[#f3e5ab] mb-1 drop-shadow">
            THE GHANA REGENCY
          </p>
          <h2 className="text-2xl sm:text-3xl italic text-[#fdfbf7] drop-shadow-lg">
            Preparing your palace...
          </h2>
        </div>
      )}

      {/* ====================================================================
          TOP NAVIGATION & ROYAL AUDIO / PHOTO CUSTOMIZER BAR
      ==================================================================== */}
      {stage !== 'invitation' && (
        <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-gradient-to-b from-[#1a040a]/90 via-[#1a040a]/55 to-transparent">
          {/* Left Emblem & Current Wing */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#d4af37] bg-[#3b0a18]/90 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <Crown className="w-4 h-4 text-[#f3e5ab]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#f3e5ab] uppercase">
                The Ghana Regency
              </div>
              <div className="text-[11px] text-[#e8b4bc] italic hidden sm:block">
                {SCENE_WAYPOINTS.find((w) => w.id === activeWaypoint)?.description}
              </div>
            </div>
          </div>

          {/* Right Controls: Customizer, Audio, Volume, Help */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCustomizerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-[#d4af37]/60 bg-[#3b0a18]/85 hover:bg-[#4a0e1e] text-[#f3e5ab] text-xs tracking-wider uppercase transition cursor-pointer"
              title="Upload Shruti's Portrait & Memory Photos"
            >
              <Camera className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">Royal Photos</span>
            </button>

            {/* Volume Slider (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-sm border border-[#d4af37]/35 bg-[#24050e]/80">
              <Music className="w-3.5 h-3.5 text-[#d4af37]" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setMusicVolume(v);
                  if (audioRef.current) audioRef.current.setVolume(v);
                }}
                className="w-20 accent-[#d4af37] cursor-pointer"
              />
            </div>

            {/* SFX Toggle */}
            <button
              onClick={() => {
                const next = !sfxEnabled;
                setSfxEnabled(next);
                if (audioRef.current) audioRef.current.setSfxEnabled(next);
              }}
              className={`px-2.5 py-1.5 rounded-sm border text-xs tracking-wider uppercase transition cursor-pointer ${
                sfxEnabled
                  ? 'border-[#d4af37]/60 bg-[#3b0a18]/80 text-[#f3e5ab]'
                  : 'border-white/20 bg-black/50 text-white/40'
              }`}
              title="Toggle Sound Effects"
            >
              SFX
            </button>

            {/* Mute Button */}
            <button
              onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                if (audioRef.current) audioRef.current.setMuted(next);
              }}
              className="p-2 rounded-sm border border-[#d4af37]/50 bg-[#3b0a18]/80 hover:bg-[#4a0e1e] text-[#f3e5ab] transition cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Controls / Pause Button */}
            <button
              onClick={() => setControlsModalOpen(true)}
              className="p-2 rounded-sm border border-[#d4af37]/50 bg-[#3b0a18]/80 hover:bg-[#4a0e1e] text-[#f3e5ab] transition cursor-pointer"
              title="Palace Controls & Guide (ESC)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* ====================================================================
          CONTEXTUAL FLOATING INTERACTION PROMPT (DOORS, FRAMES, PLAQUES, CROWN)
      ==================================================================== */}
      {stage === 'exploring' &&
        nearbyPrompt &&
        activeMemoryIndex === null &&
        !portraitModalOpen &&
        !activePlaque &&
        !letterModalOpen &&
        !crownRevealCardOpen && (
          <div className="fixed inset-x-0 bottom-24 z-30 flex justify-center px-4 pointer-events-none">
            <div className="pointer-events-auto max-w-md w-full bg-[#24050e]/90 border border-[#d4af37] px-6 py-5 rounded-sm text-center shadow-[0_0_45px_rgba(0,0,0,0.85)] backdrop-blur-md">
              <p className="text-lg sm:text-xl font-bold text-[#f3e5ab] mb-1">
                {nearbyPrompt.title}
              </p>
              <p className="text-xs sm:text-sm italic text-[#e8b4bc] mb-4">
                {nearbyPrompt.subtitle}
              </p>

              <button
                onClick={() => {
                  if (nearbyPrompt.type === 'doors') {
                    handleOpenGrandDoors();
                  } else if (nearbyPrompt.type === 'memory') {
                    focusMemoryFrame(nearbyPrompt.memoryIndex);
                  } else if (nearbyPrompt.type === 'portrait') {
                    if (audioRef.current) audioRef.current.playSparkle();
                    setPortraitModalOpen(true);
                  } else if (nearbyPrompt.type === 'plaque') {
                    if (audioRef.current) audioRef.current.playSparkle();
                    setActivePlaque(nearbyPrompt.plaque);
                  } else if (nearbyPrompt.type === 'letter') {
                    if (audioRef.current) audioRef.current.playSparkle();
                    setLetterModalOpen(true);
                  } else if (nearbyPrompt.type === 'crown') {
                    handleClaimCrown();
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-[#1f040b] font-bold text-xs tracking-[0.2em] uppercase rounded-sm shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:scale-105 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>[ {nearbyPrompt.buttonText} ]</span>
              </button>
            </div>
          </div>
        )}

      {/* ====================================================================
          MOBILE / TOUCH VIRTUAL JOYSTICK D-PAD (BOTTOM LEFT)
      ==================================================================== */}
      {stage !== 'invitation' && stage !== 'final_reveal' && (
        <div
          style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
          onContextMenu={(e) => e.preventDefault()}
          className="fixed bottom-14 left-3 z-40 flex flex-col items-center gap-1.5 pointer-events-auto"
        >
          <button
            type="button"
            onPointerDown={(e) => { e.preventDefault(); setMobileMove(1, 0); }}
            onPointerUp={() => setMobileMove(0, 0)}
            onPointerCancel={() => setMobileMove(0, 0)}
            onPointerLeave={() => setMobileMove(0, 0)}
            className="w-11 h-11 rounded-sm bg-[#24050e]/95 border-2 border-[#d4af37] flex items-center justify-center text-base text-[#f3e5ab] shadow-[0_0_15px_rgba(0,0,0,0.9)] active:bg-[#d4af37] active:text-[#24050e] cursor-pointer"
            title="Walk Forward (W)"
          >
            ▲
          </button>
          <div className="flex gap-1.5">
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); setMobileMove(0, -1); }}
              onPointerUp={() => setMobileMove(0, 0)}
              onPointerCancel={() => setMobileMove(0, 0)}
              onPointerLeave={() => setMobileMove(0, 0)}
              className="w-11 h-11 rounded-sm bg-[#24050e]/95 border-2 border-[#d4af37] flex items-center justify-center text-base text-[#f3e5ab] shadow-[0_0_15px_rgba(0,0,0,0.9)] active:bg-[#d4af37] active:text-[#24050e] cursor-pointer"
              title="Step Left (A)"
            >
              ◀
            </button>
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); setMobileMove(-1, 0); }}
              onPointerUp={() => setMobileMove(0, 0)}
              onPointerCancel={() => setMobileMove(0, 0)}
              onPointerLeave={() => setMobileMove(0, 0)}
              className="w-11 h-11 rounded-sm bg-[#24050e]/95 border-2 border-[#d4af37] flex items-center justify-center text-base text-[#f3e5ab] shadow-[0_0_15px_rgba(0,0,0,0.9)] active:bg-[#d4af37] active:text-[#24050e] cursor-pointer"
              title="Walk Backward (S)"
            >
              ▼
            </button>
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); setMobileMove(0, 1); }}
              onPointerUp={() => setMobileMove(0, 0)}
              onPointerCancel={() => setMobileMove(0, 0)}
              onPointerLeave={() => setMobileMove(0, 0)}
              className="w-11 h-11 rounded-sm bg-[#24050e]/95 border-2 border-[#d4af37] flex items-center justify-center text-base text-[#f3e5ab] shadow-[0_0_15px_rgba(0,0,0,0.9)] active:bg-[#d4af37] active:text-[#24050e] cursor-pointer"
              title="Step Right (D)"
            >
              ▶
            </button>
          </div>
          <span className="text-[10px] tracking-widest uppercase text-[#f3e5ab] bg-[#1a040a]/80 px-1.5 py-0.5 rounded">
            Move / Drag Look
          </span>
        </div>
      )}
      {/* ====================================================================
          SCENE 4 MODAL — THE ROYAL GALLERY OF MEMORIES CARD VIEWER
      ==================================================================== */}
      {currentMemory && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full bg-[#24050e] border-2 border-[#d4af37] rounded-sm shadow-[0_0_70px_rgba(212,175,55,0.3)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Close Button */}
            <button
              onClick={() => setActiveMemoryIndex(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#1a040a]/90 border border-[#d4af37] flex items-center justify-center text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#1a040a] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Column: Photograph Display & Instant Owner Upload */}
            <div className="relative min-h-[280px] sm:min-h-[380px] bg-[#160309] flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#d4af37]/40">
              {currentMemory.imageUrl ? (
                <img
                  src={currentMemory.imageUrl}
                  alt={currentMemory.title}
                  className="w-full h-72 sm:h-80 object-cover border border-[#d4af37] rounded-sm shadow-lg"
                />
              ) : (
                <div className="w-full h-72 sm:h-80 border border-[#d4af37]/60 bg-gradient-to-b from-[#3b0a18] to-[#1a040a] flex flex-col items-center justify-center p-6 text-center rounded-sm">
                  <Crown className="w-14 h-14 text-[#d4af37] mb-3 opacity-90" />
                  <p className="text-xs tracking-[0.25em] uppercase text-[#f3e5ab] mb-1">
                    {currentMemory.code}
                  </p>
                  <p className="text-lg font-bold text-[#fdfbf7] mb-2">{currentMemory.title}</p>
                  <p className="text-xs italic text-[#e8b4bc]/80 max-w-xs">
                    Royal Archival Frame — Upload a personal photograph below to display it inside
                    this 3D golden frame.
                  </p>
                </div>
              )}

              <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-[#d4af37]/70 bg-[#3b0a18] hover:bg-[#4a0e1e] text-[#f3e5ab] text-xs tracking-wider uppercase cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Replace Photograph</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleMemoryPhotoUpload(activeMemoryIndex, e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Right Column: Editorial Memory Story & Navigation */}
            <div className="p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#2b0712] to-[#190309]">
              <div>
                <div className="text-xs tracking-[0.3em] uppercase text-[#d4af37] mb-1">
                  THE ROYAL GALLERY OF MEMORIES
                </div>
                <div className="text-xs italic text-[#e8b4bc] mb-4">{currentMemory.code}</div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#f3e5ab] mb-4 leading-tight">
                  {currentMemory.title}
                </h3>

                <div className="w-16 h-0.5 bg-[#d4af37] mb-5" />

                <p className="text-sm sm:text-base leading-relaxed text-[#fdfbf7]/90 italic mb-6">
                  "{currentMemory.caption}"
                </p>
              </div>

              {/* Previous / Next Memory Controls */}
              <div className="pt-4 border-t border-[#d4af37]/30 flex items-center justify-between">
                <button
                  onClick={() => {
                    const prevIdx =
                      (activeMemoryIndex - 1 + memories.length) % memories.length;
                    focusMemoryFrame(prevIdx);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#d4af37]/60 rounded-sm text-xs tracking-wider uppercase text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#1a040a] transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs text-[#e8b4bc]">
                  {activeMemoryIndex + 1} / {memories.length}
                </span>

                <button
                  onClick={() => {
                    const nextIdx = (activeMemoryIndex + 1) % memories.length;
                    focusMemoryFrame(nextIdx);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#d4af37]/60 rounded-sm text-xs tracking-wider uppercase text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#1a040a] transition cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCENE 5 MODAL — THE ROYAL PORTRAIT HALL (SHRUTI'S MASTERPIECE)
      ==================================================================== */}
      {portraitModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-lg w-full bg-[#24050e] border-2 border-[#d4af37] p-6 sm:p-8 rounded-sm text-center shadow-[0_0_80px_rgba(212,175,55,0.35)]">
            <button
              onClick={() => setPortraitModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1a040a] border border-[#d4af37] flex items-center justify-center text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#1a040a] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="text-xs tracking-[0.3em] uppercase text-[#d4af37] mb-1">
              THE ROYAL PORTRAIT HALL
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f3e5ab] italic mb-5">
              "Every kingdom deserves its own masterpiece."
            </h3>

            <div className="mx-auto w-60 h-72 sm:w-64 sm:h-80 border-4 border-[#d4af37] bg-[#3b0a18] rounded-sm overflow-hidden shadow-[0_0_35px_rgba(212,175,55,0.3)] mb-5 flex items-center justify-center">
              {shrutiPortraitUrl ? (
                <img
                  src={shrutiPortraitUrl}
                  alt="Princess Shruti Royal Portrait"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-6 text-center">
                  <Crown className="w-14 h-14 text-[#f3e5ab] mx-auto mb-3" />
                  <p className="text-lg font-bold text-[#fdfbf7]">HER ROYAL HIGHNESS</p>
                  <p className="text-xl font-bold text-[#d4af37] mb-2">PRINCESS SHRUTI</p>
                  <p className="text-xs italic text-[#e8b4bc]">
                    Upload Shruti’s photograph below to display it in the central golden portrait
                    frame.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-[#1a040a] font-bold text-xs tracking-widest uppercase rounded-sm cursor-pointer shadow-lg hover:scale-105 transition">
                <Upload className="w-4 h-4" />
                <span>Upload Shruti's Portrait</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleShrutiPortraitUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>

              <button
                onClick={() => {
                  setPortraitModalOpen(false);
                  navigateToWaypoint('garden');
                }}
                className="px-5 py-2.5 border border-[#d4af37] text-[#f3e5ab] text-xs tracking-widest uppercase rounded-sm hover:bg-[#d4af37]/20 transition cursor-pointer"
              >
                Enter the Rose Garden →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCENE 6 MODAL — INTERACTIVE ROSE GARDEN BRASS PLAQUE
      ==================================================================== */}
      {activePlaque && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-gradient-to-b from-[#3d2914] via-[#2b1b0c] to-[#1f1207] border-2 border-[#d4af37] p-8 rounded-sm text-center shadow-[0_0_60px_rgba(212,175,55,0.4)]">
            <div className="absolute inset-2 border border-[#f3e5ab]/30 pointer-events-none" />
            <Flower2 className="w-10 h-10 text-[#e8b4bc] mx-auto mb-3" />
            <p className="text-xs tracking-[0.3em] uppercase text-[#d4af37] mb-2">
              {activePlaque.title}
            </p>
            <blockquote className="text-2xl sm:text-3xl font-bold italic text-[#f3e5ab] my-5 leading-snug">
              "{activePlaque.quote}"
            </blockquote>
            <p className="text-xs text-[#e8b4bc] italic mb-6">{activePlaque.subtext}</p>
            <button
              onClick={() => setActivePlaque(null)}
              className="px-6 py-2 bg-[#d4af37] text-[#1a040a] font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#f3e5ab] transition cursor-pointer"
            >
              Continue Through Garden
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCENE 7 MODAL — THE ROYAL PARCHMENT LETTER
      ==================================================================== */}
      {letterModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div
            className="relative max-w-xl w-full my-auto p-8 sm:p-12 rounded-sm shadow-[0_0_90px_rgba(212,175,55,0.45)] border-4 border-[#c59b27] text-[#2c1810]"
            style={{
              background:
                'radial-gradient(circle at center, #fdfbf7 0%, #f5ead6 70%, #e6d3b3 100%)'
            }}
          >
            {/* Inner Filigree Border */}
            <div className="absolute inset-3 border border-[#8b6914]/45 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setLetterModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#3b0a18] text-[#f3e5ab] flex items-center justify-center hover:bg-[#591125] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Crimson & Gold Wax Seal Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#7a091e] border-2 border-[#d4af37] flex items-center justify-center shadow-md mb-2">
                <Crown className="w-7 h-7 text-[#f3e5ab]" />
              </div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#7a091e] font-bold">
                TO: HER ROYAL HIGHNESS SHRUTI
              </p>
            </div>

            <div className="space-y-4 text-base sm:text-lg leading-relaxed font-serif text-[#2c1810]">
              <p className="font-bold text-xl text-[#4a0e1e]">Dear Shruti,</p>
              <p>
                Some people don't need a crown to make a place feel like a kingdom.
              </p>
              <p>
                They have their own little magic, their own personality, and a way of making
                ordinary moments memorable.
              </p>
              <p>
                So today, this little kingdom has something to announce.
              </p>
              <p className="font-bold text-[#7a091e] text-xl py-1">
                Happy Princess Day, Your Highness.
              </p>
              <p>
                May your days be filled with beautiful moments, endless laughter, unexpected
                adventures, and all the happiness you deserve.
              </p>
              <div className="pt-4 text-right">
                <p className="italic text-[#5c3a21]">With royal regards,</p>
                <p className="font-bold text-lg text-[#4a0e1e]">Your Royal Kingdom.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setLetterModalOpen(false);
                  navigateToWaypoint('crown');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4a0e1e] text-[#f3e5ab] border border-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-[#3b0a18] shadow-lg transition cursor-pointer"
              >
                <Crown className="w-4 h-4 text-[#d4af37]" />
                <span>Proceed to the Crown Ceremony →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SCENE 8 MODAL — CROWN CLAIMED & PERSONALIZED PORTRAIT REVEAL
      ==================================================================== */}
      {crownRevealCardOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-[#24050e]/95 border-2 border-[#d4af37] p-8 rounded-sm text-center shadow-[0_0_90px_rgba(212,175,55,0.55)]">
            <Crown className="w-12 h-12 text-[#f3e5ab] mx-auto mb-2 animate-bounce" />
            <p className="text-xs tracking-[0.3em] uppercase text-[#d4af37] mb-1">
              THE ROYAL CORONATION
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#fdfbf7] mb-4">
              Her Royal Highness Shruti
            </h3>

            {shrutiPortraitUrl && (
              <div className="mx-auto w-44 h-52 border-2 border-[#d4af37] rounded-sm overflow-hidden mb-4 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                <img
                  src={shrutiPortraitUrl}
                  alt="Princess Shruti"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-sm sm:text-base italic text-[#e8b4bc] mb-6">
              "The crown is yours, Your Highness. May your kingdom forever shine in golden light."
            </p>

            <button
              onClick={handleLaunchFinalReveal}
              className="w-full py-3.5 bg-gradient-to-r from-[#b8860b] via-[#f3e5ab] to-[#b8860b] text-[#1a040a] font-bold text-xs tracking-[0.22em] uppercase rounded-sm shadow-[0_0_35px_rgba(243,229,171,0.6)] hover:scale-[1.02] transition cursor-pointer"
            >
              ✨ Witness the Final Royal Reveal ✨
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          FINAL SCENE (SCENE 9) — THE ROYAL REVEAL CELEBRATION OVERLAY
      ==================================================================== */}
      {stage === 'final_reveal' && (
        <div className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
          <div className="pointer-events-auto max-w-2xl w-full bg-[#1a040a]/75 backdrop-blur-md border border-[#d4af37]/70 p-8 sm:p-12 rounded-sm shadow-[0_0_90px_rgba(212,175,55,0.35)]">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full border-2 border-[#d4af37] bg-[#3b0a18] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.5)]">
              <Crown className="w-9 h-9 text-[#f3e5ab] animate-pulse" />
            </div>

            <p className="text-xs sm:text-sm tracking-[0.4em] uppercase text-[#e8b4bc] mb-2">
              THE GHANA REGENCY PROCLAIMS
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-[0.12em] text-[#f3e5ab] mb-2">
              HAPPY PRINCESS DAY
            </h1>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-[0.18em] text-[#fdfbf7] mb-6">
              PRINCESS SHRUTI
            </h2>

            <div className="w-24 h-0.5 bg-[#d4af37] mx-auto mb-6" />

            <p className="text-lg sm:text-xl italic text-[#f3e5ab] mb-2">
              "Your royal day has finally arrived."
            </p>
            <p className="text-base sm:text-lg text-[#e8b4bc] mb-8">
              "Stay magical, Your Highness."
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setStage('exploring');
                  navigateToWaypoint('exterior');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-[#1a040a] font-bold text-xs tracking-[0.2em] uppercase rounded-sm shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>[ REPLAY EXPERIENCE ]</span>
              </button>

              <button
                onClick={() => {
                  setStage('exploring');
                  navigateToWaypoint('gallery');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#d4af37] bg-[#3b0a18]/90 text-[#f3e5ab] font-bold text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-[#4a0e1e] transition cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>[ FREE EXPLORE PALACE ]</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ROYAL PHOTO CUSTOMIZER DRAWER (REPLACE SHRUTI'S PORTRAIT & 5 MEMORIES)
      ==================================================================== */}
      {customizerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#20040c] border-l-2 border-[#d4af37] h-full overflow-y-auto p-6 text-[#fdfbf7]">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/40 mb-6">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#d4af37]" />
                <h3 className="text-lg font-bold tracking-wider text-[#f3e5ab] uppercase">
                  Royal Photo Archives
                </h3>
              </div>
              <button
                onClick={() => setCustomizerOpen(false)}
                className="p-1.5 rounded-full border border-[#d4af37]/50 text-[#f3e5ab] hover:bg-[#d4af37] hover:text-[#1a040a] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#e8b4bc] italic mb-6">
              Upload real photographs for Princess Shruti’s central portrait and the five Memory
              Gallery frames. They immediately appear inside the 3D palace frames without altering
              her features.
            </p>

            {/* Shruti's Masterpiece Portrait Uploader */}
            <div className="p-4 border border-[#d4af37]/50 bg-[#3b0a18]/60 rounded-sm mb-6">
              <div className="text-xs font-bold tracking-widest text-[#d4af37] uppercase mb-1">
                Scene V — Central Masterpiece Frame
              </div>
              <div className="text-sm font-bold text-[#fdfbf7] mb-3">
                Princess Shruti’s Royal Portrait
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#1a040a] font-bold text-xs tracking-wider uppercase rounded-sm cursor-pointer hover:bg-[#f3e5ab] transition">
                <Upload className="w-3.5 h-3.5" />
                <span>{shrutiPortraitUrl ? 'Change Portrait Photo' : 'Upload Portrait Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleShrutiPortraitUpload(e.target.files[0]);
                  }}
                />
              </label>
            </div>

            {/* 5 Memory Gallery Frames Uploaders */}
            <div className="space-y-3">
              {memories.map((mem, idx) => (
                <div
                  key={mem.id}
                  className="p-3.5 border border-[#d4af37]/35 bg-[#2c0712]/80 rounded-sm flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-[11px] text-[#d4af37] font-bold">{mem.code}</div>
                    <div className="text-xs font-bold text-[#fdfbf7]">{mem.title}</div>
                  </div>
                  <label className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#d4af37] text-[#f3e5ab] text-[11px] tracking-wider uppercase rounded-sm cursor-pointer hover:bg-[#d4af37] hover:text-[#1a040a] transition">
                    <Upload className="w-3 h-3" />
                    <span>{mem.imageUrl ? 'Replace' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleMemoryPhotoUpload(idx, e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CONTROLS & PALACE GUIDE MODAL (ESC)
      ==================================================================== */}
      {controlsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-[#24050e] border-2 border-[#d4af37] p-6 sm:p-8 rounded-sm shadow-2xl">
            <button
              onClick={() => setControlsModalOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full border border-[#d4af37] flex items-center justify-center text-[#f3e5ab] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-[#f3e5ab] tracking-wider uppercase mb-4">
              Royal Exploration Guide
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-[#fdfbf7]/90 mb-6">
              <li className="flex items-start gap-2.5">
                <Move className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  <strong>Walk Freely:</strong> Use <strong>W, A, S, D</strong> or{' '}
                  <strong>Arrow Keys</strong> (or the on-screen touch arrows on mobile) to walk
                  through every room and garden.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  <strong>Look Around:</strong> Click and drag anywhere on the 3D scene to look
                  around the palace freely.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>
                  <strong>Interact:</strong> Click directly on the 3D palace doors, golden memory
                  frames, Shruti’s portrait, garden plaques, the wax-sealed envelope, or the golden
                  crown—or use the bottom bar to glide between milestones.
                </span>
              </li>
            </ul>

            <button
              onClick={() => setControlsModalOpen(false)}
              className="w-full py-2.5 bg-[#d4af37] text-[#1a040a] font-bold text-xs tracking-[0.2em] uppercase rounded-sm cursor-pointer"
            >
              Resume Royal Experience
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          BOTTOM MILESTONE / SCENE SELECTOR HUD BAR
      ==================================================================== */}
      {stage !== 'invitation' && (
        <nav className="fixed bottom-0 inset-x-0 z-30 bg-gradient-to-t from-[#160308] via-[#160308]/90 to-transparent py-2.5 px-3">
          <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto no-scrollbar">
            {SCENE_WAYPOINTS.map((wp) => {
              const isActive = activeWaypoint === wp.id;
              return (
                <button
                  key={wp.id}
                  onClick={() => navigateToWaypoint(wp.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-sm text-[11px] tracking-wider uppercase transition cursor-pointer border ${
                    isActive
                      ? 'bg-[#d4af37] text-[#1a040a] border-[#f3e5ab] font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)]'
                      : 'bg-[#2a0611]/85 text-[#f3e5ab]/85 border-[#d4af37]/35 hover:border-[#d4af37] hover:text-[#fdfbf7]'
                  }`}
                >
                  {wp.shortLabel}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
