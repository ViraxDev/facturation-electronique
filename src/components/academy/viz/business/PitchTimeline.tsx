import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, RotateCcw, Target, Search, Package, Presentation, Coins, CheckCircle2 } from "lucide-react";

type Step = {
  start: number;
  end: number;
  label: string;
  detail: string;
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  { start: 0, end: 2, label: "Accroche", detail: "Nommer le risque client dès la 1re minute", icon: <Target className="h-4 w-4" aria-hidden="true" /> },
  { start: 2, end: 5, label: "Diagnostic", detail: "Poser le problème : amendes, perte clients, RC pro", icon: <Search className="h-4 w-4" aria-hidden="true" /> },
  { start: 5, end: 8, label: "Offre", detail: "3 blocs : audit, déploiement, suivi 3 mois", icon: <Package className="h-4 w-4" aria-hidden="true" /> },
  { start: 8, end: 12, label: "Démo", detail: "Un workflow critique, 3 à 5 minutes max", icon: <Presentation className="h-4 w-4" aria-hidden="true" /> },
  { start: 12, end: 14, label: "Pricing & ROI", detail: "Chiffres transparents, calcul portefeuille", icon: <Coins className="h-4 w-4" aria-hidden="true" /> },
  { start: 14, end: 15, label: "Closing", detail: "CTA audit cabinet 500-1 500 €", icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> },
];

const TOTAL = 15;

function fmt(m: number) {
  const whole = Math.floor(m);
  const secs = Math.round((m - whole) * 60);
  return `${String(whole).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function PitchTimeline() {
  const reduce = useReducedMotion();
  const [minute, setMinute] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    if (reduce) {
      setMinute(TOTAL);
      setPlaying(false);
      return;
    }
    last.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - last.current) / 1000;
      last.current = now;
      setMinute((m) => {
        const next = m + dt * 1.2; // 1.2 "minute" par seconde réelle
        if (next >= TOTAL) {
          setPlaying(false);
          return TOTAL;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, reduce]);

  const activeIdx = STEPS.findIndex((s) => minute >= s.start && minute < s.end);
  const current = activeIdx >= 0 ? activeIdx : STEPS.length - 1;
  const progress = (minute / TOTAL) * 100;

  return (
    <div
      className="not-prose my-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
      aria-label="Timeline du pitch 15 minutes"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#0369A1]">
            Pitch 15 minutes
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Déroulé chronométré. Scrubbez la barre ou lancez le minuteur.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-50 px-2.5 py-1 text-sm font-semibold text-amber-700 tabular-nums">
            {fmt(minute)} / {fmt(TOTAL)}
          </span>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium text-[#0F172A] hover:bg-amber-50"
            aria-label={playing ? "Mettre en pause le minuteur" : "Démarrer le minuteur"}
          >
            {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
            {playing ? "Pause" : "Démarrer"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setMinute(0);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium text-[#0F172A] hover:bg-amber-50"
            aria-label="Réinitialiser"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="pitch-scrub" className="sr-only">
          Progression du pitch en minutes
        </label>
        <input
          id="pitch-scrub"
          type="range"
          min={0}
          max={TOTAL}
          step={0.1}
          value={minute}
          onChange={(e) => {
            setPlaying(false);
            setMinute(parseFloat(e.target.value));
          }}
          className="w-full accent-amber-500"
        />
        <div className="relative mt-2 h-2 overflow-hidden rounded-full bg-amber-100">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", duration: reduce ? 0 : 0.15, ease: "linear" }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-medium tabular-nums text-[var(--color-muted-foreground)]">
          {STEPS.map((s) => (
            <span key={s.label}>{s.start}'</span>
          ))}
          <span>15'</span>
        </div>
      </div>

      <ol className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((s, i) => {
          const isActive = i === current;
          const isPast = minute >= s.end;
          return (
            <motion.li
              key={s.label}
              animate={{
                backgroundColor: isActive ? "rgb(254 243 199)" : "rgb(255 255 255)",
                borderColor: isActive ? "rgb(245 158 11)" : isPast ? "rgb(252 211 77)" : "var(--color-border)",
              }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              className="rounded-lg border p-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${
                    isActive
                      ? "bg-amber-500 text-white"
                      : isPast
                      ? "bg-amber-200 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-[#0369A1]">{s.icon}</span>
                <span className="text-sm font-semibold text-[#0F172A]">{s.label}</span>
                <span className="ml-auto text-[10px] font-medium tabular-nums text-[var(--color-muted-foreground)]">
                  {s.start}-{s.end}'
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">{s.detail}</p>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
