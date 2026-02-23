import { Boss, BossType } from './types';

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

export function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss, tick: number) {
  if (!boss.alive) return;
  if (boss.invincible > 0 && tick % 4 < 2) return;

  ctx.save();

  // Boss shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.ellipse(boss.x + boss.w / 2, boss.y + boss.h + 2, boss.w * 0.6, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Hit flash effect
  if (boss.invincible > 0) {
    ctx.globalAlpha = 0.7;
  }

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

  ctx.globalAlpha = 1;
  drawBossHP(ctx, boss);
  ctx.restore();
}

function drawBossHP(ctx: CanvasRenderingContext2D, boss: Boss) {
  const barW = boss.w + 24;
  const barH = 8;
  const bx = boss.x - 12;
  const by = boss.y - 24;
  const hpRatio = boss.hp / boss.maxHp;

  // Background with border
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.7;
  ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);
  ctx.globalAlpha = 1;

  // HP gradient fill
  const hpGrad = ctx.createLinearGradient(bx, by, bx + barW * hpRatio, by);
  if (hpRatio > 0.5) {
    hpGrad.addColorStop(0, '#22cc22');
    hpGrad.addColorStop(1, '#44ee44');
  } else if (hpRatio > 0.25) {
    hpGrad.addColorStop(0, '#ccaa00');
    hpGrad.addColorStop(1, '#eecc22');
  } else {
    hpGrad.addColorStop(0, '#cc2222');
    hpGrad.addColorStop(1, '#ee4444');
  }
  ctx.fillStyle = hpGrad;
  ctx.fillRect(bx, by, barW * hpRatio, barH);

  // Shine on HP bar
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.15;
  ctx.fillRect(bx, by, barW * hpRatio, barH / 2);
  ctx.globalAlpha = 1;

  // Notch marks
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.3;
  for (let i = 1; i < boss.maxHp; i++) {
    const nx = bx + (barW / boss.maxHp) * i;
    ctx.fillRect(nx, by, 1, barH);
  }
  ctx.globalAlpha = 1;

  // Border
  ctx.strokeStyle = '#aaaaaa';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx - 0.5, by - 0.5, barW + 1, barH + 1);
}

// ===== DESERT BOSSES =====

function drawSandWorm(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const wave = Math.sin(tick * 0.05) * 4;

  // Dust cloud around worm
  drawGlow(ctx, b.x + b.w / 2, b.y + b.h, b.w, '#c8964a', 0.06);

  // Body segments with gradient shading
  for (let i = 4; i >= 0; i--) {
    const sx = b.x + i * 8 - 16;
    const sy = b.y + 10 + Math.sin(tick * 0.08 + i * 0.8) * 6;
    const segW = 12 - i;
    const segGrad = ctx.createLinearGradient(sx, sy, sx + segW, sy + segW);
    segGrad.addColorStop(0, '#ddbb55');
    segGrad.addColorStop(0.5, '#cc9944');
    segGrad.addColorStop(1, '#aa7733');
    ctx.fillStyle = segGrad;
    ctx.fillRect(sx, sy, segW, segW);
    // Segment ring
    pixelRect(ctx, sx + 1, sy, segW - 2, 1, '#eedd77');
    pixelRect(ctx, sx + 1, sy + segW - 1, segW - 2, 1, '#886622');
  }

  // Head with gradient
  const headGrad = ctx.createLinearGradient(b.x, b.y + wave, b.x + b.w, b.y + wave + b.h * 0.7);
  headGrad.addColorStop(0, '#eebb55');
  headGrad.addColorStop(0.5, '#ddaa44');
  headGrad.addColorStop(1, '#bb8833');
  ctx.fillStyle = headGrad;
  ctx.fillRect(b.x, b.y + wave, b.w, b.h * 0.7);
  // Head highlight
  pixelRect(ctx, b.x + 2, b.y + wave + 1, b.w - 4, 2, '#ffdd88');

  // Mandibles with shading
  pixelRect(ctx, b.x - 6, b.y + wave + b.h * 0.3, 8, 10, '#aa7722');
  pixelRect(ctx, b.x - 5, b.y + wave + b.h * 0.3, 2, 10, '#cc9944');
  pixelRect(ctx, b.x + b.w - 2, b.y + wave + b.h * 0.3, 8, 10, '#aa7722');
  pixelRect(ctx, b.x + b.w + 3, b.y + wave + b.h * 0.3, 2, 10, '#886611');

  // Eyes with menacing glow
  const eyePulse = (Math.sin(tick * 0.12) + 1) * 0.5;
  drawGlow(ctx, b.x + 9, b.y + wave + 6, 8, '#ff2200', eyePulse * 0.2);
  drawGlow(ctx, b.x + b.w - 9, b.y + wave + 6, 8, '#ff2200', eyePulse * 0.2);
  pixelRect(ctx, b.x + 6, b.y + wave + 4, 6, 4, '#ff3300');
  pixelRect(ctx, b.x + b.w - 12, b.y + wave + 4, 6, 4, '#ff3300');
  pixelRect(ctx, b.x + 8, b.y + wave + 5, 2, 2, '#ffaa00');
  pixelRect(ctx, b.x + b.w - 10, b.y + wave + 5, 2, 2, '#ffaa00');

  // Teeth with depth
  for (let i = 0; i < 4; i++) {
    const tx = b.x + 4 + i * 8;
    pixelRect(ctx, tx, b.y + wave + b.h * 0.6, 4, 7, '#ffffff');
    pixelRect(ctx, tx + 1, b.y + wave + b.h * 0.6, 1, 7, '#eeeedd');
    pixelRect(ctx, tx, b.y + wave + b.h * 0.6 + 5, 4, 2, '#ddddcc');
  }
}

