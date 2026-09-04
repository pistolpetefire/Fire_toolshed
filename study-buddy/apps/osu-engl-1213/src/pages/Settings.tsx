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
    a.download = `study-buddy-osu-engl-1213-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
      const next = importMode === 'merge' ? mergeProgress(progress, result.progress) : result.progress;
      setProgress(next);
      setName(next.displayName);
      setImportMsg({
        type: 'ok',
        text:
          importMode === 'merge'
            ? `Merged backup — ${next.customCards.length} custom cards, ${next.quizHistory.length} quiz attempts.`
            : `Replaced local data — ${next.customCards.length} custom cards, ${next.quizHistory.length} quiz attempts.`,
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
        <p className="page-subtitle">Progress is stored in this browser. Export a backup to move devices.</p>
      </header>

      <section className="card space-y-4 p-5">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-violet-600" />
          <h2 className="font-semibold">Display name</h2>
        </div>
        <div className="flex gap-2">
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
          <button type="button" className="btn-primary" onClick={saveName}>
            Save
          </button>
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-violet-600" />
          <h2 className="font-semibold">Theme</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                progress.theme === t ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
              onClick={() => updateProgress((p) => ({ ...p, theme: t }))}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-violet-600" />
          <h2 className="font-semibold">Backup</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={exportData}>
            <Download className="h-4 w-4" /> Export JSON
          </button>
          <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => onImportFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="flex gap-3 text-xs">
          <label className="flex items-center gap-1">
            <input type="radio" checked={importMode === 'merge'} onChange={() => setImportMode('merge')} /> Merge
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} /> Replace
          </label>
        </div>
        {importMsg && (
          <p className={`flex items-center gap-1 text-sm ${importMsg.type === 'ok' ? 'text-violet-700' : 'text-rose-600'}`}>
            {importMsg.type === 'ok' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {importMsg.text}
          </p>
        )}
      </section>

      <section className="card space-y-3 p-5">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-rose-600" />
          <h2 className="font-semibold">Reset</h2>
        </div>
        {!confirmReset ? (
          <button type="button" className="btn-danger" onClick={() => setConfirmReset(true)}>
            Clear all progress
          </button>
        ) : (
          <div className="flex gap-2">
            <button type="button" className="btn-danger" onClick={reset}>
              Yes, reset
            </button>
            <button type="button" className="btn-ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        )}
      </section>

      <section className="card p-5 text-sm text-slate-500">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
          <Info className="h-4 w-4" /> About
        </div>
        <p>
          ENGL 1213 Comp II Hub v1.0.0 — personal study tool for Hughes’s Fall 2026 in-person section. Not an official
          OSU assessment. Do not use this app to generate submitted writing. Canvas and the course PDF win.
        </p>
      </section>
    </div>
  );
}
