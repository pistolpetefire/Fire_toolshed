interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  size = 'md',
  color = 'bg-brand-500',
  showPercent = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>}
          {showPercent && (
            <span className="tabular-nums text-slate-500 dark:text-slate-400">{pct}%</span>
          )}
        </div>
      )}
      <div className={`${height} w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800`}>
        <div
          className={`${height} rounded-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