function drawMummy(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const sway = Math.sin(tick * 0.03) * 2;

  // Eerie aura
  drawGlow(ctx, b.x + b.w / 2, b.y + b.h / 2, b.w * 0.8, '#00ff88', 0.04);

  // Body with gradient
  const bodyGrad = ctx.createLinearGradient(b.x + 4, b.y + 12, b.x + b.w - 4, b.y + b.h);
  bodyGrad.addColorStop(0, '#ddccaa');
  bodyGrad.addColorStop(1, '#aa9977');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(b.x + 4, b.y + 12, b.w - 8, b.h - 12);

  // Bandage wrapping with depth
  for (let i = 0; i < 6; i++) {
    const bx = b.x + 4 + (i % 2) * 4;
    pixelRect(ctx, bx, b.y + 14 + i * 6, b.w - 12, 2, '#eeddbb');
    pixelRect(ctx, bx, b.y + 15 + i * 6, b.w - 12, 1, '#ccbbaa');
  }

  // Head with worn bandage texture
  const headGrad = ctx.createLinearGradient(b.x + 6, b.y, b.x + b.w - 6, b.y + 14);
  headGrad.addColorStop(0, '#ddccaa');
  headGrad.addColorStop(1, '#bbaa88');
  ctx.fillStyle = headGrad;
  ctx.fillRect(b.x + 6, b.y, b.w - 12, 14);

  // Glowing hieroglyph eyes
  const eyeGlow = (Math.sin(tick * 0.1) + 1) * 0.5;
  drawGlow(ctx, b.x + 12, b.y + 7, 8, '#00ff88', eyeGlow * 0.2);
  drawGlow(ctx, b.x + b.w - 13, b.y + 7, 8, '#00ff88', eyeGlow * 0.2);
  pixelRect(ctx, b.x + 10, b.y + 5, 5, 4, '#00ff88');
  pixelRect(ctx, b.x + b.w - 15, b.y + 5, 5, 4, '#00ff88');
  // Eye slit pupils
  pixelRect(ctx, b.x + 12, b.y + 6, 1, 2, '#ffffff');
  pixelRect(ctx, b.x + b.w - 13, b.y + 6, 1, 2, '#ffffff');

  // Dangling bandages with sway
  ctx.fillStyle = '#ccbb88';
  ctx.fillRect(b.x + 2 + sway, b.y + 20, 3, 14);
  ctx.fillRect(b.x + b.w - 5 - sway, b.y + 18, 3, 16);
  // Frayed ends
  ctx.fillStyle = '#bbaa77';
  ctx.fillRect(b.x + 1 + sway, b.y + 32, 2, 4);
  ctx.fillRect(b.x + 4 + sway, b.y + 33, 2, 3);
  ctx.fillRect(b.x + b.w - 6 - sway, b.y + 32, 2, 4);

  // Arms with bandage wrapping
  pixelRect(ctx, b.x - 4, b.y + 16, 8, 22, '#bbaa77');
  pixelRect(ctx, b.x + b.w - 4, b.y + 16, 8, 22, '#bbaa77');
  pixelRect(ctx, b.x - 3, b.y + 18, 6, 2, '#ddccaa');
  pixelRect(ctx, b.x + b.w - 3, b.y + 20, 6, 2, '#ddccaa');
  // Clawed fingers
  pixelRect(ctx, b.x - 5, b.y + 36, 3, 4, '#998866');
  pixelRect(ctx, b.x - 2, b.y + 37, 3, 3, '#998866');
  pixelRect(ctx, b.x + b.w - 1, b.y + 36, 3, 4, '#998866');
  pixelRect(ctx, b.x + b.w + 2, b.y + 37, 3, 3, '#998866');

  // Scarab amulet on chest
  pixelRect(ctx, b.x + b.w / 2 - 3, b.y + 16, 6, 4, '#44aa88');
  pixelRect(ctx, b.x + b.w / 2 - 2, b.y + 17, 4, 2, '#66ccaa');
}

