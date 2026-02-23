import { Boss, BossType } from './types';

function pixelRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), w, h);
}

export function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss, tick: number) {
  if (!boss.alive) return;

  // Flash when hit
  if (boss.invincible > 0 && tick % 4 < 2) return;

  ctx.save();

  switch (boss.type) {
    case 'sand_worm': drawSandWorm(ctx, boss, tick); break;
    case 'mummy': drawMummy(ctx, boss, tick); break;
    case 'sand_golem': drawSandGolem(ctx, boss, tick); break;
    case 'scorpion_king': drawScorpionKing(ctx, boss, tick); break;
    case 'pharaoh': drawPharaoh(ctx, boss, tick); break;
    case 'poison_frog': drawPoisonFrog(ctx, boss, tick); break;
    case 'spider_queen': drawSpiderQueen(ctx, boss, tick); break;
    case 'jungle_hawk': drawJungleHawk(ctx, boss, tick); break;
    case 'stone_guardian': drawStoneGuardian(ctx, boss, tick); break;
    case 'ancient_treant': drawAncientTreant(ctx, boss, tick); break;
  }

  // HP bar
  drawBossHP(ctx, boss);

  ctx.restore();
}

function drawBossHP(ctx: CanvasRenderingContext2D, boss: Boss) {
  const barW = boss.w + 20;
  const barH = 6;
  const bx = boss.x - 10;
  const by = boss.y - 20;
  const hpRatio = boss.hp / boss.maxHp;

  // Background
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.6;
  ctx.fillRect(bx, by, barW, barH);
  ctx.globalAlpha = 1;

  // HP fill
  const color = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#ccaa22' : '#cc2222';
  ctx.fillStyle = color;
  ctx.fillRect(bx + 1, by + 1, (barW - 2) * hpRatio, barH - 2);

  // Border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx, by, barW, barH);
}

// ===== DESERT BOSSES =====

function drawSandWorm(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const wave = Math.sin(tick * 0.05) * 4;
  // Body segments
  for (let i = 0; i < 5; i++) {
    const sx = b.x + i * 8 - 16;
    const sy = b.y + 10 + Math.sin(tick * 0.08 + i * 0.8) * 6;
    const segW = 12 - i;
    pixelRect(ctx, sx, sy, segW, segW, '#cc9944');
    pixelRect(ctx, sx + 1, sy + 1, segW - 2, 2, '#ddaa55');
  }
  // Head
  pixelRect(ctx, b.x, b.y + wave, b.w, b.h * 0.7, '#ddaa44');
  pixelRect(ctx, b.x + 2, b.y + wave + 2, b.w - 4, 4, '#eebb55');
  // Mandibles
  pixelRect(ctx, b.x - 4, b.y + wave + b.h * 0.3, 6, 8, '#aa7722');
  pixelRect(ctx, b.x + b.w - 2, b.y + wave + b.h * 0.3, 6, 8, '#aa7722');
  // Eyes
  pixelRect(ctx, b.x + 6, b.y + wave + 4, 6, 4, '#ff2200');
  pixelRect(ctx, b.x + b.w - 12, b.y + wave + 4, 6, 4, '#ff2200');
  pixelRect(ctx, b.x + 8, b.y + wave + 5, 2, 2, '#ffaa00');
  pixelRect(ctx, b.x + b.w - 10, b.y + wave + 5, 2, 2, '#ffaa00');
  // Teeth
  for (let i = 0; i < 4; i++) {
    pixelRect(ctx, b.x + 4 + i * 8, b.y + wave + b.h * 0.6, 4, 6, '#ffffff');
  }
}

