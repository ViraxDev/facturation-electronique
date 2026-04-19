import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, Puzzle, Landmark, Check, X } from "lucide-react";

type Mode = {
  id: "pa" | "odpa" | "ppf";
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  pros: string[];
  cons: string[];
  target: string;
  flow: string;
};

const MODES: Mode[] = [
  {
    id: "pa",
    title: "PA directe",
    subtitle: "Contrat direct avec une PA immatriculée",
    icon: Zap,
    color: "#0369A1",
    pros: [
      "Maîtrise directe, SLA négocié",
      "Pas d'intermédiaire",
      "Tarification dégressive au volume",
    ],
    cons: [
      "Coût d'intégration à la charge de l'entreprise",
      "Nécessite une équipe SI",
    ],
    target: "Grandes entreprises, ETI (> 10 000 factures/an)",
    flow: "ERP → API PA → annuaire PPF → PA dest.",
  },
  {
    id: "odpa",
    title: "OD + PA",
    subtitle: "Via son logiciel habituel adossé à une PA",
    icon: Puzzle,
    color: "#0284C7",
    pros: [
      "Mise en œuvre simple (option activée)",
      "Intégration native, pas de double saisie",
      "Coût inclus ou léger supplément",
    ],
    cons: [
      "Dépendance à l'éditeur",
      "Moins de flexibilité sur la PA",
    ],
    target: "TPE, PME, micro-entreprises",
    flow: "ERP/SaaS → OD → PA partenaire → PPF",
  },
  {
    id: "ppf",
    title: "PPF réduit",
    subtitle: "Raccordement minimal via annuaire",
    icon: Landmark,
    color: "#64748b",
    pros: [
      "Théoriquement gratuit",
      "Réception minimale assurée",
    ],
    cons: [
      "Aucune émission possible",
      "Pas d'archivage légal",
      "Pas d'ingestion ERP",
    ],
    target: "Exception — structures inactives",
    flow: "Réception simple via annuaire PPF",
  },
];

export default function TroisModes() {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  return (
    <div className="my-8 rounded-2xl border border-sky-200 bg-white p-5 not-prose">
      <h4 className="m-0 mb-1 text-base font-semibold text-slate-900">Les 3 modes de raccordement</h4>
      <p className="m-0 mb-4 text-xs text-slate-600">
        Clique une carte pour basculer entre avantages et inconvénients.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isFlipped = !!flipped[m.id];
          return (
            <div key={m.id} className="relative h-[340px]" style={{ perspective: 1000 }}>
              <motion.button
                type="button"
                onClick={() => toggle(m.id)}
                aria-pressed={isFlipped}
                aria-label={`${m.title} — afficher ${isFlipped ? "avantages" : "inconvénients"}`}
                className="relative h-full w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl"
                animate={{ rotateY: isFlipped && !reduce ? 180 : 0 }}
                transition={{ duration: reduce ? 0 : 0.5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front: pros */}
                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border-2 p-4"
                  style={{
                    backfaceVisibility: "hidden",
                    borderColor: m.color,
                    background: `linear-gradient(180deg, ${m.color}12 0%, #ffffff 60%)`,
                  }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                      style={{ background: m.color }}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-600">{m.subtitle}</div>
                    </div>
                  </div>
                  <div className="mb-2 rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
                    {m.flow}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700">Avantages</div>
                  <ul className="m-0 mt-1 space-y-1 text-sm text-slate-700">
                    {m.pros.map((p) => (
                      <li key={p} className="flex items-start gap-1.5">
                        <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto text-[11px] text-slate-500">Cible : {m.target}</div>
                </div>

                {/* Back: cons */}
                <div
                  className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border-2 p-4"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    borderColor: m.color,
                    background: `linear-gradient(180deg, #ffffff 40%, ${m.color}12 100%)`,
                  }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                      style={{ background: m.color }}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-600">Points de vigilance</div>
                    </div>
                  </div>
                  <div className="text-[11px] font-semibold text-rose-700">Inconvénients</div>
                  <ul className="m-0 mt-1 space-y-1 text-sm text-slate-700">
                    {m.cons.map((c) => (
                      <li key={c} className="flex items-start gap-1.5">
                        <X size={14} className="mt-0.5 shrink-0 text-rose-600" aria-hidden="true" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto text-[11px] text-slate-500">Cible : {m.target}</div>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
