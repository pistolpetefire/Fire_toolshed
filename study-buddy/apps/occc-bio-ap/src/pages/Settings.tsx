import { useRef, useState } from 'react';
import { User, Palette, Trash2, Download, Upload, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProgressContext } from '../context/ProgressContext';
import {
  clearProgress,
  exportProgressPayload,
  parseProgressImport,
  mergeProgress,
  type ImportMode,
} from '../lib/storage';
import { DEFAULT_PROGRESS } from '../types';

export function Settings() {
  const { progress, setProgress, updateProgress } = useProgressContext();
  const [name, setName] = useState(progress.displayName);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [importMsg, setImportMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveName = () => {
    updateProgress((p) => ({ ...p, displayName: name.trim() || 'Student' }));
  };

  const exportData = () => {
    const blob = new Blob([exportProgressPayload(progress)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-buddy-occc-bio-ap-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportFile = async (file: File | null) => {
    setImportMsg(null);
    if (!file) return;
    try {
      const text = await file.text();
      const result = parseProgressImport(text);
      if (!result.ok) {
        setImportMsg({ type: 'err', text: result.error });
        return;
      }
      const next =
        importMode === 'merge' ? mergeProgress(progress, result.progress) : result.progress;
      setProgress(next);
      setName(next.displayName);
      setImportMsg({
        type: 'ok',
        text:
          importMode === 'merge'
            ? `Merged backup — ${next.customCards.length} custom cards, ${next.quizHistory.length} quiz attempts total.`
            : `Replaced local data — ${next.customCards.length} custom cards, ${next.quizHistory.length} quiz attempts restored.`,
      });
    } catch {
      setImportMsg({ type: 'err', text: 'Could not read that file.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const reset = () => {
    clearProgress();
    setProgress({ ...DEFAULT_PROGRESS });
    setName('Student');
    setConfirmReset(false);
    setImportMsg(null);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">
          Preferences and data — progress is stored in this browser. Export/import to move between devices.
        </p>
      </header>

      <section className="card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-brand-500" />
          <h2 className="font-display text-lg font-semibold">Profile</h2>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Display name</label>
          <div className="flex gap-2">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
            <button type="button" className="btn-primary shrink-0" onClick={saveName}>
              Save
            </button>
          </div>
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-brand-500" />
          <h2 className="font-display text-lg font-semibold">Appearance</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => updateProgress((p) => ({ ...p, theme: t }))}
              className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
                progress.theme === t
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-brand-500" />
          <h2 className="font-display text-lg font-semibold">Backup &amp; sync (multi-device)</h2>
        </div>
        <p className="text-sm text-slate-500">
          Export a JSON backup, then import it on another browser. Choose merge to keep both devices&apos; progress, or
          replace to overwrite this device completely.
        </p>

        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Import mode</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setImportMode('merge')}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                importMode === 'merge'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Merge with current
            </button>
            <button
              type="button"
              onClick={() => setImportMode('replace')}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                importMode === 'replace'
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              Replace all local data
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {importMode === 'merge'
              ? 'Merge combines custom cards, quiz history, and card schedules from both sources.'
              : 'Replace discards current progress on this device and loads only the backup.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={exportData}>
            <Download className="h-4 w-4" /> Export JSON backup
          </button>
          <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import JSON backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => onImportFile(e.target.files?.[0] ?? null)}
          />
        </div>
        {importMsg && (
          <div
            role="status"
            aria-live="polite"
            className={`flex items-start gap-2 rounded-xl p-3 text-sm ${
              importMsg.type === 'ok'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200'
            }`}
          >
            {importMsg.type === 'ok' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <span>{importMsg.text}</span>
          </div>
        )}
        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          {!confirmReset ? (
            <button type="button" className="btn-danger" onClick={() => setConfirmReset(true)}>
              <Trash2 className="h-4 w-4" /> Reset all progress
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-danger" onClick={reset}>
                Confirm reset
              </button>
              <button type="button" className="btn-secondary" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-100">OCCC Anatomy Hub v1.2</p>
            <p className="mt-1">
              Educational study tool for Human Anatomy &amp; Physiology (BIO 1314 / BIO 1414) at Oklahoma City
              Community College. Not a substitute for textbooks, lab manuals, or instructor materials.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