function drawMummy(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const sway = Math.sin(tick * 0.03) * 2;
  // Body
  pixelRect(ctx, b.x + 4, b.y + 12, b.w - 8, b.h - 12, '#ccbb88');
  pixelRect(ctx, b.x + 4, b.y + 12, b.w - 8, 3, '#ddccaa');
  // Bandage wrapping pattern
  for (let i = 0; i < 6; i++) {
    const bx = b.x + 4 + (i % 2) * 4;
    pixelRect(ctx, bx, b.y + 14 + i * 6, b.w - 12, 2, '#eeddbb');
  }
  // Head
  pixelRect(ctx, b.x + 6, b.y, b.w - 12, 14, '#ccbb88');
  pixelRect(ctx, b.x + 6, b.y, b.w - 12, 3, '#ddccaa');
  // Glowing eyes
  const eyeGlow = Math.sin(tick * 0.1) > 0;
  pixelRect(ctx, b.x + 10, b.y + 5, 5, 4, eyeGlow ? '#00ff88' : '#00cc66');
  pixelRect(ctx, b.x + b.w - 15, b.y + 5, 5, 4, eyeGlow ? '#00ff88' : '#00cc66');
  // Dangling bandages
  pixelRect(ctx, b.x + 2 + sway, b.y + 20, 3, 12, '#ccbb88');
  pixelRect(ctx, b.x + b.w - 5 - sway, b.y + 18, 3, 14, '#ccbb88');
  // Arms
  pixelRect(ctx, b.x - 2, b.y + 16, 6, 20, '#bbaa77');
  pixelRect(ctx, b.x + b.w - 4, b.y + 16, 6, 20, '#bbaa77');
}

function drawSandGolem(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const shake = b.phase === 1 ? Math.sin(tick * 0.3) * 2 : 0;
  // Massive body
  pixelRect(ctx, b.x + shake, b.y + 10, b.w, b.h - 10, '#aa8833');
  pixelRect(ctx, b.x + shake + 2, b.y + 12, b.w - 4, 6, '#bb9944');
  // Head (smaller on big body)
  pixelRect(ctx, b.x + shake + 8, b.y, b.w - 16, 14, '#bb9944');
  // Eyes - angry
  pixelRect(ctx, b.x + shake + 12, b.y + 4, 6, 5, '#ff4400');
  pixelRect(ctx, b.x + shake + b.w - 18, b.y + 4, 6, 5, '#ff4400');
  // Mouth crack
  pixelRect(ctx, b.x + shake + 14, b.y + 10, b.w - 28, 3, '#553311');
  // Rock texture
  for (let i = 0; i < 5; i++) {
    pixelRect(ctx, b.x + shake + 6 + i * 10, b.y + 20 + (i % 3) * 8, 6, 4, '#997733');
  }
  // Huge arms
  pixelRect(ctx, b.x + shake - 8, b.y + 14, 10, 24, '#998833');
  pixelRect(ctx, b.x + shake + b.w - 2, b.y + 14, 10, 24, '#998833');
  // Fists
  pixelRect(ctx, b.x + shake - 10, b.y + 36, 14, 10, '#aa8833');
  pixelRect(ctx, b.x + shake + b.w - 4, b.y + 36, 14, 10, '#aa8833');
}

function drawScorpionKing(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const dir = b.direction;
  // Body (wide, low)
  pixelRect(ctx, b.x, b.y + 8, b.w, b.h - 8, '#882211');
  pixelRect(ctx, b.x + 2, b.y + 10, b.w - 4, 4, '#993322');
  // Segments
  for (let i = 0; i < 3; i++) {
    pixelRect(ctx, b.x + 4 + i * 12, b.y + 12, 10, 2, '#773311');
  }
  // Head / pincers
  pixelRect(ctx, b.x - 6, b.y + 10, 10, 8, '#993322');
  pixelRect(ctx, b.x + b.w - 4, b.y + 10, 10, 8, '#993322');
  // Claws
  pixelRect(ctx, b.x - 10, b.y + 6, 8, 6, '#aa3322');
  pixelRect(ctx, b.x - 10, b.y + 16, 8, 6, '#aa3322');
  pixelRect(ctx, b.x + b.w + 2, b.y + 6, 8, 6, '#aa3322');
  pixelRect(ctx, b.x + b.w + 2, b.y + 16, 8, 6, '#aa3322');
  // Tail (curving up)
  const tailPhase = Math.sin(tick * 0.06) * 8;
  for (let i = 0; i < 5; i++) {
    const tx = b.x + b.w / 2 - 4;
    const ty = b.y - i * 6 + tailPhase * (i / 5);
    pixelRect(ctx, tx, ty, 8, 6, '#882211');
  }
  // Stinger
  pixelRect(ctx, b.x + b.w / 2 - 3, b.y - 28 + tailPhase, 6, 8, '#44aa22');
  // Eyes
  pixelRect(ctx, b.x + 4, b.y + 4, 4, 3, '#ff6600');
  pixelRect(ctx, b.x + b.w - 8, b.y + 4, 4, 3, '#ff6600');
  // Legs
  for (let i = 0; i < 4; i++) {
    pixelRect(ctx, b.x + 4 + i * 10, b.y + b.h - 4, 3, 6, '#771100');
  }
}

