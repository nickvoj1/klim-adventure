import { Player, Robot, Bullet, Coin, Chest, Spike, HeartPickup, Flag, Platform, LevelData, Skin } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

export function drawBackground(ctx: CanvasRenderingContext2D, level: LevelData, cameraX: number, tick: number) {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, level.skyColor);
  grad.addColorStop(0.6, '#2a2a5a');
  grad.addColorStop(1, '#3a2a2a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 30; i++) {
    const sx = ((i * 137 + 50) % CANVAS_WIDTH + (cameraX * 0.05 * ((i % 3) + 1)) % CANVAS_WIDTH) % CANVAS_WIDTH;
    const sy = (i * 73 + 20) % (CANVAS_HEIGHT * 0.5);
    const bright = (Math.sin(tick * 0.02 + i) + 1) * 0.5;
    ctx.globalAlpha = 0.3 + bright * 0.7;
    ctx.fillRect(sx, sy, 2, 2);
  }
  ctx.globalAlpha = 1;

  // Desert dunes (parallax)
  ctx.fillStyle = '#2a1a0a';
  for (let i = 0; i < 5; i++) {
    const dx = (i * 300 - (cameraX * 0.2) % 1500 + 1500) % 1500 - 100;
    drawDune(ctx, dx, 340, 200 + i * 30, 60 + i * 10);
  }
}

function drawDune(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + w / 2, y - h, x + w, y);
  ctx.fill();
}

export function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, color: string) {
  // Main body
  ctx.fillStyle = color;
  ctx.fillRect(p.x, p.y, p.w, p.h);
  // Top highlight
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.15;
  ctx.fillRect(p.x, p.y, p.w, 3);
  ctx.globalAlpha = 1;
  // Bottom shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.3;
  ctx.fillRect(p.x, p.y + p.h - 3, p.w, 3);
  ctx.globalAlpha = 1;
  // Pixel detail - bricks
  ctx.strokeStyle = '#000000';
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  for (let bx = p.x; bx < p.x + p.w; bx += 16) {
    ctx.beginPath(); ctx.moveTo(bx, p.y); ctx.lineTo(bx, p.y + p.h); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function drawPlayer(ctx: CanvasRenderingContext2D, p: Player, skin: Skin) {
  const dir = p.facing === 'right' ? 1 : -1;
  const bx = p.x + (dir === -1 ? p.w : 0);

  ctx.save();
  ctx.translate(bx, p.y);
  ctx.scale(dir, 1);

  if (p.crouching) {
    // Crouching - squished
    ctx.fillStyle = skin.hairColor;
    ctx.fillRect(2, 0, 12, 4);
    ctx.fillStyle = skin.headColor;
    ctx.fillRect(2, 4, 12, 4);
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 5, 3, 2);
    ctx.fillStyle = '#000000';
    ctx.fillRect(11, 5, 2, 2);
    ctx.fillStyle = skin.bodyColor;
    ctx.fillRect(0, 8, 16, 4);
    ctx.fillStyle = skin.pantsColor;
    ctx.fillRect(0, 12, 16, 4);
  } else {
    // Hair
    ctx.fillStyle = skin.hairColor;
    ctx.fillRect(2, 0, 14, 5);
    // Head
    ctx.fillStyle = skin.headColor;
    ctx.fillRect(2, 5, 14, 8);
    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(10, 7, 4, 3);
    ctx.fillStyle = '#000000';
    ctx.fillRect(12, 7, 2, 3);
    // Mouth
    ctx.fillStyle = '#cc6644';
    ctx.fillRect(10, 11, 3, 1);
    // Body
    ctx.fillStyle = skin.bodyColor;
    ctx.fillRect(1, 13, 16, 8);
    // Arms
    const armSwing = p.frame % 2 === 0 ? 0 : 2;
    ctx.fillRect(-2, 14 + armSwing, 4, 7);
    ctx.fillRect(16, 14 - armSwing, 4, 7);
    // Pants
    ctx.fillStyle = skin.pantsColor;
    ctx.fillRect(2, 21, 6, 6);
    ctx.fillRect(10, 21, 6, 6);
    // Feet
    ctx.fillStyle = '#442211';
    const legSwing = !p.onGround ? 0 : (p.frame % 2 === 0 ? 0 : 2);
    ctx.fillRect(1 - legSwing, 27, 7, 5);
    ctx.fillRect(10 + legSwing, 27, 7, 5);

    if (!p.onGround) {
      // Jump pose - arms up
      ctx.fillStyle = skin.bodyColor;
      ctx.fillRect(-2, 10, 4, 7);
      ctx.fillRect(16, 10, 4, 7);
    }
  }

  ctx.restore();
}

export function drawRobot(ctx: CanvasRenderingContext2D, r: Robot) {
  // Body
  ctx.fillStyle = '#667788';
  ctx.fillRect(r.x + 2, r.y + 6, 20, 14);
  // Head
  ctx.fillStyle = '#778899';
  ctx.fillRect(r.x + 4, r.y, 16, 8);
  // Eye (red, menacing)
  ctx.fillStyle = '#ff2200';
  const eyeGlow = Math.sin(r.frame * 0.1) > 0;
  ctx.fillRect(r.x + (r.vx > 0 ? 14 : 6), r.y + 2, eyeGlow ? 4 : 3, 3);
  // Antenna
  ctx.fillStyle = '#aabbcc';
  ctx.fillRect(r.x + 11, r.y - 4, 2, 4);
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(r.x + 10, r.y - 6, 4, 3);
  // Legs/tracks
  ctx.fillStyle = '#445566';
  ctx.fillRect(r.x + 2, r.y + 20, 8, 4);
  ctx.fillRect(r.x + 14, r.y + 20, 8, 4);
  // Gun arm
  ctx.fillStyle = '#556677';
  ctx.fillRect(r.vx > 0 ? r.x + 22 : r.x - 6, r.y + 10, 8, 4);
}

export function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
  ctx.fillStyle = '#ff4444';
  ctx.fillRect(b.x, b.y, b.w, b.h);
  ctx.fillStyle = '#ffaa44';
  ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
}

