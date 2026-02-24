/**
 * Sprite Manager - Loads and manages all game sprite assets
 * Provides sprite sheet frame extraction for animated sprites
 */

import playerSheetUrl from '@/assets/sprites/player-sheet.png';
import robotSheetUrl from '@/assets/sprites/robot-sheet.png';
import batSheetUrl from '@/assets/sprites/bat-sheet.png';
import coinSheetUrl from '@/assets/sprites/coin-sheet.png';
import desertTilesUrl from '@/assets/sprites/desert-tiles.png';
import jungleTilesUrl from '@/assets/sprites/jungle-tiles.png';
import desertBgUrl from '@/assets/backgrounds/desert-bg.png';
import jungleBgUrl from '@/assets/backgrounds/jungle-bg.png';
import itemsSheetUrl from '@/assets/sprites/items-sheet.png';

export interface SpriteSheet {
  image: HTMLImageElement;
  loaded: boolean;
  frameWidth: number;
  frameHeight: number;
  cols: number;
  rows: number;
}

export interface SpriteConfig {
  url: string;
  frameWidth: number;
  frameHeight: number;
  cols: number;
  rows: number;
}

const SPRITE_CONFIGS: Record<string, SpriteConfig> = {
  player: { url: playerSheetUrl, frameWidth: 128, frameHeight: 128, cols: 4, rows: 2 },
  robot: { url: robotSheetUrl, frameWidth: 128, frameHeight: 128, cols: 2, rows: 2 },
  bat: { url: batSheetUrl, frameWidth: 256, frameHeight: 170, cols: 2, rows: 2 },
  coin: { url: coinSheetUrl, frameWidth: 128, frameHeight: 128, cols: 4, rows: 1 },
  desertTiles: { url: desertTilesUrl, frameWidth: 512, frameHeight: 512, cols: 1, rows: 1 },
  jungleTiles: { url: jungleTilesUrl, frameWidth: 512, frameHeight: 512, cols: 1, rows: 1 },
  desertBg: { url: desertBgUrl, frameWidth: 1024, frameHeight: 512, cols: 1, rows: 1 },
  jungleBg: { url: jungleBgUrl, frameWidth: 1024, frameHeight: 512, cols: 1, rows: 1 },
  items: { url: itemsSheetUrl, frameWidth: 512, frameHeight: 512, cols: 1, rows: 1 },
};

class SpriteManager {
  private sprites: Map<string, SpriteSheet> = new Map();
  private loadPromises: Map<string, Promise<void>> = new Map();
  public ready = false;

  async loadAll(): Promise<void> {
    const entries = Object.entries(SPRITE_CONFIGS);
    const promises = entries.map(([key, config]) => this.loadSprite(key, config));
    await Promise.all(promises);
    this.ready = true;
  }

  private loadSprite(key: string, config: SpriteConfig): Promise<void> {
    if (this.loadPromises.has(key)) return this.loadPromises.get(key)!;

    const promise = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.sprites.set(key, {
          image: img,
          loaded: true,
          frameWidth: config.frameWidth,
          frameHeight: config.frameHeight,
          cols: config.cols,
          rows: config.rows,
        });
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load sprite: ${key}`);
        this.sprites.set(key, {
          image: img,
          loaded: false,
          frameWidth: config.frameWidth,
          frameHeight: config.frameHeight,
          cols: config.cols,
          rows: config.rows,
        });
        resolve(); // Resolve anyway so game still works with fallback
      };
      img.src = config.url;
    });

    this.loadPromises.set(key, promise);
    return promise;
  }

  get(key: string): SpriteSheet | null {
    const sprite = this.sprites.get(key);
    if (!sprite || !sprite.loaded) return null;
    return sprite;
  }

  /**
   * Draw a specific frame from a sprite sheet
   */
  drawFrame(
    ctx: CanvasRenderingContext2D,
    key: string,
    frameIndex: number,
    x: number,
    y: number,
    width: number,
    height: number,
    flipX = false
  ): boolean {
    const sheet = this.get(key);
    if (!sheet) return false;

    const col = frameIndex % sheet.cols;
    const row = Math.floor(frameIndex / sheet.cols);
    const sx = col * sheet.frameWidth;
    const sy = row * sheet.frameHeight;

    ctx.save();
    if (flipX) {
      ctx.translate(x + width, y);
      ctx.scale(-1, 1);
      ctx.drawImage(
        sheet.image,
        sx, sy, sheet.frameWidth, sheet.frameHeight,
        0, 0, width, height
      );
    } else {
      ctx.drawImage(
        sheet.image,
        sx, sy, sheet.frameWidth, sheet.frameHeight,
        x, y, width, height
      );
    }
    ctx.restore();
    return true;
  }

  /**
   * Draw an entire sprite image (no frame extraction)
   */
  drawImage(
    ctx: CanvasRenderingContext2D,
    key: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    const sheet = this.get(key);
    if (!sheet) return false;

    ctx.drawImage(sheet.image, x, y, width, height);
    return true;
  }

  /**
   * Draw a tiled section from a tileset image
   */
  drawTile(
    ctx: CanvasRenderingContext2D,
    key: string,
    srcX: number,
    srcY: number,
    srcW: number,
    srcH: number,
    destX: number,
    destY: number,
    destW: number,
    destH: number
  ): boolean {
    const sheet = this.get(key);
    if (!sheet) return false;

    ctx.drawImage(
      sheet.image,
      srcX, srcY, srcW, srcH,
      destX, destY, destW, destH
    );
    return true;
  }
}

// Singleton instance
export const spriteManager = new SpriteManager();
