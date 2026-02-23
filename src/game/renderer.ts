import { Player, Robot, Bullet, Coin, Chest, Spike, MovingSpike, Bat, HeartPickup, Flag, Platform, LevelData, Skin } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

// Utility: pixel-perfect rounded rect
function pixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

// Utility: darken/lighten hex color
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function drawBackground(ctx: CanvasRenderingContext2D, level: LevelData, cameraX: number, tick: number) {
  const world = level.world;

  // Rich sky gradient based on world
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  if (world === 'Jungle') {
    grad.addColorStop(0, '#041a10');
    grad.addColorStop(0.3, '#0a3020');
    grad.addColorStop(0.7, '#1a4a2a');
    grad.addColorStop(1, '#0a2a1a');
  } else {
    // Desert
    grad.addColorStop(0, '#0a0a2a');
    grad.addColorStop(0.25, '#1a1a4a');
    grad.addColorStop(0.6, '#2a2040');
    grad.addColorStop(0.85, '#3a2828');
    grad.addColorStop(1, '#4a3020');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Stars with twinkling
  for (let i = 0; i < 50; i++) {
    const sx = ((i * 137 + 50) % CANVAS_WIDTH + (cameraX * 0.03 * ((i % 3) + 1)) % CANVAS_WIDTH) % CANVAS_WIDTH;
    const sy = (i * 73 + 15) % (CANVAS_HEIGHT * 0.45);
    const bright = (Math.sin(tick * 0.015 + i * 1.7) + 1) * 0.5;
    const size = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1;
    ctx.globalAlpha = 0.2 + bright * 0.8;
    ctx.fillStyle = i % 7 === 0 ? '#aaccff' : i % 11 === 0 ? '#ffddaa' : '#ffffff';
    ctx.fillRect(sx, sy, size, size);
    // Cross sparkle on bright large stars
    if (size >= 2 && bright > 0.7) {
      ctx.globalAlpha = bright * 0.3;
      ctx.fillRect(sx - 1, sy, size + 2, 1);
      ctx.fillRect(sx, sy - 1, 1, size + 2);
    }
  }
  ctx.globalAlpha = 1;

  // Moon
  const moonX = ((CANVAS_WIDTH * 0.75) - cameraX * 0.01 + 2000) % (CANVAS_WIDTH + 200) - 100;
  ctx.fillStyle = '#eeeedd';
  ctx.beginPath();
  ctx.arc(moonX, 50, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ddddcc';
  ctx.beginPath();
  ctx.arc(moonX - 4, 46, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(moonX + 6, 52, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(moonX + 2, 58, 2, 0, Math.PI * 2);
  ctx.fill();
  // Moon glow
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#ffffcc';
  ctx.beginPath();
  ctx.arc(moonX, 50, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  if (world === 'Jungle') {
    // Distant jungle canopy layers (parallax)
    drawJungleBackground(ctx, cameraX, tick);
  } else {
    // Desert dunes (parallax) - multiple layers
    drawDesertBackground(ctx, cameraX, tick);
  }
}

function drawDesertBackground(ctx: CanvasRenderingContext2D, cameraX: number, tick: number) {
  // Far dunes
  ctx.fillStyle = '#1a0e06';
  for (let i = 0; i < 6; i++) {
    const dx = (i * 280 - (cameraX * 0.08) % 1680 + 1680) % 1680 - 140;
    drawDune(ctx, dx, 360, 250 + i * 20, 40 + i * 8);
  }
  // Mid dunes
  ctx.fillStyle = '#2a1a0a';
  for (let i = 0; i < 5; i++) {
    const dx = (i * 320 - (cameraX * 0.15) % 1600 + 1600) % 1600 - 120;
    drawDune(ctx, dx, 355, 220 + i * 25, 50 + i * 10);
  }
  // Near dunes with texture
  ctx.fillStyle = '#3a2510';
  for (let i = 0; i < 4; i++) {
    const dx = (i * 360 - (cameraX * 0.25) % 1440 + 1440) % 1440 - 100;
    drawDune(ctx, dx, 370, 200 + i * 30, 55 + i * 12);
  }

  // Cacti silhouettes
  ctx.fillStyle = '#1a1008';
  for (let i = 0; i < 3; i++) {
    const cx = (i * 450 + 200 - (cameraX * 0.12) % 1350 + 1350) % 1350 - 50;
    drawCactus(ctx, cx, 340, 20 + (i % 2) * 10);
  }

  // Sand particles
  ctx.fillStyle = '#c8964a';
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 12; i++) {
    const px = (i * 97 + tick * 0.5 + cameraX * 0.3) % CANVAS_WIDTH;
    const py = 340 + Math.sin(tick * 0.02 + i * 2) * 20;
    ctx.fillRect(px, py, 2, 1);
  }
  ctx.globalAlpha = 1;
}

function drawCactus(ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number) {
  // Trunk
  ctx.fillRect(x, baseY - h, 6, h);
  // Left arm
  ctx.fillRect(x - 8, baseY - h * 0.7, 8, 4);
  ctx.fillRect(x - 8, baseY - h * 0.7 - 10, 4, 14);
  // Right arm
  ctx.fillRect(x + 6, baseY - h * 0.5, 8, 4);
  ctx.fillRect(x + 10, baseY - h * 0.5 - 8, 4, 12);
}

function drawJungleBackground(ctx: CanvasRenderingContext2D, cameraX: number, tick: number) {
  // Far tree layer
  ctx.fillStyle = '#0a2010';
  for (let i = 0; i < 8; i++) {
    const tx = (i * 200 - (cameraX * 0.06) % 1600 + 1600) % 1600 - 100;
    drawTreeSilhouette(ctx, tx, 320, 60 + (i % 3) * 20);
  }
  // Mid tree layer
  ctx.fillStyle = '#122a18';
  for (let i = 0; i < 6; i++) {
    const tx = (i * 260 - (cameraX * 0.12) % 1560 + 1560) % 1560 - 80;
    drawTreeSilhouette(ctx, tx, 340, 70 + (i % 3) * 15);
  }
  // Hanging vines
  ctx.fillStyle = '#1a4020';
  for (let i = 0; i < 10; i++) {
    const vx = (i * 180 - (cameraX * 0.18) % 1800 + 1800) % 1800 - 40;
    const vineLen = 30 + (i % 4) * 15;
    const sway = Math.sin(tick * 0.02 + i * 1.5) * 3;
    ctx.fillRect(vx + sway, 0, 2, vineLen);
    // Leaves on vine
    ctx.fillStyle = '#2a5530';
    ctx.fillRect(vx + sway - 3, vineLen * 0.4, 8, 3);
    ctx.fillRect(vx + sway - 2, vineLen * 0.7, 6, 3);
    ctx.fillStyle = '#1a4020';
  }

  // Fireflies
  ctx.fillStyle = '#aaffaa';
  for (let i = 0; i < 8; i++) {
    const fx = (i * 130 + Math.sin(tick * 0.01 + i * 3) * 20 - cameraX * 0.1 + 2000) % CANVAS_WIDTH;
    const fy = 200 + Math.sin(tick * 0.015 + i * 2.5) * 50;
    const glow = (Math.sin(tick * 0.04 + i * 1.8) + 1) * 0.5;
    ctx.globalAlpha = glow * 0.6;
    ctx.fillRect(fx, fy, 2, 2);
    ctx.globalAlpha = glow * 0.15;
    ctx.beginPath();
    ctx.arc(fx + 1, fy + 1, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawTreeSilhouette(ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number) {
  // Trunk
  ctx.fillRect(x + 10, baseY - h * 0.5, 8, h * 0.5);
  // Canopy layers
  ctx.beginPath();
  ctx.arc(x + 14, baseY - h * 0.5, h * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 6, baseY - h * 0.4, h * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 22, baseY - h * 0.45, h * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawDune(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + w * 0.3, y - h * 0.9, x + w * 0.5, y - h);
  ctx.quadraticCurveTo(x + w * 0.7, y - h * 0.8, x + w, y);
  ctx.fill();
}

export function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, color: string) {
  const darker = adjustColor(color, -30);
  const lighter = adjustColor(color, 40);
  const darkest = adjustColor(color, -60);

  // Main body
  pixelRect(ctx, p.x, p.y, p.w, p.h, color);

  // Top grass/surface layer (3px)
  pixelRect(ctx, p.x, p.y, p.w, 3, lighter);

  // Top edge highlight
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.12;
  ctx.fillRect(p.x, p.y, p.w, 1);
  ctx.globalAlpha = 1;

  // Bottom shadow
  pixelRect(ctx, p.x, p.y + p.h - 2, p.w, 2, darkest);

  // Brick pattern
  ctx.strokeStyle = darkest;
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 1;
  for (let by = p.y + 4; by < p.y + p.h; by += 8) {
    const offset = ((by - p.y) / 8) % 2 === 0 ? 0 : 8;
    for (let bx = p.x + offset; bx < p.x + p.w; bx += 16) {
      ctx.strokeRect(bx + 0.5, by + 0.5, 15, 7);
    }
  }
  ctx.globalAlpha = 1;

  // Random dirt specks for texture
  ctx.fillStyle = darker;
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < p.w / 12; i++) {
    const dx = p.x + ((i * 37 + 7) % p.w);
    const dy = p.y + 4 + ((i * 53 + 3) % (p.h - 6));
    ctx.fillRect(dx, dy, 2, 1);
  }
  ctx.globalAlpha = 1;

  // Side edges
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.15;
  ctx.fillRect(p.x, p.y, 1, p.h);
  ctx.fillRect(p.x + p.w - 1, p.y, 1, p.h);
  ctx.globalAlpha = 1;
}

export function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, skin: Skin) {
  const dir = p.facing === 'right' ? 1 : -1;
  const bx = p.x + (dir === -1 ? p.w : 0);
  const bodyDark = adjustColor(skin.bodyColor, -40);
  const headDark = adjustColor(skin.headColor, -30);
  const pantsDark = adjustColor(skin.pantsColor, -30);

  ctx.save();
  ctx.translate(bx, p.y);
  ctx.scale(dir, 1);

  if (p.crouching) {
    // Crouching - squished with detail
    pixelRect(ctx, 2, 0, 14, 4, skin.hairColor);
    pixelRect(ctx, 3, 1, 12, 2, adjustColor(skin.hairColor, 20));
    pixelRect(ctx, 2, 4, 14, 5, skin.headColor);
    pixelRect(ctx, 2, 4, 14, 1, adjustColor(skin.headColor, 20));
    // Eyes
    pixelRect(ctx, 10, 5, 4, 3, '#ffffff');
    pixelRect(ctx, 12, 5, 2, 3, '#111122');
    pixelRect(ctx, 12, 5, 1, 1, '#ffffff'); // eye shine
    pixelRect(ctx, 0, 9, 18, 4, skin.bodyColor);
    pixelRect(ctx, 0, 9, 18, 1, adjustColor(skin.bodyColor, 30));
    pixelRect(ctx, 0, 13, 18, 3, skin.pantsColor);
  } else {
    // Hair with highlights
    pixelRect(ctx, 2, 0, 14, 5, skin.hairColor);
    pixelRect(ctx, 3, 1, 10, 2, adjustColor(skin.hairColor, 25));
    pixelRect(ctx, 14, 0, 2, 3, adjustColor(skin.hairColor, -20)); // hair edge

    // Head with shading
    pixelRect(ctx, 2, 5, 14, 8, skin.headColor);
    pixelRect(ctx, 2, 5, 14, 2, adjustColor(skin.headColor, 20)); // forehead highlight
    pixelRect(ctx, 2, 11, 14, 2, headDark); // chin shadow

    // Eyes with detail
    pixelRect(ctx, 9, 7, 5, 4, '#ffffff');
    pixelRect(ctx, 12, 7, 2, 4, '#1a1a2e'); // iris
    pixelRect(ctx, 12, 7, 1, 1, '#ffffff'); // eye shine
    // Eyebrow
    pixelRect(ctx, 9, 6, 5, 1, adjustColor(skin.hairColor, -20));

    // Mouth
    pixelRect(ctx, 10, 11, 3, 1, '#cc6644');

    // Nose
    pixelRect(ctx, 8, 9, 2, 2, headDark);

    // Body with shading
    pixelRect(ctx, 1, 13, 16, 8, skin.bodyColor);
    pixelRect(ctx, 1, 13, 16, 2, adjustColor(skin.bodyColor, 25)); // collar highlight
    pixelRect(ctx, 1, 19, 16, 2, bodyDark); // bottom shadow
    // Belt
    pixelRect(ctx, 1, 20, 16, 1, adjustColor(skin.pantsColor, -30));

    // Arms with shading
    const armSwing = p.frame % 2 === 0 ? 0 : 2;
    pixelRect(ctx, -2, 14 + armSwing, 4, 7, skin.bodyColor);
    pixelRect(ctx, -2, 14 + armSwing, 1, 7, bodyDark);
    pixelRect(ctx, 16, 14 - armSwing, 4, 7, skin.bodyColor);
    pixelRect(ctx, 19, 14 - armSwing, 1, 7, bodyDark);
    // Hands
    pixelRect(ctx, -2, 20 + armSwing, 4, 2, skin.headColor);
    pixelRect(ctx, 16, 20 - armSwing, 4, 2, skin.headColor);

    // Pants with shading
    pixelRect(ctx, 2, 21, 6, 6, skin.pantsColor);
    pixelRect(ctx, 10, 21, 6, 6, skin.pantsColor);
    pixelRect(ctx, 2, 21, 1, 6, pantsDark);
    pixelRect(ctx, 10, 21, 1, 6, pantsDark);
    pixelRect(ctx, 8, 21, 2, 6, pantsDark); // gap shadow

    // Feet with detail
    const legSwing = !p.onGround ? 0 : (p.frame % 2 === 0 ? 0 : 2);
    pixelRect(ctx, 1 - legSwing, 27, 7, 5, '#3a2211');
    pixelRect(ctx, 10 + legSwing, 27, 7, 5, '#3a2211');
    pixelRect(ctx, 1 - legSwing, 27, 7, 1, '#5a3a22'); // shoe highlight
    pixelRect(ctx, 10 + legSwing, 27, 7, 1, '#5a3a22');
    pixelRect(ctx, 1 - legSwing, 31, 7, 1, '#221108'); // sole
    pixelRect(ctx, 10 + legSwing, 31, 7, 1, '#221108');

    if (!p.onGround) {
      // Jump pose - arms up with detail
      pixelRect(ctx, -2, 10, 4, 7, skin.bodyColor);
      pixelRect(ctx, 16, 10, 4, 7, skin.bodyColor);
      pixelRect(ctx, -2, 10, 4, 1, adjustColor(skin.bodyColor, 25));
      pixelRect(ctx, 16, 10, 4, 1, adjustColor(skin.bodyColor, 25));
    }
  }

  ctx.restore();
}

export function drawRobot(ctx: CanvasRenderingContext2D, r: Robot) {
  const facing = r.vx > 0 ? 1 : -1;

  // Shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.2;
  ctx.fillRect(r.x + 2, r.y + 22, 20, 3);
  ctx.globalAlpha = 1;

  // Body with gradient effect
  pixelRect(ctx, r.x + 2, r.y + 6, 20, 14, '#667788');
  pixelRect(ctx, r.x + 2, r.y + 6, 20, 2, '#7a8a9a'); // top highlight
  pixelRect(ctx, r.x + 2, r.y + 18, 20, 2, '#4a5a6a'); // bottom shadow
  // Body detail - panel lines
  pixelRect(ctx, r.x + 6, r.y + 8, 12, 1, '#556677');
  pixelRect(ctx, r.x + 6, r.y + 14, 12, 1, '#556677');
  // Chest light
  const chestGlow = Math.sin(r.frame * 0.08) > 0;
  pixelRect(ctx, r.x + 10, r.y + 10, 4, 3, chestGlow ? '#44ff44' : '#228822');

  // Head with detail
  pixelRect(ctx, r.x + 4, r.y, 16, 8, '#778899');
  pixelRect(ctx, r.x + 4, r.y, 16, 2, '#8899aa'); // head highlight
  pixelRect(ctx, r.x + 4, r.y + 6, 16, 2, '#5a6a7a'); // head shadow
  // Visor
  pixelRect(ctx, r.x + 5, r.y + 2, 14, 4, '#223344');

  // Eye (animated, menacing)
  const eyeGlow = Math.sin(r.frame * 0.1) > 0;
  const eyeX = r.x + (facing > 0 ? 13 : 7);
  pixelRect(ctx, eyeX, r.y + 3, eyeGlow ? 4 : 3, 2, '#ff2200');
  // Eye glow effect
  ctx.globalAlpha = 0.3;
  pixelRect(ctx, eyeX - 1, r.y + 2, 6, 4, '#ff4400');
  ctx.globalAlpha = 1;

  // Antenna with detail
  pixelRect(ctx, r.x + 11, r.y - 5, 2, 5, '#99aabb');
  pixelRect(ctx, r.x + 10, r.y - 7, 4, 3, '#ff4444');
  // Antenna blink
  if (Math.sin(r.frame * 0.06) > 0.5) {
    ctx.globalAlpha = 0.4;
    pixelRect(ctx, r.x + 9, r.y - 8, 6, 5, '#ff6666');
    ctx.globalAlpha = 1;
  }

  // Legs/tracks with detail
  pixelRect(ctx, r.x + 2, r.y + 20, 8, 4, '#445566');
  pixelRect(ctx, r.x + 14, r.y + 20, 8, 4, '#445566');
  // Track detail
  pixelRect(ctx, r.x + 3, r.y + 21, 6, 1, '#556677');
  pixelRect(ctx, r.x + 15, r.y + 21, 6, 1, '#556677');
  pixelRect(ctx, r.x + 2, r.y + 23, 8, 1, '#334455');
  pixelRect(ctx, r.x + 14, r.y + 23, 8, 1, '#334455');

  // Gun arm with detail
  const gunX = facing > 0 ? r.x + 22 : r.x - 8;
  pixelRect(ctx, gunX, r.y + 9, 10, 5, '#556677');
  pixelRect(ctx, gunX, r.y + 9, 10, 1, '#6a7a8a');
  // Gun barrel
  pixelRect(ctx, facing > 0 ? gunX + 8 : gunX, r.y + 10, 3, 3, '#334455');
}

export function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
  // Glow trail
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ff6644';
  ctx.fillRect(b.x - (b.vx > 0 ? 6 : 0), b.y - 1, b.w + 6, b.h + 2);
  ctx.globalAlpha = 1;

  // Bullet body
  pixelRect(ctx, b.x, b.y, b.w, b.h, '#ff4444');
  pixelRect(ctx, b.x + 1, b.y + 1, b.w - 2, 1, '#ffaa66');
  // Core
  pixelRect(ctx, b.x + 2, b.y + 1, b.w - 4, b.h - 2, '#ffcc88');
}

export function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, tick: number) {
  const bob = Math.sin(tick * 0.05 + c.bobOffset) * 3;
  const cx = c.x + 8;
  const cy = c.y + 8 + bob;
  const stretch = Math.abs(Math.sin(tick * 0.03 + c.bobOffset));

  // Outer glow
  ctx.globalAlpha = 0.1 + stretch * 0.1;
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Coin shadow
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 10, 6, 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Coin body
  ctx.fillStyle = '#ddaa00';
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fill();

  // Coin face
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();

  // Inner ring
  ctx.strokeStyle = '#ddaa00';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.stroke();

  // Inner highlight
  ctx.fillStyle = '#ffee55';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  // $ symbol with depth
  ctx.fillStyle = '#bb8800';
  ctx.fillRect(cx - 1, cy - 4, 2, 9);
  ctx.fillRect(cx - 3, cy - 2, 6, 2);
  ctx.fillRect(cx - 3, cy + 1, 6, 2);

  // Shine
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.4 + stretch * 0.3;
  ctx.fillRect(cx - 4, cy - 5, 3, 2);
  ctx.fillRect(cx - 5, cy - 3, 2, 2);
  ctx.globalAlpha = 1;
}

export function drawSpike(ctx: CanvasRenderingContext2D, s: Spike) {
  // Base
  pixelRect(ctx, s.x, s.y + 4, s.w, 4, '#881111');

  for (let i = 0; i < s.w; i += 16) {
    // Spike body
    ctx.fillStyle = '#aa2222';
    ctx.beginPath();
    ctx.moveTo(s.x + i, s.y + 8);
    ctx.lineTo(s.x + i + 8, s.y - 8);
    ctx.lineTo(s.x + i + 16, s.y + 8);
    ctx.closePath();
    ctx.fill();

    // Spike highlight (left edge)
    ctx.fillStyle = '#dd4444';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(s.x + i + 2, s.y + 6);
    ctx.lineTo(s.x + i + 7, s.y - 4);
    ctx.lineTo(s.x + i + 8, s.y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Tip shine
    ctx.fillStyle = '#ff8888';
    ctx.fillRect(s.x + i + 7, s.y - 6, 2, 2);

    // Dark edge (right)
    ctx.fillStyle = '#661111';
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

export function drawHeart(ctx: CanvasRenderingContext2D, h: HeartPickup, tick: number) {
  const bob = Math.sin(tick * 0.04 + 1) * 2;
  const scale = 1 + Math.sin(tick * 0.06) * 0.1;
  const cx = h.x + 8;
  const cy = h.y + 8 + bob;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Outer glow
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ff3366';
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Heart shadow
  ctx.fillStyle = '#cc2244';
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

  // Heart body
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
  // Small sparkle
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.7;
  ctx.fillRect(-4, -5, 2, 2);
  ctx.globalAlpha = 1;

  ctx.restore();
}

export function drawChest(ctx: CanvasRenderingContext2D, c: Chest) {
  // Shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.2;
  ctx.fillRect(c.x + 2, c.y + 26, 28, 4);
  ctx.globalAlpha = 1;

  if (c.opened) {
    // Opened chest body
    pixelRect(ctx, c.x, c.y + 10, 32, 18, '#886633');
    pixelRect(ctx, c.x + 1, c.y + 11, 30, 2, '#9a7a44'); // inner top highlight
    pixelRect(ctx, c.x, c.y + 26, 32, 2, '#664422'); // bottom

    // Open lid (tilted back)
    pixelRect(ctx, c.x - 2, c.y - 6, 36, 14, '#aa8844');
    pixelRect(ctx, c.x - 2, c.y - 6, 36, 2, '#ccaa66'); // lid highlight
    pixelRect(ctx, c.x - 2, c.y + 6, 36, 2, '#886633'); // lid shadow

    // Gold inside with sparkle
    pixelRect(ctx, c.x + 3, c.y + 12, 26, 10, '#ddaa00');
    pixelRect(ctx, c.x + 5, c.y + 13, 22, 4, '#ffcc22');
    // Gems
    pixelRect(ctx, c.x + 8, c.y + 14, 4, 4, '#44aaff');
    pixelRect(ctx, c.x + 18, c.y + 15, 3, 3, '#ff4488');
    // Sparkles
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.8;
    ctx.fillRect(c.x + 12, c.y + 13, 2, 2);
    ctx.fillRect(c.x + 22, c.y + 16, 2, 2);
    ctx.fillRect(c.x + 6, c.y + 18, 1, 1);
    ctx.globalAlpha = 1;

    // Metal bands on lid
    pixelRect(ctx, c.x - 1, c.y - 3, 34, 2, '#777766');
    pixelRect(ctx, c.x - 1, c.y + 3, 34, 2, '#777766');
  } else {
    // Closed chest body
    pixelRect(ctx, c.x, c.y + 10, 32, 18, '#886633');
    pixelRect(ctx, c.x, c.y + 26, 32, 2, '#664422');
    // Body highlight
    pixelRect(ctx, c.x + 1, c.y + 11, 30, 2, '#9a7a44');
    // Wood grain
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#554422';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(c.x + 2 + i * 8, c.y + 14, 6, 1);
      ctx.fillRect(c.x + 4 + i * 8, c.y + 20, 5, 1);
    }
    ctx.globalAlpha = 1;

    // Lid
    pixelRect(ctx, c.x - 2, c.y, 36, 12, '#aa8844');
    pixelRect(ctx, c.x - 2, c.y, 36, 2, '#ccaa66'); // top highlight
    pixelRect(ctx, c.x - 2, c.y + 10, 36, 2, '#886633'); // bottom

    // Lock with detail
    pixelRect(ctx, c.x + 11, c.y + 5, 10, 10, '#ffcc00');
    pixelRect(ctx, c.x + 12, c.y + 6, 8, 2, '#ffdd44'); // lock highlight
    pixelRect(ctx, c.x + 13, c.y + 8, 6, 5, '#cc9900');
    // Keyhole
    pixelRect(ctx, c.x + 15, c.y + 9, 2, 3, '#664400');

    // Metal bands
    pixelRect(ctx, c.x, c.y + 4, 32, 2, '#777766');
    pixelRect(ctx, c.x, c.y + 20, 32, 2, '#777766');
    // Corner rivets
    pixelRect(ctx, c.x + 1, c.y + 12, 3, 3, '#999988');
    pixelRect(ctx, c.x + 28, c.y + 12, 3, 3, '#999988');
  }
}

export function drawFlag(ctx: CanvasRenderingContext2D, f: Flag, tick: number) {
  // Shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.2;
  ctx.fillRect(f.x + 10, f.y + f.h - 4, 12, 4);
  ctx.globalAlpha = 1;

  // Base with detail
  pixelRect(ctx, f.x + 6, f.y + f.h - 8, 20, 8, '#777777');
  pixelRect(ctx, f.x + 6, f.y + f.h - 8, 20, 2, '#999999');
  pixelRect(ctx, f.x + 8, f.y + f.h - 6, 16, 2, '#666666');

  // Pole with shading
  pixelRect(ctx, f.x + 14, f.y, 4, f.h - 6, '#aaaaaa');
  pixelRect(ctx, f.x + 14, f.y, 1, f.h - 6, '#cccccc'); // pole highlight
  pixelRect(ctx, f.x + 17, f.y, 1, f.h - 6, '#888888'); // pole shadow
  // Pole cap
  pixelRect(ctx, f.x + 12, f.y - 2, 8, 4, '#dddddd');
  pixelRect(ctx, f.x + 13, f.y - 1, 6, 1, '#ffffff');

  // Flag cloth (waving) with detail
  const wave1 = Math.sin(tick * 0.08) * 3;
  const wave2 = Math.sin(tick * 0.08 + 1) * 2;

  // Flag shadow
  ctx.fillStyle = '#229922';
  ctx.beginPath();
  ctx.moveTo(f.x + 18, f.y + 3);
  ctx.lineTo(f.x + 44 + wave1, f.y + 10);
  ctx.lineTo(f.x + 42 + wave2, f.y + 22);
  ctx.lineTo(f.x + 18, f.y + 24);
  ctx.closePath();
  ctx.fill();

  // Flag body
  ctx.fillStyle = '#33dd33';
  ctx.beginPath();
  ctx.moveTo(f.x + 18, f.y + 2);
  ctx.lineTo(f.x + 44 + wave1, f.y + 8);
  ctx.lineTo(f.x + 42 + wave2, f.y + 20);
  ctx.lineTo(f.x + 18, f.y + 22);
  ctx.closePath();
  ctx.fill();

  // Flag highlight stripe
  ctx.fillStyle = '#55ff55';
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(f.x + 18, f.y + 2);
  ctx.lineTo(f.x + 44 + wave1, f.y + 8);
  ctx.lineTo(f.x + 43 + wave1, f.y + 11);
  ctx.lineTo(f.x + 18, f.y + 6);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Star on flag with glow
  const starX = f.x + 28 + wave1 * 0.3;
  const starY = f.y + 12;
  ctx.fillStyle = '#ffffff';
  drawPixelStar(ctx, starX, starY, 4);

  // Sparkle near star
  const sparkle = Math.sin(tick * 0.1) > 0.5;
  if (sparkle) {
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(starX + 5, starY - 3, 2, 2);
    ctx.globalAlpha = 1;
  }
}

function drawPixelStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  // Simple pixel star
  ctx.fillRect(x - 1, y - size, 2, size * 2);
  ctx.fillRect(x - size, y - 1, size * 2, 2);
  ctx.fillRect(x - 2, y - 2, 1, 1);
  ctx.fillRect(x + 1, y - 2, 1, 1);
  ctx.fillRect(x - 2, y + 1, 1, 1);
  ctx.fillRect(x + 1, y + 1, 1, 1);
}

export function drawMovingSpike(ctx: CanvasRenderingContext2D, ms: MovingSpike, tick: number) {
  // Warning glow
  ctx.globalAlpha = 0.15 + Math.sin(tick * 0.1) * 0.1;
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(ms.x - 4, ms.y - 12, ms.w + 8, ms.h + 16);
  ctx.globalAlpha = 1;

  // Base
  pixelRect(ctx, ms.x, ms.y + 4, ms.w, 4, '#991111');

  for (let i = 0; i < ms.w; i += 16) {
    // Spike body - purple/red tint to distinguish from static
    ctx.fillStyle = '#bb2244';
    ctx.beginPath();
    ctx.moveTo(ms.x + i, ms.y + 8);
    ctx.lineTo(ms.x + i + 8, ms.y - 8);
    ctx.lineTo(ms.x + i + 16, ms.y + 8);
    ctx.closePath();
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#ee4466';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(ms.x + i + 2, ms.y + 6);
    ctx.lineTo(ms.x + i + 7, ms.y - 4);
    ctx.lineTo(ms.x + i + 8, ms.y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Tip
    ctx.fillStyle = '#ffaaaa';
    ctx.fillRect(ms.x + i + 7, ms.y - 6, 2, 2);
  }
}

export function drawBat(ctx: CanvasRenderingContext2D, b: Bat, tick: number) {
  const wingFlap = Math.sin(b.frame * 0.3) * 8;
  const facing = b.vx > 0 ? 1 : -1;

  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.scale(facing, 1);

  // Left wing
  ctx.fillStyle = '#443355';
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(-14, -4 + wingFlap);
  ctx.lineTo(-18, 2 + wingFlap * 0.5);
  ctx.lineTo(-10, 4);
  ctx.closePath();
  ctx.fill();
  // Wing membrane
  ctx.fillStyle = '#554466';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(-4, 2);
  ctx.lineTo(-12, -2 + wingFlap);
  ctx.lineTo(-8, 4);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Right wing
  ctx.fillStyle = '#443355';
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(14, -4 + wingFlap);
  ctx.lineTo(18, 2 + wingFlap * 0.5);
  ctx.lineTo(10, 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#554466';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(4, 2);
  ctx.lineTo(12, -2 + wingFlap);
  ctx.lineTo(8, 4);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Body
  pixelRect(ctx, -5, -4, 10, 10, '#332244');
  pixelRect(ctx, -4, -3, 8, 3, '#443355');

  // Eyes (red, glowing)
  const eyeGlow = Math.sin(b.frame * 0.08) > 0;
  pixelRect(ctx, -4, -2, 3, 2, eyeGlow ? '#ff2200' : '#cc1100');
  pixelRect(ctx, 1, -2, 3, 2, eyeGlow ? '#ff2200' : '#cc1100');
  // Eye shine
  pixelRect(ctx, -3, -2, 1, 1, '#ff6644');
  pixelRect(ctx, 2, -2, 1, 1, '#ff6644');

  // Fangs
  pixelRect(ctx, -3, 4, 2, 3, '#ffffff');
  pixelRect(ctx, 1, 4, 2, 3, '#ffffff');

  // Ears
  ctx.fillStyle = '#443355';
  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(-6, -8);
  ctx.lineTo(-2, -4);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -4);
  ctx.lineTo(6, -8);
  ctx.lineTo(2, -4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}