function drawSandGolem(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const shake = b.phase === 1 ? Math.sin(tick * 0.3) * 2 : 0;

  // Ground impact dust when enraged
  if (b.phase === 1) {
    drawGlow(ctx, b.x + b.w / 2 + shake, b.y + b.h, b.w, '#c8964a', 0.08);
  }

  // Massive body with stone gradient
  const bodyGrad = ctx.createLinearGradient(b.x + shake, b.y + 10, b.x + b.w + shake, b.y + b.h);
  bodyGrad.addColorStop(0, '#bb9944');
  bodyGrad.addColorStop(0.5, '#aa8833');
  bodyGrad.addColorStop(1, '#886622');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(b.x + shake, b.y + 10, b.w, b.h - 10);

  // Rock cracks and texture
  ctx.strokeStyle = '#775522';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(b.x + 8 + shake, b.y + 14);
  ctx.lineTo(b.x + 16 + shake, b.y + 28);
  ctx.lineTo(b.x + 12 + shake, b.y + 42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(b.x + b.w - 10 + shake, b.y + 16);
  ctx.lineTo(b.x + b.w - 16 + shake, b.y + 32);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Stone texture spots
  for (let i = 0; i < 6; i++) {
    pixelRect(ctx, b.x + shake + 5 + i * 8, b.y + 18 + (i % 3) * 10, 5, 3, adjustColor('#aa8833', -15 + (i % 2) * 20));
  }

  // Head
  const headGrad = ctx.createLinearGradient(b.x + shake + 8, b.y, b.x + b.w - 8 + shake, b.y + 14);
  headGrad.addColorStop(0, '#ccaa55');
  headGrad.addColorStop(1, '#aa8833');
  ctx.fillStyle = headGrad;
  ctx.fillRect(b.x + shake + 8, b.y, b.w - 16, 14);

  // Angry eyes with fire glow
  const enraged = b.phase === 1;
  const eyeColor = enraged ? '#ff2200' : '#ff6600';
  drawGlow(ctx, b.x + shake + 15, b.y + 6, 8, eyeColor, 0.2);
  drawGlow(ctx, b.x + shake + b.w - 15, b.y + 6, 8, eyeColor, 0.2);
  pixelRect(ctx, b.x + shake + 12, b.y + 4, 6, 5, eyeColor);
  pixelRect(ctx, b.x + shake + b.w - 18, b.y + 4, 6, 5, eyeColor);
  // Pupils
  pixelRect(ctx, b.x + shake + 14, b.y + 5, 2, 3, '#ffcc00');
  pixelRect(ctx, b.x + shake + b.w - 16, b.y + 5, 2, 3, '#ffcc00');

  // Mouth crack with glow
  pixelRect(ctx, b.x + shake + 14, b.y + 10, b.w - 28, 3, '#442200');
  if (enraged) {
    drawGlow(ctx, b.x + shake + b.w / 2, b.y + 11, 12, '#ff6600', 0.1);
  }

  // Massive arms with gradient
  for (const side of [-1, 1]) {
    const ax = side === -1 ? b.x + shake - 10 : b.x + shake + b.w - 2;
    const armGrad = ctx.createLinearGradient(ax, b.y + 14, ax + 12, b.y + 38);
    armGrad.addColorStop(0, '#aa8833');
    armGrad.addColorStop(1, '#886622');
    ctx.fillStyle = armGrad;
    ctx.fillRect(ax, b.y + 14, 12, 24);
    // Fists
    pixelRect(ctx, ax - 1, b.y + 36, 14, 12, '#bb9944');
    pixelRect(ctx, ax, b.y + 36, 12, 2, '#ccaa55');
  }
}

function drawScorpionKing(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  // Body with chitinous gradient
  const bodyGrad = ctx.createLinearGradient(b.x, b.y + 8, b.x + b.w, b.y + b.h);
  bodyGrad.addColorStop(0, '#993322');
  bodyGrad.addColorStop(0.5, '#882211');
  bodyGrad.addColorStop(1, '#771100');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(b.x, b.y + 8, b.w, b.h - 8);

  // Shell segments with shine
  for (let i = 0; i < 3; i++) {
    pixelRect(ctx, b.x + 4 + i * 12, b.y + 10, 10, 2, '#aa4433');
    pixelRect(ctx, b.x + 4 + i * 12, b.y + 12, 10, 1, '#773311');
  }

  // Pincers with 3D effect
  for (const side of [-1, 1]) {
    const px = side === -1 ? b.x - 8 : b.x + b.w;
    pixelRect(ctx, px, b.y + 10, 12, 8, '#aa3322');
    pixelRect(ctx, px + 1, b.y + 10, 10, 2, '#cc5544');
    // Claw tips
    pixelRect(ctx, px - 2, b.y + 6, 8, 6, '#bb4433');
    pixelRect(ctx, px - 2, b.y + 16, 8, 6, '#bb4433');
    // Claw highlight
    pixelRect(ctx, px, b.y + 7, 4, 1, '#dd6655');
  }

  // Tail segments curving up with poison glow
  const tailPhase = Math.sin(tick * 0.06) * 8;
  for (let i = 0; i < 5; i++) {
    const tx = b.x + b.w / 2 - 4;
    const ty = b.y - i * 6 + tailPhase * (i / 5);
    const tailGrad = ctx.createLinearGradient(tx, ty, tx + 8, ty + 6);
    tailGrad.addColorStop(0, '#993322');
    tailGrad.addColorStop(1, '#772211');
    ctx.fillStyle = tailGrad;
    ctx.fillRect(tx, ty, 8, 6);
    pixelRect(ctx, tx + 1, ty, 6, 1, '#aa4433');
  }

  // Stinger with poison drip glow
  const stingerY = b.y - 28 + tailPhase;
  pixelRect(ctx, b.x + b.w / 2 - 3, stingerY, 6, 8, '#44bb22');
  pixelRect(ctx, b.x + b.w / 2 - 2, stingerY, 4, 2, '#66dd44');
  drawGlow(ctx, b.x + b.w / 2, stingerY + 8, 6, '#44ff22', 0.15);
  // Drip
  if (tick % 40 < 20) {
    const dripLen = (tick % 40) * 0.5;
    ctx.fillStyle = '#44ff22';
    ctx.globalAlpha = 1 - dripLen / 10;
    ctx.fillRect(b.x + b.w / 2 - 1, stingerY + 8 + dripLen, 2, 3);
    ctx.globalAlpha = 1;
  }

  // Eyes with predatory glow
  drawGlow(ctx, b.x + 6, b.y + 5, 5, '#ff8800', 0.2);
  drawGlow(ctx, b.x + b.w - 6, b.y + 5, 5, '#ff8800', 0.2);
  pixelRect(ctx, b.x + 4, b.y + 4, 4, 3, '#ff8800');
  pixelRect(ctx, b.x + b.w - 8, b.y + 4, 4, 3, '#ff8800');

  // Legs with joints
  for (let i = 0; i < 4; i++) {
    const legSway = Math.sin(tick * 0.06 + i * 1.2) * 2;
    pixelRect(ctx, b.x + 4 + i * 10, b.y + b.h - 4 + legSway, 3, 7, '#882211');
    pixelRect(ctx, b.x + 4 + i * 10, b.y + b.h - 1 + legSway, 4, 2, '#771100');
  }
}

function drawPharaoh(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const float = Math.sin(tick * 0.04) * 4;

  // Divine aura
  drawGlow(ctx, b.x + b.w / 2, b.y + b.h / 2 + float, b.w * 0.9, '#ffcc00', 0.06);
  // Rotating aura particles
  for (let i = 0; i < 4; i++) {
    const angle = tick * 0.02 + (i / 4) * Math.PI * 2;
    const ax = b.x + b.w / 2 + Math.cos(angle) * b.w * 0.5;
    const ay = b.y + b.h / 2 + float + Math.sin(angle) * b.h * 0.4;
    ctx.fillStyle = '#ffcc00';
    ctx.globalAlpha = 0.15;
    ctx.fillRect(ax - 1, ay - 1, 3, 3);
    ctx.globalAlpha = 1;
  }

  // Royal robe body
  const robeGrad = ctx.createLinearGradient(b.x + 4, b.y + 16 + float, b.x + b.w - 4, b.y + b.h + float);
  robeGrad.addColorStop(0, '#3344bb');
  robeGrad.addColorStop(0.5, '#2233aa');
  robeGrad.addColorStop(1, '#112288');
  ctx.fillStyle = robeGrad;
  ctx.fillRect(b.x + 4, b.y + 16 + float, b.w - 8, b.h - 20);

  // Gold trim with emboss
  pixelRect(ctx, b.x + 4, b.y + 16 + float, b.w - 8, 2, '#ffcc00');
  pixelRect(ctx, b.x + 4, b.y + 17 + float, b.w - 8, 1, '#ffdd44');
  pixelRect(ctx, b.x + 4, b.y + b.h - 6 + float, b.w - 8, 2, '#ffcc00');

  // Hieroglyph decorations on robe
  ctx.fillStyle = '#4466cc';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(b.x + 10 + i * 10, b.y + 24 + float, 4, 6);
    ctx.fillRect(b.x + 8 + i * 10, b.y + 26 + float, 8, 2);
  }

  // Golden death mask
  const maskGrad = ctx.createLinearGradient(b.x + 6, b.y + float, b.x + b.w - 6, b.y + 18 + float);
  maskGrad.addColorStop(0, '#ffdd44');
  maskGrad.addColorStop(0.5, '#ffcc00');
  maskGrad.addColorStop(1, '#ddaa00');
  ctx.fillStyle = maskGrad;
  ctx.fillRect(b.x + 6, b.y + float, b.w - 12, 18);
  // Mask detail - nose
  pixelRect(ctx, b.x + b.w / 2 - 2, b.y + 10 + float, 4, 4, '#ddaa00');

  // Nemes headdress
  const nemeGrad = ctx.createLinearGradient(b.x, b.y - 4 + float, b.x + b.w, b.y + 6 + float);
  nemeGrad.addColorStop(0, '#2233aa');
  nemeGrad.addColorStop(0.5, '#3355cc');
  nemeGrad.addColorStop(1, '#2233aa');
  ctx.fillStyle = nemeGrad;
  ctx.fillRect(b.x, b.y - 4 + float, b.w, 6);
  // Gold stripes on headdress
  pixelRect(ctx, b.x + 2, b.y - 3 + float, b.w - 4, 1, '#ffcc00');
  pixelRect(ctx, b.x + 2, b.y + float, b.w - 4, 1, '#ffcc00');

  // Cobra uraeus on forehead
  pixelRect(ctx, b.x + b.w / 2 - 2, b.y - 8 + float, 4, 6, '#ffcc00');
  pixelRect(ctx, b.x + b.w / 2 - 3, b.y - 10 + float, 6, 3, '#44cc44');
  // Cobra eyes
  pixelRect(ctx, b.x + b.w / 2 - 2, b.y - 9 + float, 1, 1, '#ff0000');
  pixelRect(ctx, b.x + b.w / 2 + 1, b.y - 9 + float, 1, 1, '#ff0000');

  // Eyes - mystical power
  const laserGlow = b.phase === 1;
  const eyeColor = laserGlow ? '#ff0000' : '#00ddff';
  drawGlow(ctx, b.x + 13, b.y + 9 + float, 8, eyeColor, 0.25);
  drawGlow(ctx, b.x + b.w - 13, b.y + 9 + float, 8, eyeColor, 0.25);
  pixelRect(ctx, b.x + 10, b.y + 7 + float, 6, 4, eyeColor);
  pixelRect(ctx, b.x + b.w - 16, b.y + 7 + float, 6, 4, eyeColor);

  // Was-scepter staff
  pixelRect(ctx, b.x - 6, b.y + 4 + float, 3, 42, '#ffcc00');
  pixelRect(ctx, b.x - 5, b.y + 4 + float, 1, 42, '#ffdd66');
  // Ankh on top
  ctx.strokeStyle = '#ffcc00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(b.x - 5, b.y - 2 + float, 4, 0, Math.PI * 2);
  ctx.stroke();
  pixelRect(ctx, b.x - 6, b.y + 2 + float, 3, 4, '#ffcc00');
  pixelRect(ctx, b.x - 8, b.y + 3 + float, 7, 2, '#ffcc00');

  // Jewel on staff top
  drawGlow(ctx, b.x - 5, b.y - 2 + float, 5, '#ff4488', 0.2);
  pixelRect(ctx, b.x - 6, b.y - 3 + float, 3, 3, '#ff4488');
}

