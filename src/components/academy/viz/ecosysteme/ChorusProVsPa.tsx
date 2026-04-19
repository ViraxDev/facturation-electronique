import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Building2, Landmark, Briefcase, Server } from "lucide-react";

type Lane = "b2g" | "b2b";

const FLOWS: Record<Lane, { title: string; color: string; stops: { icon: any; label: string; sub: string }[] }> = {
  b2g: {
    title: "B2G — vers le secteur public",
    color: "#7c3aed",
    stops: [
      { icon: Building2, label: "Fournisseur", sub: "entreprise" },
      { icon: Server, label: "PA (connecteur)", sub: "ou saisie directe" },
      { icon: Landmark, label: "Chorus Pro", sub: "portail unique B2G" },
      { icon: Briefcase, label: "Entité publique", sub: "État, collectivité, hôpital" },
    ],
  },
  b2b: {
    title: "B2B — entre assujettis privés",
    color: "#0284C7",
    stops: [
      { icon: Building2, label: "Émetteur", sub: "entreprise" },
      { icon: Server, label: "PA émettrice", sub: "contrôle + routage" },
      { icon: Landmark, label: "Annuaire PPF", sub: "identification" },
      { icon: Server, label: "PA destinataire", sub: "mise à disposition" },
      { icon: Building2, label: "Destinataire", sub: "entreprise cliente" },
    ],
  },
};

export default function ChorusProVsPa() {
  const reduce = useReducedMotion();
  const [lane, setLane] = useState<Lane>("b2g");
  const flow = FLOWS[lane];

  return (
    <div className="my-8 rounded-2xl border border-sky-200 bg-white p-5 not-prose">
      <h4 className="m-0 mb-1 text-base font-semibold text-slate-900">Chorus Pro (B2G) vs PA (B2B)</h4>
      <p className="m-0 mb-4 text-xs text-slate-600">
        Deux rails parallèles qui coexistent : choisis le flux à visualiser.
      </p>

      <div role="tablist" aria-label="Type de flux" className="mb-4 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
        {(["b2g", "b2b"] as Lane[]).map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={lane === id}
            type="button"
            onClick={() => setLane(id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              lane === id ? "bg-white text-slate-900 shadow" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {id === "b2g" ? "B2G" : "B2B"}
          </button>
        ))}
      </div>

      <motion.div
        key={lane}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.25 }}
      >
        <div className="mb-3 text-sm font-semibold" style={{ color: flow.color }}>
          {flow.title}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {flow.stops.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduce ? 0 : i * 0.08, duration: 0.25 }}
                  className="flex min-w-[120px] flex-col items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                    style={{ background: flow.color }}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div className="mt-1.5 text-center text-[12px] font-semibold text-slate-900">{s.label}</div>
                  <div className="text-center text-[10px] text-slate-500">{s.sub}</div>
                </motion.div>
                {i < flow.stops.length - 1 && (
                  <span aria-hidden="true" className="text-slate-400">
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm">
          <div className="mb-1 font-semibold text-violet-900">Chorus Pro · B2G</div>
          <ul className="m-0 list-disc space-y-0.5 pl-5 text-slate-700">
            <li>Portail unique, gratuit pour les fournisseurs</li>
            <li>Référentiel Structures Publiques distinct</li>
            <li>Factur-X, UBL, CII acceptés</li>
          </ul>
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm">
          <div className="mb-1 font-semibold text-sky-900">PA + PPF · B2B</div>
          <ul className="m-0 list-disc space-y-0.5 pl-5 text-slate-700">
            <li>Marché concurrentiel de PA immatriculées</li>
            <li>Annuaire PPF pour le routage</li>
            <li>Concentrateur fiscal pour la DGFiP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
