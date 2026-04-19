import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Inbox, ShieldCheck, Send, ArchiveRestore, Network } from "lucide-react";

type Station = {
  id: string;
  icon: any;
  title: string;
  bullets: string[];
};

const STATIONS: Station[] = [
  {
    id: "reception",
    icon: Inbox,
    title: "Réception",
    bullets: [
      "Ingestion Factur-X / UBL / CII",
      "Accusé de dépôt horodaté",
      "Notification à l'émetteur",
    ],
  },
  {
    id: "controle",
    icon: ShieldCheck,
    title: "Contrôle",
    bullets: [
      "Mentions obligatoires (art. 242 nonies A)",
      "Cohérence TVA et totaux",
      "Validité SIREN / TVA intracom",
    ],
  },
  {
    id: "interop",
    icon: Network,
    title: "Interopérabilité",
    bullets: [
      "Requête annuaire PPF (SIRET dest.)",
      "Conversion de format si besoin",
      "Transmission AS4 / API vers PA dest.",
    ],
  },
  {
    id: "fiscal",
    icon: Send,
    title: "Transmission fiscale",
    bullets: [
      "Extraction des données e-invoicing",
      "Statuts cycle de vie (dont encaissement)",
      "Dépôt au concentrateur PPF/DGFiP",
    ],
  },
  {
    id: "archive",
    icon: ArchiveRestore,
    title: "Archivage légal",
    bullets: [
      "Conservation 10 ans",
      "Intégrité, lisibilité, accessibilité",
      "Restitution en cas de contrôle",
    ],
  },
];

export default function PaStations() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(STATIONS[0].id);
  const current = STATIONS.find((s) => s.id === active) ?? STATIONS[0];

  return (
    <div className="my-8 rounded-2xl border border-sky-200 bg-white p-5 not-prose">
      <h4 className="m-0 mb-1 text-base font-semibold text-slate-900">Les stations d'une PA</h4>
      <p className="m-0 mb-4 text-xs text-slate-600">Clique sur chaque station pour en détailler les obligations.</p>

      <div className="relative">
        <div className="absolute left-0 right-0 top-6 mx-8 h-0.5 bg-sky-200" aria-hidden="true" />
        <div className="relative grid grid-cols-5 gap-2">
          {STATIONS.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className="flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
                aria-pressed={isActive}
                aria-label={`Station ${s.title}`}
              >
                <motion.span
                  animate={{ scale: isActive && !reduce ? 1.1 : 1 }}
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                    isActive
                      ? "border-sky-600 bg-sky-600 text-white"
                      : "border-sky-300 bg-white text-sky-700"
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                </motion.span>
                <span
                  className={`text-center text-[11px] font-medium ${
                    isActive ? "text-sky-800" : "text-slate-600"
                  }`}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <div className="mb-2 text-sm font-semibold text-slate-900">{current.title}</div>
          <ul className="m-0 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {current.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
