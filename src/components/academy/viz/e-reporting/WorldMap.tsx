import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EMERALD = "#059669";
const ACCENT = "#0369A1";
const NAVY = "#0F172A";

type Mode = "B2B" | "B2C";

type Target = { id: string; label: string; cx: number; cy: number; zone: "UE" | "HORS_UE" };

const FRANCE = { cx: 305, cy: 115 };

const TARGETS: Target[] = [
  { id: "DE", label: "Allemagne", cx: 345, cy: 95, zone: "UE" },
  { id: "BE", label: "Belgique", cx: 310, cy: 90, zone: "UE" },
  { id: "ES", label: "Espagne", cx: 280, cy: 140, zone: "UE" },
  { id: "IT", label: "Italie", cx: 340, cy: 130, zone: "UE" },
  { id: "CH", label: "Suisse", cx: 325, cy: 115, zone: "HORS_UE" },
  { id: "UK", label: "Royaume-Uni", cx: 290, cy: 80, zone: "HORS_UE" },
  { id: "US", label: "États-Unis", cx: 130, cy: 125, zone: "HORS_UE" },
  { id: "JP", label: "Japon", cx: 545, cy: 125, zone: "HORS_UE" },
];

function FluxPath({ to, delay, color, reduce }: { to: Target; delay: number; color: string; reduce: boolean }) {
  const { cx, cy } = to;
  const mx = (FRANCE.cx + cx) / 2;
  const my = Math.min(FRANCE.cy, cy) - 30;
  const d = `M ${FRANCE.cx} ${FRANCE.cy} Q ${mx} ${my} ${cx} ${cy}`;
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 3" />
      {!reduce && (
        <motion.circle
          r="4"
          fill={color}
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ offsetPath: `path('${d}')` }}
        />
      )}
    </g>
  );
}

export default function WorldMap() {
  const reduce = useReducedMotion() ?? false;
  const [mode, setMode] = useState<Mode>("B2B");

  return (
    <figure
      className="my-6 rounded-xl border border-slate-200 bg-white p-5"
      aria-label="Carte simplifiée des flux internationaux relevant de l'e-reporting"
    >
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-700">
        <span>Flux internationaux depuis la France — tous relèvent de l'e-reporting</span>
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5" role="tablist" aria-label="Choix du mode">
          {(["B2B", "B2C"] as Mode[]).map(m => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                mode === m ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </figcaption>

      <svg viewBox="0 0 640 240" className="h-auto w-full" role="img" aria-label="Carte du monde simplifiée">
        {/* Ocean */}
        <rect x="0" y="0" width="640" height="240" fill="#F8FAFC" />

        {/* Very rough continents */}
        <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.5">
          {/* Americas */}
          <path d="M60,60 Q100,50 130,70 L150,120 Q160,160 140,200 L110,215 Q80,200 70,160 L55,110 Z" />
          {/* Europe + Africa */}
          <path d="M260,55 Q320,40 370,55 L380,95 Q390,130 370,170 L350,210 Q310,215 280,190 L255,140 Q245,90 260,55 Z" />
          {/* Asia */}
          <path d="M400,45 Q480,35 560,60 L580,110 Q565,150 520,170 L460,170 Q410,150 395,100 Z" />
          {/* Oceania */}
          <path d="M515,180 Q555,175 575,195 L565,215 Q530,220 510,205 Z" />
        </g>

        {/* EU highlight */}
        <ellipse cx="320" cy="110" rx="55" ry="42" fill={EMERALD} fillOpacity="0.08" stroke={EMERALD} strokeOpacity="0.4" strokeDasharray="4 3" />
        <text x="320" y="65" textAnchor="middle" fontSize="10" fontWeight="700" fill={EMERALD}>UE</text>

        {/* France marker */}
        <circle cx={FRANCE.cx} cy={FRANCE.cy} r="6" fill={NAVY} />
        <text x={FRANCE.cx} y={FRANCE.cy - 10} textAnchor="middle" fontSize="10" fontWeight="700" fill={NAVY}>France</text>

        {/* Targets and flux */}
        {TARGETS.map((t, i) => {
          const color = t.zone === "UE" ? EMERALD : ACCENT;
          return (
            <g key={t.id}>
              <FluxPath to={t} delay={i * 0.35} color={color} reduce={reduce} />
              <circle cx={t.cx} cy={t.cy} r="4" fill={color} />
              <text x={t.cx} y={t.cy + 14} textAnchor="middle" fontSize="9" fill="#334155">{t.label}</text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-emerald-50 p-3 text-xs text-slate-700">
          <div className="mb-1 flex items-center gap-2 font-semibold text-emerald-800">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: EMERALD }} />
            {mode === "B2B" ? "B2B intra-UE" : "B2C intra-UE"}
          </div>
          {mode === "B2B"
            ? "Livraison intracommunautaire (LIC) exonérée, art. 262 ter CGI. E-reporting + EMEBI/DES."
            : "Ventes à distance : TVA française ou OSS selon seuil 10 000 € UE. E-reporting obligatoire."}
        </div>
        <div className="rounded-lg bg-sky-50 p-3 text-xs text-slate-700">
          <div className="mb-1 flex items-center gap-2 font-semibold text-sky-800">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: ACCENT }} />
            {mode === "B2B" ? "B2B hors UE" : "B2C hors UE"}
          </div>
          {mode === "B2B"
            ? "Exportation exonérée (art. 262 I CGI). E-reporting détaillé transaction par transaction."
            : "Exportation B2C : souvent exonérée, e-reporting requis selon règles TVA applicables."}
        </div>
      </div>
    </figure>
  );
}
