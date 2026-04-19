import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause, RotateCcw, Building2, Server, BookMarked, Landmark, User } from "lucide-react";

/**
 * Flux Y animé — parcours complet d'une facture B2B domestique.
 * Émetteur → PA émettrice → (annuaire PPF) → PA destinataire → Destinataire
 * avec branche fiscale vers le concentrateur PPF/DGFiP.
 */

type Step = {
  id: string;
  label: string;
  t: number; // position on path 0..1 (main flow)
  branch?: boolean; // true = fiscal branch
};

const STEPS: Step[] = [
  { id: "emit", label: "Émetteur génère la facture", t: 0 },
  { id: "pa1", label: "PA émettrice : contrôle conformité", t: 0.22 },
  { id: "annu", label: "Interrogation annuaire PPF (SIRET dest.)", t: 0.42, branch: true },
  { id: "route", label: "Routage interopérable PA → PA", t: 0.6 },
  { id: "pa2", label: "PA destinataire : mise à disposition", t: 0.8 },
  { id: "recv", label: "Destinataire ingère dans son ERP", t: 1 },
  { id: "fisc", label: "Données fiscales + statuts → DGFiP", t: 0.5, branch: true },
];

export default function FluxY() {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    const tick = (ts: number) => {
      if (!last.current) last.current = ts;
      const dt = ts - last.current;
      last.current = ts;
      setProgress((p) => {
        const next = p + dt / 6000;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [playing]);

  // Path geometry — SVG viewBox 800x380
  // Horizontal main path from emitter(80,120) → PA1(240,120) → PA2(560,120) → recv(720,120)
  // Fiscal branch dips down to PPF node at (400,280)
  const mainPath = "M 80 120 L 240 120 L 560 120 L 720 120";
  const branchPath = "M 240 120 Q 320 200 400 280 Q 480 200 560 120";

  // Particle position along the main path (piecewise linear)
  const particle = useMemo(() => {
    const p = progress;
    const segs = [
      { from: [80, 120], to: [240, 120], a: 0, b: 0.22 },
      { from: [240, 120], to: [560, 120], a: 0.22, b: 0.78 },
      { from: [560, 120], to: [720, 120], a: 0.78, b: 1 },
    ];
    const s = segs.find((x) => p >= x.a && p <= x.b) ?? segs[2];
    const k = (p - s.a) / (s.b - s.a);
    return {
      x: s.from[0] + (s.to[0] - s.from[0]) * k,
      y: s.from[1] + (s.to[1] - s.from[1]) * k,
    };
  }, [progress]);

  const activeStepIdx = useMemo(() => {
    const sorted = [...STEPS].sort((a, b) => a.t - b.t);
    let idx = 0;
    for (let i = 0; i < sorted.length; i++) if (progress >= sorted[i].t - 0.01) idx = i;
    return sorted[idx]?.id;
  }, [progress]);

  const reset = () => {
    setPlaying(false);
    setProgress(0);
  };

  const Node = ({ x, y, icon: Icon, label, sub, active }: { x: number; y: number; icon: any; label: string; sub?: string; active?: boolean }) => (
    <g aria-label={label}>
      <motion.circle
        cx={x}
        cy={y}
        r={26}
        fill={active ? "#0284C7" : "#0F172A"}
        animate={{ scale: active && !reduce ? [1, 1.12, 1] : 1 }}
        transition={{ duration: 1.2, repeat: active && !reduce ? Infinity : 0 }}
      />
      <foreignObject x={x - 14} y={y - 14} width={28} height={28}>
        <div className="flex items-center justify-center w-full h-full text-white">
          <Icon size={18} aria-hidden="true" />
        </div>
      </foreignObject>
      <text x={x} y={y + 48} textAnchor="middle" className="fill-slate-800 text-[11px] font-semibold">{label}</text>
      {sub && <text x={x} y={y + 62} textAnchor="middle" className="fill-slate-500 text-[10px]">{sub}</text>}
    </g>
  );

  return (
    <div className="my-8 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 not-prose">
      <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h4 className="m-0 text-base font-semibold text-slate-900">Flux Y — parcours d'une facture B2B</h4>
          <p className="m-0 text-xs text-slate-600">Lance l'animation ou utilise le curseur pour suivre chaque étape.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-700"
            aria-label={playing ? "Mettre en pause" : "Lancer l'animation"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "Pause" : "Lire"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            aria-label="Réinitialiser"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      <svg viewBox="0 0 800 380" className="w-full h-auto" role="img" aria-label="Schéma en Y du flux de facturation">
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#0284C7" />
          </marker>
        </defs>
        {/* Main path */}
        <path d={mainPath} stroke="#0284C7" strokeWidth="3" fill="none" strokeDasharray="0" markerEnd="url(#arr)" />
        {/* Progress overlay */}
        <motion.path
          d={mainPath}
          stroke="#0369A1"
          strokeWidth="5"
          fill="none"
          strokeDasharray="1000"
          style={{ strokeDashoffset: (1 - progress) * 1000 }}
        />
        {/* Fiscal branch */}
        <path d={branchPath} stroke="#0F172A" strokeWidth="2" strokeDasharray="5 5" fill="none" opacity={0.45} />

        {/* Nodes */}
        <Node x={80} y={120} icon={Building2} label="Émetteur" sub="ERP / facturier" active={activeStepIdx === "emit"} />
        <Node x={240} y={120} icon={Server} label="PA émettrice" sub="contrôle + routage" active={activeStepIdx === "pa1"} />
        <Node x={560} y={120} icon={Server} label="PA destinataire" sub="mise à disposition" active={activeStepIdx === "pa2" || activeStepIdx === "route"} />
        <Node x={720} y={120} icon={User} label="Destinataire" sub="ERP / GED" active={activeStepIdx === "recv"} />
        <Node x={400} y={280} icon={Landmark} label="PPF / DGFiP" sub="annuaire + fiscal" active={activeStepIdx === "annu" || activeStepIdx === "fisc"} />
        <foreignObject x={370} y={220} width={60} height={20}>
          <div className="flex items-center justify-center text-[10px] text-slate-500">
            <BookMarked size={12} className="mr-1" aria-hidden="true" />annuaire
          </div>
        </foreignObject>

        {/* Particle */}
        <motion.circle cx={particle.x} cy={particle.y} r={8} fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
      </svg>

      {/* Timeline */}
      <div className="mt-4">
        <label htmlFor="flux-y-scrub" className="sr-only">Timeline du flux</label>
        <input
          id="flux-y-scrub"
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => {
            setPlaying(false);
            setProgress(Number(e.target.value) / 1000);
          }}
          className="w-full accent-sky-600"
        />
      </div>

      {/* Step list */}
      <ol className="mt-4 grid gap-2 text-sm md:grid-cols-2">
        {STEPS.map((s) => {
          const active = s.id === activeStepIdx;
          return (
            <li
              key={s.id}
              className={`flex items-start gap-2 rounded-lg border px-3 py-2 transition-colors ${
                active ? "border-sky-500 bg-sky-50" : "border-slate-200 bg-white"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  active ? "bg-sky-600 text-white" : "bg-slate-200 text-slate-700"
                }`}
                aria-hidden="true"
              >
                {s.branch ? "Y" : "·"}
              </span>
              <span className="text-slate-800">{s.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
