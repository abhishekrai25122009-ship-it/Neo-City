import React, { useState, useEffect, useRef } from 'react';
import { useCityStore } from '../../store/useCityStore';
import { SaveManager, FIXED_SLOTS } from '../../systems/persistence/SaveManager';
import type { SaveSlotMetadata } from '../../systems/persistence/SaveSchema';
import {
  Save,
  Download,
  Trash2,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  X,
  HardDrive,
  Users,
  Coins,
  Building,
} from 'lucide-react';

export const SaveLoadPanel: React.FC = () => {
  const isSaveLoadModalOpen = useCityStore((state) => state.isSaveLoadModalOpen);
  const setSaveLoadModalOpen = useCityStore((state) => state.setSaveLoadModalOpen);
  const saveToSlot = useCityStore((state) => state.saveToSlot);
  const loadFromSlot = useCityStore((state) => state.loadFromSlot);
  const deleteSlot = useCityStore((state) => state.deleteSlot);

  const [slots, setSlots] = useState<SaveSlotMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmOverwriteSlot, setConfirmOverwriteSlot] = useState<string | null>(null);
  const [customSlotName, setCustomSlotName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'slots' | 'import_export'>('slots');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshSlots = async () => {
    setLoading(true);
    try {
      const data = await SaveManager.listSlots();
      setSlots(data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSaveLoadModalOpen) {
      refreshSlots();
      setStatusMessage(null);
      setConfirmOverwriteSlot(null);
    }
  }, [isSaveLoadModalOpen]);

  if (!isSaveLoadModalOpen) return null;

  const handleSaveToSlot = async (slotId: string, slotName?: string) => {
    setLoading(true);
    const finalName = customSlotName.trim() || slotName || FIXED_SLOTS.find((s) => s.id === slotId)?.defaultName;
    try {
      const ok = await saveToSlot(slotId, finalName);
      if (ok) {
        setStatusMessage({ text: `State successfully archived to [${finalName}]`, type: 'success' });
        setConfirmOverwriteSlot(null);
        setCustomSlotName('');
        await refreshSlots();
      } else {
        setStatusMessage({ text: 'Failed to write save snapshot.', type: 'error' });
      }
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Write failure', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromSlot = async (slotId: string) => {
    setLoading(true);
    try {
      const ok = await loadFromSlot(slotId);
      if (ok) {
        setStatusMessage({ text: `Civilization state loaded successfully!`, type: 'success' });
        setTimeout(() => {
          setSaveLoadModalOpen(false);
        }, 1200);
      } else {
        setStatusMessage({ text: 'Could not load archive.', type: 'error' });
      }
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Load failure', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm(`Are you sure you want to delete this save slot?`)) return;
    setLoading(true);
    try {
      await deleteSlot(slotId);
      setStatusMessage({ text: 'Archive removed.', type: 'info' });
      await refreshSlots();
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Delete failure', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = async (slotId: string) => {
    try {
      const json = await SaveManager.exportSlotJson(slotId);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neo_city_${slotId}_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ text: `Archive ${slotId} exported to JSON file.`, type: 'success' });
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Export error', type: 'error' });
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;
      try {
        const res = await SaveManager.importSlotJson(content, 'slot_1');
        if (res.success) {
          setStatusMessage({ text: 'Save snapshot imported into Slot 1!', type: 'success' });
          await refreshSlots();
        } else {
          setStatusMessage({ text: res.error || 'Invalid save file format.', type: 'error' });
        }
      } catch (err: any) {
        setStatusMessage({ text: err.message || 'Import error', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-mono text-xs">
      <div className="orbital-surface-elevated border border-[#ff5500]/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,85,0,0.25)] flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#080b12]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5500]/20 border border-[#ff5500]/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,85,0,0.4)]">
              <HardDrive className="w-5 h-5 text-[#ff8533]" />
            </div>
            <div>
              <h2 className="font-['Chakra_Petch'] font-black text-lg text-[#fcfaf6] tracking-wider flex items-center gap-2">
                ORBITAL PERSISTENCE ENGINE
              </h2>
              <p className="text-xs font-mono text-[#64748b]">
                Multi-slot telemetry archive with IndexedDB & JSON redundancy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'slots' ? 'import_export' : 'slots')}
              className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {activeTab === 'slots' ? 'JSON Tools' : 'View Slots'}
            </button>
            <button
              onClick={() => setSaveLoadModalOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status notification toast */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                : 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'slots' ? (
            <div className="space-y-3">
              {slots.map((slot) => {
                const isOccupied = slot.timestamp > 0;
                const isOverwriting = confirmOverwriteSlot === slot.slotId;

                return (
                  <div
                    key={slot.slotId}
                    className={`p-4 rounded-xl border transition-all ${
                      slot.isAutoSave
                        ? 'bg-indigo-950/20 border-indigo-500/30'
                        : isOccupied
                        ? 'bg-slate-900/60 border-white/15 hover:border-amber-500/40'
                        : 'bg-slate-950/40 border-dashed border-white/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Slot Information */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              slot.isAutoSave
                                ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-400/40'
                                : 'bg-slate-800 text-amber-400 border border-amber-400/30'
                            }`}
                          >
                            {slot.slotId.toUpperCase()}
                          </span>
                          <span className="font-['Chakra_Petch'] font-bold text-white text-sm">
                            {slot.slotName}
                          </span>
                          {slot.densityMode && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {slot.densityMode.toUpperCase()} DENSITY
                            </span>
                          )}
                        </div>

                        {isOccupied ? (
                          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                            <span className="text-slate-300">{slot.savedAtFormatted}</span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1 text-purple-300">
                              <Users className="w-3 h-3" />
                              {slot.population.toLocaleString()} Pop
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1 text-amber-300">
                              <Coins className="w-3 h-3" />
                              {(slot.treasury / 1000000).toFixed(2)}M CR
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="flex items-center gap-1 text-sky-300">
                              <Building className="w-3 h-3" />
                              {slot.buildingCount} Buildings
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs font-mono text-slate-500 italic">
                            Empty Slot — Ready for snapshot archive
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isOverwriting ? (
                          <div className="flex items-center gap-2 bg-rose-950/60 p-2 rounded-lg border border-rose-500/50">
                            <span className="text-[11px] font-mono text-rose-300 font-bold">
                              Confirm overwrite?
                            </span>
                            <button
                              onClick={() => handleSaveToSlot(slot.slotId, slot.slotName)}
                              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold cursor-pointer"
                            >
                              Yes, Overwrite
                            </button>
                            <button
                              onClick={() => setConfirmOverwriteSlot(null)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Save to slot */}
                            <button
                              onClick={() => {
                                if (isOccupied) {
                                  setConfirmOverwriteSlot(slot.slotId);
                                } else {
                                  handleSaveToSlot(slot.slotId);
                                }
                              }}
                              disabled={loading}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/40 text-amber-200 text-xs font-mono font-semibold transition-all cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5 text-amber-400" />
                              <span>{isOccupied ? 'Overwrite' : 'Save'}</span>
                            </button>

                            {/* Load from slot */}
                            {isOccupied && (
                              <button
                                onClick={() => handleLoadFromSlot(slot.slotId)}
                                disabled={loading}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 text-xs font-mono font-semibold transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Load</span>
                              </button>
                            )}

                            {/* Export slot */}
                            {isOccupied && (
                              <button
                                onClick={() => handleExportJson(slot.slotId)}
                                title="Export Slot to JSON File"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 transition-colors cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                              </button>
                            )}

                            {/* Delete slot */}
                            {isOccupied && !slot.isAutoSave && (
                              <button
                                onClick={() => handleDeleteSlot(slot.slotId)}
                                title="Erase Slot Contents"
                                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Import & Export JSON tools */
            <div className="space-y-4 font-mono text-xs">
              <div className="p-5 rounded-xl bg-slate-900/60 border border-white/15 space-y-3">
                <h3 className="font-['Chakra_Petch'] font-bold text-sm text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  IMPORT CIVILIZATION ARCHIVE
                </h3>
                <p className="text-slate-400">
                  Restore a saved city from an exported JSON file on your machine. This will unpack your full 3D building layout, unlocked tech, finances, and living simulation state into Slot 1.
                </p>
                <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  onChange={handleImportFile}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/50 text-cyan-200 font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Select JSON Archive File
                </button>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/60 border border-white/15 space-y-3">
                <h3 className="font-['Chakra_Petch'] font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  INSTANT EXPORT TO DISK
                </h3>
                <p className="text-slate-400">
                  Download an offline JSON copy of your current live civilization state right now.
                </p>
                <button
                  onClick={async () => {
                    const data = useCityStore.getState().getSerializableSaveData();
                    const json = JSON.stringify(data, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `neo_city_live_${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    setStatusMessage({ text: 'Live city state exported to file!', type: 'success' });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/50 text-amber-200 font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Current Live State
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
