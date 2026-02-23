import { Player, Robot, Bullet, Coin, Chest, Spike, MovingSpike, Bat, HeartPickup, Flag, Platform, LevelData, Skin, LevelStats } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY, JUMP_FORCE, WALK_SPEED, SPRINT_SPEED, TERMINAL_VELOCITY, SKINS } from './constants';
import { LEVELS } from './levels';
import { playSound } from './audio';
import { drawBackground, drawPlatform, drawPlayer, drawRobot, drawBullet, drawCoin, drawSpike, drawMovingSpike, drawBat, drawHeart, drawChest, drawFlag } from './renderer';

export interface EngineCallbacks {
  onLevelComplete: (coinsCollected: number, stats: LevelStats) => void;
  onGameOver: () => void;
  onLivesChange: (lives: number) => void;
  onLevelCoinsChange: (coins: number) => void;
  onChestOpen: (skinIndex: number) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private keys = new Set<string>();
  private jumpPressed = false;
  private animFrameId = 0;
  private running = false;

  private player!: Player;
  private platforms: Platform[] = [];
  private coins: Coin[] = [];
  private robots: Robot[] = [];
  private bullets: Bullet[] = [];
  private chests: Chest[] = [];
  private spikes: Spike[] = [];
  private movingSpikes: MovingSpike[] = [];
  private bats: Bat[] = [];
  private hearts: HeartPickup[] = [];
  private flag!: Flag;

  private cameraX = 0;
  private levelCoins = 0;
  private lives: number;
  private levelData!: LevelData;
  private skin: Skin;
  private tick = 0;
  private startTime = Date.now();
  private robotsKilledThisLevel = 0;
  private wasHitThisLevel = false;

  private callbacks: EngineCallbacks;
  public touchState = { left: false, right: false, jump: false, sprint: false };

  constructor(
    canvas: HTMLCanvasElement,
    levelIndex: number,
    skinIndex: number,
    lives: number,
    openedChests: Set<string>,
    callbacks: EngineCallbacks
  ) {
    this.canvas = canvas;
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
    this.lives = lives;
    this.skin = SKINS[skinIndex] || SKINS[0];
    this.callbacks = callbacks;
    this.loadLevel(levelIndex, openedChests);
  }

  private loadLevel(index: number, openedChests: Set<string>) {
    const level = LEVELS[index];
    if (!level) return;
    this.levelData = level;
    this.levelCoins = 0;
    this.startTime = Date.now();
    this.robotsKilledThisLevel = 0;
    this.wasHitThisLevel = false;

    this.platforms = level.platforms.map(p => ({ ...p }));
    this.coins = level.coins.map((c, i) => ({
      x: c.x, y: c.y, w: 16, h: 16, collected: false, bobOffset: i * 0.7
    }));
    this.robots = level.robots.map(r => ({
      x: r.x, y: r.y, w: 24, h: 24, vx: 1,
      patrolStart: r.x - r.patrolRange, patrolEnd: r.x + r.patrolRange,
      shootTimer: 90 + Math.random() * 60, alive: true, frame: 0
    }));
    this.bullets = [];
    this.chests = level.chests.map(c => ({
      x: c.x, y: c.y, w: 32, h: 28,
      opened: openedChests.has(`${index}-${c.skinIndex}`),
      skinIndex: c.skinIndex
    }));
    this.spikes = level.spikes.map(s => ({ x: s.x, y: s.y, w: 32, h: 16 }));
    this.movingSpikes = (level.movingSpikes || []).map(ms => ({
      x: ms.startX, y: ms.startY, w: 32, h: 16,
      startX: ms.startX, startY: ms.startY,
      endX: ms.endX, endY: ms.endY,
      speed: ms.speed, progress: 0, direction: 1 as const,
    }));
    this.bats = (level.bats || []).map(b => ({
      x: b.x, y: b.y, w: 20, h: 16, baseY: b.y, vx: 1,
      patrolStart: b.x - b.patrolRange, patrolEnd: b.x + b.patrolRange,
      alive: true, frame: 0,
      amplitude: b.amplitude || 30, frequency: b.frequency || 0.03,
    }));
    this.hearts = level.hearts.map(h => ({ x: h.x, y: h.y, w: 16, h: 16, collected: false }));
    this.flag = { x: level.flagPos.x, y: level.flagPos.y, w: 32, h: 48 };

    this.player = {
      x: level.playerSpawn.x, y: level.playerSpawn.y,
      vx: 0, vy: 0, w: 20, h: 32,
      onGround: false, canDoubleJump: false, crouching: false,
      facing: 'right', frame: 0, frameTimer: 0, invincible: 0
    };
    this.cameraX = 0;
  }

