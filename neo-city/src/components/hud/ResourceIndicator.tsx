import React from 'react';

export type IndicatorColorTheme =
  | 'cyan'
  | 'amber'
  | 'violet'
  | 'emerald'
  | 'blue'
  | 'yellow'
  | 'rose'
  | 'aqua';

export interface ResourceIndicatorProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  capacity?: string | number;
  changeRate?: string;
  colorTheme: IndicatorColorTheme;
  isWarning?: boolean;
  isCritical?: boolean;
  onClick?: () => void;
  tooltip?: string;
  statusLabel?: string;
  className?: string;
}

const THEME_STYLES: Record<
  IndicatorColorTheme,
  {
    border: string;
    bg: string;
    text: string;
    label: string;
    value: string;
  }
> = {
  cyan: {
    border: 'border-cyan-500/30 hover:border-cyan-400',
    bg: 'bg-cyan-950/30',
    text: 'text-cyan-200',
    label: 'text-cyan-400',
    value: 'text-cyan-200',
  },
  amber: {
    border: 'border-amber-500/30 hover:border-amber-400',
    bg: 'bg-amber-950/30',
    text: 'text-amber-200',
    label: 'text-amber-400',
    value: 'text-amber-300',
  },
  violet: {
    border: 'border-purple-500/30 hover:border-purple-400',
    bg: 'bg-purple-950/30',
    text: 'text-purple-200',
    label: 'text-purple-400',
    value: 'text-white',
  },
  emerald: {
    border: 'border-emerald-500/30 hover:border-emerald-400',
    bg: 'bg-emerald-950/30',
    text: 'text-emerald-200',
    label: 'text-emerald-400',
    value: 'text-emerald-300',
  },
  blue: {
    border: 'border-blue-500/30 hover:border-blue-400',
    bg: 'bg-blue-950/30',
    text: 'text-blue-200',
    label: 'text-blue-400',
    value: 'text-blue-300',
  },
  yellow: {
    border: 'border-yellow-500/30 hover:border-yellow-400',
    bg: 'bg-yellow-950/30',
    text: 'text-yellow-200',
    label: 'text-yellow-400',
    value: 'text-yellow-300',
  },
  aqua: {
    border: 'border-sky-500/30 hover:border-sky-400',
    bg: 'bg-sky-950/30',
    text: 'text-sky-200',
    label: 'text-sky-400',
    value: 'text-sky-300',
  },
  rose: {
    border: 'border-rose-500/40 hover:border-rose-400',
    bg: 'bg-rose-950/40',
    text: 'text-rose-200',
    label: 'text-rose-400',
    value: 'text-rose-300',
  },
};

export const ResourceIndicator: React.FC<ResourceIndicatorProps> = ({
  icon,
  label,
  value,
  capacity,
  changeRate,
  colorTheme,
  isWarning,
  isCritical,
  onClick,
  tooltip,
  statusLabel,
  className = '',
}) => {
  const theme = THEME_STYLES[colorTheme];

  const warningClasses = isCritical
    ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.4)]'
    : isWarning
    ? 'bg-amber-950/50 border-amber-500 text-amber-200 animate-pulse'
    : `${theme.bg} ${theme.border} ${theme.text}`;

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      title={tooltip}
      className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border font-mono text-xs transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${warningClasses} ${className}`}
    >
      <div className="shrink-0">{icon}</div>

      <div className="text-left leading-tight">
        <div className="flex items-center gap-1">
          <span className={`text-[10px] font-semibold ${theme.label}`}>{label}:</span>
          <strong className={`font-bold ${theme.value}`}>{value}</strong>
          {capacity !== undefined && (
            <span className="text-[9px] text-slate-400 font-normal">/{capacity}</span>
          )}
        </div>

        {(changeRate || statusLabel) && (
          <div className="text-[9px] text-slate-400 flex items-center gap-1">
            {changeRate && <span className="text-emerald-400">{changeRate}</span>}
            {statusLabel && <span className="text-slate-300">{statusLabel}</span>}
          </div>
        )}
      </div>
    </Component>
  );
};
