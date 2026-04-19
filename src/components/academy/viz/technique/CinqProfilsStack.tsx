import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Layers } from "lucide-react";

type Profil = {
  id: string;
  name: string;
  level: number;
  tagline: string;
  color: string;
  fields: string[];
  usage: string;
};

const PROFILS: Profil[] = [
  {
    id: "minimum",
    name: "MINIMUM",
    level: 1,
    tagline: "Rapprochement comptable",
    color: "#94A3B8",
    fields: ["BT-1 Numéro", "BT-2 Date", "BT-112 Total TTC", "BT-31 TVA vendeur"],
    usage: "Paiement et comptabilisation fournisseur, sans détail ligne.",
  },
  {
    id: "basicwl",
    name: "BASIC WL",
    level: 2,
    tagline: "Sans lignes (Without Lines)",
    color: "#38BDF8",
    fields: ["Totaux", "Taxes", "Parties (vendeur/acheteur)", "Pas de lignes"],
    usage: "Archivage, contrôle TVA, pré-remplissage DGFiP.",
  },
  {
    id: "basic",
    name: "BASIC",
    level: 3,
    tagline: "Lignes de base",
    color: "#0369A1",
    fields: ["BG-25 Lignes", "Quantités", "Prix net", "Désignations courtes"],
    usage: "Suffisant pour beaucoup de PME et factures simples.",
  },
  {
    id: "en16931",
    name: "EN 16931",
    level: 4,
    tagline: "Profil cœur européen",
    color: "#7C3AED",
    fields: ["Tous BG/BT EN 16931", "Conforme Directive 2014/55/UE", "Interop PEPPOL"],
    usage: "Profil de référence pour la commande publique et le B2B européen.",
  },
  {
    id: "extended",
    name: "EXTENDED",
    level: 5,
    tagline: "Extensions FR + sectoriel",
    color: "#0F172A",
    fields: ["EN 16931 +", "Extensions FR (BT-FR-*)", "Données sectorielles"],
    usage: "Cas complexes : multi-échéances, FA-CI, acomptes, secteurs régulés.",
  },
];

export default function CinqProfilsStack() {
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const current = PROFILS.find((p) => p.id === active) ?? null;

  return (
    <figure
      className="my-6 rounded-xl border border-violet-200 bg-white p-4 shadow-sm"
      aria-label="Les 5 profils Factur-X — cliquer pour détailler"
    >
      <figcaption className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Layers size={16} className="text-violet-600" aria-hidden />
        Les 5 profils Factur-X — du plus léger au plus complet
      </figcaption>

      <div className="relative mx-auto h-[240px] w-full max-w-lg">
        {PROFILS.map((p, i) => {
          const isActive = active === p.id;
          const offset = i * 28;
          return (
            <motion.button
              key={p.id}
              layoutId={`profil-card-${p.id}`}
              type="button"
              onClick={() => setActive(p.id)}
              aria-label={`Profil ${p.name} : ${p.tagline}`}
              className="absolute inset-x-0 mx-auto flex h-14 w-[88%] items-center justify-between rounded-lg border px-4 text-left shadow-md hover:w-[92%]"
              style={{
                top: offset,
                background: `linear-gradient(90deg, ${p.color}22, #ffffff)`,
                borderColor: p.color,
                zIndex: isActive ? -1 : PROFILS.length - i,
              }}
              transition={reduce ? { duration: 0 } : { duration: 0.3 }}
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: p.color }}
                >
                  {p.level}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{p.name}</span>
                  <span className="block text-[11px] text-slate-500">{p.tagline}</span>
                </span>
              </span>
              <span className="text-[11px] font-medium" style={{ color: p.color }}>
                Détails →
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Profil ${current.name}`}
          >
            <motion.div
              layoutId={`profil-card-${current.id}`}
              className="w-full max-w-lg rounded-xl border bg-white p-5 shadow-2xl"
              style={{ borderColor: current.color }}
              onClick={(e) => e.stopPropagation()}
              transition={reduce ? { duration: 0 } : { duration: 0.35 }}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: current.color }}
                  >
                    {current.level}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{current.name}</h3>
                    <p className="text-xs text-slate-500">{current.tagline}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label="Fermer"
                  className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>
              <p className="mb-3 text-sm text-slate-700">{current.usage}</p>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Champs inclus
                </p>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {current.fields.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-700">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: current.color }}
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}