  start() {
    this.running = true;
    this.setupInput();
    this.loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.animFrameId);
    this.removeInput();
  }

  private setupInput() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  private removeInput() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys.add(e.code);
    if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
      this.jumpPressed = true;
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private loop = () => {
    if (!this.running) return;
    this.update();
    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update() {
    this.tick++;
    // Process touch jump
    if (this.touchState.jump) {
      this.jumpPressed = true;
      this.touchState.jump = false;
    }
    this.updatePlayer();
    this.updateRobots();
    this.updateBats();
    this.updateMovingSpikes();
    this.updateBullets();
    this.checkCollisions();
    this.updateCamera();
  }

  private updatePlayer() {
    const p = this.player;
    if (p.invincible > 0) p.invincible--;

    const sprint = this.keys.has('ShiftLeft') || this.keys.has('ShiftRight') || this.touchState.sprint;
    const speed = sprint ? SPRINT_SPEED : WALK_SPEED;
    const left = this.keys.has('ArrowLeft') || this.keys.has('KeyA') || this.touchState.left;
    const right = this.keys.has('ArrowRight') || this.keys.has('KeyD') || this.touchState.right;

    if (left) { p.vx = -speed; p.facing = 'left'; }
    else if (right) { p.vx = speed; p.facing = 'right'; }
    else p.vx = 0;

    // Crouch
    const wantCrouch = this.keys.has('ArrowDown') || this.keys.has('KeyS');
    if (wantCrouch && !p.crouching && p.onGround) {
      p.crouching = true;
      p.h = 16;
      p.y += 16;
    } else if (!wantCrouch && p.crouching) {
      p.crouching = false;
      p.h = 32;
      p.y -= 16;
    }

    // Jump - block at borders
    const atLeftBorder = p.x <= 0;
    const atRightBorder = p.x >= this.levelData.width - p.w;
    if (this.jumpPressed) {
      if (!atLeftBorder && !atRightBorder) {
        if (p.onGround) {
          p.vy = JUMP_FORCE;
          p.onGround = false;
          p.canDoubleJump = true;
          playSound('jump');
        } else if (p.canDoubleJump) {
          p.vy = JUMP_FORCE;
          p.canDoubleJump = false;
          playSound('jump');
        }
      }
      this.jumpPressed = false;
    }

    // Gravity
    p.vy += GRAVITY;
    if (p.vy > TERMINAL_VELOCITY) p.vy = TERMINAL_VELOCITY;

    // Move X
    p.x += p.vx;
    this.resolveCollisionX();

    // Move Y
    p.y += p.vy;
    this.resolveCollisionY();

    // Animation
    if (p.vx !== 0 && p.onGround) {
      p.frameTimer++;
      if (p.frameTimer > 6) { p.frame = (p.frame + 1) % 4; p.frameTimer = 0; }
    } else if (!p.onGround) {
      p.frame = 1;
    } else {
      p.frame = 0;
      p.frameTimer = 0;
    }

    // Fall death
    if (p.y > CANVAS_HEIGHT + 200) {
      this.playerDeath();
    }

    // Left boundary
    if (p.x < 0) p.x = 0;
    // Right boundary
    if (p.x > this.levelData.width - p.w) p.x = this.levelData.width - p.w;
  }

  private resolveCollisionX() {
    const p = this.player;
    for (const plat of this.platforms) {
      if (this.aabb(p, plat)) {
        if (p.vx > 0) p.x = plat.x - p.w;
        else if (p.vx < 0) p.x = plat.x + plat.w;
        p.vx = 0;
      }
    }
  }

  private resolveCollisionY() {
    const p = this.player;
    p.onGround = false;
    for (const plat of this.platforms) {
      if (this.aabb(p, plat)) {
        if (p.vy > 0) {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.onGround = true;
        } else if (p.vy < 0) {
          p.y = plat.y + plat.h;
          p.vy = 0;
        }
      }
    }
  }

  private aabb(a: {x:number,y:number,w:number,h:number}, b: {x:number,y:number,w:number,h:number}) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  private updateRobots() {
    for (const r of this.robots) {
      if (!r.alive) continue;
      r.x += r.vx;
      if (r.x <= r.patrolStart || r.x >= r.patrolEnd) r.vx *= -1;
      r.frame++;

      r.shootTimer--;
      if (r.shootTimer <= 0) {
        r.shootTimer = 120;
        const dir = this.player.x > r.x ? 1 : -1;
        this.bullets.push({
          x: r.x + (dir > 0 ? r.w : -8),
          y: r.y + 10,
          vx: dir * 4,
          w: 8, h: 4
        });
        playSound('shoot');
      }
    }
  }

  private updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      if (b.x < this.cameraX - 100 || b.x > this.cameraX + CANVAS_WIDTH + 100) {
        this.bullets.splice(i, 1);
      }
    }
  }

  private checkCollisions() {
    const p = this.player;

    // Coins
    for (const c of this.coins) {
      if (!c.collected && this.aabb(p, c)) {
        c.collected = true;
        this.levelCoins++;
        this.callbacks.onLevelCoinsChange(this.levelCoins);
        playSound('coin');
      }
    }

    // Hearts
    for (const h of this.hearts) {
      if (!h.collected && this.aabb(p, h)) {
        h.collected = true;
        this.lives = Math.min(this.lives + 1, 5);
        this.callbacks.onLivesChange(this.lives);
        playSound('heart');
      }
    }

    // Chests - land on top
    for (const c of this.chests) {
      if (!c.opened && this.aabb(p, c)) {
        c.opened = true;
        this.callbacks.onChestOpen(c.skinIndex);
        playSound('chest');
      }
    }

    // Flag
    if (this.aabb(p, this.flag)) {
      this.stop();
      playSound('win');
      const stats: LevelStats = {
        coinsCollected: this.levelCoins,
        totalCoins: this.coins.length,
        timeTaken: (Date.now() - this.startTime) / 1000,
        robotsKilled: this.robotsKilledThisLevel,
        wasHit: this.wasHitThisLevel,
      };
      this.callbacks.onLevelComplete(this.levelCoins, stats);
      return;
    }

    if (p.invincible > 0) return;

    // Spikes
    for (const s of this.spikes) {
      if (this.aabb(p, { x: s.x, y: s.y - 8, w: s.w, h: s.h + 8 })) {
        this.playerHit();
        return;
      }
    }

    // Moving Spikes
    for (const ms of this.movingSpikes) {
      if (this.aabb(p, { x: ms.x, y: ms.y - 8, w: ms.w, h: ms.h + 8 })) {
        this.playerHit();
        return;
      }
    }

    // Bats
    for (const b of this.bats) {
      if (!b.alive) continue;
      if (this.aabb(p, b)) {
        if (p.vy > 0 && p.y + p.h - b.y < 12) {
          b.alive = false;
          p.vy = -8;
          this.robotsKilledThisLevel++;
          playSound('stomp');
        } else {
          this.playerHit();
          return;
        }
      }
    }

    // Robots
    for (const r of this.robots) {
      if (!r.alive) continue;
      if (this.aabb(p, r)) {
        if (p.vy > 0 && p.y + p.h - r.y < 16) {
          r.alive = false;
          p.vy = -8;
          this.robotsKilledThisLevel++;
          playSound('stomp');
        } else {
          this.playerHit();
          return;
        }
      }
    }

    // Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (this.aabb(p, this.bullets[i])) {
        this.bullets.splice(i, 1);
        this.playerHit();
        return;
      }
    }
  }

  private updateBats() {
    for (const b of this.bats) {
      if (!b.alive) continue;
      b.x += b.vx;
      if (b.x <= b.patrolStart || b.x >= b.patrolEnd) b.vx *= -1;
      b.frame++;
      b.y = b.baseY + Math.sin(b.frame * b.frequency) * b.amplitude;
    }
  }

  private updateMovingSpikes() {
    for (const ms of this.movingSpikes) {
      ms.progress += ms.speed * ms.direction;
      if (ms.progress >= 1) { ms.progress = 1; ms.direction = -1; }
      if (ms.progress <= 0) { ms.progress = 0; ms.direction = 1; }
      ms.x = ms.startX + (ms.endX - ms.startX) * ms.progress;
      ms.y = ms.startY + (ms.endY - ms.startY) * ms.progress;
    }
  }

  private playerHit() {
    this.lives--;
    this.wasHitThisLevel = true;
    this.callbacks.onLivesChange(this.lives);
    playSound('death');

    if (this.lives <= 0) {
      this.stop();
      this.callbacks.onGameOver();
    } else {
      this.player.invincible = 90;
      this.player.vy = -8;
    }
  }

  private playerDeath() {
    this.lives--;
    this.callbacks.onLivesChange(this.lives);
    playSound('death');

    if (this.lives <= 0) {
      this.stop();
      this.callbacks.onGameOver();
    } else {
      this.player.x = this.levelData.playerSpawn.x;
      this.player.y = this.levelData.playerSpawn.y;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.invincible = 90;
    }
  }

  private updateCamera() {
    const targetX = this.player.x - CANVAS_WIDTH / 2 + this.player.w / 2;
    this.cameraX += (targetX - this.cameraX) * 0.08;
    if (this.cameraX < 0) this.cameraX = 0;
    const maxCam = this.levelData.width - CANVAS_WIDTH;
    if (maxCam > 0 && this.cameraX > maxCam) this.cameraX = maxCam;
  }

  private render() {
    const ctx = this.ctx;
    const cam = this.cameraX;

    drawBackground(ctx, this.levelData, cam, this.tick);

    ctx.save();
    ctx.translate(-Math.round(cam), 0);

    // Platforms
    for (const p of this.platforms) {
      if (p.x + p.w > cam - 50 && p.x < cam + CANVAS_WIDTH + 50) {
        drawPlatform(ctx, p, this.levelData.groundColor);
      }
    }

    // Spikes
    for (const s of this.spikes) drawSpike(ctx, s);
    // Moving Spikes
    for (const ms of this.movingSpikes) drawMovingSpike(ctx, ms, this.tick);
    // Bats
    for (const b of this.bats) {
      if (b.alive) drawBat(ctx, b, this.tick);
    }

    // Coins
    for (const c of this.coins) {
      if (!c.collected) drawCoin(ctx, c, this.tick);
    }

    // Hearts
    for (const h of this.hearts) {
      if (!h.collected) drawHeart(ctx, h, this.tick);
    }

    // Chests
    for (const c of this.chests) drawChest(ctx, c);

    // Flag
    drawFlag(ctx, this.flag, this.tick);

    // Robots
    for (const r of this.robots) {
      if (r.alive) drawRobot(ctx, r);
    }

    // Bullets
    for (const b of this.bullets) drawBullet(ctx, b);

    // Player
    if (this.player.invincible === 0 || this.tick % 4 < 2) {
      drawPlayer(ctx, this.player, this.skin);
    }

    ctx.restore();

    // HUD
    this.drawHUD();
  }

  private drawHUD() {
    const ctx = this.ctx;

    // Hearts
    for (let i = 0; i < this.lives; i++) {
      ctx.fillStyle = '#ff3366';
      const hx = 16 + i * 28;
      const hy = 16;
      ctx.beginPath();
      ctx.arc(hx, hy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx + 6, hy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(hx - 5, hy + 2);
      ctx.lineTo(hx + 3, hy + 10);
      ctx.lineTo(hx + 11, hy + 2);
      ctx.closePath();
      ctx.fill();
    }

    // Coins
    ctx.fillStyle = '#ffcc00';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText(`🪙 ${this.levelCoins}`, CANVAS_WIDTH - 120, 26);

    // Level name
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.5;
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(this.levelData.name, CANVAS_WIDTH / 2 - 60, 18);
    ctx.globalAlpha = 1;
  }
}