export function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, tick: number) {
  const bob = Math.sin(tick * 0.05 + c.bobOffset) * 3;
  const cx = c.x + 8;
  const cy = c.y + 8 + bob;

  // Glow
  ctx.fillStyle = '#ffcc00';
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Coin body
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle
  ctx.fillStyle = '#ffee44';
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  // $ symbol
  ctx.fillStyle = '#cc9900';
  ctx.fillRect(cx - 1, cy - 4, 2, 8);
}

export function drawSpike(ctx: CanvasRenderingContext2D, s: Spike) {
  ctx.fillStyle = '#cc2222';
  for (let i = 0; i < s.w; i += 16) {
    ctx.beginPath();
    ctx.moveTo(s.x + i, s.y + 8);
    ctx.lineTo(s.x + i + 8, s.y - 8);
    ctx.lineTo(s.x + i + 16, s.y + 8);
    ctx.closePath();
    ctx.fill();
  }
  // Highlight
  ctx.fillStyle = '#ff4444';
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < s.w; i += 16) {
    ctx.beginPath();
    ctx.moveTo(s.x + i + 4, s.y + 4);
    ctx.lineTo(s.x + i + 8, s.y - 4);
    ctx.lineTo(s.x + i + 12, s.y + 4);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawHeart(ctx: CanvasRenderingContext2D, h: HeartPickup, tick: number) {
  const bob = Math.sin(tick * 0.04 + 1) * 2;
  const scale = 1 + Math.sin(tick * 0.06) * 0.1;
  const cx = h.x + 8;
  const cy = h.y + 8 + bob;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Heart shape using circles + triangle
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
  ctx.fillStyle = '#ff6688';
  ctx.beginPath();
  ctx.arc(-3, -3, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawChest(ctx: CanvasRenderingContext2D, c: Chest) {
  if (c.opened) {
    // Opened chest
    ctx.fillStyle = '#886633';
    ctx.fillRect(c.x, c.y + 8, 32, 20);
    // Lid (open)
    ctx.fillStyle = '#aa8844';
    ctx.fillRect(c.x - 2, c.y - 4, 36, 12);
    // Gold inside
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(c.x + 4, c.y + 10, 24, 8);
    // Sparkle
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(c.x + 10, c.y + 12, 2, 2);
    ctx.fillRect(c.x + 20, c.y + 14, 2, 2);
  } else {
    // Closed chest
    ctx.fillStyle = '#886633';
    ctx.fillRect(c.x, c.y + 8, 32, 20);
    // Lid
    ctx.fillStyle = '#aa8844';
    ctx.fillRect(c.x - 2, c.y, 36, 12);
    // Lock
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(c.x + 12, c.y + 6, 8, 8);
    ctx.fillStyle = '#cc9900';
    ctx.fillRect(c.x + 14, c.y + 8, 4, 4);
    // Metal bands
    ctx.fillStyle = '#666655';
    ctx.fillRect(c.x, c.y + 4, 32, 2);
    ctx.fillRect(c.x, c.y + 18, 32, 2);
  }
}

export function drawFlag(ctx: CanvasRenderingContext2D, f: Flag, tick: number) {
  // Pole
  ctx.fillStyle = '#aaaaaa';
  ctx.fillRect(f.x + 14, f.y, 4, f.h);
  // Flag cloth (waving)
  const wave = Math.sin(tick * 0.08) * 2;
  ctx.fillStyle = '#33cc33';
  ctx.beginPath();
  ctx.moveTo(f.x + 18, f.y + 2);
  ctx.lineTo(f.x + 42 + wave, f.y + 8);
  ctx.lineTo(f.x + 40 - wave, f.y + 18);
  ctx.lineTo(f.x + 18, f.y + 22);
  ctx.closePath();
  ctx.fill();
  // Star on flag
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(f.x + 24, f.y + 9, 4, 4);
  // Base
  ctx.fillStyle = '#888888';
  ctx.fillRect(f.x + 8, f.y + f.h - 6, 16, 6);
}