// ===== JUNGLE BOSSES =====

function drawPoisonFrog(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const breathe = Math.sin(tick * 0.06) * 2;

  // Poison puddle beneath
  drawGlow(ctx, b.x + b.w / 2, b.y + b.h + 2, b.w * 0.6, '#44ff00', 0.08);

  // Body with gradient
  const bodyGrad = ctx.createLinearGradient(b.x, b.y + 10, b.x + b.w, b.y + b.h + breathe);
  bodyGrad.addColorStop(0, '#33cc33');
  bodyGrad.addColorStop(0.5, '#22aa22');
  bodyGrad.addColorStop(1, '#118811');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(b.x + 2, b.y + 10, b.w - 4, b.h - 10 + breathe);
  // Belly
  pixelRect(ctx, b.x + 6, b.y + b.h - 8 + breathe, b.w - 12, 6, '#44cc44');

  // Warning spots with glow
  const spots = [[8, 16, 5, '#ffaa00'], [20, 20, 4, '#ff8800'], [b.w - 14, 15, 4, '#ff6600']];
  for (const [sx, sy, sr, sc] of spots) {
    drawGlow(ctx, b.x + (sx as number), b.y + (sy as number), (sr as number) * 2, sc as string, 0.08);
    pixelRect(ctx, b.x + (sx as number) - 2, b.y + (sy as number) - 2, (sr as number), (sr as number), sc as string);
  }

  // Head dome
  const headGrad = ctx.createRadialGradient(b.x + b.w / 2, b.y + 4, 0, b.x + b.w / 2, b.y + 4, b.w / 2);
  headGrad.addColorStop(0, '#44dd44');
  headGrad.addColorStop(1, '#22aa22');
  ctx.fillStyle = headGrad;
  ctx.fillRect(b.x + 4, b.y, b.w - 8, 12);

  // Bulging eyes with realistic detail
  for (const side of [-1, 1]) {
    const ex = side === -1 ? b.x + 2 : b.x + b.w - 12;
    // Eyeball
    ctx.fillStyle = '#55ee55';
    ctx.beginPath();
    ctx.arc(ex + 5, b.y, 5, 0, Math.PI * 2);
    ctx.fill();
    // Iris
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(ex + 5, b.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Pupil slit
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(ex + 4, b.y - 2, 2, 4);
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(ex + 3, b.y - 2, 1, 1);
    ctx.globalAlpha = 1;
  }

  // Tongue attack
  if (b.phase === 1) {
    const tongueLen = 20 + Math.sin(tick * 0.15) * 8;
    ctx.fillStyle = '#ff3366';
    ctx.fillRect(b.x + b.w / 2 - 1, b.y + 10, 2, tongueLen);
    // Tongue tip (forked)
    pixelRect(ctx, b.x + b.w / 2 - 3, b.y + 10 + tongueLen, 3, 3, '#ff3366');
    pixelRect(ctx, b.x + b.w / 2, b.y + 10 + tongueLen, 3, 3, '#ff3366');
  }

  // Powerful legs with muscles
  for (const side of [-1, 1]) {
    const lx = side === -1 ? b.x - 4 : b.x + b.w - 4;
    pixelRect(ctx, lx, b.y + b.h - 10, 10, 10, '#229922');
    pixelRect(ctx, lx + 1, b.y + b.h - 10, 8, 2, '#33bb33');
    // Webbed feet
    pixelRect(ctx, lx - 3, b.y + b.h - 2, 16, 4, '#228822');
    pixelRect(ctx, lx - 2, b.y + b.h - 1, 5, 1, '#33aa33');
    pixelRect(ctx, lx + 5, b.y + b.h - 1, 5, 1, '#33aa33');
  }
}

function drawSpiderQueen(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  // Web aura
  if (b.phase === 1) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + tick * 0.005;
      ctx.beginPath();
      ctx.moveTo(b.x + b.w / 2, b.y + b.h / 2);
      ctx.lineTo(b.x + b.w / 2 + Math.cos(angle) * 50, b.y + b.h / 2 + Math.sin(angle) * 40);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Abdomen with pattern gradient
  const abdGrad = ctx.createRadialGradient(b.x + b.w / 2, b.y + b.h / 2 + 6, 0, b.x + b.w / 2, b.y + b.h / 2 + 6, b.w * 0.6);
  abdGrad.addColorStop(0, '#443355');
  abdGrad.addColorStop(1, '#221133');
  ctx.fillStyle = abdGrad;
  ctx.fillRect(b.x - 6, b.y + 12, b.w + 12, b.h - 8);

  // Hourglass pattern
  ctx.fillStyle = '#ff2244';
  ctx.beginPath();
  ctx.moveTo(b.x + b.w / 2 - 4, b.y + 16);
  ctx.lineTo(b.x + b.w / 2, b.y + 22);
  ctx.lineTo(b.x + b.w / 2 + 4, b.y + 16);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(b.x + b.w / 2 - 4, b.y + 28);
  ctx.lineTo(b.x + b.w / 2, b.y + 22);
  ctx.lineTo(b.x + b.w / 2 + 4, b.y + 28);
  ctx.closePath();
  ctx.fill();

  // Eye cluster markings
  pixelRect(ctx, b.x + 8, b.y + 18, 4, 4, '#ff2244');
  pixelRect(ctx, b.x + b.w - 12, b.y + 18, 4, 4, '#ff2244');

  // Head/thorax
  const headGrad = ctx.createLinearGradient(b.x + 6, b.y, b.x + b.w - 6, b.y + 14);
  headGrad.addColorStop(0, '#554466');
  headGrad.addColorStop(1, '#332244');
  ctx.fillStyle = headGrad;
  ctx.fillRect(b.x + 6, b.y, b.w - 12, 14);

  // 8 eyes with individual glow
  for (let i = 0; i < 4; i++) {
    const ex = b.x + 10 + i * 6;
    const ey = b.y + 3 + (i % 2) * 3;
    const glow = (Math.sin(tick * 0.1 + i * 0.8) + 1) * 0.5;
    drawGlow(ctx, ex + 1, ey + 1, 4, '#ff0000', glow * 0.15);
    pixelRect(ctx, ex, ey, 3, 3, glow > 0.5 ? '#ff2200' : '#cc0000');
    pixelRect(ctx, ex + 1, ey, 1, 1, '#ff8888');
  }

  // Fangs with venom
  pixelRect(ctx, b.x + 12, b.y + 12, 3, 7, '#eeeedd');
  pixelRect(ctx, b.x + b.w - 15, b.y + 12, 3, 7, '#eeeedd');
  // Venom drip
  ctx.fillStyle = '#44ff44';
  ctx.globalAlpha = 0.5;
  ctx.fillRect(b.x + 13, b.y + 18, 1, 3);
  ctx.fillRect(b.x + b.w - 14, b.y + 18, 1, 3);
  ctx.globalAlpha = 1;

  // Articulated legs
  for (let i = 0; i < 4; i++) {
    const legAngle = Math.sin(tick * 0.06 + i * 1.5) * 5;
    const jointY = b.y + 14 + i * 6;
    for (const side of [-1, 1]) {
      const baseX = side === -1 ? b.x : b.x + b.w;
      // Upper leg
      ctx.strokeStyle = '#443355';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(baseX, jointY);
      ctx.lineTo(baseX + side * (10 + i * 3), jointY - 4 + legAngle * side);
      ctx.stroke();
      // Lower leg
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(baseX + side * (10 + i * 3), jointY - 4 + legAngle * side);
      ctx.lineTo(baseX + side * (16 + i * 4), jointY + 4 + legAngle * side);
      ctx.stroke();
      // Foot claw
      pixelRect(ctx, baseX + side * (16 + i * 4) - 1, jointY + 3 + legAngle * side, 3, 2, '#332244');
    }
  }

  // Web silk trail
  if (b.phase === 1) {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(b.x + b.w / 2 - 1, b.y + b.h, 2, 30);
    ctx.globalAlpha = 1;
  }
}

function drawJungleHawk(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const wingFlap = Math.sin(tick * 0.15) * 14;

  // Wind effect
  if (Math.abs(wingFlap) > 10) {
    drawGlow(ctx, b.x + b.w / 2, b.y + b.h + 10, b.w, '#886644', 0.04);
  }

  // Wings with feather detail
  for (const side of [-1, 1]) {
    const wingX = side === -1 ? b.x + 4 : b.x + b.w - 4;
    const wingTip = wingX + side * 24;
    const tipY = b.y - 6 + wingFlap;

    // Primary feathers gradient
    const wingGrad = ctx.createLinearGradient(wingX, b.y + 8, wingTip, tipY);
    wingGrad.addColorStop(0, '#886644');
    wingGrad.addColorStop(0.7, '#664422');
    wingGrad.addColorStop(1, '#443311');
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.moveTo(wingX, b.y + 8);
    ctx.lineTo(wingTip - side * 4, tipY);
    ctx.lineTo(wingTip, tipY + 4);
    ctx.lineTo(wingTip + side * 2, b.y + 16 + wingFlap * 0.5);
    ctx.lineTo(wingX, b.y + 16);
    ctx.closePath();
    ctx.fill();

    // Wing feather lines
    ctx.strokeStyle = '#775533';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    for (let f = 0; f < 3; f++) {
      const fy = b.y + 10 + f * 3;
      ctx.beginPath();
      ctx.moveTo(wingX, fy);
      ctx.lineTo(wingTip - side * (f * 4), tipY + f * 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // Body with feather gradient
  const bodyGrad = ctx.createLinearGradient(b.x, b.y + 4, b.x + b.w, b.y + b.h);
  bodyGrad.addColorStop(0, '#886644');
  bodyGrad.addColorStop(0.5, '#775533');
  bodyGrad.addColorStop(1, '#664422');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(b.x, b.y + 4, b.w, b.h - 4);

  // Breast feathers
  const bellyGrad = ctx.createLinearGradient(b.x + 6, b.y + 14, b.x + b.w - 6, b.y + 22);
  bellyGrad.addColorStop(0, '#ddcc99');
  bellyGrad.addColorStop(1, '#ccbb88');
  ctx.fillStyle = bellyGrad;
  ctx.fillRect(b.x + 6, b.y + 14, b.w - 12, 8);
  // Feather pattern
  for (let i = 0; i < 3; i++) {
    pixelRect(ctx, b.x + 8 + i * 10, b.y + 16, 6, 1, '#bbaa77');
  }

  // Head
  pixelRect(ctx, b.x + 8, b.y - 2, b.w - 16, 10, '#775533');
  pixelRect(ctx, b.x + 9, b.y - 1, b.w - 18, 3, '#886644');

  // Beak with gradient
  const beakGrad = ctx.createLinearGradient(b.x + b.w / 2 - 4, b.y + 6, b.x + b.w / 2 + 4, b.y + 12);
  beakGrad.addColorStop(0, '#ffaa00');
  beakGrad.addColorStop(1, '#cc7700');
  ctx.fillStyle = beakGrad;
  ctx.fillRect(b.x + b.w / 2 - 4, b.y + 6, 8, 6);
  pixelRect(ctx, b.x + b.w / 2 - 2, b.y + 10, 4, 4, '#cc6600');

  // Fierce eyes with hunter's gaze
  for (const side of [-1, 1]) {
    const ex = side === -1 ? b.x + 10 : b.x + b.w - 15;
    drawGlow(ctx, ex + 2.5, b.y + 2, 5, '#ffcc00', 0.15);
    pixelRect(ctx, ex, b.y, 5, 4, '#ffcc00');
    pixelRect(ctx, ex + 2, b.y + 1, 2, 2, '#111111');
    // Brow
    pixelRect(ctx, ex - 1, b.y - 1, 7, 1, '#553311');
  }

  // Talons with detail
  for (const side of [-1, 1]) {
    const tx = side === -1 ? b.x + 4 : b.x + b.w - 8;
    pixelRect(ctx, tx, b.y + b.h - 2, 6, 6, '#555555');
    pixelRect(ctx, tx - 1, b.y + b.h + 2, 3, 3, '#333333');
    pixelRect(ctx, tx + 4, b.y + b.h + 2, 3, 3, '#333333');
  }
}

function drawStoneGuardian(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const shake = b.phase === 1 ? Math.sin(tick * 0.4) * 1 : 0;

  // Mystical ground runes when enraged
  if (b.phase === 1) {
    const runeAlpha = (Math.sin(tick * 0.06) + 1) * 0.5;
    drawGlow(ctx, b.x + b.w / 2 + shake, b.y + b.h + 4, b.w * 0.7, '#00ff88', runeAlpha * 0.1);
  }

  // Stone body with geological gradient
  const bodyGrad = ctx.createLinearGradient(b.x + 2 + shake, b.y + 8, b.x + b.w - 2 + shake, b.y + b.h);
  bodyGrad.addColorStop(0, '#889988');
  bodyGrad.addColorStop(0.3, '#778877');
  bodyGrad.addColorStop(1, '#556655');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(b.x + 2 + shake, b.y + 8, b.w - 4, b.h - 8);

  // Deep crack details
  ctx.strokeStyle = '#445544';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(b.x + 10 + shake, b.y + 14);
  ctx.lineTo(b.x + 18 + shake, b.y + 26);
  ctx.lineTo(b.x + 14 + shake, b.y + 38);
  ctx.lineTo(b.x + 16 + shake, b.y + 44);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(b.x + b.w - 12 + shake, b.y + 16);
  ctx.lineTo(b.x + b.w - 20 + shake, b.y + 30);
  ctx.lineTo(b.x + b.w - 16 + shake, b.y + 40);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Moss with gradient
  const mossGrad = ctx.createLinearGradient(0, b.y + 20, 0, b.y + 26);
  mossGrad.addColorStop(0, '#558844');
  mossGrad.addColorStop(1, '#336633');
  ctx.fillStyle = mossGrad;
  ctx.fillRect(b.x + 4 + shake, b.y + 20, 10, 4);
  ctx.fillRect(b.x + b.w - 16 + shake, b.y + 16, 8, 5);
  ctx.fillRect(b.x + b.w / 2 - 4 + shake, b.y + 28, 8, 3);

  // Stone head
  const headGrad = ctx.createLinearGradient(b.x + 6 + shake, b.y - 2, b.x + b.w - 6 + shake, b.y + 12);
  headGrad.addColorStop(0, '#99aa99');
  headGrad.addColorStop(1, '#778877');
  ctx.fillStyle = headGrad;
  ctx.fillRect(b.x + 6 + shake, b.y - 2, b.w - 12, 12);

  // Ancient rune eyes with power glow
  const runeGlow = (Math.sin(tick * 0.08) + 1) * 0.5;
  for (const side of [-1, 1]) {
    const ex = side === -1 ? b.x + 10 + shake : b.x + b.w - 16 + shake;
    drawGlow(ctx, ex + 3, b.y + 4, 10, '#00ff88', runeGlow * 0.25);
    pixelRect(ctx, ex, b.y + 2, 6, 5, '#00ff88');
    // Inner rune symbol
    pixelRect(ctx, ex + 2, b.y + 3, 2, 3, '#88ffbb');
  }

  // Mouth rune
  const mouthGlow = (Math.sin(tick * 0.06 + 1) + 1) * 0.5;
  drawGlow(ctx, b.x + b.w / 2 + shake, b.y + 10, 8, '#00cc66', mouthGlow * 0.15);
  pixelRect(ctx, b.x + b.w / 2 - 4 + shake, b.y + 8, 8, 3, '#00cc66');

  // Heavy stone arms
  for (const side of [-1, 1]) {
    const ax = side === -1 ? b.x - 10 + shake : b.x + b.w - 4 + shake;
    const armGrad = ctx.createLinearGradient(ax, b.y + 10, ax + 14, b.y + 38);
    armGrad.addColorStop(0, '#778877');
    armGrad.addColorStop(1, '#556655');
    ctx.fillStyle = armGrad;
    ctx.fillRect(ax, b.y + 10, 14, 28);
    // Moss on arms
    pixelRect(ctx, ax + 2, b.y + 16, 6, 3, '#447744');
    // Fists
    pixelRect(ctx, ax - 1, b.y + 36, 16, 12, '#889988');
    pixelRect(ctx, ax, b.y + 36, 14, 2, '#99aa99');
    // Knuckle detail
    pixelRect(ctx, ax + 2, b.y + 40, 3, 3, '#778877');
    pixelRect(ctx, ax + 7, b.y + 40, 3, 3, '#778877');
  }
}

function drawAncientTreant(ctx: CanvasRenderingContext2D, b: Boss, tick: number) {
  const sway = Math.sin(tick * 0.025) * 3;

  // Root system with depth
  for (let i = 0; i < 6; i++) {
    const rx = b.x + i * 8 - 12 + sway * 0.2;
    const ry = b.y + b.h - 4;
    const rootGrad = ctx.createLinearGradient(rx, ry, rx + 6, ry + 10);
    rootGrad.addColorStop(0, '#664422');
    rootGrad.addColorStop(1, '#443311');
    ctx.fillStyle = rootGrad;
    ctx.fillRect(rx, ry, 5 + (i % 2), 8 + (i % 3) * 2);
  }

  // Trunk with bark gradient
  const trunkGrad = ctx.createLinearGradient(b.x + 4 + sway, b.y + 10, b.x + b.w - 4 + sway, b.y + b.h);
  trunkGrad.addColorStop(0, '#775533');
  trunkGrad.addColorStop(0.3, '#664422');
  trunkGrad.addColorStop(1, '#553311');
  ctx.fillStyle = trunkGrad;
  ctx.fillRect(b.x + 4 + sway, b.y + 10, b.w - 8, b.h - 10);

  // Bark texture with deep grooves
  ctx.strokeStyle = '#443311';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(b.x + 8 + i * 8 + sway, b.y + 14);
    ctx.lineTo(b.x + 6 + i * 8 + sway + Math.sin(i) * 2, b.y + b.h - 6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Canopy layers with depth and gradient
  const canopyLayers = [
    { y: -8, w: b.w + 12, h: 20, color1: '#227722', color2: '#115511' },
    { y: -14, w: b.w + 4, h: 10, color1: '#33aa33', color2: '#228822' },
    { y: -18, w: b.w - 12, h: 6, color1: '#44cc44', color2: '#33aa33' },
  ];
  for (const layer of canopyLayers) {
    const canopyGrad = ctx.createRadialGradient(
      b.x + b.w / 2 + sway, b.y + layer.y + layer.h / 2, 0,
      b.x + b.w / 2 + sway, b.y + layer.y + layer.h / 2, layer.w / 2
    );
    canopyGrad.addColorStop(0, layer.color1);
    canopyGrad.addColorStop(1, layer.color2);
    ctx.fillStyle = canopyGrad;
    ctx.beginPath();
    ctx.arc(b.x + b.w / 2 + sway, b.y + layer.y + layer.h / 2, layer.w / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Leaf particles falling
  for (let i = 0; i < 3; i++) {
    const lx = b.x + sway + (i * 17 + tick * 0.3) % b.w;
    const ly = b.y - 10 + (tick * 0.4 + i * 20) % (b.h + 20);
    const leafSway = Math.sin(tick * 0.03 + i * 2) * 3;
    ctx.fillStyle = '#44aa44';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(lx + leafSway, ly, 3, 2);
    ctx.globalAlpha = 1;
  }

  // Face carved in trunk
  // Glowing eyes
  const eyeGlow = (Math.sin(tick * 0.07) + 1) * 0.5;
  for (const side of [-1, 1]) {
    const ex = side === -1 ? b.x + 10 + sway : b.x + b.w - 16 + sway;
    drawGlow(ctx, ex + 3, b.y + 16, 6, '#ffaa00', eyeGlow * 0.2);
    pixelRect(ctx, ex, b.y + 14, 6, 4, '#ffaa00');
    pixelRect(ctx, ex + 2, b.y + 15, 2, 2, '#ffdd44');
  }

  // Angry mouth
  pixelRect(ctx, b.x + 12 + sway, b.y + 22, b.w - 24, 6, '#221100');
  // Teeth/splinters
  pixelRect(ctx, b.x + 14 + sway, b.y + 22, 3, 3, '#886644');
  pixelRect(ctx, b.x + b.w - 17 + sway, b.y + 22, 3, 3, '#886644');
  pixelRect(ctx, b.x + b.w / 2 - 1 + sway, b.y + 25, 3, 3, '#886644');

  // Branch arms with leaves
  const armSwing = Math.sin(tick * 0.04) * 8;
  for (const side of [-1, 1]) {
    const ax = side === -1 ? b.x - 16 + sway : b.x + b.w - 4 + sway;
    const armY = b.y + 6 + armSwing * side;
    // Branch
    pixelRect(ctx, ax, armY, 20, 6, '#664422');
    pixelRect(ctx, ax + 2, armY, 16, 2, '#775533');
    // Leaves on branch
    ctx.fillStyle = '#33bb33';
    ctx.beginPath();
    ctx.arc(ax + side * 2, armY - 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#44cc44';
    ctx.beginPath();
    ctx.arc(ax + side * 4, armY - 4, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glowing mushrooms on trunk
  const mGlow = (Math.sin(tick * 0.07) + 1) * 0.5;
  for (const [mx, my] of [[6, 30], [b.w - 10, 26], [b.w / 2 + 4, 36]]) {
    drawGlow(ctx, b.x + mx + sway, b.y + my, 5, '#88ff88', mGlow * 0.15);
    pixelRect(ctx, b.x + mx - 1 + sway, b.y + my, 4, 3, '#88ff88');
    pixelRect(ctx, b.x + mx + sway, b.y + my + 2, 2, 2, '#775533');
  }
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

  // Name with shadow
  ctx.fillStyle = '#000000';
  ctx.globalAlpha = 0.5;
  ctx.font = '10px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`⚔ ${names[boss.type]}`, canvasWidth / 2 + 1, 41);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ff4444';
  ctx.fillText(`⚔ ${names[boss.type]}`, canvasWidth / 2, 40);
  ctx.textAlign = 'left';
}
