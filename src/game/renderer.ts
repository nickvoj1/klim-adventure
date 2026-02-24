import { Player, Robot, Bullet, Coin, Chest, Spike, MovingSpike, Bat, HeartPickup, Flag, Platform, LevelData, Skin } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { spriteManager } from './sprites';

// ===== UTILITIES =====

function pixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function drawGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, alpha = 0.2) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'transparent');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Particle pool for ambient effects
const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number }[] = [];

function spawnParticle(x: number, y: number, vx: number, vy: number, life: number, color: string, size = 2) {
  if (particles.length > 200) return;
  particles.push({ x, y, vx, vy, life, maxLife: life, color, size });
}

function updateAndDrawParticles(ctx: CanvasRenderingContext2D) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

// ===== GRID & ATMOSPHERE OVERLAYS =====

function drawGridOverlay(ctx: CanvasRenderingContext2D, cameraX: number, _tick: number) {
  const gridSize = 40;
  const offsetX = -(cameraX * 0.3) % gridSize;
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  // Vertical lines
  for (let x = offsetX; x < CANVAS_WIDTH; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }
  // Horizontal lines
  for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
}

function drawAtmosphereOverlay(ctx: CanvasRenderingContext2D, world: string, tick: number) {
  // Top gradient wash
  const atmGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT * 0.5);
  if (world === 'Jungle') {
    atmGrad.addColorStop(0, 'rgba(0,80,40,0.12)');
    atmGrad.addColorStop(1, 'transparent');
  } else {
    atmGrad.addColorStop(0, 'rgba(60,40,100,0.12)');
    atmGrad.addColorStop(1, 'transparent');
  }
  ctx.fillStyle = atmGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT * 0.5);

  // Subtle vignette at edges
  const vignetteAlpha = 0.15 + Math.sin(tick * 0.005) * 0.03;
  const vGrad = ctx.createRadialGradient(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.3, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH * 0.7);
  vGrad.addColorStop(0, 'transparent');
  vGrad.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// ===== BACKGROUND =====