function drawPharaoh(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const float = Math.sin(tick * 0.04) * 4;
  // Floating body
  pixelRect(ctx, b.x + 4, b.y + 16 + float, b.w - 8, b.h - 20, '#2233aa');
  pixelRect(ctx, b.x + 4, b.y + 16 + float, b.w - 8, 3, '#3344bb');
  // Gold trim
  pixelRect(ctx, b.x + 4, b.y + 16 + float, b.w - 8, 2, '#ffcc00');
  pixelRect(ctx, b.x + 4, b.y + b.h - 6 + float, b.w - 8, 2, '#ffcc00');
  // Head/mask
  pixelRect(ctx, b.x + 6, b.y + float, b.w - 12, 18, '#ffcc00');
  pixelRect(ctx, b.x + 8, b.y + 2 + float, b.w - 16, 4, '#ffdd44');
  // Headdress
  pixelRect(ctx, b.x, b.y - 4 + float, b.w, 6, '#2233aa');
  pixelRect(ctx, b.x + 2, b.y - 2 + float, b.w - 4, 2, '#3355cc');
  // Eyes - laser ready
  const laserGlow = b.phase === 1;
  pixelRect(ctx, b.x + 10, b.y + 7 + float, 6, 4, laserGlow ? '#ff0000' : '#00ccff');
  pixelRect(ctx, b.x + b.w - 16, b.y + 7 + float, 6, 4, laserGlow ? '#ff0000' : '#00ccff');
  // Mouth
  pixelRect(ctx, b.x + 14, b.y + 13 + float, b.w - 28, 2, '#886600');
  // Staff
  pixelRect(ctx, b.x - 6, b.y + 4 + float, 3, 40, '#ffcc00');
  pixelRect(ctx, b.x - 8, b.y + float, 7, 6, '#ff4488');
  // Ankh
  ctx.beginPath();
  ctx.arc(b.x - 5, b.y - 2 + float, 3, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Aura
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath();
  ctx.arc(b.x + b.w / 2, b.y + b.h / 2 + float, b.w * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// ===== JUNGLE BOSSES =====

function drawPoisonFrog(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const breathe = Math.sin(tick * 0.06) * 2;
  // Body (wide, squat)
  pixelRect(ctx, b.x + 2, b.y + 10, b.w - 4, b.h - 10 + breathe, '#22aa22');
  pixelRect(ctx, b.x + 4, b.y + 12, b.w - 8, 4, '#33cc33');
  // Poison spots
  pixelRect(ctx, b.x + 8, b.y + 16, 4, 4, '#ffaa00');
  pixelRect(ctx, b.x + 20, b.y + 20, 5, 3, '#ffaa00');
  pixelRect(ctx, b.x + b.w - 14, b.y + 15, 4, 4, '#ff6600');
  // Head
  pixelRect(ctx, b.x + 4, b.y, b.w - 8, 12, '#33bb33');
  // Big eyes
  pixelRect(ctx, b.x + 2, b.y - 4, 10, 8, '#44dd44');
  pixelRect(ctx, b.x + b.w - 12, b.y - 4, 10, 8, '#44dd44');
  pixelRect(ctx, b.x + 5, b.y - 2, 4, 4, '#111111');
  pixelRect(ctx, b.x + b.w - 9, b.y - 2, 4, 4, '#111111');
  pixelRect(ctx, b.x + 6, b.y - 1, 2, 2, '#ffff00');
  pixelRect(ctx, b.x + b.w - 8, b.y - 1, 2, 2, '#ffff00');
  // Mouth/tongue
  if (b.phase === 1) {
    pixelRect(ctx, b.x + b.w / 2 - 1, b.y + 10, 2, 20, '#ff3366');
    pixelRect(ctx, b.x + b.w / 2 - 3, b.y + 28, 6, 3, '#ff3366');
  }
  // Legs
  pixelRect(ctx, b.x - 4, b.y + b.h - 8, 8, 8, '#229922');
  pixelRect(ctx, b.x + b.w - 4, b.y + b.h - 8, 8, 8, '#229922');
  // Webbed feet
  pixelRect(ctx, b.x - 6, b.y + b.h - 2, 12, 3, '#228822');
  pixelRect(ctx, b.x + b.w - 6, b.y + b.h - 2, 12, 3, '#228822');
}

function drawSpiderQueen(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  // Abdomen (large, behind)
  pixelRect(ctx, b.x - 6, b.y + 12, b.w + 12, b.h - 8, '#332244');
  pixelRect(ctx, b.x - 4, b.y + 14, b.w + 8, 4, '#443355');
  // Pattern on abdomen
  pixelRect(ctx, b.x + 8, b.y + 18, 6, 6, '#ff2244');
  pixelRect(ctx, b.x + b.w - 14, b.y + 18, 6, 6, '#ff2244');
  pixelRect(ctx, b.x + b.w / 2 - 3, b.y + 16, 6, 8, '#ff2244');
  // Head/thorax
  pixelRect(ctx, b.x + 6, b.y, b.w - 12, 14, '#443355');
  pixelRect(ctx, b.x + 8, b.y + 2, b.w - 16, 4, '#554466');
  // Multiple eyes (8)
  for (let i = 0; i < 4; i++) {
    const ex = b.x + 10 + i * 6;
    const ey = b.y + 3 + (i % 2) * 3;
    const glow = Math.sin(tick * 0.1 + i) > 0;
    pixelRect(ctx, ex, ey, 3, 3, glow ? '#ff0000' : '#cc0000');
    pixelRect(ctx, ex + 1, ey, 1, 1, '#ff6666');
  }
  // Fangs
  pixelRect(ctx, b.x + 12, b.y + 12, 3, 6, '#ffffff');
  pixelRect(ctx, b.x + b.w - 15, b.y + 12, 3, 6, '#ffffff');
  // Legs (8 total, 4 per side)
  for (let i = 0; i < 4; i++) {
    const legAngle = Math.sin(tick * 0.06 + i * 1.5) * 4;
    // Left legs
    pixelRect(ctx, b.x - 10 - i * 4, b.y + 12 + i * 6 + legAngle, 14, 3, '#332244');
    // Right legs
    pixelRect(ctx, b.x + b.w - 4 + i * 4, b.y + 12 + i * 6 - legAngle, 14, 3, '#332244');
  }
  // Web silk
  if (b.phase === 1) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.x + b.w / 2 - 1, b.y + b.h, 2, 30);
    ctx.globalAlpha = 1;
  }
}

function drawJungleHawk(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const wingFlap = Math.sin(tick * 0.15) * 12;
  // Wings
  ctx.fillStyle = '#664422';
  // Left wing
  ctx.beginPath();
  ctx.moveTo(b.x + 4, b.y + 8);
  ctx.lineTo(b.x - 20, b.y - 4 + wingFlap);
  ctx.lineTo(b.x - 16, b.y + 16 + wingFlap * 0.5);
  ctx.lineTo(b.x + 4, b.y + 14);
  ctx.closePath();
  ctx.fill();
  // Right wing
  ctx.beginPath();
  ctx.moveTo(b.x + b.w - 4, b.y + 8);
  ctx.lineTo(b.x + b.w + 20, b.y - 4 + wingFlap);
  ctx.lineTo(b.x + b.w + 16, b.y + 16 + wingFlap * 0.5);
  ctx.lineTo(b.x + b.w - 4, b.y + 14);
  ctx.closePath();
  ctx.fill();
  // Wing tips
  ctx.fillStyle = '#553311';
  ctx.fillRect(b.x - 18, b.y - 2 + wingFlap, 6, 4);
  ctx.fillRect(b.x + b.w + 12, b.y - 2 + wingFlap, 6, 4);
  // Body
  pixelRect(ctx, b.x, b.y + 4, b.w, b.h - 4, '#775533');
  pixelRect(ctx, b.x + 2, b.y + 6, b.w - 4, 4, '#886644');
  // Belly
  pixelRect(ctx, b.x + 6, b.y + 14, b.w - 12, 8, '#ccbb88');
  // Head
  pixelRect(ctx, b.x + 8, b.y - 2, b.w - 16, 10, '#775533');
  // Beak
  pixelRect(ctx, b.x + b.w / 2 - 4, b.y + 6, 8, 6, '#ff8800');
  pixelRect(ctx, b.x + b.w / 2 - 2, b.y + 10, 4, 4, '#cc6600');
  // Eyes (fierce)
  pixelRect(ctx, b.x + 10, b.y, 5, 4, '#ffcc00');
  pixelRect(ctx, b.x + b.w - 15, b.y, 5, 4, '#ffcc00');
  pixelRect(ctx, b.x + 12, b.y + 1, 2, 2, '#111111');
  pixelRect(ctx, b.x + b.w - 14, b.y + 1, 2, 2, '#111111');
  // Talons
  pixelRect(ctx, b.x + 4, b.y + b.h - 2, 4, 6, '#444444');
  pixelRect(ctx, b.x + b.w - 8, b.y + b.h - 2, 4, 6, '#444444');
}

function drawStoneGuardian(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const shake = b.phase === 1 ? Math.sin(tick * 0.4) * 1 : 0;
  // Large stone body
  pixelRect(ctx, b.x + 2 + shake, b.y + 8, b.w - 4, b.h - 8, '#667766');
  pixelRect(ctx, b.x + 4 + shake, b.y + 10, b.w - 8, 4, '#778877');
  // Stone texture cracks
  ctx.strokeStyle = '#445544';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(b.x + 10 + shake, b.y + 14);
  ctx.lineTo(b.x + 20 + shake, b.y + 30);
  ctx.lineTo(b.x + 14 + shake, b.y + 40);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(b.x + b.w - 12 + shake, b.y + 16);
  ctx.lineTo(b.x + b.w - 18 + shake, b.y + 28);
  ctx.stroke();
  ctx.globalAlpha = 1;
  // Moss patches
  pixelRect(ctx, b.x + 6 + shake, b.y + 22, 8, 3, '#447744');
  pixelRect(ctx, b.x + b.w - 16 + shake, b.y + 18, 6, 4, '#447744');
  // Head
  pixelRect(ctx, b.x + 6 + shake, b.y - 2, b.w - 12, 12, '#778877');
  pixelRect(ctx, b.x + 8 + shake, b.y, b.w - 16, 4, '#889988');
  // Glowing rune eyes
  const glow = (Math.sin(tick * 0.08) + 1) * 0.5;
  ctx.globalAlpha = 0.5 + glow * 0.5;
  pixelRect(ctx, b.x + 10 + shake, b.y + 2, 6, 5, '#00ff88');
  pixelRect(ctx, b.x + b.w - 16 + shake, b.y + 2, 6, 5, '#00ff88');
  ctx.globalAlpha = 1;
  // Mouth rune
  pixelRect(ctx, b.x + b.w / 2 - 4 + shake, b.y + 8, 8, 3, '#00cc66');
  // Arms (thick stone)
  pixelRect(ctx, b.x - 8 + shake, b.y + 10, 12, 28, '#667766');
  pixelRect(ctx, b.x + b.w - 4 + shake, b.y + 10, 12, 28, '#667766');
  // Fists
  pixelRect(ctx, b.x - 10 + shake, b.y + 36, 16, 12, '#778877');
  pixelRect(ctx, b.x + b.w - 6 + shake, b.y + 36, 16, 12, '#778877');
}

function drawAncientTreant(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const sway = Math.sin(tick * 0.025) * 3;
  // Roots
  for (let i = 0; i < 5; i++) {
    const rx = b.x + i * 10 - 10;
    const ry = b.y + b.h - 4;
    pixelRect(ctx, rx + sway * 0.3, ry, 6, 8, '#553311');
  }
  // Trunk (body)
  pixelRect(ctx, b.x + 4 + sway, b.y + 10, b.w - 8, b.h - 10, '#664422');
  pixelRect(ctx, b.x + 6 + sway, b.y + 12, b.w - 12, 4, '#775533');
  // Bark texture
  pixelRect(ctx, b.x + 8 + sway, b.y + 20, 3, 12, '#553311');
  pixelRect(ctx, b.x + 16 + sway, b.y + 18, 4, 10, '#553311');
  pixelRect(ctx, b.x + b.w - 14 + sway, b.y + 22, 3, 8, '#553311');
  // Canopy/head (leaves)
  pixelRect(ctx, b.x - 6 + sway, b.y - 8, b.w + 12, 20, '#227722');
  pixelRect(ctx, b.x - 2 + sway, b.y - 12, b.w + 4, 8, '#33aa33');
  pixelRect(ctx, b.x + 6 + sway, b.y - 14, b.w - 12, 4, '#44bb44');
  // Face in trunk
  pixelRect(ctx, b.x + 10 + sway, b.y + 14, 6, 4, '#ffaa00');
  pixelRect(ctx, b.x + b.w - 16 + sway, b.y + 14, 6, 4, '#ffaa00');
  // Angry mouth (hollow)
  pixelRect(ctx, b.x + 12 + sway, b.y + 22, b.w - 24, 6, '#221100');
  // Branch arms
  const armSwing = Math.sin(tick * 0.04) * 6;
  pixelRect(ctx, b.x - 16 + sway, b.y + 6 + armSwing, 20, 6, '#664422');
  pixelRect(ctx, b.x + b.w - 4 + sway, b.y + 6 - armSwing, 20, 6, '#664422');
  // Leaves on branches
  pixelRect(ctx, b.x - 18 + sway, b.y + 2 + armSwing, 8, 6, '#33aa33');
  pixelRect(ctx, b.x + b.w + 10 + sway, b.y + 2 - armSwing, 8, 6, '#33aa33');
  // Glowing mushrooms on trunk
  const mGlow = (Math.sin(tick * 0.07) + 1) * 0.5;
  ctx.globalAlpha = 0.6 + mGlow * 0.4;
  pixelRect(ctx, b.x + 6 + sway, b.y + 30, 4, 3, '#88ff88');
  pixelRect(ctx, b.x + b.w - 10 + sway, b.y + 26, 3, 3, '#88ff88');
  ctx.globalAlpha = 1;
}

export function drawBossName(ctx: CanvasRenderingContext2D, boss: Boss, canvasWidth: number) {
  if (!boss.alive) return;
  const names: Record<BossType, string> = {
    'sand_worm': 'SAND WORM',
    'mummy': 'MUMMY GUARDIAN',
    'sand_golem': 'SAND GOLEM',
    'scorpion_king': 'SCORPION KING',
    'pharaoh': 'THE PHARAOH',
    'poison_frog': 'POISON FROG',
    'spider_queen': 'SPIDER QUEEN',
    'jungle_hawk': 'JUNGLE HAWK',
    'stone_guardian': 'STONE GUARDIAN',
    'ancient_treant': 'ANCIENT TREANT',
  };
  ctx.fillStyle = '#ff4444';
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`⚔ ${names[boss.type]}`, canvasWidth / 2, 40);
  ctx.textAlign = 'left';
}
