import { SaveManager } from './SaveManager';
import type { CitySaveDataV6 } from './SaveSchema';

export interface AutoSaveConfig {
  intervalMs: number; // e.g. 60000 (1 minute)
  enabled: boolean;
}

export class AutoSaveCoordinator {
  private timer: number | null = null;
  private config: AutoSaveConfig = {
    intervalMs: 60000,
    enabled: true,
  };
  private isSaving: boolean = false;
  private lastAutoSaveTime: number = 0;
  private saveCallback: (() => CitySaveDataV6 | null) | null = null;
  private onNotify: ((message: string) => void) | null = null;

  public initialize(
    saveCallback: () => CitySaveDataV6 | null,
    onNotify?: (message: string) => void
  ) {
    this.saveCallback = saveCallback;
    this.onNotify = onNotify || null;
    this.start();
  }

  public start() {
    this.stop();
    if (!this.config.enabled) return;

    this.timer = window.setInterval(() => {
      this.triggerAutoSave('periodic');
    }, this.config.intervalMs);
  }

  public stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public async triggerAutoSave(reason: 'periodic' | 'pre-destructive' | 'manual' = 'periodic'): Promise<boolean> {
    if (this.isSaving || !this.saveCallback) return false;

    try {
      this.isSaving = true;
      const data = this.saveCallback();
      if (!data) return false;

      const success = await SaveManager.saveGame('autosave', 'Rolling Autosave', data);
      if (success) {
        this.lastAutoSaveTime = Date.now();
        if (this.onNotify) {
          this.onNotify(
            reason === 'pre-destructive'
              ? 'Emergency pre-event snapshot archived to Autosave.'
              : 'Autosave snapshot archived to slot.'
          );
        }
      }
      return success;
    } catch (err) {
      console.warn('[AutoSaveCoordinator] Autosave encounter:', err);
      return false;
    } finally {
      this.isSaving = false;
    }
  }

  public getLastAutoSaveTime(): number {
    return this.lastAutoSaveTime;
  }
}

export const autoSaveCoordinator = new AutoSaveCoordinator();
