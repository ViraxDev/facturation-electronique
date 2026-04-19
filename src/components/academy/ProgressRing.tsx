export default function ProgressRing({ value, size = 96, stroke = 8, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value));
  const offset = circ * (1 - pct);
  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={`${Math.round(pct * 100)}% complété`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--color-muted)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--color-accent)" strokeWidth={stroke} fill="none" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-[stroke-dashoffset] duration-500 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular">{Math.round(pct * 100)}%</span>
        {label && <span className="text-[10px] uppercase tracking-wide text-[var(--color-muted-foreground)]">{label}</span>}
      </div>
    </div>
  );
}
