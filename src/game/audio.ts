let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function beep(freq: number, duration: number, type: OscillatorType = 'square', vol = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export function playSound(sound: string) {
  switch (sound) {
    case 'jump':
      beep(400, 0.1); setTimeout(() => beep(600, 0.08), 50);
      break;
    case 'coin':
      beep(800, 0.05); setTimeout(() => beep(1200, 0.08), 60);
      break;
    case 'death':
      beep(200, 0.3, 'sawtooth', 0.2);
      break;
    case 'stomp':
      beep(300, 0.1); setTimeout(() => beep(500, 0.05), 50);
      break;
    case 'shoot':
      beep(150, 0.1, 'sawtooth', 0.1);
      break;
    case 'heart':
      beep(600, 0.08); setTimeout(() => beep(800, 0.08), 80); setTimeout(() => beep(1000, 0.1), 160);
      break;
    case 'chest':
      beep(400, 0.1); setTimeout(() => beep(600, 0.1), 100); setTimeout(() => beep(800, 0.1), 200); setTimeout(() => beep(1200, 0.2), 300);
      break;
    case 'win':
      [400,500,600,800,1000,1200].forEach((f,i) => setTimeout(() => beep(f, 0.15), i*100));
      break;
    case 'select':
      beep(500, 0.05);
      break;
    case 'devmode':
      [300,400,500,600,800,1000,1200,1600].forEach((f,i) => setTimeout(() => beep(f, 0.12, 'square', 0.12), i*70));
      break;
  }
}
