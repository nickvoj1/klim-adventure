import { Player, Robot, Bullet, Coin, Chest, Spike, MovingSpike, Bat, Boss, HeartPickup, Flag, Platform, LevelData, Skin, LevelStats, AttackType, AttackHitbox } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GRAVITY, JUMP_FORCE, WALK_SPEED, SPRINT_SPEED, TERMINAL_VELOCITY, SKINS } from './constants';
import { generateLevel } from './levelgen';
import { playSound } from './audio';
import { drawBackground, drawPlatform, drawPlayer, drawRobot, drawBullet, drawCoin, drawSpike, drawMovingSpike, drawBat, drawHeart, drawChest, drawFlag } from './renderer';
import { drawBoss, drawBossName } from './boss-renderer';

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
  private boss: Boss | null = null;
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

  // Screen shake
  private shakeTimer = 0;
  private shakeIntensity = 0;
  // Hit flash
  private hitFlashTimer = 0;

  private callbacks: EngineCallbacks;
  public touchState = { left: false, right: false, jump: false, sprint: false, punch: false, kick: false, special: false };

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
    const level = generateLevel(index);
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

    // Boss
    if (level.boss) {
      const bd = level.boss;
      this.boss = {
        x: bd.x, y: bd.y, w: 48, h: 48, vx: 1, vy: 0,
        hp: bd.hp, maxHp: bd.hp, type: bd.type,
        alive: true, phase: 0, timer: 0, frame: 0, invincible: 0,
        patrolStart: bd.x - bd.patrolRange, patrolEnd: bd.x + bd.patrolRange,
        attackCooldown: 120, specialTimer: 0, direction: 1,
      };
    } else {
      this.boss = null;
    }

    this.player = {
      x: level.playerSpawn.x, y: level.playerSpawn.y,
      vx: 0, vy: 0, w: 20, h: 32,
      onGround: false, canDoubleJump: false, crouching: false,
      facing: 'right', frame: 0, frameTimer: 0, invincible: 0,
      coyoteTimer: 0, jumpBufferTimer: 0,
      attacking: 'none', attackTimer: 0, attackCooldown: 0,
      comboCount: 0, comboTimer: 0, specialCharge: 0,
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
    // Combat keys
    if (e.code === 'KeyJ' || e.code === 'KeyZ') this.triggerAttack('punch');
    if (e.code === 'KeyK' || e.code === 'KeyX') this.triggerAttack('kick');
    if (e.code === 'KeyL' || e.code === 'KeyC') this.triggerAttack('special');
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private triggerAttack(type: AttackType) {
    const p = this.player;
    if (p.attackCooldown > 0 || p.attacking !== 'none') return;
    if (type === 'special' && p.specialCharge < 100) return;

    p.attacking = type;
    p.attackTimer = type === 'special' ? 24 : type === 'kick' ? 16 : 12;
    p.attackCooldown = type === 'special' ? 60 : 8;

    if (type === 'special') p.specialCharge = 0;

    // Combo tracking
    if (p.comboTimer > 0) {
      p.comboCount++;
    } else {
      p.comboCount = 1;
    }
    p.comboTimer = 30;

    playSound('stomp');
  }

  private getAttackHitbox(): AttackHitbox | null {
    const p = this.player;
    if (p.attacking === 'none' || p.attackTimer <= 0) return null;

    const dir = p.facing === 'right' ? 1 : -1;
    const baseX = dir === 1 ? p.x + p.w : p.x;

    switch (p.attacking) {
      case 'punch':
        return { x: dir === 1 ? baseX : baseX - 18, y: p.y + 6, w: 18, h: 12, damage: 1, knockback: 4, type: 'punch' };
      case 'kick':
        return { x: dir === 1 ? baseX : baseX - 24, y: p.y + 14, w: 24, h: 10, damage: 2, knockback: 6, type: 'kick' };
      case 'special':
        return { x: p.x - 20, y: p.y - 10, w: p.w + 40, h: p.h + 20, damage: 5, knockback: 10, type: 'special' };
      default:
        return null;
    }
  }

  private loop = () => {
    if (!this.running) return;
    this.update();
    this.render();
    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update() {
    this.tick++;
    // Process touch inputs
    if (this.touchState.jump) {
      this.jumpPressed = true;
      this.touchState.jump = false;
    }
    if (this.touchState.punch) { this.triggerAttack('punch'); this.touchState.punch = false; }
    if (this.touchState.kick) { this.triggerAttack('kick'); this.touchState.kick = false; }
    if (this.touchState.special) { this.triggerAttack('special'); this.touchState.special = false; }

    this.updatePlayer();
    this.updateCombat();
    this.updateRobots();
    this.updateBats();
    this.updateMovingSpikes();
    this.updateBoss();
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

  private updateCombat() {
    const p = this.player;
    if (p.attackCooldown > 0) p.attackCooldown--;
    if (p.comboTimer > 0) p.comboTimer--;
    else p.comboCount = 0;

    // Build special charge from kills and hits
    if (p.specialCharge < 100) {
      // Passive charge
      if (this.tick % 60 === 0) p.specialCharge = Math.min(100, p.specialCharge + 1);
    }

    if (p.attacking !== 'none') {
      p.attackTimer--;
      if (p.attackTimer <= 0) {
        p.attacking = 'none';
      } else {
        // Check attack hitbox against enemies
        const hitbox = this.getAttackHitbox();
        if (hitbox) {
          this.checkAttackCollisions(hitbox);
        }
      }
    }
  }

  private checkAttackCollisions(hitbox: AttackHitbox) {
    // Robots
    for (const r of this.robots) {
      if (!r.alive) continue;
      if (this.aabb(hitbox, r)) {
        r.alive = false;
        this.robotsKilledThisLevel++;
        this.player.specialCharge = Math.min(100, this.player.specialCharge + 15);
        playSound('stomp');
      }
    }

    // Bats
    for (const b of this.bats) {
      if (!b.alive) continue;
      if (this.aabb(hitbox, b)) {
        b.alive = false;
        this.robotsKilledThisLevel++;
        this.player.specialCharge = Math.min(100, this.player.specialCharge + 10);
        playSound('stomp');
      }
    }

    // Boss
    if (this.boss && this.boss.alive && this.boss.invincible <= 0) {
      if (this.aabb(hitbox, this.boss)) {
        this.boss.hp -= hitbox.damage;
        this.boss.invincible = 20;
        this.boss.vx = hitbox.knockback * (this.player.facing === 'right' ? 1 : -1);
        this.player.specialCharge = Math.min(100, this.player.specialCharge + 20);
        playSound('stomp');
        if (this.boss.hp <= 0) {
          this.boss.alive = false;
          this.robotsKilledThisLevel++;
        }
      }
    }

    // Deflect bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (this.aabb(hitbox, this.bullets[i])) {
        this.bullets.splice(i, 1);
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

    // Boss collision
    if (this.boss && this.boss.alive && this.boss.invincible <= 0) {
      if (this.aabb(p, this.boss)) {
        if (p.vy > 0 && p.y + p.h - this.boss.y < 16) {
          // Stomp boss
          this.boss.hp--;
          this.boss.invincible = 30;
          p.vy = -10;
          playSound('stomp');
          if (this.boss.hp <= 0) {
            this.boss.alive = false;
            this.robotsKilledThisLevel++;
            playSound('stomp');
          }
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

  private updateBoss() {
    if (!this.boss || !this.boss.alive) return;
    const b = this.boss;
    b.frame++;
    if (b.invincible > 0) b.invincible--;

    // Patrol movement
    b.x += b.vx * 1.2;
    if (b.x <= b.patrolStart || b.x >= b.patrolEnd) {
      b.vx *= -1;
      b.direction = b.vx > 0 ? 1 : -1;
    }

    // Attack phases based on HP
    if (b.hp <= b.maxHp * 0.5 && b.phase === 0) {
      b.phase = 1; // Enraged
      b.vx *= 1.5;
    }

    // Boss-specific shooting
    b.attackCooldown--;
    if (b.attackCooldown <= 0) {
      b.attackCooldown = b.phase === 1 ? 60 : 90;
      const dir = this.player.x > b.x ? 1 : -1;
      this.bullets.push({
        x: b.x + (dir > 0 ? b.w : -8),
        y: b.y + b.h / 2,
        vx: dir * 3,
        w: 10, h: 6
      });
      playSound('shoot');
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

    // Boss
    if (this.boss) drawBoss(ctx, this.boss, this.tick);

    // Bullets
    for (const b of this.bullets) drawBullet(ctx, b);

    // Player
    if (this.player.invincible === 0 || this.tick % 4 < 2) {
      drawPlayer(ctx, this.player, this.skin);
    }

    // Attack effects
    if (this.player.attacking !== 'none' && this.player.attackTimer > 0) {
      this.drawAttackEffect(ctx);
    }

    ctx.restore();

    // HUD
    this.drawHUD();
  }

  private drawAttackEffect(ctx: CanvasRenderingContext2D) {
    const p = this.player;
    const hitbox = this.getAttackHitbox();
    if (!hitbox) return;

    const progress = p.attackTimer / (p.attacking === 'special' ? 24 : p.attacking === 'kick' ? 16 : 12);

    if (p.attacking === 'punch') {
      // Fist effect - quick jab line
      const dir = p.facing === 'right' ? 1 : -1;
      const fistX = hitbox.x + (dir === 1 ? hitbox.w * (1 - progress) : hitbox.w * progress);
      const fistY = hitbox.y + hitbox.h / 2;
      ctx.fillStyle = '#ffcc44';
      ctx.globalAlpha = progress;
      ctx.beginPath();
      ctx.arc(fistX, fistY, 6 * progress, 0, Math.PI * 2);
      ctx.fill();
      // Impact lines
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI - Math.PI / 2;
        ctx.strokeStyle = '#ffee88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fistX + Math.cos(angle) * 4, fistY + Math.sin(angle) * 4);
        ctx.lineTo(fistX + Math.cos(angle) * (8 + (1 - progress) * 8), fistY + Math.sin(angle) * (8 + (1 - progress) * 8));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (p.attacking === 'kick') {
      // Sweep arc effect
      const dir = p.facing === 'right' ? 1 : -1;
      const arcAngle = (1 - progress) * Math.PI;
      ctx.strokeStyle = '#ff6644';
      ctx.lineWidth = 3;
      ctx.globalAlpha = progress;
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h * 0.6, 20, dir === 1 ? -arcAngle / 2 : Math.PI - arcAngle / 2, dir === 1 ? arcAngle / 2 : Math.PI + arcAngle / 2);
      ctx.stroke();
      // Kick trail
      ctx.fillStyle = '#ff8844';
      ctx.fillRect(hitbox.x, hitbox.y + hitbox.h / 2 - 1, hitbox.w * (1 - progress), 3);
      ctx.globalAlpha = 1;
    } else if (p.attacking === 'special') {
      // Shockwave ring expanding outward
      const radius = 30 * (1 - progress);
      ctx.strokeStyle = '#44ddff';
      ctx.lineWidth = 4 * progress;
      ctx.globalAlpha = progress * 0.8;
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
      // Inner glow
      ctx.fillStyle = '#88eeff';
      ctx.globalAlpha = progress * 0.3;
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h / 2, radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      // Sparks
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + this.tick * 0.1;
        const dist = radius * 0.8;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = progress * 0.6;
        ctx.fillRect(p.x + p.w / 2 + Math.cos(angle) * dist - 1, p.y + p.h / 2 + Math.sin(angle) * dist - 1, 3, 3);
      }
      ctx.globalAlpha = 1;
    }

    // Combo counter
    if (p.comboCount > 1 && p.comboTimer > 0) {
      ctx.fillStyle = '#ffcc00';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.globalAlpha = p.comboTimer / 30;
      ctx.fillText(`${p.comboCount}x COMBO!`, p.x - 10, p.y - 15);
      ctx.globalAlpha = 1;
    }
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

    // Special charge bar
    const barX = 16;
    const barY = 34;
    const barW = 80;
    const barH = 6;
    const charge = this.player.specialCharge;
    // Background
    ctx.fillStyle = '#222233';
    ctx.fillRect(barX, barY, barW, barH);
    // Fill
    const chargeColor = charge >= 100 ? '#44ddff' : '#2288aa';
    ctx.fillStyle = chargeColor;
    ctx.fillRect(barX, barY, barW * (charge / 100), barH);
    // Border
    ctx.strokeStyle = '#445566';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
    // Label
    ctx.fillStyle = charge >= 100 ? '#44ddff' : '#667788';
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('SP', barX + barW + 4, barY + 5);
    // Flash when ready
    if (charge >= 100 && this.tick % 30 < 15) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#44ddff';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.globalAlpha = 1;
    }

    // Attack indicator
    if (this.player.attacking !== 'none') {
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px "Press Start 2P", monospace';
      const label = this.player.attacking === 'punch' ? '👊' : this.player.attacking === 'kick' ? '🦶' : '⚡';
      ctx.fillText(label, CANVAS_WIDTH / 2 - 8, 36);
    }

    // Level name
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.5;
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(this.levelData.name, CANVAS_WIDTH / 2 - 60, 18);
    ctx.globalAlpha = 1;

    // Controls hint (keyboard)
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.25;
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('J:Punch K:Kick L:Special', CANVAS_WIDTH - 200, CANVAS_HEIGHT - 8);
    ctx.globalAlpha = 1;
  }
}
