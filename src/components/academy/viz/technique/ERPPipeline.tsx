import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Database, FileCog, ShieldCheck, Send, Inbox, Play, RotateCcw } from "lucide-react";

type Stage = {
  id: string;
  title: string;
  detail: string;
  icon: typeof Database;
};

const STAGES: Stage[] = [
  {
    id: "erp",
    title: "ERP",
    detail: "Extraction des écritures & lignes de facture",
    icon: Database,
  },
  {
    id: "map",
    title: "Mapping",
    detail: "ERP → modèle EN 16931 (BG/BT)",
    icon: FileCog,
  },
  {
    id: "gen",
    title: "Génération",
    detail: "Factur-X / UBL / CII + signature XMP",
    icon: FileCog,
  },
  {
    id: "valid",
    title: "Validation",
    detail: "Schematron EN 16931 + BR-FR",
    icon: ShieldCheck,
  },
  {
    id: "pa",
    title: "PA",
    detail: "Dépôt via API, retour statut 200/201",
    icon: Send,
  },
  {
    id: "dest",
    title: "Destinataire",
    detail: "Réception + cycle 200→213",
    icon: Inbox,
  },
];

export default function ERPPipeline() {
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (active >= STAGES.length - 1) {
        setPlaying(false);
      } else {
        setActive((a) => a + 1);
      }
    }, 700);
    return () => clearTimeout(t);
  }, [playing, active]);

  const run = () => {
    setActive(-1);
    setPlaying(true);
    setTimeout(() => setActive(0), 80);
  };

  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-white p-4 shadow-sm"
      aria-label="Pipeline d'intégration ERP vers Plateforme Agréée"
    >
      <div className="mb-3 flex items-center justify-between">
        <figcaption className="text-sm font-semibold text-slate-700">
          Pipeline ERP → PA — chaque étape s'allume
        </figcaption>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={run}
            aria-label="Lancer le pipeline"
            className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-violet-700"
          >
            <Play size={12} aria-hidden /> Lancer
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setActive(-1);
            }}
            aria-label="Réinitialiser"
            className="inline-flex items-center gap-1 rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300"
          >
            <RotateCcw size={12} aria-hidden /> Reset
          </button>
        </div>
      </div>

      <ol className="grid gap-3 md:grid-cols-6">
        {STAGES.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === active;
          const isDone = i < active;
          const lit = isActive || isDone;
          return (
            <li key={s.id} className="relative">
              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setActive(i);
                }}
                aria-label={`${s.title}: ${s.detail}`}
                aria-current={isActive ? "step" : undefined}
                className="flex w-full flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors"
                style={{
                  borderColor: lit ? "#7C3AED" : "#E2E8F0",
                  background: lit ? "#F5F3FF" : "#fff",
                }}
              >
                <motion.span
                  animate={
                    reduce
                      ? {}
                      : {
                          scale: isActive ? 1.08 : 1,
                          boxShadow: lit
                            ? "0 0 0 6px rgba(124,58,237,0.18)"
                            : "0 0 0 0 rgba(0,0,0,0)",
                        }
                  }
                  transition={reduce ? { duration: 0 } : { duration: 0.3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: lit ? "#7C3AED" : "#E2E8F0", color: lit ? "#fff" : "#64748B" }}
                >
                  <Icon size={18} aria-hidden />
                </motion.span>
                <span className="text-xs font-semibold text-slate-800">{s.title}</span>
                <span className="text-[10px] leading-tight text-slate-500">{s.detail}</span>
              </button>
              {i < STAGES.length - 1 && (
                <span
                  className="absolute right-[-8px] top-8 hidden h-[2px] w-4 md:block"
                  style={{ background: isDone ? "#7C3AED" : "#CBD5E1" }}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full bg-violet-600"
          initial={false}
          animate={{
            width: `${active < 0 ? 0 : ((active + 1) / STAGES.length) * 100}%`,
          }}
          transition={reduce ? { duration: 0 } : { duration: 0.4 }}
        />
      </div>
    </figure>
  );
}