export function drawBackground(ctx: CanvasRenderingContext2D, level: LevelData, cameraX: number, tick: number) {
  const world = level.world;

  // Try sprite-based background first
  const bgKey = world === 'Jungle' ? 'jungleBg' : 'desertBg';
  const bgSprite = spriteManager.get(bgKey);
  if (bgSprite) {
    // Parallax scrolling with the background image
    const bgWidth = CANVAS_WIDTH * 2;
    const parallaxX = -(cameraX * 0.15) % bgWidth;
    ctx.drawImage(bgSprite.image, parallaxX, 0, bgWidth, CANVAS_HEIGHT);
    ctx.drawImage(bgSprite.image, parallaxX + bgWidth, 0, bgWidth, CANVAS_HEIGHT);
    
    // Grid overlay (subtle, stylish)
    drawGridOverlay(ctx, cameraX, tick);
    // Atmospheric gradient wash
    drawAtmosphereOverlay(ctx, world, tick);

    // Still draw foreground parallax elements over the background
    if (world === 'Jungle') {
      drawJungleForegroundEffects(ctx, cameraX, tick);
    } else {
      drawDesertForegroundEffects(ctx, cameraX, tick);
    }
    return;
  }

  // Fallback to programmatic background
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);

  if (world === 'Jungle') {
    grad.addColorStop(0, '#010d08');
    grad.addColorStop(0.15, '#041a10');
    grad.addColorStop(0.4, '#082818');
    grad.addColorStop(0.7, '#0c3820');
    grad.addColorStop(1, '#061e12');
  } else {
    grad.addColorStop(0, '#050518');
    grad.addColorStop(0.15, '#0c0c2e');
    grad.addColorStop(0.35, '#18143a');
    grad.addColorStop(0.6, '#261e38');
    grad.addColorStop(0.8, '#321e28');
    grad.addColorStop(1, '#3e2018');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Grid overlay on programmatic bg too
  drawGridOverlay(ctx, cameraX, tick);
  drawAtmosphereOverlay(ctx, world, tick);

  // Nebula clouds (subtle colored regions)
  for (let i = 0; i < 3; i++) {
    const nx = ((i * 290 + 100) - cameraX * 0.01 + 3000) % (CANVAS_WIDTH + 400) - 200;
    const ny = 30 + i * 40;
    const nebulaColor = i === 0 ? '#331144' : i === 1 ? '#112244' : '#223311';
    drawGlow(ctx, nx, ny, 80 + i * 20, nebulaColor, 0.06);
  }

  // Stars with depth layers + twinkling + color variation
  for (let i = 0; i < 80; i++) {
    const layer = i % 3;
    const parallax = 0.02 + layer * 0.015;
    const sx = ((i * 137 + 50) % CANVAS_WIDTH + (cameraX * parallax) % CANVAS_WIDTH) % CANVAS_WIDTH;
    const sy = (i * 73 + 15) % (CANVAS_HEIGHT * 0.5);
    const twinkle = (Math.sin(tick * 0.018 + i * 1.7) + 1) * 0.5;
    const size = layer === 0 ? 1 : layer === 1 ? 2 : (i % 7 === 0 ? 3 : 2);

    // Star color variety
    const colors = ['#ffffff', '#aaccff', '#ffddaa', '#ffaaaa', '#aaffcc', '#ddaaff'];
    const starColor = colors[i % colors.length];

    ctx.globalAlpha = 0.15 + twinkle * 0.85;
    ctx.fillStyle = starColor;
    ctx.fillRect(sx, sy, size, size);

    // Cross sparkle on bright large stars
    if (size >= 2 && twinkle > 0.7) {
      ctx.globalAlpha = twinkle * 0.25;
      ctx.fillRect(sx - 2, sy + Math.floor(size / 2), size + 4, 1);
      ctx.fillRect(sx + Math.floor(size / 2), sy - 2, 1, size + 4);
      // Diffraction spike glow
      if (size >= 3) {
        drawGlow(ctx, sx + 1, sy + 1, 8, starColor, twinkle * 0.15);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Moon with craters and volumetric glow
  const moonX = ((CANVAS_WIDTH * 0.75) - cameraX * 0.008 + 2000) % (CANVAS_WIDTH + 200) - 100;
  // Outer halo
  drawGlow(ctx, moonX, 48, 60, '#ffffcc', 0.04);
  drawGlow(ctx, moonX, 48, 35, '#ffffdd', 0.08);
  // Moon body
  ctx.fillStyle = '#eeeedd';
  ctx.beginPath();
  ctx.arc(moonX, 48, 22, 0, Math.PI * 2);
  ctx.fill();
  // Lighter half (lit side)
  ctx.fillStyle = '#f4f4e8';
  ctx.beginPath();
  ctx.arc(moonX + 3, 46, 18, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.fill();
  // Craters with shadow
  const craters = [[-6, -4, 5], [5, 3, 4], [1, 8, 3], [-8, 6, 2.5], [7, -6, 2]];
  for (const [cx, cy, cr] of craters) {
    ctx.fillStyle = '#ccccbb';
    ctx.beginPath();
    ctx.arc(moonX + cx, 48 + cy, cr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#bbbbaa';
    ctx.beginPath();
    ctx.arc(moonX + cx + 0.5, 48 + cy + 0.5, cr * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  if (world === 'Jungle') {
    drawJungleBackground(ctx, cameraX, tick);
  } else {
    drawDesertBackground(ctx, cameraX, tick);
  }
}

// Foreground effects drawn ON TOP of sprite backgrounds
function drawDesertForegroundEffects(ctx: CanvasRenderingContext2D, cameraX: number, tick: number) {
  // Sand particles blowing in wind
  for (let i = 0; i < 20; i++) {
    const px = (i * 97 + tick * 0.8 + cameraX * 0.3) % CANVAS_WIDTH;
    const py = 320 + Math.sin(tick * 0.025 + i * 2) * 30 + (i % 5) * 8;
    const alpha = 0.08 + Math.sin(tick * 0.01 + i) * 0.06;
    ctx.fillStyle = '#c8964a';
    ctx.globalAlpha = alpha;
    ctx.fillRect(px, py, 3 - (i % 2), 1);
  }
  ctx.globalAlpha = 1;

  // Heat haze shimmer
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#ffaa66';
  for (let i = 0; i < 8; i++) {
    const hx = (i * 120 + tick * 0.3) % CANVAS_WIDTH;
    const hy = 330 + Math.sin(tick * 0.04 + i * 1.5) * 8;
    ctx.fillRect(hx, hy, 40, 1);
  }
  ctx.globalAlpha = 1;
}

function drawJungleForegroundEffects(ctx: CanvasRenderingContext2D, cameraX: number, tick: number) {
  // Fireflies with trails
  for (let i = 0; i < 12; i++) {
    const fx = (i * 110 + Math.sin(tick * 0.008 + i * 2.5) * 30 - cameraX * 0.08 + 2000) % CANVAS_WIDTH;
    const fy = 180 + Math.sin(tick * 0.012 + i * 1.8) * 60 + i * 5;
    const brightness = (Math.sin(tick * 0.035 + i * 1.5) + 1) * 0.5;
    if (brightness > 0.3) {
      drawGlow(ctx, fx, fy, 10, '#aaffaa', brightness * 0.12);
      ctx.fillStyle = '#ccffcc';
      ctx.globalAlpha = brightness;
      ctx.fillRect(fx - 1, fy - 1, 2, 2);
      ctx.globalAlpha = 1;
    }
  }

  // Ground-level mist
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 6; i++) {
    const mx = (i * 200 - cameraX * 0.2 + tick * 0.1 + 3000) % (CANVAS_WIDTH + 200) - 100;
    drawGlow(ctx, mx, 380, 60, '#88ccaa', 0.08);
  }
  ctx.globalAlpha = 1;
}

function drawDesertBackground(ctx: CanvasRenderingContext2D, cameraX: number, tick: number) {
  // Distant mountains with gradient
  for (let i = 0; i < 5; i++) {
    const mx = (i * 350 - (cameraX * 0.04) % 1750 + 1750) % 1750 - 140;
    const mh = 50 + (i * 17) % 30;
    const mgr = ctx.createLinearGradient(mx, 300, mx, 300 - mh);
    mgr.addColorStop(0, '#0c0808');
    mgr.addColorStop(1, '#1a1010');
    ctx.fillStyle = mgr;
    ctx.beginPath();
    ctx.moveTo(mx, 340);
    ctx.lineTo(mx + 60, 340 - mh);
    ctx.lineTo(mx + 90, 340 - mh * 0.7);
    ctx.lineTo(mx + 140, 340 - mh * 0.9);
    ctx.lineTo(mx + 200, 340);
    ctx.fill();
  }

  // Far dunes with gradient shading
  for (let i = 0; i < 6; i++) {
    const dx = (i * 280 - (cameraX * 0.08) % 1680 + 1680) % 1680 - 140;
    const duneGrad = ctx.createLinearGradient(dx, 360, dx + 250, 320);
    duneGrad.addColorStop(0, '#1a0e06');
    duneGrad.addColorStop(0.5, '#241408');
    duneGrad.addColorStop(1, '#1a0e06');
    ctx.fillStyle = duneGrad;
    drawDune(ctx, dx, 360, 250 + i * 20, 40 + i * 8);
  }

  // Mid dunes
  for (let i = 0; i < 5; i++) {
    const dx = (i * 320 - (cameraX * 0.15) % 1600 + 1600) % 1600 - 120;
    const duneGrad = ctx.createLinearGradient(dx, 355, dx + 220, 305);
    duneGrad.addColorStop(0, '#2a1a0a');
    duneGrad.addColorStop(0.4, '#3a2210');
    duneGrad.addColorStop(1, '#2a1a0a');
    ctx.fillStyle = duneGrad;
    drawDune(ctx, dx, 355, 220 + i * 25, 50 + i * 10);
  }

  // Near dunes with wind-swept texture
  for (let i = 0; i < 4; i++) {
    const dx = (i * 360 - (cameraX * 0.25) % 1440 + 1440) % 1440 - 100;
    const duneGrad = ctx.createLinearGradient(dx, 370, dx + 200, 315);
    duneGrad.addColorStop(0, '#3a2510');
    duneGrad.addColorStop(0.3, '#4a3018');
    duneGrad.addColorStop(1, '#3a2510');
    ctx.fillStyle = duneGrad;
    drawDune(ctx, dx, 370, 200 + i * 30, 55 + i * 12);
  }

  // Detailed cacti with shadows
  for (let i = 0; i < 4; i++) {
    const cx = (i * 380 + 200 - (cameraX * 0.12) % 1520 + 1520) % 1520 - 50;
    drawDetailedCactus(ctx, cx, 345, 22 + (i % 3) * 8);
  }

  // Sand particles blowing in wind
  for (let i = 0; i < 20; i++) {
    const px = (i * 97 + tick * 0.8 + cameraX * 0.3) % CANVAS_WIDTH;
    const py = 320 + Math.sin(tick * 0.025 + i * 2) * 30 + (i % 5) * 8;
    const alpha = 0.08 + Math.sin(tick * 0.01 + i) * 0.06;
    ctx.fillStyle = '#c8964a';
    ctx.globalAlpha = alpha;
    ctx.fillRect(px, py, 3 - (i % 2), 1);
  }
  ctx.globalAlpha = 1;

  // Heat haze shimmer (subtle distortion lines)
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#ffaa66';
  for (let i = 0; i < 8; i++) {
    const hx = (i * 120 + tick * 0.3) % CANVAS_WIDTH;
    const hy = 330 + Math.sin(tick * 0.04 + i * 1.5) * 8;
    ctx.fillRect(hx, hy, 40, 1);
  }
  ctx.globalAlpha = 1;
}

function drawDetailedCactus(ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number) {
  // Shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.15;
  ctx.fillRect(x + 2, baseY, 10, 3);
  ctx.globalAlpha = 1;

  // Trunk with gradient
  const trunkGrad = ctx.createLinearGradient(x, 0, x + 6, 0);
  trunkGrad.addColorStop(0, '#1a4418');
  trunkGrad.addColorStop(0.5, '#267024');
  trunkGrad.addColorStop(1, '#1a4418');
  ctx.fillStyle = trunkGrad;
  ctx.fillRect(x, baseY - h, 6, h);

  // Ribs
  ctx.fillStyle = '#1d5a1a';
  ctx.globalAlpha = 0.4;
  ctx.fillRect(x + 2, baseY - h, 1, h);
  ctx.fillRect(x + 4, baseY - h, 1, h);
  ctx.globalAlpha = 1;

  // Left arm
  ctx.fillStyle = '#206620';
  ctx.fillRect(x - 8, baseY - h * 0.7, 8, 4);
  ctx.fillRect(x - 8, baseY - h * 0.7 - 10, 4, 14);
  // Right arm
  ctx.fillRect(x + 6, baseY - h * 0.5, 8, 4);
  ctx.fillRect(x + 10, baseY - h * 0.5 - 8, 4, 12);

  // Highlight edge
  ctx.fillStyle = '#308830';
  ctx.globalAlpha = 0.3;
  ctx.fillRect(x, baseY - h, 1, h);
  ctx.globalAlpha = 1;
}

function drawJungleBackground(ctx: CanvasRenderingContext2D, cameraX: number, tick: number) {
  // Far misty tree layer with atmospheric fog
  ctx.fillStyle = '#060e08';
  for (let i = 0; i < 10; i++) {
    const tx = (i * 180 - (cameraX * 0.04) % 1800 + 1800) % 1800 - 100;
    drawDetailedTree(ctx, tx, 320, 50 + (i % 4) * 18, 0.4);
  }

  // Atmospheric fog band
  const fogGrad = ctx.createLinearGradient(0, 260, 0, 340);
  fogGrad.addColorStop(0, 'transparent');
  fogGrad.addColorStop(0.5, '#0a2a1a');
  fogGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = fogGrad;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(0, 260, CANVAS_WIDTH, 80);
  ctx.globalAlpha = 1;

  // Mid tree layer
  for (let i = 0; i < 7; i++) {
    const tx = (i * 230 - (cameraX * 0.1) % 1610 + 1610) % 1610 - 80;
    drawDetailedTree(ctx, tx, 340, 65 + (i % 3) * 15, 0.6);
  }

  // Hanging vines with leaves and physics-like sway
  for (let i = 0; i < 12; i++) {
    const vx = (i * 160 - (cameraX * 0.16) % 1920 + 1920) % 1920 - 40;
    const vineLen = 30 + (i % 5) * 18;
    const sway = Math.sin(tick * 0.018 + i * 1.3) * 4;
    const sway2 = Math.sin(tick * 0.025 + i * 0.7) * 2;

    // Vine stem
    ctx.strokeStyle = '#1a5028';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vx, 0);
    for (let j = 0; j < vineLen; j += 4) {
      const sx = vx + sway * (j / vineLen) + sway2 * (j / vineLen) * 0.5;
      ctx.lineTo(sx, j);
    }
    ctx.stroke();

    // Leaves at intervals
    ctx.fillStyle = '#2a6838';
    for (let j = 1; j < 4; j++) {
      const ly = vineLen * (j / 4);
      const lx = vx + sway * (ly / vineLen);
      ctx.beginPath();
      ctx.ellipse(lx + (j % 2 === 0 ? 4 : -4), ly, 5, 3, (j % 2 === 0 ? 0.3 : -0.3), 0, Math.PI * 2);
      ctx.fill();
    }

    // Drip at end (occasionally)
    if (i % 3 === 0 && Math.sin(tick * 0.01 + i) > 0.8) {
      const dripY = vineLen + (tick * 0.5 + i * 10) % 20;
      ctx.fillStyle = '#44aa88';
      ctx.globalAlpha = 1 - (dripY - vineLen) / 20;
      ctx.fillRect(vx + sway * 0.9, dripY, 2, 3);
      ctx.globalAlpha = 1;
    }
  }

  // Fireflies with trails
  for (let i = 0; i < 12; i++) {
    const fx = (i * 110 + Math.sin(tick * 0.008 + i * 2.5) * 30 - cameraX * 0.08 + 2000) % CANVAS_WIDTH;
    const fy = 180 + Math.sin(tick * 0.012 + i * 1.8) * 60 + i * 5;
    const brightness = (Math.sin(tick * 0.035 + i * 1.5) + 1) * 0.5;

    if (brightness > 0.3) {
      // Glow halo
      drawGlow(ctx, fx, fy, 10, '#aaffaa', brightness * 0.12);
      // Core
      ctx.fillStyle = '#ccffcc';
      ctx.globalAlpha = brightness;
      ctx.fillRect(fx - 1, fy - 1, 2, 2);
      ctx.globalAlpha = 1;
    }
  }

  // Ground-level mist
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 6; i++) {
    const mx = (i * 200 - cameraX * 0.2 + tick * 0.1 + 3000) % (CANVAS_WIDTH + 200) - 100;
    drawGlow(ctx, mx, 380, 60, '#88ccaa', 0.08);
  }
  ctx.globalAlpha = 1;
}

function drawDetailedTree(ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number, detail: number) {
  // Trunk with bark texture
  const trunkW = 6 + h * 0.06;
  const trunkColor = detail > 0.5 ? '#0e1e12' : '#080e08';
  ctx.fillStyle = trunkColor;
  ctx.fillRect(x + 10, baseY - h * 0.5, trunkW, h * 0.5);

  // Trunk highlight
  ctx.fillStyle = adjustColor(trunkColor, 15);
  ctx.globalAlpha = 0.4;
  ctx.fillRect(x + 10, baseY - h * 0.5, 1, h * 0.5);
  ctx.globalAlpha = 1;

  // Canopy layers with depth
  const canopyColors = detail > 0.5 ? ['#0a2210', '#0e2a14', '#122e18'] : ['#061008', '#08180c', '#0a1e10'];
  for (let c = 0; c < 3; c++) {
    ctx.fillStyle = canopyColors[c];
    const r = h * (0.45 - c * 0.06);
    const ox = [-4, 8, 2][c];
    const oy = [-h * 0.5, -h * 0.4, -h * 0.55][c];
    ctx.beginPath();
    ctx.arc(x + 14 + ox, baseY + oy, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDune(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + w * 0.3, y - h * 0.9, x + w * 0.5, y - h);
  ctx.quadraticCurveTo(x + w * 0.7, y - h * 0.8, x + w, y);
  ctx.fill();
}

// ===== PLATFORMS =====

export function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, color: string, world?: string) {
  // Try sprite-based tile rendering
  const tileKey = world === 'Jungle' ? 'jungleTiles' : 'desertTiles';
  const tileSheet = spriteManager.get(tileKey);
  if (tileSheet) {
    // Tile the platform with the full tileset image (single-frame)
    const tileSize = 32;
    for (let tx = 0; tx < p.w; tx += tileSize) {
      const drawW = Math.min(tileSize, p.w - tx);
      // Use center section of the tileset for platform fill
      spriteManager.drawTile(ctx, tileKey, 128, 128, 256, 256, p.x + tx, p.y, drawW, p.h);
    }
    // Top surface highlight
    ctx.fillStyle = world === 'Jungle' ? '#44aa44' : '#ddbb77';
    ctx.globalAlpha = 0.25;
    ctx.fillRect(p.x, p.y, p.w, 2);
    ctx.globalAlpha = 1;
    return;
  }

  // Fallback to programmatic drawing
  const darker = adjustColor(color, -30);
  const lighter = adjustColor(color, 40);
  const darkest = adjustColor(color, -60);
  const lightest = adjustColor(color, 60);

  // Drop shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.12;
  ctx.fillRect(p.x + 2, p.y + p.h, p.w, 4);
  ctx.globalAlpha = 1;

  // Main body
  pixelRect(ctx, p.x, p.y, p.w, p.h, color);

  // Top grass/surface layer with gradient
  const topGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 4);
  topGrad.addColorStop(0, lightest);
  topGrad.addColorStop(1, lighter);
  ctx.fillStyle = topGrad;
  ctx.fillRect(p.x, p.y, p.w, 4);

  // Grass blades on top
  ctx.fillStyle = lightest;
  for (let i = 0; i < p.w; i += 6) {
    const gh = 2 + ((i * 7 + 3) % 3);
    ctx.fillRect(p.x + i, p.y - gh, 2, gh);
  }

  // Top edge highlight (sub-pixel feel)
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.15;
  ctx.fillRect(p.x, p.y, p.w, 1);
  ctx.globalAlpha = 1;

  // Bottom shadow
  pixelRect(ctx, p.x, p.y + p.h - 3, p.w, 3, darkest);

  // Brick pattern with depth
  ctx.globalAlpha = 0.2;
  for (let by = p.y + 5; by < p.y + p.h - 3; by += 8) {
    const offset = ((by - p.y) / 8) % 2 === 0 ? 0 : 8;
    for (let bx = p.x + offset; bx < p.x + p.w; bx += 16) {
      // Brick highlight top
      ctx.fillStyle = lighter;
      ctx.fillRect(bx + 1, by, 14, 1);
      // Brick shadow bottom
      ctx.fillStyle = darkest;
      ctx.fillRect(bx + 1, by + 6, 14, 1);
      // Mortar lines
      ctx.fillStyle = darkest;
      ctx.fillRect(bx, by, 1, 7);
    }
  }
  ctx.globalAlpha = 1;

  // Random texture specks
  ctx.fillStyle = darker;
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < p.w / 8; i++) {
    const dx = p.x + ((i * 37 + 7) % p.w);
    const dy = p.y + 5 + ((i * 53 + 3) % Math.max(1, p.h - 8));
    ctx.fillRect(dx, dy, 2, 1);
  }
  ctx.globalAlpha = 1;

  // Side edges with ambient occlusion
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.18;
  ctx.fillRect(p.x, p.y, 2, p.h);
  ctx.fillRect(p.x + p.w - 2, p.y, 2, p.h);
  ctx.globalAlpha = 0.08;
  ctx.fillRect(p.x + 2, p.y, 1, p.h);
  ctx.fillRect(p.x + p.w - 3, p.y, 1, p.h);
  ctx.globalAlpha = 1;
}

// ===== PLAYER =====

export function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, skin: Skin) {
  // Try sprite-based rendering
  const isAttacking = p.attacking !== 'none' && p.attackTimer > 0;
  let frameIndex = 0;
  if (isAttacking) {
    frameIndex = p.attacking === 'punch' ? 6 : 7; // punch=frame 6, kick/special=frame 7
  } else if (!p.onGround) {
    frameIndex = 5; // jump
  } else if (Math.abs(p.vx) > 0.5) {
    frameIndex = 1 + (p.frame % 4); // walk cycle frames 1-4
  } else {
    frameIndex = 0; // idle
  }

  const flipX = p.facing === 'left';
  const spriteDrawn = spriteManager.drawFrame(
    ctx, 'player', frameIndex,
    p.x - 6, p.y - 4, 32, 36, // Slightly larger than hitbox for visual appeal
    flipX
  );

  if (spriteDrawn) {
    // Still draw attack effects and special aura via programmatic overlay
    if (isAttacking && p.attacking === 'special') {
      const attackPhase = p.attackTimer / 24;
      ctx.globalAlpha = attackPhase * 0.3;
      ctx.fillStyle = '#44ddff';
      ctx.fillRect(p.x - 6, p.y - 4, 32, 40);
      ctx.globalAlpha = 1;
    }
    // Ground shadow
    if (p.onGround) {
      ctx.fillStyle = '#000000';
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.ellipse(p.x + p.w / 2, p.y + p.h + 1, p.w * 0.6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    return;
  }

  // Fallback to programmatic drawing
  const dir = p.facing === 'right' ? 1 : -1;
  const bx = p.x + (dir === -1 ? p.w : 0);
  const bodyDark = adjustColor(skin.bodyColor, -40);
  const headDark = adjustColor(skin.headColor, -30);
  const pantsDark = adjustColor(skin.pantsColor, -30);
  const bodyLight = adjustColor(skin.bodyColor, 30);
  const headLight = adjustColor(skin.headColor, 25);

  // Ground shadow
  if (p.onGround) {
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h + 1, p.w * 0.6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.save();
  ctx.translate(bx, p.y);
  ctx.scale(dir, 1);

  // Attack pose modifications
  const isAttackingFallback = p.attacking !== 'none' && p.attackTimer > 0;
  const attackPhase = isAttackingFallback ? p.attackTimer / (p.attacking === 'special' ? 24 : p.attacking === 'kick' ? 16 : 12) : 0;

  if (p.crouching) {
    // Crouching pose with detail
    pixelRect(ctx, 2, 0, 14, 4, skin.hairColor);
    pixelRect(ctx, 3, 1, 12, 2, adjustColor(skin.hairColor, 20));
    pixelRect(ctx, 2, 4, 14, 5, skin.headColor);
    pixelRect(ctx, 2, 4, 14, 1, headLight);
    pixelRect(ctx, 10, 5, 4, 3, '#ffffff');
    pixelRect(ctx, 12, 5, 2, 3, '#111122');
    pixelRect(ctx, 12, 5, 1, 1, '#ffffff');
    pixelRect(ctx, 0, 9, 18, 4, skin.bodyColor);
    pixelRect(ctx, 0, 9, 18, 1, bodyLight);
    pixelRect(ctx, 0, 13, 18, 3, skin.pantsColor);
  } else {
    // Hair with sub-pixel detail
    pixelRect(ctx, 2, 0, 14, 5, skin.hairColor);
    pixelRect(ctx, 3, 1, 10, 2, adjustColor(skin.hairColor, 25));
    pixelRect(ctx, 14, 0, 2, 3, adjustColor(skin.hairColor, -20));
    // Hair shine
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.12;
    ctx.fillRect(4, 1, 6, 1);
    ctx.globalAlpha = 1;

    // Head with 3D shading
    pixelRect(ctx, 2, 5, 14, 8, skin.headColor);
    pixelRect(ctx, 2, 5, 14, 2, headLight);
    pixelRect(ctx, 2, 11, 14, 2, headDark);
    // Cheek blush
    ctx.fillStyle = '#ff8877';
    ctx.globalAlpha = 0.08;
    ctx.fillRect(3, 9, 4, 2);
    ctx.globalAlpha = 1;

    // Eyes with detailed iris
    pixelRect(ctx, 9, 7, 5, 4, '#ffffff');
    // Iris
    pixelRect(ctx, 11, 7, 3, 4, '#2244aa');
    // Pupil
    pixelRect(ctx, 12, 8, 2, 2, '#0a0a1e');
    // Eye shine (two highlights)
    pixelRect(ctx, 11, 7, 1, 1, '#ffffff');
    pixelRect(ctx, 13, 9, 1, 1, '#aaccff');
    // Eyebrow
    pixelRect(ctx, 9, 6, 5, 1, adjustColor(skin.hairColor, -20));
    // Mouth
    pixelRect(ctx, 10, 11, 3, 1, '#cc6644');
    // Nose
    pixelRect(ctx, 8, 9, 2, 2, headDark);

    // Body with depth shading
    pixelRect(ctx, 1, 13, 16, 8, skin.bodyColor);
    pixelRect(ctx, 1, 13, 16, 2, bodyLight);
    pixelRect(ctx, 1, 19, 16, 2, bodyDark);
    // Collar detail
    pixelRect(ctx, 3, 13, 12, 1, adjustColor(skin.bodyColor, 40));
    // Belt
    pixelRect(ctx, 1, 20, 16, 1, adjustColor(skin.pantsColor, -30));
    pixelRect(ctx, 7, 20, 4, 1, '#ccaa00'); // buckle

    // Arms with attack poses
    if (isAttackingFallback && p.attacking === 'punch') {
      // Punch arm extended
      const ext = (1 - attackPhase) * 12;
      pixelRect(ctx, 16, 14, 4 + ext, 6, skin.bodyColor);
      pixelRect(ctx, 16 + ext, 14, 6, 6, skin.headColor); // fist
      pixelRect(ctx, 16 + ext, 14, 6, 2, headLight);
      // Back arm
      pixelRect(ctx, -2, 16, 4, 6, skin.bodyColor);
      pixelRect(ctx, -2, 20, 4, 2, skin.headColor);
    } else if (isAttackingFallback && p.attacking === 'kick') {
      // Normal arms
      pixelRect(ctx, -2, 14, 4, 7, skin.bodyColor);
      pixelRect(ctx, 16, 14, 4, 7, skin.bodyColor);
      pixelRect(ctx, -2, 20, 4, 2, skin.headColor);
      pixelRect(ctx, 16, 20, 4, 2, skin.headColor);
    } else {
      // Normal arm swing
      const armSwing = p.frame % 2 === 0 ? 0 : 2;
      pixelRect(ctx, -2, 14 + armSwing, 4, 7, skin.bodyColor);
      pixelRect(ctx, -2, 14 + armSwing, 1, 7, bodyDark);
      pixelRect(ctx, 16, 14 - armSwing, 4, 7, skin.bodyColor);
      pixelRect(ctx, 19, 14 - armSwing, 1, 7, bodyDark);
      // Hands
      pixelRect(ctx, -2, 20 + armSwing, 4, 2, skin.headColor);
      pixelRect(ctx, 16, 20 - armSwing, 4, 2, skin.headColor);
    }

    // Pants with seam detail
    pixelRect(ctx, 2, 21, 6, 6, skin.pantsColor);
    pixelRect(ctx, 10, 21, 6, 6, skin.pantsColor);
    pixelRect(ctx, 2, 21, 1, 6, pantsDark);
    pixelRect(ctx, 10, 21, 1, 6, pantsDark);
    pixelRect(ctx, 8, 21, 2, 6, pantsDark);
    // Knee highlight
    pixelRect(ctx, 4, 23, 3, 1, adjustColor(skin.pantsColor, 20));
    pixelRect(ctx, 12, 23, 3, 1, adjustColor(skin.pantsColor, 20));

    // Feet with lace detail
    if (isAttackingFallback && p.attacking === 'kick') {
      // Kick leg extended
      const kickExt = (1 - attackPhase) * 14;
      pixelRect(ctx, 10 + kickExt, 27, 8, 5, '#3a2211');
      pixelRect(ctx, 10 + kickExt, 27, 8, 1, '#5a3a22');
      pixelRect(ctx, 10 + kickExt, 31, 8, 1, '#221108');
      // Other foot normal
      pixelRect(ctx, 1, 27, 7, 5, '#3a2211');
      pixelRect(ctx, 1, 27, 7, 1, '#5a3a22');
    } else {
      const legSwing = !p.onGround ? 0 : (p.frame % 2 === 0 ? 0 : 2);
      pixelRect(ctx, 1 - legSwing, 27, 7, 5, '#3a2211');
      pixelRect(ctx, 10 + legSwing, 27, 7, 5, '#3a2211');
      pixelRect(ctx, 1 - legSwing, 27, 7, 1, '#5a3a22');
      pixelRect(ctx, 10 + legSwing, 27, 7, 1, '#5a3a22');
      pixelRect(ctx, 1 - legSwing, 31, 7, 1, '#221108');
      pixelRect(ctx, 10 + legSwing, 31, 7, 1, '#221108');
      // Lace
      pixelRect(ctx, 3 - legSwing, 28, 3, 1, '#665544');
      pixelRect(ctx, 12 + legSwing, 28, 3, 1, '#665544');
    }

    if (!p.onGround) {
      // Jump pose - arms up with wind effect
      pixelRect(ctx, -2, 10, 4, 7, skin.bodyColor);
      pixelRect(ctx, 16, 10, 4, 7, skin.bodyColor);
      pixelRect(ctx, -2, 10, 4, 1, bodyLight);
      pixelRect(ctx, 16, 10, 4, 1, bodyLight);
    }

    // Special attack aura
    if (isAttackingFallback && p.attacking === 'special') {
      ctx.globalAlpha = attackPhase * 0.3;
      ctx.fillStyle = '#44ddff';
      ctx.fillRect(-6, -4, 30, 40);
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();
}

// ===== ROBOT =====

export function drawRobot(ctx: CanvasRenderingContext2D, r: Robot) {
  // Try sprite-based rendering
  // Smoother robot animation - 8 frames per sprite change
  const robotFrame = Math.floor(r.frame / 8) % 4;
  const flipX = r.vx < 0;
  const spriteDrawn = spriteManager.drawFrame(ctx, 'robot', robotFrame, r.x - 4, r.y - 4, 32, 32, flipX);
  if (spriteDrawn) {
    // Shadow
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.ellipse(r.x + 12, r.y + 24, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    return;
  }

  // Fallback
  const facing = r.vx > 0 ? 1 : -1;

  // Shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.ellipse(r.x + 12, r.y + 24, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Body with metallic gradient
  const bodyGrad = ctx.createLinearGradient(r.x + 2, r.y + 6, r.x + 22, r.y + 20);
  bodyGrad.addColorStop(0, '#7a8a9a');
  bodyGrad.addColorStop(0.5, '#667788');
  bodyGrad.addColorStop(1, '#4a5a6a');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(r.x + 2, r.y + 6, 20, 14);

  // Body panel lines
  pixelRect(ctx, r.x + 6, r.y + 8, 12, 1, '#556677');
  pixelRect(ctx, r.x + 6, r.y + 14, 12, 1, '#556677');

  // Chest core (pulsing)
  const corePulse = (Math.sin(r.frame * 0.06) + 1) * 0.5;
  drawGlow(ctx, r.x + 12, r.y + 12, 8, '#44ff44', corePulse * 0.15);
  pixelRect(ctx, r.x + 10, r.y + 10, 4, 3, corePulse > 0.5 ? '#44ff44' : '#228822');

  // Head with metallic sheen
  const headGrad = ctx.createLinearGradient(r.x + 4, r.y, r.x + 20, r.y + 8);
  headGrad.addColorStop(0, '#8899aa');
  headGrad.addColorStop(0.4, '#99aabb');
  headGrad.addColorStop(1, '#6a7a8a');
  ctx.fillStyle = headGrad;
  ctx.fillRect(r.x + 4, r.y, 16, 8);

  // Visor
  pixelRect(ctx, r.x + 5, r.y + 2, 14, 4, '#1a2233');
  // Visor reflection
  ctx.fillStyle = '#334466';
  ctx.globalAlpha = 0.4;
  ctx.fillRect(r.x + 6, r.y + 2, 4, 1);
  ctx.globalAlpha = 1;

  // Eye (scanning)
  const eyeGlow = (Math.sin(r.frame * 0.08) + 1) * 0.5;
  const eyeX = r.x + (facing > 0 ? 13 : 7);
  pixelRect(ctx, eyeX, r.y + 3, 3, 2, '#ff2200');
  drawGlow(ctx, eyeX + 1.5, r.y + 4, 6, '#ff4400', eyeGlow * 0.2);

  // Antenna with signal pulse
  pixelRect(ctx, r.x + 11, r.y - 5, 2, 5, '#99aabb');
  pixelRect(ctx, r.x + 10, r.y - 7, 4, 3, '#ff4444');
  if (Math.sin(r.frame * 0.06) > 0.5) {
    drawGlow(ctx, r.x + 12, r.y - 6, 6, '#ff6666', 0.25);
  }

  // Legs/tracks with tread detail
  pixelRect(ctx, r.x + 2, r.y + 20, 8, 4, '#445566');
  pixelRect(ctx, r.x + 14, r.y + 20, 8, 4, '#445566');
  // Tread lines
  for (let i = 0; i < 3; i++) {
    pixelRect(ctx, r.x + 3 + i * 2, r.y + 21, 1, 2, '#556677');
    pixelRect(ctx, r.x + 15 + i * 2, r.y + 21, 1, 2, '#556677');
  }

  // Gun arm with muzzle glow
  const gunX = facing > 0 ? r.x + 22 : r.x - 8;
  pixelRect(ctx, gunX, r.y + 9, 10, 5, '#556677');
  pixelRect(ctx, gunX, r.y + 9, 10, 1, '#6a7a8a');
  pixelRect(ctx, facing > 0 ? gunX + 8 : gunX, r.y + 10, 3, 3, '#334455');
  // Muzzle glow when about to shoot
  if (r.shootTimer < 20) {
    drawGlow(ctx, facing > 0 ? gunX + 10 : gunX, r.y + 11, 6, '#ff6644', (20 - r.shootTimer) / 20 * 0.3);
  }
}

// ===== BULLET =====

export function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
  // Trail
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#ff6644';
  ctx.fillRect(b.x - (b.vx > 0 ? 10 : 0), b.y - 1, b.w + 10, b.h + 2);
  ctx.globalAlpha = 0.04;
  ctx.fillRect(b.x - (b.vx > 0 ? 18 : 0), b.y, b.w + 18, b.h);
  ctx.globalAlpha = 1;

  // Glow
  drawGlow(ctx, b.x + b.w / 2, b.y + b.h / 2, 10, '#ff6644', 0.15);

  // Body
  pixelRect(ctx, b.x, b.y, b.w, b.h, '#ff4444');
  pixelRect(ctx, b.x + 1, b.y, b.w - 2, 1, '#ffaa66');
  pixelRect(ctx, b.x + 2, b.y + 1, b.w - 4, b.h - 2, '#ffcc88');
}

// ===== COIN =====

export function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, tick: number) {
  const bob = Math.sin(tick * 0.05 + c.bobOffset) * 3;

  // Try sprite-based coin rendering
  // Smoother coin spin - 8 frames per change
  const coinFrame = Math.floor(tick / 8) % 4;
  const spriteDrawn = spriteManager.drawFrame(ctx, 'coin', coinFrame, c.x - 2, c.y - 2 + bob, 20, 20);
  if (spriteDrawn) {
    // Add glow
    drawGlow(ctx, c.x + 8, c.y + 8 + bob, 16, '#ffcc00', 0.1);
    return;
  }

  // Fallback
  const cx = c.x + 8;
  const cy = c.y + 8 + bob;
  const stretch = Math.abs(Math.sin(tick * 0.03 + c.bobOffset));

  // Ground shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 12, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Outer glow (pulsing)
  drawGlow(ctx, cx, cy, 16, '#ffcc00', 0.08 + stretch * 0.08);

  // Coin rim
  ctx.fillStyle = '#bb8800';
  ctx.beginPath();
  ctx.arc(cx, cy, 9, 0, Math.PI * 2);
  ctx.fill();

  // Coin body gradient
  const coinGrad = ctx.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, 8);
  coinGrad.addColorStop(0, '#ffee55');
  coinGrad.addColorStop(0.6, '#ffcc00');
  coinGrad.addColorStop(1, '#ddaa00');
  ctx.fillStyle = coinGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // Inner ring
  ctx.strokeStyle = '#cc9900';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.stroke();

  // $ symbol with emboss
  ctx.fillStyle = '#aa7700';
  ctx.fillRect(cx - 1, cy - 4, 2, 9);
  ctx.fillRect(cx - 3, cy - 2, 6, 2);
  ctx.fillRect(cx - 3, cy + 1, 6, 2);
  // Highlight on $
  ctx.fillStyle = '#ffee88';
  ctx.globalAlpha = 0.5;
  ctx.fillRect(cx - 1, cy - 4, 1, 9);
  ctx.globalAlpha = 1;

  // Shine spot
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.5 + stretch * 0.3;
  ctx.fillRect(cx - 5, cy - 5, 3, 2);
  ctx.fillRect(cx - 6, cy - 3, 2, 2);
  ctx.globalAlpha = 1;

  // Sparkle ring particles
  if (stretch > 0.7) {
    const angle = tick * 0.05;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = (stretch - 0.7) * 3;
    ctx.fillRect(cx + Math.cos(angle) * 10 - 1, cy + Math.sin(angle) * 10 - 1, 2, 2);
    ctx.fillRect(cx + Math.cos(angle + Math.PI) * 10 - 1, cy + Math.sin(angle + Math.PI) * 10 - 1, 2, 2);
    ctx.globalAlpha = 1;
  }
}

// ===== SPIKE =====

export function drawSpike(ctx: CanvasRenderingContext2D, s: Spike) {
  // Blood stain base
  pixelRect(ctx, s.x, s.y + 4, s.w, 4, '#661111');
  pixelRect(ctx, s.x, s.y + 4, s.w, 2, '#881111');

  for (let i = 0; i < s.w; i += 16) {
    // Spike body with metallic gradient
    const spikeGrad = ctx.createLinearGradient(s.x + i, s.y + 8, s.x + i + 8, s.y - 8);
    spikeGrad.addColorStop(0, '#881111');
    spikeGrad.addColorStop(0.5, '#bb2222');
    spikeGrad.addColorStop(1, '#dd4444');
    ctx.fillStyle = spikeGrad;
    ctx.beginPath();
    ctx.moveTo(s.x + i, s.y + 8);
    ctx.lineTo(s.x + i + 8, s.y - 8);
    ctx.lineTo(s.x + i + 16, s.y + 8);
    ctx.closePath();
    ctx.fill();

    // Highlight edge
    ctx.fillStyle = '#ee6666';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(s.x + i + 2, s.y + 6);
    ctx.lineTo(s.x + i + 7, s.y - 4);
    ctx.lineTo(s.x + i + 8, s.y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Tip gleam
    ctx.fillStyle = '#ffaaaa';
    ctx.fillRect(s.x + i + 7, s.y - 7, 2, 3);

    // Dark edge
    ctx.fillStyle = '#551111';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(s.x + i + 9, s.y + 2);
    ctx.lineTo(s.x + i + 8, s.y - 4);
    ctx.lineTo(s.x + i + 14, s.y + 6);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ===== HEART =====

export function drawHeart(ctx: CanvasRenderingContext2D, h: HeartPickup, tick: number) {
  const bob = Math.sin(tick * 0.04 + 1) * 2;
  const scale = 1 + Math.sin(tick * 0.06) * 0.1;
  const cx = h.x + 8;
  const cy = h.y + 8 + bob;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Outer glow pulse
  drawGlow(ctx, 0, 0, 18, '#ff3366', 0.12 + Math.sin(tick * 0.08) * 0.06);

  // Shadow
  ctx.fillStyle = '#aa1133';
  ctx.beginPath();
  ctx.arc(-3, -1, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3, -1, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-9, 1);
  ctx.lineTo(0, 10);
  ctx.lineTo(9, 1);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.fillStyle = '#ff3366';
  ctx.beginPath();
  ctx.arc(-3, -2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3, -2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(0, 8);
  ctx.lineTo(8, 0);
  ctx.closePath();
  ctx.fill();

  // Highlight
  ctx.fillStyle = '#ff88aa';
  ctx.beginPath();
  ctx.arc(-3, -4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // Sparkle
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.8;
  ctx.fillRect(-4, -5, 2, 2);
  ctx.fillRect(-5, -3, 1, 1);
  ctx.globalAlpha = 1;

  ctx.restore();
}

// ===== CHEST =====

export function drawChest(ctx: CanvasRenderingContext2D, c: Chest) {
  // Shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.ellipse(c.x + 16, c.y + 29, 16, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  if (c.opened) {
    // Open chest body with wood grain gradient
    const bodyGrad = ctx.createLinearGradient(c.x, c.y + 10, c.x, c.y + 28);
    bodyGrad.addColorStop(0, '#9a7a44');
    bodyGrad.addColorStop(1, '#664422');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(c.x, c.y + 10, 32, 18);

    // Interior gold glow
    drawGlow(ctx, c.x + 16, c.y + 16, 20, '#ffcc00', 0.15);

    // Open lid
    const lidGrad = ctx.createLinearGradient(c.x - 2, c.y - 6, c.x - 2, c.y + 8);
    lidGrad.addColorStop(0, '#ccaa66');
    lidGrad.addColorStop(1, '#886633');
    ctx.fillStyle = lidGrad;
    ctx.fillRect(c.x - 2, c.y - 6, 36, 14);

    // Gold treasure inside
    pixelRect(ctx, c.x + 3, c.y + 12, 26, 10, '#ddaa00');
    pixelRect(ctx, c.x + 5, c.y + 13, 22, 4, '#ffcc22');
    // Gems
    pixelRect(ctx, c.x + 8, c.y + 14, 4, 4, '#44aaff');
    pixelRect(ctx, c.x + 18, c.y + 15, 3, 3, '#ff4488');
    pixelRect(ctx, c.x + 14, c.y + 16, 3, 3, '#44ff88');
    // Sparkles
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(c.x + 12, c.y + 13, 2, 2);
    ctx.fillRect(c.x + 22, c.y + 16, 2, 2);
    ctx.fillRect(c.x + 6, c.y + 18, 1, 1);
    ctx.globalAlpha = 1;

    // Metal bands
    pixelRect(ctx, c.x - 1, c.y - 3, 34, 2, '#888877');
    pixelRect(ctx, c.x - 1, c.y + 3, 34, 2, '#888877');
  } else {
    // Closed chest with gradient body
    const bodyGrad = ctx.createLinearGradient(c.x, c.y + 10, c.x, c.y + 28);
    bodyGrad.addColorStop(0, '#9a7a44');
    bodyGrad.addColorStop(1, '#664422');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(c.x, c.y + 10, 32, 18);

    // Wood grain
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#554422';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(c.x + 2 + i * 8, c.y + 14, 6, 1);
      ctx.fillRect(c.x + 4 + i * 8, c.y + 20, 5, 1);
    }
    ctx.globalAlpha = 1;

    // Lid with gradient
    const lidGrad = ctx.createLinearGradient(c.x - 2, c.y, c.x - 2, c.y + 12);
    lidGrad.addColorStop(0, '#ccaa66');
    lidGrad.addColorStop(1, '#886633');
    ctx.fillStyle = lidGrad;
    ctx.fillRect(c.x - 2, c.y, 36, 12);

    // Lock with glow
    pixelRect(ctx, c.x + 11, c.y + 5, 10, 10, '#ffcc00');
    pixelRect(ctx, c.x + 12, c.y + 6, 8, 2, '#ffdd44');
    pixelRect(ctx, c.x + 13, c.y + 8, 6, 5, '#cc9900');
    pixelRect(ctx, c.x + 15, c.y + 9, 2, 3, '#664400');
    drawGlow(ctx, c.x + 16, c.y + 10, 8, '#ffcc00', 0.08);

    // Metal bands
    pixelRect(ctx, c.x, c.y + 4, 32, 2, '#888877');
    pixelRect(ctx, c.x, c.y + 20, 32, 2, '#888877');
    // Corner rivets
    pixelRect(ctx, c.x + 1, c.y + 12, 3, 3, '#aaaaaa');
    pixelRect(ctx, c.x + 28, c.y + 12, 3, 3, '#aaaaaa');
  }
}

// ===== FLAG =====

export function drawFlag(ctx: CanvasRenderingContext2D, f: Flag, tick: number) {
  // Shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.ellipse(f.x + 16, f.y + f.h, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Stone base with detail
  const baseGrad = ctx.createLinearGradient(f.x + 6, f.y + f.h - 8, f.x + 26, f.y + f.h);
  baseGrad.addColorStop(0, '#999999');
  baseGrad.addColorStop(0.5, '#777777');
  baseGrad.addColorStop(1, '#555555');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(f.x + 6, f.y + f.h - 8, 20, 8);

  // Pole with metallic gradient
  const poleGrad = ctx.createLinearGradient(f.x + 14, 0, f.x + 18, 0);
  poleGrad.addColorStop(0, '#cccccc');
  poleGrad.addColorStop(0.5, '#aaaaaa');
  poleGrad.addColorStop(1, '#888888');
  ctx.fillStyle = poleGrad;
  ctx.fillRect(f.x + 14, f.y, 4, f.h - 6);
  // Cap
  pixelRect(ctx, f.x + 12, f.y - 2, 8, 4, '#dddddd');
  pixelRect(ctx, f.x + 13, f.y - 1, 6, 1, '#ffffff');

  // Flag cloth with wave physics
  const wave1 = Math.sin(tick * 0.08) * 3;
  const wave2 = Math.sin(tick * 0.08 + 1) * 2;
  const wave3 = Math.sin(tick * 0.1 + 0.5) * 1.5;

  // Flag shadow
  ctx.fillStyle = '#1a8822';
  ctx.beginPath();
  ctx.moveTo(f.x + 18, f.y + 3);
  ctx.quadraticCurveTo(f.x + 30 + wave3, f.y + 8, f.x + 44 + wave1, f.y + 10);
  ctx.quadraticCurveTo(f.x + 40 + wave2, f.y + 18, f.x + 42 + wave2, f.y + 22);
  ctx.lineTo(f.x + 18, f.y + 24);
  ctx.closePath();
  ctx.fill();

  // Flag body gradient
  const flagGrad = ctx.createLinearGradient(f.x + 18, f.y + 2, f.x + 18, f.y + 22);
  flagGrad.addColorStop(0, '#44ee44');
  flagGrad.addColorStop(0.5, '#33dd33');
  flagGrad.addColorStop(1, '#22aa22');
  ctx.fillStyle = flagGrad;
  ctx.beginPath();
  ctx.moveTo(f.x + 18, f.y + 2);
  ctx.quadraticCurveTo(f.x + 30 + wave3, f.y + 6, f.x + 44 + wave1, f.y + 8);
  ctx.quadraticCurveTo(f.x + 40 + wave2, f.y + 16, f.x + 42 + wave2, f.y + 20);
  ctx.lineTo(f.x + 18, f.y + 22);
  ctx.closePath();
  ctx.fill();

  // Highlight stripe
  ctx.fillStyle = '#66ff66';
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(f.x + 18, f.y + 2);
  ctx.quadraticCurveTo(f.x + 30 + wave3, f.y + 6, f.x + 44 + wave1, f.y + 8);
  ctx.lineTo(f.x + 43 + wave1, f.y + 11);
  ctx.lineTo(f.x + 18, f.y + 6);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Star with glow
  const starX = f.x + 28 + wave1 * 0.3;
  const starY = f.y + 12;
  drawGlow(ctx, starX, starY, 6, '#ffffff', 0.15);
  ctx.fillStyle = '#ffffff';
  drawPixelStar(ctx, starX, starY, 4);

  // Sparkle particles
  if (tick % 40 < 20) {
    const sparkleAlpha = (20 - (tick % 40)) / 20;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = sparkleAlpha * 0.6;
    ctx.fillRect(starX + 5, starY - 3, 2, 2);
    ctx.globalAlpha = 1;
  }
}

function drawPixelStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillRect(x - 1, y - size, 2, size * 2);
  ctx.fillRect(x - size, y - 1, size * 2, 2);
  ctx.fillRect(x - 2, y - 2, 1, 1);
  ctx.fillRect(x + 1, y - 2, 1, 1);
  ctx.fillRect(x - 2, y + 1, 1, 1);
  ctx.fillRect(x + 1, y + 1, 1, 1);
}

// ===== MOVING SPIKE =====

export function drawMovingSpike(ctx: CanvasRenderingContext2D, ms: MovingSpike, tick: number) {
  // Warning glow (pulsing danger aura)
  const dangerPulse = (Math.sin(tick * 0.1) + 1) * 0.5;
  drawGlow(ctx, ms.x + ms.w / 2, ms.y, ms.w * 0.8, '#ff4444', 0.06 + dangerPulse * 0.08);

  // Track line (shows path)
  ctx.strokeStyle = '#ff444433';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(ms.startX + ms.w / 2, ms.startY);
  ctx.lineTo(ms.endX + ms.w / 2, ms.endY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Base
  pixelRect(ctx, ms.x, ms.y + 4, ms.w, 4, '#991111');

  for (let i = 0; i < ms.w; i += 16) {
    const spikeGrad = ctx.createLinearGradient(ms.x + i, ms.y + 8, ms.x + i + 8, ms.y - 8);
    spikeGrad.addColorStop(0, '#991122');
    spikeGrad.addColorStop(0.5, '#cc2244');
    spikeGrad.addColorStop(1, '#ee4466');
    ctx.fillStyle = spikeGrad;
    ctx.beginPath();
    ctx.moveTo(ms.x + i, ms.y + 8);
    ctx.lineTo(ms.x + i + 8, ms.y - 8);
    ctx.lineTo(ms.x + i + 16, ms.y + 8);
    ctx.closePath();
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#ff6688';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(ms.x + i + 2, ms.y + 6);
    ctx.lineTo(ms.x + i + 7, ms.y - 4);
    ctx.lineTo(ms.x + i + 8, ms.y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Tip
    ctx.fillStyle = '#ffaacc';
    ctx.fillRect(ms.x + i + 7, ms.y - 6, 2, 2);
  }
}

// ===== BAT =====

export function drawBat(ctx: CanvasRenderingContext2D, b: Bat, tick: number) {
  // Try sprite-based rendering
  // Smoother bat wing flap - 6 frames per sprite change
  const batFrame = Math.floor(b.frame / 6) % 4;
  const flipX = b.vx < 0;
  const spriteDrawn = spriteManager.drawFrame(ctx, 'bat', batFrame, b.x - 6, b.y - 6, 32, 28, flipX);
  if (spriteDrawn) {
    // Shadow below
    ctx.fillStyle = '#000000';
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.ellipse(b.x + b.w / 2, b.y + b.h + 20, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    return;
  }

  // Fallback
  const wingFlap = Math.sin(b.frame * 0.3) * 10;
  const facing = b.vx > 0 ? 1 : -1;

  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.scale(facing, 1);

  // Shadow below
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  ctx.ellipse(0, 20, 10, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Wing membrane with gradient
  for (const side of [-1, 1]) {
    const wingGrad = ctx.createLinearGradient(side * 4, 0, side * 18, -4 + wingFlap);
    wingGrad.addColorStop(0, '#443355');
    wingGrad.addColorStop(1, '#2a1a33');
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.moveTo(side * 4, 0);
    ctx.lineTo(side * 16, -5 + wingFlap);
    ctx.lineTo(side * 20, 2 + wingFlap * 0.5);
    ctx.lineTo(side * 12, 5);
    ctx.closePath();
    ctx.fill();

    // Wing bone
    ctx.strokeStyle = '#554466';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(side * 4, 0);
    ctx.lineTo(side * 16, -4 + wingFlap);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(side * 4, 2);
    ctx.lineTo(side * 14, 0 + wingFlap * 0.3);
    ctx.stroke();
  }

  // Body with fur texture
  pixelRect(ctx, -5, -4, 10, 10, '#332244');
  pixelRect(ctx, -4, -3, 8, 3, '#443355');
  // Fur specks
  ctx.fillStyle = '#3a2a4a';
  ctx.fillRect(-3, -1, 1, 1);
  ctx.fillRect(2, 0, 1, 1);

  // Eyes with glow
  const eyeGlow = (Math.sin(b.frame * 0.08) + 1) * 0.5;
  pixelRect(ctx, -4, -2, 3, 2, '#ff2200');
  pixelRect(ctx, 1, -2, 3, 2, '#ff2200');
  drawGlow(ctx, -2.5, -1, 4, '#ff4400', eyeGlow * 0.15);
  drawGlow(ctx, 2.5, -1, 4, '#ff4400', eyeGlow * 0.15);
  // Eye shine
  pixelRect(ctx, -3, -2, 1, 1, '#ff8866');
  pixelRect(ctx, 2, -2, 1, 1, '#ff8866');

  // Fangs
  pixelRect(ctx, -3, 4, 2, 3, '#ffffff');
  pixelRect(ctx, 1, 4, 2, 3, '#ffffff');

  // Ears with inner detail
  ctx.fillStyle = '#443355';
  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(-7, -10);
  ctx.lineTo(-2, -4);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -4);
  ctx.lineTo(7, -10);
  ctx.lineTo(2, -4);
  ctx.closePath();
  ctx.fill();
  // Inner ear
  ctx.fillStyle = '#664477';
  ctx.beginPath();
  ctx.moveTo(-3.5, -5);
  ctx.lineTo(-5.5, -8);
  ctx.lineTo(-2.5, -5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(3.5, -5);
  ctx.lineTo(5.5, -8);
  ctx.lineTo(2.5, -5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Export particle system for engine use
export { updateAndDrawParticles, spawnParticle };
