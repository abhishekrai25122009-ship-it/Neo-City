import type { CitySaveDataV6, SaveSlotMetadata } from './SaveSchema';
import { extractMetadataFromSave, validateSaveData } from './SaveSchema';

const DB_NAME = 'NeoCityPersistenceDB';
const DB_VERSION = 1;
const STORE_NAME = 'save_slots';
const LOCALSTORAGE_PREFIX = 'neocity_slot_';
const METADATA_STORAGE_KEY = 'neocity_slots_meta';

export const FIXED_SLOTS = [
  { id: 'autosave', defaultName: 'System Autosave (Rolling)' },
  { id: 'slot_1', defaultName: 'Archive Slot 1 (Primary)' },
  { id: 'slot_2', defaultName: 'Archive Slot 2 (Metropolis)' },
  { id: 'slot_3', defaultName: 'Archive Slot 3 (Eco-Arcology)' },
  { id: 'slot_4', defaultName: 'Archive Slot 4 (Cyber-Grid)' },
  { id: 'slot_5', defaultName: 'Archive Slot 5 (Sandbox)' },
];

class SaveManagerSystem {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isIndexedDBAvailable: boolean = typeof indexedDB !== 'undefined';

  private getDB(): Promise<IDBDatabase> {
    if (!this.isIndexedDBAvailable) {
      return Promise.reject(new Error('IndexedDB not supported'));
    }
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        try {
          const request = indexedDB.open(DB_NAME, DB_VERSION);
          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'slotId' });
            }
          };
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => {
            this.isIndexedDBAvailable = false;
            reject(request.error);
          };
        } catch (e) {
          this.isIndexedDBAvailable = false;
          reject(e);
        }
      });
    }
    return this.dbPromise;
  }

  /**
   * Save a game state to an identified slot.
   */
  public async saveGame(
    slotId: string,
    slotName: string,
    data: CitySaveDataV6
  ): Promise<boolean> {
    const enrichedData: CitySaveDataV6 = {
      ...data,
      slotId,
      slotName: slotName || FIXED_SLOTS.find((s) => s.id === slotId)?.defaultName || slotId,
      timestamp: Date.now(),
      savedAtFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    const metadata = extractMetadataFromSave(enrichedData);

    try {
      if (this.isIndexedDBAvailable) {
        const db = await this.getDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.put(enrichedData);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    } catch (err) {
      console.warn('[SaveManager] IndexedDB write failed, falling back to LocalStorage:', err);
    }

    // Always mirror metadata and data to LocalStorage fallback for maximum redundancy
    try {
      localStorage.setItem(`${LOCALSTORAGE_PREFIX}${slotId}`, JSON.stringify(enrichedData));
      this.updateLocalStorageMetadata(metadata);
    } catch (localErr) {
      console.warn('[SaveManager] LocalStorage quota fallback warning:', localErr);
    }

    return true;
  }

  /**
   * Load a save by slot ID.
   */
  public async loadGame(slotId: string): Promise<CitySaveDataV6 | null> {
    let rawData: unknown = null;

    if (this.isIndexedDBAvailable) {
      try {
        const db = await this.getDB();
        rawData = await new Promise((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(slotId);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
      } catch (e) {
        console.warn('[SaveManager] IndexedDB read failed, trying LocalStorage:', e);
      }
    }

    if (!rawData) {
      try {
        const item = localStorage.getItem(`${LOCALSTORAGE_PREFIX}${slotId}`);
        if (item) {
          rawData = JSON.parse(item);
        }
      } catch (err) {
        console.error('[SaveManager] Failed to read from LocalStorage fallback:', err);
      }
    }

    if (!rawData) return null;

    const validation = validateSaveData(rawData);
    if (!validation.isValid || !validation.data) {
      throw new Error(validation.error || 'Invalid or corrupted save data');
    }

    return validation.data;
  }

  /**
   * Delete a save slot.
   */
  public async deleteGame(slotId: string): Promise<boolean> {
    try {
      if (this.isIndexedDBAvailable) {
        const db = await this.getDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.delete(slotId);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    } catch (err) {
      console.warn('[SaveManager] IndexedDB delete error:', err);
    }

    try {
      localStorage.removeItem(`${LOCALSTORAGE_PREFIX}${slotId}`);
      this.removeLocalStorageMetadata(slotId);
    } catch {
      // Ignored
    }

    return true;
  }

  /**
   * List all save slots with their metadata.
   */
  public async listSlots(): Promise<SaveSlotMetadata[]> {
    const listMap = new Map<string, SaveSlotMetadata>();

    // First load from localStorage metadata
    try {
      const storedMeta = localStorage.getItem(METADATA_STORAGE_KEY);
      if (storedMeta) {
        const parsed: SaveSlotMetadata[] = JSON.parse(storedMeta);
        parsed.forEach((m) => listMap.set(m.slotId, m));
      }
    } catch {
      // Ignored
    }

    // Next sync with IndexedDB if available
    if (this.isIndexedDBAvailable) {
      try {
        const db = await this.getDB();
        const allRecords = await new Promise<CitySaveDataV6[]>((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });

        allRecords.forEach((save) => {
          listMap.set(save.slotId, extractMetadataFromSave(save));
        });
      } catch {
        // Fallback already populated
      }
    }

    return FIXED_SLOTS.map((slot) => {
      const existing = listMap.get(slot.id);
      if (existing) return existing;
      return {
        slotId: slot.id,
        slotName: slot.defaultName,
        timestamp: 0,
        savedAtFormatted: 'Empty Slot',
        cityName: '',
        population: 0,
        treasury: 0,
        buildingCount: 0,
        happiness: 0,
        densityMode: 'medium',
        isAutoSave: slot.id === 'autosave',
        version: 6,
      };
    });
  }

  /**
   * Export slot contents as a downloadable JSON string.
   */
  public async exportSlotJson(slotId: string): Promise<string> {
    const data = await this.loadGame(slotId);
    if (!data) throw new Error(`Cannot export empty slot: ${slotId}`);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import a raw JSON string into a specific slot.
   */
  public async importSlotJson(
    jsonString: string,
    targetSlotId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = validateSaveData(parsed);
      if (!validation.isValid || !validation.data) {
        return { success: false, error: validation.error || 'Invalid JSON save structure' };
      }

      await this.saveGame(
        targetSlotId,
        validation.data.slotName || `Imported Save (${new Date().toLocaleTimeString()})`,
        validation.data
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'JSON parsing error' };
    }
  }

  private updateLocalStorageMetadata(meta: SaveSlotMetadata) {
    try {
      const current = localStorage.getItem(METADATA_STORAGE_KEY);
      let list: SaveSlotMetadata[] = current ? JSON.parse(current) : [];
      list = list.filter((item) => item.slotId !== meta.slotId);
      list.push(meta);
      localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignored
    }
  }

  private removeLocalStorageMetadata(slotId: string) {
    try {
      const current = localStorage.getItem(METADATA_STORAGE_KEY);
      if (!current) return;
      let list: SaveSlotMetadata[] = JSON.parse(current);
      list = list.filter((item) => item.slotId !== slotId);
      localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignored
    }
  }
}

export const SaveManager = new SaveManagerSystem();
