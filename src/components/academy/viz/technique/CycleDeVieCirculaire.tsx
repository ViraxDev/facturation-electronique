import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useEffect } from "react";

type Statut = { code: string; label: string; phase: "emission" | "transmission" | "reception" | "paiement" };

const STATUTS: Statut[] = [
  { code: "200", label: "Déposée", phase: "emission" },
  { code: "201", label: "Rejetée dépôt", phase: "emission" },
  { code: "202", label: "Mise à disposition", phase: "transmission" },
  { code: "203", label: "Prise en charge", phase: "transmission" },
  { code: "204", label: "Rejetée PA", phase: "transmission" },
  { code: "205", label: "Refusée émetteur", phase: "transmission" },
  { code: "206", label: "Approuvée partiellement", phase: "reception" },
  { code: "207", label: "Approuvée", phase: "reception" },
  { code: "208", label: "Refusée", phase: "reception" },
  { code: "209", label: "Litige", phase: "reception" },
  { code: "210", label: "Suspendue", phase: "paiement" },
  { code: "211", label: "Paiement en cours", phase: "paiement" },
  { code: "212", label: "Paiement transmis", phase: "paiement" },
  { code: "213", label: "Encaissée", phase: "paiement" },
];

const PHASE_COLOR: Record<Statut["phase"], string> = {
  emission: "#0369A1",
  transmission: "#7C3AED",
  reception: "#D97706",
  paiement: "#16A34A",
};

export default function CycleDeVieCirculaire() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % STATUTS.length);
    }, 900);
    return () => clearTimeout(t);
  }, [playing, index]);

  const size = 320;
  const R = 128;
  const cx = size / 2;
  const cy = size / 2;
  const step = (2 * Math.PI) / STATUTS.length;
  const current = STATUTS[index];

  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-white p-4 shadow-sm"
      aria-label="Cycle de vie circulaire des 14 statuts de facture"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <figcaption className="text-sm font-semibold text-slate-700">
          14 statuts — cycle de vie normalisé
        </figcaption>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Lancer l'animation"}
            className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-violet-700"
          >
            {playing ? <Pause size={12} aria-hidden /> : <Play size={12} aria-hidden />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIndex(0);
            }}
            aria-label="Réinitialiser"
            className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          >
            <RotateCcw size={12} aria-hidden />
            Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <svg
          width={size}
          height={size}
          role="img"
          aria-label="Timeline circulaire des statuts"
          className="flex-shrink-0"
        >
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#E2E8F0" strokeWidth={2} />
          {STATUTS.map((s, i) => {
            const a = -Math.PI / 2 + i * step;
            const x = cx + R * Math.cos(a);
            const y = cy + R * Math.sin(a);
            const active = i === index;
            const passed = i < index;
            const color = PHASE_COLOR[s.phase];
            return (
              <g key={s.code}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={active ? 14 : 9}
                  fill={active || passed ? color : "#fff"}
                  stroke={color}
                  strokeWidth={2}
                  onClick={() => {
                    setPlaying(false);
                    setIndex(i);
                  }}
                  style={{ cursor: "pointer" }}
                  animate={reduce ? {} : { scale: active ? 1 : 1 }}
                />
                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill={active || passed ? "#fff" : color}
                  style={{ pointerEvents: "none" }}
                >
                  {s.code}
                </text>
              </g>
            );
          })}
          <g>
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              fontSize={11}
              fill="#64748B"
              fontWeight={600}
            >
              Statut {current.code}
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fontSize={13} fill="#0F172A" fontWeight={700}>
              {current.label}
            </text>
          </g>
        </svg>

        <ul className="grid gap-1 text-xs">
          {(["emission", "transmission", "reception", "paiement"] as const).map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: PHASE_COLOR[p] }}
                aria-hidden
              />
              <span className="capitalize text-slate-700">{p}</span>
              <span className="text-slate-400">
                ({STATUTS.filter((s) => s.phase === p).length})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
