import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EMERALD = "#059669";

type Regime = "RN_MENSUEL" | "RN_TRIM" | "RSI" | "FRANCHISE";

const REGIMES: { id: Regime; label: string; desc: string; ticks: number[] }[] = [
  // ticks are day-of-year indices in a 12-month calendar (we use 12 * 4 = 48 cells)
  { id: "RN_MENSUEL", label: "RN mensuel", desc: "Transmission consolidée mensuelle — en pratique, flux au fil de l'eau (hebdo).", ticks: Array.from({ length: 48 }, (_, i) => i).filter(i => i % 1 === 0) },
  { id: "RN_TRIM", label: "RN trimestriel", desc: "Consolidation trimestrielle, alignée sur la CA3 trimestrielle.", ticks: [3, 15, 27, 39] },
  { id: "RSI", label: "RSI", desc: "Acomptes semestriels (juillet, décembre) + CA12 annuelle.", ticks: [25, 47] },
  { id: "FRANCHISE", label: "Franchise TVA", desc: "Transmission annuelle simplifiée (précisions en cours).", ticks: [47] },
];

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function FrequencyCalendar() {
  const reduce = useReducedMotion();
  const [regime, setRegime] = useState<Regime>("RN_MENSUEL");
  const active = REGIMES.find(r => r.id === regime)!;

  // For RN_MENSUEL highlight end-of-month (cells 3, 7, 11...)
  const ticks = new Set(
    regime === "RN_MENSUEL"
      ? Array.from({ length: 12 }, (_, m) => m * 4 + 3)
      : active.ticks
  );
  // Continuous flux ticks (lighter) for RN mensuel to show au-fil-de-l'eau
  const flux = regime === "RN_MENSUEL" ? Array.from({ length: 48 }, (_, i) => i) : [];

  return (
    <figure
      className="my-6 rounded-xl border border-slate-200 bg-white p-5"
      aria-label="Calendrier des fréquences d'e-reporting par régime TVA"
    >
      <figcaption className="mb-3 text-sm font-semibold text-slate-700">
        Fréquences d'e-reporting sur 12 mois, selon le régime TVA
      </figcaption>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Régime TVA">
        {REGIMES.map(r => (
          <button
            key={r.id}
            role="tab"
            aria-selected={regime === r.id}
            onClick={() => setRegime(r.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              regime === r.id
                ? "bg-emerald-600 text-white"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-12 gap-1 pb-1">
            {MONTHS.map((m, i) => (
              <div key={i} className="text-center text-[10px] font-semibold text-slate-500">{m}</div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }, (_, monthIdx) => (
              <div key={monthIdx} className="flex flex-col gap-1">
                {Array.from({ length: 4 }, (_, weekIdx) => {
                  const cell = monthIdx * 4 + weekIdx;
                  const isTick = ticks.has(cell);
                  const isFlux = flux.includes(cell) && !isTick;
                  return (
                    <motion.div
                      key={cell}
                      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: isTick ? 1 : isFlux ? 0.45 : 0.15,
                        scale: isTick ? 1 : 0.9,
                      }}
                      transition={{ delay: reduce ? 0 : cell * 0.015 }}
                      className="h-5 rounded-sm"
                      style={{
                        background: isTick ? EMERALD : isFlux ? "#A7F3D0" : "#E2E8F0",
                      }}
                      aria-label={isTick ? `Transmission semaine ${weekIdx + 1} de ${MONTHS[monthIdx]}` : undefined}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: EMERALD }} /> Échéance obligatoire
        </span>
        {regime === "RN_MENSUEL" && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-emerald-200" /> Transmission au fil de l'eau
          </span>
        )}
      </div>

      <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
        <strong>{active.label}</strong> — {active.desc}
      </p>
    </figure>
  );
}
